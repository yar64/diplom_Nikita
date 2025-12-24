'use client';

export default function InstructorAbout({ bio }) {
    if (!bio) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About Instructor</h2>
                <p className="text-gray-500 italic">No biography available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About Instructor</h2>
            <div className="prose max-w-none text-gray-600">
                <p className="whitespace-pre-line">{bio}</p>
            </div>
        </div>
    );
}