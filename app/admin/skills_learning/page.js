'use client';
import { useState, useEffect } from 'react';
import {
  Target,
  TrendingUp,
  BookOpen,
  Users,
  Search,
  Plus,
  Edit3,
  Trash2,
  Filter,
  Code,
  Languages,
  Briefcase,
  Palette,
  HeartHandshake,
  Clock,
  BarChart3,
  Star,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Globe
} from 'lucide-react';
import { StatCard } from '../../../components/admin/StatCard';
import { Table } from '../../../components/admin/Table';
import { Tabs } from '../../../components/admin/ui/Tabs';
import { StatusBadge } from '../../../components/admin/ui/StatusBadge';
import { SkillModal } from '../../../components/admin/SkillModal';
import { ConfirmModal } from '../../../components/admin/ui/ConfirmModal';
import { getSkills, deleteSkill } from '../../../server/skill.actions';
import { getLearningPaths } from '../../../server/learning-path.actions';

const tabs = [
  { id: 'all', label: 'All Skills' },
  { id: 'technical', label: 'Technical' },
  { id: 'soft', label: 'Soft Skills' },
  { id: 'language', label: 'Languages' },
  { id: 'learning-paths', label: 'Learning Paths' }
];

const difficultyColors = {
  BEGINNER: 'green',
  INTERMEDIATE: 'blue',
  ADVANCED: 'purple',
  EXPERT: 'red'
};

