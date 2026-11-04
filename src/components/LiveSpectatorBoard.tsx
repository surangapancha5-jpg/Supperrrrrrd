import React, { useState, useEffect } from 'react';
import { Eye, X, Crown, MessageSquare, Volume2 } from 'lucide-react';
import { SimulatedMatch } from '../types';
import { sound } from '../utils/sound';

interface LiveSpectatorBoardProps {
  match: SimulatedMatch;
  onClose: () => void;
  lang: 'si' | 'en';
}

const CHESS_UNICODE: Record<string, string> = {
  'w-k': '♔', 'w-q': '♕', 'w-r': '♖', 'w-b': '♗', 'w-n': '♘', 'w-p': '♙',
  'b-k': '♚', 'b-q': '♛', 'b-r': '♜', 'b-b': '♝', 'b-n': '♞', 'b-p': '♟'
};

export const LiveSpectatorBoard: React.FC<LiveSpectatorBoardProps> = ({ match, onClose, lang }) => {
  const [spectatorCount, setSpectatorCount] = useState(match.spectators);
  const [recentMoveText, setRecentMoveText] = useState(match.recentMove);

  // Simulated live chess moves
  const [chessBoard, setChessBoard] = useState<(string | null)[][]>(() => {
    const b: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    const backRow = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let c = 0; c < 8; c++) {
      b[0][c] = `b-${backRow[c]}`;
      b[1][c] = 'b-p';
      b[6][c] = 'w-p';
      b[7][c] = `w-${backRow[c]}`;
    }
    return b;
  });

  // Simulated Dam board
  const [damBoard, setDamBoard] = useState<(string | null)[][]>(() => {
    const b: (string | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          if (r < 3) b[r][c] = 'black';
          else if (r > 4) b[r][c] = 'red';
        }
      }
    }
    return b;
  });

  // Periodically make a bot move live on the board!
  useEffect(() => {
    const moveTimer = setInterval(() => {
      sound.playPieceMove();

      if (match.gameType === 'chess') {
        setChessBoard(prev => {
          const next = prev.map(row => [...row]);
          // Simulate simple piece shift
          const r1 = Math.floor(Math.random() * 8);
          const c1 = Math.floor(Math.random() * 8);
          const r2 = Math.floor(Math.random() * 8);
          const c2 = Math.floor(Math.random() * 8);
          if (next[r1][c1]) {
            next[r2][c2] = next[r1][c1];
            next[r1][c1] = null;
          }
          return next;
        });
        const chessMoves = [
          'Nf3 · Knight attacks center',
          'Bxf7+ · King checks!',
          'O-O · Castling safe corner',
          'Qd4 · Central Queen pressure',
          'Rfe1 · Rook controls open file'
        ];
        setRecentMoveText(chessMoves[Math.floor(Math.random() * chessMoves.length)]);
      } else if (match.gameType === 'dam') {
        setDamBoard(prev => {
          const next = prev.map(row => [...row]);
          const r1 = Math.floor(Math.random() * 8);
          const c1 = Math.floor(Math.random() * 8);
          const r2 = Math.floor(Math.random() * 8);
          const c2 = Math.floor(Math.random() * 8);
          if ((r2 + c2) % 2 === 1 && next[r1][c1]) {
            next[r2][c2] = next[r1][c1];
            next[r1][c1] = null;
          }
          return next;
        });
        const damMoves = [
          'Diagonal jump +1 piece captured!',
          'Red Checker advances toward King row',
          'Crown crowned! King strikes back',
          'Double jump trap executed!'
        ];
        setRecentMoveText(damMoves[Math.floor(Math.random() * damMoves.length)]);
      }

      setSpectatorCount(prev => Math.max(10, prev + Math.floor(Math.random() * 5) - 2));
    }, 2200);

    return () => clearInterval(moveTimer);
  }, [match.gameType]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              LIVE ARENA · {match.gameType.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-red-400 font-mono">
              <Eye className="w-3.5 h-3.5" />
              <span>{spectatorCount}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Players Banner */}
        <div className="flex items-center justify-between py-3 px-2">
          <div className="flex items-center gap-2">
            <img src={match.player1.avatar} alt="P1" className="w-9 h-9 rounded-full border border-slate-700" />
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{match.player1.name}</span>
                {match.player1.isVerified && <span className="text-blue-400 text-xs">✓</span>}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Elo {match.player1.rating}</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs font-black text-red-500 font-mono">VS</div>
            <div className="text-xs font-mono font-bold text-slate-300">{match.score1} - {match.score2}</div>
          </div>

          <div className="flex items-center gap-2 text-right">
            <div>
              <div className="text-xs font-bold text-white flex items-center justify-end gap-1">
                <span>{match.player2.name}</span>
                {match.player2.isVerified && <span className="text-blue-400 text-xs">✓</span>}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">Elo {match.player2.rating}</div>
            </div>
            <img src={match.player2.avatar} alt="P2" className="w-9 h-9 rounded-full border border-slate-700" />
          </div>
        </div>

        {/* Live Active Board View */}
        <div className="flex-1 flex flex-col items-center justify-center py-2">
          {match.gameType === 'chess' && (
            <div className="w-full max-w-[340px] aspect-square grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl">
              {chessBoard.map((row, r) =>
                row.map((piece, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`w-full h-full flex items-center justify-center text-2xl select-none ${
                      (r + c) % 2 === 0 ? 'bg-[#e2d6b5] text-slate-950' : 'bg-[#b88b4a] text-slate-950'
                    }`}
                  >
                    {piece && (
                      <span className={piece.startsWith('w') ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' : 'text-slate-950'}>
                        {CHESS_UNICODE[piece] || ''}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {match.gameType === 'dam' && (
            <div className="w-full max-w-[340px] aspect-square grid grid-cols-8 grid-rows-8 rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl">
              {damBoard.map((row, r) =>
                row.map((piece, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={`w-full h-full flex items-center justify-center ${
                      (r + c) % 2 === 1 ? 'bg-amber-950/80' : 'bg-amber-100/90'
                    }`}
                  >
                    {piece && (
                      <div
                        className={`w-7 h-7 rounded-full shadow border-2 ${
                          piece === 'red' ? 'bg-red-600 border-red-300' : 'bg-slate-900 border-slate-600'
                        }`}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {match.gameType === 'ludo' && (
            <div className="w-full max-w-[340px] aspect-square bg-slate-950 rounded-xl border-2 border-slate-700 p-3 flex flex-col items-center justify-center text-center">
              <Crown className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
              <div className="text-xs font-bold text-white">4-Player Grand Ludo Track Race</div>
              <div className="text-[11px] text-slate-400 mt-1">
                Tokens racing along the ⬜⬜ track into the central home!
              </div>
            </div>
          )}
        </div>

        {/* Live Move Commentary ticker */}
        <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-400 flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {recentMoveText}
          </span>
          <span className="text-slate-500 text-[10px] shrink-0">Live Move</span>
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
        >
          {lang === 'si' ? 'ඉවත් වන්න (Close)' : 'Close Spectator'}
        </button>
      </div>
    </div>
  );
};
