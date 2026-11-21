// Pose sheet (?ep=poses): the new everyday stances on the cast, 3/4 and front.
export default (api) => {
  const { g, W, H, TH, person, P, shop, dof, grade } = api;
  const label = (x, y, s) => { g.font = `600 28px ${TH}`; g.fillStyle = '#fff'; g.textAlign = 'center'; g.fillText(s, x, y); g.textAlign = 'left'; };
  const row = (t, list, y, view) => list.forEach(([id, arms, name, expr], i) => { const x = 140 + i * 235; person(g, id, x, y, 420, { t, arms, view, expr, look: .3 }); label(x, y + 40, name); });
  return [{ d: 4, look: false, draw(lt, t) {
    shop(g, t, false, {}); dof(14, .45);
    row(t, [['beer', 'down', 'ยืนปกติ'], ['beer', 'chin', 'จับคาง', 'worried'], ['nid', 'cross', 'กอดอก'], ['oat', 'hip', 'เท้าเอว'], ['chai', 'hips', 'เท้าสะเอว'], ['mind', 'strap', 'จับสายกระเป๋า'], ['ton', 'pocket', 'ล้วงกระเป๋า'], ['daeng', 'wave', 'โบกมือ', 'smile']], 500);
    row(t, [['beer', 'down', 'ยืนปกติ'], ['beer', 'chin', 'จับคาง', 'worried'], ['nid', 'cross', 'กอดอก'], ['oat', 'hip', 'เท้าเอว'], ['chai', 'hips', 'เท้าสะเอว'], ['mind', 'strap', 'จับสายกระเป๋า'], ['ton', 'pocket', 'ล้วงกระเป๋า'], ['daeng', 'wave', 'โบกมือ', 'smile']], 1000, 'front');
  } }];
};
