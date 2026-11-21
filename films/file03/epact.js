// The action library on show (?ep=act): ten actions a page, every one prepare → do → hold → return.
import { ACTIONS, ACTION_NAMES, act } from './actions.js';
export default (api) => {
  const { g, W, H, TH, person, shop, dof, seg, black } = api;
  const cast = ['beer', 'nid', 'mind', 'ton', 'oat', 'chai', 'daeng', 'oatOld', 'wichai', 'beer'];
  const pages = [];
  for (let p = 0; p < ACTION_NAMES.length; p += 10) pages.push(ACTION_NAMES.slice(p, p + 10));
  return pages.map((names, pi) => ({ d: 6, look: { tone: 'warm', v: .4 },
    draw(lt, t) {
      shop(g, t, false, {}); dof(16, .5);
      g.font = `700 40px ${TH}`; g.fillStyle = '#fff'; g.fillText(`คลังท่าทาง · หน้า ${pi + 1}/${pages.length}`, 60, 70);
      names.forEach((n, i) => {
        const x = 190 + (i % 5) * 385, y = i < 5 ? 500 : 1000, A = ACTIONS[n], u = seg(lt, .6, .6 + A.dur);
        const id = cast[i % cast.length], pose = act(n, u, { t, look: .3 });
        person(g, id, x, y, 380, pose);
        g.font = `600 30px ${TH}`; g.textAlign = 'center'; g.fillStyle = '#fff'; g.fillText(`${pi * 10 + i + 1}. ${A.th}`, x, y + 44); g.textAlign = 'left';
      });
      black(1 - seg(lt, 0, .3)); black(seg(lt, 5.7, 6));
    } }));
};
