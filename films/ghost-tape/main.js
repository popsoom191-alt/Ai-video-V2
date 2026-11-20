// เวรดึก อาคาร ๓ (Night Round, Building 3): found-footage camcorder tape, built on the lemo-opuscar backrooms engine (MIT)
// three.js scene (720×540, 4:3) → GTAO + physical depth of field (autofocus hunting) + bloom → VHS camcorder shader → 1920×1080 (pillarboxed)
import * as THREE from 'three';
import { makePost } from '/core/three/post.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { clamp, seg, ss, lerp, hash, vnoise, env } from '/core/lib.js';
import { W as TW, DUR, T, LINES, CHIMES, COUNT, POS, YAW, PITCH, CAMH, FOV, FOCUS, APER, FEAR, clock, battery } from './story.js';
import { buildWorld, buildProps, updateLights, U, EXIT } from './world.js';
import { makeLegs, makeThing } from './figures.js';
import { VHS } from './vhs.js';
import { drawOSD, text as osdText, width as osdW } from './osd.js';
import { buildCaps, drawCaps } from './subs.js';

const Q = new URLSearchParams(location.search);
const NOSUB = Q.has('nosub'), RAW = Q.has('raw');
for (const f of ["700 30px 'IBM Plex Sans Condensed'", "600 30px 'IBM Plex Sans Condensed'", "400 30px 'IBM Plex Sans'", "600 30px 'IBM Plex Sans'", "700 30px 'IBM Plex Sans'", "600 30px 'IBM Plex Mono'", "500 30px 'IBM Plex Mono'", "400 30px 'IBM Plex Sans Thai'", "600 30px 'IBM Plex Sans Thai'", "700 30px 'IBM Plex Sans Thai'", "italic 600 30px 'IBM Plex Sans Thai'"]) await document.fonts.load(f);

const W = 1920, H = 1080, SW = 720, SH = 540;
const renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(W, H);
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 0.85;
document.getElementById('stage').appendChild(renderer.domElement);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0, 0, 0);
const camera = new THREE.PerspectiveCamera(40, 4 / 3, .03, 160); camera.rotation.order = 'YXZ';
const post = makePost(renderer, scene, camera, SW, SH, { ssaa: 1, ao: true, aoRadius: .55, aoThickness: 1.2, aoScale: 1.6, aoAmt: .75 });
post.bloom.strength = .5; post.bloom.radius = .55; post.bloom.threshold = 1.1;
post.vig.uniforms.amt.value = 0; post.vig.uniforms.contrast.value = 0; post.vig.uniforms.sat.value = 1;
post.dof.maxCoc = 14;
const osdCv = document.createElement('canvas'); osdCv.width = SW; osdCv.height = SH;
const osdTex = new THREE.CanvasTexture(osdCv); osdTex.minFilter = osdTex.magFilter = THREE.LinearFilter; osdTex.generateMipmaps = false;
const vhs = new ShaderPass(VHS);
vhs.uniforms.tOSD.value = osdTex; vhs.uniforms.res.value = [W, H]; vhs.uniforms.src.value = [SW, SH];
if (RAW) { vhs.uniforms.sharp.value = 0; vhs.uniforms.lumaW.value = .3; vhs.uniforms.chromaW.value = .01; vhs.uniforms.chromaShift.value = 0; vhs.uniforms.gain.value = 0; vhs.uniforms.jitter.value = 0; vhs.uniforms.barrel.value = 0; vhs.uniforms.dropout.value = 0; vhs.uniforms.smear.value = 0; vhs.uniforms.sat.value = 1; }
post.composer.addPass(vhs);

const world = buildWorld(scene);
const props = buildProps(scene);
const legs = makeLegs(scene);
const thing = makeThing(scene); thing.position.set(0.1, 0, -40.5); thing.visible = false;

