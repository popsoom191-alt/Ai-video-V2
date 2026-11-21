// FILE 03 · round-2 props and places: Nid's car (side and through the windscreen), city traffic, the lift barrier, the open
// padlock and chain, the missing-child poster, the enhance screen, a CCTV dome, a radio. Same flat style as bg.js.
const W = 1920, H = 1080, TH = "'IBM Plex Sans Thai'";
const rect = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
const rr = (g, x, y, w, h, r, c) => { g.fillStyle = c; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };
const el = (g, x, y, rx, ry, c, r = 0) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, r, 0, 7); g.fill(); };
const poly = (g, P, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(...P[0]); for (const p of P.slice(1)) p.length === 4 ? g.quadraticCurveTo(...p) : g.lineTo(...p); g.closePath(); g.fill(); };
const cap = (g, a, b, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); };
const vgrad = (g, x, y, w, h, a, b) => { const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(x, y, w, h); };
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
const lerp = (a, b, u) => a + (b - a) * u;
const wrapX = (x, span) => ((x % span) + span) % span;

// a wheel with a turning rim
function wheel(g, x, y, r, a) { el(g, x, y, r, r, '#18181c'); el(g, x, y, r * .62, r * .62, '#b8bcc4'); el(g, x, y, r * .5, r * .5, '#8a8e96');
  for (let k = 0; k < 5; k++) { const q = a + k * 1.2566; cap(g, [x, y], [x + Math.cos(q) * r * .5, y + Math.sin(q) * r * .5], r * .14, '#d8dce2'); } el(g, x, y, r * .14, r * .14, '#6a6e76'); }

// Nid's car: a silver-blue sedan, side view, facing right. o: { wheel, doors: [front 0..1, back 0..1], heads: [[x, colour], ...], lights }
export function sedan(g, x, y, s = 1, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, Math.abs(s));
  el(g, 0, 6, 330, 18, 'rgba(0,0,0,.28)');
  const body = '#5a7a9a', dark = '#3e5670', lite = '#8aa8c4';
  poly(g, [[-320, -40], [-318, -96], [-260, -112], [-170, -118], [-110, -190], [90, -192], [170, -122], [290, -108], [324, -80], [326, -40]], body);   // body and cabin
  poly(g, [[-320, -40], [-318, -70], [326, -66], [326, -40]], dark);
  poly(g, [[-98, -180], [-18, -182], [-18, -124], [-160, -120]], '#a8c4d8'); poly(g, [[-6, -182], [84, -182], [150, -124], [-6, -124]], '#a8c4d8');   // windows
  for (const [hx, col] of o.heads || []) { el(g, hx, -142, 20, 24, '#d9a07a'); poly(g, [[hx - 22, -150], [hx - 20, -172, hx, -174], [hx + 20, -172, hx + 21, -152]], col); }
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.moveTo(-80, -180); g.lineTo(-50, -180); g.lineTo(-110, -124); g.lineTo(-140, -124); g.closePath(); g.fill(); g.beginPath(); g.moveTo(30, -182); g.lineTo(52, -182); g.lineTo(0, -124); g.lineTo(-22, -124); g.closePath(); g.fill();
  rect(g, -18, -184, 12, 62, dark);
  poly(g, [[-300, -100], [300, -104], [300, -96], [-300, -92]], lite);   // a highlight along the shoulder
  g.strokeStyle = dark; g.lineWidth = 3; g.beginPath(); g.moveTo(-160, -118); g.lineTo(-168, -46); g.moveTo(-12, -122); g.lineTo(-12, -44); g.moveTo(150, -120); g.lineTo(156, -46); g.stroke();   // door seams
  rect(g, -110, -96, 34, 7, '#c8ccd4'); rect(g, 40, -96, 34, 7, '#c8ccd4');   // handles
  // open doors swing toward us: drawn as a panel widening outward
  const [df = 0, db = 0] = o.doors || [];
  if (db > 0) { poly(g, [[-160, -122], [-160 - 70 * db, -128], [-166 - 74 * db, -40], [-166, -44]], lite); }
  if (df > 0) { poly(g, [[-12, -124], [-12 + 90 * df, -130], [-8 + 94 * df, -42], [-12, -44]], lite); }
  el(g, 312, -86, 14, 10, o.lights ? '#fff4c8' : '#e8e4d0'); el(g, -314, -84, 10, 12, '#c8322c');   // head and tail lights
  if (o.lights) { const gr = g.createRadialGradient(330, -86, 0, 330, -86, 260); gr.addColorStop(0, 'rgba(255,240,190,.45)'); gr.addColorStop(1, 'rgba(255,240,190,0)'); g.fillStyle = gr; g.fillRect(320, -260, 280, 360); }
  rect(g, 240, -62, 70, 18, '#e8e8ea'); g.fillStyle = '#2a2a30'; g.font = `700 13px ${TH}`; g.fillText('กท ๑๙๙๗', 248, -48);   // plate
  for (const wx of [-210, 210]) { el(g, wx, -40, 66, 54, dark); wheel(g, wx, -30, 50, o.wheel || 0); }
  g.restore();
}

