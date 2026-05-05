export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-primary text-lg font-bold">Movie</span>
            <span className="text-white text-lg font-light">推荐</span>
          </div>
          <p className="text-sm text-muted">
            数据来源: TMDB (The Movie Database)
          </p>
          <p className="text-xs text-muted">
            Built with Next.js & Prisma
          </p>
        </div>
      </div>
    </footer>
  );
}
