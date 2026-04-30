# -*- coding: utf-8 -*-
"""
industry_tree.json을 읽어 subDetail 기준 검색용 flat index JSON을 생성하고
industry_index.json으로 저장합니다.
Python 표준 라이브러리만 사용, UTF-8 인코딩, indent=2로 저장.
"""

import json


def traverse(node, path, index):
    """
    tree 노드를 순회하며 path에 (code, name)을 쌓고,
    subDetail(5번째 계층)에 도달하면 index에 한 건 추가.
    path: [(code, name), ...] 최대 5개 = major, middle, small, detail, subDetail
    """
    code = node.get("code", "")
    name = node.get("name", "")
    children = node.get("children") or []

    path.append((code, name))

    if len(path) == 5:
        # subDetail 도달 → index 한 건 추가 (key = subDetailCode)
        sub_detail_code = path[4][0]
        index[sub_detail_code] = {
            "majorCode": path[0][0],
            "majorName": path[0][1],
            "middleCode": path[1][0],
            "middleName": path[1][1],
            "smallCode": path[2][0],
            "smallName": path[2][1],
            "detailCode": path[3][0],
            "detailName": path[3][1],
            "subDetailCode": path[4][0],
            "subDetailName": path[4][1],
        }
    else:
        for child in children:
            traverse(child, path, index)

    path.pop()


def main():
    input_path = "data/Industry/industry_tree.json"
    output_path = "data/Industry/industry_index.json"

    with open(input_path, "r", encoding="utf-8") as f:
        tree_list = json.load(f)

    index = {}
    path = []

    for root in tree_list:
        traverse(root, path, index)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"저장 완료: {output_path}")


if __name__ == "__main__":
    main()
