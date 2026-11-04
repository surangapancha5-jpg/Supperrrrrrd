export interface GameTip {
  gameId: string;
  title: { en: string; si: string };
  icon: string;
  category: { en: string; si: string };
  tips: Array<{
    heading: { en: string; si: string };
    content: { en: string; si: string };
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }>;
}

export const GAME_STRATEGY_TIPS: GameTip[] = [
  {
    gameId: 'dam',
    title: { en: 'Dam (Checkers) Mastery', si: 'දාම් (Checkers) උපක්‍රම' },
    icon: 'Checkerboard',
    category: { en: 'Board Strategy', si: 'පුවරු උපායමාර්ග' },
    tips: [
      {
        heading: { en: 'Control the Center Squares', si: 'මැද කොටු පාලනය කරන්න' },
        content: {
          en: 'Holding the four center squares (d4, e4, d5, e5 equivalent) restricts your opponent’s mobility and sets up double jump traps.',
          si: 'පුවරුවේ මැද ඇති කොටු පාලනය කිරීමෙන් ප්‍රතිවාදියාගේ ඉත්තන්ගේ ගමන් මාර්ග අවහිර වන අතර ඩබල් ජම්ප් (Double jumps) උගුල් ඇටවිය හැක.'
        },
        difficulty: 'Beginner'
      },
      {
        heading: { en: 'Keep Your Back Row Solid', si: 'පසුපස පේළිය සුරකින්න' },
        content: {
          en: 'Do not move your back-row checkers early. They prevent your opponent from crowning Kings easily.',
          si: 'ක්‍රීඩාව ආරම්භයේදීම පසුපස පේළියේ ඉත්තන් ඉදිරියට අදින්න එපා. ඔවුන් සිටීමෙන් ප්‍රතිවාදියාට රජුන් (Kings) ලබා ගැනීමට නොහැකි වේ.'
        },
        difficulty: 'Intermediate'
      },
      {
        heading: { en: 'The Forced Sacrifice Trick', si: 'බිලිදීමේ උපක්‍රමය (Sacrifice)' },
        content: {
          en: 'Sacrifice 1 checker intentionally so the opponent is forced to jump, landing right into a multi-piece capture line.',
          si: 'ප්‍රතිවාදියාට කැපීමට බලකෙරෙන පරිදි එක් ඉත්තෙක් බිලි දී, අනතුරුව ඔහුගේ ඉත්තන් 2ක් හෝ 3ක් එකවර කැපීමට මාර්ගය විවර කරගන්න.'
        },
        difficulty: 'Advanced'
      }
    ]
  },
  {
    gameId: 'chess',
    title: { en: 'Chess Tactical Guide', si: 'චෙස් (Chess) උපායමාර්ගික මඟපෙන්වීම' },
    icon: 'Crown',
    category: { en: 'Classic Board', si: 'සම්භාව්‍ය පුවරුව' },
    tips: [
      {
        heading: { en: 'Develop Pieces Early', si: 'ඉත්තන් කලින්ම ඉදිරියට ගන්න (Development)' },
        content: {
          en: 'Bring Knights and Bishops into the game before moving the Queen. Knights before Bishops is a golden rule.',
          si: 'රැජින මුලින්ම ඉදිරියට නොගෙන, අශ්වයන් (Knights) සහ බිෂොප්වරුන් (Bishops) මුලින්ම පිටියට ගෙනෙන්න.'
        },
        difficulty: 'Beginner'
      },
      {
        heading: { en: 'Castle Early for King Safety', si: 'රජු ඉක්මනින් ආරක්ෂා කරගන්න (Castling)' },
        content: {
          en: 'Castling tucks your King away into a safe corner and connects your Rooks for coordinated file attacks.',
          si: 'හැකි ඉක්මනින් කාස්ලින් (Castling) කිරීමෙන් රජු ආරක්ෂිත කොනකට යන අතර රූක්වරුන් (Rooks) පහසුවෙන් සම්බන්ධ වේ.'
        },
        difficulty: 'Beginner'
      },
      {
        heading: { en: 'Forks, Pins and Skewers', si: 'ෆෝක් සහ පින් උපක්‍රම' },
        content: {
          en: 'Use Knights for unpredictable forks (attacking two high-value pieces simultaneously) and Bishops/Rooks to pin pieces against the King.',
          si: 'අශ්වයා මඟින් එකවර ප්‍රතිවාදී වටිනා ඉත්තන් දෙදෙනෙකුට පහරදීම (Fork) සහ බිෂොප් මඟින් ඉත්තන් අඩපණ කිරීම (Pin) භාවිතා කරන්න.'
        },
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    gameId: 'ludo',
    title: { en: 'Ludo Pro Tactics', si: 'ලූඩෝ (Ludo) ජයග්‍රාහී ක්‍රම' },
    icon: 'Dice5',
    category: { en: 'Family Strategy', si: 'ප්‍රියතම උපායමාර්ග' },
    tips: [
      {
        heading: { en: 'Spread Your Tokens', si: 'ඉත්තන් සියල්ල එකවර එලියට ගන්න' },
        content: {
          en: 'Never rush only 1 token to home. Bring all 4 tokens out as soon as you roll a 6 to maximize flexibility for any dice roll.',
          si: 'එක් ඉත්තෙක් පමණක් ඉදිරියට ගෙනියන්න එපා. 6 වැටුණු විගස අනෙක් ඉත්තන්ද එලියට ගන්න. එවිට ලැබෙන ඕනෑම ලකුණකට සුදුසු ඉත්තා තෝරාගත හැක.'
        },
        difficulty: 'Beginner'
      },
      {
        heading: { en: 'Camp on Safe Star Squares', si: 'තරු ලකුණු ඇති සුරක්ෂිත කොටු (Safe Zones)' },
        content: {
          en: 'Wait on the Star squares (⭐) right behind an opponent token until you roll the exact number to capture them.',
          si: 'තරු ලකුණු (⭐) ඇති කොටුවල රැඳී සිටින්න. එහිදී ඔබව කැපීමට කිසිවෙකුට නොහැකි අතර ප්‍රතිවාදියා පසුපසින් පැමිණෙන විට පහසුවෙන් කපා දැමිය හැක.'
        },
        difficulty: 'Intermediate'
      },
      {
        heading: { en: 'The Chase-and-Block Rule', si: 'පසුපසින් එළවීම සහ අවහිර කිරීම' },
        content: {
          en: 'Always keep your tokens 2 to 6 squares behind opponents to threaten them constantly without risking your own capture.',
          si: 'ප්‍රතිවාදියාගේ ඉත්තන්ට කොටු 2 සිට 6 දක්වා පිටුපසින් සිටීමෙන් ඔවුන්ට දැඩි තර්ජනයක් එල්ල කළ හැක.'
        },
        difficulty: 'Advanced'
      }
    ]
  },
  {
    gameId: 'water_sort',
    title: { en: 'Water Sort Tubes Logic', si: 'පාට කුප්පි (Water Sort) විසඳුම්' },
    icon: 'FlaskConical',
    category: { en: 'Color Puzzle', si: 'වර්ණ ප්‍රහේලිකාව' },
    tips: [
      {
        heading: { en: 'Reserve at least One Empty Tube', si: 'හිස් කුප්පියක් නිතරම ඉතිරි කරගන්න' },
        content: {
          en: 'Empty tubes are your buffer memory. Never fill an empty tube with mixed colors; use it only to isolate a single pure color stack.',
          si: 'හිස් කුප්පි යනු ඔබගේ ප්‍රධාන තුරුම්පුවයි. එයට මිශ්‍ර පාට දමන්න එපා; තනි පාටක් සම්පූර්ණ කිරීමට පමණක් එය භාවිතා කරන්න.'
        },
        difficulty: 'Beginner'
      },
      {
        heading: { en: 'Expose Hidden Bottom Layers', si: 'යට ඇති පාටවල් මතුකර ගැනීම' },
        content: {
          en: 'Prioritize pouring top layers if it reveals a color matching another active tube, unlocking chain reactions.',
          si: 'කුප්පියක උඩ ඇති වර්ණ ඉවත් කර යට ඇති වර්ණ මතු කරගැනීමට මුල්තැන දෙන්න.'
        },
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    gameId: 'animal_puzzle',
    title: { en: 'Animal Match Puzzle Strategy', si: 'සත්තු ප්‍රහේලිකාව විසඳීම' },
    icon: 'Puzzle',
    category: { en: 'Jigsaw Grid', si: 'කැබලි ගැලපුම' },
    tips: [
      {
        heading: { en: 'Start with Corners & Distinct Features', si: 'මුල්ලේ කැබලි හා ප්‍රධාන ලක්ෂණ' },
        content: {
          en: 'Find the eyes, nose, horns, or corner borders first. Reconstructing the animal facial anchor makes adjacent pieces obvious.',
          si: 'ප්‍රථමයෙන් සත්වයාගේ ඇස්, කන් හෝ මුල්ලේ කැබලි හඳුනාගෙන ස්ථානගත කරන්න. එවිට අනෙක් කොටස් පහසුවෙන් තේරුම් ගත හැක.'
        },
        difficulty: 'Beginner'
      },
      {
        heading: { en: 'Use the Reference Preview Box', si: 'පෙරදසුන් රූපය (Preview) බලන්න' },
        content: {
          en: 'Tap the Eye preview button to view the completed creature portrait before sliding or swapping slices.',
          si: 'සම්පූර්ණ සත්වයාගේ රූපය බැලීමට Eye බොත්තම ඔබන්න. එවිට කැබලි ගැලපීම ඉතා සරල වේ.'
        },
        difficulty: 'Beginner'
      }
    ]
  },
  {
    gameId: 'memory',
    title: { en: 'Memory Match Mastery', si: 'මතක ක්‍රීඩා කුසලතාව' },
    icon: 'Sparkles',
    category: { en: 'Cognitive', si: 'මතක ශක්තිය' },
    tips: [
      {
        heading: { en: 'Mental Grid Coordinate Mapping', si: 'කලාප වශයෙන් මතක තබාගැනීම' },
        content: {
          en: 'Chunk the board into 2x2 quadrants. Remember: "Top-left has Lion and Sapphire". Chunking doubles your recall speed.',
          si: 'මුළු පුවරුවම එකවර මතක තබාගන්නවා වෙනුවට කොටස් 4කට වෙන්කර (උදා: ඉහළ වම් කොටසේ සිංහයා සහ මැණික) මතකයේ තබාගන්න.'
        },
        difficulty: 'Intermediate'
      }
    ]
  }
];
