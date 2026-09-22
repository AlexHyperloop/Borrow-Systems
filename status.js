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

// 3 Main Groups Architecture (Mode A: 1. ห้องผ้า, 2. ห้อง Stock, 3. Set Package)
const MAIN_GROUPS = [
    {
        id: 'linen',
        name: '1. ห้องผ้า',
        icon: 'fa-solid fa-shirt',
        desc: 'Set เครื่องมือ, Set เครื่องผ้า & ตู้เครื่องมือผ่าตัด',
        categories: ['Set เครื่องมือ', 'Set เครื่องผ้า', 'ตู้ Ortho', 'ตู้ Neuro', 'ตู้ General', 'ตู้ Plastic', 'ตู้ Ob-gyn', 'ตู้ Uro + Ob-gyn']
    },
    {
        id: 'stock',
        name: '2. ห้อง Stock',
        icon: 'fa-solid fa-boxes-packing',
        desc: 'อุปกรณ์ทั่วไป',
        categories: ['อุปกรณ์ทั่วไป']
    },
    {
        id: 'package',
        name: '3. Set Package',
        icon: 'fa-solid fa-box-archive',
        desc: 'Set Package',
        categories: ['Set Package']
    }
];

// Global State
let equipmentList = [];
let borrowRecords = [];
let selectedMainGroup = 'all'; // 'all' | 'linen' | 'stock' | 'package'
let selectedCategory = 'all';
let selectedQty = {};
let selectedSizes = {};

// Helper: Check if instrument requires size/number/color specification (Type A)
function hasSizePlaceholder(name) {
    if (!name) return false;
    return /\.{2,}/.test(name) || 
           /…/.test(name) || 
           /_{2,}/.test(name) || 
           /No\.\s*\.{1,}/i.test(name) || 
           /ขนาด\s*\.{1,}/.test(name) || 
           /ที่จับโคมไฟ/i.test(name) ||
           /โคมไฟ\s*R/i.test(name) ||
           /vascular/i.test(name) ||
           /loop/i.test(name) ||
           /ไม้พันสำลี/i.test(name) ||
           /สำลี/i.test(name) ||
           /ระบุ/i.test(name);
}

// Helper: Custom label text based on item name
function getSizeLabelText(name) {
    if (!name) return "ระบุขนาด:";
    if (/vascular|loop/i.test(name)) return "ระบุสี:";
    if (/โคมไฟ|ที่จับ/i.test(name)) return "ระบุห้อง/เบอร์:";
    if (/ไม้พันสำลี|สำลี/i.test(name)) return "ระบุขนาด:";
    return "ระบุขนาด:";
}

// Helper: Custom placeholder hint text based on item name
function getSizePlaceholderText(name) {
    if (!name) return "ระบุขนาด / เบอร์...";
    if (/vascular|loop/i.test(name)) {
        return "ระบุสี เช่น แดง, น้ำเงิน, ขาว, เหลือง...";
    }
    if (/ไม้พันสำลี|สำลี/i.test(name)) {
        return "ระบุขนาด เช่น เล็ก, ใหญ่, เบอร์ S, M, L...";
    }
    if (/โคมไฟ/i.test(name) || /ที่จับ/i.test(name)) {
        return "ระบุห้อง/เบอร์ เช่น R1, R2, OR 5...";
    }
    if (/เลื่อย|ใบเลื่อย|No/i.test(name)) {
        return "ระบุเบอร์/ขนาด เช่น 15, No.2...";
    }
    if (/สิ่ว|mm|มม/i.test(name)) {
        return "ระบุขนาด เช่น 10 mm, 15 mm...";
    }
    return "ระบุขนาด / เบอร์ เช่น 15, No.2...";
}

