// "แสนล้าน" · บทที่ ๒ "สอบตก" (2554 · 15): failing, Nun, the first savings, พี่โอ's scheme, losing it all.
import './cast_sanlan.js';
import * as B from './bg_sanlan.js';
import * as B2 from './bg_sanlan2.js';
import UI, { thai, baht } from './sanlan_ui.js';
export default (api) => {
  const { g, W, H, TH, person, extra, P, camK, mover, cam, dof, black, seg, ease, lerp, hash } = api;
  const U = UI(api);
  const teen = { tone: 'warm', v: .45, atmo: [['dust', { a: .25 }]] }, cold = { tone: 'night', v: .55 };
  const hud = (money, falls, warn) => ({ noClock: true, fields: ['๒๕๕๔', '๑๕ ปี', money, falls], warn });
  const CH = { d: 6, look: false, draw(lt) { U.chapterCard(lt, 6, '๒', 'สอบตก', '๒๕๕๔ · ๑๕ ปี'); } };

  // the results on the board: 3 out of 30, read aloud
  const RESULTS = { d: 34, look: teen, hud: hud('฿ ๑๗', 'ล้ม ๑'), ev: [[0, 'classroom'], [12, 'laughKids']],
    lines: [['s2n1', 'narr', 1.4, 'เจ็ดปีผ่านไป คุณยังเรียนไม่เก่งเหมือนเดิม', 'Seven years on, you were still bad at school.'],
            ['s2t1', 'teacher', 7.4, 'ปั้น… สามคะแนน จากสามสิบ', 'Pan… three out of thirty.'],
            ['s2n2', 'narr', 13.6, 'ครูอ่านคะแนนของคุณดังกว่าคนอื่น', 'The teacher read your score louder than the others.'],
            ['s2n3', 'narr', 20.0, 'ทั้งห้องหัวเราะ… ยกเว้นคนเดียว', 'The whole room laughed… except one.'],
            ['s2n4', 'narr', 27.0, 'นุ่น ที่หนึ่งของห้อง', 'Nun. Top of the class.']],
    acts: [['kidA', 'laugh', 11.6, 3], ['kidC', 'laugh', 11.8, 3], ['kidE', 'laugh', 12, 3], ['pan15', 'sigh', 10, 3]],
    draw(lt, t) {
      camK(lt, [[0, [960, 560, 1.04]], [18, [1100, 680, 1.3]], [26, [700, 680, 1.4]], [34, [700, 680, 1.45]]], () => {
        B.classroom(g, t);
        person(g, 'teacher', 300, 900, 560, P('teacher', t, { view: 'front' }));
        [['kidA', 620, 860], ['nun', 1060, 860], ['kidC', 1500, 860]].forEach(([id, x, y]) => person(g, id, x, y, id === 'nun' ? 520 : 470, P(id, t, { sit: true, flip: true, look: id === 'nun' && lt > 20 ? -.6 : .5, expr: id === 'nun' ? 'neutral' : undefined })));
        B.desks(g, [[880, 1]]);
        person(g, 'kidE', 1700, 990, 500, P('kidE', t, { sit: true, flip: true, look: .5 }));
        person(g, 'pan15', 900, 1000, 560, P('pan15', t, { sit: true, flip: true, look: .5, expr: 'sad' }));
        B.desks(g, [[1000, 1.12]]);
      });
      U.fade(lt, 34);
    } };

  // after school, Nun tutors him; her mother pulls her away
  const TUTOR = { d: 44, look: { tone: 'warm', v: .45, atmo: [['beams', { a: .14 }]] }, hud: hud('฿ ๑๗', 'ล้ม ๑'),
    lines: [['s2u1', 'nun', 2.0, 'ข้อนี้ไม่ยากหรอก นายแค่รีบเกินไป', "This one isn't hard. You just rush."],
            ['s2n5', 'narr', 7.6, 'นุ่นสอนคุณทุกเย็น คุณเข้าใจช้า… แต่ไม่เคยเลิกถาม', 'Nun tutored you every evening. You were slow… but you never stopped asking.'],
            ['s2u2', 'nun', 15.4, 'นายผิดบ่อย แต่นายไม่กลัวผิด', "You're wrong a lot. But you're not afraid of being wrong.", true],
            ['s2n6', 'narr', 22.6, 'แล้ววันหนึ่ง แม่ของนุ่นมารับ', 'Then one day her mother came to fetch her.'],
            ['s2mo', 'aunty', 27.4, 'นุ่น กลับบ้าน อย่าไปคบเด็กสลัม', "Nun, home. Don't hang around slum kids."],
            ['s2n7', 'narr', 33.4, 'คุณไม่ได้โกรธ คุณแค่จดคำนั้นไว้', "You weren't angry. You just wrote that word down."]],
    acts: [['nun', 'point', 1.4, 2.4], ['pan15', 'readBook', 4, 14], ['nun', 'laugh', 18.6], ['aunty', 'point', 27, 2.4], ['pan15', 'writePen', 34, 5, { noProp: true }]],
    draw(lt, t) {
      camK(lt, [[0, [900, 640, 1.25]], [20, [960, 600, 1.1]], [34, [700, 700, 1.4]], [44, [700, 700, 1.42]]], () => {
        B.classroom(g, t);
        const nm = mover(lt, [[0, 1080], [30.4, 1080], [33.6, 2300]]), am = mover(lt, [[0, 2300], [24, 2300], [26.6, 1500], [30.4, 1500], [33.6, 2400]]);
        if (lt > 23.6) person(g, 'aunty', am.x, 990, 560, P('aunty', t, am.walk != null ? { walk: am.walk, flip: am.flip } : { flip: true, look: .6, expr: 'frown' }));
        person(g, 'nun', nm.x, 1000, 540, P('nun', t, nm.walk != null ? { walk: nm.walk } : { sit: true, flip: true, look: .6 }));
        person(g, 'pan15', 760, 1000, 560, P('pan15', t, { sit: true, look: .6, expr: lt > 28 ? 'sad' : 'neutral' }));
        B.desks(g, [[1000, 1.12]]);
      });
      U.fade(lt, 44);
    } };

  // he sells phone cards and snacks; the savings grow to 12,000
  const money = lt => Math.floor(17 + (12000 - 17) * Math.pow(seg(lt, 4, 30), 1.6));
  const SELL = { d: 36, look: teen, hud: { noClock: true, fields: ['๒๕๕๔', '๑๕ ปี', lt => baht(money(lt)), 'ล้ม ๑'] }, ev: [...Array.from({ length: 12 }, (_, i) => [5 + i * 2.2, 'paper'])],
    lines: [['s2n8', 'narr', 1.4, 'คุณเรียนไม่เก่ง แต่คุณขายเก่ง', "You were bad at school. But you could sell."],
            ['s2n9', 'narr', 7.2, 'บัตรเติมเงิน ขนม ปากกา ทุกอย่างที่เพื่อนขาด', 'Top-up cards, snacks, pens. Whatever your friends ran out of.'],
            ['s2n10', 'narr', 15.0, 'คุณเก็บทุกบาท ไม่ซื้ออะไรให้ตัวเองเลยสักอย่าง', 'You kept every baht. You bought nothing for yourself.'],
            ['s2n11', 'narr', 24.6, 'หนึ่งปี คุณมีเงินก้อนแรกในชีวิต หนึ่งหมื่นสองพันบาท', 'In a year you had the first real money of your life. Twelve thousand baht.', true]],
    acts: [['pan15', 'handOver', 4.6, 2.2, { noProp: true }], ['pan15', 'receive', 8.4, 2.2, { noProp: true }], ['pan15', 'countMoney', 14, 8], ['pan15', 'fistPump', 30, 2]],
    draw(lt, t) {
      camK(lt, [[0, [960, 620, 1.1]], [20, [900, 680, 1.3]], [36, [900, 680, 1.32]]], () => {
        B.schoolGate(g, t);
        for (const [s, sp, ph] of [[1, 1, 0], [2, -1, .4], [3, 1, .7]]) { const x = ((t * 80 * sp + ph * 2600) % 2600 + 2600) % 2600 - 300; person(g, ['kidA', 'kidB', 'kidC'][s - 1], x, 960, 470, { t, walk: t * 8 + s, flip: sp < 0 }); }
        const cm = mover(lt, [[0, 2300], [2, 2300], [4.4, 1120], [10.6, 1120], [13, 2300]]);
        person(g, 'kidD', cm.x, 990, 480, P('kidD', t, cm.walk != null ? { walk: cm.walk, flip: cm.flip ?? true } : { flip: true, look: .6 }));
        person(g, 'pan15', 900, 1000, 560, P('pan15', t, { look: .6, expr: lt > 28 ? 'smile' : 'neutral' }));
        B.basket(g, 930, 790, 1.2, 6);
      });
      U.fade(lt, 36);
    } };

  // พี่โอ's seminar: "get rich fast, do nothing"
  const SEMINAR = { d: 46, look: { tone: 'warm', v: .5 }, hud: hud('฿ ๑๒,๐๐๐', 'ล้ม ๑'), ev: [[2, 'crowd'], [30, 'paper']],
    lines: [['s2o1', 'o', 2.4, 'รวยเร็ว ไม่ต้องทำอะไร', 'Get rich fast. Do nothing.', true],
            ['s2n12', 'narr', 7.4, 'พี่โอพูดเหมือนที่คุณอยากได้ยินทุกคำ', 'พี่โอ said every word you wanted to hear.'],
            ['s2o2', 'o', 13.6, 'ลงหมื่นสอง ได้คืนสามเท่าในหกเดือน', 'Put in twelve thousand. Get three times back in six months.'],
            ['s2n13', 'narr', 20.6, 'ทุกคนรอบตัวคุณยกมือ คุณก็ยกตาม', 'Everyone around you raised a hand. So did you.'],
            ['s2n14', 'narr', 28.6, 'เงินทั้งหมดที่คุณเก็บมาหนึ่งปี หายไปในห้านาที', 'A whole year of savings, gone in five minutes.']],
    acts: [['o', 'point', 2, 3], ['o', 'wave', 13.4, 2], ['pan15', 'raiseHand', 22, 3], ['pan15', 'handOver', 29.6, 2.4, { noProp: true }], ['o', 'receive', 30, 2.4, { noProp: true }], ['o', 'handshake', 33, 2.4]],
    draw(lt, t) {
      camK(lt, [[0, [960, 500, 1.05]], [12, [960, 480, 1.25]], [22, [960, 620, 1.1]], [36, [1000, 620, 1.2]], [46, [1000, 620, 1.22]]], () => {
        B2.seminar(g, t);
        const om = mover(lt, [[0, 960], [26, 960], [28.6, 1180]]);
        person(g, 'o', om.x, 600, 480, P('o', t, om.walk != null ? { walk: om.walk } : { view: lt < 26 ? 'front' : undefined, flip: lt > 28, expr: 'smile' }));
        const pm = mover(lt, [[0, 760], [26.4, 760], [29.4, 900]]);
        person(g, 'pan15', pm.x, 1060, 600, P('pan15', t, pm.walk != null ? { walk: pm.walk } : { view: lt < 26 ? 'back' : undefined, look: .6, expr: 'smile' }));
      });
      U.knowledge(lt, 36, 45.4, '๒,๐๐๐', 'คน', ['แชร์ลูกโซ่จ่ายคนเก่าด้วยเงินคนใหม่', 'ต้องหาคนใหม่เพิ่มเป็นทวีคูณทุกรอบ', 'ล้มเสมอ เมื่อหาคนใหม่ไม่ทัน'], 'ตัวอย่าง: ถ้าแต่ละคนต้องหาคนเพิ่ม ๓ คน รอบที่ ๗ ต้องใช้ ๒,๑๘๗ คน', 'l');
      U.fade(lt, 46);
    } };

  // six months later: the office is shut; HUD money to zero, falls go up
  const SHUT = { d: 40, look: cold, hud: { noClock: true, fields: ['๒๕๕๕', '๑๖ ปี', lt => lt > 6 ? '฿ ๐' : '฿ ๑๒,๐๐๐', lt => 'ล้ม ' + thai(lt > 6 ? 2 : 1)], warn: 3 }, ev: [[6, 'sting2'], [0, 'crowd']],
    lines: [['s2n15', 'narr', 1.4, 'หกเดือนต่อมา ประตูสำนักงานปิดตาย', 'Six months later the office door was shut.'],
            ['s2n16', 'narr', 8.0, 'สามพันคนยืนหน้าประตูเดียวกับคุณ', 'Three thousand people stood at the same door as you.'],
            ['s2n17', 'narr', 15.0, 'พี่โอหายไป เบอร์ปิด เฟซบุ๊กถูกลบ', 'พี่โอ was gone. Number dead. Facebook deleted.'],
            ['s2n18', 'narr', 22.6, 'คุณไม่รู้ว่าเบื้องหลังพี่โอมีใคร… อีกสิบห้าปีคุณถึงจะรู้', "You didn't know who stood behind พี่โอ… it would take fifteen years to find out."]],
    acts: [['pan15', 'headInHands', 9, 4], ['pan15', 'sigh', 17, 2.6]],
    draw(lt, t) {
      camK(lt, [[0, [960, 520, 1.05]], [14, [960, 600, 1.2]], [40, [900, 640, 1.3]]], () => {
        B2.shutOffice(g, t);
        for (let i = 0; i < 9; i++) person(g, extra(60 + i), 160 + i * 200, 1000 + (i % 2) * 30, 520, { t, view: 'back' });
        person(g, 'pan15', 980, 1060, 580, P('pan15', t, { view: lt < 8 ? 'back' : undefined, look: .3, expr: 'sad' }));
      });
      U.rulePage(lt, 29, 39.4, 2, 'เงินที่ได้ง่าย มีคนจ่ายแทนคุณเสมอ');
      U.fade(lt, 40);
    } };
  return [CH, RESULTS, TUTOR, SELL, SEMINAR, SHUT];
};
