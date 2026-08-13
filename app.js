/**
 * ==========================================================================
 * ระบบเบิกเครื่องมือผ่าตัด - ฝ่ายห้องจัดเตรียมอุปกรณ์ (Prep Room Dashboard System)
 * Dedicated Script for index.html (Computer System for Prep Staff)
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. Initial Equipment Datasets (6 Categories with Sample Instruments)
// --------------------------------------------------------------------------
const INITIAL_EQUIPMENT_LIST = [
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

    { id: 'eq-20', name: 'Set Major Surgery (เซ็ตผ่าตัดใหญ่)', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-21', name: 'Set Minor Surgery (เซ็ตผ่าตัดเล็ก)', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-22', name: 'Set Laparoscopy Instrument (เซ็ตกล้องส่องผ่าตัด)', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-23', name: 'Set Orthopedic Basic', category: 'Set เครื่องมือ', active: true },
    { id: 'eq-24', name: 'Set Appendectomy (เซ็ตไส้ติ่ง)', category: 'Set เครื่องมือ', active: true },

    { id: 'eq-30', name: 'Set ผ้าผ่าตัดทั่วไป (General Drape Set)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-31', name: 'Set ผ้าส่องกล้อง (Laparoscopy Drape)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-32', name: 'Set ผ้ากระดูกและข้อ (Ortho Drape)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-33', name: 'เสื้อกาวน์ผ่าตัด (Surgical Gown)', category: 'Set เครื่องผ้า', active: true },
    { id: 'eq-34', name: 'ผ้าคลุมเตียงผ่าตัด (Drape Sheet)', category: 'Set เครื่องผ้า', active: true },

    { id: 'eq-40', name: 'Scalpel Handle #3 / #4 (ด้ามมีดผ่าตัด)', category: 'ตู้ General', active: true },
    { id: 'eq-41', name: 'Electrocautery Pencil (ด้ามจี้ไฟฟ้า)', category: 'ตู้ General', active: true },
    { id: 'eq-42', name: 'Harmonic Scalpel Handpiece', category: 'ตู้ General', active: true },
    { id: 'eq-43', name: 'Skin Stapler', category: 'ตู้ General', active: true },
    { id: 'eq-44', name: 'Suction Tip (Yankauer / Poole)', category: 'ตู้ General', active: true },

    { id: 'eq-50', name: 'Micro Scissors (กรรไกรตกแต่งศัลยกรรม)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-51', name: 'Adson Tooth Forceps (1x2)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-52', name: 'Plastic Needle Holder (Castroviejo)', category: 'ตู้ Plastic', active: true },
    { id: 'eq-53', name: 'Skin Hook Retractor', category: 'ตู้ Plastic', active: true },
    { id: 'eq-54', name: 'Freer Elevator', category: 'ตู้ Plastic', active: true },

    { id: 'eq-60', name: 'Set ผ่าตัดทำคลอด C-Section', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-61', name: 'Vaginal Speculum (Graves/Pederson)', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-62', name: 'Tenaculum Forceps', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-63', name: 'Uterine Sound', category: 'ตู้ Ob-gyn', active: true },
    { id: 'eq-64', name: 'Ovum Forceps / Curette', category: 'ตู้ Ob-gyn', active: true }
];

const getFormattedDate = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
};

const INITIAL_BORROW_RECORDS = [
    {
        id: 'REQ-1001',
        borrowerName: 'นพ.สมชาย วิเศษศิริ',
        orRoom: 'OR 3',
        requestDate: getFormattedDate(0),
        requestTime: '08:15',
        usageDate: getFormattedDate(0),
        expectedReturnDate: getFormattedDate(1),
        actualReturnDate: null,
        instruments: [
            { name: 'Army-Navy', qty: 2, category: 'อุปกรณ์ทั่วไป' },
            { name: 'Set Major Surgery (เซ็ตผ่าตัดใหญ่)', qty: 1, category: 'Set เครื่องมือ' },
            { name: 'Mosquito Forceps', qty: 4, category: 'อุปกรณ์ทั่วไป' },
            { name: 'Set ผ้าผ่าตัดทั่วไป (General Drape Set)', qty: 1, category: 'Set เครื่องผ้า' }
        ],
        status: 'pending',
        prepStatusText: 'อยู่ระหว่างจัดเตรียม',
        condition: '',
        notes: 'เคสผ่าตัดรอบเช้า OR 3',
        createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 'REQ-1002',
        borrowerName: 'พย.วิภา สุขสรรค์',
        orRoom: 'OR 7',
        requestDate: getFormattedDate(0),
        requestTime: '09:30',
        usageDate: getFormattedDate(0),
        expectedReturnDate: getFormattedDate(0),
        actualReturnDate: null,
        instruments: [
            { name: 'Set Laparoscopy Instrument (เซ็ตกล้องส่องผ่าตัด)', qty: 1, category: 'Set เครื่องมือ' },
            { name: 'Harmonic Scalpel Handpiece', qty: 1, category: 'ตู้ General' },
            { name: 'Deaver', qty: 2, category: 'อุปกรณ์ทั่วไป' }
        ],
        status: 'ready',
        prepStatusText: 'จัดเตรียมเสร็จแล้ว (พร้อมมารับ)',
        condition: '',
        notes: 'ผ่าตัดส่องกล้องถุงน้ำดี',
        createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
        id: 'REQ-1003',
        borrowerName: 'พญ.ศิรินทร์ นรินทร์ฤทธิ์',
        orRoom: 'OR 15',
        requestDate: getFormattedDate(-1),
        requestTime: '14:20',
        usageDate: getFormattedDate(-1),
        expectedReturnDate: getFormattedDate(0),
        actualReturnDate: getFormattedDate(0),
        instruments: [
            { name: 'Set ผ่าตัดทำคลอด C-Section', qty: 1, category: 'ตู้ Ob-gyn' },
            { name: 'Tenaculum Forceps', qty: 2, category: 'ตู้ Ob-gyn' },
            { name: 'Vaginal Speculum (Graves/Pederson)', qty: 1, category: 'ตู้ Ob-gyn' }
        ],
        status: 'returned',
        prepStatusText: 'คืนเรียบร้อยแล้ว',
        condition: 'ปกติ (Complete)',
        notes: 'เคสสูตินรีเวช OR 15 - คืนเรียบร้อย',
        createdAt: new Date(Date.now() - 86400000).toISOString()
    }
];

// --------------------------------------------------------------------------
// 2. Global State Variables & Firebase Initialization
// --------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDVxJxGGqMLgVgcjPSQ7LxZDJQDTJPPOCU",
  authDomain: "borrow-systems-9.firebaseapp.com",
  databaseURL: "https://borrow-systems-9-default-rtdb.firebaseio.com",
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
        try {
            db = firebase.database();
        } catch (e1) {
            // Fallback for Asia-Southeast1 region
            firebaseConfig.databaseURL = "https://borrow-systems-9-default-rtdb.asia-southeast1.firebasedatabase.app";
            firebase.initializeApp(firebaseConfig, "asia-app");
            db = firebase.app("asia-app").database();
        }
        console.log("🟢 Firebase Realtime Database Initialized Successfully!");
    }
} catch (err) {
    console.error("🔴 Firebase initialization error:", err);
}

let equipmentList = [];
let borrowRecords = [];
let currentFilterStatus = 'pending';
let currentSearchQuery = '';
let currentFilterOrRoom = '';
let currentDatePreset = 'all';

// Time Sorting State: 'asc' = ยื่นส่งก่อนขึ้นก่อน (FIFO Queue for Staff), 'desc' = ส่งล่าสุดขึ้นก่อน
let timeSortDirection = 'asc';

// --------------------------------------------------------------------------
// 3. Initialization & Real-time Synchronization (Firebase + LocalStorage)
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initApp();

    // Listen to real-time updates from Firebase Database
    if (db) {
        db.ref('borrow_records').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && Array.isArray(data)) {
                borrowRecords = data;
                localStorage.setItem('surgical_borrow_records_v9', JSON.stringify(borrowRecords));
                renderBorrowTable();
                updateStatistics();
            }
        });

        db.ref('equipment_items').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && Array.isArray(data)) {
                equipmentList = data;
                localStorage.setItem('surgical_equipment_items_v9', JSON.stringify(equipmentList));
            }
        });
    }

    // Listen to real-time submission from status.html on same browser/device
    window.addEventListener('storage', (e) => {
        if (e.key === 'surgical_borrow_records_v9' || e.key === 'surgical_equipment_items_v9') {
            loadStateFromStorage();
            renderBorrowTable();
            updateStatistics();
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
    const savedEq = localStorage.getItem('surgical_equipment_items_v9');
    if (savedEq) {
        equipmentList = JSON.parse(savedEq);
    } else {
        equipmentList = [...INITIAL_EQUIPMENT_LIST];
        saveEquipmentToStorage();
    }

    const savedRecords = localStorage.getItem('surgical_borrow_records_v9');
    if (savedRecords) {
        borrowRecords = JSON.parse(savedRecords);
    } else {
        borrowRecords = [...INITIAL_BORROW_RECORDS];
        saveRecordsToStorage();
    }
}

function saveEquipmentToStorage() {
    localStorage.setItem('surgical_equipment_items_v9', JSON.stringify(equipmentList));
    if (db) {
        db.ref('equipment_items').set(equipmentList).catch(err => console.warn("Firebase Equipment Sync Error:", err));
    }
}

function saveRecordsToStorage() {
    localStorage.setItem('surgical_borrow_records_v9', JSON.stringify(borrowRecords));
    if (db) {
        db.ref('borrow_records').set(borrowRecords).catch(err => console.warn("Firebase Records Sync Error:", err));
    }
}

function setupORRoomDropdowns() {
    const filterSelect = document.getElementById('or-room-filter');
    let filterOptions = '<option value="">ทุกห้องผ่าตัด (OR 1 - 20)</option>';

    for (let i = 1; i <= 20; i++) {
        const roomName = `OR ${i}`;
        filterOptions += `<option value="${roomName}">${roomName}</option>`;
    }

    if (filterSelect) filterSelect.innerHTML = filterOptions;
}

// --------------------------------------------------------------------------
// 4. Sorting & Filtering Controls
// --------------------------------------------------------------------------
function toggleTimeSortOrder() {
    timeSortDirection = (timeSortDirection === 'asc') ? 'desc' : 'asc';
    
    const label = document.getElementById('sort-time-label');
    const icon = document.getElementById('sort-time-icon');

    if (timeSortDirection === 'asc') {
        if (label) label.innerText = 'เรียงตามเวลา: ยื่นส่งก่อนขึ้นก่อน (คิวแรก FIFO)';
        if (icon) icon.className = 'fa-solid fa-arrow-down-short-wide';
        showToast('เปลี่ยนเป็นเรียงคิว: ผู้ยื่นเบิกก่อนขึ้นก่อน (FIFO)', 'success');
    } else {
        if (label) label.innerText = 'เรียงตามเวลา: ยื่นส่งล่าสุดขึ้นก่อน (Newest)';
        if (icon) icon.className = 'fa-solid fa-arrow-up-wide-short';
        showToast('เปลี่ยนเป็นเรียงคิว: รายการใหม่ล่าสุดขึ้นก่อน', 'success');
    }

    renderBorrowTable();
}

function setDatePreset(preset) {
    currentDatePreset = preset;
    const input = document.getElementById('date-filter-input');

    const btns = document.querySelectorAll('.date-presets .btn-preset');
    btns.forEach(btn => {
        if (btn.getAttribute('data-preset') === preset) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    if (preset === 'today') {
        if (input) input.value = getFormattedDate(0);
    } else if (preset === 'yesterday') {
        if (input) input.value = getFormattedDate(-1);
    } else if (preset === 'all') {
        if (input) input.value = '';
    } else if (preset === '7days') {
        if (input) input.value = '';
    }

    handleSearchFilter();
}

function matchesDateFilter(record, dateInputVal, preset) {
    const targetDate = record.requestDate || record.usageDate || record.borrowDate;
    if (!targetDate) return true;

    if (dateInputVal) {
        return targetDate === dateInputVal || record.usageDate === dateInputVal;
    }

    if (preset === 'today') {
        const today = getFormattedDate(0);
        return targetDate === today || record.usageDate === today;
    } else if (preset === 'yesterday') {
        const yest = getFormattedDate(-1);
        return targetDate === yest || record.usageDate === yest;
    } else if (preset === '7days') {
        const recordTime = new Date(targetDate).getTime();
        const sevenDaysAgo = new Date().getTime() - (7 * 86400000);
        return recordTime >= sevenDaysAgo;
    }

    return true;
}

function handleSearchFilter() {
    currentSearchQuery = document.getElementById('search-input').value.trim().toLowerCase();
    currentFilterOrRoom = document.getElementById('or-room-filter').value;
    
    const clearBtn = document.getElementById('clear-search-btn');
    if (clearBtn) {
        clearBtn.style.display = currentSearchQuery ? 'block' : 'none';
    }

    renderBorrowTable();
}

function clearSearch() {
    document.getElementById('search-input').value = '';
    handleSearchFilter();
}

function setFilterStatus(status) {
    currentFilterStatus = status;
    
    const buttons = document.querySelectorAll('.segmented-control .segment-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-status') === status) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderBorrowTable();
}

function resetFilters() {
    currentFilterStatus = 'pending';
    currentSearchQuery = '';
    currentFilterOrRoom = '';
    currentDatePreset = 'all';
    timeSortDirection = 'asc';

    document.getElementById('search-input').value = '';
    document.getElementById('or-room-filter').value = '';
    document.getElementById('date-filter-input').value = '';
    
    const btns = document.querySelectorAll('.date-presets .btn-preset');
    btns.forEach(btn => {
        if (btn.getAttribute('data-preset') === 'all') btn.classList.add('active');
        else btn.classList.remove('active');
    });

    const label = document.getElementById('sort-time-label');
    const icon = document.getElementById('sort-time-icon');
    if (label) label.innerText = 'เรียงตามเวลา: ยื่นส่งก่อนขึ้นก่อน (คิวแรก FIFO)';
    if (icon) icon.className = 'fa-solid fa-arrow-down-short-wide';

    setFilterStatus('pending');
}

function updatePrepStatus(recordId, newStatus) {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    record.status = newStatus;
    if (newStatus === 'ready') {
        record.prepStatusText = 'จัดเตรียมเสร็จแล้ว (พร้อมมารับ)';
        showToast(`บันทึกการจัดเตรียมสำหรับ ${record.orRoom} เสร็จแล้ว! ผู้เบิกสามารถมารับได้ทันที`, 'success');
    } else if (newStatus === 'pending') {
        record.prepStatusText = 'อยู่ระหว่างจัดเตรียม';
    }

    saveRecordsToStorage();
    renderBorrowTable();
    updateStatistics();
}

function renderBorrowTable() {
    const tbody = document.getElementById('borrow-table-body');
    const emptyState = document.getElementById('empty-state');
    const tableTitle = document.getElementById('table-title');
    if (!tbody) return;

    const todayStr = getFormattedDate(0);
    const dateInputVal = document.getElementById('date-filter-input')?.value || '';

    if (currentFilterStatus === 'pending') tableTitle.innerText = 'รายการอุปกรณ์ที่อยู่ระหว่างการจัดเตรียม';
    else if (currentFilterStatus === 'ready') tableTitle.innerText = 'รายการอุปกรณ์ที่จัดเตรียมเสร็จแล้ว (พร้อมให้มารับ)';
    else if (currentFilterStatus === 'overdue') tableTitle.innerText = 'รายการอุปกรณ์ที่เกินกำหนดวันคืน (Overdue)';
    else if (currentFilterStatus === 'returned') tableTitle.innerText = 'ประวัติรายการที่คืนเรียบร้อยแล้ว';
    else tableTitle.innerText = 'รายการประวัติการเบิก-คืนเครื่องมือทั้งหมด';

    let filteredRecords = borrowRecords.filter(record => {
        const isOverdue = record.status !== 'returned' && (record.expectedReturnDate || record.borrowDate) < todayStr;
        
        if (currentFilterStatus === 'pending' && record.status !== 'pending') return false;
        if (currentFilterStatus === 'ready' && record.status !== 'ready') return false;
        if (currentFilterStatus === 'returned' && record.status !== 'returned') return false;
        if (currentFilterStatus === 'overdue' && !isOverdue) return false;

        if (currentFilterOrRoom && record.orRoom !== currentFilterOrRoom) return false;

        if (!matchesDateFilter(record, dateInputVal, currentDatePreset)) return false;

        if (currentSearchQuery) {
            const nameMatch = record.borrowerName.toLowerCase().includes(currentSearchQuery);
            const orMatch = record.orRoom.toLowerCase().includes(currentSearchQuery);
            const instMatch = record.instruments.some(inst => 
                (typeof inst === 'object' ? inst.name : inst).toLowerCase().includes(currentSearchQuery)
            );
            const idMatch = record.id.toLowerCase().includes(currentSearchQuery);
            if (!nameMatch && !orMatch && !instMatch && !idMatch) return false;
        }

        return true;
    });

    filteredRecords.sort((a, b) => {
        const timeA = new Date(a.createdAt || `${a.requestDate || a.borrowDate}T${a.requestTime || '00:00'}`).getTime();
        const timeB = new Date(b.createdAt || `${b.requestDate || b.borrowDate}T${b.requestTime || '00:00'}`).getTime();
        
        if (timeSortDirection === 'asc') {
            return timeA - timeB; // ยื่นส่งก่อนขึ้นก่อน (FIFO Queue)
        } else {
            return timeB - timeA;
        }
    });

    if (filteredRecords.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    tbody.innerHTML = filteredRecords.map(record => {
        const isOverdue = record.status !== 'returned' && (record.expectedReturnDate || record.borrowDate) < todayStr;
        
        let statusBadgeHtml = '';
        if (record.status === 'returned') {
            statusBadgeHtml = `<span class="status-badge returned"><i class="fa-solid fa-circle-check"></i> คืนแล้ว</span>`;
        } else if (record.status === 'ready') {
            statusBadgeHtml = `<span class="status-badge ready"><i class="fa-solid fa-circle-check"></i> จัดเสร็จแล้ว (พร้อมรับ)</span>`;
        } else if (isOverdue) {
            statusBadgeHtml = `<span class="status-badge overdue"><i class="fa-solid fa-triangle-exclamation"></i> เกินกำหนดคืน</span>`;
        } else {
            statusBadgeHtml = `<span class="status-badge pending"><i class="fa-solid fa-boxes-packing"></i> อยู่ระหว่างจัดเตรียม</span>`;
        }

        const instrumentPillsHtml = record.instruments.map(inst => {
            if (typeof inst === 'object') {
                return `<span class="equipment-pill">${escapeHtml(inst.name)} <span class="qty-badge">x${inst.qty}</span></span>`;
            } else {
                return `<span class="equipment-pill">${escapeHtml(inst)} <span class="qty-badge">x1</span></span>`;
            }
        }).join('');

        const reqDateStr = formatThaiDate(record.requestDate || record.borrowDate);
        const reqTimeStr = record.requestTime ? `${record.requestTime} น.` : '';

        const usageDateStr = formatThaiDate(record.usageDate || record.borrowDate);
        const retDateStr = formatThaiDate(record.expectedReturnDate || record.borrowDate);

        const actionBtnsHtml = `
            <div class="table-actions-cell">
                ${record.status === 'pending' ? `
                    <button class="btn-ready-action btn-sm" onclick="updatePrepStatus('${record.id}', 'ready')">
                        <i class="fa-solid fa-check"></i> จัดเสร็จแล้ว (พร้อมรับ)
                    </button>
                ` : ''}

                <button class="btn-outline btn-sm" onclick="printBorrowChecklist('${record.id}')" title="พิมพ์ใบจัดเตรียมเครื่องมือ">
                    <i class="fa-solid fa-print"></i> พิมพ์ Checklist
                </button>

                ${record.status !== 'returned' ? `
                    <button class="btn-success btn-sm" onclick="openReturnModal('${record.id}')">
                        <i class="fa-solid fa-hand-holding-medical"></i> รับคืน
                    </button>
                ` : `
                    <button class="btn-secondary btn-sm" onclick="viewRecordDetails('${record.id}')">
                        <i class="fa-solid fa-circle-info"></i> รายละเอียด
                    </button>
                `}
            </div>
        `;

        return `
            <tr>
                <td><span class="or-badge"><i class="fa-solid fa-door-closed"></i> ${escapeHtml(record.orRoom)}</span></td>
                <td>
                    <strong>${escapeHtml(record.borrowerName)}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${record.id}</div>
                </td>
                <td><div class="equipment-tags-list">${instrumentPillsHtml}</div></td>
                <td>
                    <div>${reqDateStr}</div>
                    <div style="font-size:0.85rem; color:var(--primary); font-weight:700;"><i class="fa-solid fa-clock"></i> ${reqTimeStr}</div>
                </td>
                <td><strong style="color:var(--text-primary);">${usageDateStr}</strong></td>
                <td><span class="${isOverdue ? 'text-danger font-bold' : ''}">${retDateStr}</span></td>
                <td>${statusBadgeHtml}</td>
                <td>${actionBtnsHtml}</td>
            </tr>
        `;
    }).join('');
}

function updateStatistics() {
    const todayStr = getFormattedDate(0);

    const totalCount = borrowRecords.length;
    const pendingCount = borrowRecords.filter(r => r.status === 'pending').length;
    const readyCount = borrowRecords.filter(r => r.status === 'ready').length;
    const overdueCount = borrowRecords.filter(r => r.status !== 'returned' && (r.expectedReturnDate || r.borrowDate) < todayStr).length;

    document.getElementById('stat-total').innerText = totalCount;
    document.getElementById('stat-pending').innerText = pendingCount;
    document.getElementById('stat-ready').innerText = readyCount;
    document.getElementById('stat-overdue').innerText = overdueCount;
}

// --------------------------------------------------------------------------
// 5. Printable Checklist Feature
// --------------------------------------------------------------------------
function printBorrowChecklist(recordId) {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    const container = document.getElementById('printable-checklist-container');
    if (!container) return;

    const itemsRowsHtml = record.instruments.map((inst, idx) => {
        const name = typeof inst === 'object' ? inst.name : inst;
        const qty = typeof inst === 'object' ? inst.qty : 1;
        const cat = typeof inst === 'object' ? (inst.category || 'อุปกรณ์ทั่วไป') : 'อุปกรณ์ทั่วไป';

        return `
            <tr>
                <td style="text-align:center; width: 60px;"><span class="print-check-box"></span></td>
                <td style="width: 140px; font-weight: 500; color: #475569;">${escapeHtml(cat)}</td>
                <td><strong style="font-size:0.95rem; color:#0f172a;">${escapeHtml(name)}</strong></td>
                <td style="text-align:center; width: 90px;"><span class="print-qty-badge">${qty} ชิ้น</span></td>
                <td style="width: 160px; color:#94a3b8; font-size: 0.8rem;">[ หมายเหตุการจัด ]</td>
            </tr>
        `;
    }).join('');

    const totalItemsCount = record.instruments.length;
    const totalUnitsCount = record.instruments.reduce((sum, inst) => sum + (typeof inst === 'object' ? inst.qty : 1), 0);

    const reqDateStr = `${formatThaiDate(record.requestDate || record.borrowDate)} ${record.requestTime ? 'เวลา ' + record.requestTime + ' น.' : ''}`;
    const usageDateStr = formatThaiDate(record.usageDate || record.borrowDate);
    const retDateStr = formatThaiDate(record.expectedReturnDate || record.borrowDate);

    container.innerHTML = `
        <div class="print-doc-header">
            <div class="print-header-brand">
                <i class="fa-solid fa-kit-medical"></i>
                <div>
                    <h2>ใบจัดเตรียมเครื่องมือผ่าตัด (Equipment Prep Checklist)</h2>
                    <p>หน่วยงานจัดเตรียมและเบิกจ่ายเครื่องมือผ่าตัด / OR Prep Room</p>
                </div>
            </div>
            <div class="print-doc-ref">
                <div class="print-or-badge">${escapeHtml(record.orRoom)}</div>
                <div class="print-ref-id">ใบคำขอเบิกเลขที่: ${record.id}</div>
            </div>
        </div>

        <div class="print-info-grid">
            <div class="print-info-item"><span class="label">ชื่อ-นามสกุล ผู้เบิก:</span> <span class="value font-bold">${escapeHtml(record.borrowerName)}</span></div>
            <div class="print-info-item"><span class="label">เบอร์ห้องผ่าตัด:</span> <span class="value font-bold">${escapeHtml(record.orRoom)}</span></div>
            <div class="print-info-item"><span class="label">วันที่ & เวลาที่ยื่นเบิก:</span> <span class="value font-bold" style="color:#0284c7;">${reqDateStr}</span></div>
            <div class="print-info-item"><span class="label">วันที่ใช้อุปกรณ์:</span> <span class="value">${usageDateStr}</span></div>
            <div class="print-info-item"><span class="label">กำหนดวันที่คืน:</span> <span class="value">${retDateStr}</span></div>
            <div class="print-info-item"><span class="label">หมายเหตุคำขอ:</span> <span class="value">${escapeHtml(record.notes || '- ไม่มี -')}</span></div>
        </div>

        <div style="margin-bottom:0.6rem; display:flex; justify-content:space-between; font-weight:600; font-size:0.9rem;">
            <span>รายการอุปกรณ์ที่ต้องเข้าไปจัดเตรียมในคลัง (${totalItemsCount} รายการ / รวมทั้งสิ้น ${totalUnitsCount} ชิ้น):</span>
            <span style="color:#0284c7;">* พนักงานจัดของเรียงตามเวลาที่ยื่นส่งเบิกเข้ามา</span>
        </div>

        <table class="print-checklist-table">
            <thead>
                <tr>
                    <th style="text-align:center;">[ ✓ ] จัดแล้ว</th>
                    <th>หมวดหมู่</th>
                    <th>รายการเครื่องมือผ่าตัด</th>
                    <th style="text-align:center;">จำนวน</th>
                    <th>หมายเหตุ / สภาพ</th>
                </tr>
            </thead>
            <tbody>
                ${itemsRowsHtml}
            </tbody>
        </table>

        <div class="print-signatures-footer">
            <div class="signature-box">
                <div class="signature-line"></div>
                <div>( ................................................................ )</div>
                <div>เจ้าหน้าที่ผู้จัดเตรียมอุปกรณ์ (Prep Staff)</div>
            </div>
            <div class="signature-box">
                <div class="signature-line"></div>
                <div>( ................................................................ )</div>
                <div>เจ้าหน้าที่ผู้ตรวจเช็ค / ผู้รับมอบ (Inspector/Receiver)</div>
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

// --------------------------------------------------------------------------
// 6. Return Modal
// --------------------------------------------------------------------------
function openReturnModal(recordId) {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    document.getElementById('return-borrow-id').value = record.id;
    document.getElementById('actual-return-date').value = getFormattedDate(0);
    document.getElementById('return-notes').value = '';

    const itemsSummary = record.instruments.map(inst => {
        if (typeof inst === 'object') return `${inst.name} (x${inst.qty})`;
        return inst;
    }).join(', ');

    const summaryBox = document.getElementById('return-summary-box');
    summaryBox.innerHTML = `
        <div style="margin-bottom:0.4rem;"><strong>รหัสรายการ:</strong> ${record.id}</div>
        <div style="margin-bottom:0.4rem;"><strong>ห้องผ่าตัด:</strong> ${record.orRoom}</div>
        <div style="margin-bottom:0.4rem;"><strong>ผู้เบิก:</strong> ${escapeHtml(record.borrowerName)}</div>
        <div style="margin-bottom:0.4rem;"><strong>อุปกรณ์ที่เบิก:</strong> ${itemsSummary}</div>
        <div><strong>ยื่นเบิกเมื่อ:</strong> ${formatThaiDate(record.requestDate || record.borrowDate)} (${record.requestTime || '-'}) | <strong>วันที่ใช้:</strong> ${formatThaiDate(record.usageDate || record.borrowDate)}</div>
    `;

    document.getElementById('return-modal').style.display = 'flex';
}

function closeReturnModal() {
    document.getElementById('return-modal').style.display = 'none';
}

function confirmReturnSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('return-borrow-id').value;
    const actualReturnDate = document.getElementById('actual-return-date').value;
    const condition = document.getElementById('equipment-condition').value;
    const returnNotes = document.getElementById('return-notes').value.trim();

    const index = borrowRecords.findIndex(r => r.id === id);
    if (index !== -1) {
        borrowRecords[index].status = 'returned';
        borrowRecords[index].prepStatusText = 'คืนเรียบร้อยแล้ว';
        borrowRecords[index].actualReturnDate = actualReturnDate;
        borrowRecords[index].condition = condition;
        if (returnNotes) {
            borrowRecords[index].notes = (borrowRecords[index].notes ? borrowRecords[index].notes + ' | ' : '') + 'หมายเหตุการคืน: ' + returnNotes;
        }

        saveRecordsToStorage();
        closeReturnModal();
        renderBorrowTable();
        updateStatistics();

        showToast(`บันทึกการรับคืนอุปกรณ์สำหรับ ${borrowRecords[index].orRoom} เรียบร้อยแล้ว!`, 'success');
    }
}

function viewRecordDetails(recordId) {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    const itemsSummary = record.instruments.map(inst => {
        if (typeof inst === 'object') return `${inst.name} (x${inst.qty})`;
        return inst;
    }).join('\n- ');

    alert(`[รายละเอียดรายการ ${record.id}]\nผู้เบิก: ${record.borrowerName}\nห้องผ่าตัด: ${record.orRoom}\nอุปกรณ์ที่เบิก:\n- ${itemsSummary}\nวันที่และเวลาที่ยื่นเบิกในระบบ: ${record.requestDate || record.borrowDate} (${record.requestTime || '-'} น.)\nวันที่ใช้อุปกรณ์: ${record.usageDate || record.borrowDate}\nกำหนดวันที่คืน: ${record.expectedReturnDate || record.borrowDate}\nวันที่คืนจริง: ${record.actualReturnDate || '-'}\nสภาพเมื่อคืน: ${record.condition || '-'}\nหมายเหตุ: ${record.notes || '-'}`);
}

// --------------------------------------------------------------------------
// 7. QR Code Modal (Generates link to status.html)
// --------------------------------------------------------------------------
function openQRCodeModal() {
    const modal = document.getElementById('qrcode-modal');
    const container = document.getElementById('qrcode-canvas');
    container.innerHTML = '';

    // Direct QR Code URL specifically pointing to status.html
    let targetUrl = window.location.href;
    if (targetUrl.includes('index.html')) {
        targetUrl = targetUrl.replace('index.html', 'status.html');
    } else {
        const lastSlash = targetUrl.lastIndexOf('/');
        targetUrl = targetUrl.substring(0, lastSlash + 1) + 'status.html';
    }

    if (typeof QRCode !== 'undefined') {
        new QRCode(container, {
            text: targetUrl,
            width: 180,
            height: 180,
            colorDark: "#0284c7",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } else {
        container.innerText = "ไม่สามารถโหลด QR Code Generator ได้";
    }

    modal.style.display = 'flex';
}

function closeQRCodeModal() {
    document.getElementById('qrcode-modal').style.display = 'none';
}

function printQRCode() {
    window.print();
}

// --------------------------------------------------------------------------
// 8. Equipment Manager Modal
// --------------------------------------------------------------------------
function openEquipmentManager() {
    renderEquipmentManagerTable();
    document.getElementById('equipment-manager-modal').style.display = 'flex';
}

function closeEquipmentManager() {
    document.getElementById('equipment-manager-modal').style.display = 'none';
}

function renderEquipmentManagerTable() {
    const tbody = document.getElementById('equipment-manager-table-body');
    if (!tbody) return;

    tbody.innerHTML = equipmentList.map((item, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td><span class="equipment-pill">${escapeHtml(item.category)}</span></td>
            <td><strong>${escapeHtml(item.name)}</strong></td>
            <td>
                <span class="status-badge ${item.active ? 'ready' : 'overdue'}">
                    ${item.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                </span>
            </td>
            <td>
                <button class="btn-secondary btn-sm" onclick="toggleEquipmentStatus('${item.id}')">
                    ${item.active ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                </button>
                <button class="btn-danger btn-sm" onclick="deleteEquipment('${item.id}')">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function handleAddEquipment(event) {
    event.preventDefault();
    const input = document.getElementById('new-eq-name');
    const categorySelect = document.getElementById('new-eq-category');
    const name = input.value.trim();
    const category = categorySelect.value;

    if (!name) return;

    const newItem = {
        id: `eq-${Date.now()}`,
        name,
        category,
        active: true
    };

    equipmentList.push(newItem);
    saveEquipmentToStorage();
    input.value = '';
    renderEquipmentManagerTable();
    showToast(`เพิ่มเครื่องมือ "${name}" ในหมวด "${category}" สำเร็จ`, 'success');
}

function toggleEquipmentStatus(id) {
    const item = equipmentList.find(e => e.id === id);
    if (item) {
        item.active = !item.active;
        saveEquipmentToStorage();
        renderEquipmentManagerTable();
    }
}

function deleteEquipment(id) {
    if (confirm('คุณต้องการลบรายการเครื่องมือนี้ใช่หรือไม่?')) {
        equipmentList = equipmentList.filter(e => e.id !== id);
        saveEquipmentToStorage();
        renderEquipmentManagerTable();
        showToast('ลบรายการเครื่องมือเรียบร้อยแล้ว', 'success');
    }
}

// --------------------------------------------------------------------------
// 9. Backup, Restore & Excel Export
// --------------------------------------------------------------------------
function openBackupModal() {
    document.getElementById('backup-modal').style.display = 'flex';
}

function closeBackupModal() {
    document.getElementById('backup-modal').style.display = 'none';
}

function exportDataJSON() {
    const dataPayload = {
        version: '9.0',
        exportedAt: new Date().toISOString(),
        equipmentList,
        borrowRecords
    };

    const jsonStr = JSON.stringify(dataPayload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Surgical_Equipment_Backup_${getFormattedDate(0)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดไฟล์ JSON Backup สำเร็จ', 'success');
}

function importDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.equipmentList && data.borrowRecords) {
                equipmentList = data.equipmentList;
                borrowRecords = data.borrowRecords;
                saveEquipmentToStorage();
                saveRecordsToStorage();
                initApp();
                closeBackupModal();
                showToast('นำเข้าข้อมูลสำเร็จเรียบร้อยแล้ว!', 'success');
            } else {
                showToast('รูปแบบไฟล์ JSON ไม่ถูกต้อง', 'danger');
            }
        } catch (err) {
            showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON', 'danger');
        }
    };
    reader.readAsText(file);
}

function exportToExcel() {
    if (typeof XLSX === 'undefined') {
        showToast('ไม่พบไลบรารีส่งออก Excel', 'danger');
        return;
    }

    const dateInputVal = document.getElementById('date-filter-input')?.value || '';

    const exportRecords = borrowRecords.filter(record => matchesDateFilter(record, dateInputVal, currentDatePreset));

    const excelData = exportRecords.map((r, index) => {
        const itemSummary = r.instruments.map(inst => {
            if (typeof inst === 'object') return `${inst.name} (${inst.category}) x${inst.qty}`;
            return inst;
        }).join('; ');

        return {
            'ลำดับ': index + 1,
            'รหัสรายการ': r.id,
            'ห้องผ่าตัด': r.orRoom,
            'ชื่อ-นามสกุล ผู้เบิก': r.borrowerName,
            'รายการอุปกรณ์และจำนวน': itemSummary,
            'วันที่ยื่นส่งเบิก': r.requestDate || r.borrowDate,
            'เวลาที่ยื่นส่งเบิก': r.requestTime ? `${r.requestTime} น.` : '-',
            'วันที่ใช้อุปกรณ์': r.usageDate || r.borrowDate,
            'กำหนดวันที่ส่งคืน': r.expectedReturnDate || r.borrowDate,
            'วันที่คืนจริง': r.actualReturnDate || '-',
            'สถานะการจัดเตรียม': r.status === 'ready' ? 'จัดเสร็จแล้ว (พร้อมรับ)' : (r.status === 'returned' ? 'คืนแล้ว' : 'อยู่ระหว่างจัดเตรียม'),
            'สภาพอุปกรณ์เมื่อคืน': r.condition || '-',
            'หมายเหตุ': r.notes || '-'
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ประวัติเบิก-คืนเครื่องมือผ่าตัด');

    XLSX.writeFile(workbook, `รายงานการเบิกคืนเครื่องมือผ่าตัด_${getFormattedDate(0)}.xlsx`);
    showToast(`ดาวน์โหลดไฟล์รายงาน Excel (${exportRecords.length} รายการ) เรียบร้อยแล้ว`, 'success');
}

function resetToInitialSampleData() {
    if (confirm('คุณต้องการล้างข้อมูลและคืนค่าตั้งต้นใช่หรือไม่?')) {
        equipmentList = [...INITIAL_EQUIPMENT_LIST];
        borrowRecords = [...INITIAL_BORROW_RECORDS];
        saveEquipmentToStorage();
        saveRecordsToStorage();
        initApp();
        closeBackupModal();
        showToast('รีเซ็ตข้อมูลระบบกลับสู่ค่าตั้งต้นแล้ว', 'success');
    }
}

// --------------------------------------------------------------------------
// 10. Helpers
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
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
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