// Helper: Format instrument name with size/color
function formatInstrumentNameWithSize(name, size) {
    if (!size || !size.trim()) return name;
    let cleanSize = size.trim();

    // Special handling for Vascular loop or ไม้พันสำลี
    if (/vascular|loop|ไม้พันสำลี|สำลี/i.test(name)) {
        return `${name} (ระบุ: ${cleanSize})`;
    }

    // Special handling for "ที่จับโคมไฟR......" or "ที่จับโคมไฟ"
    if (/ที่จับโคมไฟ/i.test(name) || (/โคมไฟ/i.test(name) && /R/i.test(name))) {
        let num = cleanSize.replace(/^R\s*/i, '').trim();
        return `ที่จับโคมไฟ R${num || cleanSize}`;
    }

    // Replace dots/ellipsis/underscores with clean size
    if (/\.{2,}|…|_{2,}/.test(name)) {
        return name.replace(/\.{2,}|…|_{2,}/, ` ${cleanSize} `).replace(/\s+/g, ' ').trim();
    }

    return `${name} (ขนาด: ${cleanSize})`;
}

function updateItemSize(eqId, value) {
    selectedSizes[eqId] = value;
}

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
    switchMainGroup('all');
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
    const OR_ROOMS = [
        'OR 1', 'OR 2', 'OR 3', 'OR 4', 'OR 5',
        'OR 6', 'OR 7', 'OR 8', 'OR 9', 'OR 10',
        'OR 11', 'OR 12A', 'OR 12B', 'OR 13', 'OR 14',
        'OR 15', 'OR 16', 'OR 17', 'OR 18', 'OR 19', 'OR 20'
    ];

    // 1. Status Filter OR Dropdown
    const filterSelect = document.getElementById('status-or-filter');
    if (filterSelect) {
        filterSelect.innerHTML = '<option value="">ทุกห้องผ่าตัด</option>';
        OR_ROOMS.forEach(room => {
            filterSelect.innerHTML += `<option value="${room}">ห้องผ่าตัด ${room}</option>`;
        });
    }

    // 2. Form Select OR Dropdown
    const formSelect = document.getElementById('or-room-select');
    if (formSelect) {
        formSelect.innerHTML = '<option value="" disabled selected>-- เลือกห้องผ่าตัด --</option>';
        OR_ROOMS.forEach(room => {
            formSelect.innerHTML += `<option value="${room}">ห้องผ่าตัด ${room}</option>`;
        });
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
    switchMainGroup('all');
}

function closeBorrowFormModal() {
    const modal = document.getElementById('borrow-form-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('open');
    }
}

// --------------------------------------------------------------------------
// 4. Equipment Checklist Rendering & 3-Main-Groups Navigation (Mode A)
// --------------------------------------------------------------------------
function switchMainGroup(groupId) {
    selectedMainGroup = groupId;
    selectedCategory = 'all';

    document.querySelectorAll('.main-group-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.group === groupId);
    });

    renderSubCategoryNavPills();
    renderFormEquipmentChecklist();
}

function switchSubCategory(catName) {
    selectedCategory = catName;
    document.querySelectorAll('.sub-cat-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.cat === catName);
    });
    renderFormEquipmentChecklist();
}

function renderSubCategoryNavPills() {
    const container = document.getElementById('sub-category-nav-bar');
    if (!container) return;

    if (selectedMainGroup === 'all') {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    const group = MAIN_GROUPS.find(g => g.id === selectedMainGroup);
    if (!group || group.categories.length <= 1) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }

    container.style.display = 'flex';

    let html = `
        <button type="button" class="sub-cat-pill ${selectedCategory === 'all' ? 'active' : ''}" data-cat="all" onclick="switchSubCategory('all')">
            <i class="fa-solid fa-border-all"></i> ทั้งหมดใน${group.name.replace(/^\d+\.\s*/, '')}
        </button>
    `;

    group.categories.forEach(cat => {
        html += `
            <button type="button" class="sub-cat-pill ${selectedCategory === cat ? 'active' : ''}" data-cat="${escapeHtml(cat)}" onclick="switchSubCategory('${escapeHtml(cat)}')">
                ${escapeHtml(cat)}
            </button>
        `;
    });

    container.innerHTML = html;
}

