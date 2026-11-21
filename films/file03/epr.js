// FILE 03 · ตอนที่ ๑ (no-cut version). Inside one place the camera never cuts: it pans, follows and pushes; people walk to
// where they talk; props are in hand only while held. Changing place shows the way there; a time jump fades over a clock.
// Cuts kept on purpose: between Beer and the tape he is watching, and into a phone or TV screen.
// Voices: only the lines voiced for episode 1 have audio; every new line is subtitles only.
import ep1 from './ep1.js';
import ep2 from './ep2.js';
export default (api) => {
  const { g, W, H, TH, person, extra, P, K, camK, mover, cam, pov, black, vhs, frozenTV, darkTorch, seg, ease, lerp, hash, dof, handsPhone, card, badge,
    shop, shopDoor, building2026, shopFront, carRide, market2, stool, towel, oatShop, workOrder, vcr,
    gate, lobby, stairsUp, stairPos, lab, labDoor, corridor, paper } = api;
  const A = ep1(api), B = ep2(api);
  // the phone, as in the references: big hands, the room soft behind; screens are portrait (1080 × 1920)
  const wrap = (txt, w) => { const out = []; let line = ''; for (const ch of [...txt]) { if (g.measureText(line + ch).width > w && line) { out.push(line); line = ''; } line += ch; } if (line) out.push(line); return out; };
  const phoneScreen = (_, L) => () => {
    const gr = g.createLinearGradient(0, 0, 0, 1920); gr.addColorStop(0, '#f4f4f8'); gr.addColorStop(1, '#e4e6ee'); g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 1080, 300); g.fillStyle = '#d8d8de'; g.fillRect(0, 298, 1080, 3);
    g.fillStyle = '#c8443a'; g.beginPath(); g.arc(150, 200, 60, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `700 64px ${TH}`; g.textAlign = 'center'; g.fillText([...L.title][0], 150, 222); g.textAlign = 'left';
    g.fillStyle = '#2a2a30'; g.font = `700 70px ${TH}`; g.fillText(L.title, 240, 226);
    let y = 400; g.font = `600 58px ${TH}`;
    for (const r of L.rows) { const ls = wrap(r.text, 820), h = ls.length * 78 + 50, w = Math.max(...ls.map(l => g.measureText(l).width)) + 70, x = r.me ? 1080 - 60 - w : 60;
      g.fillStyle = r.me ? '#3a8a68' : '#ffffff'; g.beginPath(); g.roundRect(x, y, w, h, 44); g.fill(); g.fillStyle = r.me ? '#fff' : '#2a2a30'; ls.forEach((l, i) => g.fillText(l, x + 35, y + 80 + i * 78)); y += h + 40; }
  };
  const photo = (draw) => () => { g.fillStyle = '#0c0c0e'; g.fillRect(0, 0, 1080, 1920); g.save(); g.translate(0, 660); g.scale(1080 / 1920, 1080 / 1920); draw(); g.restore(); };
  const phoneHeld = (_, screen, t, night = true) => { cam(960, 540, 1.3, () => shop(g, t, night, {})); dof(20, night ? .3 : .1); handsPhone(g, t, screen, { tap: Math.min(1, (t % 6) / 3) }); };

  const tapeBox = (x, y, s, label, wet = 0) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#1a1a1e'; g.fillRect(-45, -26, 90, 52); g.fillStyle = '#f2ecd8'; g.fillRect(-35, -16, 70, 18); g.fillStyle = label === '01' ? '#c8322c' : '#2a2a2a'; g.font = '700 16px monospace'; g.fillText(label, -12, -2); if (wet > 0) { g.fillStyle = `rgba(150,190,220,${.55 * wet})`; g.fillRect(-35, -16, 70, 18); } g.restore(); };
  const box = () => { g.fillStyle = '#8a6a46'; g.fillRect(860, 640, 180, 70); g.fillStyle = '#6a4e32'; g.fillRect(860, 640, 180, 12); };
  const tapesInBox = (taken) => { for (let k = 0; k < 4; k++) { if (taken === k) continue; g.fillStyle = '#1a1a1e'; g.fillRect(878 + k * 36, 618, 26, 30); } };
  const rays = () => { g.save(); g.globalCompositeOperation = 'screen'; for (const [x0, w] of [[1300, 160], [1500, 110], [1640, 70]]) { const gr = g.createLinearGradient(x0, 120, x0 - 500, 1000); gr.addColorStop(0, 'rgba(255,245,215,.16)'); gr.addColorStop(1, 'rgba(255,245,215,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x0, 120); g.lineTo(x0 + w, 120); g.lineTo(x0 + w - 560, 1080); g.lineTo(x0 - 560, 1080); g.closePath(); g.fill(); } g.restore(); };
  const fadeX = (lt, a, b) => { if (lt > a && lt < b) { g.fillStyle = `rgba(0,0,0,${1 - Math.abs(lt - (a + b) / 2) / ((b - a) / 2)})`; g.fillRect(0, 0, W, H); } };   // a dip through black at the end of a push-in
  const T = (a, n = 6, step = .5) => Array.from({ length: n }, (_, i) => [a + i * step, 'step']);
  const swish = (k) => { if (k <= 0 || k >= 1) return; g.save(); g.globalAlpha = Math.sin(k * Math.PI); for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(30,34,30,${.6 + .4 * hash(i)})`; g.fillRect(0, i * 42, W, 30); } g.restore(); };
  const towelOn = (cover) => { towel(g, 940, 708, cover); };
  const PAPER = (x, y, s = 1, r = -.2) => { g.save(); g.translate(x, y); g.rotate(r); g.scale(s, s); g.fillStyle = '#efe8d4'; g.fillRect(-60, -40, 120, 80); g.fillStyle = 'rgba(60,50,40,.5)'; for (let k = 0; k < 5; k++) g.fillRect(-46, -26 + k * 12, 80, 3); g.restore(); };
  const workPaper = (x, y, s = 1) => { g.save(); g.translate(x, y); g.rotate(-.1); g.scale(s, s); g.fillStyle = '#f2e8c8'; g.fillRect(-30, -40, 60, 80); g.fillStyle = '#e8c43a'; g.fillRect(-30, -40, 60, 10); g.restore(); };
  const endCard = { d: 8, ev: [[0, 'end']], draw(lt) {
    g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); g.textAlign = 'center';
    g.font = '700 110px monospace'; g.fillStyle = '#f2f2ec'; g.fillText('FILE 03', W / 2, 470);
    g.font = `600 52px ${TH}`; g.fillStyle = '#e8463c'; g.fillText('ตอนที่ ๑ จบ', W / 2, 580);
    g.font = `400 40px ${TH}`; g.fillStyle = `rgba(220,220,220,${seg(lt, 2, 3)})`; g.fillText('ตอนหน้า · ม้วนที่ ๒  /  Next: Tape Two', W / 2, 680); g.textAlign = 'left';
    black(1 - seg(lt, 0, .8)); black(seg(lt, 7, 8)); } };

  const S = [
    A[0],

    // 1. the shop by day, one shot: the knock, the door, the box carried in and set down, the talk, the phone, tape three, goodbye
    { d: 64, ev: [[1.0, 'knock'], ...T(3.2), [6.4, 'door'], ...T(12.6, 6), ...T(13.4, 6), [15.8, 'door'], [17.0, 'thud'], [25.4, 'whoosh'], [37.0, 'whoosh'], [39.6, 'paper'], ...T(57.4, 5), [59.6, 'door'], [62.4, 'door']],
      lines: [['x1', 'nid', 7.6, 'สวัสดีค่ะ นิด ช่องเจ็ด ที่โทรนัดไว้ค่ะ', 'Hello. Nid, Channel 7. We spoke on the phone.'],
              ['x2', 'beer', 11.6, 'เชิญครับ', 'Please, come in.'],
              ['n1', 'nid', 18.4, 'เทปห้าม้วนจากตึกวิชัยแล็บค่ะ ม้วนที่หนึ่งหายไปพร้อม ดร.วิชัย', 'Five tapes from the Wichai Lab building. Tape one vanished with Dr. Wichai.'],
              ['x3', 'nid', 26.0, 'ปีสี่สิบปิดแค่ชั้นสี่ หลังจากนั้นปิดทั้งตึก', "In '97 they only closed the fourth floor. After that, the whole building."],
              ['x4', 'nid', 33.0, 'เดือนหน้าจะรื้อแล้ว', "They're tearing it down next month."],
              ['b1', 'beer', 41.0, 'กล่องเปียกน้ำ แต่ม้วนที่สามแห้งสนิท มีคนเพิ่งหยิบออกไปแล้วใส่คืน', 'The box is wet, but tape three is bone dry. Someone took it out and put it back.'],
              ['n2', 'nid', 47.4, 'ฉันตามข่าวตึกนี้มายี่สิบปี ไม่มีใครกล้าดูม้วนนี้จนจบ', "I've followed this building for twenty years. Nobody has watched this one to the end."],
              ['b2', 'beer', 53.4, 'งั้นผมจะดูคืนนี้ คนเดียว', "Then I'll watch it tonight. Alone."],
              ['x13', 'nid', 56.2, 'ระวังตัวด้วยนะ', 'Be careful.']],
      draw(lt, t) {
        if (lt > 25 && lt < 37) { if (lt < 29) phoneHeld(g, photo(() => building2026(g, t)), t, false); else cam(1280, 760, lerp(1.1, 1.6, ease(seg(lt, 29, 37))), () => building2026(g, t)); return; }
        camK(lt, [[0, [960, 540, 1.02]], [6, [1300, 560, 1.1]], [15, [1300, 560, 1.1]], [18, [960, 560, 1.06]], [40.4, [960, 560, 1.06]], [41.4, [760, 600, 1.35]], [46.6, [760, 600, 1.35]], [47.6, [960, 560, 1.06]], [64, [1100, 560, 1.06]]], () => {
          shop(g, t, false, { clock: 14 + lt / 60 }); rays();
          shopDoor(g, Math.max(ease(seg(lt, 6.4, 7.2)) * (1 - ease(seg(lt, 15.6, 16.4))), ease(seg(lt, 59.4, 60.2)) * (1 - ease(seg(lt, 62.2, 63)))));
          if (lt > 17) { box(); tapesInBox(lt > 39.6 && lt < 52 ? 2 : -1); }
          const nm = mover(lt, [[0, 1860], [12.6, 1860], [15.4, 1200], [57.4, 1200], [60.0, 1860]]);
          if (lt > 6.6 && lt < 62.4) {
            const sets = lt > 15.4 && lt < 17;
            person(g, 'nid', nm.x, 990, 560, P('nid', t, nm.walk != null ? { walk: nm.walk, flip: nm.flip, hold: lt < 15.4 ? 'box' : undefined } : { flip: true, look: .6, hold: lt < 15.4 ? 'box' : undefined, arms: lt > 24.4 && lt < 25.4 ? 'point' : sets ? 'chest' : 'down', hands: sets ? { R: [lerp(34, 70, seg(lt, 15.4, 16.6)), lerp(-252, -200, seg(lt, 15.4, 16.6))] } : undefined }));
            if (sets) { const k = ease(seg(lt, 15.4, 17)); g.save(); g.translate(lerp(1170, 950, k), lerp(735, 676, k) - Math.sin(k * Math.PI) * 30); g.fillStyle = '#8a6a46'; g.fillRect(-90, -36, 180, 70); g.restore(); }
            if (lt > 24.4 && lt < 25.4) { g.fillStyle = '#1a1a1e'; g.fillRect(1060, 720, 28, 50); }   // the phone held out
          }
          const bm = mover(lt, [[0, 640], [3.2, 640], [6.2, 1600], [13.4, 1600], [16.4, 700], [64, 700]]);
          const reach = lt > 39.2 && lt < 40, holding3 = lt > 40 && lt < 52;
          person(g, 'beer', bm.x, 980, 560, P('beer', t, bm.walk != null ? { walk: bm.walk, flip: bm.flip } : { look: .6, arms: holding3 ? 'chest' : 'down', hands: reach ? { R: [lerp(32, 170, seg(lt, 39.2, 39.8)), lerp(-200, -170, seg(lt, 39.2, 39.8))] } : undefined }));
          if (holding3) tapeBox(bm.x + 22, 730, .5, '03');
        });
        black(1 - seg(lt, 0, .6));
      } },

    // 2. evening → night: the clock; Beer takes tape three to the VCR; the camera pushes in on the slot
    { d: 15, ev: [[6.6, 'insert'], [10.0, 'vcr']],
      lines: [['b3', 'beer', 4.0, 'ไฟล์ศูนย์สาม พฤศจิกายน เก้าเจ็ด', 'File zero-three. November, ninety-seven.']],
      draw(lt, t) {
        if (lt < 3) { g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); g.save(); g.translate(W / 2, H / 2); g.fillStyle = '#e8e4d8'; g.beginPath(); g.arc(0, 0, 160, 0, 7); g.fill(); const hr = lerp(14.3, 23.95, ease(seg(lt, 0, 3))); g.strokeStyle = '#2a2a2a'; g.lineCap = 'round'; g.lineWidth = 14; g.beginPath(); g.moveTo(0, 0); const a1 = (hr % 12) / 12 * 6.283 - 1.571; g.lineTo(Math.cos(a1) * 80, Math.sin(a1) * 80); g.stroke(); g.lineWidth = 8; const a2 = (hr % 1) * 6.283 - 1.571; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a2) * 125, Math.sin(a2) * 125); g.stroke(); g.restore(); black(1 - seg(lt, 0, .5)); black(seg(lt, 2.5, 3)); return; }
        if (lt < 9) camK(lt, [[3, [960, 540, 1]], [6, [960, 560, 1.05]], [9, [370, 680, 3.2]]], () => {
          shop(g, t, true, { clock: 23.97 });
          const bx = lerp(700, 560, seg(lt, 5, 6.4));
          person(g, 'beer', bx, 980, 560, P('beer', t, { look: .5, flip: true, walk: lt > 5 && lt < 6.4 ? (lt - 5) * 7 : null, arms: lt > 6.2 && lt < 7 ? 'torch' : 'chest', hands: undefined }));
          if (lt < 6.8) tapeBox(lt < 6.2 ? bx - 22 : lerp(bx - 22, 380, seg(lt, 6.2, 6.8)), lt < 6.2 ? 730 : lerp(730, 673, seg(lt, 6.2, 6.8)), .5, '03');
        });
        else vcr(g, t, ease(seg(lt, 9, 11.4)));
        fadeX(lt, 8.4, 9.6); black(1 - seg(lt, 3, 3.5)); black(seg(lt, 14.3, 15)); } },

    // 3. tape: the gate — one move out from the poster to the two of them
    { d: 24, tape: true, osd: 'AM 2:04', ev: [[0, 'tapein'], [0, 'crickets']],
      lines: A[3].lines,
      draw(lt, t) { const [x, y, z] = K(lt, [[0, [1120, 830, 3.6]], [8, [1120, 830, 3.0]], [11, [960, 640, 1.25]], [24, [960, 640, 1.3]]]); pov(t, x, y, z, () => { gate(g, t); person(g, 'mind', 780, 1000, 420, P('mind', t, { view: 'front', arms: 'down' })); }); } },

    // 4. tape: the lobby — the guard, his round, the fire door (no cuts: the camera pans with the talk)
    { d: 28, tape: true, osd: 'AM 2:06', ev: [...T(14.6, 8), ...T(21.4, 6), [25.6, 'door']],
      lines: A[4].lines,
      draw(lt, t) {
        const [x, y, z] = K(lt, [[0, [960, 560, 1.05]], [5.6, [960, 560, 1.05]], [6.8, [560, 560, 1.35]], [10.6, [560, 560, 1.35]], [12, [960, 560, 1.05]], [20.4, [960, 560, 1.05]], [26, [1500, 560, 1.25]]]);
        pov(t, x, y, z, () => {
          lobby(g, t, { floor: '1' });
          g.fillStyle = '#5a6a5a'; g.fillRect(1620, 420, 180, 400); g.fillStyle = '#2a7a4a'; g.fillRect(1640, 380, 140, 34); g.fillStyle = '#e8f8ee'; g.font = `700 22px ${TH}`; g.fillText('ทางหนีไฟ', 1652, 404);   // the fire door
          if (lt > 25.6) { g.fillStyle = '#0a0c0a'; g.fillRect(1620, 420, 180 * ease(seg(lt, 25.6, 26.6)), 400); }
          const cm = mover(lt, [[0, 380], [14.6, 380], [18.6, -300]]);
          if (cm.x > -250) person(g, 'chai', cm.x, 900, 520, P('chai', t, cm.walk != null ? { walk: cm.walk, flip: true } : { look: .7 }));
          const mm = mover(lt, [[0, 1250], [21.4, 1250], [24.6, 1660]]);
          person(g, 'mind', mm.x, 1000, 520, P('mind', t, mm.walk != null ? { walk: mm.walk } : lt > 17.6 && lt < 21.4 ? { view: 'front', arms: 'point' } : { look: .7, flip: lt < 21.4, arms: 'down' }));
        });
      } },

    // 5. tape: the fire stairs — the torch out of the bag, three flights, the chain and tape, ducking through the steel door
    { d: 46, tape: true, osd: 'AM 2:08', ev: [[1.6, 'torch'], [4, 'stairs'], [13, 'stairs'], [22, 'stairs'], [31.0, 'chain'], [32.6, 'door'], [39.4, 'chain']],
      lines: [['t3', 'ton', 15.0, 'มายด์ รอด้วย', 'Mind, wait for me.'], ['m9', 'mind', 28.6, 'ก้มลอดไป', 'Duck under.']],
      draw(lt, t) {
        const flight = lt < 12.6 ? 2 : lt < 21.6 ? 3 : 4, f0 = [0, 0, 0, 12.6, 21.6][flight];
        if (flight < 4) {
          const u = flight === 2 ? seg(lt, 4, 12) : seg(lt, 13.4, 21);
          const [x, y, s] = stairPos(u);
          pov(t, 960, lerp(560, 470, u), 1.0 + u * .25, () => { stairsUp(g, t, flight, { L: .7 });
            const takingOut = lt < 1.6, holding = lt > 1.6;
            person(g, 'mind', x, y, 520 * s, { t, view: 'back', walk: (flight === 2 ? lt > 4 && lt < 12 : lt > 13.4 && lt < 21) ? lt * 7 : null, hold: holding, arms: holding ? 'torch' : 'down', hands: takingOut ? { L: [-40, -214], R: [lerp(36, -20, seg(lt, .4, 1.4)), lerp(-200, -214, seg(lt, .4, 1.4))] } : undefined });
          }, 1.2, flight === 2 ? (lt > 4 ? 1 : 0) : 1);
          const tilt = flight === 2 ? seg(lt, 12, 12.6) : seg(lt, 21, 21.6), back = flight === 3 ? 1 - seg(lt, 12.6, 13.4) : flight === 4 ? 1 - seg(lt, 21.6, 22.4) : 0;
          black(Math.max(tilt, back));
        } else {
          const u = seg(lt, 22.4, 28), duck = ease(seg(lt, 30, 31.6)), through = seg(lt, 31.6, 33.6), open = ease(seg(lt, 32.4, 33.4)) * .7;
          const camIn = ease(seg(lt, 34, 39)), dip = Math.sin(Math.PI * seg(lt, 39, 41.4));
          const [x, y, s] = stairPos(lerp(.88 * u, .97, through));
          cam(960 + 0, lerp(lerp(560, 470, u), 330, camIn) + dip * 120, lerp(1.2, 3.0, camIn), () => {
            stairsUp(g, t, 4, { L: .7, taped: true, open });
            if (lt < 34.2) person(g, 'mind', x, y + duck * 12, 520 * s * (1 - through * .25), { t, view: 'back', walk: (lt > 22.4 && lt < 28) || (lt > 31.6 && lt < 33.6) ? lt * 7 : null, crouch: duck * (1 - seg(lt, 33.4, 34)), hold: true, arms: 'torch' });
          });
          if (dip > 0) { g.fillStyle = '#e8c43a'; g.fillRect(0, lerp(-80, 140, dip) - 30, W, 60); g.fillStyle = '#1a1a1e'; g.font = `700 40px ${TH}`; for (let k = 0; k < 8; k++) g.fillText('ห้ามเข้า', k * 260 + 20, lerp(-80, 140, dip) + 12); }   // the tape passes over the lens as Ton ducks
          black(seg(lt, 41.4, 46));
        }
      } },

    A[6],

    // 6. tape: the lab in one handheld move, the mopping, the door, the corridor and Pa Daeng, the paper on the wet floor
    { d: 72, tape: true, osd: 'AM 2:31', ev: [[1, 'door2'], [22, 'mop'], [28, 'whoosh'], ...T(28.4, 6), [31.8, 'door2'], [37, 'mop'], [52.6, 'paper']],
      lines: [['m10', 'mind', 2.4, 'ห้องทดลองของ ดร.วิชัย', "Dr. Wichai's lab."],
              ['m11', 'mind', 8.0, 'โครงการสาม เจ็ดคน', 'Project three. Seven people.'],
              ['m12', 'mind', 18.6, 'ช่องม้วนที่หนึ่ง ว่างอยู่', 'The slot for tape one is empty.'],
              ['m13', 'mind', 24.4, 'ได้ยินไหม เสียงถูพื้น', 'Do you hear that? Someone is mopping.'],
              ['m3', 'mind', 38.8, 'ป้าคะ ตึกนี้ปิดไปแล้วไม่ใช่เหรอ', "Ma'am, isn't this building closed?"],
              ['d1', 'daeng', 42.8, 'ป้าถูทุกคืนจ้ะ อย่าเหยียบตรงที่เปียกนะลูก', "I mop every night, dear. Don't step on the wet part."],
              ['m14', 'mind', 47.6, 'ทุกคืน… ทั้งที่ตึกร้างแล้ว', 'Every night… in an empty building.'],
              ['m4', 'mind', 58.6, 'รายชื่อผู้ทดลอง มีชื่อเด็กด้วย', 'A list of test subjects. There is a child on it.'],
              ['m15', 'mind', 64.8, 'ชื่อป้าแดงก็อยู่ในนี้', "Pa Daeng's name is on it too."]],
      draw(lt, t) {
        const corr = () => { corridor(g, t, .8, { wet: true }); const mop = Math.sin(t * 4) * 18; if (lt < 56) person(g, 'daeng', 1080 + mop * .3, 860, 360, P('daeng', t, { expr: 'smile', look: .6, flip: true, hold: true, hands: { L: [-4 + mop * .5, -250], R: [26, -214] } })); };
        if (lt < 27.6) {   // the lab: door → whiteboard → equipment → the shelf → Mind, listening
          const [x, y, z] = K(lt, [[0, [960, 540, 1]], [4, [480, 380, 1.9]], [12, [480, 380, 1.9]], [14.5, [1180, 560, 1.7]], [17, [1650, 560, 1.9]], [22, [1650, 560, 1.9]], [24, [1300, 640, 1.2]], [27.6, [1500, 560, 1.4]]]);
          pov(t, x, y, z, () => { lab(g, t, .75); if (lt > 21.6) person(g, 'mind', 1250, 1010, 520, P('mind', t, { view: 'side', flip: true, hold: true, arms: 'torch' })); }, 1, lt < 4 ? .5 : 0);
          darkTorch(960, 520, 900, .5); swish(seg(lt, 27, 28.2));
        } else if (lt < 36.8) {   // Mind goes to the door and opens it; the camera follows through
          const mm = mover(lt, [[28.2, 520], [31.2, 860]]), open = ease(seg(lt, 31.8, 33.2)), push = ease(seg(lt, 33.4, 36.8));
          cam(960, lerp(560, 560, push), lerp(1, 2.6, push), () => { labDoor(g, t, open, corr); if (push < .55) person(g, 'mind', mm.x, 1080, 640, { t, view: 'back', walk: mm.walk, hold: true, arms: lt > 31.4 && lt < 33 ? 'point' : 'torch' }); });
          swish(seg(lt, 27.6, 28.8));
        } else {   // the corridor: Pa Daeng; then down to the wet floor: the paper; Mind crouches, picks it up, reads
          const [x, y, z] = K(lt, [[36.8, [960, 560, 1.04]], [50, [960, 560, 1.1]], [52, [860, 900, 1.6]], [55, [860, 820, 1.5]], [57.4, [900, 760, 2.6]]]);
          if (lt < 57.4) {
            pov(t, x, y, z, () => {
              corr();
              const mm = mover(lt, [[36.8, 560], [38.6, 620]]), crouch = ease(seg(lt, 52.6, 53.6)) * (1 - ease(seg(lt, 54.4, 55.4)));
              if (lt < 53.8) PAPER(880, 1000);
              person(g, 'mind', mm.x, 1040, 600, P('mind', t, { look: .6, walk: mm.walk, crouch, hold: lt < 52.6, arms: lt < 52.6 ? 'torch' : lt < 54 ? 'point' : 'chest', expr: lt > 47 ? 'worried' : 'neutral' }));
              if (lt > 53.8) PAPER(mm.x + 40, 1040 - lerp(20, 330, ease(seg(lt, 53.8, 55.4))), .9, 0);
            });
          } else pov(t, 960, 540, 1 + (lt - 57.4) * .01, () => paper(g, t), .5);
          fadeX(lt, 56.8, 58);
        }
      } },

    A[10], A[11], A[12], A[13], A[14],

    // 7. after STOP: the thud; he turns, steps over, reaches until he touches it, lifts it; the label; the towel
    { d: 46, ev: [[0, 'tapeout'], [6.4, 'zoom'], [10.4, 'sting'], [13.6, 'flicker2'], [14, 'mop'], [18.6, 'sting2'], [22.8, 'stop'], [25.0, 'thud'], ...T(26.4, 2), [32.6, 'paper'], [40.4, 'paper'], [42.4, 'paper']],
      lines: [...A[15].lines.filter(l => l[0] !== 'b7'), ['b7', 'beer', 35.0, 'ม้วนที่หนึ่ง…', 'Tape one…']],
      draw(lt, t) {
        if (lt < 24.6) { A[15].draw(lt, t); return; }
        const bm = mover(lt, [[24.6, 760], [26.4, 760], [27.4, 880]]);
        const touch = lt > 27.6 && lt < 28.8, lifted = lt > 28.8, onTowel = lt > 40.4;
        const close = lt > 30.6 && lt < 37.6;
        if (!close) {
          const [x, y, z] = K(lt, [[24.6, [960, 540, 1]], [28.8, [960, 540, 1]], [30.6, [900, 700, 2.4]], [37.6, [900, 700, 2.4]], [39, [960, 560, 1.1]]]);
          cam(x, y, z, () => {
            shop(g, t, true, { footprints: 7, lamp: 1 }); towelOn(ease(seg(lt, 41.0, 42.6)));
            if (!lifted) tapeBox(1025, 676, 1, '01', 1);
            const reach = touch ? { R: [lerp(32, 102, ease(seg(lt, 27.6, 28.4))), lerp(-200, -222, ease(seg(lt, 27.6, 28.4)))] } : undefined;
            person(g, 'beer', bm.x, 990, 580, P('beer', t, bm.walk != null ? { walk: bm.walk } : lt < 26 ? { look: .8, flip: true, expr: 'worried' } : { look: .5, expr: 'worried', arms: lifted && !onTowel ? 'chest' : lt > 39.6 && lt < 40.6 ? 'point' : 'down', hands: reach }));
            if (lifted && !onTowel) tapeBox(lt < 39.6 ? bm.x + 24 : lerp(bm.x + 24, 940, seg(lt, 39.6, 40.4)), lt < 39.6 ? 742 : lerp(742, 696, seg(lt, 39.6, 40.4)), .8, '01', lt < 34 ? 1 : .2);
            if (onTowel && lt < 41.6) tapeBox(940, 696, .8, '01', .2);
          });
          fadeX(lt, 30, 31.2); fadeX(lt, 37, 38.2);
        } else {   // close on his hands under the lamp: a thumb wipes the water off the label
          g.fillStyle = '#0e1014'; g.fillRect(0, 0, W, H); const gr = g.createRadialGradient(960, 520, 40, 960, 520, 700); gr.addColorStop(0, 'rgba(255,210,140,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
          tapeBox(960, 560, 9, '01', 1 - ease(seg(lt, 32.6, 34.4)));
          g.fillStyle = '#d6a07c'; g.beginPath(); g.ellipse(lerp(560, 1400, ease(seg(lt, 32.6, 34.4))), 470, 90, 60, -.2, 0, 7); g.fill();
          g.beginPath(); g.ellipse(300, 760, 200, 110, .3, 0, 7); g.fill(); g.beginPath(); g.ellipse(1620, 760, 200, 110, -.3, 0, 7); g.fill();   // his hands holding it
          fadeX(lt, 30, 31.2); fadeX(lt, 37, 38.2);
        }
      } },

    // 8. he does not play it alone: a message to Nid; he keeps watch, three o'clock to four; he falls asleep at the desk
    { d: 26, ev: [[6.4, 'type'], [9.8, 'sent']],
      draw(lt, t) {
        if (lt < 4.6) { shop(g, t, true, { clock: 3.0 }); towelOn(1); person(g, 'beer', 880, 990, 580, P('beer', t, { look: .5, arms: lt > 1 ? 'phone' : 'down' })); }
        else if (lt < 12) phoneHeld(g, phoneScreen(g, { title: 'คุณนิด', rows: (lt > 9.8 ? [{ text: 'พรุ่งนี้เช้ามาด่วน ผมเจอม้วนที่หนึ่ง', me: true }] : []).concat(lt > 6.4 && lt < 9.8 ? [{ text: 'พรุ่งนี้เช้ามาด่วน ผมเจอม้วนที่หนึ่ง'.slice(0, Math.floor((lt - 6.4) * 10)) }] : []) }, t), t);
        else {
          const k = seg(lt, 12, 24), sleep = ease(seg(lt, 20, 22));
          shop(g, t, true, { clock: lerp(3.0, 4.1, k), lamp: 1 - .3 * k }); towelOn(1);
          g.save(); g.translate(880, 990); g.rotate(-.18 * sleep); g.translate(-880, -990);
          person(g, 'beer', 880, 990, 580, P('beer', t, { look: .5, arms: 'down', blink: lt > 17 && (lt > 20 || Math.sin(lt * 3) > .3), nod: sleep * 6 }));
          g.restore();
        }
        black(1 - seg(lt, 0, .5)); black(seg(lt, 24.4, 26)); } },

    // 9. morning, one shot: the knocking and his name; five missed calls; the door; Nid walks in; the towel, the case, the folded paper
    { d: 82, ev: [[1.0, 'knock'], [5.6, 'knock'], [8.2, 'startle'], ...T(13.4, 6), [16.6, 'door'], ...T(23, 6), [27.2, 'door'], [33, 'paper'], [44.6, 'paper'], [70.6, 'insert'], [74, 'vcr']],
      lines: [['x5', 'nid', 2.4, 'เบียร์! เบียร์ อยู่ไหม', 'Beer! Beer, are you in there?'],
              ['x6', 'nid', 17.6, 'นึกว่านายเป็นอะไรไปแล้ว เรียกตั้งนาน โทรไปก็ไม่รับ', "I thought something had happened to you. I knocked forever. You didn't answer your phone."],
              ['x7', 'beer', 24.6, 'ผมไม่ได้ดูมันคนเดียว รอคุณอยู่', "I didn't watch it alone. I waited for you."],
              ...B[2].lines.slice(0, 3).map((l, i) => [l[0], l[1], [29.6, 34.8, 40.0][i], l[3], l[4]]),
              ['x8', 'beer', 46.0, 'ในปกตลับมีกระดาษพับอยู่', "There's a folded paper inside the sleeve."],
              ...A[16].lines.filter(l => l[0] !== 'b9').map((l, i) => [l[0], l[1], [52.4, 58.6][i], l[3], l[4]]),
              [B[2].lines[3][0], 'nid', 64.4, B[2].lines[3][3], B[2].lines[3][4]]],
      draw(lt, t) {
        if (lt > 9 && lt < 13) { phoneHeld(g, phoneScreen(g, { title: 'สายที่ไม่ได้รับ', rows: [{ text: 'สายที่ไม่ได้รับ · คุณนิด (5)' }, { text: 'คุณนิด: เบียร์ รับสายหน่อย' }] }, t), t, false); return; }
        if (lt > 50.8 && lt < 63.4) { cam(960, 540, 1 + (lt - 50.8) * .01, () => workOrder(g, t)); fadeX(lt, 50.2, 51.4); fadeX(lt, 62.8, 64); return; }
        if (lt > 72.4) { vcr(g, t, ease(seg(lt, 72.4, 75)), '01  97'); fadeX(lt, 71.8, 73); black(seg(lt, 81.3, 82)); return; }
        const [x, y, z] = K(lt, [[0, [960, 540, 1.02]], [13, [960, 540, 1.02]], [16, [1300, 560, 1.1]], [26, [1300, 560, 1.1]], [29, [960, 560, 1.06]], [44, [960, 560, 1.06]], [46, [800, 640, 1.5]], [50.8, [760, 680, 2.4]], [64, [960, 560, 1.06]], [72.4, [370, 680, 3.2]]]);
        cam(x, y, z, () => {
          shop(g, t, false, { clock: 8.2 + lt / 60 }); rays();
          const unwrapped = lt > 31.4;
          towelOn(1 - ease(seg(lt, 30.4, 31.4)));
          shopDoor(g, ease(seg(lt, 16.6, 17.4)) * (1 - ease(seg(lt, 26.8, 27.6))));
          const nm = mover(lt, [[0, 1860], [23, 1860], [26, 1200]]);
          if (lt > 16.8) person(g, 'nid', nm.x, 990, 560, P('nid', t, nm.walk != null ? { walk: nm.walk, flip: true } : { flip: true, look: lt > 41 && lt < 45.5 ? 1 : .6, arms: 'down', expr: lt < 23 ? 'worried' : lt > 41 && lt < 45.5 ? 'frown' : 'neutral' }));
          const asleep = lt < 8.2, bm = mover(lt, [[0, 880], [13.4, 880], [16.4, 1620], [21.6, 1620], [24.4, 820]]);
          g.save(); if (asleep) { g.translate(880, 990); g.rotate(-.18); g.translate(-880, -990); }
          const holdTape = lt > 31.4 && lt < 70.4, paperOut = lt > 45.2;
          person(g, 'beer', bm.x, 990, 580, P('beer', t, bm.walk != null ? { walk: bm.walk, flip: bm.flip } : asleep ? { blink: true, nod: 6 } : lt < 13.4 ? { look: .9, expr: 'scared' } : { look: .6, arms: holdTape ? 'chest' : lt > 30.2 && lt < 31.4 ? 'point' : 'down' }));
          g.restore();
          if (!unwrapped || lt > 70.4) tapeBox(lt > 70.4 ? lerp(bm.x + 24, 380, seg(lt, 70.4, 71)) : 940, lt > 70.4 ? lerp(742, 673, seg(lt, 70.4, 71)) : 696, .8, '01', .1);
          if (holdTape) tapeBox(bm.x + 24, 742, .8, '01', .1);
          if (paperOut) workPaper(bm.x + 60, lerp(742, 700, ease(seg(lt, 45.2, 46))), .9);
        });
        black(1 - seg(lt, 0, .6));
      } },

    B[4], B[5], B[6], B[7],

    // 10. they leave: both walk to the door and out; outside, Beer locks up
    { d: 20, ev: [...T(2, 8), [5.6, 'door'], [9.6, 'door'], [14.4, 'lock']],
      draw(lt, t) {
        if (lt < 10) { cam(1200, 560, 1.06, () => { shop(g, t, false, { clock: 9.3 }); rays(); shopDoor(g, ease(seg(lt, 5.6, 6.4)) * (1 - ease(seg(lt, 9.2, 10)))); const bm = mover(lt, [[0, 700], [2, 700], [7, 1860]]), nm = mover(lt, [[0, 1200], [2.6, 1200], [6.2, 1860]]); if (lt < 7.4) person(g, 'nid', nm.x, 990, 560, P('nid', t, nm.walk != null ? { walk: nm.walk } : { flip: true })); if (lt < 8.2) person(g, 'beer', bm.x, 980, 560, P('beer', t, bm.walk != null ? { walk: bm.walk } : { look: .6 })); }); black(1 - seg(lt, 0, .5)); fadeX(lt, 9.4, 10.6); return; }
        shopFront(g, t); const nm = mover(lt, [[10, 1290], [11, 1290], [13.4, 820]]); person(g, 'nid', nm.x, 1000, 560, P('nid', t, nm.walk != null ? { walk: nm.walk, flip: true } : { flip: true }));
        person(g, 'beer', 1290, 1000, 580, P('beer', t, { arms: lt > 13.6 && lt < 15.4 ? 'torch' : 'down', look: .5, flip: lt > 15.6 }));
        black(seg(lt, 19.3, 20)); } },

    // 11. the drive across town
    { d: 12, ev: [[0, 'car']], lines: [['x9', 'nid', 2.0, 'ร้านเขาอยู่ในตลาดเก่า ฉันเคยไปขอสัมภาษณ์ เขาไม่ยอมพูด', "His shop's in the old market. I tried to interview him once. He wouldn't talk."]], draw(lt, t) { carRide(g, t); black(1 - seg(lt, 0, .5)); black(seg(lt, 11.3, 12)); } },

    // 12. the market: crowds, a noodle stall, a running child; they ask the way and walk on
    { d: 30, ev: [[0, 'market'], [0, 'crowd'], ...T(.4, 8), ...T(23.6, 8)],
      lines: [['x10', 'beer', 7.0, 'ขอโทษครับ ร้านช่างโอ๊ตไปทางไหนครับ', "Excuse me, which way to Oat's electrical shop?"],
              ['v1', 'vendor', 12.2, 'ร้านช่างโอ๊ตเหรอ ท้ายซอยโน่น ร้านป้ายแดง', "Oat's? End of the lane, the one with the red sign."],
              ['x11', 'nid', 19.6, 'ขอบคุณค่ะ', 'Thank you.']],
      draw(lt, t) {
        const [cx] = K(lt, [[0, [800]], [6, [1150]], [22, [1150]], [30, [1500]]]);
        cam(cx, 560, 1.12, () => {
          market2(g, t);
          // passers-by both ways (each a different stranger), people eating at the noodle tables, a child running
          const crowd = [];
          for (let i = 0; i < 16; i++) { const dir = i % 2 ? 1 : -1, sp = 70 + hash(i) * 50, y = 880 + hash(i + 40) * 110, x = ((hash(i + 9) * 2600 + dir * sp * lt) % 2600 + 2600) % 2600 - 340; crowd.push([y, () => person(g, extra(i + 30), x, y, 440 * (y / 1000), { t, walk: t * 7 + i, flip: dir < 0 })]); }
          crowd.push([1000, () => { const x = ((300 + lt * 260) % 2400) - 200; person(g, extra(70), x, 1000, 290, { t, walk: t * 12 }); }]);
          for (const [x, s, f] of [[1250, 51, false], [1350, 52, true], [1590, 53, false], [1690, 54, true]]) crowd.push([1001, () => { stool(g, x, 1000, .9); person(g, extra(s), x, 1000, 470, { t, sit: true, flip: f, hands: { L: [40, -250], R: [56 + 4 * Math.sin(t * 3 + s), -246 - 6 * Math.abs(Math.sin(t * 2 + s))] } }); }]);
          crowd.push([985, () => person(g, 'vendor', 1820, 985, 520, P('vendor', t, { flip: true, look: .6, arms: lt > 12.2 && lt < 18 ? 'point' : 'down' }))]);
          const bm = mover(lt, [[0, -200], [.4, -200], [4.4, 1500], [23.6, 1500], [30, 2400]]), nm = mover(lt, [[0, -400], [.6, -400], [4.8, 1360], [23.8, 1360], [30, 2240]]);
          crowd.push([1010, () => person(g, 'beer', bm.x, 1010, 580, P('beer', t, bm.walk != null ? { walk: bm.walk, flip: bm.flip } : { look: .6 }))]);
          crowd.push([1005, () => person(g, 'nid', nm.x, 1005, 560, P('nid', t, nm.walk != null ? { walk: nm.walk, flip: nm.flip } : { look: .6 }))]);
          crowd.sort((a, b) => a[0] - b[0]).forEach(c => c[1]());
        });
        black(1 - seg(lt, 0, .5)); black(seg(lt, 29.3, 30)); } },

    // 13. Oat's shop: greetings, why he quit, the call, the breaker box (the camera turns to it), Pa Daeng
    { d: 60, ev: [[0, 'market'], [.2, 'door'], ...T(.4, 5)],
      lines: [['o1', 'oatOld', 3.0, 'มาหาใครครับ', 'Looking for someone?'],
              ['x12', 'beer', 5.6, 'สวัสดีครับ พี่โอ๊ตใช่ไหมครับ ผมเบียร์ ส่วนนี่คุณนิด', "Hello, are you Oat? I'm Beer. This is Ms. Nid."],
              ['o6', 'oatOld', 11.6, 'ผมเอง นักข่าวคนนั้นอีกแล้วเหรอ', "That's me. The reporter again?"],
              ['b15', 'beer', 16.8, 'ใบนี้ของพี่ใช่ไหมครับ ตัดไฟชั้นสี่ ตีสองห้าสิบแปด', 'Is this yours? Power cut, fourth floor, two fifty-eight.'],
              ['o7', 'oatOld', 23.2, 'หลังคืนนั้นผมลาออกเลย มาเปิดร้านเอง', 'After that night I quit. Opened this place myself.'],
              ['o2', 'oatOld', 29.0, 'ผมไม่ได้ตัด คืนนั้นมีผู้หญิงโทรมาสั่ง บอกว่าเป็นแม่บ้าน', "I didn't cut it. A woman called that night. Said she was the cleaner."],
              ['o3', 'oatOld', 37.0, 'พอผมไปถึงตู้ไฟ คัตเอาต์ถูกสับลงไปแล้ว บนตู้มีรอยมือเปียก', 'When I reached the breaker box, it was already off. There was a wet handprint on it.'],
              ['b16', 'beer', 50.2, 'แม่บ้านคนไหนครับ', 'Which cleaner?'],
              ['o4', 'oatOld', 53.8, 'ป้าแดง', 'Pa Daeng.']],
      draw(lt, t) {
        camK(lt, [[0, [960, 540, 1]], [22.8, [960, 540, 1]], [24, [1300, 600, 1.5]], [42.6, [1300, 600, 1.5]], [44.4, [1440, 340, 2.2]], [48.6, [1440, 340, 2.2]], [50, [960, 540, 1]]], () => {
          oatShop(g, t);
          if (lt > 42.6 && lt < 50) { const a = seg(lt, 43.6, 44.6) * (1 - seg(lt, 48.6, 49.4)); g.fillStyle = `rgba(160,200,230,${.5 * a})`; g.beginPath(); g.ellipse(1738, 350, 30, 38, .2, 0, 7); g.fill(); for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(1712 + k * 16, 302 - Math.abs(k - 1.5) * 8, 7, 18, -.3 + k * .15, 0, 7); g.fill(); } }   // the wet handprint, as he remembers it
          person(g, 'oatOld', 1300, 900, 520, P('oatOld', t, { look: .6, flip: true, arms: lt > 42.4 && lt < 44.4 ? 'point' : 'down', expr: lt > 22 ? 'worried' : 'neutral' }));
          const bm = mover(lt, [[0, -200], [.4, -200], [2.8, 520]]), nm = mover(lt, [[0, -380], [.7, -380], [3.1, 300]]);
          person(g, 'beer', bm.x, 1010, 580, P('beer', t, bm.walk != null ? { walk: bm.walk } : { look: .6, arms: lt > 16.6 && lt < 22.6 ? 'torch' : 'down' }));
          person(g, 'nid', nm.x, 1000, 560, P('nid', t, nm.walk != null ? { walk: nm.walk } : { look: .6 }));
          if (lt > 16.6 && lt < 22.6) workPaper(720, 700, 1.2);
        });
        black(1 - seg(lt, 0, .5)); } },

    // 14. Nid: she vanished on the 13th (the camera eases in on Oat)
    { d: 22, ev: [[13.6, 'sting']], lines: B[9].lines,
      draw(lt, t) { camK(lt, [[0, [900, 560, 1.1]], [13, [900, 560, 1.1]], [15, [1300, 600, 1.6]], [22, [1300, 600, 1.65]]], () => { oatShop(g, t); person(g, 'oatOld', 1300, 900, 520, P('oatOld', t, { look: .6, flip: true, expr: 'scared' })); person(g, 'beer', 520, 1010, 580, P('beer', t, { look: .6, expr: lt > 7 ? 'worried' : 'neutral' })); person(g, 'nid', 300, 1000, 560, P('nid', t, { look: .6, expr: 'worried' })); }); black(seg(lt, 21.3, 22)); } },

    // 15. that night: the TV switches itself on — live; the camera rises from Beer to the camcorder on the shelf
    { d: 36, ev: [[1, 'fade'], [10, 'tvon'], [10.2, 'sting2'], [22, 'zoom'], [30, 'sting']],
      lines: B[10].lines.map((l, i) => [l[0], l[1], [4.0, 14.4, 27.0][i], l[3], l[4]]),
      draw(lt, t) {
        if (lt < 3) { g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); g.save(); g.translate(W / 2, H / 2); g.fillStyle = '#e8e4d8'; g.beginPath(); g.arc(0, 0, 160, 0, 7); g.fill(); const hr = lerp(10.2, 13.2, ease(seg(lt, 0, 3))); g.strokeStyle = '#2a2a2a'; g.lineCap = 'round'; g.lineWidth = 14; g.beginPath(); g.moveTo(0, 0); const a1 = (hr % 12) / 12 * 6.283 - 1.571; g.lineTo(Math.cos(a1) * 80, Math.sin(a1) * 80); g.stroke(); g.lineWidth = 8; const a2 = (hr % 1) * 6.283 - 1.571; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a2) * 125, Math.sin(a2) * 125); g.stroke(); g.restore(); black(1 - seg(lt, 0, .5)); black(seg(lt, 2.5, 3)); return; }
        const live = lt > 10;
        camK(lt, [[3, [960, 540, 1]], [20.6, [960, 540, 1]], [26, [860, 110, 4]], [36, [860, 110, 4.2]]], () => {
          shop(g, t, true, { clock: 1.2, screen: live ? '#2a3430' : '#1a2a3a' });
          if (live) frozenTV(() => { api.shopHigh(g, t); g.font = '700 70px monospace'; g.fillStyle = '#fff'; g.fillText('● REC', 80, 120); g.fillText('NOV.21.2026  AM 1:12', 980, 1000); }, t);
          person(g, 'beer', 760, 990, 580, P('beer', t, { look: lt > 19.4 ? 0 : .8, flip: true, expr: live ? 'worried' : 'neutral', nod: lt > 19.4 ? -6 : 0 }));
          g.save(); g.translate(860, 92); g.fillStyle = '#2a2a30'; g.fillRect(-40, -22, 80, 44); g.fillStyle = '#1a1a1e'; g.beginPath(); g.ellipse(48, 0, 14, 16, 0, 0, 7); g.fill(); g.fillStyle = '#3a5a9a'; g.beginPath(); g.ellipse(48, 0, 7, 8, 0, 0, 7); g.fill(); if (lt > 20 && Math.floor(t * 2) % 2 === 0) { g.fillStyle = '#ff2a20'; g.beginPath(); g.arc(-28, -12, 5, 0, 7); g.fill(); } g.restore();
        });
        black(1 - seg(lt, 3, 3.5)); black(seg(lt, 35.2, 36)); } },

    endCard,
  ];
  // light and atmosphere per scene (main.js applies them after each draw): tone, vignette, atmosphere layers
  const day = { tone: 'warm', atmo: [['beams', { a: .2 }], ['dust', { a: .5 }]] }, night = { tone: 'night', v: .55, atmo: [['glow', { x: 900, y: 600, r: 520, col: 'rgba(255,200,120,.12)' }]] };
  const LOOK = { 0: false, 1: day, 2: night, 3: { atmo: [['haze', { col: 'rgba(40,60,90,.3)' }]] }, 4: { atmo: [['flicker']] }, 5: { atmo: [['dust', { a: .3, n: 40 }]] }, 6: night,
    7: { atmo: [['dust', { a: .3 }], ['flicker']] }, 13: night, 14: { tone: 'tv', v: .6 }, 15: day, 19: { tone: 'day', atmo: [['beams', { a: .14 }]] }, 20: { tone: 'day', v: .4 }, 21: { tone: 'day', v: .4 },
    22: { tone: 'warm', v: .42, atmo: [['beams', { a: .12 }], ['haze', { col: 'rgba(255,220,170,.16)' }]] }, 23: { tone: 'warm', v: .5, atmo: [['dust', { a: .35 }]] }, 24: { tone: 'warm', v: .5 }, 25: { tone: 'tv', v: .62 }, 26: false };
  S.forEach((sc, i) => { if (i in LOOK) sc.look = LOOK[i]; });
  return S;

};
