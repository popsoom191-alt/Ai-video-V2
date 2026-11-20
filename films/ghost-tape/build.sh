#!/bin/sh
# Rebuild "เวรดึก อาคาร ๓" from scratch (run from the repo root). PY = a Python with numpy scipy soundfile librosa torch transformers.
set -e
D=films/ghost-tape; PY=${PY:-python3}
sh $D/tools/fonts.sh
$PY $D/tts_th.py                                            # 1. Thai voices (MMS-TTS) → voices/
node core/render/events.mjs $D                              # 2. page timeline → events.json
$PY $D/mix.py                                               # 3. every sound → mix.wav
node core/render/video.mjs $D --fps 24 --workers 3          # 4. frames → out/video.mp4 (LEMO_ANGLE=swiftshader without a GPU)
CRF=24 sh $D/tools/mux.sh $D/out/video.mp4 $D/mix.wav $D/out/ghost-tape.mp4 24 0   # 5. mux, −14 LUFS
