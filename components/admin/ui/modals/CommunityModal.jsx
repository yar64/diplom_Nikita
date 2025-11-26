// components/admin/ui/modals/CommunityModal.js
'use client';
import { useState, useEffect } from 'react';
import { 
  Users, 
  Globe,
  Lock,
  Image,
  Edit3,
  Plus
} from 'lucide-react';
import { FormModal } from '../../forms/FormModal';
import { createCommunity, updateCommunity } from '../../../../server/community.actions';

export function CommunityModal({ 
  isOpen, 
  onClose, 
  community = null,
  onSuccess
}) {
  const [formData, setFormData] = useState(getInitialFormData(community));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function getInitialFormData(communityData = null) {
    return {
      name: communityData?.name || '',
      description: communityData?.description || '',
      isPublic: communityData?.isPublic ?? true,
      avatar: communityData?.avatar || ''
    };
  }

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(community));
      setError('');
    }
  }, [community, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      
      if (community) {
        result = await updateCommunity(community.id, formData);
      } else {
        result = await createCommunity(formData);
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
          {community ? <Edit3 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
          {community ? 'Edit Community' : 'Create New Community'}
        </div>
      }
      submitLabel={community ? 'Update Community' : 'Create Community'}
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
            <Users className="w-4 h-4 mr-2" />
            Community Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter community name"
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
            placeholder="Enter community description"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Image className="w-4 h-4 mr-2" />
            Avatar URL
          </label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="radio"
              name="isPublic"
              checked={formData.isPublic}
              onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
              className="text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700 flex items-center">
              <Globe className="w-4 h-4 mr-1 text-green-500" />
              Public
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              name="isPublic"
              checked={!formData.isPublic}
              onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
              className="text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 text-sm font-medium text-gray-700 flex items-center">
              <Lock className="w-4 h-4 mr-1 text-amber-500" />
              Private
            </label>
          </div>
        </div>

        {/* Preview */}
        {formData.avatar && (
          <div className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
                {formData.avatar ? (
                  <img 
                    src={formData.avatar} 
                    alt="Community avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{formData.name || 'Community Name'}</div>
                <div className="text-sm text-gray-500">
                  {formData.isPublic ? 'Public Community' : 'Private Community'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FormModal>
  );
}