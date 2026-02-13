"use client";

import Icon from "@/components/ui/Icon";

type RawDataButtonProps = {
  onClick: () => void;
  isOpen?: boolean;
};

export default function RawDataButton({ onClick, isOpen }: RawDataButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      title="Raw 데이터 보기"
    >
      <Icon name="table" size={14} />
      RawData
    </button>
  );
}
