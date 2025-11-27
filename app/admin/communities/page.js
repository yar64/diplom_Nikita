// app/admin/community/page.js
"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  MessageSquare, 
  Search, 
  Plus,
  Settings,
  User,
  Shield,
  Edit,
  Trash2,
  Eye,
  Lock,
  Globe
} from "lucide-react";
import { Table } from "../../../components/admin/share/Table";
import { StatCard } from "../../../components/admin/ui/data-display/StatCard";
import { Tabs } from "../../../components/admin/share/Tabs";
import { StatusBadge } from "../../../components/admin/ui/data-display/StatusBadge";
import ActionButton from "../../../components/admin/ui/buttons/ActionButton";
import { 
  getCommunities, 
  deleteCommunity, 
  getCommunityMembers,
  updateMemberRole,
  removeMember,
  getCommunityPosts,
  deleteCommunityPost 
} from "../../../server/community.actions";
import { CommunityModal } from "../../../components/admin/ui/modals/CommunityModal";
import { ConfirmModal } from "../../../components/admin/ui/modals/ConfirmModal";

const tabs = [
  { id: "communities", label: "Сообщества" },
  { id: "members", label: "Управление участниками" },
  { id: "posts", label: "Сообщения сообществ" },
];

const visibilityOptions = [
  { value: "", label: "Все сообщества" },
  { value: "public", label: "Публичные" },
  { value: "private", label: "Приватные" },
];

