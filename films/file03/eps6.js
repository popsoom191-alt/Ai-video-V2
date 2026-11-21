// "แสนล้าน" · บทส่งท้าย (2577 · 38): a hundred billion; grandma's limits; back at mum's stall; the life graph; philosophy.
import './cast_sanlan.js';
import * as B from './bg_sanlan.js';
import * as B2 from './bg_sanlan2.js';
import UI, { thai, baht } from './sanlan_ui.js';
export default (api) => {
  const { g, W, H, TH, person, extra, P, camK, mover, cam, black, seg, ease, lerp, hash } = api;
  const U = UI(api);
  const hud = (money, falls) => ({ noClock: true, fields: ['๒๕๗๗', '๓๘ ปี', money, falls], warn: 3 });
  const CH = { d: 6, look: false, draw(lt) { U.chapterCard(lt, 6, 'ส่งท้าย', 'แสนล้าน', '๒๕๗๗ · ๓๘ ปี'); } };

  const RISE = { d: 40, look: { tone: 'day', v: .35, atmo: [['beams', { a: .18 }]] }, hud: { noClock: true, fields: ['๒๕๗๗', '๓๘ ปี', lt => baht(5.02e9 + (1e11 - 5.02e9) * Math.pow(seg(lt, 2, 26), 2.4)), 'ล้ม ๔๗'], warn: 3 },
    lines: [['s6n1', 'narr', 1.4, 'แปดปีต่อมา ตัวเลขในบัญชีของคุณมีศูนย์สิบเอ็ดตัว', 'Eight years later the number in your account had eleven zeros.'],
            ['s6n2', 'narr', 10.4, 'คุณคืนเงินให้ทุกคนที่เคยโดนแชร์ลูกโซ่ของพี่โอ สามพันคน ครบทุกบาท', 'You paid back every one of the three thousand people พี่โอ\'s scheme had taken. Every baht.'],
            ['s6n3', 'narr', 22.0, 'และคุณไม่เคยแย่งข้าวจากจานคนที่หิว', 'And you never took food from the plate of someone hungry.', true]],
    draw(lt, t) { camK(lt, [[0, [960, 560, 1.05]], [40, [960, 500, 1.2]]], () => { B2.shutOffice(g, t); for (let i = 0; i < 9; i++) person(g, extra(60 + i), 160 + i * 200, 1000 + (i % 2) * 30, 520, { t, view: 'front', expr: 'smile', hands: { R: [34, -280], L: [10, -278] } }); }); U.fade(lt, 40); } };

  const STALL = { d: 66, look: { tone: 'warm', v: .45, atmo: [['dust', { a: .3 }]] }, hud: hud('฿ ๑๐๐,๐๐๐,๐๐๐,๐๐๐', 'ล้ม ๔๗'), ev: [[0, 'market']],
    lines: [['s6n4', 'narr', 2.0, 'วันอาทิตย์ คุณกลับไปที่ร้านข้าวแกงริมคลอง', 'On Sunday you went back to the curry stall by the canal.'],
            ['s6p1', 'pan38', 12.6, 'อร่อยเหมือนเดิมเลยแม่', 'Tastes just the same, Mum.', true],
            ['s6n5', 'narr', 20.0, 'แม่ยิ้ม… แต่มองคุณนานกว่าปกติ', 'Mum smiled… but looked at you longer than usual.'],
            ['s6n6', 'narr', 30.0, 'คนฉลาดคิดว่าทุกอย่างคำนวณได้ คนโชคดีคิดว่าทุกอย่างมาเอง', 'Clever people think everything can be calculated. Lucky people think everything just comes.'],
            ['s6n7', 'narr', 40.0, 'แต่คุณรู้ว่าทุกครั้งที่ล้ม คือค่าเรียน', 'But you knew that every fall was a tuition fee.'],
            ['s6n8', 'narr', 48.4, 'คุณจ่ายค่าเรียนไปสี่สิบเจ็ดครั้ง… และไม่เคยขอเงินคืน', 'You paid forty-seven times… and never asked for a refund.', true]],
    acts: [['mae', 'stir', 2, 8], ['pan38', 'nodLong', 14], ['mae', 'chin', 21, 9]],
    draw(lt, t) {
      camK(lt, [[0, [900, 600, 1.08]], [14, [1000, 640, 1.25]], [30, [960, 620, 1.12]], [66, [1050, 640, 1.2]]], () => {
        B.curryStall(g, t);
        person(g, 'mae', 700, 696, 430, P('mae', t, { look: .5 }));
        g.fillStyle = '#a07a52'; g.fillRect(160, 560, 820, 140); g.fillStyle = '#7a5a3a'; g.fillRect(160, 560, 820, 16);
        person(g, 'pan38', 1180, 900, 560, P('pan38', t, { sit: true, seat: false, flip: true, look: .6, hands: { L: [46, -250], R: [60, -244] } }));
      });
      U.fade(lt, 66);
    } };

  const GRAPH = { d: 18, look: false, draw(lt) { U.lifeGraph(lt, .5); U.fade(lt, 18); } };

  const LAST = { d: 22, look: false,
    lines: [['s6n9', 'narr', 2.0, 'เงินแสนล้านซื้อได้ทุกอย่าง…', 'A hundred billion buys everything…'],
            ['s6n10', 'narr', 8.6, 'ยกเว้นคำถามที่ว่า… คุณยังเป็นเด็กคนนั้นอยู่ไหม', 'except the answer to one question… are you still that boy?', true]],
    draw(lt, t) {
      g.fillStyle = '#0c0b09'; g.fillRect(0, 0, W, H);
      const k = ease(seg(lt, 14, 16)); g.save(); g.globalAlpha = k; g.textAlign = 'center'; g.font = `700 150px ${TH}`; g.fillStyle = '#f2c14e'; g.fillText('แสนล้าน', W / 2, 560); g.restore();
      U.fade(lt, 22, .7, 2);
    } };
  return [CH, RISE, STALL, GRAPH, LAST];
};
