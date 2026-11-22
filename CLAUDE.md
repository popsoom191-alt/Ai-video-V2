# Ai-video-V2 · project memory

Animations made in code (Canvas2D in a headless browser → mp4). The user writes in Thai; reply in Thai. Current project: **FILE 03**, a Thai ghost-tape investigation series.

## FILE 03: what and where
- Engine: `films/file03/main.js`. An episode is a list of scenes `{ d, tape, osd, date, lines:[[id,who,at,th,en]], ev:[[at,type]], look, draw(lt,t) }`, picked with `?ep=NAME` → `ep${NAME}.js`.
  - Scene start times are summed.
  - `look` = `{tone, v, atmo:[[kind,opts]]}` is applied after each draw (grade, vignette, atmosphere).
- **Current episode 1: `epv3.js` (`?ep=v3`, 17:51, the "middle way" chosen by the user: characters speak, plus the references' HUD / title card / rules card / gold key lines / fog / music bed; actions per scene via `acts: [[who, action, at, dur, {noProp}]]`).** It builds on `epv2.js` (`?ep=v2`, 18:52). It builds on `epr.js` (round 1, no cuts), which builds on `ep1.js` / `ep2.js`. Plot: `films/file03/PLOT_EP1.md`. References: `films/file03/REFERENCES.md` + a picture sheet of the guide reel `films/file03/refs/guide_sheet.jpg` (27 labelled shots, a list with timestamps in `refs/guide_list.txt`). **Look at it before designing any scene.**
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

## Project 2: "แสนล้าน" (started 2026-11-21; plot settled, production not started)
- **Story:**
  - A poor, not-clever boy, ปั้น (born 2539), dreams of 100 billion baht. He is wrong often, scammed and insulted countless times (once spat on), but never gives up.
  - Every fall teaches him: psychology, care, long-range planning, knowing what not to do. He beats clever people because clever people overthink.
  - The plot, all of it decided in `/grill-me` rounds: `films/sanlan/PLOT.md` (read it first).
- **Format:**
  - One video of about 36–37 min, five chapters plus an ending.
  - **Narrated like the reference clips**: a second-person narrator ("คุณ…"), characters speak only 15–20 key lines. Subtitles first; voice only after the user says so.
- **Arc:**
  - 8: grandma's coin, mum's curry stall by the canal.
  - 15: fails exams; Nun; พี่โอ's pyramid scheme (backed by คุณธนา).
  - 22: scammed every way; a customer spits on him; he starts the rule notebook.
  - 24–26: เฮียกิม (pawnshop) teaches risk. Pan's business with Nun (his lover) booms (magazine, car, condo). Then:
    - เฮียกิม dies, and Nun betrays him at a shareholders' meeting next to คุณธนา's man.
    - He has ฿2.4M left and burns it on drink and online gambling. He loses car, condo and the engagement ring, then sleeps under a footbridge in the rain (฿0, fall 31).
    - The grief segment runs 4–5 min: the narrator says little ("ไม่มีใครไม่เคยเศร้า… รวมถึงคุณ"), and quiet cards show the five stages of grief.
    - He gets up after mum's voicemail. Proposed but not yet confirmed: เฮียกิม's daughter hands him a box with คุณธนา's secret ledger, and he writes the new rule "ล้มได้ แต่ห้ามนอนนาน".
  - 27–30: he trusts no one and rebuilds quietly. He buys คุณธนา's secret debts through nominees, leaks fake plans so the clever overthink, and swallows คุณธนา's empire.
    - He leaves Nun's small company alone: "ถ้ามันกลับมาเหยียบหน้าผมได้ ก็แสดงว่าผมยังเก่งไม่พอ".
    - Nun apologises ("ฉันรู้ตั้งแต่ ม.๓ ว่าสักวันนายจะกลับมา… ฉันแค่อยากถึงก่อน"; she kept his first notebook). He doesn't take her back, but doesn't touch her shop.
  - 38: 100 billion. He follows grandma's limit (don't take food from the hungry; repay the scheme's victims). Back at mum's stall, mum looks at him oddly. The ending is philosophy: "ค่าเรียน ๔๗ ครั้ง … คุณยังเป็นเด็กคนนั้นอยู่ไหม".
- **Plot rewrite 2026-11-22 ("ฮุบ", not "ยุบ"; see PLOT.md top section, Claude's ⟨คิดเอง⟩ parts await the user's OK):** Thana is a GOOD man, unrelated to พี่โอ. Nun betrays Pan with rival เสี่ยกร. At rock bottom Pan realises on his own, restarts from zero (dishwashing, noodle cart, trading, online shop), builds the escrow/anti-scam app "เหรียญ"; Thana invests and takes it global → 100 billion. Then Pan, greedy and scarred, seizes everything from Thana with scammers' tricks; Thana is shamed, loses wife, kids, everything, dies of stress. Thana's letter: he meant to give Pan the company anyway. Tragic ending: mum asks grandma's question; "ครั้งที่ ๔๘ คนอื่นจ่ายแทน"; blank rule page. eps4 (meeting, box), eps5, eps6 must be rewritten.
- **Taken from the reference clips** (`films/file03/REFERENCES.md`, `refs/guide_sheet.jpg`):
  - second-person narration over pictures
  - a top-left **HUD "ปี | อายุ | ฿ เงิน | ล้ม n"**, with money and falls changing live
  - **rule cards** ("สมุดกฎของปั้น": one new rule per fall)
  - **chapter cards** ("บทที่ x · title · age")
  - **real knowledge cards** (how scams, pyramid schemes and gambling hooks work; trust-based fraud; what one baht bought in 2547)
  - a **life graph** card at the end
  - colour shifting with life stages: warm sepia childhood / cold grey falls / bright success
  - a **music bed by stage**: warm piano / dark drone / tense pulse / slow piano
  - the reference model: round head, long thin neck, slim body, straight arms, close-ups with blurred backgrounds, big hand inserts
- **Built so far:**
  - `films/file03/cast_sanlan.js`: the cast (ปั้น at 8/15/22/30, แม่, ยาย, พี่โอ, เฮียกิม, นุ่น, คุณธนา). `headScale` and `legScale` give child proportions. Still to design: เฮียกิม's daughter, the customer who spits, the investor who throws the file.
  - New actions in `actions.js` (countMoney, carrySack, readBook, headInHands, scrolledPhone, dustOff, fistPump, handshake) and new props (book, coin, note, sack).
  - Sheets: `films/file03/epsanlan.js` (`?ep=sanlan`).
- **Whole film built (2026-11-21):** `eps1.js`…`eps6.js` (ch 1–5 + ending), joined in `epsall.js` (`?ep=sall`, 29:11). UI cards in `sanlan_ui.js`, extra backgrounds in `bg_sanlan2.js`. Talk gestures are off for `s*` episodes (`NOGEST` in main.js). Mix: `mix.py sall` (piano bed for childhood and the ending, drone for the falls). Output `sanlan-full.mp4`. Subtitles only, no voices. Still rough: coin-hand insert, the lamp looks like a candle, desks overlap in the classroom; Kim's daughter's ledger box not yet confirmed by the user.
- **Earlier step:** chapter 1 "เหรียญบาทของยาย" (~5 min) as a sample. Beats are in PLOT.md: canal house, curry stall, grandma under the lamp, classroom laughter, first sale cheated → fall 1. Show stills first.

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

## Status (2026-11-21, later)
- ep 1 v3 rendered: `file03-ep1-v3.mp4` (−14.1 LUFS, LRA 6.9). The action library is now used in about 45 places.

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
