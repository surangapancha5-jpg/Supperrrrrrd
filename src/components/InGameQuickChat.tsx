import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface InGameQuickChatProps {
  opponentName: string;
  lang: 'si' | 'en';
}

export const InGameQuickChat: React.FC<InGameQuickChatProps> = ({ opponentName, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBubble, setActiveBubble] = useState<{ sender: 'you' | 'opp'; text: string } | null>(null);

  const QUICK_PHRASES = [
    { en: 'Good luck! 🍀', si: 'Good luck bro! 🍀' },
    { en: 'Nice move! 🔥', si: 'හොඳ මූව් එකක්! 🔥' },
    { en: 'Oops, my bad! 😅', si: 'අයියෝ වැරදුනා! 😅' },
    { en: 'Thinking carefully... 🤔', si: 'ටිකක් කල්පනා කරනවා... 🤔' },
    { en: 'Great game! 🤝', si: 'පට්ට ගේම් එක! 🤝' },
    { en: 'Checkmate soon! ♟️', si: 'පරිස්සමෙන් ඉත්තාට! ♟️' }
  ];

  const handleSendPhrase = (phrase: string) => {
    sound.playClick();
    setActiveBubble({ sender: 'you', text: phrase });
    setIsOpen(false);

    // Realistic bot response after 1.5 - 2.5 seconds
    setTimeout(() => {
      const responses = [
        lang === 'si' ? 'Thanks bro! බලමුකො... 🔥' : 'Thanks! Let’s see this... 🔥',
        lang === 'si' ? 'ඔව් හොඳ මැච් එකක්! 🤝' : 'Yeah, intense match! 🤝',
        lang === 'si' ? 'හොඳ උත්සාහයක්! 👍' : 'Good effort! 👍',
        lang === 'si' ? 'Haha nice! 😄' : 'Haha nice! 😄',
        lang === 'si' ? 'පරිස්සමෙන්! 👀' : 'Watch out! 👀'
      ];
      const botReply = responses[Math.floor(Math.random() * responses.length)];
      setActiveBubble({ sender: 'opp', text: botReply });
      sound.playNotification();

      setTimeout(() => {
        setActiveBubble(null);
      }, 4000);
    }, 1800);
  };

  return (
    <div className="relative">
      {/* Floating Chat Bubble Indicator */}
      {activeBubble && (
        <div
          className={`absolute bottom-12 z-30 px-3.5 py-1.5 rounded-2xl shadow-xl text-xs font-semibold animate-bounce backdrop-blur-md ${
            activeBubble.sender === 'you'
              ? 'right-0 bg-emerald-600 text-white border border-emerald-400'
              : 'left-0 bg-slate-800 text-white border border-slate-700'
          }`}
        >
          <span className="text-[10px] opacity-75 mr-1 block text-slate-300">
            {activeBubble.sender === 'you' ? 'You:' : `${opponentName}:`}
          </span>
          {activeBubble.text}
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-xs"
        title="Quick Chat"
      >
        <MessageSquare className="w-4 h-4 text-emerald-400" />
        <span className="hidden sm:inline">{lang === 'si' ? 'මැසේජ්' : 'Chat'}</span>
      </button>

      {/* Quick Phrases Menu */}
      {isOpen && (
        <div className="absolute bottom-11 right-0 w-52 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-40 space-y-1 animate-scale-in">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            {lang === 'si' ? 'ක්ෂණික මැසේජ් යවන්න:' : 'Quick In-Game Messages:'}
          </div>
          {QUICK_PHRASES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPhrase(item[lang])}
              className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200 transition-colors truncate"
            >
              {item[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
