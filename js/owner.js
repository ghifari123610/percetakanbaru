// --- JAVASCRIPT LENGKAP DIMULAI (Logic AdminAngelFix + Layout Baru + Kalkulator + Fix Error + Header Baru + Admin Ch_01 + Layout Kanan Baru) ---
document.addEventListener('DOMContentLoaded', () => { console.log('DOM Ready. Initializing script...'); try { console.log('Setting up constants and variables...');
// *** NAMA ADMIN DIUBAH ***
const CASHIER_KEY = 'P21_CH01', CASHIER_NAME = 'Ch_01';
// *** PREFIX ID TRANSAKSI BARU ***
const TX_ID_PREFIX = 'CH01';
const API_BASE_URL = '/api';
let subActive = false; const OPEN_KEY = `p21_shift_open_date_${CASHIER_KEY}`; const STEP = 1000;
const UNIT_MAP = {'A4 Standar':'Lembar','A4 PPT 2 Slide':'Slide','A4 Bolak-Balik':'Halaman','A3 Standar':'Lembar','F4 Standar':'Lembar','A4 Full Color':'Lembar','F4 Full Color':'Lembar','Pas Foto':'Pcs','Map Bening':'Pcs','Jarak Ongkir Maxim':'Ribu Rupiah','Jilid Lakban':'Pcs','Ong. Lipat Leaflet':'Lembar','Jilid Antero Biasa':'Pcs','Antero Laminating':'Lembar','ATK Campur x Rp':'Pcs','Penjepit Kecil':'Pcs','Penjepit Sedang':'Pcs','Leaflet 1 Sisi':'Lembar','Leaflet 2 Sisi':'Lembar'};
const NCR_NOTA_DATA = { /* ... (data NCR sama) ... */ "Nota 1 play uk 1/6 F4": { kelipatan: 6, tiers: [ [59, 4250], [Infinity, 2333] ] }, "Nota 2 play uk 1/6 F4": { kelipatan: 6, tiers: [ [59, 6583], [Infinity, 4667] ] }, "Nota 3 play uk 1/6 F4": { kelipatan: 6, tiers: [ [59, 8917], [Infinity, 7000] ] }, "Nota 4 play uk 1/6 F4": { kelipatan: 6, tiers: [ [59, 11250], [Infinity, 9333] ] }, "Nota 1 play uk 1/4 F4": { kelipatan: 4, tiers: [ [39, 6375], [Infinity, 3500] ] }, "Nota 2 play uk 1/4 F4": { kelipatan: 4, tiers: [ [39, 9875], [Infinity, 7000] ] }, "Nota 3 play uk 1/4 F4": { kelipatan: 4, tiers: [ [39, 13375], [Infinity, 10500] ] }, "Nota 4 play uk 1/4 F4": { kelipatan: 4, tiers: [ [39, 16875], [Infinity, 14000] ] }, "Nota 1 play uk 1/3 F4": { kelipatan: 3, tiers: [ [29, 8500], [Infinity, 4667] ] }, "Nota 2 play uk 1/3 F4": { kelipatan: 3, tiers: [ [29, 13167], [Infinity, 9333] ] }, "Nota 3 play uk 1/3 F4": { kelipatan: 3, tiers: [ [29, 17833], [Infinity, 14000] ] }, "Nota 4 play uk 1/3 F4": { kelipatan: 3, tiers: [ [29, 22500], [Infinity, 18667] ] }, "Nota 1 play uk 1/2 F4": { kelipatan: 2, tiers: [ [19, 12750], [Infinity, 7000] ] }, "Nota 2 play uk 1/2 F4": { kelipatan: 2, tiers: [ [19, 19750], [Infinity, 14000] ] }, "Nota 3 play uk 1/2 F4": { kelipatan: 2, tiers: [ [19, 26750], [Infinity, 21000] ] }, "Nota 4 play uk 1/2 F4": { kelipatan: 2, tiers: [ [19, 33750], [Infinity, 28000] ] }, "Nota 1 play uk Full F4": { kelipatan: 1, tiers: [ [9, 25500], [Infinity, 14000] ] }, "Nota 2 play uk Full F4": { kelipatan: 1, tiers: [ [9, 39500], [Infinity, 28000] ] }, "Nota 3 play uk Full F4": { kelipatan: 1, tiers: [ [9, 53500], [Infinity, 42000] ] }, "Nota 4 play uk Full F4": { kelipatan: 1, tiers: [ [9, 67500], [Infinity, 56000] ] } };
const KINGSTRUK_DATA = { /* ... (data Kingstruk sama) ... */ "120": { name: "Kingstruk 120 gsm", plano1: { p: 100, l: 65, harga: 1363 }, plano2: { p: 109, l: 79, harga: 1805 } }, "150": { name: "Kingstruk 150 gsm", plano1: { p: 100, l: 65, harga: 1704 }, plano2: { p: 109, l: 79, harga: 2257 } }, "210": { name: "Kingstruk 210 gsm", plano1: { p: 100, l: 65, harga: 2152 }, plano2: { p: 109, l: 79, harga: 2850 } }, "260": { name: "Kingstruk 260 gsm", plano1: { p: 100, l: 65, harga: 2664 }, plano2: { p: 109, l: 79, harga: 3529 } }, "310": { name: "Kingstruk 310 gsm", plano1: { p: 100, l: 65, harga: 3176 }, plano2: { p: 109, l: 79, harga: 4208 } } };
const ONGKIR_COST = 7000;

let shiftStartTime = null; let shiftStartTimeString = "--:--:--";
// Level Admin & Salary dihapus
const HARI_NAMA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const WAKTU_MAP = {'1': 'Pagi', '2': 'Siang', '3': 'Sore', '4': 'Malam'};

console.log('Utility functions defined...');
const $=(q,r=document)=>r.querySelector(q);
const parseIDR=s=>{s=String(s||'').toLowerCase().trim();if(!s)return 0;if(s.endsWith('k'))s=String(parseFloat(s)*1000);return Number(s.replace(/[^0-9\-]/g,'')||0)};
const IDR=n=>'Rp '+new Intl.NumberFormat('id-ID').format(Math.max(0,Math.round(n||0)));
const IDR2=n=>'Rp. '+new Intl.NumberFormat('id-ID').format(Math.max(0,Math.round(n||0)));
const fmtDots = n => new Intl.NumberFormat('id-ID').format(Math.max(0,Math.round(n||0)));
const now=()=>new Date();
const fmt={ymd:(d=now())=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10),hms:(d=now())=>`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`,hmsS:(d=now())=>`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`};
function witaDateTime(d=new Date()){const parts=new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Makassar',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(d);const pick=t=>parts.find(p=>p.type===t)?.value||'';return{tanggal:`${pick('year')}-${pick('month')}-${pick('day')}`,jam:`${pick('hour')}:${pick('minute')}:${pick('second')}`}}
const toast=m=>{const t=$('#toast'); if(t){t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',1600)}};
const roundUp1000=n=>n>0?Math.ceil(n/1000)*1000:0;
const KEY_TX_COUNTER=`p21_tx_counter_${CASHIER_KEY}`, KEY_TX_DATE=`p21_tx_date_${CASHIER_KEY}`;
// *** FUNGSI ID TRANSAKSI DIPERBARUI ***
const nextTxNumber=()=>{ const d=fmt.ymd(); const last=localStorage.getItem(KEY_TX_DATE); let n=0; if(last===d) n=parseInt(localStorage.getItem(KEY_TX_COUNTER)||'0',10); n++; localStorage.setItem(KEY_TX_COUNTER,String(n)); localStorage.setItem(KEY_TX_DATE,d); return String(n).padStart(3,'0'); }; // Diubah ke 3 digit
function buildShiftPayloadCompat(st){ const shift_id = `${st.date}-${st.idx || 1}`; return { date: st.date, jam_mulai: st.start_at, jam_tutup: st.end_at, cashier: CASHIER_NAME }; }
const getTomorrowDMY = () => { const t = new Date(); t.setDate(t.getDate() + 1); const d = String(t.getDate()).padStart(2, '0'); const m = String(t.getMonth() + 1).padStart(2, '0'); const y = String(t.getFullYear()).slice(-2); return `${d}-${m}-${y}`; };
console.log('Utility functions defined.');

console.log('Getting element references...'); const el={};
// *** Array elementIds DIPERBARUI DAN DIVERIFIKASI ***
const elementIds = [
  // Header & Debug
  'btnStart', 'btnClose', 'btnReset', 'debugAdmin', 'debugShiftStatus', 'debugShiftStart', 'debugQueueKasir', 'debugQueuePending',
  'headerLogoInput', 'headerLogoDisplay', 'headerLogoText',

  // Col Left: Ringkasan
  'colMidSummary', 'kSaldoAwal', 'kCash', 'kCashN', 'kQris', 'kQrisN', 'kOmzet', 'kOmzetN', 'kExp', 'kLaci', 'kReal', 'kSelisih', 'kSelisihTag',
  'expNote', 'expAmount', 'expSend',

  // Col Left: HPP Calc
  'hpp-section', 'lebarKertas', 'tinggiKertas', 'modalKertas', 'bolakBalik', 'bolakBalikOption', 'cuttingSticker', 'ongkir', 'jumlahLembarOrder',
  'jumlahMuat', 'modalSatuan', 'modalPerA3', 'modalTotalOrder', 'areaCetakInfo', 'infoSketsa', 'layoutCanvas',

  // Col Left: Kingstruk Calc
  'kingstruk-section', 'ksBahan', 'ksUkuranPlanoInfo', 'ksPanjangPotong', 'ksLebarPotong', 'ksJumlahButuh', 'ksBiayaTambahan',
  'ksCanvas1', 'ksMuatPlano1', 'ksHargaPotong1', 'ksJumlahPlano1', 'ksTotalModalAkhir1', 'ksPlano1Title',
  'ksCanvas2', 'ksMuatPlano2', 'ksHargaPotong2', 'ksJumlahPlano2', 'ksTotalModalAkhir2', 'ksPlano2Title',

  // Col Right: Moved Sections
  'colMidInput', 'txNama', 'txBarang', 'txHarga', 'pricePill', 'addCash', 'addQris',
  'colMidQueue', 'queueBody',
  'colMidReport', 'txBody', 'txTable', 'btnPrintReport',

  // Col Right: Kalkulator Utama
  'colRightCalc', 'pcSub', 'pcCopy', 'pcQty', 'pcQtyLabel', 'pcType', 'autoHarga', 'pcAddRow',
  'manualCopy', 'manualQty', 'manualName', 'manualUnitPrice', 'manualAdd',
  'receipt', 'pcTuan', 'pcNoHP', 'pcTanggal', 'pcPukul', 'pcBody', 'subNote', 'pcPaymentStatus', 'pcCatatan',
  'paidStamp', 'adminName', 'chkLunas', 'pcTotal', 'pcPanjar', 'pcSisa',
  'pcSave', 'pcQueueOrder', 'pcClear', 'pcHeaderRow',

  // Col Right: Orderan
  'colRightPendingOrders', 'pendingOrderList', 'pendingOrderPlaceholder',
  'colRightOrders', 'orderList', 'orderPlaceholder',

  // Lain-lain
  'fullReport', 'toast', 'colLeftGroup', 'colRightGroup', 'splitter',
  'imageFileInput', 'uploadedImageDisplay', 'uploadPlaceholder', 'clearImageButton',
  'pendingOrderModal', 'pendingModalWaktu', 'pendingModalTanggal', 'pendingModalBatal', 'pendingModalSimpan',
  'ncrErrorNotification', 'ncrErrorSound'
];
const uniqueElementIds = [...new Set(elementIds)]; // Hapus duplikat (jika ada)
let missingElement = false;
uniqueElementIds.forEach(id => { el[id] = $(`#${id}`); if (!el[id]) { console.error(`ERROR: Element #${id} not found!`); missingElement = true; } });
if (missingElement) { console.error("Missing critical HTML elements."); } // Jangan throw error, biarkan skrip lain jalan
console.log('Element references obtained.'); const adminSpan=$('#adminName');if(adminSpan)adminSpan.textContent=CASHIER_NAME;
if (el.debugAdmin) el.debugAdmin.textContent = CASHIER_NAME;
console.log('Defining core functions...');

// --- Fungsi Notifikasi Error ---
function ncrShowErrorNotification(message = "INPUT TIDAK VALID") { /* ... (fungsi sama) ... */ if (el.ncrErrorNotification && el.ncrErrorSound) { el.ncrErrorNotification.textContent = message; el.ncrErrorNotification.style.display = 'block'; el.ncrErrorSound.play().catch(e => console.warn("Audio play failed:", e)); setTimeout(() => { el.ncrErrorNotification.style.display = 'none'; }, 2500); } else { toast(message); } }

let txReady = false;
updateButtonsState = () => { /* ... (fungsi sama) ... */ const shiftIsActive = isShiftActive(); const nameVal = el.txNama?.value?.trim() || ''; const priceVal = parseIDR(el.txHarga?.value); txReady = nameVal.length > 0 && priceVal > 0 && shiftIsActive; if (el.addCash) el.addCash.disabled = !txReady; if (el.addQris) el.addQris.disabled = !txReady; const hasItemsInNota = el.pcBody && el.pcBody.children.length > 0; if (el.pcSave) el.pcSave.disabled = !hasItemsInNota; if (el.pcQueueOrder) el.pcQueueOrder.disabled = !hasItemsInNota; if (el.pcClear) el.pcClear.disabled = !hasItemsInNota; };
const setPrice = v => { if (v < 0) v = 0; if (el.txHarga) el.txHarga.value = v; if (el.pricePill) el.pricePill.textContent = IDR(v); updateButtonsState(); };
const addPrice = d => { let v = parseIDR(el.txHarga?.value) + d; setPrice(v); };

// API Functions (dari AdminAngelFix)
const apiAddTx = async (payload) => { console.log('Sending TX:', payload); try { const response = await fetch(`${API_BASE_URL}/transactions`, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Server error'); console.log('TX Sent successfully.'); toast('Transaksi terkirim'); return { ok: true }; } catch (e) { console.error('API TX Error:', e); toast('Gagal kirim transaksi! Cek koneksi/log.'); return { ok: false, error: e.message }; } };
const apiAddExpense = async (payload) => { console.log('Sending Expense:', payload); try { const response = await fetch(`${API_BASE_URL}/expenses`, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Server error'); console.log('Expense Sent successfully.'); toast('Pengeluaran terkirim'); return { ok: true }; } catch (e) { console.error('API Expense Error:', e); toast('Gagal kirim pengeluaran! Cek koneksi/log.'); return { ok: false, error: e.message }; } };
async function saveCalcToSheet(janjiSelesai = null){ /* ... (fungsi sama, ID TRANSAKSI DIPERBARUI) ... */
    const { tanggal, jam } = witaDateTime(); const panjarValue = parseIDR(el.pcPanjar?.value) || 0; const isLunas = el.chkLunas?.checked; let statusBayar = 'BELUM BAYAR'; if (isLunas) { statusBayar = 'SUDAH LUNAS'; } else if (panjarValue > 0) { statusBayar = 'SUDAH PANJAR'; }
    // *** ID TRANSAKSI DIPERBARUI ***
    const payload = { timestamp: `${tanggal} ${jam}`, tx_id: `INV-${TX_ID_PREFIX}-${nextTxNumber()}`, nama_tx: el.pcTuan?.value || 'Pelanggan', admin: CASHIER_NAME, ket: el.pcCatatan?.value || '-', harga: parseIDR(el.pcTotal?.value), metode: statusBayar, panjar: panjarValue, sisa: parseIDR(el.pcSisa?.value) || 0, no_hp: el.pcNoHP?.value || '-', janji_selesai: janjiSelesai || '', items: [] };
    el.pcBody.querySelectorAll('tr').forEach(row => { payload.items.push({ rangkap: row.dataset.copy || '1', qty: row.dataset.qty || '1', jenis: row.cells[2]?.textContent || 'N/A', harga_satuan: row.cells[3]?.textContent || '0', jumlah: row.cells[4]?.textContent || '0' }); }); console.log('Saving Calc:', payload); try { const response = await fetch(`${API_BASE_URL}/orders`, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Server error'); console.log('Order Sent successfully.'); toast('Orderan disimpan'); if (el.orderList && el.orderPlaceholder) { el.orderPlaceholder.style.display = 'none'; el.orderList.insertAdjacentHTML('beforeend', `<li>${jam.substring(0,5)} - <b>${payload.nama_tx}</b> (${IDR(payload.harga)}) - ${payload.metode}</li>`); } return { ok: true }; } catch (e) { console.error('API Order Error:', e); toast('Gagal simpan orderan! Cek koneksi/log.'); return { ok: false, error: e.message }; } }

// Shift Management Functions (dari AdminAngelFix)
const shiftKeyFor=d=>`p21_shift_state_${d}_${CASHIER_KEY}`;
const readState=d=>{ try { const data = localStorage.getItem(shiftKeyFor(d)); return data ? JSON.parse(data) : null; } catch(e) { console.error("Parse state error", d, e); return null; } };
const writeState=(d,o)=>localStorage.setItem(shiftKeyFor(d),JSON.stringify(o||null));
const clearOpen=()=>localStorage.removeItem(OPEN_KEY);
function isShiftActive() { return localStorage.getItem(OPEN_KEY) !== null; }
function updateQueueDebug() { if (el.debugQueueKasir && el.queueBody) { const count = el.queueBody.children.length; el.debugQueueKasir.textContent = `${count} Item`; } if (el.debugQueuePending && el.pendingOrderList) { const count = el.pendingOrderList.querySelectorAll('li:not(#pendingOrderPlaceholder)').length; el.debugQueuePending.textContent = `${count} Item`; if (el.pendingOrderPlaceholder) { el.pendingOrderPlaceholder.style.display = (count === 0) ? 'block' : 'none'; } } }
// updateSalaryDisplay dihapus
function setTransaksiEnabled(enable){ console.log('Set Tx Enabled:', enable); if(el.txNama) el.txNama.disabled = !enable; if(el.txBarang) el.txBarang.disabled = !enable; if(el.expNote) el.expNote.disabled = !enable; if(el.expAmount) el.expAmount.disabled = !enable; if(el.expSend) el.expSend.disabled = !enable; updateButtonsState(); }
function applyStarted(st){ console.log('Apply STARTED:', st); if(el.btnStart) el.btnStart.disabled = true; if(el.btnClose) el.btnClose.disabled = false; setTransaksiEnabled(true); shiftStartTime = new Date(st.start_timestamp); shiftStartTimeString = fmt.hmsS(shiftStartTime); if(el.debugShiftStart) el.debugShiftStart.textContent = shiftStartTimeString; if(el.debugShiftStatus) el.debugShiftStatus.innerHTML = '<span class="light green"></span> AKTIF'; if(el.btnPrintReport) el.btnPrintReport.style.display='none'; }
function applyClosed(st){ console.log('Apply CLOSED:', st); if(el.btnStart) {el.btnStart.disabled = false; el.btnStart.textContent = 'Mulai Shift Baru';} if(el.btnClose) el.btnClose.disabled = true; setTransaksiEnabled(false); shiftStartTime = null; shiftStartTimeString = "--:--:--"; if(el.debugShiftStart) el.debugShiftStart.textContent = shiftStartTimeString; if(el.debugShiftStatus) el.debugShiftStatus.innerHTML = '<span class="light red"></span> SELESAI'; if(el.btnPrintReport) el.btnPrintReport.style.display='block'; }
function applyIdle(){ console.log('Apply IDLE'); if(el.btnStart) {el.btnStart.disabled = false; el.btnStart.textContent = 'Mulai';} if(el.btnClose) el.btnClose.disabled = true; setTransaksiEnabled(false); shiftStartTime = null; shiftStartTimeString = "--:--:--"; if(el.debugShiftStart) el.debugShiftStart.textContent = shiftStartTimeString; if(el.debugShiftStatus) el.debugShiftStatus.innerHTML = '<span class="light red"></span> NONAKTIF'; if(el.btnPrintReport) el.btnPrintReport.style.display='none'; }

// initShift (dari AdminAngelFix)
function initShift(){
    console.log('Initializing shift...');
    const openDate = localStorage.getItem(OPEN_KEY);
    if (openDate) {
        const st = readState(openDate);
        if (st) {
            if (st.end_at) {
                console.warn('State CLOSED but OPEN_KEY exists.');
                clearOpen();
                applyClosed(st);
                 // Muat data lama saat ditutup
                if(el.kSaldoAwal) el.kSaldoAwal.value = fmtDots(st.saldo_awal || 0);
                if(el.kExp) el.kExp.value = fmtDots(st.total_exp || 0);
                if(el.kReal) el.kReal.value = fmtDots(st.uang_real || 0);
                refreshKPI(st);
            } else {
                applyStarted(st);
                if(el.kSaldoAwal) {el.kSaldoAwal.value = fmtDots(st.saldo_awal || 0); el.kSaldoAwal.disabled = true;}
                if(el.kExp) el.kExp.value = fmtDots(st.total_exp || 0);
                refreshKPI(st);
            }
        } else {
            console.error('CRITICAL: OPEN_KEY exists but no state found for date:', openDate);
            clearOpen();
            applyIdle();
        }
    } else {
        const today = fmt.ymd();
        const st = readState(today);
        if (st && st.end_at) {
            console.log('Shift today already CLOSED.');
            applyClosed(st);
            if(el.kSaldoAwal) el.kSaldoAwal.value = fmtDots(st.saldo_awal || 0);
            if(el.kExp) el.kExp.value = fmtDots(st.total_exp || 0);
            if(el.kReal) el.kReal.value = fmtDots(st.uang_real || 0);
            refreshKPI(st);
        } else {
            console.log('Shift today IDLE or not found.');
            applyIdle();
        }
    }
    updateQueueDebug();
}
function updateWitaTime() { /* ... (fungsi sama) ... */ const { tanggal, jam } = witaDateTime(); const dateParts = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Makassar', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).formatToParts(now()); const pick = (parts, t) => parts.find(p => p.type === t)?.value || ''; if (el.pcTanggal) el.pcTanggal.textContent = `${pick(dateParts, 'weekday')}, ${pick(dateParts, 'day')} ${pick(dateParts, 'month')} ${pick(dateParts, 'year')}`; if (el.pcPukul) el.pcPukul.textContent = `${jam.substring(0,5)} WITA`; }

// addTx (Input Cepat - dari AdminAngelFix, ID TRANSAKSI DIPERBARUI)
const addTx = async (method, nama_tx, harga_tx, barang_tx = '', clearInputFields = false) => {
    if (!isShiftActive()) { toast('Shift belum dimulai!'); return; }
    const openDate = localStorage.getItem(OPEN_KEY); if (!openDate) { toast('Error: Shift date not found!'); return; }
    const st = readState(openDate); if (!st) { toast('Error: Shift state not found!'); return; }
    const { tanggal, jam } = witaDateTime(); const harga = parseIDR(harga_tx);
    if (!nama_tx || harga <= 0) { console.error("addTx invalid input:", {nama_tx, harga_tx}); toast("Error: Data antrian invalid."); return; }
    let final_ket = barang_tx || '-'; const tuan_prefix = `[${nama_tx}] `; if (barang_tx && barang_tx.startsWith(tuan_prefix)) { final_ket = barang_tx.substring(tuan_prefix.length); }
    // *** ID TRANSAKSI DIPERBARUI ***
    const payload = { timestamp: `${tanggal} ${jam}`, tx_id: `${TX_ID_PREFIX}-${nextTxNumber()}`, nama_tx: nama_tx, admin: CASHIER_NAME, ket: final_ket, harga: harga, metode: method };
    if (el.txBody) { el.txBody.insertAdjacentHTML('afterbegin', `<tr><td>${payload.timestamp}</td><td>${payload.tx_id}</td><td>${payload.nama_tx}</td><td>${payload.admin}</td><td>${payload.ket}</td><td data-val="${payload.harga}">${IDR(payload.harga)}</td><td>${payload.metode}</td></tr>`); }
    st.transactions = st.transactions || []; st.transactions.unshift(payload);
    if (method === 'Cash') { st.total_cash = (st.total_cash || 0) + harga; st.n_cash = (st.n_cash || 0) + 1; }
    else if (method === 'QRIS') { st.total_qris = (st.total_qris || 0) + harga; st.n_qris = (st.n_qris || 0) + 1; }
    writeState(openDate, st); refreshKPI(st);
    apiAddTx(payload);
    if (clearInputFields) { if(el.txNama) el.txNama.value = ''; if(el.txBarang) el.txBarang.value = ''; setPrice(0); if(el.txNama) el.txNama.focus(); }
    toast(`+ ${method} ${IDR(harga)}`); updateButtonsState();
};
function generateOrderSummary(tuan) { /* ... (fungsi sama) ... */ const items = []; el.pcBody.querySelectorAll('tr').forEach(row => { const copy = row.dataset.copy || '1'; const qty = row.dataset.qty || '1'; const unit = row.cells[1]?.querySelector('.qtyUnit')?.textContent || 'pcs'; const jenis = row.cells[2]?.textContent || 'N/A'; items.push(`${jenis} (${copy}x${qty} ${unit})`); }); const total = el.pcTotal?.value || 'Rp 0'; return `[${tuan}] ${items.join(', ')} | Total: ${total}`; }
// refreshKPI (Dikembalikan dari AdminAngelFix)
function refreshKPI(state = null){
    const openDate = localStorage.getItem(OPEN_KEY); const st = state || (openDate ? readState(openDate) : null);
    let saldoAwal = parseIDR(el.kSaldoAwal?.value); let totalExp = parseIDR(el.kExp?.value); let totalCash = 0, nCash = 0, totalQris = 0, nQris = 0;
    if (st) {
        saldoAwal = st.saldo_awal || 0; totalExp = st.total_exp || 0; totalCash = st.total_cash || 0; nCash = st.n_cash || 0; totalQris = st.total_qris || 0; nQris = st.n_qris || 0;
        if (!isShiftActive() && el.kSaldoAwal) el.kSaldoAwal.value = fmtDots(saldoAwal);
        if(el.kExp) el.kExp.value = fmtDots(totalExp);
        if (el.txBody) {
            el.txBody.innerHTML = '';
            (st.transactions || []).forEach(payload => {
                el.txBody.insertAdjacentHTML('beforeend', `<tr><td>${payload.timestamp}</td><td>${payload.tx_id || payload['Kode Transaksi']}</td><td>${payload.nama_tx || payload['Nama Transaksi']}</td><td>${payload.admin || payload.Admin}</td><td>${payload.ket || payload.Barang}</td><td data-val="${payload.harga || payload.Harga}">${IDR(payload.harga || payload.Harga)}</td><td>${payload.metode || payload.Metode}</td></tr>`);
            });
        }
    } else if (!isShiftActive()) { console.log("refreshKPI called when shift not active and no state provided."); }
      else if (isShiftActive() && !st){ console.error("refreshKPI called when shift ACTIVE but no state found!"); return; }
    const omzet = totalCash + totalQris; const nOmzet = nCash + nQris; const laci = saldoAwal + totalCash - totalExp; const real = parseIDR(el.kReal?.value); const selisih = laci - real;
    if(el.kCash) el.kCash.textContent = IDR(totalCash); if(el.kCashN) el.kCashN.textContent = nCash + 'x'; if(el.kQris) el.kQris.textContent = IDR(totalQris); if(el.kQrisN) el.kQrisN.textContent = nQris + 'x'; if(el.kOmzet) el.kOmzet.textContent = IDR(omzet); if(el.kOmzetN) el.kOmzetN.textContent = nOmzet + 'x'; if(el.kLaci) el.kLaci.textContent = IDR(laci); if(el.kSelisih) el.kSelisih.textContent = IDR(Math.abs(selisih)); if (el.kSelisihTag) { if (selisih > 0) { el.kSelisihTag.textContent = 'Kurang'; el.kSelisih.style.color = 'var(--danger)'; } else if (selisih < 0) { el.kSelisihTag.textContent = 'Lebih'; el.kSelisih.style.color = 'var(--ok)'; } else { el.kSelisihTag.textContent = 'Pas'; el.kSelisih.style.color = 'inherit'; } }
}

function clearNota() { /* ... (fungsi sama) ... */ if(el.pcQty) el.pcQty.value = '1'; if(el.pcCopy) el.pcCopy.value = '1'; if(el.pcType) el.pcType.selectedIndex = 0; if(el.manualQty) el.manualQty.value = '1'; if(el.manualCopy) el.manualCopy.value = '1'; if(el.manualName) el.manualName.value = ''; if(el.manualUnitPrice) el.manualUnitPrice.value = ''; if(el.pcTuan) el.pcTuan.value = ''; if(el.pcNoHP) el.pcNoHP.value = ''; if(el.pcCatatan) el.pcCatatan.value = ''; if(el.pcPanjar) el.pcPanjar.value = ''; if(el.pcBody) el.pcBody.innerHTML = ''; if(el.chkLunas) el.chkLunas.checked = false; const stamp = $('#paidStamp'); if (stamp) stamp.style.display = 'none'; updateAutoHarga(); refreshPcTotal(); updateWitaTime(); toast('Nota dibersihkan'); updateButtonsState(); }

// Pricing Logic (NCR)
function ncrGetNotaPricePerBlock(notaType, blockQty) { /* ... (fungsi sama) ... */ const notaInfo = NCR_NOTA_DATA[notaType]; if (!notaInfo) return 0; for (const tier of notaInfo.tiers) { const [batasAtas, harga] = tier; if (blockQty <= batasAtas) return harga; } return notaInfo.tiers.length > 0 ? notaInfo.tiers[notaInfo.tiers.length - 1][1] : 0; }
function ncrGetTotal(type, qty) { /* ... (fungsi sama) ... */ if (qty <= 0) return 0; const pricePerBlock = ncrGetNotaPricePerBlock(type, qty); return Math.round(qty * pricePerBlock); }
// Pricing Logic (Print)
function a4_unit_price(q){ /* ... (fungsi sama) ... */ if(!q||q<=0)return 0; const a=[[1,320.74],[50,319.25],[100,295],[200,290],[300,285],[500,280],[1000,275],[2000,260],[5000,250],[10000,230]]; if(q>=a.at(-1)[0])return a.at(-1)[1]; if(q<=a[0][0])return a[0][1]; for(let i=0;i<a.length-1;i++){ const[b,c]=a[i],[d,e]=a[i+1]; if(q>=b&&q<=d){ const f=(q-b)/(d-b); return c+f*(e-c)}} return a.at(-1)[1]}
const a4_total=q=>Math.round(q*a4_unit_price(q)); const a4bb_total=q=>a4_total(Math.ceil(q/2)); const f4_total=q=>Math.round(a4_total(q)+15*Math.max(0,q)); const a4c=q=>650*q,f4c=q=>665*q,ppt=q=>175*q; function pas(q){ /* ... (fungsi sama) ... */ if(!q||q<=0)return 0; if(q===1)return 3000; if(q===2)return 4000; if(q===3)return 5000; const a=1666,b=850,c=4,d=50; if(q>=d)return Math.round(q*b); let e; e=a+((q-c)/(d-c))*(b-a); return Math.round(q*e)} function mapBening(q){ /* ... (fungsi sama) ... */ if(q<=0)return 0; if(q<=4)return q*2000; if(q<=12){ const a=8000+(q-4)/8*(20000-8000); return Math.round(a)} const a=20000/12; if(q<=50){ const b=a+(q-12)/(50-12)*(1500-a); return Math.round(q*b)} return Math.round(q*1500)} const jarakOngkirMaxim=q=>q<=0?0:1000*q; function jilidLakban(q){ /* ... (fungsi sama) ... */ if(q<=0)return 0; const a=5000,b=3500,c=50; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} const ongLipatLeaflet=q=>q<=0?0:100*q; function jilidAnteroBiasa(q){return q<=0?0:8000*q} function anteroLaminating(q){return q<=0?0:12000*q} function atkCampur(q){return q<=0?0:1000*q} function penjepitKecil(q){ /* ... (fungsi sama) ... */ if(q<=0)return 0; const a=1000,b=700,c=30; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} function penjepitSedang(q){ /* ... (fungsi sama) ... */ if(q<=0)return 0; const a=2000,b=1000,c=50; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} function leaflet1Sisi(q){ /* ... (fungsi sama) ... */ if(q<=0)return 0; const a=333,b=285,c=1000; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} function leaflet2Sisi(q){ /* ... (fungsi sama) ... */ if(q<=0)return 0; const a=666,b=570,c=500; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)}

// --- getTotal (Combined) ---
function getTotal(type, qty) { /* ... (fungsi sama) ... */ if (qty <= 0) return 0; if (subActive && !type.startsWith('Nota ')) return 0; if (type.startsWith('Nota ')) { return ncrGetTotal(type, qty); } else { if(type==='A3 Standar')return a4_total(qty)*2; if(type==='A4 Standar')return a4_total(qty); if(type==='F4 Standar')return f4_total(qty); if(type==='A4 Full Color')return a4c(qty); if(type==='F4 Full Color')return f4c(qty); if(type==='A4 PPT 2 Slide')return ppt(qty); if(type==='A4 Bolak-Balik')return a4bb_total(qty); if(type==='Pas Foto')return pas(qty); if(type==='Map Bening')return mapBening(qty); if(type==='Jarak Ongkir Maxim')return jarakOngkirMaxim(qty); if(type==='Jilid Lakban')return jilidLakban(qty); if(type==='Ong. Lipat Leaflet')return ongLipatLeaflet(qty); if(type==='Jilid Antero Biasa')return jilidAnteroBiasa(qty); if(type==='Antero Laminating')return anteroLaminating(qty); if(type==='ATK Campur x Rp')return atkCampur(qty); if(type==='Penjepit Kecil')return penjepitKecil(qty); if(type==='Penjepit Sedang')return penjepitSedang(qty); if(type==='Leaflet 1 Sisi')return leaflet1Sisi(qty); if(type==='Leaflet 2 Sisi')return leaflet2Sisi(qty); } console.warn("Unknown type for getTotal:", type); return 0; }

// --- updateAutoHarga (Combined) ---
function updateAutoHarga() { /* ... (fungsi sama) ... */ const copy = Math.max(1, parseInt(el.pcCopy?.value || '1', 10)); const qty = Math.max(1, parseInt(el.pcQty?.value || '1', 10)); const type = el.pcType?.value; let unitPrice = 0; let note = "Kalkulator Auto Diskon."; let isNCR = type.startsWith('Nota '); let isDiscountable = !isNCR; if (el.pcQtyLabel) el.pcQtyLabel.textContent = isNCR ? 'Blok' : 'Lembar'; if (el.pcSub) el.pcSub.disabled = !isDiscountable; if (!isDiscountable && subActive) { subActive = false; el.pcSub.setAttribute('aria-pressed','false'); el.pcSub.style.background='#dc2626'; toast('Diskon dinonaktifkan untuk Nota NCR'); } const totalQty = isNCR ? qty : copy * qty; if (totalQty > 0) { let rowTotal = getTotal(type, totalQty); unitPrice = rowTotal / totalQty; } if (isNCR) { const notaInfo = NCR_NOTA_DATA[type]; note = notaInfo ? `Nota NCR. Minimal ${notaInfo.kelipatan} blok & kelipatannya.` : "Jenis nota tidak valid."; } else { if(type === 'A4 PPT 2 Slide') note = 'Harga per SLIDE.'; else if(type === 'A4 Bolak-Balik') note = 'Harga per Halaman (sisi cetak).'; else if(type === 'A3 Standar') note = 'A3 = 2x A4.'; else if(type === 'F4 Standar') note = 'F4 = A4 + Rp 15/lbr.'; else if(type === 'Jarak Ongkir Maxim') note = 'Qty = Jarak (km).'; else if(type === 'ATK Campur x Rp') note = 'Ganti Hrg Satuan.'; else if(type === 'Leaflet 1 Sisi' || type === 'Leaflet 2 Sisi') note = 'Hrg/lbr A4.'; } if (el.autoHarga) el.autoHarga.value = subActive ? 'Diskon' : (Math.round(unitPrice) ? IDR(unitPrice) : 'Auto'); /* Pakai IDR */ if (el.subNote) el.subNote.textContent = subActive ? 'Mode DISKON AKTIF (hanya item print).' : note; const headerRow = el.pcHeaderRow; if (headerRow) { headerRow.cells[0].textContent = isNCR ? 'Play' : 'Rangkap'; headerRow.cells[1].textContent = isNCR ? 'Blok' : 'Lembar'; } }

// --- makeRow (Combined) ---
function makeRow(copy, qty, label, rowTotal, totalQty) { /* ... (fungsi sama, pakai IDR) ... */ const isNCR = label.startsWith('Nota '); const unitName = isNCR ? 'Blok' : (UNIT_MAP[label] || 'Lembar'); const unitPrice = totalQty > 0 ? (rowTotal / totalQty) : 0; const displayCopy = isNCR ? (label.match(/Nota (\d+) play/)?.[1] || 'N/A') : copy; const copyLabel = isNCR ? 'Play' : 'Rangkap'; const tr = document.createElement('tr'); tr.dataset.raw = String(rowTotal); tr.dataset.copy = String(copy); tr.dataset.qty = String(qty); tr.dataset.totalqty = String(totalQty); tr.dataset.isncr = String(isNCR); tr.innerHTML = ` <td class="qtyCell"><div class="qtyBox"><div class="qtyNum">${displayCopy}</div><div class="qtyUnit">${copyLabel}</div></div></td> <td class="qtyCell"><div class="qtyBox"><div class="qtyNum">${qty}</div><div class="qtyUnit">${unitName}</div></div></td> <td style="text-align:left;font-weight:700">${label}</td> <td style="text-align:right">${subActive && !isNCR ? 'Diskon' : IDR(unitPrice)}</td> <td style="text-align:right">${IDR(rowTotal)}</td> <td style="text-align:center"><button class="btn delPc" title="Hapus" style="width:34px;height:34px;font-size:16px;border-radius:10px;background:#e53e3e; color:white;">×</button></td> `; return tr; }

function updatePaymentStatus() { /* ... (fungsi sama) ... */ if (!el.pcPaymentStatus) return; const panjar = parseIDR(el.pcPanjar?.value); const isLunas = el.chkLunas?.checked; el.pcPaymentStatus.style.display = (panjar <= 0 && !isLunas) ? 'block' : 'none'; }
function refreshPcTotal(){ /* ... (fungsi sama, pakai IDR) ... */ let grandTotal = 0; if(el.pcBody) { el.pcBody.querySelectorAll('tr').forEach(row => { grandTotal += parseFloat(row.dataset.raw || '0'); }); } const roundedTotal = roundUp1000(grandTotal); if(el.pcTotal) el.pcTotal.value = IDR(roundedTotal); const panjar = parseIDR(el.pcPanjar?.value); const sisa = roundedTotal - panjar; if(el.pcSisa) el.pcSisa.value = (panjar > 0 && sisa >= 0) ? IDR(sisa) : ''; updatePaymentStatus(); updateButtonsState(); }
function collectTransactions(){ /* ... (fungsi sama) ... */ const rows=[...(el.txBody.children||[])];return rows.map(r=>({t:r.cells[0]?.textContent||'',k:r.cells[1]?.textContent||'',n:r.cells[2]?.textContent||'',a:r.cells[3]?.textContent||'',b:r.cells[4]?.textContent||'',h:r.cells[5]?.textContent||'',m:r.cells[6]?.textContent||''}))}

// buildReport & printReport (dari AdminAngelFix)
function buildReport(){ /* ... (fungsi sama) ... */ const openDate = localStorage.getItem(OPEN_KEY) || fmt.ymd(); const st = readState(openDate); if (!st) { el.fullReport.innerHTML = '<p>Data shift tidak ditemukan.</p>'; return; } const { date, start_at, end_at, saldo_awal = 0, total_cash = 0, n_cash = 0, total_qris = 0, n_qris = 0, total_exp = 0, uang_real = 0, selisih = 0, transactions = [], expenses = [] } = st; const omzet = total_cash + total_qris; const omzetN = n_cash + n_qris; const laci = saldo_awal + total_cash - total_exp; const selisihAbsV = Math.abs(selisih); const selisihText = selisih === 0 ? `PAS ${IDR(selisihAbsV)}` : (selisih < 0 ? `Lebih ${IDR(selisihAbsV)}` : `Kurang ${IDR(selisihAbsV)}`); const selisihCls = selisih === 0 ? 'zero' : (selisih < 0 ? 'pos' : 'neg'); let durasi = '-'; if(start_at && end_at){ try { const start = new Date(st.start_timestamp || `${date}T${start_at}`); const end = new Date(st.end_timestamp || `${date}T${end_at}`); const diffMs = end.getTime() - start.getTime(); if (!isNaN(diffMs) && diffMs > 0) { const diffMin = Math.round(diffMs / 60000); const hours = Math.floor(diffMin / 60); const minutes = diffMin % 60; durasi = (hours ? hours + 'j ' : '') + minutes + 'm'; } } catch(e) { console.error("Error calculating duration:", e); } } el.fullReport.innerHTML=`<div class="rtitle">Laporan Harian — Percetakan 21</div><div class="header-info">Tanggal: ${date} • Admin: ${CASHIER_NAME}</div><div class="box" style="margin:8px 0"><div class="kpi-grid"><div class="kpi-item"><div class="k">Saldo Awal</div><div class="v">${IDR(saldoAwal)}</div></div><div class="kpi-item"><div class="k">Cash</div><div class="v">${IDR(total_cash)} <span class="subtle">(${n_cash}x)</span></div></div><div class="kpi-item"><div class="k">QRIS</div><div class="v">${IDR(total_qris)} <span class="subtle">(${n_qris}x)</span></div></div><div class="kpi-item"><div class="k">Omzet</div><div class="v">${IDR(omzet)} <span class="subtle">(${omzetN}x)</span></div></div><div class="kpi-item"><div class="k">Pengeluaran</div><div class="v">${IDR(total_exp)}</div></div><div class="kpi-item"><div class="k">Uang Laci</div><div class="v">${IDR(laci)}</div></div><div class="kpi-item"><div class="k">Uang Real</div><div class="v">${IDR(uang_real)}</div></div><div class="kpi-item"><div class="k">Selisih (Laci - Real)</div><div class="v ${selisihCls}">${selisihText}</div></div><div class="kpi-item"><div class="k">Durasi Shift</div><div class="v">${durasi||'-'}</div></div></div></div><h3>Detail Transaksi</h3><table><thead><tr><th>Waktu</th><th>ID</th><th>Nama</th><th>Ket.</th><th>Harga</th><th>Metode</th></tr></thead><tbody>${transactions.length?transactions.map(r=>`<tr><td>${r.timestamp?.split(' ')[1]||'-'}</td><td>${r.tx_id}</td><td>${r.nama_tx}</td><td>${r.admin}</td><td>${r.ket}</td><td>${IDR(r.harga)}</td><td>${r.metode}</td></tr>`).join(''):'<tr><td colspan="6" style="text-align:center;opacity:.7">- Tidak ada transaksi -</td></tr>'}</tbody></table><h3>Detail Pengeluaran</h3><table><thead><tr><th>Waktu</th><th>Keterangan</th><th>Jumlah</th></tr></thead><tbody>${expenses.length?expenses.map(r=>`<tr><td>${r.timestamp?.split(' ')[1]||'-'}</td><td>${r.keterangan}</td><td>${IDR(r.jumlah)}</td></tr>`).join(''):'<tr><td colspan="3" style="text-align:center;opacity:.7">- Tidak ada pengeluaran -</td></tr>'}</tbody></table>`; }
function printReport(){ buildReport(); document.body.classList.add('print-report'); setTimeout(()=>window.print(),10); window.onafterprint=()=>{document.body.classList.remove('print-report')}}

function addDotFormatting(element, onBlurCallback = null) { /* ... (fungsi sama) ... */ if (!element) return; element.addEventListener('focus', (e) => { const val = parseIDR(e.target.value); e.target.value = val > 0 ? val : ''; }); element.addEventListener('blur', (e) => { const val = parseIDR(e.target.value); e.target.value = val > 0 ? fmtDots(val) : ''; if (onBlurCallback) onBlurCallback(); }); }

console.log('Core functions defined.'); console.log('Adding listeners...');

// --- Event Listeners ---
// Shift Buttons (dari AdminAngelFix)
if(el.btnStart) el.btnStart.addEventListener('click',async()=>{ console.log('btnStart clicked'); const s=parseIDR(el.kSaldoAwal?.value); if(s<=0){toast('Saldo Awal harus lebih dari 0'); el.kSaldoAwal?.focus(); return;} if(!confirm(`Mulai shift dengan Saldo Awal ${fmtDots(s)}?`)) return; const {tanggal:t,jam:j}=witaDateTime(); const u={date:t,start_at:j,end_at:null,start_timestamp:now().toISOString(),end_timestamp:null,cashier:CASHIER_NAME,/*level:el.debugAdminLevel?.value,*/saldo_awal:s,total_cash:0,n_cash:0,total_qris:0,n_qris:0,total_exp:0,uang_real:0,selisih:0,transactions:[],expenses:[]}; localStorage.setItem(OPEN_KEY,t); writeState(t,u); applyStarted(u); if(el.kSaldoAwal) el.kSaldoAwal.disabled=true; refreshKPI(u); const v=buildShiftPayloadCompat(u); console.log('API StartShift Payload:',v); try{ const response = await fetch(`${API_BASE_URL}/shifts`,{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'startShift',data:v})}); const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Server error'); toast('Shift dimulai & tersimpan!');} catch(w){console.error('API StartShift Error:',w); toast('Shift dimulai (offline). Gagal kirim ke server.');} });
if(el.btnClose) el.btnClose.addEventListener('click',async()=>{ console.log('btnClose clicked'); if(!isShiftActive()){toast('Shift belum dimulai.'); return;} const o=localStorage.getItem(OPEN_KEY); if(!o){ toast('Error: Tanggal shift tidak ditemukan!'); return; } const p=readState(o); if(!p){toast('Error: State shift tidak ditemukan!'); return;} refreshKPI(p); const q=parseIDR(el.kReal?.value); if(q<=0){toast('Isi Uang Real sebelum menutup kas.'); el.kReal?.focus(); return;} const r=p.saldo_awal||0; const s=p.total_cash||0; const t=p.total_exp||0; const u=r+s-t; const v=u-q; /* Laci - Real */ if(!confirm(`Tutup Kas?\nSaldo Awal: ${IDR(r)}\nTotal Cash: ${IDR(s)}\nPengeluaran: ${IDR(t)}\nUang Laci Teoritis: ${IDR(u)}\nUang Real: ${IDR(q)}\nSelisih: ${IDR(v)}\n\nYakin tutup kas?`)) return; const {tanggal:w,jam:x}=witaDateTime(); p.end_at=x; p.end_timestamp=now().toISOString(); p.uang_real=q; p.selisih=v; writeState(o,p); clearOpen(); applyClosed(p); refreshKPI(p); const y=buildShiftPayloadCompat(p); console.log('API CloseShift Payload:',y); try{ const response = await fetch(`${API_BASE_URL}/shifts`,{method:'POST',mode:'cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'closeShift',data:y})}); const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Server error'); toast('Shift ditutup & tersimpan!');} catch(z){console.error('API CloseShift Error:',z); toast('Shift ditutup (offline). Gagal kirim ke server.');} });
if(el.btnReset) el.btnReset.addEventListener('click',()=>{ if (confirm('YAKIN RESET SHIFT SAAT INI?\nSemua data transaksi dan ringkasan shift ini akan hilang.')) { const openDate = localStorage.getItem(OPEN_KEY); if(openDate) localStorage.removeItem(shiftKeyFor(openDate)); localStorage.removeItem(OPEN_KEY); /* LS_ADMIN_LEVEL_KEY dihapus */ localStorage.removeItem(KEY_TX_COUNTER); localStorage.removeItem(KEY_TX_DATE); toast('Shift direset. Muat ulang halaman.'); window.location.reload(); }});
if(el.btnPrintReport) el.btnPrintReport.addEventListener('click', printReport);

// Input Pengeluaran
if(el.expSend) el.expSend.addEventListener('click',async()=>{ if(!isShiftActive()){toast('Shift belum dimulai!'); return;} const o=localStorage.getItem(OPEN_KEY); if(!o){ toast('Error: Tanggal shift tidak ditemukan!'); return; } const p=readState(o); if(!p){toast('Error: State shift tidak ditemukan!'); return;} const n=el.expNote?.value.trim(); const a=parseIDR(el.expAmount?.value); if(!n||a<=0){toast('Isi Keterangan & Jumlah pengeluaran.'); return;} const {tanggal:t,jam:j}=witaDateTime(); const q={timestamp:`${t} ${j}`,date:t,jam:j,cashier:CASHIER_NAME,keterangan:n,jumlah:a}; p.expenses=p.expenses||[]; p.expenses.push(q); p.total_exp=(p.total_exp||0)+a; writeState(o,p); refreshKPI(p); if(el.expNote) el.expNote.value=''; if(el.expAmount) el.expAmount.value=''; apiAddExpense(q); toast(`- Pengeluaran ${IDR(a)}`);});

// Input Cepat
if(el.pricePill) el.pricePill.addEventListener('wheel',e=>{ if(!el.txNama?.disabled) { e.preventDefault(); addPrice(e.deltaY<0?STEP:-STEP); }},{passive:false});
if(el.pricePill) el.pricePill.addEventListener('dblclick',()=>{ if(!el.txNama?.disabled) setPrice(0);});
if(el.txNama) el.txNama.addEventListener('input',updateButtonsState);
if(el.addCash) el.addCash.addEventListener('click',()=>addTx('Cash',el.txNama?.value,el.txHarga?.value,el.txBarang?.value,true));
if(el.addQris) el.addQris.addEventListener('click',()=>addTx('QRIS',el.txNama?.value,el.txHarga?.value,el.txBarang?.value,true));

// Listener Input Ringkasan
[el.kSaldoAwal, /*el.kExp,*/ el.kReal].forEach(i=>{ if(i) { i.addEventListener('focus',e=>{const v=parseIDR(e.target.value); e.target.value=v>0?v:'';}); i.addEventListener('blur',e=>{const v=parseIDR(e.target.value); e.target.value=v>0?fmtDots(v):''; if(e.target.id==='kSaldoAwal'){ if(isShiftActive()){ const openDate = localStorage.getItem(OPEN_KEY); const currentState = openDate ? readState(openDate) : null; e.target.value=fmtDots(currentState?.saldo_awal||0); } } refreshKPI();}); } });
if(el.kReal) el.kReal.addEventListener('keydown',e=>{ if(e.key==='Enter'){if(isShiftActive()){el.btnClose?.click();} else { printReport(); } }});
if(el.expAmount) addDotFormatting(el.expAmount);

// Kalkulator Utama Inputs
if(el.pcQty) el.pcQty.addEventListener('input',updateAutoHarga);
if(el.pcCopy) el.pcCopy.addEventListener('input',updateAutoHarga);
if(el.pcType) el.pcType.addEventListener('change',updateAutoHarga);

// Kalkulator Utama Add Buttons
if(el.pcAddRow) el.pcAddRow.addEventListener('click',()=>{ /* ... (logic sama, validasi NCR) ... */ const copy = Math.max(1, parseInt(el.pcCopy?.value||'1', 10)); const qty = Math.max(1, parseInt(el.pcQty?.value||'1', 10)); const type = el.pcType?.value; const isNCR = type.startsWith('Nota '); if (isNCR) { const notaInfo = NCR_NOTA_DATA[type]; if (!notaInfo) { ncrShowErrorNotification("Jenis nota tidak valid."); return; } const minOrder = notaInfo.kelipatan; if (qty < minOrder) { ncrShowErrorNotification(`Minimal ${minOrder} Blok`); return; } if (qty % notaInfo.kelipatan !== 0) { ncrShowErrorNotification(`Jumlah harus kelipatan ${notaInfo.kelipatan}`); return; } } const totalQty = isNCR ? qty : copy * qty; if(totalQty<=0){toast('Jumlah Lembar/Blok/Qty harus lebih dari 0'); return;} let rowTotal = getTotal(type, totalQty); if(['A4 Standar','A4 PPT 2 Slide'].includes(type) && totalQty <= 50 && !isNCR){ const ratio = (50 - totalQty) / 49; rowTotal += Math.round(500 * ratio); } el.pcBody.prepend(makeRow(copy, qty, type, rowTotal, totalQty)); refreshPcTotal(); });
if(el.manualAdd) el.manualAdd.addEventListener('click',()=>{ /* ... (logic sama) ... */ const q=Math.max(1,parseInt(el.manualQty.value)||1),c=Math.max(1,parseInt(el.manualCopy.value)||1); const name=(el.manualName.value||'').trim(); const unit=parseIDR(el.manualUnitPrice.value); if(!name||!unit||unit<=0){toast('Isi semua field manual (Nama, Harga Satuan > 0)'); return;} const totalQty=q*c; const rowTotal=totalQty*unit; el.pcBody.prepend(makeRow(c,q,`${name} (Manual)`,rowTotal,totalQty)); el.manualQty.value=1;el.manualCopy.value=1;el.manualName.value='';el.manualUnitPrice.value=''; refreshPcTotal(); });

// Kalkulator Utama Lainnya
if(el.pcBody) el.pcBody.addEventListener('click',e=>{ const btn=e.target.closest('.delPc')||e.target.closest('.btn-del-row'); if(!btn)return; btn.closest('tr').remove(); refreshPcTotal()});
if(el.pcClear) el.pcClear.addEventListener('click', clearNota);
if(el.pcSub) el.pcSub.addEventListener('click',()=>{ /* ... (logic sama, validasi NCR) ... */ const type = el.pcType?.value; if (type.startsWith('Nota ')) { toast('Diskon tidak berlaku untuk Nota NCR.'); return; } subActive=!subActive; el.pcSub.setAttribute('aria-pressed',String(subActive)); el.pcSub.style.background=subActive?'var(--accent)':'#dc2626'; updateAutoHarga(); toast(subActive?'Mode Diskon AKTIF':'Mode Diskon NONAKTIF'); });
if(el.pcPanjar) addDotFormatting(el.pcPanjar, refreshPcTotal);
if(el.manualUnitPrice) addDotFormatting(el.manualUnitPrice);

// Tombol Aksi Nota Utama
if(el.pcSave){ el.pcSave.addEventListener('click', () => { /* ... (logic sama) ... */ const t=parseIDR(el.pcTotal?.value); const u=el.pcTuan?.value.trim()||'Pelanggan'; if(t<=0){toast('Total Rp 0. Tidak bisa ke antrian.'); return;} const s=generateOrderSummary(u); if(el.queueBody) el.queueBody.insertAdjacentHTML('beforeend', `<tr data-nama="${u}" data-total="${t}" data-summary="${s.replace(/"/g, '&quot;')}"><td>${s}</td><td>${IDR(t)}</td><td><button class="btn btn-green btn-q-cash">Cash</button><button class="btn btn-blue btn-q-qris">QRIS</button></td></tr>`); updateQueueDebug(); clearNota(); toast('Nota masuk antrian kasir'); }); }
if(el.pcQueueOrder){ el.pcQueueOrder.addEventListener('click', () => { /* ... (logic sama) ... */ const t=parseIDR(el.pcTotal?.value); const u=el.pcTuan?.value.trim()||'Pelanggan'; if(t<=0){toast('Total Rp 0. Tidak bisa ditampung.'); return;} const s=generateOrderSummary(u); const p=parseIDR(el.pcPanjar?.value); const i=parseIDR(el.pcSisa?.value); const l=el.chkLunas?.checked; const d_temp={ tuan:u, noHP:el.pcNoHP?.value || '-', catatan:el.pcCatatan?.value || '-', lunas:l, panjar:p, sisa:i, total:t, janjiSelesai: '', items:[] }; if(el.pcBody) { el.pcBody.querySelectorAll('tr').forEach(r=>{ d_temp.items.push({ copy:r.dataset.copy || '1', qty:r.dataset.qty || '1', label:r.cells[2]?.textContent || 'N/A', total:r.dataset.raw || r.dataset.total || '0', harga_satuan: r.cells[3]?.textContent || '0', jumlah: r.cells[4]?.textContent || '0' }); }); } if (el.pendingOrderModal) { el.pendingOrderModal.dataset.notaData = JSON.stringify(d_temp); el.pendingOrderModal.dataset.summary = s; } if (el.pendingModalWaktu) el.pendingModalWaktu.value = '2'; if (el.pendingModalTanggal) el.pendingModalTanggal.value = getTomorrowDMY(); if (el.pendingOrderModal) el.pendingOrderModal.style.display = 'flex'; if (el.pendingModalTanggal) el.pendingModalTanggal.focus(); }); }

// Listener Modal Pending Order
if(el.pendingModalBatal) { el.pendingModalBatal.addEventListener('click', () => { if (el.pendingOrderModal) { el.pendingOrderModal.style.display = 'none'; el.pendingOrderModal.dataset.notaData = ''; el.pendingOrderModal.dataset.summary = ''; } }); }
if(el.pendingModalSimpan) { el.pendingModalSimpan.addEventListener('click', () => { /* ... (logic sama) ... */ const waktuKey = el.pendingModalWaktu?.value || '2'; const tanggalInput = el.pendingModalTanggal?.value?.trim(); const waktuString = WAKTU_MAP[waktuKey] || 'Siang'; if (!tanggalInput || !/^\d{2}-\d{2}-\d{2}$/.test(tanggalInput)) { toast("Format tanggal salah. Gunakan DD-MM-YY."); return; } let janjiSelesai = `${waktuString}, ${tanggalInput}`; let hariString = ''; try { const parts = tanggalInput.split('-'); if(parts.length === 3) { const dP = parseInt(parts[0], 10); const mP = parseInt(parts[1], 10) - 1; const yP = 2000 + parseInt(parts[2], 10); if(!isNaN(dP) && !isNaN(mP) && !isNaN(yP)) { const dateObj = new Date(yP, mP, dP); if (dateObj && dateObj.getDate() === dP && dateObj.getMonth() === mP && dateObj.getFullYear() === yP) { hariString = HARI_NAMA[dateObj.getDay()]; janjiSelesai = `${hariString} ${waktuString}, ${tanggalInput}`; } else { toast("Tanggal tidak valid."); return; } } else { toast("Gagal proses tanggal."); return; } } else { toast("Format tanggal salah."); return; } } catch (e) { toast("Error proses tanggal."); return; } const d = JSON.parse(el.pendingOrderModal.dataset.notaData || '{}'); const s = el.pendingOrderModal.dataset.summary || ''; if (!d.tuan) { toast("Error: Data nota tidak ditemukan."); if (el.pendingOrderModal) el.pendingOrderModal.style.display = 'none'; return; } d.janjiSelesai = janjiSelesai; let st='BELUM BAYAR'; let sc='var(--danger)'; if(d.lunas){st='LUNAS'; sc='var(--ok)';} else if(d.panjar>0){st=`Panjar ${fmtDots(d.panjar)}`; sc='var(--warn)';} const li=document.createElement('li'); li.innerHTML=`<div style="padding: 8px; border-bottom: 1px solid var(--line); display:flex; justify-content:space-between; align-items:center;"><div><b>${d.tuan}</b> (${IDR(d.total)}) - <span style="color:${sc};">${st}</span><br><small style="color:var(--accent); font-weight:bold;">Janji: ${d.janjiSelesai}</small><br><small>${s}</small></div><div><button class="btn btn-danger btn-pending-cancel" style="padding:4px 8px;font-size:11px;">Batal</button><button class="btn btn-blue btn-pending-save" style="padding:4px 8px;font-size:11px;">Simpan</button></div></div>`; li.dataset.nota=JSON.stringify(d); if(el.pendingOrderList) el.pendingOrderList.appendChild(li); updateQueueDebug(); clearNota(); toast('Orderan ditampung di antrian pending'); if (el.pendingOrderModal) { el.pendingOrderModal.style.display = 'none'; el.pendingOrderModal.dataset.notaData = ''; el.pendingOrderModal.dataset.summary = ''; } }); }

// Listener List Pending Order
if(el.pendingOrderList) { el.pendingOrderList.addEventListener('click', async (e) => {
    const li = e.target.closest('li'); if (!li || !li.dataset.nota) return; const d = JSON.parse(li.dataset.nota);
    if (e.target.classList.contains('btn-pending-cancel')) { if (confirm(`Yakin batalkan orderan pending untuk ${d.tuan}?`)) { li.remove(); updateQueueDebug(); toast('Orderan pending dibatalkan'); }
    } else if (e.target.classList.contains('btn-pending-save')) {
        if (!confirm(`Simpan orderan ${d.tuan} (${IDR(d.total)}) ke Spreadsheet?\nJanji Selesai: ${d.janjiSelesai}`)) return;
        clearNota();
        if(el.pcTuan) el.pcTuan.value=d.tuan; if(el.pcNoHP) el.pcNoHP.value=d.noHP; if(el.pcCatatan) el.pcCatatan.value=d.catatan; if(el.pcPanjar) el.pcPanjar.value=d.panjar>0?fmtDots(d.panjar):''; if(el.chkLunas) el.chkLunas.checked=d.lunas;
        if(el.pcBody && d.items) {
            el.pcBody.innerHTML = '';
            d.items.forEach(i=>{
                const totalQty = (parseInt(i.copy,10)||1)*(parseInt(i.qty,10)||1);
                const row = makeRow(i.copy, i.qty, i.label, parseIDR(i.total), totalQty );
                el.pcBody.appendChild(row);
            });
        }
        refreshPcTotal(); updateWitaTime();
        const stamp = $('#paidStamp'); if (stamp && el.chkLunas) stamp.style.display = el.chkLunas.checked ? 'block' : 'none';
        // Panggil saveCalcToSheet versi AdminAngelFix
        const result=await saveCalcToSheet(d.janjiSelesai || null);
        if(result.ok){
            toast(`Orderan ${d.tuan} berhasil disimpan.`);
            li.remove(); updateQueueDebug(); clearNota();
        } else {
            toast(`GAGAL menyimpan orderan ${d.tuan}! Cek log/koneksi.`);
        }
    }
}); }
// Listener Antrian Kasir
if(el.queueBody) { el.queueBody.addEventListener('click', async (e) => { /* ... (logic sama, pakai addTx) ... */ const r=e.target.closest('tr'); if (!r) return; const n=r.dataset.nama; const t=r.dataset.total; const s=r.dataset.summary; let m=''; if(e.target.classList.contains('btn-q-cash')){m='Cash';} else if(e.target.classList.contains('btn-q-qris')){m='QRIS';} if(m){ await addTx(m,n,t,s,false); r.remove(); updateQueueDebug();} }); }
// Listener Checkbox Lunas
const chkLunasElem=$('#chkLunas'),paidStampElem=$('#paidStamp'); if(chkLunasElem&&paidStampElem){chkLunasElem.addEventListener('change',()=>{paidStampElem.style.display=chkLunasElem.checked?'block':'none'; updatePaymentStatus();})}
// Listener Splitter
(function(){ /* ... (logic sama) ... */ const s=$('.splitter'); if (!s) return; const c=$('.container'); if (!c) return; let d=!1; s.addEventListener('mousedown',()=>{d=!0; document.body.style.cursor='col-resize'; document.body.style.userSelect='none';}); document.addEventListener('mouseup',()=>{d=!1; document.body.style.cursor='default'; document.body.style.userSelect='auto';}); document.addEventListener('mousemove',(e)=>{ if(!d) return; e.preventDefault(); const r=c.getBoundingClientRect(); const l=e.clientX-r.left; const w=r.right-e.clientX; if (l>280&&w>320){c.style.setProperty('--col-left',`${l}px`); c.style.setProperty('--col-right',`${w}px`);}}); })();
// Listener Gambar Nota
    const imageInput = $('#imageFileInput'); const imageDisplay = $('#uploadedImageDisplay'); const uploadPlaceholder = $('#uploadPlaceholder'); const clearImageButton = $('#clearImageButton'); const imageStorageKey = `p21_receipt_image_${CASHIER_KEY}`;
    function displayUploadedImage(base64Data) { /* ... (fungsi sama) ... */ if (base64Data && imageDisplay && uploadPlaceholder && clearImageButton) { imageDisplay.src = base64Data; imageDisplay.style.display = 'block'; if(uploadPlaceholder) uploadPlaceholder.style.display = 'none'; if(clearImageButton) clearImageButton.style.display = 'inline'; } else if (imageDisplay && uploadPlaceholder && clearImageButton) { imageDisplay.src = ''; imageDisplay.style.display = 'none'; if(uploadPlaceholder) uploadPlaceholder.style.display = 'inline'; if(clearImageButton) clearImageButton.style.display = 'none'; } }
    const savedImage = localStorage.getItem(imageStorageKey); displayUploadedImage(savedImage);
    if (imageInput) { imageInput.addEventListener('change', (event) => { /* ... (logic sama) ... */ const file = event.target.files?.[0]; if (file && file.type.startsWith('image/')) { const reader = new FileReader(); reader.onload = (e) => { const base64Data = e.target?.result; if(typeof base64Data === 'string'){ displayUploadedImage(base64Data); localStorage.setItem(imageStorageKey, base64Data); toast('Gambar nota disimpan di browser.'); } else { toast('Gagal membaca data gambar.'); } }; reader.onerror = () => { toast('Gagal membaca file gambar.'); displayUploadedImage(null); localStorage.removeItem(imageStorageKey); }; reader.readAsDataURL(file); } else if (file) { toast('Format file tidak didukung.'); } imageInput.value = ''; }); }
    if (clearImageButton) { clearImageButton.addEventListener('click', () => { if (confirm('Hapus gambar nota?')) { localStorage.removeItem(imageStorageKey); displayUploadedImage(null); toast('Gambar nota dihapus.'); } }); }
// Listener Logo Header
    const headerLogoInput = el.headerLogoInput; const headerLogoDisplay = el.headerLogoDisplay; const headerLogoText = el.headerLogoText; const headerLogoStorageKey = `p21_header_logo_${CASHIER_KEY}`;
    function displayHeaderLogo(base64Data) { /* ... (fungsi sama) ... */ if(headerLogoDisplay && headerLogoText) { if(base64Data) { headerLogoDisplay.src = base64Data; headerLogoDisplay.style.display = 'block'; headerLogoText.style.display = 'none'; } else { headerLogoDisplay.src = ''; headerLogoDisplay.style.display = 'none'; headerLogoText.style.display = 'block'; } } }
    const savedHeaderLogo = localStorage.getItem(headerLogoStorageKey); displayHeaderLogo(savedHeaderLogo);
    if (headerLogoInput) { headerLogoInput.addEventListener('change', (event) => { /* ... (logic sama) ... */ const file = event.target.files?.[0]; if (file && file.type.startsWith('image/')) { const reader = new FileReader(); reader.onload = (e) => { const base64Data = e.target?.result; if(typeof base64Data === 'string'){ displayHeaderLogo(base64Data); localStorage.setItem(headerLogoStorageKey, base64Data); toast('Logo disimpan.'); } else { toast('Gagal baca logo.'); } }; reader.onerror = () => { toast('Gagal baca file logo.'); displayHeaderLogo(null); localStorage.removeItem(headerLogoStorageKey); }; reader.readAsDataURL(file); } else if (file) { toast('Format file logo tidak didukung.'); } headerLogoInput.value = ''; }); }
    if(headerLogoDisplay?.parentElement) { headerLogoDisplay.parentElement.addEventListener('dblclick', () => { if(localStorage.getItem(headerLogoStorageKey) && confirm('Hapus logo tersimpan?')) { localStorage.removeItem(headerLogoStorageKey); displayHeaderLogo(null); toast('Logo dihapus.'); } }); }
// Leave Guard
(function enableLeaveGuard(){ /* ... (logic sama) ... */ function shouldGuard(){try{if(document.body.classList.contains('print-report'))return false;var open=localStorage.getItem(OPEN_KEY);var active=false;if(open){var st=readState(open);active=!!(st&&st.start_at&&!st.end_at)}var hasCalcRows=!!(el.pcBody&&el.pcBody.children&&el.pcBody.children.length>0);var hasQueueItems = el.queueBody?.children.length > 0; var hasPendingItems = el.pendingOrderList?.querySelectorAll('li:not(#pendingOrderPlaceholder)').length > 0; return active||hasCalcRows||hasQueueItems||hasPendingItems}catch(e){return false}}window.addEventListener('beforeunload',function(e){if(!shouldGuard())return;var msg="Ada data yang belum disimpan atau shift aktif. Yakin ingin keluar?";e.preventDefault();e.returnValue=msg; return msg})})();

console.log('Listeners added.'); console.log('Finalizing init...');
// Load transactions & KPI
const openDateInit = localStorage.getItem(OPEN_KEY);
if (openDateInit) {
    const currentState = readState(openDateInit);
    if (currentState && !currentState.end_at) {
        if(el.kSaldoAwal) {el.kSaldoAwal.value = fmtDots(currentState.saldo_awal || 0); el.kSaldoAwal.disabled = true;}
        if(el.kExp) el.kExp.value = fmtDots(currentState.total_exp || 0);
        refreshKPI(currentState);
    } else if (currentState && currentState.end_at) {
        if(el.kSaldoAwal) el.kSaldoAwal.value = fmtDots(currentState.saldo_awal || 0);
        if(el.kExp) el.kExp.value = fmtDots(currentState.total_exp || 0);
        if(el.kReal) el.kReal.value = fmtDots(currentState.uang_real || 0);
        refreshKPI(currentState);
    }
} else {
    refreshKPI();
}

updateWitaTime();
if (el.txHarga) setPrice(+el.txHarga.value || 0); else setPrice(0);
updateAutoHarga(); updatePaymentStatus(); refreshPcTotal();
console.log('Calling initShift...'); initShift(); updateButtonsState();

// ===================================================================
// ===== SCRIPT KALKULATOR HPP A3+ (Revisi + Listener JS) ==========
// ===================================================================
function formatRupiahHpp(angka) { return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka); }
function gambarLayout(canvas, a3LebarCm, a3TinggiCm, pieceLebarCm, pieceTinggiCm, cols, rows) { /* ... (fungsi sama) ... */ if (!canvas) return; const ctx = canvas.getContext('2d'); const canvasWidth = canvas.width; const canvasHeight = canvas.height; const scaleX = canvasWidth / a3LebarCm; const scaleY = canvasHeight / a3TinggiCm; const effectiveScale = Math.min(scaleX, scaleY); ctx.clearRect(0, 0, canvasWidth, canvasHeight); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvasWidth, canvasHeight); const scaledA3Width = a3LebarCm * effectiveScale; const scaledA3Height = a3TinggiCm * effectiveScale; const offsetX = (canvasWidth - scaledA3Width) / 2; const offsetY = (canvasHeight - scaledA3Height) / 2; ctx.strokeStyle = '#cccccc'; ctx.lineWidth = 1; ctx.strokeRect(offsetX, offsetY, scaledA3Width, scaledA3Height); ctx.strokeStyle = '#007BFF'; ctx.lineWidth = 1; const scaledPieceWidth = pieceLebarCm * effectiveScale; const scaledPieceHeight = pieceTinggiCm * effectiveScale; for (let i = 0; i < cols; i++) { for (let j = 0; j < rows; j++) { const x = offsetX + i * scaledPieceWidth; const y = offsetY + j * scaledPieceHeight; if (x + scaledPieceWidth <= offsetX + scaledA3Width + 0.1 && y + scaledPieceHeight <= offsetY + scaledA3Height + 0.1) { ctx.strokeRect(x, y, scaledPieceWidth, scaledPieceHeight); } } } }

function hitungHppOtomatis() {
    // *** DIMENSI DIPERBARUI ***
    const a3PanjangStdCm = 47.6; const a3LebarStdCm = 32.0; // Sesuai catatan baru
    const a3PanjangCutCm = 46.0; const a3LebarCutCm = 30.5; // Sesuai permintaan baru
    
    const jumlahLembarOrder = parseInt(el.jumlahLembarOrder?.value || '1', 10) || 1;
    const lebarInput = parseFloat(el.lebarKertas?.value); const tinggiInput = parseFloat(el.tinggiKertas?.value);
    const selectedOption = el.modalKertas?.options[el.modalKertas.selectedIndex]; const baseModalMaterial = parseFloat(selectedOption?.value || '0'); const isSticker = selectedOption?.dataset.isSticker === 'true';
    const isBolakBalikChecked = el.bolakBalik?.checked && !isSticker; const isCuttingChecked = el.cuttingSticker?.checked && isSticker; const isOngkirChecked = el.ongkir?.checked;
    const { jumlahMuat, modalSatuan, modalPerA3, modalTotalOrder, areaCetakInfo, infoSketsa, layoutCanvas, bolakBalikOption } = el;
    if (bolakBalikOption) { bolakBalikOption.style.display = isSticker ? 'none' : 'flex'; } if(isSticker && el.bolakBalik) el.bolakBalik.checked = false;
    
    // *** Area Cetak Efektif Diperbarui ***
    const effectiveA3PanjangCm = isCuttingChecked ? a3PanjangCutCm : a3PanjangStdCm;
    const effectiveA3LebarCm = isCuttingChecked ? a3LebarCutCm : a3LebarStdCm;
    if (areaCetakInfo) { areaCetakInfo.innerHTML = `Area Cetak Efektif: <strong>${effectiveA3LebarCm} cm x ${effectiveA3PanjangCm} cm</strong>`; }
    
    if (!jumlahMuat || !modalSatuan || !modalPerA3 || !modalTotalOrder || !infoSketsa || !layoutCanvas || isNaN(lebarInput) || isNaN(tinggiInput) || lebarInput <= 0 || tinggiInput <= 0) {
        if (jumlahMuat) jumlahMuat.textContent = "0"; if (modalSatuan) modalSatuan.textContent = "Rp 0"; if (modalPerA3) modalPerA3.textContent = "Rp 0"; if (modalTotalOrder) modalTotalOrder.textContent = "Rp 0"; if (infoSketsa) infoSketsa.textContent = "Masukkan ukuran valid."; if (layoutCanvas) layoutCanvas.getContext('2d').clearRect(0, 0, layoutCanvas.width, layoutCanvas.height); return;
    }
    const cols1 = Math.floor(effectiveA3PanjangCm / lebarInput); const rows1 = Math.floor(effectiveA3LebarCm / tinggiInput); const jumlah1 = cols1 * rows1; const cols2 = Math.floor(effectiveA3PanjangCm / tinggiInput); const rows2 = Math.floor(effectiveA3LebarCm / lebarInput); const jumlah2 = cols2 * rows2; const jumlahMax = Math.max(jumlah1, jumlah2); jumlahMuat.textContent = jumlahMax;
    if (jumlahMax > 0) { if (jumlah1 >= jumlah2) { infoSketsa.textContent = `Orientasi Terbaik: ${cols1} x ${rows1} (${lebarInput}x${tinggiInput} cm)`; gambarLayout(layoutCanvas, effectiveA3PanjangCm, effectiveA3LebarCm, lebarInput, tinggiInput, cols1, rows1); } else { infoSketsa.textContent = `Orientasi Terbaik: ${cols2} x ${rows2} (diputar ${tinggiInput}x${lebarInput} cm)`; gambarLayout(layoutCanvas, effectiveA3PanjangCm, effectiveA3LebarCm, tinggiInput, lebarInput, cols2, rows2); } } else { infoSketsa.textContent = "Ukuran potongan terlalu besar."; layoutCanvas.getContext('2d').clearRect(0, 0, layoutCanvas.width, layoutCanvas.height); }
    let baseModal = baseModalMaterial; if (isBolakBalikChecked) { baseModal += 1300; } let cuttingCostPerSheet = 0; if (isCuttingChecked) { if (jumlahLembarOrder < 10) cuttingCostPerSheet = 4000; else if (jumlahLembarOrder < 100) cuttingCostPerSheet = 3000; else cuttingCostPerSheet = 2000; }
    const totalModalPerA3 = baseModal + cuttingCostPerSheet; const modalPerPotong = (jumlahMax > 0) ? totalModalPerA3 / jumlahMax : 0; const ongkirCostTotalOrder = isOngkirChecked ? ONGKIR_COST : 0; const modalTotalOrderCalc = (totalModalPerA3 * jumlahLembarOrder) + ongkirCostTotalOrder;
    modalPerA3.textContent = formatRupiahHpp(Math.ceil(totalModalPerA3)); modalSatuan.textContent = formatRupiahHpp(Math.ceil(modalPerPotong)); modalTotalOrder.textContent = formatRupiahHpp(Math.ceil(modalTotalOrderCalc));
}
// ===================================================================
// ===== SCRIPT KALKULATOR KINGSTRUK ===============================
// ===================================================================
function populateKingstrukBahan() { /* ... (fungsi sama) ... */ if (!el.ksBahan) return; el.ksBahan.innerHTML = ''; for (const gsm in KINGSTRUK_DATA) { const option = document.createElement('option'); option.value = gsm; option.textContent = KINGSTRUK_DATA[gsm].name; el.ksBahan.appendChild(option); } }
function hitungMuatPlano(planoP, planoL, pieceP, pieceL) { /* ... (fungsi sama) ... */ if (!planoP || !planoL || !pieceP || !pieceL || pieceP <= 0 || pieceL <= 0) return { muat: 0, cols: 0, rows: 0, rotated: false }; const cols1 = Math.floor(planoP / pieceP); const rows1 = Math.floor(planoL / pieceL); const muat1 = cols1 * rows1; const cols2 = Math.floor(planoP / pieceL); const rows2 = Math.floor(planoL / pieceP); const muat2 = cols2 * rows2; if (muat1 >= muat2) { return { muat: muat1, cols: cols1, rows: rows1, rotated: false, pieceUsedP: pieceP, pieceUsedL: pieceL }; } else { return { muat: muat2, cols: cols2, rows: rows2, rotated: true, pieceUsedP: pieceL, pieceUsedL: pieceP }; } }
function gambarLayoutPlano(canvasEl, planoP, planoL, pieceP, pieceL, cols, rows) { /* ... (fungsi sama) ... */ if (!canvasEl) return; const ctx = canvasEl.getContext('2d'); const canvasWidth = canvasEl.width; const canvasHeight = canvasEl.height; const scaleX = canvasWidth / planoP; const scaleY = canvasHeight / planoL; const effectiveScale = Math.min(scaleX, scaleY); ctx.clearRect(0, 0, canvasWidth, canvasHeight); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvasWidth, canvasHeight); const scaledPlanoWidth = planoP * effectiveScale; const scaledPlanoHeight = planoL * effectiveScale; const offsetX = (canvasWidth - scaledPlanoWidth) / 2; const offsetY = (canvasHeight - scaledPlanoHeight) / 2; ctx.strokeStyle = '#cccccc'; ctx.lineWidth = 1; ctx.strokeRect(offsetX, offsetY, scaledPlanoWidth, scaledPlanoHeight); ctx.strokeStyle = '#007BFF'; ctx.lineWidth = 1; const scaledPieceWidth = pieceP * effectiveScale; const scaledPieceHeight = pieceL * effectiveScale; for (let i = 0; i < cols; i++) { for (let j = 0; j < rows; j++) { const x = offsetX + i * scaledPieceWidth; const y = offsetY + j * scaledPieceHeight; if (x + scaledPieceWidth <= offsetX + scaledPlanoWidth + 0.1 && y + scaledPieceHeight <= offsetY + scaledPlanoHeight + 0.1) { ctx.strokeRect(x, y, scaledPieceWidth, scaledPieceHeight); } } } }

function hitungModalKingstruk() { /* ... (logic sama) ... */
    const selectedGsm = el.ksBahan?.value; const pieceP = parseFloat(el.ksPanjangPotong?.value); const pieceL = parseFloat(el.ksLebarPotong?.value); const jumlahButuh = parseInt(el.ksJumlahButuh?.value || '1', 10) || 1; const biayaTambahan = parseIDR(el.ksBiayaTambahan?.value || '0');
    const data = KINGSTRUK_DATA[selectedGsm]; const { ksMuatPlano1, ksHargaPotong1, ksJumlahPlano1, ksTotalModalAkhir1, ksCanvas1, ksPlano1Title, ksMuatPlano2, ksHargaPotong2, ksJumlahPlano2, ksTotalModalAkhir2, ksCanvas2, ksPlano2Title } = el;
    if (!data || !ksMuatPlano1 || !ksHargaPotong1 || !ksJumlahPlano1 || !ksTotalModalAkhir1 || !ksCanvas1 || !ksMuatPlano2 || !ksHargaPotong2 || !ksJumlahPlano2 || !ksTotalModalAkhir2 || !ksCanvas2 || isNaN(pieceP) || isNaN(pieceL) || pieceP <= 0 || pieceL <= 0) {
        [ksMuatPlano1, ksJumlahPlano1, ksMuatPlano2, ksJumlahPlano2].forEach(elem => elem ? elem.textContent = '0' : null); [ksHargaPotong1, ksTotalModalAkhir1, ksHargaPotong2, ksTotalModalAkhir2].forEach(elem => elem ? elem.textContent = 'Rp 0' : null); if (ksCanvas1) ksCanvas1.getContext('2d').clearRect(0, 0, ksCanvas1.width, ksCanvas1.height); if (ksCanvas2) ksCanvas2.getContext('2d').clearRect(0, 0, ksCanvas2.width, ksCanvas2.height); if (el.ksUkuranPlanoInfo) el.ksUkuranPlanoInfo.textContent = 'Ukuran Plano: -'; if (ksPlano1Title) ksPlano1Title.textContent = 'Plano 1'; if (ksPlano2Title) ksPlano2Title.textContent = 'Plano 2'; return;
    }
     if (el.ksUkuranPlanoInfo) el.ksUkuranPlanoInfo.textContent = `Pilihan Ukuran: ${data.plano1.l}x${data.plano1.p} cm & ${data.plano2.l}x${data.plano2.p} cm`; if (ksPlano1Title) ksPlano1Title.textContent = `Plano ${data.plano1.l} x ${data.plano1.p} cm`; if (ksPlano2Title) ksPlano2Title.textContent = `Plano ${data.plano2.l} x ${data.plano2.p} cm`;
    const plano1 = data.plano1; const result1 = hitungMuatPlano(plano1.p, plano1.l, pieceP, pieceL); const muat1 = result1.muat; const hargaPotong1 = (muat1 > 0) ? plano1.harga / muat1 : 0; const jumlahPlano1 = (muat1 > 0) ? Math.ceil(jumlahButuh / muat1) : 0; const totalModalBahan1 = jumlahPlano1 * plano1.harga; const totalModalAkhir1 = totalModalBahan1 + biayaTambahan;
    ksMuatPlano1.textContent = muat1; ksHargaPotong1.textContent = formatRupiahHpp(Math.ceil(hargaPotong1)); ksJumlahPlano1.textContent = jumlahPlano1; ksTotalModalAkhir1.textContent = formatRupiahHpp(Math.ceil(totalModalAkhir1)); gambarLayoutPlano(ksCanvas1, plano1.p, plano1.l, result1.pieceUsedP, result1.pieceUsedL, result1.cols, result1.rows);
    const plano2 = data.plano2; const result2 = hitungMuatPlano(plano2.p, plano2.l, pieceP, pieceL); const muat2 = result2.muat; const hargaPotong2 = (muat2 > 0) ? plano2.harga / muat2 : 0; const jumlahPlano2 = (muat2 > 0) ? Math.ceil(jumlahButuh / muat2) : 0; const totalModalBahan2 = jumlahPlano2 * plano2.harga; const totalModalAkhir2 = totalModalBahan2 + biayaTambahan;
    ksMuatPlano2.textContent = muat2; ksHargaPotong2.textContent = formatRupiahHpp(Math.ceil(hargaPotong2)); ksJumlahPlano2.textContent = jumlahPlano2; ksTotalModalAkhir2.textContent = formatRupiahHpp(Math.ceil(totalModalAkhir2)); gambarLayoutPlano(ksCanvas2, plano2.p, plano2.l, result2.pieceUsedP, result2.pieceUsedL, result2.cols, result2.rows);
}
// ===================================================================
// ===== AKHIR SCRIPT KINGSTRUK ======================================
// ===================================================================

// --- Final Initialization ---
console.log('Attaching final listeners...');
// HPP listeners
['lebarKertas', 'tinggiKertas', 'modalKertas', 'bolakBalik', 'cuttingSticker', 'ongkir', 'jumlahLembarOrder'].forEach(id => { if (el[id]) { el[id].addEventListener('input', hitungHppOtomatis); el[id].addEventListener('change', hitungHppOtomatis); } });
// Kingstruk listeners
['ksBahan', 'ksPanjangPotong', 'ksLebarPotong', 'ksJumlahButuh', 'ksBiayaTambahan'].forEach(id => { if (el[id]) { el[id].addEventListener('input', hitungModalKingstruk); el[id].addEventListener('change', hitungModalKingstruk); } });
if(el.ksBiayaTambahan) addDotFormatting(el.ksBiayaTambahan, hitungModalKingstruk);

// Panggil fungsi inisialisasi di dalam try...catch
try {
    const canvasHpp = el.layoutCanvas; if (canvasHpp) { const ratio = 32.0 / 47.6; /* Ratio Diperbarui */ const containerWidth = canvasHpp.parentElement.clientWidth * 0.9; canvasHpp.width = containerWidth; canvasHpp.height = containerWidth * ratio; }
    hitungHppOtomatis();

    populateKingstrukBahan();
    const canvasKs1 = el.ksCanvas1; if (canvasKs1) { const ratio = 65 / 100; const containerWidth = canvasKs1.parentElement.clientWidth * 0.95; canvasKs1.width = containerWidth; canvasKs1.height = containerWidth * ratio; }
    const canvasKs2 = el.ksCanvas2; if (canvasKs2) { const ratio = 79 / 109; const containerWidth = canvasKs2.parentElement.clientWidth * 0.95; canvasKs2.width = containerWidth; canvasKs2.height = containerWidth * ratio; }
    hitungModalKingstruk();

    updateWitaTime();
    if (el.txHarga) setPrice(+el.txHarga.value || 0); else setPrice(0);
    updateAutoHarga(); updatePaymentStatus(); refreshPcTotal();
    console.log('Calling initShift...'); initShift(); updateButtonsState();

} catch(initErr) {
     console.error("Error during final initialization:", initErr);
     alert("Error saat inisialisasi akhir: " + initErr.message);
}


console.log('Script init complete.');
  } catch (err) { // Error handling utama
    console.error("Fatal Error during script initialization:", err);
    document.body.innerHTML = `<div style="padding:20px;color:red;font-family:sans-serif;"><h1>Error Aplikasi</h1><p>Gagal memuat aplikasi. Cek console (F12) untuk detail.</p><p>Error: ${err.message}</p><pre>${err.stack}</pre></div>`;
    alert("Fatal Error: " + err.message + "\nCek console (F12) untuk detail.");
  }
});
// --- JAVASCRIPT LENGKAP SELESAI ---