// Cinematic inserts in the style of the reference videos: big stylised hands holding a tape or a phone, filling the frame.
const mix = (a, b, k) => { const p = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
const el = (g, x, y, rx, ry, c, r = 0) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, rx, ry, r, 0, 7); g.fill(); };
const cap = (g, a, b, w, c) => { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); };
// one finger: a capsule with a shaded underside and a pale nail at the tip
function finger(g, a, b, w, skin, nail = true) {
  cap(g, a, b, w, mix(skin, '#3a2018', .22)); cap(g, [a[0] - w * .08, a[1] - w * .08], [b[0] - w * .08, b[1] - w * .08], w * .78, skin);
  if (nail) { const ang = Math.atan2(b[1] - a[1], b[0] - a[0]); el(g, b[0] - Math.cos(ang) * w * .18, b[1] - Math.sin(ang) * w * .18, w * .3, w * .24, mix(skin, '#ffffff', .45), ang); }
}
function forearm(g, sd, from, to, skin, sleeve) {
  cap(g, from, to, 190, mix(sleeve, '#000000', .25)); cap(g, [from[0] - sd * 10, from[1]], [to[0] - sd * 10, to[1] + 40], 165, sleeve);
  cap(g, [to[0], to[1] + 30], [to[0], to[1] - 10], 150, skin);
}
export function cassette(g, label = '03', wet = 0) {   // centred, 760 × 470
  g.fillStyle = '#18181c'; g.beginPath(); g.roundRect(-380, -235, 760, 470, 26); g.fill();
  g.fillStyle = '#26262c'; g.beginPath(); g.roundRect(-360, -215, 720, 430, 18); g.fill();
  g.fillStyle = '#efe6cc'; g.beginPath(); g.roundRect(-320, -190, 640, 200, 10); g.fill();
  g.fillStyle = '#c8322c'; g.fillRect(-320, -150, 640, 16);
  g.fillStyle = '#2a2622'; g.font = "700 74px monospace"; g.fillText(label, -260, -40);
  g.font = "400 34px 'IBM Plex Sans Thai'"; g.fillText('วิชัยแล็บ · ๒๕๔๐', -60, -50);
  g.fillStyle = '#0c0c0e'; g.beginPath(); g.roundRect(-230, 50, 460, 120, 50); g.fill();
  for (const x of [-140, 140]) { el(g, x, 110, 46, 46, '#3a3430'); el(g, x, 110, 18, 18, '#efe6cc'); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; cap(g, [x + Math.cos(a) * 8, 110 + Math.sin(a) * 8], [x + Math.cos(a) * 16, 110 + Math.sin(a) * 16], 4, '#3a3430'); } }
  for (const [x, y] of [[-340, -200], [340, -200], [-340, 200], [340, 200], [0, 205]]) el(g, x, y, 9, 9, '#4a4a52');
  if (wet > 0) { g.fillStyle = `rgba(150,190,220,${.4 * wet})`; g.fillRect(-320, -190, 640, 200); for (let i = 0; i < 6; i++) el(g, -280 + i * 110, -120 + (i % 3) * 40, 9, 13, `rgba(210,230,245,${.6 * wet})`); }
}
// both hands hold a cassette towards the camera (thumbs on the front, fingers behind)
export function handsTape(g, t, o = {}) {
  const skin = o.skin || '#d9a07a', sleeve = o.sleeve || '#3e5a4a';
  g.save(); g.translate(960 + Math.sin(t * .6) * 8, 560 + Math.sin(t * .9) * 6); g.rotate(-.04 + Math.sin(t * .5) * .015); g.scale(o.s || 1, o.s || 1);
  for (const sd of [-1, 1]) { forearm(g, sd, [sd * 560, 760], [sd * 420, 250], skin, sleeve); el(g, sd * 400, 120, 110, 150, skin); el(g, sd * 430, 140, 70, 120, mix(skin, '#3a2018', .14)); }
  for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) finger(g, [sd * 380, 150 + k * 46], [sd * 300, 240 + k * 22], 58, mix(skin, '#3a2018', .08), false);
  cassette(g, o.label || '03', o.wet || 0);
  for (const sd of [-1, 1]) { el(g, sd * 410, 40, 70, 110, skin); finger(g, [sd * 420, 90], [sd * 300, -30], 64, skin); }
  g.restore();
}
// a phone held in the left hand, the right forefinger tapping the screen
export function handsPhone(g, t, screen, o = {}) {
  const skin = o.skin || '#d9a07a', sleeve = o.sleeve || '#3e5a4a', tap = o.tap ?? 0;
  g.save(); g.translate(960 + Math.sin(t * .6) * 6, 560 + Math.sin(t * .9) * 5); g.rotate(.05);
  forearm(g, -1, [-420, 900], [-240, 470], skin, sleeve); el(g, -200, 330, 120, 170, skin); el(g, -240, 360, 70, 130, mix(skin, '#3a2018', .14));
  g.fillStyle = '#121216'; g.beginPath(); g.roundRect(-230, -440, 460, 880, 60); g.fill();
  g.fillStyle = '#2a2a30'; g.beginPath(); g.roundRect(-222, -432, 444, 864, 54); g.fill();
  g.save(); g.beginPath(); g.roundRect(-206, -416, 412, 832, 44); g.clip(); g.translate(-206, -416); g.scale(412 / 1080, 832 / 1920); screen(); g.restore();
  g.fillStyle = '#121216'; g.beginPath(); g.roundRect(-60, -404, 120, 30, 15); g.fill();
  for (let k = 0; k < 4; k++) finger(g, [180, 100 + k * 70], [250, 70 + k * 74], 54, skin);   // fingertips over the right edge
  finger(g, [-200, 260], [-250, 60], 70, skin);   // the thumb on the left edge
  const ty = -60 + tap * 30;
  forearm(g, 1, [560, 980], [420, 620], skin, sleeve); el(g, 330, 470, 120, 140, skin);
  for (let k = 0; k < 3; k++) finger(g, [300 + k * 40, 420], [250 + k * 50, 470 - k * 10], 58, mix(skin, '#3a2018', .06), false);
  finger(g, [290, 380], [60, ty], 56, skin);
  g.restore();
}
