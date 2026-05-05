"use client";

import { useState } from "react";

interface MovieImageProps {
  src: string | null;
  alt: string;
  className?: string;
  type?: "poster" | "backdrop" | "profile";
}

function getFallback(type: "poster" | "backdrop" | "profile") {
  const gradients = {
    poster: "from-purple-900 via-blue-900 to-black",
    backdrop: "from-gray-900 via-blue-900 to-gray-900",
    profile: "from-gray-700 via-gray-800 to-gray-900",
  };
  return gradients[type];
}

function getIcon(type: "poster" | "backdrop" | "profile") {
  if (type === "poster") return "🎬";
  if (type === "backdrop") return "🎥";
  return "🌟";
}

export default function MovieImage({
  src,
  alt,
  className = "",
  type = "poster",
}: MovieImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${getFallback(type)} ${className}`}
      >
        <span className="text-4xl opacity-40">{getIcon(type)}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getFallback(type)} animate-pulse`}
        >
          <span className="text-4xl opacity-20">{getIcon(type)}</span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity`}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
    </div>
  );
}
