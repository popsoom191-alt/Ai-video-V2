// FILE 03 · ตอนที่ ๒ "ม้วนที่ ๑": the scene list (no voices yet: subtitles time themselves from the text).
export default ({ g, W, H, TH, person, P, cam, pov, walk, black, vhs, darkTorch, frozenTV, seg, ease, lerp, hash, clamp,
  shop, corridor, lift, paper, vcr, lab, labOn, oatShop, shopHigh, workOrder }) => {
  const tape01 = (x, y, s = 1) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#1a1a1e'; g.fillRect(-45, -26, 90, 52); g.fillStyle = '#f2ecd8'; g.fillRect(-35, -16, 70, 18); g.fillStyle = '#c8322c'; g.font = '700 16px monospace'; g.fillText('01', -9, -2); g.restore(); };
  const camcorder = (x, y, s, rec) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#2a2a30'; g.fillRect(-40, -22, 80, 44); g.fillStyle = '#1a1a1e'; g.beginPath(); g.ellipse(48, 0, 14, 16, 0, 0, 7); g.fill(); g.fillStyle = '#3a5a9a'; g.beginPath(); g.ellipse(48, 0, 7, 8, 0, 0, 7); g.fill(); if (rec) { g.fillStyle = '#ff2a20'; g.beginPath(); g.arc(-28, -12, 5, 0, 7); g.fill(); } g.restore(); };
  const headphones = (x, y, s) => { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = '#1a1a1e'; g.lineWidth = 5; g.beginPath(); g.arc(0, -366, 28, Math.PI, 0); g.stroke(); g.fillStyle = '#1a1a1e'; g.fillRect(-32, -372, 10, 18); g.fillRect(22, -372, 10, 18); g.restore(); };
  const static_ = t => { g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(255,255,255,${hash(Math.floor(t * 30) * 11 + i) * .6})`; g.fillRect(hash(i + Math.floor(t * 30)) * W, hash(i * 3 + Math.floor(t * 30)) * H, 3, 2); } };
  const card = (lt, th, en) => { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(60, 60, 520, 110); g.font = `700 48px ${TH}`; g.fillStyle = '#e8463c'; g.fillText(th, 90, 122); g.font = `500 26px ${TH}`; g.fillStyle = '#ddd'; g.fillText(en, 92, 156); };
  // the lab in tape 01: the doctor, Pa Daeng in headphones by the monitors, Fon at the door
  const labScene = (lt, t, o) => {
    labOn(g, t, o.ghost || 0);
    if (o.fon) person(g, 'fon', 330, 900, 300, P('fon', t, { view: 'front', expr: o.fonExpr || 'worried' }));
    if (o.daeng) { person(g, 'daeng', 1250, 900, 400, P('daeng', t, { view: 'front', arms: 'down', expr: o.daengExpr || 'smile' })); headphones(1250, 900, 400 / 410); }
    if (o.wichai) person(g, 'wichai', o.wx || 760, 960, 520, P('wichai', t, { view: o.wview || 'front', flip: o.wflip, expr: o.wexpr || 'neutral' }));
  };

  return [
    { d: 6, ev: [[1.0, 'type']], draw(lt) {
      g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); const n = Math.floor(seg(lt, .8, 2.4) * 7);
      g.font = '700 150px monospace'; g.fillStyle = '#f2f2ec'; g.textAlign = 'center'; g.fillText('FILE 03'.slice(0, n), W / 2, 520);
      g.font = `600 48px ${TH}`; g.fillStyle = `rgba(232,70,60,${seg(lt, 2.8, 3.6)})`; g.fillText('ตอนที่ ๒ · ม้วนที่ ๑', W / 2, 620); g.textAlign = 'left'; black(seg(lt, 5.2, 6)); } },

    { d: 12, ev: [[0, 'tapein'], [4, 'whoosh'], [8, 'whoosh']], draw(lt, t) {   // previously
      if (lt < 4) { lift(g, 0, 1, 1); person(g, 'fon', 960, 900, 430, { t: 0, view: 'front', expr: 'worried' }); vhs(t, { time: 'AM 2:41' }); }
      else if (lt < 8) { paper(g, 0); vhs(t, { time: 'AM 2:36' }); }
      else { shop(g, t, true, {}); person(g, 'beer', 760, 990, 580, P('beer', t, { look: .8, flip: true })); tape01(1025, 676); }
      card(lt, 'ตอนที่แล้ว', 'Previously'); black(1 - seg(lt, 0, .4)); black(seg(lt, 11.4, 12)); } },

    { d: 28, ev: [[.4, 'door'], ...[0, .45, .9, 1.35, 1.8].map(a => [a + .5, 'step'])],   // morning: Beer shows Nid tape 01
      lines: [['b11', 'beer', 2.6, 'ม้วนนี้โผล่มาบนโต๊ะผมเมื่อคืน หลังจากผมกด STOP', 'This one appeared on my desk last night, right after I hit stop.'],
              ['n3', 'nid', 8.4, 'เป็นไปไม่ได้ ม้วนที่หนึ่งหายไปยี่สิบเก้าปีแล้ว', 'Impossible. Tape one has been missing for twenty-nine years.'],
              ['b12', 'beer', 14.0, 'ตลับยังชื้น และมีกลิ่นน้ำยาถูพื้น กลิ่นเดียวกับทางเดินชั้นสี่', 'The case is still damp, and it smells of floor cleaner. Like the fourth-floor corridor.'],
              ['n4', 'nid', 21.8, 'งั้นเปิดเลย ฉันจะดูด้วย', "Then play it. I'm watching too."]],
      draw(lt, t) {
        const close = lt > 13.6 && lt < 21.4;
        cam(close ? 700 : 960, close ? 600 : 540, close ? 1.5 : 1.02, () => {
          shop(g, t, false, { clock: 8.4 });
          person(g, 'beer', 620, 980, 560, P('beer', t, { look: .6, arms: 'chest' })); tape01(654, 726, .9);
          const w = walk(lt, .4, 2.4, 2100, 1300); person(g, 'nid', w.x, 990, 560, P('nid', t, { walk: w.walk, look: .6, flip: true, arms: 'down' }));
        });
        black(1 - seg(lt, 0, .6)); black(seg(lt, 27.3, 28)); } },

    { d: 6, ev: [[.6, 'insert'], [3.2, 'vcr']], draw(lt, t) { vcr(g, t, ease(seg(lt, .6, 3.2)), '01  97'); black(1 - seg(lt, 0, .4)); black(seg(lt, 5.4, 6)); } },

    { d: 26, tape: true, osd: 'PM 11:40', date: 'NOV.13.1997', ev: [[0, 'tapein']],   // tape 01, part 1: the doctor's log
      lines: [['w1', 'wichai', 1.2, 'บันทึกโครงการสาม วันที่สิบสามพฤศจิกายน', 'Project Three log. November thirteenth.'],
              ['w2', 'wichai', 6.8, 'เทปเก็บทุกอย่างที่กล้องเห็น แต่บางครั้ง มันเก็บมากกว่านั้น', 'Tape keeps everything the camera sees. Sometimes, it keeps more than that.'],
              ['w3', 'wichai', 14.6, 'ผู้ทดลองคนที่หก นางแดง แม่บ้านประจำชั้นนี้', "Subject six. Mrs. Daeng, this floor's cleaner."],
              ['d2', 'daeng', 20.4, 'หมอคะ ถ่ายเสร็จแล้วป้าขอกลับบ้านนะคะ หลานรออยู่', "Doctor, when we're done I'd like to go home. My granddaughter is waiting."]],
      draw(lt, t) { pov(t, lt > 14 ? 1060 : 900, 560, lt > 14 ? 1.25 : 1.1, () => labScene(lt, t, { wichai: true, daeng: true, wx: lt > 14 ? 860 : 760 }), .15); } },

    { d: 26, tape: true, osd: 'PM 11:46', date: 'NOV.13.1997', ev: [[.4, 'door2'], [12, 'sting'], [16, 'flicker']],   // part 2: Fon at the door; a figure on the monitor
      lines: [['w4', 'wichai', 1.4, 'หนูเข้ามาได้ยังไง', 'How did you get in here?'],
              ['d3', 'daeng', 4.6, 'หลานป้าเองค่ะ ฝน มานั่งรอตรงนี้นะลูก', "That's my granddaughter, Fon. Sit here and wait, dear."],
              ['f2', 'fon', 11.0, 'ป้าคะ ในจอมีคนยืนอยู่', "Auntie, there's someone standing in the screen."],
              ['w5', 'wichai', 17.4, 'ปิดเครื่อง ปิดเดี๋ยวนี้', 'Shut it down. Now!']],
      draw(lt, t) {
        const ghost = seg(lt, 12, 13.5), zoom = lt > 12 && lt < 17 ? ease(seg(lt, 12, 13.2)) : 0;
        pov(t, lerp(900, 1110, zoom), lerp(560, 490, zoom), lerp(1.1, 3.2, zoom), () => labScene(lt, t, { wichai: true, daeng: true, fon: true, ghost, wx: 760, wexpr: lt > 16 ? 'scared' : 'neutral', fonExpr: lt > 10.6 ? 'scared' : 'worried', daengExpr: lt > 12 ? 'worried' : 'smile' }), .15);
        if (lt > 16 && lt < 26 && hash(Math.floor(t * 14)) < .4) { g.fillStyle = 'rgba(0,0,0,.8)'; g.fillRect(0, 0, W, H); } } },

    { d: 18, tape: true, osd: 'PM 11:47', date: 'NOV.13.1997', ev: [[0, 'blackout'], [1.6, 'buzz'], [14, 'tear']],   // part 3: the warning
      lines: [['w6', 'wichai', 3.6, 'ถ้าใครดูเทปนี้อยู่ อย่าให้ไฟชั้นสี่ดับ ตอนตีสองห้าสิบเก้า', "If anyone is watching this: don't let the fourth floor go dark at two fifty-nine."]],
      draw(lt, t) {
        if (lt < 1.6) { g.fillStyle = '#050506'; g.fillRect(0, 0, W, H); return; }
        pov(t, 760, 600, 2.4, () => { labScene(lt, t, { wichai: true, wexpr: 'scared' }); }, .4);   // Pa Daeng and Fon are gone
        darkTorch(960, 520, 700, .6);
        if (lt > 14) static_(t); } },

    { d: 22, ev: [[.2, 'tapeout']],   // Beer and Nid: who ordered the power cut?
      lines: [['b13', 'beer', 1.0, 'ไฟดับคือประตู ดร.วิชัยรู้ แล้วใครสั่งให้ช่างโอ๊ตตัดไฟ', 'The blackout is the door. Dr. Wichai knew. So who told Oat to cut the power?'],
              ['n5', 'nid', 9.8, 'ช่างโอ๊ตยังอยู่ เปิดร้านซ่อมไฟแถวตลาด', "Oat's still around. He runs a repair shop by the market."],
              ['b14', 'beer', 16.0, 'ไปกันเลย', "Let's go."]],
      draw(lt, t) {
        shop(g, t, false, { clock: 9.1, screen: '#101418' });
        person(g, 'beer', 620, 980, 560, P('beer', t, { look: .6, arms: lt > 1 && lt < 8 ? 'point' : 'down' }));
        person(g, 'nid', 1300, 990, 560, P('nid', t, { look: .6, flip: true, arms: 'down' }));
        black(1 - seg(lt, 0, .5)); black(seg(lt, 21.3, 22)); } },

    { d: 46, ev: [[0, 'market'], ...[0, .5, 1, 1.5, 2].map(a => [a + .2, 'step'])],   // Oat's repair shop
      lines: [['o1', 'oatOld', 3.0, 'มาหาใครครับ', 'Looking for someone?'],
              ['b15', 'beer', 5.8, 'ใบนี้ของพี่ใช่ไหมครับ ตัดไฟชั้นสี่ ตีสองห้าสิบแปด', 'Is this yours? Power cut, fourth floor, two fifty-eight.'],
              ['o2', 'oatOld', 12.8, 'ผมไม่ได้ตัด คืนนั้นมีผู้หญิงโทรมาสั่ง บอกว่าเป็นแม่บ้าน', "I didn't cut it. A woman called that night. Said she was the cleaner."],
              ['o3', 'oatOld', 21.6, 'พอผมไปถึงตู้ไฟ คัตเอาต์ถูกสับลงไปแล้ว บนตู้มีรอยมือเปียก', 'When I reached the breaker box, it was already off. There was a wet handprint on it.'],
              ['b16', 'beer', 31.4, 'แม่บ้านคนไหนครับ', 'Which cleaner?'],
              ['o4', 'oatOld', 35.2, 'ป้าแดง', 'Pa Daeng.']],
      draw(lt, t) {
        const insert = lt > 26 && lt < 30.6;   // the breaker box with the wet hand
        if (insert) { cam(1440, 340, 2.2, () => { oatShop(g, t); g.fillStyle = 'rgba(160,200,230,.5)'; g.beginPath(); g.ellipse(1738, 350, 30, 38, .2, 0, 7); g.fill(); for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(1712 + k * 16, 302 - Math.abs(k - 1.5) * 8, 7, 18, -.3 + k * .15, 0, 7); g.fill(); } }); return; }
        const close = lt > 12.4 && lt < 26;
        cam(close ? 1300 : 960, close ? 600 : 540, close ? 1.55 : 1, () => {
          oatShop(g, t);
          person(g, 'oatOld', 1300, 900, 520, P('oatOld', t, { look: .6, flip: true, arms: 'down', expr: lt > 12 ? 'worried' : 'neutral' }));
          const w = walk(lt, 0, 2.4, -200, 520); person(g, 'beer', w.x, 1010, 580, P('beer', t, { walk: w.walk, look: .6, arms: lt > 5.6 && lt < 12 ? 'torch' : 'down' }));
          const w2 = walk(lt, .3, 2.7, -380, 300); person(g, 'nid', w2.x, 1000, 560, P('nid', t, { walk: w2.walk, look: .6, arms: 'down' }));
          if (lt > 5.6 && lt < 12) { g.save(); g.translate(720, 700); g.rotate(-.1); g.fillStyle = '#f2e8c8'; g.fillRect(-40, -50, 80, 100); g.fillStyle = '#e8c43a'; g.fillRect(-40, -50, 80, 14); g.restore(); }
        });
        black(1 - seg(lt, 0, .5)); } },

    { d: 22, ev: [[13.6, 'sting']],   // Nid: she vanished on the 13th
      lines: [['n6', 'nid', 1.0, 'ป้าแดงกับหลาน หายไปตั้งแต่คืนวันที่สิบสาม', 'Pa Daeng and her granddaughter vanished on the night of the thirteenth.'],
              ['b17', 'beer', 7.6, 'แต่ในเทปม้วนที่สาม คืนวันที่ยี่สิบ ป้ายังถูพื้นอยู่', 'But on tape three, the night of the twentieth, she was still mopping.'],
              ['o5', 'oatOld', 14.2, 'คนที่โทรมาคืนนั้น ไม่ใช่คนเป็น', "Whoever called me that night wasn't alive."]],
      draw(lt, t) {
        const z = lt > 13.6 ? 1.6 : 1.1;
        cam(lt > 13.6 ? 1300 : 900, lt > 13.6 ? 600 : 560, z, () => {
          oatShop(g, t);
          person(g, 'oatOld', 1300, 900, 520, P('oatOld', t, { look: .6, flip: true, arms: 'down', expr: 'scared' }));
          person(g, 'beer', 520, 1010, 580, P('beer', t, { look: .6, arms: 'down', expr: lt > 7 ? 'worried' : 'neutral' }));
          person(g, 'nid', 300, 1000, 560, P('nid', t, { look: .6, arms: 'down', expr: 'worried' }));
        });
        black(seg(lt, 21.3, 22)); } },

    { d: 34, ev: [[9, 'tvon'], [9.2, 'sting2'], [21, 'zoom'], [29, 'sting']],   // night: the TV switches itself on, live
      lines: [['b18', 'beer', 3.0, 'ม้วนที่สองยังไม่มีใครเปิด', 'Nobody has opened tape two yet.'],
              ['b19', 'beer', 13.4, 'นั่นร้านผม… ตอนนี้', "That's my shop… right now."],
              ['b20', 'beer', 25.6, 'ใครถ่ายอยู่', "Who's recording?"]],
      draw(lt, t) {
        if (lt < 20.6) {
          const live = lt > 9;
          shop(g, t, true, { clock: 1.2, screen: live ? '#2a3430' : '#1a2a3a' });
          if (live) frozenTV(() => { shopHigh(g, t); g.save(); g.translate(W / 2, H / 2); g.rotate(-.06); g.scale(.78, .78); g.translate(-W / 2, -H / 2 + 40); person(g, 'beer', 760, 990, 580, { t, flip: true, look: .8 }); g.restore(); g.font = '700 70px monospace'; g.fillStyle = '#fff'; g.fillText('● REC', 80, 120); g.fillText('NOV.21.2026  AM 1:12', 980, 1000); }, t);
          person(g, 'beer', 760, 990, 580, P('beer', t, { look: lt > 18.4 ? 0 : .8, flip: true, arms: lt < 8 ? 'chest' : 'down', expr: live ? 'worried' : 'neutral' }));
          if (lt < 8) { g.fillStyle = '#1a1a1e'; g.fillRect(780, 740, 60, 36); }
          camcorder(860, 92, 1, false);
        } else {   // the camcorder on top of the shelf: REC is lit
          const z = ease(seg(lt, 21, 25));
          cam(lerp(960, 860, z), lerp(300, 110, z), lerp(1.2, 4, z), () => { shop(g, t, true, { clock: 1.2, screen: '#2a3430' }); camcorder(860, 92, 1, Math.floor(t * 2) % 2 === 0); });
        }
        black(1 - seg(lt, 0, .5)); black(seg(lt, 33.2, 34)); } },

    { d: 8, ev: [[0, 'end']], draw(lt) {
      g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); g.textAlign = 'center';
      g.font = '700 110px monospace'; g.fillStyle = '#f2f2ec'; g.fillText('FILE 03', W / 2, 470);
      g.font = `600 52px ${TH}`; g.fillStyle = '#e8463c'; g.fillText('ตอนที่ ๒ จบ', W / 2, 580);
      g.font = `400 40px ${TH}`; g.fillStyle = `rgba(220,220,220,${seg(lt, 2, 3)})`; g.fillText('ตอนหน้า · ม้วนที่ ๒  /  Next: Tape Two', W / 2, 680); g.textAlign = 'left';
      black(1 - seg(lt, 0, .8)); black(seg(lt, 7, 8)); } },
  ];
};
