interface GenreBadgeProps {
  name: string;
  onClick?: () => void;
}

export default function GenreBadge({ name, onClick }: GenreBadgeProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full border border-gray-600 text-gray-300 ${
        onClick ? "cursor-pointer hover:bg-white/10 hover:border-gray-400 transition-colors" : ""
      }`}
    >
      {name}
    </span>
  );
}
