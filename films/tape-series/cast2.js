// "ม้วนที่ ๙" cast, v2: anime-style figures in Canvas2D (big eyes with highlights, clumped hair with a sheen, cel
// shading). One builder; each character is a set of colours, a hair style and an outfit.
// draw(x, id, o): origin = the ground between the feet. o = { H: height px, expr, bust: true → head and shoulders only }
const LINE = '#2a2230';
const TS = 1.16;   // torso stretch (longer body, shorter legs)

// ---------- path helpers ----------
// points: [x, y] = lineTo, [cx, cy, x, y] = quadratic, [c1x, c1y, c2x, c2y, x, y] = cubic
function trace(x, P) {
  x.beginPath(); x.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length; i++) { const p = P[i]; if (p.length === 6) x.bezierCurveTo(...p); else if (p.length === 4) x.quadraticCurveTo(...p); else x.lineTo(...p); }
  x.closePath();
}
function fill(x, P, col, lw = 3, stroke = LINE) { trace(x, P); x.fillStyle = col; x.fill(); if (lw) { x.lineWidth = lw; x.strokeStyle = stroke; x.lineJoin = 'round'; x.stroke(); } }
function shadeIn(x, P, S, col) { x.save(); trace(x, P); x.clip(); trace(x, S); x.fillStyle = col; x.fill(); x.restore(); }   // cel shadow S clipped to shape P
function stroke(x, P, lw, col = LINE) { x.beginPath(); x.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) { const p = P[i]; if (p.length === 6) x.bezierCurveTo(...p); else if (p.length === 4) x.quadraticCurveTo(...p); else x.lineTo(...p); } x.lineWidth = lw; x.strokeStyle = col; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); }
function ell(x, cx, cy, rx, ry, col, lw = 0, rot = 0) { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, 7); if (col) { x.fillStyle = col; x.fill(); } if (lw) { x.lineWidth = lw; x.strokeStyle = LINE; x.stroke(); } }
const mix = (a, b, k) => { const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
const dark = (c, k = .22) => mix(c, '#2a1f3a', k), light = (c, k = .3) => mix(c, '#ffffff', k);
const mirror = P => P.map(p => p.map((v, i) => i % 2 ? v : -v));

// ---------- head ----------
function faceShape(r, jaw = 1) { return [[-r * .86, -r * .35], [-r * .9, r * .4, -r * .62 * jaw, r * .86], [-r * .2, r * 1.12, 0, r * 1.14], [r * .2, r * 1.12, r * .62 * jaw, r * .86], [r * .9, r * .4, r * .86, -r * .35], [r * .7, -r * 1.05, 0, -r * 1.05], [-r * .7, -r * 1.05, -r * .86, -r * .35]]; }

const EXPR = {
  neutral: { lid: 0, brow: 0, mouth: 'small' }, smile: { lid: .15, brow: -.05, mouth: 'smile' }, happy: { lid: 1, brow: -.1, mouth: 'open' },
  focus: { lid: .35, brow: .25, mouth: 'flat' }, scared: { lid: -.25, brow: -.4, mouth: 'gasp', sweat: true }, sad: { lid: .3, brow: -.35, mouth: 'down' },
  smirk: { lid: .25, brow: .1, mouth: 'smirk' }, cry: { lid: .4, brow: -.45, mouth: 'down', tear: true },
};
function eye(x, cx, sd, r, C, e) {
  const w = r * (C.male ? .36 : .4), h = r * (C.male ? .3 : .42), cy = r * .24;
  const top = cy - h * .55, bot = cy + h * .45;
  if (e.lid >= 1) {   // closed, happy: an upturned arc with lashes
    stroke(x, [[cx - w * .55, cy + h * .05], [cx, cy - h * .45, cx + w * .55, cy + h * .05]], r * .055);
    return;
  }
  const lid = clamp01(e.lid), open = 1 - lid * .55, t2 = cy - h * .55 * open + (e.lid < 0 ? -h * .1 : 0);
  const alm = [[cx - w * .55 * sd, cy + h * .05], [cx - w * .4 * sd, t2, cx + w * .2 * sd, t2], [cx + w * .55 * sd, t2 + h * .15, cx + w * .55 * sd, cy], [cx + w * .45 * sd, bot, cx, bot], [cx - w * .45 * sd, bot, cx - w * .55 * sd, cy + h * .05]];
  fill(x, alm, '#fbf8f4', 0);
  x.save(); trace(x, alm); x.clip();
  const ir = w * (e.lid < 0 ? .34 : .4), iy = cy + h * .06;
  ell(x, cx + C.look * w * .12, iy, ir, ir * 1.18, C.eye);
  x.save(); x.beginPath(); x.ellipse(cx + C.look * w * .12, iy, ir, ir * 1.18, 0, 0, 7); x.clip(); x.fillStyle = dark(C.eye, .55); x.fillRect(cx - ir * 2, iy - ir * 1.3, ir * 4, ir * .9); x.fillStyle = light(C.eye, .35); x.beginPath(); x.ellipse(cx + C.look * w * .12, iy + ir * .75, ir * .7, ir * .35, 0, 0, 7); x.fill(); x.restore();
  ell(x, cx + C.look * w * .12, iy + ir * .05, ir * .42, ir * .52, '#1a1420');
  ell(x, cx + C.look * w * .12 - ir * .38, iy - ir * .4, ir * .26, ir * .3, '#ffffff');
  ell(x, cx + C.look * w * .12 + ir * .35, iy + ir * .45, ir * .12, ir * .12, '#ffffff');
  x.restore();
  // upper lash: thick, flicks out at the outer corner · lower lash: a thin stroke
  stroke(x, [[cx - w * .58 * sd, cy + h * .1], [cx - w * .4 * sd, t2 - h * .04, cx + w * .25 * sd, t2 - h * .03], [cx + w * .6 * sd, t2 + h * .05, cx + w * .72 * sd, t2 - (C.male ? 0 : h * .12)]], r * (C.male ? .05 : .065));
  stroke(x, [[cx - w * .2 * sd, bot + r * .01], [cx + w * .35 * sd, bot - h * .05]], r * .018, dark(C.skin, .5));
  // brow
  const by = top - r * (C.male ? .14 : .2), b = e.brow;
  stroke(x, [[cx - w * .45 * sd, by + r * .04 - b * r * .1], [cx + w * .1 * sd, by - r * .03 - b * r * .02, cx + w * .6 * sd, by + r * .03 + b * r * .12]], r * (C.male ? .06 : .035), dark(C.hair, .1));
}
const clamp01 = v => Math.max(0, Math.min(1, v));
function head(x, r, C, e) {
  // ears and face, then a soft cheek shadow under the fringe
  for (const sd of [-1, 1]) fill(x, [[sd * r * .82, -r * .05], [sd * r * 1.02, -r * .1, sd * r * .98, r * .25], [sd * r * .92, r * .45, sd * r * .8, r * .38]], C.skin, 2.5);
  const F = faceShape(r, C.jaw || 1);
  fill(x, F, C.skin, 3);
  if (!C.openBrow) shadeIn(x, F, [[-r, -r * .4], [r, -r * .4], [r, -r * .05], [r * .2, r * .02, -r, -r * .1]], dark(C.skin, .1));
  for (const sd of [-1, 1]) eye(x, sd * r * .42, sd, r, C, e);
  stroke(x, [[r * .03, r * .5], [r * .06, r * .6, -r * .01, r * .62]], r * .028, dark(C.skin, .45));   // nose
  const my = r * .82;
  if (e.mouth === 'small') stroke(x, [[-r * .08, my], [0, my + r * .03, r * .08, my]], r * .03, '#7a3a3a');
  if (e.mouth === 'flat') stroke(x, [[-r * .1, my + r * .01], [r * .1, my]], r * .03, '#7a3a3a');
  if (e.mouth === 'smile') stroke(x, [[-r * .14, my - r * .03], [0, my + r * .08, r * .14, my - r * .03]], r * .035, '#7a3a3a');
  if (e.mouth === 'smirk') stroke(x, [[-r * .1, my + r * .02], [r * .04, my + r * .04, r * .15, my - r * .05]], r * .035, '#7a3a3a');
  if (e.mouth === 'down') stroke(x, [[-r * .1, my + r * .05], [0, my - r * .03, r * .1, my + r * .05]], r * .035, '#7a3a3a');
  if (e.mouth === 'open') fill(x, [[-r * .15, my - r * .04], [r * .15, my - r * .04], [r * .1, my + r * .2, 0, my + r * .2], [-r * .1, my + r * .2, -r * .15, my - r * .04]], '#9a3f48', r * .03, '#7a3a3a');
  if (e.mouth === 'gasp') ell(x, 0, my + r * .05, r * .08, r * .11, '#5a2533', r * .03);
  if (C.blush) for (const sd of [-1, 1]) ell(x, sd * r * .5, r * .55, r * .17, r * .07, 'rgba(240,120,130,.35)');
  if (e.sweat) fill(x, [[r * .78, -r * .3], [r * .9, -r * .05, r * .82, r * .02], [r * .7, r * .02, r * .78, -r * .3]], '#cfe9ff', 2);
  if (e.tear) for (const sd of [-1, 1]) fill(x, [[sd * r * .32, r * .42], [sd * r * .36, r * .62, sd * r * .3, r * .66], [sd * r * .24, r * .62, sd * r * .32, r * .42]], '#cfe9ff', 1.5);
  C.glasses && C.glasses(x, r);
  C.hairFront(x, r, C);
  C.hat && C.hat(x, r, C);
}
// a fringe of pointed clumps: from the left temple, over the crown, down to tips across the forehead
function fringe(x, r, col, tips, opt = {}) {
  const top = opt.top ?? -1.32, P = [[-r * .98, r * (opt.sideY ?? .2)], [-r * 1.08, -r * .5, -r * .7, r * top * .95], [0, r * top * 1.06, r * .7, r * top * .95], [r * 1.08, -r * .5, r * .98, r * (opt.sideY ?? .2)]];
  for (let i = tips.length - 1; i >= 0; i--) { const [tx, ty] = tips[i], [px, py] = tips[i + 1] || [r * .98 / r, (opt.sideY ?? .2)]; P.push([r * (tx + px) / 2 + r * .02, r * Math.min(ty, py) * .6 - r * .25, r * tx, r * ty]); }
  fill(x, P, col, 3);
  shadeIn(x, P, [[-r * 1.2, r * .1], [-r * 1.2, -r * 2], [-r * .2, -r * 2], [-r * .5, r * .1]], dark(col, .25));
  // the sheen: a band of short light strokes across the crown
  x.save(); trace(x, P); x.clip(); stroke(x, [[-r * .62, -r * .78], [0, -r * 1.12, r * .62, -r * .78]], r * .09, light(col, .28)); stroke(x, [[-r * .3, -r * .9], [0, -r * 1.0, r * .2, -r * .93]], r * .05, light(col, .5)); x.restore();
}

// ---------- body ----------
function body(x, r, C) {
  const sh = r * 1.75, hip = r * 1.2, neckY = r * 1.05, chest = r * 2.0, waist = r * 4.1, crotch = r * 5.1, foot = r * 13;
  const legW = r * .42, gy = 0, top = -C.Hu * r;   // top of the head, in px
  x.save(); x.translate(0, top + r * 1.05);       // origin moves to the head centre
  return { sh, hip, neckY, chest, waist, crotch };
}

// a standing figure built top-down in head units: head centre at y=0, feet at y = (heads - .55) * 2r
function figure(x, C, H, e, bust) {
  const r = H / (C.heads * 2), feet = (C.heads * 2 - 1.05) * r;
  x.save(); x.translate(0, -feet);
  const Y = k => (k <= 1.4 ? k : 1.4 + (k - 1.4) * TS) * r;   // y in head units from the head centre; the torso is stretched by TS
  C.hairBack && C.hairBack(x, r, C);   // long hair falls behind the legs and the body
  if (!bust) C.legs(x, r, Y, feet, C);
  C.torso(x, r, Y, C);
  // neck with the chin's shadow
  const N = [[-r * .22, Y(.85)], [r * .22, Y(.85)], [r * .26, Y(1.45)], [-r * .26, Y(1.45)]];
  fill(x, N, C.skin, 3); shadeIn(x, N, [[-r, Y(.8)], [r, Y(.8)], [r, Y(1.12)], [0, Y(1.25), -r, Y(1.12)]], dark(C.skin, .2));
  C.collar && C.collar(x, r, Y, C);
  C.arms(x, r, Y, C);
  head(x, r, C, e);
  x.restore();
}

// ---------- generic parts ----------
function shoes(x, r, Y, feet, col, sole = '#f1ede6') {
  for (const sd of [-1, 1]) { const P = [[sd * r * .1, feet - r * .32], [sd * r * .55, feet - r * .32], [sd * r * .78, feet - r * .1, sd * r * .66, feet], [sd * r * .1, feet]]; fill(x, P, col, 3); stroke(x, [[sd * r * .1, feet - r * .06], [sd * r * .7, feet - r * .06]], 3, sole); }
}
function trousers(x, r, Y, feet, col, from = 5.2) {
  for (const sd of [-1, 1]) { const P = [[sd * r * .05, Y(from)], [sd * r * .72, Y(from)], [sd * r * .6, feet - r * .3], [sd * r * .14, feet - r * .3]]; fill(x, P, col, 3); shadeIn(x, P, [[sd * r * .05, Y(from)], [sd * r * .3, Y(from)], [sd * r * .3, feet], [sd * r * .05, feet]], dark(col, .2)); }
}
function sleeveArm(x, r, Y, sd, col, skin, o = {}) {
  const ang = (o.ang ?? .1) * sd, len = (o.len ?? 3.4) * TS, cuff = (o.cuff ?? 2.3) * TS;
  x.save(); x.translate(sd * r * 1.5, Y(1.85)); x.rotate(-ang);
  const S = [[-r * .32, 0], [r * .32, 0], [r * .3, r * cuff], [-r * .3, r * cuff]];
  fill(x, [[-r * .24, r * cuff - .1], [r * .24, r * cuff - .1], [r * .2, r * len], [-r * .2, r * len]], skin, 3);
  fill(x, S, col, 3); shadeIn(x, S, [[sd * r * .05, 0], [sd * r * .4, 0], [sd * r * .4, r * 4], [sd * r * .05, r * 4]], dark(col, .2));
  // hand: palm + a thumb
  const hy = r * len; fill(x, [[-r * .24, hy - r * .1], [r * .24, hy - r * .1], [r * .26, hy + r * .3, 0, hy + r * .42], [-r * .26, hy + r * .3, -r * .24, hy - r * .1]], skin, 3);
  stroke(x, [[-sd * r * .2, hy], [-sd * r * .3, hy + r * .2]], 3);
  o.hold && o.hold(x, r, hy);
  x.restore();
}
function torsoShape(r, Y, top = 1.4, bot = 5.3, wTop = 1.62, wBot = 1.35) { return [[-r * wTop, Y(top + .3)], [-r * .9, Y(top), -r * .3, Y(top - .05)], [r * .3, Y(top - .05)], [r * .9, Y(top), r * wTop, Y(top + .3)], [r * wBot, Y(bot)], [-r * wBot, Y(bot)]]; }

// ---------- the cast ----------
export const CAST = {
  // ธาม: the lead. 19, restores and digitises old tapes. Watches everything, says little, always has a plan.
  tham: {
    name: 'ธาม', en: 'THAM', male: true, heads: 7, skin: '#e8bf9a', hair: '#1f1d29', eye: '#6b5a48', look: .3, jaw: .92,
    role: 'พระเอก · ช่างกู้เทปเก่า อายุ ๑๙',
    traits: ['ช่างสังเกต เห็นรายละเอียดที่คนอื่นมองข้าม', 'ฟังเสียงพื้นหลังในเทปแล้วรู้ว่าอัดที่ไหน ตอนกี่โมง', 'ใจเย็น รู้ว่าสถานการณ์ไหนควรทำอะไร', 'ไม่ปักใจเชื่อเรื่องผี จนกว่าจะพิสูจน์ได้'],
    pal: ['#e8bf9a', '#1f1d29', '#f4f2ee', '#2f3542', '#3b3f4c', '#c8a24a'],
    hairBack(x, r, C) { fill(x, [[-r * 1.02, r * .1], [-r * 1.12, -r * 1.22, r * 1.12, -r * 1.22, r * 1.02, r * .1], [r * .92, r * .6], [-r * .92, r * .6]], C.hair, 3); },
    hairFront(x, r, C) {
      fringe(x, r, C.hair, [[-.92, -.05], [-.72, -.3], [-.56, .02], [-.36, -.32], [-.16, .08], [.04, -.3], [.24, .04], [.46, -.34], [.7, -.06], [.95, -.2]], { top: -1.24, sideY: .25 });
      for (const sd of [-1, 1]) fill(x, [[sd * r * .86, -r * .3], [sd * r * 1.04, r * .2, sd * r * .9, r * .55], [sd * r * .78, r * .2]], C.hair, 3);   // sideburns
      fill(x, [[-r * .15, -r * 1.14], [0, -r * 1.48, r * .32, -r * 1.42], [r * .12, -r * 1.14]], C.hair, 3);   // one cowlick
    },
    torso(x, r, Y, C) {
      const T = torsoShape(r, Y); fill(x, T, '#f4f2ee', 3);   // white tee
      // open overshirt, charcoal, with its collar
      for (const sd of [-1, 1]) {
        const J = [[sd * r * 1.68, Y(1.7)], [sd * r * .5, Y(1.35)], [sd * r * .42, Y(5.6)], [sd * r * 1.5, Y(5.6)]];
        fill(x, J, '#2f3542', 3); shadeIn(x, J, [[sd * r * .4, Y(1)], [sd * r * .8, Y(1)], [sd * r * .7, Y(6)], [sd * r * .4, Y(6)]], dark('#2f3542', .3));
        fill(x, [[sd * r * .5, Y(1.35)], [sd * r * 1.0, Y(1.5)], [sd * r * .7, Y(2.4)]], dark('#2f3542', .15), 3);
      }
      fill(x, [[r * .7, Y(2.7)], [r * 1.15, Y(2.7)], [r * 1.12, Y(3.2)], [r * .72, Y(3.2)]], '#3b3f4c', 2.5);   // breast pocket
      fill(x, [[r * .8, Y(2.45)], [r * .95, Y(2.45)], [r * .95, Y(2.8)], [r * .8, Y(2.8)]], '#c8a24a', 2);      // pen
    },
    collar(x, r, Y) { fill(x, [[-r * .45, Y(1.35)], [0, Y(1.75)], [r * .45, Y(1.35)], [r * .3, Y(1.5)], [0, Y(1.6)], [-r * .3, Y(1.5)]], '#e6e2db', 2.5); },
    arms(x, r, Y, C) {
      sleeveArm(x, r, Y, -1, '#2f3542', C.skin, { cuff: 1.6, ang: .08 });   // rolled sleeves
      sleeveArm(x, r, Y, 1, '#2f3542', C.skin, { cuff: 1.6, ang: .05, hold(x, r, hy) {   // a VHS tape in his hand
        x.save(); x.translate(r * .1, hy + r * .2); x.rotate(.15);
        fill(x, [[-r * .5, -r * .3], [r * .5, -r * .3], [r * .5, r * .3], [-r * .5, r * .3]], '#1e1c22', 3);
        fill(x, [[-r * .38, -r * .2], [r * .38, -r * .2], [r * .38, r * .05], [-r * .38, r * .05]], '#efe6cf', 2);
        x.fillStyle = '#c0392b'; x.font = `700 ${r * .22}px 'IBM Plex Sans Thai'`; x.textAlign = 'center'; x.fillText('๙', 0, -r * .02);
        x.restore(); } });
      fill(x, [[-r * 1.86, Y(5.2)], [-r * 1.5, Y(5.2)], [-r * 1.5, Y(5.4)], [-r * 1.86, Y(5.4)]], '#c8a24a', 2);   // watch
    },
    legs(x, r, Y, feet, C) { trousers(x, r, Y, feet, '#25262d'); shoes(x, r, Y, feet, '#f1ede6', '#c9c4ba'); },
  },
  // ต้นข้าว: 17, the client. Her aunt's box of tapes, her channel, her name on the list.
  tonkhao: {
    name: 'ต้นข้าว', en: 'TONKHAO', heads: 6.4, skin: '#f0c7a3', hair: '#2a1e1c', eye: '#7a4a2e', look: -.2, blush: true,
    role: 'นักเรียน ม.๕ · ทำช่อง "ของเก่าเล่าผี" · หลานป้าจิต',
    traits: ['ร่าเริง กล้า แต่ใจร้อน', 'ชอบถ่ายทุกอย่าง', 'เป็นคนพูดชื่อตัวเองต่อหน้าเทป จนชื่อไปโผล่ในบัญชี'],
    pal: ['#f0c7a3', '#2a1e1c', '#f2b33d', '#2e3d5c', '#e0533f', '#f6f1e7'],
    hairBack(x, r, C) { fill(x, [[-r * 1.1, r * .1], [-r * 1.25, -r * 1.4, r * 1.25, -r * 1.4, r * 1.1, r * .1], [r * 1.12, r * .95], [r * .7, r * 1.1], [-r * .7, r * 1.1], [-r * 1.12, r * .95]], C.hair, 3); },
    hairFront(x, r, C) {
      fringe(x, r, C.hair, [[-.95, .6], [-.72, .05], [-.5, -.05], [-.3, .02], [-.08, -.08], [.12, .0], [.34, -.06], [.56, .04], [.76, .02], [.98, .6]], { top: -1.35, sideY: .8 });
      fill(x, [[r * .5, -r * .78], [r * .9, -r * .66], [r * .86, -r * .52], [r * .46, -r * .64]], '#e0533f', 2.5);   // hair clip
    },
    torso(x, r, Y, C) {
      const T = torsoShape(r, Y, 1.4, 5.3, 1.75, 1.6); fill(x, T, '#f2b33d', 3);
      shadeIn(x, T, [[-r * 2, Y(1)], [-r * .9, Y(1)], [-r * 1.1, Y(6)], [-r * 2, Y(6)]], dark('#f2b33d', .2));
      fill(x, [[-r * .7, Y(3.9)], [r * .7, Y(3.9)], [r * .8, Y(4.8)], [-r * .8, Y(4.8)]], dark('#f2b33d', .1), 2.5);   // pocket
      for (const sd of [-1, 1]) stroke(x, [[sd * r * .25, Y(1.6)], [sd * r * .3, Y(2.6)]], 2.5, '#f6f1e7');            // strings
      fill(x, [[-r * 1.7, Y(5.1)], [r * 1.7, Y(5.1)], [r * 1.6, Y(5.5)], [-r * 1.6, Y(5.5)]], dark('#f2b33d', .05), 2.5); // hem
    },
    collar(x, r, Y) { fill(x, [[-r * .9, Y(1.4)], [-r * .5, Y(1.9), 0, Y(1.95)], [r * .5, Y(1.9), r * .9, Y(1.4)], [r * .5, Y(1.6), 0, Y(1.65)], [-r * .5, Y(1.6), -r * .9, Y(1.4)]], dark('#f2b33d', .12), 2.5); },
    arms(x, r, Y, C) {
      sleeveArm(x, r, Y, -1, '#f2b33d', C.skin, { cuff: 2.9, len: 3.2, ang: .12 });
      sleeveArm(x, r, Y, 1, '#f2b33d', C.skin, { cuff: 2.9, len: 3.2, ang: .12, hold(x, r, hy) { fill(x, [[-r * .3, hy - r * .1], [r * .3, hy - r * .1], [r * .3, hy + r * .85], [-r * .3, hy + r * .85]], '#26252c', 3); ell(x, -r * .15, hy + r * .05, r * .05, r * .05, '#9fd3ff'); } });
    },
    legs(x, r, Y, feet, C) {
      for (const sd of [-1, 1]) {
        fill(x, [[sd * r * .1, Y(5.4)], [sd * r * .6, Y(5.4)], [sd * r * .52, feet - r * .3], [sd * r * .18, feet - r * .3]], C.skin, 3);
        fill(x, [[sd * r * .14, feet - r * 2.4], [sd * r * .56, feet - r * 2.4], [sd * r * .52, feet - r * .3], [sd * r * .18, feet - r * .3]], '#f6f1e7', 3);   // long socks
      }
      fill(x, [[-r * 1.5, Y(5.0)], [r * 1.5, Y(5.0)], [r * 1.45, Y(6.4)], [r * .05, Y(6.4)], [0, Y(6.0)], [-r * .05, Y(6.4)], [-r * 1.45, Y(6.4)]], '#2e3d5c', 3);   // shorts
      shoes(x, r, Y, feet, '#e0533f');
    },
  },
  // ป้าจิต (จิตรา): 62, owner of the closed video shop, the girl who climbed out of the window in 1998.
  jit: {
    name: 'ป้าจิต (จิตรา)', en: 'AUNT JIT', heads: 6.2, skin: '#dcae88', hair: '#b9b5b2', eye: '#5a4636', look: 0, jaw: 1.04,
    role: 'เจ้าของร้านวิดีโอ · ผู้รอดคนเดียวของ ม.๓/๒',
    traits: ['ใจดี แต่ปิดปากเงียบเรื่องอาคาร ๓', 'โทษตัวเองมา ๒๘ ปีว่าหนีออกมาคนเดียว', 'ความจริงที่ธามค้นพบจะปลดปล่อยเธอ'],
    pal: ['#dcae88', '#b9b5b2', '#7d4f8e', '#3f6b52', '#c9a227', '#efe7d8'],
    hairBack(x, r, C) { ell(x, 0, -r * 1.18, r * .45, r * .38, C.hair, 3); stroke(x, [[-r * .3, -r * 1.2], [0, -r * 1.35, r * .3, -r * 1.2]], 3, dark(C.hair, .2)); },
    hairFront(x, r, C) {
      const P = [[-r * .95, r * .1], [-r * 1.08, -r * 1.4, r * 1.08, -r * 1.4, r * .95, r * .1], [r * .8, -r * .5, r * .2, -r * .62], [0, -r * .48], [-r * .5, -r * .62, -r * .95, r * .1]];
      fill(x, P, C.hair, 3); for (let k = -2; k <= 2; k++) stroke(x, [[r * k * .2, -r * .98], [r * k * .32, -r * .6]], 2, dark(C.hair, .2));
    },
    glasses(x, r) { for (const sd of [-1, 1]) ell(x, sd * r * .4, r * .22, r * .25, r * .22, null, 3); stroke(x, [[-r * .15, r * .2], [r * .15, r * .2]], 3); stroke(x, [[-r * .65, r * .25], [-r * .8, r * 1.6, r * .8, r * 1.6, r * .65, r * .25]], 1.5, '#c9a227'); },
    torso(x, r, Y, C) {
      const T = torsoShape(r, Y, 1.4, 5.0, 1.65, 1.6); fill(x, T, '#7d4f8e', 3); shadeIn(x, T, [[-r * 2, Y(1)], [-r * .8, Y(1)], [-r * 1, Y(6)], [-r * 2, Y(6)]], dark('#7d4f8e', .25));
      for (let k = 0; k < 4; k++) ell(x, 0, Y(2.1 + k * .75), r * .08, r * .08, '#efe7d8', 2);
      // little woven pattern along the hem
      for (let k = -6; k <= 6; k++) fill(x, [[r * k * .25, Y(4.75)], [r * (k * .25 + .1), Y(4.6)], [r * (k * .25 + .2), Y(4.75)], [r * (k * .25 + .1), Y(4.9)]], '#c9a227', 0);
    },
    arms(x, r, Y, C) {
      sleeveArm(x, r, Y, -1, '#7d4f8e', C.skin, { cuff: 2.0, len: 3.1, ang: .14 });
      sleeveArm(x, r, Y, 1, '#7d4f8e', C.skin, { cuff: 2.0, len: 3.1, ang: .14, hold(x, r, hy) { ell(x, 0, hy + r * .55, r * .22, r * .22, null, 3); for (let k = 0; k < 3; k++) { x.save(); x.translate(0, hy + r * .7); x.rotate(-.5 + k * .5); fill(x, [[-r * .04, 0], [r * .04, 0], [r * .04, r * .45], [-r * .04, r * .45]], '#c9a227', 2); x.restore(); } } });
    },
    legs(x, r, Y, feet, C) {
      const S = [[-r * 1.6, Y(4.9)], [r * 1.6, Y(4.9)], [r * 1.25, feet - r * .2], [-r * 1.25, feet - r * .2]];
      fill(x, S, '#3f6b52', 3); shadeIn(x, S, [[-r * 2, Y(4)], [-r * .6, Y(4)], [-r * .5, feet], [-r * 2, feet]], dark('#3f6b52', .2));
      for (let k = 0; k < 5; k++) stroke(x, [[-r * 1.5 + k * .02 * r, Y(6.4 + k * 1.2)], [r * 1.5 - k * .02 * r, Y(6.4 + k * 1.2)]], 2, '#c9a227');
      shoes(x, r, Y, feet, '#6b4a36');
    },
  },
  // สมชาย: the night guard of 1998. Answered when his name was called, and stayed.
  somchai: {
    name: 'สมชาย', en: 'SOMCHAI', male: true, heads: 7, skin: '#c18d64', hair: '#1c1a1e', eye: '#4a3a2c', look: .1, jaw: 1.06,
    role: 'ยามกะดึก ปี ๒๕๔๑ · ติดอยู่ในเทปม้วนที่ ๑',
    traits: ['ซื่อตรง ทำตามกฎทุกข้อ', 'ถ่ายวิดีโอทุกคืนเพราะกลัวไม่มีใครเชื่อ', 'ขานรับชื่อตัวเอง จึงติดอยู่ในห้องนั้น'],
    pal: ['#c18d64', '#a8936a', '#2c2f38', '#1c1a1e', '#d8c46a', '#3a3f4a'],
    hairFront(x, r, C) { fringe(x, r, C.hair, [[-.9, -.1], [-.5, -.3], [0, -.35], [.5, -.3], [.9, -.1]], { top: -1.2, sideY: .05 }); stroke(x, [[-r * .3, r * .66], [0, r * .6, r * .3, r * .66]], r * .07, C.hair); },
    hat(x, r, C) {
      fill(x, [[-r * 1.02, -r * .45], [-r * 1.0, -r * 1.55, r * 1.0, -r * 1.55, r * 1.02, -r * .45]], '#2c2f38', 3);
      fill(x, [[-r * 1.05, -r * .5], [r * 1.05, -r * .5], [r * 1.0, -r * .22, 0, -r * .2], [-r * 1.0, -r * .22, -r * 1.05, -r * .5]], '#1f2128', 3);
      ell(x, 0, -r * .95, r * .2, r * .18, '#d8c46a', 2.5);
    },
    torso(x, r, Y, C) {
      const T = torsoShape(r, Y, 1.4, 5.3, 1.75, 1.5); fill(x, T, '#a8936a', 3); shadeIn(x, T, [[-r * 2, Y(1)], [-r * .9, Y(1)], [-r * 1.1, Y(6)], [-r * 2, Y(6)]], dark('#a8936a', .2));
      for (const sd of [-1, 1]) fill(x, [[sd * r * .5, Y(2.4)], [sd * r * 1.15, Y(2.4)], [sd * r * 1.15, Y(3.2)], [sd * r * .5, Y(3.2)]], dark('#a8936a', .08), 2.5);
      fill(x, [[r * .62, Y(2.0)], [r * 1.0, Y(2.0)], [r * 1.0, Y(2.35)], [r * .81, Y(2.5)], [r * .62, Y(2.35)]], '#d8c46a', 2);   // badge
      stroke(x, [[0, Y(1.6)], [0, Y(5.1)]], 2.5); fill(x, [[-r * 1.5, Y(5.0)], [r * 1.5, Y(5.0)], [r * 1.5, Y(5.35)], [-r * 1.5, Y(5.35)]], '#1c1a1e', 2.5);
      stroke(x, [[-r * 1.4, Y(1.8)], [r * 1.2, Y(5.0)]], 4, '#1c1a1e');   // camcorder strap
    },
    collar(x, r, Y) { for (const sd of [-1, 1]) fill(x, [[sd * r * .1, Y(1.55)], [sd * r * .7, Y(1.35)], [sd * r * .5, Y(2.1)]], '#9a8660', 2.5); },
    arms(x, r, Y, C) {
      sleeveArm(x, r, Y, -1, '#a8936a', C.skin, { cuff: 1.5, ang: .1 });
      sleeveArm(x, r, Y, 1, '#a8936a', C.skin, { cuff: 1.5, ang: .1, hold(x, r, hy) { fill(x, [[-r * .18, hy + r * .2], [r * .18, hy + r * .2], [r * .22, hy + r * 1.3], [-r * .22, hy + r * 1.3]], '#3a3f4a', 3); ell(x, 0, hy + r * 1.3, r * .22, r * .08, '#fff4c2', 2); } });
      fill(x, [[r * .9, Y(5.5)], [r * 1.9, Y(5.5)], [r * 1.9, Y(6.3)], [r * .9, Y(6.3)]], '#3a3f4a', 3); ell(x, r * 2.0, Y(5.9), r * .2, r * .3, '#1c1a1e', 3); ell(x, r * 1.05, Y(5.7), r * .06, r * .06, '#e0533f');   // camcorder
    },
    legs(x, r, Y, feet, C) { trousers(x, r, Y, feet, '#2c2f38'); shoes(x, r, Y, feet, '#1c1a1e', '#3a3a3a'); },
  },
  // ครูอร: homeroom teacher of ม.๓/๒. In the tapes, kind and young; as the ghost, still holding the register.
  on: {
    name: 'ครูอร', en: 'KRU ON', heads: 6.8, openBrow: true, skin: '#efc4a0', hair: '#16131a', eye: '#4b3326', look: 0,
    role: 'ครูประจำชั้น ม.๓/๒ · ไม่ยอมทิ้งนักเรียน',
    traits: ['อ่อนโยน เช็กชื่อนักเรียนทุกเช้า', 'ยังรอนักเรียนคนสุดท้ายขานรับ', 'ผีที่ไม่ได้ต้องการทำร้ายใคร'],
    pal: ['#efc4a0', '#16131a', '#f6f3ec', '#2a3760', '#a8392c', '#9aa0a8'],
    hairBack(x, r, C) { fill(x, [[-r * 1.05, -r * .2], [-r * 1.3, -r * 1.5, r * 1.3, -r * 1.5, r * 1.05, -r * .2], [r * 1.3, r * 3], [r * 1.15, r * 6.8], [r * .4, r * 6.4], [-r * .4, r * 6.6], [-r * 1.15, r * 6.9], [-r * 1.3, r * 3]], C.hair, 3); },
    hairFront(x, r, C) {
      const P = [[-r * .98, r * .9], [-r * 1.14, -r * 1.88, r * 1.14, -r * 1.88, r * .98, r * .9], [r * .82, r * .1], [r * .5, -r * .55, r * .04, -r * .78], [-r * .5, -r * .55, -r * .82, r * .1]];
      fill(x, P, C.hair, 3); shadeIn(x, P, [[-r * 1.2, r], [-r * 1.2, -r * 2], [-r * .1, -r * 2], [-r * .4, r]], dark(C.hair, .2));
      x.save(); trace(x, P); x.clip(); stroke(x, [[-r * .62, -r * .76], [0, -r * 1.1, r * .62, -r * .76]], r * .09, light(C.hair, .25)); x.restore();
    },
    torso(x, r, Y, C) {
      const T = torsoShape(r, Y, 1.4, 5.1, 1.55, 1.3); fill(x, T, '#f6f3ec', 3); shadeIn(x, T, [[-r * 2, Y(1)], [-r * .8, Y(1)], [-r * 1, Y(6)], [-r * 2, Y(6)]], dark('#f6f3ec', .12));
      fill(x, [[-r * .45, Y(1.75)], [0, Y(2.0)], [r * .45, Y(1.75)], [r * .3, Y(2.3)], [0, Y(2.05)], [-r * .3, Y(2.3)]], '#a8392c', 2.5);   // a ribbon bow
    },
    arms(x, r, Y, C) {
      const reg = (x, r, hy) => { x.save(); x.translate(r * .1, hy + r * .5); x.rotate(.05); fill(x, [[-r * .45, -r * .7], [r * .45, -r * .7], [r * .45, r * .7], [-r * .45, r * .7]], '#a8392c', 3); stroke(x, [[-r * .3, -r * .3], [r * .3, -r * .3]], 2.5, '#f6f3ec'); x.restore(); };
      sleeveArm(x, r, Y, -1, '#f6f3ec', C.skin, { cuff: 2.5, len: 3.3, ang: .1 });
      sleeveArm(x, r, Y, 1, '#f6f3ec', C.skin, { cuff: 2.5, len: 3.2, ang: .12, hold: reg });
    },
    legs(x, r, Y, feet, C) {
      const S = [[-r * 1.35, Y(5.0)], [r * 1.35, Y(5.0)], [r * 1.6, feet - r * 1.0], [-r * 1.6, feet - r * 1.0]];
      fill(x, S, '#2a3760', 3); shadeIn(x, S, [[-r * 2, Y(4)], [-r * .5, Y(4)], [-r * .3, feet], [-r * 2, feet]], dark('#2a3760', .25));
      for (const sd of [-1, 1]) fill(x, [[sd * r * .2, feet - r * 1.0], [sd * r * .5, feet - r * 1.0], [sd * r * .48, feet - r * .3], [sd * r * .22, feet - r * .3]], C.skin, 3);
      shoes(x, r, Y, feet, '#1c1a1e', '#3a3a3a');
    },
  },
};
// the ghost: the same teacher, too tall, grey, the hair over the face
CAST.onGhost = {
  ...CAST.on, name: 'ครูอร (ร่างผี)', en: 'KRU ON · GHOST', heads: 7.8, skin: '#b8bec6', eye: '#1a1420',
  role: 'เห็นได้แค่ในเทป ไม่เคยเห็นตรง ๆ',
  traits: ['สูงกว่าคนจริงราว ๑๕% คอยาว เอียงคอ', 'ผมปิดหน้า เห็นตาข้างเดียว', 'มือยังถือสมุดเช็กชื่อ'],
  pal: ['#b8bec6', '#16131a', '#d5d9de', '#555d6b', '#6b2a24', '#2a2f38'],
  hairFront(x, r, C) {
    const P = [[-r * 1.0, r * .2], [-r * 1.12, -r * 1.6, r * 1.12, -r * 1.6, r * 1.0, r * .2], [r * .95, r * 1.9], [r * .62, r * 2.2], [r * .4, r * 1.85], [r * .12, r * 2.3], [-r * .14, r * 1.9], [-r * .42, r * 2.25], [-r * .7, r * 1.9], [-r * .98, r * 2.1]];
    fill(x, P, C.hair, 3);
    for (let k = -4; k <= 4; k++) stroke(x, [[r * k * .2, -r * .5], [r * k * .22, r * 1.7]], 1.5, '#2c2833');
    ell(x, r * .3, r * .3, r * .06, r * .045, '#dcd6c4');   // one eye through the hair
  },
  torso(x, r, Y, C) { const T = torsoShape(r, Y, 1.4, 5.1, 1.45, 1.2); fill(x, T, '#d5d9de', 3); shadeIn(x, T, [[-r * 2, Y(1)], [-r * .8, Y(1)], [-r * 1, Y(6)], [-r * 2, Y(6)]], '#a9aeb5'); fill(x, [[-r * .45, Y(1.75)], [0, Y(2.0)], [r * .45, Y(1.75)], [r * .3, Y(2.3)], [0, Y(2.05)], [-r * .3, Y(2.3)]], '#6b2a24', 2.5); },
  arms(x, r, Y, C) {
    const reg = (x, r, hy) => { x.save(); x.translate(r * .1, hy + r * .5); x.rotate(.05); fill(x, [[-r * .45, -r * .7], [r * .45, -r * .7], [r * .45, r * .7], [-r * .45, r * .7]], '#6b2a24', 3); x.restore(); };
    sleeveArm(x, r, Y, -1, '#d5d9de', C.skin, { cuff: 2.8, len: 4.4, ang: .05 });   // arms too long
    sleeveArm(x, r, Y, 1, '#d5d9de', C.skin, { cuff: 2.8, len: 4.0, ang: .06, hold: reg });
  },
  legs(x, r, Y, feet, C) {
    const S = [[-r * 1.25, Y(5.0)], [r * 1.25, Y(5.0)], [r * 1.55, feet - r * .35], [-r * 1.55, feet - r * .35]]; fill(x, S, '#555d6b', 3);
    for (let k = -4; k <= 4; k++) stroke(x, [[r * k * .3, feet - r * .35], [r * k * .32 + r * .05, feet - r * .1]], 2, '#555d6b');   // ragged hem
  },
};

export function draw(x, id, o = {}) {
  const C = CAST[id];
  figure(x, C, o.H || 800, EXPR[o.expr || 'neutral'], o.bust);
}
export const EXPRS = EXPR;
