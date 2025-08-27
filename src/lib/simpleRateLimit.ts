// Simple rate limiter to prevent API spam
// This is a backup to the connection cache

class SimpleRateLimit {
  private lastCalls = new Map<string, number>();
  private readonly RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes

  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const lastCall = this.lastCalls.get(key);
    
    if (!lastCall || (now - lastCall) >= this.RATE_LIMIT_MS) {
      this.lastCalls.set(key, now);
      return true;
    }
    
    console.log(`Rate limit hit for ${key}. Last call was ${Math.round((now - lastCall) / 1000)}s ago`);
    return false;
  }

  reset(key?: string): void {
    if (key) {
      this.lastCalls.delete(key);
    } else {
      this.lastCalls.clear();
    }
  }
}

export const spotifyRateLimit = new SimpleRateLimit();
