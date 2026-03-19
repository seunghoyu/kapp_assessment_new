# -*- coding: utf-8 -*-
"""
dim_job_family_v10.csv를 읽어 job_family_payload_v10.json을 생성합니다.
typical_roles_json 컬럼을 JSON 파싱하여 typical_roles(string[])로 변환합니다.
"""

import csv
import json
import os

CSV_PATH = os.path.join(os.path.dirname(__file__), "dim_job_family_v10.csv")
OUT_PATH = os.path.join(os.path.dirname(__file__), "job_family_payload_v10.json")

FIELDS = [
    "job_family_id",
    "family_group_id",
    "major_category_num",
    "major_category_label",
    "major_category_icon",
    "job_family_name_ko",
    "typical_roles_json",
]


def parse_typical_roles(raw: str) -> list[str]:
    if not raw or not raw.strip():
        return []
    s = raw.strip()
    try:
        parsed = json.loads(s)
        if isinstance(parsed, list):
            return [str(x) for x in parsed]
        return []
    except (json.JSONDecodeError, TypeError):
        return []


def main():
    rows = []
    with open(CSV_PATH, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            typical_raw = row.get("typical_roles_json", "")
            typical_roles = parse_typical_roles(typical_raw)
            num = row.get("major_category_num", "")
            try:
                major_category_num = int(num) if num else 0
            except ValueError:
                major_category_num = 0
            rows.append({
                "job_family_id": row.get("job_family_id", ""),
                "family_group_id": row.get("family_group_id", ""),
                "major_category_num": major_category_num,
                "major_category_label": row.get("major_category_label", ""),
                "major_category_icon": row.get("major_category_icon", ""),
                "job_family_name_ko": row.get("job_family_name_ko", ""),
                "typical_roles": typical_roles,
            })
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    print(f"저장 완료: {OUT_PATH} ({len(rows)} rows)")


if __name__ == "__main__":
    main()
