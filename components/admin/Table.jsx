// components/admin/Table.jsx
export function Table({ 
  headers, 
  data, 
  emptyMessage = "No data available", 
  className = "",
  striped = true,
  hover = true,
  'data-testid': testId,
  ...props 
}) {
  if (data.length === 0) {
    return (
      <div 
        className="bg-white rounded-2xl border border-gray-200 p-8 text-center"
        data-testid={testId ? `${testId}-empty` : undefined}
      >
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${className}`}
      data-testid={testId}
      data-variant={striped ? 'striped' : 'normal'}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700 bg-gray-50"
                  data-header={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`
                  ${striped && rowIndex % 2 === 0 ? 'bg-gray-50' : ''}
                  ${hover ? 'hover:bg-gray-100 transition-colors' : ''}
                `}
                data-row={rowIndex}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="px-6 py-4 text-sm text-gray-900"
                    data-cell={`${headers[cellIndex]}-${rowIndex}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}