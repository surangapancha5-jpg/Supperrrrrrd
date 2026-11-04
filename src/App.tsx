import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { BottomNav } from './components/BottomNav';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import { InviteNotificationToast } from './components/InviteNotificationToast';
import { OutboundInviteModal } from './components/OutboundInviteModal';

// Views
import { GamesView } from './views/GamesView';
import { LiveMatchesView } from './views/LiveMatchesView';
import { MusicView } from './views/MusicView';
import { AiBotView } from './views/AiBotView';
import { ProfileView } from './views/ProfileView';
import { SettingsView } from './views/SettingsView';

// Games
import { DamGame } from './games/DamGame';
import { ChessGame } from './games/ChessGame';
import { LudoGame } from './games/LudoGame';
import { PicturePuzzleGame } from './games/PicturePuzzleGame';
import { WaterSortGame } from './games/WaterSortGame';
import { MemoryGame } from './games/MemoryGame';

const MainContent: React.FC = () => {
  const { selectedGame, activeTab } = useGame();

  // If a game is currently open, display the full game view
  if (selectedGame) {
    switch (selectedGame) {
      case 'dam':
        return <DamGame />;
      case 'chess':
        return <ChessGame />;
      case 'ludo':
        return <LudoGame />;
      case 'animal_puzzle':
        return <PicturePuzzleGame />;
      case 'water_sort':
        return <WaterSortGame />;
      case 'memory':
        return <MemoryGame />;
      default:
        return <GamesView />;
    }
  }

  // Otherwise display the active tab
  const renderTab = () => {
    switch (activeTab) {
      case 'games':
        return <GamesView />;
      case 'live':
        return <LiveMatchesView />;
      case 'music':
        return <MusicView />;
      case 'ai':
        return <AiBotView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <GamesView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <main className="flex-1 w-full">
        {renderTab()}
      </main>
      <BottomNav />
      <DailyMissionsModal />
      <InviteNotificationToast />
      <OutboundInviteModal />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
}
