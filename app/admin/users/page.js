  "use client";
  import { useState, useEffect } from "react";
  import {
    Users,
    UserCheck,
    TrendingUp,
    Search,
    Plus,
    Mail,
    Calendar,
    Globe,
    Eye,
    EyeOff,
  } from "lucide-react";
  import { StatCard } from "../../../components/admin/ui/data-display/StatCard";
  import { Table } from "../../../components/admin/share/Table";
  import { Tabs } from "../../../components/admin/share/Tabs";
  import { StatusBadge } from "../../../components/admin/ui/data-display/StatusBadge";
  import { UserModal } from "../../../components/admin/ui/modals/UserModal";
  import { UserProfileModal } from "../../../components/admin/ui/modals/UserProfileModal";
  import { ConfirmModal } from "../../../components/admin/ui/modals/ConfirmModal";
  import ActionButton from '../../../components/admin/ui/buttons/ActionButton'
  import { getUsers, deleteUser, getUserProfile } from "../../../server/user.actions";

  const tabs = [
    { id: "all", label: "Все пользователи" },
    { id: "students", label: "Студенты" },
    { id: "teachers", label: "Преподаватели" },
    { id: "admins", label: "Администраторы" },
  ];

  const roleColors = {
    USER: "gray",
    ADMIN: "red", 
    MENTOR: "blue"
  };

  export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [profileLoading, setProfileLoading] = useState(false);

    // Загрузка пользователей
    const loadUsers = async () => {
      setLoading(true);
      try {
        const result = await getUsers();
        if (result.success) {
          setUsers(result.users || []);
        } else {
          console.error("Ошибка загрузки пользователей:", result.error);
        }
      } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      loadUsers();
    }, []);

    // Функция для просмотра профиля пользователя
    const handleViewUser = async (userId) => {
      setProfileLoading(true);
      try {
        const result = await getUserProfile(userId);
        
        if (result.success) {
          setViewingUser(result.user);
          setIsUserProfileModalOpen(true);
        } else {
          console.error("Ошибка загрузки профиля:", result.error);
        }
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
      } finally {
        setProfileLoading(false);
      }
    };

    // Статистика
    const userStats = [
      {
        title: "Всего пользователей",
        value: users.length.toString(),
        subtitle: "Зарегистрировано",
        icon: <Users className="w-6 h-6" />,
        color: "blue",
        trend: { isPositive: true, value: "12" },
      },
      {
        title: "Активные пользователи",
        value: users.filter((u) => u.stats?.currentStreak > 0).length.toString(),
        subtitle: "Сейчас активны",
        icon: <UserCheck className="w-6 h-6" />,
        color: "green",
        trend: { isPositive: true, value: "8" },
      },
      {
        title: "Новые пользователи",
        value: users
          .filter((u) => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(u.createdAt) > weekAgo;
          })
          .length.toString(),
        subtitle: "За эту неделю",
        icon: <TrendingUp className="w-6 h-6" />,
        color: "purple",
        trend: { isPositive: true, value: "24" },
      },
    ];

    // Подготовка данных для таблицы
    const prepareTableData = () => {
      let filteredUsers = users;

      // Фильтрация по табу
      if (activeTab === "students") {
        filteredUsers = users.filter((user) => user.role === "USER");
      } else if (activeTab === "teachers") {
        filteredUsers = users.filter((user) => user.role === "MENTOR");
      } else if (activeTab === "admins") {
        filteredUsers = users.filter((user) => user.role === "ADMIN");
      }

      // Фильтрация по поиску
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${user.firstName || ""} ${user.lastName || ""}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
      }

      const headers = [
        "Пользователь",
        "Контакты",
        "Роль",
        "Дата регистрации",
        "Статус",
        "Действия",
      ];

      const data = filteredUsers.map((user) => [
        <div key={`user-${user.id}`} className="flex items-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-medium">
                {user.firstName?.[0] || user.username?.[0] || 'U'}
                {user.lastName?.[0] || ''}
              </span>
            </div>
          )}
          <div>
            <div className="font-medium text-gray-900">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username || user.email}
            </div>
            <div className="text-sm text-gray-500">@{user.username}</div>
          </div>
        </div>,
        <div key={`contact-${user.id}`} className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            {user.email}
          </div>
          {user.timezone && (
            <div className="flex items-center text-xs text-gray-500">
              <Globe className="w-3 h-3 mr-1" />
              {user.timezone}
            </div>
          )}
        </div>,
        <StatusBadge 
          key={`role-${user.id}`} 
          status={user.role} 
          variant={roleColors[user.role] || 'default'}
        />,
        <div
          key={`date-${user.id}`}
          className="flex items-center text-sm text-gray-600"
        >
          <Calendar className="w-4 h-4 mr-2" />
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Н/Д'}
        </div>,
        <div key={`status-${user.id}`} className="flex items-center">
          <StatusBadge status={user.stats?.currentStreak > 0 ? "Активен" : "Неактивен"} />
          <div className="ml-2">
            {user.isPublic ? (
              <Eye className="w-4 h-4 text-green-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </div>
        </div>,
        <ActionButton
          key={`actions-${user.id}`}
          actions={[
            {
              type: "view",
              onClick: () => handleViewUser(user.id),
            },
            {
              type: "edit",
              onClick: () => {
                setSelectedUser(user);
                setIsUserModalOpen(true);
              },
            },
            {
              type: "delete", 
              onClick: () => {
                setUserToDelete(user);
                setIsDeleteModalOpen(true);
              },
            },
          ]}
          variant="default"
          size="sm"
        />
      ]);

      return { headers, data, filteredUsers };
    };

    const { headers, data, filteredUsers } = prepareTableData();

   const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      const result = await deleteUser(userToDelete.id);

      if (result.success) {
        // ⚠️ ПРОБЛЕМА: Делаем задержку 500ms, а потом loadUsers
        await new Promise(resolve => setTimeout(resolve, 500));
        await loadUsers(); // ⬅️ Это может занять время

        setIsDeleteModalOpen(false); // ⬅️ Закрываем ПОСЛЕ загрузки
        setUserToDelete(null);
      } else {
        // ⚠️ ПРОБЛЕМА: При ошибке окно НЕ закрывается!
        alert(result.error);
        // Модальное окно остается открытым с ошибкой
      }
    } catch (error) {
      // ⚠️ ПРОБЛЕМА: При исключении окно НЕ закрывается!
      alert("Произошла непредвиденная ошибка");
    } finally {
      setIsDeleting(false);
    }
  };

