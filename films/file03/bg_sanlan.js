// "แสนล้าน" · places for chapter 1 (2547, a canal community in Bangkok): the shack, mum's curry stall by the canal,
// grandma's corner under the oil lamp, the classroom, the school gate. 1920×1080, deterministic, flat with soft light.
const W = 1920, H = 1080, TH = "'IBM Plex Sans Thai'";
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
const R = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
const RR = (g, x, y, w, h, r, c) => { g.fillStyle = c; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };
const E = (g, x, y, rx, ry, c, rot = 0) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fill(); };
const P = (g, pts, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(...pts[0]); for (const p of pts.slice(1)) g.lineTo(...p); g.closePath(); g.fill(); };
const L = (g, a, b, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); };
const V = (g, x, y, w, h, a, b) => { const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(x, y, w, h); };
const glow = (g, x, y, r, col) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); };
const planks = (g, x, y, w, h, c, n = 12) => { R(g, x, y, w, h, c); for (let i = 0; i < n; i++) { g.fillStyle = `rgba(0,0,0,${.06 + .06 * hash(i + x)})`; g.fillRect(x + i * w / n, y, 3, h); } };

// the shack, inside, early morning: plank walls, a tin roof leaking in three places into bowls, mum's stove by the door
export function shack(g, t, o = {}) {
  V(g, 0, 0, W, H, '#6a5a48', '#4a3e30');
  planks(g, 0, 120, W, 700, '#7a6450', 22);
  P(g, [[0, 0], [W, 0], [W, 140], [0, 170]], '#5a5a5e'); for (let i = 0; i < 24; i++) L(g, [i * 84, 0], [i * 84 - 10, 160], 3, 'rgba(0,0,0,.18)');   // corrugated tin roof
  R(g, 0, 160, W, 14, '#4a3a2a');
  // a window of wire mesh, morning light, the canal behind
  R(g, 1180, 260, 360, 240, '#3a2e22'); V(g, 1196, 276, 328, 208, '#d8e0d0', '#a8b8a8'); R(g, 1196, 420, 328, 64, '#7a8a6a'); for (let i = 0; i < 6; i++) E(g, 1220 + i * 56, 400, 34, 26, '#6a8a5a');
  g.strokeStyle = 'rgba(40,40,40,.35)'; g.lineWidth = 1; for (let i = 0; i < 18; i++) { g.beginPath(); g.moveTo(1196 + i * 18, 276); g.lineTo(1196 + i * 18, 484); g.stroke(); g.beginPath(); g.moveTo(1196, 276 + i * 12); g.lineTo(1524, 276 + i * 12); g.stroke(); }
  // things on the walls: a calendar 2547, a school bag on a nail, clothes on a line, a small shrine shelf
  R(g, 300, 260, 120, 160, '#efe8d8'); R(g, 300, 260, 120, 34, '#c8322c'); g.fillStyle = '#fff'; g.font = `700 22px ${TH}`; g.fillText('๒๕๔๗', 326, 285); g.fillStyle = '#5a5a5a'; for (let i = 0; i < 20; i++) g.fillRect(312 + (i % 5) * 20, 306 + Math.floor(i / 5) * 24, 12, 12);
  L(g, [600, 230], [1000, 250], 2, '#3a3a3a'); for (let i = 0; i < 4; i++) { const x = 640 + i * 90; P(g, [[x, 236], [x + 60, 238], [x + 56, 330], [x + 4, 328]], ['#c8443a', '#3a6a9a', '#e8d8b0', '#5a8a4a'][i]); }
  R(g, 1640, 230, 160, 14, '#5a4430'); R(g, 1690, 180, 60, 50, '#c8a83a'); E(g, 1720, 176, 20, 14, '#e8c040'); E(g, 1660, 222, 6, 10, '#e8e0c8');
  E(g, 470, 440, 6, 6, '#3a3a3a'); RR(g, 440, 446, 64, 80, 8, '#3a5a8a');
  // floor: worn planks, a sleeping mat, a mosquito net folded, bowls catching drips
  V(g, 0, 820, W, 260, '#6a5440', '#4a3a2c'); for (let i = 0; i < 8; i++) L(g, [0, 840 + i * 32], [W, 836 + i * 34], 2, 'rgba(0,0,0,.14)');
  P(g, [[200, 930], [760, 920], [800, 1000], [160, 1012]], '#c8a870'); for (let i = 0; i < 12; i++) L(g, [210 + i * 48, 926], [180 + i * 52, 1006], 2, 'rgba(120,80,40,.35)');
  for (const [x, f] of [[540, 0], [980, .3], [1420, .6]]) { E(g, x, 900, 46, 14, '#9aa0a8'); E(g, x, 896, 38, 9, '#6a7a8a'); const ph = ((t * .9 + f) % 1); E(g, x, 180 + ph * 700, 5, 9, `rgba(170,200,230,${.8 * (1 - ph * .2)})`); if (ph > .92) { g.strokeStyle = 'rgba(170,200,230,.6)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, 896, 12 + (ph - .92) * 300, 4, 0, 0, 7); g.stroke(); } E(g, x, 176, 8, 5, 'rgba(170,200,230,.6)'); }
  // the stove by the door: a charcoal brazier, a big pot, steam
  R(g, 1640, 560, 220, 260, '#3a2e24'); R(g, 1640, 560, 220, 14, '#2a2018'); E(g, 1740, 760, 70, 30, '#7a4a2a'); E(g, 1740, 752, 56, 20, '#e8642a'); glow(g, 1740, 752, 140, 'rgba(255,140,60,.35)');
  RR(g, 1670, 640, 140, 110, 20, '#9a9aa0'); E(g, 1740, 642, 70, 16, '#7a7a80');
  for (let k = 0; k < 5; k++) { const ph = (t * .4 + k * .2) % 1; E(g, 1730 + Math.sin(ph * 6 + k) * 20, 620 - ph * 260, 24 + ph * 40, 16 + ph * 24, `rgba(255,255,255,${.3 * (1 - ph)})`); }
  // morning light through the window
  g.save(); g.globalCompositeOperation = 'screen'; const gr = g.createLinearGradient(1360, 300, 900, 1000); gr.addColorStop(0, 'rgba(255,230,180,.28)'); gr.addColorStop(1, 'rgba(255,230,180,0)'); g.fillStyle = gr; P(g, [[1200, 280], [1520, 280], [1300, 1080], [700, 1080]], gr); g.restore();
}

// mum's curry stall by the canal, late morning: a wooden counter of curry pots, plastic stools and tables, the canal and the houses on stilts
export function curryStall(g, t) {
  V(g, 0, 0, W, 420, '#bcd4dc', '#e8e2c8');
  for (let i = 0; i < 9; i++) { const x = i * 230 - 40, h = 140 + hash(i) * 80; R(g, x, 420 - h, 200, h, ['#a89a82', '#9a8a70', '#b8a888'][i % 3]); P(g, [[x - 10, 420 - h], [x + 100, 380 - h], [x + 210, 420 - h]], ['#7a4a3a', '#5a6a7a', '#8a5a3a'][i % 3]); R(g, x + 60, 440 - h, 50, 50, '#4a5a62'); for (let k = 0; k < 4; k++) R(g, x + 20 + k * 50, 420, 8, 120, '#5a4a3a'); }   // houses on stilts across the canal
  V(g, 0, 520, W, 140, '#6a8a7a', '#4a6a5a'); for (let i = 0; i < 14; i++) { const x = ((i * 160 + t * 20) % (W + 200)) - 100; L(g, [x, 560 + (i % 3) * 30], [x + 80, 560 + (i % 3) * 30], 3, 'rgba(255,255,255,.18)'); }   // the canal
  P(g, [[1460, 600], [1700, 600], [1660, 630], [1490, 630]], '#7a5a3a');   // a long-tail boat moored
  V(g, 0, 640, W, 440, '#9a8a70', '#7a6a54'); R(g, 0, 640, W, 10, '#5a4a3a');   // the walkway
  // the stall: a roof of tin on poles, a counter with trays of curry, a sign
  R(g, 120, 260, 900, 30, '#8a8a8e'); for (const x of [140, 990]) R(g, x, 290, 14, 400, '#5a4a3a');
  R(g, 160, 230, 520, 54, '#e8d8b0'); g.fillStyle = '#c8322c'; g.font = `700 40px ${TH}`; g.fillText('ข้าวแกง ๑๕ บาท', 200, 272);
  R(g, 160, 560, 820, 140, '#a07a52'); R(g, 160, 560, 820, 16, '#7a5a3a');
  for (let i = 0; i < 6; i++) { const x = 210 + i * 128; RR(g, x, 500, 108, 64, 10, '#c8c8cc'); E(g, x + 54, 506, 50, 12, ['#c8642a', '#7a9a3a', '#d8a83a', '#8a3a2a', '#e8c070', '#5a7a3a'][i]); }
  RR(g, 900, 470, 70, 90, 8, '#e8e8e8'); E(g, 935, 474, 35, 10, '#f8f8f4'); for (let k = 0; k < 3; k++) { const ph = (t * .5 + k * .33) % 1; E(g, 930, 460 - ph * 120, 16 + ph * 20, 10 + ph * 14, `rgba(255,255,255,${.35 * (1 - ph)})`); }   // the rice pot
  // tables and stools in front
  for (const x of [1180, 1560]) { R(g, x, 760, 260, 14, '#d8d0c0'); R(g, x + 20, 774, 10, 120, '#8a8a8a'); R(g, x + 230, 774, 10, 120, '#8a8a8a'); for (const sx of [x - 40, x + 290]) { R(g, sx - 30, 820, 60, 10, '#c8322c'); R(g, sx - 24, 830, 6, 60, '#c8322c'); R(g, sx + 18, 830, 6, 60, '#c8322c'); } E(g, x + 70, 754, 34, 10, '#f2f2ee'); E(g, x + 190, 754, 34, 10, '#f2f2ee'); }
  // the dish basin where Pan washes up
  E(g, 1040, 860, 90, 26, '#3a6aa8'); E(g, 1040, 852, 76, 16, '#7aa8c8'); for (let i = 0; i < 4; i++) E(g, 1000 + i * 26, 850, 16, 5, '#f2f2ee');
  g.save(); g.globalCompositeOperation = 'screen'; glow(g, 1500, 120, 700, 'rgba(255,236,190,.25)'); g.restore();
}

// night: grandma's corner under an oil lamp, a coin jar, a small low table, the dark around
export function lampCorner(g, t, flick = 1) {
  R(g, 0, 0, W, H, '#1a140e'); planks(g, 0, 120, W, 760, '#2e241a', 22); V(g, 0, 860, W, 220, '#2a2016', '#1a140e');
  R(g, 700, 700, 520, 24, '#5a3e28'); R(g, 720, 724, 18, 90, '#4a3220'); R(g, 1182, 724, 18, 90, '#4a3220');   // the low table
  // the lamp
  const fl = .85 + .15 * Math.sin(t * 9) * Math.sin(t * 3.3) * flick;
  RR(g, 940, 600, 40, 100, 8, '#c8a050'); E(g, 960, 600, 26, 12, '#e8c070'); E(g, 960, 570, 8 * fl, 18 * fl, '#fff4c8'); E(g, 960, 576, 4, 9, '#ffb84a');
  g.save(); g.globalCompositeOperation = 'screen'; glow(g, 960, 580, 720 * fl, 'rgba(255,190,110,.42)'); glow(g, 960, 580, 220, 'rgba(255,220,160,.35)'); g.restore();
  // the coin jar and the coins in rows on the table
  RR(g, 1080, 620, 70, 84, 12, 'rgba(200,220,220,.5)'); for (let i = 0; i < 9; i++) E(g, 1094 + (i % 3) * 20, 690 - Math.floor(i / 3) * 10, 9, 4, '#d8b040');
  for (let i = 0; i < 17; i++) { const x = 780 + (i % 6) * 26, y = 690 - Math.floor(i / 6) * 4; E(g, x, y, 10, 4, '#e0b040'); E(g, x, y - 1, 6, 2, '#f2d070'); }
  // a picture of grandpa, a fan, the dark doorway
  R(g, 420, 300, 120, 150, '#5a4430'); R(g, 432, 312, 96, 126, '#8a7a62'); E(g, 480, 360, 22, 28, '#6a5a48');
  R(g, 1480, 260, 200, 560, '#0e0a08');
}

// the classroom: a green board, wooden desks in rows, windows with fans, a flag
export function classroom(g, t) {
  V(g, 0, 0, W, H, '#e8e2cc', '#d8d0b8'); R(g, 0, 700, W, 380, '#b89a72'); R(g, 0, 690, W, 12, '#8a6a4a');
  R(g, 420, 160, 1080, 400, '#3a5a46'); R(g, 404, 146, 1112, 16, '#8a6a4a'); R(g, 404, 560, 1112, 16, '#8a6a4a');
  g.fillStyle = 'rgba(255,255,255,.85)'; g.font = `600 52px ${TH}`; g.fillText('โตขึ้นหนูอยากเป็นอะไร', 560, 300); g.font = `500 34px ${TH}`; g.fillText('วันพุธที่ ๑๖ มิถุนายน ๒๕๔๗', 560, 380);
  for (const x of [60, 1580]) { R(g, x, 180, 280, 300, '#a8c8d8'); R(g, x, 320, 280, 8, '#8a6a4a'); R(g, x + 136, 180, 8, 300, '#8a6a4a'); }
  E(g, 960, 60, 90, 14, '#7a7a80'); for (let k = 0; k < 3; k++) { const a = t * 10 + k * 2.09; E(g, 960 + Math.cos(a) * 70, 60, Math.abs(Math.cos(a)) * 70 + 6, 6, '#9a9aa0'); }
  R(g, 1600, 520, 8, 160, '#5a5a5a'); R(g, 1608, 520, 90, 18, '#c8322c'); R(g, 1608, 538, 90, 18, '#f2f2ee'); R(g, 1608, 556, 90, 18, '#2a4a8a');
}
export function desks(g, rows = [[880, 1], [1000, 1.12]]) {   // drawn over the children (front rows)
  for (const [y, s] of rows) for (let i = 0; i < 4; i++) { const x = 250 + i * 440; R(g, x - 120 * s, y - 70 * s, 240 * s, 20 * s, '#9a7448'); R(g, x - 120 * s, y - 50 * s, 240 * s, 70 * s, '#8a6440'); }
}

// the school gate in the afternoon: a fence, the gate, a tamarind tree, a snack cart, kids going home
export function schoolGate(g, t) {
  V(g, 0, 0, W, H, '#c8dce4', '#ece4cc');
  R(g, 200, 220, 900, 380, '#e8dcc0'); R(g, 200, 200, 900, 30, '#c8322c'); g.fillStyle = '#fff'; g.font = `700 34px ${TH}`; g.fillText('โรงเรียนวัดริมคลอง', 460, 228);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) R(g, 240 + i * 140, 270 + r * 150, 90, 100, '#8aa8b8');
  R(g, 0, 640, W, 440, '#b8ac94'); R(g, 0, 620, W, 24, '#9a8e78');
  for (let i = 0; i < 40; i++) R(g, i * 50, 500, 8, 140, '#4a6a5a'); R(g, 0, 520, W, 8, '#4a6a5a'); R(g, 0, 590, W, 8, '#4a6a5a');
  R(g, 1180, 420, 24, 220, '#4a6a5a'); R(g, 1500, 420, 24, 220, '#4a6a5a');   // the gate posts (open)
  R(g, 1640, 300, 40, 340, '#6a4a32'); for (let i = 0; i < 9; i++) E(g, 1600 + hash(i) * 200, 220 + hash(i + 3) * 120, 90, 60, ['#5a8a4a', '#4a7a3e', '#6a9a52'][i % 3]);   // a tamarind tree
  g.save(); g.globalCompositeOperation = 'screen'; glow(g, 400, 100, 800, 'rgba(255,230,180,.22)'); g.restore();
}
// Pan's snack basket
export function basket(g, x, y, s = 1, n = 6) { g.save(); g.translate(x, y); g.scale(s, s); P(g, [[-50, -20], [50, -20], [40, 20], [-40, 20]], '#b8945a'); for (let i = 0; i < n; i++) RR(g, -42 + (i % 3) * 28, -40 + Math.floor(i / 3) * 12, 24, 16, 4, ['#e8c040', '#c8443a', '#5a9a4a'][i % 3]); g.restore(); }
