"""Mix for "เวรดึก อาคาร ๓": every sound the tape would have recorded → mix.wav (48 kHz stereo). Adapted from the lemo-opuscar
backrooms demo mix (MIT). New here: the school intercom chime, the class bell, heel steps on terrazzo, a whisper from
room 3/2, the camcorder's low-battery beeps and power-down.
Fluorescent hum / ballasts / tape hiss / footsteps / breathing / clothing rustle / PA (chime + af_bella through a ceiling speaker) / the camera operator's quiet speech
/ in-scene elevator music (tape speed slower and slower) / low-frequency rumble / camera mechanism noise / light flickers / something passing overhead / tracking tear / 1 second of held breath / door
All timings come from events.json (exported from the page's window.EV), the same source as the picture.
Also writes voices_fx/<id>.wav (the processed voices, for the whisper re-check)."""
import sys, os, json
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../..'))
sys.path.insert(0, ROOT)
import numpy as np, soundfile as sf, librosa
from scipy.signal import butter, sosfilt, lfilter
from scipy.ndimage import uniform_filter1d, maximum_filter1d
from core.audio.sfx import SR, bp, lp, hp, add, limit, compress
from core.audio import sampler as S

rng = np.random.default_rng(41)
E = json.load(open(os.path.join(HERE, 'events.json'))); DUR = E['dur']; EV = E['ev']; N = int(DUR * SR) + SR
LINES = json.load(open(os.path.join(HERE, 'lines.json')))
ev = lambda ty: [e for e in EV if e['type'] == ty]
one = lambda ty: ev(ty)[0]
tt = np.arange(N) / SR
def nz(n): return rng.standard_normal(n)
def sec(d): return int(round(d * SR))
def env_ar(n, a, r):   # linear attack, exponential release
    x = np.ones(n); na = min(n, sec(a)); x[:na] = np.linspace(0, 1, na)
    nr = min(n, sec(r)); x[n - nr:] *= np.exp(-np.linspace(0, 5, nr)); return x
def fade(n, fi=.01, fo=.01):
    x = np.ones(n); a, b = min(n, sec(fi)), min(n, sec(fo)); x[:a] = np.linspace(0, 1, a); x[n - b:] *= np.linspace(1, 0, b); return x
def bus(): return np.zeros((N, 2))
def put(b, x, t, g=1., pan=0.):
    if x.ndim == 2:
        i = sec(t); j = min(N, i + len(x));
        if i < N and j > i: b[i:j] += x[:j - i] * g
    else: add(b, x.astype(np.float64), t, g, pan)

TREC0 = one('recOn')['t'] + .25; TOFF = one('recOff')['t']; TEND = one('end')['t']
TEAR = one('tear'); HUSH = one('hush'); DOOR = one('door'); BELL = one('bell'); BAT = one('batlow')
FL = [e['t'] + .03 for e in ev('flick')]           # light-flicker times (same formula as gLight in the picture)
def glight(t):
    g = np.ones_like(t)
    for i, f in enumerate(FL):
        off = (t > f - .03) & (t < f + .1 + i * .02); g[off] = .025
        rec = (t >= f + .1 + i * .02) & (t < f + .2); g[rec] = np.minimum(g[rec], .55 + .45 * np.clip((t[rec] - f - .1) / .1, 0, 1))
    return g
G = glight(tt)
alive = ((tt > TREC0) & (tt < TOFF)).astype(float)          # camera is recording
hush = ((tt >= HUSH['t']) & (tt < HUSH['t'] + HUSH['d']))

# ———————— Voices ————————
def load_voice(i):
    y, sr = sf.read(os.path.join(HERE, 'voices', i + '.wav'))
    if y.ndim > 1: y = y.mean(1)
    return librosa.resample(y, orig_sr=sr, target_sr=SR)
def tapewow(x, depth, rate=.55, flutter=.0015):
    n = len(x); t = np.arange(n) / SR
    sp = 1 + depth * np.sin(2 * np.pi * rate * t) + flutter * np.sin(2 * np.pi * 7.3 * t)
    pos = np.cumsum(sp); pos = pos - pos[0]
    return np.interp(np.clip(pos, 0, n - 1), np.arange(n), x)
