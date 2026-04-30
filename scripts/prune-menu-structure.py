#!/usr/bin/env python3
"""
menu-structure.planning.json 을 특정 메뉴(및 하위 children) 기준으로 제거(prune)합니다.

기본 정책:
  - 메뉴명이 REMOVE_MENU_NAMES 에 포함되면 해당 노드 + 하위 children 전부 삭제
  - 루트 메뉴명이 REMOVE_ROOT_NAMES 에 포함되면 해당 루트 전부 삭제
  - 결과 JSON을 overwrite 합니다.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


REMOVE_ROOT_NAMES = {
    "프로젝트 문서",  # 사용자 요청: 프로젝트 문서는 모두 삭제
}

REMOVE_MENU_NAMES = {
    "디지털 인바스켓",
    "학습자 LMS ▾",
    "문서 목록",
    "관리자 LMS ▾",
}


def prune_node(node: dict[str, Any]) -> dict[str, Any] | None:
    name = str(node.get("메뉴명", ""))
    if name in REMOVE_MENU_NAMES:
        return None

    children = node.get("children")
    if isinstance(children, list):
        new_children: list[dict[str, Any]] = []
        for c in children:
            if not isinstance(c, dict):
                continue
            kept = prune_node(c)
            if kept is not None:
                new_children.append(kept)
        node = {**node, "children": new_children}
    return node


def main() -> None:
    ap = argparse.ArgumentParser(description="Prune menu JSON")
    ap.add_argument(
        "--input",
        "-i",
        type=Path,
        default=Path("menu-structure.planning.json"),
        help="Input JSON path (will be overwritten unless --output used)",
    )
    ap.add_argument(
        "--output",
        "-o",
        type=Path,
        default=None,
        help="Optional output JSON path (default: overwrite input)",
    )
    args = ap.parse_args()

    raw = json.loads(args.input.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise SystemExit("JSON root must be a list")

    out: list[dict[str, Any]] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        root_name = str(item.get("메뉴명", ""))
        if root_name in REMOVE_ROOT_NAMES:
            continue
        kept = prune_node(item)
        if kept is not None:
            out.append(kept)

    out_path = args.output if args.output else args.input
    out_path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Wrote", out_path.resolve())


if __name__ == "__main__":
    main()

