// ─────────────────────────────────────────────────────────────
//  ALL WEDDING CONTENT LIVES HERE  (taken from the printed card)
// ─────────────────────────────────────────────────────────────

export const COUPLE = {
  bride: { name: 'Pooja', hindi: 'पूजा', initial: 'P', label: 'सौ. कां. पूजा', photo: '/assets/couple/bride.jpg' },
  groom: { name: 'Nitesh', hindi: 'नितेश', initial: 'N', label: 'चि. नितेश', photo: '/assets/couple/groom.jpg' },
}

// Countdown target: Baraat Swagat, Thu 3 Dec 2026, 8:15 PM IST
export const COUNTDOWN_TARGET = new Date('2026-12-03T20:15:00+05:30').getTime()

export const WEDDING_DATE_LONG = 'Thursday, 3 December 2026'
export const WEDDING_DATE_SHORT = '03.12.2026'
export const WEDDING_DATE_HINDI = 'गुरूवार, 3 दिसम्बर 2026'

export const FAMILY_NAME = 'Karodiya'
export const FAMILY_HINDI = 'कारोड़िया परिवार'

export const VENUE = {
  name: 'Nakhralo Rajasthan Resort',
  hindi: 'नखराळो राजस्थान रिसोर्ट',
  lines: ['New Delhi Express Highway, NH 48', 'Near Bhagwan Balram Gaun Sabzi Mandi', 'Road No. 14, Jaipur'],
  short: 'NH 48, Road No. 14, Jaipur',
  // Replace with the exact pin from the card's Location QR when you have it,
  // e.g. '26.8123,75.9012'  (leave '' to search by name)
  coordinates: '',
}
const mapQuery = VENUE.coordinates || 'Nakhralo Rajasthan Resort, NH 48, Road No. 14, Jaipur'
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`

// Each stop on the timeline. `rows` = several small ceremonies sharing one scroll.
export const EVENTS = [
  { id: 'peela-chawal', hindi: 'पीला चावल', title: 'Peela Chawal', date: 'Wednesday, 25 November 2026', times: ['9:15 AM'] },
  { id: 'ban-sankdi', hindi: 'बान सांकड़ी', title: 'Ban Sankdi', date: 'Sunday, 29 November 2026', times: ['10:15 AM'] },
  { id: 'haldi-mehndi', hindi: 'हल्दी व मेहन्दी', title: 'Haldi & Mehndi', date: 'Monday, 30 November 2026', times: ['10:15 AM'] },
  { id: 'mahila-sangeet', hindi: 'महिला संगीत', title: 'Mahila Sangeet', date: 'Monday, 30 November 2026', times: ['3:15 PM'] },
  { id: 'chak-bhat', hindi: 'चाक-भात', title: 'Chaak Bhaat', date: 'Thursday, 3 December 2026', times: ['9:15 AM'] },
  { id: 'preetibhoj', hindi: 'प्रीतिभोज', title: 'Preetibhoj', date: 'Thursday, 3 December 2026', times: ['6:15 PM'], place: [VENUE.name, 'Jaipur'] },
  { id: 'baraat', hindi: 'बारात स्वागत', title: 'Baraat Swagat', date: 'Thursday, 3 December 2026', times: ['8:15 PM'], place: [VENUE.name, 'Jaipur'] },
  {
    id: 'wedding', hindi: 'पाणिग्रहण संस्कार', title: 'The Wedding Ceremony', date: 'Thursday, 3 December 2026',
    times: ['At the auspicious lagna', 'शुभ लग्नानुसार'], place: [VENUE.name, 'NH 48 · Road No. 14 · Jaipur'],
  },
]

// People
export const BRIDE_FAMILY = {
  parents: 'Smt. Naina Devi & Shri Nanchhuram Saini',
  grand: 'Granddaughter of Late Smt. Prabhati Devi & Late Shri Gaindilal Karodiya',
  home: 'Dholya ki Dhani, Akeda Dungar',
}
export const GROOM_FAMILY = {
  parents: 'Smt. Mausam Devi & Shri Kishanlal Ji Singodiya',
  grand: 'Grandson of Late Smt. Godi Devi & Late Shri Galkaram Ji',
  home: 'Ganesh Nagar-4, Dev Darshan Mandir, Jaipur',
}

export const FAMILY_GROUPS = [
  { title: 'स्वागतकर्ता', en: 'Welcoming you', names: ['दुलीचन्द–सोनी, गणेश–केशर', 'महेन्द्र–सुमन, जितेन्द्र–ललीता', 'राकेश–ममता, सुरेश–गुलाब', 'कमलकिशोर–रेखा, अशोक–सुमन', 'संतोष–एकता, विनोद–सुमन', 'पवन–कोमल, ओमप्रकाश–पूजा', 'डॉ. राज, पंकज, विष्णु, महेश, राहुल'] },
  { title: 'जंवाई पक्ष', en: 'Jamai Paksh', names: ['अनोखी–रामेश्वर जी', 'कल्याणी–दलजी', 'लक्ष्मी–प्रहलाद जी', 'प्रेम–शंकर जी', 'मन्जू–भागीरथ जी', 'राजू–स्व. प्रहलाद जी', 'कृष्णा–शंकर जी', 'कौशल्या देवी–लालचन्द जी', 'चन्दू–बिरदीचन्द जी', 'पिंकी–हिरालाल जी', 'सरोज–रामलाल जी', 'मीनू–राज जी', 'लता–लालकृष्ण जी'] },
  { title: 'ननिहाल पक्ष', en: 'Nanihal Paksh', names: ['मोहन जी–बैला देवी', 'हर्षित, विशाखा', 'बागड़ी परिवार, चौमूं', 'रूडमल जी–सरोज देवी', 'विरेन्द्र, विशाल, वर्षा, वरखा', 'जादम परिवार, भौजलावा, चौमूं'] },
  { title: 'भांजा-भांजी', en: 'Bhanja–Bhanji', names: ['भगवान सहाय जी–अनिता', 'सूर्यांश, गुनगुन'] },
  { title: 'उत्तराकांक्षी', en: 'Uttarakankshi', names: ['नानगराम–रूकमा देवी', 'कन्हैयालाल–गंगा देवी', 'रामस्वरूप–भगवानी देवी', 'गोविन्दनारायण–कमला देवी', 'स्व. ग्यारसीलाल–मनफूली देवी'] },
  { title: 'दर्शनाभिलाषी', en: 'With warm regards', names: ['दुर्गालाल, कालूराम, रामनारायण', 'नाथूराम, नाथूराम, लालाराम', 'भैरूराम, हनुमान एवं', 'समस्त कारोड़िया परिवार'] },
]

export const NIHARATI = {
  verse: 'दिल में हसरत न रहे कोई अरमान बनकर, आप आओ शादी मे दो घड़ी मेहमान बनकर….',
  names: 'दीक्षांत, मुकुल, रोहित, कैशव, खुशी, पुनम, आशा, भूमिका, राधिका, आना, गौरवी, चेल्सी, मयंक, अवनी, सानवी',
}

export const CONTACT = {
  heading: 'Karodiya Parivar',
  role: 'Hosts of the celebration · happy to help',
  people: 'नानगराम · कन्हैयालाल (बागवान) · रामस्वरूप · गोविन्दनारायण · नन्छूराम',
  address: 'Dholya ki Dhani, Akeda Dungar · Near Geetanjali Kids Academy, Bhagwati Nursery, Road No. 14, NH 48, Jaipur',
  numbers: ['9784656686', '7878870962', '9672864808', '9314656362', '9950752766'],
  // Number that receives RSVP WhatsApp messages (country code + number, no +)
  whatsapp: '919784656686',
}

// RSVP: leave '' to send replies through WhatsApp to CONTACT.whatsapp.
// Or paste a Formspree / Getform / Google-Apps-Script URL you own to receive them as form data.
export const RSVP_ENDPOINT = ''

// Gallery — drop photos in public/assets/gallery and list them here.
// Until then the carousel shows elegant placeholders.
export const GALLERY = [
  // { src: '/assets/gallery/01.jpg', title: 'Together', alt: 'Pooja and Nitesh together' },
]
export const GALLERY_PLACEHOLDERS = ['Our Story', 'Together', 'A Quiet Moment', 'Pre-wedding', 'Forever', 'Blessings']

// Background music: put a track you have the rights to at this path.
export const MUSIC_SRC = '/assets/entry/music.mp3'

export const BLESSINGS = [
  'May your days be full of laughter, patience, and the quiet joy of choosing each other.',
  'May every new chapter bring shared adventures and a home filled with warmth.',
  'Wishing you a lifetime of little joys, big dreams, and hands held through it all.',
]
