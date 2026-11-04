import React from 'react';
import { Gamepad2, Radio, Bot, Music2, User, Settings as SettingsIcon } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { TabType } from '../types';
import { sound } from '../utils/sound';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, settings, incomingInvite } = useGame();
  const lang = settings.language;

  const tabs: Array<{ id: TabType; label: { en: string; si: string }; icon: React.FC<{ className?: string }>; badge?: boolean }> = [
    { id: 'games', label: { en: 'Games', si: 'ගේම්ස්' }, icon: Gamepad2 },
    { id: 'live', label: { en: 'Live', si: 'ලයිව්' }, icon: Radio, badge: Boolean(incomingInvite) },
    { id: 'music', label: { en: 'Music', si: 'මියුසික්' }, icon: Music2 },
    { id: 'ai', label: { en: 'AI Bot', si: 'AI බොට්' }, icon: Bot },
    { id: 'profile', label: { en: 'Profile', si: 'පැතිකඩ' }, icon: User },
    { id: 'settings', label: { en: 'Settings', si: 'සැකසුම්' }, icon: SettingsIcon },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    sound.playClick();
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-lg pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around px-1 py-1.5">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div
                className={`relative px-3 py-1 rounded-full transition-all ${
                  isActive ? 'bg-emerald-500/15' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute top-0 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-slate-950 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[54px]">
                {tab.label[lang]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