// Добавьте состояние в компонент
const [isDeleting, setIsDeleting] = useState(false);

    const handleUserSuccess = () => {
      loadUsers();
    };

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка пользователей...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Заголовок страницы */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Управление пользователями
            </h1>
            <p className="text-gray-600 mt-1">
              Управление и мониторинг всех пользователей системы
            </p>
          </div>
          <ActionButton
            type="add"
            onClick={() => {
              setSelectedUser(null);
              setIsUserModalOpen(true);
            }}
            variant="solid"
            size="md"
            showLabels={true}
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить пользователя
          </ActionButton>
        </div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {userStats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </div>

        {/* Основной контент с табами */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {/* Навигация табами */}
          <Tabs tabs={tabs} defaultTab="all" onTabChange={setActiveTab} />

          {/* Контент табов */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Показано {filteredUsers.length} из {users.length} пользователей
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск пользователей..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
              </div>
            </div>

            {/* Таблица */}
            <Table
              headers={headers}
              data={data}
              striped={true}
              hover={true}
              emptyMessage={
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Пользователи не найдены
                  </div>
                  <div className="text-gray-500 mb-4">
                    {searchTerm
                      ? "Попробуйте изменить условия поиска"
                      : "Начните с создания первого пользователя"}
                  </div>
                  {!searchTerm && (
                    <ActionButton
                      type="add"
                      onClick={() => setIsUserModalOpen(true)}
                      variant="solid"
                      size="md"
                      showLabels={true}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить пользователя
                    </ActionButton>
                  )}
                </div>
              }
            />

            {/* Пагинация */}
            {filteredUsers.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Показано с 1 по {Math.min(filteredUsers.length, 10)} из{" "}
                  {filteredUsers.length} результатов
                </div>
                <div className="flex space-x-2">
                  <ActionButton
                    type="button"
                    onClick={() => console.log("Previous")}
                    variant="minimal"
                    size="sm"
                    showLabels={true}
                  >
                    Назад
                  </ActionButton>
                  <ActionButton
                    type="button"
                    onClick={() => console.log("Page 1")}
                    variant="solid"
                    size="sm"
                  >
                    1
                  </ActionButton>
                  {filteredUsers.length > 10 && (
                    <ActionButton
                      type="button"
                      onClick={() => console.log("Page 2")}
                      variant="minimal"
                      size="sm"
                    >
                      2
                    </ActionButton>
                  )}
                  <ActionButton
                    type="button"
                    onClick={() => console.log("Next")}
                    variant="minimal"
                    size="sm"
                    showLabels={true}
                  >
                    Вперед
                  </ActionButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Модальные окна */}
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => {
            setIsUserModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSuccess={handleUserSuccess}
        />

        <UserProfileModal
          isOpen={isUserProfileModalOpen}
          onClose={() => {
            setIsUserProfileModalOpen(false);
            setViewingUser(null);
          }}
          user={viewingUser}
          loading={profileLoading}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
          }}
          onConfirm={handleDeleteUser}
          title="Удалить пользователя"
          message={
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="text-gray-600 mb-2">
                Вы уверены, что хотите удалить{" "}
                <strong>{userToDelete?.username || userToDelete?.email}</strong>?
              </div>
              <div className="text-sm text-gray-500">
                Это действие нельзя отменить, и все данные пользователя будут удалены безвозвратно.
              </div>
            </div>
          }
          confirmLabel={isDeleting ? "Удаление..." : "Удалить пользователя"}
          isConfirming={isDeleting}  // Передаем состояние загрузки
          variant="delete"
        />
      </div>
    );
  }