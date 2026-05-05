import { TMDB_API_BASE } from "../src/lib/constants";

const API_KEY = process.env.TMDB_API_KEY;

if (!API_KEY) {
  console.error(
    "TMDB_API_KEY environment variable is not set. Please set it in .env.local"
  );
  process.exit(1);
}

const headers = {
  accept: "application/json",
};

interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

interface TMDBMovieSummary {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
}

interface TMDBGenre {
  id: number;
  name: string;
}

interface TMDBMovieDetail {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  runtime: number | null;
  adult: boolean;
  genres: TMDBGenre[];
  translations?: {
    translations: Array<{
      iso_639_1: string;
      iso_3166_1: string;
      name: string;
      data: {
        title: string;
        overview: string;
      };
    }>;
  };
}

interface TMDBCastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
  order: number;
}

interface TMDBMovieCredits {
  id: number;
  cast: TMDBCastMember[];
  crew: Array<{
    id: number;
    name: string;
    profile_path: string | null;
    job: string;
  }>;
}

async function tmdbFetch<T>(url: string): Promise<T> {
  const separator = url.includes("?") ? "&" : "?";
  const response = await fetch(`${url}${separator}api_key=${API_KEY}`, { headers });
  if (!response.ok) {
    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText} for URL: ${url}`
    );
  }
  return response.json();
}

export function fetchGenres(language: string = "zh-CN") {
  return tmdbFetch<{ genres: TMDBGenre[] }>(
    `${TMDB_API_BASE}/genre/movie/list?language=${language}`
  );
}

export function fetchPopularMovies(
  page: number = 1,
  language: string = "zh-CN"
) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovieSummary>>(
    `${TMDB_API_BASE}/movie/popular?language=${language}&page=${page}`
  );
}

export function fetchTopRatedMovies(
  page: number = 1,
  language: string = "zh-CN"
) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovieSummary>>(
    `${TMDB_API_BASE}/movie/top_rated?language=${language}&page=${page}`
  );
}

export function fetchNowPlayingMovies(
  page: number = 1,
  language: string = "zh-CN"
) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovieSummary>>(
    `${TMDB_API_BASE}/movie/now_playing?language=${language}&page=${page}`
  );
}

export function fetchUpcomingMovies(
  page: number = 1,
  language: string = "zh-CN"
) {
  return tmdbFetch<TMDBPaginatedResponse<TMDBMovieSummary>>(
    `${TMDB_API_BASE}/movie/upcoming?language=${language}&page=${page}`
  );
}

export function fetchMovieDetail(
  id: number,
  language: string = "zh-CN"
): Promise<TMDBMovieDetail> {
  return tmdbFetch<TMDBMovieDetail>(
    `${TMDB_API_BASE}/movie/${id}?language=${language}&append_to_response=translations`
  );
}

export function fetchMovieCredits(
  id: number,
  language: string = "zh-CN"
): Promise<TMDBMovieCredits> {
  return tmdbFetch<TMDBMovieCredits>(
    `${TMDB_API_BASE}/movie/${id}/credits?language=${language}`
  );
}

export type {
  TMDBMovieSummary,
  TMDBGenre,
  TMDBMovieDetail,
  TMDBCastMember,
  TMDBMovieCredits,
  TMDBPaginatedResponse,
};
