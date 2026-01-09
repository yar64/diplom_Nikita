'use client';

export default function InstructorAbout({ bio }) {
    if (!bio) {
        return (
            <div className="bg-light-card rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-light-text-primary mb-4">О преподавателе</h2>
                <p className="text-light-text-muted italic">Биография не указана.</p>
            </div>
        );
    }

    return (
        <div className="bg-light-card rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-light-text-primary mb-4">О преподавателе</h2>
            <div className="prose max-w-none text-light-text-secondary">
                <p className="whitespace-pre-line">{bio}</p>
            </div>
        </div>
    );
}