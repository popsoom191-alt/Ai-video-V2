// FILE 03 · ตอนที่ ๑ "ไฟล์ 03": the whole episode. window.render(t) draws frame t; window.EV feeds the sound mix.
import { person } from './chars.js';
import { shop, exterior, lobby, corridor, lift, paper, vcr } from './bg.js';
import { sheet } from './sheet.js';
for (const w of [400, 600, 700]) await document.fonts.load(`${w} 40px 'IBM Plex Sans Thai'`);
const cv = document.getElementById('c'), g = cv.getContext('2d'), W = 1920, H = 1080, TH = "'IBM Plex Sans Thai'";
const buf = document.createElement('canvas'); buf.width = W; buf.height = H; const bg2 = buf.getContext('2d');
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), seg = (t, a, b) => clamp((t - a) / (b - a)), ease = x => x * x * (3 - 2 * x), lerp = (a, b, u) => a + (b - a) * u;
const hash = n => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };

// ---------- lines: id, who, start, text (Thai subtitles); the voice files carry the same ids ----------
export const LINES = [
  ['n1', 'nid', 8.6, 'เทปห้าม้วนจากตึกวิชัยแล็บค่ะ|ม้วนที่หนึ่งหายไปพร้อม ดร.วิชัย'],
  ['b1', 'beer', 15.4, 'กล่องเปียกน้ำ แต่ม้วนที่สามแห้งสนิท|มีคนเพิ่งหยิบมันออกไป แล้วใส่คืน'],
  ['n2', 'nid', 22.8, 'ฉันตามข่าวตึกนี้มายี่สิบปี|ไม่มีใครกล้าดูม้วนนี้จนจบ'],
  ['b2', 'beer', 28.0, 'งั้นผมจะดูคืนนี้ คนเดียว'],
  ['b3', 'beer', 36.6, 'ไฟล์ศูนย์สาม พฤศจิกายน เก้าเจ็ด'],
  ['t1', 'ton', 44.0, 'ม้วนที่สาม ตึกวิชัยแล็บ ตีสอง'],
  ['m1', 'mind', 48.6, 'ต้น อย่าปิดกล้องนะ|ไม่ว่าจะเกิดอะไรขึ้น'],
  ['c1', 'chai', 55.4, 'ชั้นสี่ปิดไว้ ห้ามขึ้นไป'],
  ['m2', 'mind', 59.2, 'ทำไมคะลุง'],
  ['c2', 'chai', 61.6, 'เพราะลุงรู้ ว่ามันปิดไว้ทำไม'],
  ['m3', 'mind', 67.6, 'ป้าคะ ตึกนี้ปิดไปแล้วไม่ใช่เหรอ'],
  ['d1', 'daeng', 71.6, 'ป้าถูทุกคืนจ้ะ|อย่าเหยียบตรงที่เปียกนะลูก'],
  ['m4', 'mind', 79.0, 'รายชื่อผู้ทดลอง… มีชื่อเด็กด้วย'],
  ['f1', 'fon', 88.2, 'พี่คะ ลิฟต์ไม่ยอมลง'],
  ['m5', 'mind', 101.0, 'ต้น… ถอยหลังช้า ๆ'],
  ['t2', 'ton', 105.2, 'ไม่ปิด กล้องยังถ่ายอยู่'],
  ['b4', 'beer', 121.0, 'เดี๋ยวนะ ในประตูลิฟต์ มีเงาสะท้อน'],
  ['b5', 'beer', 128.4, 'เสื้อสีเขียว… นั่นผม'],
  ['b6', 'beer', 135.4, 'อย่าหัน ดูจากจอ'],
  ['b7', 'beer', 145.6, 'ม้วนที่หนึ่ง…'],
];
const fetchJ = async p => { try { const r = await fetch(p); return r.ok ? await r.json() : {}; } catch { return {}; } };
const DURS = await fetchJ('voices/dur.json');
const dur = id => DURS[id] || 2.2;
const L = LINES.map(([id, who, t, text]) => ({ id, who, t, text, end: t + dur(id) + .6 }));
const speaking = (who, t) => L.some(l => l.who === who && t >= l.t && t < l.t + dur(l.id));
const talk = (who, t) => speaking(who, t) ? .35 + .65 * Math.abs(Math.sin(t * 17 + who.length)) : 0;
const blink = (t, s) => (t * .31 + s) % 1 < .035;
const P = (who, t, extra = {}) => ({ talk: talk(who, t), blink: blink(t, who.length * .17), t, ...extra });
const DUR = 158;

