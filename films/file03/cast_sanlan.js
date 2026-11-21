// "แสนล้าน" · the cast (registered into chars2's CAST, same model and actions as FILE 03).
// The hero, ปั้น, at four ages (8 · 15 · 22 · 30), and the people who shape him. Style as in the references: round heads,
// long thin necks, slim bodies, arms straight at the sides; a child has a bigger head (headScale) and is drawn shorter.
import { CAST } from './chars2.js';
const P = (g, pts, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) p.length === 4 ? g.quadraticCurveTo(...p) : g.lineTo(...p); g.closePath(); g.fill(); };
const E = (g, x, y, rx, ry, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
const L = (g, a, b, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); };
// hair styles (drawn over the round head at hx, hy)
const spiky = col => ({ hairCol: col, hairFront: (g, v, hx, hy) => { P(g, [[hx - 27, hy + 2], [hx - 30, hy - 26], [hx - 22, hy - 30], [hx - 18, hy - 40], [hx - 8, hy - 34], [hx - 2, hy - 44], [hx + 6, hy - 34], [hx + 16, hy - 40], [hx + 20, hy - 28], [hx + 28, hy - 26], [hx + 26, hy - 12], [hx + 10, hy - 20], [hx - 8, hy - 16], [hx - 18, hy - 8], [hx - 20, hy + 8]], col); } });
const crew = col => ({ hairCol: col, hairFront: (g, v, hx, hy) => { P(g, [[hx - 26, hy - 2], [hx - 27, hy - 28, hx, hy - 31], [hx + 26, hy - 30, hx + 27, hy - 12], [hx + 12, hy - 22], [hx - 14, hy - 18], [hx - 20, hy + 4]], col); } });
const neat = col => ({ hairCol: col, hairFront: (g, v, hx, hy) => { P(g, [[hx - 27, hy + 2], [hx - 29, hy - 30, hx - 2, hy - 34], [hx + 24, hy - 34, hx + 28, hy - 16], [hx + 22, hy - 20], [hx + 4, hy - 26], [hx - 6, hy - 18], [hx - 18, hy - 12], [hx - 21, hy + 6]], col); P(g, [[hx + 4, hy - 26], [hx + 24, hy - 34], [hx + 26, hy - 24]], col); } });
const bun = col => ({ hairCol: col, hairBack: (g) => E(g, -10, -402, 13, 12, col), hairFront: (g, v, hx, hy) => { P(g, [[hx - 27, hy + 4], [hx - 28, hy - 30, hx + 2, hy - 33], [hx + 26, hy - 32, hx + 27, hy - 10], [hx + 8, hy - 22], [hx - 16, hy - 10], [hx - 20, hy + 10]], col); } });
const pony = col => ({ hairCol: col, hairBack: (g) => P(g, [[-22, -392], [-34, -350], [-30, -296], [-18, -300], [-14, -352]], col), hairFront: (g, v, hx, hy) => { P(g, [[hx - 27, hy + 6], [hx - 28, hy - 32, hx + 2, hy - 34], [hx + 26, hy - 32, hx + 27, hy - 8], [hx + 4, hy - 24], [hx - 16, hy - 8], [hx - 20, hy + 12]], col); } });
const glasses = (col = '#2a2a2a') => (g, v, hx, hy) => { g.strokeStyle = col; g.lineWidth = 1.6; for (const ex of v === 'side' ? [hx + 15] : [hx + 3, hx + 17]) { g.beginPath(); g.ellipse(ex, hy - 2, 5.5, 4.6, 0, 0, 7); g.stroke(); } if (v !== 'side') L(g, [hx + 8.5, hy - 3], [hx + 11.5, hy - 3], 1.4, col); };

