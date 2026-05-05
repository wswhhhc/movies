"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="text-6xl mb-4">😵</div>
      <h2 className="text-2xl font-bold text-white mb-2">出错了</h2>
      <p className="text-muted mb-6">
        {error.message || "页面加载时发生了错误"}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors"
      >
        重试
      </button>
    </div>
  );
}