// ---------- effects ----------
function vhs(t, osd) {
  // horizontal tearing strips + noise + scanlines + a cold tint + the camcorder OSD
  bg2.drawImage(cv, 0, 0);
  const f = Math.floor(t * 30);
  for (let k = 0; k < 6; k++) { const y = Math.floor(hash(f * 7 + k) * H), h = 4 + hash(f + k) * 20, dx = (hash(f * 3 + k) - .5) * (osd.tear ? 120 : 14); g.drawImage(buf, 0, y, W, h, dx, y, W, h); }
  g.globalCompositeOperation = 'screen'; g.globalAlpha = .18; g.drawImage(buf, 6, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  g.fillStyle = 'rgba(40,60,90,.16)'; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 2);
  for (let i = 0; i < (osd.tear ? 900 : 260); i++) { g.fillStyle = `rgba(255,255,255,${hash(f * 13 + i) * .35})`; g.fillRect(hash(f + i * 1.7) * W, hash(f * 2 + i) * H, 2 + hash(i) * 6, 1.5); }
  const yb = H - 40 - ((f % 40) * 3); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, yb, W, 18);
  const vg = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .9); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  g.font = '700 44px monospace'; g.fillStyle = '#f2f2ec'; g.shadowColor = '#000'; g.shadowBlur = 0; g.shadowOffsetX = 3; g.shadowOffsetY = 3;
  g.fillText('▶ PLAY', 80, 100); if (Math.floor(t * 2) % 2) { g.fillStyle = '#e8322c'; g.beginPath(); g.arc(1700, 86, 14, 0, 7); g.fill(); g.fillStyle = '#f2f2ec'; } g.fillText('REC', 1724, 100);
  g.fillText(osd.date || 'NOV.20.1997', 1340, 1000); g.fillText(osd.time || 'AM 2:00', 80, 1000);
  g.shadowOffsetX = g.shadowOffsetY = 0;
}
function subs(t) {
  const l = L.find(l => t >= l.t && t < l.end); if (!l) return;
  const rows = l.text.split('|'); g.font = `600 46px ${TH}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  rows.forEach((r, i) => { const y = H - 140 + (i - rows.length + 1) * 62, w = g.measureText(r).width + 44; g.fillStyle = 'rgba(0,0,0,.72)'; g.fillRect(W / 2 - w / 2, y - 30, w, 60); g.fillStyle = l.who === 'beer' ? '#9ff0c4' : '#ffffff'; g.fillText(r, W / 2, y + 2); });
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
}
const black = k => { if (k > 0) { g.fillStyle = `rgba(0,0,0,${clamp(k)})`; g.fillRect(0, 0, W, H); } };
function cam(x, y, z, fn) { g.save(); g.translate(W / 2, H / 2); g.scale(z, z); g.translate(-x, -y); fn(); g.restore(); }
const walk = (t, a, b, x0, x1) => ({ x: lerp(x0, x1, ease(seg(t, a, b))), walk: t > a && t < b ? (t - a) * 7 : null });

// ---------- the episode ----------
function render(t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  if (t < 6) {   // A · title
    g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H);
    const n = Math.floor(seg(t, .8, 2.4) * 7); g.font = '700 150px monospace'; g.fillStyle = '#f2f2ec'; g.textAlign = 'center'; g.fillText('FILE 03'.slice(0, n), W / 2, 520);
    g.font = `600 48px ${TH}`; g.fillStyle = `rgba(232,70,60,${seg(t, 2.8, 3.6)})`; g.fillText('ตอนที่ ๑ · ไฟล์ 03', W / 2, 620); g.textAlign = 'left';
    black(seg(t, 5.2, 6));
  } else if (t < 34) {   // B · the shop, by day: Nid brings the box
    const lt = t - 6, z = t > 15.2 && t < 22.6 ? 1.5 : 1.02 + lt * .002, cx = t > 15.2 && t < 22.6 ? 700 : 960, cy = t > 15.2 && t < 22.6 ? 600 : 540;
    cam(cx, cy, z, () => {
      shop(g, t, false, { clock: 14.2 });
      g.fillStyle = '#7a5a3a'; g.fillRect(860, 640, 180, 70); g.fillStyle = '#6a4a2e'; g.fillRect(860, 640, 180, 14);   // the box on the desk
      for (let k = 0; k < 5; k++) { g.fillStyle = k === 2 ? '#2a2a30' : '#1a1a1e'; g.fillRect(872 + k * 32, t > 15 && k === 2 ? 600 : 620, 26, 40); }
      person(g, 'beer', 620, 980, 560, P('beer', t, { look: .6, hands: t > 15 && t < 20 ? { R: [70, -250] } : undefined }));
      const w = walk(t, 6.4, 8.4, 2100, 1300); person(g, 'nid', w.x, 990, 560, P('nid', t, { walk: w.walk, look: -.6 }));
    });
    black(1 - seg(t, 6, 6.6)); black(seg(t, 33.2, 34));
  } else if (t < 42) {   // C · night: the tape goes in
    if (t < 37) { shop(g, t, true, { clock: 23.97 }); person(g, 'beer', 620, 980, 560, P('beer', t, { look: -.5 })); }
    else vcr(g, t, ease(seg(t, 37.2, 39.6)));
    subs(t); black(1 - seg(t, 34, 34.6)); black(seg(t, 41.3, 42)); return;
  } else if (t < 118) {   // D · the tape, 1997
    tape(t);
    vhs(t, { date: 'NOV.20.1997', time: t < 66 ? 'AM 2:04' : t < 96 ? 'AM 2:31' : 'AM 2:59', tear: t > 113.6 });
    if (t > 115.5) { g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(255,255,255,${hash(Math.floor(t * 30) * 11 + i) * .6})`; g.fillRect(hash(i + Math.floor(t * 30)) * W, hash(i * 3 + Math.floor(t * 30)) * H, 3, 2); } }
  } else if (t < 150) {   // E · Beer, the frozen frame, the reflection
    beerNight(t);
  } else {   // F · end card
    g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); g.textAlign = 'center';
    g.font = '700 110px monospace'; g.fillStyle = '#f2f2ec'; g.fillText('FILE 03', W / 2, 470);
    g.font = `600 52px ${TH}`; g.fillStyle = '#e8463c'; g.fillText('ตอนที่ ๑ จบ', W / 2, 580);
    g.font = `400 40px ${TH}`; g.fillStyle = `rgba(220,220,220,${seg(t, 152, 153)})`; g.fillText('ตอนหน้า · ม้วนที่ ๑', W / 2, 680); g.textAlign = 'left';
    black(1 - seg(t, 150, 150.8)); black(seg(t, 157, 158));
  }
  subs(t);
}

