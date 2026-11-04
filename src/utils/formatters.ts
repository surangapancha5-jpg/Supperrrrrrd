/**
 * Currency formatter as requested:
 * 1,000 -> 1k
 * 100,000 (ලක්ෂයක්) -> 100k
 * 1,000,000 (මිලියනයක්) -> 1m
 */
export function formatCoins(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0';
  
  if (amount >= 1_000_000) {
    const formatted = (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1);
    return `${formatted}m`;
  }
  
  if (amount >= 100_000) {
    const formatted = Math.floor(amount / 1_000);
    return `${formatted}k`;
  }
  
  if (amount >= 1_000) {
    const formatted = (amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1);
    return `${formatted}k`;
  }
  
  return amount.toLocaleString();
}

/**
 * Format XP numbers
 */
export function formatXp(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k XP`;
  }
  return `${xp} XP`;
}

/**
 * Relative time helper (e.g. "Just now", "2m ago")
 */
export function formatRelativeTime(timestamp: number, lang: 'si' | 'en' = 'si'): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 10) return lang === 'si' ? 'දැන්' : 'Just now';
  if (diffSec < 60) return `${diffSec}${lang === 'si' ? 'තත් පෙර' : 's ago'}`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}${lang === 'si' ? 'මිනි පෙර' : 'm ago'}`;
  const diffHours = Math.floor(diffMin / 60);
  return `${diffHours}${lang === 'si' ? 'පැය පෙර' : 'h ago'}`;
}
