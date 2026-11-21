// FILE 03 · ตอนที่ ๑ "ไฟล์ 03" (reworked): an engine plus the episode as a list of scenes.
// Each scene = { d: seconds, tape: true if it is 1997 camcorder footage, osd, lines: [[id, who, at, th, en]], ev: [[at, type]], draw(lt, t) }.
// Scene start times are summed, so a scene can be lengthened without touching the others.
import { person } from './chars2.js';
import { sheet } from './sheet.js';
for (const w of [400, 600, 700]) await document.fonts.load(`${w} 40px 'IBM Plex Sans Thai'`);
const cv = document.getElementById('c'), g = cv.getContext('2d'), W = 1920, H = 1080, TH = "'IBM Plex Sans Thai'";
const buf = document.createElement('canvas'); buf.width = W; buf.height = H; const bg2 = buf.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), seg = (t, a, b) => clamp((t - a) / (b - a)), ease = x => x * x * (3 - 2 * x), lerp = (a, b, u) => a + (b - a) * u;
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
const fetchJ = async p => { try { const r = await fetch(p); return r.ok ? await r.json() : {}; } catch { return {}; } };
const EPN = new URLSearchParams(location.search).get('ep') || '1';
const DURS = await fetchJ(EPN === '1' ? 'voices/dur.json' : `voices_ep${EPN}/dur.json`);
let TEXT = {};
const dur = id => DURS[id] || Math.max(1.6, (TEXT[id] || '').length * .085);

// ---------- engine helpers ----------
let LINES = [];
const speaking = (who, t) => LINES.some(l => l.who === who && t >= l.t && t < l.t + dur(l.id));
const talk = (who, t) => speaking(who, t) ? .35 + .65 * Math.abs(Math.sin(t * 17 + who.length)) : 0;
const P = (who, t, extra = {}) => ({ talk: talk(who, t), blink: (t * .31 + who.length * .17) % 1 < .035, t, ...extra });
function cam(x, y, z, fn, rot = 0) { g.save(); g.translate(W / 2, H / 2); g.rotate(rot); g.scale(z, z); g.translate(-x, -y); fn(); g.restore(); }
// a handheld camcorder: slow drift + breathing + a step bob while walking
const hand = (t, amt = 1, walking = 0) => [Math.sin(t * .7) * 9 * amt + Math.sin(t * 2.3) * 3 * amt, Math.sin(t * .9 + 1) * 6 * amt + Math.abs(Math.sin(t * 5.5)) * 14 * walking, Math.sin(t * .5) * .008 * amt];
function pov(t, x, y, z, fn, amt = 1, walking = 0) { const [dx, dy, r] = hand(t, amt, walking); cam(x + dx, y + dy, z, fn, r); }
const walk = (t, a, b, x0, x1) => ({ x: lerp(x0, x1, ease(seg(t, a, b))), walk: t > a && t < b ? (t - a) * 7 : null });
const black = k => { if (k > 0) { g.fillStyle = `rgba(0,0,0,${clamp(k)})`; g.fillRect(0, 0, W, H); } };
function vhs(t, osd) {
  bg2.drawImage(cv, 0, 0);
  const f = Math.floor(t * 30);
  for (let k = 0; k < 6; k++) { const y = Math.floor(hash(f * 7 + k) * H), h = 4 + hash(f + k) * 20, dx = (hash(f * 3 + k) - .5) * (osd.tear ? 120 : 12); g.drawImage(buf, 0, y, W, h, dx, y, W, h); }
  g.globalCompositeOperation = 'screen'; g.globalAlpha = .16; g.drawImage(buf, 6, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.fillStyle = 'rgba(40,60,90,.14)'; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,.16)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 2);
  for (let i = 0; i < (osd.tear ? 900 : 220); i++) { g.fillStyle = `rgba(255,255,255,${hash(f * 13 + i) * .3})`; g.fillRect(hash(f + i * 1.7) * W, hash(f * 2 + i) * H, 2 + hash(i) * 6, 1.5); }
  const vg = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .9); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  g.font = '700 44px monospace'; g.fillStyle = '#f2f2ec'; g.shadowColor = '#000'; g.shadowOffsetX = 3; g.shadowOffsetY = 3;
  g.fillText(osd.paused ? '❚❚ PAUSE' : '▶ PLAY', 80, 100);
  if (!osd.paused && Math.floor(t * 2) % 2) { g.fillStyle = '#e8322c'; g.beginPath(); g.arc(1700, 86, 14, 0, 7); g.fill(); g.fillStyle = '#f2f2ec'; }
  g.fillText('REC', 1724, 100); g.fillText(osd.date || 'NOV.20.1997', 1340, 1000); g.fillText(osd.time || 'AM 2:04', 80, 1000);
  g.shadowOffsetX = g.shadowOffsetY = 0;
}
// Thai on top, English underneath, smaller
function subs(t) {
  const l = LINES.find(l => t >= l.t && t < l.end); if (!l) return;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `600 46px ${TH}`; const w1 = g.measureText(l.th).width; g.font = `500 30px ${TH}`; const w2 = g.measureText(l.en).width;
  const w = Math.max(w1, w2) + 60, y = H - 215;
  g.fillStyle = 'rgba(0,0,0,.66)'; g.fillRect(W / 2 - w / 2, y - 44, w, 100);
  g.font = `600 46px ${TH}`; g.fillStyle = l.who === 'beer' ? '#9ff0c4' : '#ffffff'; g.fillText(l.th, W / 2, y - 8);
  g.font = `500 30px ${TH}`; g.fillStyle = '#c8c8c8'; g.fillText(l.en, W / 2, y + 34);
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
}
const darkTorch = (bx, by, r = 480, a = .96) => { const m = g.createRadialGradient(bx, by, 50, bx, by, r); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = m; g.fillRect(-W, -H, W * 3, H * 3); };
function frozenTV(drawFrame, t) {   // Beer's TV showing a paused frame, with "PAUSE"
  g.save(); g.beginPath(); g.roundRect(190, 455, 330, 230, 26); g.clip(); g.translate(190, 455); g.scale(330 / W, 230 / H); drawFrame(); g.restore();
}

