import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="text-8xl mb-4">404</div>
      <h2 className="text-2xl font-bold text-white mb-2">页面未找到</h2>
      <p className="text-muted mb-6">你寻找的页面不存在</p>
      <Link
        href="/"
        className="inline-flex px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
