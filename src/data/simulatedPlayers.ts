import { SimulatedPlayer, SimulatedMatch } from '../types';

export const SIMULATED_PLAYERS: SimulatedPlayer[] = [
  {
    id: 'p1',
    name: 'Kavidu_LK',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kavidu',
    rating: 1845,
    isVerified: true,
    status: 'in_game',
    favoriteGame: 'chess',
    country: 'LK'
  },
  {
    id: 'p2',
    name: 'Kalpana_Pro',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kalpana',
    rating: 1910,
    isVerified: true,
    status: 'in_game',
    favoriteGame: 'chess',
    country: 'LK'
  },
  {
    id: 'p3',
    name: 'Dilshan_99',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dilshan',
    rating: 1720,
    isVerified: false,
    status: 'online',
    favoriteGame: 'dam',
    country: 'LK'
  },
  {
    id: 'p4',
    name: 'Sachintha_GM',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sachintha',
    rating: 2040,
    isVerified: true,
    status: 'online',
    favoriteGame: 'chess',
    country: 'LK'
  },
  {
    id: 'p5',
    name: 'Nimesh_King',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nimesh',
    rating: 1650,
    isVerified: false,
    status: 'online',
    favoriteGame: 'ludo',
    country: 'LK'
  },
  {
    id: 'p6',
    name: 'Sanduni_LK',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sanduni',
    rating: 1785,
    isVerified: true,
    status: 'online',
    favoriteGame: 'ludo',
    country: 'LK'
  },
  {
    id: 'p7',
    name: 'Kasun_DamMaster',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kasun',
    rating: 1890,
    isVerified: true,
    status: 'online',
    favoriteGame: 'dam',
    country: 'LK'
  },
  {
    id: 'p8',
    name: 'Tharindu_Pro',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tharindu',
    rating: 1610,
    isVerified: false,
    status: 'in_lobby',
    favoriteGame: 'ludo',
    country: 'LK'
  },
  {
    id: 'p9',
    name: 'Hasini_Queen',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=hasini',
    rating: 1820,
    isVerified: true,
    status: 'online',
    favoriteGame: 'chess',
    country: 'LK'
  },
  {
    id: 'p10',
    name: 'Ravindu_Apex',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ravindu',
    rating: 1540,
    isVerified: false,
    status: 'online',
    favoriteGame: 'dam',
    country: 'LK'
  }
];

export const INITIAL_SIMULATED_MATCHES: SimulatedMatch[] = [
  {
    id: 'match_chess_1',
    gameType: 'chess',
    player1: SIMULATED_PLAYERS[0], // Kavidu
    player2: SIMULATED_PLAYERS[1], // Kalpana
    score1: 1,
    score2: 0,
    spectators: 184,
    status: 'live',
    recentMove: 'Nf3 · Knight advances toward center'
  },
  {
    id: 'match_dam_1',
    gameType: 'dam',
    player1: SIMULATED_PLAYERS[2], // Dilshan
    player2: SIMULATED_PLAYERS[6], // Kasun
    score1: 2,
    score2: 2,
    spectators: 92,
    status: 'live',
    recentMove: 'Double Jump! Red crowned King'
  },
  {
    id: 'match_ludo_1',
    gameType: 'ludo',
    player1: SIMULATED_PLAYERS[4], // Nimesh
    player2: SIMULATED_PLAYERS[5], // Sanduni
    score1: 3,
    score2: 2,
    spectators: 247,
    status: 'live',
    recentMove: 'Rolled 6! Token enters final track ⬜'
  }
];
