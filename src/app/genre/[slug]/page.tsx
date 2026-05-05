import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getEffectiveRole, isPremiumMovie } from "@/lib/content-gate";
import { prisma } from "@/lib/prisma";
import MovieGrid from "@/components/movie/MovieGrid";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import GenrePageContent from "./GenrePageContent";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sortBy?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const genre = await prisma.genre.findUnique({ where: { slug } });

  if (!genre) return { title: "分类未找到" };

  return {
    title: `${genre.nameZh}电影 - Movie推荐`,
    description: `浏览${genre.nameZh}类型电影`,
  };
}

export default async function GenrePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr, sortBy: sortByStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr || "1"));
  const sortBy = sortByStr || "popularity";

  const genre = await prisma.genre.findUnique({
    where: { slug },
  });

  if (!genre) notFound();

  const session = await getServerSession(authOptions);
  const role = getEffectiveRole(session);

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const allowedSortFields = ["popularity", "vote_average", "release_date", "title"];
  const actualSortBy = allowedSortFields.includes(sortBy) ? sortBy : "popularity";

  const [movies, total] = await Promise.all([
    prisma.movie.findMany({
      where: {
        genres: { some: { genreId: genre.id } },
      },
      include: { genres: { include: { genre: true } } },
      orderBy: { [actualSortBy]: "desc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.movie.count({
      where: {
        genres: { some: { genreId: genre.id } },
      },
    }),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{genre.nameZh}</h1>
          <p className="text-muted text-sm mt-1">
            {total} 部电影
          </p>
        </div>
      </div>

      <GenrePageContent
        movies={movies.map(m => ({
          ...m,
          locked: role === "FREE" && isPremiumMovie(m),
        }))}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        slug={slug}
        currentSortBy={sortBy}
      />
    </div>
  );
}
