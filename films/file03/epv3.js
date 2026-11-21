// FILE 03 · ตอนที่ ๑, round 3 (?ep=v3): the "middle way" — characters still speak for themselves, but with the visual
// language of the reference clips (refs/guide_sheet.jpg): a running HUD, an episode title card, a "rules of the building"
// card that grows, key lines highlighted in gold, layered fog, the action library on every character, slow holds trimmed.
import epv2 from './epv2.js';
export default (api) => {
  const { g, W, H, TH, seg, ease, lerp, hash, black } = api;
  const V = epv2(api);
  // V: 0 title · 1 OPEN · 2 shop day · 3 night VCR · 4 GATE · 5 lobby · 6 STAIRS · 7 PAUSE · 8 LAB · 9 pause wet paper · 10 ENH · 11 DING · 12 LIFT · 13 THING
  //    14 REFL · 15 MSG · 16 morning · 17–19 tape 1 · 20 TL · 21 deduce · 22 LEAVE · 23 CAR · 24 ARRIVE · 25 market · 26 OAT · 27 vanished · 28 NIGHT · 29 end

  // ---------- helpers ----------
  const with_ = (sc, add) => ({ ...sc, ...add });
  const keyLines = (sc, ids) => ({ ...sc, lines: (sc.lines || []).map(l => ids.includes(l[0]) ? [l[0], l[1], l[2], l[3], l[4], true] : l) });
  // cut slow holds out of a scene: the scene's own time skips the cut ranges; lines, events and acts inside them are dropped
  const trim = (sc, cuts) => {
    const cut = cuts.reduce((a, [x, y]) => a + (y - x), 0);
    const toOld = n => { let o = n; for (const [x, y] of cuts) if (o >= x) o += y - x; return o; };
    const toNew = o => { let n = o; for (const [x, y] of cuts) { if (o >= y) n -= y - x; else if (o > x) return null; } return n; };
    const mapList = (L, i) => (L || []).map(r => { const nt = toNew(r[i]); if (nt == null) return null; const c = [...r]; c[i] = nt; return c; }).filter(Boolean);
    return { ...sc, d: sc.d - cut, lines: mapList(sc.lines, 2), ev: mapList(sc.ev, 0), acts: mapList(sc.acts, 2), draw: (lt, t) => sc.draw(toOld(lt), t) };
  };
  // the rules of the building: a lined card (as in the references) that gains a rule each time one is spoken
  const RULES = ['ห้ามขึ้นชั้นสี่', 'อย่าเหยียบพื้นที่เปียก', 'อย่าให้ไฟชั้นสี่ดับ ตอนตีสองห้าสิบเก้า'];
  const rulesCard = (lt, a, b, n) => {
    const k = ease(seg(lt, a, a + .5)) * (1 - ease(seg(lt, b - .5, b))); if (k <= 0) return;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = k;
    const x = 1240, y = 90 + (1 - k) * 20, w = 600, h = 96 + n * 64;
    g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 26; g.shadowOffsetY = 8; g.fillStyle = '#f4efe2'; g.beginPath(); g.roundRect(x, y, w, h, 8); g.fill(); g.shadowColor = 'transparent';
    g.fillStyle = '#5a5a62'; g.font = `600 22px ${TH}`; g.fillText('กฎของตึกวิชัยแล็บ', x + 30, y + 40);
    for (let i = 0; i < n; i++) {
      const yy = y + 96 + i * 64, fresh = i === n - 1, a2 = fresh ? ease(seg(lt, a + .5, a + 1.1)) : 1;
      g.globalAlpha = k * a2; g.fillStyle = '#1e1e24'; g.beginPath(); g.arc(x + 44, yy - 10, 16, 0, 7); g.fill(); g.fillStyle = '#fff'; g.font = `700 20px ${TH}`; g.textAlign = 'center'; g.fillText(String(i + 1), x + 44, yy - 3); g.textAlign = 'left';
      g.fillStyle = '#1f2a5a'; g.font = `600 32px ${TH}`; g.fillText(RULES[i], x + 74, yy);
      if (fresh) { g.fillStyle = '#d8323a'; g.fillRect(x + 74, yy + 12, Math.min(1, seg(lt, a + .8, a + 1.6)) * g.measureText(RULES[i]).width, 4); }
    }
    g.restore();
  };
  const overlayAfter = (sc, fn) => ({ ...sc, overlay: (lt, t) => { sc.overlay && sc.overlay(lt, t); fn(lt, t); } });

  // ---------- 0 · the episode title card (chip, a white line, a gold line, as in the references) ----------
  const TITLE = { d: 8, ev: [[0, 'end']], look: false,
    draw(lt, t) {
      const gr = g.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * .7); gr.addColorStop(0, '#2a3036'); gr.addColorStop(1, '#0c0e12'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 14; i++) { const x = ((hash(i) * W * 1.5 + t * (10 + hash(i + 2) * 14)) % (W * 1.5)) - W * .25, y = H * .3 + hash(i + 4) * H * .5, r = 300 + hash(i + 1) * 300; const fg = g.createRadialGradient(x, y, 0, x, y, r); fg.addColorStop(0, 'rgba(200,210,215,.07)'); fg.addColorStop(1, 'rgba(200,210,215,0)'); g.fillStyle = fg; g.fillRect(x - r, y - r, r * 2, r * 2); }
      const k = ease(seg(lt, .4, 1.4)); g.save(); g.globalAlpha = k; g.textAlign = 'center';
      g.font = `600 24px ${TH}`; const chip = 'FILE 03 · ตอนที่ ๑ · ม้วนที่ ๓', cw = g.measureText(chip).width + 60; g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.roundRect(W / 2 - cw / 2, 330, cw, 44, 22); g.fill(); g.fillStyle = '#e8463c'; g.beginPath(); g.arc(W / 2 - cw / 2 + 24, 352, 6, 0, 7); g.fill(); g.fillStyle = '#d8d8d4'; g.fillText(chip, W / 2 + 10, 361);
      g.font = `700 92px ${TH}`; g.fillStyle = '#f2f2ec'; g.fillText('เทปจากชั้นสี่', W / 2, 500);
      g.globalAlpha = k * ease(seg(lt, 1, 2)); g.font = `700 104px ${TH}`; g.fillStyle = '#f2b04a'; g.fillText('ตึกวิชัยแล็บ', W / 2, 630);
      g.globalAlpha = k * ease(seg(lt, 1.8, 2.6)); g.font = `500 32px ${TH}`; g.fillStyle = '#a8aab0'; g.fillText('ตอน ไฟล์ศูนย์สาม', W / 2, 760);
      g.restore(); black(1 - seg(lt, 0, .4)); black(seg(lt, 7.3, 8));
    } };

  // ---------- the HUD on every present-day scene (clock · place · something that matters) ----------
  const HUD = {
    1: { h: 10, m: 30, fields: ['ร้านซ่อมเทปของเบียร์', '๒๐ พ.ย. ๒๕๖๙'] },
    2: { h: 14, m: 0, fields: ['ร้านเบียร์', 'เทป ๕ ม้วน'] },
    3: { h: 23, m: 38, speed: 15, fields: ['ร้านเบียร์', 'ม้วนที่ ๓'] },
    7: { h: 0, m: 6, fields: ['ร้านเบียร์', 'เวลาที่หายไป ๒๗ นาที'], warn: 2 },
    9: { h: 0, m: 21, fields: ['ร้านเบียร์', 'ม้วนที่ ๓'] },
    10: { h: 0, m: 24, fields: ['ร้านเบียร์', 'ขยายภาพ'] },
    14: { h: 0, m: 49, fields: ['ร้านเบียร์', 'ม้วนที่ ๑ ?'], warn: 2 },
    15: { h: 2, m: 55, speed: 5, fields: ['ร้านเบียร์', 'โทรหาคุณนิด'] },
    16: { h: 8, m: 12, fields: ['ร้านเบียร์', 'สายที่ไม่ได้รับ ๕'] },
    20: { h: 9, m: 2, fields: ['ร้านเบียร์', 'ไทม์ไลน์'] },
    21: { h: 9, m: 4, fields: ['ร้านเบียร์', 'ช่างโอ๊ต ?'] },
    22: { h: 9, m: 18, fields: ['หน้าร้านเบียร์'] },
    23: { h: 9, m: 20, fields: ['ในรถคุณนิด', 'ไปตลาดเก่า'] },
    24: { h: 9, m: 44, fields: ['ตลาดเก่า'] },
    25: { h: 9, m: 45, fields: ['ตลาดเก่า', 'หาร้านป้ายแดง'] },
    26: { h: 9, m: 52, fields: ['ร้านโอ๊ตการไฟฟ้า'] },
    27: { h: 10, m: 4, fields: ['ร้านโอ๊ตการไฟฟ้า'] },
    28: { h: 1, m: 9, fields: ['ร้านเบียร์', '๒๑ พ.ย. ๒๕๖๙'] },
  };

  // ---------- actions from the library, per scene: [who, action, at, duration?, {noProp}] ----------
  const NP = { noProp: true };
  const ACTS = {
    1: [['aunt', 'handOver', 9.0, 2.2, NP], ['beer', 'receive', 9.6, 2.2, NP], ['beer', 'inspect', 12.4, 6, NP], ['aunt', 'laugh', 18.2, 1.8], ['beer', 'nodLong', 22.6], ['beer', 'chin', 33, 14]],
    2: [['beer', 'chin', 26.2, 10], ['nid', 'crossArms', 47.2, 7], ['beer', 'nodLong', 56.6]],
    4: [['mind', 'tearPoster', 8.4, 2, NP]],
    5: [['chai', 'hips', 0.4, 12]],
    7: [['beer', 'pressButton', 0, 1.2], ['beer', 'chin', 2, 8], ['beer', 'scratchHead', 11, 2.4], ['beer', 'pressButton', 16.2, 1.4]],
    8: [['mind', 'torchSweep', 42, 3.2, NP], ['mind', 'pickFloor', 57.2, 2.8, NP], ['mind', 'recoil', 77.8, 1.8, NP], ['mind', 'torchShake', 79.8, 10, NP]],
    9: [['beer', 'leanScreen', 1, 8]],
    14: [['beer', 'startle', 33.1, 1.4], ['beer', 'rattle', 38.2, 2.2], ['beer', 'reachPick', 44.8, 2.2, NP], ['beer', 'coverTowel', 64.2, 2.2]],
    15: [['beer', 'phoneEar', 0.6, 3.6]],
    16: [['beer', 'startle', 8.1, 1.4], ['nid', 'coverMouth', 30.6, 3.6], ['nid', 'crossArms', 34.6, 10], ['beer', 'inspect', 40.2, 4.6, NP], ['nid', 'nodLong', 65.4]],
    20: [['beer', 'lookAround', 26.4, 2.8]],
    21: [['nid', 'crossArms', 1, 8], ['beer', 'nodLong', 16.4]],
    22: [['beer', 'unlockKey', 13.2, 2.6]],
    26: [['oatOld', 'hips', 3.4, 7], ['oatOld', 'headShake', 29.2, 1.8], ['nid', 'crossArms', 23.6, 5.4], ['beer', 'chin', 50.6, 6]],
    27: [['beer', 'chin', 7.6, 5]],
    28: [['beer', 'phoneEar', 9.4, 12]],
  };

  // ---------- key lines (gold, on a dark band) ----------
  const KEYS = ['b1', 'p1', 's1', 'm12', 'd1slow', 'e2', 'e3', 'r6', 'r7', 'w6', 'cr3', 'cr6', 'o3', 'nc2', 'b20', 'p1b'];

  const S = V.map((sc, i) => {
    let s = keyLines(sc, KEYS);
    if (HUD[i]) s = with_(s, { hud: HUD[i] });
    if (ACTS[i]) s = with_(s, { acts: [...(s.acts || []), ...ACTS[i]] });
    return s;
  });
  S[0] = TITLE;
  // fog in the building (as in the references' layered haze)
  for (const i of [4, 5, 8, 11, 12]) S[i] = with_(S[i], { look: { ...(S[i].look || {}), atmo: [...((S[i].look || {}).atmo || []), ['fog', { a: .1, y: .6 }]] } });
  S[25] = with_(S[25], { look: { ...(S[25].look || {}), atmo: [...((S[25].look || {}).atmo || []), ['fog', { a: .06, y: .5, col: '255,236,210' }]] } });
  // the rules card grows: ① in the lobby, ② when Pa Daeng warns, ③ when Dr. Wichai warns
  S[5] = overlayAfter(S[5], lt => rulesCard(lt, 2.6, 9.6, 1));
  S[8] = overlayAfter(S[8], lt => rulesCard(lt, 50, 57, 2));
  S[19] = overlayAfter(S[19], lt => rulesCard(lt, 8.6, 15.6, 3));
  // trim the slow holds (middle way: shorter, nothing that matters removed)
  S[1] = trim(S[1], [[46.5, 54.5]]);
  S[10] = trim(S[10], [[6.8, 11.4], [33.6, 38.6]]);
  S[14] = trim(S[14], [[27.6, 29.6], [66.8, 69.2]]);
  S[6] = trim(S[6], [[16.6, 21]]);
  S[25] = trim(S[25], [[24.4, 28.2]]);
  S[15] = trim(S[15], [[24, 30]]);
  S[8] = trim(S[8], [[92, 98.6]]);
  S[22] = trim(S[22], [[34, 42]]);
  S[23] = trim(S[23], [[4.5, 10.5], [58.6, 64.4]]);
  return S;
};
