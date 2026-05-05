import { MovieGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse mb-8">
        <div className="h-10 w-48 bg-gray-800 rounded mb-4" />
        <div className="h-12 w-full bg-gray-800 rounded-xl mb-4" />
      </div>
      <MovieGridSkeleton count={12} />
    </div>
  );
}
