// components/admin/ui/modals/GoalModal.js
'use client';
import { useState, useEffect } from 'react';
import { 
  Target, 
  Calendar,
  User,
  Code,
  Edit3,
  Plus
} from 'lucide-react';
import { FormModal } from '../../forms/FormModal';
import { createGoal, updateGoal } from '../../../../server/goal.actions';

export function GoalModal({ 
  isOpen, 
  onClose, 
  goal = null,
  onSuccess,
  skills = []
}) {
  const [formData, setFormData] = useState(getInitialFormData(goal));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function getInitialFormData(goalData = null) {
    return {
      title: goalData?.title || '',
      description: goalData?.description || '',
      targetDate: goalData?.targetDate ? new Date(goalData.targetDate).toISOString().split('T')[0] : '',
      isCompleted: goalData?.isCompleted || false,
      userId: goalData?.userId || '',
      skillId: goalData?.skillId || ''
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(goal));
      setError('');
    }
  }, [goal, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      
      if (goal) {
        result = await updateGoal(goal.id, formData);
      } else {
        result = await createGoal(formData);
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={
        <div className="flex items-center">
          {goal ? <Edit3 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {goal ? 'Edit Goal' : 'Create New Goal'}
        </div>
      }
      submitLabel={goal ? 'Update Goal' : 'Create Goal'}
      isSubmitting={isLoading}
      size="md"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Goal Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter goal title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter goal description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Target Date *
            </label>
            <input
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Skill *
            </label>
            <select
              name="skillId"
              value={formData.skillId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a skill</option>
              {skills.map(skill => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <User className="w-4 h-4 mr-2" />
            User ID *
          </label>
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter user ID"
          />
        </div>

        {goal && (
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isCompleted"
              checked={formData.isCompleted}
              onChange={handleChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Mark as completed
            </label>
          </div>
        )}
      </div>
    </FormModal>
  );
}