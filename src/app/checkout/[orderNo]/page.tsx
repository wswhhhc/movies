"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { PLANS } from "@/lib/pricing";

type Step = "confirm" | "scan" | "paying" | "success";

export default function CheckoutPage() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<Step>("confirm");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [orderInfo, setOrderInfo] = useState<{
    amount: number;
    planName: string;
    plan: string;
  } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 加载订单信息
  useEffect(() => {
    if (!orderNo || !session) return;
    fetch(`/api/payment/order?orderNo=${orderNo}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.amount) setOrderInfo(data);
      })
      .catch(() => {});
  }, [orderNo, session]);

  // 未登录跳转
  useEffect(() => {
    if (session === null) router.push("/login");
  }, [session, router]);

  // 支付成功后倒计时跳转
  useEffect(() => {
    if (step === "success" && countdown <= 0) {
      router.push("/pricing?success=true");
    }
  }, [step, countdown, router]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, []);

  async function handleConfirmPay() {
    setPaying(true);
    setError("");

    try {
      const res = await fetch("/api/payment/mock-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "支付失败");
        setPaying(false);
        return;
      }
    } catch {
      setError("支付失败，请稍后重试");
      setPaying(false);
      return;
    }

    // 进入扫码流程
    setStep("scan");
    setPaying(false);

    // 2秒后模拟扫码完成
    scanTimerRef.current = setTimeout(() => {
      setStep("paying");
      // 1.5秒后支付完成
      setTimeout(() => {
        setStep("success");
        setCountdown(5);
        timerRef.current = setInterval(() => {
          setCountdown((c) => c - 1);
        }, 1000);
      }, 1500);
    }, 2000);
  }

  if (!session) return null;

  const planConfig = PLANS.find((p) => p.id === orderInfo?.plan);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* ===== 步骤1: 确认订单 ===== */}
        {step === "confirm" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {/* 头部 */}
            <div className="p-6 border-b border-white/10">
              <h1 className="text-lg font-bold text-white text-center">
                确认订单
              </h1>
            </div>

            {/* 商品信息 */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-medium">{planConfig?.name || orderInfo?.planName || "会员套餐"}</p>
                  <p className="text-sm text-gray-400">
                    {planConfig?.description || ""}
                  </p>
                </div>
              </div>

              {/* 金额 */}
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                <span className="text-gray-300">订单金额</span>
                <span className="text-2xl font-bold text-white">
                  ¥{orderInfo?.amount?.toFixed(2) || "—"}
                </span>
              </div>

              {/* 订单号 */}
              <div className="text-xs text-gray-500 text-center">
                订单号：{orderNo}
              </div>
            </div>

            {error && (
              <div className="px-6 pb-2">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                  {error}
                </div>
              </div>
            )}

            {/* 支付方式 */}
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-400 mb-3">支付方式</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-sm text-blue-300 font-medium">支付宝</span>
                <span className="text-xs text-gray-500 ml-auto">推荐</span>
              </div>
            </div>

            {/* 确认按钮 */}
            <div className="p-6 pt-0">
              <button
                onClick={handleConfirmPay}
                disabled={paying}
                className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paying ? "处理中..." : "立即支付 ¥" + (orderInfo?.amount?.toFixed(2) || "—")}
              </button>
              <p className="mt-3 text-xs text-center text-gray-500">
                点击即表示同意《服务协议》
              </p>
            </div>
          </div>
        )}

        {/* ===== 步骤2: 扫码支付 ===== */}
        {step === "scan" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <h2 className="text-lg font-bold text-white mb-6">扫码支付</h2>

            {/* 模拟二维码 */}
            <div className="relative w-56 h-56 mx-auto mb-4">
              <div className="w-full h-full bg-white rounded-xl p-3">
                <div className="w-full h-full relative overflow-hidden">
                  {/* 模拟二维码图案 */}
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <rect x="10" y="10" width="40" height="40" rx="4" fill="#000" />
                    <rect x="60" y="10" width="30" height="40" rx="2" fill="#000" />
                    <rect x="150" y="10" width="40" height="40" rx="4" fill="#000" />
                    <rect x="10" y="60" width="40" height="30" rx="2" fill="#000" />
                    <rect x="100" y="60" width="30" height="30" rx="2" fill="#000" />
                    <rect x="150" y="60" width="40" height="30" rx="2" fill="#000" />
                    <rect x="10" y="150" width="40" height="40" rx="4" fill="#000" />
                    <rect x="60" y="150" width="80" height="40" rx="2" fill="#000" />
                    <rect x="150" y="150" width="40" height="40" rx="4" fill="#000" />
                    <rect x="60" y="100" width="30" height="30" rx="2" fill="#000" />
                    <rect x="130" y="110" width="20" height="20" rx="2" fill="#000" />
                    <rect x="80" y="140" width="20" height="10" rx="1" fill="#000" />
                    <rect x="110" y="30" width="20" height="10" rx="1" fill="#000" />
                    {/* 旋转动画指示器 */}
                    <circle cx="100" cy="100" r="35" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="10 5" opacity="0.6">
                      <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              </div>
              {/* 扫描动画 */}
              <div className="absolute top-3 left-3 right-3 h-0.5 bg-primary opacity-70 rounded-full"
                style={{
                  animation: "scanMove 2s ease-in-out infinite",
                }}
              />
            </div>

            <p className="text-sm text-gray-300 mb-1">请使用支付宝扫码付款</p>
            <p className="text-xs text-gray-500">模拟演示 — 自动识别支付结果</p>

            <div className="mt-6 flex items-center justify-center gap-1 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              等待扫码...
            </div>
          </div>
        )}

        {/* ===== 步骤3: 支付处理中 ===== */}
        {step === "paying" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">支付处理中</h2>
            <p className="text-sm text-gray-400">请勿关闭页面...</p>
            <div className="mt-6 w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        )}

        {/* ===== 步骤4: 支付成功 ===== */}
        {step === "success" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            {/* 成功动画 */}
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">支付成功 🎉</h2>
            <p className="text-gray-400 mb-1">{planConfig?.name || "会员"}已开通</p>
            <p className="text-sm text-gray-500 mb-6">{countdown} 秒后自动跳转...</p>

            {/* 订单详情 */}
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">订单号</span>
                <span className="text-gray-300 font-mono text-xs">{orderNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">支付方式</span>
                <span className="text-gray-300">支付宝</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">实付金额</span>
                <span className="text-white font-bold">¥{orderInfo?.amount?.toFixed(2) || "—"}</span>
              </div>
            </div>

            <button
              onClick={() => router.push("/pricing?success=true")}
              className="mt-6 w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
            >
              立即体验
            </button>
          </div>
        )}
      </div>

      {/* 扫描动画样式 */}
      <style jsx>{`
        @keyframes scanMove {
          0%, 100% { top: 10%; }
          50% { top: 85%; }
        }
      `}</style>
    </div>
  );
}
