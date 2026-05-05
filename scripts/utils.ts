export class RateLimiter {
  private lastRequestTime = 0;
  private minIntervalMs: number;

  constructor(requestsPerSecond: number = 40) {
    this.minIntervalMs = 1000 / requestsPerSecond;
  }

  async throttle(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minIntervalMs) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minIntervalMs - elapsed)
      );
    }
    this.lastRequestTime = Date.now();
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
