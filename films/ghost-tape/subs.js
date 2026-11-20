// Closed captions in the style of tape-era TV captions: white on a solid black block per row. Thai has no spaces between
// words, so rows are given by hand with '|'. [PA] = the school intercom; italics = the guard; sounds in brackets.
import { T, COUNT } from './story.js';

export function buildCaps(dur) {
  const end = (id, t0, pad = .7, min = 1.9) => t0 + Math.max(min, (dur[id] || 2) + pad);
  const C = [
    { t0: .75, t1: 1.95, text: '[เสียงไฟนีออนหึ่ง]' },
    { t0: T.w1, t1: end('w1', T.w1), text: '(พูดเบา ๆ) คืนแรก…|เวรดึก อาคารสาม', it: true },
    { t0: T.chime1, t1: T.p1, text: '[เสียงตามสาย]' },
    { t0: T.p1, t1: end('p1', T.p1), text: '[PA] ประกาศถึงเวรยามอาคารสาม|กรุณาตรวจให้ครบทุกห้อง' },
    { t0: T.bell[0], t1: T.count0 - .05, text: '[กริ่งเข้าเรียนดัง]' },
  ];
  // the count: each number joins the row as it is whispered
  COUNT.forEach((_, i) => {
    const t0 = T.count0 + i * T.countStep, t1 = i < COUNT.length - 1 ? t0 + T.countStep : t0 + 1.5;
    const said = COUNT.slice(0, i + 1), rows = [said.slice(0, 5).join(' '), said.slice(5).join(' ')].filter(Boolean);
    C.push({ t0, t1, text: rows.join('|'), it: true });
  });
  C.push({ t0: T.flick[0] - .05, t1: T.flick[2] + .4, text: '[ไฟกะพริบ]' });
  C.push({ t0: T.tear[0], t1: T.tear[0] + 1.25, text: '[เสียงเทปกระตุก]' });
  C.push({ t0: T.w3, t1: end('w3', T.w3), text: 'เมื่อกี้ยังเที่ยงคืนอยู่เลย', it: true });
  C.push({ t0: T.p2, t1: end('p2', T.p2, .8), text: '[PA] ห้อง ม.๓/๒…|ไม่มีแล้ว' });
  C.push({ t0: T.hush[0], t1: T.hush[1] + .1, text: '[เงียบ]' });
  C.push({ t0: T.name, t1: end('name', T.name, 1.2, 2.4), text: '[เสียงกระซิบจากในห้อง]|สมชาย…' });
  C.push({ t0: T.door[0], t1: T.door[1] + .3, text: '[ประตูเปิดเอง]' });
  C.push({ t0: T.batDie[0] + 1.1, t1: T.recOff, text: '[แบตเตอรี่ใกล้หมด]' });
  C.sort((a, b) => a.t0 - b.t0);
  for (let k = 0; k < C.length - 1; k++) C[k].t1 = Math.min(C[k].t1, C[k + 1].t0);
  C.forEach(c => c.rows = c.text.split('|'));
  return C;
}

// drawn on the 1920×1080 overlay, inside the 4:3 frame (x ∈ [240, 1680])
export function drawCaps(x, caps, t) {
  const c = caps.find(c => t >= c.t0 && t < c.t1); if (!c) return;
  const fs = 44, rh = 62, cx = 960, pad = 22;
  x.textBaseline = 'middle';
  const n = c.rows.length, yb = 1080 - 222;
  c.rows.forEach((r, i) => {
    x.font = `${c.it && !r.startsWith('[') ? 'italic ' : ''}600 ${fs}px 'IBM Plex Sans Thai'`;
    const y = yb - (n - 1 - i) * rh, w = x.measureText(r).width + 2 * pad, x0 = Math.round(cx - w / 2);
    x.fillStyle = '#000'; x.fillRect(x0, y - rh / 2, w, rh);
    x.fillStyle = '#f2f2f2'; x.fillText(r, x0 + pad, y + 3);
  });
}
