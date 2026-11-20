// "เวรดึก อาคาร ๓" (Night Round, Building 3): the timeline, the one source of truth. Camera keys, lines, the bell,
// focus, fear, tape breaks and captions all read from here.
// Coordinates: metres; x east, z south (-z = north, down the corridor); yaw 0 = facing north, +π/2 = west, −π/2 = east.
import { track, monotone } from '/core/lib.js';

const PI = Math.PI;
export const W = t => t;            // no time warp in this film
export const DUR = 60.0;

// —— Key moments ——
export const T = {
  rollIn: .55,
  title: [1.1, 4.6],
  w1: 2.0,                        // "first night"
  notice: [3.6, 8.5],             // the rules sheet held still and readable
  turn0: [8.6, 9.8],              // off the board, to the corridor
  chime1: 10.3, p1: 11.0,         // PA: the round
  glance: [14.2, 16.2],           // a look at the door of room 3/1
  lookDown: [17.4, 19.2],
  stop: 21.0,
  bell: [21.2, 23.6],             // the class bell, at midnight: rule 2, stand still and count to ten
  count0: 23.8, countStep: .78,   // whispered "one … ten"
  zoom: [25.0, 26.2],
  figOn: [25.0, 28.75],
  afFig: [27.0, 27.55],           // the only moment in focus: it is there
  afEmpty: [29.05],               // the next lock: gone
  flick: [29.9, 30.35, 30.8],
  unzoom: [32.0, 32.8],
  tear: [33.0, 33.65],            // tracking tear → three hours gone
  w3: 34.3,
  chime2: 35.7, p2: 36.4,         // PA, flat with tape wow: "room 3/2 no longer exists"
  turn: [38.8, 40.4],             // into the side corridor: the red plate
  hush: [41.5, 42.5],             // one second of nothing
  name: 42.8,                     // someone whispers his name from the room (rule 4: don't answer)
  door: [46.4, 47.8],
  afSheet: 50.2,
  sheet: [50.4, 54.6],            // the class list, his name at the bottom
  batDie: [53.0, 55.2],
  recOff: 55.2,
  endCard: [55.9, 60.0],
};

export const COUNT = ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า', 'สิบ'];

// —— Lines (ids match lines.json / voices) ——
export const LINES = [
  { id: 'w1', t: T.w1, who: 'ME' },
  { id: 'p1', t: T.p1, who: 'PA' },
  ...COUNT.map((_, i) => ({ id: 'n' + (i + 1), t: T.count0 + i * T.countStep, who: 'ME' })),
  { id: 'w3', t: T.w3, who: 'ME' },
  { id: 'p2', t: T.p2, who: 'PA' },
  { id: 'name', t: T.name, who: 'ROOM' },
];
export const CHIMES = [T.chime1, T.chime2];

// —— Camera ——
export const POS = track([
  [0, [0.05, 0]], [2.0, [0.05, 0]], [3.3, [-0.74, 0.02]], [8.5, [-0.74, 0.02]], [9.8, [-0.1, -0.7]],
  [21.0, [0.1, -17.0]], [37.4, [0.1, -17.0]], [39.4, [0.25, -21.6]], [40.6, [1.2, -22.2]],
  [41.4, [2.0, -22.2]], [43.6, [2.0, -22.2]], [46.2, [5.6, -22.2]], [47.9, [6.6, -22.2]],
  [49.2, [9.0, -22.2]], [50.2, [10.42, -22.2]], [60.0, [10.42, -22.2]],
]);
export const YAW = monotone([
  [0, PI / 2], [8.6, PI / 2], [9.8, 0.02], [14.2, 0.0], [14.8, 0.62], [15.6, 0.62], [16.2, 0.0],
  [38.8, 0.0], [40.4, -PI / 2], [60.0, -PI / 2],
]);
export const PITCH = monotone([
  [0, -0.04], [3.3, -0.02], [8.5, -0.02], [9.8, -0.06], [17.4, -0.07], [18.0, -1.2], [19.0, -1.16], [19.6, -0.08],
  [21.0, -0.04], [25.0, -0.012], [32.8, -0.02], [40.4, 0.04], [43.6, 0.05], [47.9, 0.0], [49.2, -0.04], [50.2, -0.05], [60.0, -0.05],
]);
// crouch at the notice and the class list so the lens is parallel to the paper (a downward tilt would shear the text)
export const CAMH = monotone([[0, 0], [2.0, 0], [3.3, -0.12], [8.5, -0.12], [9.6, 0], [49.2, 0], [50.2, -0.12], [60.0, -0.12]]);
export const FOV = monotone([[0, 52], [3.3, 52], [3.6, 50], [8.4, 50], [9.0, 52], [25.0, 52], [26.2, 27], [32.0, 27], [32.8, 52], [50.0, 52], [50.4, 52], [60, 52]]);
// autofocus distance: hunting = racking through, with overshoot
export const FOCUS = monotone([
  [0, 0.35], [0.8, 0.5], [1.2, 3.5], [1.55, 1.75], [2.4, 1.75], [3.1, 0.4], [3.4, 1.2], [3.6, 0.78], [8.5, 0.78], [9.6, 6],
  [17.6, 6], [18.0, 1.5], [19.2, 1.6], [19.8, 6], [25.0, 6], [25.6, 2.4], [26.4, 4.5], [26.8, 9], [27.0, 23.6], [27.55, 23.4],
  [27.8, 80], [28.3, 4], [28.7, 14], [29.05, 23.5], [32.0, 23.5], [32.8, 6], [46.0, 4], [49.4, 3], [49.8, 0.35], [50.2, 0.84], [60, 0.84],
]);
export const APER = monotone([[0, 3.0], [25.0, 3.0], [26.2, 14], [32.0, 14], [32.8, 3.0], [60, 3.0]]);
export const FEAR = monotone([[0, 0.12], [20, 0.18], [21.2, 0.45], [24, 0.55], [27.5, 0.95], [29, 0.8], [33, 0.6], [36.4, 0.7], [41.5, 0.8], [43, 1.0], [50, 0.75], [55, 0.9], [60, 0.9]]);

// —— OSD: the clock and the battery are part of the story ——
export function clock(t) {
  if (t < T.tear[0] + 0.3) return t < 21.2 ? 'PM 11:59' : 'AM 12:00';
  return t < 44 ? 'AM  2:59' : 'AM  3:00';
}
export const battery = t => t < T.tear[0] + 0.3 ? 3 : t < T.batDie[0] ? 1 : 0;
