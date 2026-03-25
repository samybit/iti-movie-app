import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MovieCardSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col h-full border-muted bg-card">
            {/* Image Skeleton */}
            <Skeleton className="aspect-[2/3] w-full rounded-none" />

            {/* Content Skeleton */}
            <CardContent className="p-4 flex-grow flex flex-col gap-3">
                {/* Title Skeleton */}
                <Skeleton className="h-5 w-3/4" />
                {/* Year Skeleton */}
                <Skeleton className="h-4 w-1/4" />
            </CardContent>
        </Card>
    );
}