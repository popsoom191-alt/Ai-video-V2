// Procedural textures (Canvas2D): wallpaper, carpet, ceiling tiles, fluorescent light grilles, notices, exit sign
// All deterministic (mulberry seed), no external images
import * as THREE from 'three';
import { mulberry } from '/core/lib.js';

const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
function tex(c, { srgb = true, repeat = true, aniso = 8 } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = aniso; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}
// Paper/cloth texture base noise: lots of small translucent dots
function grain(x, w, h, n, a, R, cols) {
  for (let i = 0; i < n; i++) {
    x.fillStyle = cols[Math.floor(R() * cols.length)]; x.globalAlpha = a * (0.3 + R() * 0.7);
    const s = 1 + R() * 2; x.fillRect(R() * w, R() * h, s, s);
  }
  x.globalAlpha = 1;
}

// Wallpaper: one texture = 0.53 m wide (one wallpaper roll) × 0.53 m high, repeating vertically
// Old-style office wallpaper: warm yellow ground + thin vertical stripes + a column of small diamonds/herringbone between pairs of stripes, faded, print slightly misregistered
export function wallpaper() {
  const S = 512, c = cv(S, S), x = c.getContext('2d'), R = mulberry(11);
  x.fillStyle = '#d5bd66'; x.fillRect(0, 0, S, S);
  // Slight vertical colour banding (uneven printing)
  for (let i = 0; i < S; i += 2) { x.fillStyle = `rgba(120,100,40,${0.03 + 0.03 * Math.sin(i * 0.05) ** 2})`; x.fillRect(i, 0, 2, S); }
  const cols = 8, cw = S / cols;
  for (let k = 0; k < cols; k++) {
    const x0 = k * cw;
    if (k % 2) { x.fillStyle = 'rgba(150,120,40,.10)'; x.fillRect(x0, 0, cw, S); }   // alternating wide and narrow ground stripes (the vertical stripes still read at a distance)
    // Double thin vertical lines
    x.fillStyle = 'rgba(140,112,40,.7)'; x.fillRect(x0 + 2, 0, 3, S); x.fillRect(x0 + 8, 0, 2, S);
    // Diamond column (one every 32px), alternating filled/hollow
    for (let j = 0; j < S / 32; j++) {
      const cx = x0 + cw * 0.6 + 0.8, cy = j * 32 + 16 + (k % 2) * 16;
      x.beginPath(); x.moveTo(cx, cy - 7); x.lineTo(cx + 5, cy); x.lineTo(cx, cy + 7); x.lineTo(cx - 5, cy); x.closePath();
      if ((j + k) % 2) { x.fillStyle = 'rgba(150,122,48,.55)'; x.fill(); }
      else { x.strokeStyle = 'rgba(150,122,48,.6)'; x.lineWidth = 1.8; x.stroke(); }
    }
  }
  grain(x, S, S, 26000, 0.08, R, ['#8a7433', '#f3e6ad', '#6b5a26']);
  // Seam between widths (left edge): one light line + one dark line
  x.fillStyle = 'rgba(255,245,200,.35)'; x.fillRect(0, 0, 2, S);
  x.fillStyle = 'rgba(90,70,20,.35)'; x.fillRect(2, 0, 1, S);
  return tex(c);
}

// Carpet: low-pile industrial carpet, mustard brown + mottled; R/G/B texture + a separate greyscale "pile relief" map as the source for roughness/normals
export function carpet() {
  const S = 512, c = cv(S, S), x = c.getContext('2d'), R = mulberry(23);
  x.fillStyle = '#8c763c'; x.fillRect(0, 0, S, S);
  grain(x, S, S, 90000, 0.22, R, ['#6d5b2e', '#a88f55', '#7d6a38', '#b59c60', '#5d4d26']);
  // Fine tufted rows (very faint)
  for (let j = 0; j < S; j += 3) { x.fillStyle = `rgba(60,48,20,${0.05 + R() * 0.05})`; x.fillRect(0, j, S, 1); }
  return tex(c);
}

