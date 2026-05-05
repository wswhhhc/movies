import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getEffectiveRole, isPremiumMovie } from "@/lib/content-gate";
import { prisma } from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      parseInt(searchParams.get("limit") || String(ITEMS_PER_PAGE)),
      50
    );
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const year = searchParams.get("year") || "";
    const minRating = searchParams.get("minRating") || "";
    const sortBy = (searchParams.get("sortBy") || "popularity") as string;
    const sortOrder = (searchParams.get("sortOrder") || "desc") as string;

    const where: Prisma.MovieWhereInput = {};

    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { overview: { contains: search } },
        { originalTitle: { contains: search } },
      ];
    }

    // Genre filter
    if (genre) {
      const genreId = parseInt(genre);
      if (!isNaN(genreId)) {
        where.genres = {
          some: { genreId },
        };
      }
    }

    // Year filter
    if (year) {
      const yearStr = String(year);
      where.releaseDate = {
        startsWith: yearStr,
      };
    }

    // Rating filter
    if (minRating) {
      const rating = parseFloat(minRating);
      if (!isNaN(rating)) {
        where.voteAverage = {
          gte: rating,
        };
      }
    }

    // Build orderBy
    const allowedSortFields = ["popularity", "vote_average", "release_date", "title"];
    const actualSortBy = allowedSortFields.includes(sortBy) ? sortBy : "popularity";
    const actualSortOrder = sortOrder === "asc" ? "asc" : "desc";

    const session = await getServerSession(authOptions);
    const role = getEffectiveRole(session);

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        include: {
          genres: {
            include: { genre: true },
          },
        },
        orderBy: { [actualSortBy]: actualSortOrder },
        skip,
        take: limit,
      }),
      prisma.movie.count({ where }),
    ]);

    const moviesWithLock = movies.map((m) => ({
      ...m,
      locked: role === "FREE" && isPremiumMovie(m),
    }));

    return NextResponse.json({
      data: moviesWithLock,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
