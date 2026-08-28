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
const INITIAL_EQUIPMENT_LIST = [];

// Global State
let equipmentList = [];
let borrowRecords = [];
let selectedCategory = 'all';
let selectedQty = {};

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
            } else if (!data) {
                borrowRecords = [];
                localStorage.setItem('surgical_borrow_records_v10', JSON.stringify(borrowRecords));
            }
            renderStatusTrackerCards();
        }, (error) => {
            console.error("Firebase Records listener error:", error);
            const badge = document.getElementById('firebase-status-badge');
            if (badge) {
                badge.className = 'firebase-badge error';
                badge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span>ติดสิทธิ์ Firebase</span>';
            }
        });

        // Sync Equipment Items
        db.ref('equipment_items').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && Array.isArray(data)) {
                equipmentList = data;
                localStorage.setItem('surgical_equipment_items_v10', JSON.stringify(equipmentList));
            } else if (!data) {
                equipmentList = [];
                localStorage.setItem('surgical_equipment_items_v10', JSON.stringify(equipmentList));
            }
            renderFormEquipmentChecklist();
        });
    } else {
        const badge = document.getElementById('firebase-status-badge');
        if (badge) {
            badge.className = 'firebase-badge error';
            badge.innerHTML = '<i class="fa-solid fa-plug-circle-xmark"></i> <span>ไม่ได้เชื่อม Firebase</span>';
        }
    }

    // Listen to LocalStorage updates from Prep Room (index.html)
    window.addEventListener('storage', (e) => {
        if (e.key === 'surgical_borrow_records_v10' || e.key === 'surgical_equipment_items_v10') {
            loadStateFromStorage();
            renderStatusTrackerCards();
            renderFormEquipmentChecklist();
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
    const savedEq = localStorage.getItem('surgical_equipment_items_v10');
    if (savedEq) {
        try {
            equipmentList = JSON.parse(savedEq);
        } catch (e) {
            equipmentList = [];
        }
    } else {
        equipmentList = [];
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
    if (db) {
        db.ref('equipment_items').set(equipmentList).catch(err => console.warn("Firebase Equipment Sync Error:", err));
    }
}

function saveRecordsToStorage() {
    localStorage.setItem('surgical_borrow_records_v10', JSON.stringify(borrowRecords));
    if (db) {
        db.ref('borrow_records').set(borrowRecords).catch(err => console.warn("Firebase Records Sync Error:", err));
    }
}

function setupORRoomDropdowns() {
    // 1. Status Filter OR Dropdown
    const filterSelect = document.getElementById('status-or-filter');
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="">ทุกห้องผ่าตัด (OR 1 - 20)</option>';
        for (let i = 1; i <= 20; i++) {
            filterSelect.innerHTML += `<option value="OR ${i}">ห้องผ่าตัด OR ${i}</option>`;
        }
    }

    // 2. Form Select OR Dropdown
    const formSelect = document.getElementById('or-room-select');
    if (formSelect) {
        formSelect.innerHTML = '<option value="" disabled selected>-- เลือกห้องผ่าตัด (OR 1 - OR 20) --</option>';
        for (let i = 1; i <= 20; i++) {
            formSelect.innerHTML += `<option value="OR ${i}">ห้องผ่าตัด OR ${i}</option>`;
        }
    }
}

function setDefaultFormDates() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const usageDateInput = document.getElementById('usage-date');
    if (usageDateInput && !usageDateInput.value) {
        usageDateInput.value = todayStr;
    }

    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 1);
    const returnStr = returnDate.toISOString().split('T')[0];

    const returnDateInput = document.getElementById('expected-return-date');
    if (returnDateInput && !returnDateInput.value) {
        returnDateInput.value = returnStr;
    }
}

// --------------------------------------------------------------------------
// 3. Modal Open / Close Controls
// --------------------------------------------------------------------------
function openBorrowFormModal() {
    const modal = document.getElementById('borrow-form-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('open');
    }
    backToCatalogStep();
    renderFormEquipmentChecklist();
}

