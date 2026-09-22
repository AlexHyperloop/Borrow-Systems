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
            } else if (!data) {
                borrowRecords = [];
                localStorage.setItem('surgical_borrow_records_v10', JSON.stringify(borrowRecords));
            }
            if (typeof renderBorrowTable === 'function') renderBorrowTable();
            if (typeof updateStatistics === 'function') updateStatistics();
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
            if (typeof renderEquipmentManageTable === 'function') renderEquipmentManageTable();
            if (typeof renderBorrowTable === 'function') renderBorrowTable();
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
    const filterSelect = document.getElementById('or-room-filter');
    if (!filterSelect) return;
    
    const OR_ROOMS = [
        'OR 1', 'OR 2', 'OR 3', 'OR 4', 'OR 5',
        'OR 6', 'OR 7', 'OR 8', 'OR 9', 'OR 10',
        'OR 11', 'OR 12A', 'OR 12B', 'OR 13', 'OR 14',
        'OR 15', 'OR 16', 'OR 17', 'OR 18', 'OR 19', 'OR 20'
    ];

    filterSelect.innerHTML = '<option value="">ทุกห้องผ่าตัด</option>';
    OR_ROOMS.forEach(room => {
        filterSelect.innerHTML += `<option value="${room}">${room}</option>`;
    });
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
            let totalQty = 0;
            eqList.forEach(e => { totalQty += (e.quantity || e.qty || 1); });

            let eqHtml = '';
            if (eqList.length === 0) {
                eqHtml = '<span style="color:var(--text-muted); font-size:0.85rem;">- ไม่มีรายการ -</span>';
            } else if (eqList.length <= 2) {
                eqHtml = eqList.map(eq => {
                    const qty = eq.quantity || eq.qty || 1;
                    return `<span class="equipment-pill">${escapeHtml(eq.name)} <span class="qty-badge">${qty}</span></span>`;
                }).join('');
                eqHtml += ` <button type="button" class="btn-pop-more-items" onclick="openEquipmentDetailModal('${record.id}')" title="กดดูรายละเอียดเพิ่มเติม"><i class="fa-solid fa-magnifying-glass-plus"></i></button>`;
            } else {
                const firstTwo = eqList.slice(0, 2).map(eq => {
                    const qty = eq.quantity || eq.qty || 1;
                    return `<span class="equipment-pill">${escapeHtml(eq.name)} <span class="qty-badge">${qty}</span></span>`;
                }).join('');
                const remaining = eqList.length - 2;
                eqHtml = `${firstTwo} <button type="button" class="btn-pop-more-items" onclick="openEquipmentDetailModal('${record.id}')"><i class="fa-solid fa-boxes-stacked"></i> +อีก ${remaining} รายการ (รวม ${totalQty} ชิ้น)</button>`;
            }
            
            let statusHtml = '';
            if (record.status === 'pending') statusHtml = '<span class="status-badge pending"><i class="fa-solid fa-clock"></i> อยู่ระหว่างจัดเตรียม</span>';
            else if (record.status === 'ready') statusHtml = '<span class="status-badge ready"><i class="fa-solid fa-check-circle"></i> จัดเสร็จแล้ว</span>';
            else if (record.status === 'borrowed') statusHtml = '<span class="status-badge overdue"><i class="fa-solid fa-hand-holding-hand"></i> รับของแล้ว</span>';
            else if (record.status === 'returned') statusHtml = '<span class="status-badge returned"><i class="fa-solid fa-rotate-left"></i> คืนแล้ว</span>';
            
            let actionBtns = '';
            let prepBtn = `<button class="btn-prep-tool" onclick="printBorrowDocument('${record.id}')" title="เปิดใบจัดเครื่องมือและตรวจนับ">
                <i class="fa-solid fa-clipboard-check"></i> จัดเครื่องมือ
            </button>`;
            let deleteBtn = `<button class="btn-danger btn-sm" onclick="deleteBorrowRecord('${record.id}')" title="ลบรายการเบิกนี้"><i class="fa-solid fa-trash-can"></i></button>`;
            
            if (record.status === 'borrowed') {
                actionBtns = `
                    <button class="btn-success btn-sm" onclick="openReturnModal('${record.id}')" title="รับคืนอุปกรณ์">
                        <i class="fa-solid fa-rotate-left"></i> รับคืน
                    </button>
                    ${prepBtn}
                    ${deleteBtn}
                `;
            } else {
                actionBtns = `
                    ${prepBtn}
                    ${deleteBtn}
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

// 3 Distinct Zones for Prep Checklist Modal
const PREP_ZONES = [
    {
        id: 'package',
        title: '1. รายการอุปกรณ์ - Set Package',
        icon: 'fa-solid fa-box-archive',
        color: '#7c3aed',
        bg: '#f5f3ff',
        badgeBg: '#ede9fe',
        badgeColor: '#6d28d9'
    },
    {
        id: 'linen',
        title: '2. รายการอุปกรณ์ - ห้องผ้า (Set เครื่องมือ, Set เครื่องผ้า, ตู้เครื่องมือ)',
        icon: 'fa-solid fa-shirt',
        color: '#0284c7',
        bg: '#f0f9ff',
        badgeBg: '#e0f2fe',
        badgeColor: '#0369a1'
    },
    {
        id: 'stock',
        title: '3. รายการอุปกรณ์ - ห้อง Stock (อุปกรณ์ทั่วไป)',
        icon: 'fa-solid fa-boxes-packing',
        color: '#d97706',
        bg: '#fffbeb',
        badgeBg: '#fef3c7',
        badgeColor: '#b45309'
    }
];

function getItemPrepZone(category) {
    if (!category) return 'stock';
    if (category === 'Set Package' || /package/i.test(category)) {
        return 'package';
    }
    if (category === 'อุปกรณ์ทั่วไป' || /ทั่วไป|stock/i.test(category)) {
        return 'stock';
    }
    // Set เครื่องมือ, Set เครื่องผ้า, ตู้ต่างๆ belong to linen room
    return 'linen';
}

function printBorrowDocument(id) {
    currentPrintRecordId = id;
    const record = borrowRecords.find(r => r.id === id);
    if (!record) return;
    
    const container = document.getElementById('printable-checklist-container');
    if (!container) return;
    
    const eqList = record.equipmentList || record.instruments || [];
    const checkedIndices = record.prepCheckedIndices || [];
    const checkedCount = checkedIndices.length;
    const totalCount = eqList.length;
    const progressPercent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

    let zonesHtml = '';
    PREP_ZONES.forEach(zone => {
        const zoneItems = [];
        eqList.forEach((eq, originalIdx) => {
            if (getItemPrepZone(eq.category) === zone.id) {
                zoneItems.push({ eq, originalIdx });
            }
        });

        if (zoneItems.length > 0) {
            const zoneCheckedCount = zoneItems.filter(item => checkedIndices.includes(item.originalIdx)).length;
            const zoneTotalQty = zoneItems.reduce((sum, item) => sum + (item.eq.qty || item.eq.quantity || 1), 0);

            let itemsRows = zoneItems.map(({ eq, originalIdx }) => {
                const isChecked = checkedIndices.includes(originalIdx);
                const qty = eq.qty || eq.quantity || 1;
                const cat = eq.category ? `<span style="font-size:0.75rem; color:${zone.badgeColor}; background:${zone.badgeBg}; padding:2px 7px; border-radius:4px; margin-right:0.4rem; font-weight:600;">${escapeHtml(eq.category)}</span>` : '';
                
                return `
                    <div class="prep-check-row ${isChecked ? 'checked' : ''}" onclick="togglePrepCheckItem('${record.id}', ${originalIdx})" title="คลิกเพื่อติ๊กถูกว่าจัดเตรียมชิ้นนี้แล้ว">
                        <div style="display:flex; align-items:center; gap:0.75rem; flex:1; min-width:0;">
                            <span class="prep-check-box-interactive">
                                <i class="fa-solid fa-check"></i>
                            </span>
                            <div style="min-width:0; overflow:hidden;">
                                <span class="prep-check-item-name" style="font-weight:600; font-size:0.92rem;">${cat}${escapeHtml(eq.name)}</span>
                            </div>
                        </div>
                        <div style="font-weight:700; color:${zone.color}; font-size:0.95rem; margin-left:1rem; white-space:nowrap;">
                            ${qty} ชิ้น
                        </div>
                    </div>
                `;
            }).join('');

            zonesHtml += `
                <div class="prep-zone-card" style="margin-bottom:1rem; border:1.5px solid ${zone.color}35; border-radius:8px; overflow:hidden;">
                    <div class="prep-zone-header" style="background:${zone.bg}; color:${zone.color}; border-bottom:1px solid ${zone.color}25; padding:0.6rem 0.85rem; display:flex; justify-content:space-between; align-items:center;">
                        <h5 style="margin:0; font-size:0.92rem; font-weight:700; display:flex; align-items:center; gap:0.45rem;">
                            <i class="${zone.icon}"></i> ${zone.title}
                        </h5>
                        <span class="prep-zone-count" style="background:#ffffff; color:${zone.color}; border:1px solid ${zone.color}40; font-size:0.75rem; padding:2px 8px; border-radius:99px; font-weight:600;">
                            จัดแล้ว ${zoneCheckedCount}/${zoneItems.length} รายการ (${zoneTotalQty} ชิ้น)
                        </span>
                    </div>
                    <div style="padding:0.25rem 0.5rem;">
                        ${itemsRows}
                    </div>
                </div>
            `;
        }
    });

    if (!zonesHtml) {
        zonesHtml = `<div style="text-align:center; padding:1.5rem; color:#64748b;">- ไม่พบรายการอุปกรณ์ -</div>`;
    }

    const useDateStr = record.useDate || record.usageDate;
    const returnDateStr = record.returnDate || record.expectedReturnDate;
    const reqDateStr = formatDateThai(record.requestDate || record.borrowDate);
    const reqTimeStr = record.requestTime ? ` เวลา ${record.requestTime} น.` : '';

    let statusText = 'อยู่ระหว่างจัดเตรียม';
    let statusColor = '#f59e0b';
    if (record.status === 'ready') { statusText = 'จัดเตรียมเสร็จแล้ว (พร้อมรับ)'; statusColor = '#10b981'; }
    else if (record.status === 'borrowed') { statusText = 'รับของแล้ว'; statusColor = '#0284c7'; }
    else if (record.status === 'returned') { statusText = 'ส่งคืนเรียบร้อยแล้ว'; statusColor = '#64748b'; }

    container.innerHTML = `
        <div class="prep-progress-card">
            <div class="prep-progress-info">
                <i class="fa-solid fa-list-check" style="color:var(--emerald);"></i>
                <span>ความคืบหน้าการจัดเครื่องมือ: <strong id="prep-checked-counter" style="color:var(--primary);">${checkedCount}/${totalCount} รายการ</strong> (${progressPercent}%)</span>
            </div>
            <div class="prep-progress-bar-bg">
                <div class="prep-progress-bar-fill" id="prep-progress-bar" style="width: ${progressPercent}%;"></div>
            </div>
        </div>

        <div class="print-doc-header">
            <div class="print-header-brand" style="display:flex; align-items:center; gap:0.85rem;">
                <img src="hospital_logo.jpg" alt="โรงพยาบาลพุทธชินราช พิษณุโลก" style="height:52px; width:auto; object-fit:contain; border-radius:4px;">
                <div>
                    <h2>ใบจัดเตรียมเครื่องมือผ่าตัด</h2>
                    <p>Surgical Equipment Prep Checklist - โรงพยาบาลพุทธชินราช พิษณุโลก</p>
                </div>
            </div>
            <div class="print-doc-ref" style="text-align:right;">
                <div class="print-or-badge" style="background:#0284c7; color:#fff; font-size:1.15rem; font-weight:700; padding:0.35rem 0.9rem; border-radius:6px; display:inline-block; margin-bottom:0.25rem;">${record.orRoom}</div>
                <div class="print-ref-id" style="font-size:0.82rem; color:#64748b; font-weight:600;">REF: ${record.id}</div>
            </div>
        </div>
        <div class="print-info-grid">
            <div class="print-info-item"><span class="label">ชื่อผู้ขอเบิก:</span><span class="value" style="font-weight:700;">${escapeHtml(record.borrowerName)}</span></div>
            <div class="print-info-item"><span class="label">ห้องผ่าตัด:</span><span class="value" style="font-weight:700; color:#0284c7;">${escapeHtml(record.orRoom)}</span></div>
            <div class="print-info-item"><span class="label">เวลายื่นเบิก:</span><span class="value">${reqDateStr}${reqTimeStr}</span></div>
            <div class="print-info-item"><span class="label">วันที่ต้องการใช้:</span><span class="value">${formatDateThai(useDateStr)}</span></div>
            <div class="print-info-item"><span class="label">กำหนดส่งคืน:</span><span class="value">${formatDateThai(returnDateStr)}</span></div>
            <div class="print-info-item"><span class="label">สถานะปัจจุบัน:</span><span class="value" id="modal-status-text" style="font-weight:700; color:${statusColor};">${statusText}</span></div>
        </div>

        ${record.notes ? `
        <div style="margin-top:0.85rem; padding:0.65rem 0.85rem; background:#fffbeb; border:1px solid #fef3c7; border-left:4px solid #f59e0b; border-radius:6px; font-size:0.85rem; color:#92400e;">
            <strong><i class="fa-solid fa-comment-medical"></i> หมายเหตุจากผู้เบิก (ห้อง OR):</strong> ${escapeHtml(record.notes)}
        </div>
        ` : ''}

        <div style="margin-top: 1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem; border-bottom:1.5px solid #0f172a; padding-bottom:0.4rem;">
                <h4 style="margin:0; font-size:0.98rem; font-weight:700; color:#0f172a;"><i class="fa-solid fa-boxes-packing" style="color:var(--primary);"></i> รายการเครื่องมือที่ต้องจัดเตรียม (แบ่งตาม 3 โซน)</h4>
                <span style="font-size:0.8rem; color:#64748b;">(คลิกที่รายการบนจอเพื่อติ๊กตรวจนับ)</span>
            </div>
            <div id="prep-checklist-rows-container">
                ${zonesHtml}
            </div>
        </div>

        <div class="prep-staff-notes-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.45rem;">
                <label for="prep-staff-notes-input" style="font-weight:700; font-size:0.9rem; color:#0f172a; display:flex; align-items:center; gap:0.45rem; margin:0;">
                    <i class="fa-solid fa-bullhorn" style="color:#0284c7;"></i> หมายเหตุจากผู้จัดเตรียม (แจ้งไปยังห้องผ่าตัด / เครื่องมือขาดเหลือ):
                </label>
                <span style="font-size:0.75rem; color:#64748b;">(บันทึกและส่งแจ้งเตือนทันที)</span>
            </div>
            <textarea id="prep-staff-notes-input" 
                      rows="2" 
                      placeholder="พิมพ์แจ้งห้องผ่าตัด เช่น 'ที่จับโคมไฟ R2 ขาด กำลังส่งนึ่ง ให้ใช้ R1 แทน', 'จัดครบทุกรายการ'..." 
                      oninput="updatePrepStaffNotes('${record.id}', this.value)"
                      style="width:100%; font-family:var(--font-main); font-size:0.88rem; padding:0.6rem 0.75rem; border-radius:6px; border:1px solid #94a3b8; background:#ffffff; resize:vertical; box-sizing:border-box;">${escapeHtml(record.prepNotes || '')}</textarea>
        </div>

        <div class="print-signatures-footer" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:2rem; margin-top:2.5rem; padding-top:1rem; border-top:1px dashed #cbd5e1; text-align:center;">
            <div>
                <div style="border-bottom:1px dotted #64748b; height:32px; margin-bottom:4px;"></div>
                <p style="margin:0; font-weight:600; font-size:0.85rem;">(......................................................)</p>
                <p style="margin:3px 0 0 0; font-size:0.78rem; color:#64748b;">ผู้จัดเตรียม & จ่ายอุปกรณ์ (ห้อง Prep)</p>
            </div>
            <div>
                <div style="border-bottom:1px dotted #64748b; height:32px; margin-bottom:4px;"></div>
                <p style="margin:0; font-weight:600; font-size:0.85rem;">(......................................................)</p>
                <p style="margin:3px 0 0 0; font-size:0.78rem; color:#64748b;">ผู้รับมอบอุปกรณ์ (พยาบาลห้องผ่าตัด)</p>
            </div>
        </div>
    `;

    // Update button text and state depending on status
    const btnMarkReady = document.getElementById('btn-mark-ready-modal');
    if (btnMarkReady) {
        if (record.status === 'ready') {
            btnMarkReady.innerHTML = '<i class="fa-solid fa-check-double"></i> จัดเสร็จแล้ว (บันทึกซ้ำ)';
            btnMarkReady.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
        } else {
            btnMarkReady.innerHTML = '<i class="fa-solid fa-circle-check"></i> จัดเตรียมเสร็จแล้ว (พร้อมรับ)';
            btnMarkReady.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        }
    }
    
    document.getElementById('checklist-print-modal').style.display = 'flex';
}

function updatePrepStaffNotes(recordId, value) {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;
    record.prepNotes = value;
    saveRecordsToStorage();
}

function togglePrepCheckItem(recordId, index) {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    record.prepCheckedIndices = record.prepCheckedIndices || [];
    const pos = record.prepCheckedIndices.indexOf(index);
    if (pos > -1) {
        record.prepCheckedIndices.splice(pos, 1);
    } else {
        record.prepCheckedIndices.push(index);
    }

    saveRecordsToStorage();
    printBorrowDocument(recordId);
}

function markCurrentRecordAsReady() {
    if (!currentPrintRecordId) return;
    const record = borrowRecords.find(r => r.id === currentPrintRecordId);
    if (!record) return;

    record.status = 'ready';
    record.readyAt = new Date().toISOString();
    
    // Automatically tick all items if not yet ticked
    const eqList = record.equipmentList || record.instruments || [];
    record.prepCheckedIndices = eqList.map((_, i) => i);

    saveRecordsToStorage();
    renderBorrowTable();
    updateStatistics();
    
    showToast(`รายการของ ${record.orRoom} (${record.borrowerName}) เปลี่ยนสถานะเป็น "จัดเสร็จแล้ว (พร้อมรับ)" เรียบร้อยแล้ว!`, 'success');
    
    // Re-render modal to reflect ready status
    printBorrowDocument(currentPrintRecordId);
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
            <td style="text-align:center; font-weight:600; color:var(--text-muted);">${idx + 1}</td>
            <td><span class="equipment-pill" style="font-size:0.78rem;">${escapeHtml(eq.category)}</span></td>
            <td style="font-weight:600; color:var(--text-primary);">${escapeHtml(eq.name)}</td>
            <td style="text-align:center;">
                <label class="switch" style="margin:0 auto; display:inline-block;">
                    <input type="checkbox" ${eq.active !== false ? 'checked' : ''} onchange="toggleEquipmentActive('${eq.id}')">
                    <span class="slider round"></span>
                </label>
            </td>
            <td style="text-align:center;">
                <button type="button" class="btn-danger btn-sm" onclick="deleteEquipment('${eq.id}')" title="ลบรายการ" style="padding:0.35rem 0.65rem; border-radius:6px;"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openEquipmentDetailModal(recordId) {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    const modal = document.getElementById('equipment-detail-modal');
    if (!modal) return;

    const eqList = record.equipmentList || record.instruments || [];
    const useDateStr = formatDateThai(record.useDate || record.usageDate);
    const reqTimeStr = record.requestTime || '';

    const headerEl = document.getElementById('pop-detail-info-header');
    if (headerEl) {
        headerEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                    <span class="or-room-badge" style="margin-right:0.5rem; font-weight:700;">${escapeHtml(record.orRoom)}</span>
                    <strong style="font-size:1.05rem; color:var(--text-primary);">${escapeHtml(record.borrowerName)}</strong>
                </div>
                <div style="color:var(--text-muted); font-size:0.82rem;">
                    <i class="fa-solid fa-clock"></i> ยื่นเบิกเมื่อ: ${record.requestDate || ''} ${reqTimeStr ? 'เวลา ' + reqTimeStr + ' น.' : ''} | <i class="fa-solid fa-calendar"></i> วันที่ใช้: ${useDateStr}
                </div>
            </div>
        `;
    }

    const tbody = document.getElementById('pop-detail-tbody');
    if (tbody) {
        let html = '';
        let totalItemsQty = 0;

        eqList.forEach((eq, idx) => {
            const qty = eq.quantity || eq.qty || 1;
            totalItemsQty += qty;
            html += `
                <tr style="border-bottom:1px solid var(--border-color); font-size:0.9rem;">
                    <td style="padding:0.6rem 0.85rem; font-weight:600; color:var(--text-muted);">${idx + 1}</td>
                    <td style="padding:0.6rem 0.85rem;"><span class="equipment-pill" style="font-size:0.75rem;">${escapeHtml(eq.category || 'อุปกรณ์ผ่าตัด')}</span></td>
                    <td style="padding:0.6rem 0.85rem; font-weight:600;">${escapeHtml(eq.name)}</td>
                    <td style="padding:0.6rem 0.85rem; text-align:center;"><span class="qty-badge" style="font-size:0.85rem; padding:0.2rem 0.6rem;">${qty} ชิ้น</span></td>
                </tr>
            `;
        });

        html += `
            <tr style="background:var(--primary-light); font-weight:700;">
                <td colspan="3" style="padding:0.65rem 0.85rem; text-align:right; color:var(--primary);">รวมอุปกรณ์ทั้งหมด (${eqList.length} รายการ):</td>
                <td style="padding:0.65rem 0.85rem; text-align:center; color:var(--primary); font-size:0.95rem;">${totalItemsQty} ชิ้น</td>
            </tr>
        `;

        tbody.innerHTML = html;
    }

    const notesEl = document.getElementById('pop-detail-notes');
    if (notesEl) {
        if (record.notes) {
            notesEl.innerHTML = `<i class="fa-solid fa-comment-medical" style="color:var(--amber);"></i> <strong>หมายเหตุ:</strong> ${escapeHtml(record.notes)}`;
        } else {
            notesEl.innerHTML = '';
        }
    }

    const printBtn = document.getElementById('pop-detail-print-btn');
    if (printBtn) {
        printBtn.onclick = function() {
            closeEquipmentDetailModal();
            if (typeof openChecklistPrintModal === 'function') {
                openChecklistPrintModal(record.id);
            } else if (typeof printBorrowDocument === 'function') {
                printBorrowDocument(record.id);
            }
        };
    }

    const popDeleteBtn = document.getElementById('pop-detail-delete-btn');
    if (popDeleteBtn) {
        popDeleteBtn.onclick = function() {
            closeEquipmentDetailModal();
            deleteBorrowRecord(record.id);
        };
    }

    modal.style.display = 'flex';
    modal.classList.add('open');
}

function closeEquipmentDetailModal() {
    const modal = document.getElementById('equipment-detail-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('open');
    }
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
                if (!equipmentList) equipmentList = [];
                
                let addedCount = 0;
                let duplicateCount = 0;

                newItems.forEach((newItem, idx) => {
                    const isDuplicate = equipmentList.some(eq => eq.name === newItem.name && eq.category === newItem.category);
                    if (!isDuplicate) {
                        newItem.id = 'eq-' + Date.now() + '-' + idx + '-' + Math.floor(Math.random() * 1000);
                        equipmentList.push(newItem);
                        addedCount++;
                    } else {
                        duplicateCount++;
                    }
                });

                saveEquipmentToStorage();
                renderEquipmentManageTable();
                if (typeof renderFormEquipmentChecklist === 'function') renderFormEquipmentChecklist();
                
                alert(`นำเข้ารายการอุปกรณ์สำเร็จ!\n- เพิ่มใหม่: ${addedCount} รายการ\n- รายการที่มีอยู่แล้ว (ข้าม): ${duplicateCount} รายการ\n- รวมอุปกรณ์ในระบบทั้งหมด: ${equipmentList.length} รายการ`);
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