const ov = document.getElementById('ov'), ox = ov.getContext('2d');
const fetchJ = async (p, d) => { try { const r = await fetch(p); return r.ok ? await r.json() : d; } catch { return d; } };
const DURS = await fetchJ('voices/dur.json', {}), WORDS = await fetchJ('voices/words.json', null);
const CAPS = buildCaps(DURS, WORDS);

// —— Gait: phase from distance walked (one step per 0.72 m) ——
const DT = 1 / 240, NS = Math.ceil(DUR / DT) + 2, DIST = new Float32Array(NS);
for (let k = 1; k < NS; k++) { const a = POS((k - 1) * DT), b = POS(k * DT); DIST[k] = DIST[k - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]); }
const distAt = t => { const f = clamp(t / DT, 0, NS - 1.001), i = Math.floor(f); return lerp(DIST[i], DIST[i + 1], f - i); };
const speedAt = t => (distAt(t + .15) - distAt(t - .15)) / .3;
const STRIDE = .72;

// —— Global lighting: three flickers + the shadow passing overhead + the overhead light dead after the tear ——
function gLight(t) {
  let g = 1;
  T.flick.forEach((f, i) => {
    if (t > f - .03 && t < f + .1 + i * .02) g = .025;
    else if (t >= f + .1 + i * .02 && t < f + .2) g = Math.min(g, .55 + .45 * seg(t, f + .1, f + .2));
  });
  if (t > T.flick[2] + .2 && t < T.flick[2] + .9) g *= .9 + .1 * seg(t, T.flick[2] + .2, T.flick[2] + .9);
  return g;
}
function lightExtra(L, t) {
  let k = 1;
  // After the three-hour skip: the light above him is already dead
  if (t > T.tear[0] + .3 && Math.abs(L.x - .1) < .5 && Math.abs(L.z + 17.4) < .7) k = 0;
  // While the bell rings, the far lights down the corridor go out one by one toward her
  if (t > T.bell[0] && Math.abs(L.x - .1) < 3 && L.z < -27 && L.z > -35) { const zc = lerp(-27, -35, seg(t, T.bell[0], T.bell[0] + 2.4)); if (L.z > zc) k *= t < T.tear[0] ? .12 : .4; }
  return k;
}
// Auto exposure: lagging brighten-up after the picture goes dark (AGC)
function darkMem(t) { let s = 0, w = 0; for (let k = 0; k < 40; k++) { const d = k * .03, e = Math.exp(-d / .45); s += (1 - gLight(t - d)) * e; w += e; } return s / w; }

// —— Handheld camera ——
const nz = (t, f, s) => vnoise(t * f + s * 17.3) - .5;
function camPose(t) {
  const [x, z] = POS(t); let yaw = YAW(t), pitch = PITCH(t), roll = 0;
  const sp = speedAt(t), amp = clamp(sp / 1.25), ph = distAt(t) / STRIDE * Math.PI, fear = FEAR(t);
  const hold = 1 - .85 * env(t, T.count0 + 2.4, T.count0 + 7.4, .4, .5) - env(t, T.hush[0] - .12, T.hush[1] + .3, .1, .35);
  let y = 1.56 + CAMH(t);
  y += .032 * amp * (Math.abs(Math.sin(ph)) - .6);
  const sway = .018 * amp * Math.sin(ph);
  const br = Math.sin(t * Math.PI * 2 * .27);
  pitch += (nz(t, 1.1, 1) * .016 + nz(t, 3.7, 2) * .005 * (1 + 2 * fear) + nz(t, 9.5, 3) * .0022 * fear + br * .006) * hold;
  yaw += (nz(t, .9, 4) * .018 + nz(t, 3.3, 5) * .005 * (1 + 2 * fear) + .011 * amp * Math.sin(ph)) * hold;
  roll = (nz(t, .6, 6) * .035 + .014 * amp * Math.sin(ph) + nz(t, 7, 7) * .003 * fear) * hold + .012;
  y += br * .006 * hold;
  // While looking down the camera is closer to the body and lower
  const down = clamp(-pitch - .4, 0, 1);
  const rx = Math.cos(yaw), rz = -Math.sin(yaw);
  // Filming the feet: the arm pushes the camera forward a little
  const fx = -Math.sin(yaw), fz = -Math.cos(yaw), reach = down * .22;
  return { x: x + rx * sway * hold + fx * reach, y: y - down * .16, z: z + rz * sway * hold + fz * reach, yaw, pitch, roll, amp, ph, bx: x, bz: z };
}

