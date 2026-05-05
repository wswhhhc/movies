import Link from "next/link";
import RatingStar from "@/components/ui/RatingStar";
import MovieImage from "@/components/ui/MovieImage";
import { tmdbImage, ImageSize } from "@/lib/tmdb-image";

interface Movie {
  id: number;
  title: string;
  overview: string | null;
  backdropPath: string | null;
  voteAverage: number | null;
  releaseDate: string | null;
  locked?: boolean;
}

interface HeroSectionProps {
  movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
  const backdropUrl = tmdbImage(movie.backdropPath, ImageSize.BACKDROP);
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <section className="relative w-full h-[70vh] min-h-[400px] max-h-[600px] overflow-hidden">
      {/* Backdrop image */}
      <div className="absolute inset-0 w-full h-full">
        <MovieImage
          src={backdropUrl}
          alt={movie.title}
          type="backdrop"
          className="w-full h-full"
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            {movie.title}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            {year && (
              <span className="text-sm text-gray-300">{year}</span>
            )}
            {movie.voteAverage != null && movie.voteAverage > 0 && (
              <RatingStar rating={movie.voteAverage} size="sm" />
            )}
          </div>

          {movie.overview && (
            <p className="text-sm sm:text-base text-gray-300 line-clamp-3 mb-6">
              {movie.overview}
            </p>
          )}

          {movie.locked ? (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              开通会员
            </Link>
          ) : (
            <Link
              href={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors"
            >
              查看详情
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
