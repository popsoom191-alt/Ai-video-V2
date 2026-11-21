// FILE 03 cast, style 2: tall, slender figures with egg-shaped heads, two-tone flat shading (light from the right), small
// eyes, muted colours. A 3/4 standing view and a side view for walking. Same API as chars.js:
// person(g, id, x, y, H, pose) · pose = { walk: phase|null, flip, talk, blink, look, expr, hands: {L,R}, view: 'q'|'side' }
// Design units: feet at y=0, top of head ≈ -400.
const mixc = (a, b, k) => { const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
const dk = (c, k = .22) => mixc(c, '#1c2230', k), lt = (c, k = .14) => mixc(c, '#ffffff', k);
const el = (g, x, y, rx, ry, c, rot = 0) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, 7); g.fill(); };
const poly = (g, P, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(...P[0]); for (const p of P.slice(1)) p.length === 4 ? g.quadraticCurveTo(...p) : g.lineTo(...p); g.closePath(); g.fill(); };
const cap = (g, a, b, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); };
const path = (g, P, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(...P[0]); for (const p of P.slice(1)) g.lineTo(...p); g.stroke(); };
// two-segment arm: the elbow found from the shoulder and the hand (fixed segment lengths)
function elbow(s, h, L1 = 62, L2 = 60, side = 1) {   // side: +1 elbow goes to the right of the body, -1 to the left
  const dx = h[0] - s[0], dy = h[1] - s[1], d = Math.max(1, Math.min(Math.hypot(dx, dy), L1 + L2 - 1)), a = Math.atan2(dy, dx);
  const b = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
  const A = [s[0] + Math.cos(a + b) * L1, s[1] + Math.sin(a + b) * L1], B = [s[0] + Math.cos(a - b) * L1, s[1] + Math.sin(a - b) * L1];
  // a real elbow hangs low: take the lower solution; if both are level, the one on the arm's own side
  return Math.abs(A[1] - B[1]) > 6 ? (A[1] > B[1] ? A : B) : ((A[0] - B[0]) * side > 0 ? A : B);
}
// arm poses: where the hands go (3/4 view, facing right). The near hand is R.
const ARMS = {
  down: { L: [-30, -200], R: [32, -200] },
  chest: { L: [10, -250], R: [34, -252] },          // both hands hold something at the chest, elbows out
  torch: { L: [-28, -202], R: [78, -268] },        // the near arm reaches forward with a torch
  point: { L: [-28, -202], R: [80, -312] },
  phone: { L: [-28, -202], R: [18, -350] },
  mop: { L: [-4, -250], R: [26, -214] },        // a phone at the ear
};
const SK = '#d9a07a';

// ---------- the 3/4 standing figure (faces screen right) ----------
function standing(g, C, P) {
  const skin = C.skin || SK, bob = 0;
  // legs: long and thin, a shadow plane down the back edge
  if (!C.longSkirt) for (const [sx, c] of [[-9, dk(C.pants, .12)], [9, C.pants]]) {
    poly(g, [[sx - 8, -226], [sx + 8, -226], [sx + 7, -20], [sx - 6, -20]], c);
    poly(g, [[sx - 8, -226], [sx - 3, -226], [sx - 2, -20], [sx - 6, -20]], dk(c, .25));
    poly(g, [[sx - 7, -24], [sx + 8, -24], [sx + 15, -8], [sx + 15, 0], [sx - 8, 0]], C.shoes);
  }
  C.skirt && poly(g, [[-27, -236], [27, -236], [34, C.skirtLen ?? -130], [-32, C.skirtLen ?? -130]], C.skirt);
  C.skirt && poly(g, [[-27, -236], [-12, -236], [-14, C.skirtLen ?? -130], [-32, C.skirtLen ?? -130]], dk(C.skirt, .2));
  const pose = ARMS[P.arms || C.arms || 'down'], hands = { L: P.hands?.L || pose.L, R: P.hands?.R || pose.R };
  // far arm (behind)
  const sL = [-24, -318], eL = elbow(sL, hands.L, 62, 60, -1);
  path(g, [sL, eL, hands.L], 13, dk(C.sleeve || C.top, .3));
  // torso: tapered, a darker plane on the shaded (left) side
  const len = C.coatLen ?? -222;
  poly(g, [[-30, -324], [30, -324], [28, -280], [26, len], [-26, len], [-28, -280]], C.top);
  poly(g, [[-30, -324], [-12, -324], [-10, len], [-26, len], [-28, -280]], dk(C.top, .22));
  C.outfit && C.outfit(g, P, dk, lt);
  // near arm
  const sR = [24, -318], eR = elbow(sR, hands.R, 62, 60, 1);
  path(g, [sR, eR, hands.R], 13, C.sleeve || C.top);
  for (const k of ['L', 'R']) el(g, hands[k][0], hands[k][1] + 3, 6, 8, k === 'L' ? dk(skin, .15) : skin);
  C.props && C.props(g, P, hands, dk, lt);
  head(g, C, P, 'q');
}

