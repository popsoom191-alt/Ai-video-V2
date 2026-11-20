"""Sound for the krathong film: sound effects from the earshot bank (https://github.com/Leonxlnx/earshot), all made in
code, placed on the scene's own cue times (src/scenes/krathong.js), over a kalimba tune and a night ambience of
crickets and water. Writes assets/krathong_audio.wav.

    pip install -e <earshot clone> --no-deps; pip install numpy scipy soundfile soxr librosa pyloudnorm
    python scripts/make_audio.py
"""
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt
from earshot.forge import bank

SR, DUR = 48000, 24.0
N = int(SR * DUR)
mix = np.zeros((N, 2))
rng = np.random.default_rng(23)
_cache = {}


def take(sid, **kw):
    key = (sid, tuple(sorted(kw.items())))
    if key not in _cache:
        y, m = bank.render(sid, **kw)
        y = np.asarray(y, np.float64)
        if y.ndim == 1:
            y = np.stack([y, y], 1)
        _cache[key] = (y, m)
    return _cache[key]


def place(sid, cue, db=0.0, at='onset', pan=0.0, **kw):
    """put a take so its onset (or its peak, for whooshes and swells) lands on the cue time"""
    y, m = take(sid, **kw)
    start = int((cue - float(m['onset_s' if at == 'onset' else 'peak_s'])) * SR)
    g = 10 ** (db / 20) * np.array([min(1, 1 - pan), min(1, 1 + pan)])
    a, b = max(0, start), min(N, start + len(y))
    if b > a:
        mix[a:b] += y[a - start:b - start] * g


# ---------- ambience: crickets and water ----------
t = np.arange(N) / SR
for k, (f0, period, pan) in enumerate([(4400, .92, -.5), (4750, 1.13, .55), (4100, 1.41, .1)]):
    ph = (t + k * .37) % period
    env = ((ph < .16) * (np.sin(np.pi * 3 * ph / .16) ** 2)) * (.6 + .4 * np.sin(t * .3 + k))
    c = np.sin(2 * np.pi * f0 * t) * env * 10 ** (-38 / 20)
    mix[:, 0] += c * (1 - max(0, pan)); mix[:, 1] += c * (1 + min(0, pan))
water = sosfilt(butter(2, [120, 900], 'bandpass', fs=SR, output='sos'), rng.standard_normal((N, 2)), axis=0)
water *= (.55 + .45 * np.sin(2 * np.pi * .35 * t[:, None] + np.array([[0, 1.3]]))) * 10 ** (-30 / 20)
mix += water
# the ambience dips a little while the wind blows, and rises at the end
amb_env = 1 - .4 * np.exp(-((t - 5.2) / .7) ** 2)
mix *= amb_env[:, None]

# ---------- music: a soft kalimba tune at 80 bpm ----------
B = 60 / 80
tune_a = ['E5', 'G5', 'A5', 'G5', 'E5', 'D5']                       # opening, warm
for i, n in enumerate(tune_a):
    place('pluck/kalimba_soft', .4 + i * B, -17, pitch=n, pan=(-.2 if i % 2 else .2))
place('pluck/kalimba_soft', 6.55, -16, pitch='D4')                  # sad: two low notes
place('pluck/kalimba_soft', 7.3, -17, pitch='A3')
tune_b = ['C5', 'E5', 'G5', 'A5', 'G5', 'E5', 'G5', 'C6', 'A5', 'G5', 'E5', 'D5', 'E5', 'G5', 'E5', 'C5']
for i, n in enumerate(tune_b):                                      # after the relight, to the end
    tc = 12.35 + i * B
    if tc < 22.6:
        place('pluck/kalimba_soft', tc, -15 - 4 * max(0, (tc - 20) / 2.6), pitch=n, pan=(-.25 if i % 2 else .25))
for i, n in enumerate(['C4', 'G4', 'C4', 'A3', 'C4', 'G3']):        # a bass under it
    place('pluck/kalimba', 12.35 + i * 2 * B, -21, pitch=n)

# ---------- sound effects on the scene's cues ----------
place('shimmer/m0', .15, -16)                                       # the moon, iris open
place('swish/soft', 3.25, -18, at='peak')                           # the krathong lowered toward the water
place('drip/bloop', 3.6, -8)                                        # splash
place('drip/drop', 3.68, -13, pan=.3)
place('ui_pop/boop', 3.8, -16, pitch='A5')                          # playful bounce
place('whoosh_big/gust', 5.1, -6, at='peak', dur=1.6, apex=.6)      # the gust
place('whoosh_fast/sleeve', 5.55, -17, at='peak')                   # the flame goes out
place('pro_pop_in/airy', 5.58, -15)
place('knock/wood', 5.72, -16)                                      # surprised take
place('swipe/paper', 8.2, -10, at='peak')                           # brush wipe
for tc, n in [(9.05, 'E6'), (9.75, 'G6'), (10.45, 'A6'), (11.1, 'G6')]:   # the firefly blinks as it flies
    place('mallet/celesta', tc, -17, pitch=n, pan=(tc - 10.2) / 2)
place('mallet/glock', 11.6, -14, pitch='C7', pan=.4)                # it lands on the wick
place('reverse_swell/breath', 11.75, -12, at='peak')               # the flame catches
place('logo_sting/soft_bloom', 11.75, -10)
place('pro_shimmer/m1', 12.3, -15)                                  # starstruck
place('ui_pop/step', 12.85, -12, pitch='C5')                        # the jump
place('knock/wood', 13.48, -14)                                     # the landing
for i in range(6):                                                  # the other krathongs drift in
    place('mallet/pluck', 13.4 + i * .55 + .3, -22, pitch=['G5', 'A5', 'C6', 'D6', 'E6', 'G6'][i], pan=.5)
for i in range(9):                                                  # more fireflies come out
    place('mallet/celesta', 13.3 + i * .25, -25, pitch=['C7', 'E7', 'G7'][i % 3], pan=(i % 3 - 1) * .5)
place('riser/air', 20.8, -20, at='peak')                            # the tilt up to the moon
place('logo_sting/soft_bloom', 22.3, -12)                           # iris to the moon
place('shimmer/m4', 22.4, -16)

# ---------- master: fade in, fade out, peak at -1 dBFS ----------
fade = np.clip(t / .4, 0, 1) * np.clip((DUR - t) / 1.2, 0, 1)
mix *= fade[:, None]
mix *= 10 ** (-1 / 20) / np.max(np.abs(mix))
sf.write('assets/krathong_audio.wav', mix.astype(np.float32), SR, subtype='PCM_24')
print('wrote assets/krathong_audio.wav', f'{DUR}s')
