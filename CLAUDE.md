# Ai-video-V2 · project memory

Animations made in code (Canvas2D in a headless browser → mp4). The user writes in Thai; reply in Thai. Current project: **FILE 03**, a Thai ghost-tape investigation series.

## FILE 03: what and where
- Engine: `films/file03/main.js`. An episode is a list of scenes `{ d, tape, osd, date, lines:[[id,who,at,th,en]], ev:[[at,type]], look, draw(lt,t) }`, picked with `?ep=NAME` → `ep${NAME}.js`.
  - Scene start times are summed.
  - `look` = `{tone, v, atmo:[[kind,opts]]}` is applied after each draw (grade, vignette, atmosphere).
- **Current episode 1: `epv2.js` (`?ep=v2`, 18:52).** It builds on `epr.js` (round 1, no cuts), which builds on `ep1.js` / `ep2.js`. Plot: `films/file03/PLOT_EP1.md`. References: `films/file03/REFERENCES.md`.
- Other files:
  - Characters: `chars2.js` (style 2/3; `person(g,id,x,y,H,pose)`)
  - Actions: `actions.js` (53 actions, `act(name,u)`)
  - Backgrounds: `bg.js`, `bg2.js`
  - Inserts (hands with phone/tape): `shots.js`
  - Showcases: `epact.js` (actions), `epposes.js` (stances), `eplook.js`, `eplook2.js` (look tests)
- Sound:
  - Mixer: `films/file03/mix.py EP` reads `events_epEP.json` and writes `mix_epEP.wav`.
  - Real CC0 recordings: `sfx_real/` (credits in `sfx_real/CREDITS.md`).
  - ElevenLabs voices: `voices/` (only the round-1 lines are voiced).
- Commands (Chrome: `PLAYWRIGHT_CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`):
  - stills: `node core/render/still.mjs films/file03 T1 T2 --q "ep=v2" --out DIR`
  - events: `node core/render/events.mjs films/file03 --q "ep=v2" --out films/file03/events_epv2.json`
  - mix: `<venv python> films/file03/mix.py v2`
  - video: `node core/render/video.mjs films/file03 --fps 30 --workers 4 --q "ep=v2" --out films/file03/out/video_epv2.mp4` (~26 min)
  - mux: `CRF=21 sh films/ghost-tape/tools/mux.sh VIDEO WAV OUT.mp4 30 0` (normalises to -14 LUFS; ~20 min). `core/render/mux.sh` needs ffmpeg 7 and fails here.
  - Don't run two renders at once (they slow each other). Long jobs go in the background.
- Skills in `.claude/skills`: superpowers (brainstorming, writing-plans, …), earshot, real-sound. The user likes `/grill-me` rounds.

## The user's rules (keep all of them)
- **Within one place, no cuts:** walk people to where they talk and let the camera follow. Show the journey between places. A time jump fades over a clock. Cuts are allowed only into a screen, a phone, an insert, or a memory.
- **Add many small details;** no confusing jumps. **Nobody may vanish or teleport between frames.** Doors open only for a reason (unlocked, broken, already open).
- **Props are in a hand only while held.** Talking gestures stay small (not a lecturer). Poses are natural. **Standing arms hang straight against the body** (as in the references).
- **Legs move when walking.** Knock and ask before entering. Characters react with real fear when something uncanny happens.
- **Story logic must hold** (who knows what, how they know it, why a place is reachable). **Investigation + dread:** every clue is followed at once by something uncanny tied to it.
- Smart hero, but human: he can be wrong and proves things by observing.
- **Voices:** don't voice new lines until the user says so ("พากย์ได้"). New lines are subtitles only. Use only the existing ElevenLabs voices.
  - **Never store or echo an API key.** Ask for keys with the `request_credential` form, never in chat.
- Show stills before a full render when the change is big ("ขอดูรูปก่อน"). Be honest about what is not done.
- Use the **action library** (`actions.js`) for every action in a scene; add new actions there when a scene needs one. **The user expects this, and asked for it before.**

## Season plan (5 episodes, one tape each; twist revealed in ep 5)
- **The twist:**
  - Everything is Dr. Wichai's hallucination, born of his guilt. He is in a psychiatric hospital.
  - **Beer is Wichai,** seeing himself as a young tape repairer. That is why Beer "knows everything".
  - **The real protagonist is Nid, Mind's younger sister** (12 in '97, 41 now), a reporter who searches for the truth herself because the police said there was not enough evidence.
- **The real crime:**
  - Project 3 tested 7 people, Daeng and Fon among them.
  - On Nov 13, '97 Wichai ordered the 4th-floor power cut. Daeng and Fon died in the lift, and he covered it up.
  - On Nov 20 Mind and Ton found evidence. Mind vanished after meeting him. "???" is Wichai himself.
- **Ton** survived but is mentally unwell. His family cares for him at home upcountry. He is a key clue for ep 2.
- **Ep-1 clues** (subtle):
  - one frame of an old face in the TV reflection
  - the shop door locked from outside
  - the radio: "former researcher still in treatment"
  - the CCTV-like ending (CAM-04, a dome camera)
  - Beer says things he could not know ("the shelf is on the right", "Pa Daeng…", the smell of floor 4), and Nid gives him an odd look
- **Open mysteries:**
  - who opened the 4th-floor padlock
  - tape 3 was not in the box when Nid took it
  - the 27 missing minutes ("the camera was off?" — but the cut is too clean)

## Status (2026-11-21)
- **Done:**
  - ep 1 v2 rendered: `file03-ep1-v2plot.mp4`
  - model v3 (round head, long thin neck, slim body, straight arms)
  - action library (53 actions) with showcase `file03-actions.mp4`
  - detailed backgrounds, real CC0 foley, per-scene light and atmosphere
  - phone and tape hand inserts
- **Next (the user's order):**
  1. **Put the action library into every scene of ep 1** (doors, pick up / put down, torch, startle, etc.). The user complained this was not done.
  2. Visual language from `REFERENCES.md` §"สิ่งที่ต้องใช้": a full HUD, episode title card, key words highlighted in subtitles.
  3. A soft continuous music bed, and LRA down to about 5–7 (now 16).
  4. Voices for the new lines only after the user's go-ahead.
- The output mp4s at the repo root are gitignored. Work on branch `ccr-6dfc00ff-pamqav`.