// Mineral-fibre ceiling tiles: 0.6 × 1.2 m each, the texture covers 1.2 × 1.2 (two tiles); the T-bar grid is drawn on the edges
export function ceiling() {
  const S = 512, c = cv(S, S), x = c.getContext('2d'), R = mulberry(31);
  x.fillStyle = '#d9d3b8'; x.fillRect(0, 0, S, S);
  // Wormhole-like small pits in the mineral-fibre tile
  for (let i = 0; i < 5200; i++) {
    x.fillStyle = `rgba(110,100,70,${0.18 + R() * 0.3})`;
    const w = 1 + R() * 2.5, h = 1 + R() * 1.2; x.fillRect(R() * S, R() * S, w, h);
  }
  grain(x, S, S, 20000, 0.1, R, ['#a79f82', '#eee8d0']);
  // T-bar grid: ~2.4cm wide (=10px), between two tiles
  x.fillStyle = '#e6e1cf';
  x.fillRect(0, 0, S, 5); x.fillRect(0, S - 5, S, 5); x.fillRect(0, 0, 5, S); x.fillRect(S - 5, 0, 5, S); x.fillRect(S / 2 - 5, 0, 10, S);
  x.fillStyle = 'rgba(70,60,40,.6)';
  x.fillRect(0, 5, S, 1); x.fillRect(0, S - 6, S, 1); x.fillRect(5, 0, 1, S); x.fillRect(S - 6, 0, 1, S); x.fillRect(S / 2 - 6, 0, 1, S); x.fillRect(S / 2 + 5, 0, 1, S);
  return tex(c);
}

// Fluorescent light grille (prismatic diffuser): 0.6 × 1.2 m; alpha channel = emissive area
export function troffer() {
  const W = 128, H = 256, c = cv(W, H), x = c.getContext('2d'), R = mulberry(41);
  x.fillStyle = '#9a9786'; x.fillRect(0, 0, W, H);        // metal frame
  x.fillStyle = '#fbfaf0'; x.fillRect(7, 7, W - 14, H - 14);
  // Prism pattern: fine grid
  for (let i = 7; i < W - 7; i += 4) { x.fillStyle = 'rgba(180,180,160,.25)'; x.fillRect(i, 7, 1, H - 14); }
  for (let j = 7; j < H - 7; j += 4) { x.fillStyle = 'rgba(180,180,160,.25)'; x.fillRect(7, j, W - 14, 1); }
  // The two tubes behind the diffuser are brighter
  const g1 = x.createLinearGradient(7, 0, W - 7, 0);
  g1.addColorStop(0, 'rgba(255,255,255,0)'); g1.addColorStop(.3, 'rgba(255,255,255,.5)'); g1.addColorStop(.36, 'rgba(255,255,255,0)');
  g1.addColorStop(.64, 'rgba(255,255,255,0)'); g1.addColorStop(.7, 'rgba(255,255,255,.5)'); g1.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g1; x.fillRect(7, 7, W - 14, H - 14);
  // Shadows of dead insects inside the diffuser (an old-office-building detail)
  for (let i = 0; i < 3; i++) { x.fillStyle = 'rgba(60,55,40,.35)'; x.beginPath(); x.ellipse(15 + R() * (W - 30), 20 + R() * (H - 40), 2 + R() * 3, 1 + R() * 2, R() * 3, 0, 7); x.fill(); }
  return tex(c, { repeat: false });
}

