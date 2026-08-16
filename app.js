/**
 * ==========================================================================
 * ระบบยืม-คืนเครื่องมือผ่าตัด - ฝ่ายห้องผ่าตัด (OR Mobile Requisition & Status Tracker)
 * Dedicated Script for status.html (Mobile-Friendly Form & Tracker)
 * ==========================================================================
 */

// Firebase Configuration (Realtime Database - Singapore Region)
const firebaseConfig = {
    apiKey: "AIzaSyDVxJxGGqMLgVgcjPSQ7LxZDJQDTJPPOCU",
    authDomain: "borrow-systems-9.firebaseapp.com",
    databaseURL: "https://borrow-systems-9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "borrow-systems-9",
    storageBucket: "borrow-systems-9.firebasestorage.app",
    messagingSenderId: "537901451536",
    appId: "1:537901451536:web:4871a796e7548e8405fd95",
    measurementId: "G-BL72XTYYR2"
};

// Initialize Firebase App & Database if SDK loaded
let db = null;
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
}

// --------------------------------------------------------------------------
// 1. Initial Datasets (Same Schema & Key for Real-time LocalStorage Sync)
// --------------------------------------------------------------------------
const INITIAL_EQUIPMENT_LIST = [
    // Set Package (45 รายการหัตถการผ่าตัด)
    { id: 'eq-sp-1', name: 'C/S', category: 'Set Package', active: true },
    { id: 'eq-sp-2', name: 'Complete surgical staging (CSS)', category: 'Set Package', active: true },
    { id: 'eq-sp-3', name: 'Laparoscope สูติ-นรีเวช', category: 'Set Package', active: true },
    { id: 'eq-sp-4', name: 'TAH', category: 'Set Package', active: true },
    { id: 'eq-sp-5', name: 'TR', category: 'Set Package', active: true },
    { id: 'eq-sp-6', name: 'Vaginal hysterectomy', category: 'Set Package', active: true },
    { id: 'eq-sp-7', name: 'AAA', category: 'Set Package', active: true },
    { id: 'eq-sp-8', name: 'AVG', category: 'Set Package', active: true },
    { id: 'eq-sp-9', name: 'Low anterior resection (LAR)', category: 'Set Package', active: true },
    { id: 'eq-sp-10', name: 'PTA', category: 'Set Package', active: true },
    { id: 'eq-sp-11', name: 'Thoracotomy', category: 'Set Package', active: true },
    { id: 'eq-sp-12', name: 'Blepharoplasty', category: 'Set Package', active: true },
    { id: 'eq-sp-13', name: 'Cheiloplasty', category: 'Set Package', active: true },
    { id: 'eq-sp-14', name: 'ORIF c IMF c Plate & Screw c Arch bars', category: 'Set Package', active: true },
    { id: 'eq-sp-15', name: 'ORIF c Plate&Screw Zygoma', category: 'Set Package', active: true },
    { id: 'eq-sp-16', name: 'Palatoplasty', category: 'Set Package', active: true },
    { id: 'eq-sp-17', name: 'STSG', category: 'Set Package', active: true },
    { id: 'eq-sp-18', name: 'Wide excision', category: 'Set Package', active: true },
    { id: 'eq-sp-19', name: 'Craniotomy remove tumor', category: 'Set Package', active: true },
    { id: 'eq-sp-20', name: 'PDS c Laminectomy', category: 'Set Package', active: true },
    { id: 'eq-sp-21', name: 'Craniotomy c clipping aneurysm', category: 'Set Package', active: true },
    { id: 'eq-sp-22', name: 'Craniotomy remove clot (SDH)', category: 'Set Package', active: true },
    { id: 'eq-sp-23', name: 'Craniotomy remove clot (EDH)', category: 'Set Package', active: true },
    { id: 'eq-sp-24', name: 'Craniotomy remove clot (BGH)', category: 'Set Package', active: true },
    { id: 'eq-sp-25', name: 'V-P shunt', category: 'Set Package', active: true },
    { id: 'eq-sp-26', name: 'BSSO (Bilateral saggital split osteotomy)', category: 'Set Package', active: true },
    { id: 'eq-sp-27', name: 'mandibulectomy c BND', category: 'Set Package', active: true },
    { id: 'eq-sp-28', name: 'ORIF c Miniplate at mandible', category: 'Set Package', active: true },
    { id: 'eq-sp-29', name: 'ORIF c Miniplate atzygoma', category: 'Set Package', active: true },
    { id: 'eq-sp-30', name: 'TKA', category: 'Set Package', active: true },
    { id: 'eq-sp-31', name: 'THA', category: 'Set Package', active: true },
    { id: 'eq-sp-32', name: 'BHA', category: 'Set Package', active: true },
    { id: 'eq-sp-33', name: 'Laminectomy', category: 'Set Package', active: true },
    { id: 'eq-sp-34', name: 'Arthroscope (Knee)', category: 'Set Package', active: true },
    { id: 'eq-sp-35', name: 'Arthroscope (Shoulder)', category: 'Set Package', active: true },
    { id: 'eq-sp-36', name: 'Laparoscopic Adrenalectomy', category: 'Set Package', active: true },
    { id: 'eq-sp-37', name: 'Laparoscopic Prostatectomy', category: 'Set Package', active: true },
    { id: 'eq-sp-38', name: 'Radical Cystectomy with Ileal Neobladder/Ileal Conduit', category: 'Set Package', active: true },
    { id: 'eq-sp-39', name: 'ศัลยกรรมเด็ก', category: 'Set Package', active: true },
    { id: 'eq-sp-40', name: 'Thyroidectomy', category: 'Set Package', active: true },
    { id: 'eq-sp-41', name: 'FESS', category: 'Set Package', active: true },
    { id: 'eq-sp-42', name: 'Tonsillectomy', category: 'Set Package', active: true },
    { id: 'eq-sp-43', name: 'Tracheostomy', category: 'Set Package', active: true },
    { id: 'eq-sp-44', name: 'Myringotomy', category: 'Set Package', active: true },
    { id: 'eq-sp-45', name: 'Mandibulectomy', category: 'Set Package', active: true },

    // อุปกรณ์ทั่วไป (จาก Google Sheets + เดิม)
    { id: 'eq-gen-1', name: 'ถุงมือเบอร์ 6', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-2', name: 'ถุงมือเบอร์ 6 1/2', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-3', name: 'ถุงมือเบอร์ 7', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-4', name: 'ถุงมือเบอร์ 7 1/2', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-5', name: 'ถุงมือเบอร์ 8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-6', name: 'ถุงมือเบอร์ 8 1/2', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-7', name: 'Nss 0.9% 100 ml.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-8', name: 'สี Sterile (Medical Dye)', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-9', name: 'ใบมีด Dermatome', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-10', name: 'ใบมีด graft', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-11', name: 'Foley\'s cath 2 หาง No.6', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-12', name: 'Foley\'s cath 2 หาง No.8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-13', name: 'Foley\'s cath 2 หาง No.10', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-14', name: 'Foley\'s cath 2 หาง No.12', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-15', name: 'Foley\'s cath 2 หาง No.14', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-16', name: 'Foley\'s cath 2 หาง No.16', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-17', name: 'Foley\'s cath 2 หาง No.18', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-18', name: 'Foley\'s cath 2 หาง No.20', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-19', name: 'Foley\'s cath 2 หาง No.22', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-20', name: 'Foley\'s cath 2 หาง No.24', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-21', name: 'Foley\'s cath 3 หาง No.18', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-22', name: 'Foley\'s cath 3 หาง No.20', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-23', name: 'Foley\'s cath 3 หาง No.22', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-24', name: 'Cath แดง No.8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-25', name: 'Cath แดง No.10', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-26', name: 'Cath แดง No.12', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-27', name: 'Cath แดง No.14', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-28', name: 'Cath แดง No.16', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-29', name: 'Cath แดง No.18', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-30', name: 'Four wing No.12', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-31', name: 'Four wing No.14', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-32', name: 'Four wing No.16', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-33', name: 'Four wing No.18', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-34', name: 'Four wing No.20', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-35', name: 'Four wing No.22', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-36', name: 'Four wing No.24', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-37', name: 'Four wing No.26', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-38', name: 'Four wing No.28', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-39', name: 'Four wing No.30', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-40', name: 'Silicone cath 2 หาง No.14', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-41', name: 'Silicone cath 2 หาง No.16', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-42', name: 'Silicone cath 2 หาง No.18', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-43', name: 'Feeding tube No.5', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-44', name: 'Feeding tube No.6', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-45', name: 'Feeding tube No.8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-46', name: 'Feeding tube No.10', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-47', name: 'NG. No.12', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-48', name: 'NG. No.14', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-49', name: 'NG. No.16', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-50', name: 'NG. No.18', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-51', name: 'Thoracic cath No.16', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-52', name: 'Thoracic cath No.20', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-53', name: 'Thoracic cath No.24', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-54', name: 'Thoracic cath No.28', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-55', name: 'Thoracic cath No.32', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-56', name: 'Thoracic cath No.36', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-57', name: 'Set I.V.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-58', name: 'สาย Bipolar สีฟ้า', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-59', name: 'สาย Bipolar Dual สีน้ำตาล', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-60', name: 'สายจี้ Foot', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-61', name: 'สายจี้ Hand', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-62', name: 'Merocel', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-63', name: 'Elastic sterile 3"', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-64', name: 'Elastic sterile 4"', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-65', name: 'Elastic sterile 6"', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-66', name: 'Webril sterile 3"', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-67', name: 'Webril sterile 4"', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-68', name: 'Webril sterile 6"', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-69', name: 'Prolene Mesh graft เล็ก', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-70', name: 'Prolene Mesh graft ใหญ่', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-71', name: 'Gauze drain 3/4 cm.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-72', name: 'Gauze drain 1.5 cm.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-73', name: 'Gauze Heart 3x9', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-74', name: 'Gauze Ortho', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-75', name: 'ขวด Vac Drain 200 ml.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-76', name: 'ขวด Vac Drain 600 ml.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-77', name: 'เข็ม Drain No.8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-78', name: 'เข็ม Drain No.10', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-79', name: 'เข็ม Drain No.12', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-80', name: 'สาย Redivac drain No.8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-81', name: 'สาย Redivac drain No.10', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-82', name: 'สาย Redivac drain No.12', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-83', name: 'Jackson Pratt No.10', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-84', name: 'Extension Tube', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-85', name: 'Penrose drain 1/2"', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-86', name: 'Penrose drain 3/4"', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-87', name: 'Tube drain กลาง', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-88', name: 'Tube drain เล็ก', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-89', name: 'Wire Guide (PCNL)', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-90', name: 'ชุดเข็มเจาะ (PCNL)', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-91', name: 'PCN No.8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-92', name: 'PCN No.10', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-93', name: 'DJ. Stent No.4.8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-94', name: 'DJ. Stent No.6', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-95', name: 'DJ. Stent No.7', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-96', name: 'Fogarty No.2', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-97', name: 'Fogarty No.3', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-98', name: 'Fogarty No.4', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-99', name: 'Fogarty No.5', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-100', name: 'สาย RP No.3', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-101', name: 'สาย RP No.4', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-102', name: 'สาย RP No.5', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-103', name: 'สาย RP No.6', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-104', name: 'Opsite 15x28 cm.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-105', name: 'Ioban 35x35 cm.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-106', name: 'Ioban 60x45 cm.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-107', name: 'Tegaderm เล็ก (เขียว)', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-108', name: 'Tegaderm เล็ก+Pad (แดง)', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-109', name: 'Tegaderm กลาง+Pad', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-110', name: 'Leukostrip', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-111', name: 'Spongostan', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-112', name: 'Sofra-tulle', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-113', name: 'Rack เข็ม Neuro', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-114', name: 'Rack เข็ม ศัลย์', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-115', name: 'Rack เข็ม Uro', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-116', name: 'Rack เข็ม สูติ', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-117', name: 'Rack เข็ม ตรง', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-118', name: 'Rack เข็ม เย็บข้าง', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-119', name: 'เข็ม Sterile 18 x 1 1/2', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-120', name: 'เข็ม Sterile 21 x 1 1/2', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-121', name: 'เข็ม Sterile 24 x 1/2', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-122', name: 'เข็ม Sterile 25 x 1', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-123', name: 'เข็ม Sterile 25 x 1 1/2', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-124', name: 'เข็ม Sterile 27 x 1', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-125', name: 'เข็ม Sterile 27 x 1/2', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-126', name: 'Raney Clip', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-127', name: 'Cottonoid No. L', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-128', name: 'Cottonoid No. M', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-129', name: 'Transfer bag neuro', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-130', name: 'Feeding tube No.8 neuro', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-131', name: 'Feeding tube No.10 neuro', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-132', name: 'Colostomy bag พ.ศรุตา', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-133', name: 'ถุงกล้อง', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-134', name: 'Tracheostomy tube No. 6', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-135', name: 'Tracheostomy tube No. 7', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-136', name: 'Tracheostomy tube No. 7.5', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-137', name: 'Tracheostomy tube No. 8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-138', name: 'Vein stripping', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-139', name: 'Syringe Insulin 1 cc.ถอดเข็ม', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-140', name: 'Syringe 3 cc.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-141', name: 'Syringe 5 cc. / 5 cc.ล็อค', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-142', name: 'Syringe 10 cc. / 10 cc.ล็อค', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-143', name: 'Syringe 20 cc.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-144', name: 'Syringe 50 cc.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-145', name: 'Pads Valleylab (สีฟ้า)', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-146', name: 'Pads เด็ก Valleylab (สีฟ้า)', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-147', name: 'Pads เด็ก Valleylab (สีน้ำเงิน)', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-148', name: 'Pads เด็ก ไม่มีสาย', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-149', name: 'Pads ผู้ใหญ่ ไม่มีสาย', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-150', name: 'Pads ผู้ใหญ่ มีสาย', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-151', name: 'ลวด No.16', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-152', name: 'ลวด No.18', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-153', name: 'ลวด No.20', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-154', name: 'ลวด No.22', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-155', name: 'ลวด No.23', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-156', name: 'ลวด No.24', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-157', name: 'ลวด No.25', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-158', name: 'ลวด No.26', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-159', name: 'ลวด No.28', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-160', name: 'ลวด No.30', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-161', name: 'Arch bar', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-162', name: 'ถุง burr hole', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-163', name: 'Urine bag', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-164', name: 'D.S.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-165', name: 'Culture', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-166', name: 'Skin Staple', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-167', name: 'ตัว off staple', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-168', name: 'Vascular loop เล็ก-ใหญ่', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-169', name: 'Vaseline', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-170', name: 'Vaseline Gauze', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-171', name: 'ที่ขูดจี้', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-172', name: 'ปลอกจี้', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-173', name: 'แปรงสีฟัน', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-174', name: 'แผ่นสไลด์', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-175', name: 'ไม้จิ้มสี', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-176', name: 'ขวด Sterile', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-177', name: 'ไม้พันสำลี เล็ก-ใหญ่', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-178', name: 'ยางวง', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-179', name: 'ลูกสูบยาง C/S', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-180', name: 'สำลีลูกเล็ก', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-181', name: 'สำลีลูกใหญ่', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-182', name: 'หวี', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-183', name: 'Glass rod', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-184', name: 'UM.', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-185', name: 'ใบมีดตา 15 องศา', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-186', name: 'ใบมีดตา 2.8', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-187', name: 'ใบมีดตา 3.0', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-188', name: 'ไม้พันสำลีตา', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-189', name: 'ถุงน้ำตา', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-190', name: 'Eye Pad', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-gen-191', name: 'Eye Shield', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-1', name: 'Army-Navy', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-2', name: 'Richardson', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-3', name: 'Deaver', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-4', name: 'Senn', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-5', name: 'Malleable retractor', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-6', name: 'Mosquito Forceps', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-7', name: 'Kelly Forceps', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-8', name: 'Crile Forceps', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-9', name: 'Kocher Forceps', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-10', name: 'Needle Holder', category: 'อุปกรณ์ทั่วไป', active: true },
    { id: 'eq-11', name: 'Towel Clip', category: 'อุปกรณ์ทั่วไป', active: true },

    // Set เครื่องมือ
    { id: 'eq-20', name: 'Set Major Surgery (เซ็ตผ่าตัดใหญ่)', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-21', name: 'Set Minor Surgery (เซ็ตผ่าตัดเล็ก)', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-22', name: 'Set Laparoscopy Instrument (เซ็ตกล้องส่องผ่าตัด)', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-23', name: 'Set Orthopedic Basic', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-24', name: 'Set Appendectomy (เซ็ตไส้ติ่ง)', category: 'Set เครื่องมือ', active: true },

    // Set เครื่องผ้า
    { id: 'eq-30', name: 'Set ผ้าผ่าตัดทั่วไป (General Drape Set)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-31', name: 'Set ผ้าส่องกล้อง (Laparoscopy Drape)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-32', name: 'Set ผ้ากระดูกและข้อ (Ortho Drape)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-33', name: 'เสื้อกาวน์ผ่าตัด (Surgical Gown)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-34', name: 'ผ้าคลุมเตียงผ่าตัด (Drape Sheet)', category: 'Set เครื่องผ้า', active: true },

    // ตู้ Ortho
    { id: 'eq-ortho-1', name: 'Acetabulum Clamp เล็ก / ใหญ่', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-2', name: 'Aiming Device / Bone Biopsy', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-3', name: 'Bending Iron (ดัดplateมือ)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-4', name: 'Bone Clamp เล็ก/ กลาง / ใหญ่', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-5', name: 'Bone Cutter เล็ก / ใหญ่', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-6', name: 'Bone Hook / Bone Skid', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-7', name: 'Bone Rongeur Beyer / Stille', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-8', name: 'Bone Rongeur Ruskin / angle stille', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-9', name: 'Broken screw (ชุด)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-10', name: 'Cartilage set', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-11', name: 'Cervical dissector (Bone graft 7 ชิ้น)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-12', name: 'Cervical Spreader', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-13', name: 'Cloward (14ชิ้น)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-14', name: 'Cobb 9 นิ้ว ด้ามไม้ / ด้ามเหล็ก', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-15', name: 'Cobb ยาว 11นิ้ว 10 / 18 mm.', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-16', name: 'Curette (ฟันหนู 13mm/8.5mm)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-17', name: 'Curette No.', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-18', name: 'Curette spine 3 ชิ้น ตรง /โค้ง', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-19', name: 'Curette ตรง no. 3 (พ.สุวิโชติ)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-20', name: 'Depth Gauge for 3.5 / 4.5', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-21', name: 'Drill bit 1.1/1.5 /2.0 /2.5 /2.7', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-22', name: 'Drill bit 3.2/3.5/4.5/6.0', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-23', name: 'Drill sleeve 2.5/3.5', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-24', name: 'Freer (Penfield) สั้น /ยาว', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-25', name: 'Freer + ด้ามมีด No.7', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-26', name: 'Hibbs retractor เล็ก / ใหญ่', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-27', name: 'Hohmann Ret gen / โค้ง', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-28', name: 'Impactor ด้ามเหล็ก / ด้ามไม้', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-29', name: 'Jacob Chuck / Telescope', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-30', name: 'Kerrison 2 / 3/ 4 /5 mm', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-31', name: 'Kocher Clamp ตรง 1ตัว', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-32', name: 'Macdonald มีรู /ไม่มีรู', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-33', name: 'Narrow plate (ห่อ Ok.)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-34', name: 'Nerve hook / Nerve Root โค้ง', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-35', name: 'Osteotome (สิ่ว)โค้ง/ตรง........ mm', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-36', name: 'Periosteum + small hohmann', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-37', name: 'Periosteum ตรง /ด้ามเหล็ก', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-38', name: 'Protect sleeve', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-39', name: 'Reduction forceps / with point', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-40', name: 'Screw driver 3.5 / 4.5', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-41', name: 'Screw driver shaft 3.5 / 4.6', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-42', name: 'Self 8 ชิ้น / Self Laminectomy', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-43', name: 'Small hohmann', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-44', name: 'Spinal probe /Sound', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-45', name: 'Spinal Retractor /Staple set', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-46', name: 'Tap 2.7/3.5/4.0/4.5/6.5', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-47', name: 'T-handle', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-48', name: 'Towel clip', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-49', name: 'T-wrench สั้น / ยาว /หักได้', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-50', name: 'Universal chuck key', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-51', name: 'Universal drill sleeve 2.5/3.5', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-52', name: 'Universal drill sleeve 6.5', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-53', name: 'Wire cutter เล็ก / ใหญ่', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-54', name: 'Wire passer เล็ก /ใหญ่', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-55', name: 'ชุด Drill bit 4.5', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-56', name: 'Lowman clamp', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-57', name: 'Ankle Compressor (foot)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-58', name: 'block cement เข่า/ สะโพก', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-59', name: 'block cement ทำ genta bead', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-60', name: 'Calcaneous bone spreader spatula', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-61', name: 'Chisel angle 15\' / 7 mm', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-62', name: 'DCP drill sleeve (เขียวเหลือง)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-63', name: 'Femoral retractor', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-64', name: 'Flag splitter', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-65', name: 'Gelpi ret. / Gelpi ret. ขายาว', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-66', name: 'Gouge ตรง /โค้ง', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-67', name: 'Guide wire for c-spine', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-68', name: 'K-wire spreader (foot)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-69', name: 'Lamina spreader', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-70', name: 'Meyerding Ret.(พ.อาทิตย์ ม.)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-71', name: 'Mikimon self retaining (Self พ.สุวิโชติ)', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-72', name: 'Milligant discectomy', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-73', name: 'Osteotome ตรง 7 มม.ยาว 16.5"', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-74', name: 'Pelvic reduction clamp', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-75', name: 'Reposition forceps เล็ก /ใหญ่', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-76', name: 'Retractor ขาเดียว/ พ.เกษม', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-77', name: 'Reverse curette 6 mm', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-78', name: 'William micro discectomy 1x5 mm', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-79', name: 'William micro discectomy 1x7 mm', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-80', name: 'William micro discectomy 2x5 mm', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-81', name: 'ค้อน 300/ 350/500/700/900', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-82', name: 'คีมปากแบน / แหลม', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-83', name: 'คีมล็อค', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-84', name: 'ชุด C-Spine ( 7 ชิ้น )', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-85', name: 'ชุด ใส่ Plate นิ้ว ( 12 ชิ้น )', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-86', name: 'ตัวจับหมุด', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-87', name: 'ตัวย้ำ K-wire', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-88', name: 'ถ้วย Cement', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-89', name: 'ถุง Scope / ถุง X-ray', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-90', name: 'ถุง Stockinette Hip/Knee', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-91', name: 'ถุงกล้อง liga', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-92', name: 'ที่จี้เส้นประสาท พ.สุรศักดิ์', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-93', name: 'ที่ดัด K-wire + Impactor', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-94', name: 'ที่ดัด-ตัด K-wire /คีมดัด K-wire', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-95', name: 'ใบเลื่อย No…..', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-96', name: 'ประแจ No.8 / 11 /10', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-97', name: 'ไม้บรรทัด เหล็ก /สั้น / ยาว', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-98', name: 'ยางเทาฟ้า 6/ 4 / 3', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-99', name: 'สาย Small air drill', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-100', name: 'สิ่ว ตรง,โค้ง', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-101', name: 'สิ่ว 9", 12 / 6 mm', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-102', name: 'สิ่วด้ามเหล็ก 11", 25mm ตรง/ โค้ง', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-103', name: 'สิ่วตรงยาว (ด้ามไม้)............... mm', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-104', name: 'ห่อ K-wire / Steinmann pin', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-105', name: 'หัว Sagittal saw', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-106', name: 'หัวต่อ reamer ของ Aesculap drill', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-107', name: 'หัวต่อ saw ของ Aesculap drill', category: 'ตู้ Ortho', active: true },
    { id: 'eq-ortho-108', name: 'เหล็ก X-ray', category: 'ตู้ Ortho', active: true },

    // ตู้ Neuro
    { id: 'eq-neuro-1', name: 'Bipolar forceps', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-2', name: 'Brain spatula (1ชิ้น/6ชิ้น)', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-3', name: 'Chinese Finger splint', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-4', name: 'Codman disp perforator', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-5', name: 'Dissection of hand', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-6', name: 'Flu cloth', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-7', name: 'Gigli saw handle + แผ่นรอง', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-8', name: 'Hand drill', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-9', name: 'Microsurgery Hand สีเงิน / สีฟ้า', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-10', name: 'Miniplate set 1.7 / 2.0', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-11', name: 'Self thyroid เล็ก / ใหญ่', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-12', name: 'Self thyroid หักได้', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-13', name: 'Set ต่อ Nerve', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-14', name: 'Skull tong', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-15', name: 'V-P Shunt handle', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-16', name: 'V-P Shunt passer (ไกด์ยาว)', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-17', name: 'เครื่องมือ hand (พ.มีนา)', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-18', name: 'ชุดหัว Burr / Twist drill', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-19', name: 'ดอกสว่าน', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-20', name: 'ใบเลื่อย', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-21', name: 'หัวกรอ 3 / 5 m.m.', category: 'ตู้ Neuro', active: true },
    { id: 'eq-neuro-22', name: 'หัวใบพาย', category: 'ตู้ Neuro', active: true },

    // ตู้ General
    { id: 'eq-genr-1', name: 'Abdominal เล็ก / กลาง', category: 'ตู้ General', active: true },
    { id: 'eq-genr-2', name: 'Allis สั้น / ยาว', category: 'ตู้ General', active: true },
    { id: 'eq-genr-3', name: 'Army navy retractor', category: 'ตู้ General', active: true },
    { id: 'eq-genr-4', name: 'Arterial clamp ตรง / โค้ง', category: 'ตู้ General', active: true },
    { id: 'eq-genr-5', name: 'Babcock สั้น / ยาว', category: 'ตู้ General', active: true },
    { id: 'eq-genr-6', name: 'Deep retractor สั้น / ยาว', category: 'ตู้ General', active: true },
    { id: 'eq-genr-7', name: 'Deaver เล็ก / ใหญ่ / กลาง', category: 'ตู้ General', active: true },
    { id: 'eq-genr-8', name: 'Deaver หน้ากว้าง / sweet heart', category: 'ตู้ General', active: true },
    { id: 'eq-genr-9', name: 'Dilator rectum 18,14,10 ชิ้น', category: 'ตู้ General', active: true },
    { id: 'eq-genr-10', name: 'Intestinal clamps ตรง / โค้ง', category: 'ตู้ General', active: true },
    { id: 'eq-genr-11', name: 'Intestinal right angle', category: 'ตู้ General', active: true },
    { id: 'eq-genr-12', name: 'Kocher clamp โค้ง (4 ตัว)', category: 'ตู้ General', active: true },
    { id: 'eq-genr-13', name: 'Mosquito โค้ง (3 ตัว) , ตรง (3ตัว)', category: 'ตู้ General', active: true },
    { id: 'eq-genr-14', name: 'Pean curve ( 6ตัว )', category: 'ตู้ General', active: true },
    { id: 'eq-genr-15', name: 'Payr clamp 2 ตัว', category: 'ตู้ General', active: true },
    { id: 'eq-genr-16', name: 'Procto ที่ถ่างก้น', category: 'ตู้ General', active: true },
    { id: 'eq-genr-17', name: 'Procto ธรรมดา / ผ่ากลาง', category: 'ตู้ General', active: true },
    { id: 'eq-genr-18', name: 'Purse string clamp', category: 'ตู้ General', active: true },
    { id: 'eq-genr-19', name: 'Retractor กาบกล้วย', category: 'ตู้ General', active: true },
    { id: 'eq-genr-20', name: 'Retractor เจาะคอ', category: 'ตู้ General', active: true },
    { id: 'eq-genr-21', name: 'Right angle 4 ตัว', category: 'ตู้ General', active: true },
    { id: 'eq-genr-22', name: 'Saint Mark ธรรมดา /ปลายยาวงอ', category: 'ตู้ General', active: true },
    { id: 'eq-genr-23', name: 'Self ศัลย์ 9 ชิ้น', category: 'ตู้ General', active: true },
    { id: 'eq-genr-24', name: 'Spatula มีรู', category: 'ตู้ General', active: true },
    { id: 'eq-genr-25', name: 'Sponge holder ตรง / โค้ง 2 ตัว', category: 'ตู้ General', active: true },
    { id: 'eq-genr-26', name: 'Tonsil clamp 2 ตัว ปลายแหลม, ธรรมดา', category: 'ตู้ General', active: true },
    { id: 'eq-40', name: 'Scalpel Handle #3 / #4 (ด้ามมีดผ่าตัด)', category: 'ตู้ General', active: true },
    { id: 'eq-41', name: 'Electrocautery Pencil (ด้ามจี้ไฟฟ้า)', category: 'ตู้ General', active: true },
    { id: 'eq-42', name: 'Harmonic Scalpel Handpiece', category: 'ตู้ General', active: true },
    { id: 'eq-43', name: 'Skin Stapler', category: 'ตู้ General', active: true },
    { id: 'eq-44', name: 'Suction Tip (Yankauer / Poole)', category: 'ตู้ General', active: true },

    // ตู้ Plastic
    { id: 'eq-plas-1', name: 'Deep retractor ยาว (in-out) คู่', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-2', name: 'Deep retractor ยาว (out) 1 ตัว', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-3', name: 'Pig tail', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-4', name: 'Set orthognathic (ทันตกรรม)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-5', name: 'Setถอนฟัน 34 ชิ้น', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-6', name: 'Tongue blade', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-7', name: 'Towel clip พ.ธนพงษ์', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-8', name: 'Wire suspension', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-9', name: 'Wire twister', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-10', name: 'Senn retractor', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-11', name: 'กรรไกร Mayo 6", ยาว 9"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-12', name: 'กรรไกรตัดลวด', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-13', name: 'กรรไกรตัดไหม สั้น 6", ยาว 8" 9"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-14', name: 'กระจกส่องฟัน', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-15', name: 'กล่องลวด Plastic', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-16', name: 'เข็มร้อยลวด', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-17', name: 'ด้ามมีดกร๊าฟ', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-18', name: 'ด้ามมีดเล็กสั้น No.3 / 4 / 7 / 3L', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-19', name: 'ที่งัดจมูก 4 ชิ้น', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-20', name: 'ที่ดัด Plate พ.พัลลภา', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-21', name: 'ที่แยงท่อน้ำตา', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-22', name: 'ไม้กดลิ้น', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-23', name: 'ไม้กร๊าฟ', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-24', name: 'วงเวียน', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-25', name: 'สายลม Mini Air drill', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-26', name: 'หัว Drill of Mini Air drill', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-27', name: 'หัวจี้ยาว', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-28', name: 'หัวต่อ Suction เหล็ก', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-29', name: 'หัวยิง K-wire', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-30', name: 'Bayonet forceps', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-31', name: 'Bone hook เล็ก / ใหญ่', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-32', name: 'Bulldog clamp 3 ตัว', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-33', name: 'Dent Heart เล็ก / ใหญ่', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-34', name: 'Dermatel 2 ตัว', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-35', name: 'Dingman', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-36', name: 'Double hook / Skin hook', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-37', name: 'Duhamel', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-38', name: 'Forceps 7" (tooth,non-tooth) หนา,บาง', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-39', name: 'Hand piece of Mini Air drill', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-40', name: 'Jeweler forceps angle', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-41', name: 'Jeweler forceps ตรง', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-42', name: 'Kocher dissector', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-43', name: 'Long Forceps 10" (tooth,non-tooth), 12"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-44', name: 'Mandible reduction', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-45', name: 'Maxillary elevator', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-46', name: 'Metzenbaum 10"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-47', name: 'Metzenbaum 6"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-48', name: 'Metzenbaum 7"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-49', name: 'Metzenbaum 8"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-50', name: 'Metzenbaum 9"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-51', name: 'Metzenbaum ปลายแหลมเล็ก', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-52', name: 'Micro forceps', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-53', name: 'Micro Needle', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-54', name: 'Micro scissors', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-55', name: 'Mouth gag', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-56', name: 'Mouth prop (น้ำตาล)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-57', name: 'Nasal retractor', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-58', name: 'Nasal Volkman', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-59', name: 'Needle biopsy 3 ตัว', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-60', name: 'Needle Bx. 5 ชิ้น', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-61', name: 'Needle holder 10" (ปลายงอ/พ.เขียว)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-62', name: 'Needle จับลวด', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-63', name: 'Needle ด้ามทอง 10"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-64', name: 'Needle ด้ามทอง 5"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-65', name: 'Needle ด้ามทอง 6"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-66', name: 'Needle ด้ามทอง 7"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-67', name: 'Needle ด้ามทอง 8"', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-68', name: 'Periosteum + Zygoma', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-69', name: 'Periosteum + ตะไบ', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-70', name: 'Periosteum ORIF', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-71', name: 'Periosteum ฝนจมูก', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-72', name: 'Periosteum เล็ก', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-73', name: 'Probe ธรรมดา / หางปลา', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-74', name: 'Rib Retractor (พ.พงษ์สิทธิ์)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-75', name: 'Screw driver 2.0 เล็ก / ใหญ่', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-76', name: 'Screw driver 1.7 / 1.6 กล่องใหญ่', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-77', name: 'Septum knife', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-78', name: 'Set ถอนฟัน 7 ชิ้น', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-79', name: 'Short forceps (tooth-non,tooth)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-80', name: 'Suction tube 8/10/12/15', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-81', name: 'Suction หลายรู เล็ก /ใหญ่', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-82', name: 'Trocar gallbladder+guide', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-83', name: 'Vascular approximator', category: 'ตู้ Plastic', active: true },
    { id: 'eq-plas-84', name: 'Volkman 2 ตัว', category: 'ตู้ Plastic', active: true },
    { id: 'eq-50', name: 'Micro Scissors (กรรไกรตกแต่งศัลยกรรม)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-51', name: 'Adson Tooth Forceps (1x2)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-52', name: 'Plastic Needle Holder (Castroviejo)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-53', name: 'Skin Hook Retractor', category: 'ตู้ Plastic', active: true },
    { id: 'eq-54', name: 'Freer Elevator', category: 'ตู้ Plastic', active: true },

    // ตู้ Ob-gyn
    { id: 'eq-obgyn-1', name: 'A-P retractor', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-2', name: 'Curette suction', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-3', name: 'Curettage สูติ 10 ชิ้น , 17 ชิ้น', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-4', name: 'Doyen retractor', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-5', name: 'Forceps สูติ', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-6', name: 'Heaney clamp', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-7', name: 'Hook เกี่ยว tube', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-8', name: 'Posterior retractor', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-9', name: 'Retractor พ.พัลลภ 3 ชิ้น', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-10', name: 'Russian 7", 9"', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-11', name: 'Silver cath สั้น / ยาว', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-12', name: 'Speculum', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-13', name: 'Tenaculum', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-14', name: 'Uterine clamp', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-15', name: 'Uterine elevator', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-16', name: 'Wertheim angie', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-17', name: 'อุปกรณ์ฉีดสีทาง Vagina 1', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-18', name: 'Myoma Screw', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-19', name: 'Curette สูติ 10 ชิ้น', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-20', name: 'Breisky Retractor', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-obgyn-21', name: 'Self TAH', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-60', name: 'Set ผ่าตัดทำคลอด C-Section', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-61', name: 'Vaginal Speculum (Graves/Pederson)', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-62', name: 'Tenaculum Forceps', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-63', name: 'Uterine Sound', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-64', name: 'Ovum Forceps / Curette', category: 'ตู้ Ob-gyn', active: true },

    // ตู้ Uro + Ob-gyn
    { id: 'eq-uro-1', name: 'Dilator urethra ตรง 9,13,14', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-2', name: 'Gelpi retractor 1 คู่ โค้ง', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-3', name: 'Kidney stone 13 ชิ้น', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-4', name: 'Micro needle URO ( 1 คู่ )', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-5', name: 'Micro scissor ตรง / โค้ง', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-6', name: 'Mixter right angle 2 ตัว', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-7', name: 'Needle 5"', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-8', name: 'Pedicle clamps 4 ตัว', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-9', name: 'Periosteum+Rib shear', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-10', name: 'Retractor จิ๋ว สั้น / ยาว', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-11', name: 'Rib cutter', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-12', name: 'Stamey needle 3 อัน', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-13', name: 'Suction tip R.17/Suction plastic', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-14', name: 'Stone forceps', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-15', name: 'Turner Warwick 1 คู่', category: 'ตู้ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-16', name: 'ไม้บรรทัด URO', category: 'ตู้ Uro + Ob-gyn', active: true }
];

// Global State
let equipmentList = [];
let borrowRecords = [];
let currentFilter = { status: 'all', datePreset: 'all', dateExact: '', search: '', orRoom: '' };
let isTimeSortDesc = true;

// --------------------------------------------------------------------------
// 2. App Initialization & Real-time Listeners (v10 Auto-healing)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initApp();

    // Listen to Firebase Connection Status
    if (db) {
        db.ref('.info/connected').on('value', (snap) => {
            const badge = document.getElementById('firebase-status-badge');
            if (snap.val() === true) {
                if (badge) {
                    badge.className = 'firebase-badge connected';
                    badge.innerHTML = '<i class="fa-solid fa-cloud-check"></i> <span>ออนไลน์ (Firebase)</span>';
                }
            } else {
                if (badge) {
                    badge.className = 'firebase-badge pending';
                    badge.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>กำลังเชื่อมต่อ...</span>';
                }
            }
        });

        // Sync Borrow Records
        db.ref('borrow_records').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && Array.isArray(data)) {
                borrowRecords = data;
                localStorage.setItem('surgical_borrow_records_v10', JSON.stringify(borrowRecords));
                if (typeof renderBorrowTable === 'function') renderBorrowTable();
                if (typeof updateStatistics === 'function') updateStatistics();
            } else if (!data) {
                borrowRecords = [];
                saveRecordsToStorage();
            }
        }, (error) => {
            console.error("Firebase Records listener error:", error);
            const badge = document.getElementById('firebase-status-badge');
            if (badge) {
                badge.className = 'firebase-badge error';
                badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span>ติดสิทธิ์ Firebase</span>';
            }
        });

        // Sync Equipment Items with Auto-healing
        db.ref('equipment_items').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && Array.isArray(data)) {
                const isCorrupted = data.some(item => item.category && (item.category.includes('à') || item.category.includes('?')));
                if (isCorrupted || data.length < 50) {
                    equipmentList = [...INITIAL_EQUIPMENT_LIST];
                    if (db) db.ref('equipment_items').set(equipmentList);
                } else {
                    equipmentList = data;
                    let updated = false;
                    INITIAL_EQUIPMENT_LIST.forEach(initItem => {
                        if (!equipmentList.some(item => item.id === initItem.id || item.name === initItem.name)) {
                            equipmentList.push(initItem);
                            updated = true;
                        }
                    });
                    if (updated && db) db.ref('equipment_items').set(equipmentList);
                }
                localStorage.setItem('surgical_equipment_items_v10', JSON.stringify(equipmentList));
                if (typeof renderBorrowTable === 'function') renderBorrowTable();
            } else if (!data) {
                equipmentList = [...INITIAL_EQUIPMENT_LIST];
                localStorage.setItem('surgical_equipment_items_v10', JSON.stringify(equipmentList));
                if (typeof renderBorrowTable === 'function') renderBorrowTable();
            }
        });
    } else {
        const badge = document.getElementById('firebase-status-badge');
        if (badge) {
            badge.className = 'firebase-badge error';
            badge.innerHTML = '<i class="fa-solid fa-plug-circle-xmark"></i> <span>ไม่ได้เชื่อม Firebase</span>';
        }
    }

    // Listen to LocalStorage updates from Prep Room (index.html)
    // Listen to real-time submission from status.html on same browser/device
    window.addEventListener('storage', (e) => {
        if (e.key === 'surgical_borrow_records_v10' || e.key === 'surgical_equipment_items_v10') {
            loadStateFromStorage();
            if (typeof renderBorrowTable === 'function') renderBorrowTable();
            if (typeof updateStatistics === 'function') updateStatistics();
        }
    });
});

