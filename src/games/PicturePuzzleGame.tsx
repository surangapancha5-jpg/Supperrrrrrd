import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, RotateCcw, Eye, EyeOff, Sparkles, ChevronLeft, ChevronRight, Trophy, CheckCircle2, Lock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getPuzzleForLevel, PuzzleItem } from '../data/puzzleData';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

interface TilePiece {
  originalIndex: number;
  currentIndex: number;
}

export const PicturePuzzleGame: React.FC = () => {
  const { profile, settings, exitActiveGame, addCoins, addXp, updateMissionProgress, unlockNextPuzzleLevel, currentWager } = useGame();
  const lang = settings.language;

  const maxUnlockedLevel = profile.unlockedPuzzleLevel || 1;
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('zanta_puzzle_level_v2');
      const lvl = saved ? parseInt(saved, 10) : 1;
      return Math.min(lvl, maxUnlockedLevel);
    } catch {
      return 1;
    }
  });

  const puzzle: PuzzleItem = useMemo(() => getPuzzleForLevel(currentLevel), [currentLevel]);
  const gridSize = puzzle.gridSize; // 2, 3, or 4
  const totalTiles = gridSize * gridSize;

  const [tiles, setTiles] = useState<TilePiece[]>([]);
  const [selectedTileIdx, setSelectedTileIdx] = useState<number | null>(null);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('zanta_puzzle_level_v2', currentLevel.toString());
    } catch {}

    const pieces: TilePiece[] = Array.from({ length: totalTiles }).map((_, idx) => ({
      originalIndex: idx,
      currentIndex: idx
    }));

    // Deterministic shuffle
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const seed = (currentLevel * 37 + i * 13) % (i + 1);
      [shuffled[i], shuffled[seed]] = [shuffled[seed], shuffled[i]];
    }

    if (shuffled.every((p, idx) => p.originalIndex === idx)) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }

    setTiles(shuffled);
    setSelectedTileIdx(null);
    setMovesCount(0);
    setIsSolved(false);
    setShowPreview(false);
  }, [currentLevel, totalTiles]);

  const handleTileClick = (clickedIdx: number) => {
    if (isSolved) return;

    if (selectedTileIdx === null) {
      setSelectedTileIdx(clickedIdx);
      sound.playClick();
    } else {
      if (selectedTileIdx === clickedIdx) {
        setSelectedTileIdx(null);
        return;
      }

      // Swap pieces
      const newTiles = [...tiles];
      const temp = newTiles[selectedTileIdx];
      newTiles[selectedTileIdx] = newTiles[clickedIdx];
      newTiles[clickedIdx] = temp;

      setTiles(newTiles);
      setSelectedTileIdx(null);
      setMovesCount(prev => prev + 1);
      sound.playPieceMove();

      // Check solved
      const solved = newTiles.every((piece, idx) => piece.originalIndex === idx);
      if (solved) {
        setIsSolved(true);
        sound.playVictory();
        const earnedCoins = currentWager > 0 ? currentWager * 2 + 150 : 150;
        addCoins(earnedCoins);
        addXp(120);
        updateMissionProgress('animal_puzzle', 1);
        unlockNextPuzzleLevel(currentLevel);
        confetti({ particleCount: 90, spread: 70 });
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 500 && currentLevel < maxUnlockedLevel + 1) {
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

  const resetCurrentLevel = () => {
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
              {lang === 'si' ? 'ප්‍රහේලිකාව' : 'Picture Puzzle'}
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                {lang === 'si' ? `ලෙවල් ${currentLevel}/500` : `Level ${currentLevel}/500`}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {puzzle.title[lang]} · {gridSize}x{gridSize} ({totalTiles} {lang === 'si' ? 'කැබලි' : 'Slices'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${
              showPreview ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
            title="Preview finished portrait"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{lang === 'si' ? 'පෙරදසුන' : 'Preview'}</span>
          </button>

          <button
            onClick={resetCurrentLevel}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Shuffle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level Navigator - Restricted to unlocked levels */}
      <div className="max-w-xl mx-auto w-full px-4 pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevLevel}
            disabled={currentLevel <= 1}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-30 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white px-2 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-1 font-mono">
            {currentLevel} / 500
            {currentLevel >= maxUnlockedLevel && <Lock className="w-3 h-3 text-amber-400 ml-1" />}
          </span>
          <button
            onClick={handleNextLevel}
            disabled={currentLevel >= maxUnlockedLevel || currentLevel >= 500}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 disabled:opacity-30 hover:bg-slate-800"
            title={currentLevel >= maxUnlockedLevel ? 'Complete this level to unlock next' : 'Next level'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>{lang === 'si' ? 'මාරු කළ වාර:' : 'Moves:'} <strong className="text-white">{movesCount}</strong></span>
          <span>·</span>
          <span className="text-emerald-400 font-medium">
            {tiles.filter((p, i) => p.originalIndex === i).length}/{totalTiles}
          </span>
        </div>
      </div>

      {/* Main Puzzle Canvas with Real Photo Slices */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-5">
        <div className={`relative w-full max-w-[440px] aspect-square rounded-2xl p-2 sm:p-3 shadow-2xl transition-all ${
          settings.rgbEnabled ? 'rgb-border bg-slate-900/90' : 'bg-slate-900 border-2 border-slate-800'
        }`}>
          {showPreview ? (
            /* Full Photo Preview */
            <div className="w-full h-full rounded-xl overflow-hidden border border-amber-500/50 shadow-2xl relative select-none">
              <img
                src={puzzle.imageUrl}
                alt={puzzle.title.en}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="text-sm font-bold text-white">{puzzle.title[lang]}</div>
                <div className="text-xs text-amber-400 font-mono">{puzzle.location[lang]}</div>
              </div>
            </div>
          ) : (
            /* Real Sliced Image Grid */
            <div
              className="w-full h-full rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-950 gap-1.5 p-1.5 shadow-inner"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`
              }}
            >
              {tiles.map((piece, currentIdx) => {
                const origRow = Math.floor(piece.originalIndex / gridSize);
                const origCol = piece.originalIndex % gridSize;
                const isSelected = selectedTileIdx === currentIdx;
                const isCorrect = piece.originalIndex === currentIdx;

                return (
                  <button
                    key={currentIdx}
                    onClick={() => handleTileClick(currentIdx)}
                    className={`relative w-full h-full rounded-lg overflow-hidden border transition-all active:scale-95 select-none ${
                      isSelected
                        ? 'ring-4 ring-emerald-400 border-white z-20 scale-102 shadow-2xl'
                        : isCorrect
                        ? 'border-emerald-500/50 hover:border-emerald-400'
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {/* Viewport for photo slice */}
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        width: `${gridSize * 100}%`,
                        height: `${gridSize * 100}%`,
                        top: `-${origRow * 100}%`,
                        left: `-${origCol * 100}%`
                      }}
                    >
                      <img
                        src={puzzle.imageUrl}
                        alt="Slice"
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>

                    {isCorrect && (
                      <div className="absolute top-1 left-1 bg-emerald-500/80 text-white rounded-full p-0.5 shadow">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}

                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-[9px] font-mono font-bold text-white">
                      #{piece.originalIndex + 1}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Level Solved Celebration Modal */}
      {isSolved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === 'si' ? '🎉 ප්‍රහේලිකාව විසඳුවා!' : '🎉 Picture Reconstructed!'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {lang === 'si'
                ? `${puzzle.title.si} සාර්ථකව ගලපන ලදී! +${currentWager > 0 ? currentWager * 2 + 150 : 150} කාසි හිමිවිය.`
                : `Completed ${puzzle.title.en}! Earned +${currentWager > 0 ? currentWager * 2 + 150 : 150} Coins.`}
            </p>

            <div className="w-36 h-36 mx-auto mb-5 rounded-2xl overflow-hidden border border-slate-700 shadow-lg">
              <img src={puzzle.imageUrl} alt="Completed" className="w-full h-full object-cover" />
            </div>

            <div className="flex gap-2">
              {currentLevel < 500 ? (
                <button
                  onClick={handleNextLevel}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg"
                >
                  {lang === 'si' ? 'ඊළඟ රූපය (Next Level)' : 'Next Picture (Next)'}
                </button>
              ) : (
                <button
                  onClick={exitActiveGame}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors shadow-lg"
                >
                  {lang === 'si' ? 'සියලු ලෙවල් අවසන්!' : 'All 500 Levels Done!'}
                </button>
              )}
              <button
                onClick={resetCurrentLevel}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm"
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