def speaker(x, far=.5, wow=0.):
    """Ceiling speaker: band-pass + paper-cone resonance + light distortion + large-space reverb (the larger far is, the farther and wetter)"""
    y = bp(x, 300 + 80 * far, 3900 - 1200 * far, 2)
    y = y + .5 * bp(y, 1000, 1600, 2)
    y = np.tanh(2.2 * y / (np.abs(y).max() + 1e-9)) / np.tanh(2.2)
    if wow: y = tapewow(y, wow)
    st = np.stack([y, y], 1)
    wet = S.room(np.pad(st, ((0, sec(2.5)), (0, 0))).astype(np.float32), size=.55 + .3 * far, mix=1.0, damp=.6)
    dry = np.pad(st, ((0, sec(2.5)), (0, 0)))
    return dry * (1 - .4 * far) + wet * (.18 + .5 * far)
def murmur(x):
    """Camera operator's quiet speech: lowered level + close-mic low end + a layer of breath noise following the voice envelope + compression"""
    x = x / (np.abs(x).max() + 1e-9)
    envl = uniform_filter1d(np.abs(x), sec(.03))
    air = bp(nz(len(x)), 1400, 6000, 2) * envl * .9
    y = x * .8 + lp(x, 260) * .9 + air * .35
    y = hp(y, 70)
    y = compress(y / (np.abs(y).max() + 1e-9), .25, 3.0)
    return y / (np.abs(y).max() + 1e-9)

os.makedirs(os.path.join(HERE, 'voices_fx'), exist_ok=True)
vo, pa = bus(), bus()
voice_act = np.zeros(N)
for e in ev('line'):
    i, t = e['id'], e['t']; x = load_voice(i)
    if e['who'] == 'PA':
        far = {'p1': .42, 'p2': .36}[i]
        wow = .006 if i == 'p2' else 0.
        if i == 'p2': x = librosa.effects.pitch_shift(x, sr=SR, n_steps=-1.2)   # after the tear the tape runs slow
        y = speaker(x, far, wow)
        y = y / (np.abs(y).max() + 1e-9)
        put(pa, y, t, .62)
        sf.write(os.path.join(HERE, 'voices_fx', i + '.wav'), y[:, 0].astype(np.float32), SR)
    elif e['who'] == 'ROOM':   # a whisper from inside room 3/2: breath instead of voice, far, in a hard room
        x = librosa.effects.pitch_shift(x, sr=SR, n_steps=-3)
        envl = uniform_filter1d(np.abs(x), sec(.02)); envl /= envl.max() + 1e-9
        wh = bp(nz(len(x)), 900, 5200, 2) * envl + hp(x, 1500) * 1.5
        wh = wh / (np.abs(wh).max() + 1e-9)
        st = np.stack([wh, wh * .8], 1)
        y = S.room(np.pad(st, ((0, sec(2)), (0, 0))).astype(np.float32), size=.35, mix=.55, damp=.4)
        y = y / (np.abs(y).max() + 1e-9)
        put(vo, y, t, .5)
        sf.write(os.path.join(HERE, 'voices_fx', i + '.wav'), y[:, 0].astype(np.float32), SR)
    else:
        x = librosa.effects.pitch_shift(x, sr=SR, n_steps=-2.5)                  # the guard: lower, quieter
        y = murmur(x)
        put(vo, y, t, .34 if i.startswith('n') else .5, -.05)
        sf.write(os.path.join(HERE, 'voices_fx', i + '.wav'), y.astype(np.float32), SR)
    a = sec(t); voice_act[a:a + len(x)] = 1
# Chime: vibraphone E5 → C5, through the same speaker; after the tear it goes off-pitch with the tape
for k, e in enumerate(ev('chime')):
    det = -.55 if e['t'] > TEAR['t'] else 0.
    c = np.zeros(sec(2.4))
    for j, (p, dt) in enumerate([(79 + det, 0), (74 + det, .5), (71 + det, 1.0)]):
        f0 = 440 * 2 ** ((p - 69) / 12); k = sec(1.4); t_ = np.arange(k) / SR
        n = sum(a * np.sin(2 * np.pi * f0 * m_ * t_) * np.exp(-t_ / d) for m_, a, d in [(1, 1, .9), (2.0, .35, .5), (3.01, .18, .3), (4.2, .08, .2)])
        c[sec(dt):sec(dt) + k] += n[:len(c) - sec(dt)]
    far = .5 if k == 0 else .4
    sc = speaker(c, far); put(pa, sc * .42 / (np.abs(sc).max() + 1e-9), e['t'])
    voice_act[sec(e['t']):sec(e['t'] + 1.2)] = np.maximum(voice_act[sec(e['t']):sec(e['t'] + 1.2)], .6)