function initApp() {
    loadStateFromStorage();
    setupORRoomDropdowns();
    renderBorrowTable();
    updateStatistics();
    setupThemeFromPreferences();
}

function loadStateFromStorage() {
    const savedEq = localStorage.getItem('surgical_equipment_items_v10');
    if (savedEq) {
        try {
            equipmentList = JSON.parse(savedEq);
            const isCorrupted = equipmentList.some(item => item.category && (item.category.includes('à') || item.category.includes('?')));
            if (isCorrupted || equipmentList.length < 50) {
                equipmentList = JSON.parse(JSON.stringify(INITIAL_EQUIPMENT_LIST));
                saveEquipmentToStorage();
            }
        } catch (e) {
            equipmentList = JSON.parse(JSON.stringify(INITIAL_EQUIPMENT_LIST));
            saveEquipmentToStorage();
        }
    } else {
        equipmentList = JSON.parse(JSON.stringify(INITIAL_EQUIPMENT_LIST));
        saveEquipmentToStorage();
    }

    const savedRecords = localStorage.getItem('surgical_borrow_records_v10');
    if (savedRecords) {
        try {
            borrowRecords = JSON.parse(savedRecords);
        } catch (e) {
            borrowRecords = [];
        }
    } else {
        borrowRecords = [];
    }
}

