// The cast of "ม้วนที่ ๙" on the 80s cel head model (face.js): colour model, hair style, outfit and props per character.
// bust(g, id, o): draws the character with the cranium centre at (0,0), radius 80 (shoulders reach y≈330).
import { cel, poly, line, mix, TAU, path } from './cel.js';
import { head80, lock } from './face.js';

const BASE = {
  skin: { f: '#ffd9c4', s: '#e2a395', h: '#fff1e8', l: '#5a2e2e' }, blush: '#ff9a9a', lash: '#1c0f26', white_eye: '#fbf8ff', mouth: '#9a3b4a',
  magenta: { f: '#ff4fa8', s: '#b8327a', l: '#5c1238' }, phone: { f: '#2a2a34', s: '#16161d', h: '#5c5c70', l: '#08080c' },
  lens: { f: '#86e6ff', s: '#3a9fd0', h: '#ffffff', l: '#1d3a58' }, chrome: { f: '#dfe7f3', s: '#646f90', h: '#ffffff', l: '#2b3350' }, strap: { f: '#5a4c66', s: '#3a3044', l: '#16101c' },
};
const C = (f, s, h, l) => ({ f, s, h, l });

// ---------- hair transforms (on the base model's locks: [x0,y0,x1,y1,tipx,tipy,bend]) ----------
const shorten = (L, k) => L.map(([x0, y0, x1, y1, tx, ty, b]) => [x0, y0, x1, y1, tx, (y0 + y1) / 2 + (ty - (y0 + y1) / 2) * k, b]);
const lengthen = (L, y) => L.map(([x0, y0, x1, y1, tx, ty, b]) => [x0, y0, x1, y1, tx + Math.sign(tx) * 8, y, b]);
const clampY = (P, y) => P.map(([x, yy]) => [x, Math.min(yy, y)]);
const stretchY = (P, from, k) => P.map(([x, y]) => [x, y > from ? from + (y - from) * k : y]);

