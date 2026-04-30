# -*- coding: utf-8 -*-
"""
industry_raw.json을 읽어 계층형 tree JSON을 생성하고 industry_tree.json으로 저장합니다.
Python 표준 라이브러리만 사용, UTF-8 인코딩, indent=2로 저장.
"""

import json


def norm_code(value, digits=None):
    """코드 값을 문자열로 정규화. digits가 주어지면 숫자일 때 앞을 0으로 채움."""
    if value is None or (isinstance(value, str) and value.strip() == ""):
        return ""
    s = str(value).strip()
    if not s:
        return ""
    if digits is not None:
        try:
            return str(int(s)).zfill(digits)
        except ValueError:
            return s
    return s


def get_or_create(parent_children, code, name):
    """부모의 children dict에서 code로 노드를 찾거나 생성. 동일 code 중복 생성 방지."""
    if code not in parent_children:
        parent_children[code] = {"code": code, "name": name, "children": {}}
    return parent_children[code]


def tree_dict_to_list(nodes_dict):
    """children이 dict인 트리를 children이 list인 구조로 변환."""
    return [tree_node_to_list(nodes_dict[k]) for k in nodes_dict]


def tree_node_to_list(node):
    """단일 노드의 children을 dict에서 list로 변환 (재귀)."""
    return {
        "code": node["code"],
        "name": node["name"],
        "children": tree_dict_to_list(node["children"]) if node["children"] else [],
    }


def main():
    input_path = "data/Industry/industry_raw.json"
    output_path = "data/Industry/industry_tree.json"

    with open(input_path, "r", encoding="utf-8") as f:
        raw = json.load(f)

    # 빈 필드는 이전 행 값으로 채우기 (carry forward)
    prev = {}
    for row in raw:
        for key in (
            "majorCode", "majorName", "middleCode", "middleName",
            "smallCode", "smallName", "detailCode", "detailName",
            "subDetailCode", "subDetailName",
        ):
            val = row.get(key)
            if val is not None and str(val).strip() != "":
                prev[key] = val
            elif key in prev:
                row[key] = prev[key]

    # 계층 트리 구성: major -> middle -> small -> detail -> subDetail (동일 code 중복 미생성)
    majors = {}

    for row in raw:
        c_major = norm_code(row.get("majorCode"), None)
        c_mid = norm_code(row.get("middleCode"), 2)
        c_small = norm_code(row.get("smallCode"), 3)
        c_detail = norm_code(row.get("detailCode"), 4)
        c_sub = norm_code(row.get("subDetailCode"), 5)

        if not c_major or not c_mid or not c_small or not c_detail or not c_sub:
            continue

        n_major = (row.get("majorName") or "").strip()
        n_mid = (row.get("middleName") or "").strip()
        n_small = (row.get("smallName") or "").strip()
        n_detail = (row.get("detailName") or "").strip()
        n_sub = (row.get("subDetailName") or "").strip()

        major_node = get_or_create(majors, c_major, n_major)
        mid_node = get_or_create(major_node["children"], c_mid, n_mid)
        small_node = get_or_create(mid_node["children"], c_small, n_small)
        detail_node = get_or_create(small_node["children"], c_detail, n_detail)
        get_or_create(detail_node["children"], c_sub, n_sub)

    # dict 기반 트리를 list 기반 최종 구조로 변환
    tree_list = tree_dict_to_list(majors)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(tree_list, f, ensure_ascii=False, indent=2)

    print(f"저장 완료: {output_path}")


if __name__ == "__main__":
    main()
