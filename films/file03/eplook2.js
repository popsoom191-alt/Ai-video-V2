// Look test 2 (?ep=look2): every place of episode 1 with the new light and atmosphere, one still each.
export default (api) => {
  const { g, W, H, person, extra, P, cam, pov, dof, grade, atmo, badge, darkTorch, lerp,
    shop, shopFront, building2026, gate, lobby, stairsUp, stairPos, lab, corridor, lift, market2, stool, oatShop, carRide } = api;
  const S = (draw) => ({ d: 4, draw });
  return [
    S((lt, t) => { cam(960, 540, 1.04, () => shopFront(g, t)); atmo('beams', t, { a: .14 }); grade('day', .45); badge(lt, 0, 4, '๑๔:๐๐ น. · ร้านซ่อมเทปของเบียร์'); }),
    S((lt, t) => { cam(1100, 520, 1.15, () => { shop(g, t, false, { clock: 14 }); person(g, 'beer', 760, 980, 560, P('beer', t, { look: .6 })); }); atmo('beams', t, { a: .22 }); atmo('dust', t, { a: .6 }); grade('warm', .45); }),
    S((lt, t) => { cam(960, 540, 1.08, () => { shop(g, t, true, {}); person(g, 'beer', 880, 990, 580, P('beer', t, { look: .5 })); }); atmo('glow', t, { x: 420, y: 560, r: 520, col: 'rgba(110,160,230,.35)' }); atmo('glow', t, { x: 1500, y: 420, r: 380, col: 'rgba(255,190,110,.3)' }); grade('night', .6); badge(lt, 0, 4, '๒๓:๔๐ น. · คืนเดียวกัน'); }),
    S((lt, t) => { cam(960, 520, 1.06, () => building2026(g, t)); atmo('haze', t, { col: 'rgba(200,205,210,.35)' }); grade('day', .5); badge(lt, 0, 4, 'อาคารวิชัยแล็บ · ปิดตาย ๒๙ ปี'); }),
    S((lt, t) => { pov(t, 960, 540, 1.05, () => gate(g, t)); atmo('haze', t, { col: 'rgba(40,60,90,.35)' }); grade('dark', .65); }),
    S((lt, t) => { pov(t, 960, 540, 1.1, () => { lobby(g, t); person(g, 'chai', 1240, 900, 470, P('chai', t, { flip: true, hold: true })); }); atmo('glow', t, { x: 1240, y: 600, r: 360, col: 'rgba(255,220,150,.3)' }); atmo('flicker', t); grade('dark', .6); }),
    S((lt, t) => { stairsUp(g, t, 3); const [x, y, s] = stairPos(.45); person(g, 'mind', x, y, 520 * s, { t, view: 'back', walk: 1.2, hold: true, arms: 'torch' }); darkTorch(x + 30 * s, y - 300 * s, 640, .9); atmo('dust', t, { a: .35, n: 40 }); }),
    S((lt, t) => { cam(1240, 560, 1.3, () => lab(g, t, .75)); atmo('beams', t, { beams: [[600, 120], [760, 80]], a: .12 }); atmo('dust', t, { a: .4 }); grade('dark', .6); }),
    S((lt, t) => { cam(960, 540, 1.05, () => { corridor(g, t, .55, { wet: true }); person(g, 'daeng', 1080, 860, 360, P('daeng', t, { flip: true, hold: true, expr: 'smile', hands: { L: [-4, -250], R: [26, -214] } })); }); atmo('haze', t, { top: .6, col: 'rgba(120,150,140,.3)' }); atmo('flicker', t); grade('dark', .7); }),
    S((lt, t) => { cam(960, 540, 1.04, () => lift(g, t, .6, .7)); atmo('glow', t, { x: 960, y: 300, r: 500, col: 'rgba(230,240,255,.25)' }); grade('dark', .65); }),
    S((lt, t) => { cam(960, 540, 1.02, () => { market2(g, t); for (const [x, y, s, d] of [[300, 900, 5, -1], [760, 905, 6, 1], [1000, 900, 8, 1], [200, 960, 0, 1], [650, 980, 2, 1], [880, 1010, 3, -1]]) person(g, extra(s), x, y, 470 * (y / 1000), { t, walk: t * 7 + s, flip: d < 0 }); }); atmo('beams', t, { a: .12 }); atmo('haze', t, { col: 'rgba(255,220,170,.18)' }); grade('warm', .45); badge(lt, 0, 4, 'ตลาดเก่า · ๑๖:๓๐ น.'); }),
    S((lt, t) => { cam(960, 540, 1.08, () => { oatShop(g, t); }); dof(5); cam(960, 540, 1.08, () => person(g, 'oat', 1250, 990, 560, P('oat', t, { flip: true }))); atmo('glow', t, { x: 1250, y: 380, r: 420, col: 'rgba(255,210,140,.35)' }); atmo('dust', t, { a: .35 }); grade('warm', .55); }),
  ];
};
