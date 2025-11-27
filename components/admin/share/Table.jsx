export function Table({ 
  headers, 
  data, 
  emptyMessage = "Нет данных", 
  className = "",
  striped = true,
  hover = true,
  'data-testid': testId,
  ...props 
}) {
  if (!data || data.length === 0) {
    return (
      <div 
        className="bg-white rounded-2xl border-2 border-gray-100 p-12 text-center shadow-sm"
        data-testid={testId ? `${testId}-empty` : undefined}
      >
        <div className="text-gray-300 text-6xl mb-4">📊</div>
        {typeof emptyMessage === 'string' ? (
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
        ) : (
          emptyMessage
        )}
      </div>
    );
  }

  return (
    <div 
      className={`bg-white rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden ${className}`}
      data-testid={testId}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2 border-gray-50">
              {headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gray-50/50 uppercase tracking-wide"
                  data-header={header}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`
                  ${striped && rowIndex % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}
                  ${hover ? 'hover:bg-blue-50/50 transition-all duration-200 cursor-pointer' : ''}
                  group
                `}
                data-row={rowIndex}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="px-6 py-4 text-sm text-gray-800 group-hover:text-gray-900"
                    data-cell={`${headers[cellIndex]}-${rowIndex}`}
                  >
                    <div className="flex items-center">
                      {cell}
                    </div>
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