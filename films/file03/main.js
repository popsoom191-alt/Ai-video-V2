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
const DURS = await fetchJ(['1', '12', 'r', 'v2'].includes(EPN) ? 'voices/dur.json' : `voices_ep${EPN}/dur.json`);   // ep12 = the merged episode, reuses episode 1's voices
let TEXT = {};
const dur = id => DURS[id] || Math.max(1.6, (TEXT[id] || '').length * .085);

// ---------- engine helpers ----------
let LINES = [];
const speaking = (who, t) => LINES.some(l => l.who === who && t >= l.t && t < l.t + dur(l.id));
const talk = (who, t) => speaking(who, t) ? .35 + .65 * Math.abs(Math.sin(t * 17 + who.length)) : 0;
// speaker: a small hand gesture and a nod; listener: an occasional nod
// listeners drift into their own stance now and then (Beer thinks with a hand at his chin, Nid folds her arms, Oat a hand on the hip …), easing out a second before they speak
const IDLE = { beer: 'chin', nid: 'cross', oat: 'hip', oatOld: 'hip', chai: 'hips', ton: 'pocket', wichai: 'cross', mind: 'strap' };
const idleK = (who, t) => { if (!IDLE[who]) return 0; const ph = (t * .07 + who.length * .37) % 1; let k = ease(clamp((ph - .1) / .07)) * (1 - ease(clamp((ph - .6) / .07)));
  for (const d of [0, .25, .5, .75, 1]) if (speaking(who, t + d) || speaking(who, t - d)) { k = Math.min(k, d); break; } return k; };