// ---------- the side view, walking (faces screen right) ----------
function side(g, C, P) {
  const ph = P.walk ?? 0, s = Math.sin(ph), c = Math.cos(ph), bob = Math.abs(c) * 4;
  g.save(); g.translate(0, -bob);
  const legs = [[s, dk(C.pants, .28)], [-s, C.pants]];   // far leg first
  if (!C.longSkirt) for (const [k, col] of legs) {
    const hip = [0, -226], knee = [k * 22 + 4, -122], foot = [k * 40, -6 + Math.max(0, -k) * 0];
    const kneeB = [knee[0] + (k < 0 ? 8 : 0), knee[1]];
    path(g, [hip, kneeB, foot], 15, col);
    poly(g, [[foot[0] - 7, foot[1] - 12], [foot[0] + 18, foot[1] - 6], [foot[0] + 18, foot[1] + 6], [foot[0] - 8, foot[1] + 6]], C.shoes);
  }
  C.skirt && poly(g, [[-16, -236], [18, -236], [26 + s * 4, C.skirtLen ?? -130], [-22 + s * 4, C.skirtLen ?? -130]], C.skirt);
  const swing = s * 34;
  path(g, [[0, -316], [-swing * .5, -258], [-swing, -200]], 12, dk(C.sleeve || C.top, .3));   // far arm
  const len = C.coatLen ?? -222;
  poly(g, [[-15, -324], [16, -324], [18, -280], [16, len], [-17, len], [-17, -280]], C.top);
  poly(g, [[-15, -324], [-4, -324], [-5, len], [-17, len], [-17, -280]], dk(C.top, .22));
  C.sideOutfit && C.sideOutfit(g, P, dk, lt);
  path(g, [[2, -316], [swing * .5 + 2, -258], [swing + 2, -200]], 12, C.sleeve || C.top);   // near arm
  el(g, swing + 2, -196, 6, 8, C.skin || SK);
  C.sideProps && C.sideProps(g, P, [swing + 2, -196], dk, lt);
  head(g, C, P, 'side');
  g.restore();
}

