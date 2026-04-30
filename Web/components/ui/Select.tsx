import { SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: Option[];
  children?: React.ReactNode;
}

export default function Select({
  options,
  children,
  className = "",
  ...props
}: SelectProps) {
  return (
    <select
      className={`rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {options
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </select>
  );
}
