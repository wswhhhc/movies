import Link from "next/link";
import { tmdbImage, ImageSize } from "@/lib/tmdb-image";
import RatingStar from "@/components/ui/RatingStar";
import MovieImage from "@/components/ui/MovieImage";

interface MovieCardProps {
  movie: {
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
  };
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = tmdbImage(movie.posterPath, ImageSize.POSTER_MEDIUM);
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <Link href={movie.locked ? "/pricing" : `/movie/${movie.id}`} className="group block">
      <div className="relative rounded-lg overflow-hidden bg-card-bg transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-black/30">
        {/* Poster */}
        <div className="aspect-[2/3]">
          <MovieImage
            src={posterUrl}
            alt={movie.title}
            type="poster"
            className="w-full h-full"
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Premium lock overlay */}
        {movie.locked && (
          <>
            <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-primary to-primary/80 text-white text-xs px-2 py-0.5 rounded-md font-medium shadow-lg">
              会员专属
            </div>
            <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-primary text-xs font-medium">开通会员</span>
            </div>
          </>
        )}

        {/* Rating badge */}
        {movie.voteAverage != null && movie.voteAverage > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 rounded-lg px-2 py-1 backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-xs">★</span>
              <span className="text-white text-xs font-semibold">
                {movie.voteAverage.toFixed(1)}
              </span>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-sm text-white truncate group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {year && (
              <span className="text-xs text-muted">{year}</span>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <span className="text-xs text-muted truncate">
                {movie.genres[0].genre.nameZh}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