function closeBorrowFormModal() {
    const modal = document.getElementById('borrow-form-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('open');
    }
}

// --------------------------------------------------------------------------
// 4. Equipment Checklist Rendering & Category Filter
// --------------------------------------------------------------------------
function switchFormCategoryTab(cat) {
    selectedCategory = cat;
    document.querySelectorAll('.cat-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === cat);
    });
    renderFormEquipmentChecklist();
}

function updateQty(eqId, delta) {
    const current = selectedQty[eqId] || 0;
    const next = Math.max(0, current + delta);
    selectedQty[eqId] = next;

    const qtySpan = document.getElementById(`qty-val-${eqId}`);
    if (qtySpan) qtySpan.textContent = next;

    const checkbox = document.getElementById(`eq-check-${eqId}`);
    if (checkbox) checkbox.checked = next > 0;

    const card = document.getElementById(`eq-card-${eqId}`);
    if (card) card.classList.toggle('selected', next > 0);

    updateFormCartSummary();
}

function toggleQtyFromCheckbox(eqId, checked) {
    if (checked) {
        if (!selectedQty[eqId] || selectedQty[eqId] === 0) {
            selectedQty[eqId] = 1;
        }
    } else {
        selectedQty[eqId] = 0;
    }

    const qtySpan = document.getElementById(`qty-val-${eqId}`);
    if (qtySpan) qtySpan.textContent = selectedQty[eqId];

    const card = document.getElementById(`eq-card-${eqId}`);
    if (card) card.classList.toggle('selected', selectedQty[eqId] > 0);

    updateFormCartSummary();
}

function clearAllSelectedInstruments() {
    selectedQty = {};
    renderFormEquipmentChecklist();
    updateFormCartSummary();
}

function updateFormCartSummary() {
    let itemCount = 0;
    let totalQty = 0;

    Object.keys(selectedQty).forEach(eqId => {
        const qty = selectedQty[eqId];
        if (qty > 0) {
            itemCount++;
            totalQty += qty;
        }
    });

    const countEl = document.getElementById('selected-items-count');
    const totalQtyEl = document.getElementById('selected-total-qty');
    const btnQtyEl = document.getElementById('btn-cart-qty');

    if (countEl) countEl.textContent = itemCount;
    if (totalQtyEl) totalQtyEl.textContent = totalQty;
    if (btnQtyEl) btnQtyEl.textContent = itemCount;
}

function goToCartCheckoutStep() {
    let itemCount = 0;
    Object.keys(selectedQty).forEach(eqId => {
        if (selectedQty[eqId] > 0) itemCount++;
    });

    if (itemCount === 0) {
        alert('กรุณาเลือกอุปกรณ์ผ่าตัดใส่ตะกร้าอย่างน้อย 1 รายการก่อนดำเนินการต่อ');
        return;
    }

    renderCartCheckoutTable();

    const stepCatalog = document.getElementById('modal-step-catalog');
    const stepCheckout = document.getElementById('modal-step-checkout');
    const modalTitle = document.getElementById('cart-modal-title');

    if (stepCatalog) stepCatalog.style.display = 'none';
    if (stepCheckout) stepCheckout.style.display = 'block';
    if (modalTitle) {
        modalTitle.innerHTML = `<i class="fa-solid fa-cart-flatbed"></i> <h3>ขั้นตอนที่ 2: ตรวจสอบรายการในตะกร้า & ยื่นคำขอ</h3>`;
    }
}

function backToCatalogStep() {
    const stepCatalog = document.getElementById('modal-step-catalog');
    const stepCheckout = document.getElementById('modal-step-checkout');
    const modalTitle = document.getElementById('cart-modal-title');

    if (stepCatalog) stepCatalog.style.display = 'block';
    if (stepCheckout) stepCheckout.style.display = 'none';
    if (modalTitle) {
        modalTitle.innerHTML = `<i class="fa-solid fa-scissors"></i> <h3>ขั้นตอนที่ 1: เลือกรายการเครื่องมือผ่าตัด (Catalog)</h3>`;
    }
}

