export default function InstructorsLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="animate-pulse">
                        <div className="h-12 bg-blue-500/50 rounded w-1/3 mx-auto mb-6"></div>
                        <div className="h-6 bg-blue-500/50 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                            <div className="flex items-start space-x-4">
                                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-28"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}