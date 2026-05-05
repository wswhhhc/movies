import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { alipay } from "@/lib/alipay";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/pricing";

export async function GET(request: NextRequest) {
  try {
    const params: Record<string, string> = {};
    for (const [key, value] of request.nextUrl.searchParams) {
      params[key] = value;
    }

    const { out_trade_no, trade_no } = params;

    if (out_trade_no && alipay) {
      // 验证签名
      const signVerified = alipay.checkNotifySign(params);
      if (signVerified) {
        const order = await prisma.order.findUnique({
          where: { orderNo: out_trade_no },
        });

        if (order && order.status === "PENDING") {
          await prisma.order.update({
            where: { orderNo: out_trade_no },
            data: {
              status: "PAID",
              tradeNo: trade_no,
              paidAt: new Date(),
            },
          });

          const planConfig = PLANS.find((p) => p.id === order.plan);
          const days = planConfig?.days || 30;

          const user = await prisma.user.findUnique({
            where: { id: order.userId },
          });

          let newEnd: Date;
          if (user?.subscriptionEndsAt && user.subscriptionEndsAt > new Date()) {
            newEnd = new Date(
              user.subscriptionEndsAt.getTime() + days * 86400000
            );
          } else {
            newEnd = new Date(Date.now() + days * 86400000);
          }

          await prisma.user.update({
            where: { id: order.userId },
            data: {
              role: "PREMIUM",
              subscriptionEndsAt: newEnd,
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("[Alipay] Return error:", error);
  }

  redirect("/pricing?success=true");
}
