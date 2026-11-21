// "แสนล้าน" · places for chapters 2–6: a rented room, the scheme's seminar hall, its shut office, a restaurant, the
// pawnshop, the startup office, a meeting room, a dark condo, a footbridge in the rain, a funeral, คุณธนา's tower, Nun's café.
const W = 1920, H = 1080, TH = "'IBM Plex Sans Thai'";
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
const RR = (g, x, y, w, h, r, c) => { g.fillStyle = c; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };
const E = (g, x, y, rx, ry, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
const P = (g, pts, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.closePath(); g.fill(); };
const L = (g, a, b, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); };
const V = (g, x, y, w, h, a, b) => { const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(x, y, w, h); };
const glow = (g, x, y, r, col) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); };
const T = (g, s, x, y, f, c) => { g.font = f; g.fillStyle = c; g.fillText(s, x, y); };
const city = (g, y0, night, seed = 0) => { for (let i = 0; i < 14; i++) { const w = 120 + hash(i + seed) * 120, h = 200 + hash(i * 3 + seed) * 380, x = i * 150 - 40; R(g, x, y0 - h, w, h, night ? '#1a2234' : '#8a98a8'); for (let r = 0; r < h / 44 - 1; r++) for (let c = 0; c < w / 34 - 1; c++) if (!night || hash(i * 97 + r * 7 + c) > .55) R(g, x + 10 + c * 34, y0 - h + 12 + r * 44, 18, 24, night ? '#e8c87a' : '#b8c8d8'); } };

