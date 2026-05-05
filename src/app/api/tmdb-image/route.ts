import { NextRequest, NextResponse } from "next/server";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    const size = searchParams.get("size") || "original";

    if (!path) {
      return new NextResponse("Missing path", { status: 400 });
    }

    const imageUrl = `${TMDB_IMAGE_BASE}${size}${path}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(imageUrl, {
      headers: {
        Accept: "image/webp,image/avif,image/*,*/*",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Stream the response body instead of buffering, for faster TTFB
    if (response.body) {
      return new NextResponse(response.body, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Fallback: buffer if body is null
    const imageBuffer = await response.arrayBuffer();
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("TMDB image proxy error:", error);
    return new NextResponse("Image proxy error", { status: 500 });
  }
}
