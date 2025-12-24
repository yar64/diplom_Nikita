export default function InstructorLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 animate-pulse">
                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-6">
                        <div className="bg-white rounded-xl p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-20 bg-gray-200 rounded"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}