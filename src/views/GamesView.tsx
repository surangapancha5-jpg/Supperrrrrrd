import React, { useState } from 'react';
import { Sparkles, Trophy, Target, Play } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameId } from '../types';
import { formatCoins, formatXp } from '../utils/formatters';
import { DailyStreakBanner } from '../components/DailyStreakBanner';
import { WagerModal } from '../components/WagerModal';
import { sound } from '../utils/sound';

export const GamesView: React.FC = () => {
  const { profile, settings, setSelectedGame, setCurrentWager, setIsMissionsModalOpen, dailyMissions } = useGame();
  const lang = settings.language;

  const [pendingGameId, setPendingGameId] = useState<GameId | null>(null);

  const completedMissions = dailyMissions.filter(m => m.isCompleted).length;

  // Requirement: Remove the descriptive tagline texts under the titles!
  const gamesList: Array<{
    id: GameId;
    title: { en: string; si: string };
    badge: string;
    players: string;
    icon: string;
    bgGradient: string;
    borderColor: string;
  }> = [
    {
      id: 'dam',
      title: { en: 'Big Dam (Checkers)', si: 'විශාල දාම් ක්‍රීඩාව' },
      badge: '8x8 Arena',
      players: '1v1 / Live',
      icon: '👑',
      bgGradient: 'from-amber-950/40 to-slate-900',
      borderColor: 'border-amber-500/30'
    },
    {
      id: 'chess',
      title: { en: 'Big Chess Arena', si: 'විශාල චෙස් පිටිය' },
      badge: 'Grandmaster',
      players: '1v1 / Live',
      icon: '♟️',
      bgGradient: 'from-blue-950/40 to-slate-900',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'ludo',
      title: { en: 'Ludo Classic', si: 'ලූඩෝ සම්ප්‍රදායික පිටිය' },
      badge: '⬜⬜ Track',
      players: '4-Player',
      icon: '🎲',
      bgGradient: 'from-rose-950/40 to-slate-900',
      borderColor: 'border-rose-500/30'
    },
    {
      id: 'animal_puzzle',
      title: { en: 'Picture Puzzle', si: 'ප්‍රහේලිකාව' },
      badge: '500 Levels',
      players: 'Brain Teaser',
      icon: '🖼️',
      bgGradient: 'from-emerald-950/40 to-slate-900',
      borderColor: 'border-emerald-500/30'
    },
    {
      id: 'water_sort',
      title: { en: 'Water Sort Tubes', si: 'පාට කුප්පි' },
      badge: '500 Levels',
      players: 'Logic Puzzle',
      icon: '🧪',
      bgGradient: 'from-cyan-950/40 to-slate-900',
      borderColor: 'border-cyan-500/30'
    },
    {
      id: 'memory',
      title: { en: 'Memory Matrix', si: 'මතක ක්‍රීඩාව' },
      badge: '1000 Levels',
      players: 'Cognitive',
      icon: '💎',
      bgGradient: 'from-purple-950/40 to-slate-900',
      borderColor: 'border-purple-500/30'
    }
  ];

  const handleSelectGame = (id: GameId) => {
    sound.playClick();
    setPendingGameId(id);
  };

  const handleConfirmWager = (wagerAmount: number) => {
    setCurrentWager(wagerAmount);
    if (pendingGameId) {
      setSelectedGame(pendingGameId);
    }
    setPendingGameId(null);
  };

  const selectedGameInfo = gamesList.find(g => g.id === pendingGameId);

  return (
    <div className="pb-24 pt-3 px-4 max-w-2xl mx-auto space-y-4">
      {/* Top Header Card with Profile & Coins formatted */}
      <div className={`p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl ${
        settings.rgbEnabled ? 'rgb-border' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-slate-800 object-cover"
              />
              {profile.isVerified && (
                <span className="absolute -bottom-1 -right-1 text-blue-400 bg-slate-950 rounded-full px-1 text-[11px] font-bold ring-1 ring-blue-500/50">
                  ✓
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">{profile.name}</span>
                {profile.isVerified && (
                  <span className="text-xs text-blue-400 font-semibold px-1.5 py-0.2 rounded bg-blue-500/10">
                    VIP
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                {profile.about}
              </p>
            </div>
          </div>

          {/* Formatted Currency Display */}
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-amber-400 font-bold text-base sm:text-lg">
              <span>🪙</span>
              <span className="tracking-tight">{formatCoins(profile.coins)}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Lvl {profile.level} · {formatXp(profile.xp)}
            </div>
          </div>
        </div>

        {/* Daily Missions Trigger Pill Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={() => {
              setIsMissionsModalOpen(true);
              sound.playClick();
            }}
            className="flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors group"
          >
            <Target className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">
              {lang === 'si' ? 'දෛනික අභියෝග (Daily Missions)' : 'Daily Challenges'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
              {completedMissions}/3
            </span>
          </button>

          <button
            onClick={() => {
              setIsMissionsModalOpen(true);
              sound.playClick();
            }}
            className="text-xs text-emerald-400 font-medium hover:underline"
          >
            {lang === 'si' ? 'විවෘත කරන්න' : 'View'}
          </button>
        </div>
      </div>

      {/* Daily Streak Visual Component */}
      <DailyStreakBanner />

      {/* Game Selection Grid Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          {lang === 'si' ? 'ක්‍රීඩා මාලාව (Games Arena)' : 'Featured Games'}
        </h2>
        <span className="text-xs text-slate-500 font-mono">6 Games Available</span>
      </div>

      {/* 6 Game Cards (Taglines removed as requested!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {gamesList.map(game => (
          <div
            key={game.id}
            onClick={() => handleSelectGame(game.id)}
            className={`p-4 rounded-2xl bg-gradient-to-br ${game.bgGradient} border ${game.borderColor} hover:border-slate-500 transition-all cursor-pointer group shadow-lg flex flex-col justify-between active:scale-98`}
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl p-2 rounded-xl bg-slate-900/80 border border-slate-800 shadow">
                  {game.icon}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-300 border border-slate-800 font-mono">
                  {game.badge}
                </span>
              </div>

              {/* Clean title without long descriptive subtext! */}
              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                {game.title[lang]}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {game.players}
              </span>

              <button className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow">
                <Play className="w-3 h-3 fill-current" />
                <span>{lang === 'si' ? 'සෙල්ලම් කරන්න' : 'Play'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pre-Game Wager Modal */}
      <WagerModal
        isOpen={Boolean(pendingGameId)}
        gameTitle={selectedGameInfo ? selectedGameInfo.title[lang] : ''}
        onConfirm={handleConfirmWager}
        onCancel={() => setPendingGameId(null)}
      />
    </div>
  );
};
