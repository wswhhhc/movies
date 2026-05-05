import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { orderNo } = await request.json();
    if (!orderNo) {
      return NextResponse.json({ error: "订单号不能为空" }, { status: 400 });
    }

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { orderNo },
    });

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "无权操作此订单" }, { status: 403 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "订单已处理" }, { status: 400 });
    }

    // 模拟支付成功 — 更新订单状态
    await prisma.order.update({
      where: { orderNo },
      data: {
        status: "PAID",
        tradeNo: `MOCK${Date.now()}`,
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
      newEnd = new Date(user.subscriptionEndsAt.getTime() + days * 86400000);
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

    return NextResponse.json({ message: "支付成功" });
  } catch (error) {
    console.error("Mock pay error:", error);
    return NextResponse.json({ error: "支付失败" }, { status: 500 });
  }
}
