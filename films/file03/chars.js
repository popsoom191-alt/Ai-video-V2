// FILE 03: the ten characters, flat vector style (no outlines, dot eyes, rosy cheeks), drawn in Canvas2D.
// person(g, id, x, y, H, pose): (x, y) = ground point, H = height in px.
// pose = { walk: phase (rad) or null, talk: 0..1 mouth open, blink: bool, look: -1..1, hands: {L:[x,y], R:[x,y]} in design units, expr }
// Design units: feet at y=0, top of head ≈ -400, body centre x=0.
const SK = '#f2c29b', SK2 = '#d9a27c';
const rr = (g, x, y, w, h, r, c) => { g.fillStyle = c; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };
const el = (g, x, y, rx, ry, c, rot = 0) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fill(); };
const poly = (g, P, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(...P[0]); for (const p of P.slice(1)) p.length === 4 ? g.quadraticCurveTo(...p) : g.lineTo(...p); g.closePath(); g.fill(); };
function capsule(g, a, b, w, c) { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }

// ---------- the generic body ----------
function body(g, C, P) {
  const ph = P.walk, sw = ph == null ? 0 : Math.sin(ph), bob = ph == null ? 0 : Math.abs(Math.cos(ph)) * 6;
  g.save(); g.translate(0, -bob);
  // legs + shoes (a walk lifts one foot and swings it a little)
  const legTop = C.legTop ?? -175;
  for (const sd of [-1, 1]) {
    const lift = ph == null ? 0 : Math.max(0, sd * sw) * 16, dx = ph == null ? 0 : sd * sw * 6;
    if (C.legs !== false) rr(g, sd * 30 - 15 + dx, legTop, 30, -legTop - 14 - lift, 8, C.pants);
    rr(g, sd * 30 - 22 + dx + sd * 4, -22 - lift, 44, 22, 10, C.shoes);
  }
  if (C.skirt) poly(g, [[-62, -200], [62, -200], [74, C.skirtLen ?? -100], [-74, C.skirtLen ?? -100]], C.skirt);
  // arms behind the torso edge, hands at the given points
  const hand = { L: P.hands?.L || C.handL || [-74, -180 + sw * 6], R: P.hands?.R || C.handR || [74, -180 - sw * 6] };
  for (const sd of ['L', 'R']) { const sx = sd === 'L' ? -56 : 56; capsule(g, [sx, -286], hand[sd], 26, C.sleeve || C.top); }
  // torso
  rr(g, -62, -305, 124, C.torsoH ?? 140, 26, C.top);
  C.outfit && C.outfit(g, P);
  for (const sd of ['L', 'R']) el(g, hand[sd][0], hand[sd][1], 14, 14, C.skin || SK);
  C.props && C.props(g, P, hand);
  // head
  rr(g, -12, -322, 24, 22, 6, C.skin || SK);   // neck
  C.hairBack && C.hairBack(g);
  for (const sd of [-1, 1]) el(g, sd * 50, -345, 9, 11, C.skin || SK);
  el(g, 0, -348, 50, 52, C.skin || SK);
  face(g, C, P);
  C.hairFront && C.hairFront(g);
  C.hat && C.hat(g);
  g.restore();
}
function face(g, C, P) {
  const lx = (P.look || 0) * 5, e = P.expr || C.expr || 'neutral';
  for (const sd of [-1, 1]) {
    if (P.blink) { g.fillStyle = '#2a2026'; g.fillRect(sd * 18 - 6 + lx, -343, 12, 2.5); }
    else { el(g, sd * 18 + lx, -342, 5.5, e === 'scared' ? 7.5 : 6.5, '#2a2026'); el(g, sd * 18 + lx - 1.5, -344.5, 1.8, 1.8, '#ffffff'); }
    // brows
    g.strokeStyle = C.brow || '#3a2a26'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath();
    const by = -357, t = e === 'worried' || e === 'scared' ? 4 : e === 'angry' ? -4 : 0;
    g.moveTo(sd * 10, by - t * (sd > 0 ? 1 : 1) + (sd > 0 ? 0 : 0)); g.lineTo(sd * 26, by + t); g.stroke();
    el(g, sd * 30, -326, 9, 5, 'rgba(240,120,120,.4)');
  }
  g.fillStyle = SK2; g.beginPath(); g.ellipse(0, -330, 3, 2.2, 0, 0, 7); g.fill();   // nose
  const m = P.talk || 0;
  if (m > .15) el(g, 0, -316, 8, 3 + m * 6, '#7a2a3a');
  else {
    g.strokeStyle = '#7a3a3a'; g.lineWidth = 3; g.beginPath();
    if (e === 'smile' || e === 'happy') { g.moveTo(-9, -318); g.quadraticCurveTo(0, -310, 9, -318); }
    else if (e === 'worried' || e === 'sad' || e === 'frown') { g.moveTo(-8, -313); g.quadraticCurveTo(0, -319, 8, -313); }
    else if (e === 'scared') { g.stroke(); el(g, 0, -315, 5, 6, '#7a2a3a'); return; }
    else { g.moveTo(-7, -316); g.lineTo(7, -316); }
    g.stroke();
  }
  C.faceExtra && C.faceExtra(g);
}