// Text layout
function wrap(x, text, maxW) {
  const words = text.split(' '), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines;
}
export const RULES = [
  'The humming of the lights is normal.',
  'You are the only employee on this floor.',
  'If the lights flicker three times, do not look at the ceiling.',
  'There are no exits on this floor. If you see an EXIT sign, do not follow it.',
  'If a coworker waves at you, wave back.',
];
// Notice: portrait 0.34 × 0.46 m, 1020×1380 px (3px/mm); kind = 'rules' | 'six'
const TH = "'IBM Plex Sans Thai'";
const RULES_TH = [
  'เดินตรวจให้ครบทุกห้อง ก่อนตีสาม',
  'ถ้ากริ่งเข้าเรียนดัง ให้หยุดนิ่ง นับหนึ่งถึงสิบ',
  'ห้อง ม.๓/๒ ไม่มีแล้ว ไม่ต้องตรวจ',
  'ถ้าได้ยินใครเรียกชื่อ ห้ามขานรับ',
  'ห้ามบันทึกวิดีโอภายในอาคาร',
];
const NUM_TH = ['๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
const NAMES = ['ด.ช.วิชัย ใจดี', 'ด.ญ.สุดา แก้วงาม', 'ด.ช.ประเสริฐ ทองคำ', 'ด.ญ.มาลี ศรีสุข', 'ด.ช.อนันต์ บุญมา', 'ด.ญ.พรทิพย์ จันทร์เพ็ญ', 'ด.ช.สมศักดิ์ รักไทย', 'ด.ญ.กาญจนา ดวงดี'];
function paper(x, W, H, R, age) {
  x.fillStyle = age > .5 ? '#ece4c6' : '#f2eedd'; x.fillRect(0, 0, W, H);
  const eg = x.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.75);
  eg.addColorStop(0, 'rgba(0,0,0,0)'); eg.addColorStop(1, `rgba(150,120,50,${0.18 + age * 0.2})`);
  x.fillStyle = eg; x.fillRect(0, 0, W, H);
  grain(x, W, H, 30000, 0.06, R, ['#8c7c55', '#fff9e6']);
}
function specks(x, W, H, R) {
  for (let i = 0; i < 90; i++) { x.fillStyle = `rgba(30,30,30,${R() * 0.25})`; x.fillRect(R() * W, R() * H, 1 + R() * 3, 1 + R() * 2); }
  x.fillStyle = 'rgba(0,0,0,.05)'; x.fillRect(0, H * 0.52, W, 3); x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(0, H * 0.52 + 3, W, 2);
}
// kind 'rules': the night-round rules on the board · kind 'list': the class list of room 3/2, a new name at the bottom
export function notice(kind = 'rules', { age = 0.5, seed = 5 } = {}) {
  const W = 1020, H = 1380, c = cv(W, H), x = c.getContext('2d'), R = mulberry(seed);
  paper(x, W, H, R, age);
  const ink = '#1d1b17', M = 80;
  x.fillStyle = ink; x.textBaseline = 'alphabetic';
  x.font = `700 32px ${TH}`; x.fillText('อาคาร ๓ — โปรดอ่าน', M, 118);
  const hr = kind === 'rules' ? 'แบบ รย-๐๑ (แก้ไขครั้งที่ ๗)' : 'แบบ ปพ.๕'; x.font = `600 30px ${TH}`; x.fillText(hr, W - M - x.measureText(hr).width, 118);
  x.fillRect(M, 140, W - 2 * M, 5);
  if (kind === 'rules') {
    x.font = `700 92px ${TH}`; x.fillText('ระเบียบเวรยาม', M, 262); x.fillText('กลางคืน', M, 368);
    x.font = `400 36px ${TH}`; x.fillStyle = '#3a362d'; x.fillText('อ่านก่อนเริ่มเดินตรวจทุกครั้ง', M, 430);
    x.fillStyle = ink; x.fillRect(M, 462, W - 2 * M, 2);
    let y = 552;
    RULES_TH.forEach((r, i) => {
      x.font = `700 46px ${TH}`; x.fillText(NUM_TH[i] + '.', M, y);
      x.font = `600 46px ${TH}`;
      for (const ln of wrap(x, r, W - 2 * M - 70)) { x.fillText(ln, M + 70, y); y += 60; }
      y += 34;
    });
    x.fillRect(M, H - 170, W - 2 * M, 2);
    x.font = `400 32px ${TH}`; x.fillStyle = '#3a362d';
    x.fillText('ขอบคุณที่ให้ความร่วมมือ', M, H - 116); x.fillText('ฝ่ายอาคารสถานที่', M, H - 72);
  } else {
    x.font = `700 84px ${TH}`; x.fillText('บัญชีรายชื่อนักเรียน', M, 256);
    x.font = `600 44px ${TH}`; x.fillText('ชั้น ม.๓/๒   ปีการศึกษา ๒๕๔๑', M, 330);
    x.fillRect(M, 362, W - 2 * M, 2);
    let y = 440;
    NAMES.forEach((n, i) => {
      x.font = `600 40px ${TH}`; x.fillStyle = ink; x.fillText(NUM_TH[i] + '.', M + 6, y); x.fillText(n, M + 76, y);
      x.fillStyle = 'rgba(30,27,23,.35)'; x.fillRect(M, y + 16, W - 2 * M, 1); y += 72;
    });
    // the new name: added by hand in red ballpoint, slightly crooked
    x.save(); x.translate(M + 6, y + 12); x.rotate(-.025);
    x.fillStyle = '#b3201c'; x.font = `italic 600 50px ${TH}`;
    x.fillText('๙.  สมชาย  (นักเรียนใหม่)', 0, 0);
    x.strokeStyle = '#b3201c'; x.lineWidth = 3; x.beginPath(); x.moveTo(-4, 20); x.bezierCurveTo(200, 30, 420, 12, 640, 24); x.stroke();
    x.restore();
    x.fillStyle = '#3a362d'; x.fillRect(M, H - 170, W - 2 * M, 2);
    x.font = `400 32px ${TH}`; x.fillText('ครูประจำชั้น ..................................', M, H - 100);
  }
  specks(x, W, H, R);
  return tex(c, { repeat: false, aniso: 16 });
}
// the plate above a classroom door ("ม.๓/๑"); red = the glowing plate of room 3/2, the film's one saturated colour
export function plate(txt, red = false) {
  const W = 512, H = 200, c = cv(W, H), x = c.getContext('2d');
  x.fillStyle = red ? '#1a1210' : '#e8e2cc'; x.fillRect(0, 0, W, H);
  if (!red) { x.strokeStyle = '#2a4a36'; x.lineWidth = 10; x.strokeRect(8, 8, W - 16, H - 16); }
  x.fillStyle = red ? '#ff2a1a' : '#21402f'; x.font = `700 128px ${TH}`; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(txt, W / 2, H / 2 + 10);
  return tex(c, { repeat: false });
}
export const exitSign = () => plate('ม.๓/๒', true);
// classroom door: varnished wood, two panels, a small dark glass window
export function door() {
  const W = 360, H = 820, c = cv(W, H), x = c.getContext('2d'), R = mulberry(31);
  x.fillStyle = '#7a5230'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) { x.strokeStyle = `rgba(${40 + R() * 40},${25 + R() * 20},10,${.08 + R() * .12})`; x.lineWidth = 1 + R() * 2; const xx = R() * W; x.beginPath(); x.moveTo(xx, 0); x.bezierCurveTo(xx + 8 * (R() - .5), H * .3, xx + 8 * (R() - .5), H * .7, xx + 6 * (R() - .5), H); x.stroke(); }
  x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(40, 470, W - 80, 300);
  x.fillStyle = 'rgba(255,230,190,.08)'; x.fillRect(46, 476, W - 92, 4);
  x.fillStyle = '#0e1210'; x.fillRect(60, 70, W - 120, 300);
  x.fillStyle = 'rgba(150,170,160,.12)'; x.beginPath(); x.moveTo(70, 80); x.lineTo(150, 80); x.lineTo(70, 220); x.closePath(); x.fill();
  x.strokeStyle = '#4b301a'; x.lineWidth = 12; x.strokeRect(60, 70, W - 120, 300);
  x.fillStyle = '#c9c2a8'; x.fillRect(W - 70, 430, 22, 60);
  grain(x, W, H, 9000, .06, R, ['#3a2410', '#a07040']);
  return tex(c, { repeat: false });
}
// terrazzo floor: grey-beige cement with stone chips, the floor of every Thai school corridor
export function terrazzo() {
  const S = 512, c = cv(S, S), x = c.getContext('2d'), R = mulberry(23);
  x.fillStyle = '#a49c88'; x.fillRect(0, 0, S, S);
  grain(x, S, S, 50000, 0.18, R, ['#8f8875', '#bdb5a0', '#9a927e']);
  for (let i = 0; i < 1400; i++) {
    const cx = R() * S, cy = R() * S, r = 1.5 + R() * R() * 7;
    x.fillStyle = ['#ece6d6', '#5f5a4e', '#c7b79a', '#7d7462', '#e2dccb', '#3f3c35'][Math.floor(R() * 6)];
    x.globalAlpha = .55 + R() * .4;
    x.beginPath(); for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283 + R() * .6, rr = r * (.6 + R() * .6); x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.fill();
  }
  x.globalAlpha = 1;
  x.fillStyle = 'rgba(70,64,54,.55)'; x.fillRect(0, 0, S, 3); x.fillRect(0, 0, 3, S);   // brass/joint lines every tile
  return tex(c);
}

