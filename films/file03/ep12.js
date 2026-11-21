// FILE 03 · ตอนที่ ๑ (merged): episode 1 and episode 2 as one film, with the bridging scenes the story needs.
// Unchanged scenes come straight from ep1.js / ep2.js; changed and new scenes are written here.
// Voices: only the lines already voiced for episode 1 have audio; every new line is subtitles only (no voice yet).
import ep1 from './ep1.js';
import ep2 from './ep2.js';
export default (api) => {
  const { g, W, H, TH, person, P, cam, pov, walk, black, vhs, frozenTV, seg, ease, lerp, hash,
    shop, lift, workOrder, oatShop, shopDoor, building2026, phoneHeld, phoneScreen, shopFront, carRide, market } = api;
  const A = ep1(api), B = ep2(api);
  const tape01 = (x, y, s = 1, wet = 0) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#1a1a1e'; g.fillRect(-45, -26, 90, 52); g.fillStyle = '#f2ecd8'; g.fillRect(-35, -16, 70, 18); g.fillStyle = '#c8322c'; g.font = '700 16px monospace'; g.fillText('01', -9, -2); if (wet > 0) { g.fillStyle = `rgba(150,190,220,${.55 * wet})`; g.fillRect(-35, -16, 70, 18); for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(-30 + k * 20, 30 + k % 2 * 6, 3, 5, 0, 0, 7); g.fill(); } } g.restore(); };
  const shopDay = (t, clock, extra) => { shop(g, t, false, { clock }); g.save(); g.globalCompositeOperation = 'screen'; for (const [x0, w] of [[1300, 160], [1500, 110], [1640, 70]]) { const gr = g.createLinearGradient(x0, 120, x0 - 500, 1000); gr.addColorStop(0, 'rgba(255,245,215,.16)'); gr.addColorStop(1, 'rgba(255,245,215,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x0, 120); g.lineTo(x0 + w, 120); g.lineTo(x0 + w - 560, 1080); g.lineTo(x0 - 560, 1080); g.closePath(); g.fill(); } g.restore(); extra && extra(); };
  const box = (lt) => { g.fillStyle = '#7a5a3a'; g.fillRect(860, 640, 180, 70); g.fillStyle = '#6a4a2e'; g.fillRect(860, 640, 180, 14); };
  const endCard = { d: 8, ev: [[0, 'end']], draw(lt) {
    g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); g.textAlign = 'center';
    g.font = '700 110px monospace'; g.fillStyle = '#f2f2ec'; g.fillText('FILE 03', W / 2, 470);
    g.font = `600 52px ${TH}`; g.fillStyle = '#e8463c'; g.fillText('ตอนที่ ๑ จบ', W / 2, 580);
    g.font = `400 40px ${TH}`; g.fillStyle = `rgba(220,220,220,${seg(lt, 2, 3)})`; g.fillText('ตอนหน้า · ม้วนที่ ๒  /  Next: Tape Two', W / 2, 680); g.textAlign = 'left';
    black(1 - seg(lt, 0, .8)); black(seg(lt, 7, 8)); } };

  return [
    A[0],   // title

    // a knock: Beer opens the door to Nid (first visit)
    { d: 16, ev: [[1.0, 'knock'], ...[0, .5, 1, 1.5, 2, 2.5].map(a => [a + 3.2, 'step']), [6.4, 'door']],
      lines: [['x1', 'nid', 7.6, 'สวัสดีค่ะ นิด ช่องเจ็ด ที่โทรนัดไว้ค่ะ', "Hello. Nid, Channel 7. We spoke on the phone."],
              ['x2', 'beer', 11.8, 'เชิญครับ', 'Please, come in.']],
      draw(lt, t) {
        shopDay(t, 14.0);
        const open = ease(seg(lt, 6.4, 7.2)) * (1 - ease(seg(lt, 14.6, 15.4)));
        shopDoor(g, open);
        if (open > .3 && lt < 14.6) person(g, 'nid', lt > 12.4 ? lerp(1840, 1500, seg(lt, 12.4, 14.6)) : 1840, 990, 560, P('nid', t, lt > 12.4 ? { walk: (lt - 12.4) * 7, flip: true } : { flip: true, look: .6, arms: 'down' }));
        const w = walk(lt, 3.2, 6.2, 620, 1620);
        person(g, 'beer', w.x, 980, 560, P('beer', t, w.walk != null ? { walk: w.walk } : lt < 3.2 ? { look: .8, arms: 'down', expr: lt > 1.2 ? 'neutral' : 'neutral' } : { look: .6, arms: lt > 11.6 && lt < 13 ? 'point' : 'down' }));
        black(1 - seg(lt, 0, .6));
      } },

    // the box: five tapes, tape one missing
    { d: 10, lines: [A[1].lines[0]].map(l => [l[0], l[1], 1.0, l[3], l[4]]),
      draw(lt, t) { cam(960, 540, 1.02, () => { shopDay(t, 14.1, box); person(g, 'beer', 620, 980, 560, P('beer', t, { look: .6 })); person(g, 'nid', 1300, 990, 560, P('nid', t, { look: .6, flip: true, arms: 'down' })); }); } },

    // Nid's phone: the building as it is today
    { d: 15, ev: [[.4, 'whoosh']],
      lines: [['x3', 'nid', 1.2, 'ปีสี่สิบปิดแค่ชั้นสี่ หลังจากนั้นปิดทั้งตึก', "In '97 they only closed the fourth floor. After that, the whole building."],
              ['x4', 'nid', 8.6, 'เดือนหน้าจะรื้อแล้ว', "They're tearing it down next month."]],
      draw(lt, t) {
        if (lt < 4.5) phoneHeld(g, () => building2026(g, t), t);
        else cam(1280, 760, lerp(1.1, 1.6, ease(seg(lt, 4.5, 14))), () => building2026(g, t));
        black(1 - seg(lt, 0, .4)); } },

    // Beer notices tape three is dry; Nid; tonight, alone
    { d: 22, lines: A[1].lines.slice(1).map(l => [l[0], l[1], l[2] - 8.6, l[3], l[4]]),
      draw(lt, t) {
        const close = lt > .6 && lt < 8.2, z = close ? 1.5 : 1.02;
        cam(close ? 700 : 960, close ? 600 : 540, z, () => {
          shopDay(t, 14.3, box);
          for (let k = 0; k < 5; k++) { g.fillStyle = k === 2 ? '#2a2a30' : '#1a1a1e'; g.fillRect(872 + k * 32, lt > 1.4 && lt < 6.4 && k === 2 ? 600 : 620, 26, 40); }
          person(g, 'beer', 620, 980, 560, P('beer', t, { look: .6, arms: lt > 1.4 && lt < 6.4 ? 'chest' : 'down' }));
          person(g, 'nid', 1300, 990, 560, P('nid', t, { look: .6, flip: true, arms: 'down' }));
        });
        black(seg(lt, 21.2, 22)); } },

    A[2], A[3], A[4], A[5], A[6], A[7], A[8], A[9], A[10], A[11], A[12], A[13], A[14],

    // after STOP: a soft thud on the desk; he turns, lifts a wet tape, wipes the label: 01
    { d: 38, ev: [[0, 'tapeout'], [6.4, 'zoom'], [10.4, 'sting'], [13.6, 'flicker2'], [14, 'mop'], [18.6, 'sting2'], [22.8, 'stop'], [25.0, 'thud'], [30.6, 'paper']],
      lines: [...A[15].lines.filter(l => l[0] !== 'b7'), ['b7', 'beer', 33.2, 'ม้วนที่หนึ่ง…', 'Tape one…']],
      draw(lt, t) {
        if (lt < 24.6) { A[15].draw(lt, t); return; }
        const turned = lt > 26, lifted = lt > 28;
        if (lt < 30) {
          shop(g, t, true, { footprints: 7, lamp: 1 });
          if (!lifted) tape01(1025, 676, 1, 1);
          person(g, 'beer', 760, 990, 580, P('beer', t, turned ? { look: .5, arms: lifted ? 'chest' : 'down', expr: 'worried' } : { look: .8, flip: true, expr: 'worried' }));
          if (lifted) tape01(800, 742, .8, 1);
        } else {   // close: the lamp on the label; a thumb wipes the water off
          cam(960, 540, 1, () => { g.fillStyle = '#0e1014'; g.fillRect(0, 0, W, H); const gr = g.createRadialGradient(960, 520, 40, 960, 520, 700); gr.addColorStop(0, 'rgba(255,210,140,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); tape01(960, 560, 9, 1 - ease(seg(lt, 30.6, 32.4))); g.fillStyle = '#d6a07c'; g.beginPath(); g.ellipse(lerp(560, 1400, ease(seg(lt, 30.6, 32.4))), 470, 90, 60, -.2, 0, 7); g.fill(); });
        }
      } },

    // he does not play it alone: a bag, a message to Nid, and he keeps watch until he falls asleep
    { d: 26, ev: [[1.2, 'paper'], [6.4, 'type'], [9.8, 'sent']],
      draw(lt, t) {
        if (lt < 5) { shop(g, t, true, { clock: 3.0 }); person(g, 'beer', 760, 990, 580, P('beer', t, { look: .5, arms: 'chest' })); g.fillStyle = 'rgba(220,230,240,.35)'; g.fillRect(740, 700, 120, 84); tape01(800, 742, .8, .3); }
        else if (lt < 12) phoneHeld(g, () => phoneScreen(g, { title: 'คุณนิด', rows: [{ text: 'พรุ่งนี้เช้ามาด่วน ผมเจอม้วนที่หนึ่ง', me: true }].slice(0, lt > 9.8 ? 1 : 0).concat(lt > 6.4 && lt < 9.8 ? [{ text: 'พรุ่งนี้เช้ามาด่วน ผมเจอม้วน' + 'ที่หนึ่ง'.slice(0, Math.floor((lt - 6.4) * 3)) }] : []) }, t), t);
        else {   // the clock goes from three to four; his eyes close; he slumps over the desk
          const k = seg(lt, 12, 24), sleep = lt > 20;
          shop(g, t, true, { clock: lerp(3.0, 4.1, k), lamp: 1 - .3 * k });
          g.save(); g.translate(760, 990); g.rotate(sleep ? -.18 * ease(seg(lt, 20, 22)) : 0); g.translate(-760, -990);
          person(g, 'beer', 760, 990, 580, P('beer', t, { look: .5, arms: 'down', blink: lt > 17 && (lt > 20 || Math.sin(lt * 3) > .3) }));
          g.restore(); g.fillStyle = 'rgba(220,230,240,.35)'; g.fillRect(990, 650, 120, 84); tape01(1050, 692, .8, .2);
        }
        black(1 - seg(lt, 0, .5)); black(seg(lt, 24.4, 26)); } },

    // morning: knocking, Nid calling his name; five missed calls; he opens the door
    { d: 30, ev: [[1.0, 'knock'], [5.6, 'knock'], [8.2, 'startle'], ...[0, .5, 1, 1.5, 2, 2.5].map(a => [a + 13.4, 'step']), [16.6, 'door']],
      lines: [['x5', 'nid', 2.4, 'เบียร์! เบียร์ อยู่ไหม', 'Beer! Beer, are you in there?'],
              ['x6', 'nid', 17.6, 'นึกว่านายเป็นอะไรไปแล้ว เรียกตั้งนาน โทรไปก็ไม่รับ', "I thought something had happened to you. I knocked forever. You didn't answer your phone."],
              ['x7', 'beer', 24.4, 'ผมไม่ได้ดูมันคนเดียว รอคุณอยู่', "I didn't watch it alone. I waited for you."]],
      draw(lt, t) {
        if (lt > 9 && lt < 13) { phoneHeld(g, () => phoneScreen(g, { title: '08:12', rows: [{ text: 'สายที่ไม่ได้รับ · คุณนิด (5)' }, { text: 'คุณนิด: เบียร์ รับสายหน่อย' }] }, t), t); return; }
        shopDay(t, 8.2);
        const open = ease(seg(lt, 16.6, 17.4));
        shopDoor(g, open);
        if (open > .3) person(g, 'nid', lt > 23 ? lerp(1840, 1480, seg(lt, 23, 25.6)) : 1840, 990, 560, P('nid', t, lt > 23 && lt < 25.6 ? { walk: (lt - 23) * 7, flip: true } : { flip: true, look: .6, arms: 'down', expr: lt < 23 ? 'worried' : 'neutral' }));
        const asleep = lt < 8.2, w = walk(lt, 13.4, 16.4, 760, 1620);
        g.save(); if (asleep) { g.translate(760, 990); g.rotate(-.18); g.translate(-760, -990); }
        person(g, 'beer', w.x, 990, 580, P('beer', t, w.walk != null ? { walk: w.walk } : asleep ? { blink: true, arms: 'down' } : lt < 13.4 ? { look: .9, expr: 'scared' } : { look: .6, arms: 'down' }));
        g.restore();
        if (lt < 13.4) { g.fillStyle = 'rgba(220,230,240,.35)'; g.fillRect(990, 650, 120, 84); tape01(1050, 692, .8, .2); }
        black(1 - seg(lt, 0, .6)); } },

    // tape one: still damp, the smell of floor cleaner, a folded paper in the sleeve
    { d: 30, ev: [[21.4, 'paper']],
      lines: [...B[2].lines.slice(0, 3).map(l => [l[0], l[1], l[2] - 2.0, l[3], l[4]]),
              ['x8', 'beer', 21.0, 'ในปกตลับมีกระดาษพับอยู่', "There's a folded paper inside the sleeve."]],
      draw(lt, t) {
        const close = lt > 11.6 && lt < 19.4 || lt > 20.6;
        cam(close ? 700 : 960, close ? 620 : 540, close ? 1.6 : 1.02, () => {
          shopDay(t, 8.4);
          person(g, 'beer', 620, 980, 560, P('beer', t, { look: .6, arms: 'chest' })); tape01(654, 726, .9, .2);
          if (lt > 21) { g.save(); g.translate(700, 640); g.rotate(-.1); g.fillStyle = '#f2e8c8'; g.fillRect(-30, -40, 60, 80); g.fillStyle = '#e8c43a'; g.fillRect(-30, -40, 60, 10); g.restore(); }
          person(g, 'nid', 1300, 990, 560, P('nid', t, { look: .6, flip: true, arms: 'down' }));
        }); } },

    // the work order, unfolded (voiced in episode 1)
    { d: 14, lines: A[16].lines.filter(l => l[0] !== 'b9').map(l => [l[0], l[1], l[2] - 1.6, l[3], l[4]]),
      draw(lt, t) { cam(960, 540, 1 + lt * .01, () => workOrder(g, t)); } },

    { d: 7, lines: [B[2].lines[3]].map(l => [l[0], l[1], .8, l[3], l[4]]),
      draw(lt, t) { shopDay(t, 8.5); person(g, 'beer', 620, 980, 560, P('beer', t, { look: .6, arms: 'chest' })); tape01(654, 726, .9); person(g, 'nid', 1300, 990, 560, P('nid', t, { look: .6, flip: true, arms: 'down' })); black(seg(lt, 6.3, 7)); } },

    B[3], B[4], B[5], B[6], B[7],

    // they leave: Beer locks the shop
    { d: 10, ev: [[1, 'door'], [5.4, 'lock']],
      draw(lt, t) { shopFront(g, t); const w = walk(lt, 1.4, 4.6, 1290, 800); person(g, 'nid', w.x - 220, 1000, 560, P('nid', t, { walk: w.walk, flip: true })); person(g, 'beer', lt < 4.6 ? 1290 : 1290, 1000, 580, P('beer', t, { arms: lt > 4.6 && lt < 7 ? 'torch' : 'down', look: .5 })); black(1 - seg(lt, 0, .5)); black(seg(lt, 9.3, 10)); } },

    // the drive across town
    { d: 10, ev: [[0, 'car']],
      lines: [['x9', 'nid', 1.6, 'ร้านเขาอยู่ในตลาดเก่า ฉันเคยไปขอสัมภาษณ์ เขาไม่ยอมพูด', "His shop's in the old market. I tried to interview him once. He wouldn't talk."]],
      draw(lt, t) { carRide(g, t); black(1 - seg(lt, 0, .5)); black(seg(lt, 9.3, 10)); } },

    // the market: asking the way
    { d: 24, ev: [[0, 'market'], ...[0, .5, 1, 1.5, 2, 2.5, 3].map(a => [a + .4, 'step']), ...[0, .5, 1, 1.5, 2].map(a => [a + 19.6, 'step'])],
      lines: [['x10', 'beer', 4.4, 'ขอโทษครับ ร้านช่างโอ๊ตไปทางไหนครับ', "Excuse me, which way to Oat's electrical shop?"],
              ['v1', 'vendor', 9.4, 'ร้านช่างโอ๊ตเหรอ ท้ายซอยโน่น ร้านป้ายแดง', "Oat's? End of the lane, the one with the red sign."],
              ['x11', 'nid', 16.0, 'ขอบคุณค่ะ', 'Thank you.']],
      draw(lt, t) {
        cam(960, 540, 1.03, () => {
          market(g, t);
          person(g, 'vendor', 1180, 980, 520, P('vendor', t, { flip: true, look: .6, arms: lt > 9.4 && lt < 15 ? 'point' : 'down', view: lt > 9.4 && lt < 15 ? undefined : undefined }));
          const w = lt < 19.6 ? walk(lt, .4, 3.6, -200, 760) : walk(lt, 19.6, 24, 760, 2100), w2 = lt < 19.6 ? walk(lt, .6, 3.8, -380, 540) : walk(lt, 19.8, 24, 540, 1900);
          person(g, 'beer', w.x, 1010, 580, P('beer', t, w.walk != null ? { walk: w.walk } : { look: .6, arms: 'down' }));
          person(g, 'nid', w2.x, 1000, 560, P('nid', t, w2.walk != null ? { walk: w2.walk } : { look: .6, arms: 'down' }));
        });
        black(1 - seg(lt, 0, .5)); black(seg(lt, 23.3, 24)); } },

    // Oat's shop: greetings, why he quit, the phone call, the wet handprint
    { d: 58, ev: [[0, 'market'], [.2, 'door'], ...[0, .5, 1, 1.5, 2].map(a => [a + .4, 'step'])],
      lines: [['o1', 'oatOld', 3.0, 'มาหาใครครับ', 'Looking for someone?'],
              ['x12', 'beer', 5.6, 'สวัสดีครับ พี่โอ๊ตใช่ไหมครับ ผมเบียร์ ส่วนนี่คุณนิด', "Hello, are you Oat? I'm Beer. This is Ms. Nid."],
              ['o6', 'oatOld', 11.6, 'ผมเอง นักข่าวคนนั้นอีกแล้วเหรอ', "That's me. The reporter again?"],
              ['b15', 'beer', 16.8, 'ใบนี้ของพี่ใช่ไหมครับ ตัดไฟชั้นสี่ ตีสองห้าสิบแปด', 'Is this yours? Power cut, fourth floor, two fifty-eight.'],
              ['o7', 'oatOld', 23.2, 'หลังคืนนั้นผมลาออกเลย มาเปิดร้านเอง', 'After that night I quit. Opened this place myself.'],
              ['o2', 'oatOld', 29.0, 'ผมไม่ได้ตัด คืนนั้นมีผู้หญิงโทรมาสั่ง บอกว่าเป็นแม่บ้าน', "I didn't cut it. A woman called that night. Said she was the cleaner."],
              ['o3', 'oatOld', 37.0, 'พอผมไปถึงตู้ไฟ คัตเอาต์ถูกสับลงไปแล้ว บนตู้มีรอยมือเปียก', 'When I reached the breaker box, it was already off. There was a wet handprint on it.'],
              ['b16', 'beer', 48.2, 'แม่บ้านคนไหนครับ', 'Which cleaner?'],
              ['o4', 'oatOld', 51.8, 'ป้าแดง', 'Pa Daeng.']],
      draw(lt, t) {
        if (lt > 43 && lt < 47.6) { cam(1440, 340, 2.2, () => { oatShop(g, t); g.fillStyle = 'rgba(160,200,230,.5)'; g.beginPath(); g.ellipse(1738, 350, 30, 38, .2, 0, 7); g.fill(); for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(1712 + k * 16, 302 - Math.abs(k - 1.5) * 8, 7, 18, -.3 + k * .15, 0, 7); g.fill(); } }); return; }
        const close = lt > 22.8 && lt < 43;
        cam(close ? 1300 : 960, close ? 600 : 540, close ? 1.55 : 1, () => {
          oatShop(g, t);
          person(g, 'oatOld', 1300, 900, 520, P('oatOld', t, { look: .6, flip: true, arms: 'down', expr: lt > 22 ? 'worried' : 'neutral' }));
          const w = walk(lt, 0, 2.4, -200, 520); person(g, 'beer', w.x, 1010, 580, P('beer', t, { walk: w.walk, look: .6, arms: lt > 16.8 && lt < 22.6 ? 'torch' : 'down' }));
          const w2 = walk(lt, .3, 2.7, -380, 300); person(g, 'nid', w2.x, 1000, 560, P('nid', t, { walk: w2.walk, look: .6, arms: 'down' }));
          if (lt > 16.8 && lt < 22.6) { g.save(); g.translate(720, 700); g.rotate(-.1); g.fillStyle = '#f2e8c8'; g.fillRect(-40, -50, 80, 100); g.fillStyle = '#e8c43a'; g.fillRect(-40, -50, 80, 14); g.restore(); }
        });
        black(1 - seg(lt, 0, .5)); } },

    B[9], B[10],
    endCard,
  ];
};
