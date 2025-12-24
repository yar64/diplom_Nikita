export default function InstructorsHero({ stats }) {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Meet Our Expert Instructors
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
                        Learn from industry professionals with years of experience in teaching and practical application.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{stats.totalInstructors}</div>
                            <div className="text-blue-200">Expert Instructors</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{stats.totalCourses}</div>
                            <div className="text-blue-200">Published Courses</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                            <div className="text-blue-200">Students Taught</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}