function updateQty(eqId, delta) {
    const current = selectedQty[eqId] || 0;
    const next = Math.max(0, current + delta);
    selectedQty[eqId] = next;

    const item = equipmentList.find(e => e.id === eqId);
    if (item && hasSizePlaceholder(item.name)) {
        renderFormEquipmentChecklist();
        if (next > 0) {
            setTimeout(() => {
                const inputEl = document.getElementById(`eq-size-${eqId}`);
                if (inputEl && !inputEl.value) inputEl.focus();
            }, 30);
        }
    } else {
        const qtySpan = document.getElementById(`qty-val-${eqId}`);
        if (qtySpan) qtySpan.textContent = next;

        const checkbox = document.getElementById(`eq-check-${eqId}`);
        if (checkbox) checkbox.checked = next > 0;

        const card = document.getElementById(`eq-card-${eqId}`);
        if (card) card.classList.toggle('selected', next > 0);

        updateFormCartSummary();
    }
}

function toggleQtyFromCheckbox(eqId, checked) {
    if (checked) {
        if (!selectedQty[eqId] || selectedQty[eqId] === 0) {
            selectedQty[eqId] = 1;
        }
    } else {
        selectedQty[eqId] = 0;
    }

    const item = equipmentList.find(e => e.id === eqId);
    if (item && hasSizePlaceholder(item.name)) {
        renderFormEquipmentChecklist();
        if (checked) {
            setTimeout(() => {
                const inputEl = document.getElementById(`eq-size-${eqId}`);
                if (inputEl) inputEl.focus();
            }, 30);
        }
    } else {
        const qtySpan = document.getElementById(`qty-val-${eqId}`);
        if (qtySpan) qtySpan.textContent = selectedQty[eqId];

        const card = document.getElementById(`eq-card-${eqId}`);
        if (card) card.classList.toggle('selected', selectedQty[eqId] > 0);

        updateFormCartSummary();
    }
}