export function cork() {
  const S = 256, c = cv(S, S), x = c.getContext('2d'), R = mulberry(51);
  x.fillStyle = '#a07a4a'; x.fillRect(0, 0, S, S);
  grain(x, S, S, 16000, 0.45, R, ['#6e4f2a', '#c49a62', '#8a6436', '#d8b07a']);
  return tex(c);
}

// Exit sign panel: red EXIT on white + arrows on both sides; alpha = emissive strength
export function outlet() {
  const W = 64, H = 112, c = cv(W, H), x = c.getContext('2d');
  x.fillStyle = '#e8e2cc'; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 2; x.strokeRect(1, 1, W - 2, H - 2);
  for (const cy of [32, 80]) {
    x.fillStyle = '#d7d0b8'; x.beginPath(); x.ellipse(W / 2, cy, 17, 20, 0, 0, 7); x.fill();
    x.fillStyle = '#2a2620'; x.fillRect(W / 2 - 9, cy - 9, 3, 10); x.fillRect(W / 2 + 6, cy - 9, 3, 10);
    x.beginPath(); x.arc(W / 2, cy + 9, 3, 0, 7); x.fill();
  }
  x.fillStyle = '#8b856f'; x.beginPath(); x.arc(W / 2, H / 2, 3, 0, 7); x.fill();
  return tex(c, { repeat: false });
}
