// --- JAVASCRIPT LENGKAP DIMULAI ---
document.addEventListener('DOMContentLoaded', () => { console.log('DOM Ready. Initializing script...'); try { console.log('Setting up constants and variables...'); const CASHIER_KEY = 'P21_ANGEL', CASHIER_NAME = 'Angel'; const WEB_APP_URL = 'http://localhost:3000/api'; let subActive = false; const OPEN_KEY = `p21_shift_open_date_${CASHIER_KEY}`; const STEP = 1000;
const UNIT_MAP = {'A4 Standar':'Lembar','A4 PPT 2 Slide':'Slide','A4 Bolak-Balik':'Halaman','A3 Standar':'Lembar','F4 Standar':'Lembar','A4 Full Color':'Lembar','F4 Full Color':'Lembar','Pas Foto':'Pcs','Map Bening':'Pcs','Jarak Ongkir Maxim':'Ribu Rupiah','Jilid Lakban':'Pcs','Ong. Lipat Leaflet':'Lembar','Jilid Antero Biasa':'Pcs','Antero Laminating':'Lembar','ATK Campur x Rp':'Pcs','Penjepit Kecil':'Pcs','Penjepit Sedang':'Pcs','Leaflet 1 Sisi':'Lembar','Leaflet 2 Sisi':'Lembar'};
const salaryRates = { "Lev 1": 4000, "Lev 2": 6000, "Lev 3": 8500, "Lev 4": 12000 }; let shiftStartTime = null; let shiftStartTimeString = "--:--:--"; const LS_ADMIN_LEVEL_KEY = `p21_admin_level_${CASHIER_KEY}`; let salaryInterval = null; let timeInterval = null;
const HARI_NAMA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const WAKTU_MAP = {'1': 'Pagi', '2': 'Siang', '3': 'Sore', '4': 'Malam'};
console.log('Utility functions defined...'); const $=(q,r=document)=>r.querySelector(q); const parseIDR=s=>{s=String(s||'').toLowerCase().trim();if(!s)return 0;if(s.endsWith('k'))s=String(parseFloat(s)*1000);return Number(s.replace(/[^0-9\-]/g,'')||0)}; const IDR=n=>'Rp '+new Intl.NumberFormat('id-ID').format(Math.max(0,Math.round(n||0))); const fmtDots = n => new Intl.NumberFormat('id-ID').format(Math.max(0,Math.round(n||0))); const now=()=>new Date(); const fmt={ymd:(d=now())=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10),hms:(d=now())=>`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`,hmsS:(d=now())=>`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`}; function witaDateTime(d=new Date()){const parts=new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Makassar',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(d);const pick=t=>parts.find(p=>p.type===t)?.value||'';return{tanggal:`${pick('year')}-${pick('month')}-${pick('day')}`,jam:`${pick('hour')}:${pick('minute')}:${pick('second')}`}} const toast=m=>{const t=$('#toast'); if(t){t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',1600)}}; const roundUp1000=n=>n>0?Math.ceil(n/1000)*1000:0; const KEY_TX_COUNTER=`p21_tx_counter_${CASHIER_KEY}`, KEY_TX_DATE=`p21_tx_date_${CASHIER_KEY}`; const nextTxNumber=()=>{ const d=fmt.ymd(); const last=localStorage.getItem(KEY_TX_DATE); let n=0; if(last===d) n=parseInt(localStorage.getItem(KEY_TX_COUNTER)||'0',10); n++; localStorage.setItem(KEY_TX_COUNTER,String(n)); localStorage.setItem(KEY_TX_DATE,d); return String(n).padStart(5,'0'); }; function buildShiftPayloadCompat(st, level){ const shift_id = `${st.date}-${st.idx || 1}`; return { date: st.date, jam_mulai: st.start_at, jam_tutup: st.end_at, cashier: CASHIER_NAME, levelAdmin: level }; }
const getTomorrowDMY = () => { const t = new Date(); t.setDate(t.getDate() + 1); const d = String(t.getDate()).padStart(2, '0'); const m = String(t.getMonth() + 1).padStart(2, '0'); const y = String(t.getFullYear()).slice(-2); return `${d}-${m}-${y}`; };
console.log('Utility functions defined.'); console.log('Getting element references...'); const el={}; const elementIds = [ 'btnStart', 'btnClose', 'btnReset', 'debugAdmin', 'debugAdminLevel', 'debugSalaryRate', 'debugShiftStatus', 'debugShiftStart', 'debugTotalSalaryModule', 'debugTotalSalary', 'debugQueueKasir', 'debugQueuePending', 'kSaldoAwal', 'kCash', 'kCashN', 'kQris', 'kQrisN', 'kOmzet', 'kOmzetN', 'kExp', 'kLaci', 'kReal', 'kSelisih', 'kSelisihTag', 'btnPrintReport', 'expNote', 'expAmount', 'expSend', 'txNama', 'txBarang', 'txHarga', 'pricePill', 'addCash', 'addQris', 'queueBody', 'txTable', 'txBody', 'colRightCalc', 'pcSub', 'pcQty', 'pcCopy', 'pcType', 'autoHarga', 'pcAddRow', 'manualQty', 'manualCopy', 'manualName', 'manualUnitPrice', 'manualAdd', 'receipt', 'pcTuan', 'pcNoHP', 'pcTanggal', 'pcPukul', 'pcBody', 'subNote', 'pcPaymentStatus', 'pcCatatan', 'paidStamp', 'adminName', 'chkLunas', 'pcTotal', 'pcPanjar', 'pcSisa', 'pcSave', 'pcQueueOrder', 'pcClear', 'pendingOrderList', 'pendingOrderPlaceholder', 'orderList', 'orderPlaceholder', 'fullReport', 'toast', 'colLeftGroup', 'colRightGroup', 'colMidSummary', 'colMidInput', 'colMidQueue', 'colMidReport', 'colRightPendingOrders', 'colRightOrders',
'imageFileInput', 'uploadedImageDisplay', 'uploadPlaceholder', 'clearImageButton',
// **** PERUBAHAN 2 DARI 3: Menambahkan ID elemen modal baru ****
'pendingOrderModal', 'pendingModalWaktu', 'pendingModalTanggal', 'pendingModalBatal', 'pendingModalSimpan'
]; let missingElement = false; elementIds.forEach(id => { el[id] = $(`#${id}`); if (!el[id]) { console.error(`ERROR: Element #${id} not found!`); missingElement = true; } }); if (missingElement) throw new Error("Missing critical HTML elements."); console.log('Element references obtained.'); const adminSpan=$('#adminName');if(adminSpan)adminSpan.textContent=CASHIER_NAME; if (el.debugAdmin) el.debugAdmin.textContent = CASHIER_NAME; console.log('Defining core functions...'); let txReady = false; updateButtonsState = () => { const nameVal = el.txNama?.value?.trim() || ''; const priceVal = parseIDR(el.txHarga?.value); txReady = nameVal.length > 0 && priceVal > 0 && isShiftActive(); if (el.addCash) el.addCash.disabled = !txReady; if (el.addQris) el.addQris.disabled = !txReady; }; const setPrice = v => { if (v < 0) v = 0; if (el.txHarga) el.txHarga.value = v; if (el.pricePill) el.pricePill.textContent = IDR(v); updateButtonsState(); }; const addPrice = d => { let v = parseIDR(el.txHarga?.value) + d; setPrice(v); }; const apiAddTx = async (payload) => { console.log('Sending TX:', payload); try { const response = await fetch(WEB_APP_URL, { method: 'POST',  redirect: 'follow', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'addTransaction', data: payload }) }); console.log('TX Sent (no-cors). Assuming success.'); toast('Transaksi terkirim'); return { ok: true }; /* Note: no-cors prevents reading response */ } catch (e) { console.error('API TX Error:', e); toast('Gagal kirim transaksi! Cek koneksi/log.'); return { ok: false, error: e.message }; } }; const apiAddExpense = async (payload) => { console.log('Sending Expense:', payload); try { const response = await fetch(WEB_APP_URL, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'addExpense', data: payload }) }); console.log('Expense Sent (no-cors). Assuming success.'); toast('Pengeluaran terkirim'); return { ok: true }; } catch (e) { console.error('API Expense Error:', e); toast('Gagal kirim pengeluaran! Cek koneksi/log.'); return { ok: false, error: e.message }; } };
async function saveCalcToSheet(janjiSelesai = null){ const { tanggal, jam } = witaDateTime(); const panjarValue = parseIDR(el.pcPanjar?.value) || 0; const isLunas = el.chkLunas?.checked; let statusBayar = 'BELUM BAYAR'; if (isLunas) { statusBayar = 'SUDAH LUNAS'; } else if (panjarValue > 0) { statusBayar = 'SUDAH PANJAR'; }
const payload = { timestamp: `${tanggal} ${jam}`, tx_id: `INV-${CASHIER_KEY}-${nextTxNumber()}`, nama_tx: el.pcTuan?.value || 'Pelanggan', admin: CASHIER_NAME, ket: el.pcCatatan?.value || '-', harga: parseIDR(el.pcTotal?.value), metode: statusBayar, panjar: panjarValue, sisa: parseIDR(el.pcSisa?.value) || 0, no_hp: el.pcNoHP?.value || '-',
janji_selesai: janjiSelesai || '',
items: [] };
el.pcBody.querySelectorAll('tr').forEach(row => {
    payload.items.push({
      rangkap: row.dataset.copy || '1',
      qty: row.dataset.qty || '1',
      jenis: row.cells[2]?.textContent || 'N/A',
      harga_satuan: row.cells[3]?.textContent || '0', // Raw text might be 'Rp 319'
      jumlah: row.cells[4]?.textContent || '0' // Raw text might be 'Rp 15.963'
    });
});
console.log('Saving Calc:', payload); try { const response = await fetch(WEB_APP_URL, { method: 'POST',  redirect: 'follow', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'addOrder', data: payload }) }); console.log('Order Sent (no-cors). Assuming success.'); toast('Orderan disimpan'); if (el.orderList && el.orderPlaceholder) { el.orderPlaceholder.style.display = 'none'; el.orderList.insertAdjacentHTML('beforeend', `<li>${jam} - <b>${payload.nama_tx}</b> (${IDR(payload.harga)}) - ${payload.metode}</li>`); } return { ok: true }; } catch (e) { console.error('API Order Error:', e); toast('Gagal simpan orderan! Cek koneksi/log.'); return { ok: false, error: e.message }; } } const shiftKeyFor=d=>`p21_shift_state_${d}_${CASHIER_KEY}`; const readState=d=>{ try { const data = localStorage.getItem(shiftKeyFor(d)); return data ? JSON.parse(data) : null; } catch(e) { console.error("Parse state error", d, e); return null; } }; const writeState=(d,o)=>localStorage.setItem(shiftKeyFor(d),JSON.stringify(o||null)); const clearOpen=()=>localStorage.removeItem(OPEN_KEY); function isShiftActive() { return localStorage.getItem(OPEN_KEY) !== null; } function updateQueueDebug() { if (el.debugQueueKasir && el.queueBody) { const count = el.queueBody.children.length; el.debugQueueKasir.textContent = `${count} Item`; } if (el.debugQueuePending && el.pendingOrderList) { const count = el.pendingOrderList.querySelectorAll('li:not(#pendingOrderPlaceholder)').length; el.debugQueuePending.textContent = `${count} Item`; if (el.pendingOrderPlaceholder) { el.pendingOrderPlaceholder.style.display = (count === 0) ? 'block' : 'none'; } } } function updateSalaryDisplay(level) { const rate = salaryRates[level] || 0; if (el.debugSalaryRate) el.debugSalaryRate.textContent = `${IDR(rate)}/jam`; localStorage.setItem(LS_ADMIN_LEVEL_KEY, level); if (isShiftActive()) { if (el.debugTotalSalaryModule) el.debugTotalSalaryModule.style.display = 'flex'; if (shiftStartTime) { const hours = (now().getTime() - shiftStartTime.getTime()) / 3600000; const totalSalary = hours * rate; if (el.debugTotalSalary) el.debugTotalSalary.textContent = IDR(totalSalary); } } else { if (el.debugTotalSalaryModule) el.debugTotalSalaryModule.style.display = 'none'; if (el.debugTotalSalary) el.debugTotalSalary.textContent = IDR(0); } } function setTransaksiEnabled(enable){ console.log('Set Tx Enabled:', enable); el.txNama.disabled = !enable; el.txBarang.disabled = !enable; el.expNote.disabled = !enable; el.expAmount.disabled = !enable; el.expSend.disabled = !enable; updateButtonsState(); } function applyStarted(st){ console.log('Apply STARTED:', st); const level = el.debugAdminLevel.value; const rate = salaryRates[level] || 0; el.btnStart.disabled = true; el.btnClose.disabled = false; el.debugAdminLevel.disabled = true; setTransaksiEnabled(true); shiftStartTime = new Date(st.start_timestamp); shiftStartTimeString = fmt.hmsS(shiftStartTime); el.debugShiftStart.textContent = shiftStartTimeString; el.debugShiftStatus.innerHTML = '<span class="light green"></span> AKTIF'; if(el.debugTotalSalaryModule) el.debugTotalSalaryModule.style.display = 'flex'; if (salaryInterval) clearInterval(salaryInterval); if (timeInterval) clearInterval(timeInterval); const updateSal = () => { if (shiftStartTime) { const hours = (now().getTime() - shiftStartTime.getTime()) / 3600000; const totalSalary = hours * rate; if(el.debugTotalSalary) el.debugTotalSalary.textContent = IDR(totalSalary); }}; updateSal(); salaryInterval = setInterval(updateSal, 60000); } function applyClosed(st){ console.log('Apply CLOSED:', st); el.btnStart.disabled = false; el.btnStart.textContent = 'Mulai Shift Baru'; el.btnClose.disabled = true; el.debugAdminLevel.disabled = false; setTransaksiEnabled(false); shiftStartTime = null; shiftStartTimeString = "--:--:--"; el.debugShiftStart.textContent = shiftStartTimeString; el.debugShiftStatus.innerHTML = '<span class="light red"></span> SELESAI'; if(el.debugTotalSalaryModule) el.debugTotalSalaryModule.style.display = 'flex'; try { const start = new Date(st.start_timestamp); const end = new Date(st.end_timestamp); const level = st.level || el.debugAdminLevel.value; const rate = salaryRates[level] || 0; const hours = (end.getTime() - start.getTime()) / 3600000; const totalSalary = hours * rate; if(el.debugTotalSalary) el.debugTotalSalary.textContent = `${IDR(totalSalary)} (Final)`; } catch(e) { console.error("Final salary calc error", e); if(el.debugTotalSalary) el.debugTotalSalary.textContent = `Error`; } if (salaryInterval) clearInterval(salaryInterval); if (timeInterval) clearInterval(timeInterval); salaryInterval = null; timeInterval = null; if(el.btnPrintReport) el.btnPrintReport.style.display = 'block'; } function applyIdle(){ console.log('Apply IDLE'); el.btnStart.disabled = false; el.btnStart.textContent = 'Mulai berjualan'; el.btnClose.disabled = true; el.debugAdminLevel.disabled = false; setTransaksiEnabled(false); shiftStartTime = null; shiftStartTimeString = "--:--:--"; el.debugShiftStart.textContent = shiftStartTimeString; el.debugShiftStatus.innerHTML = '<span class="light red"></span> NONAKTIF'; if(el.debugTotalSalaryModule) el.debugTotalSalaryModule.style.display = 'none'; if(el.debugTotalSalary) el.debugTotalSalary.textContent = IDR(0); if (salaryInterval) clearInterval(salaryInterval); if (timeInterval) clearInterval(timeInterval); salaryInterval = null; timeInterval = null; if(el.btnPrintReport) el.btnPrintReport.style.display = 'none'; } function initShift(){ console.log('Initializing shift...'); const openDate = localStorage.getItem(OPEN_KEY); if (openDate) { const st = readState(openDate); if (st) { if (st.end_at) { console.warn('State CLOSED but OPEN_KEY exists.'); clearOpen(); applyClosed(st); } else { applyStarted(st); el.kSaldoAwal.value = fmtDots(st.saldo_awal || 0); el.kSaldoAwal.disabled = true; el.kExp.value = fmtDots(st.total_exp || 0); refreshKPI(); } } else { console.error('CRITICAL: OPEN_KEY exists but no state found for date:', openDate); clearOpen(); applyIdle(); } } else { const today = fmt.ymd(); const st = readState(today); if (st && st.end_at) { console.log('Shift today already CLOSED.'); applyClosed(st); el.kSaldoAwal.value = fmtDots(st.saldo_awal || 0); el.kExp.value = fmtDots(st.total_exp || 0); el.kReal.value = fmtDots(st.uang_real || 0); refreshKPI(st); } else { console.log('Shift today IDLE or not found.'); applyIdle(); } } if(el.debugAdminLevel) updateSalaryDisplay(el.debugAdminLevel.value); updateQueueDebug(); } function updateWitaTime() { const tuan = el.pcTuan?.value?.trim() || ''; if (tuan) { const { tanggal, jam } = witaDateTime(); const dateParts = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Makassar', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).formatToParts(now()); const pick = (parts, t) => parts.find(p => p.type === t)?.value || ''; if (el.pcTanggal) el.pcTanggal.textContent = `${pick(dateParts, 'weekday')}, ${pick(dateParts, 'day')} ${pick(dateParts, 'month')} ${pick(dateParts, 'year')}`; if (el.pcPukul) el.pcPukul.textContent = `${jam} WITA`; } else { if (el.pcTanggal) el.pcTanggal.textContent = ''; if (el.pcPukul) el.pcPukul.textContent = ''; } } const addTx = async (method, nama_tx, harga_tx, barang_tx = '', clearInputFields = false) => { if (!isShiftActive()) { toast('Shift belum dimulai!'); return; } const openDate = localStorage.getItem(OPEN_KEY); if (!openDate) { toast('Error: Shift date not found in local storage!'); return; } const st = readState(openDate); if (!st) { toast('Error: Shift state not found!'); return; } const { tanggal, jam } = witaDateTime(); const harga = parseIDR(harga_tx); if (!nama_tx || harga <= 0) { console.error("addTx invalid input:", {nama_tx, harga_tx}); toast("Error: Data antrian invalid (nama/harga)."); return; } let final_ket = barang_tx || '-'; const tuan_prefix = `[${nama_tx}] `; if (barang_tx && barang_tx.startsWith(tuan_prefix)) { final_ket = barang_tx.substring(tuan_prefix.length); } const payload = { timestamp: `${tanggal} ${jam}`, tx_id: `TX-${CASHIER_KEY}-${nextTxNumber()}`, nama_tx: nama_tx, admin: CASHIER_NAME, ket: final_ket, harga: harga, metode: method }; if (el.txBody) { el.txBody.insertAdjacentHTML('beforeend', `<tr><td>${payload.timestamp}</td><td>${payload.tx_id}</td><td>${payload.nama_tx}</td><td>${payload.admin}</td><td>${payload.ket}</td><td data-val="${payload.harga}">${IDR(payload.harga)}</td><td>${payload.metode}</td></tr>`); } st.transactions = st.transactions || []; st.transactions.push(payload); if (method === 'Cash') { st.total_cash = (st.total_cash || 0) + harga; st.n_cash = (st.n_cash || 0) + 1; } else if (method === 'QRIS') { st.total_qris = (st.total_qris || 0) + harga; st.n_qris = (st.n_qris || 0) + 1; } writeState(openDate, st); refreshKPI(st); apiAddTx(payload); if (clearInputFields) { if(el.txNama) el.txNama.value = ''; if(el.txBarang) el.txBarang.value = ''; setPrice(0); if(el.txNama) el.txNama.focus(); } toast(`+ ${method} ${IDR(harga)}`); }; function generateOrderSummary(tuan) { const items = []; el.pcBody.querySelectorAll('tr').forEach(row => { const rangkap = row.dataset.copy || '1';
    const qty = row.dataset.qty || '1';
    const unit = row.cells[1]?.dataset.unit||'pcs'; const jenis = row.cells[2]?.textContent||'N/A'; items.push(`${jenis} (${rangkap}x${qty} ${unit})`); }); const total = el.pcTotal?.value||'Rp 0'; return `[${tuan}] ${items.join(', ')} | Total: ${total}`; } function refreshKPI(state = null){ const openDate = localStorage.getItem(OPEN_KEY); const st = state || (openDate ? readState(openDate) : null); let saldoAwal = parseIDR(el.kSaldoAwal?.value); let totalExp = parseIDR(el.kExp?.value); let totalCash = 0, nCash = 0, totalQris = 0, nQris = 0; if (st) { saldoAwal = st.saldo_awal || 0; totalExp = st.total_exp || 0; totalCash = st.total_cash || 0; nCash = st.n_cash || 0; totalQris = st.total_qris || 0; nQris = st.n_qris || 0; if (!isShiftActive()) { if(el.kSaldoAwal) el.kSaldoAwal.value = fmtDots(saldoAwal); } if(el.kExp) el.kExp.value = fmtDots(totalExp); if (el.txBody) { el.txBody.innerHTML = ''; (st.transactions || []).forEach(payload => { el.txBody.insertAdjacentHTML('beforeend', `<tr><td>${payload.timestamp}</td><td>${payload.tx_id}</td><td>${payload.nama_tx}</td><td>${payload.admin}</td><td>${payload.ket}</td><td data-val="${payload.harga}">${IDR(payload.harga)}</td><td>${payload.metode}</td></tr>`); }); } } else if (!isShiftActive() && el.txBody) { // If closed or idle, recalculate from table if needed? No, should use final state.
    console.log("refreshKPI called when shift not active and no state provided. Using input values.");
} else if (isShiftActive() && !st){
    console.error("refreshKPI called when shift ACTIVE but no state found!"); return; // Avoid potential issues
} const omzet = totalCash + totalQris; const nOmzet = nCash + nQris; const laci = saldoAwal + totalCash - totalExp; const real = parseIDR(el.kReal?.value); const selisih = laci - real; if(el.kCash) el.kCash.textContent = IDR(totalCash); if(el.kCashN) el.kCashN.textContent = nCash + 'x'; if(el.kQris) el.kQris.textContent = IDR(totalQris); if(el.kQrisN) el.kQrisN.textContent = nQris + 'x'; if(el.kOmzet) el.kOmzet.textContent = IDR(omzet); if(el.kOmzetN) el.kOmzetN.textContent = nOmzet + 'x'; if(el.kLaci) el.kLaci.textContent = IDR(laci); if(el.kSelisih) el.kSelisih.textContent = IDR(Math.abs(selisih)); if (el.kSelisihTag) { if (selisih > 0) { el.kSelisihTag.textContent = 'Kurang'; el.kSelisih.style.color = 'var(--danger)'; } else if (selisih < 0) { el.kSelisihTag.textContent = 'Lebih'; el.kSelisih.style.color = 'var(--ok)'; } else { el.kSelisihTag.textContent = 'Pas'; el.kSelisih.style.color = 'inherit'; } } } function clearNota() {
    // **** PERUBAHAN 3 DARI 3: Nilai reset 'Lembar' diubah dari 50 menjadi 1 ****
    if(el.pcQty) el.pcQty.value = '1';
    if(el.pcCopy) el.pcCopy.value = '1'; if(el.pcType) el.pcType.value = 'A4 Standar'; if(el.manualQty) el.manualQty.value = '1'; if(el.manualCopy) el.manualCopy.value = '1'; if(el.manualName) el.manualName.value = ''; if(el.manualUnitPrice) el.manualUnitPrice.value = ''; if(el.pcTuan) el.pcTuan.value = ''; if(el.pcNoHP) el.pcNoHP.value = ''; if(el.pcCatatan) el.pcCatatan.value = ''; if(el.pcPanjar) el.pcPanjar.value = ''; if(el.pcBody) el.pcBody.innerHTML = ''; if(el.chkLunas) el.chkLunas.checked = false; const stamp = $('#paidStamp'); if (stamp) stamp.style.display = 'none'; updateAutoHarga(); refreshPcTotal(); updateWitaTime(); toast('Nota dibersihkan'); } function updateAutoHarga(){ const type = el.pcType?.value; const qty = parseInt(el.pcQty?.value||'0',10); const copy = parseInt(el.pcCopy?.value||'0',10); const totalLembar = qty*copy; let unitPrice = 0; let note = "Kalkulator Auto Diskon."; if (totalLembar > 0) { const rowTotal = getTotal(type, totalLembar); unitPrice = rowTotal / totalLembar; } if(type === 'A4 PPT 2 Slide') note = 'Harga per SLIDE.';
else if(type === 'A4 Bolak-Balik') note = 'Harga per Halaman (sisi cetak).'; else if(type === 'A3 Standar') note = 'A3 = 2x A4.'; else if(type === 'F4 Standar') note = 'F4 = A4 + Rp 15/lbr.'; else if(type === 'Jarak Ongkir Maxim') note = 'Qty = Jarak (km).'; else if(type === 'ATK Campur x Rp') note = 'Ganti Hrg Satuan.'; else if(type === 'Leaflet 1 Sisi' || type === 'Leaflet 2 Sisi') note = 'Hrg/lbr A4.'; if(el.autoHarga) el.autoHarga.value = subActive ? '0' : (Math.round(unitPrice) || 'Auto'); if(el.subNote) el.subNote.textContent = subActive ? 'Mode DISKON AKTIF.' : note; }
function buildReport(){ /* Not used */ return ''; }
function printReport(){ window.print(); }
function makeRow(copy,qty,label,rowTotal,totalLembar){ const unit = UNIT_MAP[el.pcType?.value]||'Pcs'; let unitPrice = totalLembar > 0 ? (rowTotal / totalLembar) : 0; if (subActive) unitPrice = 0;
    return `<tr data-copy="${copy}" data-qty="${qty}" data-total="${rowTotal}">
        <td class="qtyCell"><div class="qtyBox"><div class="qtyNum">${copy}</div><div class="qtyUnit">Rangkap</div></div></td>
        <td class="qtyCell" data-unit="${unit}"><div class="qtyBox"><div class="qtyNum">${qty}</div><div class="qtyUnit">${unit}</div></div></td>
        <td style="text-align:left;font-weight:700">${label}</td>
        <td style="text-align:right">${subActive ? 'Diskon' : IDR(unitPrice)}</td>
        <td style="text-align:right">${IDR(rowTotal)}</td>
        <td style="text-align:center"><button class="btn-del-row" style="background:transparent;border:none;color:red;font-size:18px;cursor:pointer">✕</button></td>
    </tr>`;
} function a4_unit_price(q){ if(!q||q<=0)return 0; const a=[[1,320.74],[50,319.25],[100,295],[200,290],[300,285],[500,280],[1000,275],[2000,260],[5000,250],[10000,230]]; if(q>=a.at(-1)[0])return a.at(-1)[1]; if(q<=a[0][0])return a[0][1]; for(let i=0;i<a.length-1;i++){ const[b,c]=a[i],[d,e]=a[i+1]; if(q>=b&&q<=d){ const f=(q-b)/(d-b); return c+f*(e-c)}} return a.at(-1)[1]}
const a4_total=q=>Math.round(q*a4_unit_price(q));
const a4bb_total=q=>a4_total(Math.ceil(q/2)); const f4_total=q=>Math.round(a4_total(q)+15*Math.max(0,q)); const a4c=q=>650*q,f4c=q=>665*q,ppt=q=>175*q; function pas(q){ if(!q||q<=0)return 0; if(q===1)return 3000; if(q===2)return 4000; if(q===3)return 5000; const a=1666,b=850,c=4,d=50; if(q>=d)return Math.round(q*b); let e; e=a+((q-c)/(d-c))*(b-a); return Math.round(q*e)} function mapBening(q){ if(q<=0)return 0; if(q<=4)return q*2000; if(q<=12){ const a=8000+(q-4)/8*(20000-8000); return Math.round(a)} const a=20000/12; if(q<=50){ const b=a+(q-12)/(50-12)*(1500-a); return Math.round(q*b)} return Math.round(q*1500)} const jarakOngkirMaxim=q=>q<=0?0:1000*q; function jilidLakban(q){ if(q<=0)return 0; const a=5000,b=3500,c=50; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} const ongLipatLeaflet=q=>q<=0?0:100*q; function jilidAnteroBiasa(q){return q<=0?0:8000*q} function anteroLaminating(q){return q<=0?0:12000*q} function atkCampur(q){return q<=0?0:1000*q} function penjepitKecil(q){ if(q<=0)return 0; const a=1000,b=700,c=30; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} function penjepitSedang(q){ if(q<=0)return 0; const a=2000,b=1000,c=50; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} function leaflet1Sisi(q){ if(q<=0)return 0; const a=333,b=285,c=1000; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} function leaflet2Sisi(q){ if(q<=0)return 0; const a=666,b=570,c=500; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)}
function getTotal(a,b){
  if(b<=0)return 0;
  if(subActive) return 0; // If discount mode, price is 0
  if(a==='A3 Standar')return a4_total(b)*2;
  if(a==='A4 Standar')return a4_total(b);
  if(a==='F4 Standar')return f4_total(b);
  if(a==='A4 Full Color')return a4c(b);
  if(a==='F4 Full Color')return f4c(b);
  if(a==='A4 PPT 2 Slide')return ppt(b);
  if(a==='A4 Bolak-Balik')return a4bb_total(b);
  if(a==='Pas Foto')return pas(b);
  if(a==='Map Bening')return mapBening(b);
  if(a==='Jarak Ongkir Maxim')return jarakOngkirMaxim(b);
  if(a==='Jilid Lakban')return jilidLakban(b);
  if(a==='Ong. Lipat Leaflet')return ongLipatLeaflet(b);
  if(a==='Jilid Antero Biasa')return jilidAnteroBiasa(b);
  if(a==='Antero Laminating')return anteroLaminating(b);
  if(a==='ATK Campur x Rp')return atkCampur(b); // Needs manual price entry
  if(a==='Penjepit Kecil')return penjepitKecil(b);
  if(a==='Penjepit Sedang')return penjepitSedang(b);
  if(a==='Leaflet 1 Sisi')return leaflet1Sisi(b);
  if(a==='Leaflet 2 Sisi')return leaflet2Sisi(b);
  console.warn("Unknown type for getTotal:", a); return 0
}
function updatePaymentStatus() { if (!el.pcPaymentStatus) return; const panjar = parseIDR(el.pcPanjar?.value); const isLunas = el.chkLunas?.checked; el.pcPaymentStatus.style.display = (panjar <= 0 && !isLunas) ? 'block' : 'none'; } function refreshPcTotal(){ let grandTotal = 0; if(el.pcBody) { el.pcBody.querySelectorAll('tr').forEach(row => { grandTotal += parseFloat(row.dataset.total || '0'); }); } const roundedTotal = roundUp1000(grandTotal); if(el.pcTotal) el.pcTotal.value = IDR(roundedTotal); const panjar = parseIDR(el.pcPanjar?.value); const sisa = roundedTotal - panjar; if(el.pcSisa) el.pcSisa.value = (panjar > 0 && sisa > 0) ? IDR(sisa) : ''; updatePaymentStatus(); } console.log('Core functions defined.'); console.log('Adding listeners...'); if(el.btnStart) el.btnStart.addEventListener('click',async()=>{ console.log('btnStart clicked'); const s=parseIDR(el.kSaldoAwal?.value); if(s<=0){toast('Saldo Awal harus lebih dari 0'); el.kSaldoAwal?.focus(); return;} if(!confirm(`Mulai shift dengan Saldo Awal ${fmtDots(s)}?`)) return; const {tanggal:t,jam:j}=witaDateTime(); const u={date:t,start_at:j,end_at:null,start_timestamp:now().toISOString(),end_timestamp:null,cashier:CASHIER_NAME,level:el.debugAdminLevel?.value || 'Lev 3',saldo_awal:s,total_cash:0,n_cash:0,total_qris:0,n_qris:0,total_exp:0,uang_real:0,selisih:0,transactions:[],expenses:[]}; localStorage.setItem(OPEN_KEY,t); writeState(t,u); applyStarted(u); if(el.kSaldoAwal) el.kSaldoAwal.disabled=true; refreshKPI(u); const v=buildShiftPayloadCompat(u,u.level); console.log('API StartShift Payload:',v); try{ await fetch(WEB_APP_URL,{method:'POST',mode:'no-cors',redirect:'follow',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'startShift',data:v})}); toast('Shift dimulai & tersimpan!');} catch(w){console.error('API StartShift Error:',w); toast('Shift dimulai (offline). Gagal kirim ke server.');} }); if(el.btnClose) el.btnClose.addEventListener('click',async()=>{ console.log('btnClose clicked'); if(!isShiftActive()){toast('Shift belum dimulai.'); return;} const o=localStorage.getItem(OPEN_KEY); if(!o){ toast('Error: Tanggal shift tidak ditemukan!'); return; } const p=readState(o); if(!p){toast('Error: State shift tidak ditemukan!'); return;} refreshKPI(p); const q=parseIDR(el.kReal?.value); if(q<=0){toast('Isi Uang Real sebelum menutup kas.'); el.kReal?.focus(); return;} const r=p.saldo_awal||0; const s=p.total_cash||0; const t=p.total_exp||0; const u=r+s-t; const v=u-q; if(!confirm(`Tutup Kas?\nSaldo Awal: ${IDR(r)}\nTotal Cash: ${IDR(s)}\nPengeluaran: ${IDR(t)}\nUang Laci Teoritis: ${IDR(u)}\nUang Real: ${IDR(q)}\nSelisih: ${IDR(v)}\n\nYakin tutup kas?`)) return; const {tanggal:w,jam:x}=witaDateTime(); p.end_at=x; p.end_timestamp=now().toISOString(); p.uang_real=q; p.selisih=v; writeState(o,p); clearOpen(); applyClosed(p); refreshKPI(p); const y=buildShiftPayloadCompat(p,p.level); console.log('API CloseShift Payload:',y); try{ await fetch(WEB_APP_URL,{method:'POST',mode:'no-cors',redirect:'follow',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'closeShift',data:y})}); toast('Shift ditutup & tersimpan!');} catch(z){console.error('API CloseShift Error:',z); toast('Shift ditutup (offline). Gagal kirim ke server.');} }); if(el.btnReset) el.btnReset.addEventListener('click',()=>{ if (confirm('YAKIN RESET SHIFT SAAT INI?\nSemua data transaksi dan ringkasan shift ini akan hilang.')) { const openDate = localStorage.getItem(OPEN_KEY); if(openDate) localStorage.removeItem(shiftKeyFor(openDate)); localStorage.removeItem(OPEN_KEY); // Clear open key too
localStorage.removeItem(LS_ADMIN_LEVEL_KEY); // Reset level
localStorage.removeItem(KEY_TX_COUNTER); // Reset TX counter
localStorage.removeItem(KEY_TX_DATE); // Reset TX date
toast('Shift direset. Muat ulang halaman.'); window.location.reload(); }}); if(el.debugAdminLevel) el.debugAdminLevel.addEventListener('change',(e)=>{updateSalaryDisplay(e.target.value);}); if(el.expSend) el.expSend.addEventListener('click',async()=>{ if(!isShiftActive()){toast('Shift belum dimulai!'); return;} const o=localStorage.getItem(OPEN_KEY); if(!o){ toast('Error: Tanggal shift tidak ditemukan!'); return; } const p=readState(o); if(!p){toast('Error: State shift tidak ditemukan!'); return;} const n=el.expNote?.value.trim(); const a=parseIDR(el.expAmount?.value); if(!n||a<=0){toast('Isi Keterangan & Jumlah pengeluaran.'); return;} const {tanggal:t,jam:j}=witaDateTime(); const q={timestamp:`${t} ${j}`,date:t,jam:j,cashier:CASHIER_NAME,keterangan:n,jumlah:a}; p.expenses=p.expenses||[]; p.expenses.push(q); p.total_exp=(p.total_exp||0)+a; writeState(o,p); refreshKPI(p); if(el.expNote) el.expNote.value=''; if(el.expAmount) el.expAmount.value=''; apiAddExpense(q); toast(`- Pengeluaran ${IDR(a)}`);}); if(el.pcTuan) el.pcTuan.addEventListener('input',()=>{updateButtonsState(); updateWitaTime();}); if(el.pricePill) el.pricePill.addEventListener('wheel',e=>{ if(el.txNama?.disabled) return; e.preventDefault(); const d=e.deltaY>0?-STEP:STEP; addPrice(d);},{passive:false}); if(el.pricePill) el.pricePill.addEventListener('dblclick',()=>{ if(el.txNama?.disabled) return; setPrice(0);}); if(el.txNama) el.txNama.addEventListener('input',updateButtonsState); if(el.addCash) el.addCash.addEventListener('click',()=>addTx('Cash',el.txNama?.value,el.txHarga?.value,el.txBarang?.value,true)); if(el.addQris) el.addQris.addEventListener('click',()=>addTx('QRIS',el.txNama?.value,el.txHarga?.value,el.txBarang?.value,true)); [el.kSaldoAwal, el.kExp, el.kReal].forEach(i=>{ if(i) { i.addEventListener('focus',e=>{const v=parseIDR(e.target.value); e.target.value=v>0?v:'';}); i.addEventListener('blur',e=>{const v=parseIDR(e.target.value); e.target.value=v>0?fmtDots(v):''; if(e.target.id==='kSaldoAwal'||e.target.id==='kExp'){ if(isShiftActive()&&e.target.id==='kSaldoAwal'){ const openDate = localStorage.getItem(OPEN_KEY); const currentState = openDate ? readState(openDate) : null; e.target.value=fmtDots(currentState?.saldo_awal||0); // Revert if shift active
 } refreshKPI();} else if(e.target.id==='kReal'){refreshKPI();}}); } }); if(el.kReal) el.kReal.addEventListener('keydown',e=>{ if(e.key==='Enter'){if(isShiftActive()){el.btnClose?.click();} else {printReport();}}}); if(el.btnPrintReport) el.btnPrintReport.addEventListener('click',printReport); if(el.pcQty) el.pcQty.addEventListener('input',updateAutoHarga); if(el.pcCopy) el.pcCopy.addEventListener('input',updateAutoHarga); if(el.pcType) el.pcType.addEventListener('change',updateAutoHarga); if(el.pcAddRow) el.pcAddRow.addEventListener('click',()=>{ const t=el.pcType?.value; const q=parseInt(el.pcQty?.value||'0',10); const c=parseInt(el.pcCopy?.value||'0',10); const l=q*c; if(l<=0){toast('Jumlah Lembar/Qty/Rangkap harus lebih dari 0'); return;} const o=getTotal(t,l); const a=`${t}`; if(el.pcBody) el.pcBody.insertAdjacentHTML('beforeend',makeRow(c,q,a,o,l)); refreshPcTotal(); }); if(el.manualAdd) el.manualAdd.addEventListener('click',()=>{ const n=el.manualName?.value.trim(); const q=parseInt(el.manualQty?.value||'0',10); const c=parseInt(el.manualCopy?.value||'0',10); const u=parseIDR(el.manualUnitPrice?.value); if(!n||q<=0||c<=0||u<=0){toast('Isi semua field manual (Nama, Qty, Rangkap, Harga Satuan > 0)'); return;} const l=q*c; const o=l*u; const a=`${n}`; const r=makeRow(c,q,a,o,l); if(el.pcBody) el.pcBody.insertAdjacentHTML('beforeend',r); refreshPcTotal(); if(el.manualName) el.manualName.value=''; if(el.manualQty) el.manualQty.value='1'; if(el.manualCopy) el.manualCopy.value='1'; if(el.manualUnitPrice) el.manualUnitPrice.value=''; }); if(el.pcBody) el.pcBody.addEventListener('click',e=>{ if(e.target.classList.contains('btn-del-row')){e.target.closest('tr')?.remove(); refreshPcTotal();} }); if(el.pcSub) el.pcSub.addEventListener('click',()=>{ subActive=!subActive; el.pcSub.setAttribute('aria-pressed',String(subActive)); el.pcSub.style.background=subActive?'var(--accent)':'#dc2626'; updateAutoHarga(); toast(subActive?'Mode Diskon AKTIF':'Mode Diskon NONAKTIF'); }); if(el.pcClear){ el.pcClear.addEventListener('click', clearNota) } if(el.pcSave){ el.pcSave.addEventListener('click', () => { const t=parseIDR(el.pcTotal?.value); const u=el.pcTuan?.value.trim()||'Pelanggan'; if(t<=0){toast('Total Rp 0. Tidak bisa ke antrian.'); return;} const s=generateOrderSummary(u); if(el.queueBody) el.queueBody.insertAdjacentHTML('beforeend', `<tr data-nama="${u}" data-total="${t}" data-summary="${s.replace(/"/g, '&quot;')}"><td>${s}</td><td>${IDR(t)}</td><td><button class="btn btn-green btn-q-cash">Cash</button><button class="btn btn-blue btn-q-qris">QRIS</button></td></tr>`); updateQueueDebug(); clearNota(); toast('Nota masuk antrian kasir'); }); }
