import Link from "next/link";
import MovieCard from "@/components/movie/MovieCard";

interface CategorySectionProps {
  title: string;
  movies: Array<{
    id: number;
    title: string;
    posterPath: string | null;
    voteAverage: number | null;
    releaseDate?: string | null;
    genres?: Array<{
      genre: {
        id: number;
        nameZh: string;
      };
    }>;
    locked?: boolean;
  }>;
  viewAllHref?: string;
}

export default function CategorySection({
  title,
  movies,
  viewAllHref,
}: CategorySectionProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            查看全部 →
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-[160px] sm:w-[180px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