function saveEquipmentToStorage() {
    localStorage.setItem('surgical_equipment_items_v10', JSON.stringify(equipmentList));
}

function saveRecordsToStorage() {
    localStorage.setItem('surgical_borrow_records_v10', JSON.stringify(borrowRecords));
    if (db) {
        db.ref('borrowRecords').set(borrowRecords);
    }
}

function setupORRoomDropdowns() {
    const filterSelect = document.getElementById('or-room-filter');
    if (!filterSelect) return;
    
    filterSelect.innerHTML = '<option value="">ทุกห้องผ่าตัด (OR 1 - 20)</option>';
    for (let i = 1; i <= 20; i++) {
        filterSelect.innerHTML += `<option value="OR ${i}">OR ${i}</option>`;
    }
}

function setFilterStatus(status) {
    currentFilter.status = status;
    document.querySelectorAll('.segment-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.status === status);
    });
    renderBorrowTable();
}

function handleSearchFilter() {
    let searchEl = document.getElementById('search-input');
    let dateEl = document.getElementById('date-filter-input');
    let orEl = document.getElementById('or-room-filter');
    
    if (searchEl) currentFilter.search = searchEl.value.trim().toLowerCase();
    if (dateEl) currentFilter.dateExact = dateEl.value;
    if (orEl) currentFilter.orRoom = orEl.value;
    
    let clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) clearBtn.style.display = currentFilter.search ? 'block' : 'none';
    
    if (currentFilter.dateExact) {
        currentFilter.datePreset = 'custom';
        document.querySelectorAll('.btn-preset').forEach(btn => btn.classList.remove('active'));
    }
    
    renderBorrowTable();
}

