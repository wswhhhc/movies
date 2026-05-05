import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getEffectiveRole, isPremiumMovie } from "@/lib/content-gate";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getGenres() {
  return prisma.genre.findMany({
    include: {
      _count: { select: { movies: true } },
    },
    orderBy: { nameZh: "asc" },
  });
}

export default async function HomePage() {
  const [session, popularMovies, topRatedMovies, nowPlayingMovies, genres] =
    await Promise.all([
      getServerSession(authOptions),
      prisma.movie.findMany({
        orderBy: { popularity: "desc" },
        take: 20,
        include: { genres: { include: { genre: true } } },
      }),
      prisma.movie.findMany({
        orderBy: { voteAverage: "desc" },
        where: { voteCount: { gte: 100 } },
        take: 20,
        include: { genres: { include: { genre: true } } },
      }),
      prisma.movie.findMany({
        orderBy: { releaseDate: "desc" },
        take: 20,
        include: { genres: { include: { genre: true } } },
      }),
      getGenres(),
    ]);

  const role = getEffectiveRole(session);
  const heroMovie = popularMovies[0];

  return (
    <div>
      {/* Hero Section */}
      {heroMovie && (
        <HeroSection
          movie={{
            id: heroMovie.id,
            title: heroMovie.title,
            overview: heroMovie.overview,
            backdropPath: heroMovie.backdropPath,
            voteAverage: heroMovie.voteAverage,
            releaseDate: heroMovie.releaseDate,
            locked: role === "FREE" && isPremiumMovie(heroMovie),
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Popular Movies */}
        <CategorySection
          title="热门电影"
          movies={popularMovies.slice(0, 12).map(m => ({
            ...m,
            locked: role === "FREE" && isPremiumMovie(m),
          }))}
          viewAllHref="/search?sortBy=popularity"
        />

        {/* Top Rated */}
        <CategorySection
          title="最高评分"
          movies={topRatedMovies.slice(0, 12).map(m => ({
            ...m,
            locked: role === "FREE" && isPremiumMovie(m),
          }))}
          viewAllHref="/search?sortBy=vote_average"
        />

        {/* Now Playing */}
        <CategorySection
          title="最近上映"
          movies={nowPlayingMovies.slice(0, 12).map(m => ({
            ...m,
            locked: role === "FREE" && isPremiumMovie(m),
          }))}
          viewAllHref="/search?sortBy=release_date"
        />

        {/* Genre Grid */}
        {genres.length > 0 && (
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              分类浏览
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.slug}`}
                  className="flex flex-col items-center justify-center p-6 rounded-lg bg-card-bg hover:bg-card-hover border border-white/5 transition-all hover:scale-105"
                >
                  <span className="text-white font-medium text-sm">
                    {genre.nameZh}
                  </span>
                  <span className="text-xs text-muted mt-1">
                    {genre._count.movies} 部电影
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
