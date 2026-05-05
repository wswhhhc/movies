import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMovieLockedForUser } from "@/lib/content-gate";
import { prisma } from "@/lib/prisma";
import { tmdbImage, ImageSize } from "@/lib/tmdb-image";
import RatingStar from "@/components/ui/RatingStar";
import GenreBadge from "@/components/genre/GenreBadge";
import MovieCard from "@/components/movie/MovieCard";
import MovieImage from "@/components/ui/MovieImage";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const movie = await prisma.movie.findUnique({
    where: { id: parseInt(id) },
  });

  if (!movie) return { title: "电影未找到" };

  return {
    title: `${movie.title} - Movie推荐`,
    description: movie.overview?.slice(0, 160) || undefined,
  };
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) notFound();

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    include: {
      genres: { include: { genre: true } },
      casts: {
        include: { cast: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!movie) notFound();

  const backdropUrl = tmdbImage(movie.backdropPath, ImageSize.BACKDROP);
  const posterUrl = tmdbImage(movie.posterPath, ImageSize.POSTER_LARGE);
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  const actors = movie.casts.filter((c) => c.role === "actor");
  const directors = movie.casts.filter((c) => c.role === "director");

  // Get similar movies (same genre)
  const genreIds = movie.genres.map((g) => g.genreId);
  const similarMovies =
    genreIds.length > 0
      ? await prisma.movie.findMany({
          where: {
            id: { not: movie.id },
            genres: { some: { genreId: { in: genreIds } } },
          },
          include: { genres: { include: { genre: true } } },
          orderBy: { popularity: "desc" },
          take: 10,
        })
      : [];

  const session = await getServerSession(authOptions);
  const isLocked = isMovieLockedForUser(movie, session);

  if (isLocked) {
    return (
      <div>
        {/* Hero backdrop */}
        <div className="relative w-full h-[50vh] min-h-[300px] overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <MovieImage
              src={backdropUrl}
              alt={movie.title}
              type="backdrop"
              className="w-full h-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/90" />
        </div>

        {/* Gate content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Poster (dimmed) */}
            <div className="flex-shrink-0 w-48 md:w-64 relative">
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl opacity-60">
                <MovieImage
                  src={posterUrl}
                  alt={movie.title}
                  type="poster"
                  className="w-full h-full"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Gate message */}
            <div className="flex-1 pt-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                会员专属
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{movie.title}</h1>
              <p className="text-gray-400 mb-6 max-w-lg">开通会员即可查看完整内容，包括剧情简介、演员阵容、相似推荐等</p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-colors text-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                开通会员 立即观看
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero backdrop */}
      <div className="relative w-full h-[50vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <MovieImage
            src={backdropUrl}
            alt={movie.title}
            type="backdrop"
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Movie info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-64">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
              <MovieImage
                src={posterUrl}
                alt={movie.title}
                type="poster"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 pt-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-muted text-base mb-3">
                {movie.originalTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-4">
              {year && <span className="text-gray-300">{year}</span>}
              {movie.runtime && (
                <span className="text-gray-300">
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              {movie.voteAverage != null && movie.voteAverage > 0 && (
                <RatingStar rating={movie.voteAverage} size="md" />
              )}
              {movie.voteCount != null && movie.voteCount > 0 && (
                <span className="text-xs text-muted">
                  ({movie.voteCount.toLocaleString()} 人评价)
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((g) => (
                <GenreBadge key={g.genre.id} name={g.genre.nameZh} />
              ))}
            </div>

            {/* Overview */}
            {movie.overview && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">简介</h2>
                <p className="text-gray-300 leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}

            {/* Directors */}
            {directors.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">导演</h2>
                <div className="flex flex-wrap gap-4">
                  {directors.map((d) => (
                    <div key={d.castId} className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <MovieImage
                          src={tmdbImage(d.cast.profilePath, ImageSize.PROFILE)}
                          alt={d.cast.name}
                          type="profile"
                          className="w-full h-full"
                        />
                      </div>
                      <span className="text-sm text-gray-300">{d.cast.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cast */}
        {actors.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">演员</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {actors.slice(0, 10).map((mc) => (
                <div
                  key={mc.castId}
                  className="flex-shrink-0 w-28 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden bg-gray-800">
                    <MovieImage
                      src={tmdbImage(mc.cast.profilePath, ImageSize.PROFILE)}
                      alt={mc.cast.name}
                      type="profile"
                      className="w-full h-full"
                    />
                  </div>
                  <p className="text-xs text-white font-medium truncate">
                    {mc.cast.name}
                  </p>
                  {mc.characterName && (
                    <p className="text-xs text-muted truncate">
                      {mc.characterName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <section className="mt-12 mb-12">
            <h2 className="text-xl font-bold text-white mb-4">相似推荐</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarMovies.slice(0, 10).map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
