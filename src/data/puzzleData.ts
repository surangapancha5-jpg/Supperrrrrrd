export interface PuzzleItem {
  id: number;
  title: { en: string; si: string };
  category: 'vehicle' | 'house' | 'people' | 'animal' | 'nature' | 'monument';
  gridSize: 2 | 3 | 4; // 2x2=4 pieces, 3x3=9 pieces, 4x4=16 pieces
  primaryColor: string;
  accentColor: string;
  iconSymbol: string;
  imageUrl: string;
  location: { en: string; si: string };
}

// 30 Diverse Real Subjects cycling systematically across 500 levels
const BASE_PUZZLE_ITEMS = [
  {
    title: { en: 'Lamborghini Aventador', si: 'ලැම්බෝගිනි සුපිරි මෝටර් රථය' },
    category: 'vehicle',
    icon: '🏎️',
    primaryColor: '#eab308',
    accentColor: '#ca8a04',
    location: { en: 'Sant’Agata Bolognese, Italy', si: 'ඉතාලිය' },
    imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Modern Luxury Villa', si: 'නවීන සුඛෝපභෝගී නිවස' },
    category: 'house',
    icon: '🏡',
    primaryColor: '#0284c7',
    accentColor: '#0369a1',
    location: { en: 'Beverly Hills, California', si: 'කැලිෆෝනියාව' },
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Portrait of Traditional Elder', si: 'ගෞරවනීය මිනිස් රුව' },
    category: 'people',
    icon: '👤',
    primaryColor: '#d97706',
    accentColor: '#78350f',
    location: { en: 'Kandy, Sri Lanka', si: 'මහනුවර, ශ්‍රී ලංකාව' },
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Sri Lankan Royal Leopard', si: 'ශ්‍රී ලංකා කොටියා / දිවියා' },
    category: 'animal',
    icon: '🐆',
    primaryColor: '#ea580c',
    accentColor: '#9a3412',
    location: { en: 'Yala National Park', si: 'යාල ජාතික වනෝද්‍යානය' },
    imageUrl: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Cyberpunk Hypercar', si: 'අනාගත සුපිරි රථය' },
    category: 'vehicle',
    icon: '🚗',
    primaryColor: '#a855f7',
    accentColor: '#7e22ce',
    location: { en: 'Tokyo Motor Show', si: 'ටෝකියෝ' },
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Sigiriya Rock Fortress', si: 'සීගිරිය පර්වත මාලිගය' },
    category: 'monument',
    icon: '🏰',
    primaryColor: '#ca8a04',
    accentColor: '#854d0e',
    location: { en: 'Sigiriya, Sri Lanka', si: 'සීගිරිය, ශ්‍රී ලංකාව' },
    imageUrl: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Asian Wild Tusker Elephant', si: 'ආසියානු තේජාන්විත ඇතා' },
    category: 'animal',
    icon: '🐘',
    primaryColor: '#64748b',
    accentColor: '#334155',
    location: { en: 'Minneriya National Park', si: 'මින්නේරිය' },
    imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Futuristic Eco Mansion', si: 'පරිසර හිතකාමී මන්දිරය' },
    category: 'house',
    icon: '🏠',
    primaryColor: '#10b981',
    accentColor: '#047857',
    location: { en: 'Zurich, Switzerland', si: 'ස්විට්සර්ලන්තය' },
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Portrait of Smiling Athlete', si: 'ක්‍රීඩාශීලී තරුණ රුව' },
    category: 'people',
    icon: '🏃‍♂️',
    primaryColor: '#ef4444',
    accentColor: '#991b1b',
    location: { en: 'Olympic Training Village', si: 'ඔලිම්පික් පුහුණු ගම්මානය' },
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Ducati Superbike', si: 'ඩුකාටි සුපිරි යතුරුපැදිය' },
    category: 'vehicle',
    icon: '🏍️',
    primaryColor: '#dc2626',
    accentColor: '#7f1d1d',
    location: { en: 'Mugello Circuit', si: 'මුගෙල්ලෝ ධාවන පථය' },
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Alpine Mountain Lodge', si: 'හිම කඳුකර ලී නිවස' },
    category: 'house',
    icon: '🛖',
    primaryColor: '#78350f',
    accentColor: '#451a03',
    location: { en: 'Tyrol, Austrian Alps', si: 'ඔස්ට්‍රියාව' },
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: { en: 'Majestic Bengal Tiger', si: 'බෙංගාල මහා කොටියා' },
    category: 'animal',
    icon: '🐅',
    primaryColor: '#f97316',
    accentColor: '#9a3412',
    location: { en: 'Ranthambore Forest', si: 'ඉන්දියාව' },
    imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&auto=format&fit=crop&q=80'
  }
];

export function getPuzzleForLevel(level: number): PuzzleItem {
  const safeLevel = Math.max(1, Math.min(500, level));
  const baseIdx = (safeLevel - 1) % BASE_PUZZLE_ITEMS.length;
  const base = BASE_PUZZLE_ITEMS[baseIdx];
  const iteration = Math.floor((safeLevel - 1) / BASE_PUZZLE_ITEMS.length) + 1;

  // Grid size progression: Level 1-50 -> 2x2, 51-200 -> 3x3, 201-500 -> 4x4
  let gridSize: 2 | 3 | 4 = 2;
  if (safeLevel > 200) {
    gridSize = 4;
  } else if (safeLevel > 50) {
    gridSize = 3;
  }

  const suffix = iteration > 1 ? ` (Stage ${iteration})` : '';
  const suffixSi = iteration > 1 ? ` (අදියර ${iteration})` : '';

  return {
    id: safeLevel,
    title: {
      en: `${base.title.en}${suffix}`,
      si: `${base.title.si}${suffixSi}`
    },
    category: base.category as PuzzleItem['category'],
    gridSize,
    primaryColor: base.primaryColor,
    accentColor: base.accentColor,
    iconSymbol: base.icon,
    imageUrl: base.imageUrl,
    location: base.location
  };
}
