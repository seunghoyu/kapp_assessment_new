import argparse
import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd


Q_RE = re.compile(r"^Q(\d+)$")
CHOICE_RE = re.compile(r"^[①②③④⑤⑥⑦⑧⑨⑩]\s*")
ANSWER_RE = re.compile(r"정답\s*([①②③④⑤⑥⑦⑧⑨⑩])")
BLOCK_RE = re.compile(r"^\s*([①②③④⑤⑥⑦⑧⑨⑩])\s*([^\s].*?)\s*$")

CHOICE_SYMBOLS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"]


def _is_nan(v: Any) -> bool:
    try:
        return pd.isna(v)
    except Exception:
        return v is None


def _s(v: Any) -> str:
    if _is_nan(v):
        return ""
    return str(v).strip()


def _normalize_sheet_name(name: str) -> str:
    # Keep original (Korean) names; just trim.
    return name.strip()


def _extract_choice_text(s: str) -> Optional[Tuple[int, str]]:
    if not s:
        return None
    for idx, sym in enumerate(CHOICE_SYMBOLS, start=1):
        if s.startswith(sym):
            return idx, s[len(sym):].strip()
    if CHOICE_RE.match(s):
        # Unknown symbol but matches a choice-like prefix; keep raw with index None.
        return None
    return None


def _symbol_to_index(sym: str) -> Optional[int]:
    try:
        return CHOICE_SYMBOLS.index(sym) + 1
    except ValueError:
        return None


def _infer_answer_from_core_and_options(core: str, choices: List[Dict[str, Any]]) -> Optional[int]:
    """When [해설] is missing, pick the option whose text appears in ①핵심해설 (longest match)."""
    if not (core or "").strip() or not choices:
        return None
    best_idx: Optional[int] = None
    best_len = 0
    for c in choices:
        idx = c.get("index")
        txt = (c.get("text") or "").strip()
        if not txt or not isinstance(idx, int):
            continue
        if txt in core and len(txt) > best_len:
            best_len = len(txt)
            best_idx = idx
    if best_idx is not None:
        return best_idx
    # Relaxed: stem endings differ ("…시킨다" vs "…시키는 것이다")
    for c in choices:
        idx = c.get("index")
        txt = (c.get("text") or "").strip()
        if not txt or not isinstance(idx, int) or len(txt) < 12:
            continue
        for k in (min(40, len(txt)), min(30, len(txt)), min(20, len(txt))):
            if k >= 12 and txt[:k] in core:
                return idx
    return None


def enrich_raw_questions(questions: List[Dict[str, Any]]) -> None:
    """Fill brief/answer from explain blocks when main sheet omitted [해설]."""
    for q in questions:
        blocks = q.get("blocks") or {}
        core = (blocks.get("①핵심해설") or "").strip()

        if not (q.get("brief_explanation") or "").strip() and core:
            q["brief_explanation"] = core

        if q.get("answer") is None:
            for v in blocks.values():
                am = ANSWER_RE.search(v or "")
                if am:
                    q["answer"] = _symbol_to_index(am.group(1))
                    break

        if q.get("answer") is None and core and q.get("choices"):
            inferred = _infer_answer_from_core_and_options(core, q["choices"])
            if inferred is not None:
                q["answer"] = inferred


@dataclass
class Question:
    qid: str
    level_label: str = ""
    job_grade_code: str = ""
    persona: str = ""
    question_text: str = ""
    ability_unit: str = ""
    difficulty_band: str = ""
    coefficient: Optional[float] = None
    choices: List[Dict[str, Any]] = None
    brief_explanation: str = ""
    answer: Optional[int] = None
    blocks: Dict[str, str] = None

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        # Drop empty / None fields for cleanliness
        out: Dict[str, Any] = {
            "qid": d["qid"],
            "level_label": d["level_label"],
            "job_grade_code": d["job_grade_code"],
            "persona": d["persona"],
            "question_text": d["question_text"],
            "ability_unit": d["ability_unit"],
            "difficulty_band": d["difficulty_band"],
            "coefficient": d["coefficient"],
            "choices": d["choices"] or [],
            "answer": d["answer"],
            "brief_explanation": d["brief_explanation"],
            "blocks": d["blocks"] or {},
        }
        return out


