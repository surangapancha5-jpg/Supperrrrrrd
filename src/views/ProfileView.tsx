import React, { useState } from 'react';
import { User, ShieldCheck, Check, Sparkles, Award, Edit3, Flame, Trophy, Coins, CheckCircle2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatCoins, formatXp } from '../utils/formatters';
import { sound } from '../utils/sound';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=GamerLK',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CyberKing',
  'https://api.dicebear.com/7.x/bottts/svg?seed=DamMaster',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ChessQueen',
  'https://api.dicebear.com/7.x/bottts/svg?seed=LudoChampion',
  'https://api.dicebear.com/7.x/bottts/svg?seed=ZantaVIP'
];

export const ProfileView: React.FC = () => {
  const { profile, settings, updateProfile, buyVerifiedBadge, addCoins } = useGame();
  const lang = settings.language;

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempAbout, setTempAbout] = useState(profile.about);
  const [tempAvatar, setTempAvatar] = useState(profile.avatar);

  const BADGE_COST = 200000;
  const canAffordBadge = profile.coins >= BADGE_COST;
  const badgeProgress = Math.min(100, Math.round((profile.coins / BADGE_COST) * 100));

  const handleSaveProfile = () => {
    updateProfile({
      name: tempName.trim() || 'Player_LK',
      about: tempAbout.trim() || 'Strategy Gaming Champion',
      avatar: tempAvatar
    });
    setIsEditing(false);
    sound.playVictory();
  };

  const handleBuyBadge = () => {
    const success = buyVerifiedBadge();
    if (success) {
      sound.playVictory();
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-2xl mx-auto space-y-4">
      {/* Profile Overview Card */}
      <div className={`p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl ${
        settings.rgbEnabled ? 'rgb-border' : ''
      }`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Avatar with Verified checkmark */}
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-full border-4 border-emerald-500 bg-slate-800 object-cover shadow-lg"
            />
            {profile.isVerified && (
              <span className="absolute -bottom-1 -right-1 text-blue-400 bg-slate-950 rounded-full px-1.5 py-0.5 text-sm font-black border-2 border-blue-500 shadow-md">
                ✓
              </span>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-lg font-bold text-white">{profile.name}</h1>
              {profile.isVerified ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 font-mono">
                  <span>✓</span> VERIFIED VIP
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                  STANDARD
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1 max-w-md">
              {profile.about}
            </p>

            {/* Quick Metrics */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs font-mono">
              <div>
                <span className="text-amber-400 font-bold">🪙 {formatCoins(profile.coins)}</span>
              </div>
              <span className="text-slate-600">·</span>
              <div>
                <span className="text-emerald-400 font-bold">Lvl {profile.level}</span> ({formatXp(profile.xp)})
              </div>
              <span className="text-slate-600">·</span>
              <div>
                <span className="text-orange-400 font-bold">🔥 {profile.streakCount}d Streak</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? (lang === 'si' ? 'වසන්න' : 'Close') : (lang === 'si' ? 'සංස්කරණය' : 'Edit')}</span>
          </button>
        </div>

        {/* Profile Editor Panel */}
        {isEditing && (
          <div className="mt-5 pt-4 border-t border-slate-800 space-y-4 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'si' ? 'ක්‍රීඩක Avatar DP තෝරන්න:' : 'Choose Avatar DP:'}
              </label>
              <div className="flex gap-2.5 overflow-x-auto py-1">
                {AVATAR_OPTIONS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTempAvatar(url)}
                    className={`w-12 h-12 rounded-full border-2 p-0.5 transition-transform shrink-0 ${
                      tempAvatar === url ? 'border-emerald-400 scale-110' : 'border-slate-700 opacity-70'
                    }`}
                  >
                    <img src={url} alt="Option" className="w-full h-full rounded-full" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'si' ? 'ක්‍රීඩක නම (Player Name):' : 'Player Name:'}
              </label>
              <input
                type="text"
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                maxLength={24}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {lang === 'si' ? 'ඔබ ගැන (About Bio):' : 'About Bio:'}
              </label>
              <input
                type="text"
                value={tempAbout}
                onChange={e => setTempAbout(e.target.value)}
                maxLength={80}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
              >
                {lang === 'si' ? 'අවලංගු' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow"
              >
                {lang === 'si' ? 'සුරකින්න (Save)' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verified VIP Badge Store Card (Requirement 12: 200,000 coins / 200k) */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/50 via-slate-900 to-slate-900 border border-blue-500/40 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
              ✓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {lang === 'si' ? 'Official Verified VIP Badge' : 'Official Verified VIP Badge'}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'si'
                  ? 'කොයින් 200,000ක් (200k) දී නිල් සත්‍යාපිත බැජ් එක ස්ථිරවම මිලදී ගන්න.'
                  : 'Unlock the prestigious blue badge across all live matches for 200k coins.'}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-xs font-mono font-bold text-blue-400">
              {formatCoins(BADGE_COST)} 🪙
            </div>
          </div>
        </div>

        {/* Progress towards 200,000 coins */}
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>
              {lang === 'si' ? 'ඔබගේ කාසි ශේෂය:' : 'Your Balance:'} {formatCoins(profile.coins)} / 200k
            </span>
            <span className="text-blue-400 font-bold">{badgeProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${badgeProgress}%` }}
            />
          </div>
        </div>

        {/* Purchase Action Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {profile.isVerified ? (
            <div className="flex items-center gap-2 text-xs text-blue-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>{lang === 'si' ? 'ඔබ සතුව Verified VIP බැජ් එක සක්‍රියයි!' : 'Verified VIP Badge Active!'}</span>
            </div>
          ) : (
            <button
              onClick={handleBuyBadge}
              disabled={!canAffordBadge}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                canAffordBadge
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>✓</span>
              <span>
                {canAffordBadge
                  ? (lang === 'si' ? 'Verified බැජ් එක මිලදී ගන්න (200k)' : 'Buy Verified Badge (200k)')
                  : (lang === 'si' ? 'තව කාසි අවශ්‍යයි (200k)' : 'Need 200k Coins')}
              </span>
            </button>
          )}

          {/* Training helper button to add bonus coins for testing */}
          <button
            onClick={() => addCoins(50000)}
            className="text-[11px] text-amber-400 hover:underline font-medium"
          >
            +50k {lang === 'si' ? 'පුහුණු බෝනස් කාසි ලබාගන්න' : 'Add Test Coins'}
          </button>
        </div>
      </div>

      {/* Career Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">{lang === 'si' ? 'සෙල්ලම් කළ වාර' : 'Games Played'}</div>
          <div className="text-lg font-bold text-white font-mono mt-1">{profile.gamesPlayed}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">{lang === 'si' ? 'ජයග්‍රහණ' : 'Victories'}</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{profile.gamesWon}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">{lang === 'si' ? 'ජයග්‍රාහී ප්‍රතිශතය' : 'Win Rate'}</div>
          <div className="text-lg font-bold text-blue-400 font-mono mt-1">
            {profile.gamesPlayed > 0 ? `${Math.round((profile.gamesWon / profile.gamesPlayed) * 100)}%` : '0%'}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">{lang === 'si' ? 'දෛනික ස්ට්‍රීක්' : 'Daily Streak'}</div>
          <div className="text-lg font-bold text-orange-400 font-mono mt-1">{profile.streakCount} Days</div>
        </div>
      </div>
    </div>
  );
};
