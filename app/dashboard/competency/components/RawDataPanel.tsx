"use client";

export type RawDataTable = {
  title?: string;
  columns: string[];
  rows: Record<string, unknown>[];
};

type RawDataPanelProps = {
  tables: RawDataTable[];
};

function cellValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  if (typeof value === "number") return String(Math.round(value));
  return String(value);
}

export default function RawDataPanel({ tables }: RawDataPanelProps) {
  if (tables.length === 0) return null;

  return (
    <div className="border-t border-gray-200 bg-gray-50/60">
      <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
        {tables.map((table, idx) => (
          <div key={idx}>
            {table.title && (
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                {table.title}
              </h4>
            )}
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full min-w-[400px] text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {table.columns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={table.columns.length}
                        className="px-3 py-4 text-center text-gray-500"
                      >
                        데이터 없음
                      </td>
                    </tr>
                  ) : (
                    table.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="border-b border-gray-100 hover:bg-gray-50/80"
                      >
                        {table.columns.map((col) => (
                          <td
                            key={col}
                            className="px-3 py-2 text-gray-800 whitespace-nowrap"
                          >
                            {cellValue(row[col])}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