// **** PERUBAHAN 3 DARI 3: Logika 'Tampung Order' diubah untuk memakai modal ****
if(el.pcQueueOrder){
  el.pcQueueOrder.addEventListener('click', () => {
    const t=parseIDR(el.pcTotal?.value);
    const u=el.pcTuan?.value.trim()||'Pelanggan';
    if(t<=0){toast('Total Rp 0. Tidak bisa ditampung.'); return;}

    // --- LOGIKA LAMA DENGAN PROMPT() DIHAPUS ---
    // const waktuInput = prompt(...)
    // const tanggalInput = prompt(...)

    // --- LOGIKA BARU UNTUK MODAL ---
    const s=generateOrderSummary(u);
    const p=parseIDR(el.pcPanjar?.value);
    const i=parseIDR(el.pcSisa?.value);
    const l=el.chkLunas?.checked;

    const d_temp={
        tuan:u,
        noHP:el.pcNoHP?.value || '-',
        catatan:el.pcCatatan?.value || '-',
        lunas:l,
        panjar:p,
        sisa:i,
        total:t,
        janjiSelesai: '', // Akan diisi oleh modal
        items:[]
    };
    if(el.pcBody) {
        el.pcBody.querySelectorAll('tr').forEach(r=>{
            d_temp.items.push({
                copy:r.dataset.copy || '1',
                qty:r.dataset.qty || '1',
                label:r.cells[2]?.textContent || 'N/A',
                total:r.dataset.total || '0',
                harga_satuan: r.cells[3]?.textContent || '0',
                jumlah: r.cells[4]?.textContent || '0'
            });
        });
    }

    // Simpan data sementara di modal dan tampilkan
    if (el.pendingOrderModal) {
      el.pendingOrderModal.dataset.notaData = JSON.stringify(d_temp);
      el.pendingOrderModal.dataset.summary = s;
    }
    if (el.pendingModalWaktu) el.pendingModalWaktu.value = '2'; // Default 'Siang'
    if (el.pendingModalTanggal) el.pendingModalTanggal.value = getTomorrowDMY();
    if (el.pendingOrderModal) el.pendingOrderModal.style.display = 'flex';
    if (el.pendingModalTanggal) el.pendingModalTanggal.focus();
  });
}

