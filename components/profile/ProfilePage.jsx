'use client';

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProfileHeader from './ProfileHeader';
import { getCurrentUser } from '../../server/user.actions';
import ProfileTabs from './ProfileTabs';
import ProfileInfo from './ProfileInfo';
import ProfileEdit from './ProfileEdit';
import ProfileStats from './ProfileStats';
import ProfileCourses from './ProfileCourses';
import ProfileTeachers from './ProfileTeachers';
import ProfileMessages from './ProfileMessages';
import ProfileReviews from './ProfileReviews';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        headline: '',
        description: '',
        language: 'Русский',
        email: '',
        phone: '',
        location: '',
        website: ''
    });

    useEffect(() => {
        // Получаем ID пользователя из localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);

        // Загружаем полные данные пользователя из БД
        const loadUserData = async () => {
            try {
                const result = await getCurrentUser(parsedUser.id);
                if (result.success) {
                    const fullUser = result.user;
                    setUser(fullUser);

                    setFormData({
                        firstName: fullUser.firstName || '',
                        lastName: fullUser.lastName || '',
                        headline: fullUser.headline || 'Пользователь',
                        description: fullUser.bio || '',
                        language: 'Русский',
                        email: fullUser.email || '',
                        phone: fullUser.settings?.phone || '',
                        location: fullUser.settings?.location || '',
                        website: fullUser.settings?.website || ''
                    });
                } else {
                    console.error('Error loading user:', result.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        loadUserData();
    }, [router]);

    const handleSaveProfile = (updatedData) => {
        const updatedUser = {
            ...user,
            ...updatedData
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setFormData(updatedData);
        setIsEditing(false);
    };

    const handleImageUpload = (imageUrl) => {
        const updatedUser = {
            ...user,
            avatar: imageUrl
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return isEditing ? (
                    <ProfileEdit
                        formData={formData}
                        onSave={handleSaveProfile}
                        onCancel={() => setIsEditing(false)}
                        onImageUpload={handleImageUpload}
                    />
                ) : (
                    <ProfileInfo formData={formData} />
                );
            case 'courses':
                return <ProfileCourses />;
            case 'teachers':
                return <ProfileTeachers />;
            case 'messages':
                return <ProfileMessages />;
            case 'reviews':
                return <ProfileReviews />;
            default:
                return <ProfileInfo formData={formData} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ProfileHeader
                user={user}
                formData={formData}
                onEditToggle={() => setIsEditing(!isEditing)}
                isEditing={isEditing}
                onImageUpload={handleImageUpload}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/4">
                        <ProfileTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                        <ProfileStats />
                    </div>

                    <div className="lg:w-3/4">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}