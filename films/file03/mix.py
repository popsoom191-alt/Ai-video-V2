"""FILE 03 · ตอนที่ ๑ (reworked): voices (one Thai TTS voice, pitched per character; camcorder-processed inside the
1997 tape), room tones, tape hiss, a low drone and code-made sound effects, all placed from events.json → mix.wav."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.abspath(os.path.join(HERE, '../..')))
import numpy as np, soundfile as sf, librosa
from scipy.ndimage import uniform_filter1d
from core.audio.sfx import SR, bp, lp, hp, add, limit, compress
from core.audio import sampler as S
rng = np.random.default_rng(3)
E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; EV = E['ev']; N = int(DUR * SR)
tt = np.arange(N) / SR; mix = np.zeros((N, 2)); sec = lambda d: int(round(d * SR)); nz = lambda n: rng.standard_normal(n)
def put(x, t, g=1., pan=0.):
    x = np.asarray(x, np.float64)
    if x.ndim == 2:
        i = sec(t); j = min(N, i + len(x))
        if j > i and i >= 0: mix[i:j] += x[:j - i] * g
    else: add(mix, x, t, g, pan)
def env(n, a, r): e = np.ones(n); na = min(n, sec(a)); e[:na] = np.linspace(0, 1, na); nr = min(n, sec(r)); e[n - nr:] *= np.linspace(1, 0, nr); return e
ev = lambda ty: [e['t'] for e in EV if e['type'] == ty]
tape = np.zeros(N)
for e in EV:
    if e['type'] == 'tapeScene': tape[sec(e['t']):sec(e['t'] + e['d'])] = 1
inTape = lambda t: tape[min(N - 1, sec(t))] > 0

# ---- voices
PITCH = {'fon': 3}   # ElevenLabs gives each character its own voice; only Fon is lifted to sound like a child
for e in EV:
    if e['type'] != 'line': continue
    y, sr = sf.read(os.path.join(HERE, 'voices', e['id'] + '.wav')); y = librosa.resample(y, orig_sr=sr, target_sr=SR)
    y = librosa.effects.pitch_shift(y, sr=SR, n_steps=PITCH.get(e['who'], 0))
    y = compress(y / (np.abs(y).max() + 1e-9), .3, 3.0)
    if inTape(e['t']):   # a 1997 camcorder: thin, a little distorted; Ton is behind the camera, so he is close and dry
        y = np.tanh(2.0 * bp(y, 250, 3800, 2)) * .9
        if e['who'] == 'ton': put(y, e['t'], .5)
        else: put(S.room(np.stack([y, y], 1).astype(np.float32), size=.7 if e['who'] == 'daeng' else .5, mix=.35, damp=.5), e['t'], .55)
    elif e['id'] == 'b9': put(bp(y, 300, 3400) * 1.2, e['t'], .55)   # the phone call (we hear Beer only)
    else: put(y, e['t'], .6, -.05)

# ---- beds
mix += np.stack([hp(nz(N), 3000) * .012 * tape] * 2, 1)                                         # tape hiss
hum = (np.sin(2 * np.pi * 50 * tt) * .5 + np.sin(2 * np.pi * 100 * tt) * .25) * .018 * tape
mix += np.stack([hum, hum], 1)
night = (bp(nz(N), 2000, 6000) * .004) * (1 - tape) * (tt > 36)
mix += np.stack([night, np.roll(night, 77)], 1)
street = lp(nz(N), 500) * .02 * ((tt > 6) & (tt < 36)); mix += np.stack([street, street], 1)
for t0 in ev('crickets'):
    k = sec(24); t = np.arange(k) / SR; c = np.sin(2 * np.pi * 4300 * t) * ((t * 1.1) % 1 < .12) * .01; put(c, t0, 1, .4)
w = np.cumsum(nz(N)); w = hp(w - uniform_filter1d(w, SR), 20); base = lp(w, 80) / (np.abs(lp(w, 80)).max() + 1e-9) + np.sin(2 * np.pi * 41 * tt) * .6 + np.sin(2 * np.pi * 43.7 * tt) * .5
dr = np.zeros(N)
for t0 in ev('drone'): dr += np.clip((tt - t0) / 12, 0, 1) * (tt < t0 + 20)
for t0 in ev('flicker2'): dr += np.clip((tt - t0) / 4, 0, 1) * (tt < t0 + 9.4)
mix += np.stack([base * .07 * np.clip(dr, 0, 1)] * 2, 1)

# ---- music: a slow, sparse pad on the title and the end card
def pad(t0, d, notes, g):
    n = sec(d); t = np.arange(n) / SR; x = sum(np.sin(2 * np.pi * 440 * 2 ** ((p - 69) / 12) * t) * (1 + .3 * np.sin(2 * np.pi * .3 * t)) for p in notes) / len(notes)
    put(S.room(np.stack([x, x], 1).astype(np.float32) * env(n, 1.5, 2.5)[:, None], size=.8, mix=.6), t0, g)
pad(0, 6, [45, 52, 57, 60], .12); pad(ev('end')[0], 8, [45, 52, 56, 59], .12)

# ---- effects
def click(k=.012): n = sec(k); return hp(nz(n), 2500) * np.exp(-np.arange(n) / SR / .002)
def thump(f=60, d=.4): n = sec(d); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t / .1) + lp(nz(n), 400) * np.exp(-t / .03)
def motor(d, f0, f1): n = sec(d); f = np.linspace(f0, f1, n); p = 2 * np.pi * np.cumsum(f) / SR; return (np.sin(p) + .4 * np.sin(2 * p)) * env(n, .05, d * .5) * .3
def ding(f=1320, d=1.6): n = sec(d); t = np.arange(n) / SR; return (np.sin(2 * np.pi * f * t) + .4 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t / .5)
def step(v=1, hard=True): n = sec(.25); t = np.arange(n) / SR; return (hp(nz(n), 1000) * np.exp(-t / .01) + np.sin(2 * np.pi * 150 * t) * np.exp(-t / .03)) * v
def steps(t0, d, per, g, echo=False):
    k = 0
    while k * per < d:
        put(step(rng.uniform(.7, 1)), t0 + k * per, g, rng.uniform(-.2, .2))
        if echo: put(lp(step(.6), 1800), t0 + k * per + .18, g * .4)
        k += 1
def buzz(d): n = sec(d); return bp(np.sign(np.sin(2 * np.pi * 100 * np.arange(n) / SR)), 1500, 4000)
FX = {
  'type': lambda t: [put(click(.02) * .8, t + i * .2, .25) for i in range(7)],
  'door': lambda t: put(thump(90, .3) * .6, t, .25),
  'door2': lambda t: (put(click(.04), t, .4), put(bp(nz(sec(1.4)), 300, 1300) * env(sec(1.4), .3, .5), t + .1, .12)),
  'step': lambda t: put(step(.8), t, .12),
  'insert': lambda t: (put(np.concatenate([click(), np.zeros(sec(.15)), thump(120, .2)]), t, .5), put(motor(1.8, 80, 260), t + .3, .3)),
  'vcr': lambda t: put(motor(1.2, 260, 300), t, .25),
  'tapein': lambda t: put(bp(nz(sec(.6)), 300, 6000) * env(sec(.6), .01, .3), t, .3),
  'stepsAway': lambda t: steps(t - 5, 4, .5, .08),
  'stairs': lambda t: steps(t, 13, .42, .14, echo=True),
  'chain': lambda t: [put(bp(nz(sec(.08)), 2000, 7000) * env(sec(.08), .002, .05), t + i * .07, .2) for i in range(10)],
  'pause': lambda t: (put(click(.03) * 2, t, .4), put(motor(.4, 300, 120), t + .05, .2)),
  'play': lambda t: (put(click(.03) * 2, t, .4), put(motor(.5, 120, 300), t + .05, .2)),
  'mop': lambda t: [put(bp(nz(sec(.5)), 400, 2500) * np.sin(np.linspace(0, np.pi, sec(.5))) ** 2 * .6, t + k * .62, .12, .4) for k in range(9)],
  'paper': lambda t: put(bp(nz(sec(.6)), 1500, 6000) * env(sec(.6), .05, .3), t, .12),
  'ding': lambda t: put(ding(1320) * .6 + ding(1047) * .4, t, .3, .3),
  'whoosh': lambda t: put(bp(nz(sec(.5)), 300, 3000) * np.sin(np.linspace(0, np.pi, sec(.5))), t, .15),
  'stepsWalk': lambda t: steps(t, 9.5, .5, .12, echo=True),
  'liftdoor': lambda t: put(bp(nz(sec(1.6)), 200, 1500) * env(sec(1.6), .2, .4) * .4 + motor(1.6, 60, 70) * .5, t, .3),
  'flicker': lambda t: [put(buzz(.08), t + k * .18, .12) for k in range(10)],
  'buzz': lambda t: put(buzz(1.2) * env(sec(1.2), .02, .1), t, .12),
  'blackout': lambda t: put(thump(45, 1.0), t, .5),
  'torch': lambda t: put(click(.03), t, .6),
  'sting': lambda t: (put(bp(nz(sec(1.4)), 300, 5000) * np.linspace(0, 1, sec(1.4)) ** 3, t - 1.4, .25), put(thump(38, 1.6), t, .7)),
  'rush': lambda t: put(bp(nz(sec(1.0)), 200, 4000) * np.linspace(0, 1, sec(1.0)) ** 2, t, .45),
  'tear': lambda t: put(bp(nz(sec(4.4)), 200, 7000) * .5 * env(sec(4.4), .02, .1), t, .5),
  'tapeout': lambda t: put(motor(.6, 300, 40), t, .3),
  'zoom': lambda t: put(np.sin(2 * np.pi * 2000 * np.arange(sec(1.0)) / SR) * env(sec(1.0), .3, .3) * .1, t, .3),
  'flicker2': lambda t: [put(buzz(.06), t + k * .5 + rng.random() * .2, .1) for k in range(16)],
  'stop': lambda t: (put(click(.02) * 2, t, .5), put(thump(200, .1) * .3, t, .5)),
  'thud': lambda t: put(thump(70, .3), t, .4),
  'dial': lambda t: [put(np.sin(2 * np.pi * 440 * np.arange(sec(.9)) / SR) * env(sec(.9), .01, .05) * .2, t + k * 1.1, .3) for k in range(2)],
}
FX['sting2'] = FX['sting']
for e in EV:
    f = FX.get(e['type'])
    if f: f(e['t'])
for c in range(2): mix[:, c] = limit(mix[:, c], .95)
sf.write(os.path.join(HERE, 'mix.wav'), mix.astype(np.float32), SR)
print('mix peak %.2f, %.1fs' % (np.abs(mix).max(), DUR))