// other traffic, all facing right (pass s < 0 to face left)
export function vehicle(g, kind, x, y, s, t) {
  g.save(); g.translate(x, y); g.scale(s, Math.abs(s)); el(g, 0, 6, kind === 'bus' ? 420 : 200, 14, 'rgba(0,0,0,.25)');
  const wa = t * 14;
  if (kind === 'taxi') { poly(g, [[-220, -36], [-216, -90], [-120, -104], [-70, -160], [90, -162], [150, -104], [222, -92], [224, -36]], '#e86a9a'); poly(g, [[-62, -152], [-6, -152], [-6, -108], [-110, -104]], '#a8c4d8'); poly(g, [[6, -152], [80, -152], [130, -106], [6, -106]], '#a8c4d8'); rr(g, -40, -186, 80, 24, 6, '#f2e8a8'); g.fillStyle = '#2a2a30'; g.font = `700 16px ${TH}`; g.fillText('TAXI', -20, -168); for (const wx of [-140, 150]) wheel(g, wx, -30, 38, wa); }
  if (kind === 'bus') { rr(g, -420, -250, 840, 220, 18, '#2a6ab0'); rect(g, -420, -110, 840, 26, '#e8e4d8'); for (let k = 0; k < 8; k++) rr(g, -390 + k * 100, -228, 80, 90, 6, '#a8c4d8'); rect(g, 330, -228, 70, 170, '#1e3a5a'); g.fillStyle = '#fff'; g.font = `700 26px ${TH}`; g.fillText('สาย ๒๙', -360, -60); for (const wx of [-280, 280]) wheel(g, wx, -30, 44, wa); }
  if (kind === 'tuktuk') { poly(g, [[-120, -40], [-120, -150], [60, -170], [110, -150], [130, -40]], '#2a8a5e'); poly(g, [[-130, -170], [100, -186], [120, -160], [-130, -150]], '#1e1e22'); rect(g, 60, -150, 50, 70, '#a8c4d8'); g.fillStyle = '#e8c43a'; g.fillRect(-120, -80, 250, 12); for (const wx of [-80, 100]) wheel(g, wx, -26, 30, wa); }
  if (kind === 'moto') { cap(g, [-70, -40], [70, -40], 14, '#c8322c'); poly(g, [[-60, -70], [40, -78], [60, -50], [-60, -46]], '#c8322c'); cap(g, [50, -76], [76, -116], 6, '#3a3a40'); el(g, -10, -128, 22, 26, '#d9a07a'); el(g, -10, -142, 26, 22, '#e8463c'); poly(g, [[-30, -110], [10, -110], [20, -60], [-40, -60]], '#3a6aa8'); for (const wx of [-70, 70]) wheel(g, wx, -26, 26, wa); }
  g.restore();
}

