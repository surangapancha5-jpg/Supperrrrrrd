import React, { useState } from 'react';
import {
  User,
  Shield,
  Volume2,
  VolumeX,
  Palette,
  Globe,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
  BookOpen,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GAME_STRATEGY_TIPS } from '../data/strategyTips';
import { formatCoins } from '../utils/formatters';
import { sound } from '../utils/sound';

export const SettingsView: React.FC = () => {
  const { profile, settings, updateSettings, setActiveTab, submitFeedback } = useGame();
  const lang = settings.language;

  const [activeStrategyGame, setActiveStrategyGame] = useState<string | null>(null);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackStatus, setFeedbackStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const OFFICIAL_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb9BOMaF1YlUqQNgPp3W';
  const OWNER_WHATSAPP_URL = 'https://wa.me/94760879639';

  const toggleLanguage = () => {
    updateSettings({ language: settings.language === 'si' ? 'en' : 'si' });
    sound.playClick();
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
    sound.playClick();
  };

  const toggleRgb = () => {
    updateSettings({ rgbEnabled: !settings.rgbEnabled });
    sound.playClick();
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
    sound.playClick();
  };

  const handleOpenChannel = () => {
    sound.playClick();
    window.open(OFFICIAL_CHANNEL_URL, '_blank', 'noopener,noreferrer');
  };

  const handleOpenOwnerWhatsapp = () => {
    sound.playClick();
    window.open(OWNER_WHATSAPP_URL, '_blank', 'noopener,noreferrer');
  };

  const wordCount = feedbackText.trim().split(/\s+/).filter(Boolean).length;

  const handleSendFeedback = () => {
    const res = submitFeedback(feedbackText);
    if (res.success) {
      setFeedbackStatus({
        success: true,
        msg: lang === 'si'
          ? 'ඔබගේ Feedback එක සාර්ථකව යවන ලදී (කාසි 50ක් කැපුනි). ස්තූතියි!'
          : 'Feedback submitted successfully (50 coins fee deducted). Thank you!'
      });
      setFeedbackText('');
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackStatus(null);
      }, 2500);
    } else {
      setFeedbackStatus({
        success: false,
        msg: res.error || 'Failed to submit.'
      });
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 max-w-2xl mx-auto space-y-4">
      {/* WhatsApp Style Profile Banner */}
      <div
        onClick={() => {
          setActiveTab('profile');
          sound.playClick();
        }}
        className={`p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between shadow-lg ${
          settings.rgbEnabled ? 'rgb-border' : ''
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-14 h-14 rounded-full border-2 border-emerald-500 bg-slate-800 object-cover shadow"
            />
            {profile.isVerified && (
              <span className="absolute -bottom-1 -right-1 text-blue-400 bg-slate-950 rounded-full px-1 text-[11px] font-bold">
                ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-white">{profile.name}</h2>
              {profile.isVerified && (
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded font-mono">
                  VERIFIED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px] sm:max-w-xs">
              {profile.about}
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-500" />
      </div>

      {/* Official WhatsApp Channel Touch Button (Opens specified URL!) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'si' ? 'නිල WhatsApp Channel' : 'Official WhatsApp Channel'}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'si'
                ? 'නවතම ක්‍රීඩා තරඟ හා යාවත්කාලීන සඳහා අපගේ චැනලයට එක්වන්න.'
                : 'Join our official channel for real-time tournament alerts and releases.'}
            </p>
          </div>

          <button
            onClick={handleOpenChannel}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{lang === 'si' ? 'Channel එකට එන්න' : 'Join Channel'}</span>
          </button>
        </div>
      </div>

      {/* Report + Support + Feedback Box Trigger (Costs 50 coins) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">
              {lang === 'si' ? 'Report + Support + Feedback' : 'Report + Support + Feedback'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {lang === 'si' ? 'වචන 350ක් දක්වා ඇතුළත් කළ හැක (ගාස්තුව: කාසි 50)' : 'Submit feedback up to 350 words (Fee: 50 coins)'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFeedbackModal(true)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-400 transition-colors border border-rose-500/30"
        >
          {lang === 'si' ? 'විවෘත කරන්න' : 'Open'}
        </button>
      </div>

      {/* Visuals & RGB Settings */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 shadow-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {lang === 'si' ? 'දර්ශන සහ ආලෝකකරණය' : 'Visuals & Atmosphere'}
        </div>

        {/* RGB Glow Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{lang === 'si' ? 'පොඩි RGB ආලෝකය (Subtle RGB)' : 'Subtle RGB Border Glow'}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'si' ? 'පුවරු වටා සුමට RGB නියෝන් ආලෝකය පෙන්වීම' : 'Animated neon edge glow'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.rgbEnabled}
              onChange={toggleRgb}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
          </label>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {lang === 'si' ? 'තේමාව (Theme)' : 'Theme'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
          >
            {settings.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        {/* Language Selection */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {lang === 'si' ? 'භාෂාව (Language)' : 'Language'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'si' ? 'සිංහල (Sinhala)' : 'English'}
              </p>
            </div>
          </div>

          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 font-bold transition-colors"
          >
            {lang === 'si' ? 'සිංහල' : 'English'}
          </button>
        </div>
      </div>

      {/* Sound & Controls */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 shadow-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {lang === 'si' ? 'ශබ්ද සහ ක්‍රීඩා පාලන' : 'Audio & Engine'}
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {lang === 'si' ? 'ක්‍රීඩා ශබ්ද ප්‍රයෝග' : 'Sound Effects'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {lang === 'si' ? 'ඉත්තන් ඇදීම, දාදු කැට, ජයග්‍රාහී නාද' : 'Moves, dice, and victory chimes'}
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={toggleSound}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>
      </div>

      {/* Game Strategy Tips Section */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 shadow-lg overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'si' ? 'ක්‍රීඩා උපක්‍රම හා උපදෙස් (Game Strategy Tips)' : 'Game Strategy Tips'}</span>
          </div>
          <span className="text-[10px] text-slate-500">6 Guides</span>
        </div>

        <div className="p-4 space-y-3">
          {GAME_STRATEGY_TIPS.map(tipCategory => {
            const isExpanded = activeStrategyGame === tipCategory.gameId;

            return (
              <div
                key={tipCategory.gameId}
                className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden"
              >
                <button
                  onClick={() => {
                    setActiveStrategyGame(isExpanded ? null : tipCategory.gameId);
                    sound.playClick();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {tipCategory.title[lang]}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {tipCategory.category[lang]}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="p-3 border-t border-slate-800 space-y-2.5 animate-fade-in bg-slate-900/60">
                    {tipCategory.tips.map((tip, i) => (
                      <div key={i} className="text-xs">
                        <div className="font-bold text-amber-300 flex items-center gap-1.5">
                          <span>💡</span>
                          <span>{tip.heading[lang]}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                            {tip.difficulty}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed pl-4">
                          {tip.content[lang]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* App About Section Trigger */}
      <div
        onClick={() => {
          setShowAboutModal(true);
          sound.playClick();
        }}
        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {lang === 'si' ? 'ඇප් එක ගැන විස්තර (App About)' : 'About Zanta Play Arena'}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Owner: Suranga chamith · Official WhatsApp: +94760879639
            </p>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-slate-500" />
      </div>

      {/* Report + Support + Feedback Modal (Max 350 words, 50 coins cost) */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-400" />
              <span>{lang === 'si' ? 'Report + Support + Feedback' : 'Report + Support + Feedback'}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {lang === 'si'
                ? 'ඔබගේ ගැටළු, අදහස් මෙහි සටහන් කරන්න (උපරිම වචන 350). ගාස්තුව: කාසි 50 🪙'
                : 'Share issues or feedback (maximum 350 words). Fee: 50 coins 🪙'}
            </p>

            <textarea
              rows={6}
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder={lang === 'si' ? 'ඔබගේ ගැටලුව හෝ ප්‍රතිපෝෂණය මෙහි ලියන්න...' : 'Write your report, support query or feedback here...'}
              className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 mb-4">
              <span>{lang === 'si' ? 'ශේෂය:' : 'Balance:'} {formatCoins(profile.coins)}</span>
              <span className={wordCount > 350 ? 'text-red-400 font-bold' : 'text-slate-400'}>
                {wordCount} / 350 {lang === 'si' ? 'වචන' : 'words'}
              </span>
            </div>

            {feedbackStatus && (
              <div className={`p-2.5 rounded-xl text-xs mb-3 font-medium ${
                feedbackStatus.success ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {feedbackStatus.msg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedbackStatus(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {lang === 'si' ? 'අවලංගු' : 'Cancel'}
              </button>
              <button
                onClick={handleSendFeedback}
                disabled={wordCount === 0 || wordCount > 350 || profile.coins < 50}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs shadow"
              >
                {lang === 'si' ? 'යවන්න (කාසි 50)' : 'Submit (50 Coins)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Large Gorgeous App About Modal with Owner Details */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 text-3xl">
              🎮
            </div>

            <h2 className="text-xl font-black text-center text-white tracking-tight">
              Zanta Play Arena
            </h2>
            <p className="text-xs text-center text-emerald-400 font-mono mt-0.5">
              Official Gaming & Esports Platform · v4.5.0
            </p>

            {/* Owner & Contact Card */}
            <div className="my-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs text-slate-300">
                <span className="text-slate-500">Owner:</span> <strong className="text-white">Suranga chamith</strong>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span className="text-slate-500">WhatsApp:</span>
                <button
                  onClick={handleOpenOwnerWhatsapp}
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-mono font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  +94760879639
                </button>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span className="text-slate-500">Channel:</span>
                <button
                  onClick={handleOpenChannel}
                  className="text-emerald-400 hover:underline flex items-center gap-1 truncate font-mono text-[11px]"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  whatsapp.com/channel/0029Vb9BOMaF1YlUqQNgPp3W
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
              <h4 className="font-bold text-white">
                {lang === 'si' ? 'ක්‍රීඩා සංයුතිය හා නීති:' : 'Platform Features & Integrity:'}
              </h4>
              <p className="text-slate-400 text-[11px]">
                • <strong>ලූඩෝ (Ludo):</strong> පරිමිතිය වටේට 52-square track එක දිගේ සුමටව ගමන් කරන ඉත්තන් (1v1, 1v2, 1v3).
              </p>
              <p className="text-slate-400 text-[11px]">
                • <strong>ප්‍රහේලිකාව (Picture Puzzle):</strong> වාහන, සුඛෝපභෝගී නිවාස, මිනිස් රූ, සතුන් සහිත ලෙවල් 500ක්.
              </p>
              <p className="text-slate-400 text-[11px]">
                • <strong>පාට කුප්පි (Water Sort):</strong> ලෙවල් 500ක අගුළු සහිත ක්‍රමික ප්‍රගතිය.
              </p>
              <p className="text-slate-400 text-[11px]">
                • <strong>තරඟ ඔට්ටු (Wager):</strong> ජයග්‍රහණයෙන් දෙගුණයක් කාසි දිනාගත හැකි ඔට්ටු ක්‍රමය.
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={handleOpenChannel}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
              >
                {lang === 'si' ? 'Channel එකට පිවිසෙන්න' : 'Open WhatsApp Channel'}
              </button>
              <button
                onClick={() => setShowAboutModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                {lang === 'si' ? 'වසන්න' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
