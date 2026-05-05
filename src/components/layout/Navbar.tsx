"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

function getDaysRemaining(subscriptionEndsAt: string | null | undefined): number {
  if (!subscriptionEndsAt) return 0;
  const end = new Date(subscriptionEndsAt);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const daysLeft = getDaysRemaining(session?.user?.subscriptionEndsAt);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary text-2xl font-bold">Movie</span>
            <span className="text-white text-2xl font-light">推荐</span>
          </Link>

          {/* Navigation links */}
          <div className="hidden sm:flex items-center justify-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>首页</span>
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>搜索</span>
            </Link>
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary hover:text-white hover:bg-primary/20 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>会员</span>
            </Link>
          </div>

          {/* Right side: Auth buttons */}
          <div className="flex items-center gap-3">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <span className="text-sm text-gray-300 hidden md:block">
                    {session.user.name || session.user.email}
                  </span>
                  {session.user.role === "PREMIUM" && (
                    <span className="hidden md:inline-flex text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                      会员
                    </span>
                  )}
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#16162a] border border-white/10 shadow-xl z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm text-white font-medium truncate">
                          {session.user.name || "用户"}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {session.user.email}
                        </p>
                      </div>

                      {/* 会员信息 */}
                      <div className="px-4 py-2 border-b border-white/10">
                        {session.user.role === "PREMIUM" ? (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">会员剩余</span>
                            <span className="text-xs font-medium text-primary">
                              {daysLeft > 0 ? `${daysLeft} 天` : "即将到期"}
                            </span>
                          </div>
                        ) : (
                          <Link
                            href="/pricing"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-center gap-1.5 text-xs text-primary hover:text-primary/90 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            开通会员
                          </Link>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          signOut();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        退出登录
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium transition-colors hidden md:block"
                >
                  注册
                </Link>
              </div>
            )}

            {/* Mobile search link */}
            <Link
              href="/search"
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
