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
  const N = night, D = (c, k = .5) => N ? dim(c, k) : c;
  // walls: plaster with soft light falling from the window, a darker wainscot, a skirting board
  vgrad(g, 0, 0, W, 620, D('#7a8a86', .32), D('#66756f', .32)); vgrad(g, 0, 600, W, 260, D('#55625a', .32), D('#46524a', .32));
  rect(g, 0, 596, W, 8, D('#3c463e', .4)); rect(g, 0, 846, W, 16, D('#2e3630', .4));
  for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(0,0,0,${.025 + .03 * hash(i + 50)})`; g.beginPath(); g.ellipse(hash(i) * W, hash(i + 9) * 590, 30 + hash(i + 2) * 80, 10 + hash(i + 4) * 30, 0, 0, 7); g.fill(); }   // plaster stains
  if (!N) { const gl = g.createRadialGradient(1530, 330, 40, 1530, 330, 900); gl.addColorStop(0, 'rgba(255,240,205,.32)'); gl.addColorStop(1, 'rgba(255,240,205,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, H); }
  // ceiling: a beam, a fluorescent tube, a fan turning
  rect(g, 0, 0, W, 54, D('#3e4844', .4)); rect(g, 0, 54, W, 6, D('#2a322e', .4));
  rr(g, 520, 58, 360, 18, 6, '#d8dcd4'); rect(g, 530, 74, 340, 10, N ? '#5a5e58' : '#f6faf0');
  if (!N) { const fl = g.createLinearGradient(0, 84, 0, 360); fl.addColorStop(0, 'rgba(240,250,235,.18)'); fl.addColorStop(1, 'rgba(240,250,235,0)'); g.fillStyle = fl; g.fillRect(380, 84, 640, 280); }
  rect(g, 1196, 54, 8, 46, '#2a2a2a'); el(g, 1200, 104, 22, 10, '#3a3a3e');
  for (let k = 0; k < 3; k++) { const a = t * 9 + k * 2.094, c = Math.cos(a); g.fillStyle = D('#5a5a60', .6); g.beginPath(); g.ellipse(1200 + c * 110, 106, Math.abs(c) * 110 + 8, 7, 0, 0, 7); g.fill(); }
  // the window: a deep frame, the street outside, reflections on the glass
  rr(g, 1286, 106, 488, 358, 8, D('#d8d4c8', .4));
  g.save(); g.beginPath(); g.rect(1300, 120, 460, 330); g.clip();
  if (N) { vgrad(g, 1300, 120, 460, 330, '#0a1020', '#141c30'); rect(g, 1330, 250, 180, 200, '#1a1e28'); rect(g, 1560, 210, 200, 240, '#161a24');
    for (let i = 0; i < 12; i++) { if (hash(i + 20) < .45) continue; const bx = i < 6 ? 1346 + (i % 3) * 52 : 1580 + (i % 3) * 56, by = (i < 6 ? 272 : 236) + Math.floor((i % 6) / 3) * 70; g.fillStyle = `rgba(255,214,140,${.45 + .4 * hash(i)})`; g.fillRect(bx, by, 26, 34); }
    const ne = g.createRadialGradient(1700, 400, 0, 1700, 400, 160); ne.addColorStop(0, 'rgba(255,60,90,.5)'); ne.addColorStop(1, 'rgba(255,60,90,0)'); g.fillStyle = ne; g.fillRect(1300, 120, 460, 330); }
  else { vgrad(g, 1300, 120, 460, 330, '#a8d0e4', '#d8e8ea'); rect(g, 1310, 250, 200, 200, '#c8b8a0'); for (let k = 0; k < 6; k++) rect(g, 1330 + (k % 3) * 60, 280 + Math.floor(k / 3) * 70, 34, 44, '#7a8a94');
    rect(g, 1540, 230, 230, 220, '#b0a090'); rect(g, 1540, 230, 230, 26, '#8a5a4a'); el(g, 1700, 220, 90, 70, '#6a9a5a'); el(g, 1660, 250, 60, 50, '#5a8a4a'); rect(g, 1696, 260, 10, 190, '#5a4a3a');
    g.strokeStyle = '#3a3a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(1300, 180); g.quadraticCurveTo(1530, 210, 1760, 170); g.stroke(); }
  g.fillStyle = N ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.22)'; for (const x of [1340, 1420, 1600]) { g.beginPath(); g.moveTo(x, 120); g.lineTo(x + 60, 120); g.lineTo(x - 100, 450); g.lineTo(x - 160, 450); g.closePath(); g.fill(); }
  g.restore();
  rect(g, 1525, 120, 10, 330, D('#e8eef0', .4)); rect(g, 1300, 280, 460, 10, D('#e8eef0', .4)); rect(g, 1276, 456, 508, 18, D('#c8c2b4', .4));
  rect(g, 1310, 418, 34, 38, D('#b85a3a', .5)); el(g, 1327, 410, 26, 18, D('#4a8a4a', .5)); el(g, 1316, 400, 14, 12, D('#5a9a52', .5));   // a pot plant on the sill
  // a poster and a sign on the wall
  g.save(); g.translate(1050, 300); g.rotate(-.02); rect(g, -4, -4, 168, 228, 'rgba(0,0,0,.18)'); rect(g, 0, 0, 160, 220, D('#e8d8b0', .45)); vgrad(g, 10, 10, 140, 140, D('#3a5a8a', .45), D('#1a2a4a', .45)); el(g, 80, 90, 34, 34, D('#e8b040', .45));
  g.fillStyle = D('#2a2622', .45); g.font = `700 22px ${TH}`; g.fillText('VHS 1997', 30, 185); g.font = `400 16px ${TH}`; g.fillText('ฉายทุกคืนวันศุกร์', 24, 208); g.restore();
  // shelves of tapes: spines with labels, some lying flat, boxes, a plant, brackets and shadows
  for (let r = 0; r < 4; r++) {
    const y = 170 + r * 140;
    g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(124, y + 14, 816, 16);
    let x = 128;
    for (let k = 0; x < 920; k++) {
      const h = hash(r * 40 + k), c = TAPEC[Math.floor(h * TAPEC.length)];
      if (hash(r * 7 + k * 3) > .92 && x < 860) { for (let j = 0; j < 4; j++) rect(g, x, y - 14 - j * 15, 70, 13, D(TAPEC[(k + j) % TAPEC.length])); x += 78; continue; }   // a stack lying flat
      if (r === 0 && k === 6) { rect(g, x, y - 52, 80, 52, D('#a88a5a')); rect(g, x, y - 52, 80, 8, D('#8a6e44')); x += 86; continue; }   // a cardboard box
      const th = 56 + hash(k + r) * 8; rect(g, x, y - th, 24, th, D(c)); rect(g, x + 3, y - th + 10, 18, 22, D('#efe8d4', .55)); rect(g, x + 20, y - th, 4, th, 'rgba(0,0,0,.18)'); x += 27 + (hash(k * 5 + r) > .85 ? 6 : 0);
    }
    rect(g, 120, y, 820, 14, D('#7a5a3e')); rect(g, 120, y + 10, 820, 4, D('#5a3e28')); for (const bx of [160, 520, 900]) poly(g, [[bx, y + 14], [bx + 16, y + 14], [bx, y + 40]], D('#4a4a4e'));
  }
rect(g, 860, 98, 40, 34, D('#c86a3a', .5)); el(g, 880, 92, 30, 20, D('#4a8a4a', .5)); for (let k = 0; k < 4; k++) cap(g, [868 + k * 8, 100], [850 + k * 14, 150 + k * 10], 4, D('#5a9a52', .5));   // a trailing plant
  // clock
  g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.arc(1126, 206, 54, 0, 7); g.fill();
  g.fillStyle = N ? '#d8d4c8' : '#f2eee4'; g.beginPath(); g.arc(1120, 200, 52, 0, 7); g.fill(); g.strokeStyle = '#4a4a4a'; g.lineWidth = 5; g.stroke();
  for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; cap(g, [1120 + Math.cos(a) * 42, 200 + Math.sin(a) * 42], [1120 + Math.cos(a) * 47, 200 + Math.sin(a) * 47], 3, '#4a4a4a'); }
  const hr = o.clock ?? (N ? 23.97 : 14.2), a1 = (hr % 12) / 12 * 6.283 - 1.571, a2 = (hr % 1) * 6.283 - 1.571;
  g.strokeStyle = '#2a2a2a'; g.lineCap = 'round'; g.lineWidth = 6; g.beginPath(); g.moveTo(1120, 200); g.lineTo(1120 + Math.cos(a1) * 28, 200 + Math.sin(a1) * 28); g.stroke();
  g.lineWidth = 4; g.beginPath(); g.moveTo(1120, 200); g.lineTo(1120 + Math.cos(a2) * 42, 200 + Math.sin(a2) * 42); g.stroke();
  // floor: tiles in perspective, light from the window
  vgrad(g, 0, 860, W, 220, D('#6a5a48', .3), D('#4a3e30', .3));
  g.strokeStyle = N ? 'rgba(0,0,0,.25)' : 'rgba(0,0,0,.12)'; g.lineWidth = 2;
  for (let k = -12; k <= 12; k++) { g.beginPath(); g.moveTo(960 + k * 80, 862); g.lineTo(960 + k * 230, H); g.stroke(); }
  for (const y of [884, 916, 958, 1012]) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  if (!N) { g.fillStyle = 'rgba(255,240,200,.14)'; g.beginPath(); g.moveTo(1240, 862); g.lineTo(1760, 862); g.lineTo(1540, H); g.lineTo(820, H); g.closePath(); g.fill(); }
  if (o.footprints) for (let i = 0; i < o.footprints; i++) { g.fillStyle = 'rgba(160,200,230,.35)'; g.beginPath(); g.ellipse(1700 - i * 120, 1000 - (i % 2) * 34, 20, 34, .2, 0, 7); g.fill(); }
  // a stack of old TVs by the wall and a crate of tapes
  for (const [x, y, w, h] of [[1110, 760, 150, 110], [1124, 660, 122, 100], [1290, 790, 120, 80]]) { rr(g, x, y, w, h, 10, D('#3a3a40')); rr(g, x + 12, y + 12, w * .66, h - 24, 12, D('#1e2a30')); el(g, x + w - 20, y + 26, 6, 6, D('#6a6a70')); }
  rect(g, 1430, 800, 130, 70, D('#8a6a46')); rect(g, 1430, 800, 130, 10, D('#6a4e32')); for (let k = 0; k < 4; k++) rect(g, 1440 + k * 30, 780, 24, 28, D(TAPEC[k + 1]));
  // the desk: a thick top, drawers, a shadow, things on it (the middle stays clear for the box)
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(90, 890, 980, 14);
  rect(g, 80, 700, 1000, 30, D('#8a6444')); rect(g, 80, 724, 1000, 8, D('#6a4a32')); rect(g, 110, 730, 30, 160, D('#6a4a32')); rect(g, 1020, 730, 30, 160, D('#6a4a32'));
  rect(g, 600, 732, 220, 90, D('#7a5a3c')); for (const y of [744, 786]) { rect(g, 610, y, 200, 34, D('#8a6646')); rect(g, 694, y + 14, 32, 6, D('#c8b070', .5)); }
  for (let k = 0; k < 3; k++) { rect(g, 160 + k * 70, 830 - k * 8, 60, 60 + k * 8, D('#9a7a52')); rect(g, 160 + k * 70, 830 - k * 8, 60, 8, D('#7a5e3a')); }   // boxes under the desk
  g.strokeStyle = D('#1a1a1e'); g.lineWidth = 6; g.beginPath(); g.moveTo(560, 700); g.bezierCurveTo(600, 820, 380, 860, 300, 890); g.stroke();   // a cable hanging down
  // CRT TV + VCR
  rr(g, 152, 424, 436, 292, 20, 'rgba(0,0,0,.25)');
  rr(g, 160, 430, 420, 280, 18, '#2a2a30'); rr(g, 166, 436, 408, 268, 16, '#34343c'); rr(g, 190, 455, 330, 230, 26, o.screen || (N ? '#1a2a3a' : '#2a3a40'));
  g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.ellipse(300, 520, 120, 50, -.3, 0, 7); g.fill();
  rect(g, 530, 470, 30, 12, '#4a4a50'); rect(g, 530, 495, 30, 12, '#4a4a50'); for (let k = 0; k < 5; k++) rect(g, 532, 540 + k * 12, 26, 4, '#22222a');
  cap(g, [300, 430], [250, 330], 4, '#6a6a70'); cap(g, [340, 430], [410, 340], 4, '#6a6a70');   // rabbit-ear antenna
  rr(g, 170, 650, 400, 50, 6, '#1e1e24'); rect(g, 300, 668, 150, 10, '#0a0a0e'); g.fillStyle = o.vcrOn ? '#3aff7a' : '#225a32'; g.fillRect(470, 666, 60, 14);
  for (let k = 0; k < 4; k++) el(g, 196 + k * 22, 676, 5, 5, '#4a4a52');
  // monitor with a waveform
  rr(g, 680, 470, 320, 220, 10, '#2a2a30'); rect(g, 700, 490, 280, 170, N ? '#0c1a14' : '#10221a'); rect(g, 820, 690, 40, 20, '#2a2a30');
  g.strokeStyle = 'rgba(58,224,138,.18)'; g.lineWidth = 1; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(700, 500 + k * 30); g.lineTo(980, 500 + k * 30); g.stroke(); }
  g.strokeStyle = '#3ae08a'; g.lineWidth = 2; g.beginPath(); for (let k = 0; k <= 70; k++) { const x = 705 + k * 4, y = 575 + Math.sin(k * .7 + t * 6) * 26 * hash(Math.floor(k / 3) + Math.floor(t * 8)); k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  // tools and things on the desk: an open cassette, a soldering iron on its stand, screwdrivers, a mug, a notebook
  g.save(); g.translate(610, 690); g.rotate(-.06); rect(g, -6, -10, 64, 12, D('#1a1a1e')); el(g, 10, -14, 9, 4, D('#3a3430')); el(g, 42, -14, 9, 4, D('#3a3430')); g.restore();
  cap(g, [1056, 696], [1062, 640], 3, D('#5a5a60')); cap(g, [1060, 650], [1000, 610], 7, D('#c8443a')); cap(g, [1000, 610], [978, 596], 3, D('#c8c8c8'));
  if (!N) for (let k = 0; k < 3; k++) { g.strokeStyle = `rgba(255,255,255,${.25 - k * .06})`; g.lineWidth = 3; g.beginPath(); g.moveTo(976 - k * 4, 590 - k * 24); g.quadraticCurveTo(990, 570 - k * 24, 972, 556 - k * 24); g.stroke(); }   // a thread of solder smoke
  rect(g, 1036, 670, 32, 30, D('#e8e2d4')); rect(g, 1064, 678, 10, 14, D('#e8e2d4')); rect(g, 1036, 670, 32, 6, D('#3a2a1e'));   // a mug
  g.save(); g.translate(660, 696); g.rotate(.05); rect(g, -40, -8, 90, 8, D('#e6dcc0')); rect(g, -40, -8, 4, 8, D('#c8322c')); g.restore();
  cap(g, [130, 696], [190, 690], 5, D('#e0a830')); cap(g, [190, 690], [214, 688], 2, D('#c8c8c8')); cap(g, [140, 684], [196, 682], 5, D('#2a6ab0'));
  // lamp
  if (N) { const gr = g.createRadialGradient(900, 640, 10, 900, 640, 520); gr.addColorStop(0, `rgba(255,200,120,${.32 * (o.lamp ?? 1)})`); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const tv = g.createRadialGradient(355, 570, 20, 355, 570, 520); tv.addColorStop(0, 'rgba(90,140,210,.16)'); tv.addColorStop(1, 'rgba(90,140,210,0)'); g.fillStyle = tv; g.fillRect(0, 0, W, H); }
  rect(g, 940, 560, 8, 140, '#2a2a2a'); el(g, 944, 700, 26, 6, '#2a2a2a'); poly(g, [[900, 560], [990, 560], [970, 510], [920, 510]], N ? '#e8b040' : '#c88a2a');
  if (N) { g.fillStyle = 'rgba(255,220,150,.5)'; g.beginPath(); g.moveTo(905, 560); g.lineTo(985, 560); g.lineTo(1010, 590); g.lineTo(880, 590); g.closePath(); g.fill(); }
}
const dim = (c, k) => { const n = parseInt(c.slice(1), 16), f = v => Math.round(v * k).toString(16).padStart(2, '0'); return '#' + f(n >> 16) + f(n >> 8 & 255) + f(n & 255); };
const el = (g, x, y, rx, ry, c) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); };
const cap = (g, a, b, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); };
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
  for (let f = 0; f < 6; f++) { rect(g, 560, 196 + f * 118 + 78, 800, 8, '#2e2e3a'); for (let k = 0; k < 3; k++) if (hash(f * 5 + k) > .4) { rect(g, 610 + k * 280 + hash(f + k) * 60, 196 + f * 118 + 50, 50, 30, '#4a4a56'); for (let q = 0; q < 4; q++) rect(g, 614 + k * 280 + hash(f + k) * 60 + q * 11, 196 + f * 118 + 54, 6, 22, '#2e2e38'); } }   // ledges and old AC units
  g.strokeStyle = '#2a3a2a'; g.lineWidth = 5; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(570 + i * 90, 920); g.bezierCurveTo(560 + i * 90 + hash(i) * 60, 760, 600 + i * 90, 640 - hash(i + 1) * 200, 580 + i * 90 + hash(i + 2) * 40, 520 - hash(i + 3) * 260); g.stroke(); }   // creepers up the wall
  for (const [x, w, h] of [[0, 300, 420], [180, 260, 300], [1420, 240, 360], [1640, 300, 460]]) { rect(g, x, 920 - h, w, h, '#14141e'); for (let i = 0; i < 6; i++) if (hash(x + i) > .6) rect(g, x + 30 + (i % 3) * 70, 940 - h + Math.floor(i / 3) * 80, 30, 40, '#3a3428'); }   // neighbours
  for (const x of [470, 1450]) { rect(g, x - 8, 700, 16, 220, '#14100c'); el(g, x, 650, 110, 90, '#0e1810'); el(g, x - 60, 690, 70, 60, '#101c12'); el(g, x + 60, 680, 80, 60, '#0c160e'); }   // trees
  g.fillStyle = '#e8e4d0'; g.font = `700 34px ${TH}`; g.textAlign = 'center'; g.fillText('วิชัยแล็บ', 960, 190); g.textAlign = 'left';
  rect(g, 0, 920, W, 160, '#1a1a22'); g.fillStyle = 'rgba(255,220,150,.08)'; g.fillRect(250, 930, 110, 150); for (let k = 0; k < 8; k++) rect(g, k * 260 + 40, 1010, 140, 8, '#3a3a40');   // the lamp in the wet road, lane marks
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
  // lobby details: floor tiles in perspective, a directory board, mailboxes, a bench, a dead plant, stains, a wall clock
  g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; for (let k = -12; k <= 12; k++) { g.beginPath(); g.moveTo(960 + k * 80, 822); g.lineTo(960 + k * 240, H); g.stroke(); } for (const y of [850, 890, 950, 1030]) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  const fr = g.createLinearGradient(0, 822, 0, H); fr.addColorStop(0, 'rgba(240,250,220,.12)'); fr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = fr; g.fillRect(700, 822, 520, 258);
  for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(20,24,18,${.06 + .08 * hash(i + 70)})`; g.beginPath(); g.ellipse(hash(i + 30) * W, 120 + hash(i + 31) * 600, 20 + hash(i) * 70, 30 + hash(i + 1) * 90, 0, 0, 7); g.fill(); }
  rect(g, 0, 780, W, 40, '#3a4038'); rect(g, 0, 776, W, 6, '#2a302a');
  rect(g, 470, 300, 220, 260, '#3a3020'); rect(g, 480, 310, 200, 240, '#1e1e1a'); g.fillStyle = '#e8e2c8'; g.font = `600 22px ${TH}`; g.fillText('ผังอาคาร', 530, 340);
  for (let k = 0; k < 6; k++) { g.fillStyle = k === 2 ? '#c8322c' : '#c8c2a8'; g.font = `500 19px ${TH}`; g.fillText(`ชั้น ${'๖๕๔๓๒๑'[k]}  ${['ห้องเก็บของ', 'สำนักงาน', 'ห้องแล็บ (ปิด)', 'คลังเทป', 'ห้องประชุม', 'โถงต้อนรับ'][k]}`, 494, 378 + k * 30); }
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { rect(g, 1560 + i * 64, 560 + j * 54, 58, 48, '#7a7e78'); rect(g, 1570 + i * 64, 590 + j * 54, 38, 6, '#2a2a2a'); if ((i + j) % 3 === 0) { g.save(); g.translate(1566 + i * 64, 566 + j * 54); g.rotate(-.2); rect(g, 0, 0, 30, 18, '#e8e2d0'); g.restore(); } }
  rect(g, 1240, 700, 260, 24, '#5a4a36'); rect(g, 1250, 724, 14, 80, '#3a3026'); rect(g, 1476, 724, 14, 80, '#3a3026'); rect(g, 1240, 640, 260, 18, '#5a4a36');
  rect(g, 680, 720, 60, 80, '#8a5a3a'); for (let k = 0; k < 6; k++) cap(g, [710, 720], [690 + k * 9, 640 + (k % 2) * 20], 3, '#6a5a3a');
  g.fillStyle = '#d8d4c8'; g.beginPath(); g.arc(1700, 200, 42, 0, 7); g.fill(); cap(g, [1700, 200], [1700, 172], 4, '#2a2a2a'); cap(g, [1700, 200], [1720, 212], 4, '#2a2a2a');
  for (let k = 0; k < 5; k++) { g.save(); g.translate(1250 + k * 50, 540 - (k % 2) * 20); g.rotate((hash(k) - .5) * .3); rect(g, 0, 0, 40, 54, ['#e8e2c8', '#f2eed8', '#e0d8b8'][k % 3]); g.fillStyle = 'rgba(60,50,40,.4)'; for (let l = 0; l < 4; l++) g.fillRect(6, 10 + l * 10, 28, 3); g.restore(); }
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
  // corridor details: floor tiles and ceiling pipes running to the far end, door numbers, stains, an extinguisher, a notice
  g.strokeStyle = sh('#4a5044'); g.lineWidth = 2;
  for (let k = -6; k <= 6; k++) { g.beginPath(); g.moveTo(vx + k * 170, H); g.lineTo(far[0] + far[2] / 2 + k * 20, far[1] + far[3]); g.stroke(); }
  for (let i = 1; i < 9; i++) { const u = 1 - Math.pow(.72, i), y = lerp(H, far[1] + far[3], u), x0 = lerp(0, far[0], u), x1 = lerp(W, far[0] + far[2], u); g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); }
  for (const [x0, w, c] of [[300, 14, '#5a6058'], [360, 8, '#7a5a3a']]) { g.strokeStyle = sh(c); g.lineWidth = w; g.beginPath(); g.moveTo(x0, 0); g.lineTo(far[0] + 30 + x0 / 30, far[1] + 4); g.stroke(); }
  for (let i = 0; i < 18; i++) { const sd = i % 2 ? 1 : -1, u = hash(i + 40) * .7, x = sd < 0 ? lerp(0, far[0], u) : lerp(W, far[0] + far[2], u), y = lerp(200, far[1] + 40, u); g.fillStyle = `rgba(20,26,18,${(.1 + .1 * hash(i)) * L})`; g.beginPath(); g.ellipse(x, y + hash(i + 2) * 260 * (1 - u), (30 + hash(i + 3) * 60) * (1 - u * .8), (40 + hash(i + 5) * 90) * (1 - u * .8), 0, 0, 7); g.fill(); }
  g.font = `700 30px ${TH}`; g.fillStyle = sh('#d8d0b0'); g.fillText('๔๐๑', 110, 460); g.font = `700 20px ${TH}`; g.fillText('๔๐๓', 670, 470); g.fillText('๔๐๒', 1240, 470);
  rect(g, 1700, 600, 40, 110, sh('#b8322c')); rect(g, 1708, 584, 24, 18, sh('#2a2a2a')); rect(g, 1704, 640, 32, 30, sh('#e8e2d0'));
  g.save(); g.translate(1560, 380); g.rotate(.06); rect(g, 0, 0, 90, 120, sh('#e8e2c8')); g.fillStyle = sh('#c8322c'); g.font = `700 20px ${TH}`; g.fillText('ห้ามเข้า', 10, 34); g.fillStyle = sh('#4a4a4a'); for (let l = 0; l < 5; l++) g.fillRect(10, 52 + l * 12, 70, 3); g.restore();
  if (o.wet) { const gr = g.createLinearGradient(0, 760, 0, H); gr.addColorStop(0, 'rgba(200,230,240,0)'); gr.addColorStop(1, `rgba(200,230,240,${.25 * L})`); g.fillStyle = gr; poly(g, [[700, H], [1220, H], [1010, 700], [910, 700]], gr); }
}
const lerp = (a, b, u) => a + (b - a) * u;
function shade(c, L) { const n = parseInt(c.slice(1), 16), f = v => Math.round(v * (.12 + .88 * L)).toString(16).padStart(2, '0'); return '#' + f(n >> 16) + f(n >> 8 & 255) + f(n & 255); }

