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

function clearAllEquipmentItems() {
    if (confirm('คำเตือน: คุณต้องการล้างรายการเครื่องมืออุปกรณ์ทั้งหมดในระบบหรือไม่?\n(หมวดหมู่ทั้งหมดยังคงอยู่ครบเหมือนเดิม)')) {
        equipmentList = [];
        saveEquipmentToStorage();
        renderEquipmentManageTable();
        if (typeof renderFormEquipmentChecklist === 'function') renderFormEquipmentChecklist();
        alert('ล้างรายการอุปกรณ์ทั้งหมดเรียบร้อยแล้ว');
    }
}

function importEquipmentFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const lines = text.split(/\r\n|\n/);
            const newItems = [];

            lines.forEach((line, index) => {
                const trimmed = line.trim();
                if (!trimmed) return;

                const parts = trimmed.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
                
                if (index === 0 && (parts[0].toLowerCase().includes('ชื่อ') || parts[0].toLowerCase().includes('name') || parts[0].toLowerCase().includes('id'))) {
                    return;
                }

                const name = parts[0] || parts[1] || '';
                const category = parts[1] || parts[0] || 'อุปกรณ์ทั่วไป';

                if (name) {
                    newItems.push({
                        id: 'eq-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                        name: name,
                        category: category,
                        active: true
                    });
                }
            });

            if (newItems.length > 0) {
                equipmentList = newItems;
                saveEquipmentToStorage();
                renderEquipmentManageTable();
                if (typeof renderFormEquipmentChecklist === 'function') renderFormEquipmentChecklist();
                alert(`นำเข้ารายการอุปกรณ์สำเร็จทั้งหมด ${newItems.length} รายการ`);
            } else {
                alert('ไม่พบข้อมูลอุปกรณ์ในไฟล์ที่เลือก');
            }
        } catch (err) {
            console.error(err);
            alert('เกิดข้อผิดพลาดในการอ่านไฟล์ CSV/Excel');
        }
        event.target.value = '';
    };
    reader.readAsText(file, 'UTF-8');
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
