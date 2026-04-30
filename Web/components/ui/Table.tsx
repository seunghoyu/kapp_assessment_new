interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export default function Table({ children, className = "" }: TableProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}>
      <table className="w-full">{children}</table>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      {children}
    </thead>
  );
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function TableRow({
  children,
  className = "",
  hover = true,
}: TableRowProps) {
  return (
    <tr
      className={`border-b border-gray-200 ${
        hover ? "transition-colors hover:bg-gray-50" : ""
      } ${className}`}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHead({ children, className = "" }: TableHeadProps) {
  return (
    <th className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 ${className}`}>
      {children}
    </th>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`px-6 py-4 text-sm text-gray-700 ${className}`}>
      {children}
    </td>
  );
}
