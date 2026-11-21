// "แสนล้าน" · บทที่ ๑ "เหรียญบาทของยาย" (?ep=s1), a sample of the narrated style of the reference clips:
// a second-person narrator (who 'narr', subtitles only for now), a few character lines, a HUD "year | age | ฿ | falls",
// a chapter card, a knowledge card, the first page of Pan's rule notebook, warm sepia for childhood.
import './cast_sanlan.js';
import * as B from './bg_sanlan.js';
export default (api) => {
  const { g, W, H, TH, person, extra, P, K, camK, mover, cam, dof, black, seg, ease, lerp, hash } = api;
  const { shack, curryStall, lampCorner, classroom, desks, schoolGate, basket } = B;
  const childhood = { tone: 'warm', v: .5, atmo: [['dust', { a: .35 }]] };
  const hudOf = (money, falls, warn) => ({ noClock: true, fields: ['๒๕๔๗', '๘ ขวบ', money, falls], warn });
  const fade = (lt, d) => { black(1 - seg(lt, 0, .7)); black(seg(lt, d - .8, d)); };
  const thai = n => String(n).replace(/\d/g, d => '๐๑๒๓๔๕๖๗๘๙'[d]);
  const counterFront = () => { g.fillStyle = '#a07a52'; g.fillRect(160, 560, 820, 140); g.fillStyle = '#7a5a3a'; g.fillRect(160, 560, 820, 16); g.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 8; i++) g.fillRect(170 + i * 102, 580, 3, 120); };

  // cards in the references' style
  const chapterCard = (lt, d, n, title, sub) => {
    g.fillStyle = '#141820'; g.fillRect(0, 0, W, H);
    const k = ease(seg(lt, .3, 1.1)); g.save(); g.globalAlpha = k;
    g.font = `500 28px ${TH}`; g.fillStyle = '#c8a050'; g.fillText(`— บทที่ ${n}`, 240, 440);
    g.font = `700 86px ${TH}`; g.fillStyle = '#f2f2ec'; g.fillText(title, 240, 540);
    g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(240, 580, 520 * ease(seg(lt, .6, 1.6)), 2);
    g.font = `600 32px ${TH}`; g.fillStyle = '#a8aab0'; g.fillText(sub, 240, 636); g.restore(); fade(lt, d);
  };
  const knowledge = (lt, a, b, big, unit, rows, src) => {
    const k = ease(seg(lt, a, a + .5)) * (1 - ease(seg(lt, b - .5, b))); if (k <= 0) return;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k; const x = 1180, y = 150 + (1 - k) * 20, w = 620, h = 140 + rows.length * 58;
    g.fillStyle = 'rgba(22,22,26,.86)'; g.beginPath(); g.roundRect(x, y, w, h, 14); g.fill();
    g.font = `500 22px ${TH}`; g.fillStyle = '#a8a8ae'; g.fillText('รู้หรือไม่', x + 34, y + 44);
    g.font = `700 76px ${TH}`; g.fillStyle = '#f2a24e'; g.fillText(big, x + 34, y + 120); const bw = g.measureText(big).width; g.font = `600 30px ${TH}`; g.fillStyle = '#f2f2ec'; g.fillText(unit, x + 48 + bw, y + 118);
    g.font = `500 28px ${TH}`; g.fillStyle = '#e2e2e2'; rows.forEach((r, i) => g.fillText('· ' + r, x + 34, y + 176 + i * 50));
    g.font = `500 17px ${TH}`; g.fillStyle = '#7a7a82'; g.fillText(src, x + 34, y + h - 18); g.restore();
  };
  const rulePage = (lt, a, b, n, rule) => {   // Pan's notebook: lined paper, a child's handwriting
    const k = ease(seg(lt, a, a + .6)) * (1 - ease(seg(lt, b - .5, b))); if (k <= 0) return;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k; g.translate(1300, 170 + (1 - k) * 24); g.rotate(-.03);
    g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 24; g.shadowOffsetY = 8; g.fillStyle = '#f4eedc'; g.fillRect(0, 0, 520, 300); g.shadowColor = 'transparent';
    g.strokeStyle = 'rgba(110,140,200,.35)'; g.lineWidth = 2; for (let y = 70; y < 300; y += 44) { g.beginPath(); g.moveTo(20, y); g.lineTo(500, y); g.stroke(); } g.fillStyle = '#d8323a'; g.fillRect(56, 0, 3, 300);
    g.font = `600 22px ${TH}`; g.fillStyle = '#6a6a72'; g.fillText('สมุดกฎของปั้น', 76, 46);
    g.font = `700 30px ${TH}`; g.fillStyle = '#1e2a6a'; g.fillText(`ข้อ ${thai(n)}`, 76, 108);
    const txt = [...rule].slice(0, Math.floor([...rule].length * seg(lt, a + .6, a + 2.4))).join(''); g.font = `600 40px ${TH}`; g.fillText(txt, 76, 168);
    if (lt > a + 2.6) { g.strokeStyle = '#d8323a'; g.lineWidth = 4; g.beginPath(); g.moveTo(76, 186); g.lineTo(76 + Math.min(1, seg(lt, a + 2.6, a + 3.2)) * 380, 186); g.stroke(); }
    g.restore();
  };

  // ---------- 0 · the title: "แสนล้าน", a counter running up to 100,000,000,000 ----------
  const TITLE = { d: 9, look: false, ev: [[0, 'end']], draw(lt, t) {
    const gr = g.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * .7); gr.addColorStop(0, '#2a2620'); gr.addColorStop(1, '#0c0b09'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 60; i++) { const y = (hash(i) * H + t * 40 * (1 + hash(i + 1))) % H; g.fillStyle = `rgba(230,190,90,${.08 + .1 * hash(i + 2)})`; g.beginPath(); g.ellipse(hash(i + 3) * W, y, 8, 3, 0, 0, 7); g.fill(); }   // coins drifting
    const k = ease(seg(lt, .5, 1.6)); g.save(); g.globalAlpha = k; g.textAlign = 'center';
    g.font = `700 150px ${TH}`; g.fillStyle = '#f2c14e'; g.fillText('แสนล้าน', W / 2, 520);
    const v = Math.floor(1e11 * Math.pow(seg(lt, 1.6, 7), 3)); g.font = `600 54px ${TH}`; g.fillStyle = '#e8e2d4'; g.fillText('฿ ' + v.toLocaleString('en-US'), W / 2, 640);
    g.font = `500 28px ${TH}`; g.fillStyle = '#8a8478'; g.globalAlpha = k * seg(lt, 6, 7); g.fillText('เรื่องของเด็กคนหนึ่งที่ล้มสี่สิบเจ็ดครั้ง', W / 2, 730); g.restore(); fade(lt, 9);
  } };
  const CH1 = { d: 6, look: false, draw(lt) { chapterCard(lt, 6, '๑', 'เหรียญบาทของยาย', '๒๕๔๗ · ๘ ขวบ'); } };

  // ---------- 2 · the shack at dawn: three leaks, mum at the stove ----------
  const SHACK = { d: 34, look: childhood, hud: hudOf('฿ ๐', 'ล้ม ๐'), ev: [[0, 'drips'], [11, 'step'], [11.5, 'step'], ...[12.8, 13.4, 14, 14.6, 15.2].map(a => [a, 'step'])],
    lines: [['s1n1', 'narr', 1.4, 'คุณเกิดในบ้านที่หลังคารั่วสามจุด', 'You were born in a house whose roof leaked in three places.'],
            ['s1n2', 'narr', 7.0, 'ทุกเช้า คุณตื่นมาพร้อมเสียงน้ำหยดลงชาม', 'Every morning you woke to water dripping into bowls.'],
            ['s1n3', 'narr', 13.2, 'แม่ตื่นก่อนคุณเสมอ ตีสี่ แกงหม้อแรกต้องเสร็จก่อนฟ้าสาง', 'Mum was always up first. Four a.m. The first pot had to be done by dawn.'],
            ['s1m1', 'mae', 20.6, 'ตื่นแล้วเหรอลูก ไปล้างหน้า แล้วมาช่วยแม่ยกหม้อ', "You're up? Wash your face, then help me carry the pot."],
            ['s1n4', 'narr', 27.0, 'คุณไม่รู้ว่าบ้านเราจน… จนกระทั่งมีคนบอก', "You didn't know you were poor… until someone told you."]],
    acts: [['mae', 'stir', 2, 17.4], ['pan8', 'standUp', 9.4, 2.4], ['pan8', 'stretch', 12.2, 2.4], ['pan8', 'nodLong', 24.6], ['mae', 'stir', 25.4, 8]],
    draw(lt, t) {
      camK(lt, [[0, [600, 760, 1.5]], [9, [700, 720, 1.35]], [14, [1300, 640, 1.2]], [26, [1200, 640, 1.15]], [34, [1100, 620, 1.1]]], () => {
        shack(g, t);
        const pm = mover(lt, [[0, 520], [12.6, 520], [15.6, 1380]]);
        person(g, 'pan8', pm.x, 980, 460, P('pan8', t, pm.walk != null ? { walk: pm.walk } : lt < 9.4 ? { sit: 'floor', blink: lt < 6, look: .2 } : { look: .6, sit: lt < 11.8 ? 'floor' : undefined }));
        person(g, 'mae', 1600, 990, 560, P('mae', t, { flip: !(lt < 19.6 || lt > 25), look: lt > 18 && lt < 24 ? .9 : .2 }));
      });
      fade(lt, 34);
    } };

  // ---------- 3 · mum's curry stall: Pan washes up and watches who pays what ----------
  const coinsInsert = () => {   // a palm with ฿12 where it should be ฿15
    g.fillStyle = '#2a2420'; g.fillRect(0, 0, W, H); const gr = g.createRadialGradient(960, 560, 50, 960, 560, 800); gr.addColorStop(0, 'rgba(255,220,170,.28)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.fillStyle = '#b8805a'; g.beginPath(); g.ellipse(960, 620, 420, 300, -.1, 0, 7); g.fill(); g.fillStyle = '#a87050'; g.beginPath(); g.ellipse(1000, 690, 330, 200, -.1, 0, 7); g.fill();
    for (let i = 0; i < 4; i++) { g.strokeStyle = '#a06a4a'; g.lineWidth = 70; g.lineCap = 'round'; g.beginPath(); g.moveTo(700 + i * 150, 420); g.lineTo(640 + i * 160, 220); g.stroke(); }
    const coin = (x, y, r, label, two) => { g.fillStyle = two ? '#c8c8c8' : '#d8b040'; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); if (two) { g.fillStyle = '#d8b040'; g.beginPath(); g.arc(x, y, r * .62, 0, 7); g.fill(); } g.fillStyle = 'rgba(0,0,0,.35)'; g.font = `700 ${r * .8}px ${TH}`; g.textAlign = 'center'; g.fillText(label, x, y + r * .28); g.textAlign = 'left'; };
    coin(860, 600, 92, '๑๐', true); coin(1060, 560, 70, '๑'); coin(1100, 700, 70, '๑');
    g.font = `700 64px ${TH}`; g.fillStyle = '#f2c14e'; g.fillText('฿ ๑๒', 1380, 300); g.font = `500 32px ${TH}`; g.fillStyle = '#e8e2d4'; g.fillText('จากราคา ๑๕', 1380, 352);
  };
  const STALL = { d: 54, look: childhood, hud: hudOf('฿ ๐', 'ล้ม ๐'), ev: [[0, 'market'], [44.6, 'step']],
    lines: [['s1n5', 'narr', 1.4, 'ร้านข้าวแกงของแม่ จานละสิบห้าบาท', "Mum's curry stall. Fifteen baht a plate."],
            ['s1n6', 'narr', 7.4, 'คุณล้างจานวันละร้อยกว่าใบ จนมือเปื่อยเป็นเรื่องปกติ', 'You washed over a hundred plates a day, until wrinkled hands were normal.'],
            ['s1n7', 'narr', 14.6, 'แต่ระหว่างล้างจาน คุณทำอีกอย่างหนึ่งที่ไม่มีใครสั่ง', 'But while you washed, you did one thing nobody asked you to.'],
            ['s1n8', 'narr', 21.2, 'คุณดูว่าใครจ่ายเงินยังไง', 'You watched how people paid.'],
            ['s1n9', 'narr', 26.8, 'ลุงคนนี้จ่ายสิบสองบาท แล้วเดินเร็วกว่าปกติ', 'This man paid twelve, and walked off faster than usual.', true],
            ['s1n10', 'narr', 33.6, 'คุณไม่ได้บอกแม่ แต่คุณจำหน้าเขาไว้', "You didn't tell Mum. But you remembered his face."],
            ['s1p1', 'pan8', 38.4, 'แม่ วันหนึ่งผมจะรวยนะ', "Mum, one day I'll be rich."],
            ['s1a1', 'aunty', 41.6, 'ลูกคนขายแกง จะไปรวยอะไร', "The curry seller's kid? Rich?"],
            ['s1n11', 'narr', 47.4, 'นั่นคือครั้งแรกที่คุณโดนหัวเราะใส่', 'That was the first time someone laughed at you.']],
    acts: [['pan8', 'washDish', 3, 20], ['mae', 'stir', 4, 12], ['mae', 'receive', 19.6, 2.2, { noProp: true }], ['pan8', 'washDish', 32, 5], ['aunty', 'laugh', 42.6, 2.4], ['mae', 'sigh', 45, 2.6], ['pan8', 'headShake', 48.6]],
    draw(lt, t) {
      if (lt > 23.6 && lt < 32.6) { coinsInsert(); black(1 - seg(lt, 23.6, 24.2)); black(seg(lt, 32, 32.6)); return; }
      camK(lt, [[0, [900, 600, 1.08]], [14, [1000, 640, 1.2]], [22, [800, 620, 1.25]], [33, [960, 640, 1.15]], [44, [1100, 640, 1.12]], [54, [1060, 620, 1.1]]], () => {
        curryStall(g, t);
        for (const [x, s, f] of [[1140, 41, false], [1480, 42, true], [1520, 43, false], [1860, 44, true]]) person(g, extra(s), x, 900, 520, { t, sit: true, seat: false, flip: f, hands: { L: [46, -250], R: [60, -244] } });
        const cm = mover(lt, [[0, 1700], [16, 1700], [19.4, 1060], [21.8, 1060], [25, -200]]);
        if (cm.x > -150) person(g, extra(45), cm.x, 980, 540, P('x', t, cm.walk != null ? { walk: cm.walk, flip: cm.flip } : { flip: true, hands: { R: [100, -250] } }));
        person(g, 'mae', 700, 696, 430, P('mae', t, { look: .4 }));
        counterFront();
        const am = mover(lt, [[0, 2100], [38.8, 2100], [41.4, 1400], [46, 1400], [50, 2200]]);
        if (lt > 38.8) person(g, 'aunty', am.x, 990, 540, P('aunty', t, am.walk != null ? { walk: am.walk, flip: am.flip ?? true } : { flip: true, look: .5 }));
        person(g, 'pan8', 980, 900, 460, P('pan8', t, { look: lt > 18 && lt < 23 ? .9 : .4, expr: lt > 42 ? 'sad' : 'neutral' }));
      });
      fade(lt, 54);
    } };

  // ---------- 4 · grandma under the lamp: "every baht must know where it goes" ----------
  const LAMP = { d: 52, look: { tone: 'warm', v: .62 }, hud: hudOf('฿ ๐', 'ล้ม ๐'), ev: [[0, 'crickets'], [30, 'paper']],
    lines: [['s1y1', 'yai', 3.6, 'เงินบาทเดียว ก็ต้องรู้ว่าไปไหน', 'Even one baht must know where it goes.', true],
            ['s1n12', 'narr', 22.6, 'ยายเก็บเหรียญทีละบาท ใส่โหลใบนี้มาสามสิบปี', 'Grandma had saved one baht at a time in this jar for thirty years.'],
            ['s1n13', 'narr', 29.4, 'คืนนั้น ยายให้คุณนับเอง', 'That night she let you count.'],
            ['s1n14', 'narr', 39.8, 'ยี่สิบเก้าบาท… คุณนับผิดสองรอบ', 'Twenty-nine baht… you got it wrong twice.'],
            ['s1y2', 'yai', 45.6, 'ไม่เป็นไร นับใหม่', "It's all right. Count again."]],
    acts: [['yai', 'countMoney', 1, 18], ['pan8', 'countMoney', 30.6, 9], ['pan8', 'scratchHead', 40.4], ['yai', 'laugh', 43], ['pan8', 'countMoney', 47.4, 4.6]],
    draw(lt, t) {
      camK(lt, [[0, [960, 600, 1.35]], [20, [960, 600, 1.3]], [30, [1000, 620, 1.45]], [52, [980, 610, 1.4]]], () => {
        lampCorner(g, t);
        person(g, 'yai', 820, 820, 520, P('yai', t, { sit: true, look: lt > 28 ? .8 : .3 }));
        person(g, 'pan8', 1130, 830, 470, P('pan8', t, { sit: true, flip: true, look: .4, expr: lt > 40 && lt < 46 ? 'worried' : 'neutral' }));
      });
      knowledge(lt, 10.6, 21.4, '฿ ๑', 'ในปี ๒๕๔๗', ['ลูกอม ๒ เม็ด', 'น้ำแข็งเปล่า ๑ แก้ว', 'ค่าแรงขั้นต่ำ กทม. ๑๗๐ บาท/วัน'], 'ค่าแรงขั้นต่ำ: ประกาศคณะกรรมการค่าจ้าง ๒๕๔๗');
      fade(lt, 52);
    } };

  // ---------- 5 · the classroom: "a hundred-billionaire" and the laughter ----------
  const CLASS = { d: 42, ev: [[0, 'classroom'], [18.8, 'laughKids'], [13.8, 'step']], look: { tone: 'warm', v: .45, atmo: [['beams', { a: .14 }], ['dust', { a: .3 }]] }, hud: hudOf('฿ ๐', 'ล้ม ๐'),
    lines: [['s1t1', 'teacher', 2.0, 'โตขึ้นอยากเป็นอะไรกันบ้าง', 'What do you all want to be when you grow up?'],
            ['s1k1', 'kidB', 6.4, 'หมอค่ะ', 'A doctor.'], ['s1k2', 'kidA', 8.8, 'ตำรวจครับ', 'A policeman.'],
            ['s1n15', 'narr', 12.0, 'แล้วก็ถึงตาคุณ', 'Then it was your turn.'],
            ['s1p2', 'pan8s', 16.6, 'เศรษฐีแสนล้านครับ', 'A hundred-billionaire.', true],
            ['s1n16', 'narr', 23.6, 'ทั้งห้องหัวเราะ… ครูก็ยิ้ม', 'The whole class laughed… so did the teacher.'],
            ['s1n17', 'narr', 30.0, 'คุณไม่รู้ด้วยซ้ำว่าแสนล้านมีศูนย์กี่ตัว… แต่คุณรู้ว่าคุณจะไม่หัวเราะตาม', "You didn't even know how many zeros it had… but you knew you wouldn't laugh along."]],
    acts: [['kidB', 'raiseHand', 4.6], ['kidA', 'raiseHand', 7.2], ['pan8s', 'standUp', 13.8, 2.2], ['kidA', 'laugh', 19, 3], ['kidB', 'laugh', 19.4, 3], ['kidC', 'laugh', 19.2, 3], ['kidD', 'laugh', 19.6, 3], ['kidE', 'laugh', 19.3, 3], ['teacher', 'laugh', 20.4, 2], ['pan8s', 'sitDown', 27.4, 2.2]],
    draw(lt, t) {
      camK(lt, [[0, [960, 560, 1.04]], [12, [1150, 700, 1.3]], [22, [960, 600, 1.08]], [30, [1150, 720, 1.4]], [42, [1150, 720, 1.45]]], () => {
        classroom(g, t);
        person(g, 'teacher', 300, 900, 560, P('teacher', t, { view: 'front' }));
        const kids = [['kidA', 620, 860], ['kidB', 1060, 860], ['kidC', 1500, 860], ['kidD', 840, 980], ['kidE', 1700, 980]];
        kids.slice(0, 3).forEach(([id, x, y]) => person(g, id, x, y, 440, P(id, t, { sit: true, flip: true, look: .5 })));
        desks(g, [[880, 1]]);
        kids.slice(3).forEach(([id, x, y]) => person(g, id, x, y, 480, P(id, t, { sit: true, flip: true, look: .5 })));
        person(g, 'pan8s', 1260, 990, 480, P('pan8s', t, lt > 13.8 && lt < 29.6 ? { flip: true, look: .5 } : { sit: true, flip: true, look: .5 }));
        desks(g, [[1000, 1.12]]);
      });
      fade(lt, 42);
    } };

  // ---------- 6 · the first sale at the school gate: "tomorrow" never comes → fall 1, rule 1 ----------
  const sold = lt => Math.min(17, Math.floor(seg(lt, 9, 46) * 9) * 2 - (lt > 46 ? 1 : 0));
  const GATE = { d: 50, look: { tone: 'warm', v: .45 },
    hud: { noClock: true, fields: ['๒๕๔๗', '๘ ขวบ', lt => '฿ ' + thai(Math.max(0, sold(lt))), lt => lt > 26 ? 'ล้ม ๑' : 'ล้ม ๐'], warn: 3 },
    ev: [...Array.from({ length: 8 }, (_, i) => [9 + i * 4.4, 'paper']), [17.6, 'whoosh'], [26, 'sting2']],
    lines: [['s1n18', 'narr', 1.4, 'สัปดาห์ต่อมา คุณขอขนมจากร้านแม่ มาขายหน้าโรงเรียน', 'The next week you took snacks from the stall to sell at the school gate.'],
            ['s1n19', 'narr', 7.6, 'ชิ้นละสองบาท', 'Two baht each.'],
            ['s1b1', 'bully', 12.6, 'ขอสามชิ้น พรุ่งนี้จ่ายนะ', "Three of those. I'll pay tomorrow."],
            ['s1p3', 'pan8s', 15.8, 'ได้… พรุ่งนี้นะ', 'Okay… tomorrow.'],
            ['s1n20', 'narr', 21.6, 'พรุ่งนี้ของเขา ไม่เคยมาถึง', 'His tomorrow never came.', true],
            ['s1n21', 'narr', 41.0, 'นั่นคือกฎข้อแรก ในสมุดที่คุณจะเขียนต่อไปอีกยี่สิบปี', 'That was the first rule, in a notebook you would keep writing for twenty years.']],
    acts: [['pan8s', 'handOver', 13.6, 2.2, { noProp: true }], ['bully', 'laugh', 16.4, 1.6], ['pan8s', 'sigh', 26.4, 2.6], ['pan8s', 'writePen', 31, 6, { noProp: true }]],
    draw(lt, t) {
      camK(lt, [[0, [960, 600, 1.05]], [12, [1100, 680, 1.3]], [20, [1000, 640, 1.15]], [28, [900, 700, 1.35]], [50, [900, 700, 1.38]]], () => {
        schoolGate(g, t);
        for (const [s, y, sp, ph] of [[51, 960, 1, 0], [52, 940, -1, .3], [53, 975, 1, .6], [54, 950, -1, .8]]) { const x = ((t * 90 * sp + ph * 2600) % 2600 + 2600) % 2600 - 300; person(g, ['kidA', 'kidB', 'kidC', 'kidD'][s - 51], x, y, 420, { t, walk: t * 8 + s, flip: sp < 0 }); }
        const bm = mover(lt, [[0, -300], [10, -300], [12.4, 1060], [17, 1060], [19.6, 2300]]);
        person(g, 'bully', bm.x, 990, 470, P('bully', t, bm.walk != null ? { walk: bm.walk * 1.3, flip: bm.flip } : { flip: true, look: .5, hold: false }));
        person(g, 'pan8s', 880, 990, 480, P('pan8s', t, { look: .6, expr: lt > 22 ? 'sad' : 'smile', hands: lt < 13.6 || lt > 16 && lt < 26 ? { R: [44, -250], L: [22, -248] } : undefined }));
        basket(g, 900, 760, 1, Math.max(0, 6 - Math.floor(seg(lt, 9, 46) * 6)));
      });
      rulePage(lt, 30, 40, 1, 'อย่าให้ของก่อนได้เงิน');
      fade(lt, 50);
    } };

  // ---------- 7 · that night: seventeen baht, counted right; "forty-six to go" ----------
  const END = { d: 26, ev: [[0, 'crickets']], look: { tone: 'warm', v: .62 }, hud: hudOf('฿ ๑๗', 'ล้ม ๑', 3),
    lines: [['s1n22', 'narr', 1.6, 'คืนนั้นคุณนับเหรียญสิบเจ็ดบาท… ไม่ผิดเลยสักรอบ', 'That night you counted seventeen baht… without a single mistake.'],
            ['s1n23', 'narr', 9.6, 'นั่นคือครั้งแรกที่คุณล้ม', 'That was the first time you fell.'],
            ['s1n24', 'narr', 15.4, 'ยังเหลืออีกสี่สิบหกครั้ง', 'Forty-six to go.', true]],
    acts: [['pan8', 'countMoney', .6, 9], ['pan8', 'fistPump', 16.6, 2]],
    draw(lt, t) {
      camK(lt, [[0, [1040, 640, 1.5]], [26, [1000, 600, 1.2]]], () => {
        lampCorner(g, t);
        person(g, 'yai', 820, 820, 520, P('yai', t, { sit: true, blink: true, nod: 6 }));
        person(g, 'pan8', 1130, 830, 470, P('pan8', t, { sit: true, flip: true, look: .4, expr: lt > 15 ? 'smile' : 'neutral' }));
      });
      black(1 - seg(lt, 0, .7)); black(seg(lt, 23.5, 26));
    } };

  return [TITLE, CH1, SHACK, STALL, LAMP, CLASS, GATE, END];
};