// ---------- outfits: shoulders + collar, per view ----------
const DX = { front: 0, q: -14, side: -34 };
function shoulders(g, view, col, E, so = [-30, -10]) {
  const dx = DX[view], dy = E.shoulders || 0;
  return cel(g, [[-190 + dx, 330], [-182 + dx, 206 + dy], [-140 + dx, 158 + dy], [-60 + dx, 138 + dy * .5], [50 + dx, 138 + dy * .5], [124 + dx, 156 + dy], [166 + dx, 204 + dy], [176 + dx, 330]], { ...col, so, ho: [8, 6], lw: 1.65 });
}
const OUT = {
  // Tham: white tee under an open charcoal overshirt, a pen in the pocket
  tham(g, P, view, E, layer) {
    if (layer !== 'back') return;
    const dx = DX[view];
    shoulders(g, view, P.jacket, E);
    cel(g, poly([[-52 + dx, 140], [52 + dx, 140], [44 + dx, 330], [-46 + dx, 330]]), { ...P.tee, so: [-10, 0], lw: 1.4 });
    cel(g, poly([[-34 + dx, 138], [0 + dx, 176], [34 + dx, 138], [26 + dx, 134], [0 + dx, 160], [-26 + dx, 134]]), { ...P.tee, f: P.tee.s, lw: 1.2 });   // the tee's neckline
    for (const sd of [-1, 1]) cel(g, poly([[sd * 52 + dx, 140], [sd * 96 + dx, 150], [sd * 70 + dx, 230], [sd * 50 + dx, 330]]), { ...P.jacket, f: P.jacket.s, lw: 1.4 });   // lapels
    cel(g, poly([[86 + dx, 236], [124 + dx, 236], [122 + dx, 272], [88 + dx, 272]]), { ...P.jacket, lw: 1.2 });
    cel(g, poly([[94 + dx, 222], [102 + dx, 222], [102 + dx, 250], [94 + dx, 250]]), { ...P.gold, lw: 1 });
  },
  // Tonkhao: an oversized mustard hoodie, the hood bunched behind the neck, drawstrings
  tonkhao(g, P, view, E, layer) {
    const dx = DX[view];
    if (layer === 'back') {
      cel(g, poly([[-110 + dx, 170], [-90 + dx, 120], [0 + dx, 104], [90 + dx, 120], [110 + dx, 170]]), { ...P.jacket, f: P.jacket.s, lw: 1.5 });   // hood behind
      shoulders(g, view, P.jacket, E);
      cel(g, poly([[-60 + dx, 330], [-56 + dx, 290], [56 + dx, 290], [60 + dx, 330]]), { ...P.jacket, f: P.jacket.s, lw: 1.3 });   // pocket
      return;
    }
    cel(g, path([[-50 + dx, 128, 1], [0 + dx, 150], [50 + dx, 128, 1], [40 + dx, 146], [0 + dx, 168], [-40 + dx, 146]]), { ...P.jacket, lw: 1.5 });
    for (const sd of [-1, 1]) { line(g, [[sd * 16 + dx, 160], [sd * 20 + dx, 230]], P.white.f, 3); g.fillStyle = P.white.s; g.beginPath(); g.arc(sd * 20 + dx, 232, 4, 0, TAU); g.fill(); }
  },
  // Aunt Jit: a purple blouse with a round collar and small buttons, a woven trim
  jit(g, P, view, E, layer) {
    if (layer !== 'back') return;
    const dx = DX[view];
    shoulders(g, view, P.jacket, E);
    cel(g, path([[-56 + dx, 140, 1], [0 + dx, 186], [56 + dx, 140, 1], [40 + dx, 136], [0 + dx, 166], [-40 + dx, 136]]), { ...P.jacket, f: P.jacket.h, lw: 1.3 });
    for (let k = 0; k < 4; k++) { g.fillStyle = P.white.f; g.beginPath(); g.arc(2 + dx, 200 + k * 34, 4.5, 0, TAU); g.fill(); g.strokeStyle = P.jacket.l; g.lineWidth = 1; g.stroke(); }
    for (let k = -8; k <= 8; k++) cel(g, poly([[k * 22 + dx, 312], [k * 22 + 11 + dx, 302], [k * 22 + 22 + dx, 312], [k * 22 + 11 + dx, 322]]), { f: P.gold.f, l: P.gold.l, lw: .8 });
  },
  // Somchai: a khaki guard shirt, pointed collar, a badge, a strap across
  somchai(g, P, view, E, layer) {
    if (layer !== 'back') return;
    const dx = DX[view];
    shoulders(g, view, P.jacket, E);
    for (const sd of [-1, 1]) cel(g, poly([[sd * 4 + dx, 160], [sd * 60 + dx, 136], [sd * 48 + dx, 196]]), { ...P.jacket, f: P.jacket.h, lw: 1.3 });
    line(g, [[2 + dx, 160], [4 + dx, 330]], P.jacket.l, 1.5);
    for (const sd of [-1, 1]) cel(g, poly([[sd * 40 + dx, 220], [sd * 100 + dx, 220], [sd * 100 + dx, 262], [sd * 40 + dx, 262]]), { ...P.jacket, f: P.jacket.s, lw: 1.1 });
    cel(g, poly([[60 + dx, 196], [88 + dx, 196], [88 + dx, 214], [74 + dx, 224], [60 + dx, 214]]), { ...P.gold, lw: 1 });
    line(g, [[-150 + dx, 190], [150 + dx, 330]], P.strap.l, 7);
  },
  // Kru On: a white blouse with a red ribbon bow
  on(g, P, view, E, layer) {
    if (layer !== 'back') return;
    const dx = DX[view];
    shoulders(g, view, P.jacket, E, [-24, -8]);
    for (const sd of [-1, 1]) cel(g, path([[sd * 4 + dx, 150, 1], [sd * 52 + dx, 136], [sd * 44 + dx, 170, 1]]), { ...P.jacket, f: P.jacket.h, lw: 1.2 });
    cel(g, poly([[2 + dx, 166], [-34 + dx, 150], [-30 + dx, 184]]), { ...P.bow, lw: 1.2 }); cel(g, poly([[2 + dx, 166], [38 + dx, 150], [34 + dx, 184]]), { ...P.bow, lw: 1.2 });
    cel(g, poly([[-4 + dx, 166], [-12 + dx, 214], [0 + dx, 206], [10 + dx, 216], [6 + dx, 166]]), { ...P.bow, f: P.bow.s, lw: 1.1 });
    g.fillStyle = P.bow.s; g.beginPath(); g.ellipse(2 + dx, 166, 7, 8, 0, 0, TAU); g.fill();
  },
};