// —— Picture ——
let lastFrame = -1;
function render(t) {
  const tv = Math.min(t, T.recOff + .02);           // the battery dies: the picture freezes
  const cp = camPose(tv);
  camera.position.set(cp.x, cp.y, cp.z); camera.rotation.set(cp.pitch, cp.yaw, cp.roll);
  const hf = FOV(tv) * Math.PI / 180; camera.fov = 2 * Math.atan(Math.tan(hf / 2) / (4 / 3)) * 180 / Math.PI; camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
  legs.pose({ x: cp.bx, z: cp.bz, yaw: cp.yaw - (cp.yaw - YAW(tv)), phase: cp.ph, amp: cp.amp, stance: .02 });
  // The Thing
  thing.visible = tv >= T.figOn[0] && tv < T.figOn[1] + .15;
  if (thing.visible) { thing.pose(Math.sin(tv * Math.PI * 2 / 4.2), .2 + .14 * ss(seg(tv, T.figOn[0], T.afFig[1]))); thing.rotation.y = Math.atan2(cp.x - thing.position.x, cp.z - thing.position.z); }
  // Door opens by itself
  props.door.rotation.y = -1.25 * ss(seg(tv, T.door[0], T.door[1])) - .02 * ss(seg(tv, T.door[0] - .4, T.door[0]));
  // Lights
  const g = gLight(tv);
  updateLights(tv, g, lightExtra);
  U.uExitI.value = .42 * (0.96 + .04 * Math.sin(tv * 90)) * (g > .5 ? 1 : .6);
  U.uFogG.value = .35 + .65 * g;
  scene.background.copy(U.uFogCol.value).multiplyScalar(U.uFogG.value * .15);   // far end: dark, not a bright block of fog
  world.trofMat.uniforms.uEmit.value = 5.0;
  // Focus / depth of field
  post.dof.focus = FOCUS(tv); post.dof.aper = APER(tv);
  // VHS parameters
  const u = vhs.uniforms, dm = darkMem(tv);
  const f = Math.floor(t * 30);   // the tape runs at 30 frames/second: noise steps at 30 fps
  u.frame.value = f;
  const awb = ss(seg(t, T.rollIn, T.rollIn + 1.8));
  const exitAWB = ss(seg(tv, T.turn[0], T.turn[1] + 1.5));
  u.tint.value = [lerp(.78, 1.0, awb) * (1 - .025 * exitAWB), lerp(.92, 1.0, awb), lerp(1.45, .95, awb) * (1 + .04 * Math.sin(t * .31)) * (1 + .05 * exitAWB)];
  u.expo.value = (1 + .45 * dm) * (0.97 + .03 * Math.sin(t * .47));
  const zoomed = seg(FOV(tv), 52, 20);
  u.gain.value = .032 + .08 * dm + .02 * zoomed + .01 * FEAR(tv);
  let track = 0, roll = 0;
  if (t < T.rollIn + .5) { const k = 1 - seg(t, T.rollIn, T.rollIn + .5); track = k; roll = k * k * .4; }
  track = Math.max(track, env(t, T.tear[0], T.tear[1], .08, .25));
  if (t > T.tear[0] && t < T.tear[1]) roll = (hash(Math.floor(t * 30) * .7) - .5) * .12 * (1 - seg(t, T.tear[1] - .2, T.tear[1]));
  if (t > T.recOff) { track = Math.max(track, seg(t, T.recOff, T.recOff + .15)); }
  u.track.value = track; u.roll.value = roll;
  u.off.value = t < T.rollIn ? 1 : t > T.recOff + .22 ? 1 : 0;
  // OSD
  const rec = t >= T.rollIn && t < T.recOff;
  drawOSD(osdCv, {
    hide: t < T.rollIn || t > T.recOff + .22, t, rec,
    clock: clock(t), date: 'NOV.20.1998', bat: battery(t), batBlink: battery(t) <= 1,
    title: t >= T.title[0] && t < T.title[1] ? ['NIGHT ROUND', 'BLDG 3'] : null, titleN: Math.floor((t - T.title[0]) * 16),
  });
  osdTex.needsUpdate = true;
  U.uTime.value = t;
  post.composer.render();
  // Overlay layer: subtitles / end card
  ox.clearRect(0, 0, W, H);
  if (!NOSUB) drawCaps(ox, CAPS, t);
  if (t >= T.endCard[0]) endCard(t);
}
function endCard(t) {
  const a = ss(seg(t, T.endCard[0], T.endCard[0] + .6));
  ox.globalAlpha = a; ox.fillStyle = '#000'; ox.fillRect(0, 0, W, H);
  ox.font = "700 120px 'IBM Plex Sans Thai'"; ox.fillStyle = '#ecece4'; ox.textAlign = 'center'; ox.textBaseline = 'middle';
  ox.fillText('เวรดึก อาคาร ๓', W / 2, 440);
  const s2 = 4, l2 = 'NIGHT ROUND  BLDG 3'; osdText(ox, l2, (W - osdW(l2, s2)) / 2, 570, s2, '#b9b39a', false);
  ox.textAlign = 'left'; ox.globalAlpha = 1;
}
// —— Events (sound / lines / captions) → events.json ——
const EV = [];
LINES.forEach(l => EV.push({ t: l.t, type: 'line', id: l.id, who: l.who }));
CHIMES.forEach(c => EV.push({ t: c, type: 'chime' }));
T.flick.forEach(f => EV.push({ t: f - .03, type: 'flick' }));
{ // footsteps on terrazzo
  let last = 0;
  for (let t = 0; t < T.recOff; t += 1 / 120) { const n = Math.floor(distAt(t) / STRIDE); if (n > last) { last = n; EV.push({ t, type: 'step', v: clamp(speedAt(t) / 1.3, .4, 1.1) }); } }
}
EV.push({ t: T.rollIn - .25, type: 'recOn' }, { t: T.recOff, type: 'recOff' });
EV.push({ t: T.bell[0], type: 'bell', d: T.bell[1] - T.bell[0] });
EV.push({ t: T.tear[0], type: 'tear', d: T.tear[1] - T.tear[0] }, { t: T.hush[0], type: 'hush', d: T.hush[1] - T.hush[0] });
EV.push({ t: T.zoom[0], type: 'zoom', d: T.zoom[1] - T.zoom[0] }, { t: T.unzoom[0], type: 'zoom', d: T.unzoom[1] - T.unzoom[0] });
EV.push({ t: T.door[0], type: 'door', d: T.door[1] - T.door[0] });
EV.push({ t: T.batDie[0], type: 'batlow', d: T.batDie[1] - T.batDie[0] });
for (const a of [0.8, 3.1, 17.9, 25.6, 27.0, 27.8, 29.05, 49.8]) EV.push({ t: a, type: 'af' });
EV.push({ t: T.endCard[0], type: 'end' });
for (const [t, v] of [[2.0, .6], [8.6, .7], [14.2, .5], [16.0, .5], [17.4, .6], [19.2, .5], [37.4, .5], [38.8, .8], [43.6, .5], [49.2, .6], [52.8, .9]]) EV.push({ t, type: 'rustle', v });
CAPS.forEach(c => EV.push({ t: c.t0, type: 'cap', t1: c.t1, text: c.text }));
EV.sort((a, b) => a.t - b.t);

window.DUR = DUR; window.EV = EV; window.render = render; window.CAPS = CAPS;
window.dbg = { camera, scene, post, vhs, U, thing, props, camPose };
render(0);
window.READY = true;