// ---------- front and back views (symmetric; the back hides the face under the hair) ----------
function frontBack(g, C, P, back) {
  const skin = C.skin || SK;
  if (!C.longSkirt) for (const sx of [-10, 10]) { poly(g, [[sx - 8, -226], [sx + 8, -226], [sx + 7, -20], [sx - 7, -20]], sx < 0 ? dk(C.pants, .14) : C.pants); poly(g, [[sx - 9, -24], [sx + 9, -24], [sx + 10, 0], [sx - 10, 0]], C.shoes); }
  C.skirt && poly(g, [[-27, -236], [27, -236], [34, C.skirtLen ?? -130], [-34, C.skirtLen ?? -130]], C.skirt);
  const A = P.arms || C.arms || 'down';
  const H = A === 'chest' ? { L: [-12, -262], R: [12, -262] } : A === 'torch' ? (back ? { L: [-36, -200], R: [30, -290] } : { L: [-36, -200], R: [44, -268] }) : A === 'phone' ? { L: [-36, -200], R: [26, -350] } : { L: [-36, -200], R: [36, -200] };
  const hands = { L: P.hands?.L || H.L, R: P.hands?.R || H.R };
  const len = C.coatLen ?? -222;
  const torso = () => { poly(g, [[-31, -324], [31, -324], [29, -280], [27, len], [-27, len], [-29, -280]], C.top); poly(g, [[-31, -324], [-14, -324], [-12, len], [-27, len], [-29, -280]], dk(C.top, .2)); };
  const arm = sd => { const s = [sd * 27, -318], h = hands[sd > 0 ? 'R' : 'L'], L2 = A === 'chest' ? 30 : 60; path(g, [s, elbow(s, h, 62, L2, sd), h], 13, sd < 0 ? dk(C.sleeve || C.top, .15) : (C.sleeve || C.top)); if (!back || A === 'down') el(g, h[0], h[1] + 3, 6, 8, skin); };
  if (back) { torso(); arm(-1); arm(1); }
  else { torso(); C.outfit && C.outfit(g, P, dk, lt); arm(-1); arm(1); C.props && A === (C.arms || 'down') && C.props(g, P, hands, dk, lt); }
  const hx = 0, hy = -366;
  poly(g, [[-6, -342], [6, -342], [7, -320], [-6, -320]], dk(skin, .12));
  if (back) {
    C.hairBack && C.hairBack(g, 'back', dk);
    for (const sd of [-1, 1]) el(g, sd * 23, hy + 2, 4, 6, dk(skin, .1));
    el(g, hx, hy, 24, 31, C.bald ? skin : (C.hairCol || '#2a2026'));
    if (C.hairCol && !C.bald) el(g, hx, hy + 12, 22, 20, dk(C.hairCol, .15));
    C.hat && C.hat(g, 'back', hx, hy, dk);
    return;
  }
  C.hairBack && C.hairBack(g, 'front', dk);
  for (const sd of [-1, 1]) el(g, sd * 24, hy + 2, 4, 6, dk(skin, .12));
  el(g, hx, hy, 24, 31, skin);
  g.save(); g.beginPath(); g.ellipse(hx, hy, 24, 31, 0, 0, 7); g.clip(); poly(g, [[hx - 30, hy - 40], [hx - 12, hy - 40], [hx - 16, hy + 40], [hx - 30, hy + 40]], dk(skin, .12)); g.restore();
  const e = P.expr || C.expr || 'neutral', lx = (P.look || 0) * 1.5;
  for (const sd of [-1, 1]) {
    const ex = hx + sd * 9;
    if (P.blink) cap(g, [ex - 3 + lx, hy - 2], [ex + 3 + lx, hy - 2], 1.6, '#2a2026');
    else { el(g, ex + lx, hy - 2, 2.4, e === 'scared' ? 3.4 : 2.7, '#22181e'); cap(g, [ex - 4, hy - 7], [ex + 4, hy - 7], 1.3, dk(skin, .45)); }
    const t = e === 'worried' || e === 'scared' || e === 'sad' ? 2 : e === 'angry' || e === 'frown' ? -2 : 0;
    cap(g, [ex - 4, hy - 12 - sd * t * .5 + (sd < 0 ? 0 : 0)], [ex + 4, hy - 12 + sd * t * .5], 1.6, C.brow || dk(C.hairCol || '#2a2026', 0));
    el(g, hx + sd * 14, hy + 7, 3.5, 2.2, 'rgba(220,110,100,.25)');
  }
  poly(g, [[hx, hy + 2], [hx + 3, hy + 9], [hx - 3, hy + 9]], dk(skin, .12));
  const m = P.talk || 0, my = hy + 16;
  if (m > .15) el(g, hx, my, 3.2, 1.2 + m * 2.8, '#6a2a30');
  else if (e === 'smile' || e === 'happy') path(g, [[hx - 4, my - 1], [hx, my + 1.5], [hx + 4, my - 1]], 1.6, '#7a3a3a');
  else if (e === 'worried' || e === 'sad' || e === 'frown') path(g, [[hx - 4, my + 1], [hx, my - 1], [hx + 4, my + 1]], 1.6, '#7a3a3a');
  else if (e === 'scared') el(g, hx, my, 2.6, 3.2, '#6a2a30');
  else cap(g, [hx - 3, my], [hx + 3, my], 1.6, '#7a3a3a');
  C.faceExtra && C.faceExtra(g, 'front', hx - 10, hy, dk);
  C.hairFront && C.hairFront(g, 'front', hx - 2, hy, dk);
  C.hat && C.hat(g, 'front', hx - 4, hy, dk);
}

