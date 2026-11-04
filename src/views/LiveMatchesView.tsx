import React, { useState } from 'react';
import { Radio, Users, Swords, Eye, Search, Loader2, Sparkles, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SimulatedPlayer, SimulatedMatch } from '../types';
import { sound } from '../utils/sound';
import { LiveSpectatorBoard } from '../components/LiveSpectatorBoard';

export const LiveMatchesView: React.FC = () => {
  const {
    liveMatches,
    onlinePlayers,
    settings,
    invitePlayer,
    startLiveQueue,
    setSelectedGame,
    startSpectating,
    spectatingMatch,
    stopSpectating
  } = useGame();
  const lang = settings.language;

  const [selectedQueueGame, setSelectedQueueGame] = useState<'chess' | 'ludo' | 'dam'>('chess');
  const [isSearchingQueue, setIsSearchingQueue] = useState(false);
  const [queueTime, setQueueTime] = useState(0);
  const [inviteModalPlayer, setInviteModalPlayer] = useState<SimulatedPlayer | null>(null);

  // Queue matchmaking search
  const handleStartQueue = () => {
    setIsSearchingQueue(true);
    setQueueTime(0);

    const timer = setInterval(() => {
      setQueueTime(prev => prev + 1);
    }, 1000);

    startLiveQueue(selectedQueueGame, opponent => {
      clearInterval(timer);
      setIsSearchingQueue(false);
      setSelectedGame(selectedQueueGame);
    });
  };

  const handleOpenInviteDialog = (player: SimulatedPlayer) => {
    setInviteModalPlayer(player);
    sound.playClick();
  };

  const handleSendInvite = (gameType: 'chess' | 'ludo' | 'dam') => {
    if (!inviteModalPlayer) return;
    invitePlayer(inviteModalPlayer, gameType);
    setInviteModalPlayer(null);
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-2xl mx-auto space-y-5">
      {/* Top Banner */}
      <div className={`p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 shadow-xl ${
        settings.rgbEnabled ? 'rgb-border' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <h1 className="text-base font-bold text-white">
              {lang === 'si' ? 'සජීවී තරඟ (Live Matches Arena)' : 'Live Esports Arena'}
            </h1>
          </div>
          <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            ● 8,420 {lang === 'si' ? 'ක්‍රීඩකයින්' : 'Online'}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'si'
            ? 'චෙස්, ලූඩෝ, සහ දාම් තරඟ සජීවීව නරඹන්න හෝ පෝලිමට එකතුවී 1v1 තරඟ වදින්න.'
            : 'Watch live matches or join the 1v1 ranked queue in Chess, Ludo, and Dam.'}
        </p>
      </div>

      {/* 1v1 Matchmaking Queue Section */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <Swords className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'si' ? '1v1 පෝලිමට එකතු වන්න (Matchmaking)' : 'Join 1v1 Queue'}</span>
        </h2>

        {/* Game Mode Picker for Queue */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {(['chess', 'ludo', 'dam'] as const).map(game => {
            const labels = {
              chess: { en: 'Chess', si: 'චෙස්' },
              ludo: { en: 'Ludo', si: 'ලූඩෝ' },
              dam: { en: 'Dam', si: 'දාම්' }
            };
            const isSelected = selectedQueueGame === game;

            return (
              <button
                key={game}
                onClick={() => {
                  setSelectedQueueGame(game);
                  sound.playClick();
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {labels[game][lang]}
              </button>
            );
          })}
        </div>

        {/* Find Opponent Button */}
        <button
          onClick={handleStartQueue}
          disabled={isSearchingQueue}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
        >
          {isSearchingQueue ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                {lang === 'si' ? `ප්‍රතිවාදියෙකු සොයමින්... (${queueTime}s)` : `Searching opponent... (${queueTime}s)`}
              </span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>
                {lang === 'si'
                  ? `ප්‍රතිවාදියෙකු සොයන්න (${selectedQueueGame.toUpperCase()})`
                  : `Find Ranked Match (${selectedQueueGame.toUpperCase()})`}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Active Live Matches Feed (Kavidu vs Kalpana, etc.) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>{lang === 'si' ? 'ක්‍රියාත්මක ලයිව් මැච් (Live Games)' : 'Live Matches in Progress'}</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Live Sync</span>
        </div>

        {liveMatches.map(match => (
          <div
            key={match.id}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                {match.gameType.toUpperCase()} ARENA
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Eye className="w-3.5 h-3.5 text-red-400" />
                <span>{match.spectators} {lang === 'si' ? 'නරඹයි' : 'watching'}</span>
              </div>
            </div>

            {/* Players Faceoff */}
            <div className="flex items-center justify-between">
              {/* Player 1 */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={match.player1.avatar}
                    alt={match.player1.name}
                    className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
                  />
                  {match.player1.isVerified && (
                    <span className="absolute -bottom-1 -right-1 text-blue-400 bg-slate-950 rounded-full px-1 text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{match.player1.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Elo {match.player1.rating}</div>
                </div>
              </div>

              {/* VS Badge */}
              <div className="text-center px-3">
                <span className="text-xs font-black text-red-500 font-mono">VS</span>
                <div className="text-[11px] font-mono text-slate-300 font-bold">
                  {match.score1} - {match.score2}
                </div>
              </div>

              {/* Player 2 */}
              <div className="flex items-center gap-2.5 text-right">
                <div>
                  <div className="text-xs font-bold text-white">{match.player2.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">Elo {match.player2.rating}</div>
                </div>
                <div className="relative">
                  <img
                    src={match.player2.avatar}
                    alt={match.player2.name}
                    className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
                  />
                  {match.player2.isVerified && (
                    <span className="absolute -bottom-1 -right-1 text-blue-400 bg-slate-950 rounded-full px-1 text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Move Ticker & Spectate button */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-mono truncate max-w-[200px] sm:max-w-xs">
                ⚡ {match.recentMove}
              </div>

              <button
                onClick={() => startSpectating(match)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{lang === 'si' ? 'නරඹන්න' : 'Spectate'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Online Players Box ("Online Users") */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>{lang === 'si' ? 'සබැඳි ක්‍රීඩකයින් (Online Players)' : 'Online Players'}</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">10 Available</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {onlinePlayers.map(player => (
            <div key={player.id} className="py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-9 h-9 rounded-full border border-slate-700 bg-slate-800"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{player.name}</span>
                    {player.isVerified && (
                      <span className="text-[10px] text-blue-400 font-bold" title="Verified VIP">✓</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                    <span>Elo {player.rating}</span>
                    <span>·</span>
                    <span className="capitalize">{player.favoriteGame}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenInviteDialog(player)}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span>{lang === 'si' ? 'ආරාධනා කරන්න' : 'Invite'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Game Picker Modal */}
      {inviteModalPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full shadow-2xl text-center">
            <h3 className="text-sm font-bold text-white mb-1">
              {lang === 'si' ? `${inviteModalPlayer.name} සමඟ ක්‍රීඩා කරන්න` : `Challenge ${inviteModalPlayer.name}`}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {lang === 'si' ? 'තරඟය තෝරන්න:' : 'Select Game:'}
            </p>

            <div className="space-y-2 mb-4">
              <button
                onClick={() => handleSendInvite('chess')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                ♟️ {lang === 'si' ? 'චෙස් (Chess)' : 'Chess'}
              </button>
              <button
                onClick={() => handleSendInvite('dam')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                👑 {lang === 'si' ? 'දාම් (Dam)' : 'Dam'}
              </button>
              <button
                onClick={() => handleSendInvite('ludo')}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                🎲 {lang === 'si' ? 'ලූඩෝ (Ludo)' : 'Ludo'}
              </button>
            </div>

            <button
              onClick={() => setInviteModalPlayer(null)}
              className="text-xs text-slate-400 hover:underline"
            >
              {lang === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Real Live Board Spectator Modal */}
      {spectatingMatch && (
        <LiveSpectatorBoard
          match={spectatingMatch}
          onClose={stopSpectating}
          lang={lang}
        />
      )}
    </div>
  );
};
