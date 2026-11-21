// "แสนล้าน" · model and pose sheets for approval (?ep=sanlan): 1) ปั้น at four ages, 2) the cast, 3) new poses.
import { CAST } from './chars2.js';
import './cast_sanlan.js';
import { act, ACTIONS } from './actions.js';
export default (api) => {
  const { g, W, H, TH, person, seg } = api;
  const bg = (a, b) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(0, 880, W, 200); };
  const title = (s, sub) => { g.font = `700 46px ${TH}`; g.fillStyle = '#1e2430'; g.fillText(s, 70, 90); g.font = `500 26px ${TH}`; g.fillStyle = '#5a606a'; g.fillText(sub, 70, 132); };
  const label = (x, y, a, b) => { g.textAlign = 'center'; g.font = `700 28px ${TH}`; g.fillStyle = '#1e2430'; g.fillText(a, x, y); g.font = `500 21px ${TH}`; g.fillStyle = '#5a606a'; g.fillText(b, x, y + 30); g.textAlign = 'left'; };
  const ages = [['pan8', 380], ['pan15', 440], ['pan22', 470], ['pan30', 480]];
  return [
    { d: 4, look: false, draw(lt, t) {   // ปั้น grows up: 3/4, front and back for each age
      bg('#eef0ee', '#d8dcd8'); title('ปั้น · ตัวเอก ๔ ช่วงวัย', 'มุมเฉียง · หน้าตรง · หลัง');
      ages.forEach(([id, h], i) => { const x = 250 + i * 460, C = CAST[id];
        person(g, id, x - 110, 900, h, { t, look: .3 }); person(g, id, x, 900, h, { t, view: 'front' }); person(g, id, x + 110, 900, h, { t, view: 'back' });
        label(x, 960, C.name, C.role); g.font = `italic 500 20px ${TH}`; g.fillStyle = '#7a6a4a'; g.textAlign = 'center'; g.fillText(`"${C.quote}"`, x, 1022); g.textAlign = 'left'; });
    } },
    { d: 4, look: false, draw(lt, t) {   // the cast
      bg('#efeee8', '#dcd8cc'); title('ตัวละครรอบตัวปั้น', 'ครอบครัว · คนที่หลอก · ครู · คนฉลาด');
      [['mae', 470], ['yai', 420], ['o', 480], ['kim', 450], ['nun', 430], ['thana', 485]].forEach(([id, h], i) => { const x = 190 + i * 308, C = CAST[id];
        person(g, id, x, 860, h, { t, view: 'front' }); label(x, 920, C.name, C.role); g.font = `italic 500 18px ${TH}`; g.fillStyle = '#7a6a4a'; g.textAlign = 'center'; g.fillText(`"${C.quote}"`, x, 980); g.textAlign = 'left'; });
    } },
    { d: 4, look: false, draw(lt, t) {   // new poses (the action library, mid-action)
      bg('#eceee8', '#d4d8d0'); title('ท่าทางใหม่', 'จากคลังท่าทาง (ทุกท่าเคลื่อนไหวได้ เตรียม → ทำ → ค้าง → คืน)');
      const list = [['pan8', 380, 'countMoney', .5], ['pan8', 380, 'carrySack', .6], ['pan15', 440, 'readBook', .5], ['pan15', 440, 'headInHands', .5], ['pan22', 470, 'scrolledPhone', .5],
        ['pan22', 470, 'dustOff', .55], ['pan22', 470, 'fistPump', .55], ['pan30', 480, 'handshake', .5], ['pan30', 480, 'chin', .5], ['pan30', 480, 'point', .5]];
      list.forEach(([id, h, a, u], i) => { const x = 170 + (i % 5) * 395, y = i < 5 ? 500 : 1010; person(g, id, x, y, h * .8, act(a, u, { t, look: .3 })); g.textAlign = 'center'; g.font = `700 26px ${TH}`; g.fillStyle = '#1e2430'; g.fillText(ACTIONS[a].th, x, y + 40); g.textAlign = 'left'; });
    } },
  ];
};
