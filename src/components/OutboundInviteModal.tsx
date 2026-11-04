import React from 'react';
import { Loader2, X, Swords, UserCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const OutboundInviteModal: React.FC = () => {
  const { pendingOutboundInvite, cancelOutboundInvite, settings } = useGame();
  const lang = settings.language;

  if (!pendingOutboundInvite) return null;

  const { player, totalSeconds, secondsLeft, gameType } = pendingOutboundInvite;
  const progressPercent = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);

  const gameNames = {
    chess: lang === 'si' ? 'චෙස් (Chess)' : 'Chess',
    ludo: lang === 'si' ? 'ලූඩෝ (Ludo)' : 'Ludo',
    dam: lang === 'si' ? 'දාම් (Dam)' : 'Dam'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

        <div className="relative mx-auto mb-4 w-16 h-16">
          <img
            src={player.avatar}
            alt={player.name}
            className="w-16 h-16 rounded-full border-2 border-blue-400 bg-slate-800 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
            <Swords className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-base font-bold text-white mb-1">
          {player.name}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {lang === 'si'
            ? `${gameNames[gameType]} තරඟයට ආරාධනය යවන ලදී...`
            : `Challenge sent for a 1v1 ${gameNames[gameType]} match...`}
        </p>

        {/* Live Countdown Progress */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 mb-5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              {lang === 'si' ? 'ප්‍රතිචාරය බලාපොරොත්තුවෙන්...' : 'Waiting for player response...'}
            </span>
            <span className="font-bold text-white">{secondsLeft}s</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={cancelOutboundInvite}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
        >
          {lang === 'si' ? 'ආරාධනය අවලංගු කරන්න' : 'Cancel Invite'}
        </button>
      </div>
    </div>
  );
};