function renderCartCheckoutTable() {
    const tbody = document.getElementById('cart-checkout-tbody');
    if (!tbody) return;

    let html = '';
    let hasItems = false;

    equipmentList.forEach(item => {
        const qty = selectedQty[item.id] || 0;
        if (qty > 0) {
            hasItems = true;
            let displayName = escapeHtml(item.name);

            html += `
                <tr style="border-bottom:1px solid var(--border-color); font-size:0.9rem;">
                    <td style="padding:0.6rem 0.85rem;"><span class="equipment-pill" style="font-size:0.75rem;">${escapeHtml(item.category)}</span></td>
                    <td style="padding:0.6rem 0.85rem; font-weight:600;">${displayName}</td>
                    <td style="padding:0.6rem 0.85rem; text-align:center;">
                        <div style="display:inline-flex; align-items:center; gap:0.3rem;">
                            <button type="button" class="qty-btn minus" onclick="updateCartCheckoutQty('${item.id}', -1)" style="border:1px solid var(--border-color); background:var(--bg-main); width:24px; height:24px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-minus"></i></button>
                            <span style="min-width:20px; font-weight:700; text-align:center;">${qty}</span>
                            <button type="button" class="qty-btn plus" onclick="updateCartCheckoutQty('${item.id}', 1)" style="border:1px solid var(--border-color); background:var(--bg-main); width:24px; height:24px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </td>
                    <td style="padding:0.6rem 0.85rem; text-align:center;">
                        <button type="button" class="btn-danger btn-sm" onclick="removeFromCartCheckout('${item.id}')" title="ลบออกจากตะกร้า" style="padding:0.2rem 0.5rem;"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
            `;
        }
    });

    if (!hasItems) {
        html = `
            <tr>
                <td colspan="4" style="text-align:center; padding:2rem 1rem; color:var(--text-muted);">
                    <i class="fa-solid fa-basket-shopping" style="font-size:1.8rem; margin-bottom:0.5rem; display:block;"></i>
                    <p>ตะกร้าสินค้ายังว่างเปล่า กรุณากดปุ่ม "กลับไปเลือกอุปกรณ์เพิ่ม"</p>
                </td>
            </tr>
        `;
    }

    tbody.innerHTML = html;
}

function updateCartCheckoutQty(eqId, delta) {
    updateQty(eqId, delta);
    renderCartCheckoutTable();
}

function removeFromCartCheckout(eqId) {
    selectedQty[eqId] = 0;
    updateFormCartSummary();
    renderCartCheckoutTable();
}

