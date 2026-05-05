import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      include: {
        _count: { select: { movies: true } },
      },
      orderBy: { nameZh: "asc" },
    });

    return NextResponse.json({ data: genres });
  } catch (error) {
    console.error("Error fetching genres:", error);
    return NextResponse.json(
      { error: "Failed to fetch genres" },
      { status: 500 }
    );
  }
}