// a small rented room (age 15 at home; age 22 alone): a mattress, a fan, a wall that fills with notes
export function room(g, t, o = {}) {
  const n = o.night;
  V(g, 0, 0, W, H, n ? '#2a2e3a' : '#9aa4a0', n ? '#1a1e28' : '#7a847e'); R(g, 0, 820, W, 260, n ? '#2a241e' : '#6a5a48');
  R(g, 1280, 200, 360, 300, n ? '#101828' : '#b8d0dc'); R(g, 1452, 200, 14, 300, '#5a5048'); R(g, 1280, 344, 360, 12, '#5a5048'); if (n) city(g, 500, true, 3);
  P(g, [[160, 880], [760, 880], [800, 960], [120, 960]], n ? '#4a5a7a' : '#6a7a9a'); R(g, 120, 940, 680, 30, n ? '#2a3448' : '#4a5670');   // mattress
  R(g, 980, 640, 40, 200, '#3a3a3e'); E(g, 1000, 620, 60, 60, '#5a5a62'); for (let k = 0; k < 3; k++) { const a = t * 12 + k * 2.1; L(g, [1000, 620], [1000 + Math.cos(a) * 50, 620 + Math.sin(a) * 50], 10, '#8a8a92'); }   // fan
  for (let i = 0; i < (o.notes || 0); i++) { const x = 230 + (i % 10) * 92 + (hash(i) - .5) * 16, y = 230 + Math.floor(i / 10) * 96 + (hash(i + 7) - .5) * 14; g.save(); g.translate(x, y); g.rotate((hash(i + 3) - .5) * .3); R(g, -36, -30, 72, 60, ['#f2e8a0', '#f4f0e4', '#f2c8c0', '#c8e0f0'][i % 4]); g.fillStyle = 'rgba(40,40,60,.55)'; for (let l = 0; l < 3; l++) g.fillRect(-26, -16 + l * 12, 52, 3); g.restore(); }
  for (let i = 0; i < Math.min(o.notes || 0, 20); i++) { const a = [230 + (i % 10) * 92, 230 + Math.floor(i / 10) * 96], b = [230 + ((i + 3) % 10) * 92, 230 + Math.floor(((i + 3) % 20) / 10) * 96]; L(g, a, b, 2, 'rgba(200,50,50,.5)'); }   // red strings between the notes
  if (n) glow(g, 600, 700, 500, 'rgba(255,220,160,.12)');
}
// the scheme's seminar: a stage, a banner, rows of hopeful people
export function seminar(g, t) {
  V(g, 0, 0, W, H, '#2a1e3a', '#1a1428'); R(g, 0, 760, W, 320, '#3a2a48');
  R(g, 360, 120, 1200, 160, '#6a3a8a'); T(g, 'รวยเร็ว ไม่ต้องทำอะไร', 520, 230, `800 84px ${TH}`, '#f2d070'); T(g, 'สัมมนาธุรกิจเครือข่าย · ลงทุน ๑๒,๐๐๐ ได้คืน ๓ เท่าใน ๖ เดือน', 520, 270, `500 24px ${TH}`, '#e8e0f0');
  R(g, 300, 560, 1320, 40, '#4a3a5a'); R(g, 300, 600, 1320, 160, '#3a2a48');   // the stage
  for (const x of [520, 1400]) { const gr = g.createLinearGradient(x, 0, x, 760); gr.addColorStop(0, 'rgba(255,240,200,.35)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); g.fillStyle = gr; P(g, [[x - 20, 0], [x + 20, 0], [x + 220, 760], [x - 220, 760]], gr); }
  for (let i = 0; i < 30; i++) { const x = 60 + (i % 10) * 190, y = 820 + Math.floor(i / 10) * 90; E(g, x, y, 34, 40, ['#2a2a32', '#3a2a2a', '#2a3236'][i % 3]); E(g, x, y - 60, 24, 26, ['#1a1414', '#2a2020', '#3a3a3a'][i % 3]); }   // the audience from behind
}
// the scheme's office, shut: a roller door, a notice, people outside
export function shutOffice(g, t) {
  V(g, 0, 0, W, H, '#8a9aa8', '#c8ccc8'); R(g, 0, 860, W, 220, '#6a6a66');
  R(g, 400, 160, 1120, 700, '#b8a890'); R(g, 400, 160, 1120, 100, '#6a3a8a'); T(g, 'โอ อินเตอร์ กรุ๊ป', 640, 232, `800 60px ${TH}`, '#f2d070');
  R(g, 520, 320, 880, 540, '#7a7a80'); for (let i = 0; i < 26; i++) R(g, 520, 330 + i * 20, 880, 4, '#5a5a62');
  g.save(); g.translate(960, 560); g.rotate(-.04); R(g, -190, -110, 380, 220, '#f2eee0'); R(g, -190, -110, 380, 56, '#c8322c'); T(g, 'ปิดกิจการ', -100, -68, `800 44px ${TH}`, '#fff'); T(g, 'ติดต่อเจ้าหน้าที่ตำรวจ', -150, 10, `600 30px ${TH}`, '#2a2a2a'); T(g, 'สน.บางรัก', -80, 60, `600 28px ${TH}`, '#2a2a2a'); g.restore();
}
// a restaurant (Pan waits tables at 22)
export function restaurant(g, t) {
  V(g, 0, 0, W, H, '#c8a878', '#9a7a52'); R(g, 0, 780, W, 300, '#7a5a3a'); for (let i = 0; i < 12; i++) L(g, [i * 170, 780], [i * 170 - 120, 1080], 2, 'rgba(0,0,0,.12)');
  for (let i = 0; i < 5; i++) { E(g, 300 + i * 340, 80, 40, 18, '#f2e0b0'); glow(g, 300 + i * 340, 100, 220, 'rgba(255,220,150,.25)'); L(g, [300 + i * 340, 0], [300 + i * 340, 64], 3, '#3a2a1e'); }
  R(g, 80, 260, 520, 300, '#4a3a2a'); T(g, 'เมนูวันนี้', 120, 320, `700 40px ${TH}`, '#f2e8c8'); for (let i = 0; i < 5; i++) R(g, 120, 350 + i * 40, 300, 6, 'rgba(242,232,200,.5)');
  for (const x of [880, 1480]) { R(g, x - 160, 740, 320, 16, '#e8e2d4'); R(g, x - 150, 756, 300, 70, '#e8e2d4'); R(g, x - 130, 826, 12, 80, '#4a3a2a'); R(g, x + 118, 826, 12, 80, '#4a3a2a'); E(g, x - 60, 734, 44, 10, '#f8f8f4'); E(g, x + 60, 734, 44, 10, '#f8f8f4'); }
}
// the pawnshop: barred counter, things on shelves, an old fan, a red sign
export function pawnshop(g, t, o = {}) {
  V(g, 0, 0, W, H, '#5a4a38', '#3a2e22'); R(g, 0, 820, W, 260, '#4a3a2a');
  R(g, 0, 0, W, 110, '#a8322c'); T(g, 'โรงรับจำนำ กิมเฮง', 600, 78, `800 60px ${TH}`, '#f2d070');
  for (let r = 0; r < 3; r++) { R(g, 80, 260 + r * 160, 820, 12, '#2a2018'); for (let i = 0; i < 7; i++) { const x = 100 + i * 112, y = 180 + r * 160; [() => { R(g, x, y + 20, 80, 60, '#2a2a30'); R(g, x + 8, y + 28, 64, 40, '#3a5a6a'); }, () => { E(g, x + 40, y + 50, 34, 30, '#c8a83a'); }, () => { R(g, x + 20, y, 40, 80, '#6a4a2a'); }, () => { E(g, x + 40, y + 50, 30, 30, '#d8d0c0'); L(g, [x + 40, y + 50], [x + 40, y + 30], 3, '#3a3a3a'); }][(i + r) % 4](); } }
  R(g, 1000, 560, 860, 260, '#6a4a2a'); for (let i = 0; i < 18; i++) R(g, 1010 + i * 48, 220, 6, 340, '#2a2a2a'); R(g, 1000, 214, 860, 12, '#2a2a2a');   // the barred counter
  E(g, 1650, 520, 70, 70, '#3a3a40'); for (let k = 0; k < 3; k++) { const a = t * 6 + k * 2.1; L(g, [1650, 520], [1650 + Math.cos(a) * 58, 520 + Math.sin(a) * 58], 12, '#6a6a72'); }
  if (o.box) { R(g, 1300, 470, 220, 90, '#8a6a46'); R(g, 1300, 470, 220, 14, '#6a4e32'); }
  glow(g, 1400, 300, 600, 'rgba(255,210,150,.18)');
}
// the startup office (24–25): desks, laptops, a city window, boxes ready to ship
export function office(g, t, o = {}) {
  V(g, 0, 0, W, H, '#e8ecee', '#d0d6d8'); R(g, 0, 800, W, 280, '#b8b0a4');
  R(g, 1100, 120, 760, 520, '#9ab4c8'); city(g, 640, false, 8); R(g, 1100, 120, 760, 520, 'rgba(255,255,255,.15)'); for (let i = 0; i < 4; i++) R(g, 1100 + i * 190, 120, 8, 520, '#7a8a96');
  for (const x of [240, 640]) { R(g, x - 160, 700, 320, 16, '#e8e2d4'); R(g, x - 150, 716, 10, 100, '#8a8a8a'); R(g, x + 140, 716, 10, 100, '#8a8a8a'); RR(g, x - 70, 630, 140, 76, 6, '#2a2a30'); R(g, x - 62, 638, 124, 60, '#4a8ab0'); }
  for (let i = 0; i < 9; i++) { R(g, 960 + (i % 3) * 90, 780 - Math.floor(i / 3) * 70, 80, 64, '#b8945a'); R(g, 960 + (i % 3) * 90, 780 - Math.floor(i / 3) * 70, 80, 10, '#9a7840'); }
  R(g, 80, 200, 420, 260, '#fff'); T(g, 'ยอดขาย', 110, 250, `700 34px ${TH}`, '#2a2a30'); g.strokeStyle = '#3a9a5a'; g.lineWidth = 6; g.beginPath(); for (let i = 0; i < 8; i++) { const x = 110 + i * 52, y = 430 - Math.pow(i / 7, 2) * 170 * (o.grow ?? 1); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
}
// a meeting room: a long table, chairs, a wall screen
export function meeting(g, t, o = {}) {
  V(g, 0, 0, W, H, '#3a4048', '#2a2e34'); R(g, 0, 820, W, 260, '#2a2a2e');
  R(g, 660, 140, 600, 340, '#1a1e24'); R(g, 676, 156, 568, 308, '#3a5a7a'); T(g, o.a || 'วาระที่ ๓', 720, 230, `700 40px ${TH}`, '#e8eef6'); T(g, o.b || 'ปลดกรรมการผู้จัดการ', 720, 300, `700 48px ${TH}`, '#f2a24e');
  P(g, [[360, 640], [1560, 640], [1760, 820], [160, 820]], '#5a4430'); P(g, [[360, 640], [1560, 640], [1570, 656], [350, 656]], '#6a5440');
  glow(g, 960, 200, 700, 'rgba(200,220,255,.12)');
}
// a condo at night: big windows on the city, bottles on the table (the fall)
export function condo(g, t, o = {}) {
  V(g, 0, 0, W, H, '#0e1220', '#1a1e2a'); R(g, 300, 100, 1320, 600, '#0a0e18'); city(g, 700, true, 5); for (let i = 0; i < 6; i++) R(g, 300 + i * 264, 100, 10, 600, '#2a2e3a');
  R(g, 0, 760, W, 320, '#1a1a20'); R(g, 560, 720, 800, 20, '#3a3026'); R(g, 580, 740, 14, 120, '#2a2218'); R(g, 1326, 740, 14, 120, '#2a2218');
  for (let i = 0; i < (o.bottles ?? 6); i++) { const x = 620 + i * 110 + hash(i) * 30, tall = hash(i + 4) > .5; R(g, x, tall ? 610 : 650, 30, tall ? 110 : 70, ['#3a6a3a', '#6a4a2a', '#c8c8c0'][i % 3]); R(g, x + 9, tall ? 580 : 630, 12, 30, '#2a2a2a'); }
  if (o.screen) { RR(g, 1000, 600, 220, 130, 6, '#1a1a1e'); R(g, 1010, 610, 200, 110, '#2a4a8a'); glow(g, 1110, 650, 300, 'rgba(80,140,255,.3)'); }
}
// a footbridge in the rain: concrete stairs, a streetlight, cars' lights below
export function footbridge(g, t) {
  V(g, 0, 0, W, H, '#1a2230', '#2a3240'); city(g, 600, true, 11);
  R(g, 0, 380, W, 70, '#4a4e56'); R(g, 0, 370, W, 14, '#5a5e66'); for (let i = 0; i < 40; i++) R(g, i * 50, 300, 6, 76, '#3a3e46');   // the bridge deck and rail
  for (const x of [300, 1500]) R(g, x, 450, 60, 400, '#3a3e46');
  R(g, 0, 850, W, 230, '#2a2c30'); for (let i = 0; i < 10; i++) { const x = ((t * 400 + i * 300) % 2400) - 200; E(g, x, 940, 60, 10, 'rgba(255,240,200,.5)'); E(g, x + 100, 960, 30, 8, 'rgba(255,80,60,.5)'); }
  R(g, 1700, 100, 14, 750, '#2a2a2e'); E(g, 1660, 110, 50, 14, '#f2e8c0'); glow(g, 1660, 160, 420, 'rgba(255,230,170,.25)');
  P(g, [[360, 850], [420, 450], [480, 450], [460, 850]], '#3a3e46');
}
// a funeral: white flowers, the portrait, candles
export function funeral(g, t) {
  V(g, 0, 0, W, H, '#e8e8e4', '#c8c8c4'); R(g, 0, 820, W, 260, '#a8a8a4');
  R(g, 760, 180, 400, 480, '#2a2a2a'); R(g, 780, 200, 360, 440, '#d8d0c0'); E(g, 960, 380, 90, 110, '#d8b08a'); R(g, 860, 470, 200, 170, '#e8e4dc'); g.strokeStyle = '#2a2a2a'; g.lineWidth = 3; g.beginPath(); g.ellipse(930, 370, 20, 16, 0, 0, 7); g.stroke(); g.beginPath(); g.ellipse(990, 370, 20, 16, 0, 0, 7); g.stroke();
  for (let i = 0; i < 40; i++) { const x = 560 + (i % 20) * 42, y = 690 + Math.floor(i / 20) * 40; E(g, x, y, 22, 18, '#f8f8f4'); E(g, x, y, 8, 6, '#e8e0a0'); }
  for (const x of [640, 1280]) { R(g, x, 560, 16, 100, '#f2eee0'); E(g, x + 8, 548, 6, 12, '#f2c060'); glow(g, x + 8, 548, 80, 'rgba(255,200,120,.4)'); }
}
// คุณธนา's tower office: glass, the city far below
export function tower(g, t) {
  V(g, 0, 0, W, H, '#c8d8e8', '#e8eef4'); city(g, 900, false, 21); R(g, 0, 0, W, H, 'rgba(255,255,255,.18)'); for (let i = 0; i < 7; i++) R(g, i * 320, 0, 12, 860, '#5a6470');
  R(g, 0, 860, W, 220, '#2a2e36'); P(g, [[620, 760], [1300, 760], [1360, 860], [560, 860]], '#3a2e24'); R(g, 1500, 520, 260, 340, '#2a2e36');
}
// Nun's small café: a counter, cups, a chalk menu, warm light
export function cafe(g, t) {
  V(g, 0, 0, W, H, '#e8dcc4', '#c8b898'); R(g, 0, 800, W, 280, '#8a6a4a');
  R(g, 240, 140, 560, 340, '#2a3a34'); T(g, 'ร้านนุ่น', 300, 220, `700 56px ${TH}`, '#f2eee0'); for (let i = 0; i < 4; i++) R(g, 300, 260 + i * 46, 360, 5, 'rgba(242,238,224,.6)');
  R(g, 900, 560, 900, 240, '#a07a52'); R(g, 900, 560, 900, 14, '#7a5a3a'); for (let i = 0; i < 6; i++) { R(g, 960 + i * 130, 500, 50, 60, '#f2f2ee'); E(g, 985 + i * 130, 500, 25, 6, '#e8e2d4'); }
  for (let i = 0; i < 4; i++) { E(g, 1100 + i * 200, 90, 30, 16, '#f2d090'); glow(g, 1100 + i * 200, 110, 200, 'rgba(255,210,140,.3)'); }
}
