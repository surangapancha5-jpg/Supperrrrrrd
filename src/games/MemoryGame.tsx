import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Trophy, Star, Eye } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface MemoryCard {
  id: number;
  symbol: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOL_POOL = [
  { symbol: '💎', color: '#38bdf8' },
  { symbol: '👑', color: '#f59e0b' },
  { symbol: '🔥', color: '#ef4444' },
  { symbol: '⚡', color: '#eab308' },
  { symbol: '⭐', color: '#facc15' },
  { symbol: '🍀', color: '#10b981' },
  { symbol: '🔮', color: '#a855f7' },
  { symbol: '🪐', color: '#6366f1' },
  { symbol: '🦁', color: '#d97706' },
  { symbol: '🐘', color: '#64748b' },
  { symbol: '🐆', color: '#ea580c' },
  { symbol: '🕊️', color: '#f8fafc' },
  { symbol: '🎯', color: '#dc2626' },
  { symbol: '🚀', color: '#06b6d4' },
  { symbol: '🏆', color: '#eab308' },
  { symbol: '🌟', color: '#f59e0b' }
];

export const MemoryGame: React.FC = () => {
  const { profile, settings, exitActiveGame, addCoins, addXp, updateMissionProgress } = useGame();
  const lang = settings.language;

  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('zanta_memory_level');
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  // Dynamic grid scaling based on level (expanding up to 30 cards!)
  const getGridConfig = (lvl: number) => {
    if (lvl > 750) return { rows: 5, cols: 6, pairs: 15 }; // 30 cards
    if (lvl > 450) return { rows: 4, cols: 5, pairs: 10 }; // 20 cards
    if (lvl > 200) return { rows: 4, cols: 4, pairs: 8 };  // 16 cards
    if (lvl > 80) return { rows: 3, cols: 4, pairs: 6 };   // 12 cards
    if (lvl > 20) return { rows: 2, cols: 3, pairs: 3 };   // 6 cards
    return { rows: 2, cols: 2, pairs: 2 };                  // 4 cards (Beginner)
  };

  const { rows, cols, pairs } = getGridConfig(currentLevel);

  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('zanta_memory_level', currentLevel.toString());
    } catch {}

    // Pick 'pairs' symbols
    const chosenSymbols = SYMBOL_POOL.slice(0, pairs);
    const cardList: MemoryCard[] = [];

    chosenSymbols.forEach((sym, idx) => {
      cardList.push({ id: idx * 2, symbol: sym.symbol, color: sym.color, isFlipped: false, isMatched: false });
      cardList.push({ id: idx * 2 + 1, symbol: sym.symbol, color: sym.color, isFlipped: false, isMatched: false });
    });

    // Deterministic shuffle
    for (let i = cardList.length - 1; i > 0; i--) {
      const seed = (currentLevel * 53 + i * 19) % (i + 1);
      [cardList[i], cardList[seed]] = [cardList[seed], cardList[i]];
    }

    setCards(cardList);
    setFlippedIndices([]);
    setMoves(0);
    setIsLocked(false);
    setIsSolved(false);
  }, [currentLevel, pairs]);

  const handleCardClick = (idx: number) => {
    if (isLocked || isSolved) return;
    const clickedCard = cards[idx];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    sound.playClick();

    // Flip the clicked card
    const newCards = [...cards];
    newCards[idx] = { ...clickedCard, isFlipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsLocked(true);

      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.symbol === secondCard.symbol) {
        // Matched!
        setTimeout(() => {
          sound.playCapture();
          setCards(prev =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);

          // Check if all are matched
          const allMatched = newCards.every((c, i) =>
            i === firstIdx || i === secondIdx ? true : c.isMatched
          );
          if (allMatched) {
            setIsSolved(true);
            sound.playVictory();
            addCoins(3500 + currentLevel * 10);
            addXp(180 + currentLevel * 3);
            updateMissionProgress('memory', 1);
            confetti({ particleCount: 100, spread: 70 });
          }
        }, 350);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          setCards(prev =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 1000) {
      setCurrentLevel(prev => prev + 1);
      sound.playClick();
    }
  };

  const handlePrevLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(prev => prev - 1);
      sound.playClick();
    }
  };

  const handleReset = () => {
    setCurrentLevel(curr => curr);
    sound.playClick();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={exitActiveGame}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-base flex items-center gap-2 text-white">
              {lang === 'si' ? 'මතක ක්‍රීඩාව (Memory Match)' : 'Memory Matrix'}
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono">
                {lang === 'si' ? `ලෙවල් ${currentLevel}/1000` : `Level ${currentLevel}/1000`}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {cols * rows} {lang === 'si' ? 'කාඩ්පත්' : 'Cards'} ({cols}x{rows} {lang === 'si' ? 'කොටස්' : 'Grid'})
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          title="Reset Level"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Level Navigator & Score */}
      <div className="max-w-xl mx-auto w-full px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevLevel}
            disabled={currentLevel <= 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-30 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white px-2 py-1 rounded bg-slate-900 border border-slate-800">
            {currentLevel} / 1000
          </span>
          <button
            onClick={handleNextLevel}
            disabled={currentLevel >= 1000}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-30 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>{lang === 'si' ? 'පෙරළීම්:' : 'Flips:'} <strong className="text-white">{moves}</strong></span>
          <span>·</span>
          <span className="text-purple-400 font-medium">
            {cards.filter(c => c.isMatched).length / 2}/{pairs} {lang === 'si' ? 'යුගල' : 'Pairs'}
          </span>
        </div>
      </div>

      {/* Cards Grid Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-5">
        <div className={`w-full max-w-[480px] rounded-2xl p-3 sm:p-4 shadow-2xl transition-all ${
          settings.rgbEnabled ? 'rgb-border bg-slate-900/90' : 'bg-slate-900 border-2 border-slate-800'
        }`}>
          <div
            className="w-full gap-2 sm:gap-2.5"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
            }}
          >
            {cards.map((card, idx) => {
              const isVisible = card.isFlipped || card.isMatched;

              return (
                <button
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  disabled={isVisible}
                  className={`aspect-square rounded-xl border flex items-center justify-center transition-all duration-300 active:scale-95 shadow-md ${
                    card.isMatched
                      ? 'bg-purple-950/60 border-purple-500/40 text-purple-200 opacity-80'
                      : card.isFlipped
                      ? 'bg-slate-800 border-purple-400 scale-102 ring-2 ring-purple-400/50'
                      : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-slate-500 hover:scale-101'
                  }`}
                >
                  {isVisible ? (
                    <span className="text-3xl sm:text-4xl drop-shadow animate-scale-in">
                      {card.symbol}
                    </span>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center opacity-40">
                      <Star className="w-2.5 h-2.5 text-purple-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-xl mx-auto w-full px-4 pb-4 text-center text-xs text-slate-400">
        💡 {lang === 'si' ? 'එක සමාන කාඩ්පත් 2ක් පෙරළා ගළපන්න. ලෙවල් වැඩිවන විට කොටස් වැඩිවේ!' : 'Flip 2 matching cards to clear the grid. Cards increase as levels advance!'}
      </div>

      {/* Level Solved Celebration Modal */}
      {isSolved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === 'si' ? '🎉 මතකය අතිවිශිෂ්ටයි!' : '🎉 Memory Master Victory!'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              {lang === 'si'
                ? `ලෙවල් ${currentLevel} සාර්ථකව අවසන්! +${3500 + currentLevel * 10} කාසි හා +${180 + currentLevel * 3} XP හිමිවිය.`
                : `Level ${currentLevel} conquered in ${moves} flips! Earned +${3500 + currentLevel * 10} Coins.`}
            </p>
            <div className="flex gap-3">
              {currentLevel < 1000 ? (
                <button
                  onClick={handleNextLevel}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors shadow-lg"
                >
                  {lang === 'si' ? 'ඊළඟ ලෙවල් එක' : 'Next Level'}
                </button>
              ) : (
                <button
                  onClick={exitActiveGame}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors shadow-lg"
                >
                  {lang === 'si' ? 'සියලු ලෙවල් 1000 අවසන්!' : 'All 1000 Levels Complete!'}
                </button>
              )}
              <button
                onClick={handleReset}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
              >
                {lang === 'si' ? 'නැවත' : 'Replay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
