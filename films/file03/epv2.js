// FILE 03 · ตอนที่ ๑, round 2 (?ep=v2): the no-cut episode (epr.js) with the plot fixes agreed in PLOT_EP1.md.
// Investigation + dread: every clue is followed at once by something uncanny tied to it. Season twist (revealed in ep 5):
// Beer is Dr. Wichai, imagining himself; clues here are small (a one-frame old face, a door locked from outside, the
// radio, a CCTV angle, Beer knowing things he could not know). New lines are subtitles only (no voice yet).
import epr from './epr.js';
import { CAST } from './chars2.js';
import * as B2 from './bg2.js';
export default (api) => {
  const { g, W, H, TH, person, extra, P, K, camK, mover, cam, pov, black, vhs, frozenTV, darkTorch, seg, ease, lerp, hash, dof, handsPhone, handsTape,
    shop, shopDoor, shopFront, gate, lobby, stairsUp, stairPos, lab, labDoor, corridor, lift, paper, oatShop, shopHigh, towel, market2 } = api;
  const { sedan, vehicle, cityRoad, carFront, liftBarrier, chainLock, chainPile, missingPoster, dome, radio, enhance, footprints } = B2;
  const R = epr(api);   // the round-1 scenes (with their light and atmosphere)
  const A = R;          // index map in PLOT_EP1.md: 0 title · 1 shop day · 2 night VCR · 3 gate · 4 lobby · 5 stairs · 6 pause · 7 lab/corridor · 8 pause (wet paper) · 9 ding · 10 walk · 11 lift · 12 the thing · 13 after STOP · 14 message · 15 morning · 16–18 tape 1 · 19 deduce · 20 leave · 21 car · 22 market · 23 Oat · 24 vanished on the 13th · 25 night · 26 end

  // ---------- helpers ----------
  const T = (a, n = 6, step = .5) => Array.from({ length: n }, (_, i) => [a + i * step, 'step']);
  const fadeX = (lt, a, b) => { if (lt > a && lt < b) { g.fillStyle = `rgba(0,0,0,${1 - Math.abs(lt - (a + b) / 2) / ((b - a) / 2)})`; g.fillRect(0, 0, W, H); } };
  const swish = (k) => { if (k <= 0 || k >= 1) return; g.save(); g.globalAlpha = Math.sin(k * Math.PI); for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(30,34,30,${.6 + .4 * hash(i)})`; g.fillRect(0, i * 42, W, 30); } g.restore(); };
  const tapeBox = (x, y, s, label, wet = 0) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#1a1a1e'; g.fillRect(-45, -26, 90, 52); g.fillStyle = '#f2ecd8'; g.fillRect(-35, -16, 70, 18); g.fillStyle = label === '01' ? '#c8322c' : '#2a2a2a'; g.font = '700 16px monospace'; g.fillText(label, -12, -2); if (wet > 0) { g.fillStyle = `rgba(150,190,220,${.55 * wet})`; g.fillRect(-35, -16, 70, 18); } g.restore(); };
  const PAPER = (x, y, s = 1, r = -.2) => { g.save(); g.translate(x, y); g.rotate(r); g.scale(s, s); g.fillStyle = '#efe8d4'; g.fillRect(-60, -40, 120, 80); g.fillStyle = 'rgba(60,50,40,.5)'; for (let k = 0; k < 5; k++) g.fillRect(-46, -26 + k * 12, 80, 3); g.restore(); };
  const bucketMop = (sw = 0) => { g.save(); g.translate(1080, 860); g.scale(.88, .88); g.fillStyle = '#3a6aa8'; g.beginPath(); g.moveTo(46, -54); g.lineTo(86, -54); g.lineTo(80, 0); g.lineTo(52, 0); g.closePath(); g.fill(); g.save(); g.translate(-10, -6); g.rotate(-1.35 + sw); g.strokeStyle = '#b8925a'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -230); g.stroke(); g.restore(); g.fillStyle = '#d8d0c0'; g.beginPath(); g.ellipse(-10, -2, 26, 8, 0, 0, 7); g.fill(); g.restore(); };
  const wrap = (txt, w) => { const out = []; let line = ''; for (const ch of [...txt]) { if (g.measureText(line + ch).width > w && line) { out.push(line); line = ''; } line += ch; } if (line) out.push(line); return out; };
  const chat = (L) => () => {
    const gr = g.createLinearGradient(0, 0, 0, 1920); gr.addColorStop(0, '#f4f4f8'); gr.addColorStop(1, '#e4e6ee'); g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 1080, 300); g.fillStyle = '#c8443a'; g.beginPath(); g.arc(150, 200, 60, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `700 64px ${TH}`; g.textAlign = 'center'; g.fillText('น', 150, 222); g.textAlign = 'left';
    g.fillStyle = '#2a2a30'; g.font = `700 70px ${TH}`; g.fillText(L.title, 240, 226);
    if (L.call) { g.textAlign = 'center'; g.font = `600 64px ${TH}`; g.fillStyle = '#5a5a66'; g.fillText(L.call, 540, 900); g.fillStyle = L.ended ? '#c8443a' : '#3a8a68'; g.beginPath(); g.arc(540, 1500, 90, 0, 7); g.fill(); g.textAlign = 'left'; return; }
    let y = 400; g.font = `600 58px ${TH}`;
    for (const r of L.rows) { const ls = wrap(r.text, 820), h = ls.length * 78 + 50, w = Math.max(...ls.map(l => g.measureText(l).width)) + 70, x = r.me ? 1080 - 60 - w : 60;
      g.fillStyle = r.me ? '#3a8a68' : '#ffffff'; g.beginPath(); g.roundRect(x, y, w, h, 44); g.fill(); g.fillStyle = r.me ? '#fff' : '#2a2a30'; ls.forEach((l, i) => g.fillText(l, x + 35, y + 80 + i * 78)); y += h + 40; }
  };
  const phone = (screen, t, night = true, tap = 0) => { cam(960, 540, 1.3, () => shop(g, t, night, {})); dof(20, night ? .3 : .1); handsPhone(g, t, screen, { tap }); };
  const sepia = () => { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'color'; g.fillStyle = '#a8804a'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'multiply'; g.fillStyle = '#e8d8b8'; g.fillRect(0, 0, W, H); g.restore(); };
  // a door seen from the corridor, with the room behind it
  const doorFromCorridor = (t, open, inside, label) => {
    g.fillStyle = '#56604f'; g.fillRect(0, 0, W, H); g.fillStyle = '#41483c'; g.fillRect(0, 830, W, 250);
    for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(10,14,10,${.12 + .1 * hash(i)})`; g.beginPath(); g.ellipse(hash(i + 3) * W, 150 + hash(i + 4) * 600, 30 + hash(i) * 70, 50 + hash(i + 1) * 90, 0, 0, 7); g.fill(); }
    const dx = 760, dw = 400, dy = 260, dh = 600; g.fillStyle = '#323a30'; g.fillRect(dx - 24, dy - 24, dw + 48, dh + 24);
    if (open > 0) { g.save(); g.beginPath(); g.rect(dx, dy, dw, dh); g.clip(); g.translate(dx, dy); g.scale(dw / W, dh / H); inside(); g.restore(); }
    const w = dw * (1 - open * .9); g.fillStyle = '#5a3e2c'; g.fillRect(dx, dy, w, dh); g.fillStyle = '#1a2420'; g.fillRect(dx + 30, dy + 40, Math.max(0, w - 60), 200); g.fillStyle = '#c8c0a0'; g.fillRect(dx + w - 40, dy + 300, 14, 40);
    g.fillStyle = '#e8e2c8'; g.fillRect(dx + 120, dy - 70, 160, 40); g.fillStyle = '#2a2a2a'; g.font = `700 24px ${TH}`; g.fillText(label, dx + 140, dy - 42);
  };
  CAST.aunt = CAST.aunt || { ...CAST.daeng, name: 'ป้าลูกค้า', top: '#3a7a9a', skirt: '#5a3e66', outfit: null, props: null, expr: 'smile', skin: '#d6a07c' };
  CAST.wichaiOld = CAST.wichaiOld || { ...CAST.wichai, hairCol: '#e8e8e4', expr: 'worried' };

  // ---------- N1 · morning at the shop: a customer, then the radio ----------
  const OPEN = { d: 56, ev: [[3.0, 'door'], ...T(3.4, 6), [10.6, 'paper'], ...T(24.6, 6), [27.6, 'door'], [30.4, 'radio']],
    lines: [['c1', 'aunt', 6.0, 'น้องคะ ช่วยดูม้วนนี้ให้หน่อย เทปงานแต่งป้าเอง', 'Could you look at this one for me? My wedding tape.'],
            ['c2', 'beer', 11.8, 'เก็บไว้ใกล้เตาใช่ไหมครับ ฉลากมันบวม แต่เนื้อเทปยังดีอยู่', 'You kept it near the stove, right? The label has swollen. The tape itself is fine.'],
            ['c3', 'aunt', 18.0, 'รู้ได้ไงเนี่ย ใช่เลย ไว้บนตู้ข้างเตา', 'How did you know? Yes, on the cupboard by the stove.'],
            ['c4', 'beer', 22.4, 'พรุ่งนี้มารับได้เลยครับ', 'You can pick it up tomorrow.'],
            ['r1', 'radio', 31.4, '…อาคารวิชัยแล็บ ที่ปิดตายมายี่สิบเก้าปี จะเริ่มรื้อถอนต้นเดือนหน้า', '…the Wichai Lab building, sealed for twenty-nine years, will be demolished early next month.'],
            ['r2', 'radio', 39.6, 'ส่วนอดีตนักวิจัยประจำตึก ปัจจุบันยังรักษาตัวอยู่', 'The building\'s former head researcher is still receiving treatment.']],
    look: { tone: 'warm', atmo: [['beams', { a: .2 }], ['dust', { a: .5 }]] },
    draw(lt, t) {
      camK(lt, [[0, [960, 540, 1.04]], [4, [1100, 560, 1.12]], [24, [1100, 560, 1.12]], [30, [1000, 560, 1.1]], [44, [900, 600, 1.3]], [56, [860, 600, 1.34]]], () => {
        shop(g, t, false, { clock: 10.5 + lt / 60 });
        shopDoor(g, Math.max(ease(seg(lt, 3, 3.8)) * (1 - ease(seg(lt, 6, 6.8))), ease(seg(lt, 27.4, 28.2)) * (1 - ease(seg(lt, 29.8, 30.6)))));
        radio(g, 1130, 586, lt > 30);
        const am = mover(lt, [[0, 1860], [3.4, 1860], [6.4, 1240], [24.6, 1240], [27.6, 1860]]);
        if (lt > 3.2 && lt < 28.8) person(g, 'aunt', am.x, 990, 540, P('aunt', t, am.walk != null ? { walk: am.walk, flip: am.flip } : { flip: true, look: .6, arms: lt < 10.6 ? 'chest' : 'down' }));
        if (lt > 3.2 && lt < 10.6) tapeBox(am.x - 18, 740, .5, 'งานแต่ง');
        if (lt > 10.6) tapeBox(lt < 12 ? lerp(1222, 1010, seg(lt, 10.6, 11.6)) : lt < 14 ? 1010 : 820, lt < 12 ? lerp(740, 690, seg(lt, 10.6, 11.6)) : lt < 14 ? 690 : 740, .5, 'งานแต่ง');   // she hands it over; Beer turns it in his hands
        const turning = lt > 12 && lt < 22;
        person(g, 'beer', 760, 980, 560, P('beer', t, { look: lt > 30 ? .2 : .6, arms: turning ? 'chest' : 'down', expr: lt > 40 ? 'worried' : 'neutral' }));
        if (turning) tapeBox(790, 742 + Math.sin(lt * 2) * 4, .5, 'งานแต่ง');
      });
      black(1 - seg(lt, 0, .6)); black(seg(lt, 55.4, 56));
    } };

  // ---------- 3 · tape: the gate, Mind tears the missing poster off the bars ----------
  const GATE = { d: 26, tape: true, osd: 'AM 2:04', ev: [[0, 'tapein'], [0, 'crickets'], [9.6, 'paper']],
    lines: [['t1', 'ton', 1.0, 'ม้วนที่สาม ตึกวิชัยแล็บ ตีสองสี่นาที', 'Tape three. Wichai Lab. Two-oh-four a.m.'],
            ['m6', 'mind', 11.2, 'ฝนหายตัวไปหน้าลิฟต์ตึกนี้ เมื่อสัปดาห์ก่อน', 'Fon disappeared in front of the lift in this building, last week.'],
            ['m7', 'mind', 16.6, 'ตำรวจปิดคดีในสามวัน มันแปลก', 'The police closed the case in three days. That is strange.'],
            ['m1', 'mind', 21.0, 'ต้น อย่าปิดกล้องนะ ไม่ว่าจะเกิดอะไรขึ้น', "Ton, don't turn the camera off. Whatever happens."]],
    look: A[3].look,
    draw(lt, t) {
      const torn = lt > 9.6, mm = mover(lt, [[0, 300], [5, 300], [8.6, 980]]);
      if (lt < 4.6) { pov(t, 1080, 800, lerp(3.4, 3.0, seg(lt, 0, 4.6)), () => { gate(g, t); missingPoster(g, 1080, 770, .32, .05); }); fadeX(lt, 4, 5.2); return; }
      if (lt > 10.4 && lt < 16) {   // the poster up to the lens, in her hands
        pov(t, 960, 540, 1, () => { gate(g, t); }, .8); dof(16, .3);
        missingPoster(g, 960, 540 + Math.sin(lt * 2) * 6, 1.9, -.04); g.fillStyle = '#d9a07a'; g.beginPath(); g.ellipse(560, 700, 70, 110, .2, 0, 7); g.fill(); g.beginPath(); g.ellipse(1360, 700, 70, 110, -.2, 0, 7); g.fill();
        fadeX(lt, 10, 10.8); fadeX(lt, 15.6, 16.4); return;
      }
      pov(t, 960, 640, 1.25, () => {
        gate(g, t);
        if (!torn) missingPoster(g, 1080, 770, .32, .05);
        const reach = lt > 8.6 && lt < 9.8;
        person(g, 'mind', mm.x, 1000, 420, P('mind', t, mm.walk != null ? { walk: mm.walk } : lt < 16 ? { look: .6, arms: reach ? 'point' : 'chest' } : { view: 'front', arms: lt > 20 ? 'torch' : 'chest', hold: lt > 20 }));
        if (torn && lt < 20) missingPoster(g, mm.x + 10, 900, .16, -.1);
      });
    } };

  // ---------- 5 · tape: the fire stairs; on 4 the padlock hangs open, the chain comes off ----------
  const STAIRS = { d: 56, tape: true, osd: 'AM 2:08', ev: [[1.6, 'torch'], [4, 'stairs'], [13, 'stairs'], [22, 'stairs'], [33.2, 'chain'], [35.4, 'chain'], [37.4, 'chain'], [42.6, 'door']],
    lines: [['t3', 'ton', 15.0, 'มายด์ รอด้วย', 'Mind, wait for me.'],
            ['s1', 'mind', 29.2, 'แม่กุญแจเปิดอยู่… มีคนขึ้นมาก่อนเรา', 'The padlock is open… someone came up before us.'],
            ['m9', 'mind', 38.8, 'ก้มลอดไป', 'Duck under.']],
    look: A[5].look,
    draw(lt, t) {
      const flight = lt < 12.6 ? 2 : lt < 21.6 ? 3 : 4;
      if (flight < 4) {
        const u = flight === 2 ? seg(lt, 4, 12) : seg(lt, 13.4, 21), [x, y, s] = stairPos(u);
        pov(t, 960, lerp(560, 470, u), 1.0 + u * .25, () => { stairsUp(g, t, flight, { L: .7 });
          const takingOut = lt < 1.6, holding = lt > 1.6;
          person(g, 'mind', x, y, 520 * s, { t, view: 'back', walk: (flight === 2 ? lt > 4 && lt < 12 : lt > 13.4 && lt < 21) ? lt * 7 : null, hold: holding, arms: holding ? 'torch' : 'down', hands: takingOut ? { L: [-40, -214], R: [lerp(36, -20, seg(lt, .4, 1.4)), lerp(-200, -214, seg(lt, .4, 1.4))] } : undefined });
        }, 1.2, flight === 2 ? (lt > 4 ? 1 : 0) : 1);
        black(Math.max(flight === 2 ? seg(lt, 12, 12.6) : seg(lt, 21, 21.6), flight === 3 ? 1 - seg(lt, 12.6, 13.4) : flight === 4 ? 1 - seg(lt, 21.6, 22.4) : 0));
        return;
      }
      const u = seg(lt, 22.4, 28), chainK = 1 - seg(lt, 33, 38), duck = ease(seg(lt, 40, 41.6)), through = seg(lt, 41.6, 43.6), open = ease(seg(lt, 42.4, 43.4)) * .7;
      const lookLock = ease(seg(lt, 28, 29.4)) * (1 - ease(seg(lt, 38.2, 39.6))), camIn = ease(seg(lt, 44, 49)), dip = Math.sin(Math.PI * seg(lt, 49, 51.4));
      const [x, y, s] = stairPos(lerp(.88 * u, .97, through));
      cam(960, lerp(lerp(lerp(560, 470, u), 330, camIn), 360, lookLock) + dip * 120, lerp(lerp(1.2, 3.0, camIn), 2.2, lookLock), () => {
        stairsUp(g, t, 4, { L: .7, taped: true, open, chain: chainK });
        chainLock(g, 810, 190, 300, chainK, lt > 34 && lt < 38 ? [lerp(960, 900, seg(lt, 34, 38)), lerp(360, 420, seg(lt, 34, 38))] : null);
        if (lt > 38) chainPile(g, 760, 440);
        const pulling = lt > 33 && lt < 38;
        if (lt < 44.2) person(g, 'mind', x, y + duck * 12, 520 * s * (1 - through * .25), { t, view: 'back', walk: (lt > 22.4 && lt < 28) || (lt > 41.6 && lt < 43.6) ? lt * 7 : null, crouch: duck * (1 - seg(lt, 43.4, 44)), hold: true, arms: pulling ? 'down' : 'torch', hands: pulling ? { L: [-30, -270 + Math.sin(lt * 5) * 14], R: [30, -280 + Math.cos(lt * 5) * 14] } : undefined });
      });
      if (lookLock > .3) darkTorch(960, 520, 520, .5 * lookLock);
      if (dip > 0) { g.fillStyle = '#e8c43a'; g.fillRect(0, lerp(-80, 140, dip) - 30, W, 60); g.fillStyle = '#1a1a1e'; g.font = `700 40px ${TH}`; for (let k = 0; k < 8; k++) g.fillText('ห้ามเข้า', k * 260 + 20, lerp(-80, 140, dip) + 12); }
      black(seg(lt, 51.4, 56));
    } };

  // ---------- 6 · Beer pauses: 27 minutes; "the camera was off?" — the cut is too clean ----------
  const PAUSE = { d: 18, ev: [[.2, 'pause'], [17.2, 'play']], look: A[6].look,
    lines: [...A[6].lines, ['p1b', 'beer', 11.0, 'หรือกล้องถูกปิดไปช่วงหนึ่ง… แต่ภาพต่อกันเนียนเกินไป', 'Maybe the camera was off for a while… but the cut is too clean.']],
    draw(lt, t) { A[6].draw(lt < 9.5 ? lt : lt < 16.6 ? 9.5 : lt - 7.2, t); } };

  // ---------- 7 · tape: into the lab with Mind, out to the corridor; Pa Daeng looks at the lens and is gone ----------
  const LAB = { d: 100, tape: true, osd: 'AM 2:31', ev: [[3.0, 'door2'], [22.4, 'mop'], [32.4, 'whoosh'], ...T(30.6, 6), [34.2, 'door2'], ...T(38.6, 5), [40, 'mop'], [57.6, 'paper'], [69, 'sting2'], [74, 'flicker'], [77, 'blackout'], [77.8, 'sting'], ...T(78, 4, .4)],
    lines: [['bv1', 'beer', 1.2, 'ชั้นวางเทป… อยู่ทางขวา', 'The tape shelf… is on the right.'],
            ['m10', 'mind', 9.0, 'ห้องทดลองของ ดร.วิชัย', "Dr. Wichai's lab."],
            ['m11', 'mind', 13.4, 'โครงการสาม เจ็ดคน', 'Project three. Seven people.'],
            ['m12', 'mind', 19.4, 'ช่องม้วนที่หนึ่ง ว่างอยู่', 'The slot for tape one is empty.'],
            ['m13', 'mind', 24.0, 'ได้ยินไหม เสียงถูพื้น', 'Do you hear that? Someone is mopping.'],
            ['bv2', 'beer', 40.6, 'ป้าแดง…', 'Pa Daeng…'],
            ['m3', 'mind', 43.6, 'ป้าคะ ตึกนี้ปิดไปแล้วไม่ใช่เหรอ', "Ma'am, isn't this building closed?"],
            ['d1', 'daeng', 47.6, 'ป้าถูทุกคืนจ้ะ อย่าเหยียบตรงที่เปียกนะลูก', "I mop every night, dear. Don't step on the wet part."],
            ['m14', 'mind', 52.6, 'ทุกคืน… ทั้งที่ตึกร้างแล้ว', 'Every night… in an empty building.'],
            ['m4', 'mind', 61.4, 'รายชื่อผู้ทดลอง มีชื่อเด็กด้วย', 'A list of test subjects. There is a child on it.'],
            ['m15', 'mind', 65.6, 'ชื่อป้าแดงก็อยู่ในนี้', "Pa Daeng's name is on it too."],
            ['d1slow', 'daeng', 70.4, 'อย่าเหยียบ… ตรงที่เปียก… นะลูก', "Don't step… on the wet part… dear."],
            ['m18', 'mind', 79.6, 'เมื่อกี้ป้า… ยืนอยู่ตรงนี้', 'She was… standing right here.'],
            ['t4', 'ton', 84.4, 'มายด์ กลับเถอะ', "Mind, let's go back."],
            ['m19', 'mind', 88.4, 'ไม่… ฝนยังอยู่ที่นี่', 'No… Fon is still here.']],
    look: { atmo: [['dust', { a: .3 }], ['flicker']] },
    draw(lt, t) {
      const labInside = () => lab(g, t, .75);
      if (lt < 7) {   // the lab door from the corridor: Mind walks to it, pushes it, goes in; the camera follows her
        const mm = mover(lt, [[0, 1240], [2.6, 960]]), open = ease(seg(lt, 3, 4.4)), inK = ease(seg(lt, 4.4, 7));
        pov(t, 960, lerp(540, 600, inK), lerp(1, 1.6, inK), () => { doorFromCorridor(t, open, labInside, 'ห้อง ๔๐๔'); person(g, 'mind', lerp(mm.x, 960, inK), lerp(1080, 860, inK), lerp(640, 420, inK), { t, view: 'back', walk: mm.walk ?? (inK > 0 && inK < 1 ? lt * 7 : null), hold: true, arms: lt > 2.6 && lt < 4 ? 'point' : 'torch' }); }, 1, .5);
        darkTorch(960, 500, 900, .45); return;
      }
      if (lt < 30.6) {   // the lab: Mind always in the shot — the whiteboard, the shelf on the right, the mopping outside
        const camv = K(lt, [[7, [960, 700, 1.3]], [9.4, [520, 460, 1.6]], [15.4, [520, 460, 1.6]], [18, [1450, 560, 1.6]], [26, [1450, 560, 1.6]], [29.6, [1750, 600, 1.35]]]);
        const mm = mover(lt, [[7, 960], [9.2, 620], [15.2, 620], [17.8, 1300], [26.6, 1300], [30.6, 1900]], 7);
        pov(t, ...camv, () => { labInside(); person(g, 'mind', mm.x, 1010, 520, P('mind', t, mm.walk != null ? { walk: mm.walk, flip: mm.flip, hold: true, arms: 'torch' } : { view: 'side', flip: lt < 16, hold: true, arms: 'torch', look: lt > 23 ? -1 : .6, expr: lt > 23 ? 'worried' : 'neutral' })); }, 1);
        darkTorch(960, 520, 900, .5); swish(seg(lt, 29.6, 31)); return;
      }
      if (lt < 38.6) {   // still with her: across to the lab door, open, through it into the corridor
        const mm = mover(lt, [[30.6, 300], [33.8, 900]]), open = ease(seg(lt, 34.2, 35.6)), inK = ease(seg(lt, 35.6, 38.6));
        const corr = () => { corridor(g, t, .8, { wet: true }); const mop = Math.sin(t * 4) * 18; person(g, 'daeng', 1080 + mop * .3, 860, 360, P('daeng', t, { expr: 'smile', look: .6, flip: true, hold: true, hands: { L: [-4 + mop * .5, -250], R: [26, -214] } })); };
        cam(960, lerp(560, 560, inK), lerp(1, 1.6, inK), () => { labDoor(g, t, open, corr); person(g, 'mind', lerp(mm.x, 960, inK), lerp(1080, 860, inK), lerp(640, 400, inK), { t, view: 'back', walk: mm.walk ?? (inK > 0 && inK < 1 ? lt * 7 : null), hold: true, arms: lt > 33.8 && lt < 35.4 ? 'point' : 'torch' }); });
        swish(seg(lt, 30, 31.2)); return;
      }
      if (lt > 60 && lt < 68.6) { cam(960, 540, 1 + (lt - 60) * .01, () => paper(g, t)); fadeX(lt, 59.6, 60.8); fadeX(lt, 68, 69.2); return; }
      // the corridor
      const gone = lt > 77.7, shake = lt > 77.7 && lt < 88 ? 2.6 : 1, flick = lt > 74 && lt < 77 ? (hash(Math.floor(t * 9)) > .5 ? 1 : .15) : 1;
      const [x, y, z] = K(lt, [[38.6, [960, 560, 1.04]], [55, [960, 560, 1.1]], [57, [860, 900, 1.6]], [59.6, [860, 820, 1.5]], [68.6, [960, 560, 1.06]], [71, [1040, 640, 1.5]], [77.7, [1040, 640, 1.5]], [80, [900, 600, 1.15]], [100, [900, 600, 1.18]]]);
      pov(t, x, y, z, () => {
        corridor(g, t, .8, { wet: true });
        const mop = lt < 69 ? Math.sin(t * 4) * 18 : 0;
        if (!gone) person(g, 'daeng', 1080 + mop * .3, 860, 360, P('daeng', t, lt > 69 ? { view: 'front', expr: 'neutral', hold: true, arms: 'mop' } : { expr: 'smile', look: .6, flip: true, hold: true, hands: { L: [-4 + mop * .5, -250], R: [26, -214] } }));
        else bucketMop(Math.sin((lt - 77.7) * 5) * .25 * Math.exp(-(lt - 77.7) * .5));
        if (lt < 58.6) PAPER(880, 1000);
        const mm = mover(lt, [[38.6, 900], [41.6, 620], [78, 620], [80, 430]], 7), crouch = ease(seg(lt, 57.6, 58.6)) * (1 - ease(seg(lt, 59, 60)));
        const scared = lt > 77.7, jit = scared && lt < 92 ? Math.sin(t * 38) * 6 : 0;
        person(g, 'mind', mm.x, 1040, 600, P('mind', t, lt < 41.6 ? { view: 'back', walk: mm.walk, hold: true, arms: 'torch' } : { look: lt > 86 ? -.2 : .6, walk: mm.walk != null ? mm.walk : null, crouch, hold: lt < 57.6 || lt > 68.6, arms: lt < 57.6 || lt > 68.6 ? 'torch' : 'chest', hands: scared && lt < 92 ? { L: [-28, -210], R: [78 + jit, -268 + jit] } : undefined, expr: lt > 47 ? (scared ? 'scared' : 'worried') : 'neutral' }));
      }, shake);
      if (flick < .5 || (lt > 77 && lt < 77.7)) { g.fillStyle = `rgba(0,0,0,${lt > 77 && lt < 77.7 ? .97 : .7})`; g.fillRect(0, 0, W, H); }
      black(seg(lt, 99.2, 100));
    } };

  // ---------- N2 · Beer digitises the frame: the child's wet footprints lead to the lift; then the frame moves by itself ----------
  const ENH = { d: 64, ev: [[1.6, 'type'], [8, 'type'], [14, 'zoom'], [20, 'type'], [39.6, 'sting2'], [44.6, 'startle'], [60.4, 'play']],
    lines: [['e1', 'beer', 2.4, 'ขอดูพื้นตรงนั้นชัด ๆ อีกที', 'Let me see that floor properly.'],
            ['e2', 'beer', 23.0, 'รอยเท้า… เท้าเด็ก', 'Footprints… a child\'s feet.'],
            ['e3', 'beer', 29.4, 'เดินจากตรงที่กระดาษตก… ไปทางลิฟต์', 'From where the paper fell… toward the lift.'],
            ['e4', 'beer', 45.2, 'ผมไม่ได้กด…', 'I didn\'t touch it…'],
            ['e5', 'beer', 56.4, 'ดูต่อ', 'Keep going.']],
    look: { tone: 'tv', v: .62 },
    draw(lt, t) {
      if (lt < 6 || lt > 50) {   // at the desk, the monitor's glow
        cam(900, 620, 1.25, () => { shop(g, t, true, { screen: '#2a3430', vcrOn: true, lamp: .8 }); person(g, 'beer', 840, 990, 580, P('beer', t, { look: .6, arms: lt < 6 ? 'chest' : 'down', expr: lt > 50 ? 'worried' : 'neutral', crouch: lt > 50 && lt < 54 ? .1 : 0 })); });
        fadeX(lt, 5.4, 6.6); fadeX(lt, 49.6, 50.8); return;
      }
      const z = lerp(1, 3.4, ease(seg(lt, 12, 20))), bright = ease(seg(lt, 18, 26)), moved = lt > 39.6;
      enhance(g, t, { zoom: z, cx: lerp(960, 930, ease(seg(lt, 12, 20))), cy: lerp(540, 860, ease(seg(lt, 12, 20))), bright, cell: moved ? 27 : 26 }, () => {
        corridor(g, 0, .8, { wet: true }); PAPER(880, 1000); footprints(g, bright);
        if (!moved) person(g, 'daeng', 1080, 860, 360, { t: 0, expr: 'smile', look: .6, flip: true, hold: true, hands: { L: [-4, -250], R: [26, -214] } });
        else person(g, 'fon', 950, 770, 120, { t: 0, view: 'back' });   // the next frame: the child, at the far end
      });
      if (lt > 39.6 && lt < 39.75) { g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(0, 0, W, H); }
    } };

  // ---------- 9+10 · the ding; Mind turns to the far end and walks to the lift ----------
  const DING = { d: 18, tape: true, osd: 'AM 2:38', ev: [[1.2, 'ding'], [8, 'stepsWalk']], look: A[9].look,
    lines: [['m20', 'mind', 3.4, 'เสียงลิฟต์…', 'The lift…']],
    draw(lt, t) {
      if (lt > 8) { A[10].draw(lt - 8, t); return; }
      const turn = ease(seg(lt, 1.6, 3));
      pov(t, 960, 560, lerp(1.06, 1.3, ease(seg(lt, 4, 8))), () => { corridor(g, t, .75, { wet: true, farLit: lt > 1.2 }); bucketMop(0); person(g, 'mind', 560, 1040, 600, P('mind', t, turn < .5 ? { look: .6, hold: true, arms: 'torch', expr: 'scared' } : { view: 'back', hold: true, arms: 'torch' })); }, 1.4);
    } };

  // ---------- 11 · the lift on 4: sealed, no power; the light comes on, the doors open, Fon ----------
  const LIFT = { d: 34, tape: true, osd: 'AM 2:41', ev: [[6.0, 'ding'], [7.4, 'liftdoor'], [21.2, 'flicker'], [23, 'blackout'], [25.2, 'buzz'], [26.4, 'blackout']],
    lines: [['m21', 'mind', 1.4, 'ลิฟต์ตัวนี้ตัดไฟไปแล้วนี่', 'This lift has no power.'],
            ['f1', 'fon', 13.6, 'พี่คะ ลิฟต์ไม่ยอมลง', "Miss… the lift won't go down."], ['m17', 'mind', 18.4, 'ฝน?', 'Fon?']],
    look: A[11].look,
    draw(lt, t) {
      const open = ease(seg(lt, 7.4, 9.4)), Lv = lt > 26.4 ? .04 : lt > 25.2 ? 1 : lt > 23 ? .04 : lt > 21.2 ? (hash(Math.floor(t * 16)) > .45 ? 1 : .15) : 1, turned = lt > 12.6;
      pov(t, 960, 560, lerp(1.0, 1.12, ease(seg(lt, 0, 20))), () => {
        lift(g, t, open, Lv * (lt < 6 ? .55 : 1));
        if (lt < 6) { g.fillStyle = '#0a0a0c'; g.fillRect(900, 60, 120, 44); }   // the floor light is dead… until the ding
        g.save(); g.beginPath(); g.rect(560, 160, 800, 760); g.clip();
        if (lt < 23 && open > .2) { person(g, 'fon', 960, 900, 420, P('fon', t, turned ? { view: 'front', expr: 'worried' } : { view: 'back' })); if (turned) { const gr = g.createLinearGradient(920, 0, 990, 0); gr.addColorStop(0, 'rgba(0,0,0,.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(880, 700, 110, 120); } }
        if (lt > 25.2) { g.fillStyle = '#7a5236'; g.beginPath(); g.ellipse(960, 880, 34, 38, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(960, 830, 26, 24, 0, 0, 7); g.fill(); }
        g.restore();
        liftBarrier(g, Lv);
      }, 1);
      if (Lv < .5) { g.fillStyle = `rgba(0,0,0,${1 - Lv})`; g.fillRect(0, 0, W, H); }
    } };

  // ---------- 12 · the thing over her shoulder (lines made clearer) ----------
  const THING = { ...A[12], lines: [['m5b', 'mind', 13.2, 'ต้น… ถอยช้า ๆ แต่ห้ามปิดกล้องนะ', "Ton… back away slowly. But don't turn the camera off."], ['t2b', 'ton', 16.4, 'ไม่ปิด… ยังถ่ายอยู่', "I won't… it's still recording."]] };

  // ---------- 13 · the reflection is his own; one frame of an old face; relief; the thud; the door is locked; tape one ----------
  const REFL = { d: 70, ev: [[0, 'tapeout'], [6.4, 'zoom'], [30.6, 'stop'], [33, 'thud'], [33.2, 'startle'], ...T(35, 6), [38.4, 'rattle'], [39.4, 'rattle'], ...T(41.4, 5), [48, 'paper'], [62.6, 'paper'], [64.6, 'paper']],
    lines: [['b4', 'beer', 1.6, 'ย้อนกลับไปที่ลิฟต์ ในประตูลิฟต์ มีเงาสะท้อน', 'Back to the lift. There is a reflection in its door.'],
            ['b5', 'beer', 10.6, 'เสื้อสีเขียว… นั่นผม', 'A green hoodie… that is me.'],
            ['r3', 'beer', 14.6, 'เทปปีสี่สิบ… ทำไมมีผมอยู่ในนั้น', 'A tape from \'97… why am I in it?'],
            ['r4', 'beer', 26.0, '…เงาผมบนจอเอง', '…it\'s just my reflection on the screen.'],
            ['r5', 'beer', 39.8, 'ล็อก…', 'Locked…'],
            ['r6', 'beer', 49.4, 'ม้วนที่หนึ่ง… มันหายไปพร้อม ดร.วิชัย ตั้งแต่ปีสี่สิบ', 'Tape one… it vanished with Dr. Wichai in \'97.'],
            ['r7', 'beer', 56.4, 'ใครเอามาวาง… ประตูก็ล็อกอยู่', 'Who put it here… the door is locked.']],
    look: { tone: 'night', v: .55, atmo: [['glow', { x: 900, y: 600, r: 520, col: 'rgba(255,200,120,.12)' }]] },
    draw(lt, t) {
      if (lt < 18) { A[13].draw(Math.min(lt, 12.9), t); return; }   // the frozen frame and the zoom (round-1 drawing)
      const frozen = () => { lift(g, 0, 1, 1); person(g, 'fon', 960, 900, 430, { t: 0, view: 'front', expr: 'worried' }); };
      if (lt < 33) {   // he leans in; the shape in the glass leans with him; he lifts a hand — so does it
        const lean = ease(seg(lt, 18, 20.4)) * (1 - ease(seg(lt, 29, 30.4))), hand = lt > 21.6 && lt < 25.4, old = lt >= 23.5 && lt < 23.534;
        cam(lerp(960, 560, lean), lerp(540, 580, lean), lerp(1, 1.9, lean), () => {
          shop(g, t, true, { screen: '#3a4440', vcrOn: true });
          frozenTV(frozen, t);
          g.save(); g.beginPath(); g.roundRect(190, 455, 330, 230, 26); g.clip(); g.globalAlpha = .28; person(g, old ? 'wichaiOld' : 'beer', 330, 760, 300, { t, view: 'front', arms: hand ? 'wave' : 'down', expr: 'worried' }); g.restore();
          person(g, 'beer', lerp(760, 640, lean), 990, 580, P('beer', t, { look: .8, flip: true, arms: hand ? 'wave' : lt > 30 && lt < 31 ? 'torch' : 'down', expr: lt > 26 ? 'smile' : 'worried' }));
        });
        black(1 - seg(lt, 18, 18.5)); return;
      }
      // the thud: he spins round, checks the shop door (locked — from outside), comes back, the wet tape on the desk
      const bm = mover(lt, [[33, 760], [35, 760], [38, 1690], [40.8, 1690], [43.4, 880]]), lifted = lt > 47, close = lt > 47.6 && lt < 55.6, onTowel = lt > 62.6;
      if (close) { g.fillStyle = '#0e1014'; g.fillRect(0, 0, W, H); cam(960, 540, 1.3, () => shop(g, t, true, { lamp: 1 })); dof(18, .35); handsTape(g, t, { label: '01', wet: 1 - ease(seg(lt, 52, 54)), sleeve: '#2e6e52' }); fadeX(lt, 47.2, 48.4); fadeX(lt, 55, 56.2); return; }
      const [x, y, z] = K(lt, [[33, [960, 540, 1]], [35, [1200, 560, 1.05]], [38, [1500, 560, 1.15]], [41, [1500, 560, 1.15]], [43.4, [960, 560, 1.05]], [45, [960, 620, 1.4]], [57, [960, 600, 1.3]], [70, [960, 560, 1.1]]]);
      cam(x, y, z, () => {
        shop(g, t, true, { footprints: 7, lamp: 1 }); towel(g, 940, 708, ease(seg(lt, 64.6, 66.2)));
        const rattle = lt > 38.2 && lt < 40.4 ? Math.sin(lt * 60) * .03 : 0; shopDoor(g, Math.max(0, rattle), false);
        if (!lifted) tapeBox(1025, 676, 1, '01', 1);
        const reach = lt > 45 && lt < 47 ? { R: [lerp(32, 102, ease(seg(lt, 45, 46.4))), lerp(-204, -222, ease(seg(lt, 45, 46.4)))] } : undefined;
        person(g, 'beer', bm.x, 990, 580, P('beer', t, bm.walk != null ? { walk: bm.walk, flip: bm.flip } : lt < 35 ? { look: .8, flip: true, expr: 'scared' } : lt > 38 && lt < 41 ? { look: .6, arms: 'point', hands: { R: [70, -252 + Math.sin(lt * 40) * 4] }, expr: 'worried' } : { look: .5, expr: 'worried', arms: lifted && !onTowel ? 'chest' : 'down', hands: reach }));
        if (lifted && !onTowel) tapeBox(lt < 61.8 ? bm.x + 24 : lerp(bm.x + 24, 940, seg(lt, 61.8, 62.6)), lt < 61.8 ? 742 : lerp(742, 696, seg(lt, 61.8, 62.6)), .8, '01', .3);
        if (onTowel && lt < 65) tapeBox(940, 696, .8, '01', .2);
      });
      black(seg(lt, 69.3, 70));
    } };

  // ---------- 14 · he calls Nid (no answer), writes to her, keeps watch in silence, falls asleep ----------
  const MSG = { d: 38, ev: [[4.6, 'dial'], [6.8, 'dial'], [15.4, 'type'], [18.6, 'sent']],
    look: { tone: 'tv', v: .6 },
    draw(lt, t) {
      if (lt < 4) { shop(g, t, true, { clock: 2.95 }); towel(g, 940, 708, 1); person(g, 'beer', 880, 990, 580, P('beer', t, { look: .5, arms: lt > 1 ? 'phone' : 'down' })); black(1 - seg(lt, 0, .5)); fadeX(lt, 3.4, 4.6); return; }
      if (lt < 12) { phone(chat({ title: 'คุณนิด', call: lt < 9.6 ? 'กำลังโทร…' : 'ไม่มีผู้รับสาย', ended: lt > 9.6 }), t, true, 0); fadeX(lt, 11.4, 12.4); return; }
      if (lt < 21) { const typed = 'พรุ่งนี้เช้ามาด่วน ผมเจอม้วนที่หนึ่ง'; phone(chat({ title: 'คุณนิด', rows: lt > 18.6 ? [{ text: typed, me: true }] : lt > 15.4 ? [{ text: typed.slice(0, Math.floor((lt - 15.4) * 11)) }] : [] }), t, true, Math.min(1, (lt - 14) / 3)); fadeX(lt, 20.4, 21.6); return; }
      const k = seg(lt, 21, 34), sleep = ease(seg(lt, 31, 33.4));
      shop(g, t, true, { clock: lerp(3.0, 4.1, k), lamp: 1 - .3 * k }); towel(g, 940, 708, 1);
      g.save(); g.translate(880, 990); g.rotate(-.18 * sleep); g.translate(-880, -990);
      person(g, 'beer', 880, 990, 580, P('beer', t, { look: .5, arms: 'down', blink: lt > 28 && (lt > 31 || Math.sin(lt * 3) > .3), nod: sleep * 6 }));
      g.restore();
      black(seg(lt, 36.4, 38));
    } };

  // ---------- N3 · Beer writes the timeline; a drop of water falls on the paper ----------
  const TL = { d: 32, ev: [[2, 'paper'], [17.4, 'drip'], [19.6, 'drip']],
    lines: [['tl1', 'beer', 1.6, 'ขอเรียงให้ดูก่อน', 'Let me lay it out.'],
            ['tl2', 'nid', 21.6, 'น้ำมาจากไหน', 'Where did that water come from?'],
            ['tl3', 'beer', 26.0, '…หลังคาไม่เคยรั่ว', '…the roof has never leaked.']],
    look: { tone: 'day', atmo: [['beams', { a: .14 }]] },
    draw(lt, t) {
      if (lt > 4 && lt < 24) {   // the paper, his pen, the lines one by one; then the drop smears a name
        g.fillStyle = '#3a2e22'; g.fillRect(0, 0, W, H); g.save(); g.translate(960, 560); g.rotate(-.03); g.fillStyle = '#f4eedc'; g.fillRect(-620, -400, 1240, 800); g.strokeStyle = 'rgba(120,150,200,.3)'; g.lineWidth = 2; for (let y = -340; y < 400; y += 64) { g.beginPath(); g.moveTo(-600, y); g.lineTo(600, y); g.stroke(); }
        const rows = ['๑๓ พ.ย. — ป้าแดง + ฝน อยู่ในห้องแล็บ (ม้วน ๑)', '๒๐ พ.ย. ๐๒:๓๔ — ป้าแดงยังถูพื้น (ม้วน ๓)', '๒๐ พ.ย. ๐๒:๕๘ — ช่างโอ๊ตตัดไฟชั้น ๔ ?', '๐๒:๕๙ — "อย่าให้ไฟดับ"'];
        g.font = `500 54px ${TH}`; g.fillStyle = '#1f2a5a';
        rows.forEach((r, i) => { const a = 5 + i * 2.6, n = Math.floor([...r].length * seg(lt, a, a + 2.2)); g.fillText([...r].slice(0, n).join(''), -560, -250 + i * 128); });
        if (lt > 17.4) { const k = ease(seg(lt, 17.4, 18.4)); g.fillStyle = `rgba(150,180,200,${.45 * k})`; g.beginPath(); g.ellipse(-300, -250, 70 * k + 10, 40 * k + 6, 0, 0, 7); g.fill(); g.fillStyle = `rgba(160,200,230,${.6 * k})`; g.beginPath(); g.ellipse(-310, -258, 18, 22, 0, 0, 7); g.fill(); }
        if (lt > 17 && lt < 17.4) { g.fillStyle = 'rgba(170,210,235,.9)'; g.beginPath(); g.ellipse(-310, lerp(-700, -258, seg(lt, 17, 17.4)), 10, 16, 0, 0, 7); g.fill(); }
        g.restore();
        const px = -560 + 40 * ((lt * 3) % 14), py = -250 + 128 * Math.min(3, Math.floor(seg(lt, 5, 15.4) * 4));
        if (lt < 15.8) { g.save(); g.translate(960 + px + 40, 560 + py - 10); g.rotate(.6); g.fillStyle = '#2a4a8a'; g.fillRect(-6, -160, 12, 160); g.fillStyle = '#d9a07a'; g.beginPath(); g.ellipse(10, -150, 60, 40, .3, 0, 7); g.fill(); g.restore(); }
        fadeX(lt, 3.4, 4.6); fadeX(lt, 23.4, 24.6); return;
      }
      cam(960, 600, 1.15, () => { shop(g, t, false, { clock: 9.0, screen: '#101418' });
        person(g, 'beer', 760, 980, 560, P('beer', t, lt < 4 ? { look: .6, arms: 'chest' } : { look: lt < 27 ? .6 : 0, nod: lt > 24.6 && lt < 27 ? -8 : 0, expr: 'worried' }));
        person(g, 'nid', 1180, 990, 560, P('nid', t, { look: .6, flip: true, arms: 'cross', expr: lt > 24 ? 'worried' : 'neutral' })); });
      black(1 - seg(lt, 0, .5));
    } };

  // ---------- 20 · they leave; outside, Nid's car; they get in and drive off ----------
  const LEAVE = { d: 44, ev: [...T(2, 8), [5.6, 'door'], [9.6, 'door'], ...T(10.4, 6), [14.4, 'lock'], ...T(15.6, 6), [19.6, 'door'], [21.8, 'door'], [22.4, 'door'], [23.4, 'torch'], [24.2, 'carstart'], [25.6, 'car']],
    lines: [['lv1', 'nid', 11.2, 'ขึ้นรถฉันเลย', 'Get in my car.']],
    look: { tone: 'day', v: .4 },
    draw(lt, t) {
      if (lt < 10) { R[20].draw(lt, t); return; }
      const drive = ease(seg(lt, 26, 33)) * seg(lt, 26, 33), carX = lerp(760, -1500, drive);
      shopFront(g, t);
      const nm = mover(lt, [[10, 1290], [10.6, 1290], [15, 980], [18.4, 560]]), bm = mover(lt, [[10, 1290], [15.6, 1290], [19.4, 820]]);
      const nidIn = lt > 19.8, beerIn = lt > 21.4;
      if (!nidIn) person(g, 'nid', nm.x, 960, 540, P('nid', t, nm.walk != null ? { walk: nm.walk, flip: true } : { flip: true }));   // behind the car: she goes round to the driver's side
      sedan(g, carX, 1076, -1.9, { wheel: -drive * 30, doors: [ease(seg(lt, 19.6, 20.4)) * (1 - ease(seg(lt, 21.6, 22.4))), 0], heads: [...(nidIn ? [[60, '#3a2a24']] : []), ...(beerIn ? [[20, '#241e20']] : [])], lights: lt > 24.2 });
      if (!beerIn) person(g, 'beer', bm.x, 1010, 580, P('beer', t, bm.walk != null ? { walk: bm.walk, flip: true } : lt > 13.6 && lt < 15.4 ? { arms: 'torch', look: .5, flip: false } : { look: .5, flip: true }));
      black(seg(lt, 43.2, 44));
    } };

  // ---------- 21 · the drive: traffic; inside, Nid tells him who Mind was ----------
  const CAR = { d: 58, ev: [[0, 'car'], [10, 'car'], [20, 'car'], [30, 'car'], [40, 'car'], [48, 'car']],
    lines: [['x9', 'nid', 13.6, 'ร้านเขาอยู่ในตลาดเก่า ฉันเคยไปขอสัมภาษณ์ เขาไม่ยอมพูด', "His shop's in the old market. I tried to interview him once. He wouldn't talk."],
            ['cr1', 'beer', 21.0, 'คุณนิดครับ… ทำไมคุณถึงตามเรื่องนี้มาตลอด', 'Ms. Nid… why have you followed this all these years?'],
            ['cr2', 'nid', 27.0, 'มายด์ในเทป…', 'Mind, on the tape…'],
            ['cr3', 'nid', 31.0, '…คือพี่สาวฉัน', '…is my sister.'],
            ['cr4', 'nid', 36.4, 'คืนนั้นพี่หายไป ส่วนพี่ต้นถูกพบที่ล็อบบี้ตอนเช้า ไม่ยอมพูดอะไรเลย', 'That night she disappeared. Ton was found in the lobby in the morning. He would not say a word.'],
            ['cr5', 'nid', 44.2, 'ตอนนี้พี่ต้นย้ายไปอยู่ต่างจังหวัด ไม่ติดต่อใครอีก', 'Ton moved away upcountry. He talks to no one now.']],
    look: { tone: 'day', v: .4 },
    draw(lt, t) {
      const inside = lt > 12 && lt < 49;
      if (!inside) {
        cityRoad(g, t);
        vehicle(g, 'bus', 1900 - ((t * 120) % 3400), 880, -.62, t);                     // oncoming, far lane
        vehicle(g, 'tuktuk', ((t * 90 + 400) % 2600) - 300, 900, .7, t);
        sedan(g, 900, 980, .9, { wheel: t * 12, heads: [[60, '#3a2a24'], [20, '#241e20']] });
        vehicle(g, 'moto', ((t * 260) % 2800) - 400, 1050, .8, t);                       // a motorbike cuts past, near lane
        vehicle(g, 'taxi', ((t * 180 + 1300) % 3000) - 400, 1060, .85, t);
        black(1 - seg(lt, 0, .5)); fadeX(lt, 11.4, 12.6); fadeX(lt, 48.4, 49.6); black(seg(lt, 57.3, 58)); return;
      }
      carFront(g, t, () => {
        person(g, 'nid', 600, 1700, 1500, P('nid', t, { view: 'front', close: true, look: lt > 21 && lt < 26 ? .8 : -.2, expr: lt > 27 ? 'worried' : 'neutral' }));
        person(g, 'beer', 1340, 1720, 1500, P('beer', t, { view: 'front', close: true, look: lt > 27 ? -.9 : -.2, expr: lt > 31 ? 'worried' : 'neutral' }));
      });
      fadeX(lt, 11.4, 12.6); fadeX(lt, 48.4, 49.6);
    } };

  // ---------- N4 · they arrive: the car pulls in, they get out and walk into the market ----------
  const ARRIVE = { d: 16, ev: [[0, 'car'], [5.4, 'door'], [5.8, 'door'], [8.2, 'door'], [8.6, 'door'], ...T(9, 10)],
    look: { tone: 'warm', v: .42 },
    draw(lt, t) {
      const u = seg(lt, 0, 4.6), v = 1 - u, carX = lerp(-900, 820, 1 - (1 - u) * (1 - u));
      cityRoad(g, 100);
      const out = lt > 6.4, gone = lt > 15;
      const bm = mover(lt, [[6.4, 760], [9, 760], [15, 2100]]), nm = mover(lt, [[6.4, 900], [8.6, 1060], [15, 2200]]);
      if (out) person(g, 'nid', nm.x, 960, 540, P('nid', t, nm.walk != null ? { walk: nm.walk } : { look: .5 }));
      sedan(g, carX, 1076, 1.9, { wheel: lt * 10 * v, doors: [ease(seg(lt, 5.4, 6)) * (1 - ease(seg(lt, 7.8, 8.4))), 0], heads: out ? [] : [[60, '#3a2a24'], [20, '#241e20']] });
      if (out) person(g, 'beer', bm.x, 1010, 580, P('beer', t, bm.walk != null ? { walk: bm.walk } : { look: .5 }));
      black(1 - seg(lt, 0, .5)); black(seg(lt, 15.3, 16));
    } };

  // ---------- 23 · Oat's shop, with his memory of the breaker box in sepia ----------
  const OAT = { ...R[23], ev: [...R[23].ev, ...T(32, 6), [39.6, 'sting2']],
    draw(lt, t) {
      if (lt > 31 && lt < 42.4) {
        const walkK = seg(lt, 31.6, 36.4), om = lerp(300, 1250, walkK);
        cam(lerp(800, 1300, walkK), 560, 1.2, () => { corridor(g, t, .45); g.fillStyle = '#7a7e80'; g.fillRect(1380, 420, 220, 300); g.fillStyle = '#9a9ea0'; g.fillRect(1395, 435, 190, 270);
          for (let k = 0; k < 6; k++) { g.fillStyle = '#3a3a40'; g.fillRect(1410 + (k % 3) * 60, 460 + Math.floor(k / 3) * 120, 40, 80); g.fillStyle = '#c8c8c0'; g.fillRect(1418 + (k % 3) * 60, k === 4 ? 520 : 470 + Math.floor(k / 3) * 120, 24, 14); }
          if (lt > 37) { g.fillStyle = 'rgba(170,210,235,.7)'; g.beginPath(); g.ellipse(1480, 600, 30, 38, .2, 0, 7); g.fill(); for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(1454 + k * 16, 552 - Math.abs(k - 1.5) * 8, 7, 18, -.3 + k * .15, 0, 7); g.fill(); } }
          person(g, 'oat', om, 900, 520, P('oat', t, walkK < 1 ? { walk: lt * 7, hold: true, arms: 'torch' } : { look: .6, hold: true, arms: lt > 38 ? 'down' : 'torch', expr: lt > 37.6 ? 'scared' : 'neutral' }));
        }); darkTorch(1400, 560, 700, .7); sepia();
        fadeX(lt, 30.6, 31.8); fadeX(lt, 41.8, 43); return;
      }
      R[23].draw(lt, t);
    } };

  // ---------- 25 · that night: Nid calls about tape three; the TV turns itself on — a live, high, CCTV-like view ----------
  const NIGHT = { d: 52, ev: [[7.4, 'ring'], [9, 'ring'], [22.6, 'tvon'], [22.8, 'sting2'], [34, 'zoom'], [44, 'sting']],
    lines: [['b18', 'beer', 3.6, 'ม้วนที่สองยังไม่มีใครเปิด', 'Nobody has opened tape two yet.'],
            ['nc1', 'nid', 10.8, 'เบียร์… ฉันเพิ่งนึกขึ้นได้', 'Beer… I just remembered something.'],
            ['nc2', 'nid', 14.0, 'ตอนฉันเก็บกล่องจากตึก ม้วนที่สามไม่ได้อยู่ในนั้น', 'When I took the box from the building, tape three was not in it.'],
            ['nc3', 'beer', 19.4, 'แล้วมันมาอยู่ในกล่องได้ยังไง', 'Then how did it get in the box?'],
            ...R[25].lines.slice(1).map((l, i) => [l[0], l[1], [28.0, 40.6][i], l[3], l[4]])],
    look: R[25].look,
    draw(lt, t) {
      if (lt < 3) { R[25].draw(lt, t); return; }
      const live = lt > 22.6, onPhone = lt > 9.6 && lt < 21;
      camK(lt, [[3, [960, 540, 1]], [32.6, [960, 540, 1]], [38, [860, 110, 4]], [52, [860, 110, 4.2]]], () => {
        shop(g, t, true, { clock: 1.2, screen: live ? '#2a3430' : '#1a2a3a' });
        if (live) frozenTV(() => { shopHigh(g, t); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, 0, W, H); g.font = '700 70px monospace'; g.fillStyle = '#fff'; g.fillText('CAM-04', 80, 120); g.fillText('2026-11-21  01:12:' + String(Math.floor(lt % 60)).padStart(2, '0'), 760, 1000); }, t);
        person(g, 'beer', 760, 990, 580, P('beer', t, { look: lt > 31.4 ? 0 : .8, flip: true, arms: onPhone ? 'phone' : 'down', expr: lt > 14 ? 'worried' : 'neutral', nod: lt > 31.4 ? -6 : 0 }));
        if (lt > 43.8 && lt < 44.2) dome(g, 860, 80, 1.2);
        else { g.save(); g.translate(860, 92); g.fillStyle = '#2a2a30'; g.fillRect(-40, -22, 80, 44); g.fillStyle = '#1a1a1e'; g.beginPath(); g.ellipse(48, 0, 14, 16, 0, 0, 7); g.fill(); g.fillStyle = '#3a5a9a'; g.beginPath(); g.ellipse(48, 0, 7, 8, 0, 0, 7); g.fill(); if (lt > 32 && Math.floor(t * 2) % 2 === 0) { g.fillStyle = '#ff2a20'; g.beginPath(); g.arc(-28, -12, 5, 0, 7); g.fill(); } g.restore(); }
      });
      black(1 - seg(lt, 3, 3.5)); black(seg(lt, 51.2, 52));
    } };

  // ---------- the episode ----------
  const S = [R[0], OPEN, R[1], R[2], GATE, R[4], STAIRS, PAUSE, LAB, R[8], ENH, DING, LIFT, THING, REFL, MSG, R[15], R[16], R[17], R[18], TL, R[19], LEAVE, CAR, ARRIVE, R[22], OAT, R[24], NIGHT, R[26]];
  return S;
};
