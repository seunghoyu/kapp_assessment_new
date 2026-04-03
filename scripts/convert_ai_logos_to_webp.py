"""
public/kapp/ai-tools-logos 내 png, jpg, jpeg, svg → 동일 베이스명 .webp 변환.

실행: python scripts/convert_ai_logos_to_webp.py

의존성:
  pip install Pillow pymupdf

- 래스터: Pillow
- SVG: PyMuPDF(fitz) — Windows에서도 Cairo 설치 없이 SVG → 래스터 가능
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public" / "kapp" / "ai-tools-logos"
EXT_RASTER = {".png", ".jpg", ".jpeg"}
EXT_SVG = {".svg"}
WEBP_QUALITY = 90
SVG_DPI = 144


def raster_to_webp(src: Path, dst: Path) -> None:
    from PIL import Image

    img = Image.open(src)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")
    img.save(dst, "WEBP", quality=WEBP_QUALITY, method=6)


def svg_to_webp(src: Path, dst: Path) -> None:
    import fitz
    from PIL import Image

    doc = fitz.open(str(src))
    try:
        page = doc[0]
        pix = page.get_pixmap(dpi=SVG_DPI, alpha=True)
        img = Image.frombytes("RGBA", [pix.width, pix.height], pix.samples)
        img.save(dst, "WEBP", quality=WEBP_QUALITY, method=6)
    finally:
        doc.close()


def main() -> int:
    if not ROOT.is_dir():
        print(f"폴더 없음: {ROOT}", file=sys.stderr)
        return 1

    try:
        from PIL import Image  # noqa: F401
    except ImportError:
        print("Pillow 필요: pip install Pillow", file=sys.stderr)
        return 1

    converted: list[Path] = []
    errors: list[tuple[Path, str]] = []

    for p in sorted(ROOT.iterdir()):
        if not p.is_file():
            continue
        ext = p.suffix.lower()
        if ext not in EXT_RASTER | EXT_SVG:
            continue
        out = p.with_suffix(".webp")
        try:
            if ext in EXT_RASTER:
                raster_to_webp(p, out)
            else:
                try:
                    import fitz  # noqa: F401
                except ImportError:
                    errors.append((p, "PyMuPDF 필요: pip install pymupdf (SVG 변환용)"))
                    continue
                svg_to_webp(p, out)
            converted.append(out)
            print(f"OK  {p.name} -> {out.name}")
        except Exception as e:  # noqa: BLE001
            errors.append((p, str(e)))

    print(f"\n완료: {len(converted)}개 webp 생성")
    if errors:
        print("\n오류:", file=sys.stderr)
        for path, msg in errors:
            print(f"  {path.name}: {msg}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
