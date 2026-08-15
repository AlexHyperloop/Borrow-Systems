/**
 * ==========================================================================
 * à¸£à¸°à¸šà¸šà¹€à¸šà¸´à¸à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸¡à¸·à¸­à¸œà¹ˆà¸²à¸•à¸±à¸” - à¸à¹ˆà¸²à¸¢à¸œà¸¹à¹‰à¹€à¸šà¸´à¸ (Borrower Status & Requisition System)
 * Dedicated Script for status.html
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. Initial Datasets (Same Schema & Key for Real-time LocalStorage Sync)
// --------------------------------------------------------------------------
const INITIAL_EQUIPMENT_LIST = [
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
    // à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸› (à¸ˆà¸²à¸ Google Sheets + à¹€à¸”à¸´à¸¡)
    { id: 'eq-gen-1', name: 'à¸–à¸¸à¸‡à¸¡à¸·à¸­à¹€à¸šà¸­à¸£à¹Œ 6', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-2', name: 'à¸–à¸¸à¸‡à¸¡à¸·à¸­à¹€à¸šà¸­à¸£à¹Œ 6 1/2', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-3', name: 'à¸–à¸¸à¸‡à¸¡à¸·à¸­à¹€à¸šà¸­à¸£à¹Œ 7', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-4', name: 'à¸–à¸¸à¸‡à¸¡à¸·à¸­à¹€à¸šà¸­à¸£à¹Œ 7 1/2', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-5', name: 'à¸–à¸¸à¸‡à¸¡à¸·à¸­à¹€à¸šà¸­à¸£à¹Œ 8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-6', name: 'à¸–à¸¸à¸‡à¸¡à¸·à¸­à¹€à¸šà¸­à¸£à¹Œ 8 1/2', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-7', name: 'Nss 0.9% 100 ml.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-8', name: 'à¸ªà¸µ Sterile (Medical Dye)', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-9', name: 'à¹ƒà¸šà¸¡à¸µà¸” Dermatome', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-10', name: 'à¹ƒà¸šà¸¡à¸µà¸” graft', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-11', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.6', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-12', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-13', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.10', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-14', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.12', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-15', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.14', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-16', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.16', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-17', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.18', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-18', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.20', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-19', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.22', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-20', name: 'Foley\'s cath 2 à¸«à¸²à¸‡ No.24', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-21', name: 'Foley\'s cath 3 à¸«à¸²à¸‡ No.18', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-22', name: 'Foley\'s cath 3 à¸«à¸²à¸‡ No.20', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-23', name: 'Foley\'s cath 3 à¸«à¸²à¸‡ No.22', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-24', name: 'Cath à¹à¸”à¸‡ No.8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-25', name: 'Cath à¹à¸”à¸‡ No.10', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-26', name: 'Cath à¹à¸”à¸‡ No.12', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-27', name: 'Cath à¹à¸”à¸‡ No.14', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-28', name: 'Cath à¹à¸”à¸‡ No.16', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-29', name: 'Cath à¹à¸”à¸‡ No.18', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-30', name: 'Four wing No.12', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-31', name: 'Four wing No.14', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-32', name: 'Four wing No.16', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-33', name: 'Four wing No.18', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-34', name: 'Four wing No.20', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-35', name: 'Four wing No.22', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-36', name: 'Four wing No.24', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-37', name: 'Four wing No.26', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-38', name: 'Four wing No.28', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-39', name: 'Four wing No.30', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-40', name: 'Silicone cath 2 à¸«à¸²à¸‡ No.14', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-41', name: 'Silicone cath 2 à¸«à¸²à¸‡ No.16', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-42', name: 'Silicone cath 2 à¸«à¸²à¸‡ No.18', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-43', name: 'Feeding tube No.5', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-44', name: 'Feeding tube No.6', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-45', name: 'Feeding tube No.8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-46', name: 'Feeding tube No.10', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-47', name: 'NG. No.12', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-48', name: 'NG. No.14', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-49', name: 'NG. No.16', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-50', name: 'NG. No.18', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-51', name: 'Thoracic cath No.16', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-52', name: 'Thoracic cath No.20', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-53', name: 'Thoracic cath No.24', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-54', name: 'Thoracic cath No.28', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-55', name: 'Thoracic cath No.32', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-56', name: 'Thoracic cath No.36', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-57', name: 'Set I.V.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-58', name: 'à¸ªà¸²à¸¢ Bipolar à¸ªà¸µà¸Ÿà¹‰à¸²', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-59', name: 'à¸ªà¸²à¸¢ Bipolar Dual à¸ªà¸µà¸™à¹‰à¸³à¸•à¸²à¸¥', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-60', name: 'à¸ªà¸²à¸¢à¸ˆà¸µà¹‰ Foot', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-61', name: 'à¸ªà¸²à¸¢à¸ˆà¸µà¹‰ Hand', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-62', name: 'Merocel', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-63', name: 'Elastic sterile 3"', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-64', name: 'Elastic sterile 4"', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-65', name: 'Elastic sterile 6"', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-66', name: 'Webril sterile 3"', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-67', name: 'Webril sterile 4"', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-68', name: 'Webril sterile 6"', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-69', name: 'Prolene Mesh graft à¹€à¸¥à¹‡à¸', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-70', name: 'Prolene Mesh graft à¹ƒà¸«à¸à¹ˆ', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-71', name: 'Gauze drain 3/4 cm.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-72', name: 'Gauze drain 1.5 cm.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-73', name: 'Gauze Heart 3x9', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-74', name: 'Gauze Ortho', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-75', name: 'à¸‚à¸§à¸” Vac Drain 200 ml.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-76', name: 'à¸‚à¸§à¸” Vac Drain 600 ml.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-77', name: 'à¹€à¸‚à¹‡à¸¡ Drain No.8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-78', name: 'à¹€à¸‚à¹‡à¸¡ Drain No.10', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-79', name: 'à¹€à¸‚à¹‡à¸¡ Drain No.12', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-80', name: 'à¸ªà¸²à¸¢ Redivac drain No.8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-81', name: 'à¸ªà¸²à¸¢ Redivac drain No.10', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-82', name: 'à¸ªà¸²à¸¢ Redivac drain No.12', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-83', name: 'Jackson Pratt No.10', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-84', name: 'Extension Tube', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-85', name: 'Penrose drain 1/2"', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-86', name: 'Penrose drain 3/4"', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-87', name: 'Tube drain à¸à¸¥à¸²à¸‡', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-88', name: 'Tube drain à¹€à¸¥à¹‡à¸', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-89', name: 'Wire Guide (PCNL)', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-90', name: 'à¸Šà¸¸à¸”à¹€à¸‚à¹‡à¸¡à¹€à¸ˆà¸²à¸° (PCNL)', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-91', name: 'PCN No.8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-92', name: 'PCN No.10', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-93', name: 'DJ. Stent No.4.8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-94', name: 'DJ. Stent No.6', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-95', name: 'DJ. Stent No.7', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-96', name: 'Fogarty No.2', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-97', name: 'Fogarty No.3', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-98', name: 'Fogarty No.4', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-99', name: 'Fogarty No.5', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-100', name: 'à¸ªà¸²à¸¢ RP No.3', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-101', name: 'à¸ªà¸²à¸¢ RP No.4', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-102', name: 'à¸ªà¸²à¸¢ RP No.5', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-103', name: 'à¸ªà¸²à¸¢ RP No.6', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-104', name: 'Opsite 15x28 cm.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-105', name: 'Ioban 35x35 cm.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-106', name: 'Ioban 60x45 cm.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-107', name: 'Tegaderm à¹€à¸¥à¹‡à¸ (à¹€à¸‚à¸µà¸¢à¸§)', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-108', name: 'Tegaderm à¹€à¸¥à¹‡à¸+Pad (à¹à¸”à¸‡)', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-109', name: 'Tegaderm à¸à¸¥à¸²à¸‡+Pad', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-110', name: 'Leukostrip', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-111', name: 'Spongostan', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-112', name: 'Sofra-tulle', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-113', name: 'Rack à¹€à¸‚à¹‡à¸¡ Neuro', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-114', name: 'Rack à¹€à¸‚à¹‡à¸¡ à¸¨à¸±à¸¥à¸¢à¹Œ', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-115', name: 'Rack à¹€à¸‚à¹‡à¸¡ Uro', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-116', name: 'Rack à¹€à¸‚à¹‡à¸¡ à¸ªà¸¹à¸•à¸´', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-117', name: 'Rack à¹€à¸‚à¹‡à¸¡ à¸•à¸£à¸‡', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-118', name: 'Rack à¹€à¸‚à¹‡à¸¡ à¹€à¸¢à¹‡à¸šà¸‚à¹‰à¸²à¸‡', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-119', name: 'à¹€à¸‚à¹‡à¸¡ Sterile 18 x 1 1/2', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-120', name: 'à¹€à¸‚à¹‡à¸¡ Sterile 21 x 1 1/2', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-121', name: 'à¹€à¸‚à¹‡à¸¡ Sterile 24 x 1/2', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-122', name: 'à¹€à¸‚à¹‡à¸¡ Sterile 25 x 1', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-123', name: 'à¹€à¸‚à¹‡à¸¡ Sterile 25 x 1 1/2', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-124', name: 'à¹€à¸‚à¹‡à¸¡ Sterile 27 x 1', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-125', name: 'à¹€à¸‚à¹‡à¸¡ Sterile 27 x 1/2', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-126', name: 'Raney Clip', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-127', name: 'Cottonoid No. L', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-128', name: 'Cottonoid No. M', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-129', name: 'Transfer bag neuro', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-130', name: 'Feeding tube No.8 neuro', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-131', name: 'Feeding tube No.10 neuro', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-132', name: 'Colostomy bag à¸ž.à¸¨à¸£à¸¸à¸•à¸²', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-133', name: 'à¸–à¸¸à¸‡à¸à¸¥à¹‰à¸­à¸‡', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-134', name: 'Tracheostomy tube No. 6', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-135', name: 'Tracheostomy tube No. 7', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-136', name: 'Tracheostomy tube No. 7.5', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-137', name: 'Tracheostomy tube No. 8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-138', name: 'Vein stripping', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-139', name: 'Syringe Insulin 1 cc.à¸–à¸­à¸”à¹€à¸‚à¹‡à¸¡', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-140', name: 'Syringe 3 cc.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-141', name: 'Syringe 5 cc. / 5 cc.à¸¥à¹‡à¸­à¸„', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-142', name: 'Syringe 10 cc. / 10 cc.à¸¥à¹‡à¸­à¸„', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-143', name: 'Syringe 20 cc.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-144', name: 'Syringe 50 cc.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-145', name: 'Pads Valleylab (à¸ªà¸µà¸Ÿà¹‰à¸²)', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-146', name: 'Pads à¹€à¸”à¹‡à¸ Valleylab (à¸ªà¸µà¸Ÿà¹‰à¸²)', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-147', name: 'Pads à¹€à¸”à¹‡à¸ Valleylab (à¸ªà¸µà¸™à¹‰à¸³à¹€à¸‡à¸´à¸™)', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-148', name: 'Pads à¹€à¸”à¹‡à¸ à¹„à¸¡à¹ˆà¸¡à¸µà¸ªà¸²à¸¢', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-149', name: 'Pads à¸œà¸¹à¹‰à¹ƒà¸«à¸à¹ˆ à¹„à¸¡à¹ˆà¸¡à¸µà¸ªà¸²à¸¢', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-150', name: 'Pads à¸œà¸¹à¹‰à¹ƒà¸«à¸à¹ˆ à¸¡à¸µà¸ªà¸²à¸¢', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-151', name: 'à¸¥à¸§à¸” No.16', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-152', name: 'à¸¥à¸§à¸” No.18', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-153', name: 'à¸¥à¸§à¸” No.20', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-154', name: 'à¸¥à¸§à¸” No.22', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-155', name: 'à¸¥à¸§à¸” No.23', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-156', name: 'à¸¥à¸§à¸” No.24', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-157', name: 'à¸¥à¸§à¸” No.25', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-158', name: 'à¸¥à¸§à¸” No.26', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-159', name: 'à¸¥à¸§à¸” No.28', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-160', name: 'à¸¥à¸§à¸” No.30', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-161', name: 'Arch bar', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-162', name: 'à¸–à¸¸à¸‡ burr hole', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-163', name: 'Urine bag', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-164', name: 'D.S.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-165', name: 'Culture', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-166', name: 'Skin Staple', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-167', name: 'à¸•à¸±à¸§ off staple', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-168', name: 'Vascular loop à¹€à¸¥à¹‡à¸-à¹ƒà¸«à¸à¹ˆ', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-169', name: 'Vaseline', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-170', name: 'Vaseline Gauze', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-171', name: 'à¸—à¸µà¹ˆà¸‚à¸¹à¸”à¸ˆà¸µà¹‰', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-172', name: 'à¸›à¸¥à¸­à¸à¸ˆà¸µà¹‰', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-173', name: 'à¹à¸›à¸£à¸‡à¸ªà¸µà¸Ÿà¸±à¸™', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-174', name: 'à¹à¸œà¹ˆà¸™à¸ªà¹„à¸¥à¸”à¹Œ', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-175', name: 'à¹„à¸¡à¹‰à¸ˆà¸´à¹‰à¸¡à¸ªà¸µ', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-176', name: 'à¸‚à¸§à¸” Sterile', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-177', name: 'à¹„à¸¡à¹‰à¸žà¸±à¸™à¸ªà¸³à¸¥à¸µ à¹€à¸¥à¹‡à¸-à¹ƒà¸«à¸à¹ˆ', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-178', name: 'à¸¢à¸²à¸‡à¸§à¸‡', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-179', name: 'à¸¥à¸¹à¸à¸ªà¸¹à¸šà¸¢à¸²à¸‡ C/S', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-180', name: 'à¸ªà¸³à¸¥à¸µà¸¥à¸¹à¸à¹€à¸¥à¹‡à¸', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-181', name: 'à¸ªà¸³à¸¥à¸µà¸¥à¸¹à¸à¹ƒà¸«à¸à¹ˆ', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-182', name: 'à¸«à¸§à¸µ', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-183', name: 'Glass rod', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-184', name: 'UM.', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-185', name: 'à¹ƒà¸šà¸¡à¸µà¸”à¸•à¸² 15 à¸­à¸‡à¸¨à¸²', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-186', name: 'à¹ƒà¸šà¸¡à¸µà¸”à¸•à¸² 2.8', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-187', name: 'à¹ƒà¸šà¸¡à¸µà¸”à¸•à¸² 3.0', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-188', name: 'à¹„à¸¡à¹‰à¸žà¸±à¸™à¸ªà¸³à¸¥à¸µà¸•à¸²', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-189', name: 'à¸–à¸¸à¸‡à¸™à¹‰à¸³à¸•à¸²', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-190', name: 'Eye Pad', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-gen-191', name: 'Eye Shield', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    // Existing 
    { id: 'eq-1', name: 'Army-Navy', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-2', name: 'Richardson', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-3', name: 'Deaver', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-4', name: 'Senn', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-5', name: 'Malleable retractor', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-6', name: 'Mosquito Forceps', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-7', name: 'Kelly Forceps', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-8', name: 'Crile Forceps', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-9', name: 'Kocher Forceps', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-10', name: 'Needle Holder', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-11', name: 'Towel Clip', category: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', active: true },
    { id: 'eq-20', name: 'Set Major Surgery (เซ็ตผ่าตัดใหญ่)', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-21', name: 'Set Minor Surgery (เซ็ตผ่าตัดเล็ก)', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-22', name: 'Set Laparoscopy Instrument (เซ็ตกล้องส่องผ่าตัด)', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-23', name: 'Set Orthopedic Basic', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-24', name: 'Set Appendectomy (เซ็ตไส้ติ่ง)', category: 'Set เครื่องมือ', active: true },
            { name: 'Set Major Surgery (เซ็ตผ่าตัดใหญ่)', qty: 1, category: 'Set เครื่องมือ' },
            { name: 'Set Laparoscopy Instrument (เซ็ตกล้องส่องผ่าตัด)', qty: 1, category: 'Set เครื่องมือ' },
    { id: 'eq-30', name: 'Set ผ้าผ่าตัดทั่วไป (General Drape Set)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-31', name: 'Set ผ้าส่องกล้อง (Laparoscopy Drape)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-32', name: 'Set ผ้ากระดูกและข้อ (Ortho Drape)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-33', name: 'เสื้อกาวน์ผ่าตัด (Surgical Gown)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-34', name: 'ผ้าคลุมเตียงผ่าตัด (Drape Sheet)', category: 'Set เครื่องผ้า', active: true },
            { name: 'Set ผ้าผ่าตัดทั่วไป (General Drape Set)', qty: 1, category: 'Set เครื่องผ้า' }
    // à¸•à¸¹à¹‰ Ortho
    { id: 'eq-ortho-1', name: 'Acetabulum Clamp à¹€à¸¥à¹‡à¸ / à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-2', name: 'Aiming Device / Bone Biopsy', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-3', name: 'Bending Iron (à¸”à¸±à¸”plateà¸¡à¸·à¸­)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-4', name: 'Bone Clamp à¹€à¸¥à¹‡à¸/ à¸à¸¥à¸²à¸‡ / à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-5', name: 'Bone Cutter à¹€à¸¥à¹‡à¸ / à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-6', name: 'Bone Hook / Bone Skid', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-7', name: 'Bone Rongeur Beyer / Stille', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-8', name: 'Bone Rongeur Ruskin / angle stille', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-9', name: 'Broken screw (à¸Šà¸¸à¸”)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-10', name: 'Cartilage set', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-11', name: 'Cervical dissector (Bone graft 7 à¸Šà¸´à¹‰à¸™)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-12', name: 'Cervical Spreader', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-13', name: 'Cloward (14à¸Šà¸´à¹‰à¸™)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-14', name: 'Cobb 9 à¸™à¸´à¹‰à¸§ à¸”à¹‰à¸²à¸¡à¹„à¸¡à¹‰ / à¸”à¹‰à¸²à¸¡à¹€à¸«à¸¥à¹‡à¸', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-15', name: 'Cobb à¸¢à¸²à¸§ 11à¸™à¸´à¹‰à¸§ 10 / 18 mm.', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-16', name: 'Curette (à¸Ÿà¸±à¸™à¸«à¸™à¸¹ 13mm/8.5mm)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-17', name: 'Curette No.', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-18', name: 'Curette spine 3 à¸Šà¸´à¹‰à¸™ à¸•à¸£à¸‡ /à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-19', name: 'Curette à¸•à¸£à¸‡ no. 3 (à¸ž.à¸ªà¸¸à¸§à¸´à¹‚à¸Šà¸•à¸´)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-20', name: 'Depth Gauge for 3.5 / 4.5', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-21', name: 'Drill bit 1.1/1.5 /2.0 /2.5 /2.7', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-22', name: 'Drill bit 3.2/3.5/4.5/6.0', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-23', name: 'Drill sleeve 2.5/3.5', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-24', name: 'Freer (Penfield) à¸ªà¸±à¹‰à¸™ /à¸¢à¸²à¸§', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-25', name: 'Freer + à¸”à¹‰à¸²à¸¡à¸¡à¸µà¸” No.7', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-26', name: 'Hibbs retractor à¹€à¸¥à¹‡à¸ / à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-27', name: 'Hohmann Ret gen / à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-28', name: 'Impactor à¸”à¹‰à¸²à¸¡à¹€à¸«à¸¥à¹‡à¸ / à¸”à¹‰à¸²à¸¡à¹„à¸¡à¹‰', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-29', name: 'Jacob Chuck / Telescope', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-30', name: 'Kerrison 2 / 3/ 4 /5 mm', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-31', name: 'Kocher Clamp à¸•à¸£à¸‡ 1à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-32', name: 'Macdonald à¸¡à¸µà¸£à¸¹ /à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸¹', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-33', name: 'Narrow plate (à¸«à¹ˆà¸­ Ok.)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-34', name: 'Nerve hook / Nerve Root à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-35', name: 'Osteotome (à¸ªà¸´à¹ˆà¸§)à¹‚à¸„à¹‰à¸‡/à¸•à¸£à¸‡........ mm', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-36', name: 'Periosteum + small hohmann', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-37', name: 'Periosteum à¸•à¸£à¸‡ /à¸”à¹‰à¸²à¸¡à¹€à¸«à¸¥à¹‡à¸', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-38', name: 'Protect sleeve', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-39', name: 'Reduction forceps / with point', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-40', name: 'Screw driver 3.5 / 4.5', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-41', name: 'Screw driver shaft 3.5 / 4.6', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-42', name: 'Self 8 à¸Šà¸´à¹‰à¸™ / Self Laminectomy', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-43', name: 'Small hohmann', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-44', name: 'Spinal probe /Sound', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-45', name: 'Spinal Retractor /Staple set', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-46', name: 'Tap 2.7/3.5/4.0/4.5/6.5', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-47', name: 'T-handle', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-48', name: 'Towel clip', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-49', name: 'T-wrench à¸ªà¸±à¹‰à¸™ / à¸¢à¸²à¸§ /à¸«à¸±à¸à¹„à¸”à¹‰', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-50', name: 'Universal chuck key', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-51', name: 'Universal drill sleeve 2.5/3.5', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-52', name: 'Universal drill sleeve 6.5', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-53', name: 'Wire cutter à¹€à¸¥à¹‡à¸ / à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-54', name: 'Wire passer à¹€à¸¥à¹‡à¸ /à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-55', name: 'à¸Šà¸¸à¸” Drill bit 4.5', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-56', name: 'Lowman clamp', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-57', name: 'Ankle Compressor (foot)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-58', name: 'block cement à¹€à¸‚à¹ˆà¸²/ à¸ªà¸°à¹‚à¸žà¸', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-59', name: 'block cement à¸—à¸³ genta bead', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-60', name: 'Calcaneous bone spreader spatula', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-61', name: 'Chisel angle 15\' / 7 mm', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-62', name: 'DCP drill sleeve (à¹€à¸‚à¸µà¸¢à¸§à¹€à¸«à¸¥à¸·à¸­à¸‡)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-63', name: 'Femoral retractor', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-64', name: 'Flag splitter', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-65', name: 'Gelpi ret. / Gelpi ret. à¸‚à¸²à¸¢à¸²à¸§', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-66', name: 'Gouge à¸•à¸£à¸‡ /à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-67', name: 'Guide wire for c-spine', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-68', name: 'K-wire spreader (foot)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-69', name: 'Lamina spreader', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-70', name: 'Meyerding Ret.(à¸ž.à¸­à¸²à¸—à¸´à¸•à¸¢à¹Œ à¸¡.)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-71', name: 'Mikimon self retaining (Self à¸ž.à¸ªà¸¸à¸§à¸´à¹‚à¸Šà¸•à¸´)', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-72', name: 'Milligant discectomy', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-73', name: 'Osteotome à¸•à¸£à¸‡ 7 à¸¡à¸¡.à¸¢à¸²à¸§ 16.5"', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-74', name: 'Pelvic reduction clamp', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-75', name: 'Reposition forceps à¹€à¸¥à¹‡à¸ /à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-76', name: 'Retractor à¸‚à¸²à¹€à¸”à¸µà¸¢à¸§/ à¸ž.à¹€à¸à¸©à¸¡', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-77', name: 'Reverse curette 6 mm', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-78', name: 'William micro discectomy 1x5 mm', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-79', name: 'William micro discectomy 1x7 mm', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-80', name: 'William micro discectomy 2x5 mm', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-81', name: 'à¸„à¹‰à¸­à¸™ 300/ 350/500/700/900', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-82', name: 'à¸„à¸µà¸¡à¸›à¸²à¸à¹à¸šà¸™ / à¹à¸«à¸¥à¸¡', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-83', name: 'à¸„à¸µà¸¡à¸¥à¹‡à¸­à¸„', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-84', name: 'à¸Šà¸¸à¸” C-Spine ( 7 à¸Šà¸´à¹‰à¸™ )', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-85', name: 'à¸Šà¸¸à¸” à¹ƒà¸ªà¹ˆ Plate à¸™à¸´à¹‰à¸§ ( 12 à¸Šà¸´à¹‰à¸™ )', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-86', name: 'à¸•à¸±à¸§à¸ˆà¸±à¸šà¸«à¸¡à¸¸à¸”', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-87', name: 'à¸•à¸±à¸§à¸¢à¹‰à¸³ K-wire', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-88', name: 'à¸–à¹‰à¸§à¸¢ Cement', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-89', name: 'à¸–à¸¸à¸‡ Scope / à¸–à¸¸à¸‡ X-ray', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-90', name: 'à¸–à¸¸à¸‡ Stockinette Hip/Knee', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-91', name: 'à¸–à¸¸à¸‡à¸à¸¥à¹‰à¸­à¸‡ liga', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-92', name: 'à¸—à¸µà¹ˆà¸ˆà¸µà¹‰à¹€à¸ªà¹‰à¸™à¸›à¸£à¸°à¸ªà¸²à¸— à¸ž.à¸ªà¸¸à¸£à¸¨à¸±à¸à¸”à¸´à¹Œ', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-93', name: 'à¸—à¸µà¹ˆà¸”à¸±à¸” K-wire + Impactor', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-94', name: 'à¸—à¸µà¹ˆà¸”à¸±à¸”-à¸•à¸±à¸” K-wire /à¸„à¸µà¸¡à¸”à¸±à¸” K-wire', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-95', name: 'à¹ƒà¸šà¹€à¸¥à¸·à¹ˆà¸­à¸¢ Noâ€¦..', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-96', name: 'à¸›à¸£à¸°à¹à¸ˆ No.8 / 11 /10', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-97', name: 'à¹„à¸¡à¹‰à¸šà¸£à¸£à¸—à¸±à¸” à¹€à¸«à¸¥à¹‡à¸ /à¸ªà¸±à¹‰à¸™ / à¸¢à¸²à¸§', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-98', name: 'à¸¢à¸²à¸‡à¹€à¸—à¸²à¸Ÿà¹‰à¸² 6/ 4 / 3', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-99', name: 'à¸ªà¸²à¸¢ Small air drill', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-100', name: 'à¸ªà¸´à¹ˆà¸§ à¸•à¸£à¸‡,à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-101', name: 'à¸ªà¸´à¹ˆà¸§ 9", 12 / 6 mm', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-102', name: 'à¸ªà¸´à¹ˆà¸§à¸”à¹‰à¸²à¸¡à¹€à¸«à¸¥à¹‡à¸ 11", 25mm à¸•à¸£à¸‡/ à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-103', name: 'à¸ªà¸´à¹ˆà¸§à¸•à¸£à¸‡à¸¢à¸²à¸§ (à¸”à¹‰à¸²à¸¡à¹„à¸¡à¹‰)............... mm', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-104', name: 'à¸«à¹ˆà¸­ K-wire / Steinmann pin', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-105', name: 'à¸«à¸±à¸§ Sagittal saw', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-106', name: 'à¸«à¸±à¸§à¸•à¹ˆà¸­ reamer à¸‚à¸­à¸‡ Aesculap drill', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-107', name: 'à¸«à¸±à¸§à¸•à¹ˆà¸­ saw à¸‚à¸­à¸‡ Aesculap drill', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    { id: 'eq-ortho-108', name: 'à¹€à¸«à¸¥à¹‡à¸ X-ray', category: 'à¸•à¸¹à¹‰ Ortho', active: true },
    // à¸•à¸¹à¹‰ Neuro
    { id: 'eq-neuro-1', name: 'Bipolar forceps', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-2', name: 'Brain spatula (1à¸Šà¸´à¹‰à¸™/6à¸Šà¸´à¹‰à¸™)', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-3', name: 'Chinese Finger splint', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-4', name: 'Codman disp perforator', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-5', name: 'Dissection of hand', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-6', name: 'Flu cloth', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-7', name: 'Gigli saw handle + à¹à¸œà¹ˆà¸™à¸£à¸­à¸‡', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-8', name: 'Hand drill', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-9', name: 'Microsurgery Hand à¸ªà¸µà¹€à¸‡à¸´à¸™ / à¸ªà¸µà¸Ÿà¹‰à¸²', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-10', name: 'Miniplate set 1.7 / 2.0', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-11', name: 'Self thyroid à¹€à¸¥à¹‡à¸ / à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-12', name: 'Self thyroid à¸«à¸±à¸à¹„à¸”à¹‰', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-13', name: 'Set à¸•à¹ˆà¸­ Nerve', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-14', name: 'Skull tong', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-15', name: 'V-P Shunt handle', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-16', name: 'V-P Shunt passer (à¹„à¸à¸”à¹Œà¸¢à¸²à¸§)', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-17', name: 'à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸¡à¸·à¸­ hand (à¸ž.à¸¡à¸µà¸™à¸²)', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-18', name: 'à¸Šà¸¸à¸”à¸«à¸±à¸§ Burr / Twist drill', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-19', name: 'à¸”à¸­à¸à¸ªà¸§à¹ˆà¸²à¸™', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-20', name: 'à¹ƒà¸šà¹€à¸¥à¸·à¹ˆà¸­à¸¢', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-21', name: 'à¸«à¸±à¸§à¸à¸£à¸­ 3 / 5 m.m.', category: 'à¸•à¸¹à¹‰ Neuro', active: true },
    { id: 'eq-neuro-22', name: 'à¸«à¸±à¸§à¹ƒà¸šà¸žà¸²à¸¢', category: 'à¸•à¸¹à¹‰ Neuro', active: true },

    // à¸•à¸¹à¹‰ General
    { id: 'eq-genr-1', name: 'Abdominal à¹€à¸¥à¹‡à¸ / à¸à¸¥à¸²à¸‡', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-2', name: 'Allis à¸ªà¸±à¹‰à¸™ / à¸¢à¸²à¸§', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-3', name: 'Army navy retractor', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-4', name: 'Arterial clamp à¸•à¸£à¸‡ / à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-5', name: 'Babcock à¸ªà¸±à¹‰à¸™ / à¸¢à¸²à¸§', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-6', name: 'Deep retractor à¸ªà¸±à¹‰à¸™ / à¸¢à¸²à¸§', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-7', name: 'Deaver à¹€à¸¥à¹‡à¸ / à¹ƒà¸«à¸à¹ˆ / à¸à¸¥à¸²à¸‡', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-8', name: 'Deaver à¸«à¸™à¹‰à¸²à¸à¸§à¹‰à¸²à¸‡ / sweet heart', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-9', name: 'Dilator rectum 18,14,10 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-10', name: 'Intestinal clamps à¸•à¸£à¸‡ / à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-11', name: 'Intestinal right angle', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-12', name: 'Kocher clamp à¹‚à¸„à¹‰à¸‡ (4 à¸•à¸±à¸§)', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-13', name: 'Mosquito à¹‚à¸„à¹‰à¸‡ (3 à¸•à¸±à¸§) , à¸•à¸£à¸‡ (3à¸•à¸±à¸§)', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-14', name: 'Pean curve ( 6à¸•à¸±à¸§ )', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-15', name: 'Payr clamp 2 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-16', name: 'Procto à¸—à¸µà¹ˆà¸–à¹ˆà¸²à¸‡à¸à¹‰à¸™', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-17', name: 'Procto à¸˜à¸£à¸£à¸¡à¸”à¸² / à¸œà¹ˆà¸²à¸à¸¥à¸²à¸‡', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-18', name: 'Purse string clamp', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-19', name: 'Retractor à¸à¸²à¸šà¸à¸¥à¹‰à¸§à¸¢', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-20', name: 'Retractor à¹€à¸ˆà¸²à¸°à¸„à¸­', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-21', name: 'Right angle 4 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-22', name: 'Saint Mark à¸˜à¸£à¸£à¸¡à¸”à¸² /à¸›à¸¥à¸²à¸¢à¸¢à¸²à¸§à¸‡à¸­', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-23', name: 'Self à¸¨à¸±à¸¥à¸¢à¹Œ 9 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-24', name: 'Spatula à¸¡à¸µà¸£à¸¹', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-25', name: 'Sponge holder à¸•à¸£à¸‡ / à¹‚à¸„à¹‰à¸‡ 2 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-genr-26', name: 'Tonsil clamp 2 à¸•à¸±à¸§ à¸›à¸¥à¸²à¸¢à¹à¸«à¸¥à¸¡, à¸˜à¸£à¸£à¸¡à¸”à¸²', category: 'à¸•à¸¹à¹‰ General', active: true },
    // Existing General
    { id: 'eq-40', name: 'Scalpel Handle #3 / #4 (à¸”à¹‰à¸²à¸¡à¸¡à¸µà¸”à¸œà¹ˆà¸²à¸•à¸±à¸”)', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-41', name: 'Electrocautery Pencil (à¸”à¹‰à¸²à¸¡à¸ˆà¸µà¹‰à¹„à¸Ÿà¸Ÿà¹‰à¸²)', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-42', name: 'Harmonic Scalpel Handpiece', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-43', name: 'Skin Stapler', category: 'à¸•à¸¹à¹‰ General', active: true },
    { id: 'eq-44', name: 'Suction Tip (Yankauer / Poole)', category: 'à¸•à¸¹à¹‰ General', active: true },
    // à¸•à¸¹à¹‰ Plastic
    { id: 'eq-plas-1', name: 'Deep retractor à¸¢à¸²à¸§ (in-out) à¸„à¸¹à¹ˆ', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-2', name: 'Deep retractor à¸¢à¸²à¸§ (out) 1 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-3', name: 'Pig tail', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-4', name: 'Set orthognathic (à¸—à¸±à¸™à¸•à¸à¸£à¸£à¸¡)', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-5', name: 'Setà¸–à¸­à¸™à¸Ÿà¸±à¸™ 34 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-6', name: 'Tongue blade', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-7', name: 'Towel clip à¸ž.à¸˜à¸™à¸žà¸‡à¸©à¹Œ', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-8', name: 'Wire suspension', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-9', name: 'Wire twister', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-10', name: 'Senn retractor', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-11', name: 'à¸à¸£à¸£à¹„à¸à¸£ Mayo 6", à¸¢à¸²à¸§ 9"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-12', name: 'à¸à¸£à¸£à¹„à¸à¸£à¸•à¸±à¸”à¸¥à¸§à¸”', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-13', name: 'à¸à¸£à¸£à¹„à¸à¸£à¸•à¸±à¸”à¹„à¸«à¸¡ à¸ªà¸±à¹‰à¸™ 6", à¸¢à¸²à¸§ 8" 9"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-14', name: 'à¸à¸£à¸°à¸ˆà¸à¸ªà¹ˆà¸­à¸‡à¸Ÿà¸±à¸™', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-15', name: 'à¸à¸¥à¹ˆà¸­à¸‡à¸¥à¸§à¸” Plastic', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-16', name: 'à¹€à¸‚à¹‡à¸¡à¸£à¹‰à¸­à¸¢à¸¥à¸§à¸”', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-17', name: 'à¸”à¹‰à¸²à¸¡à¸¡à¸µà¸”à¸à¸£à¹Šà¸²à¸Ÿ', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-18', name: 'à¸”à¹‰à¸²à¸¡à¸¡à¸µà¸”à¹€à¸¥à¹‡à¸à¸ªà¸±à¹‰à¸™ No.3 / 4 / 7 / 3L', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-19', name: 'à¸—à¸µà¹ˆà¸‡à¸±à¸”à¸ˆà¸¡à¸¹à¸ 4 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-20', name: 'à¸—à¸µà¹ˆà¸”à¸±à¸” Plate à¸ž.à¸žà¸±à¸¥à¸¥à¸ à¸²', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-21', name: 'à¸—à¸µà¹ˆà¹à¸¢à¸‡à¸—à¹ˆà¸­à¸™à¹‰à¸³à¸•à¸²', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-22', name: 'à¹„à¸¡à¹‰à¸à¸”à¸¥à¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-23', name: 'à¹„à¸¡à¹‰à¸à¸£à¹Šà¸²à¸Ÿ', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-24', name: 'à¸§à¸‡à¹€à¸§à¸µà¸¢à¸™', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-25', name: 'à¸ªà¸²à¸¢à¸¥à¸¡ Mini Air drill', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-26', name: 'à¸«à¸±à¸§ Drill of Mini Air drill', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-27', name: 'à¸«à¸±à¸§à¸ˆà¸µà¹‰à¸¢à¸²à¸§', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-28', name: 'à¸«à¸±à¸§à¸•à¹ˆà¸­ Suction à¹€à¸«à¸¥à¹‡à¸', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-29', name: 'à¸«à¸±à¸§à¸¢à¸´à¸‡ K-wire', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-30', name: 'Bayonet forceps', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-31', name: 'Bone hook à¹€à¸¥à¹‡à¸ / à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-32', name: 'Bulldog clamp 3 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-33', name: 'Dent Heart à¹€à¸¥à¹‡à¸ / à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-34', name: 'Dermatel 2 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-35', name: 'Dingman', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-36', name: 'Double hook / Skin hook', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-37', name: 'Duhamel', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-38', name: 'Forceps 7" (tooth,non-tooth) à¸«à¸™à¸²,à¸šà¸²à¸‡', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-39', name: 'Hand piece of Mini Air drill', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-40', name: 'Jeweler forceps angle', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-41', name: 'Jeweler forceps à¸•à¸£à¸‡', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-42', name: 'Kocher dissector', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-43', name: 'Long Forceps 10" (tooth,non-tooth), 12"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-44', name: 'Mandible reduction', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-45', name: 'Maxillary elevator', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-46', name: 'Metzenbaum 10"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-47', name: 'Metzenbaum 6"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-48', name: 'Metzenbaum 7"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-49', name: 'Metzenbaum 8"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-50', name: 'Metzenbaum 9"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-51', name: 'Metzenbaum à¸›à¸¥à¸²à¸¢à¹à¸«à¸¥à¸¡à¹€à¸¥à¹‡à¸', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-52', name: 'Micro forceps', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-53', name: 'Micro Needle', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-54', name: 'Micro scissors', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-55', name: 'Mouth gag', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-56', name: 'Mouth prop (à¸™à¹‰à¸³à¸•à¸²à¸¥)', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-57', name: 'Nasal retractor', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-58', name: 'Nasal Volkman', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-59', name: 'Needle biopsy 3 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-60', name: 'Needle Bx. 5 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-61', name: 'Needle holder 10" (à¸›à¸¥à¸²à¸¢à¸‡à¸­/à¸ž.à¹€à¸‚à¸µà¸¢à¸§)', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-62', name: 'Needle à¸ˆà¸±à¸šà¸¥à¸§à¸”', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-63', name: 'Needle à¸”à¹‰à¸²à¸¡à¸—à¸­à¸‡ 10"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-64', name: 'Needle à¸”à¹‰à¸²à¸¡à¸—à¸­à¸‡ 5"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-65', name: 'Needle à¸”à¹‰à¸²à¸¡à¸—à¸­à¸‡ 6"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-66', name: 'Needle à¸”à¹‰à¸²à¸¡à¸—à¸­à¸‡ 7"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-67', name: 'Needle à¸”à¹‰à¸²à¸¡à¸—à¸­à¸‡ 8"', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-68', name: 'Periosteum + Zygoma', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-69', name: 'Periosteum + à¸•à¸°à¹„à¸š', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-70', name: 'Periosteum ORIF', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-71', name: 'Periosteum à¸à¸™à¸ˆà¸¡à¸¹à¸', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-72', name: 'Periosteum à¹€à¸¥à¹‡à¸', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-73', name: 'Probe à¸˜à¸£à¸£à¸¡à¸”à¸² / à¸«à¸²à¸‡à¸›à¸¥à¸²', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-74', name: 'Rib Retractor (à¸ž.à¸žà¸‡à¸©à¹Œà¸ªà¸´à¸—à¸˜à¸´à¹Œ)', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-75', name: 'Screw driver 2.0 à¹€à¸¥à¹‡à¸ / à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-76', name: 'Screw driver 1.7 / 1.6 à¸à¸¥à¹ˆà¸­à¸‡à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-77', name: 'Septum knife', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-78', name: 'Set à¸–à¸­à¸™à¸Ÿà¸±à¸™ 7 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-79', name: 'Short forceps (tooth-non,tooth)', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-80', name: 'Suction tube 8/10/12/15', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-81', name: 'Suction à¸«à¸¥à¸²à¸¢à¸£à¸¹ à¹€à¸¥à¹‡à¸ /à¹ƒà¸«à¸à¹ˆ', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-82', name: 'Trocar gallbladder+guide', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-83', name: 'Vascular approximator', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-plas-84', name: 'Volkman 2 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    // Existing Plastic
    { id: 'eq-50', name: 'Micro Scissors (à¸à¸£à¸£à¹„à¸à¸£à¸•à¸à¹à¸•à¹ˆà¸‡à¸¨à¸±à¸¥à¸¢à¸à¸£à¸£à¸¡)', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-51', name: 'Adson Tooth Forceps (1x2)', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-52', name: 'Plastic Needle Holder (Castroviejo)', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-53', name: 'Skin Hook Retractor', category: 'à¸•à¸¹à¹‰ Plastic', active: true },
    { id: 'eq-54', name: 'Freer Elevator', category: 'à¸•à¸¹à¹‰ Plastic', active: true },

    // à¸•à¸¹à¹‰ Ob-gyn
    { id: 'eq-obgyn-1', name: 'A-P retractor', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-2', name: 'Curette suction', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-3', name: 'Curettage à¸ªà¸¹à¸•à¸´ 10 à¸Šà¸´à¹‰à¸™ , 17 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-4', name: 'Doyen retractor', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-5', name: 'Forceps à¸ªà¸¹à¸•à¸´', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-6', name: 'Heaney clamp', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-7', name: 'Hook à¹€à¸à¸µà¹ˆà¸¢à¸§ tube', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-8', name: 'Posterior retractor', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-9', name: 'Retractor à¸ž.à¸žà¸±à¸¥à¸¥à¸  3 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-10', name: 'Russian 7", 9"', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-11', name: 'Silver cath à¸ªà¸±à¹‰à¸™ / à¸¢à¸²à¸§', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-12', name: 'Speculum', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-13', name: 'Tenaculum', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-14', name: 'Uterine clamp', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-15', name: 'Uterine elevator', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-16', name: 'Wertheim angie', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-17', name: 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸‰à¸µà¸”à¸ªà¸µà¸—à¸²à¸‡ Vagina 1', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-18', name: 'Myoma Screw', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-19', name: 'Curette à¸ªà¸¹à¸•à¸´ 10 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-20', name: 'Breisky Retractor', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-obgyn-21', name: 'Self TAH', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    // Existing Ob-gyn
    { id: 'eq-60', name: 'Set à¸œà¹ˆà¸²à¸•à¸±à¸”à¸—à¸³à¸„à¸¥à¸­à¸” C-Section', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-61', name: 'Vaginal Speculum (Graves/Pederson)', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-62', name: 'Tenaculum Forceps', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-63', name: 'Uterine Sound', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },
    { id: 'eq-64', name: 'Ovum Forceps / Curette', category: 'à¸•à¸¹à¹‰ Ob-gyn', active: true },

    // à¸•à¸¹à¹‰ Uro + Ob-gyn
    { id: 'eq-uro-1', name: 'Dilator urethra à¸•à¸£à¸‡ 9,13,14', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-2', name: 'Gelpi retractor 1 à¸„à¸¹à¹ˆ à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-3', name: 'Kidney stone 13 à¸Šà¸´à¹‰à¸™', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-4', name: 'Micro needle URO ( 1 à¸„à¸¹à¹ˆ )', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-5', name: 'Micro scissor à¸•à¸£à¸‡ / à¹‚à¸„à¹‰à¸‡', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-6', name: 'Mixter right angle 2 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-7', name: 'Needle 5"', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-8', name: 'Pedicle clamps 4 à¸•à¸±à¸§', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-9', name: 'Periosteum+Rib shear', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-10', name: 'Retractor à¸ˆà¸´à¹‹à¸§ à¸ªà¸±à¹‰à¸™ / à¸¢à¸²à¸§', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-11', name: 'Rib cutter', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-12', name: 'Stamey needle 3 à¸­à¸±à¸™', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-13', name: 'Suction tip R.17/Suction plastic', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-14', name: 'Stone forceps', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-15', name: 'Turner Warwick 1 à¸„à¸¹à¹ˆ', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true },
    { id: 'eq-uro-16', name: 'à¹„à¸¡à¹‰à¸šà¸£à¸£à¸—à¸±à¸” URO', category: 'à¸•à¸¹à¹‰ Uro + Ob-gyn', active: true }

];

const getFormattedDate = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
};

const getFormattedTime = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
};

// --------------------------------------------------------------------------
// 2. Global State Variables & Firebase Initialization
// --------------------------------------------------------------------------
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

let db = null;
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.database();
        console.log("ðŸŸ¢ Firebase Realtime Database Initialized Successfully!");
    }
} catch (err) {
    console.error("ðŸ”´ Firebase initialization error:", err);
}

let equipmentList = [];
let borrowRecords = [];
let currentFormCategoryTab = 'all';
let selectedEquipmentState = {};

// --------------------------------------------------------------------------
// 3. Initialization & Real-time Synchronization (Firebase + LocalStorage)
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
                    badge.innerHTML = '<i class="fa-solid fa-cloud-check"></i> <span>à¸­à¸­à¸™à¹„à¸¥à¸™à¹Œ (Firebase)</span>';
                }
            } else {
                if (badge) {
                    badge.className = 'firebase-badge pending';
                    badge.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>à¸à¸³à¸¥à¸±à¸‡à¹€à¸Šà¸·à¹ˆà¸­à¸¡à¸•à¹ˆà¸­...</span>';
                }
            }
        });

        // Listen to real-time updates from Firebase Database
        db.ref('borrow_records').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && Array.isArray(data)) {
                borrowRecords = data;
                localStorage.setItem('surgical_borrow_records_v9', JSON.stringify(borrowRecords));
                renderStatusTrackerCards();
            }
        }, (err) => {
            console.error("Firebase records read error:", err);
            const badge = document.getElementById('firebase-status-badge');
            if (badge) {
                badge.className = 'firebase-badge error';
                badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span>à¸•à¸´à¸”à¸ªà¸´à¸—à¸˜à¸´à¹Œ Firebase</span>';
            }
        });

        db.ref('equipment_items').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && Array.isArray(data)) {
                equipmentList = data;
                let updated = false;
                INITIAL_EQUIPMENT_LIST.forEach(initItem => {
                    if (!equipmentList.some(item => item.id === initItem.id || item.name === initItem.name)) {
                        equipmentList.push(initItem);
                        updated = true;
                    }
                });
                localStorage.setItem('surgical_equipment_items_v9', JSON.stringify(equipmentList));
                renderFormEquipmentChecklist();
            } else if (!data) {
                equipmentList = [...INITIAL_EQUIPMENT_LIST];
                localStorage.setItem('surgical_equipment_items_v9', JSON.stringify(equipmentList));
                renderFormEquipmentChecklist();
            }
        });
    } else {
        const badge = document.getElementById('firebase-status-badge');
        if (badge) {
            badge.className = 'firebase-badge error';
            badge.innerHTML = '<i class="fa-solid fa-plug-circle-xmark"></i> <span>à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¹€à¸Šà¸·à¹ˆà¸­à¸¡ Firebase</span>';
        }
    }

    // Listen to LocalStorage updates from Prep Room (index.html)
    window.addEventListener('storage', (e) => {
        if (e.key === 'surgical_borrow_records_v9' || e.key === 'surgical_equipment_items_v9') {
            loadStateFromStorage();
            renderStatusTrackerCards();
        }
    });
});

function initApp() {
    loadStateFromStorage();
    setupORRoomDropdowns();
    renderStatusTrackerCards();
    renderFormEquipmentChecklist();
    setDefaultFormDates();
    setupThemeFromPreferences();
}

function loadStateFromStorage() {
    const savedEq = localStorage.getItem('surgical_equipment_items_v9');
    if (savedEq) {
        equipmentList = JSON.parse(savedEq);
        INITIAL_EQUIPMENT_LIST.forEach(initItem => {
            if (!equipmentList.some(item => item.id === initItem.id || item.name === initItem.name)) {
                equipmentList.push(initItem);
            }
        });
    } else {
        equipmentList = [...INITIAL_EQUIPMENT_LIST];
    }

    const savedRecords = localStorage.getItem('surgical_borrow_records_v9');
    if (savedRecords) {
        borrowRecords = JSON.parse(savedRecords);
    } else {
        borrowRecords = [];
    }
}

function saveRecordsToStorage() {
    localStorage.setItem('surgical_borrow_records_v9', JSON.stringify(borrowRecords));
    if (db) {
        db.ref('borrow_records').set(borrowRecords).catch(err => console.warn("Firebase Records Sync Error:", err));
    }
}

function setupORRoomDropdowns() {
    const formSelect = document.getElementById('or-room-select');
    const statusOrFilter = document.getElementById('status-or-filter');

    let formOptions = '<option value="" disabled selected>-- à¹€à¸¥à¸·à¸­à¸à¸«à¹‰à¸­à¸‡à¸œà¹ˆà¸²à¸•à¸±à¸” (OR 1 - OR 20) --</option>';
    let filterOptions = '<option value="">à¸—à¸¸à¸à¸«à¹‰à¸­à¸‡à¸œà¹ˆà¸²à¸•à¸±à¸” (OR 1 - 20)</option>';

    for (let i = 1; i <= 20; i++) {
        const roomName = `OR ${i}`;
        formOptions += `<option value="${roomName}">${roomName}</option>`;
        filterOptions += `<option value="${roomName}">${roomName}</option>`;
    }

    if (formSelect) formSelect.innerHTML = formOptions;
    if (statusOrFilter) statusOrFilter.innerHTML = filterOptions;
}

// --------------------------------------------------------------------------
// 4. Render Requisition Status Tracker
// --------------------------------------------------------------------------
function renderStatusTrackerCards() {
    const tbody = document.getElementById('simple-status-tbody');
    const emptyState = document.getElementById('simple-status-empty');
    if (!tbody) return;

    const orFilter = document.getElementById('status-or-filter')?.value || '';
    const dateFilterVal = document.getElementById('status-date-filter')?.value || '';
    const searchQuery = document.getElementById('status-search-input')?.value.trim().toLowerCase() || '';

    const filteredRecords = borrowRecords.filter(record => {
        if (orFilter && record.orRoom !== orFilter) return false;
        if (dateFilterVal && (record.requestDate !== dateFilterVal && record.usageDate !== dateFilterVal && record.borrowDate !== dateFilterVal)) return false;
        if (searchQuery) {
            const nameMatch = record.borrowerName.toLowerCase().includes(searchQuery);
            const idMatch = record.id.toLowerCase().includes(searchQuery);
            if (!nameMatch && !idMatch) return false;
        }
        return true;
    });

    if (filteredRecords.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    tbody.innerHTML = filteredRecords.map(record => {
        const isReady = record.status === 'ready';
        const isReturned = record.status === 'returned';

        let statusBadgeHtml = '';
        if (isReturned) {
            statusBadgeHtml = `<span class="status-badge returned"><i class="fa-solid fa-circle-check"></i> à¸„à¸·à¸™à¹à¸¥à¹‰à¸§</span>`;
        } else if (isReady) {
            statusBadgeHtml = `<span class="status-badge ready"><i class="fa-solid fa-circle-check"></i> à¸ˆà¸±à¸”à¹€à¸ªà¸£à¹‡à¸ˆà¹à¸¥à¹‰à¸§ (à¸žà¸£à¹‰à¸­à¸¡à¸£à¸±à¸š)</span>`;
        } else {
            statusBadgeHtml = `<span class="status-badge pending"><i class="fa-solid fa-boxes-packing"></i> à¸­à¸¢à¸¹à¹ˆà¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡à¸ˆà¸±à¸”à¹€à¸•à¸£à¸µà¸¢à¸¡</span>`;
        }

        const reqDateStr = formatThaiDate(record.requestDate || record.borrowDate);
        const reqTimeStr = record.requestTime ? ` (à¸¢à¸·à¹ˆà¸™à¸ªà¹ˆà¸‡à¹€à¸šà¸´à¸à¹€à¸§à¸¥à¸² ${record.requestTime} à¸™.)` : '';

        return `
            <tr>
                <td><span class="or-badge large-or"><i class="fa-solid fa-door-closed"></i> ${escapeHtml(record.orRoom)}</span></td>
                <td>
                    <div class="borrower-name-cell">${escapeHtml(record.borrowerName)}</div>
                    <div class="borrower-id-sub">à¸£à¸«à¸±à¸ªà¹€à¸šà¸´à¸: ${record.id} | à¸¢à¸·à¹ˆà¸™à¹€à¸šà¸´à¸à¹€à¸¡à¸·à¹ˆà¸­: <strong>${reqDateStr}${reqTimeStr}</strong></div>
                </td>
                <td style="text-align: center;">${statusBadgeHtml}</td>
            </tr>
        `;
    }).join('');
}

// --------------------------------------------------------------------------
// 5. Form Modal Controls & Categorized Checklist
// --------------------------------------------------------------------------
function openBorrowFormModal() {
    document.getElementById('borrow-form-modal').style.display = 'flex';
    setDefaultFormDates();
    renderFormEquipmentChecklist();
}

function closeBorrowFormModal() {
    document.getElementById('borrow-form-modal').style.display = 'none';
}

function setDefaultFormDates() {
    const today = getFormattedDate(0);
    const tomorrow = getFormattedDate(1);

    const usageDate = document.getElementById('usage-date');
    const retDate = document.getElementById('expected-return-date');

    if (usageDate && !usageDate.value) usageDate.value = today;
    if (retDate && !retDate.value) retDate.value = tomorrow;
}

function switchFormCategoryTab(cat) {
    currentFormCategoryTab = cat;
    
    const btns = document.querySelectorAll('#category-nav-bar .cat-nav-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('data-cat') === cat) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    renderFormEquipmentChecklist();
}

function renderFormEquipmentChecklist() {
    const container = document.getElementById('equipment-checklist-container');
    if (!container) return;

    const searchQuery = document.getElementById('form-eq-search')?.value.trim().toLowerCase() || '';

    let filteredList = equipmentList.filter(item => item.active);
    if (searchQuery) {
        filteredList = filteredList.filter(item => 
            item.name.toLowerCase().includes(searchQuery) || 
            item.category.toLowerCase().includes(searchQuery)
        );
    }

    if (filteredList.length === 0) {
        container.innerHTML = '<div class="empty-state">à¹„à¸¡à¹ˆà¸žà¸šà¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸•à¸²à¸¡à¸„à¸³à¸„à¹‰à¸™à¸«à¸²</div>';
        return;
    }

    const categories = ['Set Package', 'à¸­à¸¸à¸›à¸à¸£à¸“à¹Œà¸—à¸±à¹ˆà¸§à¹„à¸›', 'Set à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸¡à¸·à¸­', 'Set à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸œà¹‰à¸²', 'à¸•à¸¹à¹‰ Ortho', 'à¸•à¸¹à¹‰ Neuro', 'à¸•à¸¹à¹‰ General', 'à¸•à¸¹à¹‰ Plastic', 'à¸•à¸¹à¹‰ Ob-gyn', 'à¸•à¸¹à¹‰ Uro + Ob-gyn'];
    let html = '';

    categories.forEach(cat => {
        if (currentFormCategoryTab !== 'all' && currentFormCategoryTab !== cat) return;

        const catItems = filteredList.filter(item => item.category === cat);
        if (catItems.length === 0 && searchQuery === '') return;

        const itemsCardsHtml = catItems.map(item => {
            const state = selectedEquipmentState[item.id] || { selected: false, qty: 1 };
            const isSelected = state.selected;
            const qty = state.qty || 1;

            return `
                <div class="equipment-item-card ${isSelected ? 'selected' : ''}" id="eq-card-${item.id}">
                    <label class="item-checkbox-wrapper">
                        <input type="checkbox" id="chk-${item.id}" ${isSelected ? 'checked' : ''} onchange="toggleEquipmentSelect('${item.id}')">
                        <span class="item-title">${escapeHtml(item.name)}</span>
                    </label>
                    
                    <div class="qty-stepper">
                        <button type="button" class="qty-btn" onclick="changeEquipmentQty('${item.id}', -1)">-</button>
                        <input type="text" class="qty-input" id="qty-input-${item.id}" value="${qty}" readonly>
                        <button type="button" class="qty-btn" onclick="changeEquipmentQty('${item.id}', 1)">+</button>
                    </div>
                </div>
            `;
        }).join('');

        html += `
            <div class="category-group-card">
                <div class="category-header">
                    <h4><i class="fa-solid fa-folder-open"></i> ${cat}</h4>
                    <span class="category-count-tag">${catItems.length} à¸£à¸²à¸¢à¸à¸²à¸£</span>
                </div>
                <div class="category-items-grid">
                    ${itemsCardsHtml.length > 0 ? itemsCardsHtml : '<div style="color:var(--text-muted); font-size:0.85rem; padding:0.5rem;">à¹„à¸¡à¹ˆà¸¡à¸µà¸£à¸²à¸¢à¸à¸²à¸£à¹ƒà¸™à¸«à¸¡à¸§à¸”à¸™à¸µà¹‰</div>'}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateSelectedSummaryBar();
}

function toggleEquipmentSelect(id) {
    const chk = document.getElementById(`chk-${id}`);
    const card = document.getElementById(`eq-card-${id}`);

    if (!selectedEquipmentState[id]) {
        selectedEquipmentState[id] = { selected: false, qty: 1 };
    }

    const isSelected = chk ? chk.checked : false;
    selectedEquipmentState[id].selected = isSelected;

    if (card) {
        if (isSelected) card.classList.add('selected');
        else card.classList.remove('selected');
    }

    updateSelectedSummaryBar();
}

function changeEquipmentQty(id, delta) {
    if (!selectedEquipmentState[id]) {
        selectedEquipmentState[id] = { selected: true, qty: 1 };
    }

    let currentQty = selectedEquipmentState[id].qty || 1;
    currentQty += delta;
    if (currentQty < 1) currentQty = 1;

    selectedEquipmentState[id].qty = currentQty;
    selectedEquipmentState[id].selected = true;

    const input = document.getElementById(`qty-input-${id}`);
    const chk = document.getElementById(`chk-${id}`);
    const card = document.getElementById(`eq-card-${id}`);

    if (input) input.value = currentQty;
    if (chk) chk.checked = true;
    if (card) card.classList.add('selected');

    updateSelectedSummaryBar();
}

function clearAllSelectedInstruments() {
    selectedEquipmentState = {};
    renderFormEquipmentChecklist();
}

function updateSelectedSummaryBar() {
    let count = 0;
    let totalQty = 0;

    Object.keys(selectedEquipmentState).forEach(id => {
        if (selectedEquipmentState[id].selected) {
            count++;
            totalQty += (selectedEquipmentState[id].qty || 1);
        }
    });

    const countEl = document.getElementById('selected-items-count');
    const qtyEl = document.getElementById('selected-total-qty');
    if (countEl) countEl.innerText = count;
    if (qtyEl) qtyEl.innerText = totalQty;
}

// --------------------------------------------------------------------------
// 6. Form Submission (Automatically captures submission timestamp)
// --------------------------------------------------------------------------
function handleFormSubmit(event) {
    event.preventDefault();

    const borrowerName = document.getElementById('borrower-name').value.trim();
    const orRoom = document.getElementById('or-room-select').value;
    
    const requestDate = getFormattedDate(0);
    const requestTime = getFormattedTime();

    const usageDate = document.getElementById('usage-date').value;
    const expectedReturnDate = document.getElementById('expected-return-date').value;
    const notes = document.getElementById('borrow-notes').value.trim();

    const selectedInstruments = [];
    Object.keys(selectedEquipmentState).forEach(id => {
        if (selectedEquipmentState[id].selected) {
            const item = equipmentList.find(e => e.id === id);
            if (item) {
                selectedInstruments.push({
                    name: item.name,
                    qty: selectedEquipmentState[id].qty || 1,
                    category: item.category
                });
            }
        }
    });

    if (selectedInstruments.length === 0) {
        showToast('à¸à¸£à¸¸à¸“à¸²à¹€à¸¥à¸·à¸­à¸à¹€à¸„à¸£à¸·à¹ˆà¸­à¸‡à¸¡à¸·à¸­à¸œà¹ˆà¸²à¸•à¸±à¸”à¸­à¸¢à¹ˆà¸²à¸‡à¸™à¹‰à¸­à¸¢ 1 à¸£à¸²à¸¢à¸à¸²à¸£', 'danger');
        return;
    }

    const newRecord = {
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        borrowerName,
        orRoom,
        requestDate,
        requestTime,
        usageDate,
        expectedReturnDate,
        actualReturnDate: null,
        instruments: selectedInstruments,
        status: 'pending',
        prepStatusText: 'à¸­à¸¢à¸¹à¹ˆà¸£à¸°à¸«à¸§à¹ˆà¸²à¸‡à¸ˆà¸±à¸”à¹€à¸•à¸£à¸µà¸¢à¸¡',
        condition: '',
        notes,
        createdAt: new Date().toISOString()
    };

    loadStateFromStorage();
    borrowRecords.unshift(newRecord);
    saveRecordsToStorage();

    document.getElementById('borrow-form').reset();
    selectedEquipmentState = {};
    closeBorrowFormModal();
    renderStatusTrackerCards();

    showToast(`à¸ªà¹ˆà¸‡à¸„à¸³à¸‚à¸­à¹€à¸šà¸´à¸à¸ªà¸³à¸«à¸£à¸±à¸š ${orRoom} (à¹€à¸§à¸¥à¸² ${requestTime} à¸™.) à¹€à¸£à¸µà¸¢à¸šà¸£à¹‰à¸­à¸¢à¹à¸¥à¹‰à¸§!`, 'success');
}

// --------------------------------------------------------------------------
// 7. Helpers
// --------------------------------------------------------------------------
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="${type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'}"></i>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function formatThaiDate(dateString) {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;

    const year = parseInt(parts[0]) + 543;
    const monthNames = ['à¸¡.à¸„.', 'à¸.à¸ž.', 'à¸¡à¸µ.à¸„.', 'à¹€à¸¡.à¸¢.', 'à¸ž.à¸„.', 'à¸¡à¸´.à¸¢.', 'à¸.à¸„.', 'à¸ª.à¸„.', 'à¸.à¸¢.', 'à¸•.à¸„.', 'à¸ž.à¸¢.', 'à¸˜.à¸„.'];
    const month = monthNames[parseInt(parts[1]) - 1];
    const day = parseInt(parts[2]);

    return `${day} ${month} ${year}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[m]);
}

function setupThemeFromPreferences() {
    const savedTheme = localStorage.getItem('theme_preference');
    const themeIcon = document.getElementById('theme-icon');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const themeIcon = document.getElementById('theme-icon');

    if (isDark) {
        localStorage.setItem('theme_preference', 'dark');
        if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
    } else {
        localStorage.setItem('theme_preference', 'light');
        if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
    }
}

