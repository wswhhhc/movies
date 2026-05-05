import "dotenv/config";
import { PrismaSqlite } from "prisma-adapter-sqlite";
import { PrismaClient } from "../src/generated/prisma/client";
import { TMDB_API_BASE } from "../src/lib/constants";
import { RateLimiter } from "./utils";
import {
  fetchGenres,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchNowPlayingMovies,
  fetchUpcomingMovies,
  fetchMovieCredits,
} from "./tmdb";

const adapter = new PrismaSqlite({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });
const rateLimiter = new RateLimiter(40);

const CONFIG = {
  popularPages: 10,
  topRatedPages: 5,
  nowPlayingPages: 3,
  upcomingPages: 2,
};

async function seedGenres(): Promise<void> {
  console.log("Seeding genres...");
  const { genres } = await fetchGenres();

  const slugMap: Record<string, string> = {
    Action: "action",
    Adventure: "adventure",
    Animation: "animation",
    Comedy: "comedy",
    Crime: "crime",
    Documentary: "documentary",
    Drama: "drama",
    Family: "family",
    Fantasy: "fantasy",
    History: "history",
    Horror: "horror",
    Music: "music",
    Mystery: "mystery",
    Romance: "romance",
    "Science Fiction": "science-fiction",
    "TV Movie": "tv-movie",
    Thriller: "thriller",
    War: "war",
    Western: "western",
  };

  const nameZhMap: Record<string, string> = {
    Action: "动作",
    Adventure: "冒险",
    Animation: "动画",
    Comedy: "喜剧",
    Crime: "犯罪",
    Documentary: "纪录片",
    Drama: "剧情",
    Family: "家庭",
    Fantasy: "奇幻",
    History: "历史",
    Horror: "恐怖",
    Music: "音乐",
    Mystery: "悬疑",
    Romance: "爱情",
    "Science Fiction": "科幻",
    "TV Movie": "电视电影",
    Thriller: "惊悚",
    War: "战争",
    Western: "西部",
  };

  for (const genre of genres) {
    const nameEn = genre.name;
    const slug = slugMap[nameEn] || nameEn.toLowerCase().replace(/\s+/g, "-");
    const nameZh = nameZhMap[nameEn] || nameEn;

    await prisma.genre.upsert({
      where: { id: genre.id },
      update: { nameZh, nameEn, slug },
      create: { id: genre.id, nameZh, nameEn, slug },
    });
  }
  console.log(`  ✓ ${genres.length} genres seeded`);
}