// ---------- head: an egg, two-tone, small eyes ----------
function head(g, C, P, view) {
  const skin = C.skin || SK, hx = view === 'side' ? 2 : 2, hy = -366;
  poly(g, [[-6, -342], [6, -342], [7, -320], [-6, -320]], dk(skin, .12));   // neck
  C.hairBack && C.hairBack(g, view, dk);
  el(g, hx, hy, 24, 31, skin);
  // shadow plane on the far side of the face
  g.save(); g.beginPath(); g.ellipse(hx, hy, 24, 31, 0, 0, 7); g.clip();
  poly(g, [[hx - 30, hy - 40], [hx - 6, hy - 40], [hx - 12, hy + 4], [hx - 4, hy + 40], [hx - 30, hy + 40]], dk(skin, .16)); g.restore();
  el(g, hx - (view === 'side' ? 4 : 13), hy + 2, 4, 6, dk(skin, .12));   // ear
  const e = P.expr || C.expr || 'neutral', lx = (P.look || 0) * 1.5;
  const eyes = view === 'side' ? [[hx + 15, 1]] : [[hx + 3, .9], [hx + 17, 1]];
  for (const [ex, sc] of eyes) {
    if (P.blink) { cap(g, [ex - 3 * sc + lx, hy - 2], [ex + 3 * sc + lx, hy - 2], 1.6, '#2a2026'); }
    else { el(g, ex + lx, hy - 2, 2.3 * sc, e === 'scared' ? 3.2 : 2.6, '#22181e'); cap(g, [ex - 4 * sc, hy - 6.5], [ex + 3.5 * sc, hy - 7], 1.4, dk(skin, .45)); }
    const t = e === 'worried' || e === 'scared' || e === 'sad' ? 2 : e === 'angry' || e === 'frown' ? -2 : 0;
    cap(g, [ex - 4 * sc, hy - 12 + (ex < hx + 10 ? t : -t) * .5], [ex + 4 * sc, hy - 12 - (ex < hx + 10 ? t : -t) * .5], 1.6, C.brow || dk(C.hairCol || '#2a2026', 0));
  }
  poly(g, [[hx + 22, hy - 2], [hx + 27, hy + 7], [hx + 21, hy + 8]], dk(skin, .1));   // nose
  el(g, hx + 12, hy + 6, 4, 2.4, 'rgba(220,110,100,.28)');
  const m = P.talk || 0, mx = view === 'side' ? hx + 18 : hx + 12, my = hy + 16;
  if (m > .15) el(g, mx, my, 3, 1.2 + m * 2.6, '#6a2a30');
  else if (e === 'smile' || e === 'happy') path(g, [[mx - 4, my - 1], [mx, my + 1.5], [mx + 4, my - 1]], 1.6, '#7a3a3a');
  else if (e === 'worried' || e === 'sad' || e === 'frown') path(g, [[mx - 4, my + 1], [mx, my - 1], [mx + 4, my + 1]], 1.6, '#7a3a3a');
  else if (e === 'scared') el(g, mx, my, 2.5, 3, '#6a2a30');
  else cap(g, [mx - 3, my], [mx + 3, my], 1.6, '#7a3a3a');
  C.faceExtra && C.faceExtra(g, view, hx, hy, dk);
  C.hairFront && C.hairFront(g, view, hx, hy, dk);
  C.hat && C.hat(g, view, hx, hy, dk);
}

// ---------- hair helpers ----------
const shortHair = col => ({
  hairCol: col,
  hairFront: (g, v, hx, hy, dk) => { poly(g, [[hx - 25, hy + 2], [hx - 26, hy - 30, hx, hy - 33], [hx + 22, hy - 32, hx + 24, hy - 14], [hx + 14, hy - 20], [hx + 2, hy - 18], [hx - 12, hy - 12], [hx - 16, hy + 6]], col); poly(g, [[hx - 25, hy + 2], [hx - 26, hy - 30, hx - 8, hy - 32], [hx - 14, hy - 10], [hx - 16, hy + 6]], dk(col, .2)); },
});