function clearAllSelectedInstruments() {
    selectedQty = {};
    selectedSizes = {};
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
            const sizeVal = selectedSizes[item.id] || '';
            const needSize = hasSizePlaceholder(item.name);
            const displayName = formatInstrumentNameWithSize(item.name, sizeVal);

            html += `
                <tr style="border-bottom:1px solid var(--border-color); font-size:0.9rem;">
                    <td style="padding:0.6rem 0.85rem;"><span class="equipment-pill" style="font-size:0.75rem;">${escapeHtml(item.category)}</span></td>
                    <td style="padding:0.6rem 0.85rem; font-weight:600;">
                        <div>${escapeHtml(displayName)}</div>
                        ${needSize ? `
                            <div style="margin-top:0.35rem; display:flex; align-items:center; gap:0.4rem;">
                                <span style="font-size:0.75rem; color:var(--primary); font-weight:600;"><i class="fa-solid fa-pen-ruler"></i> ${escapeHtml(getSizeLabelText(item.name))}</span>
                                <input type="text" class="styled-input" placeholder="${escapeHtml(getSizePlaceholderText(item.name))}" value="${escapeHtml(sizeVal)}" oninput="updateItemSize('${item.id}', this.value); renderCartCheckoutTable();" style="font-size:0.78rem; padding:0.15rem 0.45rem; height:26px; border-radius:4px; max-width:180px; border:1px solid var(--primary);">
                            </div>
                        ` : ''}
                    </td>
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
    delete selectedSizes[eqId];
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
    let html = '';
    let totalRenderedItems = 0;

    MAIN_GROUPS.forEach(group => {
        // If a specific main group is selected and this isn't it, skip
        if (selectedMainGroup !== 'all' && selectedMainGroup !== group.id) return;

        let groupItemsHtml = '';
        let groupTotalItems = 0;

        group.categories.forEach(cat => {
            // If a specific sub-category is selected and this isn't it, skip
            if (selectedCategory !== 'all' && selectedCategory !== cat) return;

            const catItems = equipmentList.filter(item => {
                if (item.active === false) return false;
                if (item.category !== cat) return false;
                if (searchInput && !item.name.toLowerCase().includes(searchInput)) return false;
                return true;
            });

            if (catItems.length > 0) {
                groupTotalItems += catItems.length;
                totalRenderedItems += catItems.length;

                let catHtml = `
                    <div class="category-section-title" style="font-weight:700; color:var(--primary); margin: 1.1rem 0 0.5rem 0; display:flex; align-items:center; gap:0.4rem; font-size:0.92rem;">
                        <i class="fa-solid fa-folder-open" style="color:var(--primary);"></i> หมวด: ${escapeHtml(cat)} 
                        <span style="font-size:0.75rem; background:var(--primary-light); color:var(--primary); padding:1px 8px; border-radius:99px; font-weight:600;">${catItems.length} รายการ</span>
                    </div>
                    <div class="equipment-checklist-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:0.75rem;">
                `;

                catItems.forEach(item => {
                    const qty = selectedQty[item.id] || 0;
                    const isSelected = qty > 0;
                    const needSize = hasSizePlaceholder(item.name);
                    const sizeVal = selectedSizes[item.id] || '';

                    catHtml += `
                        <div class="eq-check-card ${isSelected ? 'selected' : ''}" id="eq-card-${item.id}" style="background:var(--bg-card); border:1px solid var(--border-color); padding:0.7rem 0.85rem; border-radius:10px; display:flex; flex-direction:column; gap:0.4rem; transition:all 0.2s ease;">
                            <div style="display:flex; align-items:center; justify-content:space-between; gap:0.5rem; width:100%;">
                                <label class="eq-label-container" style="display:flex; align-items:center; gap:0.7rem; flex:1; cursor:pointer; min-width:0; margin:0;">
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
                            ${(isSelected && needSize) ? `
                                <div class="eq-size-input-wrapper" id="eq-size-box-${item.id}" style="padding-top:0.35rem; border-top:1px dashed var(--border-color); width:100%;" onclick="event.stopPropagation();">
                                    <div style="display:flex; align-items:center; gap:0.4rem;">
                                        <span style="font-size:0.8rem; color:var(--primary); font-weight:600; white-space:nowrap;"><i class="fa-solid fa-pen-ruler"></i> ${escapeHtml(getSizeLabelText(item.name))}</span>
                                        <input type="text" 
                                               class="styled-input eq-size-input" 
                                               id="eq-size-${item.id}" 
                                               placeholder="${escapeHtml(getSizePlaceholderText(item.name))}" 
                                               value="${escapeHtml(sizeVal)}" 
                                               oninput="updateItemSize('${item.id}', this.value)" 
                                               style="padding:0.25rem 0.55rem; font-size:0.82rem; flex:1; height:30px; border-radius:6px; border:1.5px solid var(--primary); background:var(--bg-card); color:var(--text-primary);">
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    `;
                });

                catHtml += `</div>`;
                groupItemsHtml += catHtml;
            }
        });

        if (groupItemsHtml) {
            // If viewing All, show a nice prominent section header for each group
            if (selectedMainGroup === 'all') {
                html += `
                    <div class="main-group-section-header">
                        <h3><i class="${group.icon}"></i> ${group.name}</h3>
                        <span class="group-sub-desc">${group.desc} (${groupTotalItems} รายการ)</span>
                    </div>
                `;
            }
            html += groupItemsHtml;
        }
    });

    if (!html || totalRenderedItems === 0) {
        html = `
            <div class="empty-search-state" style="text-align:center; padding: 2.5rem 1rem; color:var(--text-muted);">
                <i class="fa-solid fa-magnifying-glass" style="font-size:2rem; margin-bottom:0.75rem; color:var(--primary); opacity:0.6; display:block;"></i>
                <h4 style="font-size:1rem; color:var(--text-primary); margin-bottom:0.25rem;">ไม่พบรายการอุปกรณ์ตามเงื่อนไขที่เลือก</h4>
                <p style="font-size:0.85rem;">ลองเปลี่ยนคำค้นหา หรือเลือกแท็บ "ทั้งหมด" ด้านบน</p>
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
            const rawSize = (selectedSizes[item.id] || '').trim();
            const formattedName = formatInstrumentNameWithSize(item.name, rawSize);
            selectedInstruments.push({
                id: item.id,
                name: formattedName,
                originalName: item.name,
                size: rawSize || null,
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
    selectedSizes = {};
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
        const eqList = record.instruments || record.equipmentList || [];
        const totalQty = eqList.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0);
        const reqDateStr = formatThaiDate(record.requestDate || record.borrowDate);
        const reqTimeStr = record.requestTime ? ` (ยื่นเวลา ${record.requestTime} น.)` : '';

        html += `
            <tr>
                <td><span class="or-badge large-or"><i class="fa-solid fa-door-closed"></i> ${escapeHtml(record.orRoom)}</span></td>
                <td>
                    <div class="borrower-name-cell">${escapeHtml(record.borrowerName)}</div>
                    <div class="borrower-id-sub">ยื่นเบิกเมื่อ: <strong>${reqDateStr}${reqTimeStr}</strong></div>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">
                        <i class="fa-solid fa-boxes-stacked" style="color:var(--primary);"></i> รายการ: <strong>${eqList.length}</strong> รายการ (${totalQty} ชิ้น)
                    </div>
                    ${(record.prepNotes && record.prepNotes.trim()) ? `
                        <div style="margin-top:0.45rem; padding:0.45rem 0.65rem; background:#eff6ff; border:1px solid #bfdbfe; border-left:3.5px solid #0284c7; border-radius:6px; font-size:0.82rem; color:#1e40af; line-height:1.35;">
                            <i class="fa-solid fa-bullhorn" style="color:#0284c7;"></i> <strong>ข้อความจากผู้จัดเตรียม:</strong> ${escapeHtml(record.prepNotes)}
                        </div>
                    ` : ''}
                </td>
                <td style="text-align:center;">
                    ${getStatusBadgeMobile(record.status)}
                </td>
                <td style="text-align:center;">
                    <button type="button" class="btn-doc-pdf" onclick="openBorrowerDocModal('${record.id}')" title="กดดูรายการที่เบิก / พิมพ์ PDF" style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.45rem 0.85rem; font-size:0.85rem; font-weight:600; border-radius:8px; border:1px solid var(--primary); color:var(--primary); background:var(--bg-main); cursor:pointer; white-space:nowrap; transition:all 0.2s ease;">
                        <i class="fa-solid fa-file-pdf" style="color:#ef4444; font-size:1.1rem;"></i> <span>ดูใบเบิก / PDF</span>
                    </button>
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
            return `<span class="m-status-pill borrowed"><i class="fa-solid fa-hand-holding-hand"></i> รับของแล้ว</span>`;
        case 'returned':
            return `<span class="m-status-pill returned"><i class="fa-solid fa-rotate-left"></i> คืนเสร็จสิ้น</span>`;
        default:
            return `<span class="m-status-pill">${escapeHtml(status)}</span>`;
    }
}

