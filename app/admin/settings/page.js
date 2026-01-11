// app/admin/settings/page.js
"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Users, 
  Shield, 
  Database,
  BarChart3,
  Globe,
  Save,
  RefreshCw,
  Plus,
  Target,
  BookOpen,
  Briefcase,
  Search,
  Eye,
  Calendar,
  FileText,
  Lock,
  Trash2,
  Download,
  Filter,
  Activity,
  UserCheck,
  Bell,
  EyeOff,
  Palette,
  GraduationCap,  // ← Уже есть
  Key
} from "lucide-react";
import { Table } from "../../../components/admin/share/Table";
import { StatCard } from "../../../components/admin/ui/data-display/StatCard";
import { Tabs } from "../../../components/admin/share/Tabs";
import { StatusBadge } from "../../../components/admin/ui/data-display/StatusBadge";
import ActionButton from "../../../components/admin/ui/buttons/ActionButton";
import { 
  getSystemStats, 
  getUsers, 
  updateUserRole, 
  deleteUser,
  getSystemSettings,
  updateSystemSetting,  // Обратите внимание: updateSystemSetting (не updateSystemSettings)
  createSystemSetting,
  getAuditLogs,
  getUserSettings,
  updateUserSettings,
  getSettingsStats,
  cleanupOldData,
  getSkillsStats,
  runSystemMaintenance,
  exportData,
  backupData  // Теперь эта функция существует
} from "../../../server/settings.actions";
import { UserModal } from "../../../components/admin/ui/modals/UserModal";
import { ConfirmModal } from "../../../components/admin/ui/modals/ConfirmModal";

const tabs = [
  { id: "overview", label: "Обзор системы" },
  { id: "users", label: "Управление пользователями" },
  { id: "system", label: "Системные настройки" },
  { id: "audit", label: "Журнал аудита" },
  { id: "settings", label: "Настройки пользователей" },
  { id: "maintenance", label: "Обслуживание" },
];

const roleOptions = [
  { value: "USER", label: "Пользователь" },
  { value: "ADMIN", label: "Администратор" },
  { value: "MENTOR", label: "Наставник" },
];

const roleColors = {
  USER: "gray",
  ADMIN: "red", 
  MENTOR: "blue"
};