def _parse_ability_unit(ability_unit: str) -> List[str]:
    """
    ability_unit examples:
      "NCS 일반영업 / 환경분석 Lv.4"
    """
    parts = [p.strip() for p in (ability_unit or "").split("/") if p.strip()]
    return parts


def _normalize_block_key(block_key: str) -> Optional[Dict[str, Any]]:
    """
    "①핵심해설" -> {order:1, title:"핵심해설"}
    """
    if not block_key:
        return None
    m = re.match(r"^\s*([①②③④⑤⑥⑦⑧⑨⑩])\s*(.+?)\s*$", block_key)
    if not m:
        return None
    sym, title = m.group(1), m.group(2)
    order = _symbol_to_index(sym)
    return {"order": order, "title": title}


def normalize_payload(
    raw_payload: Dict[str, Any],
    set_no: Optional[int] = None,
    sheet_code: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Produces a more integration-friendly, consistent schema.
    - qid -> qid (kept)
    - question_text -> stem
    - choices -> options
    - answer -> answerIndex
    - brief_explanation -> explanationBrief
    - blocks (dict) -> explanationBlocks (ordered array)
    """
    normalized_questions: List[Dict[str, Any]] = []
    for q in raw_payload.get("questions", []):
        options = []
        for c in q.get("choices", []) or []:
            idx = c.get("index")
            label = CHOICE_SYMBOLS[idx - 1] if isinstance(idx, int) and 1 <= idx <= len(CHOICE_SYMBOLS) else None
            options.append({
                "id": idx,
                "label": label,
                "text": c.get("text", ""),
            })

        blocks_dict: Dict[str, str] = q.get("blocks") or {}
        blocks_arr: List[Dict[str, Any]] = []
        for k, v in blocks_dict.items():
            meta = _normalize_block_key(k) or {"order": None, "title": k}
            blocks_arr.append({
                "order": meta["order"],
                "title": meta["title"],
                "content": v,
            })
        blocks_arr.sort(key=lambda x: (x["order"] is None, x["order"] if x["order"] is not None else 999))

        qno = None
        m = Q_RE.match(q.get("qid", ""))
        if m:
            try:
                qno = int(m.group(1))
            except ValueError:
                qno = None

        qid_str = q.get("qid") or ""
        qglob = None
        if set_no is not None and sheet_code is not None and qno is not None:
            qglob = f"JF_SAL_01_K_{sheet_code}_Q{qno:02d}"

        item: Dict[str, Any] = {
            "qid": qid_str,
            "no": qno,
            "level": q.get("level_label", ""),
            "gradeCode": q.get("job_grade_code", ""),
            "role": q.get("persona", ""),
            "stem": q.get("question_text", ""),
            "abilityPath": _parse_ability_unit(q.get("ability_unit", "")),
            "difficultyBand": q.get("difficulty_band", ""),
            "weight": q.get("coefficient", None),
            "options": options,
            "answerIndex": q.get("answer", None),
            "explanationBrief": q.get("brief_explanation", ""),
            "explanationBlocks": blocks_arr,
        }
        if qglob:
            item["questionId"] = qglob
        normalized_questions.append(item)

    meta: Dict[str, Any] = {
        "jobFamilyCode": "JF_SAL_01_K",
        "sourceXlsx": raw_payload.get("source_xlsx"),
        "sheet": raw_payload.get("sheet"),
        "title": raw_payload.get("title", ""),
        "rationale": raw_payload.get("rationale", ""),
    }
    if set_no is not None:
        meta["setNo"] = set_no
    if sheet_code is not None:
        meta["sheetCode"] = sheet_code

    return {
        "meta": meta,
        "questions": normalized_questions,
    }


def parse_main_sheet(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Parses S01 / S02 like sheets where one question spans multiple rows:
    - Qn marker on column A
    - meta rows (level label, job grade code, persona+question, ability+band, coefficient)
    - choices in column B with ①..④ prefix
    - brief explanation in column A starting with [해설]
    """
    # Ensure at least 4 columns
    if df.shape[1] < 4:
        for _ in range(4 - df.shape[1]):
            df[df.shape[1]] = None

    title = ""
    rationale = ""
    header_row_seen = False

    questions: List[Question] = []
    current: Optional[Question] = None

    def flush():
        nonlocal current
        if current is None:
            return
        # normalize
        if current.choices is None:
            current.choices = []
        if current.blocks is None:
            current.blocks = {}
        questions.append(current)
        current = None

    for _, row in df.iterrows():
        c0, c1, c2, c3 = (_s(row.iloc[0]), _s(row.iloc[1]), _s(row.iloc[2]), _s(row.iloc[3]))

        # title / rationale rows at top
        if not header_row_seen:
            # Title row: "S03  |  ..." or any SNN | ...
            if re.match(r"^S\d+\s*\|", c0) or (
                c0.startswith("S") and "|" in c0 and re.match(r"^S\d+", c0.split("|")[0].strip())
            ):
                if "|" in c0:
                    parts = [p.strip() for p in c0.split("|") if p.strip()]
                    if len(parts) >= 2:
                        title = parts[1]
                elif c1:
                    title = c1
                continue
            if c0.startswith("출제 근거:"):
                rationale = c0.replace("출제 근거:", "", 1).strip()
                continue
            if c0.startswith("레벨") and "문항" in c1:
                header_row_seen = True
                continue
            # skip other preamble
            continue

        # Start new question (can be a multi-line cell like "Q1\n주니어\nIC_JUNIOR\n영업 어시스턴트")
        c0_lines = [ln.strip() for ln in c0.splitlines() if ln.strip()]
        qid_candidate = c0_lines[0] if c0_lines else ""
        if Q_RE.match(qid_candidate):
            flush()
            current = Question(qid=qid_candidate, choices=[], blocks={})
            # Parse meta from the same cell if present
            if len(c0_lines) >= 2:
                current.level_label = c0_lines[1]
            if len(c0_lines) >= 3:
                current.job_grade_code = c0_lines[2]
            if len(c0_lines) >= 4:
                current.persona = c0_lines[3]

            # Question text from col1
            if c1:
                qtext = re.sub(r"^\[문항\s*\d+\]\s*", "", c1).strip()
                current.question_text = qtext

            # Ability from col2 (often multi-line)
            if c2:
                ability_lines = [ln.strip() for ln in c2.splitlines() if ln.strip()]
                current.ability_unit = " / ".join(ability_lines)

            # Difficulty band + coefficient from col3 (multi-line)
            if c3:
                c3_lines = [ln.strip() for ln in c3.splitlines() if ln.strip()]
                # First line tends to be band code like IC_JUNIOR
                if c3_lines and re.match(r"^[A-Z0-9_]+$", c3_lines[0]):
                    current.difficulty_band = c3_lines[0]
                # Coefficient line tends to be "계수 0.75"
                for ln in c3_lines:
                    if ln.startswith("계수"):
                        m = re.search(r"([0-9]+(?:\.[0-9]+)?)", ln)
                        if m:
                            try:
                                current.coefficient = float(m.group(1))
                            except ValueError:
                                pass
            continue

        if current is None:
            continue

        # choice rows: in col1
        if c1:
            extracted = _extract_choice_text(c1)
            if extracted:
                idx, text = extracted
                current.choices.append({"index": idx, "text": text})
                continue

        # brief explanation row starts with [해설]
        if c0.startswith("[해설]"):
            current.brief_explanation = c0.replace("[해설]", "", 1).strip()
            am = ANSWER_RE.search(current.brief_explanation)
            if am:
                current.answer = _symbol_to_index(am.group(1))
            continue
        # Some sheets put [해설] in column B only (e.g. S31+ industry sets)
        if c1.startswith("[해설]"):
            current.brief_explanation = c1.replace("[해설]", "", 1).strip()
            am = ANSWER_RE.search(current.brief_explanation)
            if am:
                current.answer = _symbol_to_index(am.group(1))
            continue

        # Sometimes explanation spills into next line (col0) without marker; append.
        if current.brief_explanation and c0 and not Q_RE.match(c0) and not c0.startswith("계수"):
            # Only append if it doesn't look like a new metadata line
            if not re.match(r"^[A-Z0-9_]+$", c0) and "Lv." not in c0:
                current.brief_explanation = (current.brief_explanation + "\n" + c0).strip()

    flush()

    return {
        "title": title,
        "rationale": rationale,
        "questions": [q.to_dict() for q in questions],
    }


def parse_explain_sheet(df: pd.DataFrame) -> Dict[str, Dict[str, str]]:
    """
    Parses S01_해설 / S02_해설 like sheets:
    columns: 문항 | 블록 | 해설 내용 | 메모 (but actual layout is:
      col0: Qn (sometimes)
      col1: level label (sometimes)
      col2: block label like "①핵심해설"
      col3: content (may spill)
    )
    Output: { "Q1": { "①핵심해설": "...", "②오답분석": "...", ... } }
    """
    if df.shape[1] < 4:
        for _ in range(4 - df.shape[1]):
            df[df.shape[1]] = None

    out: Dict[str, Dict[str, str]] = {}
    current_qid: Optional[str] = None
    current_block: Optional[str] = None

    def ensure(qid: str):
        if qid not in out:
            out[qid] = {}

    for _, row in df.iterrows():
        c0, c1, c2, c3 = (_s(row.iloc[0]), _s(row.iloc[1]), _s(row.iloc[2]), _s(row.iloc[3]))

        # Question marker is often multi-line like "Q1\n주니어"
        c0_lines = [ln.strip() for ln in c0.splitlines() if ln.strip()]
        qid_candidate = c0_lines[0] if c0_lines else ""
        if Q_RE.match(qid_candidate):
            current_qid = qid_candidate
            current_block = None
            ensure(current_qid)
            # block may be on same row in col1
            if c1 and BLOCK_RE.match(c1):
                current_block = c1
                out[current_qid][current_block] = (c2 or "").strip()
            continue

        if not current_qid:
            continue

        # Identify block row (block label in col1)
        if c1 and BLOCK_RE.match(c1):
            current_block = c1
            ensure(current_qid)
            out[current_qid][current_block] = (c2 or "").strip()
            continue

        # Continuation lines: either content spills into col2/col3
        if current_block:
            extra_parts = []
            # content is normally in col2; col3 is memo
            if c2:
                extra_parts.append(c2)
            if c3:
                extra_parts.append(c3)
            if extra_parts:
                prev = out[current_qid].get(current_block, "")
                add = "\n".join([p for p in extra_parts if p.strip()])
                out[current_qid][current_block] = (prev + "\n" + add).strip() if prev else add.strip()

    return out


def load_raw_payload(xlsx_path: Path, sheet_base: str) -> Dict[str, Any]:
    """Read main + explain sheets and return raw_payload (before normalize)."""
    xl = pd.ExcelFile(xlsx_path)
    sheet_base = _normalize_sheet_name(sheet_base)
    main_sheet = sheet_base
    explain_sheet = f"{sheet_base}_해설"

    if main_sheet not in xl.sheet_names:
        raise ValueError(f"워크시트가 없습니다: {main_sheet!r} in {xlsx_path}")
    if explain_sheet not in xl.sheet_names:
        raise ValueError(f"워크시트가 없습니다: {explain_sheet!r} in {xlsx_path}")

    main_df = xl.parse(main_sheet, header=None)
    explain_df = xl.parse(explain_sheet, header=None)

    main_parsed = parse_main_sheet(main_df)
    blocks_by_qid = parse_explain_sheet(explain_df)

    for q in main_parsed["questions"]:
        qid = q["qid"]
        q["blocks"] = blocks_by_qid.get(qid, {})

    enrich_raw_questions(main_parsed["questions"])

    return {
        "source_xlsx": str(xlsx_path.as_posix()),
        "sheet": sheet_base,
        "title": main_parsed["title"],
        "rationale": main_parsed["rationale"],
        "questions": main_parsed["questions"],
    }


def validate_normalized(payload: Dict[str, Any]) -> List[str]:
    """Return list of error strings; empty means OK."""
    errors: List[str] = []
    qs = payload.get("questions") or []
    seen_qid: set = set()
    for q in qs:
        qid = q.get("qid") or "?"
        if qid in seen_qid:
            errors.append(f"duplicate qid: {qid}")
        seen_qid.add(qid)
        if not (q.get("stem") or "").strip():
            errors.append(f"{qid}: empty stem")
        opts = q.get("options") or []
        if not opts:
            errors.append(f"{qid}: no options")
        else:
            ids = [o.get("id") for o in opts]
            for i, oid in enumerate(ids, start=1):
                if oid != i:
                    errors.append(f"{qid}: option id mismatch expected {i}, got {oid}")
                    break
        ai = q.get("answerIndex")
        if ai is None:
            errors.append(f"{qid}: missing answerIndex")
        elif opts and (not isinstance(ai, int) or ai < 1 or ai > len(opts)):
            errors.append(f"{qid}: answerIndex {ai} out of range 1..{len(opts)}")
        if not (q.get("explanationBrief") or "").strip():
            errors.append(f"{qid}: empty explanationBrief")
        blocks = q.get("explanationBlocks") or []
        if len(blocks) != 7:
            errors.append(f"{qid}: expected 7 explanationBlocks, got {len(blocks)}")
        else:
            orders = [b.get("order") for b in blocks]
            if orders != [1, 2, 3, 4, 5, 6, 7]:
                errors.append(f"{qid}: explanationBlocks order expected 1..7, got {orders}")
    return errors


EXCLUDED_XLSX_NAMES = frozenset({
    "SAL01_K문항_추가설계표_S1-S45_v1.xlsx",
    "SAL01_역할관점분리_S31-S45_v1.xlsx",
})


def discover_set_to_xlsx(base: Path) -> Dict[int, Path]:
    """
    Map set number 1..45 -> xlsx path containing sheet 'S{NN}' (and S{NN}_해설).
    Only scans *.xlsx directly under base (not 6문항씩 subfolder).
    """
    set_to_paths: Dict[int, List[Path]] = {}
    for p in sorted(base.glob("*.xlsx")):
        if p.name in EXCLUDED_XLSX_NAMES:
            continue
        try:
            xl = pd.ExcelFile(p)
        except Exception:
            continue
        for s in xl.sheet_names:
            if "_" in s:
                continue
            m = re.match(r"^S(\d+)$", s.strip())
            if not m:
                continue
            n = int(m.group(1))
            if 1 <= n <= 45:
                set_to_paths.setdefault(n, []).append(p)

    out: Dict[int, Path] = {}
    for n, paths in set_to_paths.items():
        uniq: List[Path] = []
        seen = set()
        for p in paths:
            key = str(p.resolve())
            if key not in seen:
                seen.add(key)
                uniq.append(p)
        if len(uniq) > 1:
            raise RuntimeError(f"세트 {n}에 여러 통합본이 매칭됨: {uniq}")
        out[n] = uniq[0]
    return out


def sheet_name_for_set(set_no: int) -> str:
    return f"S{set_no:02d}"


def convert_one_set(
    xlsx_path: Path,
    set_no: int,
    out_jf_path: Path,
    write_raw: bool = True,
) -> Dict[str, Any]:
    sheet_base = sheet_name_for_set(set_no)
    raw_payload = load_raw_payload(xlsx_path, sheet_base)
    normalized = normalize_payload(
        raw_payload,
        set_no=set_no,
        sheet_code=sheet_base,
    )
    errs = validate_normalized(normalized)
    out_jf_path.parent.mkdir(parents=True, exist_ok=True)
    out_jf_path.write_text(json.dumps(normalized, ensure_ascii=False, indent=2), encoding="utf-8")
    if write_raw:
        raw_dir = out_jf_path.parent.parent / "JF_SAL_01_k_json_raw"
        raw_dir.mkdir(parents=True, exist_ok=True)
        raw_path = raw_dir / f"JF_SAL_01_K_set{set_no}.raw.json"
        raw_path.write_text(json.dumps(raw_payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"path": str(out_jf_path), "errors": errs, "question_count": len(normalized.get("questions", []))}


def convert_excel(
    xlsx_path: Path,
    sheet_base: str,
    output_dir: Path,
    set_no: Optional[int] = None,
):
    """Legacy single-sheet export: writes {sheet_base}.json under output_dir."""
    raw_payload = load_raw_payload(xlsx_path, sheet_base)
    code = _normalize_sheet_name(sheet_base)
    normalized_payload = normalize_payload(
        raw_payload,
        set_no=set_no,
        sheet_code=code,
    )

    output_dir.mkdir(parents=True, exist_ok=True)
    out_path = output_dir / f"{sheet_base}.json"
    out_path.write_text(json.dumps(normalized_payload, ensure_ascii=False, indent=2), encoding="utf-8")

    raw_dir = output_dir.parent / f"{output_dir.name}_raw"
    raw_dir.mkdir(parents=True, exist_ok=True)
    raw_path = raw_dir / f"{sheet_base}.raw.json"
    raw_path.write_text(json.dumps(raw_payload, ensure_ascii=False, indent=2), encoding="utf-8")

    return out_path


def main():
    ap = argparse.ArgumentParser(description="SAL01_K 엑셀 → JSON 변환")
    ap.add_argument("--batch-jf", action="store_true", help="S02~S45 일괄 변환 → Web/real_data/JF/JF_SAL_01_K_setN.json")
    ap.add_argument("--start", type=int, default=2, help="배치 시작 세트 (기본 2)")
    ap.add_argument("--end", type=int, default=45, help="배치 끝 세트 (기본 45)")
    ap.add_argument(
        "--jf-dir",
        default="Web/real_data/JF",
        help="JF JSON 출력 디렉토리 (기본 Web/real_data/JF)",
    )
    ap.add_argument(
        "--data-dir",
        default="Web/real_data/JF_SAL_01_k",
        help="통합본 xlsx 위치 (기본 Web/real_data/JF_SAL_01_k)",
    )
    ap.add_argument(
        "--report",
        default="Web/real_data/JF/JF_SAL_01_K_conversion_report.json",
        help="배치 리포트 경로",
    )
    ap.add_argument(
        "--xlsx",
        default=None,
        help="단일 변환: 입력 XLSX 경로",
    )
    ap.add_argument(
        "--sheet",
        default=None,
        help="단일 변환: 기준 시트명 (예: S01, S02)",
    )
    ap.add_argument(
        "--out-dir",
        default="Web/real_data/JF_SAL_01_k/json",
        help="단일 변환: 출력 디렉토리",
    )
    ap.add_argument("--set-no", type=int, default=None, help="단일 변환 시 setNo/meta용 세트 번호")
    args = ap.parse_args()

    if args.batch_jf:
        base = Path(args.data_dir)
        jf_dir = Path(args.jf_dir)
        mapping = discover_set_to_xlsx(base)
        report_sets: List[Dict[str, Any]] = []
        all_errors: List[str] = []
        for set_no in range(args.start, args.end + 1):
            if set_no not in mapping:
                msg = f"세트 {set_no}: 통합본 xlsx에서 시트 {sheet_name_for_set(set_no)} 를 찾지 못함"
                all_errors.append(msg)
                report_sets.append({"setNo": set_no, "ok": False, "error": msg})
                continue
            xlsx_path = mapping[set_no]
            out_path = jf_dir / f"JF_SAL_01_K_set{set_no}.json"
            try:
                res = convert_one_set(xlsx_path, set_no, out_path, write_raw=True)
                if res["errors"]:
                    all_errors.extend([f"set{set_no}: {e}" for e in res["errors"]])
                report_sets.append({
                    "setNo": set_no,
                    "ok": len(res["errors"]) == 0,
                    "xlsx": str(xlsx_path.as_posix()),
                    "output": res["path"],
                    "questionCount": res["question_count"],
                    "validationErrors": res["errors"],
                })
            except Exception as e:
                all_errors.append(f"set{set_no}: {e}")
                report_sets.append({"setNo": set_no, "ok": False, "error": str(e)})

        report = {
            "range": [args.start, args.end],
            "dataDir": str(base.as_posix()),
            "jfDir": str(jf_dir.as_posix()),
            "sets": report_sets,
            "totalErrors": len(all_errors),
        }
        Path(args.report).parent.mkdir(parents=True, exist_ok=True)
        Path(args.report).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps(report, ensure_ascii=False, indent=2))
        if all_errors:
            raise SystemExit(f"검증/오류 {len(all_errors)}건. 리포트: {args.report}")
        return

    if not args.xlsx or not args.sheet:
        raise SystemExit("--xlsx 와 --sheet 가 필요합니다 (--batch-jf 가 아닐 때)")

    xlsx_path = Path(args.xlsx)
    if not xlsx_path.exists():
        raise SystemExit(f"파일이 없습니다: {xlsx_path}")

    out_dir = Path(args.out_dir)
    out_path = convert_excel(
        xlsx_path=xlsx_path,
        sheet_base=args.sheet,
        output_dir=out_dir,
        set_no=args.set_no,
    )
    print(str(out_path))


if __name__ == "__main__":
    main()
