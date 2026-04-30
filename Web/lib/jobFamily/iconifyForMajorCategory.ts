/**
 * job_family_payload_v10.json 의 major_category_num → Iconify 아이콘 ID.
 * (이모지 필드 대신 벡터 아이콘 표시용)
 */
const MAJOR_CATEGORY_ICONIFY: Record<number, string> = {
  1: "mdi:chart-timeline-variant",
  2: "mdi:bullhorn-outline",
  3: "mdi:calculator-variant-outline",
  4: "mdi:account-group-outline",
  5: "mdi:file-document-multiple-outline",
  6: "mdi:code-tags",
  7: "mdi:database-cog-outline",
  8: "mdi:palette-outline",
  9: "mdi:handshake-outline",
  10: "mdi:headset",
  11: "mdi:truck-cargo-container",
  12: "mdi:shopping-outline",
  13: "mdi:factory",
  14: "mdi:domain",
  15: "mdi:food-outline",
  17: "mdi:bank-outline",
  18: "mdi:flask-outline",
  19: "mdi:hospital-box-outline",
  20: "mdi:school-outline",
  21: "mdi:account-tie-outline",
};

export function iconifyForMajorCategoryNum(majorCategoryNum: number): string {
  return MAJOR_CATEGORY_ICONIFY[majorCategoryNum] ?? "mdi:briefcase-outline";
}