# ———————— Fluorescent hum + ballasts ————————
room = np.ones(N); tin = ev('af')[-1]['t']                       # inside the room behind the door: the hum is closer
room += .45 * np.clip((tt - (tin - .8)) / 1.2, 0, 1)
wob = 1 + .004 * np.sin(2 * np.pi * .13 * tt) + .002 * np.sin(2 * np.pi * .71 * tt)
ph = 2 * np.pi * 120 * np.cumsum(wob) / SR
hum = sum(a * np.sin(k * ph + k * 1.3) for k, a in [(1, 1.), (2, .55), (3, .42), (4, .22), (5, .16), (7, .06)])
buzz = bp(np.sign(np.sin(ph)) * .3 + nz(N) * .05, 900, 3200, 2) * .5          # the inductor's "zzz" buzz
whine = np.sin(2 * np.pi * 9150 * tt + .3 * np.sin(2 * np.pi * .2 * tt)) * .05
hum_bed = (hum * .1 + buzz * .05 + whine * .25) * G * room
# Vibrato of failing tubes: random "bzzz" at a few spots along the corridor
for k in range(9):
    t0 = rng.uniform(4, 45); d = rng.uniform(.4, 1.2); n = sec(d)
    z = bp(nz(n), 1800, 4200, 2) * (rng.random(n // 480 + 1).repeat(480)[:n] > .5) * env_ar(n, .05, .2)
    a = sec(t0); hum_bed[a:a + n] += z * .018
hum_bed *= alive
hb = np.stack([hum_bed, np.roll(hum_bed, 37)], 1)

# ———————— Tape hiss ————————
hiss = hp(nz(N), 3500, 2) * .006
hiss = hiss * (alive + .45 * ((tt > TOFF + .25) & (tt < DUR)) * np.clip(1 - (tt - TEND) / 3.2, 0, 1))
hs = np.stack([hiss, np.roll(hiss, 91)], 1)

# ———————— Foley ————————
fx = bus()
for e in ev('step'):   # work shoes on terrazzo: a hard heel click, a softer toe, a long corridor echo
    n = sec(.6); t = np.arange(n) / SR; v = e['v'] * rng.uniform(.8, 1.1)
    heel = bp(nz(n), 1200, 5200, 2) * np.exp(-t / .008) + np.sin(2 * np.pi * rng.uniform(140, 190) * t) * np.exp(-t / .02) * .5
    toe = bp(nz(n), 800, 3000, 2) * np.exp(-np.maximum(t - .07, 0) / .012) * (t > .07) * .35
    x = (heel + toe) * v
    put(fx, x, e['t'], .2, rng.uniform(-.15, .15))
    put(fx, lp(x, 2500) * .25, e['t'] + .19, .2, rng.uniform(-.4, .4))   # slap-back from the far end
for e in ev('rustle'):
    d = rng.uniform(.35, .6); n = sec(d)
    x = bp(nz(n), 1500, 6500, 2) * env_ar(n, d * .3, d * .5) * (.5 + .5 * np.abs(uniform_filter1d(nz(n), 300)) * 8)
    put(fx, x * e['v'], e['t'], .07, rng.uniform(-.3, .3))
def clack(n=.08):
    k = sec(n); t = np.arange(k) / SR
    return (hp(nz(k), 1500) * np.exp(-t / .006) + np.sin(2 * np.pi * 180 * t) * np.exp(-t / .02) * .8)
def motor(d, f0, f1):
    k = sec(d); t = np.arange(k) / SR; f = np.linspace(f0, f1, k); p = 2 * np.pi * np.cumsum(f) / SR
    return (np.sin(p) + .4 * np.sin(2 * p) + .2 * np.sin(3 * p)) * env_ar(k, .05, d * .6) * .3 + bp(nz(k), 800, 3000) * .05 * env_ar(k, .05, d * .6)
r0 = one('recOn')['t']; put(fx, clack(), r0, .35); put(fx, motor(.9, 90, 230), r0 + .05, .12)
put(fx, clack(), TOFF, .45); put(fx, motor(1.1, 230, 25), TOFF + .03, .16)
for e in ev('zoom'):   # zoom servo motor
    k = sec(e['d']); t = np.arange(k) / SR; p = 2 * np.pi * np.cumsum(1350 + 60 * np.sin(2 * np.pi * 11 * t)) / SR
    x = (np.sin(p) + .5 * np.sign(np.sin(p)) * .3) * fade(k, .06, .1) + bp(nz(k), 2000, 5000) * .15 * fade(k, .06, .1)
    put(fx, bp(x, 700, 5000), e['t'], .03)
for e in ev('af'):     # fine clicks of the focus motor
    for j in range(rng.integers(3, 6)):
        k = sec(.012); c = hp(nz(k), 3000) * np.exp(-np.arange(k) / SR / .002); put(fx, c, e['t'] + j * rng.uniform(.04, .09), .08)
for i, f in enumerate(FL):   # light flicker: ballast "ting" + arc "zzz"
    for tt0, gg in [(f - .03, .5), (f + .1 + i * .02, .8)]:
        k = sec(.12); t = np.arange(k) / SR
        tink = (np.sin(2 * np.pi * 3150 * t) + .6 * np.sin(2 * np.pi * 4720 * t)) * np.exp(-t / .03)
        zz = bp(np.sign(np.sin(2 * np.pi * 120 * t)) + nz(k) * .3, 1500, 4000) * np.exp(-t / .04)
        put(fx, tink * .15 + zz * .3, tt0, .22 * gg)
# The class bell: an electric school bell somewhere down the corridor (clapper at ~22 Hz on a steel gong), at midnight
k = sec(BELL['d'] + .2); t = np.arange(k) / SR
clap = (np.sin(2 * np.pi * 22 * t) > .2).astype(float); clap = np.diff(clap, prepend=0).clip(0) * 1.0
gong = sum(lfilter([1], [1, -2 * np.exp(-1 / (SR * d)) * np.cos(2 * np.pi * f / SR), np.exp(-2 / (SR * d))], clap) * a
           for f, a, d in [(1870, 1, .25), (2410, .7, .2), (3320, .45, .15), (4800, .25, .1), (930, .4, .3)])
gong = gong / (np.abs(gong).max() + 1e-9) * fade(k, .01, .25) + bp(nz(k), 2000, 6000) * .04 * fade(k, .01, .2)
bell = S.room(np.stack([gong, gong * .9], 1).astype(np.float32), size=.75, mix=.55, damp=.45)
put(fx, bell, BELL['t'], .22)
# The camcorder's low-battery beeps, then the motor winding down when the battery dies
for j in range(4):
    k = sec(.09); t = np.arange(k) / SR; b = np.sin(2 * np.pi * 3950 * t) * fade(k, .004, .01)
    put(fx, b, BAT['t'] + .4 + j * .55, .05)
# Door: latch → slow hinge creak (stick-slip friction pulses through a resonator) → whoosh of air pressure
put(fx, clack(.1) * .7, DOOR['t'] - .05, .3)
k = sec(DOOR['d'] + .4); t = np.arange(k) / SR
f = 5.0 + 4 * np.sin(np.pi * t / t[-1]) + rng.standard_normal(k).cumsum() * .0004
pulses = (np.diff(np.floor(np.cumsum(f * 60 / SR)), prepend=0) > 0).astype(float)
cr = sum(bp(pulses, fc * .92, fc * 1.08, 2) for fc in (420, 760, 1310)) * fade(k, .15, .3)
put(fx, cr / (np.abs(cr).max() + 1e-9), DOOR['t'], .08)
air = lp(nz(k), 400) * np.sin(np.pi * t / t[-1]) ** 2
put(fx, air, DOOR['t'] + .1, .06)

# ———————— Breathing (close-mic) ————————
br = bus()
def breath(tin, d_in, d_out, g):
    n1, n2 = sec(d_in), sec(d_out)
    a = bp(nz(n1), 900, 2800, 2) * np.sin(np.linspace(0, np.pi, n1)) ** 1.5
    b = bp(nz(n2), 400, 1900, 2) * np.sin(np.linspace(0, np.pi, n2)) ** 2 * .7
    put(br, a, tin, g); put(br, b, tin + d_in + .08, g)
f1 = BELL['t']; tH0, tH1 = HUSH['t'], HUSH['t'] + HUSH['d']
me_lines = [(e['t'], e['t'] + 1.6) for e in ev('line') if e['who'] == 'ME']
me_lines.append((BELL['t'] + 2.5, BELL['t'] + 11))   # holding still through the count
t = 1.2
while t < TOFF - .5:
    if t < f1: per, g = 3.8, .018
    elif t < f1 + 4.5: per, g = 1.7, .04
    elif t < TEAR['t']: per, g = 2.4, .03
    elif t < tH0 - .6: per, g = 2.1, .032
    elif t < tH1 + .25: t = tH1 + .35; breath(t, .15, 1.3, .045); t += 1.9; continue   # hold → one long exhale
    else: per, g = 1.9, .034
    if not any(a - .6 < t < b for a, b in me_lines): breath(t, per * .3, per * .38, g * 1.5)
    t += per * rng.uniform(.92, 1.08)

# ———————— Low-frequency rumble: rises after the tear, cut during the held breath ————————
dr_env = np.clip((tt - (TEAR['t'] - 1.5)) / (tH0 - TEAR['t'] + 1.5), 0, 1) ** 1.6 * (tt < tH0)
w = np.cumsum(nz(N)); w = hp(w - uniform_filter1d(w, SR), 18)
drone = (lp(w, 70) / (np.abs(lp(w, 70)).max() + 1e-9) * .6 + np.sin(2 * np.pi * 41 * tt) * .5 + np.sin(2 * np.pi * 43.5 * tt) * .4) * dr_env
drn = np.stack([drone, drone], 1)

# ———————— Assembly ————————
duck = 1 - .6 * np.clip(uniform_filter1d(maximum_filter1d(voice_act, sec(.3)), sec(.25)), 0, 1)   # ≈ −8 dB
D = duck[:, None]
mix = hb * .42 * D + hs * 1.0 + fx * 1.0 + br * 1.0 + drn * .1 * D + pa * 1.0 + vo * 1.0
# Tracking tear: the whole mix chopped up + a burst of noise
a, b = sec(TEAR['t']), sec(TEAR['t'] + TEAR['d'])
gate = np.repeat((rng.random((b - a) // 960 + 1) > .45).astype(float), 960)[:b - a]
gate = uniform_filter1d(gate, 48)
mix[a:b] *= gate[:, None]
burst = bp(nz(b - a), 300, 7000) * .12 * np.sin(np.linspace(0, np.pi, b - a)) ** .5 + bp(nz(b - a), 60, 400) * .08
mix[a:b] += np.stack([burst, np.roll(burst, 13)], 1)
# Held breath: 1.00 s of digital silence (reverb tails included)
a, b = sec(tH0), sec(tH1); mix[a - sec(.004):a] *= np.linspace(1, 0, sec(.004))[:, None]; mix[a:b] = 0
# First sound back: a dull "thump" of every ballast restarting at once (the film's only sound scare, kept restrained)
k = sec(.5); t = np.arange(k) / SR
thunk = np.sin(2 * np.pi * 48 * t) * np.exp(-t / .12) + lp(nz(k), 500) * np.exp(-t / .05) * .6 + bp(np.sign(np.sin(2 * np.pi * 120 * t)), 1500, 4000) * np.exp(-t / .08) * .15
put(mix, thunk, tH1, .34)
# Blank tape after REC goes off: only the hiss is left (end card)
a = sec(TOFF + .25); keep = hs[a:] * 1.0; mix[a:] = keep
mix = mix[:int(DUR * SR)]
for c in range(2): mix[:, c] = limit(mix[:, c], .95)
sf.write(os.path.join(HERE, 'mix.wav'), mix.astype(np.float32), SR)
def db(x): return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12)
print('mix peak %.3f  rms %.1f dB' % (np.abs(mix).max(), db(mix)))
for name, b_ in [('hum', hb * .55), ('hiss', hs), ('fx', fx), ('breath', br), ('drone', drn * .09), ('pa', pa), ('vo', vo)]:
    print('  %-7s %6.1f dB' % (name, db(b_[:int(DUR * SR)])))
