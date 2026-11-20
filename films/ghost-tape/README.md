# เวรดึก อาคาร ๓ (Night Round, Building 3)

แอนิเมชันเทปผี 1 นาที แบบเทปกล้องวิดีโอปี 1998 ที่มีคนไปเจอ ยามคืนแรกถ่ายวิดีโอตอนเดินตรวจอาคารเรียนตอนกลางคืน ตามกฎที่แปะไว้บนผนัง

**กฎบนผนัง:** ๑ ตรวจให้ครบก่อนตีสาม · ๒ กริ่งดังให้หยุดนิ่ง นับหนึ่งถึงสิบ · ๓ ห้อง ม.๓/๒ ไม่มีแล้ว · ๔ มีคนเรียกชื่อ ห้ามขานรับ · ๕ ห้ามบันทึกวิดีโอในอาคาร

**เรื่องย่อ:** กริ่งดังตอนเที่ยงคืน ยามหยุดนับหนึ่งถึงสิบ กล้องซูมไปสุดทางเดินแล้วโฟกัสติดอยู่ครึ่งวินาที เห็นผู้หญิงผมยาวยืนอยู่ตรงนั้น เทปกระตุก นาฬิกากระโดดไปตีสอง ป้ายห้อง ม.๓/๒ ที่ "ไม่มีแล้ว" เรืองแสงสีแดง มีเสียงกระซิบเรียกชื่อ ประตูเปิดเอง ในห้องมีบัญชีรายชื่อนักเรียน ชื่อสุดท้ายเขียนด้วยปากกาแดงว่า "สมชาย (นักเรียนใหม่)" แล้วแบตเตอรี่หมด

ทุกอย่างทำด้วยโค้ด: ฉาก 3 มิติ (three.js) ผ่านฟิลเตอร์ VHS, ตัวหนังสือบนจอ, คำบรรยายภาษาไทย และเสียงทั้งหมด ได้แก่ เสียงไฟนีออน กริ่งเข้าเรียน เสียงตามสาย ฝีเท้าบนพื้นหินขัด ลมหายใจ เสียงกระซิบ ประตู และเสียงเตือนแบตหมด เครื่องยนต์มาจากสไตล์ backrooms ของ [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) (MIT)

## สร้างใหม่

รันจากรากของ repo (ต้องมี Node, ffmpeg, Python ที่มี numpy scipy soundfile librosa torch transformers)

```bash
sh films/ghost-tape/tools/fonts.sh                      # ฟอนต์
python films/ghost-tape/tts_th.py                        # เสียงพูดไทย (MMS-TTS) → voices/
node core/render/events.mjs films/ghost-tape            # ไทม์ไลน์ → events.json
python films/ghost-tape/mix.py                           # เสียงทั้งหมด → mix.wav
LEMO_ANGLE=swiftshader node core/render/video.mjs films/ghost-tape --workers 3
CRF=24 sh films/ghost-tape/tools/mux.sh films/ghost-tape/out/video.mp4 films/ghost-tape/mix.wav ghost-tape.mp4 24 0
```

ถ้าไม่มี GPU ให้ใช้ `LEMO_ANGLE=swiftshader` ถ้า Playwright หา Chrome ไม่เจอ ให้ตั้ง `PLAYWRIGHT_CHROME=<path>`
