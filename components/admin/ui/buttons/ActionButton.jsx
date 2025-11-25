// components/admin/ui/buttons/ActionButtons.jsx
"use client";
import { 
  Edit3, 
  Eye, 
  Trash2, 
  BarChart3, 
  MoreVertical,
  Download,
  Share,
  Copy,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Settings,
  User,
  Mail,
  Lock,
  Unlock
} from "lucide-react";
import { useState } from "react";

// Иконки по типам действий
const actionIcons = {
  edit: Edit3,
  view: Eye,
  delete: Trash2,
  stats: BarChart3,
  download: Download,
  share: Share,
  copy: Copy,
  add: Plus,
  search: Search,
  filter: Filter,
  refresh: RefreshCw,
  settings: Settings,
  user: User,
  mail: Mail,
  lock: Lock,
  unlock: Unlock
};

// Лейблы по типам действий
const actionLabels = {
  edit: "Edit",
  view: "View",
  delete: "Delete",
  stats: "Stats",
  download: "Download",
  share: "Share",
  copy: "Copy",
  add: "Add",
  search: "Search",
  filter: "Filter",
  refresh: "Refresh",
  settings: "Settings",
  user: "User",
  mail: "Mail",
  lock: "Lock",
  unlock: "Unlock"
};

// Цвета по типам действий
const actionColors = {
  edit: "blue",
  view: "gray",
  delete: "red",
  stats: "purple",
  download: "green",
  share: "indigo",
  copy: "orange",
  add: "blue",
  search: "gray",
  filter: "gray",
  refresh: "blue",
  settings: "gray",
  user: "blue",
  mail: "blue",
  lock: "red",
  unlock: "green"
};