// ---------- the cast ----------
export const CAST = {
  ton: { name: 'ต้น', role: 'คนถือกล้อง · 1997', quote: 'ไม่เคยปิดกล้อง', bg: ['#4a5a6e', '#2a3240'],
    top: '#4c76a8', pants: '#2c3c5c', shoes: '#f2f2f0', handL: [-34, -232], handR: [34, -232],
    outfit(g) { rr(g, -22, -300, 44, 132, 6, '#f4f2ec'); },
    hairBack(g) { el(g, 0, -360, 52, 40, '#1e1a1e'); },
    hat(g) { el(g, 0, -386, 74, 13, '#c8322c'); poly(g, [[-46, -386], [-44, -420, 0, -428], [44, -420, 46, -386]], '#d83a32'); el(g, 0, -428, 6, 4, '#a82822'); for (const sd of [-1, 1]) rr(g, sd * 32 - 4, -386, 8, 22, 3, '#1e1a1e'); },
    props(g) { rr(g, -40, -258, 84, 46, 8, '#2a2a30'); el(g, 52, -235, 15, 17, '#1a1a1e'); el(g, 52, -235, 8, 9, '#3a5a9a'); el(g, -28, -248, 4, 4, '#e8322c'); g.fillStyle = '#aaa'; g.font = '700 9px sans-serif'; g.fillText('REC', -16, -228); },
  },
  mind: { name: 'มายด์', role: 'เพื่อนนักสืบ · 1997', quote: 'คนแรกที่เห็นกระดาษ', bg: ['#6e4a5e', '#3a2632'],
    top: '#8e2a36', pants: '#2c3c5c', shoes: '#6a4430', handR: [86, -300],
    outfit(g) { rr(g, -18, -300, 36, 136, 6, '#f2c23a'); g.fillStyle = 'rgba(0,0,0,.18)'; for (let k = 0; k < 7; k++) g.fillRect(-60, -290 + k * 19, 120, 3); },
    hairBack(g) { poly(g, [[-52, -360], [-60, -280], [-40, -262], [40, -262], [60, -280], [52, -360]], '#3a2620'); },
    hairFront(g) { poly(g, [[-52, -350], [-50, -404, 0, -404], [50, -404, 52, -350], [30, -378], [-10, -384], [-36, -372]], '#3a2620'); },
    props(g, P, h) { g.save(); g.translate(h.R[0], h.R[1]); g.rotate(-.7); rr(g, -7, -8, 14, 40, 4, '#2a2a30'); rr(g, -9, -16, 18, 12, 3, '#d8d8d0'); g.restore();
      if (P.beam !== false) { g.save(); g.globalCompositeOperation = 'screen'; const gr = g.createLinearGradient(h.R[0], h.R[1], h.R[0] - 80, h.R[1] - 180); gr.addColorStop(0, 'rgba(255,250,220,.55)'); gr.addColorStop(1, 'rgba(255,250,220,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(h.R[0] - 6, h.R[1] - 12); g.lineTo(h.R[0] - 150, h.R[1] - 170); g.lineTo(h.R[0] - 30, h.R[1] - 210); g.closePath(); g.fill(); g.restore(); } },
  },
  chai: { name: 'ลุงชัย', role: 'ยามกะดึก', quote: 'รู้ว่าชั้น 4 ปิดไว้ทำไม', bg: ['#3e5a48', '#22322a'], expr: 'frown',
    top: '#5e6e48', pants: '#3a4230', shoes: '#1e1e1e', sleeve: '#5e6e48', handR: [76, -158],
    outfit(g) { rr(g, -62, -186, 124, 14, 3, '#1e1e1e'); rr(g, 24, -186, 12, 14, 2, '#c8b060'); poly(g, [[-40, -270], [-24, -270], [-24, -246], [-32, -238], [-40, -246]], '#d8b84a'); rr(g, -76, -200, 20, 34, 4, '#1e1e1e'); rr(g, -70, -214, 3, 14, 1, '#1e1e1e'); },
    hairBack(g) { el(g, -44, -352, 12, 18, '#9a9a9a'); el(g, 44, -352, 12, 18, '#9a9a9a'); },
    faceExtra(g) { poly(g, [[-16, -322], [0, -326], [16, -322], [12, -316], [0, -319], [-12, -316]], '#8a8a8a'); },
    props(g, P, h) { g.strokeStyle = '#c8c0a0'; g.lineWidth = 3; g.beginPath(); g.arc(h.R[0], h.R[1] + 14, 8, 0, 7); g.stroke(); for (const a of [-.3, .3]) { g.save(); g.translate(h.R[0], h.R[1] + 22); g.rotate(a); rr(g, -2, 0, 4, 14, 1, '#c8c0a0'); g.restore(); } },
  },
  daeng: { name: 'ป้าแดง', role: 'แม่บ้าน', quote: 'ถูพื้นทางเดินทุกคืน', bg: ['#6e5a3e', '#3a2e1e'], expr: 'smile',
    top: '#c43a3a', pants: SK, shoes: '#6a3a2a', skirt: '#5e3a6a', skirtLen: -96, handL: [-80, -210],
    outfit(g) { rr(g, -40, -270, 80, 150, 10, '#efe4cc'); rr(g, -20, -230, 40, 24, 4, '#ddd0b2'); },
    hairBack(g) { el(g, 0, -406, 18, 16, '#3a2a26'); },
    hairFront(g) { poly(g, [[-50, -350], [-48, -402, 0, -402], [48, -402, 50, -350], [30, -384], [0, -388], [-30, -384]], '#3a2a26'); },
    props(g, P, h) { capsule(g, [h.L[0] + 6, h.L[1] - 120], [h.L[0] - 30, -14], 6, '#c8a060'); poly(g, [[h.L[0] - 58, -4], [h.L[0] - 10, -4], [h.L[0] - 24, -26], [h.L[0] - 44, -26]], '#ece8dc');
      poly(g, [[96, -74], [150, -74], [142, 0], [104, 0]], '#3a78c8'); el(g, 123, -74, 27, 6, '#2a5a9a'); },
  },
  wichai: { name: 'ดร.วิชัย', role: 'เจ้าของตึก · นักวิจัย', quote: 'หายไปพร้อมเทปม้วนที่ 1', bg: ['#4a5466', '#262c38'],
    top: '#f2f2ee', pants: '#2c2c34', shoes: '#1e1e22', handL: [-30, -240], handR: [30, -220], torsoH: 210,
    outfit(g) { poly(g, [[-20, -305], [20, -305], [14, -170], [-14, -170]], '#a8c4e0'); poly(g, [[-6, -296], [6, -296], [8, -220], [0, -210], [-8, -220]], '#8a2a32'); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(-62, -305, 30, 210); },
    hairBack(g) { el(g, 0, -366, 54, 42, '#e6e6e6'); },
    hairFront(g) { poly(g, [[-52, -360], [-46, -404, 0, -406], [46, -404, 52, -360], [26, -386], [-26, -386]], '#ececec'); },
    faceExtra(g) { g.strokeStyle = '#2a2a2a'; g.lineWidth = 3; for (const sd of [-1, 1]) g.strokeRect(sd * 18 - 13, -352, 26, 20); g.beginPath(); g.moveTo(-5, -342); g.lineTo(5, -342); g.stroke(); },
    props(g) { g.save(); g.translate(0, -238); g.rotate(-.12); rr(g, -34, -46, 68, 88, 4, '#c8a070'); rr(g, -28, -38, 56, 74, 2, '#fbf8ef'); g.fillStyle = '#9a9a9a'; for (let k = 0; k < 5; k++) g.fillRect(-22, -28 + k * 10, 40, 3); g.fillStyle = '#c8322c'; g.font = '700 9px sans-serif'; g.fillText('CONFIDENTIAL', -26, 28); g.restore(); },
  },
  beer: { name: 'เบียร์', role: 'ช่างกู้เทป · 2026', quote: 'เปิดไฟล์ 03 คนเดียว', bg: ['#3e5e52', '#1e322a'],
    top: '#2f9a6a', pants: '#232326', shoes: '#f2f2f0', handR: [58, -236],
    outfit(g) { rr(g, -40, -230, 80, 40, 8, '#2a8a5e'); g.fillStyle = '#e8f8ee'; g.font = '700 14px sans-serif'; g.textAlign = 'center'; g.fillText('REC', 0, -250); g.textAlign = 'left'; for (const sd of [-1, 1]) capsule(g, [sd * 10, -300], [sd * 12, -262], 3, '#e8f8ee'); },
    hairBack(g) { poly(g, [[-62, -300], [-70, -330, -50, -350], [50, -350], [70, -330, 62, -300]], '#2a8a5e'); },
    hairFront(g) { poly(g, [[-52, -352], [-50, -408, 0, -408], [50, -408, 52, -352], [40, -372], [-40, -372]], '#1a1a1e'); for (let k = -4; k <= 4; k++) poly(g, [[k * 11 - 6, -400], [k * 11, -414], [k * 11 + 6, -400]], '#1a1a1e'); },
    hat(g) { for (const sd of [-1, 1]) rr(g, sd * 54 - 9, -362, 18, 30, 7, '#e0393c'); g.strokeStyle = '#1a1a1e'; g.lineWidth = 5; g.beginPath(); g.arc(0, -350, 56, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); },
    props(g, P, h) { g.save(); g.translate(h.R[0] + 10, h.R[1] - 6); g.rotate(-.15); rr(g, -38, -22, 76, 44, 4, '#1a1a1e'); rr(g, -28, -14, 56, 18, 2, '#f2ecd8'); g.fillStyle = '#2a2a2a'; g.font = '700 11px monospace'; g.fillText('03 97', -18, -1); g.restore(); },
  },
  fon: { name: 'น้องฝน', role: 'เด็กที่หายไป', quote: 'เห็นครั้งสุดท้ายหน้าลิฟต์', bg: ['#5a5a6e', '#2e2e3a'], expr: 'worried',
    top: '#f6f6f2', pants: SK, shoes: '#1e1e22', skirt: '#24305e', skirtLen: -112, handL: [-20, -236], handR: [20, -236],
    outfit(g) { poly(g, [[-30, -305], [0, -276], [30, -305], [22, -300], [0, -284], [-22, -300]], '#24305e'); },
    hairBack(g) { poly(g, [[-54, -360], [-56, -310], [56, -310], [54, -360]], '#1a1a1e'); },
    hairFront(g) { poly(g, [[-52, -352], [-50, -404, 0, -404], [50, -404, 52, -352], [44, -366], [-44, -366]], '#1a1a1e'); },
    props(g) { el(g, 0, -232, 30, 32, '#8a5a3a'); el(g, 0, -272, 22, 20, '#8a5a3a'); for (const sd of [-1, 1]) el(g, sd * 16, -288, 8, 8, '#8a5a3a'); el(g, 0, -266, 8, 6, '#c89a70'); for (const sd of [-1, 1]) el(g, sd * 7, -276, 2.5, 2.5, '#1a1a1e'); },
  },
  oat: { name: 'พี่โอ๊ต', role: 'ช่างไฟ', quote: 'ไฟดับเพราะเขาหรือเปล่า', bg: ['#6e5a2e', '#3a2e14'], expr: 'smile', skin: '#c48a5e',
    top: '#e8902c', pants: '#2c3c5c', shoes: '#6a4430', handR: [70, -190],
    outfit(g) { rr(g, -54, -300, 108, 132, 14, '#f2e23a'); g.fillStyle = '#e8e8e8'; g.fillRect(-54, -250, 108, 8); g.fillRect(-54, -214, 108, 8); g.fillStyle = '#e8902c'; g.fillRect(-14, -300, 28, 132); rr(g, -66, -190, 132, 16, 4, '#6a4430'); for (const sd of [-1, 1]) rr(g, sd * 52 - 12, -178, 24, 30, 4, '#8a5a3a'); },
    hairFront(g) { poly(g, [[-52, -352], [-50, -404, 0, -406], [50, -404, 52, -352], [40, -374], [-40, -374]], '#1a1a1e'); },
    props(g) { g.strokeStyle = '#1a1a1e'; g.lineWidth = 6; g.beginPath(); g.ellipse(14, -246, 22, 34, .2, 0, 7); g.stroke(); },
  },
  nid: { name: 'คุณนิด', role: 'นักข่าวช่องเจ็ด', quote: 'ตามข่าวตึกร้างมา 20 ปี', bg: ['#6e3e4a', '#3a1e26'], expr: 'smile',
    top: '#c43a4a', pants: SK, shoes: '#1e1e22', skirt: '#2a2a30', skirtLen: -116, handR: [64, -286],
    outfit(g) { poly(g, [[-22, -305], [22, -305], [16, -180], [-16, -180]], '#f6f4ee'); },
    hairBack(g) { poly(g, [[-54, -360], [-58, -282], [58, -282], [54, -360]], '#5a3a2a'); },
    hairFront(g) { poly(g, [[-52, -346], [-50, -404, 4, -404], [50, -404, 52, -346], [30, -380], [-20, -386], [-42, -366]], '#5a3a2a'); },
    faceExtra(g) { for (const sd of [-1, 1]) el(g, sd * 52, -330, 3.5, 3.5, '#e8c03a'); },
    props(g, P, h) { capsule(g, [h.R[0], h.R[1]], [h.R[0] - 4, h.R[1] - 34], 8, '#2a2a30'); el(g, h.R[0] - 5, h.R[1] - 42, 11, 12, '#3a3a40'); rr(g, h.R[0] - 15, h.R[1] - 28, 20, 16, 2, '#c8322c'); g.fillStyle = '#fff'; g.font = '700 12px sans-serif'; g.fillText('7', h.R[0] - 9, h.R[1] - 15); },
  },
  thing: { name: '???', role: 'ร่างในทางเดิน', quote: 'ไม่มีใครบอกได้ว่ามันคืออะไร', bg: ['#4a4840', '#14140f'] },
};

// the thing: tall, thin, black, two white dots; long arms, fingers like twigs
function thing(g, P) {
  const s = Math.sin((P.t || 0) * 1.3) * 3;
  g.fillStyle = '#0a0a0c';
  g.beginPath(); g.ellipse(0, -520, 34, 42, 0, 0, 7); g.fill();
  g.beginPath(); g.moveTo(-44, -470); g.quadraticCurveTo(-56, -300, -40, -170); g.lineTo(40, -170); g.quadraticCurveTo(56, -300, 44, -470); g.closePath(); g.fill();
  for (const sd of [-1, 1]) {
    capsule(g, [sd * 22, -175], [sd * 20, -8], 18, '#0a0a0c');
    capsule(g, [sd * 46, -460], [sd * (70 + s), -100], 13, '#0a0a0c');
    for (let k = -2; k <= 2; k++) capsule(g, [sd * (70 + s), -100], [sd * (74 + s + k * 5), -66 + Math.abs(k) * 4], 3, '#0a0a0c');
  }
  if (P.eyes !== false) for (const sd of [-1, 1]) el(g, sd * 12, -522, 3.6, 3.6, '#f4f4f0');
}

export function person(g, id, x, y, H, pose = {}) {
  g.save(); g.translate(x, y); const k = H / 410; g.scale(pose.flip ? -k : k, k);
  el(g, 0, 0, 78, 12, 'rgba(0,0,0,.22)');
  if (id === 'thing') thing(g, pose); else body(g, CAST[id], pose);
  g.restore();
}
