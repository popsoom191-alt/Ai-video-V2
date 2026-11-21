// FILE 03 · the action library: every action is keyframes over normalised time u (0 → 1), always prepare → do → hold → return,
// eased between keys so nothing jumps. act(name, u) gives pose fields for person(): hands {L,R}, crouch, lean, dx, dy, nod,
// look, expr, prop. Hand coordinates are the 3/4 standing figure's (facing right, feet at 0, head ≈ -400; desk ≈ -205).
const REST = { R: [30, -196], L: [-17, -196] };
const sm = x => x * x * (3 - 2 * x), mix = (a, b, u) => a + (b - a) * u;
const J = (n, f) => Array.from({ length: n }, (_, i) => f(i, n));   // build repeated keys (knocks, shakes, scribbles)
const osc = (u0, u1, n, a, b) => J(n, (i, N) => [u0 + (u1 - u0) * (i + 1) / (N + 1), i % 2 ? a : b]);

export const ACTIONS = {
  // ---- doors
  knock: { th: 'เคาะประตู', dur: 1.8, keys: [[0, {}], [.2, { R: [70, -300] }], ...osc(.2, .7, 6, { R: [70, -300] }, { R: [88, -300] }), [.8, { R: [66, -292] }], [1, {}]] },
  turnKnob: { th: 'หมุนลูกบิด–ดึงเปิด', dur: 2.6, keys: [[0, {}], [.25, { R: [86, -204], lean: .04 }], [.42, { R: [86, -200], lean: .04 }], [.65, { R: [48, -204], dx: -8 }], [.85, { R: [48, -204], dx: -8 }], [1, {}]] },
  pushBar: { th: 'ผลักคันโยกประตู', dur: 2.2, keys: [[0, {}], [.25, { R: [92, -250], L: [62, -252], lean: .06 }], [.55, { R: [104, -250], L: [74, -252], dx: 16, lean: .1 }], [.8, { R: [104, -250], L: [74, -252], dx: 16, lean: .1 }], [1, { dx: 16 }]] },
  rattle: { th: 'เขย่าเช็กว่าล็อก', dur: 2.2, keys: [[0, {}], [.2, { R: [84, -206], expr: 'worried' }], ...osc(.2, .75, 7, { R: [78, -206], dx: -3, expr: 'worried' }, { R: [90, -206], dx: 3, expr: 'worried' }), [.85, { R: [84, -206], expr: 'worried' }], [1, { expr: 'worried' }]] },
  unlockKey: { th: 'ไขกุญแจ', dur: 2.6, keys: [[0, { prop: ['R', 'key'] }], [.25, { R: [84, -216], prop: ['R', 'key'] }], [.42, { R: [86, -214], prop: ['R', 'key'] }], [.58, { R: [86, -220], prop: ['R', 'key'], nod: 2 }], [.75, { R: [86, -220], prop: ['R', 'key'] }], [1, {}]] },
  closeDoor: { th: 'ปิดประตู', dur: 1.8, keys: [[0, {}], [.3, { R: [74, -206] }], [.6, { R: [40, -206], dx: -6 }], [.75, { R: [40, -206], dx: -6 }], [1, { dx: -6 }]] },
  // ---- picking up, putting down
  reachPick: { th: 'เอื้อมหยิบของบนโต๊ะ', dur: 2.2, keys: [[0, {}], [.35, { R: [100, -212], lean: .1, crouch: .1 }], [.48, { R: [100, -214], lean: .1, crouch: .1, prop: ['R', 'tape'] }], [.75, { R: [44, -252], prop: ['R', 'tape'] }], [1, { R: [36, -252], L: [14, -250], prop: ['R', 'tape'] }]] },
  putDown: { th: 'ก้มวางของ', dur: 2.2, keys: [[0, { R: [36, -252], L: [14, -250], prop: ['R', 'tape'] }], [.4, { R: [100, -214], lean: .1, crouch: .1, prop: ['R', 'tape'] }], [.55, { R: [100, -212], lean: .1, crouch: .1 }], [1, {}]] },
  pickFloor: { th: 'ก้มหยิบจากพื้น', dur: 2.8, keys: [[0, {}], [.35, { crouch: .9, R: [62, -66], lean: .12 }], [.5, { crouch: .9, R: [64, -60], lean: .12, prop: ['R', 'paper'] }], [.82, { R: [40, -252], prop: ['R', 'paper'] }], [1, { R: [36, -262], L: [16, -258], prop: ['R', 'paper'] }]] },
  handOver: { th: 'ยื่นของให้', dur: 2.2, keys: [[0, { R: [36, -252], prop: ['R', 'tape'] }], [.4, { R: [106, -262], prop: ['R', 'tape'], lean: .04 }], [.62, { R: [106, -262], lean: .04 }], [1, {}]] },
  receive: { th: 'รับของ', dur: 2.2, keys: [[0, {}], [.4, { R: [106, -262], lean: .04 }], [.62, { R: [106, -262], lean: .04, prop: ['R', 'tape'] }], [1, { R: [36, -252], prop: ['R', 'tape'] }]] },
  inspect: { th: 'พลิกดูของในมือ', dur: 2.6, keys: [[0, { R: [36, -252], L: [14, -250], prop: ['R', 'tape'] }], [.3, { R: [42, -292], L: [20, -286], prop: ['R', 'tape', .6], nod: 3 }], [.6, { R: [38, -296], L: [16, -290], prop: ['R', 'tape', -.6], nod: 4 }], [1, { R: [36, -252], L: [14, -250], prop: ['R', 'tape'] }]] },
  pocketIn: { th: 'เก็บใส่กระเป๋า', dur: 1.8, keys: [[0, { R: [36, -252], prop: ['R', 'key'] }], [.5, { R: [26, -214], prop: ['R', 'key'] }], [.7, { R: [26, -214] }], [1, {}]] },
  // ---- the torch
  torchOut: { th: 'ล้วงไฟฉายจากกระเป๋า', dur: 2.4, keys: [[0, {}], [.3, { R: [-28, -216], nod: 3 }], [.5, { R: [-28, -218], prop: ['R', 'torch'] }], [1, { R: [78, -268], prop: ['R', 'torch'] }]] },
  torchOn: { th: 'กดเปิดไฟฉาย', dur: 1.2, keys: [[0, { R: [78, -268], prop: ['R', 'torch'] }], [.4, { R: [72, -276], prop: ['R', 'torch'] }], [.55, { R: [74, -274], prop: ['R', 'torch', 0, 1] }], [1, { R: [78, -268], prop: ['R', 'torch', 0, 1] }]] },
  torchSweep: { th: 'ส่องไฟฉายกวาด', dur: 3.2, keys: [[0, { R: [78, -268], prop: ['R', 'torch', 0, 1] }], ...osc(0, .9, 5, { R: [82, -300], look: .9, prop: ['R', 'torch', -.3, 1] }, { R: [74, -238], look: .2, prop: ['R', 'torch', .4, 1] }), [1, { R: [78, -268], prop: ['R', 'torch', 0, 1] }]] },
  torchDown: { th: 'ส่องไฟลงพื้น', dur: 1.8, keys: [[0, { R: [78, -268], prop: ['R', 'torch', 0, 1] }], [.5, { R: [86, -228], nod: 5, prop: ['R', 'torch', .6, 1] }], [.8, { R: [86, -228], nod: 5, prop: ['R', 'torch', .6, 1] }], [1, { R: [78, -268], prop: ['R', 'torch', 0, 1] }]] },
  torchShake: { th: 'มือสั่นถือไฟฉาย', dur: 2.2, keys: [[0, { R: [78, -268], prop: ['R', 'torch', 0, 1] }], ...osc(0, 1, 14, { R: [74, -264], expr: 'scared', prop: ['R', 'torch', -.08, 1] }, { R: [82, -272], expr: 'scared', prop: ['R', 'torch', .08, 1] }), [1, { R: [78, -268], expr: 'scared', prop: ['R', 'torch', 0, 1] }]] },
  // ---- feelings
  startle: { th: 'สะดุ้ง', dur: 1.4, keys: [[0, {}], [.14, { dy: -16, R: [52, -292], L: [12, -282], expr: 'scared' }], [.4, { R: [46, -272], L: [6, -268], expr: 'scared' }], [1, { R: [36, -232], expr: 'scared' }]] },
  recoil: { th: 'ผงะถอย', dur: 1.8, keys: [[0, {}], [.25, { dx: -32, lean: -.08, R: [66, -302], L: [32, -300], expr: 'scared' }], [.6, { dx: -46, lean: -.04, R: [56, -290], L: [24, -286], expr: 'scared' }], [1, { dx: -46, R: [40, -232], L: [2, -232], expr: 'scared' }]] },
  coverMouth: { th: 'ยกมือปิดปาก', dur: 2.2, keys: [[0, {}], [.35, { R: [24, -342], expr: 'scared', dx: -6 }], [.8, { R: [24, -342], expr: 'scared', dx: -6 }], [1, { expr: 'worried', dx: -6 }]] },
  tremble: { th: 'ตัวสั่น', dur: 2.2, keys: [[0, {}], [.15, { R: [30, -262], L: [10, -258], expr: 'scared' }], ...osc(.15, .85, 16, { R: [28, -260], L: [8, -258], dx: -1.5, expr: 'scared' }, { R: [32, -264], L: [12, -260], dx: 1.5, expr: 'scared' }), [1, { expr: 'scared' }]] },
  sigh: { th: 'ก้มหน้าถอนหายใจ', dur: 2.6, keys: [[0, {}], [.3, { dy: -4, nod: -2 }], [.55, { dy: 4, nod: 9, expr: 'sad' }], [.8, { dy: 4, nod: 9, expr: 'sad' }], [1, { expr: 'sad' }]] },
  headShake: { th: 'ส่ายหัว', dur: 1.8, keys: [[0, {}], ...osc(.05, .9, 6, { look: -1, expr: 'frown' }, { look: 1, expr: 'frown' }), [1, {}]] },
  nodLong: { th: 'พยักหน้ายาว', dur: 1.8, keys: [[0, {}], ...osc(.05, .9, 4, { nod: 8 }, { nod: -1 }), [1, {}]] },
  laugh: { th: 'หัวเราะเบา ๆ', dur: 1.8, keys: [[0, {}], ...osc(.05, .85, 6, { dy: -4, nod: -3, expr: 'smile' }, { dy: 0, nod: 2, expr: 'smile' }), [1, { expr: 'smile' }]] },
  shrug: { th: 'ยักไหล่', dur: 1.8, keys: [[0, {}], [.35, { dy: -6, R: [64, -230], L: [24, -230], expr: 'frown' }], [.65, { dy: -6, R: [64, -230], L: [24, -230], expr: 'frown' }], [1, {}]] },
  // ---- standing, sitting, leaning
  sitDown: { th: 'นั่งลง', dur: 2.2, keys: [[0, {}], [.55, { crouch: .55, lean: .1, R: [60, -214] }], [.8, { crouch: .55, lean: .05, R: [60, -214] }], [1, { sit: true }]] },
  standUp: { th: 'ลุกขึ้น', dur: 2.2, keys: [[0, { sit: true }], [.2, { crouch: .55, lean: .14, R: [60, -214] }], [.6, { crouch: .2, lean: .06 }], [1, {}]] },
  sleepDesk: { th: 'ฟุบหลับ', dur: 3, keys: [[0, {}], [.5, { lean: .14, nod: 6, R: [70, -250], L: [50, -246], blink: true }], [1, { lean: .26, nod: 12, R: [86, -240], L: [64, -236], blink: true }]] },
  leanScreen: { th: 'ชะโงกดูจอ', dur: 2.4, keys: [[0, {}], [.4, { lean: .12, dx: 18, R: [54, -236], L: [26, -232] }], [.8, { lean: .12, dx: 18, R: [54, -236], L: [26, -232] }], [1, {}]] },
  crossArms: { th: 'กอดอก', dur: 4, keys: [[0, {}], [.18, { arms: 'cross' }], [.82, { arms: 'cross' }], [1, {}]] },
  chin: { th: 'จับคาง', dur: 4, keys: [[0, {}], [.18, { arms: 'chin', expr: 'worried' }], [.82, { arms: 'chin', expr: 'worried' }], [1, {}]] },
  hips: { th: 'เท้าเอว', dur: 4, keys: [[0, {}], [.18, { arms: 'hip' }], [.82, { arms: 'hip' }], [1, {}]] },
  pockets: { th: 'ล้วงกระเป๋า', dur: 4, keys: [[0, {}], [.18, { arms: 'pocket' }], [.82, { arms: 'pocket' }], [1, {}]] },
  duckUnder: { th: 'ก้มลอด', dur: 2.4, keys: [[0, {}], [.35, { crouch: .7, lean: .1, R: [60, -190], L: [30, -180] }], [.7, { crouch: .7, lean: .1, dx: 30, R: [70, -190], L: [40, -180] }], [1, { dx: 40 }]] },
  lookAround: { th: 'มองซ้ายขวา', dur: 2.6, keys: [[0, {}], [.25, { look: -1, nod: -2, expr: 'worried' }], [.5, { look: -1, expr: 'worried' }], [.75, { look: 1, nod: 2, expr: 'worried' }], [1, { expr: 'worried' }]] },
  // ---- hands
  point: { th: 'ชี้', dur: 1.8, keys: [[0, {}], [.3, { R: [98, -312] }], [.75, { R: [98, -312] }], [1, {}]] },
  wave: { th: 'โบกมือ', dur: 2, keys: [[0, {}], [.2, { R: [62, -420] }], ...osc(.2, .8, 6, { R: [52, -416] }, { R: [74, -420] }), [1, {}]] },
  beckon: { th: 'กวักมือเรียก', dur: 2, keys: [[0, {}], [.25, { R: [92, -280] }], ...osc(.25, .8, 6, { R: [92, -284] }, { R: [76, -292] }), [1, {}]] },
  raiseStop: { th: 'ยกมือห้าม', dur: 1.8, keys: [[0, {}], [.3, { R: [100, -300], expr: 'frown' }], [.75, { R: [100, -300], expr: 'frown' }], [1, {}]] },
  pressButton: { th: 'กดปุ่มเครื่อง', dur: 1.6, keys: [[0, {}], [.35, { R: [96, -214], lean: .06 }], [.45, { R: [104, -214], lean: .07 }], [.55, { R: [96, -214], lean: .06 }], [1, {}]] },
  pullChain: { th: 'ดึงโซ่ออก', dur: 3, keys: [[0, {}], [.15, { R: [92, -262], L: [66, -262], lean: .06 }], ...osc(.15, .9, 6, { R: [50, -250], L: [26, -246], lean: -.02 }, { R: [92, -262], L: [66, -262], lean: .06 }), [1, {}]] },
  tearPoster: { th: 'ฉีกใบประกาศ', dur: 2, keys: [[0, {}], [.35, { R: [96, -330] }], [.45, { R: [96, -330], prop: ['R', 'paper'] }], [.6, { R: [70, -240], prop: ['R', 'paper', .5] }], [1, { R: [36, -262], L: [16, -258], prop: ['R', 'paper'] }]] },
  coverTowel: { th: 'คลุมผ้า', dur: 2.2, keys: [[0, {}], [.3, { R: [96, -230], L: [70, -230], lean: .08 }], [.7, { R: [110, -212], L: [86, -212], lean: .12, crouch: .1 }], [1, {}]] },
  typePhone: { th: 'พิมพ์มือถือ', dur: 2.6, keys: [[0, {}], [.25, { R: [40, -280], L: [22, -276], nod: 6, prop: ['R', 'phone'] }], ...osc(.25, .85, 10, { R: [42, -282], L: [22, -276], nod: 6, prop: ['R', 'phone'] }, { R: [38, -278], L: [24, -278], nod: 6, prop: ['R', 'phone'] }), [1, {}]] },
  phoneEar: { th: 'ยกมือถือแนบหู', dur: 2.2, keys: [[0, {}], [.35, { R: [18, -352], prop: ['R', 'phone'] }], [.8, { R: [18, -352], prop: ['R', 'phone'] }], [1, {}]] },
  writePen: { th: 'เขียนหนังสือ', dur: 2.6, keys: [[0, {}], [.2, { R: [92, -214], lean: .1, nod: 6, prop: ['R', 'pen'] }], ...osc(.2, .9, 10, { R: [86, -214], lean: .1, nod: 6, prop: ['R', 'pen'] }, { R: [98, -216], lean: .1, nod: 6, prop: ['R', 'pen'] }), [1, {}]] },
  wipeLabel: { th: 'ใช้นิ้วเช็ดฉลาก', dur: 2.4, keys: [[0, { R: [36, -262], L: [14, -258], prop: ['L', 'tape'] }], ...osc(.05, .9, 6, { R: [26, -262], L: [14, -258], nod: 4, prop: ['L', 'tape'] }, { R: [40, -264], L: [14, -258], nod: 4, prop: ['L', 'tape'] }), [1, { R: [36, -262], L: [14, -258], prop: ['L', 'tape'] }]] },
  drive: { th: 'จับพวงมาลัย', dur: 2.4, keys: [[0, { sit: true, R: [70, -250], L: [56, -262] }], [.5, { sit: true, R: [72, -262], L: [54, -250] }], [1, { sit: true, R: [70, -250], L: [56, -262] }]] },
  stretch: { th: 'บิดขี้เกียจ', dur: 2.4, keys: [[0, {}], [.4, { R: [20, -460], L: [4, -456], dy: -6 }], [.7, { R: [20, -460], L: [4, -456], dy: -6, nod: -3 }], [1, {}]] },
  drink: { th: 'ยกแก้วดื่ม', dur: 2.4, keys: [[0, { R: [36, -230], prop: ['R', 'cup'] }], [.4, { R: [22, -346], nod: -4, prop: ['R', 'cup'] }], [.7, { R: [22, -346], nod: -6, prop: ['R', 'cup'] }], [1, { R: [36, -230], prop: ['R', 'cup'] }]] },
  scratchHead: { th: 'เกาหัว', dur: 2, keys: [[0, {}], [.3, { R: [10, -410], expr: 'frown' }], ...osc(.3, .75, 6, { R: [6, -412], expr: 'frown' }, { R: [14, -408], expr: 'frown' }), [1, {}]] },
};
export const ACTION_NAMES = Object.keys(ACTIONS);

