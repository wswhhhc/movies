import { alipay } from "@/lib/alipay";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};
    for (const [key, value] of formData) {
      params[key] = value.toString();
    }

    // 验证签名
    if (!alipay) return new Response("failure");
    const signVerified = alipay.checkNotifySign(params);
    if (!signVerified) {
      console.error("[Alipay] Invalid notify sign");
      return new Response("failure");
    }

    const { out_trade_no, trade_no, trade_status } = params;

    if (!out_trade_no) {
      return new Response("failure");
    }

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { orderNo: out_trade_no },
    });

    if (!order || order.status !== "PENDING") {
      return new Response("success"); // 已处理过，返回 success
    }

    if (trade_status === "TRADE_SUCCESS" || trade_status === "TRADE_FINISHED") {
      // 更新订单状态
      await prisma.order.update({
        where: { orderNo: out_trade_no },
        data: {
          status: "PAID",
          tradeNo: trade_no,
          paidAt: new Date(),
        },
      });

      // 计算会员到期时间
      const planConfig = PLANS.find((p) => p.id === order.plan);
      const days = planConfig?.days || 30;

      const user = await prisma.user.findUnique({
        where: { id: order.userId },
      });

      let newEnd: Date;
      if (user?.subscriptionEndsAt && user.subscriptionEndsAt > new Date()) {
        // 在现有会员期上延长
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

    return new Response("success");
  } catch (error) {
    console.error("[Alipay] Notify error:", error);
    return new Response("failure");
  }
}
