"""Thai voices from ElevenLabs (model eleven_v4, language th). Reads the API key from the XI_API_KEY environment variable
(never stored in the repo). Writes voices/<id>.wav and voices/dur.json, one ElevenLabs premade voice per character."""
import os, sys, json, subprocess, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__)); KEY = os.environ['XI_API_KEY']
VOICE = {'beer': 'bIHbv24MWmeRgasZH58o', 'ton': 'IKne3meq5aSn9XLyUdCD', 'mind': 'EXAVITQu4vr4xnSDxMaL', 'nid': 'XrExE9yKIg1WjnnlVkGX',
         'chai': 'pqHfZKP75CvOlQylNhV4', 'daeng': 'hpp4J3VqNfWAUOO0d1Us', 'fon': 'FGY2WhTYpPnrIDTdsKH5', 'oat': 'CwhRBWXzGAHq8TQ4Fs17', 'wichai': 'JBFqnCBsd6RMkjVDRZzb'}
TAG = {'m5': '[whispers] ', 'm17': '[whispers] ', 'b6': '[whispers] ', 'm16': '[scared] ', 'f1': '[softly] ', 'm13': '[whispers] ', 't2': '[nervous] '}
LINES = json.load(open(os.path.join(HERE, 'lines.json')))
OUT = os.path.join(HERE, 'voices'); os.makedirs(OUT, exist_ok=True)
PROG = os.path.join(OUT, 'xi_done.json'); dur = json.load(open(PROG)) if os.path.exists(PROG) else {}   # resumable
for L in LINES:
    if L['id'] in dur: continue
    body = json.dumps({'text': TAG.get(L['id'], '') + L['text'].replace('ดอกเตอร์', 'ดร.'), 'model_id': 'eleven_v4', 'language_code': 'th', 'seed': 7,
                       'voice_settings': {'stability': .45, 'similarity_boost': .8, 'style': .2, 'speed': .95}}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE[L['who']]}?output_format=mp3_44100_128", body, {'xi-api-key': KEY, 'Content-Type': 'application/json'})
    mp3 = os.path.join(OUT, L['id'] + '.mp3'); open(mp3, 'wb').write(urllib.request.urlopen(req, timeout=120).read())
    wav = os.path.join(OUT, L['id'] + '.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', mp3, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse', wav], check=True); os.remove(mp3)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav], capture_output=True, text=True).stdout)
    dur[L['id']] = round(d, 3); print(L['id'], dur[L['id']], flush=True); json.dump(dur, open(PROG, 'w'))
json.dump(dur, open(os.path.join(OUT, 'dur.json'), 'w'), indent=1)
