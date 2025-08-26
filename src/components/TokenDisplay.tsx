import React, { useState, useEffect } from 'react';
import { Coins, Gift, Clock } from 'lucide-react';
import { 
  TokenBalance, 
  claimDailyTokens, 
  getTokenBalance, 
  canClaimDailyTokens,
  calculateDailyTokens,
  DAILY_TOKENS 
} from '@/lib/tokens';

interface TokenDisplayProps {
  userId: string;
  className?: string;
}

export default function TokenDisplay({ userId, className = '' }: TokenDisplayProps) {
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const balance = getTokenBalance(userId);
    setTokenBalance(balance);
  }, [userId]);

  const handleClaimDaily = async () => {
    if (!tokenBalance || !canClaimDailyTokens(tokenBalance.lastDailyClaim)) return;
    
    setIsClaiming(true);
    try {
      const newBalance = claimDailyTokens(userId);
      setTokenBalance(newBalance);
    } finally {
      setIsClaiming(false);
    }
  };

  if (!tokenBalance) return null;

  const canClaim = canClaimDailyTokens(tokenBalance.lastDailyClaim);
  const availableTokens = canClaim ? calculateDailyTokens(tokenBalance.lastDailyClaim) : 0;

  return (
    <div className={`bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 text-white shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold">{tokenBalance.balance}</div>
            <div className="text-sm opacity-90">Tokens</div>
          </div>
        </div>
        
        <div className="text-right">
          {canClaim ? (
            <button
              onClick={handleClaimDaily}
              disabled={isClaiming}
              className="bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isClaiming ? (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Claiming...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Claim {availableTokens}
                </div>
              )}
            </button>
          ) : (
            <div className="text-sm opacity-75">
              <div>Next claim in</div>
              <div className="font-medium">
                {new Date(tokenBalance.lastDailyClaim).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-xs opacity-75">
        Earn {DAILY_TOKENS} tokens daily • Total earned: {tokenBalance.totalEarned}
      </div>
    </div>
  );
}
