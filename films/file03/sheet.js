import { person, CAST } from './chars2.js';
const TH = "'IBM Plex Sans Thai'";
export function sheet(g) {
  const ids = Object.keys(CAST);
  ids.forEach((id, i) => {
    const C = CAST[id], x = (i % 5) * 384, y = Math.floor(i / 5) * 540;
    const gr = g.createLinearGradient(x, y, x, y + 540); gr.addColorStop(0, C.bg[0]); gr.addColorStop(1, C.bg[1]); g.fillStyle = gr; g.fillRect(x, y, 384, 540);
    if (id === 'thing') person(g, id, x + 192, y + 440, 330, { t: 0 });
    else { const h = id === 'fon' ? 270 : 380; person(g, id, x + 150, y + 440, h, { t: 0 }); person(g, id, x + 300, y + 440, h * .62, { t: 0, walk: 1.1 }); }
    g.fillStyle = 'rgba(10,10,12,.85)'; g.fillRect(x, y + 455, 384, 85);
    g.font = `700 34px ${TH}`; g.fillStyle = '#fff'; g.fillText(C.name, x + 14, y + 497); const w = g.measureText(C.name).width;
    g.font = `600 18px ${TH}`; g.fillStyle = '#f2c23a'; g.fillText(C.role, x + 24 + w, y + 495);
    g.font = `400 18px ${TH}`; g.fillStyle = '#ddd'; g.fillText('"' + C.quote + '"', x + 14, y + 526);
    g.font = '600 16px monospace'; g.fillStyle = '#e8463c'; g.fillText(`CAST ${String(i + 1).padStart(2, '0')}/10`, x + 12, y + 24); g.fillStyle = '#ccc'; g.fillText('FILE 03', x + 310, y + 24);
  });
}
