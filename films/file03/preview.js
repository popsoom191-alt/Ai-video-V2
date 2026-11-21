// Storyboard stills for the no-cut rework (?preview=N): one frame per changed moment, for approval before the full build.
import { person, extra } from './chars2.js';
import * as BG from './bg.js';
const W = 1920, H = 1080, TH = "'IBM Plex Sans Thai'";
export function preview(g, n, t = 3) {
  const { shop, shopDoor, stairsUp, stairPos, labDoor, corridor, market2, stool, towel, lab } = BG;
  const tape = (x, y, s = 1) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#1a1a1e'; g.fillRect(-45, -26, 90, 52); g.fillStyle = '#f2ecd8'; g.fillRect(-35, -16, 70, 18); g.fillStyle = '#c8322c'; g.font = '700 16px monospace'; g.fillText('01', -9, -2); g.restore(); };
  const label = (th) => { g.fillStyle = 'rgba(0,0,0,.7)'; g.fillRect(0, 0, W, 70); g.font = `700 40px ${TH}`; g.fillStyle = '#fff'; g.fillText(th, 30, 50); };
  g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H);
  if (n === 1) { shop(g, t, false, { clock: 14 }); shopDoor(g, 1); person(g, 'beer', 1400, 990, 560, { t, look: .6, arms: 'down' }); person(g, 'nid', 1180, 990, 560, { t, walk: 2.2, flip: true, hold: 'box' }); label('1 · คุณนิดถือกล่องเดินจากประตูไปที่โต๊ะ (ไม่ตัดภาพ)'); }
  if (n === 2) { shop(g, t, false, { clock: 14.1 }); g.fillStyle = '#8a6a46'; g.fillRect(860, 640, 180, 70); person(g, 'beer', 620, 980, 560, { t, look: .6, gesture: true, talk: .6, nod: 1.5 }); person(g, 'nid', 1300, 990, 560, { t, look: .6, flip: true, nod: -2 }); label('2 · ท่าคุยแบบพอดี: คนพูดยกมือเล็กน้อย คนฟังพยักหน้า'); }
  if (n === 3) { shop(g, t, true, { footprints: 4 }); towel(g, 940, 708, 0); tape(1025, 676); person(g, 'beer', 900, 990, 580, { t, look: .5, hands: { R: [92, -232] }, expr: 'worried' }); label('3 · เอื้อมมือไปแตะเทปก่อน แล้วค่อยหยิบ · ผ้าขนหนูรอไว้บนโต๊ะ'); }
  if (n === 4) { stairsUp(g, t, 3); const [x, y, s] = stairPos(.45); person(g, 'mind', x, y, 520 * s, { t, view: 'back', walk: 1.2, hold: true, arms: 'torch' }); label('4 · บันไดหนีไฟ มุมกล้องต้นมองขึ้น · มายด์เดินขึ้น ขาก้าว ถือไฟฉายที่หยิบจากกระเป๋า'); }
  if (n === 5) { stairsUp(g, t, 4, { taped: true, open: .3 }); const [x, y, s] = stairPos(.93); person(g, 'mind', x, y + 10, 520 * s, { t, view: 'back', crouch: .75, hold: true, arms: 'torch' }); label('5 · ชั้น ๔: ประตูเหล็ก โซ่ + เทปห้ามเข้า · มายด์ย่อตัวลอดเทป ผลักประตู'); }
  if (n === 6) { g.save(); g.translate(W / 2, H / 2); g.scale(1.4, 1.4); g.translate(-1240, -560); lab(g, t, .8); g.restore(); label('6 · ห้องแล็บ: กล้องแพนต่อเนื่องจนถึงชั้นวางเทป (ช่อง 01 ว่าง) ไม่ตัดภาพ'); }
  if (n === 7) { labDoor(g, t, .9, () => { corridor(g, t, .8, { wet: true }); person(g, 'daeng', 1080, 860, 360, { t, flip: true, expr: 'smile', hands: { L: [-4, -250], R: [26, -214] }, hold: true }); }); person(g, 'mind', 900, 1080, 640, { t, view: 'back', hold: true, arms: 'torch' }); label('7 · มายด์เปิดประตูห้องแล็บ กล้องตามออกไปเจอป้าแดงถูพื้น (ไม่ตัดฉาก)'); }
  if (n === 8) {
    market2(g, t);
    const walkers = [[200, 960, 0, 1], [420, 1000, 1, -1], [650, 980, 2, 1], [880, 1010, 3, -1], [1060, 990, 4, 1], [300, 900, 5, -1], [760, 905, 6, 1], [520, 890, 7, -1], [1000, 900, 8, 1], [140, 890, 9, -1]];
    walkers.sort((a, b) => a[1] - b[1]).forEach(([x, y, s, d]) => person(g, extra(s), x, y, 470 * (y / 1000), { t, walk: t * 7 + s, flip: d < 0 }));
    for (const [x, s, f] of [[1250, 11, false], [1350, 12, true], [1590, 13, false], [1690, 14, true]]) { stool(g, x, 1000, .9); person(g, extra(s), x, 1000, 470, { t, sit: true, flip: f, hands: { L: [40, -250], R: [56, -246] } }); }
    person(g, 'vendor', 1820, 990, 520, { t, flip: true, arms: 'point' }); person(g, extra(20), 980, 1000, 300, { t, walk: t * 11, flip: false });   // a running kid
    label('8 · ตลาด: คนเดินสวนกันหน้าตาไม่ซ้ำ · คนนั่งกินก๋วยเตี๋ยว · แม่ค้า · เด็ก');
  }
}