function clearSearch() {
    let searchEl = document.getElementById('search-input');
    if (searchEl) searchEl.value = '';
    handleSearchFilter();
}

function setDatePreset(preset) {
    currentFilter.datePreset = preset;
    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.preset === preset);
    });
    
    if (preset !== 'custom') {
        let dateEl = document.getElementById('date-filter-input');
        if (dateEl) {
            dateEl.value = '';
        }
        currentFilter.dateExact = '';
    }
    renderBorrowTable();
}

function resetFilters() {
    currentFilter = { status: 'all', datePreset: 'all', dateExact: '', search: '', orRoom: '' };
    
    let searchEl = document.getElementById('search-input');
    let dateEl = document.getElementById('date-filter-input');
    let orEl = document.getElementById('or-room-filter');
    let clearBtn = document.getElementById('clear-search-btn');
    
    if (searchEl) searchEl.value = '';
    if (dateEl) dateEl.value = '';
    if (orEl) orEl.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    
    document.querySelectorAll('.segment-btn').forEach(btn => btn.classList.remove('active'));
    let allBtn = document.querySelector('.segment-btn[data-status="all"]');
    if (allBtn) allBtn.classList.add('active');
    
    document.querySelectorAll('.btn-preset').forEach(btn => btn.classList.remove('active'));
    let presetBtn = document.querySelector('.btn-preset[data-preset="all"]');
    if (presetBtn) presetBtn.classList.add('active');
    
    renderBorrowTable();
}