// ---------- the characters ----------
export const CAST = {
  tham: {
    name: 'ธาม', role: 'พระเอก · ช่างกู้เทปเก่า อายุ ๑๙',
    P: { ...BASE, male: true, skin: C('#f6cfb0', '#d99c86', '#ffeadc', '#5a2e2e'), hair: C('#2c2a38', '#17161f', '#6a6684', '#0d0c14'), eye: C('#7a6450', '#3c2c1e', '#d8bf9e', '#1a1008'), lash: '#16121c',
      jacket: C('#3b4254', '#262b38', '#6d7792', '#10131b'), tee: C('#f3f2ee', '#c9c6be', '#ffffff', '#4a4a50'), gold: C('#e0b44e', '#9a6c28', '#fff0b0', '#4d3210') },
    o: {
      ponytail: false, headset: false, outfit: OUT.tham, blush: .06,
      hairFn: (H) => { H.goggles = []; H.side = shorten(H.side, .55); H.locks = shorten(H.locks, .92); H.back = clampY(H.back, 46).map(([x, y]) => [x * .92, y]);
        H.cap = H.cap.map(([x, y]) => [x * .92, y < -60 ? y - 6 : y]); return H; },
    },
  },
  tonkhao: {
    name: 'ต้นข้าว', role: 'ยูทูบเบอร์ อายุ ๑๗ · หลานป้าจิต',
    P: { ...BASE, hair: C('#3e2b27', '#241816', '#86645a', '#170e0c'), eye: C('#9a6038', '#4e2c18', '#eebc92', '#1e0e06'),
      jacket: C('#f2b33d', '#c98a22', '#ffd98a', '#5a3a08'), white: C('#f6f2ea', '#c8c0b0', '#ffffff', '#4a4238') },
    o: {
      ponytail: false, headset: false, outfit: OUT.tonkhao, blush: .3,
      hairFn: (H) => { H.goggles = []; H.side = H.side.map(([x0, y0, x1, y1, tx, ty, b]) => [x0, y0, x1, y1, tx + Math.sign(tx) * 6, 92, b]); H.back = stretchY(H.back, 0, 1.12); return H; },
      propFn: (g, P, view) => { const x = view === 'side' ? 40 : view === 'q' ? 30 : 40; cel(g, poly([[x, -70], [x + 34, -62], [x + 32, -52], [x - 2, -60]]), { f: '#ff5a6e', s: '#c83048', l: '#5c1020', lw: 1.3, so: [-2, -2] }); },
    },
  },
  jit: {
    name: 'ป้าจิต (จิตรา)', role: 'เจ้าของร้านวิดีโอ · ผู้รอดคนเดียวของ ม.๓/๒',
    P: { ...BASE, skin: C('#f0c6a6', '#cf9a80', '#ffe6d6', '#5a2e2e'), hair: C('#c4c0cc', '#918c9c', '#f2eef8', '#4a4652'), eye: C('#6a5040', '#34261c', '#c8ac90', '#140c06'), lash: '#3a2e34',
      jacket: C('#7d4f8e', '#573364', '#b48ac4', '#2a1432'), white: C('#f6f2ea', '#c8c0b0', '#ffffff', '#4a4238'), gold: C('#e0b44e', '#9a6c28', '#fff0b0', '#4d3210') },
    o: {
      ponytail: false, headset: false, outfit: OUT.jit, blush: .12,
      hairFn: (H) => { H.goggles = []; H.side = shorten(H.side, .32); H.locks = shorten(H.locks, .45); H.strays = []; H.back = clampY(H.back, 30); return H; },
      backFn: (g, P, view, st, SO) => { const x = view === 'front' ? 0 : view === 'q' ? -40 : -56, y = view === 'front' ? -108 : -96; const B = new Path2D(); B.ellipse(x, y, 34, 28, 0, 0, TAU); cel(g, B, { ...st, so: SO(6) }); },
      glasses: (g, P, view) => {
        const E = view === 'front' ? [[-38, 24, 25], [38, 24, 25]] : view === 'q' ? [[-21, 24, 27], [36, 22, 17]] : [[60, 24, 17]];
        g.strokeStyle = '#6a4a2a'; g.lineWidth = 2.6; for (const [x, y, r] of E) { g.beginPath(); g.ellipse(x, y, r, r * .82, 0, 0, TAU); g.stroke(); }
        if (E.length === 2) line(g, [[E[0][0] + E[0][2], 22], [E[1][0] - E[1][2], 22]], '#6a4a2a', 2.4);
        line(g, [[view === 'side' ? 10 : -66, 26], [view === 'side' ? 0 : -70, 90], [view === 'side' ? 20 : -40, 150]], '#c9a227', 1.4);
      },
    },
  },
  somchai: {
    name: 'สมชาย', role: 'ยามกะดึก ปี ๒๕๔๑',
    P: { ...BASE, male: true, skin: C('#dfae86', '#b88062', '#f6d2b4', '#4a2416'), hair: C('#22202a', '#121118', '#4e4a5c', '#0a090e'), eye: C('#5a4434', '#2c2018', '#a88a70', '#100804'), blush: '#e08a7a',
      jacket: C('#b09c70', '#86744e', '#d8c89e', '#3e3218'), gold: C('#e0c45e', '#9a8028', '#fff0b0', '#4d3a10'), strap: C('#2a2630', '#16141a', '#4a4652', '#0a090c'), cap: C('#2e3240', '#1c1f2a', '#555b70', '#0c0d12') },
    o: {
      ponytail: false, headset: false, outfit: OUT.somchai, blush: .04,
      hairFn: (H) => { H.goggles = []; H.side = shorten(H.side, .28); H.locks = shorten(H.locks, .55); H.strays = []; H.back = clampY(H.back, 30); return H; },
      topFn: (g, P, view, st, SO) => {   // the peaked cap, over the hair
        const dx = view === 'front' ? 0 : view === 'q' ? -6 : -14, W = view === 'side' ? 74 : 88;
        cel(g, path([[-W + dx, -40, 1], [-W - 4 + dx, -96], [dx, -122], [W + 4 + dx, -96], [W + dx, -40, 1], [dx, -54]]), { ...P.cap, so: SO(6), lw: 1.6 });
        const vis = view === 'side' ? [[30, -48], [104, -44], [100, -34], [24, -36]] : view === 'q' ? [[-50, -44], [70, -46], [92, -30], [-40, -28]] : [[-74, -46], [74, -46], [66, -28], [-66, -28]];
        cel(g, poly(vis), { ...P.cap, f: P.cap.s, lw: 1.5 });
        const bx = view === 'side' ? 58 : view === 'q' ? 18 : 0; const Bd = new Path2D(); Bd.ellipse(bx, -82, 11, 10, 0, 0, TAU); cel(g, Bd, { ...P.gold, lw: 1.2 });
      },
      propFn: (g, P, view) => { if (view === 'side') return; const x = view === 'q' ? 24 : 0; cel(g, path([[x - 16, 66, 1], [x, 61], [x + 14, 66, 1], [x, 70]]), { f: '#1c1a20', l: '#0a090c', lw: .8 }); },   // moustache
    },
  },
  on: {
    name: 'ครูอร', role: 'ครูประจำชั้น ม.๓/๒',
    P: { ...BASE, hair: C('#221d2c', '#110e18', '#5a4e72', '#08060c'), eye: C('#6a4232', '#36201a', '#c89a80', '#140806'),
      jacket: C('#f6f3ec', '#cfc8ba', '#ffffff', '#4a4640'), bow: C('#c0392b', '#8a2418', '#ff8a7a', '#3e0c06') },
    o: {
      ponytail: false, headset: false, outfit: OUT.on, blush: .22,
      hairFn: (H, view) => {   // long straight hair: extra long locks over both shoulders
        H.goggles = []; H.side = lengthen(H.side, 330); H.back = H.back.map(([x, y]) => [x * 1.12, y > 0 ? 330 : y]);
        if (view !== 'side') H.side.push([-84, -10, -70, -36, -104, 330, -4], [-90, 20, -78, -10, -118, 320, -6], [70, -36, 84, -10, view === 'q' ? 70 : 104, 330, 4], [78, -10, 90, 20, view === 'q' ? 80 : 118, 320, 6]);
        else H.side.push([-10, -50, 10, -40, 0, 320, 8], [-30, -40, -10, -30, -24, 320, 6]);
        return H; },
    },
  },
};
// the ghost: the same teacher, grey, the hair hanging over the face, one eye showing
CAST.onGhost = {
  name: 'ครูอร (ร่างผี)', role: 'เห็นได้แค่ในเทป',
  P: { ...CAST.on.P, skin: C('#c9ced6', '#9aa1ad', '#e8ebf0', '#3a3e48'), blush: '#9aa1ad', jacket: C('#c3c8cf', '#8f959f', '#e2e6ea', '#3a3e46'), bow: C('#5a2620', '#3a1410', '#7a3a32', '#1a0806'), eye: C('#3a3040', '#1a1420', '#6a6070', '#000000') },
  o: {
    ...CAST.on.o, blush: 0, noBrows: true,
    topFn: (g, P, view, st, SO) => {   // the curtain of hair over the face, with a gap for one eye
      const xs = view === 'side' ? [10, 30, 50, 70, 86] : [-70, -50, -30, -12, 6, 24, 44, 64, 78];
      xs.forEach((x, i) => { const gap = view !== 'side' && i === 6; if (gap) return; cel(g, lock(x - 12, -70, x + 12, -70, x + (i % 2 ? 4 : -4), 150 + (i % 3) * 18, i % 2 ? 4 : -4), { ...st, so: SO(5) }); });
    },
  },
};

export function bust(g, id, o = {}) { const c = CAST[id]; head80(g, c.P, { ...c.o, wind: 0, ...o }); }
