export function FilterSelect({
  value,
  onChange,
  options,
  placeholder = "Выберите...",
  className = "",
  'data-testid': testId,
  ...props
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
        transition-all duration-200 appearance-none cursor-pointer
        ${className}
      `}
      data-testid={testId}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}