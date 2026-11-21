// FILE 03 · ตอนที่ ๑ "ไฟล์ 03": the scene list. Receives the engine's helpers; see main.js for the scene format.
export default ({ g, W, H, TH, person, P, cam, pov, walk, black, vhs, darkTorch, frozenTV, seg, ease, lerp, hash, clamp,
  shop, exterior, lobby, corridor, lift, paper, vcr, gate, poster, stairs, lab, workOrder }) => {
return [
  { d: 6, ev: [[1.0, 'type']], draw(lt) {   // title
    g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); const n = Math.floor(seg(lt, .8, 2.4) * 7);
    g.font = '700 150px monospace'; g.fillStyle = '#f2f2ec'; g.textAlign = 'center'; g.fillText('FILE 03'.slice(0, n), W / 2, 520);
    g.font = `600 48px ${TH}`; g.fillStyle = `rgba(232,70,60,${seg(lt, 2.8, 3.6)})`; g.fillText('ตอนที่ ๑ · ไฟล์ 03', W / 2, 620); g.textAlign = 'left'; black(seg(lt, 5.2, 6)); } },

  { d: 30, ev: [[.4, 'door'], ...[0, .45, .9, 1.35, 1.8].map(a => [a + .5, 'step'])],   // the shop by day: Nid brings the box
    lines: [['n1', 'nid', 2.6, 'เทปห้าม้วนจากตึกวิชัยแล็บค่ะ ม้วนที่หนึ่งหายไปพร้อม ดร.วิชัย', 'Five tapes from the Wichai Lab building. Tape one vanished with Dr. Wichai.'],
            ['b1', 'beer', 9.6, 'กล่องเปียกน้ำ แต่ม้วนที่สามแห้งสนิท มีคนเพิ่งหยิบออกไปแล้วใส่คืน', 'The box is wet, but tape three is bone dry. Someone took it out and put it back.'],
            ['n2', 'nid', 17.2, 'ฉันตามข่าวตึกนี้มายี่สิบปี ไม่มีใครกล้าดูม้วนนี้จนจบ', "I've followed this building for twenty years. Nobody has watched this one to the end."],
            ['b2', 'beer', 23.4, 'งั้นผมจะดูคืนนี้ คนเดียว', "Then I'll watch it tonight. Alone."]],
    draw(lt, t) {
      const close = lt > 9.2 && lt < 16.8, z = close ? 1.5 : 1.02 + lt * .002;
      cam(close ? 700 : 960, close ? 600 : 540, z, () => {
        shop(g, t, false, { clock: 14.2 });
        g.save(); g.globalCompositeOperation = 'screen'; for (const [x0, w] of [[1300, 160], [1500, 110], [1640, 70]]) { const gr = g.createLinearGradient(x0, 120, x0 - 500, 1000); gr.addColorStop(0, 'rgba(255,245,215,.16)'); gr.addColorStop(1, 'rgba(255,245,215,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(x0, 120); g.lineTo(x0 + w, 120); g.lineTo(x0 + w - 560, 1080); g.lineTo(x0 - 560, 1080); g.closePath(); g.fill(); } g.restore();
        g.fillStyle = '#7a5a3a'; g.fillRect(860, 640, 180, 70); g.fillStyle = '#6a4a2e'; g.fillRect(860, 640, 180, 14);
        for (let k = 0; k < 5; k++) { g.fillStyle = k === 2 ? '#2a2a30' : '#1a1a1e'; g.fillRect(872 + k * 32, lt > 10 && lt < 15 && k === 2 ? 600 : 620, 26, 40); }
        person(g, 'beer', 620, 980, 560, P('beer', t, { look: .6, arms: lt > 10 && lt < 15 ? 'chest' : 'down' }));
        const w = walk(lt, .4, 2.4, 2100, 1300); person(g, 'nid', w.x, 990, 560, P('nid', t, { walk: w.walk, look: .6, flip: true, arms: 'down' }));
      });
      black(1 - seg(lt, 0, .6)); black(seg(lt, 29.2, 30)); } },

  { d: 8, ev: [[3.2, 'insert'], [5.6, 'vcr']],   // night: the tape goes in
    lines: [['b3', 'beer', .8, 'ไฟล์ศูนย์สาม พฤศจิกายน เก้าเจ็ด', 'File zero-three. November, ninety-seven.']],
    draw(lt, t) { if (lt < 3) { shop(g, t, true, { clock: 23.97 }); person(g, 'beer', 620, 980, 560, P('beer', t, { look: .5, flip: true, arms: 'chest' })); } else vcr(g, t, ease(seg(lt, 3.2, 5.6))); black(1 - seg(lt, 0, .6)); black(seg(lt, 7.3, 8)); } },

  { d: 24, tape: true, osd: 'AM 2:04', ev: [[0, 'tapein'], [0, 'crickets']],   // the gate: why they are here
    lines: [['t1', 'ton', 1.0, 'ม้วนที่สาม ตึกวิชัยแล็บ ตีสองสี่นาที', 'Tape three. Wichai Lab. Two-oh-four a.m.'],
            ['m6', 'mind', 5.4, 'ฝนหายตัวไปหน้าลิฟต์ตึกนี้ เมื่อสัปดาห์ก่อน', 'Fon disappeared in front of the lift in this building, last week.'],
            ['m7', 'mind', 11.4, 'ตำรวจปิดคดีในสามวัน มันแปลก', 'The police closed the case in three days. That is strange.'],
            ['m1', 'mind', 17.0, 'ต้น อย่าปิดกล้องนะ ไม่ว่าจะเกิดอะไรขึ้น', "Ton, don't turn the camera off. Whatever happens."]],
    draw(lt, t) {
      if (lt < 9) pov(t, lerp(1120, 1120, 0), lerp(830, 830, 0), lerp(3.6, 3.2, seg(lt, 0, 9)), () => gate(g, t));   // close on the poster
      else pov(t, 960, 640, 1.25, () => { gate(g, t); person(g, 'mind', 780, 1000, 420, P('mind', t, { view: 'front', arms: lt > 16 ? 'torch' : 'down', beam: false })); });
    } },

  { d: 24, tape: true, osd: 'AM 2:06', ev: [[19.8, 'stepsAway']],   // the lobby: the guard, then he leaves on his round
    lines: [['c1', 'chai', .8, 'ชั้นสี่ปิดไว้ ห้ามขึ้นไป', 'The fourth floor is closed. Nobody goes up.'],
            ['m2', 'mind', 4.4, 'ทำไมคะลุง', 'Why, sir?'],
            ['c2', 'chai', 6.8, 'เพราะลุงรู้ ว่ามันปิดไว้ทำไม', 'Because I know why it was closed.'],
            ['c3', 'chai', 11.6, 'ลุงไปเดินตรวจฝั่งโน้นก่อน รออยู่ตรงนี้นะ', "I'm doing my round on the other side. Wait here."],
            ['m8', 'mind', 18.8, 'บันไดหนีไฟ ไปเร็ว', 'The fire stairs. Come on.']],
    draw(lt, t) {
      pov(t, lt > 6.4 && lt < 11 ? 520 : 960, 560, lt > 6.4 && lt < 11 ? 1.4 : 1.05, () => {
        lobby(g, t, { floor: '1' });
        const leaving = lt > 14.6, w = walk(lt, 14.6, 18.6, 380, -300);
        person(g, 'chai', leaving ? w.x : 380, 900, 520, P('chai', t, leaving ? { walk: w.walk, flip: true } : { look: .7 }));
        if (lt < 17.6) person(g, 'mind', 1250, 1000, 520, P('mind', t, { look: .7, flip: true, beam: false, arms: 'down' }));
        else person(g, 'mind', 1250, 1000, 520, P('mind', t, { view: 'front', arms: 'point' }));
      });
    } },

  { d: 18, tape: true, osd: 'AM 2:08', ev: [[0, 'stairs'], [13.4, 'chain']],   // the fire stairs: 2, 3, 4, the chain and tape
    lines: [['t3', 'ton', 7.4, 'มายด์ รอด้วย', 'Mind, wait for me.'], ['m9', 'mind', 14.0, 'ก้มลอดไป', 'Duck under.']],
    draw(lt, t) {
      const fl = lt < 4.6 ? 2 : lt < 9.2 ? 3 : 4, ll = lt - [0, 0, 0, 4.6, 9.2][fl];
      pov(t, 960, 560, 1.05 + ll * .02, () => {
        stairs(g, t, fl, .8);
        const up = fl < 4 ? lerp(1000, 640, seg(ll, 0, 4.6)) : 980, x = fl < 4 ? lerp(700, 1050, seg(ll, 0, 4.6)) : 1300;
        if (fl < 4 || ll < 6) person(g, 'mind', x, up - (fl === 4 && ll > 4.4 ? 0 : 0), fl === 4 ? 460 * (ll > 4.6 ? .82 : 1) : 380, P('mind', t, fl < 4 ? { walk: lt * 7, beam: false } : { view: 'back', arms: 'down' }));
      }, 1.2, 1);
    } },

  { d: 10.6, ev: [[.2, 'pause'], [10.0, 'play']],   // Beer pauses: 27 minutes are missing
    lines: [['p1', 'beer', .8, 'ตีสองสี่นาที ขึ้นบันไดแค่สามชั้น แต่ตอนนี้ตีสองสามสิบเอ็ด เวลาหายไปยี่สิบเจ็ดนาที', 'Two-oh-four. Three flights of stairs. Now it says two thirty-one. Twenty-seven minutes are gone.']],
    draw(lt, t) {
      shop(g, t, true, { screen: '#2a3430', vcrOn: true });
      frozenTV(() => { stairs(g, 0, 4, .8); g.font = '700 70px monospace'; g.fillStyle = '#fff'; g.fillText('❚❚  AM 2:31', 80, 1000); }, t);
      person(g, 'beer', 760, 990, 580, P('beer', t, { look: .8, flip: true, arms: lt < 1 || lt > 9.6 ? 'torch' : 'down' }));
      black(1 - seg(lt, 0, .4)); black(seg(lt, 10.2, 10.6)); } },

  { d: 30, tape: true, osd: 'AM 2:31', ev: [[1, 'door2'], [22, 'mop']],   // Dr. Wichai's lab
    lines: [['m10', 'mind', 2.4, 'ห้องทดลองของ ดร.วิชัย', "Dr. Wichai's lab."],
            ['m11', 'mind', 8.4, 'โครงการสาม เจ็ดคน', 'Project three. Seven people.'],
            ['m12', 'mind', 15.2, 'ช่องม้วนที่หนึ่ง ว่างอยู่', 'The slot for tape one is empty.'],
            ['m13', 'mind', 23.6, 'ได้ยินไหม เสียงถูพื้น', 'Do you hear that? Someone is mopping.']],
    draw(lt, t) {
      const x = lt < 6 ? lerp(960, 900, seg(lt, 0, 6)) : lt < 12 ? 500 : lt < 21 ? 1650 : 960, y = lt < 6 ? 540 : lt < 12 ? 380 : lt < 21 ? 560 : 540, z = lt < 6 ? 1 : lt < 21 ? 1.9 : 1;
      pov(t, x, y, z, () => { lab(g, t, .75); if (lt > 21) person(g, 'mind', 1250, 1010, 520, P('mind', t, { view: 'side', flip: true, beam: false })); }, 1, lt < 6 ? .6 : 0);
      darkTorch(960, 520, 900, .55); } },

  { d: 20, tape: true, osd: 'AM 2:34', ev: [[0, 'mop']],   // the corridor: Pa Daeng
    lines: [['m3', 'mind', 2.4, 'ป้าคะ ตึกนี้ปิดไปแล้วไม่ใช่เหรอ', "Ma'am, isn't this building closed?"],
            ['d1', 'daeng', 7.0, 'ป้าถูทุกคืนจ้ะ อย่าเหยียบตรงที่เปียกนะลูก', "I mop every night, dear. Don't step on the wet part."],
            ['m14', 'mind', 14.0, 'ทุกคืน… ทั้งที่ตึกร้างแล้ว', 'Every night… in an empty building.']],
    draw(lt, t) {
      pov(t, 960, 560, 1.02 + lt * .006, () => {
        corridor(g, t, .8, { wet: true });
        const mop = Math.sin(t * 4) * 18;
        person(g, 'daeng', 1080 + mop * .3, 860, 360, P('daeng', t, { expr: 'smile', look: .6, flip: true, hands: { L: [-4 + mop * .5, -250], R: [26, -214] } }));
        person(g, 'mind', 560, 1040, 600, P('mind', t, { look: .6, beam: false, arms: 'down', expr: lt > 13 ? 'worried' : 'neutral' }));
      });
    } },

  { d: 16, tape: true, osd: 'AM 2:36', ev: [[1, 'paper']],   // the paper on the wet floor
    lines: [['m4', 'mind', 3.0, 'รายชื่อผู้ทดลอง มีชื่อเด็กด้วย', 'A list of test subjects. There is a child on it.'],
            ['m15', 'mind', 9.4, 'ชื่อป้าแดงก็อยู่ในนี้', "Pa Daeng's name is on it too."]],
    draw(lt, t) {
      if (lt < 2.4) pov(t, 960, 860, 1.6, () => { corridor(g, t, .8, { wet: true }); g.save(); g.translate(900, 1000); g.rotate(-.2); g.fillStyle = '#efe8d4'; g.fillRect(-80, -50, 160, 100); g.restore(); }, 1);
      else pov(t, 960, 540, 1 + (lt - 2.4) * .01, () => paper(g, t), .5);
    } },

  { d: 11, ev: [[.2, 'pause'], [10.4, 'play']],   // Beer pauses: the wet paper
    lines: [['p2', 'beer', .8, 'กระดาษเปียก ทั้งที่ป้าเพิ่งถูตรงนั้น ตรงที่ป้าบอกว่าอย่าเหยียบ', "The paper is wet. Right where she'd just mopped. Right where she said not to step."]],
    draw(lt, t) {
      shop(g, t, true, { screen: '#2a3430', vcrOn: true });
      frozenTV(() => { paper(g, 0); g.font = '700 70px monospace'; g.fillStyle = '#fff'; g.fillText('❚❚  AM 2:36', 80, 1000); }, t);
      person(g, 'beer', 760, 990, 580, P('beer', t, { look: .8, flip: true, expr: 'worried', arms: lt < 1 || lt > 9.8 ? 'torch' : 'down' }));
      black(1 - seg(lt, 0, .4)); black(seg(lt, 10.6, 11)); } },

  { d: 14, tape: true, osd: 'AM 2:38', ev: [[1.2, 'ding'], [3.0, 'whoosh']],   // the ding; they turn; Pa Daeng is gone
    lines: [['m16', 'mind', 6.6, 'ป้า… ป้าหายไปไหน', "Ma'am… where did she go?"]],
    draw(lt, t) {
      const pan = ease(seg(lt, 3, 4.4));
      pov(t, lerp(960, 960, pan), 560, 1.02, () => {
        corridor(g, t, .8, { wet: true });
        if (lt < 3.6) person(g, 'daeng', 1080, 860, 360, P('daeng', t, { expr: 'smile', look: .6, flip: true, hands: { L: [-4, -250], R: [26, -214] } }));
        else { g.save(); g.translate(1080, 860); g.scale(.88, .88); g.fillStyle = '#3a6aa8'; g.beginPath(); g.moveTo(46, -54); g.lineTo(86, -54); g.lineTo(80, 0); g.lineTo(52, 0); g.closePath(); g.fill(); g.strokeStyle = '#b8925a'; g.lineWidth = 4; g.beginPath(); g.moveTo(-60, -4); g.lineTo(40, -14); g.stroke(); g.restore(); }   // only the bucket and the mop
        person(g, 'mind', 560, 1040, 600, P('mind', t, lt < 3.6 ? { view: 'back', arms: 'down' } : { look: .6, beam: false, arms: 'down', expr: 'scared' }));
      });
      if (lt > 3 && lt < 3.5) { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(0, 0, W, H); } } },

  { d: 10, tape: true, osd: 'AM 2:39', ev: [[0, 'stepsWalk']],   // walking toward the lift
    draw(lt, t) {
      pov(t, 960, 540, lerp(1, 2.2, ease(seg(lt, 0, 9))), () => { corridor(g, t, .75, { farLit: true }); g.fillStyle = '#9ca0a2'; g.fillRect(890, 400, 140, 160); g.fillStyle = '#e8463c'; g.font = '700 22px monospace'; g.fillText('4', 952, 392); person(g, 'mind', lerp(860, 900, seg(lt, 0, 9)), lerp(1000, 760, seg(lt, 0, 9)), lerp(520, 280, seg(lt, 0, 9)), P('mind', t, { view: 'back', arms: 'torch', hold: true })); }, 1, 1);
    } },

  { d: 20, tape: true, osd: 'AM 2:41', ev: [[.6, 'liftdoor'], [7.6, 'flicker'], [9.4, 'blackout'], [11.6, 'buzz'], [12.8, 'blackout']],   // the lift: Fon, darkness, only the teddy bear
    lines: [['f1', 'fon', 3.4, 'พี่คะ ลิฟต์ไม่ยอมลง', "Miss… the lift won't go down."], ['m17', 'mind', 15.4, 'ฝน?', 'Fon?']],
    draw(lt, t) {
      const open = ease(seg(lt, .6, 2.2)), Lv = lt > 12.8 ? .04 : lt > 11.6 ? 1 : lt > 9.4 ? .04 : lt > 7.6 ? (hash(Math.floor(t * 16)) > .45 ? 1 : .15) : 1;
      pov(t, 960, 540, 1.02, () => {
        lift(g, t, open, Lv);
        g.save(); g.beginPath(); g.rect(560, 160, 800, 760); g.clip();
        if (lt < 9.4 && open > .2) person(g, 'fon', 960, 900, 420, P('fon', t, { view: 'front', expr: 'worried' }));
        if (lt > 11.6) { g.fillStyle = '#7a5236'; g.beginPath(); g.ellipse(960, 880, 34, 38, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(960, 830, 26, 24, 0, 0, 7); g.fill(); }   // the teddy bear
        g.restore();
      });
      if (Lv < .5) { g.fillStyle = `rgba(0,0,0,${1 - Lv})`; g.fillRect(0, 0, W, H); } } },

  { d: 24, tape: true, osd: 'AM 2:59', ev: [[0, 'torch'], [0, 'drone'], [9.6, 'sting'], [18.6, 'rush'], [19.6, 'tear']],   // over Mind's shoulder: the thing
    lines: [['m5', 'mind', 13.2, 'ต้น… ถอยหลังช้า ๆ', 'Ton… back away, slowly.'], ['t2', 'ton', 16.4, 'ไม่ปิด กล้องยังถ่ายอยู่', "I'm not stopping. It's still recording."]],
    draw(lt, t) {
      const rushK = ease(seg(lt, 18.6, 19.6));
      if (lt < 12.6 || lt > 18.4) {   // behind Mind: the torch beam searches, finds legs, rises to the face
        const sweep = lt < 6 ? Math.sin(lt * 1.2) * 380 : 0, tilt = ease(seg(lt, 8.6, 11.4));
        const bx = 960 + sweep, by = lt < 6 ? 640 : lerp(820, 300, tilt);
        const nearK = lt > 18.4 ? rushK : 0;
        pov(t, 960, lerp(560, 460, tilt) , 1.05 + nearK * .3, () => {
          corridor(g, t, .3);
          if (lt > 6) person(g, 'thing', 960, lerp(700, 1060, nearK), lerp(430, 1500, nearK), { t });
          darkTorch(bx, by, 300 + nearK * 400, .97);
          g.save(); g.globalCompositeOperation = 'screen'; const gr = g.createLinearGradient(1180, 1080, bx, by); gr.addColorStop(0, 'rgba(255,248,220,.35)'); gr.addColorStop(1, 'rgba(255,248,220,.04)'); g.fillStyle = gr; g.beginPath(); g.moveTo(1150, 1000); g.lineTo(bx - 170, by); g.lineTo(bx + 170, by); g.lineTo(1230, 1000); g.closePath(); g.fill(); g.restore();
          person(g, 'mind', 1080, 1260, 820, { t, view: 'back', arms: 'torch', hold: true });
        }, lt > 9.4 && lt < 12 ? .4 : 1.6);
      } else {   // her face, lit from below by the torch
        pov(t, 960, 470, 2.2, () => { corridor(g, t, .15); person(g, 'mind', 960, 1000, 620, P('mind', t, { view: 'front', expr: 'scared', arms: 'torch', hold: true })); darkTorch(960, 560, 520, .9); }, 2);
      }
      if (lt > 19.8) { g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(255,255,255,${hash(Math.floor(t * 30) * 11 + i) * .6})`; g.fillRect(hash(i + Math.floor(t * 30)) * W, hash(i * 3 + Math.floor(t * 30)) * H, 3, 2); } }
    } },

  { d: 32, ev: [[0, 'tapeout'], [6.4, 'zoom'], [10.4, 'sting'], [13.6, 'flicker2'], [14, 'mop'], [18.6, 'sting2'], [22.8, 'stop'], [25.6, 'thud']],   // Beer: the reflection, the wet footprints, the dark TV
    lines: [['b4', 'beer', 1.6, 'ย้อนกลับไปที่ลิฟต์ ในประตูลิฟต์ มีเงาสะท้อน', 'Back to the lift. There is a reflection in its door.'],
            ['b5', 'beer', 10.6, 'เสื้อสีเขียว… นั่นผม', 'A green hoodie… that is me.'],
            ['b6', 'beer', 17.4, 'อย่าหัน ดูจากจอ', "Don't turn around. Watch the screen."],
            ['b7', 'beer', 27.6, 'ม้วนที่หนึ่ง…', 'Tape one…']],
    draw(lt, t) {
      const flick = lt > 13.6 && lt < 23 ? (hash(Math.floor(t * 14)) > .55 ? 1 : .25) : 1;
      if (lt < 6.4) { shop(g, t, true, { screen: '#3a4440', vcrOn: true }); frozenTV(() => { lift(g, 0, 1, 1); person(g, 'fon', 960, 900, 430, { t: 0, view: 'front', expr: 'worried' }); }, t); person(g, 'beer', 760, 990, 580, P('beer', t, { look: .8, flip: true })); }
      else if (lt < 13) {
        const z = ease(seg(lt, 6.4, 9.4));
        cam(lerp(960, 1270, z), lerp(540, 540, z), lerp(1, 2.6, z), () => { lift(g, 0, 1, 1); person(g, 'fon', 960, 900, 430, { t: 0, view: 'front', expr: 'worried' }); g.save(); g.beginPath(); g.rect(1180, 300, 180, 500); g.clip(); g.globalAlpha = .4 * seg(lt, 8.4, 10.4); person(g, 'beer', 1270, 760, 380, { t, view: 'front' }); g.restore(); });
        if (lt > 10) { g.strokeStyle = '#e8463c'; g.lineWidth = 6; g.strokeRect(640, 160, 640, 720); }
        vhs(t, { time: 'AM 2:41', paused: true });
      } else {
        shop(g, t, true, { screen: lt > 18.4 && lt < 23.2 ? '#101418' : '#1a2a3a', footprints: Math.floor(seg(lt, 14, 20) * 7), lamp: flick });
        if (lt > 18.4 && lt < 23.2) { g.save(); g.beginPath(); g.roundRect(190, 455, 330, 230, 26); g.clip(); g.globalAlpha = .7; person(g, 'beer', 330, 760, 260, { t, view: 'back' }); person(g, 'thing', 430, 760, 330, { t }); g.restore(); }
        person(g, 'beer', 760, 990, 580, P('beer', t, { look: .8, flip: true, expr: lt > 14 && lt < 24 ? 'worried' : 'neutral', arms: lt > 22.6 && lt < 23.6 ? 'torch' : 'down' }));
        if (lt > 25.6) { g.fillStyle = '#1a1a1e'; g.fillRect(980, 650, 90, 52); g.fillStyle = '#f2ecd8'; g.fillRect(990, 660, 70, 18); g.fillStyle = '#c8322c'; g.font = '700 16px monospace'; g.fillText('01', 1012, 675); }
        if (flick < .5) { g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, 0, W, H); }
      }
      black(1 - seg(lt, 0, .5)); } },

  { d: 24, ev: [[1, 'paper'], [14.4, 'dial']],   // the work order, then the call to Nid
    lines: [['b8', 'beer', 2.8, 'ใบสั่งงานซ่อมไฟ ช่างโอ๊ต ตัดไฟชั้นสี่ ตีสองห้าสิบแปด', 'A work order. Electrician Oat cut the power to floor four. Two fifty-eight.'],
            ['b10', 'beer', 9.2, 'หนึ่งนาที ก่อนมันจะมา', 'One minute before it came.'],
            ['b9', 'beer', 16.6, 'คุณนิดครับ ม้วนที่หนึ่งอยู่กับผมแล้ว พรุ่งนี้เราต้องไปหาช่างโอ๊ต', 'Ms. Nid. Tape one is here with me. Tomorrow, we find the electrician, Oat.']],
    draw(lt, t) {
      if (lt < 13.6) cam(960, 540, 1 + lt * .01, () => workOrder(g, t));
      else { shop(g, t, true, { clock: 0.2 }); person(g, 'beer', 900, 990, 600, P('beer', t, { view: 'front', arms: 'phone', expr: 'neutral' })); }
      black(seg(lt, 23.2, 24)); } },

  { d: 8, ev: [[0, 'end']], draw(lt) {   // end card
    g.fillStyle = '#0a0a0c'; g.fillRect(0, 0, W, H); g.textAlign = 'center';
    g.font = '700 110px monospace'; g.fillStyle = '#f2f2ec'; g.fillText('FILE 03', W / 2, 470);
    g.font = `600 52px ${TH}`; g.fillStyle = '#e8463c'; g.fillText('ตอนที่ ๑ จบ', W / 2, 580);
    g.font = `400 40px ${TH}`; g.fillStyle = `rgba(220,220,220,${seg(lt, 2, 3)})`; g.fillText('ตอนหน้า · ม้วนที่ ๑  /  Next: Tape One', W / 2, 680); g.textAlign = 'left';
    black(1 - seg(lt, 0, .8)); black(seg(lt, 7, 8)); } },
];
};
