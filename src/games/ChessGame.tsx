import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Crown } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/sound';
import { InGameQuickChat } from '../components/InGameQuickChat';
import confetti from 'canvas-confetti';

type ChessColor = 'w' | 'b';
type ChessPieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

interface ChessPiece {
  type: ChessPieceType;
  color: ChessColor;
}

interface Pos {
  r: number;
  c: number;
}

const CHESS_UNICODE: Record<string, string> = {
  'w-k': '♔', 'w-q': '♕', 'w-r': '♖', 'w-b': '♗', 'w-n': '♘', 'w-p': '♙',
  'b-k': '♚', 'b-q': '♛', 'b-r': '♜', 'b-b': '♝', 'b-n': '♞', 'b-p': '♟'
};

export const ChessGame: React.FC = () => {
  const { profile, settings, activeLiveOpponent, exitActiveGame, addCoins, deductCoins, addXp, updateMissionProgress, currentWager } = useGame();
  const lang = settings.language;

  const [isBotMode, setIsBotMode] = useState<boolean>(!activeLiveOpponent);

  const initBoard = (): (ChessPiece | null)[][] => {
    const b: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    const backRow: ChessPieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let c = 0; c < 8; c++) {
      b[0][c] = { type: backRow[c], color: 'b' };
      b[1][c] = { type: 'p', color: 'b' };
      b[6][c] = { type: 'p', color: 'w' };
      b[7][c] = { type: backRow[c], color: 'w' };
    }
    return b;
  };

  const [board, setBoard] = useState<(ChessPiece | null)[][]>(initBoard);
  const [turn, setTurn] = useState<ChessColor>('w'); // White is player
  const [selectedPos, setSelectedPos] = useState<Pos | null>(null);
  const [validMoves, setValidMoves] = useState<Pos[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<ChessPieceType[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<ChessPieceType[]>([]);
  const [winner, setWinner] = useState<ChessColor | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const getLegalMoves = useCallback((r: number, c: number, currentBoard: (ChessPiece | null)[][]): Pos[] => {
    const piece = currentBoard[r][c];
    if (!piece) return [];
    const moves: Pos[] = [];
    const isWhite = piece.color === 'w';

    const addMoveIfValid = (nr: number, nc: number): boolean => {
      if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) return false;
      const target = currentBoard[nr][nc];
      if (!target) {
        moves.push({ r: nr, c: nc });
        return true;
      }
      if (target.color !== piece.color) {
        moves.push({ r: nr, c: nc });
      }
      return false;
    };

    switch (piece.type) {
      case 'p': {
        const dir = isWhite ? -1 : 1;
        const startRow = isWhite ? 6 : 1;
        if (r + dir >= 0 && r + dir < 8 && !currentBoard[r + dir][c]) {
          moves.push({ r: r + dir, c });
          if (r === startRow && !currentBoard[r + 2 * dir][c]) {
            moves.push({ r: r + 2 * dir, c });
          }
        }
        [-1, 1].forEach(dc => {
          const nr = r + dir;
          const nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const target = currentBoard[nr][nc];
            if (target && target.color !== piece.color) {
              moves.push({ r: nr, c: nc });
            }
          }
        });
        break;
      }
      case 'n': {
        const knightDeltas = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ];
        knightDeltas.forEach(([dr, dc]) => addMoveIfValid(r + dr, c + dc));
        break;
      }
      case 'b': {
        const bishopDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
        bishopDirs.forEach(([dr, dc]) => {
          let step = 1;
          while (addMoveIfValid(r + dr * step, c + dc * step)) step++;
        });
        break;
      }
      case 'r': {
        const rookDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        rookDirs.forEach(([dr, dc]) => {
          let step = 1;
          while (addMoveIfValid(r + dr * step, c + dc * step)) step++;
        });
        break;
      }
      case 'q': {
        const queenDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
        queenDirs.forEach(([dr, dc]) => {
          let step = 1;
          while (addMoveIfValid(r + dr * step, c + dc * step)) step++;
        });
        break;
      }
      case 'k': {
        const kingDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]];
        kingDirs.forEach(([dr, dc]) => addMoveIfValid(r + dr, c + dc));
        break;
      }
    }

    return moves;
  }, []);

  const handleSquareClick = (r: number, c: number) => {
    if (winner) return;
    if (isBotMode && turn === 'b' && !activeLiveOpponent) return;

    const piece = board[r][c];

    // Selecting own piece on turn
    if (piece && piece.color === turn) {
      setSelectedPos({ r, c });
      const moves = getLegalMoves(r, c, board);
      setValidMoves(moves);
      sound.playClick();
      return;
    }

    // Moving piece
    if (selectedPos) {
      const isLegal = validMoves.some(m => m.r === r && m.c === c);
      if (isLegal) {
        executeMove(selectedPos, { r, c });
      } else {
        setSelectedPos(null);
        setValidMoves([]);
      }
    }
  };

  const executeMove = (from: Pos, to: Pos) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[from.r][from.c];
    if (!piece) return;

    const targetPiece = newBoard[to.r][to.c];
    if (targetPiece) {
      sound.playCapture();
      if (targetPiece.color === 'w') {
        setCapturedWhite(prev => [...prev, targetPiece.type]);
      } else {
        setCapturedBlack(prev => [...prev, targetPiece.type]);
      }
      if (targetPiece.type === 'k') {
        setWinner(piece.color);
        sound.playVictory();
        if (piece.color === 'w') {
          const reward = currentWager > 0 ? currentWager * 2 + 150 : 150;
          addCoins(reward);
          addXp(150);
          confetti({ particleCount: 110, spread: 80 });
        } else {
          if (currentWager > 0) deductCoins(currentWager);
        }
        return;
      }
    } else {
      sound.playPieceMove();
    }

    let movedPiece = piece;
    if (piece.type === 'p') {
      if ((piece.color === 'w' && to.r === 0) || (piece.color === 'b' && to.r === 7)) {
        movedPiece = { type: 'q', color: piece.color };
        sound.playVictory();
      }
    }

    newBoard[from.r][from.c] = null;
    newBoard[to.r][to.c] = movedPiece;

    setBoard(newBoard);
    setSelectedPos(null);
    setValidMoves([]);
    updateMissionProgress('chess', 1);

    setTurn(prev => (prev === 'w' ? 'b' : 'w'));
  };

  useEffect(() => {
    if (isBotMode && turn === 'b' && !winner) {
      setIsAiThinking(true);
      const delay = activeLiveOpponent ? 1400 + Math.random() * 800 : 900;

      const timer = setTimeout(() => {
        const blackMoves: { from: Pos; to: Pos; captureValue: number }[] = [];
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p && p.color === 'b') {
              const moves = getLegalMoves(r, c, board);
              moves.forEach(m => {
                const target = board[m.r][m.c];
                let value = 0;
                if (target) {
                  const values: Record<ChessPieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
                  value = values[target.type] || 0;
                }
                blackMoves.push({ from: { r, c }, to: m, captureValue: value });
              });
            }
          }
        }

        if (blackMoves.length === 0) {
          setWinner('w');
          setIsAiThinking(false);
          addCoins(currentWager > 0 ? currentWager * 2 + 150 : 150);
          return;
        }

        blackMoves.sort((a, b) => b.captureValue - a.captureValue);
        const bestMoves = blackMoves.filter(m => m.captureValue === blackMoves[0].captureValue);
        const chosen = bestMoves[Math.floor(Math.random() * bestMoves.length)];

        executeMove(chosen.from, chosen.to);
        setIsAiThinking(false);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [turn, winner, board, isBotMode, activeLiveOpponent, getLegalMoves]);

  const resetGame = () => {
    setBoard(initBoard());
    setTurn('w');
    setSelectedPos(null);
    setValidMoves([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setWinner(null);
    setIsAiThinking(false);
    sound.playClick();
  };

  const opponentName = activeLiveOpponent ? activeLiveOpponent.name : isBotMode ? 'Grandmaster Bot' : 'Player 2 (Black)';

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
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>{isBotMode ? '🤖 Bot Mode' : '👥 2-Player Local'}</span>
              <span>·</span>
              <div className="flex text-[10px] text-slate-300">
                {capturedWhite.map((type, i) => (
                  <span key={i}>{CHESS_UNICODE[`w-${type}`]}</span>
                ))}
              </div>
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
            <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
              <span>{currentWager > 0 ? `Bet: ${currentWager} 🪙` : 'Free Match'}</span>
              <span>·</span>
              <div className="flex text-[10px] text-slate-300">
                {capturedBlack.map((type, i) => (
                  <span key={i}>{CHESS_UNICODE[`b-${type}`]}</span>
                ))}
              </div>
            </div>
          </div>
          <InGameQuickChat opponentName={opponentName} lang={lang} />
        </div>
      </div>

      {/* 8x8 Board */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-5">
        <div className={`relative w-full max-w-[500px] aspect-square rounded-2xl p-2 sm:p-3 shadow-2xl transition-all ${
          settings.rgbEnabled ? 'rgb-border bg-slate-900/90' : 'bg-slate-900 border-2 border-slate-800'
        }`}>
          <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            {board.map((row, r) =>
              row.map((piece, c) => {
                const isLight = (r + c) % 2 === 0;
                const isSelected = selectedPos?.r === r && selectedPos?.c === c;
                const isValidMove = validMoves.some(m => m.r === r && m.c === c);

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    disabled={isBotMode && turn === 'b' && !activeLiveOpponent}
                    className={`relative w-full h-full flex items-center justify-center transition-all select-none ${
                      isLight ? 'bg-[#e2d6b5] text-slate-950' : 'bg-[#b88b4a] text-slate-950'
                    } ${isSelected ? 'ring-4 ring-emerald-500 ring-inset z-10' : ''}`}
                  >
                    {c === 0 && (
                      <span className="absolute top-0.5 left-1 text-[9px] font-bold opacity-40">
                        {8 - r}
                      </span>
                    )}
                    {r === 7 && (
                      <span className="absolute bottom-0.5 right-1 text-[9px] font-bold opacity-40">
                        {String.fromCharCode(97 + c)}
                      </span>
                    )}

                    {isValidMove && (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/80 shadow absolute z-10 animate-scale-in" />
                    )}

                    {piece && (
                      <span
                        className={`text-3xl sm:text-4xl drop-shadow transition-transform active:scale-95 leading-none ${
                          piece.color === 'w' ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-slate-950'
                        }`}
                      >
                        {CHESS_UNICODE[`${piece.color}-${piece.type}`]}
                      </span>
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
        <span>{turn === 'w' ? `${profile.name}'s Move (White)` : `${opponentName}'s Move (Black)`}</span>
        {isAiThinking && <span className="text-amber-400 animate-pulse font-mono">Calculating...</span>}
      </div>

      {/* Victory Modal */}
      {winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Crown className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {winner === 'w' ? (lang === 'si' ? '🎉 Checkmate! ඔබ ජයග්‍රහණය කළා!' : '🎉 Checkmate! Victory!') : 'Opponent Won'}
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              {winner === 'w'
                ? `Tactical checkmate! Earned +${currentWager > 0 ? currentWager * 2 + 150 : 150} Coins.`
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
