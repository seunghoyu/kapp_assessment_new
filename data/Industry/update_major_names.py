# -*- coding: utf-8 -*-
"""
사진(대분류 21개 항목) 기준으로 Industry 폴더 내 JSON 파일들의 majorName을 일괄 수정합니다.
대상: industry_raw.json, industry_tree.json, industry_index.json
"""

import json
import os

# 대분류 코드 → 표준 대분류명 (이미지 1~21번 기준)
MAJOR_NAME_BY_CODE = {
    "A": "농업, 임업 및 어업",
    "B": "광업",
    "C": "제조업",
    "D": "전기, 가스, 증기 및 공기조절 공급업",
    "E": "수도, 하수 및 폐기물 처리, 원료 재생업",
    "F": "건설업",
    "G": "도매 및 소매업",
    "H": "운수 및 창고업",
    "I": "숙박 및 음식점업",
    "J": "정보통신업",
    "K": "금융 및 보험업",
    "L": "부동산 임대 및 공급업",
    "M": "전문, 과학 및 기술 서비스업",
    "N": "사업시설 관리, 사업 지원 및 임대 서비스업",
    "O": "공공 행정, 국방 및 사회보장 행정",
    "P": "교육 서비스업",
    "Q": "보건업 및 사회복지 서비스업",
    "R": "예술, 스포츠 및 여가 관련 서비스업",
    "S": "협회 및 단체, 수리 및 기타 개인 서비스업",
    "T": "가구 내 고용 활동 및 달리 분류되지 않은 자가 소비 생산 활동",
    "U": "국제 및 외국기관",
}


def update_raw(path: str) -> None:
    with open(path, "r", encoding="utf-8") as f:
        rows = json.load(f)
    prev = {}
    for row in rows:
        mc = row.get("majorCode")
        if mc is not None and str(mc).strip() != "":
            mc = str(mc).strip()
            if mc in MAJOR_NAME_BY_CODE:
                row["majorName"] = MAJOR_NAME_BY_CODE[mc]
            prev["majorCode"] = mc
            prev["majorName"] = row.get("majorName", "")
        elif prev:
            row["majorCode"] = prev.get("majorCode", "")
            row["majorName"] = prev.get("majorName", "")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    print(f"  업데이트: {path}")


def update_tree(path: str) -> None:
    with open(path, "r", encoding="utf-8") as f:
        tree_list = json.load(f)
    for node in tree_list:
        code = node.get("code", "")
        if code in MAJOR_NAME_BY_CODE:
            node["name"] = MAJOR_NAME_BY_CODE[code]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(tree_list, f, ensure_ascii=False, indent=2)
    print(f"  업데이트: {path}")


def update_index(path: str) -> None:
    with open(path, "r", encoding="utf-8") as f:
        index = json.load(f)
    for entry in index.values():
        mc = entry.get("majorCode", "")
        if mc in MAJOR_NAME_BY_CODE:
            entry["majorName"] = MAJOR_NAME_BY_CODE[mc]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f"  업데이트: {path}")


def main():
    base = os.path.dirname(os.path.abspath(__file__))
    raw_path = os.path.join(base, "industry_raw.json")
    tree_path = os.path.join(base, "industry_tree.json")
    index_path = os.path.join(base, "industry_index.json")

    if os.path.isfile(raw_path):
        update_raw(raw_path)
    if os.path.isfile(tree_path):
        update_tree(tree_path)
    if os.path.isfile(index_path):
        update_index(index_path)

    print("대분류 항목명 일괄 수정 완료.")


if __name__ == "__main__":
    main()
