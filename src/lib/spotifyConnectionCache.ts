// Simple in-memory cache for Spotify connection status
// Prevents repeated API calls when users are not connected

interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: number;
  failureCount: number;
}

class SpotifyConnectionCache {
  private cache = new Map<string, ConnectionStatus>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_FAILURES = 3; // Stop trying after 3 consecutive failures
  private readonly BACKOFF_MULTIPLIER = 2; // Exponential backoff

  shouldSkipRequest(userId: string): boolean {
    const status = this.cache.get(userId);
    if (!status) return false;

    const now = Date.now();
    const timeSinceLastCheck = now - status.lastChecked;

    // Always enforce minimum 5 minutes between requests
    const minimumInterval = 5 * 60 * 1000; // 5 minutes

    // If connected, still limit to 5 minutes between requests
    if (status.isConnected) {
      return timeSinceLastCheck < minimumInterval;
    }

    // If not connected, use even longer intervals
    const backoffDuration = Math.min(
      minimumInterval * Math.pow(this.BACKOFF_MULTIPLIER, status.failureCount),
      30 * 60 * 1000 // Max 30 minutes
    );

    return timeSinceLastCheck < backoffDuration;
  }

  recordSuccess(userId: string): void {
    this.cache.set(userId, {
      isConnected: true,
      lastChecked: Date.now(),
      failureCount: 0
    });
  }

  recordFailure(userId: string): void {
    const existing = this.cache.get(userId);
    this.cache.set(userId, {
      isConnected: false,
      lastChecked: Date.now(),
      failureCount: existing ? existing.failureCount + 1 : 1
    });
  }

  isConnected(userId: string): boolean {
    const status = this.cache.get(userId);
    return status?.isConnected ?? false;
  }

  clearCache(userId?: string): void {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }

  // Get status for debugging
  getStatus(userId: string): ConnectionStatus | undefined {
    return this.cache.get(userId);
  }
}

export const spotifyConnectionCache = new SpotifyConnectionCache();
