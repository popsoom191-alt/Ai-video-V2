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
export function vcr(g, t, k) {   // the tape slides into the slot as k goes 0 → 1
  vgrad(g, 0, 0, W, H, '#1a1e26', '#0e1016');
  rr(g, 260, 480, 1400, 300, 20, '#1e1e24'); rect(g, 560, 560, 800, 60, '#08080c');
  g.fillStyle = '#3aff7a'; g.font = '700 46px monospace'; g.fillText(k > .9 ? 'PLAY' : '--:--', 1420, 640);
  const y = 300 + (1 - k) * 0 , slide = k * 260;
  g.save(); g.beginPath(); g.rect(0, 0, W, 590); g.clip();
  rr(g, 600, 240 + slide, 720, 400, 14, '#1a1a1e'); rr(g, 680, 290 + slide, 560, 120, 6, '#f2ecd8');
  g.fillStyle = '#2a2a2a'; g.font = '700 70px monospace'; g.fillText('03  97', 760, 375 + slide); g.restore();
  const gr = g.createRadialGradient(960, 400, 20, 960, 500, 900); gr.addColorStop(0, 'rgba(255,200,120,.12)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