// ---------- the episode (ep1.js, ep2.js …; pick with ?ep=N) ----------
const Q = new URLSearchParams(location.search), EP = Q.get('ep') || '1';
const BG = await import('./bg.js');
const SCENES = (await import(`./ep${EP}.js`)).default({ g, W, H, TH, person, P, cam, pov, walk, black, vhs, darkTorch, frozenTV, seg, ease, lerp, hash, clamp, ...BG });

// ---------- timeline ----------
let acc = 0; for (const s of SCENES) { s.t0 = acc; acc += s.d; }
const DUR = acc;
SCENES.forEach(s => (s.lines || []).forEach(l => TEXT[l[0]] = l[3]));
LINES = SCENES.flatMap(s => (s.lines || []).map(([id, who, at, th, en]) => ({ id, who, t: s.t0 + at, th, en, end: s.t0 + at + dur(id) + .7 })));
function render(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  let s = SCENES[0]; for (const x of SCENES) if (t >= x.t0) s = x;
  s.draw(t - s.t0, t);
  if (s.tape) { vhs(t, { time: s.osd, date: s.date, tear: t - s.t0 > s.d - 4.6 && s.ev?.some(e => e[1] === 'tear') }); black(1 - seg(t - s.t0, 0, .3)); }
  subs(t);
}
const EV = [];
LINES.forEach(l => EV.push({ t: l.t, type: 'line', id: l.id, who: l.who }));
SCENES.forEach(s => { (s.ev || []).forEach(([at, type]) => EV.push({ t: s.t0 + at, type })); if (s.tape) EV.push({ t: s.t0, type: 'tapeScene', d: s.d }); });
EV.sort((a, b) => a.t - b.t);
window.LINES_EXPORT = LINES.map(l => ({ id: l.id, who: l.who, th: l.th }));
window.DUR = DUR; window.EV = EV; window.render = Q.has('sheet') ? () => sheet(g) : render;
window.render(0); window.READY = true;
