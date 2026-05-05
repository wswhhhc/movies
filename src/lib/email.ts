import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(
  to: string,
  code: string
): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Movie推荐 - 邮箱验证码",
    html: `
      <div style="max-width:480px;margin:0 auto;padding:32px 24px;background:#1a1a2e;border-radius:16px;font-family:Arial,sans-serif;">
        <h1 style="color:#fff;font-size:24px;margin:0 0 16px;text-align:center;">Movie推荐</h1>
        <p style="color:#b0b0c0;font-size:14px;margin:0 0 24px;text-align:center;">你的邮箱验证码</p>
        <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:24px;text-align:center;">
          <span style="font-size:40px;font-weight:bold;color:#f97316;letter-spacing:8px;">${code}</span>
        </div>
        <p style="color:#6b7280;font-size:12px;margin:24px 0 0;text-align:center;">
          验证码有效期为10分钟，请勿泄露给他人。
        </p>
      </div>
    `,
  });
}
