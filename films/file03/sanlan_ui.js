// "แสนล้าน" · shared cards and inserts (the reference clips' language): chapter card, knowledge card, a page of Pan's
// rule notebook, a grief-stage card, a phone in hands with a chat, a magazine cover, the life graph, thai digits.
export const thai = n => String(n).replace(/\d/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]);
export const baht = n => '฿ ' + thai(Math.round(n).toLocaleString('en-US'));
export default (api) => {
  const { g, W, H, TH, black, seg, ease, handsPhone, cam, dof, hash } = api;
  const fade = (lt, d, a = .7, b = .8) => { black(1 - seg(lt, 0, a)); black(seg(lt, d - b, d)); };
  const chapterCard = (lt, d, n, title, sub) => {
    g.fillStyle = '#141820'; g.fillRect(0, 0, W, H);
    const k = ease(seg(lt, .3, 1.1)); g.save(); g.globalAlpha = k;
    g.font = `500 28px ${TH}`; g.fillStyle = '#c8a050'; g.fillText(`— บทที่ ${n}`, 240, 440);
    g.font = `700 86px ${TH}`; g.fillStyle = '#f2f2ec'; g.fillText(title, 240, 540);
    g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(240, 580, 520 * ease(seg(lt, .6, 1.6)), 2);
    g.font = `600 32px ${TH}`; g.fillStyle = '#a8aab0'; g.fillText(sub, 240, 636); g.restore(); fade(lt, d);
  };
  const box = (lt, a, b) => ease(seg(lt, a, a + .5)) * (1 - ease(seg(lt, b - .5, b)));
  const knowledge = (lt, a, b, big, unit, rows, src, pos = 'r') => {
    const k = box(lt, a, b); if (k <= 0) return;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k; const w = 660, x = pos === 'l' ? 70 : W - w - 80, y = 150 + (1 - k) * 20, h = 140 + rows.length * 56;
    g.fillStyle = 'rgba(22,22,26,.88)'; g.beginPath(); g.roundRect(x, y, w, h, 14); g.fill();
    g.font = `500 22px ${TH}`; g.fillStyle = '#a8a8ae'; g.fillText('รู้หรือไม่', x + 34, y + 44);
    g.font = `700 70px ${TH}`; g.fillStyle = '#f2a24e'; g.fillText(big, x + 34, y + 116); const bw = g.measureText(big).width; g.font = `600 28px ${TH}`; g.fillStyle = '#f2f2ec'; g.fillText(unit, x + 48 + bw, y + 114);
    g.font = `500 27px ${TH}`; g.fillStyle = '#e2e2e2'; rows.forEach((r, i) => g.fillText('· ' + r, x + 34, y + 172 + i * 48));
    if (src) { g.font = `500 17px ${TH}`; g.fillStyle = '#7a7a82'; g.fillText(src, x + 34, y + h - 16); }
    g.restore();
  };
  const rulePage = (lt, a, b, n, rule) => {
    const k = box(lt, a, b); if (k <= 0) return;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k; g.translate(1240, 170 + (1 - k) * 24); g.rotate(-.03);
    g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 24; g.shadowOffsetY = 8; g.fillStyle = '#f4eedc'; g.fillRect(0, 0, 600, 300); g.shadowColor = 'transparent';
    g.strokeStyle = 'rgba(110,140,200,.35)'; g.lineWidth = 2; for (let y = 70; y < 300; y += 44) { g.beginPath(); g.moveTo(20, y); g.lineTo(580, y); g.stroke(); } g.fillStyle = '#d8323a'; g.fillRect(56, 0, 3, 300);
    g.font = `600 22px ${TH}`; g.fillStyle = '#6a6a72'; g.fillText('สมุดกฎของปั้น', 76, 46);
    g.font = `700 30px ${TH}`; g.fillStyle = '#1e2a6a'; g.fillText(`ข้อ ${thai(n)}`, 76, 108);
    const chars = [...rule], txt = chars.slice(0, Math.floor(chars.length * seg(lt, a + .6, a + 2.4))).join('');
    g.font = `600 ${chars.length > 22 ? 32 : 40}px ${TH}`; g.fillText(txt, 76, 168);
    if (lt > a + 2.6) { g.strokeStyle = '#d8323a'; g.lineWidth = 4; g.beginPath(); g.moveTo(76, 186); g.lineTo(76 + Math.min(1, seg(lt, a + 2.6, a + 3.2)) * 440, 186); g.stroke(); }
    g.restore();
  };
  const stageCard = (lt, a, b, i, name) => {   // the five stages of grief, one quiet card each
    const k = box(lt, a, b); if (k <= 0) return;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k * .92; g.font = `500 22px ${TH}`; g.fillStyle = '#9aa4b0'; g.fillText(`ระยะที่ ${thai(i)} จาก ๕`, 90, 900);
    g.font = `700 52px ${TH}`; g.fillStyle = '#e8ecf0'; g.fillText(name, 90, 962); g.fillStyle = 'rgba(232,236,240,.4)'; g.fillRect(90, 984, 60 * i, 4); g.restore();
  };
  // a phone held up (big hands), the room soft behind; L: { title, rows:[{text, me}], call, ended, voice }
  const wrap = (txt, w) => { const out = []; let line = ''; for (const ch of [...txt]) { if (g.measureText(line + ch).width > w && line) { out.push(line); line = ''; } line += ch; } if (line) out.push(line); return out; };
  const chat = L => () => {
    const gr = g.createLinearGradient(0, 0, 0, 1920); gr.addColorStop(0, '#f4f4f8'); gr.addColorStop(1, '#e4e6ee'); g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
    g.fillStyle = '#fff'; g.fillRect(0, 0, 1080, 300); g.fillStyle = L.avatar || '#c8443a'; g.beginPath(); g.arc(150, 200, 60, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `700 60px ${TH}`; g.textAlign = 'center'; g.fillText([...L.title][0], 150, 222); g.textAlign = 'left';
    g.fillStyle = '#2a2a30'; g.font = `700 66px ${TH}`; g.fillText(L.title, 240, 226);
    if (L.call) { g.textAlign = 'center'; g.font = `600 62px ${TH}`; g.fillStyle = '#5a5a66'; g.fillText(L.call, 540, 900); g.fillStyle = L.ended ? '#c8443a' : '#3a8a68'; g.beginPath(); g.arc(540, 1500, 90, 0, 7); g.fill(); g.textAlign = 'left'; return; }
    let y = 380; g.font = `600 54px ${TH}`;
    for (const r of L.rows) { if (r.voice) { const x = 60, w = 760; g.fillStyle = '#fff'; g.beginPath(); g.roundRect(x, y, w, 150, 44); g.fill(); g.fillStyle = '#3a8a68'; g.beginPath(); g.arc(x + 80, y + 75, 40, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x + 68, y + 52); g.lineTo(x + 100, y + 75); g.lineTo(x + 68, y + 98); g.fill(); g.fillStyle = '#8a8a96'; for (let i = 0; i < 26; i++) { const hh = 14 + 50 * Math.abs(Math.sin(i * 1.7)); g.fillRect(x + 150 + i * 22, y + 75 - hh / 2, 10, hh); } y += 190; continue; }
      const ls = wrap(r.text, 820), h = ls.length * 74 + 50, w = Math.max(...ls.map(l => g.measureText(l).width)) + 70, x = r.me ? 1080 - 60 - w : 60;
      g.fillStyle = r.me ? (r.deleted ? '#9aa0a8' : '#3a8a68') : '#fff'; g.beginPath(); g.roundRect(x, y, w, h, 44); g.fill(); g.fillStyle = r.me ? '#fff' : '#2a2a30'; ls.forEach((l, i) => g.fillText(l, x + 35, y + 76 + i * 74)); y += h + 36; }
  };
  const phone = (bgDraw, t, L, tap = 0, dim = .25) => { cam(960, 540, 1.3, bgDraw); dof(20, dim); handsPhone(g, t, chat(L), { tap, skin: '#c48a60' }); };
  const magazine = (lt, a, b) => {   // the magazine cover at the peak
    const k = box(lt, a, b); if (k <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k; g.translate(1300, 120); g.rotate(.04);
    g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 30; g.fillStyle = '#e8e2d4'; g.fillRect(0, 0, 460, 620); g.shadowColor = 'transparent';
    g.fillStyle = '#c8322c'; g.font = `800 74px ${TH}`; g.fillText('BIZ', 30, 90); g.fillStyle = '#1e2430'; g.font = `700 30px ${TH}`; g.fillText('ดาวรุ่งธุรกิจ ๒๕๖๔', 30, 140);
    g.fillStyle = '#c8b090'; g.fillRect(60, 170, 340, 330); g.fillStyle = '#c48a60'; g.beginPath(); g.arc(230, 290, 70, 0, 7); g.fill(); g.fillStyle = '#141012'; g.beginPath(); g.arc(230, 260, 72, Math.PI, 0); g.fill(); g.fillStyle = '#22304a'; g.fillRect(140, 370, 180, 130);
    g.fillStyle = '#1e2430'; g.font = `700 34px ${TH}`; g.fillText('ปั้น & นุ่น', 30, 560); g.font = `500 22px ${TH}`; g.fillText('จากเด็กล้างจาน สู่ร้อยล้าน', 30, 596); g.restore();
  };
  const lifeGraph = (lt, a) => {   // ages 8 → 38: the ups and downs, the lowest point glowing
    g.fillStyle = '#12151c'; g.fillRect(0, 0, W, H);
    const pts = [[8, .05], [15, .2], [15.6, .02], [22, .04], [25, .62], [26, .0], [27, .03], [30, .78], [38, 1]];
    const X = a2 => 200 + (a2 - 8) / 30 * 1520, Y = v => 860 - v * 620, k = seg(lt, a, a + 6);
    g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 2; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(200, Y(i / 4)); g.lineTo(1720, Y(i / 4)); g.stroke(); }
    g.font = `500 24px ${TH}`; g.fillStyle = '#8a8e98'; for (const ag of [8, 15, 22, 26, 30, 38]) g.fillText(thai(ag), X(ag) - 10, 910);
    g.strokeStyle = '#f2c14e'; g.lineWidth = 6; g.lineJoin = 'round'; g.beginPath(); const n = Math.max(2, Math.ceil(pts.length * k)); pts.slice(0, n).forEach(([ag, v], i) => i ? g.lineTo(X(ag), Y(v)) : g.moveTo(X(ag), Y(v))); g.stroke();
    if (k > .7) { const gl = .5 + .5 * Math.sin(lt * 3); g.fillStyle = `rgba(242,193,78,${.4 + .4 * gl})`; g.beginPath(); g.arc(X(26), Y(0), 18 + 8 * gl, 0, 7); g.fill(); g.font = `600 26px ${TH}`; g.fillStyle = '#f2c14e'; g.fillText('ใต้สะพานลอย', X(26) - 70, Y(0) + 56); }
    g.font = `700 40px ${TH}`; g.fillStyle = '#e8e2d4'; g.fillText('กราฟชีวิตของคุณ', 200, 170);
  };
  return { fade, chapterCard, knowledge, rulePage, stageCard, chat, phone, magazine, lifeGraph };
};
