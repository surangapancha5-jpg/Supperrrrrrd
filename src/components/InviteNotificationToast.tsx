import React from 'react';
import { Bell, Check, X, Swords } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const InviteNotificationToast: React.FC = () => {
  const { incomingInvite, acceptIncomingInvite, declineIncomingInvite, settings } = useGame();
  const lang = settings.language;

  if (!incomingInvite) return null;

  const player = incomingInvite.fromPlayer;
  const gameNames = {
    chess: lang === 'si' ? 'චෙස් (Chess)' : 'Chess',
    ludo: lang === 'si' ? 'ලූඩෝ (Ludo)' : 'Ludo',
    dam: lang === 'si' ? 'දාම් (Dam)' : 'Dam'
  };

  return (
    <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 animate-slide-down">
      <div className="bg-slate-900/95 border-2 border-emerald-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={player.avatar}
              alt={player.name}
              className="w-11 h-11 rounded-full border-2 border-emerald-400 bg-slate-800"
            />
            {player.isVerified && (
              <span className="absolute -bottom-1 -right-1 text-blue-400 bg-slate-950 rounded-full px-1 text-[10px] font-bold">
                ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">{player.name}</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                Elo {player.rating}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {lang === 'si'
                ? `${gameNames[incomingInvite.gameType]} තරඟයකට ආරාධනා කළා!`
                : `Invited you to a 1v1 ${gameNames[incomingInvite.gameType]} match!`}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={acceptIncomingInvite}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md transition-transform active:scale-95"
            title="Accept match"
          >
            <Check className="w-4 h-4" />
            <span className="text-xs">{lang === 'si' ? 'පිළිගන්න' : 'Accept'}</span>
          </button>
          <button
            onClick={declineIncomingInvite}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Decline"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
