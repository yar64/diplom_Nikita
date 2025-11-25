import { SearchBar } from './SearchBar';
import { FilterSelect } from './FilterSelect';
import ActionButton from '../ui/buttons/ActionButton';

export function FilterBar({
  search,
  filters = [],
  actions = [],
  className = "",
  'data-testid': testId,
  ...props
}) {
  return (
    <div 
      className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center ${className}`}
      data-testid={testId}
      {...props}
    >
      {/* Search */}
      <div className="flex-1 w-full sm:max-w-xs">
        <SearchBar
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder}
        />
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterSelect
              key={filter.key}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
              placeholder={filter.placeholder}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              type={action.type || 'button'} // Используем тип из action или fallback
              onClick={action.onClick}
              variant={action.variant || "solid"} // solid вариант для кнопок в формах
              size="md"
              showLabels={true}
              disabled={action.disabled}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </ActionButton>
          ))}
        </div>
      )}
    </div>
  );
}

// Компактная версия (опционально)
export function FilterBarCompact({
  search,
  filters = [],
  actions = [],
  className = "",
  'data-testid': testId,
  ...props
}) {
  return (
    <div 
      className={`flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50/50 rounded-2xl p-4 border border-gray-100 ${className}`}
      data-testid={testId}
      {...props}
    >
      {/* Search */}
      <div className="flex-1 w-full sm:max-w-xs">
        <SearchBar
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder}
        />
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterSelect
              key={filter.key}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
              placeholder={filter.placeholder}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              type={action.type || 'button'}
              onClick={action.onClick}
              variant={action.variant || "solid"}
              size="sm"
              showLabels={true}
              disabled={action.disabled}
            >
              {action.icon && <span className="mr-1">{action.icon}</span>}
              {action.label}
            </ActionButton>
          ))}
        </div>
      )}
    </div>
  );
}