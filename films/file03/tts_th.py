"""Thai voices, offline: Meta MMS-TTS (facebook/mms-tts-tha, VITS, CC-BY-NC 4.0) → voices/<id>.wav + voices/dur.json.
The style (intercom speaker, quiet guard, whisper) is added later in mix.py."""
import os, json, torch, soundfile as sf, numpy as np
from transformers import VitsModel, AutoTokenizer
HERE = os.path.dirname(os.path.abspath(__file__))
LINES = json.load(open(os.path.join(HERE, 'lines.json')))
m = VitsModel.from_pretrained('facebook/mms-tts-tha'); tok = AutoTokenizer.from_pretrained('facebook/mms-tts-tha')
os.makedirs(os.path.join(HERE, 'voices'), exist_ok=True); dur = {}
for L in LINES:
    m.speaking_rate = L.get('speed', 1.0); m.noise_scale = L.get('noise', .667)
    torch.manual_seed(L.get('seed', 1))
    with torch.no_grad(): y = m(**tok(L['text'], return_tensors='pt')).waveform[0].numpy()
    a = np.abs(y) > .02 * np.abs(y).max(); i0, i1 = np.argmax(a), len(a) - np.argmax(a[::-1])   # trim silence
    y = y[max(0, i0 - 400):i1 + 800]
    sf.write(os.path.join(HERE, 'voices', L['id'] + '.wav'), y, m.config.sampling_rate)
    dur[L['id']] = round(len(y) / m.config.sampling_rate, 3); print(L['id'], dur[L['id']])
json.dump(dur, open(os.path.join(HERE, 'voices', 'dur.json'), 'w'), indent=1)