const settingCategories = {
  GENERAL: "general",
  SECURITY: "security",
  NOTIFICATIONS: "notifications",
  APPEARANCE: "appearance",
  LEARNING: "learning",
  PRIVACY: "privacy",
  SYSTEM: "system",
  COMMUNITY: "community"
};

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  
  // Состояния для данных
  const [systemStats, setSystemStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [systemSettings, setSystemSettings] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [settingsStats, setSettingsStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Состояния для модальных окон
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCleanupModalOpen, setIsCleanupModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUserSettings, setSelectedUserSettings] = useState(null);

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, [activeTab, page]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "overview":
          const [statsResult, settingsStatsResult] = await Promise.all([
            getSystemStats(),
            getSettingsStats()
          ]);
          if (statsResult.success) setSystemStats(statsResult.stats);
          if (settingsStatsResult.success) setSettingsStats(settingsStatsResult.stats);
          break;
        case "users":
          const usersResult = await getUsers();
          if (usersResult.success) setUsers(usersResult.users || []);
          break;
        case "system":
          const settingsResult = await getSystemSettings();
          if (settingsResult.success) setSystemSettings(settingsResult.settings || {});
          break;
        case "audit":
          const auditResult = await getAuditLogs(page, 20);
          if (auditResult.success) {
            setAuditLogs(auditResult.logs || []);
            setPagination(auditResult.pagination || {});
          }
          break;
        case "settings":
          const settingsStatsResult2 = await getSettingsStats();
          if (settingsStatsResult2.success) setSettingsStats(settingsStatsResult2.stats);
          break;
      }
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  // Функции для управления пользователями
  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleUserSuccess = () => {
    loadData();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Ошибка при изменении роли");
    }
  };

  const handleDeleteUser = (user) => {
    setDeletingUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteUser(deletingUser.id);
      if (result.success) {
        setUsers(users.filter(user => user.id !== deletingUser.id));
        setIsDeleteModalOpen(false);
        setDeletingUser(null);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Ошибка при удалении пользователя");
    } finally {
      setIsDeleting(false);
    }
  };

  // Функции для системных настроек
  const handleSettingChange = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], value }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Сохраняем каждую настройку отдельно
      const promises = Object.entries(systemSettings).map(([key, setting]) => 
        updateSystemSetting(key, setting.value)  // ← Правильное имя функции
      );
      
      const results = await Promise.all(promises);
      const allSuccess = results.every(result => result.success);
      
      if (allSuccess) {
        alert("Настройки успешно сохранены!");
      } else {
        alert("Ошибка при сохранении некоторых настроек");
      }
    } catch (error) {
      alert("Ошибка при сохранении настроек");
    } finally {
      setSaving(false);
    }
  };

  // Функции для управления настройками пользователей
  const handleViewUserSettings = async (userId) => {
    try {
      const result = await getUserSettings(userId);
      if (result.success) {
        setSelectedUserSettings(result.settings);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Ошибка при загрузке настроек пользователя");
    }
  };

  const handleUpdateUserSettings = async (userId, settingsType, data) => {
    try {
      const result = await updateUserSettings(userId, settingsType, data);
      if (result.success) {
        alert("Настройки пользователя обновлены!");
        setSelectedUserSettings(null);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Ошибка при обновлении настроек пользователя");
    }
  };

  // Функции для обслуживания
  const handleCleanupData = async (days = 30) => {
    try {
      const result = await cleanupOldData(days);
      if (result.success) {
        alert(`Удалено ${result.result.deletedSessions} сессий и ${result.result.deletedNotifications} уведомлений`);
        setIsCleanupModalOpen(false);
        loadData();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Ошибка при очистке данных");
    }
  };

  const handleBackupData = async () => {
    try {
      const result = await backupData();
      if (result.success) {
        alert(`Бэкап создан: ${result.backup.timestamp}`);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Ошибка при создании бэкапа");
    }
  };

  // Преобразование данных для таблицы пользователей
  const getUsersTableData = () => {
    let filteredUsers = users;
    
    if (search) {
      filteredUsers = filteredUsers.filter(user => 
        user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        (user.firstName && user.firstName.toLowerCase().includes(search.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    if (roleFilter) {
      filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
    }

    return filteredUsers.map(user => [
      <div key={user.id} className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            (user.username?.[0] || user.email?.[0] || 'U').toUpperCase()
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">
            {user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user.username || user.email
            }
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>,
      <StatusBadge 
        key={`${user.id}-role`}
        status={user.role} 
        variant={roleColors[user.role] || 'default'}
      />,
      <div key={`${user.id}-stats`} className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <Target className="w-4 h-4" />
          <span>{user._count?.skills || 0}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Briefcase className="w-4 h-4" />
          <span>{user._count?.projects || 0}</span>
        </div>
        <div className="flex items-center space-x-1">
          <BookOpen className="w-4 h-4" />
          <span>{user._count?.sessions || 0}</span>
        </div>
      </div>,
      <div key={`${user.id}-goal`} className="text-sm text-gray-600">
        {user.dailyGoal || 30}мин/день
      </div>,
      <div key={`${user.id}-date`} className="text-sm text-gray-600">
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Н/Д'}
      </div>,
      <ActionButton
        key={`${user.id}-actions`}
        actions={[
          {
            type: "edit",
            onClick: () => handleEditUser(user),
          },
          {
            type: "view",
            onClick: () => handleViewUserSettings(user.id),
          },
          {
            type: "delete",
            onClick: () => handleDeleteUser(user),
          },
        ]}
        variant="default"
        size="sm"
      />,
    ]);
  };

  // Преобразование данных для таблицы аудита
  const getAuditTableData = () => {
    return auditLogs.map(log => [
      <div key={log.id} className="text-sm font-medium text-gray-900">
        {log.action}
      </div>,
      <div key={`${log.id}-resource`} className="text-sm text-gray-600">
        {log.resource} {log.resourceId ? `#${log.resourceId}` : ''}
      </div>,
      <div key={`${log.id}-user`} className="text-sm text-gray-600">
        {log.user ? (
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
              {log.user.username?.[0] || log.user.email?.[0]}
            </div>
            <span>{log.user.username || log.user.email}</span>
          </div>
        ) : (
          'Система'
        )}
      </div>,
      <div key={`${log.id}-ip`} className="text-sm text-gray-500">
        {log.ipAddress || 'Н/Д'}
      </div>,
      <div key={`${log.id}-date`} className="text-sm text-gray-500">
        {new Date(log.createdAt).toLocaleString()}
      </div>,
    ]);
  };

  // Рендер контента табов
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Основная статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Всего пользователей"
                value={systemStats?.users?.toString() || "0"}
                subtitle="Всего пользователей"
                icon={<Users className="w-6 h-6" />}
                color="blue"
              />
              <StatCard
                title="Навыков в системе"
                value={systemStats?.skills?.toString() || "0"}
                subtitle="Всего навыков"
                icon={<Target className="w-6 h-6" />}
                color="green"
              />
              <StatCard
                title="Проектов создано"
                value={systemStats?.projects?.toString() || "0"}
                subtitle="Всего проектов"
                icon={<Briefcase className="w-6 h-6" />}
                color="amber"
              />
              <StatCard
                title="Сессий обучения"
                value={systemStats?.sessions?.toString() || "0"}
                subtitle="Учебных сессий"
                icon={<BookOpen className="w-6 h-6" />}
                color="purple"
              />
            </div>
        
            {/* Дополнительная статистика */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Сообществ"
                value={systemStats?.communities?.toString() || "0"}
                subtitle="Сообществ"
                icon={<Users className="w-6 h-6" />}
                color="indigo"
              />
              <StatCard
                title="Целей поставлено"
                value={systemStats?.goals?.toString() || "0"}
                subtitle="Поставленных целей"
                icon={<Target className="w-6 h-6" />}
                color="red"
              />
              <StatCard
                title="Курсов"
                value={systemStats?.courses?.toString() || "0"}
                subtitle="Доступных курсов"
                icon={<GraduationCap className="w-6 h-6" />}
                color="emerald"
              />
            </div>
        
            {/* Статистика по настройкам */}
            {settingsStats && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  Статистика настроек пользователей
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{settingsStats.generalPercentage}%</div>
                    <div className="text-sm text-blue-600">Основные настройки</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{settingsStats.notificationsPercentage}%</div>
                    <div className="text-sm text-green-600">Уведомления</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{settingsStats.privacyPercentage}%</div>
                    <div className="text-sm text-purple-600">Приватность</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{settingsStats.learningPercentage}%</div>
                    <div className="text-sm text-amber-600">Обучение</div>
                  </div>
                </div>
              </div>
            )}

            {/* Активность */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Активность системы
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Сессии за последние 7 дней</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {systemStats?.recentActivity?.sessions || 0}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Новые пользователи (7 дней)</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {systemStats?.recentActivity?.newUsers || 0}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Завершенные цели (7 дней)</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {systemStats?.recentActivity?.completedGoals || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Показано {users.length} из {users.length} пользователей
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск пользователей..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Все роли</option>
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Table
              headers={[
                "Пользователь",
                "Роль",
                "Активность",
                "Дневная цель",
                "Дата регистрации",
                "Действия",
              ]}
              data={getUsersTableData()}
              striped={true}
              hover={true}
            />
          </div>
        );

      case "system":
        return (
          <div className="space-y-6">
            {/* Основные настройки */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Основные настройки
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название сайта
                  </label>
                  <input
                    type="text"
                    value={systemSettings.siteName?.value || ""}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание сайта
                  </label>
                  <textarea
                    value={systemSettings.siteDescription?.value || ""}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Настройки безопасности */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Настройки безопасности
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Требовать подтверждение email
                    </label>
                    <p className="text-sm text-gray-500">
                      Пользователи должны подтверждать email при регистрации
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.requireEmailVerification?.value || false}
                      onChange={(e) => handleSettingChange('requireEmailVerification', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={loadData}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Сбросить
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить настройки
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case "audit":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Показано {auditLogs.length} из {pagination.total || 0} записей
              </div>
              <div className="flex items-center space-x-2">
                {pagination.pages > 1 && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                    >
                      Назад
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600">
                      Страница {page} из {pagination.pages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                      disabled={page === pagination.pages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                    >
                      Вперед
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Table
              headers={[
                "Действие",
                "Ресурс",
                "Пользователь",
                "IP Адрес",
                "Дата и время",
              ]}
              data={getAuditTableData()}
              striped={true}
              hover={true}
            />
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            {settingsStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  title="Сообществ"
                  value={systemStats?.communities?.toString() || "0"}
                  subtitle="Сообществ"
                  icon={<Users className="w-6 h-6" />}
                  color="indigo"
                />
                <StatCard
                  title="Целей поставлено"
                  value={systemStats?.goals?.toString() || "0"}
                  subtitle="Поставленных целей"
                  icon={<Target className="w-6 h-6" />}
                  color="red"
                />
                <StatCard
                  title="Курсов"
                  value={systemStats?.courses?.toString() || "0"}  
                  subtitle="Доступных курсов"
                  icon={<GraduationCap className="w-6 h-6" />}
                  color="emerald"
                />
              </div>
            )}
          </div>
        );

      case "maintenance":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trash2 className="w-5 h-5 mr-2" />
                Очистка данных
              </h3>
              <p className="text-gray-600 mb-4">
                Удалите старые данные для освобождения места в базе данных.
              </p>
              <button
                onClick={() => setIsCleanupModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Очистить старые данные
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Резервное копирование
              </h3>
              <p className="text-gray-600 mb-4">
                Создайте резервную копию всех данных системы.
              </p>
              <button
                onClick={handleBackupData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Создать бэкап
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Заголовок страницы */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="w-8 h-8 mr-3" />
            Системные настройки
          </h1>
          <p className="text-gray-600 mt-1">
            Управление системой и пользователями
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Database className="w-4 h-4" />
          <span>SQLite</span>
        </div>
      </div>

      {/* Основной контент с табами */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Навигация табами */}
        <Tabs tabs={tabs} defaultTab="overview" onTabChange={setActiveTab} />

        {/* Контент табов */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Кнопка добавления пользователя */}
      {activeTab === "users" && (
        <div className="fixed bottom-6 right-6">
          <ActionButton
            type="add"
            onClick={handleAddUser}
            variant="solid"
            size="lg"
            showLabels={true}
          >
            <Plus className="w-5 h-5 mr-2" />
            Добавить пользователя
          </ActionButton>
        </div>
      )}

      {/* Модальные окна */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={handleCloseUserModal}
        user={editingUser}
        onSuccess={handleUserSuccess}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Удаление пользователя"
        message={`Вы уверены, что хотите удалить пользователя "${deletingUser?.username || deletingUser?.email}"? Все связанные данные также будут удалены. Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        variant="delete"
        isConfirming={isDeleting}
      />

      <ConfirmModal
        isOpen={isCleanupModalOpen}
        onClose={() => setIsCleanupModalOpen(false)}
        onConfirm={() => handleCleanupData(30)}
        title="Очистка данных"
        message="Вы уверены, что хотите удалить все сессии и прочитанные уведомления старше 30 дней? Это действие нельзя отменить."
        confirmLabel="Очистить"
        cancelLabel="Отмена"
        variant="delete"
      />
    </div>
  );
}