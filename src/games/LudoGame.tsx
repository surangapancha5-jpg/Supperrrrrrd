import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Crown, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Users, Bot, MessageSquare } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';
import { InGameQuickChat } from '../components/InGameQuickChat';
import confetti from 'canvas-confetti';

type LudoColor = 'red' | 'green' | 'yellow' | 'blue';

interface Token {
  id: number;
  color: LudoColor;
  step: number; // -1 = base yard, 0 to 50 = on outer track, 51 to 55 = in home column, 56 = Home Finish
}

// 52 Perimeter Coordinates [r, c] for 15x15 Ludo Board
const LUDO_TRACK_COORDS: [number, number][] = [
  // Red start & clockwise perimeter:
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7],
  [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14],
  [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7],
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0]
];

// Start offsets on the 52 track:
const START_OFFSETS: Record<LudoColor, number> = {
  red: 0,      // [6, 1]
  green: 13,   // [1, 8]
  yellow: 26,  // [8, 13]
  blue: 39     // [13, 6]
};

// Home Runway Coordinates (5 steps + finish)
const HOME_RUNWAYS: Record<LudoColor, [number, number][]> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 7]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [7, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 7]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [7, 7]]
};

const DICE_ICONS = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export const LudoGame: React.FC = () => {
  const { profile, settings, activeLiveOpponent, exitActiveGame, addCoins, deductCoins, addXp, updateMissionProgress, currentWager } = useGame();
  const lang = settings.language;

  // Player configurations: 1 vs 1 (2 colors), 1 vs 2 (3 colors), 1 vs 3 (4 colors)
  const [matchMode, setMatchMode] = useState<'1v1' | '1v2' | '1v3'>('1v1');
  const [playWithBots, setPlayWithBots] = useState<boolean>(!activeLiveOpponent);

  const activeColors: LudoColor[] =
    matchMode === '1v1' ? ['red', 'yellow'] :
    matchMode === '1v2' ? ['red', 'green', 'yellow'] :
    ['red', 'green', 'yellow', 'blue'];

  const initTokens = (): Token[] => {
    const list: Token[] = [];
    activeColors.forEach(color => {
      for (let i = 0; i < 4; i++) {
        list.push({ id: i, color, step: -1 });
      }
    });
    return list;
  };

  const [tokens, setTokens] = useState<Token[]>(initTokens);
  const [currentTurn, setCurrentTurn] = useState<LudoColor>('red');
  const [diceValue, setDiceValue] = useState<number>(6);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [hasRolled, setHasRolled] = useState<boolean>(false);
  const [winner, setWinner] = useState<LudoColor | null>(null);
  const [opponentLog, setOpponentLog] = useState<string>('Roll the dice to start!');

  // Reset when matchMode changes
  useEffect(() => {
    setTokens(initTokens());
    setCurrentTurn('red');
    setHasRolled(false);
    setWinner(null);
  }, [matchMode]);

  const canMoveToken = (token: Token, roll: number): boolean => {
    if (token.color !== currentTurn) return false;
    if (token.step === 56) return false;
    if (token.step === -1) {
      return roll === 6;
    }
    return token.step + roll <= 56;
  };

  const handleRollDice = () => {
    const isHumanTurn = !playWithBots || currentTurn === 'red';
    if (isRolling || hasRolled || (!isHumanTurn && !activeLiveOpponent)) return;

    setIsRolling(true);
    sound.playDiceRoll();

    let counter = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      counter++;
      if (counter > 7) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);
        setHasRolled(true);

        const currentTokens = tokens.filter(t => t.color === currentTurn);
        const legal = currentTokens.filter(t => canMoveToken(t, finalRoll));

        if (legal.length === 0) {
          setTimeout(() => {
            passTurn(finalRoll === 6);
          }, 800);
        } else if (legal.length === 1 && legal[0].step !== -1) {
          setTimeout(() => {
            handleMoveToken(legal[0], finalRoll);
          }, 350);
        }
      }
    }, 60);
  };

  const handleMoveToken = (token: Token, roll = diceValue) => {
    if (!hasRolled || token.color !== currentTurn) return;
    if (!canMoveToken(token, roll)) return;

    sound.playPieceMove();

    const nextStep = token.step === -1 ? 0 : token.step + roll;

    // Check for capturing opponent tokens
    setTokens(prev => {
      let updated = prev.map(t => {
        if (t.color === token.color && t.id === token.id) {
          return { ...t, step: nextStep };
        }
        return t;
      });

      // If token lands on an open track (0 to 50), check if any opponent is captured!
      if (nextStep >= 0 && nextStep <= 50) {
        const landingCoord = getCoordinates(token.color, nextStep);
        const isSafeStar = (landingCoord[0] === 6 && landingCoord[1] === 2) ||
                           (landingCoord[0] === 2 && landingCoord[1] === 8) ||
                           (landingCoord[0] === 8 && landingCoord[1] === 12) ||
                           (landingCoord[0] === 12 && landingCoord[1] === 6);

        if (!isSafeStar) {
          updated = updated.map(other => {
            if (other.color !== token.color && other.step >= 0 && other.step <= 50) {
              const otherCoord = getCoordinates(other.color, other.step);
              if (otherCoord[0] === landingCoord[0] && otherCoord[1] === landingCoord[1]) {
                sound.playCapture();
                return { ...other, step: -1 }; // Cut back to base!
              }
            }
            return other;
          });
        }
      }

      return updated;
    });

    updateMissionProgress('ludo', 1);

    setTimeout(() => {
      const myTokens = tokens.filter(t => t.color === currentTurn);
      const finished = myTokens.filter(t => t.step === 56).length;
      if (finished >= 3) {
        setWinner(currentTurn);
        if (currentTurn === 'red') {
          const reward = currentWager > 0 ? currentWager * 2 + 150 : 150;
          addCoins(reward);
          addXp(150);
          confetti({ particleCount: 120, spread: 80 });
          sound.playVictory();
        } else {
          if (currentWager > 0) deductCoins(currentWager);
        }
        return;
      }
      passTurn(roll === 6);
    }, 300);
  };

  const passTurn = (rolledSix: boolean) => {
    setHasRolled(false);
    if (rolledSix) {
      setOpponentLog(lang === 'si' ? '6 වැටුණි! අමතර රෝල් එකක්!' : 'Rolled 6! Bonus roll!');
      return;
    }

    const nextIdx = (activeColors.indexOf(currentTurn) + 1) % activeColors.length;
    setCurrentTurn(activeColors[nextIdx]);
  };

  // Bot Turn Automation when playWithBots is true
  useEffect(() => {
    if (playWithBots && currentTurn !== 'red' && !winner) {
      setOpponentLog(`${currentTurn.toUpperCase()} is rolling...`);

      const rollTimer = setTimeout(() => {
        setIsRolling(true);
        sound.playDiceRoll();

        setTimeout(() => {
          const roll = Math.floor(Math.random() * 6) + 1;
          setDiceValue(roll);
          setIsRolling(false);
          setHasRolled(true);

          const botTokens = tokens.filter(t => t.color === currentTurn);
          const legal = botTokens.filter(t => canMoveToken(t, roll));

          if (legal.length === 0) {
            setOpponentLog(`${currentTurn.toUpperCase()} rolled ${roll} · No moves`);
            setTimeout(() => passTurn(roll === 6), 800);
          } else {
            const baseToken = legal.find(t => t.step === -1);
            const chosen = (roll === 6 && baseToken) ? baseToken : legal[0];
            setOpponentLog(`${currentTurn.toUpperCase()} rolled ${roll} · Advancing`);
            setTimeout(() => handleMoveToken(chosen, roll), 600);
          }
        }, 500);
      }, 900);

      return () => clearTimeout(rollTimer);
    }
  }, [currentTurn, winner, playWithBots]);

  // Compute exact [r, c] for step (0 to 50 on outer 52-path, 51-56 in runway)
  const getCoordinates = (color: LudoColor, step: number): [number, number] => {
    if (step < 0) return [0, 0];
    if (step <= 50) {
      const offset = START_OFFSETS[color];
      const trackIdx = (offset + step) % 52;
      return LUDO_TRACK_COORDS[trackIdx] || [7, 7];
    }
    const runwayIdx = Math.min(5, step - 51);
    return HOME_RUNWAYS[color][runwayIdx] || [7, 7];
  };

  const DiceComponent = DICE_ICONS[diceValue - 1] || Dice6;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Top Header - Opponent on Left, Player (You) on Right as requested! */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-20">
        {/* Left: Opponent Name */}
        <div className="flex items-center gap-2">
          <button
            onClick={exitActiveGame}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-bold text-amber-400">
              {playWithBots ? (activeLiveOpponent ? activeLiveOpponent.name : 'Bot Opponents') : 'Player 2 (Local)'}
            </div>
            <div className="text-[10px] text-slate-400">
              {playWithBots ? '🤖 AI Mode' : '👥 2-Player Local'}
            </div>
          </div>
        </div>

        {/* Center: Mode Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['1v1', '1v2', '1v3'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setMatchMode(mode)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-colors ${
                matchMode === mode ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
          <button
            onClick={() => setPlayWithBots(!playWithBots)}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors ${
              playWithBots ? 'bg-slate-800 text-emerald-400' : 'bg-blue-600 text-white'
            }`}
          >
            {playWithBots ? '🤖 Bot' : '👥 PvP'}
          </button>
        </div>

        {/* Right: Player Name (You) */}
        <div className="flex items-center gap-2 text-right">
          <div>
            <div className="text-xs font-bold text-white flex items-center justify-end gap-1">
              <span>{profile.name}</span>
              {profile.isVerified && <span className="text-blue-400 text-xs">✓</span>}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              {currentWager > 0 ? `Bet: ${currentWager} 🪙` : 'Free Match'}
            </div>
          </div>
          <InGameQuickChat opponentName={activeLiveOpponent ? activeLiveOpponent.name : 'Bot Opponent'} lang={lang} />
        </div>
      </div>

      {/* Opponent commentary bar */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-2.5 flex items-center justify-between">
        <div className="text-xs text-slate-300 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{opponentLog}</span>
        </div>

        {/* Dice Rolling Controller */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              {currentTurn.toUpperCase()} TURN
            </div>
          </div>
          <button
            onClick={handleRollDice}
            disabled={isRolling || hasRolled || (playWithBots && currentTurn !== 'red')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform active:scale-90 shadow-lg ${
              (!playWithBots || currentTurn === 'red') && !hasRolled
                ? 'bg-gradient-to-br from-red-500 to-rose-700 text-white ring-2 ring-red-400 animate-bounce'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            <DiceComponent className={`w-8 h-8 ${isRolling ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Ludo Board with fully verified 52 Perimeter Coords for smooth walking around the entire board */}
      <div className="flex-1 flex flex-col items-center justify-center p-2.5">
        <div className={`relative w-full max-w-[460px] aspect-square rounded-2xl p-2 sm:p-3 shadow-2xl transition-all ${
          settings.rgbEnabled ? 'rgb-border bg-slate-900/90' : 'bg-slate-900 border-2 border-slate-800'
        }`}>
          <div className="w-full h-full bg-[#f8fafc] rounded-xl overflow-hidden border-2 border-slate-700 grid grid-cols-15 grid-rows-15 relative shadow-inner">
            {/* Top-Left Red Yard */}
            <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-red-500 border-2 border-slate-800 flex items-center justify-center p-2">
              <div className="w-full h-full bg-white rounded-xl border border-red-800 grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                {tokens.filter(t => t.color === 'red' && t.step === -1).map(token => (
                  <button
                    key={token.id}
                    onClick={() => handleMoveToken(token)}
                    disabled={!hasRolled || currentTurn !== 'red' || diceValue !== 6}
                    className={`w-full h-full rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-red-200 flex items-center justify-center shadow transition-transform ${
                      hasRolled && diceValue === 6 && currentTurn === 'red' ? 'ring-2 ring-emerald-400 animate-pulse scale-105' : ''
                    }`}
                  >
                    <span className="text-[10px] font-bold text-white">{token.id + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top-Right Green Yard */}
            <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500 border-2 border-slate-800 flex items-center justify-center p-2">
              <div className="w-full h-full bg-white rounded-xl border border-emerald-800 grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                {tokens.filter(t => t.color === 'green' && t.step === -1).map(token => (
                  <button
                    key={token.id}
                    onClick={() => handleMoveToken(token)}
                    disabled={!hasRolled || currentTurn !== 'green' || diceValue !== 6 || playWithBots}
                    className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 border-2 border-emerald-200 flex items-center justify-center shadow"
                  >
                    <span className="text-[10px] font-bold text-white">{token.id + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom-Left Blue Yard */}
            <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500 border-2 border-slate-800 flex items-center justify-center p-2">
              <div className="w-full h-full bg-white rounded-xl border border-blue-800 grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                {tokens.filter(t => t.color === 'blue' && t.step === -1).map(token => (
                  <button
                    key={token.id}
                    onClick={() => handleMoveToken(token)}
                    disabled={!hasRolled || currentTurn !== 'blue' || diceValue !== 6 || playWithBots}
                    className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-700 border-2 border-blue-200 flex items-center justify-center shadow"
                  >
                    <span className="text-[10px] font-bold text-white">{token.id + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom-Right Yellow Yard */}
            <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-amber-400 border-2 border-slate-800 flex items-center justify-center p-2">
              <div className="w-full h-full bg-white rounded-xl border border-amber-600 grid grid-cols-2 grid-rows-2 p-2 gap-2 shadow-inner">
                {tokens.filter(t => t.color === 'yellow' && t.step === -1).map(token => (
                  <button
                    key={token.id}
                    onClick={() => handleMoveToken(token)}
                    disabled={!hasRolled || currentTurn !== 'yellow' || diceValue !== 6 || playWithBots}
                    className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-amber-200 flex items-center justify-center shadow"
                  >
                    <span className="text-[10px] font-bold text-white">{token.id + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Central Home Triangle */}
            <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-slate-900 border-2 border-slate-800 flex flex-col items-center justify-center p-1 shadow-lg">
              <Crown className="w-6 h-6 text-amber-400 animate-pulse" />
              <span className="text-[9px] font-bold text-amber-300 font-mono">HOME</span>
            </div>

            {/* Checkered Step Squares ⬜⬜⬜⬜ */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-15 grid-rows-15">
              {Array.from({ length: 225 }).map((_, idx) => {
                const r = Math.floor(idx / 15);
                const c = idx % 15;
                const isYard = (r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8);
                const isCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;
                if (isYard || isCenter) return <div key={idx} />;

                const isHomeRunway =
                  (r === 7 && c >= 1 && c <= 5) ||
                  (c === 7 && r >= 1 && r <= 5) ||
                  (r === 7 && c >= 9 && c <= 13) ||
                  (c === 7 && r >= 9 && r <= 13);

                const isStarSafe = (r === 6 && c === 2) || (r === 2 && c === 8) || (r === 8 && c === 12) || (r === 12 && c === 6);

                return (
                  <div
                    key={idx}
                    className={`border border-slate-300 flex items-center justify-center text-[8px] font-mono ${
                      isHomeRunway
                        ? 'bg-amber-200/90 font-bold'
                        : isStarSafe
                        ? 'bg-emerald-100 text-emerald-700 font-bold'
                        : 'bg-white text-slate-400'
                    }`}
                  >
                    {isStarSafe && '⭐'}
                  </div>
                );
              })}
            </div>

            {/* Active Moving Tokens Walking Around Perimeter */}
            <div className="absolute inset-0">
              {tokens.filter(t => t.step >= 0 && t.step < 56).map(token => {
                const [r, c] = getCoordinates(token.color, token.step);
                const isHumanTurn = !playWithBots || currentTurn === 'red';
                const isClickable = hasRolled && token.color === currentTurn && isHumanTurn && canMoveToken(token, diceValue);

                const colorBg =
                  token.color === 'red' ? 'from-red-500 to-red-700 border-red-200' :
                  token.color === 'green' ? 'from-emerald-500 to-emerald-700 border-emerald-200' :
                  token.color === 'yellow' ? 'from-amber-400 to-amber-600 border-amber-200' :
                  'from-blue-500 to-blue-700 border-blue-200';

                return (
                  <button
                    key={`${token.color}-${token.id}`}
                    onClick={() => handleMoveToken(token)}
                    disabled={!isClickable}
                    style={{
                      top: `${(r / 15) * 100}%`,
                      left: `${(c / 15) * 100}%`,
                      width: '6.66%',
                      height: '6.66%'
                    }}
                    className={`absolute flex items-center justify-center p-0.5 z-20 transition-all duration-300 ${
                      isClickable ? 'ring-2 ring-emerald-400 animate-bounce scale-110' : ''
                    }`}
                  >
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${colorBg} border shadow flex items-center justify-center`}>
                      <span className="text-[8px] font-bold text-white">{token.id + 1}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Victory Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {winner === 'red' ? (lang === 'si' ? '🎉 ලූඩෝ ශූරතාව ඔබ සතුයි!' : '🎉 Victory! Ludo Champion!') : `${winner.toUpperCase()} Won!`}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              {winner === 'red'
                ? lang === 'si'
                  ? `සියලු ඉත්තන් හෝම් එකට ගෙන ඒමෙන් +${currentWager > 0 ? currentWager * 2 + 150 : 150} කාසි හිමිවිය.`
                  : `All tokens safely home! Earned +${currentWager > 0 ? currentWager * 2 + 150 : 150} Coins.`
                : lang === 'si'
                  ? `ප්‍රතිවාදියා ජයග්‍රහණය කළේය. ${currentWager > 0 ? `${currentWager} කාසි කැපුනි.` : ''}`
                  : `Opponent won round.`}
            </p>
            <button
              onClick={() => {
                setTokens(initTokens());
                setWinner(null);
                setCurrentTurn('red');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow"
            >
              {lang === 'si' ? 'නැවත සෙල්ලම් කරන්න' : 'Play Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
