// components/admin/ChartContainer.jsx
export function ChartContainer({ title, children, className = "", ...props }) {
  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}
      {...props}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="w-full h-64">
        {children}
      </div>
    </div>
  );
}