// a road across the city, parallax layers moving left as the camera tracks a car going right
export function cityRoad(g, t, o = {}) {
  const v = o.speed ?? 1;
  vgrad(g, 0, 0, W, H, '#9ec4dc', '#e4e8e2');
  el(g, 1500, 160, 130, 34, 'rgba(255,255,255,.7)'); el(g, 1620, 140, 90, 26, 'rgba(255,255,255,.7)'); el(g, 400, 120, 160, 36, 'rgba(255,255,255,.6)');
  for (let k = 0; k < 16; k++) { const w = 150 + hash(k) * 140, h = 240 + hash(k + 5) * 360, x = wrapX(k * 210 - t * 60 * v, 3360) - 300; rect(g, x, 760 - h, w, h, '#a4acb6'); for (let r = 0; r < h / 56 - 1; r++) for (let c = 0; c < w / 46 - 1; c++) rect(g, x + 14 + c * 46, 780 - h + r * 56, 24, 28, '#c4ccd6'); }
  for (let k = 0; k < 12; k++) { const w = 260 + hash(k + 30) * 80, h = 260 + hash(k + 40) * 140, x = wrapX(k * 300 - t * 160 * v, 3600) - 300, c = ['#c8b494', '#b8a88a', '#d0bc98', '#a89a82', '#b0b8a8'][k % 5];
    rect(g, x, 780 - h, w, h, c); rect(g, x, 780 - h, w, 12, 'rgba(0,0,0,.12)'); for (let j = 0; j < 3; j++) rect(g, x + 30 + j * 80, 800 - h, 50, 60, '#5a6a72'); rect(g, x + 20, 690, w - 40, 90, ['#2a6ab0', '#c8322c', '#2a8a5e', '#e0a830'][k % 4]); rect(g, x + 20, 690, w - 40, 14, 'rgba(0,0,0,.2)'); }
  rect(g, 0, 780, W, 40, '#a8a49c'); for (let k = 0; k < 30; k++) rect(g, wrapX(k * 90 - t * 300 * v, 2700) - 100, 780, 3, 40, 'rgba(0,0,0,.12)');   // the pavement
  for (let k = 0; k < 6; k++) { const x = wrapX(k * 420 - t * 300 * v, 2520) - 200; rect(g, x, 380, 14, 410, '#7a7a74'); rect(g, x - 40, 420, 94, 8, '#6a6a64'); el(g, x + 200, 640, 80, 70, '#5a8a4a'); el(g, x + 170, 670, 60, 50, '#4a7a3e'); rect(g, x + 196, 680, 10, 110, '#5a4a3a'); }   // poles and trees
  g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; for (let w = 0; w < 3; w++) { g.beginPath(); for (let x = -100; x < W + 100; x += 40) { const y = 420 + w * 8 + Math.sin((x + t * 300 * v) / 420 * Math.PI) * 30; x === -100 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  vgrad(g, 0, 820, W, 260, '#5e5e62', '#4a4a4e'); for (let k = 0; k < 14; k++) rect(g, wrapX(k * 220 - t * 700 * v, 3080) - 200, 940, 120, 10, '#e8e2c8');
}

// through the windscreen: Nid driving (right-hand drive, so on the left of the picture), Beer beside her, the street behind
export function carFront(g, t, draw2) {
  vgrad(g, 0, 0, W, H, '#8ab0c8', '#d8e0e0');
  for (let k = 0; k < 8; k++) { const x = wrapX(k * 320 + t * 260, 2560) - 320; rect(g, x, 160, 240, 520, ['#c8b494', '#b8c0b0', '#d0bc98'][k % 3]); for (let j = 0; j < 6; j++) rect(g, x + 30 + (j % 3) * 70, 200 + Math.floor(j / 3) * 140, 40, 60, '#5a6a72'); }
  g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(0, 0, W, H);
  draw2 && draw2();   // the two of them
  rr(g, -40, 0, 2000, 140, 40, '#3e5670'); rect(g, 0, 860, W, 220, '#2a2e34'); rect(g, 0, 840, W, 30, '#3a3e46');   // roof edge and dashboard
  g.strokeStyle = '#1e1e22'; g.lineWidth = 34; g.beginPath(); g.ellipse(560, 980, 200, 120, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke();   // the steering wheel
  poly(g, [[0, 0], [150, 0], [60, 1080], [0, 1080]], '#3e5670'); poly(g, [[W, 0], [W - 150, 0], [W - 60, 1080], [W, 1080]], '#3e5670');   // pillars
  g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(300, 140); g.lineTo(560, 140); g.lineTo(200, 840); g.lineTo(-60, 840); g.closePath(); g.fill();
  rr(g, 900, 150, 140, 46, 10, '#1e1e22');   // the mirror
}

// the lift on 4: a steel barrier, crossed tape, a sign
export function liftBarrier(g, L = 1) {
  const c = v => `rgba(${v},${v},${v},1)`;
  g.save(); g.globalAlpha = 1;
  for (const x of [600, 1300]) { rect(g, x, 640, 20, 300, '#8a8e90'); rect(g, x - 30, 930, 80, 14, '#6a6e70'); }
  for (const y of [700, 800, 880]) rect(g, 600, y, 720, 16, '#a8acae');
  for (let k = 0; k < 9; k++) rect(g, 640 + k * 80, 700, 8, 196, '#8a8e90');
  for (const [a, b] of [[[540, 380], [1380, 620]], [[540, 620], [1380, 380]]]) { g.save(); const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), len = Math.hypot(b[0] - a[0], b[1] - a[1]); g.translate(...a); g.rotate(ang); rect(g, 0, -18, len, 36, '#e8c43a'); g.fillStyle = '#1a1a1e'; g.font = `700 20px ${TH}`; for (let k = 0; k < 9; k++) g.fillText('ห้ามเข้า', 20 + k * 98, 7); g.restore(); }
  rect(g, 820, 720, 280, 150, '#f2eee0'); rect(g, 820, 720, 280, 40, '#c8322c'); g.fillStyle = '#fff'; g.font = `700 26px ${TH}`; g.fillText('งดใช้ลิฟต์', 892, 750); g.fillStyle = '#2a2a2a'; g.font = `600 24px ${TH}`; g.fillText('ตัดไฟ · ห้ามเข้า', 870, 800); g.fillText('ชั้น ๔', 920, 840);
  g.restore();
}

// the chain across the fire door and its padlock, already open. k: how much of the chain is still on (1 → 0)
export function chainLock(g, dx, dy, dw, k = 1, held = null) {
  if (k > 0) { g.save(); g.strokeStyle = '#9a9aa0'; g.lineWidth = 7; for (let i = 0; i < Math.ceil(3 * k); i++) { g.beginPath(); g.moveTo(dx + 40, dy + 100 + i * 14); g.quadraticCurveTo(dx + dw / 2, dy + 150 + i * 18, dx + dw - 40, dy + 100 + i * 14); g.stroke(); } g.restore(); }
  const [px, py] = held || [dx + dw / 2, dy + 170];
  rr(g, px - 16, py, 32, 30, 5, '#c8a83a'); g.strokeStyle = '#a8a8ae'; g.lineWidth = 6; g.beginPath(); g.arc(px + 6, py - 2, 11, Math.PI, Math.PI * 2.1); g.stroke();   // shackle swung open
  el(g, px, py + 16, 4, 6, '#3a3020');
}
// a coil of chain on the floor
export function chainPile(g, x, y) { g.strokeStyle = '#8a8a90'; g.lineWidth = 6; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(x + i * 6, y - i * 3, 40 - i * 4, 12, 0, 0, 7); g.stroke(); } }

// the missing-child poster
export function missingPoster(g, x, y, s = 1, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rect(g, -6, -6, 232, 312, 'rgba(0,0,0,.2)'); rect(g, 0, 0, 220, 300, '#f2eedc'); rect(g, 0, 0, 220, 50, '#c8322c');
  g.fillStyle = '#fff'; g.font = `700 30px ${TH}`; g.fillText('เด็กหาย', 54, 36);
  rect(g, 50, 62, 120, 120, '#c8c4b8'); el(g, 110, 118, 34, 42, '#d9a07a'); poly(g, [[74, 112], [74, 76, 110, 72], [146, 76, 146, 112], [134, 96], [86, 96]], '#2a2020'); el(g, 98, 118, 3, 3, '#2a2020'); el(g, 122, 118, 3, 3, '#2a2020');
  g.fillStyle = '#2a2a2a'; g.font = `700 22px ${TH}`; g.fillText('ด.ญ.ฝน อายุ ๘ ขวบ', 22, 214); g.font = `500 17px ${TH}`; g.fillText('หายตัวหน้าลิฟต์', 22, 242); g.fillText('ตึกวิชัยแล็บ ๑๓ พ.ย. ๔๐', 22, 266);
  g.restore();
}

// a CCTV dome (for the very last shot)
export function dome(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); rect(g, -50, -16, 100, 16, '#d8d8d4'); g.fillStyle = '#2a2a30'; g.beginPath(); g.arc(0, 0, 40, 0, Math.PI); g.fill(); el(g, 6, 18, 12, 10, '#5a7aaa'); el(g, 10, 14, 4, 3, '#cfe0ff'); g.restore(); }