function renderFormEquipmentChecklist() {
    const container = document.getElementById('form-equipment-checklist') || document.getElementById('equipment-checklist-container');
    if (!container) return;

    if (!equipmentList || equipmentList.length === 0) {
        equipmentList = [...INITIAL_EQUIPMENT_LIST];
    }

    const searchInput = (document.getElementById('form-eq-search')?.value || '').trim().toLowerCase();
    const categories = ['Set Package', 'อุปกรณ์ทั่วไป', 'Set เครื่องมือ', 'Set เครื่องผ้า', 'ตู้ Ortho', 'ตู้ Neuro', 'ตู้ General', 'ตู้ Plastic', 'ตู้ Ob-gyn', 'ตู้ Uro + Ob-gyn'];
    let html = '';

    categories.forEach(cat => {
        if (selectedCategory !== 'all' && selectedCategory !== cat) return;

        const catItems = equipmentList.filter(item => {
            if (item.active === false) return false;
            if (item.category !== cat) return false;
            if (searchInput && !item.name.toLowerCase().includes(searchInput)) return false;
            return true;
        });

        if (catItems.length > 0) {
            html += `<div class="category-section-title" style="font-weight:700; color:var(--primary); margin: 1rem 0 0.5rem 0;"><i class="fa-solid fa-layer-group"></i> หมวด: ${escapeHtml(cat)} (${catItems.length} รายการ)</div>`;
            html += `<div class="equipment-checklist-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:0.75rem;">`;

            catItems.forEach(item => {
                const qty = selectedQty[item.id] || 0;
                const isSelected = qty > 0;

                html += `
                    <div class="eq-check-card ${isSelected ? 'selected' : ''}" id="eq-card-${item.id}" style="background:var(--bg-card); border:1px solid var(--border-color); padding:0.7rem 0.85rem; border-radius:10px; display:flex; align-items:center; justify-content:space-between; gap:0.5rem; transition:all 0.2s ease;">
                        <label class="eq-label-container" style="display:flex; align-items:center; gap:0.7rem; flex:1; cursor:pointer; min-width:0;">
                            <input type="checkbox" class="custom-eq-checkbox" id="eq-check-${item.id}" ${isSelected ? 'checked' : ''} onchange="toggleQtyFromCheckbox('${item.id}', this.checked)">
                            <span class="custom-check-box"><i class="fa-solid fa-check"></i></span>
                            <div class="eq-info-block" style="display:flex; flex-direction:column; justify-content:center; min-width:0; overflow:hidden;">
                                <span class="eq-item-name" style="font-weight:600; font-size:0.9rem; color:var(--text-primary); line-height:1.25; word-break:break-word;">${escapeHtml(item.name)}</span>
                                <span class="eq-item-cat-sub" style="font-size:0.75rem; color:var(--text-muted); margin-top:0.15rem;">${escapeHtml(item.category)}</span>
                            </div>
                        </label>
                        <div class="qty-counter-control" style="display:flex; align-items:center; gap:0.35rem; flex-shrink:0;">
                            <button type="button" class="qty-btn minus" onclick="updateQty('${item.id}', -1)" style="border:1px solid var(--border-color); background:var(--bg-main); width:28px; height:28px; border-radius:6px; cursor:pointer; font-size:0.8rem;"><i class="fa-solid fa-minus"></i></button>
                            <span class="qty-number-display" id="qty-val-${item.id}" style="min-width:22px; text-align:center; font-weight:700; font-size:0.95rem;">${qty}</span>
                            <button type="button" class="qty-btn plus" onclick="updateQty('${item.id}', 1)" style="border:1px solid var(--border-color); background:var(--bg-main); width:28px; height:28px; border-radius:6px; cursor:pointer; font-size:0.8rem;"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }
    });

    if (!html) {
        html = `
            <div class="empty-search-state" style="text-align:center; padding: 2rem 0; color:var(--text-muted);">
                <i class="fa-solid fa-magnifying-glass" style="font-size:1.8rem; margin-bottom:0.5rem;"></i>
                <p>ไม่พบอุปกรณ์ตามคำค้นหาในหมวดหมู่นี้</p>
            </div>
        `;
    }

    container.innerHTML = html;
    updateFormCartSummary();
}

// --------------------------------------------------------------------------
// 5. Form Submission Handling
// --------------------------------------------------------------------------
function handleFormSubmit(e) {
    e.preventDefault();

    const borrowerName = document.getElementById('borrower-name')?.value.trim();
    const orRoom = document.getElementById('or-room-select')?.value;
    const usageDate = document.getElementById('usage-date')?.value;
    const expectedReturnDate = document.getElementById('expected-return-date')?.value;
    const notes = document.getElementById('borrow-notes')?.value.trim() || '';

    if (!borrowerName || !orRoom || !usageDate || !expectedReturnDate) {
        alert('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน');
        return;
    }

    const selectedInstruments = [];
    equipmentList.forEach(item => {
        const qty = selectedQty[item.id] || 0;
        if (qty > 0) {
            selectedInstruments.push({
                id: item.id,
                name: item.name,
                category: item.category,
                qty: qty
            });
        }
    });

    if (selectedInstruments.length === 0) {
        alert('กรุณาเลือกอุปกรณ์หรือชุดเครื่องมือที่ต้องการเบิกอย่างน้อย 1 รายการ');
        return;
    }

    const now = new Date();
    const nowTimeStr = now.toTimeString().split(' ')[0].substring(0, 5); // "HH:MM"
    const todayStr = now.toISOString().split('T')[0];

    const newRecord = {
        id: 'REQ-' + Math.floor(1000 + Math.random() * 9000),
        borrowerName: borrowerName,
        orRoom: orRoom,
        requestDate: todayStr,
        requestTime: nowTimeStr,
        usageDate: usageDate,
        expectedReturnDate: expectedReturnDate,
        actualReturnDate: null,
        instruments: selectedInstruments,
        status: 'pending',
        notes: notes
    };

    borrowRecords.unshift(newRecord);
    saveRecordsToStorage();

    // Reset Form State
    selectedQty = {};
    document.getElementById('borrow-form')?.reset();
    setDefaultFormDates();
    renderFormEquipmentChecklist();
    renderStatusTrackerCards();
    closeBorrowFormModal();

    alert(`ยื่นส่งเบิกอุปกรณ์สำเร็จ! รหัสเบิกของคุณคือ: ${newRecord.id}\nฝ่ายห้องจัดเตรียมอุปกรณ์จะได้รับการแจ้งเตือนเรียบร้อยแล้ว`);
}

// --------------------------------------------------------------------------
// 6. Table & Status Renderer for status.html
// --------------------------------------------------------------------------
function renderStatusTrackerCards() {
    const tbody = document.getElementById('simple-status-tbody');
    const emptyState = document.getElementById('simple-status-empty');
    if (!tbody) return;

    const orFilter = document.getElementById('status-or-filter')?.value || '';
    const dateFilter = document.getElementById('status-date-filter')?.value || '';
    const searchFilter = (document.getElementById('status-search-input')?.value || '').trim().toLowerCase();

    let filtered = borrowRecords.filter(r => {
        if (orFilter && r.orRoom !== orFilter) return false;
        if (dateFilter && (r.requestDate || r.borrowDate) !== dateFilter && r.usageDate !== dateFilter) return false;
        if (searchFilter) {
            const nameMatch = (r.borrowerName || '').toLowerCase().includes(searchFilter);
            const orMatch = (r.orRoom || '').toLowerCase().includes(searchFilter);
            const instMatch = (r.instruments || []).some(i => i.name.toLowerCase().includes(searchFilter));
            if (!nameMatch && !orMatch && !instMatch) return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    let html = '';
    filtered.forEach(record => {
        const reqDateStr = formatThaiDate(record.requestDate || record.borrowDate);
        const reqTimeStr = record.requestTime ? ` (ยื่นเวลา ${record.requestTime} น.)` : '';

        html += `
            <tr>
                <td><span class="or-badge large-or"><i class="fa-solid fa-door-closed"></i> ${escapeHtml(record.orRoom)}</span></td>
                <td>
                    <div class="borrower-name-cell">${escapeHtml(record.borrowerName)}</div>
                    <div class="borrower-id-sub">ยื่นเบิกเมื่อ: <strong>${reqDateStr}${reqTimeStr}</strong></div>
                </td>
                <td style="text-align:center;">
                    ${getStatusBadgeMobile(record.status)}
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function getStatusBadgeMobile(status) {
    switch (status) {
        case 'pending':
            return `<span class="m-status-pill pending"><i class="fa-solid fa-clock"></i> อยู่ระหว่างจัดเตรียม</span>`;
        case 'ready':
            return `<span class="m-status-pill ready"><i class="fa-solid fa-circle-check"></i> จัดเสร็จแล้ว (พร้อมรับ)</span>`;
        case 'borrowed':
            return `<span class="m-status-pill borrowed"><i class="fa-solid fa-hand-holding-hand"></i> ถูกยืมไปแล้ว</span>`;
        case 'returned':
            return `<span class="m-status-pill returned"><i class="fa-solid fa-rotate-left"></i> คืนเสร็จสิ้น</span>`;
        default:
            return `<span class="m-status-pill">${escapeHtml(status)}</span>`;
    }
}

// Helpers
function formatThaiDate(dateStr) {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0], 10) + 543;
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const month = monthNames[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    return `${day} ${month} ${year}`;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function setupThemeFromPreferences() {
    const savedTheme = localStorage.getItem('surgical_theme_pref');
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    }
}
