import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Trash2, HelpCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { queryAiKnowledgeBase, AI_KNOWLEDGE_ENTRIES } from '../data/aiKnowledgeBase';
import { sound } from '../utils/sound';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const AiBotView: React.FC = () => {
  const { profile, settings } = useGame();
  const lang = settings.language;

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg_welcome',
      sender: 'bot',
      text: lang === 'si'
        ? `ආයුබෝවන් ${profile.name}! මම Zanta AI Program Bot. මගේ පද්ධතිය තුළ ඇප් එකේ ඇති විශාල දාම්, විශාල චෙස්, කොටු සහිත ලූඩෝ (⬜⬜⬜⬜), ලෙවල් 400ක සත්තු ප්‍රහේලිකාව, ලෙවල් 500ක පාට කුප්පි, ලෙවල් 1000ක මතක ක්‍රීඩා, verified බැජ් (200k), කාසි ක්‍රමය (1k, 100k, 1m), ලයිව් මැච් සහ සැකසුම් ඇතුළු වචන 300කට වැඩි දැනුමක් ප්‍රෝග්‍රෑම් කර ඇත. ඕනෑම දෙයක් මාගෙන් විමසන්න!`
        : `Hello ${profile.name}! I am Zanta AI Program Bot. I am programmed with over 300+ words and comprehensive knowledge covering Big Dam, Big Chess, Checkered-track Ludo (⬜⬜⬜⬜), 400-level Animal Puzzle, 500-level Water Sort, 1000-level Memory Matrix, 200k Verified Badge, Currency formatting, and Live Match simulations. Ask me anything!`,
      timestamp: 'Now'
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { en: 'How to play Big Dam?', si: 'දාම් අදින්නෙ කොහොමද?' },
    { en: 'What are Chess rules & Castling?', si: 'චෙස් නීති සහ කාස්ලින් මොනවාද?' },
    { en: 'Explain Ludo track squares ⬜', si: 'ලූඩෝ බෝඩ් එකෙ කොටු පාර ⬜' },
    { en: 'How to buy Verified Badge for 200k?', si: 'verified බැජ් එක 200k වලට ගන්නෙ කොහොමද?' },
    { en: 'Animal Puzzle 400 levels guide', si: 'සත්තු ප්‍රහේලිකාවෙ ලෙවල් 400' },
    { en: 'Water Sort 500 levels strategy', si: 'පාට කුප්පි ලෙවල් 500 විසඳුම්' },
    { en: 'How are coins formatted (1k, 100k, 1m)?', si: 'සල්ලි 1k, 100k, 1m පෙන්වන්නේ කෙසේද?' },
    { en: 'How do Live Matches & Invites work?', si: 'ලයිව් මැච් සහ ඉන්වයිට් වැඩ කරන්නෙ කොහොමද?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend = inputValue) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    sound.playClick();

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Query 300+ knowledge dictionary
    setTimeout(() => {
      const match = queryAiKnowledgeBase(trimmed, lang);

      let botResponse = '';
      if (match) {
        botResponse = match.answer;
      } else {
        // Fallback response synthesizing knowledge
        botResponse = lang === 'si'
          ? `ඔබ ඇසූ ප්‍රශ්නයට අදාළ තොරතුරු: ඇප් එකේ දාම් (Checkers), චෙස් (Chess), ලූඩෝ (Ludo with ⬜ path), සත්තු 400ක ප්‍රහේලිකාව, කුප්පි 500ක වතුර වර්ගීකරණය, මතක ක්‍රීඩා ලෙවල් 1000, කොයින් 200,000 කින් Verified VIP බැජ් එක මිලදී ගැනීම සහ WhatsApp Style Settings පිළිබඳව මගේ පද්ධතියේ සම්පූර්ණ තොරතුරු ගබඩා කර ඇත. කරුණාකර නිශ්චිත ක්‍රීඩාවක් හෝ අංගයක් ගැන විමසන්න!`
          : `Information regarding your query: Zanta Play Arena includes Big Dam, Big Chess, Checkered-track Ludo (⬜⬜⬜⬜), 400-level Animal Slices, 500-level Water Sort, 1000-level Memory Matrix, 200k Verified Badge, and WhatsApp Style Settings. Please ask about any specific game or feature!`;
      }

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      sound.playNotification();
    }, 600);
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
    sound.playClick();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-68px)] max-w-2xl mx-auto px-4 pb-2">
      {/* Bot Header */}
      <div className={`mt-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-lg ${
        settings.rgbEnabled ? 'rgb-border' : ''
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white">Zanta AI Program Bot</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                300+ Words
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'si' ? 'ඇප් එකේ සියලු දේ ගැන දන්නා සහායකයා' : 'Knowledgeable about all games & rules'}
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none shrink-0">
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip[lang])}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 hover:border-emerald-500 text-xs text-slate-300 hover:text-emerald-400 transition-colors font-medium shrink-0 shadow-sm"
          >
            {chip[lang]}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-2">
        {messages.map(msg => {
          const isBot = msg.sender === 'bot';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                  isBot
                    ? 'bg-slate-900 border border-slate-800 text-slate-200'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                <div className="text-xs leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
                <div className={`text-[10px] mt-1 text-right font-mono ${isBot ? 'text-slate-500' : 'text-emerald-200'}`}>
                  {msg.timestamp}
                </div>
              </div>

              {!isBot && (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-8 h-8 rounded-full border border-emerald-500 bg-slate-800 shrink-0 mt-0.5"
                />
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{lang === 'si' ? 'AI බොට් ටයිප් කරමින්...' : 'AI Bot is typing...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Box */}
      <div className="pt-2">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 focus-within:border-emerald-500 transition-colors shadow-lg"
        >
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={
              lang === 'si'
                ? 'දාම්, චෙස්, ලූඩෝ, verified බැජ්, ලෙවල් ගැන අසන්න...'
                : 'Ask about Dam, Chess, Ludo, 200k badge, rules...'
            }
            className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