const add = {
  // ปั้น · the hero
  pan8: { name: 'ปั้น · ๘ ขวบ', role: 'เด็กจนข้างคลอง', quote: 'สักวันผมจะรวยแสนล้าน', skin: '#c88e64', headScale: 1.3, legScale: .6, expr: 'smile',
    top: '#e2d4ae', pants: '#c88e64', skirt: '#4a5a7a', skirtLen: -176, shoes: '#6a4a3a', ...spiky('#1a1616'),
    outfit(g) { P(g, [[-14, -296], [6, -298], [6, -278], [-14, -276]], '#b8a888'); P(g, [[8, -250], [24, -252], [24, -236], [8, -234]], '#a8987a'); } },   // a worn tee with patches, shorts
  pan15: { name: 'ปั้น · ๑๕', role: 'นักเรียนที่สอบตกบ่อย', quote: 'ผิดอีกแล้ว… แต่ไม่เลิก', skin: '#c88e64', headScale: 1.1, legScale: .94,
    top: '#f2f2ec', pants: '#2c3a5a', shoes: '#1e1e22', ...crew('#1a1616'),
    outfit(g) { P(g, [[-2, -322], [8, -322], [4, -300]], '#d8d8d0'); P(g, [[12, -300], [24, -300], [24, -286], [12, -286]], '#2c3a5a'); } },   // school shirt with a navy pocket badge
  pan22: { name: 'ปั้น · ๒๒', role: 'ทำทุกงาน โดนหลอกทุกแบบ', quote: 'ทุกครั้งที่โดนหลอก ผมจดไว้', skin: '#c48a60',
    top: '#6a7a5a', pants: '#3a4a6a', shoes: '#5a4a3a', ...spiky('#1e1a1a'),
    outfit(g) { L(g, [-20, -320], [16, -224], 5, '#3a3026'); P(g, [[-30, -238], [-6, -238], [-8, -206], [-28, -206]], '#4a3a2a'); } },   // a cheap work polo, a cross-body bag
  pan30: { name: 'ปั้น · ๓๐', role: 'นักวางแผน', quote: 'คนฉลาดคิดเยอะ ผมคิดให้น้อยกว่าแต่ลึกกว่า', skin: '#c48a60', expr: 'neutral',
    top: '#22304a', pants: '#2a2e36', shoes: '#1a1a1e', coatLen: -210, ...neat('#141012'),
    outfit(g) { P(g, [[-6, -322], [10, -322], [8, -226], [-4, -226]], '#ecebe6'); P(g, [[-6, -322], [2, -300], [-10, -230], [-16, -230]], '#1a2638'); } },   // a dark blazer over a white tee
  // family
  mae: { name: 'แม่', role: 'ขายข้าวแกงริมคลอง', quote: 'กินให้อิ่มก่อนลูก', skin: '#c48a64', expr: 'smile',
    top: '#b8643a', skirt: '#5a3e66', skirtLen: -40, pants: '#c48a64', shoes: '#4a3a2a', ...bun('#241c1a'),
    outfit(g) { P(g, [[-22, -300], [24, -300], [26, -150], [-20, -150]], '#e8dcc0'); } },
  yai: { name: 'ยาย', role: 'คนแรกที่สอนให้นับเงิน', quote: 'เงินบาทเดียวก็ต้องรู้ว่าไปไหน', skin: '#c89a74', expr: 'smile',
    top: '#d8c8a8', skirt: '#5a3e2a', skirtLen: -30, pants: '#c89a74', shoes: '#4a3a2a', ...bun('#d8d8d4'), faceExtra: glasses('#6a5a4a') },
  // the people who fool him, and the one who teaches him
  o: { name: 'พี่โอ', role: 'คนชวนลงทุน (หลอก)', quote: 'รวยเร็ว ไม่ต้องทำอะไร', skin: '#d6a07c', expr: 'smile',
    top: '#6a3a8a', pants: '#2a2a30', shoes: '#c8b070', ...neat('#1a1414'),
    outfit(g) { L(g, [-10, -320], [0, -300], 3, '#e0b040'); L(g, [0, -300], [12, -320], 3, '#e0b040'); E(g, 0, -298, 4, 4, '#e0b040'); },
    hat(g, v, hx, hy) { P(g, [[hx - 8, hy - 30], [hx + 22, hy - 30], [hx + 22, hy - 24], [hx - 8, hy - 24]], '#1a1a1e'); } },   // shiny shirt, gold chain, sunglasses pushed up
  kim: { name: 'เฮียกิม', role: 'เจ้าของโรงรับจำนำ (ครู)', quote: 'อย่าถามว่าได้เท่าไร ถามว่าเสียได้เท่าไร', skin: '#d8b08a', expr: 'neutral',
    top: '#e8e4dc', pants: '#3a3a40', shoes: '#2a2a2a', bald: true, hairBack: (g) => { E(g, -20, -360, 8, 14, '#c8c8c4'); }, faceExtra: glasses('#2a2a2a') },
  nun: { name: 'นุ่น · ๑๕', role: 'เพื่อนหัวกะทิ', quote: 'นายผิดบ่อย แต่นายไม่กลัวผิด', skin: '#e0b090', expr: 'smile', headScale: 1.08, legScale: .94,
    top: '#f2f2ec', skirt: '#2c3a5a', skirtLen: -140, pants: '#e0b090', shoes: '#1e1e22', ...pony('#2a1e1a'), faceExtra: glasses('#3a3a6a') },
  thana: { name: 'คุณธนา', role: 'นักลงทุนหัวแหลม', quote: 'ผมคิดไว้สิบทางแล้ว', skin: '#e0b494', expr: 'neutral',
    top: '#4a4e56', pants: '#3a3e46', shoes: '#1a1a1e', coatLen: -200, ...neat('#5a5a5e'), faceExtra: glasses('#1a1a1a'),
    outfit(g) { P(g, [[-4, -322], [8, -322], [6, -230], [-2, -230]], '#e8e8ea'); P(g, [[0, -318], [4, -318], [5, -262], [1, -256], [-1, -262]], '#7a2a30'); } },
};
Object.assign(CAST, add);
export const SANLAN = Object.keys(add);