// Компонент одиночной кнопки
const SingleActionButton = ({ 
  type,
  label,
  icon: IconComponent,
  color,
  variant,
  size,
  showLabels,
  onClick,
  disabled,
  className = ""
}) => {
  const baseClasses = "flex items-center transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 rounded";
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const variantClasses = {
    default: {
      blue: "text-blue-600 hover:text-blue-800 focus:ring-blue-500",
      gray: "text-gray-600 hover:text-gray-800 focus:ring-gray-500",
      red: "text-red-600 hover:text-red-800 focus:ring-red-500",
      purple: "text-purple-600 hover:text-purple-800 focus:ring-purple-500",
      green: "text-green-600 hover:text-green-800 focus:ring-green-500",
      indigo: "text-indigo-600 hover:text-indigo-800 focus:ring-indigo-500",
      orange: "text-orange-600 hover:text-orange-800 focus:ring-orange-500"
    },
    minimal: {
      blue: "text-gray-400 hover:text-blue-600 focus:ring-blue-500",
      gray: "text-gray-400 hover:text-gray-600 focus:ring-gray-500",
      red: "text-gray-400 hover:text-red-600 focus:ring-red-500",
      purple: "text-gray-400 hover:text-purple-600 focus:ring-purple-500",
      green: "text-gray-400 hover:text-green-600 focus:ring-green-500",
      indigo: "text-gray-400 hover:text-indigo-600 focus:ring-indigo-500",
      orange: "text-gray-400 hover:text-orange-600 focus:ring-orange-500"
    },
    solid: {
      blue: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 px-3 py-1",
      gray: "bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500 px-3 py-1",
      red: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 px-3 py-1",
      purple: "bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500 px-3 py-1",
      green: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 px-3 py-1",
      indigo: "bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-500 px-3 py-1",
      orange: "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500 px-3 py-1"
    }
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]?.[color] || variantClasses[variant]?.gray}
        ${disabled ? disabledClasses : ''}
        ${className}
      `}
      title={label}
    >
      {IconComponent && <IconComponent className={`${iconSize[size]} ${showLabels ? 'mr-1' : ''}`} />}
      {showLabels && label}
    </button>
  );
};

// Компонент dropdown для компактного режима
const DropdownActions = ({ actions, variant, size, isOpen, onToggle }) => {
  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 rounded"
      >
        <MoreVertical className={iconSize[size]} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32 py-1">
          {actions.map((action, index) => {
            const IconComponent = actionIcons[action.type];
            const label = action.label || actionLabels[action.type];
            const color = action.color || actionColors[action.type];

            const variantClasses = {
              default: {
                blue: "text-blue-600 hover:bg-blue-50",
                gray: "text-gray-600 hover:bg-gray-50",
                red: "text-red-600 hover:bg-red-50",
                purple: "text-purple-600 hover:bg-purple-50"
              },
              minimal: {
                blue: "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
                gray: "text-gray-600 hover:bg-gray-50",
                red: "text-gray-600 hover:bg-red-50 hover:text-red-600",
                purple: "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }
            };

            return (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  onToggle();
                }}
                className={`w-full px-3 py-2 text-left flex items-center text-sm transition-colors ${
                  variantClasses[variant]?.[color] || variantClasses[variant]?.gray
                }`}
              >
                {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Основной компонент ActionButtons
const ActionButton = ({ 
  // Поддержка legacy пропсов для обратной совместимости
  onEdit, 
  onView, 
  onDelete, 
  onStats,

  // Новый универсальный формат
  actions = [],

  // Настройки отображения
  variant = "default",
  size = "sm",
  showLabels = false,
  compact = false,
  direction = "horizontal", // horizontal | vertical
  className = "",

  // Для использования как обычная кнопка
  type, // если указан type, то компонент работает как одиночная кнопка
  children,
  onClick,
  disabled = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Если используется как одиночная кнопка
  if (type) {
    const IconComponent = actionIcons[type];
    const label = actionLabels[type] || children;
    const color = actionColors[type] || "gray";

    return (
      <SingleActionButton
        type={type}
        label={label}
        icon={IconComponent}
        color={color}
        variant={variant}
        size={size}
        showLabels={showLabels}
        onClick={onClick}
        disabled={disabled}
        className={className}
      />
    );
  }

  // Подготовка действий из legacy пропсов
  const legacyActions = [];
  if (onEdit) legacyActions.push({ type: 'edit', onClick: onEdit });
  if (onView) legacyActions.push({ type: 'view', onClick: onView });
  if (onDelete) legacyActions.push({ type: 'delete', onClick: onDelete });
  if (onStats) legacyActions.push({ type: 'stats', onClick: onStats });

  const allActions = [...legacyActions, ...actions];

  if (allActions.length === 0) return null;

  // Компактный режим с dropdown
  if (compact && allActions.length > 2) {
    const mainActions = allActions.slice(0, 2);
    const dropdownActions = allActions.slice(2);

    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {mainActions.map((action, index) => (
          <SingleActionButton
            key={index}
            type={action.type}
            label={action.label || actionLabels[action.type]}
            icon={actionIcons[action.type]}
            color={action.color || actionColors[action.type]}
            variant={variant}
            size={size}
            showLabels={showLabels}
            onClick={action.onClick}
            disabled={action.disabled}
          />
        ))}

        <DropdownActions
          actions={dropdownActions}
          variant={variant}
          size={size}
          isOpen={isDropdownOpen}
          onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
        />
      </div>
    );
  }

  // Обычный режим
  return (
    <div className={`flex ${direction === 'vertical' ? 'flex-col space-y-1' : 'items-center space-x-2'} ${className}`}>
      {allActions.map((action, index) => (
        <SingleActionButton
          key={index}
          type={action.type}
          label={action.label || actionLabels[action.type]}
          icon={actionIcons[action.type]}
          color={action.color || actionColors[action.type]}
          variant={variant}
          size={size}
          showLabels={showLabels}
          onClick={action.onClick}
          disabled={action.disabled}
        />
      ))}
    </div>
  );
};

export default ActionButton;