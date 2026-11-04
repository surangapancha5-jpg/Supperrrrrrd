import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Crown, Users, Bot } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';
import { InGameQuickChat } from '../components/InGameQuickChat';
import confetti from 'canvas-confetti';

type PieceType = 'red' | 'black' | 'red_king' | 'black_king' | null;

interface Position {
  r: number;
  c: number;
}

export const DamGame: React.FC = () => {
  const { profile, settings, activeLiveOpponent, exitActiveGame, addCoins, deductCoins, addXp, updateMissionProgress, currentWager } = useGame();
  const lang = settings.language;

  const [isBotMode, setIsBotMode] = useState<boolean>(!activeLiveOpponent);

  const initialBoard = (): PieceType[][] => {
    const b: PieceType[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          if (r < 3) b[r][c] = 'black';
          else if (r > 4) b[r][c] = 'red';
        }
      }
    }
    return b;
  };

  const [board, setBoard] = useState<PieceType[][]>(initialBoard);
  const [turn, setTurn] = useState<'red' | 'black'>('red'); // Red is player
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [capturedRed, setCapturedRed] = useState(0);
  const [capturedBlack, setCapturedBlack] = useState(0);
  const [winner, setWinner] = useState<'red' | 'black' | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const getMovesForPiece = useCallback((r: number, c: number, currentBoard: PieceType[][]): Position[] => {
    const piece = currentBoard[r][c];
    if (!piece) return [];

    const isKing = piece === 'red_king' || piece === 'black_king';
    const isRed = piece === 'red' || piece === 'red_king';
    const moves: Position[] = [];

    const dirs: number[][] = [];
    if (isKing) {
      dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    } else if (isRed) {
      dirs.push([-1, -1], [-1, 1]);
    } else {
      dirs.push([1, -1], [1, 1]);
    }

    dirs.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (!currentBoard[nr][nc]) {
          moves.push({ r: nr, c: nc });
        } else {
          const opponentIsRed = !isRed;
          const targetPiece = currentBoard[nr][nc];
          const isTargetOpponent = targetPiece && ((opponentIsRed && (targetPiece === 'red' || targetPiece === 'red_king')) ||
                                                   (!opponentIsRed && (targetPiece === 'black' || targetPiece === 'black_king')));
          if (isTargetOpponent) {
            const jnr = nr + dr;
            const jnc = nc + dc;
            if (jnr >= 0 && jnr < 8 && jnc >= 0 && jnc < 8 && !currentBoard[jnr][jnc]) {
              moves.push({ r: jnr, c: jnc });
            }
          }
        }
      }
    });

    return moves;
  }, []);

  const handleSquareClick = (r: number, c: number) => {
    if (winner) return;
    if (isBotMode && turn === 'black' && !activeLiveOpponent) return;

    const clickedPiece = board[r][c];
    const isRedPiece = clickedPiece === 'red' || clickedPiece === 'red_king';
    const isBlackPiece = clickedPiece === 'black' || clickedPiece === 'black_king';

    const isCurrentPlayerPiece = (turn === 'red' && isRedPiece) || (turn === 'black' && isBlackPiece);

    if (isCurrentPlayerPiece) {
      setSelectedPos({ r, c });
      const moves = getMovesForPiece(r, c, board);
      setValidMoves(moves);
      sound.playClick();
      return;
    }

    if (selectedPos) {
      const isMoveValid = validMoves.some(m => m.r === r && m.c === c);
      if (isMoveValid) {
        executeMove(selectedPos, { r, c });
      } else {
        setSelectedPos(null);
        setValidMoves([]);
      }
    }
  };

  const executeMove = (from: Position, to: Position) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.r][from.c];
    newBoard[from.r][from.c] = null;

    if (Math.abs(to.r - from.r) === 2) {
      const midR = (from.r + to.r) / 2;
      const midC = (from.c + to.c) / 2;
      const captured = newBoard[midR][midC];
      newBoard[midR][midC] = null;
      if (captured === 'red' || captured === 'red_king') {
        setCapturedRed(prev => prev + 1);
      } else {
        setCapturedBlack(prev => prev + 1);
      }
      sound.playCapture();
      updateMissionProgress('dam', 1);
    } else {
      sound.playPieceMove();
    }

    let finalPiece = piece;
    if (piece === 'red' && to.r === 0) {
      finalPiece = 'red_king';
      sound.playVictory();
    } else if (piece === 'black' && to.r === 7) {
      finalPiece = 'black_king';
    }
    newBoard[to.r][to.c] = finalPiece;

    setBoard(newBoard);
    setSelectedPos(null);
    setValidMoves([]);

    let redCount = 0;
    let blackCount = 0;
    newBoard.forEach(row => {
      row.forEach(p => {
        if (p === 'red' || p === 'red_king') redCount++;
        if (p === 'black' || p === 'black_king') blackCount++;
      });
    });

    if (blackCount === 0) {
      setWinner('red');
      const reward = currentWager > 0 ? currentWager * 2 + 150 : 150;
      addCoins(reward);
      addXp(120);
      confetti({ particleCount: 100, spread: 70 });
      sound.playVictory();
      return;
    } else if (redCount === 0) {
      setWinner('black');
      if (currentWager > 0) deductCoins(currentWager);
      return;
    }

    setTurn(prev => (prev === 'red' ? 'black' : 'red'));
  };

  // Bot Turn Automation
  useEffect(() => {
    if (isBotMode && turn === 'black' && !winner) {
      setIsAiThinking(true);
      const delay = activeLiveOpponent ? 1200 + Math.random() * 800 : 800;

      const timer = setTimeout(() => {
        const allMoves: { from: Position; to: Position; isJump: boolean }[] = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p === 'black' || p === 'black_king') {
              const moves = getMovesForPiece(r, c, board);
              moves.forEach(m => {
                allMoves.push({
                  from: { r, c },
                  to: m,
                  isJump: Math.abs(m.r - r) === 2
                });
              });
            }
          }
        }

        if (allMoves.length === 0) {
          setWinner('red');
          setIsAiThinking(false);
          addCoins(currentWager > 0 ? currentWager * 2 + 150 : 150);
          return;
        }

        const jumps = allMoves.filter(m => m.isJump);
        const chosen = jumps.length > 0 ? jumps[Math.floor(Math.random() * jumps.length)] : allMoves[Math.floor(Math.random() * allMoves.length)];

        executeMove(chosen.from, chosen.to);
        setIsAiThinking(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [turn, winner, board, isBotMode, activeLiveOpponent, getMovesForPiece]);

  const resetGame = () => {
    setBoard(initialBoard());
    setTurn('red');
    setSelectedPos(null);
    setValidMoves([]);
    setCapturedRed(0);
    setCapturedBlack(0);
    setWinner(null);
    setIsAiThinking(false);
    sound.playClick();
  };

  const opponentName = activeLiveOpponent ? activeLiveOpponent.name : isBotMode ? 'Dam Master Bot' : 'Player 2 (Black)';

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Top Header: Left = Opponent (Bot or Player 2), Right = Real Player (You) */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-20">
        {/* Left: Opponent Name */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={exitActiveGame}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <span>{opponentName}</span>
              {activeLiveOpponent?.isVerified && <span className="text-blue-400 text-xs">✓</span>}
            </div>
            <div className="text-[10px] text-slate-400">
              {isBotMode ? '🤖 Bot Mode' : '👥 2-Player Local'} · Cap: {capturedRed}
            </div>
          </div>
        </div>

        {/* Center: Mode Switch & Reset */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsBotMode(!isBotMode)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              isBotMode ? 'bg-slate-800 text-slate-300' : 'bg-blue-600 text-white'
            }`}
          >
            {isBotMode ? '🤖 Bot' : '👥 PvP'}
          </button>
          <button
            onClick={resetGame}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Real Player Name */}
        <div className="flex items-center gap-2 text-right">
          <div>
            <div className="text-xs font-bold text-white flex items-center justify-end gap-1">
              <span>{profile.name}</span>
              {profile.isVerified && <span className="text-blue-400 text-xs">✓</span>}
            </div>
            <div className="text-[10px] text-emerald-400">
              {currentWager > 0 ? `Bet: ${currentWager} 🪙` : 'Free Match'} · Cap: {capturedBlack}
            </div>
          </div>
          <InGameQuickChat opponentName={opponentName} lang={lang} />
        </div>
      </div>

      {/* 8x8 Spacious Board */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-5">
        <div className={`relative w-full max-w-[500px] aspect-square rounded-2xl p-2 sm:p-3 shadow-2xl transition-all ${
          settings.rgbEnabled ? 'rgb-border bg-slate-900/90' : 'bg-slate-900 border-2 border-slate-800'
        }`}>
          <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            {board.map((row, r) =>
              row.map((piece, c) => {
                const isDarkSquare = (r + c) % 2 === 1;
                const isSelected = selectedPos?.r === r && selectedPos?.c === c;
                const isValidMove = validMoves.some(m => m.r === r && m.c === c);

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    disabled={!isDarkSquare || (isBotMode && turn === 'black' && !activeLiveOpponent)}
                    className={`relative w-full h-full flex items-center justify-center transition-all ${
                      isDarkSquare ? 'bg-amber-950/80 hover:bg-amber-900/90' : 'bg-amber-100/90'
                    } ${isSelected ? 'ring-4 ring-emerald-400 ring-inset z-10' : ''}`}
                  >
                    {isValidMove && (
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow absolute z-10 animate-scale-in" />
                    )}

                    {piece && (
                      <div
                        className={`w-[82%] h-[82%] rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-90 ${
                          piece === 'red' || piece === 'red_king'
                            ? 'bg-gradient-to-br from-red-500 to-red-800 border-2 border-red-300 text-white'
                            : 'bg-gradient-to-br from-slate-700 to-slate-950 border-2 border-slate-600 text-amber-400'
                        }`}
                      >
                        {(piece === 'red_king' || piece === 'black_king') && (
                          <Crown className="w-5 h-5 text-amber-300 drop-shadow animate-pulse" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Turn indicator bottom bar */}
      <div className="max-w-2xl mx-auto w-full px-4 pb-4 flex items-center justify-between text-xs text-slate-400">
        <span>{turn === 'red' ? `${profile.name}'s Move (Red)` : `${opponentName}'s Move (Black)`}</span>
        {isAiThinking && <span className="text-amber-400 animate-pulse font-mono">Thinking...</span>}
      </div>

      {/* Victory Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {winner === 'red' ? (lang === 'si' ? '🎉 ඔබ ජයග්‍රහණය කළා!' : '🎉 Victory! You Won!') : (lang === 'si' ? 'ප්‍රතිවාදියා ජයගත්තා' : 'Opponent Won')}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              {winner === 'red'
                ? `Earned +${currentWager > 0 ? currentWager * 2 + 150 : 150} Coins.`
                : `${currentWager > 0 ? `${currentWager} coins deducted.` : ''}`}
            </p>
            <button
              onClick={resetGame}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow"
            >
              {lang === 'si' ? 'නැවත සෙල්ලම් කරන්න' : 'Play Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
