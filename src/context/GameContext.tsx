import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  AppSettings,
  TabType,
  GameId,
  DailyMission,
  SimulatedPlayer,
  SimulatedMatch,
  MatchInvite,
  StreakMilestone
} from '../types';
import { sound } from '../utils/sound';
import { SIMULATED_PLAYERS, INITIAL_SIMULATED_MATCHES } from '../data/simulatedPlayers';

interface GameContextType {
  profile: UserProfile;
  settings: AppSettings;
  activeTab: TabType;
  selectedGame: GameId | null;
  dailyMissions: DailyMission[];
  streakMilestones: StreakMilestone[];
  isMissionsModalOpen: boolean;
  incomingInvite: MatchInvite | null;
  pendingOutboundInvite: { player: SimulatedPlayer; totalSeconds: number; secondsLeft: number; gameType: 'chess' | 'ludo' | 'dam' } | null;
  activeLiveOpponent: SimulatedPlayer | null;
  spectatingMatch: SimulatedMatch | null;
  liveMatches: SimulatedMatch[];
  onlinePlayers: SimulatedPlayer[];
  currentWager: number;
  
  // Actions
  setActiveTab: (tab: TabType) => void;
  setSelectedGame: (game: GameId | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  buyVerifiedBadge: () => boolean;
  addCoins: (amount: number, reason?: string) => void;
  deductCoins: (amount: number) => boolean;
  setCurrentWager: (amount: number) => void;
  addXp: (amount: number) => void;
  setIsMissionsModalOpen: (open: boolean) => void;
  claimMissionReward: (missionId: string) => void;
  claimDailyStreak: () => void;
  updateMissionProgress: (gameId: GameId, amount?: number) => void;
  invitePlayer: (player: SimulatedPlayer, gameType: 'chess' | 'ludo' | 'dam') => void;
  cancelOutboundInvite: () => void;
  acceptIncomingInvite: () => void;
  declineIncomingInvite: () => void;
  startLiveQueue: (gameType: 'chess' | 'ludo' | 'dam', onFound: (opponent: SimulatedPlayer) => void) => void;
  startSpectating: (match: SimulatedMatch) => void;
  stopSpectating: () => void;
  exitActiveGame: () => void;
  unlockNextWaterSortLevel: (completedLevel: number) => void;
  unlockNextPuzzleLevel: (completedLevel: number) => void;
  submitFeedback: (text: string) => { success: boolean; error?: string };
}

// Requirement 8: For a new player, initial coins MUST be 0!
const DEFAULT_PROFILE: UserProfile = {
  name: 'Gamer_LK',
  avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GamerLK',
  about: 'Strategy Gaming Enthusiast 🎮⚡',
  coins: 0, // Starts at 0
  xp: 0,
  level: 1,
  isVerified: false,
  gamesPlayed: 0,
  gamesWon: 0,
  streakCount: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
  unlockedWaterSortLevel: 1,
  unlockedPuzzleLevel: 1
};

const DEFAULT_SETTINGS: AppSettings = {
  language: 'si',
  theme: 'dark',
  rgbEnabled: true,
  soundEnabled: true,
  hapticsEnabled: true,
  botDifficulty: 'medium',
  boardTheme: 'classic',
  autoQueenChess: true,
  allowSpectators: true,
  notificationFrequency: 'normal'
};

const STREAK_MILESTONES: StreakMilestone[] = [
  { day: 1, rewardCoins: 100, label: { en: 'Day 1 Bonus', si: '1 වන දින තිළිණ' } },
  { day: 3, rewardCoins: 500, label: { en: 'Day 3 Streak', si: '3 වන දින තිළිණ (500)' } },
  { day: 7, rewardCoins: 2500, label: { en: 'Day 7 Champion', si: '7 වන දින දැවැන්ත (2.5k)' } },
  { day: 14, rewardCoins: 10000, label: { en: 'Day 14 Grandmaster', si: '14 වන දින (10k)' } },
  { day: 30, rewardCoins: 50000, label: { en: 'Day 30 Legend', si: '30 වන දින (50k)' } }
];

const INITIAL_MISSIONS: DailyMission[] = [
  {
    id: 'm1',
    title: { en: 'Checkers Challenge', si: 'දාම් ක්‍රීඩා අභියෝගය' },
    description: { en: 'Win 1 Big Dam match', si: 'දාම් තරඟයක් ජයග්‍රහණය කරන්න' },
    target: 1,
    current: 0,
    rewardCoins: 150,
    rewardXp: 100,
    isCompleted: false,
    isClaimed: false,
    gameId: 'dam'
  },
  {
    id: 'm2',
    title: { en: 'Ludo Runner', si: 'ලූඩෝ ධාවකයා' },
    description: { en: 'Advance tokens on the checkered track ⬜', si: 'කොටු පාරේ ඉත්තන් ඉදිරියට ගෙනියන්න' },
    target: 2,
    current: 0,
    rewardCoins: 150,
    rewardXp: 120,
    isCompleted: false,
    isClaimed: false,
    gameId: 'ludo'
  },
  {
    id: 'm3',
    title: { en: 'Picture Puzzle Slicer', si: 'ප්‍රහේලිකා විසඳුම' },
    description: { en: 'Solve 1 slice puzzle level', si: 'ප්‍රහේලිකා ලෙවල් 1ක් විසඳන්න' },
    target: 1,
    current: 0,
    rewardCoins: 150,
    rewardXp: 100,
    isCompleted: false,
    isClaimed: false,
    gameId: 'animal_puzzle'
  }
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('zanta_user_profile_v2');
      if (saved) {
        return JSON.parse(saved);
      }
      // If first time or upgrading from old version, ensure initial coins is 0
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('zanta_app_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>('games');
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [currentWager, setCurrentWager] = useState<number>(0);
  const [dailyMissions, setDailyMissions] = useState<DailyMission[]>(() => {
    try {
      const saved = localStorage.getItem('zanta_daily_missions_v2');
      return saved ? JSON.parse(saved) : INITIAL_MISSIONS;
    } catch {
      return INITIAL_MISSIONS;
    }
  });
  const [isMissionsModalOpen, setIsMissionsModalOpen] = useState(false);
  const [incomingInvite, setIncomingInvite] = useState<MatchInvite | null>(null);
  const [pendingOutboundInvite, setPendingOutboundInvite] = useState<{
    player: SimulatedPlayer;
    totalSeconds: number;
    secondsLeft: number;
    gameType: 'chess' | 'ludo' | 'dam';
  } | null>(null);
  const [activeLiveOpponent, setActiveLiveOpponent] = useState<SimulatedPlayer | null>(null);
  const [spectatingMatch, setSpectatingMatch] = useState<SimulatedMatch | null>(null);
  const [liveMatches, setLiveMatches] = useState<SimulatedMatch[]>(INITIAL_SIMULATED_MATCHES);
  const [onlinePlayers] = useState<SimulatedPlayer[]>(SIMULATED_PLAYERS);

  // Sync settings sound mute state
  useEffect(() => {
    sound.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Sync profile & settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zanta_user_profile_v2', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('zanta_app_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('zanta_daily_missions_v2', JSON.stringify(dailyMissions));
    } catch {}
  }, [dailyMissions]);

  // Handle dark mode class on HTML document
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Periodically trigger incoming invites (simulated realistic online players inviting user)
  useEffect(() => {
    const inviteInterval = setInterval(() => {
      if (selectedGame || incomingInvite || pendingOutboundInvite) return;
      
      const candidatePlayers = SIMULATED_PLAYERS.filter(p => p.status === 'online');
      if (candidatePlayers.length === 0) return;
      const randomPlayer = candidatePlayers[Math.floor(Math.random() * candidatePlayers.length)];
      const randomGame: 'chess' | 'ludo' | 'dam' = ['chess', 'ludo', 'dam'][Math.floor(Math.random() * 3)] as 'chess' | 'ludo' | 'dam';

      setIncomingInvite({
        id: `inv_${Date.now()}`,
        fromPlayer: randomPlayer,
        gameType: randomGame,
        timestamp: Date.now()
      });
      sound.playNotification();

      setTimeout(() => {
        setIncomingInvite(curr => (curr && curr.id.startsWith('inv_') ? null : curr));
      }, 15000);
    }, 45000);

    return () => clearInterval(inviteInterval);
  }, [selectedGame, incomingInvite, pendingOutboundInvite]);

  // Handle outbound invite countdown timer (5, 10, 20, or 30 seconds)
  useEffect(() => {
    if (!pendingOutboundInvite) return;

    if (pendingOutboundInvite.secondsLeft <= 0) {
      const player = pendingOutboundInvite.player;
      const gameType = pendingOutboundInvite.gameType;
      setPendingOutboundInvite(null);
      setActiveLiveOpponent(player);
      setSelectedGame(gameType);
      sound.playVictory();
      return;
    }

    const timer = setInterval(() => {
      setPendingOutboundInvite(prev => {
        if (!prev) return null;
        return {
          ...prev,
          secondsLeft: prev.secondsLeft - 1
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pendingOutboundInvite]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const addCoins = (amount: number) => {
    setProfile(prev => ({ ...prev, coins: prev.coins + amount }));
    sound.playCoin();
  };

  const deductCoins = (amount: number): boolean => {
    if (profile.coins < amount) return false;
    setProfile(prev => ({ ...prev, coins: Math.max(0, prev.coins - amount) }));
    sound.playClick();
    return true;
  };

  const addXp = (amount: number) => {
    setProfile(prev => {
      const newXp = prev.xp + amount;
      const nextLevelThreshold = prev.level * 300;
      if (newXp >= nextLevelThreshold) {
        sound.playVictory();
        return {
          ...prev,
          xp: newXp - nextLevelThreshold,
          level: prev.level + 1,
          coins: prev.coins + 150 // 150 bonus coins on level up
        };
      }
      return { ...prev, xp: newXp };
    });
  };

  const buyVerifiedBadge = (): boolean => {
    const BADGE_COST = 200000;
    if (profile.coins < BADGE_COST) {
      return false;
    }
    setProfile(prev => ({
      ...prev,
      coins: prev.coins - BADGE_COST,
      isVerified: true
    }));
    sound.playVictory();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
    return true;
  };

  const unlockNextWaterSortLevel = (completedLevel: number) => {
    setProfile(prev => ({
      ...prev,
      unlockedWaterSortLevel: Math.max(prev.unlockedWaterSortLevel, completedLevel + 1)
    }));
  };

  const unlockNextPuzzleLevel = (completedLevel: number) => {
    setProfile(prev => ({
      ...prev,
      unlockedPuzzleLevel: Math.max(prev.unlockedPuzzleLevel, completedLevel + 1)
    }));
  };

  const submitFeedback = (text: string): { success: boolean; error?: string } => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return { success: false, error: 'Please enter feedback text.' };
    }
    if (words.length > 350) {
      return { success: false, error: `Word count exceeded! Maximum 350 words allowed (current: ${words.length}).` };
    }
    const FEEDBACK_FEE = 50;
    if (profile.coins < FEEDBACK_FEE) {
      return { success: false, error: `You need at least 50 coins to submit feedback (current balance: ${profile.coins}).` };
    }

    setProfile(prev => ({ ...prev, coins: prev.coins - FEEDBACK_FEE }));
    sound.playCoin();
    return { success: true };
  };

  const claimMissionReward = (missionId: string) => {
    setDailyMissions(prev =>
      prev.map(m => {
        if (m.id === missionId && m.isCompleted && !m.isClaimed) {
          addCoins(m.rewardCoins);
          addXp(m.rewardXp);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
          return { ...m, isClaimed: true };
        }
        return m;
      })
    );
  };

  const updateMissionProgress = (gameId: GameId, amount = 1) => {
    setDailyMissions(prev =>
      prev.map(m => {
        if (m.gameId === gameId && !m.isCompleted) {
          const newCurrent = Math.min(m.target, m.current + amount);
          const isCompleted = newCurrent >= m.target;
          if (isCompleted && !m.isCompleted) {
            sound.playVictory();
          }
          return {
            ...m,
            current: newCurrent,
            isCompleted
          };
        }
        return m;
      })
    );
  };

  const claimDailyStreak = () => {
    const today = new Date().toISOString().split('T')[0];
    const bonus = 100;
    addCoins(bonus);
    setProfile(prev => ({
      ...prev,
      streakCount: prev.streakCount + 1,
      lastLoginDate: today
    }));
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 }
    });
  };

  const invitePlayer = (player: SimulatedPlayer, gameType: 'chess' | 'ludo' | 'dam') => {
    const options = [5, 10, 20, 30];
    const duration = options[Math.floor(Math.random() * options.length)];
    setPendingOutboundInvite({
      player,
      totalSeconds: duration,
      secondsLeft: duration,
      gameType
    });
    sound.playClick();
  };

  const cancelOutboundInvite = () => {
    setPendingOutboundInvite(null);
  };

  const acceptIncomingInvite = () => {
    if (!incomingInvite) return;
    const player = incomingInvite.fromPlayer;
    const gameType = incomingInvite.gameType;
    setIncomingInvite(null);
    setActiveLiveOpponent(player);
    setSelectedGame(gameType);
    sound.playVictory();
  };

  const declineIncomingInvite = () => {
    setIncomingInvite(null);
  };

  const startLiveQueue = (gameType: 'chess' | 'ludo' | 'dam', onFound: (opp: SimulatedPlayer) => void) => {
    sound.playClick();
    setTimeout(() => {
      const candidates = SIMULATED_PLAYERS.filter(p => p.favoriteGame === gameType || p.status === 'online');
      const opp = candidates[Math.floor(Math.random() * candidates.length)] || SIMULATED_PLAYERS[0];
      sound.playVictory();
      onFound(opp);
    }, 3800);
  };

  const startSpectating = (match: SimulatedMatch) => {
    setSpectatingMatch(match);
    sound.playClick();
  };

  const stopSpectating = () => {
    setSpectatingMatch(null);
  };

  const exitActiveGame = () => {
    setSelectedGame(null);
    setActiveLiveOpponent(null);
    setCurrentWager(0);
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        settings,
        activeTab,
        selectedGame,
        dailyMissions,
        streakMilestones: STREAK_MILESTONES,
        isMissionsModalOpen,
        incomingInvite,
        pendingOutboundInvite,
        activeLiveOpponent,
        spectatingMatch,
        liveMatches,
        onlinePlayers,
        currentWager,
        setActiveTab,
        setSelectedGame,
        updateProfile,
        updateSettings,
        buyVerifiedBadge,
        addCoins,
        deductCoins,
        setCurrentWager,
        addXp,
        setIsMissionsModalOpen,
        claimMissionReward,
        claimDailyStreak,
        updateMissionProgress,
        invitePlayer,
        cancelOutboundInvite,
        acceptIncomingInvite,
        declineIncomingInvite,
        startLiveQueue,
        startSpectating,
        stopSpectating,
        exitActiveGame,
        unlockNextWaterSortLevel,
        unlockNextPuzzleLevel,
        submitFeedback
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
