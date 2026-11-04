import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Upload, Music, Volume2, VolumeX, Disc, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { MusicTrack } from '../types';
import { sound } from '../utils/sound';

// Preloaded gaming audio ambient tracks synthesized / audio data
const DEFAULT_PLAYLIST: MusicTrack[] = [
  {
    id: 'track_1',
    title: 'Cyber Arena Beats',
    artist: 'Zanta Synthwave',
    duration: 184,
    url: 'https://actions.google.com/sounds/v1/science_fiction/alien_hum.ogg'
  },
  {
    id: 'track_2',
    title: 'Grandmaster Chess Focus',
    artist: 'Chill Lo-Fi Gaming',
    duration: 210,
    url: 'https://actions.google.com/sounds/v1/science_fiction/space_engine_low.ogg'
  },
  {
    id: 'track_3',
    title: 'Ludo Victory Fanfare Theme',
    artist: 'Retro Arcade Pulse',
    duration: 165,
    url: 'https://actions.google.com/sounds/v1/cartoon/metal_twang.ogg'
  }
];

export const MusicView: React.FC = () => {
  const { settings } = useGame();
  const lang = settings.language;

  const [playlist, setPlaylist] = useState<MusicTrack[]>(DEFAULT_PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentTrackIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    sound.playClick();
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    sound.playClick();
  };

  const handleNext = () => {
    sound.playClick();
    setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
  };

  const handleBack = () => {
    sound.playClick();
    setCurrentTrackIndex(prev => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  // Upload custom MP3 file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);

    const newTrack: MusicTrack = {
      id: `uploaded_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'My Uploaded Track',
      duration: 180,
      url: objectUrl,
      isUserUploaded: true
    };

    setPlaylist(prev => [newTrack, ...prev]);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    sound.playVictory();
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-2xl mx-auto space-y-4">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        muted={isMuted}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*, .mp3, .wav, .m4a"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Music Player Hero Card */}
      <div className={`p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden ${
        settings.rgbEnabled ? 'rgb-border' : ''
      }`}>
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {lang === 'si' ? 'Zanta සංගීත වාදකය' : 'Zanta Music Studio'}
            </span>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{lang === 'si' ? 'Upload Music (MP3)' : 'Upload MP3'}</span>
          </button>
        </div>

        {/* Vinyl Disc / Visualizer Centerpiece */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative w-36 h-36 rounded-full bg-slate-950 border-4 border-slate-800 shadow-2xl flex items-center justify-center">
            <Disc className={`w-28 h-28 text-slate-700 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-white flex items-center justify-center text-white shadow-md">
              <Music className="w-5 h-5" />
            </div>
          </div>

          <h2 className="text-base font-bold text-white mt-4 text-center truncate max-w-xs">
            {currentTrack.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentTrack.artist}
          </p>
        </div>

        {/* Animated Audio Rhythm Patterns / Waveform Visualizer ("රටා යන්න ඕන") */}
        <div className="flex items-end justify-center gap-1 h-12 my-3 px-4">
          {Array.from({ length: 28 }).map((_, i) => {
            const randomHeight = isPlaying ? Math.min(100, Math.max(15, (Math.sin(i * 0.5 + currentTime * 3) + 1) * 45)) : 10;
            return (
              <div
                key={i}
                style={{
                  height: `${randomHeight}%`,
                  transition: 'height 150ms ease'
                }}
                className={`w-1 rounded-full ${
                  i % 3 === 0
                    ? 'bg-emerald-400'
                    : i % 2 === 0
                    ? 'bg-purple-400'
                    : 'bg-cyan-400'
                } opacity-80`}
              />
            );
          })}
        </div>

        {/* Progress Scrubber */}
        <div className="mt-2 space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>{formatSeconds(currentTime)}</span>
            <span>{formatSeconds(duration)}</span>
          </div>
        </div>

        {/* Playback Controls (Back, Play/Pause, Stop, Next) */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shadow active:scale-95"
            title="Previous Track"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Play / Pause button */}
          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xl shadow-emerald-600/30 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          {/* Stop button */}
          <button
            onClick={handleStop}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shadow active:scale-95"
            title="Stop"
          >
            <Square className="w-5 h-5 fill-current" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors shadow active:scale-95"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Playlist Tray */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
          <span>{lang === 'si' ? 'වාදන ලැයිස්තුව (Playlist)' : 'Music Tracks'}</span>
          <span className="text-[10px] text-slate-500 font-mono">{playlist.length} Tracks</span>
        </h3>

        <div className="divide-y divide-slate-800/80">
          {playlist.map((track, idx) => {
            const isCurrent = idx === currentTrackIndex;

            return (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                  sound.playClick();
                }}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                  isCurrent ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                    isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="truncate">
                    <div className="text-xs truncate">{track.title}</div>
                    <div className="text-[10px] text-slate-500">{track.artist}</div>
                  </div>
                </div>

                {isCurrent && isPlaying && (
                  <span className="text-[10px] font-mono text-emerald-400 animate-pulse">
                    PLAYING
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
