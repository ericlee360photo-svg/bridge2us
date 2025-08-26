export interface TokenBalance {
  userId: string;
  balance: number;
  lastDailyClaim: string; // ISO date string
  totalEarned: number;
  totalSpent: number;
}

export interface WidgetCost {
  id: string;
  name: string;
  cost: number;
  isFree: boolean;
  description: string;
}

// Widget costs configuration
export const WIDGET_COSTS: WidgetCost[] = [
  { id: 'countdown', name: 'Countdown Clock', cost: 0, isFree: true, description: 'Time until next meetup' },
  { id: 'worldmap', name: 'World Map', cost: 0, isFree: true, description: 'Interactive distance map' },
  { id: 'partner-weather', name: 'Partner Weather', cost: 0, isFree: true, description: 'Current weather at partner location' },
  { id: 'time-display', name: 'Time Display', cost: 0, isFree: true, description: 'Partner current time' },
  { id: 'relationship-stats', name: 'Relationship Stats', cost: 5, isFree: false, description: 'Days together, meetups, messages' },
  { id: 'recent-activity', name: 'Recent Activity', cost: 3, isFree: false, description: 'Last interactions timeline' },
  { id: 'upcoming-events', name: 'Upcoming Events', cost: 4, isFree: false, description: 'Calendar of future events' },
  { id: 'quick-actions', name: 'Quick Actions', cost: 2, isFree: false, description: 'Message, call, calendar shortcuts' },
  { id: 'weather-forecast', name: 'Weather Forecast', cost: 3, isFree: false, description: '7-day weather forecast' },
  { id: 'timezone-converter', name: 'Timezone Converter', cost: 2, isFree: false, description: 'Convert times between zones' },
  { id: 'mood-tracker', name: 'Mood Tracker', cost: 4, isFree: false, description: 'Track daily moods' },
  { id: 'photo-gallery', name: 'Photo Gallery', cost: 6, isFree: false, description: 'Shared photo memories' },
  { id: 'voice-messages', name: 'Voice Messages', cost: 5, isFree: false, description: 'Send voice notes' },
  { id: 'gift-suggestions', name: 'Gift Suggestions', cost: 3, isFree: false, description: 'AI-powered gift ideas' },
  { id: 'date-planner', name: 'Date Planner', cost: 4, isFree: false, description: 'Plan virtual dates' }
];

// Daily token distribution
export const DAILY_TOKENS = 10; // Users get 10 tokens per day

// Token management functions
export function canClaimDailyTokens(lastClaim: string): boolean {
  const lastClaimDate = new Date(lastClaim);
  const today = new Date();
  return lastClaimDate.toDateString() !== today.toDateString();
}

export function getDaysSinceLastClaim(lastClaim: string): number {
  const lastClaimDate = new Date(lastClaim);
  const today = new Date();
  const diffTime = today.getTime() - lastClaimDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateDailyTokens(lastClaim: string): number {
  const daysSince = getDaysSinceLastClaim(lastClaim);
  return Math.min(daysSince * DAILY_TOKENS, DAILY_TOKENS * 7); // Cap at 7 days worth
}

export function canAffordWidget(balance: number, widgetId: string): boolean {
  const widget = WIDGET_COSTS.find(w => w.id === widgetId);
  if (!widget) return false;
  return widget.isFree || balance >= widget.cost;
}

export function getWidgetCost(widgetId: string): number {
  const widget = WIDGET_COSTS.find(w => w.id === widgetId);
  return widget?.cost || 0;
}

export function isFreeWidget(widgetId: string): boolean {
  const widget = WIDGET_COSTS.find(w => w.id === widgetId);
  return widget?.isFree || false;
}

// Mock token storage (replace with database)
const tokenStorage = new Map<string, TokenBalance>();

export function getTokenBalance(userId: string): TokenBalance {
  if (!tokenStorage.has(userId)) {
    const today = new Date().toISOString();
    tokenStorage.set(userId, {
      userId,
      balance: DAILY_TOKENS, // Start with daily tokens
      lastDailyClaim: today,
      totalEarned: DAILY_TOKENS,
      totalSpent: 0
    });
  }
  return tokenStorage.get(userId)!;
}

export function claimDailyTokens(userId: string): TokenBalance {
  const balance = getTokenBalance(userId);
  
  if (canClaimDailyTokens(balance.lastDailyClaim)) {
    const tokensToAdd = calculateDailyTokens(balance.lastDailyClaim);
    const newBalance: TokenBalance = {
      ...balance,
      balance: balance.balance + tokensToAdd,
      lastDailyClaim: new Date().toISOString(),
      totalEarned: balance.totalEarned + tokensToAdd
    };
    tokenStorage.set(userId, newBalance);
    return newBalance;
  }
  
  return balance;
}

export function spendTokens(userId: string, amount: number): TokenBalance | null {
  const balance = getTokenBalance(userId);
  
  if (balance.balance >= amount) {
    const newBalance: TokenBalance = {
      ...balance,
      balance: balance.balance - amount,
      totalSpent: balance.totalSpent + amount
    };
    tokenStorage.set(userId, newBalance);
    return newBalance;
  }
  
  return null; // Insufficient tokens
}

export function purchaseWidget(userId: string, widgetId: string): boolean {
  const cost = getWidgetCost(widgetId);
  if (cost === 0) return true; // Free widget
  
  const newBalance = spendTokens(userId, cost);
  return newBalance !== null;
}
