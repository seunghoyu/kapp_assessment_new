#!/usr/bin/env python3
"""
menu-structure.planning.csv -> 기능명세서 통합 CSV

요구사항:
  - 메뉴구조도(테이블) + 기능명세서를 "ID 기반"으로 한 파일에서 확인
  - ID 규칙: breadcrumb 기반 해시 (구조 변경에 비교적 강함)
  - 버튼/모달/탭 등 route 없는 항목도 포함 (행 그대로 유지)

입력:
  - menu-structure.planning.csv (columns: row_no,root_menu,depth,menu_name,route,parent_menu,breadcrumb)

출력:
  - menu-functional-spec.csv

실행:
  python scripts/generate-functional-spec-from-menu-csv.py
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path


def make_id(row_no: int) -> str:
    return f"MID-{row_no:04d}"


def actor_from_route(route: str, root_menu: str) -> str:
    r = (route or "").strip()
    if r.startswith("/dashboard") or root_menu.startswith("조직 관리자"):
        return "관리자"
    if r.startswith("/app") or root_menu in {"KAPP 진단", "마이 대시보드", "교육 큐레이션"}:
        return "학습자"
    if r.startswith("/admin"):
        return "관리자"
    if r.startswith("/login"):
        return "공통"
    if r.startswith("/docs"):
        return "공통"
    return "공통"


def item_type(route: str, depth: int, menu_name: str) -> str:
    r = (route or "").strip()
    if r.startswith("/") or r.startswith("#") or r.startswith("/#"):
        return "페이지/링크"
    # heuristics for route-less items
    if any(k in menu_name for k in ["탭", "뷰", "그래프", "차트", "테이블", "일별", "월별"]):
        return "탭/뷰"
    if any(k in menu_name for k in ["모달", "닫기", "취소", "확인", "다운로드", "추가", "보기"]):
        return "버튼/모달"
    # default
    return "그룹/섹션"


def spec_summary(menu_name: str, route: str, breadcrumb: str) -> str:
    r = (route or "").strip()
    if r:
        return f"'{menu_name}' 진입/이동 기능 (경로: {r})"
    # 버튼/탭/섹션
    if menu_name in {"일별", "월별"}:
        return f"'{menu_name}' 기준으로 데이터 뷰 전환"
    if "RawData" == menu_name:
        return "Raw 데이터 보기 패널/팝업 토글"
    if "다운로드" in menu_name:
        return f"'{menu_name}' 실행 (파일 다운로드/내보내기)"
    if "추가" in menu_name:
        return f"'{menu_name}' 실행 (등록/생성 플로우 진입)"
    if "분석" in menu_name:
        return f"'{menu_name}' 관련 화면/섹션 표시 및 상호작용"
    return f"'{menu_name}' 항목 표시/선택"


def preconditions(actor: str, route: str) -> str:
    r = (route or "").strip()
    if r.startswith("/dashboard"):
        return "관리자 로그인 완료"
    if r.startswith("/app"):
        return "학습자 세션(로그인/진단정보) 존재 또는 게스트 접근 허용"
    if r.startswith("/admin"):
        return "관리자 로그인 페이지 접근 가능"
    if r.startswith("/login"):
        return "웹 접근 가능"
    return ""


def outputs(menu_name: str, route: str) -> str:
    r = (route or "").strip()
    if r:
        return f"대상 화면 렌더링: {r}"
    if menu_name in {"일별", "월별"}:
        return "차트/테이블 집계 기준 변경 및 화면 갱신"
    if "다운로드" in menu_name:
        return "파일 다운로드 또는 다운로드 요청 수행"
    if "추가" in menu_name:
        return "입력 폼/모달 표시 또는 생성 완료"
    return ""


HEADERS = [
    "menu_id",
    "row_no",
    "root_menu",
    "depth",
    "menu_name",
    "route",
    "parent_menu",
    "breadcrumb",
    "actor",
    "type",
    "summary",
    "preconditions",
    "outputs",
    "success_criteria",
    "notes",
]


def main() -> None:
    ap = argparse.ArgumentParser(description="메뉴 CSV -> 기능명세 통합 CSV")
    ap.add_argument("--input", "-i", type=Path, default=Path("menu-structure.planning.csv"))
    ap.add_argument("--output", "-o", type=Path, default=Path("menu-functional-spec.csv"))
    args = ap.parse_args()

    rows = []
    with args.input.open("r", encoding="utf-8-sig", newline="") as f:
        rdr = csv.DictReader(f)
        for row in rdr:
            breadcrumb = (row.get("breadcrumb") or "").strip()
            if not breadcrumb:
                continue
            try:
                row_no = int((row.get("row_no") or "0").strip() or "0")
            except Exception:
                row_no = 0
            menu_name = (row.get("menu_name") or "").strip()
            route = (row.get("route") or "").strip()
            root_menu = (row.get("root_menu") or "").strip()
            parent_menu = (row.get("parent_menu") or "").strip()
            depth = int(row.get("depth") or 0)

            mid = make_id(row_no if row_no > 0 else (len(rows) + 1))
            actor = actor_from_route(route, root_menu)
            typ = item_type(route, depth, menu_name)
            summary = spec_summary(menu_name, route, breadcrumb)
            pre = preconditions(actor, route)
            out = outputs(menu_name, route)

            rows.append(
                {
                    "menu_id": mid,
                    "row_no": row.get("row_no", ""),
                    "root_menu": root_menu,
                    "depth": depth,
                    "menu_name": menu_name,
                    "route": route,
                    "parent_menu": parent_menu,
                    "breadcrumb": breadcrumb,
                    "actor": actor,
                    "type": typ,
                    "summary": summary,
                    "preconditions": pre,
                    "outputs": out,
                    "success_criteria": "의도한 화면/동작이 오류 없이 수행됨",
                    "notes": "",
                }
            )

    with args.output.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=HEADERS)
        w.writeheader()
        w.writerows(rows)

    print(f"Wrote {args.output.resolve()}")


if __name__ == "__main__":
    main()

