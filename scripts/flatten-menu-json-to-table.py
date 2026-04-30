#!/usr/bin/env python3
"""
menu-structure.planning.json -> CSV / XLSX (table)

사용 목적:
  트리(menu) 구조를 한 테이블에서 필터/정렬해서 보기 위함.

의존성:
  - CSV: 표준 라이브러리만 사용
  - XLSX: XlsxWriter 필요 (python-pptx 설치 시 같이 들어오는 경우가 많음)

실행 예:
  python scripts/flatten-menu-json-to-table.py --input menu-structure.planning.json
  python scripts/flatten-menu-json-to-table.py --input menu-structure.planning.json --csv out.csv --xlsx out.xlsx
"""

from __future__ import annotations

import argparse
import csv
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, Iterator, Optional


@dataclass
class Row:
    row_no: int
    root_menu: str
    depth: int
    menu_name: str
    route: str
    parent_menu: str
    breadcrumb: str


def _safe_str(v: Any) -> str:
    return "" if v is None else str(v)


def walk(
    node: dict[str, Any],
    *,
    root_menu: str,
    parent_menu: str,
    breadcrumb: list[str],
    rows: list[Row],
) -> None:
    menu_name = _safe_str(node.get("메뉴명", ""))
    route = _safe_str(node.get("경로", ""))
    depth = int(node.get("depth", 0) or 0)

    bc = breadcrumb + ([menu_name] if menu_name else [])
    rows.append(
        Row(
            row_no=len(rows) + 1,
            root_menu=root_menu,
            depth=depth,
            menu_name=menu_name,
            route=route,
            parent_menu=parent_menu,
            breadcrumb=" > ".join(bc),
        )
    )

    children = node.get("children") or []
    if isinstance(children, list):
        for c in children:
            if isinstance(c, dict):
                walk(
                    c,
                    root_menu=root_menu,
                    parent_menu=menu_name,
                    breadcrumb=bc,
                    rows=rows,
                )


def flatten(json_root: list[dict[str, Any]]) -> list[Row]:
    rows: list[Row] = []
    for n in json_root:
        if not isinstance(n, dict):
            continue
        root_name = _safe_str(n.get("메뉴명", ""))
        walk(n, root_menu=root_name, parent_menu="", breadcrumb=[], rows=rows)
    return rows


CSV_HEADERS = ["row_no", "root_menu", "depth", "menu_name", "route", "parent_menu", "breadcrumb"]


def write_csv(rows: list[Row], out_path: Path) -> None:
    with out_path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=CSV_HEADERS)
        w.writeheader()
        for r in rows:
            w.writerow(
                {
                    "row_no": r.row_no,
                    "root_menu": r.root_menu,
                    "depth": r.depth,
                    "menu_name": r.menu_name,
                    "route": r.route,
                    "parent_menu": r.parent_menu,
                    "breadcrumb": r.breadcrumb,
                }
            )


def write_xlsx(rows: list[Row], out_path: Path) -> None:
    try:
        import xlsxwriter  # type: ignore
    except Exception as e:  # pragma: no cover
        raise SystemExit("XLSX 출력은 xlsxwriter가 필요합니다. (pip install XlsxWriter)") from e

    wb = xlsxwriter.Workbook(str(out_path))
    ws = wb.add_worksheet("menu")

    header_fmt = wb.add_format({"bold": True, "bg_color": "#F3F4F6", "border": 1})
    cell_fmt = wb.add_format({"border": 1, "valign": "top"})
    wrap_fmt = wb.add_format({"border": 1, "valign": "top", "text_wrap": True})

    # headers
    for col, h in enumerate(CSV_HEADERS):
        ws.write(0, col, h, header_fmt)

    # rows
    for i, r in enumerate(rows, start=1):
        ws.write_number(i, 0, r.row_no, cell_fmt)
        ws.write(i, 1, r.root_menu, cell_fmt)
        ws.write_number(i, 2, r.depth, cell_fmt)
        ws.write(i, 3, r.menu_name, wrap_fmt)
        ws.write(i, 4, r.route, wrap_fmt)
        ws.write(i, 5, r.parent_menu, wrap_fmt)
        ws.write(i, 6, r.breadcrumb, wrap_fmt)

    ws.autofilter(0, 0, len(rows), len(CSV_HEADERS) - 1)
    ws.freeze_panes(1, 0)
    ws.set_column(0, 0, 7)   # row_no
    ws.set_column(1, 1, 20)  # root_menu
    ws.set_column(2, 2, 6)   # depth
    ws.set_column(3, 3, 30)  # menu_name
    ws.set_column(4, 4, 22)  # route
    ws.set_column(5, 5, 22)  # parent_menu
    ws.set_column(6, 6, 60)  # breadcrumb

    wb.close()


def main() -> None:
    ap = argparse.ArgumentParser(description="menu JSON을 table(CSV/XLSX)로 변환")
    ap.add_argument("--input", "-i", type=Path, default=Path("menu-structure.planning.json"))
    ap.add_argument("--csv", type=Path, default=Path("menu-structure.planning.csv"))
    ap.add_argument("--xlsx", type=Path, default=Path("menu-structure.planning.xlsx"))
    args = ap.parse_args()

    raw = json.loads(args.input.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise SystemExit("JSON 루트는 배열이어야 합니다.")

    rows = flatten(raw)  # type: ignore[arg-type]
    write_csv(rows, args.csv)
    write_xlsx(rows, args.xlsx)
    print(f"Wrote {args.csv.resolve()}")
    print(f"Wrote {args.xlsx.resolve()}")


if __name__ == "__main__":
    main()

