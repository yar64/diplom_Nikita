import { MessageSquare } from 'lucide-react';

export default function ProfileMessages() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Сообщения</h2>
            <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">У вас нет новых сообщений</p>
            </div>
        </div>
    );
}