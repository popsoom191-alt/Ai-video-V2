// "แสนล้าน" · บทที่ ๕ "ยุบ" (27–30): dishwasher who trusts no one, the investor who throws the file, the night market,
// the ledger and the nominees, the fake plans for clever people, the day the debts are called, the aide's question, Nun's apology.
import './cast_sanlan.js';
import * as B from './bg_sanlan.js';
import * as B2 from './bg_sanlan2.js';
import UI, { thai, baht } from './sanlan_ui.js';
export default (api) => {
  const { g, W, H, TH, person, extra, P, camK, mover, cam, dof, black, seg, ease, lerp, hash, market2 } = api;
  const U = UI(api);
  const cold = { tone: 'night', v: .55 }, tense = { tone: 'night', v: .5, atmo: [['glow', { x: 960, y: 300, r: 700, col: 'rgba(120,160,220,.12)' }]] }, bright = { tone: 'day', v: .35 };
  const hud = (yr, age, money, falls, warn) => ({ noClock: true, fields: [yr, age, money, falls], warn });
  const CH = { d: 6, look: false, draw(lt) { U.chapterCard(lt, 6, '๕', 'ยุบ', '๒๕๖๖–๒๕๖๙ · ๒๗–๓๐ ปี'); } };

  const DISH = { d: 38, look: cold, hud: hud('๒๕๖๖', '๒๗ ปี', '฿ ๓,๒๐๐', 'ล้ม ๓๑'),
    lines: [['s5n1', 'narr', 1.4, 'คุณกลับไปเริ่มจากศูนย์ ล้างจานในร้านเดิมที่เคยโดนถุยน้ำลาย', 'You started again from zero, washing dishes in the same restaurant where you were spat on.'],
            ['s5n2', 'narr', 12.0, 'ครั้งนี้คุณไม่เชื่อใครง่าย ๆ อีกแล้ว', 'This time you trusted no one easily.', true],
            ['s5n3', 'narr', 20.4, 'ไม่บอกใครว่าคุณเคยเป็นใคร ไม่บอกใครว่าคุณกำลังจะเป็นอะไร', 'You told no one who you had been. No one what you were about to become.']],
    acts: [['pan27', 'washDish', 2, 30]],
    draw(lt, t) { camK(lt, [[0, [900, 640, 1.3]], [38, [960, 600, 1.1]]], () => { B2.restaurant(g, t); person(g, 'pan27', 900, 1000, 580, P('pan27', t, { look: .5 })); }); U.fade(lt, 38); } };

  const INVESTOR = { d: 34, look: bright, hud: hud('๒๕๖๗', '๒๘ ปี', '฿ ๓๑๐,๐๐๐', 'ล้ม ๓๔', 3), ev: [[12, 'paper'], [13, 'thud']],
    lines: [['s5i1', 'investor', 2.4, 'คนที่เพิ่งล้มละลาย จะมาขอเงินใคร', 'Someone who just went bankrupt, asking who for money?'],
            ['s5n4', 'narr', 9.4, 'เขาโยนแฟ้มคืนต่อหน้าคุณ', 'He threw the file back in your face.'],
            ['s5n5', 'narr', 17.0, 'คุณเก็บแฟ้มขึ้นมา ปัดฝุ่น… แล้วยิ้ม', 'You picked it up, dusted it off… and smiled.'],
            ['s5n6', 'narr', 24.4, 'เพราะคุณไม่ได้มาขอเงิน… คุณมาดูว่าเขารู้อะไรบ้าง', "Because you hadn't come for money… you'd come to see what he knew."]],
    acts: [['investor', 'throwFile', 10, 1.8], ['pan27', 'pickFloor', 15, 2.8, { noProp: true }]],
    draw(lt, t) { camK(lt, [[0, [960, 600, 1.08]], [16, [700, 760, 1.4]], [34, [800, 640, 1.2]]], () => { B2.tower(g, t); person(g, 'investor', 1160, 1000, 580, P('investor', t, { flip: true, look: .6 })); person(g, 'pan27', 760, 1000, 580, P('pan27', t, { look: .6, expr: lt > 18 ? 'smile' : 'neutral' })); if (lt > 11 && lt < 16) { g.fillStyle = '#2a5a8a'; g.fillRect(lerp(1000, 820, seg(lt, 11, 12)), lerp(700, 990, seg(lt, 11, 12.4)), 60, 40); } }); U.fade(lt, 34); } };

  const LEDGER = { d: 48, look: { tone: 'night', v: .55, atmo: [['glow', { x: 600, y: 700, r: 500, col: 'rgba(255,220,160,.16)' }]] }, hud: hud('๒๕๖๗', '๒๘ ปี', '฿ ๓๑๐,๐๐๐', 'ล้ม ๓๔'), ev: [[2, 'paper'], [10, 'paper']],
    lines: [['s5n7', 'narr', 1.4, 'ทุกคืนคุณอ่านสมุดของเฮียกิม', 'Every night you read เฮียกิม\'s ledger.'],
            ['s5n8', 'narr', 8.6, 'คุณธนาไม่ได้รวยจากความฉลาดอย่างเดียว… เขารวยจากหนี้ที่ไม่มีใครรู้', 'คุณธนา wasn\'t rich from brains alone… he was rich on debts nobody knew about.'],
            ['s5n9', 'narr', 18.4, 'และชื่อพี่โอ อยู่ในหน้าแรก', 'And พี่โอ\'s name was on the first page.', true],
            ['s5n10', 'narr', 30.6, 'สิบห้าปีก่อน เงินหมื่นสองของคุณ ก็ไหลไปถึงเขา', 'Fifteen years ago your twelve thousand baht had flowed to him too.']],
    acts: [['pan27', 'readBook', 1, 26], ['pan27', 'chin', 28, 14]],
    draw(lt, t) { camK(lt, [[0, [700, 560, 1.3]], [48, [800, 560, 1.12]]], () => { B2.room(g, t, { night: true, notes: 40 }); person(g, 'pan27', 700, 1000, 580, P('pan27', t, { sit: true, look: .3 })); }); U.fade(lt, 48); } };

  const NOMINEE = { d: 46, look: tense, hud: { noClock: true, fields: ['๒๕๖๘', '๒๙ ปี', lt => baht(310000 + 820000000 * Math.pow(seg(lt, 2, 40), 2)), 'ล้ม ๔๐'] }, ev: [...Array.from({ length: 9 }, (_, i) => [4 + i * 3.6, 'paper'])],
    lines: [['s5n11', 'narr', 1.4, 'สามปี คุณสร้างใหม่อย่างเงียบ ๆ ผ่านบริษัทที่ไม่มีชื่อคุณสักบริษัท', 'For three years you rebuilt quietly, through companies that never carried your name.'],
            ['s5n12', 'narr', 13.0, 'แล้วคุณเริ่มซื้อหนี้ของคุณธนา ทีละก้อน ทีละธนาคาร', 'Then you started buying คุณธนา\'s debts. One at a time. One bank at a time.'],
            ['s5n13', 'narr', 26.0, 'เขาไม่รู้ว่าเจ้าหนี้ทุกรายของเขา… คือคนคนเดียวกัน', 'He didn\'t know that every one of his creditors… was the same man.', true]],
    draw(lt, t) {
      g.fillStyle = '#20242c'; g.fillRect(0, 0, W, H); const n = Math.floor(seg(lt, 3, 38) * 10);
      for (let i = 0; i < n; i++) { g.save(); g.translate(360 + (i % 5) * 300, 300 + Math.floor(i / 5) * 360); g.rotate((hash(i) - .5) * .2); g.fillStyle = '#f2eee0'; g.fillRect(-120, -150, 240, 300); g.fillStyle = '#2a2a30'; g.font = `700 22px ${TH}`; g.fillText('สัญญาโอนสิทธิเรียกร้อง', -108, -110); g.fillStyle = 'rgba(40,40,50,.5)'; for (let l = 0; l < 7; l++) g.fillRect(-100, -80 + l * 24, 200, 4); g.fillStyle = '#c8322c'; g.beginPath(); g.arc(60, 110, 30, 0, 7); g.fill(); g.restore(); }
      U.knowledge(lt, 30, 45.4, '๗๓%', 'ของหนี้ทั้งหมด', ['ซื้อสิทธิเรียกร้องหนี้ต่อจากเจ้าหนี้เดิม', 'ผ่านนิติบุคคลต่างชื่อ (นอมินี) หลายแห่ง', 'วันที่ครบกำหนด เรียกหนี้ได้พร้อมกันทั้งหมด'], 'กลไกการซื้อขายหนี้และการใช้นิติบุคคลถือแทน', 'r');
      U.fade(lt, 46);
    } };

  // fake plans leak; clever people overthink: branches of thought multiply over their heads
  const OVERTHINK = { d: 46, look: tense, hud: hud('๒๕๖๙', '๓๐ ปี', '฿ ๘๒๐,๐๐๐,๐๐๐', 'ล้ม ๔๔', 3),
    lines: [['s5n14', 'narr', 1.4, 'แล้วคุณปล่อยแผนปลอมให้รั่วไปถึงนุ่นและคุณธนา', 'Then you leaked fake plans to Nun and คุณธนา.'],
            ['s5n15', 'narr', 10.4, 'คนฉลาดไม่เชื่ออะไรง่าย ๆ เขาคิดต่อ… คิดซ้อน… คิดเผื่อ', "Clever people don't believe anything easily. They think further… deeper… ahead."],
            ['s5th1', 'thana', 21.6, 'ผมคิดไว้สิบทางแล้ว', "I've thought through ten ways already."],
            ['s5n16', 'narr', 27.4, 'แต่ไม่มีทางไหน… ที่ชื่อปั้น', 'But not one of them… was named Pan.', true]],
    acts: [['thana', 'chin', 2, 18], ['nun25', 'crossArms', 4, 18], ['tman', 'scratchHead', 14]],
    draw(lt, t) {
      camK(lt, [[0, [960, 560, 1.05]], [46, [960, 520, 1.15]]], () => {
        B2.tower(g, t);
        person(g, 'thana', 760, 1000, 580, P('thana', t, { look: .6 })); person(g, 'nun25', 1080, 1000, 560, P('nun25', t, { flip: true, look: .6 })); person(g, 'tman', 1360, 1000, 570, P('tman', t, { flip: true }));
        const k = seg(lt, 8, 30); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 3;
        const branch = (x, y, a, l, d) => { if (d > Math.floor(k * 5)) return; const x2 = x + Math.cos(a) * l, y2 = y + Math.sin(a) * l; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(x2, y2, 6, 0, 7); g.fill(); branch(x2, y2, a - .5, l * .72, d + 1); branch(x2, y2, a + .5, l * .72, d + 1); };
        branch(760, 560, -Math.PI / 2, 120, 0); branch(1080, 560, -Math.PI / 2, 110, 0);
      });
      U.fade(lt, 46);
    } };

  // the day: every debt called at once; คุณธนา's empire folds into Pan's
  const CALL = { d: 40, look: bright, hud: { noClock: true, fields: ['๒๕๖๙', '๓๐ ปี', lt => baht(820000000 + 4.2e9 * seg(lt, 10, 30)), 'ล้ม ๔๔'] }, ev: [[6, 'sting'], [8, 'door']],
    lines: [['s5n17', 'narr', 1.4, 'วันที่สิบห้า เดือนมีนา สองพันห้าร้อยหกสิบเก้า', 'The fifteenth of March, 2569.'],
            ['s5n18', 'narr', 7.6, 'คุณเรียกหนี้ทุกก้อนในวันเดียว', 'You called in every debt on the same day.'],
            ['s5n19', 'narr', 15.6, 'คุณธนาเพิ่งเห็นหน้าคุณครั้งแรก ในห้องประชุมของเขาเอง', 'คุณธนา saw your face for the first time, in his own meeting room.'],
            ['s5p1', 'pan30', 24.6, 'สวัสดีครับ ผมเป็นเจ้าหนี้ของคุณครับ', "Good morning. I'm your creditor."]],
    acts: [['thana', 'recoil', 20, 1.8], ['pan30', 'handshake', 26, 2.4]],
    draw(lt, t) {
      camK(lt, [[0, [960, 560, 1.05]], [18, [960, 600, 1.2]], [40, [900, 600, 1.25]]], () => {
        B2.meeting(g, t, { a: 'ประชุมเจ้าหนี้', b: 'เรียกชำระหนี้ทั้งหมด' });
        person(g, 'thana', 1100, 780, 380, P('thana', t, { view: 'front', expr: lt > 20 ? 'scared' : 'neutral' }));
        const pm = mover(lt, [[0, -200], [8, -200], [14, 820]]);
        person(g, 'pan30', pm.x, 1060, 620, P('pan30', t, pm.walk != null ? { walk: pm.walk } : { look: .6 }));
        person(g, 'aide', pm.x - 220, 1060, 600, P('aide', t, pm.walk != null ? { walk: pm.walk } : { look: .6 }));
      });
      U.fade(lt, 40);
    } };

  const AIDE = { d: 36, look: bright, hud: hud('๒๕๖๙', '๓๐ ปี', '฿ ๕,๐๒๐,๐๐๐,๐๐๐', 'ล้ม ๔๔'),
    lines: [['s5a1', 'aide', 2.0, 'แล้วบริษัทของคุณนุ่น จะให้จัดการด้วยไหมครับ', "And Ms. Nun's company — shall we deal with it too?"],
            ['s5p2', 'pan30', 9.0, 'จะเสียเวลากับบริษัทเล็ก ๆ ทำไม', 'Why waste time on a small company?'],
            ['s5p3', 'pan30', 15.6, 'ถ้ามันกลับมาเหยียบหน้าผมได้ ก็แสดงว่าผมยังเก่งไม่พอ ฉลาดไม่พอ', "If it can come back and step on my face, then I'm still not good enough, not clever enough.", true],
            ['s5p4', 'pan30', 25.4, 'สมควรแล้ว', 'And I\'d deserve it.']],
    acts: [['pan30', 'pockets', 6, 26]],
    draw(lt, t) { camK(lt, [[0, [960, 600, 1.1]], [36, [800, 600, 1.25]]], () => { B2.tower(g, t); person(g, 'aide', 1120, 1000, 570, P('aide', t, { flip: true, look: .6 })); person(g, 'pan30', 760, 1000, 590, P('pan30', t, { look: lt < 12 ? .6 : -.4 })); }); U.fade(lt, 36); } };

  // Nun's café: she apologises; the first notebook she kept; he leaves, and leaves her shop alone
  const NUN = { d: 56, look: { tone: 'warm', v: .45 }, hud: hud('๒๕๖๙', '๓๐ ปี', '฿ ๕,๐๒๐,๐๐๐,๐๐๐', 'ล้ม ๔๔'), ev: [[2, 'door'], [44, 'door']],
    lines: [['s5u1', 'nun25', 3.4, 'ฉันขอโทษ', "I'm sorry."],
            ['s5u2', 'nun25', 8.4, 'ฉันรู้ตั้งแต่ ม.สาม ว่าสักวันนายจะกลับมา… ฉันแค่อยากถึงก่อน', 'I knew from ninth grade that one day you\'d come back… I just wanted to get there first.', true],
            ['s5n20', 'narr', 19.6, 'ใต้เคาน์เตอร์ของเธอ มีสมุดเล่มเก่าเล่มหนึ่ง… สมุดกฎเล่มแรกของคุณ', 'Under her counter was an old notebook… your very first rule book.'],
            ['s5n21', 'narr', 30.4, 'คุณไม่รับเธอกลับ', "You didn't take her back."],
            ['s5n22', 'narr', 36.4, 'แต่คุณก็ไม่แตะร้านของเธอ', "But you didn't touch her shop either."]],
    acts: [['nun25', 'bowSorry', 2.6, 2.4], ['pan30', 'nodLong', 31], ['nun25', 'headInHands', 46, 8]],
    draw(lt, t) {
      if (lt > 21 && lt < 30) { g.fillStyle = '#2a2420'; g.fillRect(0, 0, W, H); g.save(); g.translate(960, 560); g.rotate(-.05); g.fillStyle = '#e8dcb8'; g.fillRect(-360, -240, 720, 480); g.fillStyle = '#c8322c'; g.fillRect(-312, -240, 4, 480); g.font = `600 30px ${TH}`; g.fillStyle = '#6a6a72'; g.fillText('สมุดกฎของปั้น', -280, -180); g.font = `600 40px ${TH}`; g.fillStyle = '#1e2a6a'; g.fillText('ข้อ ๑ อย่าให้ของก่อนได้เงิน', -280, -100); g.fillText('ข้อ ๒ เงินที่ได้ง่าย มีคนจ่ายแทนคุณเสมอ', -280, -30); g.restore(); g.fillStyle = 'rgba(168,128,74,.3)'; g.fillRect(0, 0, W, H); U.fade(lt - 21, 9, .5, .5); return; }
      camK(lt, [[0, [1100, 600, 1.1]], [20, [1000, 600, 1.25]], [56, [900, 600, 1.1]]], () => {
        B2.cafe(g, t);
        person(g, 'nun25', 1200, 1000, 560, P('nun25', t, { flip: true, look: .6, expr: 'sad' }));
        const pm = mover(lt, [[0, 900], [40, 900], [48, -200]]);
        person(g, 'pan30', pm.x, 1000, 590, P('pan30', t, pm.walk != null ? { walk: pm.walk, flip: true } : { look: .6 }));
      });
      U.fade(lt, 56);
    } };
  return [CH, DISH, INVESTOR, LEDGER, NOMINEE, OVERTHINK, CALL, AIDE, NUN];
};