function tape(t) {
  if (t < 54) {   // D1 · outside the building
    cam(960, 540, 1 + (t - 42) * .006, () => {
      exterior(g, t);
      const w = walk(t, 42, 52, 200, 820); person(g, 'mind', w.x, 1000, 380, P('mind', t, { walk: w.walk, beam: false, hands: { R: [80, -190] } }));
      person(g, 'ton', w.x + 170, 1004, 380, P('ton', t, { walk: w.walk }));
    });
  } else if (t < 66) {   // D2 · the lobby: the guard
    const z = t > 61.4 ? 1.35 : 1, cx = t > 61.4 ? 420 : 960;
    cam(cx, t > 61.4 ? 560 : 540, z, () => {
      lobby(g, t, { floor: '1' });
      person(g, 'chai', 380, 900, 520, P('chai', t, { look: .7 }));
      person(g, 'mind', 1250, 1000, 520, P('mind', t, { look: -.7, beam: false, hands: { R: [80, -190] } }));
      person(g, 'ton', 1500, 1004, 520, P('ton', t, { look: -.7 }));
    });
  } else if (t < 78) {   // D3 · the 4th floor: the cleaner, at 2:31 AM
    cam(960, 540, 1 + (t - 66) * .008, () => {
      corridor(g, t, .8, { wet: true });
      const mop = Math.sin(t * 4) * 18;
      person(g, 'daeng', 1080 + mop * .3, 860, 360, P('daeng', t, { expr: 'smile', look: -.6, hands: { L: [-80 + mop, -210] } }));
      person(g, 'mind', 520, 1010, 560, P('mind', t, { look: .7, expr: t > 75 ? 'worried' : 'neutral' }));
      person(g, 'ton', 260, 1030, 600, P('ton', t, { look: .7 }));
      if (t > 75) { g.save(); g.translate(760, 1000); g.rotate(-.2); g.fillStyle = '#efe8d4'; g.fillRect(-50, -34, 100, 68); g.restore(); }   // the paper on the wet floor
    });
  } else if (t < 84) { paper(g, t); }
  else if (t < 96) {   // D4 · the lift: Fon
    const open = ease(seg(t, 85, 86.6)), Lv = t > 93.4 ? 0.05 : t > 91.6 ? (hash(Math.floor(t * 16)) > .45 ? 1 : .15) : 1;
    lift(g, t, open, Lv);
    if (open > .2) { g.save(); g.beginPath(); g.rect(560, 160, 800, 760); g.clip(); person(g, 'fon', 960, 900, 420 * (1 + (t - 86) * .01), P('fon', t, { expr: 'worried' })); g.restore(); }
    if (Lv < .5) { g.fillStyle = `rgba(0,0,0,${1 - Lv})`; g.fillRect(0, 0, W, H); }
  } else {   // D5 · darkness: a torch beam, the thing at the end of the corridor
    const near = ease(seg(t, 107, 114));
    corridor(g, t, .35);
    person(g, 'thing', 960, lerp(640, 900, near), lerp(260, 900, near), { t });
    // only what the torch lights is visible
    const bx = 960 + Math.sin(t * 1.7) * 90, by = 560 + Math.cos(t * 1.3) * 40;
    const m = g.createRadialGradient(bx, by, 60, bx, by, 520); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(1, 'rgba(0,0,0,.96)'); g.fillStyle = m; g.fillRect(0, 0, W, H);
    person(g, 'mind', 330, 1150, 640, P('mind', t, { look: .5, expr: 'scared', beam: false, hands: { R: [90, -280] } }));
  }
}

