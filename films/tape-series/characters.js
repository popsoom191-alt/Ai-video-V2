// Characters of "ม้วนที่ ๙" (Tape No. 9), drawn in Canvas2D so the same code can animate them later.
// draw(x, name, o): origin = ground point between the feet, y up = negative. o = { view: 'front'|'q', expr, s (scale) }
// Flat colour + one ink outline per shape, a little hand wobble.
const INK = '#1d1a1f';

function shape(x, pts, fill, lw = 4, close = true) {
  x.beginPath(); x.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    if (p.length === 6) x.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]); else if (p.length === 4) x.quadraticCurveTo(p[0], p[1], p[2], p[3]); else x.lineTo(p[0], p[1]);
  }
  if (close) x.closePath();
  if (fill) { x.fillStyle = fill; x.fill(); }
  if (lw) { x.lineWidth = lw; x.strokeStyle = INK; x.lineJoin = 'round'; x.lineCap = 'round'; x.stroke(); }
}
const ell = (x, cx, cy, rx, ry, fill, lw = 4, rot = 0) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 7); if (fill) { x.fillStyle = fill; x.fill(); } if (lw) { x.lineWidth = lw; x.strokeStyle = INK; x.stroke(); } };
const line = (x, pts, lw = 4, col = INK) => shape(x, pts, null, lw, false) || (x.strokeStyle = col);
const shade = (c, k) => { const n = parseInt(c.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(v * k))); return '#' + [n >> 16, n >> 8 & 255, n & 255].map(v => f(v).toString(16).padStart(2, '0')).join(''); };

// ---------- the parts every human shares ----------
// face: eyes, brows, mouth by expression. f = horizontal offset of the face (3/4 view shifts it toward the heading)
function face(x, cx, cy, r, expr, f = 0, o = {}) {
  const ex = r * .36, ey = cy + r * .05, fx = cx + f * r * .28;
  const E = {
    neutral: { eye: 'dot', brow: 0, mouth: 'flat' }, happy: { eye: 'arc', brow: -.1, mouth: 'smile' },
    scared: { eye: 'wide', brow: .35, mouth: 'o' }, sad: { eye: 'dot', brow: .3, mouth: 'frown' },
    angry: { eye: 'dot', brow: -.4, mouth: 'frown' }, curious: { eye: 'wide', brow: -.15, mouth: 'smirk' },
  }[expr || 'neutral'];
  for (const sd of [-1, 1]) {
    const exx = fx + sd * ex * (f ? (sd === Math.sign(f) ? .8 : 1.05) : 1);
    if (o.glasses) { x.lineWidth = 3.5; x.strokeStyle = INK; if (o.glasses === 'square') x.strokeRect(exx - r * .22, ey - r * .17, r * .44, r * .34); else ell(x, exx, ey, r * .23, r * .2, null, 3.5); }
    if (E.eye === 'dot') ell(x, exx, ey, r * .07, r * .1, INK, 0);
    if (E.eye === 'wide') { ell(x, exx, ey, r * .14, r * .16, '#fbf7ee', 3); ell(x, exx + f * r * .04, ey + r * .02, r * .06, r * .07, INK, 0); }
    if (E.eye === 'arc') line(x, [[exx - r * .11, ey + r * .03], [exx, ey - r * .08, exx + r * .11, ey + r * .03]], 4);
    const by = ey - r * .3, bt = E.brow * sd;
    line(x, [[exx - r * .14, by + bt * r * .12], [exx + r * .14, by - bt * r * .12]], 4);
  }
  const my = cy + r * .48;
  if (E.mouth === 'flat') line(x, [[fx - r * .12, my], [fx + r * .12, my]], 4);
  if (E.mouth === 'smile') shape(x, [[fx - r * .2, my - r * .04], [fx, my + r * .26, fx + r * .2, my - r * .04], [fx, my + r * .04, fx - r * .2, my - r * .04]], '#8a2f3a', 3.5);
  if (E.mouth === 'o') ell(x, fx, my + r * .04, r * .1, r * .14, '#5a2030', 3.5);
  if (E.mouth === 'frown') line(x, [[fx - r * .14, my + r * .06], [fx, my - r * .08, fx + r * .14, my + r * .06]], 4);
  if (E.mouth === 'smirk') line(x, [[fx - r * .12, my + r * .02], [fx + r * .06, my + r * .04, fx + r * .16, my - r * .06]], 4);
  if (o.blush) for (const sd of [-1, 1]) ell(x, fx + sd * r * .5, my - r * .1, r * .13, r * .07, 'rgba(230,120,120,.45)', 0);
}
function legs(x, s, col, shoe, w = .13, h = 1.0, skirt = false) {
  for (const sd of [-1, 1]) {
    shape(x, [[sd * s * .06, -s * h], [sd * s * (.06 + w), -s * h], [sd * s * (.05 + w), -s * .08], [sd * s * .07, -s * .08]], col, 4);
    shape(x, [[sd * s * .04, -s * .1], [sd * s * (.1 + w), -s * .1], [sd * s * (.2 + w) * (sd > 0 ? 1 : 1), -s * .02, sd * s * (.12 + w), 0], [sd * s * .03, 0]], shoe, 4);
  }
}
function arm(x, s, sd, col, skin, ang = 0, len = .78, w = .1) {
  x.save(); x.translate(sd * s * .3, -s * 1.95); x.rotate(sd * (.12 + ang));
  shape(x, [[-s * w / 2, 0], [s * w / 2, 0], [s * w * .45, s * len], [-s * w * .45, s * len]], col, 4);
  ell(x, 0, s * (len + .07), s * .075, s * .085, skin, 4);
  x.restore();
}