// the pose of an action at u ∈ [0,1]: hands interpolate from rest unless a key sets them; other fields hold through a segment
export function act(name, u, base = {}) {
  const A = ACTIONS[name]; if (!A) return base;
  u = Math.max(0, Math.min(1, u));
  const keys = A.keys; let i = 0; while (i < keys.length - 2 && u > keys[i + 1][0]) i++;
  const [a, KA] = keys[i], [b, KB] = keys[i + 1], k = sm(b > a ? (u - a) / (b - a) : 1);
  const H = (K, s) => K[s] || REST[s];
  const lerp2 = (p, q) => [mix(p[0], q[0], k), mix(p[1], q[1], k)];
  const num = f => mix(KA[f] || 0, KB[f] || 0, k);
  const out = { ...base, hands: { L: lerp2(H(KA, 'L'), H(KB, 'L')), R: lerp2(H(KA, 'R'), H(KB, 'R')) }, crouch: num('crouch'), lean: num('lean'), dx: num('dx'), dy: num('dy'), nod: num('nod'), look: (KA.look !== undefined || KB.look !== undefined) ? mix(KA.look ?? 0, KB.look ?? 0, k) : base.look };
  const pick = f => (k < .5 ? KA[f] : KB[f]) ?? KA[f] ?? KB[f];
  if (pick('expr')) out.expr = pick('expr');
  if (pick('blink')) out.blink = true;
  const pr = pick('prop'); if (pr) out.prop = pr;
  if (KA.arms || KB.arms) { delete out.hands; out.idle = KB.arms || KA.arms; out.idleK = KA.arms && KB.arms ? 1 : KB.arms ? k : 1 - k; }   // stances blend in through the idle mechanism
  if (pick('sit')) { out.sit = true; delete out.crouch; }
  return out;
}