function toggleTimeSortOrder() {
    isTimeSortDesc = !isTimeSortDesc;
    const icon = document.getElementById('sort-time-icon');
    const label = document.getElementById('sort-time-label');
    
    if (isTimeSortDesc) {
        if (icon) icon.className = 'fa-solid fa-arrow-up-short-wide';
        if (label) label.textContent = 'เรียงตามเวลา: ยื่นส่งล่าสุดขึ้นก่อน (LIFO)';
    } else {
        if (icon) icon.className = 'fa-solid fa-arrow-down-short-wide';
        if (label) label.textContent = 'เรียงตามเวลา: ยื่นส่งก่อนขึ้นก่อน (FIFO)';
    }
    renderBorrowTable();
}

function renderBorrowTable() {
    const tbody = document.getElementById('borrow-table-body');
    const emptyState = document.getElementById('empty-state');
    if (!tbody || !emptyState) return;

    let filtered = borrowRecords.filter(record => {
        if (currentFilter.status !== 'all' && record.status !== currentFilter.status) return false;
        
        const eqList = record.equipmentList || record.instruments || [];
        const useDateStr = record.useDate || record.usageDate || '';
        
        if (currentFilter.search) {
            const searchStr = `${record.borrowerName || ''} ${record.orRoom || ''} ${eqList.map(e => e.name || '').join(' ')}`.toLowerCase();
            if (!searchStr.includes(currentFilter.search)) return false;
        }
        
        if (currentFilter.orRoom && record.orRoom !== currentFilter.orRoom) return false;
        
        if (currentFilter.dateExact || (currentFilter.datePreset && currentFilter.datePreset !== 'all')) {
            if (!useDateStr) return false;
            const recordDate = new Date(useDateStr);
            recordDate.setHours(0,0,0,0);
            const today = new Date();
            today.setHours(0,0,0,0);
            
            if (currentFilter.dateExact) {
                const exactDate = new Date(currentFilter.dateExact);
                exactDate.setHours(0,0,0,0);
                if (recordDate.getTime() !== exactDate.getTime()) return false;
            } else if (currentFilter.datePreset === 'today') {
                if (recordDate.getTime() !== today.getTime()) return false;
            } else if (currentFilter.datePreset === 'yesterday') {
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                if (recordDate.getTime() !== yesterday.getTime()) return false;
            } else if (currentFilter.datePreset === '7days') {
                const sevenDaysAgo = new Date(today);
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                if (recordDate.getTime() < sevenDaysAgo.getTime() || recordDate.getTime() > today.getTime()) return false;
            }
        }
        
        return true;
    });

    filtered.sort((a, b) => {
        const timeA = getRecordTimestamp(a);
        const timeB = getRecordTimestamp(b);
        return isTimeSortDesc ? timeB - timeA : timeA - timeB;
    });

    tbody.innerHTML = '';
    if (filtered.length === 0) {
        tbody.parentElement.parentElement.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        tbody.parentElement.parentElement.style.display = 'block';
        emptyState.style.display = 'none';
        
        filtered.forEach(record => {
            const tr = document.createElement('tr');
            
            const eqList = record.equipmentList || record.instruments || [];
            let eqHtml = eqList.map(eq => {
                const qty = eq.quantity || eq.qty || 1;
                return `<span class="equipment-pill">${escapeHtml(eq.name)} <span class="qty-badge">${qty}</span></span>`;
            }).join('');
            
            let statusHtml = '';
            if (record.status === 'pending') statusHtml = '<span class="status-badge pending"><i class="fa-solid fa-clock"></i> อยู่ระหว่างจัดเตรียม</span>';
            else if (record.status === 'ready') statusHtml = '<span class="status-badge ready"><i class="fa-solid fa-check-circle"></i> จัดเสร็จแล้ว</span>';
            else if (record.status === 'borrowed') statusHtml = '<span class="status-badge overdue"><i class="fa-solid fa-hand-holding-hand"></i> ถูกยืมไปแล้ว</span>';
            else if (record.status === 'returned') statusHtml = '<span class="status-badge returned"><i class="fa-solid fa-rotate-left"></i> คืนแล้ว</span>';
            
            let actionBtns = '';
            let printBtn = `<button class="btn-outline btn-sm" onclick="printBorrowDocument('${record.id}')" title="พิมพ์ใบจัดเตรียม"><i class="fa-solid fa-print"></i></button>`;
            
            if (record.status === 'pending') {
                actionBtns = `
                    <button class="btn-ready-action" onclick="updateRecordStatus('${record.id}', 'ready')">
                        <i class="fa-solid fa-check"></i> จัดเตรียมเรียบร้อย
                    </button>
                    ${printBtn}
                `;
            } else if (record.status === 'ready') {
                actionBtns = printBtn;
            } else if (record.status === 'borrowed') {
                actionBtns = `
                    <button class="btn-success btn-sm" onclick="openReturnModal('${record.id}')">
                        <i class="fa-solid fa-rotate-left"></i> รับคืน
                    </button>
                    ${printBtn}
                `;
            } else if (record.status === 'returned') {
                actionBtns = `
                    <button class="btn-danger btn-sm" onclick="deleteBorrowRecord('${record.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    ${printBtn}
                `;
            }

            const createdTimeStr = getRecordTimeFormatted(record);
            const useDateStr = record.useDate || record.usageDate;
            const returnDateStr = record.returnDate || record.expectedReturnDate;

            tr.innerHTML = `
                <td><span class="or-badge">${record.orRoom}</span></td>
                <td>
                    <div class="borrower-name-cell">${escapeHtml(record.borrowerName)}</div>
                    ${record.employeeId ? `<div class="borrower-id-sub">ID: ${escapeHtml(record.employeeId)}</div>` : ''}
                </td>
                <td><div class="equipment-tags-list">${eqHtml}</div></td>
                <td>${createdTimeStr}</td>
                <td>${formatDateThai(useDateStr)}</td>
                <td>${formatDateThai(returnDateStr)}</td>
                <td>${statusHtml}</td>
                <td style="text-align: right;">
                    <div class="table-actions-cell" style="justify-content: flex-end;">
                        ${actionBtns}
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    updateStatistics();
}

function getRecordTimestamp(record) {
    if (record.createdAt) return new Date(record.createdAt).getTime();
    if (record.requestDate) {
        const timeStr = record.requestTime || '00:00';
        return new Date(`${record.requestDate}T${timeStr}`).getTime();
    }
    return 0;
}

function getRecordTimeFormatted(record) {
    if (record.createdAt) return formatDateThaiTime(record.createdAt);
    if (record.requestDate) {
        const timeStr = record.requestTime ? ` เวลา ${record.requestTime} น.` : '';
        return `${formatDateThai(record.requestDate)}${timeStr}`;
    }
    return '-';
}

function updateStatistics() {
    let statPending = 0;
    let statReady = 0;
    let statOverdue = 0;
    let statTotal = borrowRecords.length;

    borrowRecords.forEach(record => {
        if (record.status === 'pending') statPending++;
        else if (record.status === 'ready') statReady++;
        else if (record.status === 'borrowed') {
            const today = new Date();
            today.setHours(0,0,0,0);
            const returnDateStr = record.returnDate || record.expectedReturnDate;
            if (returnDateStr) {
                const returnDate = new Date(returnDateStr);
                returnDate.setHours(0,0,0,0);
                if (returnDate < today) {
                    statOverdue++;
                }
            }
        }
    });

    if (document.getElementById('stat-total')) document.getElementById('stat-total').textContent = statTotal;
    if (document.getElementById('stat-pending')) document.getElementById('stat-pending').textContent = statPending;
    if (document.getElementById('stat-ready')) document.getElementById('stat-ready').textContent = statReady;
    if (document.getElementById('stat-overdue')) document.getElementById('stat-overdue').textContent = statOverdue;
}

function updateRecordStatus(recordId, newStatus) {
    const index = borrowRecords.findIndex(r => r.id === recordId);
    if (index !== -1) {
        borrowRecords[index].status = newStatus;
        saveRecordsToStorage();
        renderBorrowTable();
        updateStatistics();
    }
}

function deleteBorrowRecord(recordId) {
    if (confirm('คุณต้องการลบประวัติการยืมนี้ใช่หรือไม่?')) {
        borrowRecords = borrowRecords.filter(r => r.id !== recordId);
        saveRecordsToStorage();
        renderBorrowTable();
        updateStatistics();
    }
}

let currentReturnRecordId = null;
function openReturnModal(id) {
    currentReturnRecordId = id;
    const record = borrowRecords.find(r => r.id === id);
    if (!record) return;
    
    const eqList = record.equipmentList || record.instruments || [];
    document.getElementById('return-summary-box').innerHTML = `
        <p><strong>ผู้เบิก:</strong> ${escapeHtml(record.borrowerName)} <strong>OR:</strong> ${record.orRoom}</p>
        <p><strong>รายการ:</strong> ${eqList.map(e => `${e.name} (${e.qty || e.quantity || 1})`).join(', ')}</p>
    `;
    
    document.getElementById('actual-return-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('return-modal').style.display = 'flex';
}

function closeReturnModal() {
    document.getElementById('return-modal').style.display = 'none';
    currentReturnRecordId = null;
}

function confirmReturnSubmit(e) {
    e.preventDefault();
    if (!currentReturnRecordId) return;
    updateRecordStatus(currentReturnRecordId, 'returned');
    closeReturnModal();
}

let qrCodeInstance = null;

function openQRCodeModal() {
    const modal = document.getElementById('qrcode-modal');
    if (modal) modal.style.display = 'flex';

    const qrContainer = document.getElementById('qrcode-canvas');
    if (qrContainer) {
        qrContainer.innerHTML = '';
        
        let targetUrl = window.location.href;
        if (targetUrl.includes('index.html')) {
            targetUrl = targetUrl.replace('index.html', 'status.html');
        } else {
            const lastSlash = targetUrl.lastIndexOf('/');
            targetUrl = targetUrl.substring(0, lastSlash + 1) + 'status.html';
        }

        if (typeof QRCode !== 'undefined') {
            try {
                qrCodeInstance = new QRCode(qrContainer, {
                    text: targetUrl,
                    width: 200,
                    height: 200,
                    colorDark: "#0284c7",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            } catch (e) {
                console.error("QRCode JS error:", e);
                renderFallbackQR(qrContainer, targetUrl);
            }
        } else {
            renderFallbackQR(qrContainer, targetUrl);
        }
    }
}

function renderFallbackQR(container, url) {
    const apiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&color=0284c7`;
    container.innerHTML = `<img src="${apiQrUrl}" alt="QR Code" style="width:200px; height:200px; border-radius:12px; margin: 0 auto; display: block; box-shadow:0 4px 12px rgba(0,0,0,0.1);">`;
}

function closeQRCodeModal() {
    document.getElementById('qrcode-modal').style.display = 'none';
}

function printQRCode() {
    window.print();
}

let currentPrintRecordId = null;
function printBorrowDocument(id) {
    currentPrintRecordId = id;
    const record = borrowRecords.find(r => r.id === id);
    if (!record) return;
    
    const container = document.getElementById('printable-checklist-container');
    if (!container) return;
    
    const eqList = record.equipmentList || record.instruments || [];
    let eqListHtml = eqList.map(eq => `
        <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; padding: 0.5rem 0;">
            <span><i class="fa-regular fa-square"></i> ${eq.name}</span>
            <span>${eq.qty || eq.quantity || 1} ชิ้น</span>
        </div>
    `).join('');
    
    const useDateStr = record.useDate || record.usageDate;
    const returnDateStr = record.returnDate || record.expectedReturnDate;

    container.innerHTML = `
        <div class="print-doc-header">
            <div class="print-header-brand">
                <i class="fa-solid fa-hospital"></i>
                <div>
                    <h2>ใบจัดเตรียมเครื่องมือผ่าตัด</h2>
                    <p>Surgical Equipment Prep Checklist</p>
                </div>
            </div>
            <div class="print-doc-ref">
                <div class="print-or-badge">${record.orRoom}</div>
                <div class="print-ref-id">REF: ${record.id.substring(0,8)}</div>
            </div>
        </div>
        <div class="print-info-grid">
            <div class="print-info-item"><span class="label">ชื่อผู้เบิก:</span><span class="value">${escapeHtml(record.borrowerName)}</span></div>
            <div class="print-info-item"><span class="label">รหัสพนักงาน:</span><span class="value">${escapeHtml(record.employeeId || '-')}</span></div>
            <div class="print-info-item"><span class="label">วันที่ใช้:</span><span class="value">${formatDateThai(useDateStr)}</span></div>
            <div class="print-info-item"><span class="label">กำหนดคืน:</span><span class="value">${formatDateThai(returnDateStr)}</span></div>
        </div>
        <div style="margin-top: 1.5rem;">
            <h4 style="margin-bottom: 1rem; border-bottom: 1px solid #000; padding-bottom: 0.5rem;">รายการเครื่องมือ (Checklist)</h4>
            ${eqListHtml}
        </div>
        <div style="margin-top: 3rem; display: flex; justify-content: space-between; text-align: center;">
            <div>
                <p>_________________________</p>
                <p>ผู้จัดเตรียม (ผู้จ่าย)</p>
            </div>
            <div>
                <p>_________________________</p>
                <p>ผู้รับอุปกรณ์ (ผู้เบิก)</p>
            </div>
        </div>
    `;
    
    document.getElementById('checklist-print-modal').style.display = 'flex';
}

function closeChecklistModal() {
    document.getElementById('checklist-print-modal').style.display = 'none';
}

function triggerChecklistPrint() {
    window.print();
}

function openEquipmentManager() {
    const modal = document.getElementById('equipment-manager-modal');
    if (modal) modal.style.display = 'flex';
    renderEquipmentManageTable();
}

function closeEquipmentManager() {
    document.getElementById('equipment-manager-modal').style.display = 'none';
}

function renderEquipmentManageTable() {
    const tbody = document.getElementById('equipment-manager-table-body') || document.getElementById('equipment-table-body');
    if (!tbody) return;

    if (!equipmentList || equipmentList.length === 0) {
        equipmentList = [...INITIAL_EQUIPMENT_LIST];
    }

    let filtered = equipmentList;
    if (currentFilter && currentFilter.category && currentFilter.category !== 'all') {
        filtered = equipmentList.filter(eq => eq.category === currentFilter.category);
    }

    tbody.innerHTML = '';
    filtered.forEach((eq, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:600; color:var(--text-muted);">${idx + 1}</td>
            <td><span class="equipment-pill">${escapeHtml(eq.category)}</span></td>
            <td style="font-weight:600;">${escapeHtml(eq.name)}</td>
            <td>
                <label class="switch">
                    <input type="checkbox" ${eq.active !== false ? 'checked' : ''} onchange="toggleEquipmentActive('${eq.id}')">
                    <span class="slider round"></span>
                </label>
            </td>
            <td>
                <button type="button" class="btn-danger btn-sm" onclick="deleteEquipment('${eq.id}')" title="ลบรายการ"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function handleAddEquipment(e) {
    e.preventDefault();
    const name = document.getElementById('new-eq-name').value.trim();
    const category = document.getElementById('new-eq-category').value;
    
    if (name) {
        equipmentList.push({
            id: 'eq-' + Date.now(),
            name: name,
            category: category,
            active: true
        });
        saveEquipmentToStorage();
        document.getElementById('new-eq-name').value = '';
        renderEquipmentManageTable();
    }
}

function toggleEquipmentActive(id) {
    const index = equipmentList.findIndex(e => e.id === id);
    if (index !== -1) {
        equipmentList[index].active = (equipmentList[index].active === false) ? true : false;
        saveEquipmentToStorage();
    }
}

function deleteEquipment(id) {
    if (confirm('ยืนยันการลบรายการเครื่องมือนี้?')) {
        equipmentList = equipmentList.filter(e => e.id !== id);
        saveEquipmentToStorage();
        renderEquipmentManageTable();
    }
}

function formatDateThai(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() + 543}`;
}

function formatDateThaiTime(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return `${formatDateThai(dateStr)} เวลา ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} น.`;
}

function exportToExcel() {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "ID,ชื่อผู้เบิก,ห้องผ่าตัด,วันที่ใช้งาน,สถานะ\n";
    
    borrowRecords.forEach(function(rowArray) {
        let row = `${rowArray.id},"${rowArray.borrowerName}","${rowArray.orRoom}","${rowArray.useDate}","${rowArray.status}"`;
        csvContent += row + "\r\n";
    });
    
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "borrow_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function setupThemeFromPreferences() {
    const savedTheme = localStorage.getItem('surgical_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function openBackupModal() {
    document.getElementById('backup-modal').style.display = 'flex';
}

function closeBackupModal() {
    document.getElementById('backup-modal').style.display = 'none';
}

function exportBackupJSON() {
    const data = {
        equipment: equipmentList,
        records: borrowRecords,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "surgical_system_backup_" + new Date().getTime() + ".json");
    dlAnchorElem.click();
    dlAnchorElem.remove();
}

function importBackupJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const contents = JSON.parse(e.target.result);
            if (contents.equipment && contents.records) {
                equipmentList = contents.equipment;
                borrowRecords = contents.records;
                saveEquipmentToStorage();
                saveRecordsToStorage();
                alert('นำเข้าข้อมูลสำเร็จ');
                location.reload();
            } else {
                alert('ไฟล์ไม่ถูกต้อง');
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาดในการอ่านไฟล์');
        }
    };
    reader.readAsText(file);
}

function resetToInitialSampleData() {
    if (confirm('คำเตือน: คุณต้องการล้างข้อมูลประวัติการยืมทั้งหมด และรีเซ็ตรายการอุปกรณ์เป็นค่าเริ่มต้นหรือไม่?\n(การกระทำนี้ไม่สามารถยกเลิกได้)')) {
        const prompt = window.prompt("พิมพ์คำว่า 'CONFIRM' เพื่อยืนยันการล้างข้อมูล");
        if (prompt === 'CONFIRM') {
            borrowRecords = [];
            equipmentList = JSON.parse(JSON.stringify(INITIAL_EQUIPMENT_LIST));
            
            saveRecordsToStorage();
            saveEquipmentToStorage();
            
            alert('ล้างข้อมูลและรีเซ็ตระบบเรียบร้อยแล้ว');
            location.reload();
        } else {
            alert('การยืนยันไม่ถูกต้อง ยกเลิกการล้างข้อมูล');
        }
    }
}
