'use client';
import { useState, useEffect } from 'react';
import { 
  Target, 
  Code, 
  HeartHandshake, 
  Languages, 
  Briefcase, 
  Palette,
  Star,
  TrendingUp,
  Award,
  FileText,
  Edit3,
  Plus
} from 'lucide-react';
import { FormModal } from '../../forms/FormModal';
import { createSkill, updateSkill } from '../../../../server/skill.actions';

export function SkillModal({ 
  isOpen, 
  onClose, 
  skill = null,
  onSuccess 
}) {
  const [formData, setFormData] = useState(getInitialFormData(skill));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function getInitialFormData(skillData = null) {
    return {
      name: skillData?.name || '',
      description: skillData?.description || '',
      category: skillData?.category || 'technical',
      difficulty: skillData?.difficulty || 'BEGINNER',
      icon: skillData?.icon || ''
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(skill));
      setError('');
    }
  }, [skill, isOpen]);

  const categories = [
    { value: 'technical', label: 'Technical', icon: <Code className="w-4 h-4" /> },
    { value: 'soft-skills', label: 'Soft Skills', icon: <HeartHandshake className="w-4 h-4" /> },
    { value: 'language', label: 'Language', icon: <Languages className="w-4 h-4" /> },
    { value: 'business', label: 'Business', icon: <Briefcase className="w-4 h-4" /> },
    { value: 'creative', label: 'Creative', icon: <Palette className="w-4 h-4" /> }
  ];

  const difficulties = [
    { value: 'BEGINNER', label: 'Beginner', icon: <Star className="w-4 h-4" /> },
    { value: 'INTERMEDIATE', label: 'Intermediate', icon: <TrendingUp className="w-4 h-4" /> },
    { value: 'ADVANCED', label: 'Advanced', icon: <Award className="w-4 h-4" /> },
    { value: 'EXPERT', label: 'Expert', icon: <Target className="w-4 h-4" /> }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      
      if (skill) {
        // Обновление навыка
        result = await updateSkill(skill.id, formData);
      } else {
        // Создание нового навыка
        result = await createSkill(formData);
      }

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.error || 'Operation failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={
        <div className="flex items-center animate-fade-in">
          {skill ? <Edit3 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {skill ? 'Edit Skill' : 'Create New Skill'}
        </div>
      }
      submitLabel={skill ? 'Update Skill' : 'Create Skill'}
      isSubmitting={isLoading}
      size="md"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 animate-shake">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Skill Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter skill name"
          />
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Enter skill description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty Level
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icon URL
          </label>
          <input
            type="url"
            name="icon"
            value={formData.icon}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Optional: Enter icon URL"
          />
        </div>

        {/* Preview категории */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Preview
          </label>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 text-white">
              {categories.find(cat => cat.value === formData.category)?.icon || <Target className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {categories.find(cat => cat.value === formData.category)?.label}
              </div>
              <div className="text-xs text-gray-500">
                This icon will represent the skill category
              </div>
            </div>
          </div>
        </div>

        {/* Preview сложности */}
        <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Preview
          </label>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-3 text-white">
              {difficulties.find(diff => diff.value === formData.difficulty)?.icon || <Star className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {difficulties.find(diff => diff.value === formData.difficulty)?.label}
              </div>
              <div className="text-xs text-gray-500">
                Skill difficulty level
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
}