import React from 'react';
import { X, Trophy, CheckCircle, Gift, Sparkles, Target } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatCoins, formatXp } from '../utils/formatters';

export const DailyMissionsModal: React.FC = () => {
  const { isMissionsModalOpen, setIsMissionsModalOpen, dailyMissions, claimMissionReward, settings } = useGame();
  const lang = settings.language;

  if (!isMissionsModalOpen) return null;

  const completedCount = dailyMissions.filter(m => m.isCompleted).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {lang === 'si' ? 'දෛනික අභියෝග (Daily Missions)' : 'Daily Challenges'}
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  {completedCount}/3
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'si' ? 'සම්පූර්ණ කර කාසි හා XP දිනාගන්න' : 'Complete to earn bonus coins & XP'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMissionsModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Missions List */}
        <div className="space-y-3.5 my-4">
          {dailyMissions.map(mission => {
            const progressPercent = Math.min(100, Math.round((mission.current / mission.target) * 100));

            return (
              <div
                key={mission.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  mission.isClaimed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : mission.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-800/40 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {mission.title[lang]}
                      {mission.isCompleted && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {mission.description[lang]}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      +{formatCoins(mission.rewardCoins)}
                    </span>
                    <div className="text-[10px] text-slate-400">
                      +{formatXp(mission.rewardXp)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>{lang === 'si' ? 'ප්‍රගතිය' : 'Progress'}</span>
                    <span>
                      {mission.current} / {mission.target}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Claim Button */}
                <div className="mt-3 flex justify-end">
                  {mission.isClaimed ? (
                    <span className="text-xs text-slate-500 font-medium">
                      {lang === 'si' ? 'ත්‍යාගය ලබාගන්නා ලදී ✓' : 'Reward Claimed ✓'}
                    </span>
                  ) : mission.isCompleted ? (
                    <button
                      onClick={() => claimMissionReward(mission.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md animate-bounce"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{lang === 'si' ? 'ත්‍යාගය ලබාගන්න (Claim)' : 'Claim +Bonus XP'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {lang === 'si' ? 'ක්‍රීඩා කර සම්පූර්ණ කරන්න' : 'In Progress'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Close */}
        <button
          onClick={() => setIsMissionsModalOpen(false)}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
        >
          {lang === 'si' ? 'වසන්න (Done)' : 'Close'}
        </button>
      </div>
    </div>
  );
};
