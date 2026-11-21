"""FILE 03 · ตอนที่ ๑: voices (one Thai TTS voice, pitched per character), room tones, tape hiss and code-made sound
effects, all placed from events.json (the page's own timeline) → mix.wav."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.abspath(os.path.join(HERE, '../..')))
import numpy as np, soundfile as sf, librosa
from scipy.ndimage import uniform_filter1d
from core.audio.sfx import SR, bp, lp, hp, add, limit, compress
from core.audio import sampler as S
rng = np.random.default_rng(3)
E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; EV = E['ev']; N = int(DUR * SR)
tt = np.arange(N) / SR
mix = np.zeros((N, 2)); sec = lambda d: int(round(d * SR)); nz = lambda n: rng.standard_normal(n)
def put(x, t, g=1., pan=0.):
    x = np.asarray(x, np.float64)
    if x.ndim == 2:
        i = sec(t); j = min(N, i + len(x));
        if j > i: mix[i:j] += x[:j - i] * g
    else: add(mix, x, t, g, pan)
def env(n, a, r): e = np.ones(n); na = min(n, sec(a)); e[:na] = np.linspace(0, 1, na); nr = min(n, sec(r)); e[n - nr:] *= np.linspace(1, 0, nr); return e
ev = lambda ty: [e for e in EV if e['type'] == ty]
one = lambda ty: ev(ty)[0]['t']

# ---- scene sections: (start, end, kind)
TAPE0, TAPE1 = 42, 118
inT = (tt >= TAPE0) & (tt < TAPE1)
# ---- voices
PITCH = {'beer': -1.5, 'ton': -2.5, 'chai': -5, 'oat': -3, 'wichai': -4, 'mind': 1.5, 'nid': 1, 'daeng': -.5, 'fon': 4}
for e in ev('line'):
    y, sr = sf.read(os.path.join(HERE, 'voices', e['id'] + '.wav')); y = librosa.resample(y, orig_sr=sr, target_sr=SR)
    y = librosa.effects.pitch_shift(y, sr=SR, n_steps=PITCH.get(e['who'], 0))
    y = compress(y / (np.abs(y).max() + 1e-9), .3, 3.0)
    if TAPE0 <= e['t'] < TAPE1:   # recorded on a 1997 camcorder: thin and a little distorted
        y = np.tanh(2.0 * bp(y, 250, 3800, 2)) * .9
        y = S.room(np.stack([y, y], 1).astype(np.float32), size=.5 if e['who'] != 'daeng' else .7, mix=.35, damp=.5)
        put(y, e['t'], .55)
    else: put(y, e['t'], .6, -.05 if e['who'] == 'beer' else .1)
# ---- beds
hiss = hp(nz(N), 3000) * .012 * inT
hum = (np.sin(2 * np.pi * 50 * tt) * .5 + np.sin(2 * np.pi * 100 * tt) * .25) * .02 * ((tt > 42) & (tt < 118))
shop_day = lp(nz(N), 500) * .02 * ((tt > 6) & (tt < 34))   # street murmur through the window
night = bp(nz(N), 2000, 6000) * .004 * ((tt > 34) & (tt < 42) | (tt > 118) & (tt < 150))
crick = np.sin(2 * np.pi * 4300 * tt) * ((tt * 1.1) % 1 < .12) * .008 * ((tt > 42) & (tt < 54))
drone_env = np.clip((tt - 96) / 18, 0, 1) * (tt < 114) + np.clip((tt - 131) / 6, 0, 1) * (tt < 141)
w = np.cumsum(nz(N)); w = hp(w - uniform_filter1d(w, SR), 20); drone = (lp(w, 80) / (np.abs(lp(w, 80)).max() + 1e-9) + np.sin(2 * np.pi * 41 * tt) * .6 + np.sin(2 * np.pi * 43.7 * tt) * .5) * .07 * drone_env
for b in (hiss, hum, shop_day, night, crick, drone): mix += np.stack([b, np.roll(b, 31)], 1)
# ---- music: a slow, sparse synth for the title and the end card
def pad(t0, d, notes, g):
    n = sec(d); t = np.arange(n) / SR; x = sum(np.sin(2 * np.pi * 440 * 2 ** ((p - 69) / 12) * t) * (1 + .3 * np.sin(2 * np.pi * .3 * t)) for p in notes) / len(notes)
    put(S.room(np.stack([x, x], 1).astype(np.float32) * env(n, 1.5, 2.5)[:, None], size=.8, mix=.6), t0, g)
pad(0, 6, [45, 52, 57, 60], .12); pad(150, 8, [45, 52, 56, 59], .12)
# ---- effects
def click(k=.012): n = sec(k); return hp(nz(n), 2500) * np.exp(-np.arange(n) / SR / .002)
def thump(f=60, d=.4): n = sec(d); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / .1) + lp(nz(n), 400) * np.exp(-t / .03)
def motor(d, f0, f1): n = sec(d); f = np.linspace(f0, f1, n); p = 2 * np.pi * np.cumsum(f) / SR; return (np.sin(p) + .4 * np.sin(2 * p)) * env(n, .05, d * .5) * .3
def ding(f=1320, d=1.6): n = sec(d); t = np.arange(n) / SR; return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t / .5)
for i in range(7): put(click(.02) * .8, 1.0 + i * .2, .25)                       # the title types itself
put(thump(90, .3) * .6, one('door'), .25)                                            # shop door
put(np.concatenate([click(), np.zeros(sec(.15)), thump(120, .2)]), one('insert'), .5); put(motor(1.8, 80, 260), one('insert') + .3, .3)
put(motor(1.2, 260, 300), one('vcr'), .25)
put(bp(nz(sec(.6)), 300, 6000) * env(sec(.6), .01, .3), one('tapein'), .3)            # tape starts
put(ding(1320) * .6 + ding(1047) * .4, one('ding'), .3)
n = sec(1.6); put(bp(nz(n), 200, 1500) * env(n, .2, .4) * .4 + motor(1.6, 60, 70) * .5, one('liftdoor'), .3)
for k in range(10): put(bp(np.sign(np.sin(2 * np.pi * 100 * np.arange(sec(.08)) / SR)), 1500, 4000), one('flicker') + k * .18, .12)
put(thump(45, 1.0), one('blackout'), .5)
put(click(.03), one('torch'), .6)
n = sec(4.4); put(bp(nz(n), 200, 7000) * .5 * env(n, .02, .1), one('tear'), .5)        # tape tear
put(motor(.6, 300, 40), one('tapeout'), .3)
put(np.sin(2 * np.pi * 2000 * np.arange(sec(1.0)) / SR) * env(sec(1.0), .3, .3) * .1, one('zoom'), .3)
for t0 in (one('sting'), one('sting2')):   # soft stings: a low boom with a rising reverse swell
    n = sec(1.4); r = bp(nz(n), 300, 5000) * np.linspace(0, 1, n) ** 3; put(r, t0 - 1.4, .25); put(thump(38, 1.6), t0, .7)
for k in range(10): put(bp(np.sign(np.sin(2 * np.pi * 100 * np.arange(sec(.06)) / SR)), 1500, 4000), one('flicker2') + k * .5 + rng.random() * .2, .1)
for k in range(9): n = sec(.5); put(bp(nz(n), 400, 2500) * np.sin(np.linspace(0, np.pi, n)) ** 2 * .6, one('mop') + k * .62, .14, .5)   # the mop, behind him
put(click(.02) * 2, one('stop'), .5); put(thump(200, .1) * .3, one('stop'), .5)
put(thump(70, .3), one('thud'), .4)
for e in ev('step'):
    n = sec(.25); t = np.arange(n) / SR; put((hp(nz(n), 1000) * np.exp(-t / .01) + np.sin(2 * np.pi * 150 * t) * np.exp(-t / .03)) * e['v'], e['t'], .12, rng.uniform(-.2, .2))
for c in range(2): mix[:, c] = limit(mix[:, c], .95)
sf.write(os.path.join(HERE, 'mix.wav'), mix.astype(np.float32), SR)
print('mix peak %.2f' % np.abs(mix).max())
