"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MovieGrid from "@/components/movie/MovieGrid";
import Pagination from "@/components/ui/Pagination";
import { MovieGridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

interface Genre {
  id: number;
  nameZh: string;
  slug: string;
  _count?: { movies: number };
}

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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSearch = searchParams.get("search") || "";
  const currentGenre = searchParams.get("genre") || "";
  const currentSortBy = searchParams.get("sortBy") || "popularity";
  const currentYear = searchParams.get("year") || "";
  const currentMinRating = searchParams.get("minRating") || "";

  // Fetch genres on mount
  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data.data || []))
      .catch(console.error);
  }, []);

  // Fetch movies when params change
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentSearch) params.set("search", currentSearch);
      if (currentGenre) params.set("genre", currentGenre);
      if (currentSortBy) params.set("sortBy", currentSortBy);
      if (currentYear) params.set("year", currentYear);
      if (currentMinRating) params.set("minRating", currentMinRating);
      params.set("page", String(currentPage));

      const res = await fetch(`/api/movies?${params.toString()}`);
      const data = await res.json();
      setMovies(data.data || []);
      setPagination(data.pagination || null);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [currentSearch, currentGenre, currentSortBy, currentYear, currentMinRating, currentPage]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Update URL params
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 when filters change
    if (!updates.page) {
      params.set("page", "1");
    }
    router.push(`/search?${params.toString()}`);
  };

  // Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">搜索电影</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="搜索电影名称..."
              className="w-full px-5 py-3.5 bg-card-bg border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors text-base"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              搜索
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="space-y-4">
          {/* Genre filter */}
          <div>
            <label className="text-sm text-muted block mb-2">分类</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateParams({ genre: "" })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  !currentGenre
                    ? "bg-primary text-white"
                    : "bg-card-bg text-gray-300 hover:bg-white/10"
                }`}
              >
                全部
              </button>
              {genres.map((g) => (
                <button
                  key={g.id}
                  onClick={() =>
                    updateParams({
                      genre: String(g.id),
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    currentGenre === String(g.id)
                      ? "bg-primary text-white"
                      : "bg-card-bg text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {g.nameZh}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Secondary filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted">排序:</label>
              <select
                value={currentSortBy}
                onChange={(e) => updateParams({ sortBy: e.target.value })}
                className="bg-card-bg border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="popularity">人气</option>
                <option value="vote_average">评分</option>
                <option value="release_date">上映日期</option>
                <option value="title">标题</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted">年份:</label>
              <select
                value={currentYear}
                onChange={(e) => updateParams({ year: e.target.value })}
                className="bg-card-bg border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="">全部</option>
                {Array.from({ length: 30 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted">最低评分:</label>
              <select
                value={currentMinRating}
                onChange={(e) =>
                  updateParams({ minRating: e.target.value })
                }
                className="bg-card-bg border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary"
              >
                <option value="">不限</option>
                <option value="7">7+</option>
                <option value="6">6+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <MovieGridSkeleton count={12} />
      ) : movies.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {pagination && (
            <p className="text-sm text-muted mb-4">
              共找到 {pagination.total} 部电影
            </p>
          )}
          <MovieGrid movies={movies} />
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => updateParams({ page: String(page) })}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
