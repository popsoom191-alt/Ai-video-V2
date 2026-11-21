// FILE 03 backgrounds, flat vector: Beer's tape shop (day / night), the building at night, the lobby, the 4th-floor corridor,
// the lift, the paper, the VCR. All 1920×1080, deterministic.
const W = 1920, H = 1080;
const rect = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(x, y, w, h); };
const rr = (g, x, y, w, h, r, c) => { g.fillStyle = c; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };
const poly = (g, P, c) => { g.fillStyle = c; g.beginPath(); g.moveTo(...P[0]); for (const p of P.slice(1)) g.lineTo(...p); g.closePath(); g.fill(); };
const vgrad = (g, x, y, w, h, a, b) => { const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(x, y, w, h); };
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
const TAPEC = ['#c8322c', '#2a6ab0', '#e0a830', '#2a8a5e', '#6a4a9a', '#d8d2c0', '#3a3a40'];
const TH = "'IBM Plex Sans Thai'";

export function shop(g, t, night = false, o = {}) {
  vgrad(g, 0, 0, W, H, night ? '#1e2430' : '#5a6a72', night ? '#121620' : '#3e4a52');
  // window
  rr(g, 1300, 120, 460, 330, 6, night ? '#0e1424' : '#a8c8d8'); rect(g, 1525, 120, 10, 330, night ? '#2a3040' : '#e8eef0'); rect(g, 1300, 280, 460, 10, night ? '#2a3040' : '#e8eef0');
  if (night) for (let i = 0; i < 12; i++) { g.fillStyle = `rgba(255,220,150,${.3 + .3 * hash(i)})`; g.fillRect(1320 + hash(i + 3) * 420, 300 + hash(i + 7) * 130, 10, 14); }
  // shelves of tapes
  for (let r = 0; r < 4; r++) {
    rect(g, 120, 170 + r * 140, 820, 14, night ? '#3a3026' : '#7a5a3e');
    for (let k = 0; k < 26; k++) { const c = TAPEC[Math.floor(hash(r * 40 + k) * TAPEC.length)]; rect(g, 128 + k * 31, 108 + r * 140, 24, 62, night ? mixd(c) : c); }
  }
  // clock
  g.fillStyle = night ? '#d8d4c8' : '#f2eee4'; g.beginPath(); g.arc(1120, 200, 52, 0, 7); g.fill();
  const hr = o.clock ?? (night ? 23.97 : 14.2), a1 = (hr % 12) / 12 * 6.283 - 1.571, a2 = (hr % 1) * 6.283 - 1.571;
  g.strokeStyle = '#2a2a2a'; g.lineCap = 'round'; g.lineWidth = 6; g.beginPath(); g.moveTo(1120, 200); g.lineTo(1120 + Math.cos(a1) * 28, 200 + Math.sin(a1) * 28); g.stroke();
  g.lineWidth = 4; g.beginPath(); g.moveTo(1120, 200); g.lineTo(1120 + Math.cos(a2) * 42, 200 + Math.sin(a2) * 42); g.stroke();
  // floor and desk
  rect(g, 0, 860, W, 220, night ? '#1a1612' : '#5a4632');
  if (o.footprints) for (let i = 0; i < o.footprints; i++) { g.fillStyle = 'rgba(160,200,230,.35)'; g.beginPath(); g.ellipse(1700 - i * 120, 1000 - (i % 2) * 34, 20, 34, .2, 0, 7); g.fill(); }
  rect(g, 80, 700, 1000, 30, night ? '#4a3626' : '#8a6444'); rect(g, 110, 730, 30, 160, night ? '#3a2a1e' : '#6a4a32'); rect(g, 1020, 730, 30, 160, night ? '#3a2a1e' : '#6a4a32');
  // CRT TV + VCR
  rr(g, 160, 430, 420, 280, 18, '#2a2a30'); rr(g, 190, 455, 330, 230, 26, o.screen || (night ? '#1a2a3a' : '#2a3a40'));
  rect(g, 530, 470, 30, 12, '#4a4a50'); rect(g, 530, 495, 30, 12, '#4a4a50');
  rr(g, 170, 650 + 0, 400, 50, 6, '#1e1e24'); rect(g, 300, 668, 150, 10, '#0a0a0e'); g.fillStyle = o.vcrOn ? '#3aff7a' : '#225a32'; g.fillRect(470, 666, 60, 14);
  // monitor with a waveform
  rr(g, 680, 470, 320, 220, 10, '#2a2a30'); rect(g, 700, 490, 280, 170, night ? '#0c1a14' : '#10221a'); rect(g, 820, 690, 40, 20, '#2a2a30');
  g.strokeStyle = '#3ae08a'; g.lineWidth = 2; g.beginPath(); for (let k = 0; k <= 70; k++) { const x = 705 + k * 4, y = 575 + Math.sin(k * .7 + t * 6) * 26 * hash(Math.floor(k / 3) + Math.floor(t * 8)); k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  // lamp
  if (night) { const gr = g.createRadialGradient(900, 640, 10, 900, 640, 460); gr.addColorStop(0, `rgba(255,200,120,${.28 * (o.lamp ?? 1)})`); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  rect(g, 940, 560, 8, 140, '#2a2a2a'); poly(g, [[900, 560], [990, 560], [970, 510], [920, 510]], night ? '#e8b040' : '#c88a2a');
}
const mixd = c => { const n = parseInt(c.slice(1), 16), f = v => Math.round(v * .45).toString(16).padStart(2, '0'); return '#' + f(n >> 16) + f(n >> 8 & 255) + f(n & 255); };

export function exterior(g, t) {
  vgrad(g, 0, 0, W, H, '#0e1428', '#2a2440');
  for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,255,255,${.3 + .5 * hash(i)})`; g.fillRect(hash(i + 1) * W, hash(i + 2) * 520, 2, 2); }
  g.fillStyle = '#e8e4d0'; g.beginPath(); g.arc(1600, 160, 50, 0, 7); g.fill();
  // the building: 6 floors, the 4th dark
  rect(g, 560, 160, 800, 760, '#3a3a46'); rect(g, 540, 140, 840, 30, '#2a2a34');
  for (let f = 0; f < 6; f++) for (let k = 0; k < 8; k++) {
    const y = 200 + f * 118, x = 600 + k * 94, dark = f === 2, lit = !dark && hash(f * 9 + k) > .82;
    rect(g, x, y, 60, 70, dark ? '#0a0a10' : lit ? '#d8c890' : '#1e2230');
    if (dark && k === 5 && Math.sin(t * 3) > .6) rect(g, x, y, 60, 70, '#4a5a6a');
  }
  g.fillStyle = '#e8e4d0'; g.font = `700 34px ${TH}`; g.textAlign = 'center'; g.fillText('วิชัยแล็บ', 960, 190); g.textAlign = 'left';
  rect(g, 0, 920, W, 160, '#1a1a22');
  // gate and fence
  for (let k = 0; k < 40; k++) rect(g, k * 50, 820, 8, 110, '#2a2a30'); rect(g, 0, 830, W, 8, '#2a2a30'); rect(g, 0, 880, W, 8, '#2a2a30');
  rect(g, 860, 800, 200, 130, 'rgba(0,0,0,0)');
  // street lamp
  rect(g, 300, 520, 12, 400, '#2a2a30'); const gr = g.createRadialGradient(306, 520, 5, 306, 620, 300); gr.addColorStop(0, 'rgba(255,220,150,.45)'); gr.addColorStop(1, 'rgba(255,220,150,0)'); g.fillStyle = gr; g.fillRect(0, 300, 700, 700);
}

export function lobby(g, t, o = {}) {
  vgrad(g, 0, 0, W, H, '#4a5248', '#2e3430'); rect(g, 0, 820, W, 260, '#5a5a50');
  for (let k = 0; k < 12; k++) rect(g, k * 170, 820, 4, 260, '#4a4a42');
  // lift doors
  rect(g, 760, 300, 400, 520, '#8a8e90'); rect(g, 790, 340, 340, 480, '#a8acae'); rect(g, 958, 340, 4, 480, '#6a6e70');
  rr(g, 900, 250, 120, 40, 6, '#1a1a1e'); g.fillStyle = '#e8463c'; g.font = '700 28px monospace'; g.textAlign = 'center'; g.fillText(o.floor || '1', 960, 280);
  // sign: 4th floor closed
  rr(g, 1240, 380, 260, 120, 6, '#f2eee0'); g.fillStyle = '#c8322c'; g.font = `700 40px ${TH}`; g.fillText('ชั้น ๔', 1370, 432); g.font = `700 34px ${TH}`; g.fillText('ปิด ห้ามขึ้น', 1370, 478); g.textAlign = 'left';
  // guard desk
  rect(g, 120, 640, 520, 200, '#6a5a44'); rect(g, 120, 620, 520, 30, '#7a6a52'); rr(g, 180, 560, 120, 70, 6, '#2a2a30'); rect(g, 190, 570, 100, 50, '#2a4a3a');
  // ceiling light
  rect(g, 760, 60, 400, 20, '#f2f2e0');
  const gr = g.createRadialGradient(960, 80, 20, 960, 300, 700); gr.addColorStop(0, 'rgba(240,250,220,.25)'); gr.addColorStop(1, 'rgba(240,250,220,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

// one-point perspective corridor; L = light level 0..1; wet = mop sheen
export function corridor(g, t, L = 1, o = {}) {
  const vx = 960, vy = 470, k = .26;   // the far end: a dark rectangle
  const fx0 = vx - 260 * k * 4, fx1 = vx + 260 * k * 4, fy0 = vy - 180 * k * 4, fy1 = vy + 200 * k * 4;
  const far = [vx - 120, vy - 80, 240, 170];
  const sh = c => shade(c, L);
  poly(g, [[0, 0], [W, 0], [far[0] + far[2], far[1]], [far[0], far[1]]], sh('#8a9288'));               // ceiling
  poly(g, [[0, H], [W, H], [far[0] + far[2], far[1] + far[3]], [far[0], far[1] + far[3]]], sh('#6a7064')); // floor
  poly(g, [[0, 0], [far[0], far[1]], [far[0], far[1] + far[3]], [0, H]], sh('#7c8a74'));                  // left wall
  poly(g, [[W, 0], [far[0] + far[2], far[1]], [far[0] + far[2], far[1] + far[3]], [W, H]], sh('#728068'));  // right wall
  rect(g, ...far, o.farLit ? '#3a4038' : '#0a0c0a');
  // dado line, doors, ceiling lights
  for (const sd of [-1, 1]) {
    g.strokeStyle = sh('#4a5a44'); g.lineWidth = 6; g.beginPath(); g.moveTo(sd < 0 ? 0 : W, 640); g.lineTo(sd < 0 ? far[0] : far[0] + far[2], far[1] + far[3] * .55); g.stroke();
    for (let d = 0; d < 4; d++) {
      const u0 = [0.08, .4, .62, .76][d], u1 = u0 + [0.16, .1, .07, .05][d];
      const X = u => sd < 0 ? lerp(0, far[0], u) : lerp(W, far[0] + far[2], u), Y = (u, top) => top ? lerp(0, far[1], u) + lerp(260, 30, u) : lerp(H, far[1] + far[3], u) - lerp(150, 10, u);
      poly(g, [[X(u0), Y(u0, 1)], [X(u1), Y(u1, 1)], [X(u1), Y(u1, 0)], [X(u0), Y(u0, 0)]], sh(d === 1 && sd > 0 ? '#5a3a2a' : '#6a4a34'));
    }
  }
  for (let i = 0; i < 6; i++) {
    const u = 1 - Math.pow(.62, i + 1), y = lerp(0, far[1], u) + 18 * (1 - u), w = lerp(380, 40, u), h = lerp(30, 4, u);
    const on = L * (o.flicker ? (hash(i + Math.floor(t * 18)) > .4 ? 1 : .1) : 1);
    rect(g, vx - w / 2, y, w, h, on > .5 ? '#f4f8e8' : '#4a4e48');
  }
  if (o.wet) { const gr = g.createLinearGradient(0, 760, 0, H); gr.addColorStop(0, 'rgba(200,230,240,0)'); gr.addColorStop(1, `rgba(200,230,240,${.25 * L})`); g.fillStyle = gr; poly(g, [[700, H], [1220, H], [1010, 700], [910, 700]], gr); }
}
const lerp = (a, b, u) => a + (b - a) * u;
function shade(c, L) { const n = parseInt(c.slice(1), 16), f = v => Math.round(v * (.12 + .88 * L)).toString(16).padStart(2, '0'); return '#' + f(n >> 16) + f(n >> 8 & 255) + f(n & 255); }

export function lift(g, t, open = 0, L = 1) {
  vgrad(g, 0, 0, W, H, shade('#5a6258', L), shade('#3a4038', L)); rect(g, 0, 900, W, 180, shade('#4a4a42', L));
  rect(g, 520, 120, 880, 800, shade('#7a7e80', L));
  rect(g, 560, 160, 800, 760, shade('#2a2e2a', L));   // inside the car
  const gr = g.createLinearGradient(0, 160, 0, 920); gr.addColorStop(0, shade('#d8dcc8', L)); gr.addColorStop(1, shade('#8a8e80', L)); g.fillStyle = gr; g.fillRect(580, 180, 760, 740);
  const d = open * 400;
  rect(g, 560 - d, 160, 400, 760, shade('#a8acae', L)); rect(g, 960 + d, 160, 400, 760, shade('#9ca0a2', L));
  rr(g, 900, 60, 120, 44, 6, '#1a1a1e'); g.fillStyle = '#e8463c'; g.font = '700 30px monospace'; g.textAlign = 'center'; g.fillText('4', 960, 93); g.textAlign = 'left';
}
export function paper(g, t) {
  vgrad(g, 0, 0, W, H, '#5a6054', '#3a4034');
  g.save(); g.translate(960, 560); g.rotate(-.04);
  rect(g, -420, -470, 840, 940, '#efe8d4'); g.fillStyle = '#2a2622'; g.textAlign = 'left';
  g.font = `700 54px ${TH}`; g.fillText('รายชื่อผู้ทดลอง', -360, -360);
  g.font = `600 34px ${TH}`; g.fillText('โครงการ ๓ · วิชัยแล็บ · ชั้น ๔', -360, -300);
  g.fillRect(-360, -280, 720, 4);
  const N = ['นายสมพร ใจดี', 'นางสาวกานดา ศรีทอง', 'นายประยุทธ์ มีสุข', 'นางบุญมา แก้วใส', 'นายเอกชัย รุ่งเรือง', 'นางแดง ทองดี (แม่บ้าน)', 'ด.ญ.ฝน (อายุ ๘)'];
  N.forEach((n, i) => { g.font = `600 38px ${TH}`; g.fillStyle = i === 6 ? '#b3201c' : '#2a2622'; g.fillText(`${'๑๒๓๔๕๖๗'[i]}. ${n}`, -340, -200 + i * 82); });
  g.fillStyle = 'rgba(120,90,40,.25)'; g.beginPath(); g.ellipse(220, 300, 160, 90, .3, 0, 7); g.fill();   // a water stain
  g.restore();
}
export function vcr(g, t, k, label = '03  97') {   // the tape slides into the slot as k goes 0 → 1
  vgrad(g, 0, 0, W, H, '#1a1e26', '#0e1016');
  rr(g, 260, 480, 1400, 300, 20, '#1e1e24'); rect(g, 560, 560, 800, 60, '#08080c');
  g.fillStyle = '#3aff7a'; g.font = '700 46px monospace'; g.fillText(k > .9 ? 'PLAY' : '--:--', 1420, 640);
  const y = 300 + (1 - k) * 0 , slide = k * 260;
  g.save(); g.beginPath(); g.rect(0, 0, W, 590); g.clip();
  rr(g, 600, 240 + slide, 720, 400, 14, '#1a1a1e'); rr(g, 680, 290 + slide, 560, 120, 6, '#f2ecd8');
  g.fillStyle = '#2a2a2a'; g.font = '700 70px monospace'; g.fillText(label, 760, 375 + slide); g.restore();
  const gr = g.createRadialGradient(960, 400, 20, 960, 500, 900); gr.addColorStop(0, 'rgba(255,200,120,.12)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

// ---------- added for the reworked episode ----------
// the missing-person poster: on the gate (small) or as a close-up
export function poster(g, x, y, s, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rect(g, -150, -210, 300, 420, '#f2ecdc'); rect(g, -150, -210, 300, 70, '#c8322c');
  g.fillStyle = '#fff'; g.font = `700 46px ${TH}`; g.textAlign = 'center'; g.fillText('ประกาศคนหาย', 0, -160);
  rect(g, -80, -125, 160, 170, '#b8b0a0');                                                                 // a photo
  g.fillStyle = '#1a1a1e'; g.beginPath(); g.ellipse(0, -60, 44, 48, 0, 0, 7); g.fill();
  g.fillStyle = '#dcaa86'; g.beginPath(); g.ellipse(0, -48, 34, 40, 0, 0, 7); g.fill(); rect(g, -60, -10, 120, 55, '#f6f6f2');
  g.fillStyle = '#2a2622'; g.font = `700 34px ${TH}`; g.fillText('ด.ญ.ฝน อายุ ๘ ปี', 0, 92);
  g.font = `400 22px ${TH}`; g.fillText('หายตัวที่ตึกวิชัยแล็บ', 0, 128); g.fillText('๑๓ พ.ย. ๒๕๔๐', 0, 158);
  g.fillText('พบเห็นโปรดแจ้ง ๑๙๑', 0, 190); g.textAlign = 'left';
  g.restore();
}
export function gate(g, t) {
  exterior(g, t);
  rect(g, 720, 760, 480, 170, '#25252c'); for (let k = 0; k < 12; k++) rect(g, 730 + k * 40, 760, 10, 170, '#34343c');   // the gate
  g.strokeStyle = '#8a8a90'; g.lineWidth = 6; g.beginPath(); g.arc(960, 845, 26, 0, 7); g.stroke();                     // chain lock
  poster(g, 1120, 830, .3, .06);
}
// the fire stairs: a landing with the floor number painted on the wall
export function stairs(g, t, floor = 2, L = 1) {
  const sh = c => shade(c, L);
  vgrad(g, 0, 0, W, H, sh('#6e766a'), sh('#4a5248'));
  for (let k = 0; k < 9; k++) { const y = 1080 - k * 70, x0 = 200 + k * 90; poly(g, [[x0, y], [1920, y], [1920, y - 70], [x0 + 90, y - 70]], sh(k % 2 ? '#5a6056' : '#62685e')); rect(g, x0, y - 6, 1920, 6, sh('#3a4038')); }
  g.strokeStyle = sh('#8a3a30'); g.lineWidth = 10; g.beginPath(); g.moveTo(160, 1000); g.lineTo(1000, 420); g.stroke();   // the handrail
  g.fillStyle = sh('#e8e2d0'); g.font = `700 260px ${TH}`; g.fillText(['', '', '๒', '๓', '๔'][floor], 1350, 420);
  g.font = `700 50px ${TH}`; g.fillText('ชั้น', 1250, 260);
  rect(g, 1300, 80, 160, 60, sh('#2a7a4a')); g.fillStyle = sh('#e8f8ee'); g.font = `700 34px ${TH}`; g.fillText('ทางหนีไฟ', 1314, 122);
  if (floor === 4) {   // a chain and police tape across the door
    rect(g, 1180, 460, 440, 520, sh('#3a3e3a'));
    g.strokeStyle = '#9a9a9a'; g.lineWidth = 8; g.setLineDash([18, 10]); g.beginPath(); g.moveTo(1160, 640); g.quadraticCurveTo(1400, 700, 1640, 640); g.stroke(); g.setLineDash([]);
    for (const [y, r] of [[580, -.08], [760, .1]]) { g.save(); g.translate(1400, y); g.rotate(r); rect(g, -280, -24, 560, 48, '#e8c43a'); g.fillStyle = '#1a1a1e'; g.font = `700 30px ${TH}`; g.textAlign = 'center'; for (let k = -2; k <= 2; k++) g.fillText('ห้ามเข้า', k * 120, 10); g.textAlign = 'left'; g.restore(); }
  }
}
// Dr. Wichai's lab: a whiteboard, old equipment, a tape shelf with slot 01 empty
export function lab(g, t, L = .8) {
  const sh = c => shade(c, L);
  vgrad(g, 0, 0, W, H, sh('#4e5a58'), sh('#2e3634')); rect(g, 0, 830, W, 250, sh('#3e4440'));
  rect(g, 140, 170, 720, 420, sh('#e6ece8')); rect(g, 140, 590, 720, 18, sh('#9a9a9a'));
  g.fillStyle = sh('#2a3a7a'); g.font = `700 64px ${TH}`; g.fillText('โครงการ ๓', 200, 270);
  g.font = `400 34px ${TH}`; g.fillText('ชั้น ๔ · ห้ามเปิดไฟหลัง ๐๒:๕๘', 200, 330);
  g.strokeStyle = sh('#2a3a7a'); g.lineWidth = 4; g.beginPath(); g.moveTo(220, 470); for (let k = 0; k < 12; k++) g.lineTo(220 + k * 50, 470 - Math.sin(k * 1.3) * 60 - k * 6); g.stroke();
  g.fillStyle = sh('#b8322c'); g.font = `700 40px ${TH}`; g.fillText('๗ คน', 620, 540);
  // equipment: a rack of old monitors and a chair with straps
  for (let k = 0; k < 3; k++) { rr(g, 960 + k * 150, 440, 130, 110, 8, sh('#2a2a30')); rect(g, 972 + k * 150, 452, 106, 80, sh(k === 1 ? '#1e3a2e' : '#1a2228')); }
  rect(g, 940, 550, 470, 280, sh('#3a3e44'));
  rect(g, 1060, 650, 120, 20, sh('#5a3a2a')); rect(g, 1060, 560, 20, 100, sh('#5a3a2a')); rect(g, 1080, 590, 80, 8, sh('#2a2a2a'));
  // the tape shelf: slots 01–09, 01 empty
  rect(g, 1480, 260, 340, 560, sh('#5a4430'));
  for (let k = 0; k < 9; k++) { const x = 1500 + (k % 3) * 104, y = 290 + Math.floor(k / 3) * 170; rect(g, x, y, 92, 140, sh('#2a2016'));
    if (k) { rect(g, x + 8, y + 10, 76, 120, sh('#1a1a1e')); rect(g, x + 14, y + 20, 64, 26, sh('#ede6d0')); g.fillStyle = sh('#2a2a2a'); g.font = '700 20px monospace'; g.fillText('0' + (k + 1), x + 30, y + 40); }
    else { g.fillStyle = sh('#e8e2d0'); g.font = '700 24px monospace'; g.fillText('01', x + 30, y + 80); } }
}
// the electrician's work order, found in the box
export function workOrder(g, t) {
  vgrad(g, 0, 0, W, H, '#2a2620', '#16140f');
  g.save(); g.translate(960, 540); g.rotate(.03);
  rect(g, -460, -400, 920, 800, '#f2e8c8'); rect(g, -460, -400, 920, 90, '#e8c43a');
  g.fillStyle = '#2a2622'; g.font = `700 50px ${TH}`; g.fillText('ใบสั่งงานซ่อมไฟฟ้า', -420, -340);
  const rows = [['อาคาร', 'วิชัยแล็บ'], ['ช่าง', 'โอ๊ต'], ['วันที่', '๒๐ พ.ย. ๒๕๔๐'], ['งาน', 'ตัดไฟชั้น ๔'], ['เวลา', '๐๒:๕๘']];
  rows.forEach(([k, v], i) => { g.font = `600 40px ${TH}`; g.fillStyle = '#6a6052'; g.fillText(k, -400, -220 + i * 100); g.fillStyle = i === 4 ? '#b3201c' : '#2a2622'; g.font = `700 46px ${TH}`; g.fillText(v, -160, -220 + i * 100); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-400, -200 + i * 100, 800, 2); });
  g.strokeStyle = '#2a3a8a'; g.lineWidth = 3; g.beginPath(); g.moveTo(120, 330); g.bezierCurveTo(180, 290, 220, 360, 300, 310); g.stroke();
  g.restore();
}

// ---------- added for episode 2 ----------
// Oat's electrical repair shop in the market, 2026, daytime
export function oatShop(g, t) {
  vgrad(g, 0, 0, W, H, '#7a6a52', '#4a3e30'); rect(g, 0, 860, W, 220, '#5a5040');
  rect(g, 0, 0, W, 90, '#c8322c'); g.fillStyle = '#fff'; g.font = `700 54px ${TH}`; g.fillText('โอ๊ตการไฟฟ้า · ซ่อมพัดลม ทีวี วิทยุ', 60, 64);
  for (let r = 0; r < 3; r++) { rect(g, 80, 260 + r * 170, 760, 12, '#5a4430'); for (let k = 0; k < 5; k++) { const x = 100 + k * 150, y = 160 + r * 170; if ((r + k) % 2) { rr(g, x, y, 120, 96, 8, '#3a3a40'); rect(g, x + 12, y + 12, 96, 66, '#2a3a40'); } else { g.fillStyle = '#d8d0c0'; g.beginPath(); g.arc(x + 60, y + 50, 46, 0, 7); g.fill(); g.strokeStyle = '#8a8a8a'; g.lineWidth = 3; for (let a = 0; a < 3; a++) { g.beginPath(); g.moveTo(x + 60, y + 50); g.lineTo(x + 60 + Math.cos(a * 2.1 + t * (k % 3 === 0 ? 8 : 0)) * 40, y + 50 + Math.sin(a * 2.1 + t * (k % 3 === 0 ? 8 : 0)) * 40); g.stroke(); } } } }
  for (let k = 0; k < 9; k++) { g.strokeStyle = ['#c8322c', '#1a1a1e', '#2a6ab0', '#e0a830'][k % 4]; g.lineWidth = 6; g.beginPath(); g.moveTo(1000 + k * 40, 120); g.quadraticCurveTo(1020 + k * 40, 300 + (k % 3) * 40, 1040 + k * 40, 120); g.stroke(); }   // cable loops hanging
  rect(g, 960, 640, 900, 40, '#6a5034'); rect(g, 990, 680, 30, 200, '#4a3a26'); rect(g, 1800, 680, 30, 200, '#4a3a26');                                                       // counter
  rr(g, 1400, 560, 160, 80, 6, '#2a2a30'); g.fillStyle = '#e8463c'; g.font = '700 30px monospace'; g.fillText('230V', 1430, 612);
  rect(g, 1600, 160, 260, 340, '#8a8e90'); rect(g, 1620, 180, 220, 300, '#a8acae'); for (let k = 0; k < 6; k++) rect(g, 1640 + (k % 3) * 66, 210 + Math.floor(k / 3) * 120, 40, 70, k === 3 ? '#e8c43a' : '#3a3a40');   // a breaker box on the wall
}
// the 1997 lab with the lights on and the experiment running (tape 01, a fixed camera on a tripod)
export function labOn(g, t, ghostOnMonitor = 0) {
  lab(g, t, 1);
  for (let k = 0; k < 3; k++) { const x = 972 + k * 150; rect(g, x, 452, 106, 80, '#2a5a48'); if (ghostOnMonitor > 0 && k === 1) { g.fillStyle = `rgba(10,10,12,${ghostOnMonitor})`; g.beginPath(); g.ellipse(x + 53, 470, 6, 8, 0, 0, 7); g.fill(); g.fillRect(x + 47, 478, 12, 40); } else { g.strokeStyle = '#7af0b0'; g.lineWidth = 2; g.beginPath(); for (let i = 0; i < 20; i++) g.lineTo(x + 4 + i * 5, 492 + Math.sin(i * .9 + t * 5 + k) * 12); g.stroke(); } }
}
// Beer's shop seen from high in a corner, as an old camcorder would see it (the closing shot of episode 2)
export function shopHigh(g, t) {
  g.save(); g.translate(W / 2, H / 2); g.rotate(-.06); g.scale(.78, .78); g.translate(-W / 2, -H / 2 + 40);
  shop(g, t, true, { clock: 1.2 });
  g.restore();
}
