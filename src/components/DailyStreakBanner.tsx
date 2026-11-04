import React from 'react';
import { Flame, Gift, Check, Sparkles, ChevronRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatCoins } from '../utils/formatters';
import { sound } from '../utils/sound';

export const DailyStreakBanner: React.FC = () => {
  const { profile, settings, streakMilestones, claimDailyStreak } = useGame();
  const lang = settings.language;

  // Find current and next milestone
  const streakCount = profile.streakCount;
  const nextMilestone = streakMilestones.find(m => m.day > streakCount) || streakMilestones[streakMilestones.length - 1];
  const previousDay = streakMilestones.filter(m => m.day <= streakCount).pop()?.day || 0;

  const totalBetween = nextMilestone.day - previousDay;
  const progressInStage = streakCount - previousDay;
  const progressPercent = Math.min(100, Math.max(10, Math.round((progressInStage / totalBetween) * 100)));

  const today = new Date().toISOString().split('T')[0];
  const isClaimedToday = profile.lastLoginDate === today;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-500/30 p-3.5 sm:p-4 shadow-lg">
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3">
        {/* Streak Flame Counter */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Flame className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {streakCount} {lang === 'si' ? 'දිනක ස්ට්‍රීක් (Streak)' : 'Day Streak!'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'si' ? 'ඊළඟ ත්‍යාගය:' : 'Next milestone:'}{' '}
              <strong className="text-amber-300">
                {nextMilestone.day} {lang === 'si' ? 'වන දින' : 'Days'} (+{formatCoins(nextMilestone.rewardCoins)})
              </strong>
            </p>
          </div>
        </div>

        {/* Claim / Status Action */}
        <button
          onClick={claimDailyStreak}
          disabled={isClaimedToday}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-md ${
            isClaimedToday
              ? 'bg-slate-800 text-slate-400 cursor-default'
              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 active:scale-95 shadow-amber-500/30'
          }`}
        >
          {isClaimedToday ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'si' ? 'අද ගත්තා' : 'Claimed'}</span>
            </>
          ) : (
            <>
              <Gift className="w-3.5 h-3.5" />
              <span>{lang === 'si' ? 'අද දින ත්‍යාගය ගන්න' : 'Claim Daily'}</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Track to Next Milestone */}
      <div className="mt-3">
        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
          <span>{lang === 'si' ? `${streakCount} වන දිනය` : `Day ${streakCount}`}</span>
          <span className="text-amber-400 font-semibold">{nextMilestone.label[lang]}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
