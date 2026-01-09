export default function InstructorCardSkeleton() {
    return (
        <div className="bg-light-card rounded-xl shadow-sm p-6 animate-pulse">
            <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-light-border rounded-full"></div>
                </div>
                <div className="flex-1 space-y-3">
                    <div className="h-5 bg-light-border rounded w-3/4"></div>
                    <div className="h-3 bg-light-border rounded w-1/2"></div>
                    <div className="h-3 bg-light-border rounded w-24"></div>
                    <div className="h-8 bg-light-border rounded w-28"></div>
                </div>
            </div>
        </div>
    );
}