const P = (who, t, extra = {}) => { const sp = speaking(who, t); return { idle: IDLE[who], idleK: idleK(who, t), talk: talk(who, t), blink: (t * .31 + who.length * .17) % 1 < .035, t, gesture: sp, nod: sp ? Math.sin(t * 4.2) * 1.4 : (Math.sin(t * .8 + who.length * 2) > .94 ? Math.sin(t * 9) * 2.4 : 0), ...extra }; };
// keyframes [[t, v | [v...]], ...] eased per segment; a camera that follows them; a walker between positions
const K = (lt, keys) => { if (lt <= keys[0][0]) return keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const [a, A] = keys[i], [b, B] = keys[i + 1]; if (lt <= b) { const u = ease(seg(lt, a, b)); return Array.isArray(A) ? A.map((v, j) => lerp(v, B[j], u)) : lerp(A, B, u); } } return keys[keys.length - 1][1]; };
const camK = (lt, keys, fn, rot = 0) => { const [x, y, z] = K(lt, keys); cam(x, y, z, fn, rot); };
const mover = (lt, keys, speed = 7) => { for (let i = 0; i < keys.length - 1; i++) { const [a, A] = keys[i], [b, B] = keys[i + 1]; if (lt >= a && lt <= b && A !== B) return { x: lerp(A, B, seg(lt, a, b)), walk: (lt - a) * speed, flip: B < A }; } let x = keys[0][1]; for (const [a, A] of keys) if (lt >= a) x = A; return { x, walk: null, flip: null }; };
function cam(x, y, z, fn, rot = 0) { if (z >= 1) { x = clamp(x, W / (2 * z) + 4, W - W / (2 * z) - 4); y = clamp(y, H / (2 * z) + 4, H - H / (2 * z) - 4); } g.save();   // the camera never shows past the edge of the drawing
  g.translate(W / 2, H / 2); g.rotate(rot); g.scale(z, z); g.translate(-x, -y); fn(); g.restore(); }
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
// Thai on top, English underneath, smaller: white text with a dark outline and a soft shadow, no box (like the references)
function subs(t) {
  const l = LINES.find(l => t >= l.t && t < l.end); if (!l) return;
  const a = Math.min(seg(t, l.t, l.t + .18), 1 - seg(t, l.end - .18, l.end)); if (a <= 0) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = a; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  const y = H - 150;
  const txt = (s, font, col, yy, lw) => { g.font = font; g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 14; g.shadowOffsetY = 3; g.strokeStyle = 'rgba(10,10,14,.92)'; g.lineWidth = lw; g.strokeText(s, W / 2, yy); g.shadowColor = 'transparent'; g.fillStyle = col; g.fillText(s, W / 2, yy); };
  txt(l.th, `700 54px ${TH}`, '#ffffff', y, 9);
  txt(l.en, `500 30px ${TH}`, '#e2e2e2', y + 52, 6);
  g.restore();
}
// ---------- film language from the references ----------
const lay = document.createElement('canvas'); lay.width = W; lay.height = H; const lg = lay.getContext('2d');
// depth of field: blur everything drawn so far (the background); what is drawn next stays sharp
function dof(px = 10, dim = 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); bg2.clearRect(0, 0, W, H); bg2.drawImage(cv, 0, 0); g.filter = `blur(${px}px)`; g.drawImage(buf, -px * 2, -px * 2, W + px * 4, H + px * 4); g.filter = 'none'; if (dim) { g.fillStyle = `rgba(0,0,0,${dim})`; g.fillRect(0, 0, W, H); } g.restore(); }
// a blurred foreground (a shoulder in an over-the-shoulder shot), drawn with the current camera
function fgBlur(px, fn) {
  const m = g.getTransform(); g.save(); g.setTransform(1, 0, 0, 1, 0, 0); lg.clearRect(0, 0, W, H); lg.drawImage(cv, 0, 0); g.clearRect(0, 0, W, H);
  g.setTransform(m); fn(); g.setTransform(1, 0, 0, 1, 0, 0);
  bg2.clearRect(0, 0, W, H); bg2.drawImage(cv, 0, 0); g.clearRect(0, 0, W, H); g.drawImage(lay, 0, 0); g.filter = `blur(${px}px)`; g.drawImage(buf, 0, 0); g.filter = 'none'; g.restore();
}
// colour and light: a soft vignette and a tone over the whole frame
const TONES = { day: 'rgba(255,236,200,.06)', night: 'rgba(30,50,90,.16)', dark: 'rgba(10,16,30,.22)', warm: 'rgba(255,190,120,.08)', tv: 'rgba(60,110,160,.14)' };
function grade(tone = 'day', v = .42) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  if (TONES[tone]) { g.fillStyle = TONES[tone]; g.fillRect(0, 0, W, H); }
  const vg = g.createRadialGradient(W / 2, H * .46, H * .3, W / 2, H / 2, H * 1.02); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${v})`); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  g.restore();
}
// an info card on lined paper with a red margin, a chip and a heading (slides in, holds, slides out)
function card(lt, a, b, o) {
  const k = ease(seg(lt, a, a + .45)) * (1 - ease(seg(lt, b - .45, b))); if (k <= 0) return;
  const x = o.x ?? 1240, y = (o.y ?? 110) + (1 - k) * 24, w = o.w ?? 600;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k; g.font = `600 ${o.size || 46}px ${TH}`;
  const words = (o.th || '').split('\n'), h = 96 + words.length * (o.size || 46) * 1.25 + (o.en ? 40 : 0);
  g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 24; g.shadowOffsetY = 8; g.fillStyle = '#f6f0e2'; g.beginPath(); g.roundRect(x, y, w, h, 6); g.fill(); g.shadowColor = 'transparent';
  g.strokeStyle = 'rgba(120,150,200,.25)'; g.lineWidth = 1.5; for (let ly = y + 40; ly < y + h - 8; ly += 30) { g.beginPath(); g.moveTo(x + 14, ly); g.lineTo(x + w - 10, ly); g.stroke(); }
  g.fillStyle = '#d8323a'; g.fillRect(x, y, 9, h);
  g.font = `600 22px ${TH}`; const cw = g.measureText(o.chip).width + 62; g.fillStyle = '#1e1e24'; g.beginPath(); g.roundRect(x + 34, y + 20, cw, 38, 19); g.fill();
  g.fillStyle = '#e8322c'; g.beginPath(); g.arc(x + 54, y + 39, 6, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillText(o.chip, x + 70, y + 47);
  g.font = `600 ${o.size || 46}px ${TH}`; g.fillStyle = '#1f3c8a'; words.forEach((s, i) => g.fillText(s, x + 34, y + 110 + i * (o.size || 46) * 1.25));
  if (o.en) { g.font = `600 17px ${TH}`; g.fillStyle = '#4a4a52'; g.fillText(o.en.toUpperCase(), x + 34, y + h - 34); g.fillStyle = '#d8323a'; g.fillRect(x + 34, y + h - 20, 72, 4); }
  g.restore();
}
// atmosphere layers (screen space): dust in light, window beams, low haze, a lamp glow, a fluorescent flicker, rain on glass
function atmo(kind, t, o = {}) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  if (kind === 'beams') { g.globalCompositeOperation = 'screen'; for (const [x0, w] of o.beams || [[1300, 170], [1520, 110], [1660, 70]]) { const gr = g.createLinearGradient(x0, 0, x0 - 520, H); gr.addColorStop(0, `rgba(255,240,205,${o.a ?? .2})`); gr.addColorStop(1, 'rgba(255,240,205,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0 + w, 0); g.lineTo(x0 + w - 620, H); g.lineTo(x0 - 620, H); g.closePath(); g.fill(); } }
  if (kind === 'dust') { for (let i = 0; i < (o.n || 70); i++) { const x = (hash(i) * W + Math.sin(t * .3 + i) * 30 + t * 6 * (hash(i + 9) - .3)) % W, y = (hash(i + 3) * H + Math.sin(t * .2 + i * 2) * 24 - t * 4 * hash(i + 5) + H) % H; g.fillStyle = `rgba(255,246,220,${(o.a ?? .5) * (.3 + .7 * Math.abs(Math.sin(t * .8 + i)))})`; g.beginPath(); g.arc(x, y, 1.2 + hash(i + 7) * 2.4, 0, 7); g.fill(); } }
  if (kind === 'haze') { const gr = g.createLinearGradient(0, H * (o.top ?? .45), 0, H); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, o.col || 'rgba(180,190,200,.25)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  if (kind === 'glow') { g.globalCompositeOperation = 'screen'; const r = o.r || 420, gr = g.createRadialGradient(o.x, o.y, 0, o.x, o.y, r); gr.addColorStop(0, o.col || 'rgba(255,200,130,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(o.x - r, o.y - r, r * 2, r * 2); }
  if (kind === 'flicker') { const f = Math.floor(t * 12), off = hash(f) > .9 || (hash(f * 3) > .97); if (off) { g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, W, H); } }
  if (kind === 'rain') { g.strokeStyle = `rgba(200,215,230,${o.a ?? .25})`; g.lineWidth = 1.6; for (let i = 0; i < (o.n || 260); i++) { const x = (hash(i) * W * 1.2 + t * 260) % (W * 1.2) - 100, y = (hash(i + 4) * H + t * 1400 * (.7 + .3 * hash(i + 1))) % H; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 10, y + 34); g.stroke(); } }
  g.restore();
}
// a small badge (top left): time and place
function badge(lt, a, b, txt) {
  const k = ease(seg(lt, a, a + .4)) * (1 - ease(seg(lt, b - .4, b))); if (k <= 0) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k; g.font = `600 30px ${TH}`; const w = g.measureText(txt).width + 76;
  g.fillStyle = 'rgba(14,14,18,.78)'; g.beginPath(); g.roundRect(70, 64, w, 56, 28); g.fill(); g.fillStyle = '#e8322c'; g.beginPath(); g.arc(102, 92, 8, 0, 7); g.fill(); g.fillStyle = '#f2f2ec'; g.fillText(txt, 124, 103); g.restore();
}
const darkTorch = (bx, by, r = 480, a = .96) => { const m = g.createRadialGradient(bx, by, 50, bx, by, r); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = m; g.fillRect(-W, -H, W * 3, H * 3); };
function frozenTV(drawFrame, t) {   // Beer's TV showing a paused frame, with "PAUSE"
  g.save(); g.beginPath(); g.roundRect(190, 455, 330, 230, 26); g.clip(); g.translate(190, 455); g.scale(330 / W, 230 / H); drawFrame(); g.restore();
}

// ---------- the episode (ep1.js, ep2.js …; pick with ?ep=N) ----------
const Q = new URLSearchParams(location.search), EP = Q.get('ep') || '1';
const BG = await import('./bg.js');
const { extra } = await import('./chars2.js');
const SHOTS = await import('./shots.js');
const SCENES = (await import(`./ep${EP}.js`)).default({ g, W, H, TH, person, extra, dof, fgBlur, grade, card, badge, atmo, ...SHOTS, P, K, camK, mover, cam, pov, walk, black, vhs, darkTorch, frozenTV, seg, ease, lerp, hash, clamp, ...BG });

// ---------- timeline ----------
let acc = 0; for (const s of SCENES) { s.t0 = acc; acc += s.d; }
const DUR = acc;
SCENES.forEach(s => (s.lines || []).forEach(l => TEXT[l[0]] = l[3]));
LINES = SCENES.flatMap(s => (s.lines || []).map(([id, who, at, th, en]) => ({ id, who, t: s.t0 + at, th, en, end: s.t0 + at + dur(id) + .7 })));
function render(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  let s = SCENES[0]; for (const x of SCENES) if (t >= x.t0) s = x;
  s.draw(t - s.t0, t);
  if (s.look !== false) { const L = s.look || {}; (L.atmo || []).forEach(([k, o]) => atmo(k, t, o || {})); if (!s.tape) grade(L.tone || 'night', L.v ?? .45); }
  if (s.tape) { vhs(t, { time: s.osd, date: s.date, tear: t - s.t0 > s.d - 4.6 && s.ev?.some(e => e[1] === 'tear') }); black(1 - seg(t - s.t0, 0, .3)); }
  subs(t);
}
const EV = [];
LINES.forEach(l => EV.push({ t: l.t, type: 'line', id: l.id, who: l.who }));
SCENES.forEach(s => { (s.ev || []).forEach(([at, type]) => EV.push({ t: s.t0 + at, type })); if (s.tape) EV.push({ t: s.t0, type: 'tapeScene', d: s.d }); });
EV.sort((a, b) => a.t - b.t);
window.LINES_EXPORT = LINES.map(l => ({ id: l.id, who: l.who, th: l.th }));
const PV = Q.get('preview') ? (await import('./preview.js')).preview : null;
window.DUR = DUR; window.EV = EV; window.render = PV ? t => PV(g, +Q.get('preview'), 3 + t) : Q.has('sheet') ? () => sheet(g) : render;
window.render(0); window.READY = true;