// --------------------------------------------------------------------------
// 7. Borrower Requisition Document Slip Modal & Print Handling
// --------------------------------------------------------------------------
let currentDocRecordId = null;

function openBorrowerDocModal(recordId) {
    currentDocRecordId = recordId;
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    const modal = document.getElementById('borrower-doc-modal');
    const container = document.getElementById('printable-checklist-container');
    if (!modal || !container) return;

    const eqList = record.instruments || record.equipmentList || [];
    const checkedIndices = record.borrowerCheckedIndices || [];
    let totalQty = 0;

    let itemsHtml = '';
    eqList.forEach((eq, idx) => {
        const qty = eq.qty || eq.quantity || 1;
        totalQty += qty;
        const catName = eq.category || 'อุปกรณ์ผ่าตัด';
        const isChecked = checkedIndices.includes(idx);

        itemsHtml += `
            <tr class="borrower-check-row ${isChecked ? 'checked' : ''}" onclick="toggleBorrowerCheckItem('${record.id}', ${idx})" title="คลิกเพื่อติ๊กถูกตรวจรับชิ้นนี้" style="border-bottom: 1px solid #cbd5e1; font-size: 0.9rem; cursor:pointer; background:${isChecked ? 'rgba(16, 185, 129, 0.08)' : 'transparent'}; transition:all 0.15s ease;">
                <td style="padding: 0.6rem 0.75rem; text-align: center; border: 1px solid #cbd5e1; color: #475569;">${idx + 1}</td>
                <td style="padding: 0.6rem 0.75rem; border: 1px solid #cbd5e1;"><span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem; font-weight: 600;">${escapeHtml(catName)}</span></td>
                <td style="padding: 0.6rem 0.75rem; font-weight: 600; border: 1px solid #cbd5e1; color: ${isChecked ? '#10b981' : '#0f172a'};">${escapeHtml(eq.name)}</td>
                <td style="padding: 0.6rem 0.75rem; text-align: center; font-weight: 700; color: #0284c7; border: 1px solid #cbd5e1; font-size: 0.95rem;">${qty}</td>
                <td style="padding: 0.6rem 0.75rem; text-align: center; border: 1px solid #cbd5e1;">
                    <span class="prep-check-box-interactive" style="width:20px; height:20px; border-radius:4px; border:2px solid ${isChecked ? '#10b981' : '#64748b'}; background:${isChecked ? '#10b981' : '#ffffff'}; color:${isChecked ? '#ffffff' : 'transparent'}; display:inline-flex; align-items:center; justify-content:center; font-size:0.75rem;">
                        <i class="fa-solid fa-check"></i>
                    </span>
                </td>
            </tr>
        `;
    });

    if (eqList.length === 0) {
        itemsHtml = `
            <tr>
                <td colspan="5" style="padding: 1.5rem; text-align: center; color: #64748b; border: 1px solid #cbd5e1;">- ไม่พบรายการอุปกรณ์ -</td>
            </tr>
        `;
    }

    const reqDateStr = formatThaiDate(record.requestDate || record.borrowDate);
    const reqTimeStr = record.requestTime ? `เวลา ${record.requestTime} น.` : '';
    const useDateStr = record.usageDate || record.useDate;
    const returnDateStr = record.expectedReturnDate || record.returnDate;

    let statusThai = 'อยู่ระหว่างจัดเตรียม';
    let statusColor = '#f59e0b';
    if (record.status === 'ready') { statusThai = 'จัดเตรียมเสร็จแล้ว (พร้อมรับ)'; statusColor = '#10b981'; }
    else if (record.status === 'borrowed') { statusThai = 'รับของแล้ว (รับมอบแล้ว)'; statusColor = '#0284c7'; }
    else if (record.status === 'returned') { statusThai = 'ส่งคืนเรียบร้อยแล้ว'; statusColor = '#64748b'; }

    container.innerHTML = `
        <div class="print-doc-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0284c7; padding-bottom:1rem; margin-bottom:1.25rem;">
            <div class="print-header-brand" style="display:flex; align-items:center; gap:0.85rem;">
                <img src="hospital_logo.jpg" alt="โรงพยาบาลพุทธชินราช พิษณุโลก" style="height:52px; width:auto; object-fit:contain; border-radius:4px;">
                <div>
                    <h2 style="margin:0; font-size:1.3rem; font-weight:700; color:#0f172a;">ใบคำขอเบิกเครื่องมือผ่าตัด</h2>
                    <p style="margin:2px 0 0 0; font-size:0.85rem; color:#64748b;">Surgical Instrument Requisition Slip - โรงพยาบาลพุทธชินราช พิษณุโลก</p>
                </div>
            </div>
            <div class="print-doc-ref" style="text-align:right;">
                <div class="print-or-badge" style="background:#0284c7; color:#fff; font-size:1.15rem; font-weight:700; padding:0.35rem 0.9rem; border-radius:6px; display:inline-block; margin-bottom:0.25rem;">${escapeHtml(record.orRoom)}</div>
                <div class="print-ref-id" style="font-size:0.82rem; color:#64748b; font-weight:600;">REF: ${record.id}</div>
            </div>
        </div>

        <div class="print-info-grid" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.6rem 1.25rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.85rem 1rem; margin-bottom:1.25rem; font-size:0.88rem;">
            <div class="print-info-item"><span class="label" style="font-weight:600; color:#475569;">ชื่อผู้ยื่นขอเบิก:</span> <span class="value" style="font-weight:700; color:#0f172a;">${escapeHtml(record.borrowerName)}</span></div>
            <div class="print-info-item"><span class="label" style="font-weight:600; color:#475569;">ห้องผ่าตัดที่ใช้งาน:</span> <span class="value" style="font-weight:700; color:#0284c7;">${escapeHtml(record.orRoom)}</span></div>
            <div class="print-info-item"><span class="label" style="font-weight:600; color:#475569;">วัน-เวลาที่ยื่นส่งเบิก:</span> <span class="value" style="color:#0f172a;">${reqDateStr} ${reqTimeStr}</span></div>
            <div class="print-info-item"><span class="label" style="font-weight:600; color:#475569;">วันที่ต้องการใช้งาน:</span> <span class="value" style="color:#0f172a; font-weight:600;">${formatThaiDate(useDateStr)}</span></div>
            <div class="print-info-item"><span class="label" style="font-weight:600; color:#475569;">กำหนดส่งคืนอุปกรณ์:</span> <span class="value" style="color:#0f172a;">${formatThaiDate(returnDateStr)}</span></div>
            <div class="print-info-item"><span class="label" style="font-weight:600; color:#475569;">สถานะการจัดเตรียม:</span> <span class="value" style="font-weight:700; color:${statusColor};">${statusThai}</span></div>
        </div>

        <div style="margin-top: 1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                <h4 style="margin: 0; font-size: 0.95rem; color: #0f172a; display:flex; align-items:center; gap:0.4rem;">
                    <i class="fa-solid fa-list-check" style="color:#0284c7;"></i> รายการเครื่องมือและอุปกรณ์ผ่าตัดที่ขอเบิก
                </h4>
                <span style="font-size:0.78rem; color:#64748b;">(คลิกที่รายการบนจอเพื่อติ๊กตรวจรับ)</span>
            </div>
            <table class="print-checklist-table" style="width:100%; border-collapse:collapse; font-size:0.88rem;">
                <thead>
                    <tr style="background:#e0f2fe; color:#0369a1;">
                        <th style="padding:0.6rem 0.75rem; width:40px; text-align:center; border:1px solid #cbd5e1;">#</th>
                        <th style="padding:0.6rem 0.75rem; width:140px; border:1px solid #cbd5e1; text-align:left;">หมวดหมู่</th>
                        <th style="padding:0.6rem 0.75rem; border:1px solid #cbd5e1; text-align:left;">รายการเครื่องมือผ่าตัด / ขนาดที่ระบุ</th>
                        <th style="padding:0.6rem 0.75rem; width:90px; text-align:center; border:1px solid #cbd5e1;">จำนวน</th>
                        <th style="padding:0.6rem 0.75rem; width:70px; text-align:center; border:1px solid #cbd5e1;">ตรวจรับ</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr style="background:#f8fafc; font-weight:700;">
                        <td colspan="3" style="padding:0.65rem 0.75rem; text-align:right; border:1px solid #cbd5e1; color:#334155;">รวมอุปกรณ์ทั้งหมด (${eqList.length} รายการ):</td>
                        <td style="padding:0.65rem 0.75rem; text-align:center; color:#0284c7; font-size:0.95rem; border:1px solid #cbd5e1;">${totalQty} ชิ้น</td>
                        <td style="padding:0.65rem 0.75rem; text-align:center; border:1px solid #cbd5e1;"></td>
                    </tr>
                </tfoot>
            </table>
        </div>

        ${record.notes ? `
        <div style="margin-top:0.85rem; padding:0.65rem 0.85rem; background:#fffbeb; border:1px solid #fef3c7; border-left:4px solid #f59e0b; border-radius:6px; font-size:0.85rem; color:#92400e;">
            <strong><i class="fa-solid fa-comment-medical"></i> หมายเหตุจากผู้เบิก:</strong> ${escapeHtml(record.notes)}
        </div>
        ` : ''}

        ${(record.prepNotes && record.prepNotes.trim()) ? `
        <div style="margin-top:0.85rem; padding:0.65rem 0.85rem; background:#eff6ff; border:1.5px solid #bfdbfe; border-left:4px solid #0284c7; border-radius:6px; font-size:0.85rem; color:#1e40af;">
            <strong><i class="fa-solid fa-bullhorn"></i> หมายเหตุจากผู้จัดเตรียม (ห้อง Prep):</strong> ${escapeHtml(record.prepNotes)}
        </div>
        ` : ''}

        <div class="print-signatures-footer" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1.25rem; margin-top:2rem; padding-top:1rem; border-top:1px dashed #cbd5e1;">
            <div class="signature-box" style="text-align:center;">
                <div class="signature-line" style="border-bottom:1px dotted #64748b; height:32px; margin-bottom:4px;"></div>
                <p style="margin:0; font-weight:600; font-size:0.82rem; color:#1e293b;">(......................................................)</p>
                <p style="margin:2px 0 0 0; font-size:0.75rem; color:#64748b;">ผู้ยื่นขอเบิก (พยาบาลห้อง OR)</p>
            </div>
            <div class="signature-box" style="text-align:center;">
                <div class="signature-line" style="border-bottom:1px dotted #64748b; height:32px; margin-bottom:4px;"></div>
                <p style="margin:0; font-weight:600; font-size:0.82rem; color:#1e293b;">(......................................................)</p>
                <p style="margin:2px 0 0 0; font-size:0.75rem; color:#64748b;">ผู้จัดเตรียม & จ่ายของ (ห้อง Prep)</p>
            </div>
            <div class="signature-box" style="text-align:center;">
                <div class="signature-line" style="border-bottom:1px dotted #64748b; height:32px; margin-bottom:4px;"></div>
                <p style="margin:0; font-weight:600; font-size:0.82rem; color:#1e293b;">(......................................................)</p>
                <p style="margin:2px 0 0 0; font-size:0.75rem; color:#64748b;">ผู้ตรวจรับมอบเครื่องมือ</p>
            </div>
        </div>
    `;

    // Update Confirm Received Button state
    const btnConfirm = document.getElementById('btn-confirm-received');
    if (btnConfirm) {
        if (record.status === 'borrowed') {
            btnConfirm.innerHTML = '<i class="fa-solid fa-check-double"></i> ได้รับของครบถ้วนแล้ว';
            btnConfirm.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
            btnConfirm.disabled = false;
        } else if (record.status === 'returned') {
            btnConfirm.innerHTML = '<i class="fa-solid fa-rotate-left"></i> คืนอุปกรณ์เรียบร้อย';
            btnConfirm.style.background = '#64748b';
            btnConfirm.disabled = true;
        } else {
            btnConfirm.innerHTML = '<i class="fa-solid fa-circle-check"></i> ได้รับของครบถ้วน (ยืนยันรับมอบ)';
            btnConfirm.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            btnConfirm.disabled = false;
        }
    }

    modal.style.display = 'flex';
    modal.classList.add('open');
}

