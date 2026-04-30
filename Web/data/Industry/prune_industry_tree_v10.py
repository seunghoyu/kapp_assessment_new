#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
industry_tree.json에서 UX 기준으로 제외할 분류들을 제거합니다.

- 지정된 name(정확히 일치) 노드는 트리에서 제거됩니다(하위 포함).
- 대분류 S 표기명을 '협회 및 단체'로 통일하고,
  S children은 '협회 및 단체'(code 94)만 유지합니다.
"""

from __future__ import annotations

import json
import os
from typing import Any


HERE = os.path.dirname(__file__)
TREE_PATH = os.path.join(HERE, "industry_tree.json")

PRUNE_MATCHES = [
    "기타 과학기술 서비스업",
    "수의업",
    "인문 및 사회과학 연구개발업",
    "내화, 비내화 요업제품 제조업",
    "인쇄 및 인쇄관련 산업",
    "토사석 광업",
    "기타 비금속광물 광업",
    "양식어업 및 어업관련 서비스업",
    "석탄 광업",
    "수렵 및 관련 서비스업",
    # 재확인 요청 항목(중분류)도 name 기준으로 방어적으로 제거
    "개인 및 소비용품 수리업",
    "기타 개인 서비스업",
]


def prune_nodes(nodes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    pruned: list[dict[str, Any]] = []
    for node in nodes:
        name = node.get("name")
        if isinstance(name, str) and any(m in name for m in PRUNE_MATCHES):
            continue
        children = node.get("children")
        if isinstance(children, list) and children:
            node["children"] = prune_nodes(children)
        pruned.append(node)
    return pruned


def main() -> None:
    with open(TREE_PATH, "r", encoding="utf-8") as f:
        data: list[dict[str, Any]] = json.load(f)

    # 1) 전역 name 기반 prune
    data = prune_nodes(data)

    # 2) S 대분류 표기/children 정리
    for major in data:
        if major.get("code") != "S":
            continue
        major["name"] = "협회 및 단체"
        children = major.get("children") or []
        major["children"] = [c for c in children if c.get("code") == "94"]
        break

    with open(TREE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print("완료: industry_tree.json prune 반영")


if __name__ == "__main__":
    main()

