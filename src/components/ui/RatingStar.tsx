interface RatingStarProps {
  rating: number | null;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
}

export default function RatingStar({
  rating,
  maxRating = 10,
  size = "md",
}: RatingStarProps) {
  const safeRating = rating ?? 0;
  const safeMax = maxRating ?? 10;
  const percentage = Math.min((safeRating / safeMax) * 100, 100);
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div className={`${sizeClasses[size]} text-gray-600`}>★</div>
        <div
          className={`absolute top-0 left-0 overflow-hidden ${sizeClasses[size]} text-yellow-400`}
          style={{ width: `${percentage}%` }}
        >
          ★
        </div>
      </div>
      <span className={`font-semibold ${size === "lg" ? "text-xl" : "text-sm"}`}>
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
}
