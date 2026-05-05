interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "没有找到匹配的电影",
  description = "请尝试调整搜索条件或筛选器",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4 opacity-30">🎬</div>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  );
}
