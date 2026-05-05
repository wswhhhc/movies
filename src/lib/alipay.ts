import { AlipaySdk } from "alipay-sdk";

function createAlipay() {
  const appId = process.env.ALIPAY_APP_ID;
  if (!appId) return null;

  const isTest = appId.startsWith("902100");

  return new AlipaySdk({
    appId,
    privateKey: process.env.ALIPAY_PRIVATE_KEY!,
    alipayPublicKey: isTest
      ? undefined
      : process.env.ALIPAY_PUBLIC_KEY,
    gateway: isTest
      ? "https://openapi-sandbox.dl.alipaydev.com/gateway.do"
      : "https://openapi.alipay.com/gateway.do",
  });
}

export const alipay = createAlipay();

// 生成电脑网站支付跳转 URL
export async function createPagePayForm(
  orderNo: string,
  amount: number,
  subject: string,
  returnUrl: string
): Promise<string> {
  if (!alipay) {
    throw new Error("支付宝未配置，请在 .env.local 中设置 ALIPAY_APP_ID");
  }

  const result = await alipay.pageExec("alipay.trade.page.pay", "GET", {
    notifyUrl: `${process.env.NEXTAUTH_URL}/api/alipay/notify`,
    returnUrl,
    bizContent: {
      out_trade_no: orderNo,
      product_code: "FAST_INSTANT_TRADE_PAY",
      total_amount: amount.toFixed(2),
      subject,
    },
  });
  return result;
}
