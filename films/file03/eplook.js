// Look test (?ep=look): six shots in the visual language of the reference videos, for approval before the full rework.
export default (api) => {
  const { g, W, H, TH, person, P, K, cam, camK, pov, black, dof, fgBlur, grade, card, badge, handsTape, handsPhone, seg, ease, lerp,
    shop, building2026, corridor, phoneScreen, darkTorch } = api;
  const desk = () => { g.fillStyle = '#6a4e36'; g.fillRect(0, 760, W, 320); g.fillStyle = '#5a3e2a'; g.fillRect(0, 760, W, 18); };
  return [
    // 1. an establishing shot: a slow push on the sealed building, a time/place badge
    { d: 6, draw(lt, t) { cam(960, 520, lerp(1.02, 1.12, lt / 6), () => building2026(g, t)); grade('day', .5); badge(lt, .4, 5.8, '๒๐ พ.ย. ๒๕๖๙ · ๑๔:๐๕ น. · อาคารวิชัยแล็บ'); black(1 - seg(lt, 0, .5)); } },
    // 2. a bust close-up of Nid, the shop soft behind her, an info card
    { d: 6, lines: [['L1', 'nid', .6, 'เทปห้าม้วนจากตึกวิชัยแล็บค่ะ', 'Five tapes from the Wichai Lab building.']],
      draw(lt, t) { cam(960, 540, 1.25, () => shop(g, t, false, { clock: 14 })); dof(14, .05);
        cam(960, 540, lerp(1, 1.04, lt / 6), () => person(g, 'nid', 820, 2900, 2700, P('nid', t, { view: 'front', close: true, look: .3 })));
        grade('warm', .5); card(lt, 2.2, 5.8, { chip: 'ข้อมูลเทป', th: 'เทป ๕ ม้วน\nม้วน ๐๑ หายไปพร้อม ดร.วิชัย', en: 'Five tapes · Tape 01 vanished with Dr. Wichai', size: 40 }); } },
    // 3. over the shoulder: Beer's shoulder big and soft in front, Nid in focus beyond
    { d: 6, lines: [['L2', 'beer', .8, 'กล่องเปียก แต่ม้วนที่สามแห้งสนิท', 'The box is wet, but tape three is bone dry.']],
      draw(lt, t) { cam(1000, 560, 1.5, () => shop(g, t, false, { clock: 14 })); dof(9);
        cam(960, 540, lerp(1.0, 1.05, lt / 6), () => { person(g, 'nid', 1180, 1500, 1350, P('nid', t, { flip: true, close: true, look: .5, expr: 'worried' })); fgBlur(16, () => person(g, 'beer', 380, 2700, 2900, P('beer', t, { view: 'back' }))); });
        grade('warm', .5); } },
    // 4. an insert: Beer's hands bring tape three up to the lens
    { d: 6, draw(lt, t) { cam(960, 540, 1.4, () => { shop(g, t, true, {}); desk(); }); dof(18, .15); handsTape(g, t, { label: '03', s: lerp(.92, 1.02, ease(lt / 6)) }); grade('night', .55); } },
    // 5. 1997 tape: Mind in close-up in the dark corridor, lit by her torch
    { d: 6, tape: true, osd: 'AM 2:31', date: 'NOV.20.1997', lines: [['L3', 'mind', 1.2, 'ต้น... ได้ยินไหม', 'Ton... did you hear that?']],
      draw(lt, t) { pov(t, 960, 540, 1.3, () => corridor(g, t, .55, { wet: true }), .6); dof(12, .2);
        pov(t, 960, 540, 1, () => person(g, 'mind', 900, 2850, 2700, P('mind', t, { close: true, look: .9, expr: 'scared' })), .6);
        darkTorch(1100, 420, 900, .9); } },
    // 6. night: Beer at his desk, the phone in his hands (Nid's number)
    { d: 6, draw(lt, t) { g.fillStyle = '#1a1e26'; g.fillRect(0, 0, W, H); cam(960, 540, 1.3, () => { shop(g, t, true, {}); desk(); }); dof(20, .25);
        handsPhone(g, t, () => phoneScreen(g, { title: 'คุณนิด ช่อง ๗', rows: [{ text: 'ผมเห็นแล้ว' }, { text: 'คนในเทป...', me: true }] }, t), { tap: Math.min(1, lt / 3) });
        grade('tv', .6); black(seg(lt, 5.4, 6)); } },
  ];
};
