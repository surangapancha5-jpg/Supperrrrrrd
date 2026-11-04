import React, { useState } from 'react';
import { Coins, Swords, Check, AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatCoins } from '../utils/formatters';
import { sound } from '../utils/sound';

interface WagerModalProps {
  isOpen: boolean;
  gameTitle: string;
  onConfirm: (wager: number) => void;
  onCancel: () => void;
}

export const WagerModal: React.FC<WagerModalProps> = ({
  isOpen,
  gameTitle,
  onConfirm,
  onCancel
}) => {
  const { profile, settings } = useGame();
  const lang = settings.language;

  const [selectedBet, setSelectedBet] = useState<number>(0);

  if (!isOpen) return null;

  const BET_OPTIONS = [0, 20, 50, 100, 200];

  const handleStart = () => {
    sound.playClick();
    onConfirm(selectedBet);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl shadow-lg">
          🪙
        </div>

        <h3 className="text-base font-bold text-white mb-1">
          {lang === 'si' ? 'තරඟ ඔට්ටුව තෝරන්න (Place Wager)' : 'Place Match Wager'}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          {gameTitle} · {lang === 'si' ? 'ඔබගේ ශේෂය:' : 'Your Balance:'}{' '}
          <strong className="text-amber-400 font-mono">{formatCoins(profile.coins)}</strong>
        </p>

        {/* Bet Selection Options */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {BET_OPTIONS.map(amount => {
            const isAffordable = profile.coins >= amount;
            const isSelected = selectedBet === amount;

            return (
              <button
                key={amount}
                type="button"
                disabled={!isAffordable}
                onClick={() => setSelectedBet(amount)}
                className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : isAffordable
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                    : 'bg-slate-950/60 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
                }`}
              >
                {amount === 0 ? (lang === 'si' ? 'නොමිලේ (0)' : 'Free (0)') : `${amount} 🪙`}
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 bg-slate-950/80 rounded-xl p-3 mb-5 border border-slate-800/80">
          {selectedBet === 0 ? (
            <span>
              {lang === 'si'
                ? 'නොමිලේ පුහුණු තරඟයකි. ජයග්‍රහණය කළහොත් +150 කාසි ලැබේ.'
                : 'Free training match. Win to earn +150 coins.'}
            </span>
          ) : (
            <span>
              {lang === 'si'
                ? `ජයග්‍රහණය කළහොත් +${selectedBet * 2 + 150} කාසි ලැබේ. පැරදුනහොත් ${selectedBet} කාසි කැපේ.`
                : `Win to earn +${selectedBet * 2 + 150} coins. If you lose, ${selectedBet} coins will be deducted.`}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
          >
            {lang === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
          </button>
          <button
            onClick={handleStart}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-bold text-xs transition-all shadow-lg active:scale-95"
          >
            {lang === 'si' ? 'තරඟය අරඹන්න' : 'Start Match'}
          </button>
        </div>
      </div>
    </div>
  );
};
