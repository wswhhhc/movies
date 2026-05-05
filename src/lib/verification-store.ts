interface VerificationEntry {
  code: string;
  expiresAt: number;
}

const store = new Map<string, VerificationEntry>();

// 定期清理过期验证码
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.expiresAt < now) {
      store.delete(key);
    }
  }
}, 60_000);

export function setVerificationCode(email: string, code: string): void {
  store.set(email, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10分钟有效期
  });
}

export function verifyCode(email: string, code: string): boolean {
  const entry = store.get(email);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) {
    store.delete(email);
    return false;
  }
  if (entry.code !== code) return false;
  store.delete(email); // 验证成功后删除
  return true;
}