const categoryIcons = {
  technical: <Code className="w-5 h-5" />,
  'soft-skills': <HeartHandshake className="w-5 h-5" />,
  language: <Languages className="w-5 h-5" />,
  business: <Briefcase className="w-5 h-5" />,
  creative: <Palette className="w-5 h-5" />
};

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Загрузка данных
  const loadData = async () => {
    setLoading(true);
    const [skillsResult, pathsResult] = await Promise.all([
      getSkills(),
      getLearningPaths()
    ]);
    
    if (skillsResult.success) {
      setSkills(skillsResult.skills);
    }
    if (pathsResult.success) {
      setLearningPaths(pathsResult.learningPaths);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Статистика
  const skillStats = [
    {
      title: 'Total Skills',
      value: skills.length.toString(),
      subtitle: 'Available skills',
      icon: <Target className="w-6 h-6" />,
      color: 'blue',
      trend: { isPositive: true, value: '8' }
    },
    {
      title: 'Active Learners',
      value: skills.reduce((acc, skill) => acc + (skill._count?.userSkills || 0), 0).toString(),
      subtitle: 'Total learners',
      icon: <Users className="w-6 h-6" />,
      color: 'emerald',
      trend: { isPositive: true, value: '15' }
    },
    {
      title: 'Learning Paths',
      value: learningPaths.length.toString(),
      subtitle: 'Created paths',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'purple',
      trend: { isPositive: true, value: '3' }
    },
    {
      title: 'Avg. Progress',
      value: '68%',
      subtitle: 'Overall progress',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'amber',
      trend: { isPositive: true, value: '12' }
    }
  ];

  // Подготовка данных для таблицы навыков
  const prepareSkillsTableData = () => {
    let filteredSkills = skills;

    // Фильтрация по категории
    if (activeTab === 'technical') {
      filteredSkills = skills.filter(skill => skill.category === 'technical');
    } else if (activeTab === 'soft') {
      filteredSkills = skills.filter(skill => skill.category === 'soft-skills');
    } else if (activeTab === 'language') {
      filteredSkills = skills.filter(skill => skill.category === 'language');
    }

    // Фильтрация по поиску
    if (searchTerm) {
      filteredSkills = filteredSkills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const headers = ['Skill', 'Category', 'Difficulty', 'Learners', 'Resources', 'Actions'];
    
    const data = filteredSkills.map(skill => [
      <div key={`skill-${skill.id}`} className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 text-white">
          {categoryIcons[skill.category] || <Target className="w-5 h-5" />}
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {skill.name}
          </div>
          <div className="text-sm text-gray-500 line-clamp-1">
            {skill.description || 'No description'}
          </div>
        </div>
      </div>,
      <StatusBadge 
        key={`category-${skill.id}`} 
        status={skill.category} 
        variant="outline"
      />,
      <StatusBadge 
        key={`difficulty-${skill.id}`} 
        status={skill.difficulty} 
        color={difficultyColors[skill.difficulty]}
      />,
      <div key={`learners-${skill.id}`} className="flex items-center text-sm text-gray-600">
        <Users className="w-4 h-4 mr-2" />
        {skill._count?.userSkills || 0}
      </div>,
      <div key={`resources-${skill.id}`} className="flex items-center text-sm text-gray-600">
        <BookOpen className="w-4 h-4 mr-2" />
        {skill._count?.learningResources || 0}
      </div>,
      <div key={`actions-${skill.id}`} className="flex space-x-2">
        <button
          onClick={() => {
            setSelectedSkill(skill);
            setIsSkillModalOpen(true);
          }}
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button
          onClick={() => {
            setSkillToDelete(skill);
            setIsDeleteModalOpen(true);
          }}
          className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>
    ]);

    return { headers, data, filteredSkills };
  };

  // Подготовка данных для таблицы learning paths
  const preparePathsTableData = () => {
    let filteredPaths = learningPaths;

    if (searchTerm) {
      filteredPaths = filteredPaths.filter(path =>
        path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        path.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const headers = ['Learning Path', 'Creator', 'Milestones', 'Progress', 'Status', 'Actions'];
    
    const data = filteredPaths.map(path => [
      <div key={`path-${path.id}`} className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 text-white">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {path.title}
          </div>
          <div className="text-sm text-gray-500 line-clamp-1">
            {path.description || 'No description'}
          </div>
        </div>
      </div>,
      <div key={`creator-${path.id}`}>
        <div className="font-medium text-gray-900">
          {path.user?.username || 'Unknown'}
        </div>
        <div className="text-sm text-gray-500">
          {path.user?.email}
        </div>
      </div>,
      <div key={`milestones-${path.id}`} className="flex items-center text-sm text-gray-600">
        <Target className="w-4 h-4 mr-2" />
        {path.milestones?.length || 0}
      </div>,
      <div key={`progress-${path.id}`} className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Overall</span>
          <span>42%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-emerald-500 h-1.5 rounded-full" 
            style={{ width: '42%' }}
          />
        </div>
      </div>,
      <div key={`status-${path.id}`} className="flex items-center">
        {path.isPublic ? (
          <>
            <Globe className="w-4 h-4 text-green-500 mr-1" />
            <StatusBadge status="Public" color="green" />
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-gray-500 mr-1" />
            <StatusBadge status="Private" color="gray" />
          </>
        )}
      </div>,
      <div key={`actions-${path.id}`} className="flex space-x-2">
        <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
          <Edit3 className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors">
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>
    ]);

    return { headers, data, filteredPaths };
  };

  const { headers, data, filteredSkills } = activeTab === 'learning-paths' 
    ? preparePathsTableData() 
    : prepareSkillsTableData();

  const handleDeleteSkill = async () => {
    if (!skillToDelete) return;
    
    const result = await deleteSkill(skillToDelete.id);
    if (result.success) {
      await loadData();
    }
    setIsDeleteModalOpen(false);
    setSkillToDelete(null);
  };

  const handleSkillSuccess = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading skills data...</p>
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
            <Target className="w-8 h-8 mr-3" />
            Skills & Learning
          </h1>
          <p className="text-gray-600 mt-1">Manage skills, track progress, and create learning paths</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={() => {
              setSelectedSkill(null);
              setIsSkillModalOpen(true);
            }}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {skillStats.map((stat, index) => (
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
        <Tabs 
          tabs={tabs} 
          defaultTab="all" 
          onTabChange={setActiveTab}
        />
        
        {/* Контент табов */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {activeTab === 'learning-paths' 
                ? `Showing ${learningPaths.length} learning paths`
                : `Showing ${filteredSkills.length} of ${skills.length} skills`
              }
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={activeTab === 'learning-paths' ? "Search paths..." : "Search skills..."}
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
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'learning-paths' ? 'No learning paths found' : 'No skills found'}
                </div>
                <div className="text-gray-500 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : activeTab === 'learning-paths' 
                      ? 'Create your first learning path to get started'
                      : 'Get started by creating your first skill'
                  }
                </div>
                {!searchTerm && activeTab !== 'learning-paths' && (
                  <button
                    onClick={() => setIsSkillModalOpen(true)}
                    className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Skill
                  </button>
                )}
              </div>
            }
          />

          {/* Пагинация */}
          {data.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing 1 to {Math.min(data.length, 10)} of {data.length} results
              </div>
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                  1
                </button>
                {data.length > 10 && (
                  <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    2
                  </button>
                )}
                <button className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальные окна */}
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => {
          setIsSkillModalOpen(false);
          setSelectedSkill(null);
        }}
        skill={selectedSkill}
        onSuccess={handleSkillSuccess}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSkillToDelete(null);
        }}
        onConfirm={handleDeleteSkill}
        title="Delete Skill"
        message={
          <div className="text-center">
            <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="text-gray-600 mb-2">
              Are you sure you want to delete <strong>{skillToDelete?.name}</strong>?
            </div>
            <div className="text-sm text-gray-500">
              This action cannot be undone and all associated user skills will be removed.
            </div>
          </div>
        }
        confirmLabel="Delete Skill"
        variant="delete"
      />
    </div>
  );
}