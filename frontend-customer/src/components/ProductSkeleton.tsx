import { Skeleton } from './ui/skeleton';

export function ProductSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-4 space-y-3">
      <Skeleton className="h-48 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center space-y-2">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function CategoryListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {Array.from({ length: count }).map((_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  );
}