async function fetchMovieChineseTitle(
  movieId: number
): Promise<{ title: string; overview: string } | null> {
  try {
    const url = `${TMDB_API_BASE}/movie/${movieId}/translations?api_key=${process.env.TMDB_API_KEY}`;
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const zhTranslation = data.translations?.find(
      (t: { iso_639_1: string }) => t.iso_639_1 === "zh-CN"
    );

    if (zhTranslation?.data?.title) {
      return {
        title: zhTranslation.data.title,
        overview: zhTranslation.data.overview || "",
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function seedMovies(): Promise<{
  moviesCount: number;
  castsCount: number;
}> {
  let moviesCount = 0;
  let castsCount = 0;
  const processedMovieIds = new Set<number>();

  type CategoryConfig = {
    name: string;
    fetcher: (page: number) => Promise<{
      results: Array<{
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
      }>;
      total_pages: number;
    }>;
    pages: number;
  };

  const categories: CategoryConfig[] = [
    { name: "Popular", fetcher: (p) => fetchPopularMovies(p), pages: CONFIG.popularPages },
    { name: "Top Rated", fetcher: (p) => fetchTopRatedMovies(p), pages: CONFIG.topRatedPages },
    { name: "Now Playing", fetcher: (p) => fetchNowPlayingMovies(p), pages: CONFIG.nowPlayingPages },
    { name: "Upcoming", fetcher: (p) => fetchUpcomingMovies(p), pages: CONFIG.upcomingPages },
  ];

  for (const category of categories) {
    console.log(`Seeding ${category.name} movies...`);

    for (let page = 1; page <= category.pages; page++) {
      await rateLimiter.throttle();
      const data = await category.fetcher(page);
      const movies = data.results;

      for (const movie of movies) {
        if (processedMovieIds.has(movie.id)) continue;
        processedMovieIds.add(movie.id);

        // Fetch Chinese title
        await rateLimiter.throttle();
        const zhData = await fetchMovieChineseTitle(movie.id);
        const chineseTitle = zhData?.title || movie.title;
        const chineseOverview = zhData?.overview || movie.overview;

        // Upsert movie
        try {
          await prisma.movie.upsert({
            where: { id: movie.id },
            update: {
              title: chineseTitle,
              originalTitle: movie.original_title,
              overview: chineseOverview,
              posterPath: movie.poster_path,
              backdropPath: movie.backdrop_path,
              releaseDate: movie.release_date || null,
              voteAverage: movie.vote_average,
              voteCount: movie.vote_count,
              popularity: movie.popularity,
              adult: movie.adult,
            },
            create: {
              id: movie.id,
              title: chineseTitle,
              originalTitle: movie.original_title,
              overview: chineseOverview,
              posterPath: movie.poster_path,
              backdropPath: movie.backdrop_path,
              releaseDate: movie.release_date || null,
              voteAverage: movie.vote_average,
              voteCount: movie.vote_count,
              popularity: movie.popularity,
              runtime: null,
              adult: movie.adult,
            },
          });

          // Upsert genre relations
          if (movie.genre_ids?.length) {
            for (const genreId of movie.genre_ids) {
              await prisma.movieGenre
                .upsert({
                  where: {
                    movieId_genreId: { movieId: movie.id, genreId },
                  },
                  update: {},
                  create: { movieId: movie.id, genreId },
                })
                .catch(() => {
                  /* genre may not exist */
                });
            }
          }

          moviesCount++;
        } catch (err) {
          console.error(`  ✗ Failed to save movie ${movie.id}:`, err);
        }
      }

      console.log(
        `  Page ${page}/${category.pages}: ${movies.length} movies fetched`
      );
    }
  }

  // Fetch credits for movies without casts
  console.log("Seeding cast & crew...");
  const moviesWithoutCasts = await prisma.movie.findMany({
    where: { casts: { none: {} } },
    select: { id: true, title: true },
  });

  for (const movie of moviesWithoutCasts.slice(0, 200)) {
    // Limit to 200 movies for credits
    await rateLimiter.throttle();
    try {
      const credits = await fetchMovieCredits(movie.id);

      // Process top 10 cast members
      const topCast = credits.cast.slice(0, 10);
      for (const member of topCast) {
        await prisma.cast.upsert({
          where: { id: member.id },
          update: {
            name: member.name,
            profilePath: member.profile_path,
          },
          create: {
            id: member.id,
            name: member.name,
            profilePath: member.profile_path,
          },
        });

        await prisma.movieCast.upsert({
          where: {
            movieId_castId_role: {
              movieId: movie.id,
              castId: member.id,
              role: "actor",
            },
          },
          update: {
            characterName: member.character,
            sortOrder: member.order,
          },
          create: {
            movieId: movie.id,
            castId: member.id,
            role: "actor",
            characterName: member.character,
            sortOrder: member.order,
          },
        });

        castsCount++;
      }

      // Process director
      const director = credits.crew?.find((c) => c.job === "Director");
      if (director) {
        await prisma.cast.upsert({
          where: { id: director.id },
          update: {
            name: director.name,
            profilePath: director.profile_path,
          },
          create: {
            id: director.id,
            name: director.name,
            profilePath: director.profile_path,
          },
        });

        await prisma.movieCast.upsert({
          where: {
            movieId_castId_role: {
              movieId: movie.id,
              castId: director.id,
              role: "director",
            },
          },
          update: {},
          create: {
            movieId: movie.id,
            castId: director.id,
            role: "director",
          },
        });

        castsCount++;
      }
    } catch (err) {
      console.error(`  ✗ Failed to fetch credits for movie ${movie.id}:`, err);
    }
  }

  return { moviesCount, castsCount };
}

async function main() {
  console.log("=== TMDB Movie Data Seeder ===\n");

  // Clear existing data
  console.log("Clearing old data...");
  await prisma.movieCast.deleteMany();
  await prisma.movieGenre.deleteMany();
  await prisma.cast.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();
  console.log("  ✓ Old data cleared\n");

  try {
    // Step 1: Seed genres
    await seedGenres();

    // Step 2: Seed movies
    const { moviesCount, castsCount } = await seedMovies();

    // Summary
    const totalMovies = await prisma.movie.count();
    const totalCasts = await prisma.cast.count();
    const totalGenres = await prisma.genre.count();

    console.log("\n=== Seeding Complete ===");
    console.log(`  Genres: ${totalGenres}`);
    console.log(`  Movies: ${totalMovies}`);
    console.log(`  Cast members: ${totalCasts}`);
    console.log(`  \n  (New this run: ${moviesCount} movies, ${castsCount} cast entries)`);
  } catch (error) {
    console.error("\n✗ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
