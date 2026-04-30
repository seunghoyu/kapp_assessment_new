from __future__ import annotations

import re


_NON_ALNUM_RE = re.compile(r"[^a-z0-9]+")
_DASH_RE = re.compile(r"-{2,}")

_KO_MAJOR_CATEGORY_SLUGS: dict[str, str] = {
    "기획·전략": "planning-strategy",
    "마케팅·홍보·조사": "marketing-pr-research",
    "회계·세무·재무": "accounting-tax-finance",
    "인사·노무·HRD": "hr-labor-hrd",
    "총무·법무·사무": "admin-legal-office",
    "IT·개발": "it-development",
    "AI·데이터·인프라": "ai-data-infra",
    "디자인": "design",
    "영업·판매·무역": "sales-retail-trade",
    "고객상담·TM": "customer-support-tm",
    "구매·자재·물류": "procurement-logistics",
    "상품기획·MD": "product-planning-md",
    "생산·품질·안전": "manufacturing-quality-safety",
    "건설·건축": "construction-architecture",
    "서비스·식음료": "service-food-beverage",
    "금융·보험": "finance-insurance",
    "연구·R&D": "research-rnd",
    "의료·복지": "healthcare-welfare",
    "교육": "education",
    "공공·복지": "public-welfare",
}


def slugify_english_filename(text: str) -> str:
    """
    Convert text to a safe lowercase ASCII-ish slug for filenames.
    Assumes input is already English; will aggressively strip anything else.
    """
    if not isinstance(text, str):
        raise TypeError("text must be a string")

    s = text.strip().lower()
    s = s.replace("&", " and ")
    s = _NON_ALNUM_RE.sub("-", s)
    s = _DASH_RE.sub("-", s).strip("-")
    return s or "untitled"


def slug_for_category(*, label_ko: str, label_en: str | None, index: int) -> str:
    """
    Prefer English slug; if missing, fallback to known Korean mapping; else a stable index-based name.
    """
    if label_en:
        return slugify_english_filename(label_en)
    if label_ko in _KO_MAJOR_CATEGORY_SLUGS:
        return _KO_MAJOR_CATEGORY_SLUGS[label_ko]
    return f"category-{index:02d}"

