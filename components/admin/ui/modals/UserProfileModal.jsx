// components/admin/ui/modals/UserProfileModal.jsx
import { 
  X, 
  Mail, 
  Calendar, 
  Globe, 
  Target, 
  BookOpen, 
  Briefcase, 
  Users,
  BarChart3,
  Eye,
  EyeOff,
  Shield,
  Bell,
  Palette,
  GraduationCap,
  Key,
  User
} from "lucide-react";
import { StatusBadge } from "../data-display/StatusBadge";

const roleColors = {
  USER: "gray",
  ADMIN: "red", 
  MENTOR: "blue"
};

export function UserProfileModal({ isOpen, onClose, user, loading }) {
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4">
          <div className="text-center py-12">
            <div className="text-lg font-medium text-gray-900 mb-2">
              User not found
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <User className="w-6 h-6 mr-2" />
              User Profile
            </h2>
            <p className="text-gray-600">Detailed information about {user.username}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex flex-col items-center text-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-32 h-32 rounded-full mb-4 transition-all duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 transition-all duration-300 hover:scale-105">
                    <span className="text-white text-2xl font-medium">
                      {user.firstName?.[0] || user.username?.[0] || 'U'}
                      {user.lastName?.[0] || ''}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 transition-all duration-200">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.username || user.email
                  }
                </h3>
                <p className="text-gray-600 transition-all duration-200">@{user.username}</p>
                <div className="mt-2 transition-all duration-200">
                  <StatusBadge 
                    status={user.role} 
                    variant={roleColors[user.role] || 'default'}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <Mail className="w-5 h-5 mr-3 transition-all duration-200" />
                  <span className="transition-all duration-200">{user.email}</span>
                </div>
                <div className="flex items-center text-gray-600 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                  <Calendar className="w-5 h-5 mr-3 transition-all duration-200" />
                  <span className="transition-all duration-200">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                {user.timezone && (
                  <div className="flex items-center text-gray-600 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                    <Globe className="w-5 h-5 mr-3 transition-all duration-200" />
                    <span className="transition-all duration-200">{user.timezone}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                  {user.isPublic ? (
                    <Eye className="w-5 h-5 mr-3 text-green-500 transition-all duration-200" />
                  ) : (
                    <EyeOff className="w-5 h-5 mr-3 text-gray-400 transition-all duration-200" />
                  )}
                  <span className="transition-all duration-200">{user.isPublic ? 'Public Profile' : 'Private Profile'}</span>
                </div>
              </div>

              {user.bio && (
                <div className="bg-gray-50 rounded-lg p-4 transition-all duration-200 animate-slide-up" style={{ animationDelay: '0.8s' }}>
                  <p className="text-gray-700 transition-all duration-200">{user.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 animate-slide-up border border-blue-100" style={{ animationDelay: '0.9s' }}>
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2 transition-all duration-200" />
              <div className="text-2xl font-bold text-blue-600 transition-all duration-200">{user._count?.skills || 0}</div>
              <div className="text-sm text-blue-600 transition-all duration-200">Skills</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 animate-slide-up border border-green-100" style={{ animationDelay: '1s' }}>
              <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-2 transition-all duration-200" />
              <div className="text-2xl font-bold text-green-600 transition-all duration-200">{user._count?.projects || 0}</div>
              <div className="text-sm text-green-600 transition-all duration-200">Projects</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 animate-slide-up border border-purple-100" style={{ animationDelay: '1.1s' }}>
              <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2 transition-all duration-200" />
              <div className="text-2xl font-bold text-purple-600 transition-all duration-200">{user._count?.sessions || 0}</div>
              <div className="text-sm text-purple-600 transition-all duration-200">Sessions</div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 animate-slide-up border border-amber-100" style={{ animationDelay: '1.2s' }}>
              <Users className="w-8 h-8 text-amber-600 mx-auto mb-2 transition-all duration-200" />
              <div className="text-2xl font-bold text-amber-600 transition-all duration-200">{user._count?.goals || 0}</div>
              <div className="text-sm text-amber-600 transition-all duration-200">Goals</div>
            </div>
          </div>

          {/* User Stats */}
          {user.stats && (
            <div className="bg-gray-50 rounded-lg p-6 transition-all duration-300 animate-slide-up border border-gray-200" style={{ animationDelay: '1.3s' }}>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center transition-all duration-200">
                <BarChart3 className="w-5 h-5 mr-2 transition-all duration-200" />
                Learning Statistics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="transition-all duration-200">
                  <div className="text-2xl font-bold text-gray-900 transition-all duration-200">{user.stats.totalStudyTime || 0}</div>
                  <div className="text-sm text-gray-600 transition-all duration-200">Study Minutes</div>
                </div>
                <div className="transition-all duration-200">
                  <div className="text-2xl font-bold text-gray-900 transition-all duration-200">{user.stats.completedGoals || 0}</div>
                  <div className="text-sm text-gray-600 transition-all duration-200">Goals Completed</div>
                </div>
                <div className="transition-all duration-200">
                  <div className="text-2xl font-bold text-gray-900 transition-all duration-200">{user.stats.currentStreak || 0}</div>
                  <div className="text-sm text-gray-600 transition-all duration-200">Current Streak</div>
                </div>
                <div className="transition-all duration-200">
                  <div className="text-2xl font-bold text-gray-900 transition-all duration-200">{user.stats.longestStreak || 0}</div>
                  <div className="text-sm text-gray-600 transition-all duration-200">Longest Streak</div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Status */}
          <div className="bg-gray-50 rounded-lg p-6 transition-all duration-300 animate-slide-up border border-gray-200" style={{ animationDelay: '1.4s' }}>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 transition-all duration-200">Settings Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${user.settings ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                <Shield className="w-5 h-5 mr-2 transition-all duration-200" />
                <span className="transition-all duration-200">General Settings</span>
              </div>
              <div className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${user.notificationSettings ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                <Bell className="w-5 h-5 mr-2 transition-all duration-200" />
                <span className="transition-all duration-200">Notifications</span>
              </div>
              <div className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${user.privacySettings ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                <EyeOff className="w-5 h-5 mr-2 transition-all duration-200" />
                <span className="transition-all duration-200">Privacy</span>
              </div>
              <div className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${user.appearanceSettings ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                <Palette className="w-5 h-5 mr-2 transition-all duration-200" />
                <span className="transition-all duration-200">Appearance</span>
              </div>
              <div className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${user.learningPreferences ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                <GraduationCap className="w-5 h-5 mr-2 transition-all duration-200" />
                <span className="transition-all duration-200">Learning</span>
              </div>
              <div className={`flex items-center p-3 rounded-lg transition-all duration-300 hover:scale-105 ${user.securitySettings ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                <Key className="w-5 h-5 mr-2 transition-all duration-200" />
                <span className="transition-all duration-200">Security</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 animate-slide-up"
            style={{ animationDelay: '1.5s' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}