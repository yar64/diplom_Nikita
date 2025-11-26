// components/admin/ui/buttons/ActionButton.jsx
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
import { useState, useEffect, useRef } from "react";

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

// Компонент dropdown для компактного режима
const DropdownActions = ({ actions, variant, size, isOpen, onToggle }) => {
  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const dropdownRef = useRef(null);

  // Обработчик клика вне dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 rounded p-1"
      >
        <MoreVertical className={iconSize[size]} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-32 py-1"> {/* Увеличил z-index до 50 и shadow-xl */}
          {actions.map((action, index) => {
            const IconComponent = actionIcons[action.type];
            const label = action.label || actionLabels[action.type];
            const color = actionColors[action.type];

            const variantClasses = {
              default: {
                blue: "text-blue-600 hover:bg-blue-50",
                gray: "text-gray-600 hover:bg-gray-50",
                red: "text-red-600 hover:bg-red-50",
                purple: "text-purple-600 hover:bg-purple-50",
                green: "text-green-600 hover:bg-green-50",
                indigo: "text-indigo-600 hover:bg-indigo-50",
                orange: "text-orange-600 hover:bg-orange-50"
              },
              minimal: {
                blue: "text-gray-600 hover:bg-blue-50 hover:text-blue-600",
                gray: "text-gray-600 hover:bg-gray-50",
                red: "text-gray-600 hover:bg-red-50 hover:text-red-600",
                purple: "text-gray-600 hover:bg-purple-50 hover:text-purple-600",
                green: "text-gray-600 hover:bg-green-50 hover:text-green-600",
                indigo: "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600",
                orange: "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
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

// Основной компонент ActionButton
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
  compact = true,
  direction = "horizontal",
  className = "",

  // Для использования как обычная кнопка
  type,
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
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          flex items-center transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 rounded
          ${size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'}
          ${variant === 'solid' ? 
            `bg-${color}-500 hover:bg-${color}-600 text-white focus:ring-${color}-500 px-3 py-1` :
            variant === 'minimal' ?
            `text-gray-400 hover:text-${color}-600 focus:ring-${color}-500` :
            `text-${color}-600 hover:text-${color}-800 focus:ring-${color}-500`
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        title={label}
      >
        {IconComponent && <IconComponent className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} ${showLabels ? 'mr-1' : ''}`} />}
        {showLabels && label}
      </button>
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

  return (
    <div className={`relative ${className}`}> {/* Добавил relative здесь тоже */}
      <DropdownActions
        actions={allActions}
        variant={variant}
        size={size}
        isOpen={isDropdownOpen}
        onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
      />
    </div>
  );
};

export default ActionButton;