// Listener BARU untuk tombol Batal di modal
if(el.pendingModalBatal) {
    el.pendingModalBatal.addEventListener('click', () => {
        if (el.pendingOrderModal) el.pendingOrderModal.style.display = 'none';
        if (el.pendingOrderModal) el.pendingOrderModal.dataset.notaData = ''; // Bersihkan data
        if (el.pendingOrderModal) el.pendingOrderModal.dataset.summary = '';
    });
}

// Listener BARU untuk tombol Simpan di modal
if(el.pendingModalSimpan) {
    el.pendingModalSimpan.addEventListener('click', () => {
        // Ambil data dari input modal
        const waktuKey = el.pendingModalWaktu?.value || '2';
        const tanggalInput = el.pendingModalTanggal?.value?.trim();
        const waktuString = WAKTU_MAP[waktuKey] || 'Siang';

        // Validasi tanggal
        if (!tanggalInput || !/^\d{2}-\d{2}-\d{2}$/.test(tanggalInput)) {
            toast("Format tanggal salah. Gunakan DD-MM-YY (contoh: 23-10-25).");
            return;
        }

        // Parse tanggal (Logika ini dipindah dari event listener pcQueueOrder)
        let janjiSelesai = `${waktuString}, ${tanggalInput}`;
        let hariString = '';
        try {
            const parts = tanggalInput.split('-');
            if(parts.length === 3) {
                const d = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                const y = 2000 + parseInt(parts[2], 10); // Assume 20xx
                if(!isNaN(d) && !isNaN(m) && !isNaN(y)) {
                    const dateObj = new Date(y, m, d);
                    if (dateObj && dateObj.getDate() === d && dateObj.getMonth() === m && dateObj.getFullYear() === y) {
                        hariString = HARI_NAMA[dateObj.getDay()];
                        janjiSelesai = `${hariString} ${waktuString}, ${tanggalInput}`;
                    } else {
                        console.warn("Tanggal tidak valid setelah parsing:", tanggalInput);
                        toast("Tanggal yang dimasukkan tidak valid."); return;
                    }
                } else {
                     console.warn("Gagal parse komponen tanggal:", tanggalInput);
                     toast("Gagal memproses tanggal."); return;
                }
            } else {
                 console.warn("Format split tanggal salah:", tanggalInput);
                 toast("Format tanggal salah."); return;
            }
        } catch (e) {
            console.error("Error parsing tanggal janji selesai:", e);
            toast("Terjadi error saat proses tanggal."); return;
        }
        
        // Ambil data nota dari dataset modal
        const d = JSON.parse(el.pendingOrderModal.dataset.notaData || '{}');
        const s = el.pendingOrderModal.dataset.summary || '';
        
        if (!d.tuan) { // Cek jika data nota valid
            toast("Error: Data nota tidak ditemukan.");
            if (el.pendingOrderModal) el.pendingOrderModal.style.display = 'none';
            return;
        }

        // Tambahkan janjiSelesai ke objek data
        d.janjiSelesai = janjiSelesai;
        
        // Buat string status (Logika ini dipindah dari event listener pcQueueOrder)
        let st='BELUM BAYAR';
        let sc='var(--danger)';
        if(d.lunas){st='LUNAS'; sc='var(--ok)';}
        else if(d.panjar>0){st=`Panjar ${fmtDots(d.panjar)}`; sc='var(--warn)';}

        // Buat elemen <li> (Logika ini dipindah dari event listener pcQueueOrder)
        const li=document.createElement('li');
        li.innerHTML=`<div style="padding: 8px; border-bottom: 1px solid var(--line); display:flex; justify-content:space-between; align-items:center;">
            <div>
                <b>${d.tuan}</b> (${IDR(d.total)}) - <span style="color:${sc};">${st}</span><br>
                <small style="color:var(--accent); font-weight:bold;">Janji: ${d.janjiSelesai}</small><br>
                <small>${s}</small>
            </div>
            <div>
                <button class="btn btn-danger btn-pending-cancel" style="padding:4px 8px;font-size:11px;">Batal</button>
                <button class="btn btn-blue btn-pending-save" style="padding:4px 8px;font-size:11px;">Simpan</button>
            </div>
        </div>`;

        li.dataset.nota=JSON.stringify(d);
        if(el.pendingOrderList) el.pendingOrderList.appendChild(li);
        updateQueueDebug();
        
        // Selesai
        clearNota();
        toast('Orderan ditampung di antrian pending');
        if (el.pendingOrderModal) el.pendingOrderModal.style.display = 'none'; // Sembunyikan modal
        if (el.pendingOrderModal) el.pendingOrderModal.dataset.notaData = ''; // Bersihkan data
        if (el.pendingOrderModal) el.pendingOrderModal.dataset.summary = '';
    });
}
// **** AKHIR DARI PERUBAHAN LOGIKA 'TAMPUNG ORDER' ****

