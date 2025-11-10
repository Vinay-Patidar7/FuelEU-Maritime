import React from "react";

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
}

const Table = <T extends { [key: string]: any }>({
  columns,
  data,
  isLoading = false,
}: TableProps<T>): React.ReactElement => {
  return (
    <div className="overflow-x-auto bg-navy-900 rounded-lg shadow">
      <table className="min-w-full divide-y divide-navy-700">
        <thead className="bg-navy-800">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider ${
                  col.className || ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-800">
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-400"
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-10 text-gray-400"
              >
                No data available.
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={item.id || item.routeId || rowIndex}
                className="hover:bg-navy-800/50 transition-colors duration-200"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-200 ${
                      col.className || ""
                    }`}
                  >
                    {col.accessor(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
