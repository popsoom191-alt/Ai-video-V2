// Silhouette of "the Thing" (东西): an organic outline drawn in Canvas2D (in the film it is a billboard at the end of the corridor, always almost square-on to the camera)
// The same function is also used for the silhouette design page. Units: metres; origin = the ground between the two feet
// o = { wave: 0..1 how far the hand is raised, ph: wave phase (rad), tilt: head tilt (rad) }
const lerp = (a, b, t) => a + (b - a) * t;
const P = (x, y) => ({ x, y });
const mixP = (a, b, t) => P(lerp(a.x, b.x, t), lerp(a.y, b.y, t));

// Draw a "limb" of tapering width along a polyline (short segments with round caps and joins stacked up, so the joints come out naturally smooth)
function limb(x, pts, widths, S) {
  x.lineCap = 'round'; x.lineJoin = 'round';
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], n = 10;
    for (let k = 0; k < n; k++) {
      const t0 = k / n, t1 = (k + 1) / n, p0 = mixP(a, b, t0), p1 = mixP(a, b, t1);
      x.lineWidth = lerp(widths[i], widths[i + 1], (t0 + t1) / 2) * S;
      x.beginPath(); x.moveTo(p0.x * S, -p0.y * S); x.lineTo(p1.x * S, -p1.y * S); x.stroke();
    }
  }
}
// Hand: palm + long thin fingers (spread when waving / hanging slightly curled)
function hand(x, wr, dir, open, S) {
  const ang = Math.atan2(dir.y, dir.x), c = Math.cos(ang), s = Math.sin(ang);
  const R = (u, v) => P(wr.x + u * c - v * s, wr.y + u * s + v * c);   // u along the hand's direction, v perpendicular
  limb(x, [wr, R(.1, 0)], [.05, .06], S);                                 // palm
  const fingers = open ? [[-.045, .2, -.32], [-.016, .23, -.1], [.014, .235, .08], [.04, .2, .28]] : [[-.02, .19, -.05], [-.005, .21, 0], [.01, .2, .04], [.022, .17, .08]];
  for (const [v, len, spread] of fingers) {
    const base = R(.09, v * 1.1), mid = R(.09 + len * .55, v * 1.1 + Math.sin(spread) * len * .5), tip = R(.09 + len * (open ? .98 : .9), v * 1.1 + Math.sin(spread) * len * (open ? 1 : .6) + (open ? 0 : .015));
    limb(x, [base, mid, tip], [.02, .016, .011], S);
  }
  const th = open ? [R(.03, .03), R(.1, .09), R(.16, .12)] : [R(.03, .025), R(.09, .04), R(.13, .03)];
  limb(x, th, [.024, .018, .012], S);
}
// The woman at the end of the corridor: wrong by a little. Too tall (2.25 m), the neck too long and tilted, the arms
// hang past the knee, and the hair falls over the face to the waist. o = { tilt: head tilt (rad), sway: 0..1 slow sway }
export function drawThing(x, S, o = {}) {
  const tilt = o.tilt ?? .22, sw = o.sway ?? 0;
  x.save(); x.fillStyle = x.strokeStyle = o.color || '#0b0a09';
  const T = (px, py) => [px * S, -py * S];
  // feet: two narrow bare feet under the hem
  for (const sd of [-1, 1]) { x.beginPath(); x.ellipse(sd * .07 * S, -.02 * S, .045 * S, .025 * S, 0, 0, 7); x.fill(); }
  limb(x, [P(-.07, .02), P(-.075, .2)], [.05, .055], S); limb(x, [P(.07, .02), P(.072, .2)], [.05, .055], S);
  // a long plain dress: narrow, a ragged hem
  x.beginPath();
  x.moveTo(...T(-.15, 1.95));
  x.bezierCurveTo(...T(-.2, 1.5), ...T(-.24, .8), ...T(-.27 + .02 * sw, .16));
  const hem = [[-.27, .16], [-.2, .2], [-.14, .14], [-.06, .19], [.02, .13], [.1, .18], [.17, .13], [.23, .19], [.28, .15]];
  for (const [hx, hy] of hem) x.lineTo(...T(hx + .02 * sw, hy));
  x.bezierCurveTo(...T(.25, .8), ...T(.2, 1.5), ...T(.15, 1.95));
  x.bezierCurveTo(...T(.12, 2.0), ...T(.05, 2.02), ...T(0, 2.02));
  x.bezierCurveTo(...T(-.05, 2.02), ...T(-.12, 2.0), ...T(-.15, 1.95));
  x.closePath(); x.fill();
  // arms: thin, hanging well past the knee, fingers long
  for (const sd of [-1, 1]) {
    const sh = P(sd * .15, 1.92), el = P(sd * (.2 + .01 * sw), 1.36), wr = P(sd * (.215 + .015 * sw), .78);
    limb(x, [sh, el, wr], [.075, .055, .042], S);
    hand(x, wr, P(sd * .02, -1), false, S);
  }
  // neck: too long, tilted
  const nb = P(0, 1.98), nt = P(Math.sin(tilt) * .12, 2.2);
  limb(x, [nb, mixP(nb, nt, .5), nt], [.07, .06, .056], S);
  // head + the hair: one shape, from the crown down over the face and shoulders to the waist
  x.save(); x.translate((nt.x + Math.sin(tilt) * .05) * S, -(nt.y + .07) * S); x.rotate(tilt * .8);
  x.beginPath(); x.ellipse(0, 0, .085 * S, .105 * S, 0, 0, 7); x.fill();
  x.beginPath();
  x.moveTo(-.1 * S, -.02 * S);
  x.bezierCurveTo(-.17 * S, .3 * S, -.2 * S, .6 * S, -.22 * S, .95 * S);
  const tips = 14;
  for (let k = 0; k <= tips; k++) {
    const u = k / tips, hx = lerp(-.22, .2, u), hy = .95 + .08 * Math.sin(k * 2.7) + .05 * Math.sin(k * 1.3 + sw * 3);
    x.lineTo(hx * S, hy * S); x.lineTo((hx + .015) * S, (hy - .07) * S);
  }
  x.bezierCurveTo(.2 * S, .6 * S, .16 * S, .3 * S, .1 * S, -.02 * S);
  x.closePath(); x.fill();
  x.restore();
  x.restore();
}