function toggleBorrowerCheckItem(recordId, index) {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    record.borrowerCheckedIndices = record.borrowerCheckedIndices || [];
    const pos = record.borrowerCheckedIndices.indexOf(index);
    if (pos > -1) {
        record.borrowerCheckedIndices.splice(pos, 1);
    } else {
        record.borrowerCheckedIndices.push(index);
    }

    saveRecordsToStorage();
    openBorrowerDocModal(recordId);
}

function confirmAllItemsReceived() {
    if (!currentDocRecordId) return;
    const record = borrowRecords.find(r => r.id === currentDocRecordId);
    if (!record) return;

    record.status = 'borrowed';
    record.receivedAt = new Date().toISOString();

    // Mark all items as checked for borrower
    const eqList = record.instruments || record.equipmentList || [];
    record.borrowerCheckedIndices = eqList.map((_, i) => i);

    saveRecordsToStorage();
    renderStatusTrackerCards();

    alert(`ยืนยันการรับมอบอุปกรณ์ห้อง ${record.orRoom} ครบถ้วนเรียบร้อยแล้ว!\nระบบได้เปลี่ยนสถานะเป็น "รับของแล้ว" เรียบร้อยครับ`);

    openBorrowerDocModal(currentDocRecordId);
}

function closeBorrowerDocModal() {
    const modal = document.getElementById('borrower-doc-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('open');
    }
    currentDocRecordId = null;
}

function printBorrowerDoc() {
    window.print();
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

function openLogoLightbox() {
    const modal = document.getElementById('logo-lightbox-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('open');
    }
}

function closeLogoLightbox() {
    const modal = document.getElementById('logo-lightbox-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('open');
    }
}
