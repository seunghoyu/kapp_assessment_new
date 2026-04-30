from __future__ import annotations

import argparse
import base64
import json
import os
import time
from pathlib import Path
import sys

from dotenv import load_dotenv
from openai import OpenAI

from utils.logger import Logger
from utils.slugify import slug_for_category
from utils.translator import create_translator


PROMPT_TEMPLATE = """soft 3D icon, minimal design,
suitable for white UI background,
blue to purple neon gradient,
single centered object,
no text,
transparent background,
consistent lighting and angle,
uniform scale and padding,
representing: {JOB}
"""


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    here = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(description="Generate category icons via OpenAI image API.")
    parser.add_argument(
        "--input",
        default=str(here / "major_category_labels.unique.json"),
        help="Input JSON file path (string array).",
    )
    parser.add_argument(
        "--output",
        default=str(here / "output"),
        help="Output directory for PNG icons.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Generate only first N items (0 = all).",
    )
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip generation if the output PNG already exists.",
    )
    parser.add_argument(
        "--use-korean-job",
        action="store_true",
        help="Use Korean label as {JOB} in the prompt (skip translation).",
    )
    return parser.parse_args(argv)


def ensure_openai_api_key_loaded() -> str:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key:
        raise RuntimeError("OPENAI_API_KEY is not set. Create a .env with OPENAI_API_KEY=... and retry.")
    return key


def read_labels(path: Path) -> list[str]:
    raw = path.read_text(encoding="utf-8")
    data = json.loads(raw)
    if not isinstance(data, list) or not all(isinstance(x, str) for x in data):
        raise ValueError("Input JSON must be an array of strings.")
    return [x.strip() for x in data if x.strip()]


def generate_png_b64(
    client: OpenAI,
    prompt: str,
    *,
    max_retries: int = 2,
) -> str:
    last_err: Exception | None = None
    for attempt in range(max_retries + 1):
        try:
            img = client.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                size="1024x1024",
                background="transparent",
            )
            # image.data[0].b64_json
            b64 = img.data[0].b64_json
            if not b64:
                raise RuntimeError("Empty image base64 output from API")
            return b64
        except Exception as e:
            last_err = e
            if attempt >= max_retries:
                break
            time.sleep(1.0 * (2**attempt))
    assert last_err is not None
    raise last_err


def main(argv: list[str] | None = None) -> int:
    logger = Logger()

    # Ensure readable logs on Windows consoles
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

    here = Path(__file__).resolve().parent
    load_dotenv(here / ".env")
    load_dotenv()  # repo root .env fallback if present

    try:
        ensure_openai_api_key_loaded()
    except Exception as e:
        logger.exception("환경 변수 로딩 실패", e)
        return 2

    args = parse_args(argv)
    input_path = Path(args.input).expanduser().resolve()
    output_dir = Path(args.output).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        labels_ko = read_labels(input_path)
    except Exception as e:
        logger.exception(f"입력 파일 읽기 실패: {input_path}", e)
        return 2

    if args.limit and args.limit > 0:
        labels_ko = labels_ko[: args.limit]

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    translator = create_translator(client)

    logger.info(f"총 {len(labels_ko)}개 카테고리 처리 시작")

    ok = 0
    fail = 0

    for idx, label_ko in enumerate(labels_ko, start=1):
        logger.info(f"[{idx}/{len(labels_ko)}] 처리중: {label_ko}")

        label_en: str | None = None
        job_for_prompt: str = label_ko

        if not args.use_korean_job:
            try:
                label_en = translator.ko_to_en(label_ko, max_retries=2, timeout_s=30)
                job_for_prompt = label_en
            except Exception as e:
                # Fallback: proceed with Korean prompt to avoid blocking icon generation.
                logger.warning(f"번역 실패 → 한글로 진행: {label_ko} ({type(e).__name__}: {e})")

        filename = slug_for_category(label_ko=label_ko, label_en=label_en, index=idx) + ".png"
        out_path = output_dir / filename

        if args.skip_existing and out_path.exists():
            logger.success(f"스킵(이미 존재): {out_path}")
            ok += 1
            continue

        prompt = PROMPT_TEMPLATE.format(JOB=job_for_prompt)

        try:
            b64 = generate_png_b64(client, prompt, max_retries=2)
            png_bytes = base64.b64decode(b64)
            out_path.write_bytes(png_bytes)
            ok += 1
            if label_en:
                logger.success(f"생성 완료: {label_ko} → {label_en} → {out_path}")
            else:
                logger.success(f"생성 완료(한글 프롬프트): {label_ko} → {out_path}")
        except Exception as e:
            fail += 1
            if label_en:
                logger.exception(f"이미지 생성 실패: {label_ko} → {label_en}", e)
            else:
                logger.exception(f"이미지 생성 실패(한글 프롬프트): {label_ko}", e)

    logger.info(f"완료: 성공 {ok} / 실패 {fail} (output: {output_dir})")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())

