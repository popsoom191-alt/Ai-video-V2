// "แสนล้าน" · บทที่ ๔ "เฮียกิม" (24–26): the pawnshop lessons, the business with Nun, the peak, เฮียกิม dies, the ring,
// the betrayal at the shareholders' meeting, the fall (drink, gambling, selling everything, the bridge), mum's voice, the box.
import './cast_sanlan.js';
import * as B from './bg_sanlan.js';
import * as B2 from './bg_sanlan2.js';
import UI, { thai, baht } from './sanlan_ui.js';
export default (api) => {
  const { g, W, H, TH, person, extra, P, camK, mover, cam, dof, black, seg, ease, lerp, hash } = api;
  const U = UI(api);
  const warm = { tone: 'warm', v: .45 }, bright = { tone: 'day', v: .35, atmo: [['beams', { a: .16 }]] }, cold = { tone: 'night', v: .6 }, rain = { tone: 'night', v: .65, atmo: [['rain', { a: .3, n: 320 }]] };
  const hud = (yr, age, money, falls, warn = 3) => ({ noClock: true, fields: [yr, age, money, falls], warn });
  const CH = { d: 6, look: false, draw(lt) { U.chapterCard(lt, 6, '๔', 'เฮียกิม', '๒๕๖๓–๒๕๖๕ · ๒๔–๒๖ ปี'); } };

  // the pawnshop: เฮียกิม's lesson about losses
  const KIM = { d: 50, look: warm, hud: hud('๒๕๖๓', '๒๔ ปี', '฿ ๔๑,๐๐๐', 'ล้ม ๒๐'), ev: [[0, 'drips']],
    lines: [['s4n1', 'narr', 1.4, 'คุณเข้าโรงรับจำนำครั้งแรกเพื่อจำนำนาฬิกา… แล้วกลับมาทุกสัปดาห์เพื่อฟังชายคนหนึ่งพูด', 'You first came to the pawnshop to pawn a watch… then came back every week to listen to one man.'],
            ['s4k1', 'kim', 11.4, 'ลื้อถามผิด อย่าถามว่าได้เท่าไร', "You're asking the wrong thing. Don't ask how much you'll make."],
            ['s4k2', 'kim', 17.4, 'ถามว่าเสียได้เท่าไร', 'Ask how much you can afford to lose.', true],
            ['s4n2', 'narr', 23.6, 'เฮียกิมสอนเรื่องความเสี่ยง ความอดทน และการรอ', 'เฮียกิม taught you risk, patience, and waiting.'],
            ['s4n3', 'narr', 38.6, 'เป็นครั้งแรกที่มีคนสอนคุณ โดยไม่หัวเราะใส่', 'The first time anyone taught you without laughing at you.']],
    acts: [['kim', 'point', 11, 2.4], ['pan22', 'chin', 18.6, 6], ['kim', 'countMoney', 25, 10], ['pan22', 'nodLong', 36.6]],
    draw(lt, t) {
      camK(lt, [[0, [1200, 560, 1.1]], [10, [1300, 600, 1.3]], [24, [1200, 600, 1.15]], [50, [1200, 600, 1.18]]], () => {
        B2.pawnshop(g, t);
        person(g, 'kim', 1460, 860, 500, P('kim', t, { flip: true, look: .6 }));
        person(g, 'pan22', 1080, 1010, 580, P('pan22', t, { look: .6 }));
      });
      U.knowledge(lt, 25, 37, '๑๐%', 'กฎของเฮียกิม', ['ลงทุนแต่ละครั้ง เสี่ยงไม่เกิน ๑๐% ของที่มี', 'ถ้าเสียหมด ต้องยังมีข้าวกิน', 'ไม่มีกำไรไหนคุ้มกับการหมดตัว'], 'หลักบริหารความเสี่ยงพื้นฐาน (position sizing)', 'l');
      U.fade(lt, 50);
    } };

  // Nun again, the company, the peak: office, the money climbing, the magazine cover
  const PEAK = { d: 52, look: bright, hud: { noClock: true, fields: ['๒๕๖๔', '๒๕ ปี', lt => baht(41000 + 48000000 * Math.pow(seg(lt, 4, 36), 2.2)), 'ล้ม ๒๐'] }, ev: [[2, 'door'], ...Array.from({ length: 8 }, (_, i) => [8 + i * 3, 'type'])],
    lines: [['s4n4', 'narr', 1.4, 'แล้วนุ่นก็กลับมาในชีวิตคุณ', 'Then Nun came back into your life.'],
            ['s4u1', 'nun25', 6.6, 'ฉันจำได้ นายคือคนที่ไม่กลัวผิด', "I remember. You're the one who isn't afraid of being wrong."],
            ['s4n5', 'narr', 13.0, 'คุณขายเก่ง นุ่นวางระบบเก่ง สองปีบริษัทเล็ก ๆ โตเป็นร้อยล้าน', 'You could sell; Nun could build systems. In two years a little company grew to a hundred million.'],
            ['s4n6', 'narr', 26.0, 'คุณขึ้นปกนิตยสาร มีรถ มีคอนโด', 'You made a magazine cover. A car. A condo.'],
            ['s4n7', 'narr', 36.4, 'และนุ่นก็กลายเป็นคนที่คุณรัก', 'And Nun became the one you loved.']],
    acts: [['nun25', 'handshake', 9, 2.6], ['pan25', 'handshake', 9, 2.6], ['pan25', 'point', 18, 2.4], ['nun25', 'laugh', 37, 2], ['pan25', 'laugh', 37.2, 2]],
    draw(lt, t) {
      camK(lt, [[0, [800, 600, 1.15]], [20, [960, 560, 1.05]], [40, [700, 620, 1.2]], [52, [700, 620, 1.22]]], () => {
        B2.office(g, t, { grow: seg(lt, 4, 36) });
        person(g, 'nun25', 820, 1000, 560, P('nun25', t, { flip: true, look: .6 }));
        person(g, 'pan25', 540, 1000, 580, P('pan25', t, { look: .6, expr: 'smile' }));
      });
      U.magazine(lt, 24, 35);
      U.fade(lt, 52);
    } };

  // เฮียกิม's funeral; his daughter
  const FUNERAL = { d: 36, look: { tone: 'day', v: .5 }, hud: hud('๒๕๖๕', '๒๖ ปี', '฿ ๔๘,๐๐๐,๐๐๐', 'ล้ม ๒๐'),
    lines: [['s4n8', 'narr', 1.4, 'ต้นปีนั้น เฮียกิมจากไปอย่างเงียบ ๆ', 'Early that year, เฮียกิม passed away quietly.'],
            ['s4n9', 'narr', 9.0, 'คุณไม่ได้ร้องไห้ในงาน… คุณร้องในรถ', "You didn't cry at the funeral… you cried in the car."],
            ['s4n10', 'narr', 19.0, 'ลูกสาวเฮียกิมบอกว่า พ่อฝากของไว้ให้คุณ… แต่คุณยังไม่ว่างไปรับ', 'His daughter said her father had left something for you… you were too busy to collect it.']],
    acts: [['pan25', 'sigh', 6, 3], ['kimd', 'bowSorry', 20, 2.4]],
    draw(lt, t) {
      camK(lt, [[0, [960, 460, 1.2]], [36, [960, 560, 1.05]]], () => {
        B2.funeral(g, t);
        person(g, 'kimd', 1340, 1000, 540, P('kimd', t, { flip: true, look: .6, expr: 'sad' }));
        person(g, 'pan25', 600, 1010, 580, P('pan25', t, { look: .6, expr: 'sad' }));
      });
      U.fade(lt, 36);
    } };

  // the ring, the night before
  const RING = { d: 22, look: { tone: 'night', v: .5 }, hud: hud('๒๕๖๕', '๒๖ ปี', '฿ ๔๘,๐๐๐,๐๐๐', 'ล้ม ๒๐'),
    lines: [['s4n11', 'narr', 1.6, 'คืนก่อนประชุมผู้ถือหุ้น คุณซื้อแหวนวงหนึ่ง', 'The night before the shareholders\' meeting, you bought a ring.'],
            ['s4n12', 'narr', 10.4, 'พรุ่งนี้หลังประชุม… คุณจะขอเธอแต่งงาน', 'Tomorrow, after the meeting… you would ask her to marry you.']],
    draw(lt, t) {
      g.fillStyle = '#16141a'; g.fillRect(0, 0, W, H); const gr = g.createRadialGradient(960, 560, 30, 960, 560, 700); gr.addColorStop(0, 'rgba(255,220,170,.3)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      const o = ease(seg(lt, 4, 6.4)); g.save(); g.translate(960, 600 + Math.sin(t) * 6);
      g.fillStyle = '#c48a60'; g.beginPath(); g.ellipse(0, 160, 420, 200, 0, 0, 7); g.fill();
      g.fillStyle = '#6a1a2a'; g.fillRect(-150, -40, 300, 160); g.save(); g.translate(0, -40); g.rotate(-o * 1.2); g.fillStyle = '#7a2232'; g.fillRect(-150, -150, 300, 150); g.restore();
      g.fillStyle = '#e8e0d0'; g.fillRect(-120, -20, 240, 120); g.strokeStyle = '#e0c060'; g.lineWidth = 12; g.beginPath(); g.ellipse(0, 30, 50, 22, 0, 0, 7); g.stroke(); g.fillStyle = '#f0f8ff'; g.beginPath(); g.moveTo(0, -8); g.lineTo(16, 8); g.lineTo(0, 22); g.lineTo(-16, 8); g.closePath(); g.fill();
      g.restore(); U.fade(lt, 22);
    } };

  // the shareholders' meeting: hands go up; Nun at the head of the table beside คุณธนา's man; she never looks at him
  const MEET = { d: 50, look: cold, hud: hud('๒๕๖๕', '๒๖ ปี', '฿ ๔๘,๐๐๐,๐๐๐', 'ล้ม ๒๐'), ev: [[20, 'sting2'], [27, 'door']],
    lines: [['s4t1', 'tman', 2.4, 'วาระที่สาม ปลดกรรมการผู้จัดการ เห็นด้วยกรุณายกมือ', 'Item three: removal of the managing director. Those in favour, raise your hands.'],
            ['s4n13', 'narr', 10.4, 'มือยกขึ้นทีละมือ… มือสุดท้ายคือของนุ่น', 'The hands went up one by one… the last was Nun\'s.'],
            ['s4n14', 'narr', 18.6, 'เธอไม่มองหน้าคุณเลย แม้แต่ครั้งเดียว', 'She never looked at you. Not once.', true],
            ['s4n15', 'narr', 28.0, 'เอกสารโอนหุ้นที่คุณเซ็นให้เพราะไว้ใจ… คือกุญแจดอกเดียวที่เขาต้องใช้', 'The share transfer you signed because you trusted her… was the only key they needed.']],
    acts: [['tman', 'raiseHand', 4, 12], ...[0, 1, 2, 3].map(i => [`b${i}`, 'raiseHand', 10 + i * 1.4, 12]), ['nun25', 'raiseHand', 16.6, 8], ['pan25', 'recoil', 20, 2]],
    draw(lt, t) {
      camK(lt, [[0, [960, 560, 1.05]], [16, [960, 560, 1.1]], [20, [1000, 600, 1.35]], [50, [960, 580, 1.12]]], () => {
        B2.meeting(g, t);
        const seats = [[440, 'b0'], [640, 'b1'], [1280, 'b2'], [1480, 'b3']];
        for (const [x, id] of seats) { const ex = extra(100 + x); const raised = lt > 10 + (+id[1]) * 1.4 && lt < 24; person(g, ex, x, 790, 380, { t, sit: true, seat: false, flip: x > 960, hands: raised ? { R: [34, -450] } : undefined }); }
        person(g, 'tman', 860, 760, 360, P('tman', t, { view: 'front' }));
        person(g, 'nun25', 1060, 760, 360, P('nun25', t, { view: 'front', look: -1, hands: lt > 16.6 && lt < 24 ? { R: [30, -440] } : undefined, expr: 'sad' }));
        const pm = mover(lt, [[0, 960], [27, 960], [32, 2200]]);
        person(g, 'pan25', pm.x, 1060, 620, P('pan25', t, pm.walk != null ? { walk: pm.walk } : { view: 'back' }));
      });
      U.knowledge(lt, 34, 49.4, '๑', 'ลายเซ็น', ['กลโกงที่ร้ายที่สุดใช้ความไว้ใจ ไม่ใช่ความโลภ', 'เอกสารที่เซ็นเพราะเชื่อใจ คือเอกสารที่อ่านน้อยที่สุด', 'อ่านทุกหน้า แม้คนที่ยื่นให้จะเป็นคนที่คุณรัก'], 'การฉ้อโกงโดยอาศัยความไว้วางใจ (affinity / trust-based fraud)', 'r');
      U.fade(lt, 50);
    } };

  // the fall · 1: drink, the calls she never answers, the message he types and deletes
  const msg = 'นุ่น… ทำไม ผมทำอะไรผิด ผมแค่อยากเจอเธออีกครั้ง';
  const DRINK = { d: 58, look: rain, hud: { noClock: true, fields: ['๒๕๖๕', '๒๖ ปี', lt => baht(2400000 - 700000 * seg(lt, 0, 58)), 'ล้ม ๒๐'] }, ev: [[18, 'dial'], [20.2, 'dial'], [36, 'type']],
    lines: [['s4n16', 'narr', 2.0, 'คุณยังมีเงินเหลือสองล้านสี่… พอจะเริ่มใหม่ได้สบาย', 'You still had two point four million… enough to start again.'],
            ['s4n17', 'narr', 9.6, 'แต่คุณไม่อยากเริ่ม', "But you didn't want to start."],
            ['s4n18', 'narr', 26.0, 'ไม่มีใครไม่เคยเศร้า…', 'No one is never sad…'],
            ['s4n19', 'narr', 31.0, 'รวมถึงคุณ', 'including you.', true]],
    acts: [['pan26', 'drink', 3, 5], ['pan26', 'headInHands', 9, 6], ['pan26', 'drink', 44, 5]],
    draw(lt, t) {
      if (lt > 16 && lt < 26) { U.phone(() => B2.condo(g, t, { bottles: 7 }), t, { title: 'นุ่น', call: lt < 23.5 ? 'กำลังโทร…' : 'ไม่มีผู้รับสาย', ended: lt > 23.5 }, 0, .4); U.fade(lt - 16, 10, .4, .4); return; }
      if (lt > 34 && lt < 44) { const L = { title: 'นุ่น', rows: [{ text: [...msg].slice(0, Math.floor([...msg].length * seg(lt, 34.4, 39))).join('') || ' ', me: true, deleted: lt > 40.6 }] }; U.phone(() => B2.condo(g, t, { bottles: 8 }), t, lt > 41.6 ? { title: 'นุ่น', rows: [] } : L, (lt % 2) / 2, .4); U.fade(lt - 34, 10, .4, .4); return; }
      camK(lt, [[0, [960, 600, 1.1]], [58, [960, 640, 1.3]]], () => { B2.condo(g, t, { bottles: Math.floor(4 + lt / 8) }); person(g, 'pan26', 900, 900, 560, P('pan26', t, { sit: true, seat: false, look: .2, expr: 'sad' })); });
      U.stageCard(lt, 44, 52, 1, 'ไม่ยอมรับ'); U.stageCard(lt, 52, 57.6, 2, 'โกรธ');
      U.fade(lt, 58);
    } };

  // the fall · 2: online gambling at three a.m.; why you can't stop
  const GAMBLE = { d: 44, look: { tone: 'tv', v: .62 }, hud: { noClock: true, fields: ['๒๕๖๕', '๒๖ ปี', lt => baht(Math.max(0, 1700000 - 1580000 * seg(lt, 2, 40) + 300000 * Math.sin(lt * .8) * (1 - seg(lt, 2, 40)))), lt => 'ล้ม ' + thai(20 + Math.floor(seg(lt, 4, 40) * 6))], warn: 3 }, ev: [...Array.from({ length: 10 }, (_, i) => [3 + i * 3.6, 'torch'])],
    lines: [['s4n20', 'narr', 1.4, 'ตีสาม คุณเปิดเว็บพนัน', 'Three a.m. You opened a gambling site.'],
            ['s4n21', 'narr', 8.6, 'ได้คืนนิดหน่อย… แล้วเสียหนักกว่าเดิม', 'A small win… then a bigger loss.'],
            ['s4n22', 'narr', 30.0, 'คุณรู้ทุกกลโกงในโลก… ยกเว้นกลโกงที่คุณหลอกตัวเอง', 'You knew every scam in the world… except the one you played on yourself.', true]],
    draw(lt, t) {
      camK(lt, [[0, [1110, 650, 1.6]], [44, [1060, 640, 1.3]]], () => { B2.condo(g, t, { bottles: 9, screen: true }); person(g, 'pan26', 940, 900, 560, P('pan26', t, { sit: true, seat: false, look: .9, expr: 'worried', hands: { R: [96, -250], L: [70, -246] } })); });
      U.knowledge(lt, 12, 28, '๑ ใน ๓', 'ครั้งที่ชนะ', ['ชนะไม่แน่นอน ทำให้สมองอยากลองอีก', 'เกือบชนะ รู้สึกเหมือนจะชนะครั้งหน้า', 'ยิ่งเสีย ยิ่งอยากได้คืน (ไล่ตามความเสีย)'], 'จิตวิทยาการพนัน: รางวัลแบบไม่แน่นอน · near-miss · loss chasing', 'l');
      U.stageCard(lt, 30, 43.4, 3, 'ต่อรอง');
      U.fade(lt, 44);
    } };

  // the fall · 3: selling everything, the loan shark, evicted; watching her laugh with others
  const SELLALL = { d: 52, look: cold, hud: { noClock: true, fields: ['๒๕๖๕', '๒๖ ปี', lt => lt < 8 ? '฿ ๑๒๐,๐๐๐' : lt < 20 ? '฿ ๘,๐๐๐' : '฿ ๐', lt => 'ล้ม ' + thai(26 + Math.floor(seg(lt, 0, 40) * 4))], warn: 3 }, ev: [[8, 'knock'], [12, 'door'], [30, 'step'], [30.5, 'step'], [31, 'step']],
    lines: [['s4n23', 'narr', 1.4, 'คุณขายรถ ขายคอนโด แล้วยืมเงินนอกระบบ', 'You sold the car, the condo, then borrowed from loan sharks.'],
            ['s4s1', 'shark', 9.6, 'พรุ่งนี้ไม่มีเงิน ก็ออกไป', 'No money tomorrow, you\'re out.'],
            ['s4n24', 'narr', 18.6, 'เพื่อนที่เคยมีหายไปหมด', 'The friends you had were all gone.'],
            ['s4n25', 'narr', 34.6, 'วันหนึ่งคุณไปยืนหน้าออฟฟิศเก่า เห็นนุ่นหัวเราะกับคนอื่น', 'One day you stood outside the old office and saw Nun laughing with someone else.']],
    acts: [['shark', 'point', 9, 3], ['pan26', 'bowSorry', 13, 2.4], ['nun25', 'laugh', 37, 3], ['tman', 'laugh', 37.4, 3]],
    draw(lt, t) {
      if (lt < 30) { camK(lt, [[0, [960, 600, 1.1]], [30, [800, 640, 1.25]]], () => { B2.condo(g, t, { bottles: 2 }); const sm = mover(lt, [[0, 2200], [8, 2200], [9.4, 1300], [17, 1300], [20, 2300]]); person(g, 'shark', sm.x, 1000, 580, P('shark', t, sm.walk != null ? { walk: sm.walk, flip: sm.flip ?? true } : { flip: true, look: .6 })); const pm = mover(lt, [[0, 900], [22, 900], [30, -200]]); person(g, 'pan26', pm.x, 1000, 580, P('pan26', t, pm.walk != null ? { walk: pm.walk, flip: true, hold: true } : { look: .6, expr: 'sad' })); }); U.fade(lt, 30); return; }
      camK(lt, [[30, [960, 560, 1.05]], [52, [1100, 560, 1.2]]], () => { B2.office(g, t, { grow: 1 }); person(g, 'nun25', 1100, 1000, 560, P('nun25', t, { look: .6, expr: 'smile' })); person(g, 'tman', 1360, 1000, 570, P('tman', t, { flip: true, look: .6 })); g.fillStyle = 'rgba(160,190,210,.28)'; g.fillRect(0, 0, W, H); person(g, 'pan26', 300, 1080, 760, P('pan26', t, { view: 'back' })); });
      U.stageCard(lt - 30, 6, 20.4, 4, 'ซึมเศร้า');
      U.fade(lt - 30, 22);
    } };

  // the fall · 4: under the footbridge, rain; the ring is gone; ฿0, fall 31; mum's voicemail
  const BRIDGE = { d: 70, look: rain, hud: hud('๒๕๖๕', '๒๖ ปี', '฿ ๐', 'ล้ม ๓๑'), ev: [[0, 'drips'], [34, 'drips'], [40, 'dial']],
    lines: [['s4n26', 'narr', 3.0, 'แหวนวงนั้น… คุณเอาไปลงพนันเป็นของชิ้นสุดท้าย', 'That ring… was the last thing you gambled away.'],
            ['s4n27', 'narr', 13.0, 'คนที่เคยขึ้นปกนิตยสาร ตอนนี้ไม่มีใครจำหน้าได้', 'The man who had been on a magazine cover. Now nobody knew his face.'],
            ['s4n28', 'narr', 24.0, 'คุณเปิดมือถือที่แบตเหลือหนึ่งขีด… มีข้อความเสียงค้างอยู่อันเดียว', 'You turned on your phone, one bar of battery left… there was one voice message.'],
            ['s4m1', 'mae', 43.6, 'ลูก… กลับบ้านมากินข้าวนะ แม่ทำแกงเขียวหวานไว้', 'Son… come home and eat. I made green curry.', true],
            ['s4n29', 'narr', 58.0, 'คุณร้องไห้ครั้งแรก ตั้งแต่วันที่เฮียกิมจากไป', 'You cried for the first time since เฮียกิม died.']],
    acts: [['pan26', 'headInHands', 6, 10], ['pan26', 'headInHands', 56, 12]],
    draw(lt, t) {
      if (lt > 36 && lt < 56) { U.phone(() => B2.footbridge(g, t), t, { title: 'แม่', avatar: '#b8643a', rows: [{ voice: true }, { text: 'แม่ ๒๒:๔๑ น.' }] }, 0, .45); U.fade(lt - 36, 20, .5, .5); return; }
      camK(lt, [[0, [960, 520, 1.02]], [30, [600, 760, 1.5]], [70, [560, 760, 1.55]]], () => { B2.footbridge(g, t); person(g, 'pan26', 560, 860, 520, P('pan26', t, { sit: 'floor', look: .2, expr: 'sad', blink: lt > 60 })); });
      U.stageCard(lt, 62, 69.4, 5, 'ยอมรับ');
      U.fade(lt, 70, 1.2, 1);
    } };

  // the pawnshop again: he comes to pawn grandma's coin; เฮียกิม's daughter gives him the box; the ledger; rule 5
  const BOX = { d: 54, look: warm, hud: hud('๒๕๖๖', '๒๗ ปี', '฿ ๐', 'ล้ม ๓๑'), ev: [[2, 'door'], [18, 'paper'], [24, 'paper']],
    lines: [['s4n30', 'narr', 1.4, 'เช้านั้นคุณถือของชิ้นสุดท้ายไปโรงรับจำนำ… เหรียญบาทของยาย', 'That morning you took the last thing you owned to the pawnshop… grandma\'s one-baht coin.'],
            ['s4d1', 'kimd', 10.4, 'พ่อบอกว่าวันหนึ่งคุณจะมา… พ่อฝากไว้', 'Dad said one day you would come… he left this for you.'],
            ['s4n31', 'narr', 18.4, 'ในกล่องมีสมุดบัญชีเล่มหนึ่ง… และโน้ตลายมือเฮียกิม', 'In the box was a ledger… and a note in เฮียกิม\'s hand.'],
            ['s4k3', 'kim', 26.0, 'ลื้อเสียหมดแล้ว… ที่เหลือมีแต่ได้', 'You\'ve lost everything already… from here on, there\'s only gain.', true],
            ['s4n32', 'narr', 34.4, 'สมุดเล่มนั้นเต็มไปด้วยหนี้ลับ… ของคุณธนา', 'The ledger was full of secret debts… คุณธนา\'s.']],
    acts: [['kimd', 'handOver', 12.6, 2.4], ['pan26', 'receive', 13, 2.4, { noProp: true }], ['pan26', 'readBook', 19, 14], ['pan26', 'fistPump', 44, 2]],
    draw(lt, t) {
      camK(lt, [[0, [1200, 560, 1.1]], [16, [1200, 600, 1.3]], [54, [1150, 600, 1.2]]], () => {
        B2.pawnshop(g, t, { box: lt < 13 });
        person(g, 'kimd', 1460, 860, 500, P('kimd', t, { flip: true, look: .6 }));
        const pm = mover(lt, [[0, 300], [5, 1080]]);
        person(g, 'pan26', pm.x, 1010, 580, P('pan26', t, pm.walk != null ? { walk: pm.walk } : { look: .6, expr: lt > 30 ? 'neutral' : 'sad' }));
      });
      U.rulePage(lt, 42, 53.4, 5, 'ล้มได้ แต่ห้ามนอนนาน');
      U.fade(lt, 54);
    } };
  return [CH, KIM, PEAK, FUNERAL, RING, MEET, DRINK, GAMBLE, SELLALL, BRIDGE, BOX];
};
