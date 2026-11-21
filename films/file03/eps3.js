// "แสนล้าน" · บทที่ ๓ "โดนหลอกทุกแบบ" (2561 · 22): leaving home, every job, spat on, every scam, the wall of notes, reading people.
import './cast_sanlan.js';
import * as B from './bg_sanlan.js';
import * as B2 from './bg_sanlan2.js';
import UI, { thai, baht } from './sanlan_ui.js';
export default (api) => {
  const { g, W, H, TH, person, extra, P, camK, mover, cam, black, seg, ease, lerp, hash, market2, cityRoad, vehicle } = api;
  const U = UI(api);
  const grey = { tone: 'night', v: .5 }, warm = { tone: 'warm', v: .45 };
  const hud = (money, falls, warn = 3) => ({ noClock: true, fields: ['๒๕๖๑', '๒๒ ปี', money, falls], warn });
  const CH = { d: 6, look: false, draw(lt) { U.chapterCard(lt, 6, '๓', 'โดนหลอกทุกแบบ', '๒๕๖๑ · ๒๒ ปี'); } };

  // leaving the canal for Bangkok: yai hangs grandma's one-baht coin round his neck
  const LEAVE = { d: 42, look: warm, hud: hud('฿ ๘๐๐', 'ล้ม ๒'), ev: [[0, 'market'], ...[30, 30.5, 31, 31.5, 32, 32.5].map(a => [a, 'step'])],
    lines: [['s3n1', 'narr', 1.4, 'ยี่สิบสองปี คุณเก็บเสื้อผ้าใส่ถุงใบเดียว แล้วเข้ากรุงเทพ', 'At twenty-two you packed one bag and went to Bangkok.'],
            ['s3y1', 'yai', 9.4, 'เหรียญบาทนี้ของยาย อย่าใช้นะ เก็บไว้', "This baht is mine. Don't spend it. Keep it."],
            ['s3m1', 'mae', 16.4, 'กินข้าวให้ตรงเวลานะลูก', 'Eat on time, son.'],
            ['s3n2', 'narr', 22.0, 'คุณสัญญากับตัวเองว่าจะไม่กลับมามือเปล่า', 'You promised yourself you would not come back empty-handed.']],
    acts: [['yai', 'handOver', 8.6, 2.4], ['pan22', 'receive', 9, 2.4, { noProp: true }], ['mae', 'wave', 30, 3], ['yai', 'wave', 30.4, 3], ['pan22', 'wave', 29.4, 2]],
    draw(lt, t) {
      camK(lt, [[0, [1000, 620, 1.15]], [20, [900, 640, 1.2]], [34, [1300, 640, 1.1]], [42, [1300, 640, 1.1]]], () => {
        B.curryStall(g, t);
        person(g, 'mae', 1180, 990, 560, P('mae', t, { flip: true, look: .6 }));
        person(g, 'yai', 1360, 990, 500, P('yai', t, { flip: true, look: .6 }));
        const pm = mover(lt, [[0, 900], [28.8, 900], [36, -200]]);
        person(g, 'pan22', pm.x, 1000, 580, P('pan22', t, pm.walk != null ? { walk: pm.walk, flip: true } : { look: .6 }));
      });
      U.fade(lt, 42);
    } };

  // every job: the market at night, sacks on his shoulder; the falls keep counting
  const JOBS = { d: 40, look: grey, hud: { noClock: true, fields: ['๒๕๖๑', '๒๒ ปี', '฿ ๓๔๐', lt => 'ล้ม ' + thai(2 + Math.floor(seg(lt, 6, 30) * 3))], warn: 3 }, ev: [[0, 'crowd']],
    lines: [['s3n3', 'narr', 1.4, 'คุณทำทุกงานที่มีคนจ้าง', 'You took every job anyone would pay for.'],
            ['s3n4', 'narr', 7.6, 'แบกของตลาดตีสาม ส่งของตอนเที่ยง ล้างจานตอนกลางคืน', 'Hauling at the market at three a.m. Deliveries at noon. Dishes at night.'],
            ['s3n5', 'narr', 16.0, 'นายจ้างสองคนไม่จ่ายค่าแรง คนหนึ่งหนีไปพร้อมเงินมัดจำของคุณ', "Two bosses didn't pay. One ran off with your deposit."],
            ['s3n6', 'narr', 27.0, 'คุณไม่มีเวลาเศร้า… พรุ่งนี้ยังต้องตื่นตีสอง', 'There was no time to be sad… tomorrow you had to be up at two.']],
    acts: [['pan22', 'carrySack', 2, 14], ['pan22', 'dustOff', 30, 2.6]],
    draw(lt, t) {
      camK(lt, [[0, [800, 600, 1.15]], [40, [1100, 620, 1.12]]], () => {
        market2(g, t);
        for (let i = 0; i < 5; i++) person(g, extra(80 + i), 200 + i * 360, 980 + (i % 2) * 20, 500, { t, walk: t * 7 + i, flip: i % 2 > 0 });
        const pm = mover(lt, [[0, 300], [16, 1000], [30, 1000], [40, 1400]]);
        person(g, 'pan22', pm.x, 1010, 580, P('pan22', t, pm.walk != null && (lt < 2 || lt > 16) ? { walk: pm.walk } : { look: .5, expr: 'sad' }));
      });
      U.fade(lt, 40);
    } };

  // the restaurant: the wrong plate; he is spat on, wipes his face, says sorry, writes it down
  const SPIT = { d: 50, look: warm, hud: hud('฿ ๓๔๐', 'ล้ม ๕'), ev: [[13.6, 'whoosh'], [14.2, 'sting2']],
    lines: [['s3n7', 'narr', 1.4, 'ร้านอาหารแห่งหนึ่ง คุณเสิร์ฟผิดจาน', 'A restaurant. You brought the wrong plate.'],
            ['s3r1', 'rude', 8.0, 'นี่มันไม่ใช่ที่สั่ง! ตาบอดหรือไง', "This isn't what I ordered! Are you blind?"],
            ['s3n8', 'narr', 16.2, 'แล้วเขาก็ถุยน้ำลายใส่หน้าคุณ', 'Then he spat in your face.'],
            ['s3p1', 'pan22', 23.6, 'ขอโทษครับ', "I'm sorry."],
            ['s3n9', 'narr', 28.4, 'คุณเช็ดหน้า… ก้มหัว… แล้วเดินกลับเข้าครัว', 'You wiped your face… bowed… and went back to the kitchen.'],
            ['s3n10', 'narr', 36.4, 'คืนนั้นคุณจดชื่อร้าน วันที่ และหน้าของเขาไว้', "That night you wrote down the restaurant, the date, and his face."]],
    acts: [['pan22', 'handOver', 4, 2.2, { noProp: true }], ['rude', 'point', 8, 2.6], ['pan22', 'wipeFace', 18.6, 3.2], ['pan22', 'bowSorry', 22.6, 2.4]],
    draw(lt, t) {
      camK(lt, [[0, [960, 600, 1.08]], [10, [880, 600, 1.35]], [22, [820, 600, 1.45]], [30, [960, 620, 1.1]], [50, [960, 620, 1.12]]], () => {
        B2.restaurant(g, t);
        person(g, extra(90), 1480, 900, 520, { t, sit: true, seat: false, flip: true, hands: { L: [46, -250], R: [60, -244] } });
        const rs = lt > 7 && lt < 30;
        person(g, 'rude', 1000, 1000, 560, P('rude', t, rs ? { flip: true, look: .6, expr: 'frown' } : { sit: true, seat: false, flip: true, look: .5 }));
        const pm = mover(lt, [[0, 500], [3.6, 760], [28.6, 760], [33, -200]]);
        person(g, 'pan22', pm.x, 1000, 580, P('pan22', t, pm.walk != null ? { walk: pm.walk, flip: pm.flip } : { look: .6, expr: lt > 14 ? 'sad' : 'neutral' }));
        if (lt > 13.6 && lt < 14.3) { const k = seg(lt, 13.6, 14.3); g.fillStyle = 'rgba(220,230,240,.8)'; g.beginPath(); g.ellipse(lerp(940, 790, k), lerp(600, 520, k), 8, 5, 0, 0, 7); g.fill(); }
        if (lt > 14.3 && lt < 19) { g.fillStyle = 'rgba(220,230,240,.6)'; g.beginPath(); g.ellipse(792, 520, 10, 7, 0, 0, 7); g.fill(); }
      });
      U.rulePage(lt, 40, 49.4, 3, 'คนที่ดูถูกคุณ คือครูที่ไม่คิดเงิน');
      U.fade(lt, 50);
    } };

  // every kind of scam, on his phone; the falls climb fast; what scammers use
  const scams = [{ title: 'งานออนไลน์ รายได้ดี', rows: [{ text: 'โอนค่าสมัคร ๙๙๙ บาท ภายใน ๑๐ นาที รับงานทันที!' }, { text: 'โอนแล้วครับ', me: true }, { text: 'บัญชีนี้ถูกปิดแล้ว' }] },
    { title: 'ร้านมือถือราคาถูก', rows: [{ text: 'เหลือเครื่องสุดท้าย ลด ๗๐% วันนี้วันเดียว' }, { text: 'ของยังไม่มาเลยครับ', me: true }, { text: 'ผู้ใช้นี้บล็อกคุณแล้ว' }] },
    { title: 'กลุ่มลงทุนคริปโต', rows: [{ text: 'สมาชิก ๓,๒๐๐ คนได้กำไรแล้ว คุณจะพลาดเหรอ' }, { text: 'ถอนเงินไม่ได้ครับ', me: true }, { text: 'ต้องโอนค่าธรรมเนียมเพิ่ม ๕,๐๐๐' }] }];
  const SCAMS = { d: 52, look: grey, hud: { noClock: true, fields: ['๒๕๖๒', '๒๓ ปี', lt => baht(Math.max(0, 9800 - 9800 * seg(lt, 2, 40))), lt => 'ล้ม ' + thai(5 + Math.floor(seg(lt, 2, 42) * 14))], warn: 3 }, ev: [[1, 'type'], [12, 'sent'], [18, 'type'], [30, 'type'], [41, 'sting2']],
    lines: [['s3n11', 'narr', 1.4, 'แล้วโลกออนไลน์ก็มาถึง พร้อมกลโกงแบบใหม่ทุกสัปดาห์', 'Then came the online world, with a new scam every week.'],
            ['s3n12', 'narr', 13.6, 'คุณโดนทุกแบบ งานออนไลน์ ร้านปลอม กลุ่มลงทุน', 'You fell for all of them. Fake jobs, fake shops, investment groups.'],
            ['s3n13', 'narr', 26.0, 'คุณไม่ได้โง่… คุณแค่อยากรวยเร็วเกินไป', "You weren't stupid… you just wanted to be rich too fast."],
            ['s3n14', 'narr', 41.0, 'แต่ครั้งนี้ คุณเริ่มสังเกตว่าทุกกลโกง ใช้คำเดิม ๆ', 'But this time you noticed: every scam used the same words.', true]],
    draw(lt, t) {
      const i = Math.min(2, Math.floor(lt / 13)), L = scams[i], n = Math.min(L.rows.length, 1 + Math.floor((lt - i * 13) / 3.6));
      if (lt < 39) U.phone(() => B2.room(g, t, { night: true }), t, { ...L, rows: L.rows.slice(0, n) }, (lt % 3) / 3, .3);
      else { cam(960, 540, 1.1, () => B2.room(g, t, { night: true, notes: 3 })); U.knowledge(lt, 39.4, 51.6, '๓', 'คำที่คนหลอกใช้', ['ด่วน! ภายใน ๑๐ นาที (เร่งให้รีบ)', 'กำไร ๓ เท่า (ปลุกความโลภ)', 'คนอื่นได้แล้วตั้งหลายพัน (ให้แห่ตาม)'], 'หลักจิตวิทยาการโน้มน้าว: ความเร่งด่วน · ความโลภ · การพิสูจน์ทางสังคม', 'r'); }
      if (lt > 12.6 && lt < 13.4 || lt > 25.6 && lt < 26.4 || lt > 38.6 && lt < 39.4) black(.6);
      U.fade(lt, 52);
    } };

  // the wall of notes grows; the fourth rule
  const NOTES = { d: 44, look: { tone: 'night', v: .55, atmo: [['glow', { x: 600, y: 700, r: 500, col: 'rgba(255,220,160,.16)' }]] }, hud: hud('฿ ๐', 'ล้ม ๑๙'), ev: [...Array.from({ length: 10 }, (_, i) => [3 + i * 2.6, 'paper'])],
    lines: [['s3n15', 'narr', 1.4, 'คุณเริ่มจด… ทุกคำที่คนหลอกพูด ทุกวิธีที่เขาทำให้คุณเชื่อ', 'You started writing… every word the scammers said, every way they made you believe.'],
            ['s3n16', 'narr', 12.0, 'ผนังห้องเช่าเต็มไปด้วยกระดาษ', 'The walls of your rented room filled up with paper.'],
            ['s3n17', 'narr', 19.4, 'คนอื่นโดนหลอกแล้วอาย คุณโดนหลอกแล้วเรียน', 'Others got scammed and felt ashamed. You got scammed and learned.']],
    acts: [['pan22', 'writePen', 2, 20, { noProp: true }], ['pan22', 'chin', 23, 8]],
    draw(lt, t) {
      camK(lt, [[0, [700, 520, 1.3]], [30, [800, 560, 1.12]], [44, [800, 560, 1.12]]], () => {
        B2.room(g, t, { night: true, notes: Math.floor(4 + seg(lt, 2, 26) * 26) });
        person(g, 'pan22', 700, 1000, 580, P('pan22', t, { view: lt < 22 ? 'back' : undefined, look: .3 }));
      });
      U.rulePage(lt, 30, 43.4, 4, 'ใครเร่งให้รีบตัดสินใจ คนนั้นกำลังหลอก');
      U.fade(lt, 44);
    } };

  // the market: a fast-talking seller tries it on; Pan reads him and walks away; then a fair deal
  const READ = { d: 42, look: warm, hud: hud('฿ ๓,๔๐๐', 'ล้ม ๑๙'), ev: [[0, 'crowd']],
    lines: [['s3v1', 'vendor', 2.4, 'ของดีเหลือชิ้นเดียว รีบตัดสินใจนะน้อง ราคานี้วันนี้วันเดียว', 'Last good one left, decide now, this price is today only.'],
            ['s3n18', 'narr', 9.4, 'เร่ง… โลภ… ทุกคนซื้อแล้ว… คุณได้ยินคำเดิมทั้งสามคำ', 'Hurry… greed… everyone bought one… you heard all three words.'],
            ['s3p2', 'pan22', 17.0, 'ไม่เป็นไรครับ พรุ่งนี้ผมมาใหม่', "That's fine. I'll come back tomorrow."],
            ['s3n19', 'narr', 23.4, 'ครั้งแรกที่คุณอ่านคนออก', 'The first time you read someone right.', true],
            ['s3n20', 'narr', 31.0, 'สิบเก้าครั้งที่ล้ม… คือค่าเรียนวิชานี้', 'Nineteen falls… that was the fee for this lesson.']],
    acts: [['vendor', 'beckon', 2, 3], ['pan22', 'headShake', 15, 1.8], ['pan22', 'pockets', 18.6, 10], ['pan22', 'fistPump', 34, 2]],
    draw(lt, t) {
      camK(lt, [[0, [1400, 620, 1.2]], [20, [1200, 620, 1.1]], [42, [1000, 620, 1.1]]], () => {
        market2(g, t);
        person(g, 'vendor', 1600, 990, 560, P('vendor', t, { flip: true, look: .6 }));
        const pm = mover(lt, [[0, 1300], [20, 1300], [26, 700]]);
        person(g, 'pan22', pm.x, 1000, 580, P('pan22', t, pm.walk != null ? { walk: pm.walk, flip: true } : { look: .6, expr: lt > 22 ? 'smile' : 'neutral' }));
      });
      U.fade(lt, 42);
    } };
  return [CH, LEAVE, JOBS, SPIT, SCAMS, NOTES, READ];
};