if(el.pendingOrderList) { el.pendingOrderList.addEventListener('click', async (e) => { const li = e.target.closest('li'); if (!li || !li.dataset.nota) return; const d = JSON.parse(li.dataset.nota); if (e.target.classList.contains('btn-pending-cancel')) { if (confirm(`Yakin batalkan orderan pending untuk ${d.tuan}?`)) { li.remove(); updateQueueDebug(); toast('Orderan pending dibatalkan'); } } else if (e.target.classList.contains('btn-pending-save')) { if (!confirm(`Simpan orderan ${d.tuan} (${IDR(d.total)}) ke Spreadsheet?\nJanji Selesai: ${d.janjiSelesai}`)) return; // Show confirmation with deadline
 // Clear current nota before loading
 clearNota(); 
 // Load data from pending item to nota form
 if(el.pcTuan) el.pcTuan.value=d.tuan; if(el.pcNoHP) el.pcNoHP.value=d.noHP; if(el.pcCatatan) el.pcCatatan.value=d.catatan; if(el.pcPanjar) el.pcPanjar.value=d.panjar>0?fmtDots(d.panjar):''; if(el.chkLunas) el.chkLunas.checked=d.lunas;
 if(el.pcBody && d.items) {
    d.items.forEach(i=>{
        const l=(parseInt(i.copy,10)||1)*(parseInt(i.qty,10)||1);
        const r=makeRow(i.copy,i.qty,i.label,parseIDR(i.total),l); // Use parsed total for accuracy
        el.pcBody.insertAdjacentHTML('beforeend',r);
    });
 }
 refreshPcTotal(); // Recalculate total based on loaded items
 updateWitaTime(); // Update date/time display
 const stamp = $('#paidStamp'); if (stamp && el.chkLunas) stamp.style.display = el.chkLunas.checked ? 'block' : 'none'; // Update LUNAS stamp

 // Send data to sheet
 const result=await saveCalcToSheet(d.janjiSelesai || null);
 if(result.ok){ // Only remove if successfully saved
    li.remove();
    updateQueueDebug();
    toast(`Orderan ${d.tuan} berhasil disimpan.`);
    clearNota(); // Clear nota again after successful save
 } else {
    toast(`GAGAL menyimpan orderan ${d.tuan}! Cek log/koneksi.`);
    // Keep the item in pending list if save fails
 }
} }); } if(el.queueBody) { el.queueBody.addEventListener('click', async (e) => { const r=e.target.closest('tr'); if (!r) return; const n=r.dataset.nama; const t=r.dataset.total; const s=r.dataset.summary; let m=''; if(e.target.classList.contains('btn-q-cash')){m='Cash';} else if(e.target.classList.contains('btn-q-qris')){m='QRIS';} if(m){ await addTx(m,n,t,s,false); r.remove(); updateQueueDebug();} }); } const chkLunasElem=$('#chkLunas'),paidStampElem=$('#paidStamp'); if(chkLunasElem&&paidStampElem){chkLunasElem.addEventListener('change',()=>{paidStampElem.style.display=chkLunasElem.checked?'block':'none'; updatePaymentStatus();})} (function enableLeaveGuard(){ window.onbeforeunload = (e) => { let itemsInQueue = el.queueBody?.children.length > 0; let itemsPending = el.pendingOrderList?.querySelectorAll('li:not(#pendingOrderPlaceholder)').length > 0; if(isShiftActive()){ const m="Shift masih AKTIF. Data mungkin hilang jika keluar sekarang. Yakin keluar?"; (e||window.event).returnValue = m; return m;} if (itemsInQueue || itemsPending){ const m="Masih ada item di Antrian Kasir atau Pending. Yakin keluar?"; (e||window.event).returnValue = m; return m;} }; })(); (function(){ const s=$('.splitter'); if (!s) return; const c=$('.container'); if (!c) return; let d=!1; s.addEventListener('mousedown',()=>{d=!0; document.body.style.cursor='col-resize'; document.body.style.userSelect='none';}); document.addEventListener('mouseup',()=>{d=!1; document.body.style.cursor='default'; document.body.style.userSelect='auto';}); document.addEventListener('mousemove',(e)=>{ if(!d) return; e.preventDefault(); const r=c.getBoundingClientRect(); const l=e.clientX-r.left; const w=r.right-e.clientX-s.offsetWidth; if (l>280&&w>320){c.style.setProperty('--col-left',`${l}px`); c.style.setProperty('--col-right',`${w}px`);}}); })(); console.log('Listeners added.'); function addDotFormatting(element, onBlurCallback = null) { if (!element) return; element.addEventListener('focus', (e) => { const val = parseIDR(e.target.value); e.target.value = val > 0 ? val : ''; }); element.addEventListener('blur', (e) => { const val = parseIDR(e.target.value); e.target.value = val > 0 ? fmtDots(val) : ''; if (onBlurCallback) onBlurCallback(); }); } addDotFormatting(el.expAmount); addDotFormatting(el.manualUnitPrice); addDotFormatting(el.pcPanjar, refreshPcTotal); console.log('Finalizing init...'); const savedLevel = localStorage.getItem(LS_ADMIN_LEVEL_KEY); const initialLevel = savedLevel || "Lev 3"; if (el.debugAdminLevel) { el.debugAdminLevel.value = initialLevel; } updateWitaTime(); if (el.txHarga) setPrice(+el.txHarga.value || 0); else setPrice(0); updateAutoHarga(); updatePaymentStatus(); console.log('Calling initShift...'); initShift();

    // --- Logika Gambar Nota ---
    const imageInput = $('#imageFileInput');
    const imageDisplay = $('#uploadedImageDisplay');
    const uploadPlaceholder = $('#uploadPlaceholder');
    const clearImageButton = $('#clearImageButton');
    const imageStorageKey = `p21_receipt_image_${CASHIER_KEY}`;

    function displayUploadedImage(base64Data) {
        if (base64Data && imageDisplay && uploadPlaceholder && clearImageButton) {
            imageDisplay.src = base64Data;
            imageDisplay.style.display = 'block';
            if(uploadPlaceholder) uploadPlaceholder.style.display = 'none';
            if(clearImageButton) clearImageButton.style.display = 'inline';
        } else if (imageDisplay && uploadPlaceholder && clearImageButton) {
            imageDisplay.src = '';
            imageDisplay.style.display = 'none';
           if(uploadPlaceholder) uploadPlaceholder.style.display = 'inline';
            if(clearImageButton) clearImageButton.style.display = 'none';
        }
    }

    const savedImage = localStorage.getItem(imageStorageKey);
    displayUploadedImage(savedImage);

    if (imageInput) {
        imageInput.addEventListener('change', (event) => {
            const file = event.target.files?.[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64Data = e.target?.result;
                    if(typeof base64Data === 'string'){
                       displayUploadedImage(base64Data);
                       localStorage.setItem(imageStorageKey, base64Data);
                       toast('Gambar nota disimpan di browser.');
                    } else {
                        toast('Gagal membaca data gambar.');
                    }
                }
                reader.onerror = () => {
                    toast('Gagal membaca file gambar.');
                    displayUploadedImage(null);
                    localStorage.removeItem(imageStorageKey);
                }
                reader.readAsDataURL(file);
            } else if (file) {
                toast('Format file tidak didukung. Pilih file gambar (JPG, PNG, GIF, dll).');
            }
            imageInput.value = ''; // Reset input file
        });
    }

    if (clearImageButton) {
        clearImageButton.addEventListener('click', () => {
            if (confirm('Hapus gambar nota yang tersimpan?')) {
                localStorage.removeItem(imageStorageKey);
                displayUploadedImage(null);
                toast('Gambar nota dihapus.');
            }
        });
    }
    // --- Akhir Logika Gambar Nota ---

  console.log('Script init complete.');
  } catch (err) { // Error handling for initialization
    console.error("Fatal Error during script initialization:", err);
    document.body.innerHTML = `<div style="padding:20px;color:red;font-family:sans-serif;"><h1>Error Aplikasi</h1><p>Gagal memuat aplikasi. Cek console (F12) untuk detail.</p><p>Error: ${err.message}</p><pre>${err.stack}</pre></div>`;
    alert("Fatal Error: " + err.message + "\nCek console (F12) untuk detail.");
  }
});
// --- JAVASCRIPT LENGKAP SELESAI ---