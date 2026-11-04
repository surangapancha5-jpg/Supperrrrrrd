export type TabType = 'games' | 'live' | 'ai' | 'music' | 'profile' | 'settings';

export type GameId = 'dam' | 'chess' | 'ludo' | 'water_sort' | 'animal_puzzle' | 'memory';

export interface UserProfile {
  name: string;
  avatar: string;
  about: string;
  coins: number;
  xp: number;
  level: number;
  isVerified: boolean;
  gamesPlayed: number;
  gamesWon: number;
  streakCount: number;
  lastLoginDate: string;
  unlockedWaterSortLevel: number;
  unlockedPuzzleLevel: number;
}

export interface AppSettings {
  language: 'si' | 'en';
  theme: 'dark' | 'light';
  rgbEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  botDifficulty: 'easy' | 'medium' | 'hard';
  boardTheme: 'classic' | 'wood' | 'neon' | 'marble';
  autoQueenChess: boolean;
  allowSpectators: boolean;
  notificationFrequency: 'high' | 'normal' | 'low';
}

export interface DailyMission {
  id: string;
  title: { en: string; si: string };
  description: { en: string; si: string };
  target: number;
  current: number;
  rewardCoins: number;
  rewardXp: number;
  isCompleted: boolean;
  isClaimed: boolean;
  gameId?: GameId;
}

export interface StreakMilestone {
  day: number;
  rewardCoins: number;
  label: { en: string; si: string };
}

export interface SimulatedPlayer {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  isVerified: boolean;
  status: 'online' | 'in_lobby' | 'in_game';
  favoriteGame: 'chess' | 'ludo' | 'dam';
  country: string;
}

export interface SimulatedMatch {
  id: string;
  gameType: 'chess' | 'ludo' | 'dam';
  player1: SimulatedPlayer;
  player2: SimulatedPlayer;
  score1: number;
  score2: number;
  spectators: number;
  status: 'live' | 'finished';
  recentMove: string;
  boardState?: unknown;
}

export interface MatchInvite {
  id: string;
  fromPlayer: SimulatedPlayer;
  gameType: 'chess' | 'ludo' | 'dam';
  timestamp: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  isUserUploaded?: boolean;
}
