"use client";

import { useRouter } from "next/navigation";
import MovieGrid from "@/components/movie/MovieGrid";
import Pagination from "@/components/ui/Pagination";

interface Movie {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number | null;
  releaseDate: string | null;
  genres: Array<{
    genre: { id: number; nameZh: string };
  }>;
  locked?: boolean;
}

interface GenrePageContentProps {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
  total: number;
  slug: string;
  currentSortBy: string;
}

export default function GenrePageContent({
  movies,
  currentPage,
  totalPages,
  total,
  slug,
  currentSortBy,
}: GenrePageContentProps) {
  const router = useRouter();

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/genre/${slug}?${params.toString()}`);
  };

  return (
    <div>
      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-6">
        <label className="text-sm text-muted">排序:</label>
        <select
          value={currentSortBy}
          onChange={(e) =>
            updateParams({ sortBy: e.target.value, page: "1" })
          }
          className="bg-card-bg border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary"
        >
          <option value="popularity">人气</option>
          <option value="vote_average">评分</option>
          <option value="release_date">上映日期</option>
          <option value="title">标题</option>
        </select>
        <span className="text-xs text-muted ml-auto">
          共 {total} 部电影
        </span>
      </div>

      {movies.length > 0 ? (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => updateParams({ page: String(page) })}
          />
        </>
      ) : (
        <div className="text-center py-16 text-muted">
          暂无电影数据
        </div>
      )}
    </div>
  );
}