// a small radio on the shelf
export function radio(g, x, y, on = 0) { rr(g, x, y, 130, 74, 10, '#7a3a2a'); el(g, x + 36, y + 40, 24, 24, '#2a2a2a'); for (let k = 0; k < 4; k++) rect(g, x + 74, y + 18 + k * 12, 44, 4, '#c8b070'); cap(g, [x + 110, y], [x + 150, y - 90], 3, '#b8b8c0'); if (on) el(g, x + 118, y + 64, 4, 4, '#ff6a3a'); }

// the enhance screen: a frame of the corridor in an editor, zoom and brightness, the child's footprints to the lift
export function enhance(g, t, o, drawFrame) {
  vgrad(g, 0, 0, W, H, '#1a1e26', '#12151c');
  rr(g, 60, 50, 1800, 980, 18, '#262a34'); rect(g, 60, 50, 1800, 50, '#31363f'); for (const [x, c] of [[90, '#e8463c'], [120, '#e8c43a'], [150, '#3ac46a']]) el(g, x, 75, 8, 8, c);
  g.fillStyle = '#c8ccd4'; g.font = `600 24px ${TH}`; g.fillText('tape03_capture.mov · เฟรม 04:21:07', 190, 84);
  g.save(); g.beginPath(); g.rect(100, 120, 1380, 776); g.clip(); g.translate(100, 120);
  const z = o.zoom || 1; g.translate(690, 388); g.scale(z * 1380 / W, z * 776 / H); g.translate(-(o.cx ?? 960), -(o.cy ?? 540));
  drawFrame();
  g.restore();
  if (o.bright) { g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = `rgba(120,140,130,${.5 * o.bright})`; g.fillRect(100, 120, 1380, 776); g.restore(); }
  rect(g, 1510, 120, 320, 776, '#2c313b');
  const slider = (y, name, v) => { g.fillStyle = '#c8ccd4'; g.font = `600 22px ${TH}`; g.fillText(name, 1530, y); rr(g, 1530, y + 16, 280, 8, 4, '#454b56'); rr(g, 1530, y + 16, 280 * v, 8, 4, '#3a9ae8'); el(g, 1530 + 280 * v, y + 20, 12, 12, '#e8eef6'); };
  slider(170, 'ซูม', Math.min(1, ((o.zoom || 1) - 1) / 3)); slider(250, 'ความสว่าง', .3 + .7 * (o.bright || 0)); slider(330, 'คอนทราสต์', .4 + .5 * (o.bright || 0)); slider(410, 'ลดนอยส์', .6);
  rect(g, 100, 910, 1380, 90, '#20242c'); const cell = o.cell ?? 26; for (let k = 0; k < 40; k++) rect(g, 110 + k * 34, 924, 28, 62, k === cell ? '#3a9ae8' : '#3a404b');
  rect(g, 110 + cell * 34 + 12, 912, 4, 86, '#e8463c'); g.fillStyle = '#c8ccd4'; g.font = `600 22px ${TH}`; g.fillText(`เฟรม ${cell === 26 ? '6,247' : '6,248'}`, 1530, 520);
}
// small wet child footprints on the corridor floor, from near the paper to the lift at the far end
export function footprints(g, a = 1) {
  for (let i = 0; i < 12; i++) { const u = i / 12, x = lerp(940, 966, u) + (i % 2 ? 14 : -14) * (1 - u * .8), y = lerp(1000, 640, Math.pow(u, .8)), s = lerp(1, .3, u);
    g.fillStyle = `rgba(170,210,235,${.55 * a})`; g.beginPath(); g.ellipse(x, y, 9 * s, 16 * s, i % 2 ? .15 : -.15, 0, 7); g.fill(); g.beginPath(); g.ellipse(x, y - 20 * s, 7 * s, 6 * s, 0, 0, 7); g.fill(); }
}