// ---------- the cast (identities as in FILE 03) ----------
export const CAST = {
  ton: { name: 'ต้น', role: 'คนถือกล้อง · 1997', quote: 'ไม่เคยปิดกล้อง', bg: ['#5a6670', '#2e363e'],
    top: '#4a6a92', pants: '#38425a', shoes: '#e4e2dc', arms: 'chest', ...shortHair('#241e20'),
    outfit(g, P, dk) { poly(g, [[-6, -322], [10, -322], [8, -224], [-4, -224]], '#ece8e0'); },
    hat(g, v, hx, hy, dk) { poly(g, [[hx - 26, hy - 18], [hx - 24, hy - 42, hx, hy - 44], [hx + 22, hy - 42, hx + 24, hy - 18]], '#b8443a'); poly(g, [[hx - 30, hy - 18], [hx + 36, hy - 18], [hx + 30, hy - 13], [hx - 30, hy - 13]], '#9a3830'); },
    props(g, P, h) { poly(g, [[0, -276], [40, -276], [40, -250], [0, -250]], '#2a2a30'); el(g, 44, -263, 9, 11, '#1a1a1e'); el(g, 44, -263, 5, 6, '#4a6aa0'); el(g, 8, -270, 2.5, 2.5, '#e8322c'); },
    sideProps(g) { poly(g, [[8, -276], [44, -276], [44, -252], [8, -252]], '#2a2a30'); el(g, 48, -264, 8, 10, '#1a1a1e'); },
  },
  mind: { name: 'มายด์', role: 'เพื่อนนักสืบ · 1997', quote: 'คนแรกที่เห็นกระดาษ', bg: ['#6a5660', '#362a32'],
    top: '#8a3a40', pants: '#38425a', shoes: '#6a4a36', arms: 'torch', hairCol: '#3a2a24',
    outfit(g, P, dk) { poly(g, [[-4, -322], [8, -322], [8, -224], [-4, -224]], '#d8b24a'); g.fillStyle = 'rgba(0,0,0,.15)'; for (let k = 0; k < 5; k++) g.fillRect(-28, -306 + k * 18, 56, 2); },
    hairBack(g, v) { poly(g, [[-22, -390], [-30, -360], [-34, -300], [-20, -296], [-14, -350]], '#3a2a24'); },
    hairFront(g, v, hx, hy, dk) { poly(g, [[hx - 25, hy + 4], [hx - 27, hy - 32, hx + 2, hy - 34], [hx + 24, hy - 32, hx + 25, hy - 8], [hx + 10, hy - 22], [hx - 14, hy - 12], [hx - 18, hy + 10]], '#3a2a24'); },
    props(g, P, h) { g.save(); g.translate(h.R[0], h.R[1]); g.rotate(-.6); poly(g, [[-4, -4], [4, -4], [4, 22], [-4, 22]], '#2a2a30'); poly(g, [[-6, -12], [6, -12], [6, -4], [-6, -4]], '#d8d8d0'); g.restore();
      if (P.beam !== false) { g.save(); g.globalCompositeOperation = 'screen'; const gr = g.createLinearGradient(h.R[0], h.R[1], h.R[0] + 90, h.R[1] - 120); gr.addColorStop(0, 'rgba(255,248,220,.5)'); gr.addColorStop(1, 'rgba(255,248,220,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(h.R[0] + 4, h.R[1] - 8); g.lineTo(h.R[0] + 170, h.R[1] - 90); g.lineTo(h.R[0] + 90, h.R[1] - 190); g.closePath(); g.fill(); g.restore(); } },
  },
  chai: { name: 'ลุงชัย', role: 'ยามกะดึก', quote: 'รู้ว่าชั้น 4 ปิดไว้ทำไม', bg: ['#4e5e4e', '#28322a'], expr: 'frown', skin: '#c48e68',
    top: '#5e6a48', pants: '#3a4030', shoes: '#1e1e1e', hairCol: '#8a8a8a', bald: true,
    outfit(g) { poly(g, [[-28, -232], [28, -232], [28, -224], [-28, -224]], '#1e1e1e'); poly(g, [[-22, -300], [-12, -300], [-12, -286], [-17, -282], [-22, -286]], '#c8a84a'); poly(g, [[-34, -246], [-24, -246], [-24, -226], [-34, -226]], '#1e1e1e'); },
    hairBack(g, v) { el(g, -16, -362, 9, 14, '#8a8a8a'); },
    faceExtra(g, v, hx, hy) { poly(g, [[hx + 6, hy + 11], [hx + 20, hy + 10], [hx + 18, hy + 14], [hx + 8, hy + 15]], '#7a7a7a'); },
    props(g, P, h) { g.strokeStyle = '#c8c0a0'; g.lineWidth = 2; g.beginPath(); g.arc(h.R[0], h.R[1] + 12, 5, 0, 7); g.stroke(); },
  },
  daeng: { name: 'ป้าแดง', role: 'แม่บ้าน', quote: 'ถูพื้นทางเดินทุกคืน', bg: ['#6a5c46', '#382e22'], expr: 'smile', skin: '#d29a74',
    top: '#b0443e', pants: '#d29a74', shoes: '#5a3a2a', skirt: '#5a3e66', skirtLen: -110, arms: 'mop', hairCol: '#3a2a26',
    outfit(g, P, dk) { poly(g, [[-18, -296], [22, -296], [24, -150], [-18, -150]], '#e6dcc2'); poly(g, [[-18, -296], [-6, -296], [-6, -150], [-18, -150]], dk('#e6dcc2', .15)); },
    hairBack(g) { el(g, -12, -396, 10, 9, '#3a2a26'); },
    hairFront(g, v, hx, hy) { poly(g, [[hx - 25, hy + 2], [hx - 26, hy - 30, hx, hy - 33], [hx + 22, hy - 32, hx + 24, hy - 16], [hx + 4, hy - 24], [hx - 16, hy - 10]], '#3a2a26'); },
    props(g, P, h) { cap(g, [h.L[0] + 4, h.L[1] - 70], [h.L[0] - 36, -10], 4, '#b8925a'); poly(g, [[h.L[0] - 60, -2], [h.L[0] - 16, -2], [h.L[0] - 26, -18], [h.L[0] - 48, -18]], '#dcd6c8');
      poly(g, [[46, -54], [86, -54], [80, 0], [52, 0]], '#3a6aa8'); el(g, 66, -54, 20, 5, '#2a4a7a'); },
  },
  wichai: { name: 'ดร.วิชัย', role: 'เจ้าของตึก · นักวิจัย', quote: 'หายไปพร้อมเทปม้วนที่ 1', bg: ['#566070', '#2a303a'],
    top: '#e6e6e0', pants: '#2c2c34', shoes: '#1e1e22', coatLen: -150, arms: 'chest', hairCol: '#dcdcdc',
    outfit(g) { poly(g, [[-2, -322], [12, -322], [10, -236], [0, -236]], '#9ab4cc'); poly(g, [[3, -316], [8, -316], [9, -260], [5, -254], [2, -260]], '#7a2a30'); },
    hairFront(g, v, hx, hy) { poly(g, [[hx - 25, hy - 2], [hx - 26, hy - 30, hx, hy - 34], [hx + 22, hy - 32, hx + 22, hy - 18], [hx + 2, hy - 24], [hx - 16, hy - 14]], '#dcdcdc'); },
    faceExtra(g, v, hx, hy) { g.strokeStyle = '#2a2a2a'; g.lineWidth = 1.6; g.strokeRect(hx - 2, hy - 7, 10, 8); g.strokeRect(hx + 12, hy - 7, 10, 8); },
    props(g) { g.save(); g.translate(18, -262); g.rotate(-.15); poly(g, [[-16, -22], [16, -22], [16, 22], [-16, 22]], '#b8946a'); poly(g, [[-13, -18], [13, -18], [13, 19], [-13, 19]], '#f6f2e6'); g.fillStyle = '#9a9a9a'; for (let k = 0; k < 4; k++) g.fillRect(-10, -12 + k * 6, 18, 2); g.fillStyle = '#b8322c'; g.fillRect(-10, 12, 18, 3); g.restore(); },
  },
  beer: { name: 'เบียร์', role: 'ช่างกู้เทป · 2026', quote: 'เปิดไฟล์ 03 คนเดียว', bg: ['#4e6660', '#24342e'], skin: '#d6a07c',
    top: '#3e8a68', pants: '#262628', shoes: '#e4e2dc', coatLen: -210, ...shortHair('#18161a'),
    outfit(g, P, dk) { poly(g, [[-16, -252], [20, -252], [20, -232], [-16, -232]], dk('#3e8a68', .1)); for (const sd of [-4, 8]) cap(g, [sd, -320], [sd + 1, -294], 1.6, '#e8f0ea'); },
    hairBack(g) { poly(g, [[-30, -320], [-28, -340], [26, -340], [30, -320]], '#3a7a5c'); },
    hat(g, v, hx, hy) { el(g, hx - 13, hy + 2, 7, 10, '#c83c3a'); g.strokeStyle = '#18161a'; g.lineWidth = 3; g.beginPath(); g.arc(hx - 2, hy - 2, 27, Math.PI * 1.05, Math.PI * 1.75); g.stroke(); },
    props(g, P, h) { g.save(); g.translate(h.R[0] + 8, h.R[1] - 4); g.rotate(-.12); poly(g, [[-20, -12], [20, -12], [20, 12], [-20, 12]], '#1a1a1e'); poly(g, [[-15, -8], [15, -8], [15, 2], [-15, 2]], '#ede6d0'); g.fillStyle = '#2a2a2a'; g.font = '700 7px monospace'; g.fillText('03 97', -10, 0); g.restore(); },
    sideProps(g, P, h) { poly(g, [[h[0] - 6, h[1] - 8], [h[0] + 22, h[1] - 8], [h[0] + 22, h[1] + 8], [h[0] - 6, h[1] + 8]], '#1a1a1e'); },
  },
  fon: { name: 'น้องฝน', role: 'เด็กที่หายไป', quote: 'เห็นครั้งสุดท้ายหน้าลิฟต์', bg: ['#5e5e6a', '#30303a'], expr: 'worried', skin: '#dcaa86',
    top: '#eeeeea', pants: '#dcaa86', shoes: '#1e1e22', skirt: '#283260', skirtLen: -150, arms: 'chest', hairCol: '#18161a',
    outfit(g) { poly(g, [[-14, -324], [4, -306], [20, -324], [14, -318], [4, -312], [-8, -318]], '#283260'); },
    hairBack(g) { poly(g, [[-26, -380], [-28, -344], [20, -344], [20, -380]], '#18161a'); },
    hairFront(g, v, hx, hy) { poly(g, [[hx - 26, hy + 14], [hx - 27, hy - 32, hx + 2, hy - 34], [hx + 24, hy - 32, hx + 25, hy - 10], [hx + 6, hy - 14], [hx - 16, hy - 6], [hx - 18, hy + 16]], '#18161a'); },
    props(g) { el(g, 14, -258, 15, 17, '#7a5236'); el(g, 14, -282, 11, 10, '#7a5236'); el(g, 7, -290, 4, 4, '#7a5236'); el(g, 21, -290, 4, 4, '#7a5236'); el(g, 17, -279, 4, 3, '#b8906a'); },
  },
  oat: { name: 'พี่โอ๊ต', role: 'ช่างไฟ', quote: 'ไฟดับเพราะเขาหรือเปล่า', bg: ['#6a5e3a', '#36301c'], expr: 'smile', skin: '#b07a52',
    top: '#d4842e', pants: '#38425a', shoes: '#5a3a2a', ...shortHair('#18161a'),
    outfit(g, P, dk) { poly(g, [[-28, -318], [28, -318], [26, -232], [-26, -232]], '#dcd03a'); poly(g, [[-28, -318], [-12, -318], [-12, -232], [-26, -232]], dk('#dcd03a', .18)); g.fillStyle = '#e8e8e8'; g.fillRect(-27, -284, 54, 4); g.fillRect(-27, -262, 54, 4); g.fillStyle = '#d4842e'; g.fillRect(-4, -318, 8, 86); poly(g, [[-30, -234], [30, -234], [30, -224], [-30, -224]], '#5a3a2a'); },
    props(g) { g.strokeStyle = '#18161a'; g.lineWidth = 3; g.beginPath(); g.ellipse(8, -272, 11, 17, .2, 0, 7); g.stroke(); },
  },
  nid: { name: 'คุณนิด', role: 'นักข่าวช่องเจ็ด', quote: 'ตามข่าวตึกร้างมา 20 ปี', bg: ['#6a4a52', '#36242a'], expr: 'smile', skin: '#dcaa86',
    top: '#b0404a', pants: '#dcaa86', shoes: '#1e1e22', skirt: '#2a2a30', skirtLen: -150, hands: null, arms: 'point', hairCol: '#4e3426',
    outfit(g) { poly(g, [[-6, -322], [12, -322], [10, -236], [-4, -236]], '#f2f0ea'); },
    hairBack(g) { poly(g, [[-24, -390], [-30, -330], [-22, -316], [-14, -340]], '#4e3426'); },
    hairFront(g, v, hx, hy) { poly(g, [[hx - 26, hy + 10], [hx - 27, hy - 32, hx + 4, hy - 34], [hx + 24, hy - 32, hx + 25, hy - 8], [hx + 8, hy - 22], [hx - 16, hy - 8], [hx - 20, hy + 16]], '#4e3426'); },
    props(g, P, h) { cap(g, [h.R[0], h.R[1]], [h.R[0] - 2, h.R[1] - 18], 4, '#2a2a30'); el(g, h.R[0] - 2, h.R[1] - 23, 6, 7, '#3a3a40'); poly(g, [[h.R[0] - 9, h.R[1] - 16], [h.R[0] + 5, h.R[1] - 16], [h.R[0] + 5, h.R[1] - 6], [h.R[0] - 9, h.R[1] - 6]], '#b8322c'); },
    sideProps(g, P, h) { el(g, h[0] + 4, h[1] - 18, 6, 7, '#3a3a40'); },
  },
  oatOld: { name: 'พี่โอ๊ต (2026)', role: 'ช่างไฟ · อายุ ๕๕', quote: 'ผมไม่ได้ตัดไฟ', bg: ['#6a5e3a', '#36301c'], skin: '#a8724c',
    top: '#d4842e', pants: '#38425a', shoes: '#5a3a2a', ...shortHair('#7a7a7a'), expr: 'worried',
    outfit(g, P, dk) { poly(g, [[-28, -318], [28, -318], [26, -232], [-26, -232]], '#c8be3a'); poly(g, [[-28, -318], [-12, -318], [-12, -232], [-26, -232]], dk('#c8be3a', .2)); g.fillStyle = '#d8d8d8'; g.fillRect(-27, -284, 54, 4); g.fillRect(-27, -262, 54, 4); g.fillStyle = '#d4842e'; g.fillRect(-4, -318, 8, 86); },
    faceExtra(g, v, hx, hy) { g.strokeStyle = 'rgba(80,40,20,.4)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(hx + 2, hy - 15); g.lineTo(hx + 12, hy - 16); g.stroke(); } },
  vendor: { name: 'ป้าขายผลไม้', role: 'ตลาดเก่า', quote: 'ท้ายซอยโน่น', bg: ['#7a6a4a', '#3a3020'], expr: 'smile', skin: '#c8906a',
    top: '#4a7aa8', pants: '#5a4a3a', shoes: '#3a2a20', skirt: '#6a4a3a', skirtLen: -110, hairCol: '#2a2020',
    outfit(g, P, dk) { poly(g, [[-20, -300], [22, -300], [24, -160], [-18, -160]], '#e8dcc0'); },
    hairBack(g) { el(g, -12, -398, 11, 10, '#2a2020'); },
    hairFront(g, v, hx, hy) { poly(g, [[hx - 25, hy + 2], [hx - 26, hy - 30, hx, hy - 33], [hx + 22, hy - 32, hx + 24, hy - 16], [hx + 4, hy - 22], [hx - 16, hy - 10]], '#2a2020'); } },
  thing: { name: '???', role: 'ร่างในทางเดิน', quote: 'ไม่มีใครบอกได้ว่ามันคืออะไร', bg: ['#4a4840', '#14140f'] },
};

function thing(g, P) {
  const s = Math.sin((P.t || 0) * 1.3) * 3;
  g.fillStyle = '#0a0a0c'; g.beginPath(); g.ellipse(0, -520, 24, 34, 0, 0, 7); g.fill();
  g.beginPath(); g.moveTo(-28, -480); g.quadraticCurveTo(-36, -320, -24, -190); g.lineTo(24, -190); g.quadraticCurveTo(36, -320, 28, -480); g.closePath(); g.fill();
  for (const sd of [-1, 1]) {
    cap(g, [sd * 12, -195], [sd * 13, -8], 12, '#0a0a0c');
    cap(g, [sd * 28, -470], [sd * (44 + s), -110], 9, '#0a0a0c');
    for (let k = -2; k <= 2; k++) cap(g, [sd * (44 + s), -110], [sd * (47 + s + k * 4), -80 + Math.abs(k) * 4], 2.2, '#0a0a0c');
  }
  if (P.eyes !== false) for (const sd of [-1, 1]) el(g, sd * 8, -522, 2.6, 2.6, '#f4f4f0');
}

export function person(g, id, x, y, H, pose = {}) {
  g.save(); g.translate(x, y); const k = H / 410; g.scale(pose.flip ? -k : k, k);
  el(g, 0, 0, 40, 7, 'rgba(0,0,0,.2)');
  if (id === 'thing') thing(g, pose);
  else if (pose.walk != null || pose.view === 'side') side(g, CAST[id], pose);
  else if (pose.view === 'front' || pose.view === 'back') frontBack(g, CAST[id], pose, pose.view === 'back');
  else standing(g, CAST[id], pose);
  g.restore();
}
