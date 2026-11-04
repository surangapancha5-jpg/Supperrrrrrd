import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Undo2, PlusCircle, ChevronLeft, ChevronRight, Trophy, Sparkles, Lock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';

const TUBE_CAPACITY = 4;

const PALETTE: Record<string, { bg: string; border: string; name: string }> = {
  red: { bg: '#ef4444', border: '#b91c1c', name: 'Red' },
  emerald: { bg: '#10b981', border: '#047857', name: 'Emerald' },
  blue: { bg: '#3b82f6', border: '#1d4ed8', name: 'Blue' },
  gold: { bg: '#f59e0b', border: '#b45309', name: 'Gold' },
  purple: { bg: '#8b5cf6', border: '#6d28d9', name: 'Purple' },
  cyan: { bg: '#06b6d4', border: '#0e7490', name: 'Cyan' },
  orange: { bg: '#f97316', border: '#c2410c', name: 'Orange' },
  magenta: { bg: '#d946ef', border: '#a21caf', name: 'Magenta' },
  lime: { bg: '#84cc16', border: '#4d7c0f', name: 'Lime' },
  rose: { bg: '#f43f5e', border: '#be123c', name: 'Rose' }
};

const ALL_COLOR_KEYS = Object.keys(PALETTE);

export const WaterSortGame: React.FC = () => {
  const { profile, settings, exitActiveGame, addCoins, addXp, updateMissionProgress, unlockNextWaterSortLevel, currentWager } = useGame();
  const lang = settings.language;

  const maxUnlockedLevel = profile.unlockedWaterSortLevel || 1;
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('zanta_water_level_v2');
      const lvl = saved ? parseInt(saved, 10) : 1;
      return Math.min(lvl, maxUnlockedLevel);
    } catch {
      return 1;
    }
  });

  const getLevelConfig = (lvl: number) => {
    let colorCount = 2;
    let emptyTubes = 2;

    if (lvl > 250) {
      colorCount = 8;
    } else if (lvl > 120) {
      colorCount = 6;
    } else if (lvl > 50) {
      colorCount = 5;
    } else if (lvl > 10) {
      colorCount = 3;
    }

    const totalTubes = colorCount + emptyTubes;
    return { colorCount, emptyTubes, totalTubes };
  };

  const [tubes, setTubes] = useState<string[][]>([]);
  const [selectedTubeIdx, setSelectedTubeIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<string[][][]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [extraTubeAdded, setExtraTubeAdded] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('zanta_water_level_v2', currentLevel.toString());
    } catch {}

    const { colorCount, emptyTubes } = getLevelConfig(currentLevel);
    const activeColors = ALL_COLOR_KEYS.slice(0, colorCount);

    const pool: string[] = [];
    activeColors.forEach(color => {
      for (let i = 0; i < TUBE_CAPACITY; i++) pool.push(color);
    });

    for (let i = pool.length - 1; i > 0; i--) {
      const seed = (currentLevel * 41 + i * 17) % (i + 1);
      [pool[i], pool[seed]] = [pool[seed], pool[i]];
    }

    const initialTubes: string[][] = [];
    for (let i = 0; i < colorCount; i++) {
      initialTubes.push(pool.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY));
    }
    for (let i = 0; i < emptyTubes; i++) {
      initialTubes.push([]);
    }

    setTubes(initialTubes);
    setSelectedTubeIdx(null);
    setHistory([]);
    setIsSolved(false);
    setExtraTubeAdded(false);
  }, [currentLevel]);

  const checkVictory = (currentTubes: string[][]): boolean => {
    return currentTubes.every(tube => {
      if (tube.length === 0) return true;
      if (tube.length !== TUBE_CAPACITY) return false;
      return tube.every(c => c === tube[0]);
    });
  };

  const handleTubeClick = (clickedIdx: number) => {
    if (isSolved) return;

    if (selectedTubeIdx === null) {
      if (tubes[clickedIdx].length > 0) {
        setSelectedTubeIdx(clickedIdx);
        sound.playClick();
      }
    } else {
      if (selectedTubeIdx === clickedIdx) {
        setSelectedTubeIdx(null);
        return;
      }

      const source = [...tubes[selectedTubeIdx]];
      const target = [...tubes[clickedIdx]];

      if (source.length === 0) {
        setSelectedTubeIdx(null);
        return;
      }

      const topColor = source[source.length - 1];
      const targetTop = target[target.length - 1];
      const canPour = target.length < TUBE_CAPACITY && (target.length === 0 || targetTop === topColor);

      if (canPour) {
        setHistory(prev => [...prev, tubes.map(t => [...t])]);

        while (
          source.length > 0 &&
          source[source.length - 1] === topColor &&
          target.length < TUBE_CAPACITY
        ) {
          target.push(source.pop()!);
        }

        sound.playPour();

        const newTubes = tubes.map((t, idx) => {
          if (idx === selectedTubeIdx) return source;
          if (idx === clickedIdx) return target;
          return t;
        });

        setTubes(newTubes);
        setSelectedTubeIdx(null);
        updateMissionProgress('water_sort', 1);

        if (checkVictory(newTubes)) {
          setIsSolved(true);
          sound.playVictory();
          const earned = currentWager > 0 ? currentWager * 2 + 150 : 150;
          addCoins(earned);
          addXp(120);
          unlockNextWaterSortLevel(currentLevel);
          confetti({ particleCount: 110, spread: 80 });
        }
      } else {
        if (tubes[clickedIdx].length > 0) {
          setSelectedTubeIdx(clickedIdx);
          sound.playClick();
        } else {
          setSelectedTubeIdx(null);
        }
      }
    }
  };

  const handleUndo = () => {
    if (history.length === 0 || isSolved) return;
    const previous = history[history.length - 1];
    setTubes(previous);
    setHistory(prev => prev.slice(0, prev.length - 1));
    setSelectedTubeIdx(null);
    sound.playClick();
  };

  const handleAddExtraTube = () => {
    if (extraTubeAdded || isSolved) return;
    setTubes(prev => [...prev, []]);
    setExtraTubeAdded(true);
    sound.playVictory();
  };

  // Locked level check: cannot jump beyond unlocked level!
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
              {lang === 'si' ? 'පාට කුප්පි (Water Sort)' : 'Water Sort Tubes'}
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
                {lang === 'si' ? `ලෙවල් ${currentLevel}/500` : `Level ${currentLevel}/500`}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              {tubes.length} {lang === 'si' ? 'කුප්පි' : 'Tubes'} · {lang === 'si' ? 'අගුළු හැරිය මට්ටම:' : 'Max Unlocked:'} Lvl {maxUnlockedLevel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Level Navigator - STRICTLY LOCKED beyond completed level */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-3 flex items-center justify-between">
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
            title={currentLevel >= maxUnlockedLevel ? 'Finish this level to unlock next level' : 'Next level'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {!extraTubeAdded && (
          <button
            onClick={handleAddExtraTube}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-medium transition-colors border border-emerald-500/30"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{lang === 'si' ? '+ හිස් කුප්පියක්' : '+ Add Tube'}</span>
          </button>
        )}
      </div>

      {/* Tubes Arena with diverse mixed colors */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className={`w-full max-w-2xl rounded-2xl p-5 shadow-2xl transition-all ${
          settings.rgbEnabled ? 'rgb-border bg-slate-900/90' : 'bg-slate-900 border-2 border-slate-800'
        }`}>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-6">
            {tubes.map((tube, idx) => {
              const isSelected = selectedTubeIdx === idx;
              const isCompleted = tube.length === TUBE_CAPACITY && tube.every(c => c === tube[0]);

              return (
                <div key={idx} className="flex flex-col items-center">
                  <button
                    onClick={() => handleTubeClick(idx)}
                    className={`relative w-11 sm:w-13 h-40 sm:h-44 rounded-b-2xl rounded-t-sm border-2 overflow-hidden flex flex-col-reverse transition-all duration-200 backdrop-blur ${
                      isSelected
                        ? '-translate-y-4 ring-4 ring-emerald-400 border-white shadow-lg'
                        : isCompleted
                        ? 'border-emerald-400/80 shadow-emerald-500/20'
                        : 'border-slate-600 hover:border-slate-400'
                    } bg-slate-950/60`}
                  >
                    <div className="absolute top-0 right-1 w-1 h-full bg-white/10 rounded-full pointer-events-none z-10" />
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-500/40 rounded-t-sm z-10" />

                    {tube.map((colorKey, layerIdx) => {
                      const colorInfo = PALETTE[colorKey] || PALETTE.red;
                      return (
                        <div
                          key={layerIdx}
                          style={{
                            backgroundColor: colorInfo.bg,
                            height: '25%',
                            boxShadow: `inset 0 -2px 6px rgba(0,0,0,0.3)`
                          }}
                          className="w-full relative transition-all duration-300 flex items-center justify-center"
                        />
                      );
                    })}

                    {tube.length === 0 && (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600 font-mono">
                        EMPTY
                      </div>
                    )}
                  </button>

                  <span className="text-[10px] font-mono font-semibold text-slate-400 mt-2">
                    #{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Level Complete Modal */}
      {isSolved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {lang === 'si' ? '🎉 කුප්පි සියල්ල වෙන්කළා!' : '🎉 Tubes Sorted!'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              {lang === 'si'
                ? `ලෙවල් ${currentLevel} සාර්ථකව විසඳන ලදී! +${currentWager > 0 ? currentWager * 2 + 150 : 150} කාසි හිමිවිය. ඊළඟ මට්ටම අගුළු හැරුණි!`
                : `Level ${currentLevel} cleared! Earned +${currentWager > 0 ? currentWager * 2 + 150 : 150} Coins. Next level unlocked!`}
            </p>
            <div className="flex gap-2">
              {currentLevel < 500 ? (
                <button
                  onClick={handleNextLevel}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg"
                >
                  {lang === 'si' ? 'ඊළඟ ලෙවල් එක' : 'Next Level'}
                </button>
              ) : (
                <button
                  onClick={exitActiveGame}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg"
                >
                  {lang === 'si' ? 'සියලු ලෙවල් 500 අවසන්!' : 'All 500 Levels Done!'}
                </button>
              )}
              <button
                onClick={handleReset}
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
