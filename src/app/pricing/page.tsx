"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PLANS } from "@/lib/pricing";

function PricingContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handlePurchase(planId: string) {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(planId);
    setError("");

    try {
      const res = await fetch("/api/alipay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "创建订单失败");
        setLoading(null);
        return;
      }

      // 跳转到模拟支付页面
      router.push(data.redirect);
    } catch {
      setError("创建订单失败，请稍后重试");
      setLoading(null);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">会员计划</h1>
          <p className="text-gray-400">
            解锁全部功能，享受极致观影体验
          </p>
        </div>

        {/* 成功提示 */}
        {success && (
          <div className="mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center">
            支付成功！感谢你的支持 🎉
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
            {error}
          </div>
        )}

        {/* 套餐卡片 */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 flex flex-col"
            >
              {/* 标签 */}
              {plan.id === "yearly" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-xs font-medium text-white">
                  推荐
                </div>
              )}
              {plan.id === "forever" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-500 rounded-full text-xs font-medium text-white">
                  超值
                </div>
              )}

              <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">
                    ¥{plan.price}
                  </span>
                  {plan.id !== "forever" && (
                    <span className="text-gray-400 text-sm ml-1">
                      {plan.id === "monthly" ? "/月" : "/年"}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    无广告清爽体验
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    高清画质优先
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    独家内容访问
                  </li>
                  {plan.id === "yearly" && (
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      省 40% 比月付
                    </li>
                  )}
                  {plan.id === "forever" && (
                    <li className="flex items-center gap-2 text-sm text-gray-300">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      终身更新
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading !== null}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.id === "yearly"
                      ? "bg-primary hover:bg-primary/90 text-white"
                      : plan.id === "forever"
                        ? "bg-purple-500 hover:bg-purple-600 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {loading === plan.id
                    ? "处理中..."
                    : session
                      ? "立即开通"
                      : "登录后购买"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            支付安全由支付宝提供保障 · 支持支付宝付款
          </p>
          <p className="text-xs text-gray-600 mt-2">
            购买即表示同意服务条款。如需帮助请联系客服。
          </p>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function PricingPage() {
  return (
    <Suspense fallback={null}>
      <PricingContent />
    </Suspense>
  );
}
