// krathong.js: "ลอยกระทง" (Loy Krathong), 24 s. See STORYBOARD.md.
//   Shot A (0–8.2 s): the moon, then Clawd on the bank with a lit krathong. Clawd sets it on the river; a gust blows the
//                     candle out. Clawd is sad. Brush wipe.
//   Shot B (8.2–24 s): a firefly rises from the reeds, flies to the krathong and lights it again. Clawd is overjoyed.
//                     The river fills with krathongs, Clawd waves goodbye, and the camera tilts up to the moon. Iris out.
(() => {
  const SKY = '#1B2147', SKY2 = '#2A2D5E', WATER = '#1C3350', WATER2 = '#27476A', BANK = '#2F3E2C', BANKDK = '#1F2A1F';
  const LEAF = '#5E8A45', LEAFDK = '#3E6634', LEAFLT = '#86AE5A', FLAME = '#FFD25E', FLAMEIN = '#FFF1BE';
  const NIGHT = ['#2A2D5E', '#3B3576'];
  const MOON = [1450, 190], HORIZON = 520, G = 870, CX = 700, U = 24;

  // ---------- story clock ----------
  const tPlace = 3.1, tSplash = 3.6, tOut = 5.55, tLand = 11.6, tRelit = 11.75;
  const wind = t => Math.pow(Math.sin(Math.PI * seg(t, 4.6, 5.9)), 2);           // the gust: 0 → 1 → 0
  const flame = t => t < tOut ? 1 - .5 * seg(t, tOut - .25, tOut) : t < tRelit ? 0 : backOut(seg(t, tRelit, tRelit + .45));

  // where the krathong is: [x, y, scale]
  function kPos(t) {
    const p = kf(t, [[tSplash, [975, 970, 1.25]], [8.2, [1215, 866, 1.1]], [12, [1265, 842, 1.05]], [22, [1500, 646, .45]]]);
    return [p[0], p[1] + 4 * p[2] * Math.sin(t * 2.3), p[2]];
  }
  const wickOf = (x, y, s) => [x, y - 84 * s];

  // ---------- set pieces ----------
  function sky(t) {
    boilSeed('sky');
    paint(rectPts(-700, -900, W + 1400, HORIZON + 960), { wash: SKY, ink: null });
    paint(ellPts(MOON[0], MOON[1] + 120, 900, 420, 26, 8), { wash: SKY2, washOp: 200, ink: null });
    for (let i = 0; i < 46; i++) {
      boilSeed('st' + i);
      const x = hash(i) * (W + 1000) - 500, y = hash(i + 50) * (HORIZON + 700) - 760, tw = .55 + .45 * Math.sin(t * (1.5 + 2 * hash(i + 9)) + i);
      paint(starPts(x, y, (3 + 4 * hash(i + 3)) * tw, .35, 4), { wash: PAL.cream, washOp: 120 + 120 * tw, ink: null });
    }
    boilSeed('moon');
    glow(...MOON, 330, '#FFF0C8', .55);
    paint(ellPts(...MOON, 92, 92, 30, 1.2), { wash: '#F6EBCB', ink: PAL.ink, sw: .9 });
    paint(ellPts(MOON[0] - 26, MOON[1] - 18, 22, 16, 12, 1), { wash: '#E6D7AE', ink: null });
    paint(ellPts(MOON[0] + 30, MOON[1] + 24, 15, 12, 12, 1), { wash: '#E6D7AE', ink: null });
    paint(ellPts(MOON[0] + 18, MOON[1] - 34, 9, 7, 10, 1), { wash: '#E6D7AE', ink: null });
  }

  function river(t, lights) {
    boilSeed('farbank');
    const fb = []; for (let k = 0; k <= 24; k++) { const x = -700 + k * (W + 1400) / 24; fb.push([x, HORIZON - 26 - 40 * hash(k + 7) - 26 * Math.sin(k * .7)]); }
    fb.push([W + 700, HORIZON + 12], [-700, HORIZON + 12]);
    paint(fb, { wash: '#141936', ink: PAL.ink, sw: .7 });
    boilSeed('water');
    paint(rectPts(-700, HORIZON, W + 1400, 900), { wash: WATER, ink: null });
    inkLine([[-700, HORIZON + 2], [W / 2, HORIZON], [W + 700, HORIZON + 3]], .8, PAL.ink, 'ink', .4);
    // the moon's reflection: broken cream strokes that sway
    for (let i = 0; i < 16; i++) {
      boilSeed('refl' + i);
      const y = HORIZON + 16 + i * 26 + i * i * .9, w = (75 - i * 2.4) * (.45 + .8 * hash(i + 4)), x = MOON[0] + 40 * (hash(i + 17) - .5) + 16 * Math.sin(t * 1.4 + i * .8);
      paint(ellPts(x, y, w, 4 + i * .25, 12, 1), { wash: '#EFE2BC', washOp: 200 - i * 8, ink: null });
    }
    // ripples
    for (let i = 0; i < 26; i++) {
      boilSeed('rip' + i);
      const y = HORIZON + 30 + hash(i + 70) * 520, x = hash(i + 90) * (W + 600) - 300 + 30 * Math.sin(t * .6 + i), w = 30 + 60 * hash(i + 11);
      inkLine([[x - w, y], [x, y - 3], [x + w, y]], .5, WATER2, 'inkfine', .6);
    }
    for (const L of lights) L();
  }

  function reeds(t, front) {
    const wd = wind(t);
    const list = front ? [[455, 1.1], [505, .9]] : [[120, 1], [175, 1.25], [235, .95], [300, 1.15], [360, .9]];
    list.forEach(([x, h], i) => {
      boilSeed('reed' + x);
      const sway = 18 * Math.sin(t * 1.3 + i * 1.7) + 140 * wd * (1 + .3 * hash(i)), top = [x + sway * h, G - 230 * h];
      const mid = [x + sway * .35 * h, G - 120 * h];
      inkLine([[x, G + 6], mid, top], 2.2, '#4E6A3C', 'dry', .6);
      inkLine([[x + 6, G + 6], [x + 30 + sway * .5, G - 90 * h]], 1.6, '#5E7B45', 'dry', .6);
      const a = Math.atan2(top[0] - mid[0], mid[1] - top[1]);
      push(); translate(top[0], top[1] + 26); rotate(a);
      paint(rrPts(-8, -30, 16, 52, 8, 1), { wash: '#6B4A2E', ink: PAL.ink, sw: .6 });
      pop();
    });
  }

  function bank() {
    boilSeed('bank');
    const P = [[-700, G - 6], [200, G - 12], [600, G - 4], [860, G], [920, G + 40], [960, H + 300], [-700, H + 300]];
    paint(P, { wash: BANK, ink: null });
    inkLine([[-700, G - 6], [200, G - 12], [600, G - 4], [860, G], [920, G + 40], [950, H + 200]], 1.1, PAL.ink, 'ink', .5);
    paint([[860, G + 2], [920, G + 40], [950, H + 300], [800, H + 300]], { wash: BANKDK, ink: null });
    for (let i = 0; i < 14; i++) {
      boilSeed('tuft' + i);
      const x = -200 + i * 75 + 30 * hash(i), y = G + 6 + 60 * hash(i + 3);
      inkLine([[x, y], [x - 6, y - 16]], .7, '#4F6B3E', 'inkfine', 0);
      inkLine([[x + 6, y], [x + 10, y - 18]], .7, '#4F6B3E', 'inkfine', 0);
    }
  }

  // the krathong: a banana-trunk float, a crown of folded leaves, flowers, a candle and incense. s = 1 is ~150 px wide.
  function krathong(x, y, s, o = {}) {
    const f = o.flame ?? 1, lean = o.lean || 0, sw = clamp(s, .35, 1);
    const [wx, wy] = wickOf(x, y, s);
    if (f > 0 && o.light !== false) {
      glow(wx + lean * 20 * s, wy - 14 * s, 190 * s * (.6 + .4 * f), '#FFC766', .9 * f);
      if (o.water !== false) glow(x, y + 30 * s, 150 * s * f, '#FFB84D', .45 * f);
    }
    push(); translate(x, y); rotate(o.rot || 0); scale(s);
    if (o.water !== false) paint(ellPts(0, 10, 92, 14, 16, 1), { wash: '#142640', washOp: 220, ink: null });   // shadow on the water
    paint(ellPts(0, 0, 76, 20, 22, 1.2), { wash: '#B9A36A', ink: PAL.ink, sw });                               // the banana-trunk base
    const crown = (r, h, n, col, y0) => {
      const P = [[-r, y0]];
      for (let i = 0; i <= n; i++) { const xx = lerp(-r, r, i / n); P.push([xx, y0 - h * (i % 2 ? .25 : 1) * (1 - .25 * Math.abs(xx / r))]); }
      P.push([r, y0], [r * .9, y0 + 10], [-r * .9, y0 + 10]);
      paint(P, { wash: col, ink: PAL.ink, sw: sw * .8 });
    };
    crown(64, 40, 8, LEAFDK, -8);
    crown(70, 30, 10, LEAF, 2);
    for (let i = -2; i <= 2; i++) inkLine([[i * 26, 6], [i * 26 + 3, -14]], .5 * sw, LEAFLT, 'inkfine', 0);
    // flowers
    [[-38, -18, PAL.rose], [36, -16, '#F2B33D'], [-12, -26, '#F2B33D'], [16, -28, PAL.rose]].forEach(([fx, fy, c], i) => {
      paint(ellPts(fx, fy, 12, 10, 12, 1, i), { wash: c, ink: PAL.ink, sw: sw * .6 });
      paint(ellPts(fx, fy - 1, 4, 4, 8), { wash: PAL.cream, ink: null });
    });
    // incense and candle
    inkLine([[-14, -24], [-22, -66]], 1.4 * sw, '#8C4B32', 'ink', 0);
    inkLine([[-8, -24], [-12, -62]], 1.4 * sw, '#8C4B32', 'ink', 0);
    paint(rrPts(-6, -78, 12, 54, 4), { wash: '#F3E6C4', ink: PAL.ink, sw: sw * .7 });
    inkLine([[0, -78], [0, -86]], .9 * sw, PAL.ink, 'ink', 0);
    if (f > .02) {   // the flame: a teardrop that leans in the wind
      const h = 30 * f * (1 + .08 * Math.sin(T * 17)), l = lean * 18, P = [];
      for (let i = 0; i <= 14; i++) {
        const a = i / 14 * TAU, r = Math.sin(a / 2);
        P.push([Math.sin(a) * 9 * f * r + l * (1 - Math.cos(a)) / 2 * r, -86 - (1 - Math.cos(a)) / 2 * h]);
      }
      paint(P, { wash: FLAME, ink: '#C9772E', sw: sw * .6, curv: .5 });
      paint(ellPts(l * .3, -92 - h * .1, 3.5 * f, 7 * f, 10), { wash: FLAMEIN, ink: null });
    }
    if (o.smoke > 0 && o.smoke < 1) {   // a wisp of smoke after the flame goes out
      const k = o.smoke, P = [];
      for (let i = 0; i <= 8; i++) { const q = i / 8 * k; P.push([28 * Math.sin(q * 9 + 1) * q + 30 * q, -88 - 170 * q]); }
      paint(ribbon(P, 5, 1.5), { wash: '#8F93AE', washOp: 200 * (1 - k), ink: null });
    }
    pop();
  }

  function firefly(x, y, a = 1, key = '') {
    if (a <= 0) return;
    boilSeed('ff' + key);
    const blink = .75 + .25 * Math.sin(T * 11 + x * .01);
    glow(x, y, 95 * blink, '#E9FF8A', a * .85);
    glow(x, y, 24, '#FFFBD0', a);
    paint(ellPts(x - 3, y - 2, 6, 4, 8), { wash: '#3B3324', ink: null });
    paint(ellPts(x + 3, y + 1, 4, 4, 8), { wash: '#F7FFB8', washOp: 255 * a, ink: null });
    const fl = Math.sin(T * 60) * 3;
    inkLine([[x - 3, y - 4], [x - 10, y - 12 - fl]], .5, '#C8D0E8', 'inkfine', 0);
    inkLine([[x - 1, y - 4], [x + 4, y - 13 + fl]], .5, '#C8D0E8', 'inkfine', 0);
  }

  // the hero firefly's flight, B only
  function ffPos(t) {
    const [wx, wy] = wickOf(...kPos(tLand));
    let p;
    if (t < tLand) p = kf(t, [[9.0, [320, 800]], [9.8, [470, 620]], [10.5, [760, 590]], [11.1, [1050, 690]], [tLand, [wx, wy - 6]]]);
    else if (t < tRelit + .15) p = [wx, wy - 6];
    else p = kf(t, [[tRelit + .15, [wx, wy - 6]], [12.9, [1390, 610]], [14.5, [1560, 430]]]);
    const wob = 22 * (1 - seg(t, 10.9, tLand)) * (t < tLand ? 1 : seg(t, tRelit + .15, 12.4));
    return [p[0] + wob * Math.sin(t * 7), p[1] + wob * .7 * Math.cos(t * 9.3)];
  }

  // the other krathongs that join later
  const OTHERS = [0, 1, 2, 3, 4, 5].map(i => ({ t0: 13.4 + i * .55, x: 1120 + 120 * i + 60 * hash(i + 40), y: 600 + 95 * hash(i + 20), s: .26 + .14 * hash(i + 30) }));
  const otherLights = t => OTHERS.map((o, i) => () => {
    if (t < o.t0) return;
    boilSeed('other' + i);
    const k = easeOut(seg(t, o.t0, o.t0 + 6)), x = lerp(W + 260, o.x, k) + 10 * Math.sin(t * .7 + i), y = o.y + 3 * Math.sin(t * 2 + i);
    krathong(x, y, o.s, { rot: .05 * Math.sin(t * 1.6 + i) });
  });

  // ---------- shot A: the gust ----------
  function shotA(t, lt, dur) {
    const cam = kf(t, [[0, [1450, 240, 1.12]], [.5, [1450, 240, 1.12]], [1.8, [930, 620, 1]], [6.2, [930, 640, 1]], [8.2, [870, 700, 1.14]]]);
    camBegin(cam[0] + 8 * Math.sin(t * .5), cam[1], cam[2]);
    sky(t);
    const [kx, ky, ks] = kPos(t), wd = wind(t), fl = flame(t);
    river(t, [() => { if (t >= tSplash) { boilSeed('krathong'); krathong(kx, ky, ks, { flame: fl, lean: wd * 1.4, rot: .06 * Math.sin(t * 1.8) + .1 * wd, smoke: seg(t, tOut, tOut + 1.6) }); } }]);
    if (t > tSplash && t < tSplash + 1.2) {   // splash rings
      boilSeed('splash');
      for (let r = 0; r < 2; r++) { const k = seg(t, tSplash + r * .2, tSplash + .9 + r * .2); if (k > 0 && k < 1) paint(ellPts(975, 982, 60 + 160 * k, 12 + 30 * k, 24), { ink: '#9FB6CC', sw: .8 * (1 - k), wash: null }); }
    }
    reeds(t, false);
    bank();

    // Clawd
    const mood = emotions(t, [[0, 'love'], [2.75, 'happy'], [3.75, 'playful'], [4.85, 'nervous', { lookX: -.8 }], [5.7, 'surprised', { lookX: .8, lookY: .2 }], [6.55, 'sad', { lookX: .7 }]]);
    const cl = { ...mood };
    const crouch = .22 * ease(seg(t, 2.7, 3.0)) * (1 - ease(seg(t, 3.15, 3.5)));
    if (t < tPlace) {   // holding the krathong in front
      cl.aL = -.35; cl.aR = -.35; cl.sq = (mood.sq || 0) * .3 + crouch; cl.dy = (mood.dy || 0) * .3; cl.emote = t < 2.75 ? null : cl.emote;
      cl.draw = (u, sw) => { push(); translate(0, -2.3 * u - 4); krathong(0, 0, u * 3.8 / 70, { water: false, light: true }); pop(); };
      cl.lookY = .6; cl.lookX = .2;
    } else if (t < 3.7) {   // arms follow the release out toward the water
      const k = ease(seg(t, tPlace, 3.5));
      cl.aL = lerp(-.35, .1, k); cl.aR = lerp(-.35, .4, k); cl.sq = (mood.sq || 0) + crouch; cl.lookX = .8; cl.lookY = .5;
    }
    if (t > 4.7 && t < 6.0) { cl.sq = (cl.sq || 0) + .12 * wd; cl.rot = (cl.rot || 0) + .08 * wd; }   // braced against the wind
    clawd(CX, G, U, cl);
    if (t >= tPlace && t < tSplash) {   // the krathong on its way down
      boilSeed('krathong');
      const p = arcPt([CX, G - 2.3 * U - 4], [975, 970], 70, ease(seg(t, tPlace, tSplash)));
      krathong(p[0], p[1], lerp(U * 3.8 / 70, 1.25, seg(t, tPlace, tSplash)), { water: false, rot: .2 * Math.sin(seg(t, tPlace, tSplash) * 3) });
    }
    reeds(t, true);
    // the gust: dry streaks that sweep across
    if (wd > .02) for (let i = 0; i < 6; i++) {
      boilSeed('gust' + i);
      const k = seg(t, 4.6 + i * .08, 5.5 + i * .08), x = lerp(-400, 1900, k), y = 620 + i * 60 + 20 * Math.sin(i * 3);
      if (k > 0 && k < 1) inkLine([[x - 280, y + 10], [x - 140, y - 6], [x, y], [x + 60, y - 20]], 1.2, '#B6BEDA', 'dry', .7);
    }
    const moonS = toScreen(...MOON);
    camEnd();
    boilSeed('transition');
    if (lt < 1.4) iris(...moonS, lerp(0, 1600, easeIn(seg(lt, 0, 1.4))), '#0F1229');
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, NIGHT);
  }

  // ---------- shot B: the firefly ----------
  function shotB(t, lt, dur) {
    const cam = kf(t, [[8.2, [940, 800, 1.42]], [11.0, [990, 790, 1.48]], [12.3, [1010, 775, 1.55]], [13.6, [1010, 775, 1.5]], [16.2, [1040, 650, 1.0]], [18.6, [1060, 630, 1.0]], [22.2, [1380, 300, 1.12]]]);
    const shake = t > tRelit ? shakeXY(t, 4 * Math.exp(-(t - tRelit) * 8)) : [0, 0];
    camBegin(cam[0] + 10 * Math.sin(t * .45) + shake[0], cam[1] + shake[1], cam[2]);
    sky(t);
    const [kx, ky, ks] = kPos(t), fl = flame(t);
    river(t, [...otherLights(t), () => {
      boilSeed('krathong');
      krathong(kx, ky, ks, { flame: fl, rot: .05 * Math.sin(t * 1.7) });
      if (t > tRelit && t < tRelit + .6) {   // the flare when it catches
        const k = seg(t, tRelit, tRelit + .6), [wx, wy] = wickOf(kx, ky, ks);
        glow(wx, wy - 10, 120 + 260 * k, '#FFE08A', 1 - k);
        for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * .45, q = easeOut(k); paint(starPts(wx + Math.cos(a) * 90 * q, wy - 10 + Math.sin(a) * 90 * q, 12 * (1 - k * .6), .3, 4), { wash: PAL.cream, washOp: 255 * (1 - k), ink: null }); }
      }
    }]);
    reeds(t, false);
    bank();

    // Clawd: sad → notices the firefly → hope → starstruck → a jump → love and a wave → looks up at the moon
    const [fx, fy] = ffPos(t);
    const mood = emotions(t, [[8.2, 'sad', { lookX: .7 }], [9.35, 'surprised'], [10.05, 'hopeful'], [tRelit + .2, 'starstruck', { lookX: .8, lookY: .3 }],
                              [12.75, 'excited'], [15.4, 'love', { lookX: .7 }], [18.8, 'happy', { lookX: .5, lookY: -.9 }]]);
    const cl = { ...mood };
    if (t > 9.35 && t < tRelit + .2) {   // the eyes follow the firefly
      const ex = CX, ey = G - 6 * U, d = Math.hypot(fx - ex, fy - ey) || 1;
      cl.lookX = clamp((fx - ex) / d * 1.2, -1, 1); cl.lookY = clamp((fy - ey) / d * 1.2, -1, 1);
    }
    const hop = jump(t, 12.85, 13.5, 3.2);
    cl.dy = (cl.dy || 0) + hop.dy; cl.sq = (cl.sq || 0) + hop.sq;
    if (t > 16.2 && t < 18.8) {   // waving goodbye with the near arm
      const k = ease(seg(t, 16.2, 16.45)) * (1 - ease(seg(t, 18.5, 18.8)));
      cl.aL = lerp(cl.aL ?? .2, 1.25 + .45 * Math.sin((t - 16.2) * 12), k);
    }
    clawd(CX, G, U, cl);
    reeds(t, true);

    // fireflies: the hero first, then more come out once the flame is back
    if (t > 8.9 && t < 14.5) firefly(fx, fy, seg(t, 8.9, 9.2) * (1 - seg(t, 14.1, 14.5)), 'hero');
    for (let i = 0; i < 9; i++) {
      const a = seg(t, 13.2 + i * .25, 14 + i * .25); if (a <= 0) continue;
      const bx = 150 + 1400 * hash(i + 60), by = 560 + 280 * hash(i + 80);
      firefly(bx + 60 * Math.sin(t * (.5 + .4 * hash(i)) + i), by + 40 * Math.sin(t * (.7 + .3 * hash(i + 5)) + i * 2), a, i);
    }
    const moonS = toScreen(...MOON);
    camEnd();
    boilSeed('transition');
    if (lt < .3) brushWipe(.5 + lt / .6, NIGHT);
    const tI = 22.2;
    if (t > tI) {   // iris to the moon, hold, shut
      const r = t < tI + .7 ? lerp(1700, 150, ease(seg(t, tI, tI + .7))) : t < DUR - .35 ? lerp(150, 136, seg(t, tI + .7, DUR - .35)) : lerp(136, 0, easeIn(seg(t, DUR - .35, DUR - .05)));
      iris(...moonS, r, '#0F1229');
    }
  }

  shots([[0, shotA], [8.2, shotB]]);
})();
