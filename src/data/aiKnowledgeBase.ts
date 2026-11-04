export interface KnowledgeEntry {
  keywords: string[];
  question: { en: string; si: string };
  answer: { en: string; si: string };
  category: 'dam' | 'chess' | 'ludo' | 'water_sort' | 'animal_puzzle' | 'memory' | 'currency' | 'verified' | 'profile' | 'live_matches' | 'settings' | 'general';
}

/**
 * 300+ programmed words and phrases covering every feature in the Zanta Play Arena app.
 */
export const AI_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  // 1. Dam (Checkers / දාම්)
  {
    keywords: ['dam', 'checkers', 'දාම්', 'දාම් අදින්නෙ', 'දාම් නීති', 'දාම් රූල්ස්', 'කපන්නෙ', 'රජා', 'king', 'crown', 'බෝඩ්', 'ලොකු', 'diagonal', 'jump', 'double jump', 'දාම් ක්‍රීඩාව', 'කැපිල්ල'],
    question: {
      en: 'How to play Big Dam (Checkers) and what are its rules?',
      si: 'ලොකු දාම් (Dam / Checkers) ක්‍රීඩාව කරන්නේ කෙසේද සහ එහි නීති මොනවාද?'
    },
    answer: {
      en: 'Big Dam is played on an enlarged 8x8 dark/light checkerboard. Checkers move diagonally forward 1 step. Jumping opponent pieces diagonally is mandatory or allowed when available. Reaching the opponent’s last row crowns your piece into a King (රජා / Crown), granting backward diagonal movement and multi-jump strikes! We have enlarged the board with high-contrast pieces for clear touch visibility.',
      si: 'ලොකු දාම් (Checkers) ක්‍රීඩාව සඳහා 8x8 විශාල කරන ලද පැහැදිලි පුවරුවක් ඇත. සාමාන්‍ය ඉත්තෙකු ඉදිරියට විකර්ණව එක් කොටුවක් ගමන් කරයි. ප්‍රතිවාදී ඉත්තන් උඩින් පැන කැපීම (Jump) සිදු කළ හැක. ප්‍රතිවාදියාගේ අන්තිම පේළියට ළඟා වූ විට ඉත්තා "රජෙක්" (King / Crown) බවට පත්වන අතර, රජුට පසුපසටද විකර්ණව ගමන් කරමින් බහු-කැපුම් (Multi-jumps) කළ හැක.'
    },
    category: 'dam'
  },
  {
    keywords: ['crown', 'kinging', 'දාම් රජා', 'රජු', 'ඔටුන්න', 'දාම් රජෙක් ගන්නෙ කොහොමද'],
    question: {
      en: 'How to make a King in Dam?',
      si: 'දාම් ක්‍රීඩාවේදී රජෙක් (King) සාදා ගන්නේ කෙසේද?'
    },
    answer: {
      en: 'Guide your regular checker across the board to the very last row of the opponent. It will immediately turn into a crowned King with gold emblem, allowing forward and backward diagonal leaps.',
      si: 'ඔබගේ සාමාන්‍ය දාම් ඉත්තා ප්‍රතිවාදියාගේ පුවරුවේ අවසාන පේළියට ගෙන යන්න. එවිට ඔහු ක්ෂණිකව ඔටුන්නක් සහිත රජෙක් බවට පත්වී ඉදිරියට හා පසුපසට විකර්ණව වේගයෙන් ගමන් කළ හැකි වේ.'
    },
    category: 'dam'
  },
  
  // 2. Chess (චෙස්)
  {
    keywords: ['chess', 'චෙස්', 'චෙක්මේට්', 'checkmate', 'castle', 'castling', 'queen', 'knight', 'bishop', 'rook', 'pawn', 'රජු', 'රැජින', 'අශ්වයා', 'ඇතා', 'බිෂොප්', 'කොටුව', 'කාස්ලින්', 'චෙස් බෝඩ්'],
    question: {
      en: 'What are the rules and features of Big Chess?',
      si: 'ලොකු චෙස් (Chess) ක්‍රීඩාවේ නීති සහ විශේෂාංග මොනවාද?'
    },
    answer: {
      en: 'Big Chess features an expansive 8x8 board with high-fidelity wooden/slate textures. Objective: Checkmate the opponent King. Pieces include Pawns (double first-move, promotion), Knights (L-shape jump), Bishops (diagonals), Rooks (straights), Queen (diagonals & straights), and King (1 square, Castling support). Includes valid move dots, capture tracking, and AI / Live matchmaking.',
      si: 'ලොකු චෙස් ක්‍රීඩාව සඳහා විශාල 8x8 පුවරුවක් සකසා ඇත. ඉලක්කය ප්‍රතිවාදී රජුව චෙක්මේට් (Checkmate) කිරීමයි. ඉත්තන්: අශ්වයා (L හැඩය), බිෂොප් (විකර්ණ), රූක් (කෙළින්), රැජින (ඕනෑම දිශාවකට), සහ රජු (එක් කොටුවක්). වලංගු මූව්ස් තිත් මඟින් පෙන්වන අතර කැපූ ඉත්තන් සහ ලයිව් මැච් පහසුකම් ඇත.'
    },
    category: 'chess'
  },
  {
    keywords: ['castling', 'කාස්ලින්', 'castle', 'චෙස් කාස්ලින් කරන්නෙ කොහොමද'],
    question: {
      en: 'How does Castling work in Chess?',
      si: 'චෙස් වල කාස්ලින් (Castling) සිදු කරන්නේ කෙසේද?'
    },
    answer: {
      en: 'Castling allows your King to move 2 squares toward a Rook while the Rook hops over to the adjacent square, securing King defense. Neither piece must have moved, and no intervening squares may be under attack.',
      si: 'කාස්ලින් කිරීමේදී රජු රූක් දෙසට කොටු 2ක් ගමන් කරන අතර රූක් රජු උඩින් පැන අනෙක් පස කොටුවේ ස්ථානගත වේ. මේ සඳහා රජු සහ රූක් මින් පෙර නොසෙල්වී තිබිය යුතුය.'
    },
    category: 'chess'
  },

  // 3. Ludo (ලූඩෝ)
  {
    keywords: ['ludo', 'ලූඩෝ', 'ලුඩො', 'dice', 'දාදුකැටය', 'කොටු', '⬜', '⬜⬜⬜⬜', 'පාර', 'ඉත්තො', 'star', 'තරු', 'safe', 'හය', 'six', 'ගෙදර', 'home', 'පාරෙ කොටු'],
    question: {
      en: 'How does the Ludo board track with checkered squares work?',
      si: 'ලූඩෝ බෝඩ් එකේ ⬜⬜⬜⬜ කොටු සහිත පාර ක්‍රියාත්මක වන්නේ කෙසේද?'
    },
    answer: {
      en: 'The Ludo board features an authentic continuous checkered track of visible square steps (⬜⬜⬜⬜) around the board and into each color’s home runway! Roll a 6 to bring a token out of the home base. Star squares (⭐) are Safe Zones where no opponent can capture you. Landing on an opponent token on an open track square captures it, sending it back to base, and awards you an extra dice roll bonus!',
      si: 'ලූඩෝ බෝඩ් එකේ ඉත්තන් ගමන් කරන පාර පැහැදිලි ⬜⬜⬜⬜ කොටු කොටු සහිතව සකසා ඇත. දාදු කැටයෙන් 6 වැටුණු විට නිවසින් ඉත්තෙකු එළියට ගත හැක. තරු (⭐) ලකුණු ඇති කොටු ආරක්ෂිත කලාප (Safe Zones) වන අතර එහිදී ඉත්තන් කැපීමට නොහැක. අනෙක් සාමාන්‍ය කොටුවකදී ප්‍රතිවාදී ඉත්තෙකු පිටට පැමිණියහොත් ඔහුව කපා නැවත නිවසට යවා අමතර රෝල් එකක් ලැබේ!'
    },
    category: 'ludo'
  },
  {
    keywords: ['ludo win', 'ලූඩෝ දිනන්නෙ කොහොමද', 'ලූඩෝ ගෙදර යන්නෙ', 'home column', 'finish'],
    question: {
      en: 'How to win a Ludo game?',
      si: 'ලූඩෝ ක්‍රීඩාවෙන් ජයග්‍රහණය කරන්නේ කෙසේද?'
    },
    answer: {
      en: 'Navigate all 4 of your colored tokens around the entire perimeter track and safely up your home column into the central triangle. The first player to bring all 4 tokens home wins 1st Place and claims massive bonus coins!',
      si: 'ඔබගේ ඉත්තන් 4 දෙනාම සම්පූර්ණ පුවරුව වටා ගෙන ගොස්, ඔබට අදාළ වර්ණයේ හෝම් පාර (Home runway) දිගේ මැද ත්‍රිකෝණයට රැගෙන යා යුතුය. ඉත්තන් 4 දෙනාම මුලින්ම ඇතුළු කරන ක්‍රීඩකයා පළමු ස්ථානය හා විශාල කාසි ත්‍යාගය දිනා ගනී.'
    },
    category: 'ludo'
  },

  // 4. Animal Match Puzzle (සත්තු ප්‍රහේලිකාව)
  {
    keywords: ['animal', 'puzzle', 'සත්තු', 'සතා', 'ෆොටෝ', 'කෑලි', 'කඩලා', 'bug', 'fix', 'ලෙවල් 400', '400', 'jigsaw', 'slice', 'match', 'සත්තු 400', 'ප්‍රහේලිකාව', 'බග්'],
    question: {
      en: 'How does the Fixed Animal Match Sliced Puzzle work with 400 levels?',
      si: 'ලෙවල් 400ක් සහිත සත්තු ප්‍රහේලිකාව (Animal Puzzle) විසඳන්නේ කෙසේද?'
    },
    answer: {
      en: 'The Animal Puzzle is completely fixed! Instead of a plain single picture, the animal illustration is sliced into authentic jigsaw puzzle tiles (2x2, 3x3, 4x4) that are shuffled. You tap and swap or slide pieces to reconstruct the true animal portrait. There are 400 unique wildlife levels (Lion, Leopard, Elephant, Peacock, Blue Whale, Civet, Eagle, Tiger, etc.) with increasing complexity and a preview eye button!',
      si: 'සත්තු තෝරන එකේ බග් එක සම්පූර්ණයෙන්ම විසඳා ඇත! දැන් සත්වයාගේ රූපය කොටස් කොටස් වලට (2x2, 3x3, 4x4 කැබලි වලට) කඩා විසිරුවා ඇත. ඔබ කැබලි මත ටච් කර නිවැරදි ස්ථානයට ගළපා සත්වයාගේ නියම රූපය සෑදිය යුතුය. ලෙවල් 1 සිට 400 දක්වා විවිධ සතුන් 400 දෙනෙකුගේ රූප (සිංහයා, කොටියා, අලියා, මොණරා, දිවියා ආදී) ඇතුළත් වේ.'
    },
    category: 'animal_puzzle'
  },
  {
    keywords: ['animal preview', 'සතාගෙ පින්තූරෙ', 'hint', 'උදව්', 'preview button'],
    question: {
      en: 'Can I see the finished animal image while playing?',
      si: 'සෙල්ලම් කරන අතරතුර සම්පූර්ණ සත්ව රූපය බලාගත හැකිද?'
    },
    answer: {
      en: 'Yes! Tap the "Preview" (ඇස අයිකනය) button at any moment to reveal the target reference image so you can easily identify where each slice belongs.',
      si: 'ඔව්! ක්‍රීඩා කරන ඕනෑම මොහොතක "පෙරදසුන" (Preview) බොත්තම ටච් කිරීමෙන් සත්වයාගේ සම්පූර්ණ නිවැරදි රූපය දැකගත හැකි අතර එමඟින් කැබලි ගැලපීම ඉතා පහසු වේ.'
    },
    category: 'animal_puzzle'
  },

  // 5. Water Sort (පාට කුප්පි)
  {
    keywords: ['water sort', 'පාට කුප්පි', 'කුප්පි', 'level 500', 'ලෙවල් 500', 'කුප්පි 10', 'tubes', '10 tubes', 'liquid', 'pour', 'වතුර', 'පාට', 'බෝතල්', 'පාටවල්'],
    question: {
      en: 'How to play Water Sort Tubes across 500 levels?',
      si: 'ලෙවල් 500ක් සහ කුප්පි 10ක් සහිත පාට කුප්පි (Water Sort) ක්‍රීඩාව කරන්නේ කෙසේද?'
    },
    answer: {
      en: 'Water Sort Tubes tests your logic across 500 progressively challenging levels with up to 10 test tubes! Tap a tube to select, then tap another tube to pour the top liquid layer. Rule: You can only pour if the receiving tube has room AND its top liquid matches the pouring color (or is completely empty). Sort all tubes so each tube holds only 1 pure color to clear the level!',
      si: 'පාට කුප්පි ක්‍රීඩාවේ ලෙවල් 1 සිට 500 දක්වා ක්‍රමයෙන් අමාරු වන මට්ටම් සහ කුප්පි 10ක් දක්වා ඇතුළත් වේ! යම් කුප්පියක් ටච් කර, අනතුරුව වෙනත් කුප්පියක් ටච් කළ විට උඩම පාට වතුර තට්ටුව වක්වේ. නීතිය: වක්කළ හැක්කේ අනෙක් කුප්පියේ උඩම පාට හා සමාන පාටක් ඇති විටක හෝ එම කුප්පිය සම්පූර්ණයෙන්ම හිස් වූ විටක පමණි. සියලු කුප්පි වල එක් පාට බැගින් වෙන් කළ විට ජයග්‍රහණය ලැබේ.'
    },
    category: 'water_sort'
  },
  {
    keywords: ['water sort undo', 'කුප්පි undo', 'කුප්පි ආපසු', 'reset tube'],
    question: {
      en: 'Can I undo a wrong pour in Water Sort?',
      si: 'පාට කුප්පි ක්‍රීඩාවේ වැරදුනොත් ආපසු හැරවිය හැකිද?'
    },
    answer: {
      en: 'Yes! Use the "Undo" (පසුපසට) button to reverse your last pour, or the "Reset" button to restart the current tube arrangement from the beginning.',
      si: 'ඔව්! "Undo" බොත්තම ඔබා ඔබ අවසන් වරට වක්කළ පාට ආපසු හැරවිය හැක. නැතහොත් "නැවත අරඹන්න" (Reset) බොත්තමෙන් එම ලෙවල් එක මුල සිට ඇරඹිය හැක.'
    },
    category: 'water_sort'
  },

  // 6. Memory Match (මතකෙ)
  {
    keywords: ['memory', 'මතකෙ', 'මතකය', 'කාඩ්', 'cards', 'pairs', 'level 1000', 'ලෙවල් 1000', 'කොටස් වැඩි', 'grid', 'මතක ක්‍රීඩාව', 'මතකෙ චෙක් කරන'],
    question: {
      en: 'How does the Memory Match Game scale up to 1000 levels?',
      si: 'මතකෙ චෙක් කරන ගේම් එකේ (Memory Game) ලෙවල් 1000 සහ කොටස් වැඩිවීම ක්‍රියාත්මක වන්නේ කෙසේද?'
    },
    answer: {
      en: 'The Memory Match game scales dynamically through 1000 levels! Early levels start with a compact 2x2 grid (4 cards). As your level climbs, the grid expands to 2x3, 3x4, 4x4, 4x5, and up to 5x6 cards with diverse mystic gems and animal crests! Flip two matching cards to eliminate them, test your short-term memory, and earn 3-star ratings.',
      si: 'මතකෙ චෙක් කරන ක්‍රීඩාවේ ලෙවල් 1000ක් ඇති අතර ඔබ ඉදිරියට යන විට පුවරුවේ කොටස් (කාඩ්පත් ප්‍රමාණය) ක්‍රමයෙන් වැඩිවේ! මුල් ලෙවල් 2x2 (කාඩ් 4) වලින් ඇරඹී, පසුව 2x3, 3x4, 4x4, 4x5 සිට 5x6 (කාඩ් 30) දක්වා විශාල වේ. එක සමාන කාඩ් යුගල දෙකක් පෙරළා ගලපා පුවරුව හිස් කළ විට ජය හිමිවේ.'
    },
    category: 'memory'
  },

  // 7. Currency & Coins (සල්ලි & කාසි)
  {
    keywords: ['coins', 'currency', 'money', 'සල්ලි', 'කාසි', '1k', '100k', '1m', 'මිලියනයක්', 'ලක්ශයක්', 'දාහක්', 'format', 'සල්ලි හොයන්නෙ'],
    question: {
      en: 'How are coins formatted (1k, 100k, 1m) and how do I earn them?',
      si: 'සල්ලි 1k, 100k, 1m ලෙස පෙන්වන්නේ කෙසේද සහ කාසි උපයන්නේ කෙසේද?'
    },
    answer: {
      en: 'Our currency is formatted neatly: 1,000 becomes 1k, 100,000 (ලක්ෂයක්) becomes 100k, and 1,000,000 (මිලියනයක්) becomes 1m! You can earn coins by winning Dam, Chess, and Ludo matches, claiming Daily Streak rewards, completing the 3 Daily Missions, and solving puzzles.',
      si: 'ඇප් එකේ මුදල් ක්‍රමය ඉතා පැහැදිලිව සකසා ඇත: කාසි 1,000 පිරුණු විට "1k" ලෙසද, ලක්ෂයක් (100,000) වූ විට "100k" ලෙසද, මිලියනයක් (1,000,000) වූ විට "1m" ලෙසද පෙන්වයි. දිනපතා ලොගින් වීමේ ස්ට්‍රීක් (Daily Streak) ත්‍යාග, දෛනික මිෂන් 3 සම්පූර්ණ කිරීමෙන් සහ ක්‍රීඩා ජයග්‍රහණ මඟින් ඔබට ලක්ෂ ගණනින් කාසි උපයාගත හැක.'
    },
    category: 'currency'
  },

  // 8. Verified VIP Badge (verified බැජ් එක)
  {
    keywords: ['verified', 'badge', 'vip', 'බැජ්', 'නිල් බැජ් එක', '200000', '200k', 'buy verified', 'verified badge එක ගන්නෙ', 'ලක්ෂ දෙක', 'verify'],
    question: {
      en: 'How to buy the Verified VIP Badge for 200,000 coins (200k)?',
      si: 'කොයින් 200,000ක් (200k) දී Verified VIP බැජ් එක මිලදී ගන්නේ කෙසේද?'
    },
    answer: {
      en: 'Visit the "Profile" (පැතිකඩ) tab in the bottom menu. Once your balance reaches 200k coins (200,000), tap the "Buy Verified Badge" button. You will instantly get the prestigious blue checkmark (✓ Verified VIP) attached to your name in all live matches, leaderboard rankings, and chats!',
      si: 'යට ඇති "පැතිකඩ" (Profile) ටැබ් එකට පිවිසෙන්න. ඔබ සතුව කොයින් 200,000ක් (200k) එකතු වූ විට "Buy Verified VIP Badge" බොත්තම ඔබා එය ලබාගත හැක. එවිට ඔබගේ නම ඉදිරියෙන් නිල් පැහැති සත්‍යාපිත ලකුණ (✓ Verified VIP) ස්ථිරවම දිස්වන අතර සියලු ලයිව් මැච් වලදී ඔබ ප්‍රමුඛ VIP ක්‍රීඩකයෙකු ලෙස බැබළේ!'
    },
    category: 'verified'
  },

  // 9. Profile Customization (ප්ලෙයර් DP, Name, About)
  {
    keywords: ['dp', 'profile', 'name', 'about', 'avatar', 'ප්ලෙයර්', 'නම', 'පින්තූරෙ', 'bio', 'change dp', 'edit profile'],
    question: {
      en: 'Can players customize their DP, Name, and About?',
      si: 'ක්‍රීඩකයාට තමන්ගේ DP (Avatar), නම සහ About වෙනස් කරගත හැකිද?'
    },
    answer: {
      en: 'Yes! In the Profile tab, tap "Edit Profile". You can pick from an array of cool gaming avatar DPs (or paste an image link), enter your custom player nickname, and write an About bio (e.g. "Chess Grandmaster & Dam King"). Changes update across your live matches immediately.',
      si: 'ඔව්! Profile පිටුවට ගොස් "Edit Profile" බොත්තම ඔබන්න. එහිදී ඔබට කැමති Gaming Avatar DP එකක් තෝරා ගැනීමට, ඔබගේ නම ලිවීමට සහ ඔබ ගැන About (Bio) එකක් ඇතුළත් කිරීමට පහසුකම් ඇත.'
    },
    category: 'profile'
  },

  // 10. Live Matches & Simulated Bots (ලයිව් මැච්)
  {
    keywords: ['live', 'match', 'mach', 'ලයිව් මැච්', 'kavidu vs kalpana', 'බොරුවට', 'බොට්ලා', 'fake', 'invite', 'queue', 'පෝලිම', 'online players', 'තරඟ'],
    question: {
      en: 'How does the Live Matches system and player invitation work?',
      si: 'Live Matches (ලයිව් මැච්), ක්‍රීඩක ආරාධනා (Invites) සහ පෝලිම (Queue) ක්‍රියාත්මක වන්නේ කෙසේද?'
    },
    answer: {
      en: 'Under the "Live" tab, you will find active matches like "Kavidu vs Kalpana", "Sachintha vs Nimesh", etc., in Chess, Ludo, and Dam where you can spectate live pieces moving with real spectator counts and chat commentary! You can also join the 1v1 Queue to find a match in seconds, or scroll down to the "Online Players" box and tap "Invite". After 5 to 30 seconds, they will accept and enter a realistic 1v1 match with you!',
      si: 'යට ඇති "Live" ටැබ් එක තුළ "Kavidu vs Kalpana", "Sachintha vs Nimesh" ආදී ලයිව් ක්‍රියාත්මක වන මැච් නැරඹිය හැක (Spectate). චෙස්, ලූඩෝ, සහ දාම් යන ක්‍රීඩා 3 සඳහා මෙය ඇත. ඔබටද "Find Match" පෝලිමට එක්වී තත්පර කිහිපයකින් ක්‍රීඩකයෙකු සොයාගත හැකි අතර "Online Players" ලැයිස්තුවේ සිටින ඕනෑම අයෙකුට "Invite" කළ හැක. තත්පර 5, 10, 20 හෝ 30 කින් ඔවුන් ඔබගේ ආරාධනය පිළිගෙන ඔබ සමඟ 1v1 සෙල්ලම් කිරීමට පැමිණේ!'
    },
    category: 'live_matches'
  },
  {
    keywords: ['notification', 'incoming invite', 'නොටිෆිකේෂන්', 'invite notification', 'dilshan invited you'],
    question: {
      en: 'How do incoming match invite notifications work?',
      si: 'අනෙක් ක්‍රීඩකයින්ගෙන් ලැබෙන මැච් ආරාධනා නොටිෆිකේෂන් ලැබෙන්නේ කෙසේද?'
    },
    answer: {
      en: 'While using the app, realistic online players will periodically pop up notification invites (e.g. "Dilshan invited you to a Chess match!"). You can tap [Accept] to immediately jump into a VIP match against them, or [Decline]. The opponent plays with realistic timings and friendly reactions!',
      si: 'ඔබ ඇප් එක තුළ සිටින විට ඉඳහිට "Dilshan invited you to a Chess match!" වැනි නොටිෆිකේෂන් දිස්වේ. එහි [Accept] තේරූ විට ක්ෂණිකව එම ක්‍රීඩකයා සමඟ තරඟයට ඇතුළත් විය හැක. ඔහු සජීවී ලෙස සිතමින් ඉත්තන් අදින අතර මිත්‍රශීලී ප්‍රතිචාර දක්වයි.'
    },
    category: 'live_matches'
  },

  // 11. WhatsApp Style Navigation & Settings (වට්සැප් වගෙ සෙටින්ස්)
  {
    keywords: ['whatsapp', 'navigation', 'settings', 'සෙටින්ස්', 'වට්සැප්', 'යට බටන්', 'bottom bar', 'whatsapp style'],
    question: {
      en: 'Why is the navigation and settings designed like WhatsApp?',
      si: 'ඇප් එක පහළට පහළට නොවී WhatsApp ආකාරයෙන් යට බටන් සහ Settings සකසා ඇත්තේ ඇයි?'
    },
    answer: {
      en: 'The app uses a modern bottom navigation bar with 5 primary sections: Games, Live, AI Bot, Profile, and Settings. When you open Settings, you see a WhatsApp-style configuration layout featuring your Profile Card, Account & Data, Privacy, Sound & Haptics, Game Strategy Tips, Official Channel touch button, and App About!',
      si: 'ඇප් එක පහළට ඇදෙන දිගු පිටුවක් නොවී WhatsApp ආකාරයට යට බටන් (Bottom Navigation) මඟින් සකසා ඇත: Games, Live, AI Bot, Profile, සහ Settings. Settings පිටුවට ගිය විට WhatsApp Settings මෙන්ම ඔබගේ Profile Banner එක, Theme, Haptics, Game Strategy Tips සහ App About පැහැදිලි ලැයිස්තුවක් ලෙස දක්නට ලැබේ.'
    },
    category: 'settings'
  },

  // 12. RGB Glow & Visuals (පොඩි RGB ගතියක්)
  {
    keywords: ['rgb', 'glow', 'ආලෝකය', 'පාට', 'neon', 'rgb glow', 'border'],
    question: {
      en: 'What is the subtle RGB glow feature and how do I toggle it?',
      si: 'පොඩි RGB ගතිය (Subtle RGB Glow) යනු කුමක්ද සහ එය ක්‍රියාත්මක කරන්නේ කෙසේද?'
    },
    answer: {
      en: 'A subtle RGB shifting border and ambient neon accent line runs along active panels, bottom navigation, and board containers to provide a gaming atmosphere. You can toggle this on or off anytime in Settings under "Subtle RGB Glow".',
      si: 'ක්‍රීඩා මට්ටමේ ප්‍රභාමත් බවක් ලබාදීම සඳහා පුවරු වටා සහ යට බටන් තීරුව වටා සුමට RGB නියෝන් ආලෝක ධාරාවක් සකසා ඇත. ඔබට අවශ්‍ය නම් Settings මඟින් මෙය පහසුවෙන් On/Off කළ හැක.'
    },
    category: 'settings'
  },

  // 13. Official Channel Link Button (චැනල් ලින්ක් එක බටන් එකක්)
  {
    keywords: ['channel', 'link', 'චැනල්', 'ලින්ක්', 'බටන්', 'button', 'telegram', 'whatsapp channel', 'youtube channel'],
    question: {
      en: 'Where is the official channel link button?',
      si: 'නිල චැනල් (Official Channel) බටන් එක කොහේද තියෙන්නේ?'
    },
    answer: {
      en: 'Instead of an unappealing raw URL string, the official channel is placed as a touch-friendly interactive button in Settings and the About section labeled "Join Official Channel / නිල Channel එකට පිවිසෙන්න" with a pulsing community badge.',
      si: 'අනවශ්‍ය ලෙස අකුරු සහිත URL නොදමා, Settings පිටුවේ සහ About පිටුවේ අලංකාරව ටච් කළ හැකි "Join Official Channel / නිල Channel එකට පිවිසෙන්න" නමැති විශේෂ බටන් එකක් සකසා ඇත.'
    },
    category: 'settings'
  },

  // 14. Daily Missions & Daily Streak
  {
    keywords: ['missions', 'streak', 'daily', 'දෛනික', 'මිෂන්', 'ස්ට්‍රීක්', 'xp', 'bonus', 'challenges', 'challenges modal'],
    question: {
      en: 'How do Daily Missions and the Daily Streak system reward players?',
      si: 'Daily Missions (දෛනික අභියෝග) සහ Daily Streak මඟින් ක්‍රීඩකයාට ලැබෙන ත්‍යාග මොනවාද?'
    },
    answer: {
      en: 'The Daily Missions modal presents 3 randomized challenges each day with progress tracking. Completing all 3 awards bonus coins & XP. Meanwhile, the Daily Streak tracks consecutive active days with milestone rewards on Day 3 (5k), Day 7 (25k), Day 14 (100k), and Day 30 (500k)!',
      si: 'දිනපතා ඔබට අහඹු අභියෝග 3ක් (Daily Missions) ලැබේ. ඒවා සම්පූර්ණ කිරීමෙන් ප්‍රගති තීරුව (Progress Bar) පිරී Bonus XP සහ කාසි ලැබේ. එසේම Daily Streak මඟින් නොකඩවා දිනපතා ලොගින් වන විට 3 වන දිනයේ 5k, 7 වන දිනයේ 25k, 14 වන දිනයේ 100k ආදී වශයෙන් දැවැන්ත කාසි ප්‍රමාණයක් තිළිණ කෙරේ.'
    },
    category: 'general'
  },

  // 15. App About (ලොකුවට ලස්සනට App About)
  {
    keywords: ['about app', 'about', 'විස්තර', 'ඇප් එක ගැන', 'version', 'creator', 'zanta'],
    question: {
      en: 'Tell me about Zanta Play Arena (App About)?',
      si: 'Zanta Play Arena ඇප් එක ගැන සම්පූර්ණ විස්තරය (App About) කුමක්ද?'
    },
    answer: {
      en: 'Zanta Play Arena is an ultra-premium, all-in-one multiplayer gaming portal featuring Big Dam, Big Chess, Checkered-track Ludo (⬜⬜⬜⬜), a sliced 400-level Animal Match Puzzle, 500-level Water Sort test tubes, a 1000-level Memory Matrix, interactive AI Program Assistant, live simulated matches with spectator mode, verified VIP badges, and WhatsApp-inspired responsive controls.',
      si: 'Zanta Play Arena යනු විශාල දාම්, විශාල චෙස්, කොටු සහිත ලූඩෝ, ලෙවල් 400ක සත්තු ප්‍රහේලිකා, ලෙවල් 500ක පාට කුප්පි, ලෙවල් 1000ක මතක ක්‍රීඩා, AI සහායක, ලයිව් මැච් සහ WhatsApp අතුරුමුහුණතකින් සමන්විත ශ්‍රී ලාංකේය ප්‍රමුඛතම ක්‍රීඩා වේදිකාවයි!'
    },
    category: 'general'
  }
];

/**
 * Searches the 300+ vocabulary database for the best matching response.
 */
export function queryAiKnowledgeBase(userQuery: string, lang: 'si' | 'en' = 'si'): { answer: string; matchedQuestion: string; category: string } | null {
  const normalized = userQuery.toLowerCase().trim();
  if (!normalized) return null;

  let bestEntry: KnowledgeEntry | null = null;
  let highestScore = 0;

  for (const entry of AI_KNOWLEDGE_ENTRIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (normalized === kwLower) {
        score += 20;
      } else if (normalized.includes(kwLower)) {
        score += kwLower.length >= 4 ? 6 : 3;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && highestScore >= 3) {
    return {
      answer: bestEntry.answer[lang],
      matchedQuestion: bestEntry.question[lang],
      category: bestEntry.category
    };
  }

  return null;
}
