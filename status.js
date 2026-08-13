/**
 * ==========================================================================
 * ระบบเบิกเครื่องมือผ่าตัด - ฝ่ายผู้เบิก (Borrower Status & Requisition System)
 * Dedicated Script for status.html
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. Initial Datasets (Same Schema & Key for Real-time LocalStorage Sync)
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

const getFormattedTime = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
};

// --------------------------------------------------------------------------
// 2. Global State Variables
// --------------------------------------------------------------------------
let equipmentList = [];
let borrowRecords = [];
let currentFormCategoryTab = 'all';
let selectedEquipmentState = {};

// --------------------------------------------------------------------------
// 3. Initialization & Real-time Synchronization
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initApp();

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
}

function setupORRoomDropdowns() {
    const formSelect = document.getElementById('or-room-select');
    const statusOrFilter = document.getElementById('status-or-filter');

    let formOptions = '<option value="" disabled selected>-- เลือกห้องผ่าตัด (OR 1 - OR 20) --</option>';
    let filterOptions = '<option value="">ทุกห้องผ่าตัด (OR 1 - 20)</option>';

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
            statusBadgeHtml = `<span class="status-badge returned"><i class="fa-solid fa-circle-check"></i> คืนแล้ว</span>`;
        } else if (isReady) {
            statusBadgeHtml = `<span class="status-badge ready"><i class="fa-solid fa-circle-check"></i> จัดเสร็จแล้ว (พร้อมรับ)</span>`;
        } else {
            statusBadgeHtml = `<span class="status-badge pending"><i class="fa-solid fa-boxes-packing"></i> อยู่ระหว่างจัดเตรียม</span>`;
        }

        const reqDateStr = formatThaiDate(record.requestDate || record.borrowDate);
        const reqTimeStr = record.requestTime ? ` (ยื่นส่งเบิกเวลา ${record.requestTime} น.)` : '';

        return `
            <tr>
                <td><span class="or-badge large-or"><i class="fa-solid fa-door-closed"></i> ${escapeHtml(record.orRoom)}</span></td>
                <td>
                    <div class="borrower-name-cell">${escapeHtml(record.borrowerName)}</div>
                    <div class="borrower-id-sub">รหัสเบิก: ${record.id} | ยื่นเบิกเมื่อ: <strong>${reqDateStr}${reqTimeStr}</strong></div>
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
        container.innerHTML = '<div class="empty-state">ไม่พบอุปกรณ์ตามคำค้นหา</div>';
        return;
    }

    const categories = ['อุปกรณ์ทั่วไป', 'Set เครื่องมือ', 'Set เครื่องผ้า', 'ตู้ General', 'ตู้ Plastic', 'ตู้ Ob-gyn'];
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
                    <span class="category-count-tag">${catItems.length} รายการ</span>
                </div>
                <div class="category-items-grid">
                    ${itemsCardsHtml.length > 0 ? itemsCardsHtml : '<div style="color:var(--text-muted); font-size:0.85rem; padding:0.5rem;">ไม่มีรายการในหมวดนี้</div>'}
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
        showToast('กรุณาเลือกเครื่องมือผ่าตัดอย่างน้อย 1 รายการ', 'danger');
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
        prepStatusText: 'อยู่ระหว่างจัดเตรียม',
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

    showToast(`ส่งคำขอเบิกสำหรับ ${orRoom} (เวลา ${requestTime} น.) เรียบร้อยแล้ว!`, 'success');
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
