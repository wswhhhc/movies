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

    const { plan } = await request.json();
    const planConfig = PLANS.find((p) => p.id === plan);
    if (!planConfig) {
      return NextResponse.json({ error: "无效的套餐" }, { status: 400 });
    }

    // 生成订单号
    const orderNo = `MOVIE${Date.now()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // 创建订单
    await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNo,
        amount: planConfig.price,
        plan: planConfig.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      orderNo,
      redirect: `/checkout/${orderNo}`,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "创建订单失败" }, { status: 500 });
  }
}