// ---------- the cast ----------
const CAST = {
  // ต้นข้าว: 17, runs a channel about old things. Bob with bangs, red clip, mustard hoodie, phone on a grip.
  tonkhao: {
    name: 'ต้นข้าว', role: 'นักเรียน ม.๕ · ช่องยูทูบ "ของเก่าเล่าผี"', skin: '#e9b98f', h: 2.85,
    pal: ['#e9b98f', '#1f1b22', '#f2b33d', '#3b4a6b', '#d9443b', '#f4efe4'],
    draw(x, s, o) {
      const q = o.view === 'q' ? 1 : 0;
      legs(x, s, '#3b4a6b', '#f4efe4', .12, 1.05);
      arm(x, s, -1, '#f2b33d', this.skin, .05);
      shape(x, [[-s * .36, -s * 1.02], [-s * .4, -s * 1.7, -s * .34, -s * 2.02], [s * .34, -s * 2.02], [s * .4, -s * 1.7, s * .36, -s * 1.02]], '#f2b33d', 4);     // hoodie
      shape(x, [[-s * .12, -s * 1.45], [s * .12, -s * 1.45], [s * .14, -s * 1.22], [-s * .14, -s * 1.22]], shade('#f2b33d', .85), 3);                          // pocket
      line(x, [[-s * .06, -s * 1.98], [-s * .08, -s * 1.7]], 3); line(x, [[s * .06, -s * 1.98], [s * .08, -s * 1.72]], 3);                                       // strings
      // the near arm holds the phone up, filming
      x.save(); x.translate(s * .3, -s * 1.95); x.rotate(-1.15);
      shape(x, [[-s * .05, 0], [s * .05, 0], [s * .045, s * .7], [-s * .045, s * .7]], '#f2b33d', 4); ell(x, 0, s * .76, s * .075, s * .085, this.skin, 4);
      x.translate(0, s * .82); x.rotate(1.15); shape(x, [[-s * .09, -s * .16], [s * .09, -s * .16], [s * .09, s * .12], [-s * .09, s * .12]], '#2b2a33', 4); ell(x, -s * .04, -s * .1, s * .02, s * .02, '#9fd3ff', 0);
      x.restore();
      const hx = q * s * .03, hy = -s * 2.38, r = s * .42;
      shape(x, [[hx - r * 1.05, hy + r * .55], [hx - r * 1.25, hy - r * 1.5, hx + r * 1.25, hy - r * 1.5, hx + r * 1.05, hy + r * .55], [hx + r * .6, hy + r * .75], [hx - r * .6, hy + r * .75]], '#1f1b22', 4);   // back of the bob
      ell(x, hx, hy, r * .9, r, this.skin, 4);
      face(x, hx, hy, r, o.expr, q, { blush: true });
      shape(x, [[hx - r * .95, hy - r * .1], [hx - r, hy - r * 1.42, hx + r, hy - r * 1.42, hx + r * .95, hy - r * .1], [hx + r * .55, hy - r * .45], [hx + r * .2, hy - r * .35], [hx - r * .15, hy - r * .48], [hx - r * .5, hy - r * .36]], '#1f1b22', 4);   // bangs
      shape(x, [[hx + r * .5, hy - r * .78], [hx + r * .85, hy - r * .66], [hx + r * .8, hy - r * .55], [hx + r * .46, hy - r * .66]], '#d9443b', 3);       // clip
    },
  },
  // ภูมิ: 17, fixes old machines, does not believe. Tall, messy hair, square glasses, olive overshirt, screwdriver.
  phum: {
    name: 'ภูมิ', role: 'เพื่อนสนิท · ซ่อมเครื่องเล่นวิดีโอเป็น', skin: '#c99670', h: 3.1,
    pal: ['#c99670', '#18161a', '#6f7a4a', '#9a9aa2', '#23242b', '#e2b23a'],
    draw(x, s, o) {
      const q = o.view === 'q' ? 1 : 0;
      legs(x, s, '#23242b', '#5a4a3a', .12, 1.15);
      arm(x, s, -1, '#6f7a4a', this.skin, .02, .85);
      shape(x, [[-s * .34, -s * 1.12], [-s * .36, -s * 2.05], [s * .36, -s * 2.05], [s * .34, -s * 1.12]], '#9a9aa2', 4);                      // t-shirt
      shape(x, [[-s * .36, -s * 1.08], [-s * .4, -s * 2.05], [-s * .14, -s * 2.08], [-s * .12, -s * 1.08]], '#6f7a4a', 4);                    // open overshirt
      shape(x, [[s * .36, -s * 1.08], [s * .4, -s * 2.05], [s * .14, -s * 2.08], [s * .12, -s * 1.08]], '#6f7a4a', 4);
      arm(x, s, 1, '#6f7a4a', this.skin, .02, .85);
      x.save(); x.translate(s * .43, -s * 1.1); x.rotate(.2); shape(x, [[-s * .03, 0], [s * .03, 0], [s * .03, s * .18], [-s * .03, s * .18]], '#e2b23a', 3); line(x, [[0, s * .18], [0, s * .36]], 4); x.restore();   // screwdriver
      // headphones round the neck
      shape(x, [[-s * .26, -s * 2.1], [0, -s * 1.86, s * .26, -s * 2.1]], null, 7, false);
      const hx = q * s * .03, hy = -s * 2.48, r = s * .4;
      ell(x, hx, hy, r * .88, r * 1.02, this.skin, 4);
      face(x, hx, hy, r, o.expr, q, { glasses: 'square' });
      const spikes = []; for (let k = 0; k <= 9; k++) { const a = Math.PI * (1.05 + k * .1); spikes.push([hx + Math.cos(a) * r * (k % 2 ? .95 : 1.3), hy + Math.sin(a) * r * (k % 2 ? .95 : 1.35)]); }
      shape(x, [[hx - r * .92, hy - r * .05], ...spikes, [hx + r * .92, hy - r * .05], [hx + r * .4, hy - r * .55], [hx - r * .1, hy - r * .42], [hx - r * .5, hy - r * .58]], '#18161a', 4);
    },
  },
  // ป้าจิต: 62, owner of the closed video shop. Grey bun, glasses on a chain, purple blouse, green sarong, a ring of keys.
  jit: {
    name: 'ป้าจิต (จิตรา)', role: 'เจ้าของร้านวิดีโอดาวทอง · อดีตนักเรียน ม.๓/๒', skin: '#d8a982', h: 2.6,
    pal: ['#d8a982', '#b8b4b0', '#7a4b8c', '#3f6b4f', '#c9a227', '#f2ead8'],
    draw(x, s, o) {
      const q = o.view === 'q' ? 1 : 0;
      for (const sd of [-1, 1]) shape(x, [[sd * s * .04, -s * .1], [sd * s * .24, -s * .1], [sd * s * .3, -s * .02, sd * s * .22, 0], [sd * s * .04, 0]], '#5a3a2a', 4);
      shape(x, [[-s * .34, -s * .95], [-s * .4, -s * .1], [s * .4, -s * .1], [s * .34, -s * .95]], '#3f6b4f', 4);                                   // sarong
      for (let k = 0; k < 4; k++) line(x, [[-s * .37, -s * (.3 + k * .17)], [s * .37, -s * (.3 + k * .17)]], 2.5);
      arm(x, s, -1, '#7a4b8c', this.skin, .1, .7);
      shape(x, [[-s * .4, -s * .9], [-s * .42, -s * 1.75, -s * .34, -s * 1.82], [s * .34, -s * 1.82], [s * .42, -s * 1.75, s * .4, -s * .9]], '#7a4b8c', 4);   // blouse
      for (let k = 0; k < 3; k++) ell(x, 0, -s * (1.65 - k * .22), s * .025, s * .025, '#f2ead8', 2);
      // the near arm holds the keys
      x.save(); x.translate(s * .3, -s * 1.76); x.rotate(-.3); shape(x, [[-s * .05, 0], [s * .05, 0], [s * .045, s * .6], [-s * .045, s * .6]], '#7a4b8c', 4); ell(x, 0, s * .66, s * .075, s * .085, this.skin, 4);
      ell(x, s * .02, s * .82, s * .1, s * .1, null, 4); for (let k = 0; k < 3; k++) { x.save(); x.translate(s * .02, s * .9); x.rotate(-.5 + k * .5); shape(x, [[-s * .015, 0], [s * .015, 0], [s * .015, s * .2], [-s * .015, s * .2]], '#c9a227', 2.5); x.restore(); }
      x.restore();
      const hx = q * s * .03, hy = -s * 2.15, r = s * .4;
      ell(x, hx - r * .1 * (1 - q), hy - r * 1.05, r * .42, r * .36, '#b8b4b0', 4);   // bun
      ell(x, hx, hy, r * .9, r, this.skin, 4);
      line(x, [[hx - r * .5, hy + r * .62], [hx - r * .35, hy + r * .7]], 2.5); line(x, [[hx + r * .5, hy + r * .62], [hx + r * .35, hy + r * .7]], 2.5);   // smile lines
      face(x, hx, hy, r, o.expr, q, { glasses: 'round' });
      shape(x, [[hx - r * .92, hy], [hx - r * 1.02, hy - r * 1.4, hx + r * 1.02, hy - r * 1.4, hx + r * .92, hy], [hx + r * .6, hy - r * .55], [hx - r * .6, hy - r * .55]], '#b8b4b0', 4);   // grey hair
      line(x, [[hx - r * .9, hy + r * .1], [hx - r * .8, hy + r * 1.4, hx + r * .8, hy + r * 1.4, hx + r * .9, hy + r * .1]], 2);   // the glasses chain
    },
  },
  // สมชาย: the night guard of 1998, from the first tape. Khaki uniform, cap, a torch, the camcorder on a strap.
  somchai: {
    name: 'สมชาย', role: 'ยามกะดึก โรงเรียน ปี ๒๕๔๑ · หายตัวไปในม้วนที่ ๑', skin: '#b7835c', h: 2.95,
    pal: ['#b7835c', '#a8946a', '#2c2f38', '#1d1a1f', '#d6c36a', '#3a3f4a'],
    draw(x, s, o) {
      const q = o.view === 'q' ? 1 : 0;
      legs(x, s, '#2c2f38', '#1d1a1f', .13, 1.08);
      shape(x, [[-s * .36, -s * 1.05], [-s * .38, -s * 2.0], [s * .38, -s * 2.0], [s * .36, -s * 1.05]], '#a8946a', 4);           // uniform shirt
      shape(x, [[-s * .38, -s * 1.1], [s * .38, -s * 1.1], [s * .38, -s * 1.0], [-s * .38, -s * 1.0]], '#1d1a1f', 3);              // belt
      shape(x, [[-s * .25, -s * 1.78], [-s * .08, -s * 1.78], [-s * .08, -s * 1.6], [-s * .25, -s * 1.6]], shade('#a8946a', .85), 3); // pocket
      shape(x, [[s * .1, -s * 1.8], [s * .22, -s * 1.8], [s * .22, -s * 1.66], [s * .16, -s * 1.62], [s * .1, -s * 1.66]], '#d6c36a', 3);   // badge
      line(x, [[-s * .3, -s * 1.98], [s * .3, -s * 1.12]], 4);                                                                   // camcorder strap
      arm(x, s, -1, '#a8946a', this.skin, .05, .8);
      // the near arm: the torch, pointed down
      x.save(); x.translate(s * .3, -s * 1.95); x.rotate(.35); shape(x, [[-s * .05, 0], [s * .05, 0], [s * .045, s * .72], [-s * .045, s * .72]], '#a8946a', 4); ell(x, 0, s * .78, s * .075, s * .085, this.skin, 4);
      shape(x, [[-s * .05, s * .8], [s * .05, s * .8], [s * .07, s * 1.12], [-s * .07, s * 1.12]], '#3a3f4a', 3); x.restore();
      // the camcorder at his hip
      shape(x, [[s * .2, -s * 1.28], [s * .5, -s * 1.28], [s * .5, -s * 1.08], [s * .2, -s * 1.08]], '#3a3f4a', 4); ell(x, s * .53, -s * 1.18, s * .06, s * .08, '#1d1a1f', 3); ell(x, s * .25, -s * 1.24, s * .02, s * .02, '#d9443b', 0);
      const hx = q * s * .03, hy = -s * 2.36, r = s * .4;
      ell(x, hx, hy, r * .9, r, this.skin, 4);
      face(x, hx, hy + r * .05, r, o.expr, q);
      shape(x, [[hx - r * .26, hy + r * .38], [hx, hy + r * .3, hx + r * .26, hy + r * .38], [hx, hy + r * .46, hx - r * .26, hy + r * .38]], '#1d1a1f', 2);   // moustache
      shape(x, [[hx - r * .95, hy - r * .35], [hx - r * .9, hy - r * 1.2, hx + r * .9, hy - r * 1.2, hx + r * .95, hy - r * .35]], '#2c2f38', 4);   // cap
      shape(x, [[hx - r * .2 + q * r * .3, hy - r * .4], [hx + r * 1.3, hy - r * .42], [hx + r * 1.2, hy - r * .25], [hx - r * .2 + q * r * .3, hy - r * .25]], '#23262d', 4);   // peak
      ell(x, hx, hy - r * .75, r * .12, r * .1, '#d6c36a', 2.5);
    },
  },
  // ครูอร: homeroom teacher of ม.๓/๒, 1998. Alive in the tapes: kind, white blouse, navy skirt, long hair, a register.
  // As the ghost: too tall, grey-white, the hair over the face, the register still in her hands.
  on: {
    name: 'ครูอร', role: 'ครูประจำชั้น ม.๓/๒ · เสียชีวิตในเหตุไฟไหม้ ปี ๒๕๔๑', skin: '#e3b48f', h: 3.0,
    pal: ['#e3b48f', '#141216', '#f2efe6', '#26335a', '#a33a2c', '#9aa0a8'],
    draw(x, s, o) {
      const q = o.view === 'q' ? 1 : 0, ghost = o.ghost;
      const skin = ghost ? '#b9bec4' : this.skin, blouse = ghost ? '#d4d8dc' : '#f2efe6', skirt = ghost ? '#59606b' : '#26335a', hair = '#141216';
      x.save(); if (ghost) x.scale(1, 1.18);
      for (const sd of [-1, 1]) shape(x, [[sd * s * .05, -s * .08], [sd * s * .2, -s * .08], [sd * s * .24, -s * .02, sd * s * .18, 0], [sd * s * .05, 0]], ghost ? '#8e949b' : '#1d1a1f', 4);
      if (!ghost) legs(x, s, skin, '#1d1a1f', .08, .5);
      shape(x, [[-s * .3, -s * 1.2], [-s * .42, -s * .2], [s * .42, -s * .2], [s * .3, -s * 1.2]], skirt, 4);                       // long skirt
      // hair behind: long, to the waist
      const hx = q * s * .03, hy = -s * 2.38, r = s * .4;
      shape(x, [[hx - r * .95, hy - r * .3], [hx - r * 1.15, hy + r * 1.6, hx - r * .9, hy + r * 2.9, hx - r * .7, hy + r * 3.2], [hx + r * .7, hy + r * 3.2], [hx + r * .9, hy + r * 2.9, hx + r * 1.15, hy + r * 1.6, hx + r * .95, hy - r * .3]], hair, 4);
      shape(x, [[-s * .32, -s * 1.15], [-s * .36, -s * 2.0], [s * .36, -s * 2.0], [s * .32, -s * 1.15]], blouse, 4);
      shape(x, [[-s * .1, -s * 2.0], [0, -s * 1.86], [s * .1, -s * 2.0]], blouse, 3);                                              // collar
      for (const sd of [-1, 1]) {   // both hands hold the register in front
        x.save(); x.translate(sd * s * .3, -s * 1.95); x.rotate(sd * -.05); shape(x, [[-s * .05, 0], [s * .05, 0], [s * .045, s * (ghost ? .9 : .5)], [-s * .045, s * (ghost ? .9 : .5)]], blouse, 4); x.restore();
      }
      x.save(); x.translate(0, -s * (ghost ? 1.0 : 1.38)); x.rotate(-.06); shape(x, [[-s * .28, -s * .18], [s * .28, -s * .18], [s * .28, s * .2], [-s * .28, s * .2]], ghost ? '#6b2a24' : '#a33a2c', 4); line(x, [[-s * .2, -s * .05], [s * .14, -s * .05]], 2.5, '#f2efe6'); x.restore();
      for (const sd of [-1, 1]) ell(x, sd * s * .27, -s * (ghost ? 1.0 : 1.4), s * .07, s * .08, skin, 4);
      const nl = ghost ? .22 : 0;
      if (ghost) shape(x, [[-s * .06, -s * 2.0], [s * .06, -s * 2.0], [s * .07 + q * s * .05, -s * (2.0 + nl)], [-s * .05 + q * s * .05, -s * (2.0 + nl)]], skin, 4);
      x.translate(ghost ? s * .06 : 0, -s * nl); if (ghost) { x.translate(hx, hy); x.rotate(.22); x.translate(-hx, -hy); }
      ell(x, hx, hy, r * .88, r, skin, 4);
      if (!ghost) {
        face(x, hx, hy, r, o.expr || 'happy', q);
        shape(x, [[hx - r * .95, hy + r * .2], [hx - r * 1.05, hy - r * 1.42, hx + r * 1.05, hy - r * 1.42, hx + r * .95, hy + r * .2], [hx + r * .7, hy - r * .4], [hx + r * .1, hy - r * .62], [hx - r * .7, hy - r * .4]], hair, 4);   // parted hair
      } else {
        // the hair falls over the whole face, to the chest
        shape(x, [[hx - r * .98, hy + r * .1], [hx - r * 1.05, hy - r * 1.42, hx + r * 1.05, hy - r * 1.42, hx + r * .98, hy + r * .1], [hx + r * .9, hy + r * 1.5], [hx + r * .6, hy + r * 1.75], [hx + r * .35, hy + r * 1.5], [hx + r * .1, hy + r * 1.85], [hx - r * .15, hy + r * 1.55], [hx - r * .45, hy + r * 1.8], [hx - r * .7, hy + r * 1.5], [hx - r * .95, hy + r * 1.65]], hair, 4);
        ell(x, hx + r * .22, hy + r * .25, r * .05, r * .04, '#d9d2c0', 0);   // one eye, through the hair
      }
      x.restore();
    },
  },
};

export function draw(x, name, o = {}) {
  const C = CAST[name], s = o.s || 100;
  x.save(); if (o.flip) x.scale(-1, 1);
  C.draw(x, s, o);
  x.restore();
}
export const cast = CAST;
