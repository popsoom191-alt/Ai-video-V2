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
  g.font = `600 30px ${TH}`; g.fillStyle = '#ffe8a0'; g.fillText('ก่อตั้ง ๒๕๔๑', 1640, 62);
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

// ---------- added for the merged episode ----------
// the shop's front door on the right wall (drawn over shop()); open = 0..1
export function shopDoor(g, open = 0, day = true) {
  rect(g, 1770, 360, 150, 500, day ? '#4a3a2c' : '#2a2018');
  if (open > 0) rect(g, 1780, 370, 130, 490, day ? '#e8e2d0' : '#1a2030');   // daylight outside
  const w = 130 * (1 - open * .8);
  rect(g, 1780, 370, w, 490, day ? '#7a5a3e' : '#3e2e20'); rect(g, 1780 + w - 18, 600, 8, 30, '#c8b060');
}
// the building in 2026: sealed, boarded windows, a chained gate, a demolition notice
export function building2026(g, t) {
  vgrad(g, 0, 0, W, H, '#8a9aa8', '#c8ccc8');
  rect(g, 560, 160, 800, 760, '#6a6a70'); rect(g, 540, 140, 840, 30, '#5a5a62');
  for (let f = 0; f < 6; f++) for (let k = 0; k < 8; k++) { const x = 600 + k * 94, y = 200 + f * 118; rect(g, x, y, 60, 70, '#2a2a30'); if (hash(f * 9 + k) > .3) { rect(g, x - 4, y + 18, 68, 12, '#9a7a52'); rect(g, x - 4, y + 42, 68, 12, '#8a6a46'); } }
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(60,80,40,${.3 + .4 * hash(i)})`; g.beginPath(); g.ellipse(560 + hash(i + 3) * 800, 700 + hash(i + 5) * 220, 20 + hash(i) * 30, 40, 0, 0, 7); g.fill(); }   // weeds and vines
  rect(g, 0, 920, W, 160, '#5a5a56'); for (let k = 0; k < 40; k++) rect(g, k * 50, 820, 8, 110, '#3a3a40'); rect(g, 0, 830, W, 8, '#3a3a40');
  g.strokeStyle = '#8a8a90'; g.lineWidth = 8; g.beginPath(); g.arc(960, 870, 30, 0, 7); g.stroke();
  rect(g, 1120, 700, 380, 200, '#f2e8c8'); rect(g, 1120, 700, 380, 50, '#c8322c'); g.fillStyle = '#fff'; g.font = `700 36px ${TH}`; g.fillText('เตรียมรื้อถอน', 1190, 738);
  g.fillStyle = '#2a2622'; g.font = `600 30px ${TH}`; g.fillText('อาคารวิชัยแล็บ', 1150, 800); g.fillText('เริ่ม ๑ ธ.ค. ๒๕๖๙', 1150, 850);
}
// a phone held up, its screen showing a picture
export function phoneHeld(g, drawScreen, t) {
  vgrad(g, 0, 0, W, H, '#4a4036', '#2a241e');
  rr(g, 700, 80, 520, 960, 50, '#1a1a1e'); g.save(); g.beginPath(); g.roundRect(724, 130, 472, 860, 30); g.clip(); g.translate(724, 130); g.scale(472 / W, 860 / H); drawScreen(); g.restore();
  g.fillStyle = '#d6a07c'; g.beginPath(); g.ellipse(1240, 820, 90, 160, -.3, 0, 7); g.fill();
}
export function phoneScreen(g, lines, t) {   // a messages / call-log screen
  vgrad(g, 0, 0, W, H, '#f2f2f6', '#e6e6ee');
  g.font = `700 90px ${TH}`; g.fillStyle = '#2a2a30'; g.fillText(lines.title, 120, 200);
  lines.rows.forEach((r, i) => { rr(g, 100, 300 + i * 220, 1720, 180, 40, r.me ? '#3a8a68' : '#ffffff'); g.fillStyle = r.me ? '#fff' : '#2a2a30'; g.font = `600 70px ${TH}`; g.fillText(r.text, 160, 410 + i * 220); });
}
// Beer's shopfront, by day
export function shopFront(g, t) {
  vgrad(g, 0, 0, W, H, '#9ab0c0', '#d8dcd8'); rect(g, 0, 900, W, 180, '#7a7a76');
  rect(g, 360, 180, 1200, 720, '#c8b89a'); rect(g, 360, 180, 1200, 120, '#2a6a4e'); g.fillStyle = '#f2ecd8'; g.font = `700 70px ${TH}`; g.fillText('เบียร์ซ่อมเทป · TAPE REPAIR', 440, 262);
  rect(g, 460, 380, 560, 380, '#2a3a44'); for (let k = 0; k < 7; k++) rect(g, 490 + k * 76, 420, 50, 70, TAPEC[k % TAPEC.length]);
  rect(g, 1140, 360, 300, 540, '#5a4430'); rect(g, 1400, 610, 12, 40, '#c8b060');
}
// a small car crossing the city (side view)
export function carRide(g, t) {
  vgrad(g, 0, 0, W, H, '#a8c0d0', '#e0e4e0');
  for (let L = 0; L < 2; L++) for (let k = 0; k < 14; k++) { const w = 160 + hash(k + L * 20) * 120, h = 200 + hash(k * 3 + L) * (L ? 260 : 420), x = ((k * 230 - t * (L ? 260 : 120)) % 3220 + 3220) % 3220 - 300; rect(g, x, 840 - h, w, h, L ? '#8a909a' : '#a8aeb6'); for (let r = 0; r < h / 60 - 1; r++) for (let c = 0; c < w / 50 - 1; c++) rect(g, x + 16 + c * 50, 860 - h + r * 60, 26, 30, L ? '#6a7480' : '#c8d0d8'); }
  rect(g, 0, 840, W, 240, '#5a5a5e'); for (let k = 0; k < 12; k++) rect(g, ((k * 260 - t * 600) % 2340 + 2340) % 2340 - 200, 950, 120, 10, '#e8e2c8');
  const bob = Math.sin(t * 9) * 3;
  g.save(); g.translate(960, 860 + bob);
  rr(g, -260, -150, 520, 110, 30, '#c8322c'); rr(g, -170, -230, 300, 100, 30, '#c8322c'); rect(g, -150, -215, 120, 70, '#a8c8d8'); rect(g, -20, -215, 120, 70, '#a8c8d8');
  for (const x of [-160, 160]) { g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(x, -40, 46, 0, 7); g.fill(); g.fillStyle = '#9a9aa0'; g.beginPath(); g.arc(x, -40, 18, 0, 7); g.fill(); }
  g.restore();
}
// the old market by day: stalls, umbrellas, fruit
export function market(g, t) {
  vgrad(g, 0, 0, W, H, '#c8b890', '#8a7a5a'); rect(g, 0, 880, W, 200, '#6a6050');
  for (let k = 0; k < 5; k++) {
    const x = 60 + k * 380;
    g.fillStyle = ['#c8322c', '#2a6ab0', '#e0a830', '#2a8a5e', '#c8322c'][k]; g.beginPath(); g.moveTo(x - 30, 380); g.lineTo(x + 170, 260); g.lineTo(x + 370, 380); g.closePath(); g.fill();
    rect(g, x + 166, 380, 8, 380, '#4a3a2a'); rect(g, x, 640, 340, 120, '#8a6a46');
    for (let i = 0; i < 9; i++) { g.fillStyle = ['#e8a030', '#c8322c', '#7ab040', '#e8d040'][(i + k) % 4]; g.beginPath(); g.arc(x + 30 + i * 36, 630 - (i % 2) * 14, 20, 0, 7); g.fill(); }
  }
  rect(g, 1560, 120, 300, 70, '#c8322c'); g.fillStyle = '#fff'; g.font = `700 34px ${TH}`; g.fillText('โอ๊ตการไฟฟ้า →', 1580, 168);   // the red sign far down the lane
}

// ---------- added for the no-cut rework ----------
// looking up a straight flight of fire stairs from below; a steel door on the landing at the top
// floor: the number painted on the wall · taped: chain + "do not enter" tape across the door · open: 0..1
export function stairsUp(g, t, floor = 2, o = {}) {
  const L = o.L ?? .8, sh = c => shade(c, L), top = 430;
  vgrad(g, 0, 0, W, H, sh('#5e665a'), sh('#3e443c'));
  poly(g, [[0, 0], [560, top - 260], [560, top], [0, H]], sh('#6a7266')); poly(g, [[W, 0], [1360, top - 260], [1360, top], [W, H]], sh('#626a5e'));   // side walls
  rect(g, 560, top - 260, 800, 260, sh('#727a6e'));                                                                                                       // landing wall
  for (let k = 0; k < 12; k++) { const u0 = k / 12, u1 = (k + 1) / 12, y0 = lerp(H, top, u0), y1 = lerp(H, top, u1), x0 = lerp(0, 560, u0), x1 = lerp(0, 560, u1);
    poly(g, [[x0, y0], [W - x0, y0], [W - x1, y1], [x1, y1]], sh(k % 2 ? '#585e54' : '#646a60')); rect(g, x1, y1, W - 2 * x1, 4 + 6 * (1 - u1), sh('#3a4038')); }
  g.strokeStyle = sh('#8a3a30'); g.lineWidth = 12; g.beginPath(); g.moveTo(40, 760); g.lineTo(560, top - 120); g.stroke();                                  // handrail
  g.fillStyle = sh('#e8e2d0'); g.font = `700 150px ${TH}`; g.fillText(['', '', '๒', '๓', '๔'][floor], 1500, 330); g.font = `700 40px ${TH}`; g.fillText('ชั้น', 1520, 170);
  // the steel door
  const dx = 810, dw = 300, dy = top - 240, dh = 240, open = o.open || 0;
  rect(g, dx - 14, dy - 14, dw + 28, dh + 14, sh('#3a3e3a'));
  if (open > 0) { rect(g, dx, dy, dw, dh, '#0a0c0a'); }
  rect(g, dx, dy, dw * (1 - open * .85), dh, sh('#7a7e7a')); rect(g, dx + dw * (1 - open * .85) - 30, dy + 120, 16, 30, sh('#c8c0a0'));
  rect(g, dx + 90, dy - 46, 120, 34, sh('#2a7a4a')); g.fillStyle = sh('#e8f8ee'); g.font = `700 24px ${TH}`; g.fillText('ทางหนีไฟ', dx + 98, dy - 22);
  if (o.taped) {
    g.strokeStyle = '#9a9a9a'; g.lineWidth = 6; g.setLineDash([14, 8]); g.beginPath(); g.moveTo(dx - 20, dy + 100); g.quadraticCurveTo(dx + dw / 2, dy + 140, dx + dw + 20, dy + 100); g.stroke(); g.setLineDash([]);
    for (const [y, r] of [[dy + 70, -.06], [dy + 160, .08]]) { g.save(); g.translate(dx + dw / 2, y); g.rotate(r); rect(g, -200, -16, 400, 32, '#e8c43a'); g.fillStyle = '#1a1a1e'; g.font = `700 20px ${TH}`; g.textAlign = 'center'; for (let k = -2; k <= 2; k++) g.fillText('ห้ามเข้า', k * 82, 7); g.textAlign = 'left'; g.restore(); }
  }
}
// where on the flight a person stands: u = 0 bottom (near) … 1 the landing; returns [x, y, scale]
export const stairPos = (u, side = 0) => [lerp(960 + side * 200, 960 + side * 60, u), lerp(H + 60, 430, u), lerp(1.25, .42, u)];
// inside the lab looking at its door; open 0..1 shows the corridor beyond
export function labDoor(g, t, open = 0, drawCorridor) {
  vgrad(g, 0, 0, W, H, '#4e5a58', '#2e3634'); rect(g, 0, 830, W, 250, '#3e4440');
  const dx = 760, dw = 400, dy = 260, dh = 600;
  rect(g, dx - 24, dy - 24, dw + 48, dh + 24, '#3a4a40');
  if (open > 0) { g.save(); g.beginPath(); g.rect(dx, dy, dw, dh); g.clip(); g.translate(dx, dy); g.scale(dw / W, dh / H); drawCorridor(); g.restore(); }
  const w = dw * (1 - open * .9); rect(g, dx, dy, w, dh, '#6a4a34'); rect(g, dx + 30, dy + 40, w - 60, 200, '#1a2420'); rect(g, dx + w - 40, dy + 300, 14, 40, '#c8c0a0');
  rect(g, 200, 300, 380, 260, '#e6ece8'); g.fillStyle = '#2a3a7a'; g.font = `700 40px ${TH}`; g.fillText('โครงการ ๓', 230, 370);
}
// the market with a noodle stall in front: a steaming pot, two tables with stools
export function market2(g, t) {
  market(g, t);
  rect(g, 1180, 560, 560, 220, '#b8322c'); rect(g, 1180, 540, 560, 30, '#8a2420'); g.fillStyle = '#fff'; g.font = `700 40px ${TH}`; g.fillText('ก๋วยเตี๋ยวเรือ', 1340, 620);
  g.fillStyle = '#3a3a40'; g.beginPath(); g.ellipse(1300, 540, 70, 24, 0, 0, 7); g.fill();
  for (let k = 0; k < 4; k++) { const ph = (t * .5 + k * .25) % 1; g.fillStyle = `rgba(255,255,255,${.35 * (1 - ph)})`; g.beginPath(); g.ellipse(1290 + Math.sin(ph * 6 + k) * 16, 520 - ph * 160, 20 + ph * 30, 14 + ph * 20, 0, 0, 7); g.fill(); }
  for (const x of [1220, 1560]) { rect(g, x, 860, 260, 18, '#d8d0c0'); rect(g, x + 20, 878, 12, 100, '#8a8a8a'); rect(g, x + 228, 878, 12, 100, '#8a8a8a');
    for (const b of [x + 60, x + 190]) { g.fillStyle = '#e8e4dc'; g.beginPath(); g.ellipse(b, 852, 34, 12, 0, 0, 7); g.fill(); g.fillStyle = '#b8642a'; g.beginPath(); g.ellipse(b, 850, 26, 7, 0, 0, 7); g.fill(); } }
}
// a plastic stool (scene props sit people on it)
export function stool(g, x, y, s = 1) { g.fillStyle = '#c8322c'; g.fillRect(x - 34 * s, y - 92 * s, 68 * s, 12 * s); g.fillRect(x - 30 * s, y - 80 * s, 8 * s, 80 * s); g.fillRect(x + 22 * s, y - 80 * s, 8 * s, 80 * s); }
// a folded towel on the desk; covered 0..1 folds it over the tape
export function towel(g, x, y, covered = 0) { rect(g, x - 70, y - 8, 140, 16, '#e8e2d4'); if (covered > 0) { g.save(); g.translate(x - 70, y - 8); g.scale(1, -covered); g.fillStyle = '#d8d0c0'; g.fillRect(0, -40, 140, 40); g.restore(); } }
