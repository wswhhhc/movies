import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/email";
import { setVerificationCode } from "@/lib/verification-store";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "邮箱不能为空" },
        { status: 400 }
      );
    }

    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`[Verification] Sending code ${code} to ${email}`);

    setVerificationCode(email, code);

    try {
      await sendVerificationEmail(email, code);
    } catch (emailError) {
      console.error("[Verification] Failed to send email:", emailError);
      return NextResponse.json(
        { error: "验证码发送失败，请检查邮箱地址是否正确" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "验证码已发送" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Verification] Error:", error);
    return NextResponse.json(
      { error: "发送失败，请稍后重试" },
      { status: 500 }
    );
  }
}