export function lift(g, t, open = 0, L = 1) {
  vgrad(g, 0, 0, W, H, shade('#5a6258', L), shade('#3a4038', L)); rect(g, 0, 900, W, 180, shade('#4a4a42', L));
  rect(g, 520, 120, 880, 800, shade('#7a7e80', L));
  rect(g, 560, 160, 800, 760, shade('#2a2e2a', L));   // inside the car
  const gr = g.createLinearGradient(0, 160, 0, 920); gr.addColorStop(0, shade('#d8dcc8', L)); gr.addColorStop(1, shade('#8a8e80', L)); g.fillStyle = gr; g.fillRect(580, 180, 760, 740);
  rect(g, 600, 600, 720, 10, shade('#9a9e98', L)); rect(g, 1240, 360, 60, 200, shade('#5a5e5a', L)); for (let k = 0; k < 8; k++) el(g, 1270, 380 + k * 22, 7, 7, shade(k === 4 ? '#e8463c' : '#c8c8c0', L));   // a handrail and the button panel
  rect(g, 600, 900, 720, 20, shade('#3a3e3a', L)); for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(0,0,0,${.08 * L})`; g.fillRect(620 + hash(i) * 660, 300 + hash(i + 1) * 500, 30 + hash(i + 2) * 60, 3); }
  const d = open * 400;
  for (const [x, w, c] of [[560 - d, 400, '#a8acae'], [960 + d, 400, '#9ca0a2']]) { const sg = g.createLinearGradient(x, 0, x + w, 0); sg.addColorStop(0, shade(c, L)); sg.addColorStop(.5, shade('#c8ccce', L)); sg.addColorStop(1, shade(c, L)); g.fillStyle = sg; g.fillRect(x, 160, w, 760); for (let i = 0; i < 5; i++) { g.fillStyle = `rgba(0,0,0,${.07 * L})`; g.fillRect(x + 30 + hash(x + i) * 300, 400 + hash(i + x) * 400, 50, 2); } }
  { const x = 960 + d + 60; rect(g, x, 420, 80, 110, shade('#e8e2c8', L)); g.fillStyle = shade('#c8322c', L); g.font = `700 18px ${TH}`; g.fillText('ห้ามใช้', x + 8, 450); g.fillText('ชั้น ๔', x + 12, 476); }   // a taped notice on the door
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
  // lab details: blinds on a dark window, a desk of papers and a lamp, cables on the floor, a filing cabinet, a whiteboard tray, dust sheets
  rect(g, 0, 826, W, 8, sh('#2a302e')); g.strokeStyle = sh('#343a38'); g.lineWidth = 2; for (let k = -12; k <= 12; k++) { g.beginPath(); g.moveTo(960 + k * 80, 834); g.lineTo(960 + k * 230, H); g.stroke(); }
  rr(g, 880, 120, 560, 280, 4, sh('#1a2028')); for (let k = 0; k < 14; k++) rect(g, 880, 126 + k * 20, 560, 12, sh('#8a9290')); cap(g, [1420, 120], [1420, 380], 2, sh('#5a5a5a'));
  for (let i = 0; i < 12; i++) { g.save(); g.translate(170 + hash(i) * 660, 610 + hash(i + 1) * 200); g.rotate((hash(i + 2) - .5) * .8); rect(g, -26, -18, 52, 36, sh('#e8e2cc')); g.fillStyle = sh('#6a6a6a'); for (let l = 0; l < 3; l++) g.fillRect(-18, -10 + l * 8, 36, 2); g.restore(); }   // papers on the floor
  rect(g, 160, 700, 340, 22, sh('#5a5048')); rect(g, 170, 722, 16, 110, sh('#3a342e')); rect(g, 474, 722, 16, 110, sh('#3a342e'));
  for (let k = 0; k < 5; k++) rect(g, 190 + k * 8, 684 - k * 5, 90, 6, sh(['#e8e2cc', '#d8d2bc', '#efe8d4'][k % 3])); rect(g, 330, 650, 6, 50, sh('#2a2a2a')); poly(g, [[300, 650], [370, 650], [356, 620], [314, 620]], sh('#3a6a5a'));
  rect(g, 560, 640, 120, 190, sh('#6a7470')); for (let k = 0; k < 3; k++) { rect(g, 570, 652 + k * 60, 100, 50, sh('#7a8480')); rect(g, 606, 672 + k * 60, 28, 6, sh('#3a3a3a')); }
  g.strokeStyle = sh('#1a1a1e'); g.lineWidth = 7; for (const [a, b] of [[[990, 830], [700, 1000]], [[1100, 830], [1300, 1060]], [[1200, 830], [900, 1080]]]) { g.beginPath(); g.moveTo(...a); g.quadraticCurveTo((a[0] + b[0]) / 2 + 80, b[1] - 40, ...b); g.stroke(); }
  poly(g, [[1240, 830], [1400, 830], [1420, 700], [1380, 640], [1290, 630], [1250, 700]], sh('#c8c4b8')); g.fillStyle = sh('rgba(0,0,0,.12)'); g.fillRect(1250, 760, 160, 6);   // a dust sheet over a machine
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
  // more of the shop: a pegboard of tools, a radio, boxes of parts, a calendar, a ceiling bulb, a cat on the counter, floor tiles
  g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 2; for (let k = -10; k <= 10; k++) { g.beginPath(); g.moveTo(960 + k * 90, 862); g.lineTo(960 + k * 240, H); g.stroke(); } for (const y of [890, 930, 990]) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  rect(g, 1000, 330, 520, 240, '#b89a6a'); for (let i = 0; i < 13; i++) for (let j = 0; j < 6; j++) el(g, 1020 + i * 40, 350 + j * 38, 3, 3, '#7a6444');
  for (const [x, y, c, l] of [[1040, 360, '#c8322c', 90], [1100, 360, '#e0a830', 110], [1170, 360, '#2a6ab0', 80], [1240, 370, '#5a5a60', 120], [1320, 360, '#c8322c', 100], [1400, 380, '#2a8a5e', 90]]) { cap(g, [x, y], [x, y + l], 10, c); cap(g, [x, y + l], [x, y + l + 40], 4, '#b8b8c0'); }
  for (let i = 0; i < 4; i++) { rect(g, 1030 + i * 120, 600, 100, 40, ['#8a6a46', '#9a7a52', '#7a5e3a', '#8a6a46'][i]); g.fillStyle = '#2a2a2a'; g.font = `600 18px ${TH}`; g.fillText(['ฟิวส์', 'สายไฟ', 'หลอด', 'น็อต'][i], 1050 + i * 120, 626); }
  rr(g, 1180, 560, 150, 76, 10, '#6a3a2a'); el(g, 1220, 598, 26, 26, '#2a2a2a'); for (let k = 0; k < 4; k++) rect(g, 1262, 576 + k * 12, 50, 4, '#c8b070'); cap(g, [1300, 560], [1340, 470], 3, '#b8b8c0');   // a radio
  rect(g, 870, 180, 110, 140, '#f2ece0'); rect(g, 870, 180, 110, 26, '#c8322c'); g.fillStyle = '#fff'; g.font = `700 18px ${TH}`; g.fillText('พ.ย. ๖๙', 890, 199); g.fillStyle = '#4a4a4a'; for (let i = 0; i < 20; i++) g.fillRect(882 + (i % 5) * 19, 218 + Math.floor(i / 5) * 22, 10, 10);
  cap(g, [1250, 90], [1250, 210], 2, '#2a2a2a'); el(g, 1250, 222, 16, 20, '#fff2c8'); const bl = g.createRadialGradient(1250, 222, 0, 1250, 222, 520); bl.addColorStop(0, 'rgba(255,214,140,.32)'); bl.addColorStop(1, 'rgba(255,214,140,0)'); g.fillStyle = bl; g.fillRect(0, 0, W, H);
  el(g, 1700, 628, 46, 22, '#e8a050'); el(g, 1660, 610, 20, 18, '#e8a050'); poly(g, [[1648, 596], [1654, 580], [1660, 594]], '#e8a050'); poly(g, [[1664, 594], [1670, 580], [1676, 596]], '#e8a050'); cap(g, [1744, 630], [1780, 600 + Math.sin(t * 2) * 10], 8, '#e8a050'); cap(g, [1652, 610], [1658, 610], 2, '#2a2a2a');   // the shop cat asleep
  g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(970, 880, 880, 14);
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
  for (const [x, y, w] of [[300, 160, 180], [460, 130, 120], [1500, 110, 200], [1680, 150, 140]]) el(g, x, y, w, w * .28, 'rgba(255,255,255,.55)');
  for (const [x, w, h, c] of [[0, 420, 520, '#9a9488'], [260, 260, 380, '#8a867c'], [1420, 260, 440, '#949088'], [1640, 300, 560, '#8a8478']]) { rect(g, x, 920 - h, w, h, c); for (let i = 0; i < 6; i++) rect(g, x + 30 + (i % 3) * 76, 960 - h + Math.floor(i / 3) * 110, 40, 60, '#5a646a'); }
  rect(g, 180, 200, 20, 720, '#7a7a74'); rect(g, 140, 260, 100, 10, '#5a5a54'); g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; for (let w = 0; w < 3; w++) { g.beginPath(); g.moveTo(190, 265 + w * 6); g.quadraticCurveTo(900, 330 + w * 20, W, 240 + w * 12); g.stroke(); }
  g.fillStyle = 'rgba(60,40,90,.6)'; g.font = `700 50px ${TH}`; g.save(); g.translate(640, 880); g.rotate(-.05); g.fillText('ผีอยู่ชั้น ๔', 0, 0); g.restore();
  g.fillStyle = 'rgba(90,110,130,.35)'; g.beginPath(); g.ellipse(700, 1010, 180, 22, 0, 0, 7); g.fill(); for (let k = 0; k < 20; k++) rect(g, k * 100, 1040, 4, 40, 'rgba(0,0,0,.12)');
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
  vgrad(g, 0, 0, W, H, '#9ac0d8', '#dfe6e2');
  el(g, 300, 160, 140, 40, 'rgba(255,255,255,.7)'); el(g, 420, 140, 100, 34, 'rgba(255,255,255,.7)'); el(g, 1500, 120, 160, 36, 'rgba(255,255,255,.6)');
  // the neighbours: shophouses either side
  for (const [x, w, c] of [[-60, 440, '#c8a88a'], [1540, 440, '#b8c0b0']]) { rect(g, x, 220, w, 690, c); for (let j = 0; j < 2; j++) for (let k = 0; k < 3; k++) rect(g, x + 50 + k * 130, 280 + j * 150, 80, 100, '#5a6a72'); rect(g, x, 700, w, 210, dim(c, .8)); for (let k = 0; k < 10; k++) rect(g, x + 20 + k * 42, 720, 30, 180, dim(c, .7)); }
  rect(g, 0, 900, W, 180, '#7a7a76'); rect(g, 0, 890, W, 16, '#9a9a94'); for (let k = 0; k < 24; k++) rect(g, k * 90, 906, 3, 174, 'rgba(0,0,0,.1)');
  // Beer's shop
  rect(g, 360, 180, 1200, 720, '#d8c8a8'); rect(g, 360, 180, 1200, 12, '#b8a888'); for (let i = 0; i < 20; i++) { g.fillStyle = `rgba(80,60,40,${.05 + .05 * hash(i)})`; g.beginPath(); g.ellipse(380 + hash(i + 4) * 1160, 320 + hash(i + 5) * 560, 30 + hash(i) * 60, 14, 0, 0, 7); g.fill(); }
  rect(g, 360, 180, 1200, 120, '#2a6a4e'); rect(g, 360, 292, 1200, 8, '#1e4e3a'); g.fillStyle = '#f2ecd8'; g.font = `700 70px ${TH}`; g.fillText('เบียร์ซ่อมเทป · TAPE REPAIR', 440, 262);
  for (let k = 0; k < 12; k++) { g.fillStyle = k % 2 ? '#e8e2d0' : '#2a8a5e'; g.beginPath(); g.moveTo(400 + k * 95, 330); g.lineTo(495 + k * 95, 330); g.lineTo(495 + k * 95, 370); g.quadraticCurveTo(447 + k * 95, 390, 400 + k * 95, 370); g.closePath(); g.fill(); }   // a striped awning
  g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(400, 370, 1140, 30);
  rect(g, 460, 400, 560, 380, '#2a3a44'); rect(g, 450, 390, 580, 10, '#e8e2d0'); rect(g, 450, 780, 580, 14, '#e8e2d0');
  for (let r = 0; r < 2; r++) { rect(g, 480, 520 + r * 130, 520, 8, '#6a5a44'); for (let k = 0; k < 14; k++) rect(g, 490 + k * 36, 460 + r * 130, 28, 60, TAPEC[(k + r * 3) % TAPEC.length]); }
  rr(g, 760, 690, 200, 70, 6, '#f2ecd8'); g.fillStyle = '#c8322c'; g.font = `700 26px ${TH}`; g.fillText('รับแปลงเทป', 784, 722); g.fillStyle = '#2a2a2a'; g.font = `500 20px ${TH}`; g.fillText('VHS → ไฟล์', 800, 748);
  g.fillStyle = 'rgba(255,255,255,.18)'; for (const x of [520, 640, 880]) { g.beginPath(); g.moveTo(x, 400); g.lineTo(x + 60, 400); g.lineTo(x - 80, 780); g.lineTo(x - 140, 780); g.closePath(); g.fill(); }
  rect(g, 1140, 360, 300, 540, '#5a4430'); rect(g, 1160, 380, 260, 240, '#6a5038'); rect(g, 1180, 400, 220, 200, '#8ab0c0'); rect(g, 1400, 610, 12, 40, '#c8b060'); rr(g, 1210, 660, 160, 50, 6, '#f2ecd8'); g.fillStyle = '#2a8a5e'; g.font = `700 28px ${TH}`; g.fillText('เปิด OPEN', 1222, 694);
  // the street: a potted plant, a motorbike, a power pole with wires, a bench
  rect(g, 1080, 820, 60, 80, '#b85a3a'); el(g, 1110, 800, 50, 40, '#4a8a4a'); el(g, 1090, 780, 30, 26, '#5a9a52');
  rect(g, 100, 120, 26, 790, '#8a8a84'); rect(g, 60, 200, 110, 10, '#6a6a64'); g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; for (let w = 0; w < 3; w++) { g.beginPath(); g.moveTo(113, 205 + w * 6); g.quadraticCurveTo(960, 280 + w * 20, W, 190 + w * 10); g.stroke(); }
  g.save(); g.translate(1640, 900); rect(g, -10, -110, 150, 40, '#c8322c'); el(g, 0, -20, 34, 34, '#1e1e22'); el(g, 150, -20, 34, 34, '#1e1e22'); el(g, 0, -20, 14, 14, '#8a8a8a'); el(g, 150, -20, 14, 14, '#8a8a8a'); rect(g, 10, -80, 130, 30, '#3a3a40'); cap(g, [140, -110], [170, -150], 6, '#3a3a40'); cap(g, [160, -150], [190, -150], 6, '#1e1e22'); g.restore();
  rect(g, 200, 840, 160, 14, '#6a4e32'); rect(g, 210, 854, 10, 46, '#4a3a26'); rect(g, 340, 854, 10, 46, '#4a3a26');
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
  // the lane: old shophouses behind, a strip of sky, wires, hanging bulbs, awnings, stalls piled with goods
  vgrad(g, 0, 0, W, 300, '#e8dcc0', '#d4c09a');
  for (let k = 0; k < 7; k++) { const x = k * 290 - 40, h = 210 + hash(k) * 90, c = ['#c8b494', '#b8a88a', '#d0bc98', '#a89a82'][k % 4];
    rect(g, x, 300 - h, 284, h + 120, c); rect(g, x, 300 - h, 284, 14, dim(c, .8));
    for (let j = 0; j < 3; j++) { rect(g, x + 30 + j * 86, 330 - h, 54, 70, '#5a6a72'); rect(g, x + 26 + j * 86, 400 - h, 62, 8, dim(c, .75)); if (hash(k * 3 + j) > .5) for (let q = 0; q < 6; q++) rect(g, x + 32 + j * 86 + q * 9, 334 - h, 4, 62, '#3a3a3e'); }
    rect(g, x + 40, 380 - h * .2, 200, 44, ['#2a6ab0', '#c8322c', '#2a8a5e', '#e0a830'][(k + 1) % 4]); g.fillStyle = '#fff'; g.font = `700 26px ${TH}`; g.fillText(['ร้านทอง', 'ยาจีน', 'ผ้าไหม', 'ข้าวสาร', 'ชา กาแฟ', 'ร้านยา', 'เครื่องเงิน'][k], x + 70, 411 - h * .2); }
  g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; for (let w = 0; w < 4; w++) { g.beginPath(); g.moveTo(0, 120 + w * 30); g.quadraticCurveTo(960, 200 + w * 34, W, 110 + w * 26); g.stroke(); }
  vgrad(g, 0, 300, W, 600, '#9a8a6a', '#6a5e48'); rect(g, 0, 880, W, 200, '#6a6050');
  g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 2; for (let k = -10; k <= 10; k++) { g.beginPath(); g.moveTo(960 + k * 90, 880); g.lineTo(960 + k * 260, H); g.stroke(); }
  g.fillStyle = 'rgba(40,60,70,.25)'; g.beginPath(); g.ellipse(600, 1010, 160, 20, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(1500, 960, 110, 14, 0, 0, 7); g.fill();   // puddles
  for (let k = 0; k < 5; k++) {
    const x = 60 + k * 380, col = ['#c8322c', '#2a6ab0', '#e0a830', '#2a8a5e', '#c8322c'][k];
    rect(g, x + 166, 380, 8, 380, '#4a3a2a');
    g.fillStyle = col; g.beginPath(); g.moveTo(x - 30, 380); g.lineTo(x + 170, 260); g.lineTo(x + 370, 380); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,.14)'; g.beginPath(); g.moveTo(x + 170, 260); g.lineTo(x + 370, 380); g.lineTo(x + 170, 380); g.closePath(); g.fill();
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? dim(col, .85) : col; g.beginPath(); g.arc(x - 30 + 25 + i * 50, 380, 25, 0, Math.PI); g.fill(); }   // scalloped edge
    g.strokeStyle = '#2a2a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 395); g.lineTo(x + 340, 395); g.stroke();
    const on = .7 + .3 * Math.sin(t * 3 + k);
    for (let i = 0; i < 3; i++) { const bx = x + 50 + i * 120; cap(g, [bx, 395], [bx, 420], 2, '#2a2a2a'); el(g, bx, 428, 10, 12, `rgba(255,220,140,${on})`); const gl = g.createRadialGradient(bx, 428, 0, bx, 428, 70); gl.addColorStop(0, 'rgba(255,210,130,.3)'); gl.addColorStop(1, 'rgba(255,210,130,0)'); g.fillStyle = gl; g.fillRect(bx - 70, 358, 140, 140); }
    for (let i = 0; i < 4; i++) { const hx = x + 30 + i * 90; cap(g, [hx, 395], [hx, 470 + (i % 2) * 20], 2, '#5a4a3a'); g.fillStyle = ['#e8c040', '#c8642a', '#7ab040', '#e8e0c8'][(i + k) % 4]; g.beginPath(); g.ellipse(hx, 490 + (i % 2) * 20, 16, 24, 0, 0, 7); g.fill(); }   // goods hanging from the awning
    rect(g, x, 640, 340, 120, '#8a6a46'); rect(g, x, 640, 340, 10, '#6a4e32'); rect(g, x + 20, 760, 14, 120, '#5a4430'); rect(g, x + 306, 760, 14, 120, '#5a4430');
    for (let i = 0; i < 4; i++) { rect(g, x + 20 + i * 80, 590, 70, 50, '#b8945a'); rect(g, x + 20 + i * 80, 590, 70, 8, '#9a7840'); }   // baskets
    for (let i = 0; i < 9; i++) { g.fillStyle = ['#e8a030', '#c8322c', '#7ab040', '#e8d040'][(i + k) % 4]; g.beginPath(); g.arc(x + 30 + i * 36, 600 - (i % 2) * 14, 20, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.arc(x + 24 + i * 36, 594 - (i % 2) * 14, 6, 0, 7); g.fill(); }
    rect(g, x + 250, 560, 60, 30, '#f2ecd8'); g.fillStyle = '#c8322c'; g.font = `700 20px ${TH}`; g.fillText(['๒๐฿', '๑๕฿', '๔๐฿', '๓๐฿', '๒๕฿'][k], x + 258, 582);
    for (let i = 0; i < 3; i++) { rect(g, x + 40 + i * 100, 800, 80, 60, ['#3a6a9a', '#c8443a', '#e8c040'][i]); rect(g, x + 40 + i * 100, 800, 80, 8, 'rgba(0,0,0,.2)'); }   // plastic crates under the stall
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
  // stairwell details: stains, a pipe, a fire hose box, graffiti, cigarette ends and leaves on the steps, a caged bulb
  for (let i = 0; i < 16; i++) { g.fillStyle = `rgba(10,14,10,${(.12 + .1 * hash(i + 3)) * L})`; g.beginPath(); g.ellipse(hash(i + 60) < .5 ? hash(i) * 500 : 1420 + hash(i) * 480, 100 + hash(i + 7) * 600, 20 + hash(i + 1) * 60, 40 + hash(i + 2) * 100, 0, 0, 7); g.fill(); }
  g.strokeStyle = sh('#4a524a'); g.lineWidth = 18; g.beginPath(); g.moveTo(1800, H); g.lineTo(1400, top - 200); g.stroke();
  rect(g, 1600, 520, 120, 160, sh('#a8322c')); rect(g, 1612, 532, 96, 136, sh('#c8c4b8')); g.fillStyle = sh('#a8322c'); g.font = `700 22px ${TH}`; g.fillText('สายดับเพลิง', 1612, 610);
  g.fillStyle = sh('rgba(40,40,60,.6)'); g.font = `700 46px ${TH}`; g.save(); g.translate(120, 420); g.rotate(-.12); g.fillText('อย่าขึ้นไป', 0, 0); g.restore();
  for (let i = 0; i < 14; i++) { const u = hash(i + 80) * .8, y = lerp(H, top, u) - 6, x = lerp(0, 560, u) + hash(i + 81) * (W - 2 * lerp(0, 560, u)); g.fillStyle = sh(i % 3 ? '#6a5a3a' : '#d8d2c0'); g.beginPath(); g.ellipse(x, y, 10 * (1 - u * .7), 4 * (1 - u * .7), hash(i) * 3, 0, 7); g.fill(); }
  rect(g, 950, top - 300, 20, 14, sh('#3a3a3a')); el(g, 960, top - 278, 16, 18, L > .5 ? '#f2eccc' : sh('#6a6a5a')); g.strokeStyle = sh('#3a3a3a'); g.lineWidth = 2; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(960 + k * 10, top - 296); g.lineTo(960 + k * 14, top - 260); g.stroke(); }
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
