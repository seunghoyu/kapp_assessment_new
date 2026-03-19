#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
industry_tree.json에서 S(협회 및 단체, 수리 및 기타 개인 서비스업) 하위 중
- 개인 및 소비용품 수리업 (code 95)
- 기타 개인 서비스업 (code 96)
을 제거합니다.
"""

from __future__ import annotations

import json
import os
from typing import Any


HERE = os.path.dirname(__file__)
TREE_PATH = os.path.join(HERE, "industry_tree.json")


def main() -> None:
    with open(TREE_PATH, "r", encoding="utf-8") as f:
        data: list[dict[str, Any]] = json.load(f)

    updated = False
    for major in data:
        if major.get("code") != "S":
            continue
        children = major.get("children") or []
        # S.children 중 code 94(협회 및 단체)만 유지
        new_children = [c for c in children if c.get("code") == "94"]
        if new_children != children:
            major["children"] = new_children
            updated = True
        break

    if not updated:
        print("변경 없음: S 하위 제거 대상이 없거나 이미 제거됨")
        return

    with open(TREE_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print("완료: S 하위(95,96) 제거 반영")


if __name__ == "__main__":
    main()

