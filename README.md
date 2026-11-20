# ลอยกระทง — Clawd's Krathong

แอนิเมชันสั้น 24 วินาที วาดด้วยโค้ดทั้งหมด (p5.js + p5.brush) สร้างจากชุดเครื่องมือ [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) (MIT)

**เรื่อง:** คืนวันเพ็ญ Clawd ถือกระทงที่จุดเทียนไว้ วางลงแม่น้ำ แต่ลมพัดเทียนดับ Clawd เลยเศร้า แล้วหิ่งห้อยตัวหนึ่งบินมาเกาะไส้เทียน จุดไฟให้ติดอีกครั้ง สุดท้ายแม่น้ำเต็มไปด้วยกระทงและหิ่งห้อย กล้องเงยขึ้นไปหาพระจันทร์

- สตอรีบอร์ดอยู่ที่ [STORYBOARD.md](STORYBOARD.md)
- โค้ดฉากอยู่ที่ [src/scenes/krathong.js](src/scenes/krathong.js)
- กฎและวิธีทำงานอยู่ที่ [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md)

## เรนเดอร์

ต้องมี Node.js, Chrome/Chromium และ ffmpeg

```bash
npm install
node render.mjs --frames --workers=4      # เรนเดอร์ทุกเฟรมลง out/frames (หยุดแล้วทำต่อได้)
node render.mjs --encode --out=out/video.mp4
```

ถ้าเครื่องไม่มี GPU ให้เติม `--soft-gl` ด้วย ส่วน `fast: true` ใน [src/config.js](src/config.js) จะเปลี่ยนสีน้ำแบบซึม (watercolour fill) ให้เป็นสีเรียบ ทำให้เรนเดอร์บน CPU เร็วขึ้นราว 3 เท่า ถ้ามี GPU ให้ตั้งเป็น `false` จะได้ลายสีน้ำเต็มรูปแบบ

เปิด `studio.html` ใน Chrome เพื่อเลื่อนดูทีละเฟรมได้
