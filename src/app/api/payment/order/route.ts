import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/pricing";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const url = new URL(request.url);
    const orderNo = url.searchParams.get("orderNo");
    if (!orderNo) {
      return NextResponse.json({ error: "订单号不能为空" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNo },
    });

    if (!order) {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "无权访问" }, { status: 403 });
    }

    const planConfig = PLANS.find((p) => p.id === order.plan);

    return NextResponse.json({
      orderNo: order.orderNo,
      plan: order.plan,
      amount: order.amount,
      status: order.status,
      planName: planConfig?.name || order.plan,
      paidAt: order.paidAt,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Order query error:", error);
    return NextResponse.json({ error: "查询失败" }, { status: 500 });
  }
}