const roleOptions = [
  { value: "", label: "Все роли" },
  { value: "MEMBER", label: "Участник" },
  { value: "MODERATOR", label: "Модератор" },
  { value: "ADMIN", label: "Администратор" },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("communities");
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("");
  const [role, setRole] = useState("");
  
  // Состояния для данных
  const [communities, setCommunities] = useState([]);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCommunities: 0,
    totalMembers: 0,
    totalPosts: 0,
    activeCommunities: 0
  });

  // Состояния для модальных окон
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, [activeTab, selectedCommunity]);

  const loadData = async () => {
    setLoading(true);
    try {
      const communitiesResult = await getCommunities();
      
      if (communitiesResult.success) {
        setCommunities(communitiesResult.communities || []);
        
        // Если выбрано сообщество, загружаем его участников и сообщения
        if (selectedCommunity) {
          const [membersResult, postsResult] = await Promise.all([
            getCommunityMembers(selectedCommunity.id),
            getCommunityPosts(selectedCommunity.id)
          ]);
          
          if (membersResult.success) setMembers(membersResult.members || []);
          if (postsResult.success) setPosts(postsResult.posts || []);
        } else if (communitiesResult.communities.length > 0) {
          // По умолчанию выбираем первое сообщество
          setSelectedCommunity(communitiesResult.communities[0]);
        }
      }

      await loadStats();
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const totalCommunities = communities.length;
    const totalMembers = communities.reduce((acc, community) => 
      acc + (community._count?.members || 0), 0
    );
    const totalPosts = communities.reduce((acc, community) => 
      acc + (community._count?.posts || 0), 0
    );
    const activeCommunities = communities.filter(c => c._count?.members > 0).length;
    
    setStats({
      totalCommunities,
      totalMembers,
      totalPosts,
      activeCommunities
    });
  };

  // Функции для сообществ
  const handleAddCommunity = () => {
    setEditingCommunity(null);
    setIsCommunityModalOpen(true);
  };

  const handleEditCommunity = (community) => {
    setEditingCommunity(community);
    setIsCommunityModalOpen(true);
  };

  const handleCloseCommunityModal = () => {
    setIsCommunityModalOpen(false);
    setEditingCommunity(null);
  };

  const handleCommunitySuccess = () => {
    loadData();
  };

  const handleCommunitySelect = (community) => {
    setSelectedCommunity(community);
  };

  // Функции для удаления
  const handleDeleteClick = (item, type) => {
    setDeletingItem({ ...item, type });
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingItem(null);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    
    setIsDeleting(true);
    try {
      let result;
      if (deletingItem.type === 'community') {
        result = await deleteCommunity(deletingItem.id);
        if (result.success) {
          setCommunities(communities.filter(community => community.id !== deletingItem.id));
          if (selectedCommunity?.id === deletingItem.id) {
            setSelectedCommunity(null);
          }
        }
      } else if (deletingItem.type === 'post') {
        result = await deleteCommunityPost(deletingItem.id);
        if (result.success) {
          setPosts(posts.filter(post => post.id !== deletingItem.id));
        }
      } else if (deletingItem.type === 'member') {
        result = await removeMember(selectedCommunity.id, deletingItem.userId);
        if (result.success) {
          setMembers(members.filter(member => member.userId !== deletingItem.userId));
        }
      }

      if (result && !result.success) {
        alert(result.error);
      }
      
      handleCloseDeleteModal();
    } catch (error) {
      alert("Ошибка при удалении");
      handleCloseDeleteModal();
    }
  };

  // Функция для изменения роли участника
  const handleRoleChange = async (member, newRole) => {
    try {
      const result = await updateMemberRole(member.communityId, member.userId, newRole);
      if (result.success) {
        setMembers(members.map(m => 
          m.userId === member.userId ? { ...m, role: newRole } : m
        ));
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert("Ошибка при изменении роли");
    }
  };

  // Функция для отображения аватаров участников
  const renderMemberAvatars = (members) => {
    if (!members || members.length === 0) {
      return (
        <div className="flex -space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
        </div>
      );
    }

    const visibleMembers = members.slice(0, 5);
    const remainingMembers = Math.max(0, members.length - 5);

    return (
      <div className="flex -space-x-2">
        {visibleMembers.map((member) => (
          <div 
            key={member.id}
            className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
            title={member.user?.username}
          >
            {member.user?.avatar ? (
              <img 
                src={member.user.avatar} 
                alt={member.user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              (member.user?.username?.[0] || 'U').toUpperCase()
            )}
          </div>
        ))}
        {remainingMembers > 0 && (
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs">+{remainingMembers}</span>
          </div>
        )}
      </div>
    );
  };

  // Преобразование данных для таблицы сообществ
  const getCommunitiesTableData = () => {
    return communities.map(community => [
      <div key={community.id} className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">{community.name}</div>
          <div className="text-sm text-gray-500">{community.description || "Нет описания"}</div>
        </div>
      </div>,
      <div key={`${community.id}-visibility`} className="flex items-center space-x-2">
        {community.isPublic ? (
          <>
            <Globe className="w-4 h-4 text-green-500" />
            <span className="text-green-700">Публичное</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-amber-500" />
            <span className="text-amber-700">Приватное</span>
          </>
        )}
      </div>,
      <div key={`${community.id}-members`} className="flex items-center space-x-3">
        {renderMemberAvatars(community.members)}
        <span className="text-gray-700 font-medium">{community._count?.members || 0}</span>
      </div>,
      <div key={`${community.id}-posts`} className="flex items-center space-x-2 text-gray-700">
        <MessageSquare className="w-4 h-4" />
        <span>{community._count?.posts || 0}</span>
      </div>,
      <div key={`${community.id}-date`} className="text-sm text-gray-600">
        {new Date(community.createdAt).toLocaleDateString()}
      </div>,
      <ActionButton
        key={`${community.id}-actions`}
        actions={[
          {
            type: "edit",
            onClick: () => handleEditCommunity(community),
          },
          {
            type: "view",
            onClick: () => handleCommunitySelect(community),
          },
          {
            type: "settings",
            onClick: () => handleCommunitySelect(community),
          },
          {
            type: "delete",
            onClick: () => handleDeleteClick(community, 'community'),
          },
        ]}
        variant="default"
        size="sm"
      />,
    ]);
  };

  // Преобразование данных для таблицы участников
  const getMembersTableData = () => {
    if (!selectedCommunity) return [];

    return members.map(member => [
      <div key={member.id} className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {member.user?.avatar ? (
            <img 
              src={member.user.avatar} 
              alt={member.user.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            (member.user?.username?.[0] || 'U').toUpperCase()
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">
            {member.user?.firstName && member.user?.lastName 
              ? `${member.user.firstName} ${member.user.lastName}`
              : member.user?.username
            }
          </div>
          <div className="text-sm text-gray-500">{member.user?.email}</div>
        </div>
      </div>,
      <div key={`${member.id}-role`}>
        <select
          value={member.role}
          onChange={(e) => handleRoleChange(member, e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="MEMBER">Участник</option>
          <option value="MODERATOR">Модератор</option>
          <option value="ADMIN">Администратор</option>
        </select>
      </div>,
      <div key={`${member.id}-join`} className="text-sm text-gray-600">
        {new Date(member.user?.createdAt).toLocaleDateString()}
      </div>,
      <ActionButton
        key={`${member.id}-actions`}
        actions={[
          {
            type: "view",
            onClick: () => console.log("Просмотр пользователя", member.user?.username),
          },
          {
            type: "delete",
            onClick: () => handleDeleteClick(member, 'member'),
          },
        ]}
        variant="default"
        size="sm"
      />,
    ]);
  };

  // Преобразование данных для таблицы сообщений
  const getPostsTableData = () => {
    if (!selectedCommunity) return [];

    return posts.map(post => [
      <div key={post.id} className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {post.author?.avatar ? (
            <img 
              src={post.author.avatar} 
              alt={post.author.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            (post.author?.username?.[0] || 'U').toUpperCase()
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{post.title}</div>
          <div className="text-sm text-gray-500">
            от {post.author?.username} • {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>,
      <div key={`${post.id}-content`} className="text-sm text-gray-600 line-clamp-2">
        {post.content}
      </div>,
      <div key={`${post.id}-community`} className="text-sm text-gray-600">
        {post.community?.name}
      </div>,
      <ActionButton
        key={`${post.id}-actions`}
        actions={[
          {
            type: "view",
            onClick: () => console.log("Просмотр сообщения", post.title),
          },
          {
            type: "delete",
            onClick: () => handleDeleteClick(post, 'post'),
          },
        ]}
        variant="default"
        size="sm"
      />,
    ]);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case "communities":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Показано {communities.length} из {communities.length} сообществ
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск сообществ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {visibilityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Table
              headers={[
                "Сообщество",
                "Видимость",
                "Участники",
                "Сообщения",
                "Создано",
                "Действия",
              ]}
              data={getCommunitiesTableData()}
              striped={true}
              hover={true}
            />
          </div>
        );

      case "members":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedCommunity ? (
                  `Показано ${members.length} участников в "${selectedCommunity.name}"`
                ) : (
                  "Выберите сообщество для просмотра участников"
                )}
              </div>
              <div className="flex space-x-3">
                {communities.length > 0 && (
                  <select
                    value={selectedCommunity?.id || ""}
                    onChange={(e) => {
                      const community = communities.find(c => c.id === e.target.value);
                      setSelectedCommunity(community);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Выберите сообщество</option>
                    {communities.map(community => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                )}
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCommunity ? (
              <Table
                headers={[
                  "Участник",
                  "Роль",
                  "Присоединился",
                  "Действия",
                ]}
                data={getMembersTableData()}
                striped={true}
                hover={true}
              />
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Выберите сообщество для просмотра участников</p>
              </div>
            )}
          </div>
        );

      case "posts":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedCommunity ? (
                  `Показано ${posts.length} сообщений в "${selectedCommunity.name}"`
                ) : (
                  "Выберите сообщество для просмотра сообщений"
                )}
              </div>
              <div className="flex space-x-3">
                {communities.length > 0 && (
                  <select
                    value={selectedCommunity?.id || ""}
                    onChange={(e) => {
                      const community = communities.find(c => c.id === e.target.value);
                      setSelectedCommunity(community);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Выберите сообщество</option>
                    {communities.map(community => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                )}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск сообщений..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
              </div>
            </div>

            {selectedCommunity ? (
              <Table
                headers={[
                  "Сообщение",
                  "Содержание",
                  "Сообщество",
                  "Действия",
                ]}
                data={getPostsTableData()}
                striped={true}
                hover={true}
              />
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Выберите сообщество для просмотра сообщений</p>
              </div>
            )}
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
            <Users className="w-8 h-8 mr-3" />
            Управление сообществами
          </h1>
          <p className="text-gray-600 mt-1">
            Управление сообществами и пользователями
          </p>
        </div>
        <ActionButton
          type="add"
          onClick={handleAddCommunity}
          variant="solid"
          size="md"
          showLabels={true}
        >
          Создать сообщество
        </ActionButton>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Всего сообществ"
          value={stats.totalCommunities.toString()}
          subtitle="Всего сообществ"
          icon={<Users className="w-6 h-6" />}
          color="blue"
          trend={{ isPositive: true, value: "3" }}
        />
        <StatCard
          title="Всего участников"
          value={stats.totalMembers.toString()}
          subtitle="Всего участников"
          icon={<User className="w-6 h-6" />}
          color="green"
          trend={{ isPositive: true, value: "24" }}
        />
        <StatCard
          title="Всего сообщений"
          value={stats.totalPosts.toString()}
          subtitle="Всего сообщений"
          icon={<MessageSquare className="w-6 h-6" />}
          color="amber"
          trend={{ isPositive: true, value: "18" }}
        />
        <StatCard
          title="Активные сообщества"
          value={stats.activeCommunities.toString()}
          subtitle="Активные сообщества"
          icon={<Shield className="w-6 h-6" />}
          color="purple"
          trend={{ isPositive: true, value: "5" }}
        />
      </div>

      {/* Основной контент с табами */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {/* Навигация табами */}
        <Tabs tabs={tabs} defaultTab="communities" onTabChange={setActiveTab} />

        {/* Контент табов */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Модальные окна */}
      <CommunityModal
        isOpen={isCommunityModalOpen}
        onClose={handleCloseCommunityModal}
        community={editingCommunity}
        onSuccess={handleCommunitySuccess}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={`Удаление ${deletingItem?.type === 'community' ? 'сообщества' : deletingItem?.type === 'post' ? 'сообщения' : 'участника'}`}
        message={`Вы уверены, что хотите удалить ${deletingItem?.type === 'community' ? 'сообщество' : deletingItem?.type === 'post' ? 'сообщение' : 'участника'} "${deletingItem?.name || deletingItem?.title || deletingItem?.user?.username}"? Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        variant="delete"
        isConfirming={isDeleting}
      />
    </div>
  );
}