function beerNight(t) {
  const flick = t > 131.6 && t < 141 ? (hash(Math.floor(t * 14)) > .55 ? 1 : .25) : 1;
  if (t < 124.5) {   // the frozen frame on the TV
    shop(g, t, true, { screen: '#3a4440', vcrOn: true });
    g.save(); g.beginPath(); g.roundRect(190, 455, 330, 230, 26); g.clip(); g.translate(190, 455); g.scale(330 / W, 230 / H); lift(g, 90, 1, 1); person(g, 'fon', 960, 900, 430, { t: 0, expr: 'worried' }); g.restore();
    person(g, 'beer', 760, 990, 580, P('beer', t, { look: -.8, expr: 'neutral' }));
  } else if (t < 131) {   // zoom into the lift door: a green hoodie in the reflection
    const z = ease(seg(t, 124.5, 127.5));
    cam(lerp(960, 1180, z), lerp(540, 520, z), lerp(1, 2.4, z), () => {
      lift(g, 90, 1, 1); person(g, 'fon', 960, 900, 430, { t: 0, expr: 'worried' });
      g.save(); g.globalAlpha = .45 * seg(t, 126, 128); g.beginPath(); g.rect(1340, 160, 20, 760); g.rect(960 + 400, 160, 0, 0); g.restore();
      g.save(); g.beginPath(); g.rect(1180, 300, 180, 500); g.clip(); g.globalAlpha = .35 * seg(t, 126.5, 128.5); person(g, 'beer', 1270, 760, 380, { t, look: -.5 }); g.restore();
    });
    g.strokeStyle = '#e8463c'; g.lineWidth = 6; if (t > 128) g.strokeRect(700, 230, 520, 620);
    vhs(t, { date: 'NOV.20.1997', time: 'AM 2:31' });
  } else {   // the shop flickers; wet footprints; he watches the dark TV, not behind him
    shop(g, t, true, { screen: t > 136.5 && t < 141.2 ? '#101418' : '#1a2a3a', footprints: Math.floor(seg(t, 132, 138) * 7), lamp: flick });
    if (t > 136.5 && t < 141.2) {   // the reflection in the dark CRT: the thing stands behind him
      g.save(); g.beginPath(); g.roundRect(190, 455, 330, 230, 26); g.clip(); g.globalAlpha = .7; person(g, 'beer', 330, 760, 260, { t }); person(g, 'thing', 430, 760, 330, { t }); g.restore();
    }
    const hands = t > 140.6 && t < 141.6 ? { R: [-120, -220] } : undefined;
    person(g, 'beer', 760, 990, 580, P('beer', t, { look: -.8, expr: t > 132 && t < 142 ? 'worried' : 'neutral', hands }));
    if (t > 143.6) { g.fillStyle = '#1a1a1e'; g.fillRect(980, 650, 90, 52); g.fillStyle = '#f2ecd8'; g.fillRect(990, 660, 70, 18); g.fillStyle = '#c8322c'; g.font = '700 16px monospace'; g.fillText('01', 1012, 675); }   // tape 01 on the desk
    if (flick < .5) { g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, 0, W, H); }
  }
  black(1 - seg(t, 118, 118.5)); black(seg(t, 149.2, 150));
}

// ---------- events for the sound mix ----------
const EV = [];
L.forEach(l => EV.push({ t: l.t, type: 'line', id: l.id, who: l.who }));
[[1.0, 'type'], [6.4, 'door'], [37.2, 'insert'], [39.6, 'vcr'], [42, 'tapein'], [84.5, 'ding'], [85, 'liftdoor'], [91.6, 'flicker'], [93.4, 'blackout'], [96.4, 'torch'],
 [100, 'drone'], [113.6, 'tear'], [118, 'tapeout'], [124.5, 'zoom'], [128.4, 'sting'], [131.6, 'flicker2'], [132, 'mop'], [136.5, 'sting2'], [140.8, 'stop'], [143.6, 'thud'], [150, 'end']].forEach(([t, type]) => EV.push({ t, type }));
for (let t = 42.4; t < 52; t += .5) EV.push({ t, type: 'step', v: .6 });
for (let t = 6.5; t < 8.4; t += .45) EV.push({ t, type: 'step', v: .8 });
EV.sort((a, b) => a.t - b.t);
const Q = new URLSearchParams(location.search);
window.DUR = DUR; window.EV = EV; window.render = Q.has('sheet') ? () => sheet(g) : render;
window.render(0); window.READY = true;
