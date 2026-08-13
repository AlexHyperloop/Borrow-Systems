# 🏥 ระบบยืม-คืนและติดตามสถานะเครื่องมือผ่าตัด (Surgical Instrument Borrowing & Tracking System)

ระบบบริหารจัดการการยืม-คืนอุปกรณ์และเครื่องมือผ่าตัดสำหรับห้องจัดเตรียมอุปกรณ์และห้องผ่าตัด ออกแบบมาเพื่อลดขั้นตอนการทำงาน ป้องกันการหลงลืม และรองรับการทำงานผ่านอุปกรณ์หลากหลาย (Desktop, Tablet, Mobile)

---

## 🌟 คุณสมบัติเด่นของระบบ (Key Features)

### 💻 1. หน้าจอห้องจัดเตรียมอุปกรณ์ (Prep Room Dashboard - `index.html`)
- **สรุปสถิติแบบ Real-time**: แสดงจำนวนรายการทั้งหมด, รอดำเนินการ, จัดส่งแล้ว, และคืนแล้ว
- **ระบบจัดคิวส่งของ (FIFO)**: เรียงลำดับคำขอเบิกตามเวลาที่ยื่นแบบฟอร์มเข้ามาล่วงหน้า
- **พิมพ์ใบจัดสิ่งอุปกรณ์ผ่าตัด (A4 Printable Checklist)**: พิมพ์เอกสารสำหรับจัดของได้ทันทีด้วยฟอร์แมต A4 สวยงาม
- **การจัดการสถานะการคืน**: บันทึกการส่งคืน/คืนไม่ครบ พร้อมระบุเหตุผลและผู้รับคืน
- **การจัดการข้อมูลเครื่องมือ**: เพิ่ม/แก้ไข รายการเครื่องมือผ่าตัดและจำนวนคงเหลือ
- **ส่งออกข้อมูล (Export to Excel)**: ส่งออกรายงานการยืม-คืนเป็นไฟล์ `.xlsx` ได้ในคลิกเดียว
- **สร้าง QR Code**: เจนเนอเรต QR Code เพื่อให้พยาบาลสแกนเข้าหน้ายื่นฟอร์มเบิกได้ทันที

### 📱 2. หน้าติดตามสถานะและยื่นแบบฟอร์มเบิก (Mobile Tracker & Requisition - `status.html`)
- **ติดตามสถานะ**: แสดงตารางรายการเบิกพร้อมสถานะ (กำลังเตรียม / พร้อมรับ / คืนแล้ว)
- **ยื่นแบบฟอร์มเบิก**: กดปุ่มเขียนแบบฟอร์มเพื่อบันทึกการขอเบิก
- **บันทึกเวลาอัตโนมัติ**: บันทึกวันที่และเวลาส่งฟอร์มจริงอัตโนมัติโดยผู้กรอกไม่ต้องพิมพ์เอง

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: HTML5, CSS3 (Custom Variables, Flexbox/Grid, Responsive), Vanilla JavaScript (ES6+)
- **Libraries**:
  - [SheetJS](https://sheetjs.com/) (Excel Export)
  - [QRCode.js](https://davidshimjs.github.io/qrcodejs/) (QR Code Generation)
  - [Font Awesome 6](https://fontawesome.com/) (Icons)
  - [Google Fonts (Sarabun)](https://fonts.google.com/specimen/Sarabun)
- **Storage**: Browser LocalStorage & Storage Event API
- **Server**: PowerShell TcpListener (`server.ps1`) สำหรับทดสอบบน Local Wi-Fi Network

---

## 📁 โครงสร้างไฟล์ในระบบ (Project Structure)

```text
ระบบยืมของ/
├── index.html     # หน้าแดชบอร์ดหลักสำหรับห้องจัดเตรียมอุปกรณ์ (Desktop)
├── status.html    # หน้าติดตามสถานะและแบบฟอร์มขอเบิกอุปกรณ์ (Mobile)
├── styles.css     # สไตล์การออกแบบ CSS รวมของทั้งระบบ
├── app.js         # ลอจิกการทำงานหน้าห้องจัดเตรียมอุปกรณ์
├── status.js      # ลอจิกการทำงานหน้ายื่นแบบฟอร์มเบิก
└── server.ps1     # สคริปต์ Web Server สำหรับทดสอบบน Local Network (Port 8080)
```

---

## 🚀 วิธีการเปิดใช้งานบนเครื่อง local (Local Setup)

1. ดับเบิลคลิกเปิดไฟล์ `index.html` เพื่อใช้งานหน้าจอห้องจัดเตรียมอุปกรณ์
2. ดับเบิลคลิกเปิดไฟล์ `status.html` เพื่อทดลองใช้งานหน้ายื่นแบบฟอร์มเบิก
3. หากต้องการทดสอบผ่าน Wi-Fi ในมือถือ/iPad:
   - รันสคริปต์ `server.ps1` ผ่าน PowerShell
   - เข้าผ่าน IP ของเครื่องคอมพิวเตอร์ เช่น `http://<IP-Address>:8080/status.html`

---

© 2026 Surgical Instrument Tracking System - All Rights Reserved.
