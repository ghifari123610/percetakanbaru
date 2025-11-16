// --- (PERUBAHAN BESAR) JAVASCRIPT LENGKAP DIMULAI (v2.8 Final Bonus Visible) ---
document.addEventListener('DOMContentLoaded', () => { 
  console.log('DOM Ready. Initializing script v2.8 (Final Bonus Visible)...'); 
  try { 
    console.log('Setting up constants and variables...');
    const CASHIER_KEY = 'P21_Angel', CASHIER_NAME = 'Angel';
    const TX_ID_PREFIX = 'Angel';
    
    // === (PERUBAHAN BESAR v2.4) URL WEB APP BARU ===
    const WEB_APP_URL = '/api';
    
    // === (PERUBAHAN BESAR v2.8) KONSTANTA BARU UNTUK BONUS GRUP (CENTANG) ===
    const BONUS_RATES = {
        Grup0: 0.0,   // 0%   (0 Centang)
        Grup0_S: 0.01, // 1%   (BONUS INPUT & barang grosir)
        Grup1: 0.025, // 2.5% (1 Centang)
        Grup2: 0.05,  // 5%   (2 Centang)
        Grup3: 0.075, // 7.5% (3 Centang)
        Grup4: 0.10   // 10%  (4 Centang)
    };
    // =================================================================

    const GAJI_POKOK_PER_JAM = 5000;
    let subActive = false; const OPEN_KEY = `p21_shift_open_date_${CASHIER_KEY}`; const STEP = 1000;
    const SATUAN_LIST = [ 'Botol', 'Dos', 'Dos Besar', 'Dos Kecil', 'Gulung', 'Halaman', 'Lembar', 'Lusin', 'Pak', 'Pcs', 'Ribu Rupiah', 'RIM', 'Set', 'File', 'Buku', 'Slide' ];
    
    // Unit map untuk Bagian 1 (Print/ATK)
    const UNIT_MAP_PRINT = {
        'A4 Standar':'File', 'A4 PPT 2 Slide':'Slide', 'A4 Bolak-Balik':'Halaman', 'A3 Standar':'File',
        'F4 Standar':'File', 'A4 Full Color':'File', 'F4 Full Color':'File', 'Pas Foto':'Pcs',
        'Map Bening':'Pcs', 'Jarak Ongkir Maxim':'Ribu Rupiah', 'Print Amplop':'Lembar', 'Jilid Lakban':'Pcs', 'Ong. Lipat Leaflet':'Lembar',
        'Jilid Antero Biasa':'Pcs', 'Antero Laminating':'Lembar', 'ATK Campur x Rp':'Pcs', 'Penjepit Kecil':'Pcs',
        'Penjepit Sedang':'Pcs', 'Leaflet 1 Sisi':'Lembar', 'Leaflet 2 Sisi':'Lembar'
    };
    // Unit map untuk Bagian 2 (Percetakan)
    const UNIT_MAP_PERCETAKAN = {
        'Stempel Kayu':'Pcs', 'Stempel Flash':'Pcs', 'Stempel Flash Expres':'Pcs', 'Papan Dada Peniti':'Pcs', 'Papan Dada Magnet':'Pcs',
        'Nota 1 Rangkap, Full F4':'Buku', 'Nota 1 Rangkap, Ukuran 1/2 F4':'Buku', 'Nota 1 Rangkap, Ukuran 1/3 F4':'Buku', 'Nota 1 Rangkap, Ukuran 1/4 F4':'Buku', 'Nota 1 Rangkap, Ukuran 1/6 F4':'Buku',
        'Nota 2 Rangkap, Full F4':'Buku', 'Nota 2 Rangkap, Ukuran 1/2 F4':'Buku', 'Nota 2 Rangkap, Ukuran 1/3 F4':'Buku', 'Nota 2 Rangkap, Ukuran 1/4 F4':'Buku', 'Nota 2 Rangkap, Ukuran 1/6 F4':'Buku',
        'Nota 3 Rangkap, Full F4':'Buku', 'Nota 3 Rangkap, Ukuran 1/2 F4':'Buku', 'Nota 3 Rangkap, Ukuran 1/3 F4':'Buku', 'Nota 3 Rangkap, Ukuran 1/4 F4':'Buku', 'Nota 3 Rangkap, Ukuran 1/6 F4':'Buku',
        'Nota 4 Rangkap, Full F4':'Buku', 'Nota 4 Rangkap, Ukuran 1/2 F4':'Buku', 'Nota 4 Rangkap, Ukuran 1/3 F4':'Buku', 'Nota 4 Rangkap, Ukuran 1/4 F4':'Buku', 'Nota 4 Rangkap, Ukuran 1/6 F4':'Buku',
        'Nota 5 Rangkap, Full F4':'Buku', 'Nota 5 Rangkap, Ukuran 1/2 F4':'Buku', 'Nota 5 Rangkap, Ukuran 1/3 F4':'Buku', 'Nota 5 Rangkap, Ukuran 1/4 F4':'Buku', 'Nota 5 Rangkap, Ukuran 1/6 F4':'Buku'
    };

    const PERCETAKAN_GRADE_A_ITEMS = ['Stempel Kayu', 'Stempel Flash', 'Stempel Flash Expres', 'Papan Dada Peniti', 'Papan Dada Magnet'];
    const ONGKIR_COST = 7000;
    let shiftStartTime = null; let shiftStartTimeString = "--:--:--";
    let shiftJadwalTutup = null; 
    let kpiTimer = null; 
    let targetGajiPokok = 0; 

    const HARI_NAMA = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const WAKTU_MAP = {'1': 'Pagi', '2': 'Siang', '3': 'Sore', '4': 'Malam'};

    console.log('Utility functions defined...');
    const $=(q,r=document)=>r.querySelector(q);
    const parseIDR=s=>{s=String(s||"").toLowerCase().trim();if(!s)return 0;if(s.endsWith('k'))s=String(parseFloat(s)*1000);return Number(s.replace(/[^0-9\-]/g,"")||0)};
    const IDR=n=>'Rp '+new Intl.NumberFormat('id-ID').format(Math.max(0,Math.round(n||0)));
    const IDR2=n=>'Rp. '+new Intl.NumberFormat('id-ID').format(Math.max(0,Math.round(n||0)));
    const fmtDots = n => new Intl.NumberFormat('id-ID').format(Math.max(0,Math.round(n||0)));
    const now=()=>new Date();
    const fmt={ymd:(d=now())=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10),hms:(d=now())=>`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`,hmsS:(d=now())=>`${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`};
    function witaDateTime(d=new Date()){const parts=new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Makassar',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).formatToParts(d);const pick=t=>parts.find(p=>p.type===t)?.value||"";return{tanggal:`${pick('year')}-${pick('month')}-${pick('day')}`,jam:`${pick('hour')}:${pick('minute')}:${pick('second')}`}}
    const toast=m=>{const t=$('#toast'); if(t){t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',1600)}};
    const roundUp1000=n=>n>0?Math.ceil(n/1000)*1000:0;
    const KEY_TX_COUNTER=`p21_tx_counter_${CASHIER_KEY}`, KEY_TX_DATE=`p21_tx_date_${CASHIER_KEY}`;
    const nextTxNumber=()=>{ const d=fmt.ymd(); const last=localStorage.getItem(KEY_TX_DATE); let n=0; if(last===d) n=parseInt(localStorage.getItem(KEY_TX_COUNTER)||"0",10); n++; localStorage.setItem(KEY_TX_COUNTER,String(n)); localStorage.setItem(KEY_TX_DATE,d); return String(n).padStart(3,'0'); }; // 3 digit
    function buildShiftPayloadCompat(st){ const shift_id = `${st.date}-${st.idx || 1}`; return { date: st.date, jam_mulai: st.start_at, jam_tutup: st.end_at, cashier: CASHIER_NAME }; }
    const getTomorrowDMY = () => { const t = new Date(); t.setDate(t.getDate() + 1); const d = String(t.getDate()).padStart(2, '0'); const m = String(t.getMonth() + 1).padStart(2, '0'); const y = String(t.getFullYear()).slice(-2); return `${d}-${m}-${y}`; };
    console.log('Utility functions defined.');

    console.log('Getting element references...'); const el={};
    
    // === (PERUBAHAN BESAR v2.8 FINAL) Daftar ID Elemen Dihilangkan dari pengecekan yang tidak terpakai
    const elementIds = [
      // Header & Debug
      'btnStart', 'btnClose', 'btnReset', 'debugAdmin', 'debugShiftStatus', 'debugShiftStart', 'debugQueueKasir', 'debugQueuePending',
      'headerLogoInput', 'headerLogoDisplay', 'headerLogoText', 'debugRencanaTutup', 'debugGoals',

      // Col Left: Ringkasan Saldo
      'newSummarySaldo', 'expNote', 'expAmount', 'expSend', 'kSaldoAwal',
      'kTotalExp', 'selisihText', 'kLaciSeharusnya', 'kReal', 'kSelisih',

      // Col Left: Ringkasan Omset
      'newSummaryOmset', 'kCash', 'kQris', 
      'kOmsetBonus10', 'kOmsetBonusLain', 'kTotalOmset_display', // (Label diubah)
      
      // Col Left: Ringkasan Bonus (ID BARU)
      'newSummaryBonus', 'kOmsetGrup0', 'kOmsetGrupS', 'kOmsetGrup1', 'kOmsetGrup2', 'kOmsetGrup3', 'kOmsetGrup4',
      'kBonusGrupS', 'kBonusGrup1', 'kBonusGrup2', 'kBonusGrup3', 'kBonusGrup4', 
      'kTotalBonus', 'kTotalGaji',
      
      // Col Left: Input Cepat (Tombol BARU)
      'colMidInput', 'txNama', 'txBarang', 'txHarga', 'pricePill', 'addCash', 'addQris', 'btnPindahNota',

      // Col Left: Antrian & Laporan
      'colMidQueue', 'queueBody',
      'colMidReport', 'txBody', 'txTable', 'btnPrintReport',

      // Col Right: Kalkulator Bagian 1 (Print/ATK)
      'colRightCalc', 'pcSub', 'pcCopy', 'pcCopyField', 'pcQty', 'pcQtyLabel', 'pcType', 'autoHarga', 'autoUnit', 'pcAddRow',
      
      // Col Right: Kalkulator Bagian 1 Manual Print
      'manualCopy_print', 'manualQty_print', 'manualName_print', 'manualUnit_print', 'manualUnitPrice_print', 'manualAdd_print',

      // Col Right: Kalkulator Bagian 2 (Percetakan)
      'pcQtyPercetakan', 'pcQtyLabelPercetakan', 'pcTypePercetakan', 'autoHargaPercetakan', 'pcAddRowPercetakan',

      // Col Right: Kalkulator Bagian 3 (Manual)
      'manualCopy', 'manualQty', 'manualName', 'manualUnit', 'manualUnitPrice', 'manualAdd',
      
      // (BARU) Panel Bonus Master (Grup 1-4 ada di HTML dan dicek di sini)
      'masterBonusPanel', 'masterBonusLabel', 'chkBonus1', 'chkBonus2', 'chkBonus3', 'chkBonus4', 'chkBonusS',

      // Col Right: Nota
      'receipt', 'pcTuan', 'pcNoHP', 'pcTanggal', 'pcPukul', 'pcBody', 'subNote', 'pcPaymentStatus', 'pcCatatan',
      'paidStamp', 'adminName', 'chkLunas', 'pcTotal', 'pcPanjar', 'pcSisa',
      'pcSave', 'pcQueueOrder', 'pcSaveDirect', 'pcClear', 'pcHeaderRow',

      // Col Right: Orderan
      'colRightPendingOrders', 'pendingOrderList', 'pendingOrderPlaceholder',
      'colRightOrders', 'orderList', 'orderPlaceholder', 'expenseReportBody',

      // Lain-lain & Modal
      'fullReport', 'toast', 'colLeftGroup', 'colRightGroup', 'splitter',
      'imageFileInput', 'uploadedImageDisplay', 'uploadPlaceholder', 'clearImageButton',
      'pendingOrderModal', 'pendingModalWaktu', 'pendingModalTanggal', 'pendingModalBatal', 'pendingModalSimpan',
      'jadwalModal', 'jadwalModalInput', 'jadwalModalSimpan',
      'ncrErrorNotification', 'ncrErrorSound', 'liveWitaTime'
    ];
    // === (AKHIR PERUBAHAN) ===
    
    const uniqueElementIds = [...new Set(elementIds)];
    let missingElement = false;
    // Hapus pengecekan manualBonusGradeField dan manualBonusGrade
    uniqueElementIds.forEach(id => { 
        if (id !== 'manualBonusGrade' && id !== 'manualBonusGradeField') {
            el[id] = $(`#${id}`); 
            if (!el[id]) { 
                console.warn(`WARN: Element #${id} not found!`); 
                missingElement = true;
            } 
        } 
    });
    
    if (missingElement) { console.warn("Some non-critical HTML elements might be missing."); }
    console.log('Element references obtained.'); const adminSpan=$('#adminName');if(adminSpan)adminSpan.textContent=CASHIER_NAME;
    if (el.debugAdmin) el.debugAdmin.textContent = CASHIER_NAME;
    console.log('Defining core functions...');

    function ncrShowErrorNotification(message = "INPUT TIDAK VALID") { if (el.ncrErrorNotification && el.ncrErrorSound) { el.ncrErrorNotification.textContent = message; el.ncrErrorNotification.style.display = 'block'; el.ncrErrorSound.play().catch(e => console.warn("Audio play failed:", e)); setTimeout(() => { el.ncrErrorNotification.style.display = 'none'; }, 2500); } else { toast(message); } }

    let txReady = false;
    updateButtonsState = () => {
        const shiftIsActive = isShiftActive();
        const nameVal = el.txNama?.value?.trim() || '';
        const priceVal = parseIDR(el.txHarga?.value);
        txReady = nameVal.length > 0 && priceVal > 0 && shiftIsActive;
        if (el.addCash) el.addCash.disabled = !txReady;
        if (el.addQris) el.addQris.disabled = !txReady;
        if (el.btnPindahNota) el.btnPindahNota.disabled = !txReady; // (BARU) 
        
        const hasItemsInNota = el.pcBody && el.pcBody.children.length > 0;
        if (el.pcSave) el.pcSave.disabled = !hasItemsInNota;
        if (el.pcQueueOrder) el.pcQueueOrder.disabled = !hasItemsInNota;
        if (el.pcSaveDirect) el.pcSaveDirect.disabled = !hasItemsInNota;
    };
    const setPrice = v => { if (v < 0) v = 0; if (el.txHarga) el.txHarga.value = v; if (el.pricePill) el.pricePill.textContent = IDR(v); updateButtonsState(); };
    const addPrice = d => { let v = parseIDR(el.txHarga?.value) + d; setPrice(v); };

    // --- API Queue System ---
    const REQUEST_QUEUE_KEY = `p21_request_queue_${CASHIER_KEY}`;
    let isProcessingQueue = false;

    const getQueue = () => {
        try {
            const queue = localStorage.getItem(REQUEST_QUEUE_KEY);
            return queue ? JSON.parse(queue) : [];
        } catch (e) {
            console.error("Error reading request queue:", e);
            localStorage.removeItem(REQUEST_QUEUE_KEY); // Clear corrupted queue
            return [];
        }
    };

    const saveQueue = (queue) => {
        localStorage.setItem(REQUEST_QUEUE_KEY, JSON.stringify(queue));
    };

    const addToQueue = (request) => {
        const queue = getQueue();
        queue.push(request);
        saveQueue(queue);
        console.log(`Request added to queue. Queue size: ${queue.length}`);
        // Trigger processing immediately
        setTimeout(processQueue, 100); // Use setTimeout to avoid race conditions
    };

    const processQueue = async () => {
        if (isProcessingQueue) return; // Already processing
        if (!navigator.onLine) {
            console.log('Queue processing paused: App is offline.');
            return;
        }

        const queue = getQueue();
        if (queue.length === 0) {
            return; // Nothing to process
        }
        
        isProcessingQueue = true;
        console.log(`Starting queue processing... Items: ${queue.length}`);

        const request = queue[0];
        try {
            console.log('Processing request:', request.action);
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                // For server errors (like 500), we'll keep the item in the queue and retry later.
                throw new Error(`Server responded with status ${response.status}`);
            }

            console.log('Request successful. Removing from queue.');
            // Success, remove from queue
            queue.shift();
            saveQueue(queue);
            toast('Sinkronisasi data berhasil.');

        } catch (e) {
            console.error('API Queue Error:', e.message, '. Pausing queue for a bit.');
            isProcessingQueue = false; // Release the lock on failure to allow next interval to try
            toast('Gagal sinkronisasi, mencoba lagi nanti.');
            return; // Stop processing on this attempt
        } finally {
            isProcessingQueue = false;
        }

        // If there are more items, process the next one
        if (getQueue().length > 0) {
            console.log('More items in queue, processing next...');
            setTimeout(processQueue, 100); // Process next item
        } else {
            console.log('Queue is empty. Stopping processing.');
        }
    };

    // Add triggers for the queue processor
    setInterval(processQueue, 30000); // Try to process the queue every 30 seconds
    window.addEventListener('online', processQueue); // Try to process as soon as the app comes online
    
    // API Functions
    const apiAddTx = (payload) => {
        console.log('Queueing TX:', payload.tx_id);
        addToQueue({ action: 'addTransaction', data: payload });
        toast('Transaksi disimpan & masuk antrean kirim.');
    };
    
    const apiAddExpense = (payload) => {
        console.log('Queueing Expense:', payload.keterangan);
        addToQueue({ action: 'addExpense', data: payload });
        toast('Pengeluaran disimpan & masuk antrean kirim.');
    };
    
    // === (PERUBAHAN BESAR v2.8) saveCalcToSheet SEKARANG MENGIRIM GRUP BONUS 5 GRUP ===
    async function saveCalcToSheet(janjiSelesai = null){
        const { tanggal, jam } = witaDateTime();
        const panjarValue = parseIDR(el.pcPanjar?.value) || 0;
        const isLunas = el.chkLunas?.checked;
        let statusBayar = 'BELUM BAYAR';
        if (isLunas) { statusBayar = 'SUDAH LUNAS'; }
        else if (panjarValue > 0) { statusBayar = 'SUDAH PANJAR'; }

        const notaBonusOmzet = { Grup0: 0, Grup0_S: 0, Grup1: 0, Grup2: 0, Grup3: 0, Grup4: 0 };

        const payload = {
            timestamp: `${tanggal} ${jam}`,
            tx_id: `INV-${TX_ID_PREFIX}-${nextTxNumber()}`,
            nama_tx: el.pcTuan?.value || 'Pelanggan',
            admin: CASHIER_NAME,
            ket: el.pcCatatan?.value || '-',
            harga: parseIDR(el.pcTotal?.value),
            metode: statusBayar,
            panjar: panjarValue,
            sisa: parseIDR(el.pcSisa?.value) || 0,
            no_hp: el.pcNoHP?.value || '-',
            janji_selesai: janjiSelesai || '',
            items: []
        };

        el.pcBody.querySelectorAll('tr').forEach(row => {
            const copy = row.dataset.copy || '1';
            const qty = row.dataset.qty || '1';
            const label = row.cells[2]?.textContent || 'N/A';
            const unit = row.cells[3]?.textContent || 'Pcs';
            const hargaSatuanText = row.cells[4]?.textContent || '0';
            const jumlahText = row.cells[5]?.textContent || '0';
            const jumlahAngka = parseIDR(jumlahText);
            const hargaSatuanAngka = parseIDR(hargaSatuanText);
            const bonusGrade = row.dataset.bonus || 'Grup0'; 
            const bonusGradeText = row.dataset.bonusText || 'Grup 0 (0%)';
            const labelTanpaBonus = label.split(' [Grup')[0];

            if(bonusGrade === 'Grup0_S') {
              notaBonusOmzet.Grup0_S += jumlahAngka;
            } else if(bonusGrade !== 'Grup0') {
              notaBonusOmzet[bonusGrade] += jumlahAngka;
            } else {
              notaBonusOmzet.Grup0 += jumlahAngka;
            }

            payload.items.push({
                rangkap: copy,
                qty: qty,
                jenis: labelTanpaBonus,
                unit: unit,
                harga_satuan: hargaSatuanAngka,
                jumlah: jumlahAngka,
                bonus_grade: bonusGradeText
            });
        });

        // This part is tricky. The original function returned a promise that resolved
        // after the fetch. Now, we are queueing. For the UI to update instantly,
        // we will assume success and queue the background task.
        
        console.log('Queueing Order:', payload.tx_id);
        addToQueue({ action: 'addOrder', data: payload });
        toast('Orderan disimpan & masuk antrean kirim.');

        const openDate = localStorage.getItem(OPEN_KEY);
        const st = openDate ? readState(openDate) : null;
        if (st) {
            addBonusOmzet(st, notaBonusOmzet.Grup0_S, notaBonusOmzet.Grup1, notaBonusOmzet.Grup2, notaBonusOmzet.Grup3, notaBonusOmzet.Grup4);
        } else {
            console.warn('Cannot add bonus omzet, shift state not found.');
        }

        if (el.orderList && el.orderPlaceholder) {
            el.orderPlaceholder.style.display = 'none'; 
            const li = document.createElement('li');
            const notaDataForStorage = {
                tuan: payload.nama_tx,
                noHP: payload.no_hp,
                catatan: payload.ket,
                lunas: isLunas,
                panjar: panjarValue,
                sisa: payload.sisa,
                total: payload.harga,
                janjiSelesai: payload.janji_selesai,
                items: payload.items.map(i => ({
                    copy: i.rangkap,
                    qty: i.qty,
                    label: i.jenis,
                    unit: i.unit,
                    total: i.jumlah,
                    bonus: i.bonus_grade
                }))
            };
            li.dataset.nota = JSON.stringify(notaDataForStorage); 

            let itemsHtml = payload.items.map(item =>
                `&nbsp;&nbsp;• ${item.jenis} (${item.rangkap}x${item.qty} ${item.unit}) - ${IDR(item.jumlah)}`
            ).join('<br>');
            let statusColor = 'var(--danger)';
            if(payload.metode === 'SUDAH LUNAS') { statusColor = 'var(--ok)'; } 
            else if (payload.panjar > 0) { statusColor = 'var(--warn)'; }

            li.innerHTML = `<div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div style="line-height: 1.5; font-size: 12px; flex-grow: 1;">
                    <div><b style="font-size: 1.1em; color: var(--accent);">${payload.nama_tx}</b> (${payload.no_hp || 'No HP'}) - ${jam.substring(0,5)}</div>
                    <div><b>Total: ${IDR(payload.harga)}</b> <span style="font-weight:bold; color: ${statusColor};">(${payload.metode})</span></div>
                    ${payload.janji_selesai ? `<div><small style="color:var(--accent); font-weight:bold;">Janji: ${payload.janji_selesai}</small></div>` : ''}
                    <div style="font-size: 11px; opacity: 0.9; margin-top: 4px; word-break: break-word;">
                        ${itemsHtml}
                    </div>
                </div>
                <div style="flex-shrink: 0; margin-left: 8px;"><button class="btn btn-green btn-order-balik" style="padding:4px 8px;font-size:11px;">BALIK</button></div>
            </div>`;
            el.orderList.appendChild(li);
        }
        // We return a resolved promise to not break the calling logic that uses `await`
        return Promise.resolve({ ok: true });
    }
// === (PERUBAHAN BESAR) Fungsi loadNotaDataToCalculator DIPERBARUI ===
    function loadNotaDataToCalculator(d) {
        if (!d || !d.tuan) { toast("Error: Data nota tidak valid untuk dimuat."); return; }
        clearNota(); 
        if(el.pcTuan) el.pcTuan.value = d.tuan;
        if(el.pcNoHP) el.pcNoHP.value = d.noHP;
        if(el.pcCatatan) el.pcCatatan.value = d.catatan;
        if(el.pcPanjar) el.pcPanjar.value = d.panjar > 0 ? fmtDots(d.panjar) : '';
        if(el.chkLunas) el.chkLunas.checked = d.lunas;
        if(el.pcBody && d.items) {
            el.pcBody.innerHTML = ''; 
            d.items.forEach(i => {
                const totalQty = (parseInt(i.copy,10)||1)*(parseInt(i.qty,10)||1);
                
                // (BARU) Ambil grup bonus dari teks (cth: "Grup 4 (10%)")
                const bonusText = i.bonus || 'Grup 0 (0%)';
                const bonusGradeMap = {
                    'Grup 0 (0%)': 'Grup0', 'BONUS INPUT & barang grosir (1%)': 'Grup0_S', 
                    'Grup 1 (2.5%)': 'Grup1', 'Grup 2 (5%)': 'Grup2', 
                    'Grup 3 (7.5%)': 'Grup3', 'Grup 4 (10%)': 'Grup4'
                };
                const bonusGrade = bonusGradeMap[bonusText] || 'Grup0'; 

                // (BARU) Panggil makeRow dengan 8 parameter (termasuk grup bonus & teksnya)
                const row = makeRow(i.copy, i.qty, i.label, parseIDR(i.total), totalQty, i.unit, bonusGrade, bonusText);
                el.pcBody.appendChild(row);
            });
        }
        refreshPcTotal(); 
        updateWitaTime(); 
        const stamp = $('#paidStamp');
        if (stamp && el.chkLunas) stamp.style.display = el.chkLunas.checked ? 'block' : 'none';
    }
    
    // Shift Management Functions
    const shiftKeyFor=d=>`p21_shift_state_${d}_${CASHIER_KEY}`;
    const readState=d=>{ try { const data = localStorage.getItem(shiftKeyFor(d)); return data ? JSON.parse(data) : null; } catch(e) { console.error("Parse state error", d, e); return null; } };
    const writeState=(d,o)=>localStorage.setItem(shiftKeyFor(d),JSON.stringify(o||null));
    const clearOpen=()=>localStorage.removeItem(OPEN_KEY);
    function isShiftActive() { return localStorage.getItem(OPEN_KEY) !== null; } 
    function updateQueueDebug() { if (el.debugQueueKasir && el.queueBody) { const count = el.queueBody.children.length; el.debugQueueKasir.textContent = `${count} Item`; } if (el.debugQueuePending && el.pendingOrderList) { const count = el.pendingOrderList.querySelectorAll('li:not(#pendingOrderPlaceholder)').length; el.debugQueuePending.textContent = `${count} Item`; if (el.pendingOrderPlaceholder) { el.pendingOrderPlaceholder.style.display = (count === 0) ? 'block' : 'none'; } } }
    function setTransaksiEnabled(enable){ 
        console.log('Set Tx Enabled:', enable); 
        
        if(el.txNama) el.txNama.disabled = !enable; 
        if(el.txBarang) el.txBarang.disabled = !enable; 
        if(el.expNote) el.expNote.disabled = !enable; 
        if(el.expAmount) el.expAmount.disabled = !enable; 
        if(el.expSend) el.expSend.disabled = !enable; 
        if(el.kSaldoAwal) el.kSaldoAwal.disabled = enable; 
        
        updateButtonsState(); 
    }
    
    // === (PERUBAHAN BESAR) Fungsi applyStarted DIPERBARUI untuk Gaji Baru ===
    function applyStarted(st){ 
        console.log('Apply STARTED:', st); 
        if(el.btnStart) el.btnStart.disabled = true; 
        if(el.btnClose) el.btnClose.disabled = false; 
        setTransaksiEnabled(true); 
        
        shiftStartTime = new Date(st.start_timestamp); 
        shiftStartTimeString = fmt.hmsS(shiftStartTime); 
        if(el.debugShiftStart) el.debugShiftStart.textContent = shiftStartTimeString; 
        if(el.debugShiftStatus) el.debugShiftStatus.innerHTML = '<span class="light green"></span> AKTIF'; 
        if(el.btnPrintReport) el.btnPrintReport.style.display='none'; 

        shiftJadwalTutup = st.jadwal_tutup_kas || null;
        if(el.debugRencanaTutup) {
            el.debugRencanaTutup.textContent = shiftJadwalTutup || '??:??';
        }
        
        targetGajiPokok = 0;
        if (shiftJadwalTutup && shiftStartTime) {
            try {
                const [h, m] = shiftJadwalTutup.split(':').map(Number);
                const jadwalDate = new Date(shiftStartTime);
                jadwalDate.setHours(h, m, 0, 0);
                if (jadwalDate < shiftStartTime) {
                    jadwalDate.setDate(jadwalDate.getDate() + 1);
                }
                const durasiMs = jadwalDate.getTime() - shiftStartTime.getTime();
                if (durasiMs > 0) {
                    const durasiJam = durasiMs / (1000 * 60 * 60);
                    targetGajiPokok = durasiJam * GAJI_POKOK_PER_JAM;
                }
            } catch (e) {
                console.error("Error calculating targetGajiPokok:", e);
                targetGajiPokok = 0;
            }
        }
        console.log("Target Gaji Pokok (untuk Semangat):", targetGajiPokok);

        if (kpiTimer) clearInterval(kpiTimer); 
        kpiTimer = setInterval(refreshKPI, 60000); 
        refreshKPI(st); 
    }

    function applyClosed(st){ 
        console.log('Apply CLOSED:', st); 
        if(el.btnStart) {el.btnStart.disabled = false; el.btnStart.textContent = 'Mulai Shift Baru';} 
        if(el.btnClose) el.btnClose.disabled = true; 
        setTransaksiEnabled(false); 
        shiftStartTime = null; 
        shiftStartTimeString = "--:--:--"; 
        shiftJadwalTutup = null;
        targetGajiPokok = 0;
        if(el.debugShiftStart) el.debugShiftStart.textContent = shiftStartTimeString; 
        if(el.debugShiftStatus) el.debugShiftStatus.innerHTML = '<span class="light red"></span> SELESAI'; 
        if(el.btnPrintReport) el.btnPrintReport.style.display='block';
        if (kpiTimer) clearInterval(kpiTimer); 
    }
    function applyIdle(){ 
        console.log('Apply IDLE'); 
        if(el.btnStart) {el.btnStart.disabled = false; el.btnStart.textContent = 'Mulai';} 
        if(el.btnClose) el.btnClose.disabled = true; 
        setTransaksiEnabled(false); 
        shiftStartTime = null; 
        shiftStartTimeString = "--:--:--"; 
        shiftJadwalTutup = null;
        targetGajiPokok = 0;
        if(el.debugShiftStart) el.debugShiftStart.textContent = shiftStartTimeString; 
        if(el.debugShiftStatus) el.debugShiftStatus.innerHTML = '<span class="light red"></span> NONAKTIF'; 
        if(el.debugRencanaTutup) el.debugRencanaTutup.textContent = '--:--';
        if(el.btnPrintReport) el.btnPrintReport.style.display='none';
        if (kpiTimer) clearInterval(kpiTimer);
        if(el.kTotalGaji) el.kTotalGaji.textContent = 'Rp 0';
        if(el.kTotalBonus) el.kTotalBonus.textContent = 'Rp 0';
    }

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
                    if(el.kTotalExp) el.kTotalExp.textContent = IDR(st.total_exp || 0);
                    if(el.kReal) el.kReal.value = fmtDots(st.uang_real || 0);
                    if(el.debugRencanaTutup) el.debugRencanaTutup.textContent = st.jadwal_tutup_kas || '??:??';
                    refreshKPI(st);
                    if(el.kSaldoAwal) el.kSaldoAwal.value = '';
                } else {
                    applyStarted(st);
                    if(el.kSaldoAwal) {el.kSaldoAwal.value = fmtDots(st.saldo_awal || 0); el.kSaldoAwal.disabled = true;}
                    if(el.kTotalExp) el.kTotalExp.textContent = IDR(st.total_exp || 0);
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
                if(el.kTotalExp) el.kTotalExp.textContent = IDR(st.total_exp || 0);
                if(el.kReal) el.kReal.value = fmtDots(st.uang_real || 0);
                if(el.debugRencanaTutup) el.debugRencanaTutup.textContent = st.jadwal_tutup_kas || '??:??';
                refreshKPI(st);
                if(el.kSaldoAwal) el.kSaldoAwal.value = '';
            } else {
                console.log('Shift today IDLE or not found.');
                applyIdle();
                refreshKPI(null); 
            }
        }
        updateQueueDebug();
    }
    function updateWitaTime() { 
        const { tanggal, jam } = witaDateTime(); 
        const dateParts = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Makassar', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).formatToParts(now()); 
        const pick = (parts, t) => parts.find(p => p.type === t)?.value || ''; 
        if (el.pcTanggal) el.pcTanggal.textContent = `${pick(dateParts, 'weekday')}, ${pick(dateParts, 'day')} ${pick(dateParts, 'month')} ${pick(dateParts, 'year')}`; 
        if (el.pcPukul) el.pcPukul.textContent = `${jam} WITA`; 
        if (el.liveWitaTime) el.liveWitaTime.textContent = `${jam} WITA`;
    }

    // === (PERUBAHAN BESAR v2.8) addBonusOmzet - Menerima 5 Grup Bonus (termasuk Grup0_S) ===
    function addBonusOmzet(st, omzetGrupS, omzetGrup1, omzetGrup2, omzetGrup3, omzetGrup4) {
        if (!isShiftActive()) return;
        const openDate = localStorage.getItem(OPEN_KEY);
        if (!openDate) return;
        
        // (PERUBAHAN) Ganti nama properti state
        st.omzet_grupS = (st.omzet_grupS || 0) + omzetGrupS;
        st.omzet_grup1 = (st.omzet_grup1 || 0) + omzetGrup1;
        st.omzet_grup2 = (st.omzet_grup2 || 0) + omzetGrup2;
        st.omzet_grup3 = (st.omzet_grup3 || 0) + omzetGrup3;
        st.omzet_grup4 = (st.omzet_grup4 || 0) + omzetGrup4;
        
        // NOTE: Grup 0 (0%) tidak perlu ditambah di sini, karena omzetnya tidak mempengaruhi bonus.

        writeState(openDate, st);
        refreshKPI(st); // Update tampilan ringkasan
    }

    // === (PERUBAHAN BESAR) addTx (Input Cepat) sekarang mengirim Grup Bonus ===
    const addTx = async (method, nama_tx, harga_tx, barang_tx = '', clearInputFields = false, bonusGradeKey, bonusGradeText) => {
        if (!isShiftActive()) { toast('Shift belum dimulai!'); return; }
        const openDate = localStorage.getItem(OPEN_KEY); if (!openDate) { toast('Error: Shift date not found!'); return; }
        const st = readState(openDate); if (!st) { toast('Error: Shift state not found!'); return; }
        const { tanggal, jam } = witaDateTime(); const harga = parseIDR(harga_tx);
        if (!nama_tx || harga <= 0) { console.error("addTx invalid input:", {nama_tx, harga_tx}); toast("Error: Data antrian invalid."); return; }
        let final_ket = barang_tx || '-'; const tuan_prefix = `[${nama_tx}] `; if (barang_tx && barang_tx.startsWith(tuan_prefix)) { final_ket = barang_tx.substring(tuan_prefix.length).split('|')[0].trim(); } 
        
        // (BARU) Kirim grup bonus ke sheet
        const payload = { 
            timestamp: `${tanggal} ${jam}`, 
            tx_id: `${TX_ID_PREFIX}-${nextTxNumber()}`, 
            nama_tx: nama_tx, 
            admin: CASHIER_NAME, 
            ket: final_ket, 
            harga: harga, 
            metode: method,
            bonus_grade: bonusGradeText // (BARU) Kirim teks grup bonus
        };
        
        if (el.txBody) { el.txBody.insertAdjacentHTML('afterbegin', `<tr><td>${payload.timestamp}</td><td>${payload.tx_id}</td><td>${payload.nama_tx}</td><td>${payload.admin}</td><td>${payload.ket}</td><td data-val="${payload.harga}">${IDR(payload.harga)}</td><td>${payload.metode}</td></tr>`); } 
        
        st.transactions = st.transactions || []; 
        st.transactions.unshift(payload);
        
        if (method === 'Cash') { st.total_cash = (st.total_cash || 0) + harga; st.n_cash = (st.n_cash || 0) + 1; }
        else if (method === 'QRIS') { st.total_qris = (st.total_qris || 0) + harga; st.n_qris = (st.n_qris || 0) + 1; }
        
        // (PERUBAHAN v2.8) Panggil addBonusOmzet dengan grup yang benar
        let oS=0, o1=0, o2=0, o3=0, o4=0;
        // NOTE: Grup 0 (0%) tidak perlu dihitung
        if(bonusGradeKey === 'Grup0_S') oS = harga;
        else if(bonusGradeKey === 'Grup1') o1 = harga;
        else if(bonusGradeKey === 'Grup2') o2 = harga;
        else if(bonusGradeKey === 'Grup3') o3 = harga;
        else if(bonusGradeKey === 'Grup4') o4 = harga;
        
        addBonusOmzet(st, oS, o1, o2, o3, o4); 
        
        apiAddTx(payload);
        if (clearInputFields) { if(el.txNama) el.txNama.value = ''; if(el.txBarang) el.txBarang.value = ''; setPrice(0); if(el.txNama) el.txNama.focus(); }
        toast(`+ ${method} ${IDR(harga)}`); updateButtonsState();
    };
    
    function generateOrderSummary(tuan) {
        const items = [];
        if(el.pcBody) {
            el.pcBody.querySelectorAll('tr').forEach(row => {
                const copy = row.dataset.copy || '1';
                const qty = row.dataset.qty || '1';
                const unit = row.cells[3]?.textContent || 'Pcs';
                const jenis = row.cells[2]?.textContent.split(' [Grup')[0] || 'N/A';
                items.push(`${jenis} (${copy}x${qty} ${unit})`);
            });
        }
        const total = el.pcTotal?.value || 'Rp 0';
        return `[${tuan}] ${items.join(', ')} | Total: ${total}`;
    }
    
    function getGajiPokokAkrual(state) {
        if (!isShiftActive() || !shiftStartTime || !state) {
            return 0;
        }
        const now = new Date();
        let durasiMs = now.getTime() - shiftStartTime.getTime();
        if (shiftJadwalTutup) {
            try {
                const [h, m] = shiftJadwalTutup.split(':').map(Number);
                const jadwalDate = new Date(shiftStartTime);
                jadwalDate.setHours(h, m, 0, 0);
                if (jadwalDate < shiftStartTime) {
                    jadwalDate.setDate(jadwalDate.getDate() + 1);
                }
                const durasiMs = jadwalDate.getTime() - shiftStartTime.getTime();
                if (durasiMs > 0) {
                    const durasiJam = durasiMs / (1000 * 60 * 60);
                    targetGajiPokok = durasiJam * GAJI_POKOK_PER_JAM;
                }
            } catch (e) {
                console.error("Error calculating targetGajiPokok:", e);
                targetGajiPokok = 0;
            }
        }
        if (durasiMs < 0) durasiMs = 0;
        const durasiJam = durasiMs / (1000 * 60 * 60);
        return durasiJam * GAJI_POKOK_PER_JAM;
    }
    
    function getGajiPokokKoreksi(state, tutupTimestamp) {
        if (!shiftStartTime || !state) { 
            return 0; 
        }
        const endTime = new Date(tutupTimestamp);
        let durasiMs = endTime.getTime() - shiftStartTime.getTime();
        if (durasiMs < 0) durasiMs = 0;
        const durasiJam = durasiMs / (1000 * 60 * 60);
        return durasiJam * GAJI_POKOK_PER_JAM;
    }
    
    // === (PERUBAHAN BESAR v2.8) refreshKPI DIROMBAK TOTAL untuk 5 Grup Bonus ===
    function refreshKPI(state = null){
        const openDate = localStorage.getItem(OPEN_KEY); 
        const st = state || (openDate ? readState(openDate) : null);

        let saldoAwal = 0, totalExp = 0, totalCash = 0, nCash = 0, totalQris = 0, nQris = 0;
        // (BARU) 6 Grup Omzet (0%, 1%, 2.5%, 5%, 7.5%, 10%)
        let omzetGrup0 = 0, omzetGrupS = 0, omzetGrup1 = 0, omzetGrup2 = 0, omzetGrup3 = 0, omzetGrup4 = 0;
        let currentGajiPokok = 0;

        if (st) {
            saldoAwal = st.saldo_awal || 0; 
            totalExp = st.total_exp || 0; 
            totalCash = st.total_cash || 0; 
            nCash = st.n_cash || 0; 
            totalQris = st.total_qris || 0; 
            nQris = st.n_qris || 0;
            
            // (BARU) Data Bonus 6 Grup
            omzetGrup0 = st.omzet_grup0 || 0;
            omzetGrupS = st.omzet_grupS || 0;
            omzetGrup1 = st.omzet_grup1 || 0;
            omzetGrup2 = st.omzet_grup2 || 0;
            omzetGrup3 = st.omzet_grup3 || 0;
            omzetGrup4 = st.omzet_grup4 || 0;
            
            if(el.kTotalExp) el.kTotalExp.textContent = IDR(totalExp);
            
            if (el.txBody) {
                el.txBody.innerHTML = '';
                (st.transactions || []).forEach(payload => {
                    el.txBody.insertAdjacentHTML('beforeend', `<tr><td>${payload.timestamp}</td><td>${payload.tx_id || payload['Kode Transaksi']}</td><td>${payload.nama_tx || payload['Nama Transaksi']}</td><td>${payload.admin || payload.Admin}</td><td>${payload.ket || payload.Barang}</td><td data-val="${payload.harga || payload.Harga}">${IDR(payload.harga || payload.Harga)}</td><td>${payload.metode || payload.Metode}</td></tr>`);
                });
            }
            
            if (el.expenseReportBody) {
                el.expenseReportBody.innerHTML = '';
                (st.expenses || []).forEach(expense => {
                    const jam = expense.timestamp ? expense.timestamp.split(' ')[1] || expense.jam || '--:--:--' : expense.jam || '--:--:--';
                    el.expenseReportBody.insertAdjacentHTML('beforeend',
                        `<tr>
                            <td style="text-align: center;">${jam.substring(0, 5)}</td> <td style="text-align: left;">${expense.keterangan}</td>
                            <td style="text-align: right; font-weight: 700;">${IDR(expense.jumlah)}</td>
                        </tr>`
                    );
                });
            }
            
        } else {
            if(el.kSaldoAwal) el.kSaldoAwal.value = '';
            if(el.kTotalExp) el.kTotalExp.textContent = IDR(0);
            if(el.kReal) el.kReal.value = '';
            if(el.debugRencanaTutup) el.debugRencanaTutup.textContent = '--:--';
            if (el.expenseReportBody) el.expenseReportBody.innerHTML = '';
        }

        // --- Perhitungan "Ringkasan Saldo" & "Ringkasan Omset" ---
        const totalOmset = totalCash + totalQris; 
        const laciNonQris = saldoAwal + totalCash - totalExp;
        const laciSeharusnya = laciNonQris;
        const real = parseIDR(el.kReal?.value);
        const selisih = laciSeharusnya - real;
        
        // (BARU) Hitung total omzet bonus
        const totalOmsetBonus = omzetGrupS + omzetGrup1 + omzetGrup2 + omzetGrup3 + omzetGrup4;
        const omzetBonus10 = omzetGrup4; // (Hanya Grup 4)
        const omzetBonusLain = omzetGrupS + omzetGrup1 + omzetGrup2 + omzetGrup3; // (Sisa + Grup S)
        
        // Update "Ringkasan Saldo"
        if(el.kLaciSeharusnya) el.kLaciSeharusnya.textContent = IDR(laciSeharusnya);
        if(el.kSelisih) {
            el.kSelisih.textContent = IDR(Math.abs(selisih));
            el.kSelisih.style.color = selisih === 0 ? 'var(--ok)' : 'var(--danger)';
        }
        if(el.selisihText) {
            if (selisih > 0) { el.selisihText.textContent = '(UANG LACI KURANG)'; el.selisihText.style.color = 'var(--danger)'; } 
            else if (selisih < 0) { el.selisihText.textContent = '(UANG LACI LEBIH)'; el.selisihText.style.color = 'var(--danger)'; } 
            else { el.selisihText.textContent = '(UANG LACI PAS)'; el.selisihText.style.color = 'var(--ok)'; }
        }

        // Update "Ringkasan Omset"
        if(el.kCash) el.kCash.textContent = IDR(totalCash);
        if(el.kQris) el.kQris.textContent = IDR(totalQris);
        if(el.kOmsetBonus10) el.kOmsetBonus10.textContent = IDR(omzetBonus10);
        if(el.kOmsetBonusLain) el.kOmsetBonusLain.textContent = IDR(omzetBonusLain);
        if(el.kTotalOmset_display) el.kTotalOmset_display.textContent = IDR(totalOmsetBonus);

        // --- Perhitungan "Ringkasan Bonus Tambahan" ---
        const bonusGrupS = omzetGrupS * BONUS_RATES.Grup0_S;
        const bonusGrup1 = omzetGrup1 * BONUS_RATES.Grup1;
        const bonusGrup2 = omzetGrup2 * BONUS_RATES.Grup2;
        const bonusGrup3 = omzetGrup3 * BONUS_RATES.Grup3;
        const bonusGrup4 = omzetGrup4 * BONUS_RATES.Grup4;
        const totalBonus = bonusGrupS + bonusGrup1 + bonusGrup2 + bonusGrup3 + bonusGrup4;
        
        let gajiPokokTampil = 0;
        if (isShiftActive()) {
            gajiPokokTampil = targetGajiPokok;
        } else if (st && st.end_at) {
            gajiPokokTampil = st.gaji_pokok_final || 0;
        }
        const totalGaji = gajiPokokTampil + totalBonus;

        // Update "Ringkasan Bonus"
        if(el.kOmsetGrup0) el.kOmsetGrup0.textContent = IDR(omzetGrup0);
        if(el.kOmsetGrupS) el.kOmsetGrupS.textContent = IDR(omzetGrupS); 
        if(el.kBonusGrupS) el.kBonusGrupS.textContent = IDR(bonusGrupS); 
        if(el.kOmsetGrup1) el.kOmsetGrup1.textContent = IDR(omzetGrup1);
        if(el.kOmsetGrup2) el.kOmsetGrup2.textContent = IDR(omzetGrup2);
        if(el.kOmsetGrup3) el.kOmsetGrup3.textContent = IDR(omzetGrup3);
        if(el.kOmsetGrup4) el.kOmsetGrup4.textContent = IDR(omzetGrup4);
        
        if(el.kBonusGrup1) el.kBonusGrup1.textContent = IDR(bonusGrup1);
        if(el.kBonusGrup2) el.kBonusGrup2.textContent = IDR(bonusGrup2);
        if(el.kBonusGrup3) el.kBonusGrup3.textContent = IDR(bonusGrup3);
        if(el.kBonusGrup4) el.kBonusGrup4.textContent = IDR(bonusGrup4);
        
        if(el.kTotalBonus) el.kTotalBonus.textContent = IDR(totalBonus);
        if(el.kTotalGaji) el.kTotalGaji.textContent = IDR(totalGaji);
        
        if(el.debugGoals) el.debugGoals.textContent = IDR(totalGaji);
    }
    
    function clearNota() { 
        if(el.pcQty) el.pcQty.value = '1'; 
        if(el.pcCopy) el.pcCopy.value = '1'; 
        if(el.pcType) el.pcType.selectedIndex = 0; 
        updateAutoHargaPrint();
        
        if(el.manualCopy_print) el.manualCopy_print.value = '1';
        if(el.manualQty_print) el.manualQty_print.value = '1';
        if(el.manualName_print) el.manualName_print.value = '';
        if(el.manualUnitPrice_print) el.manualUnitPrice_print.value = '';
        if(el.manualUnit_print) el.manualUnit_print.value = 'Pcs'; // (PERUBAHAN v2.7) Default ke Pcs
        
        if(el.pcQtyPercetakan) el.pcQtyPercetakan.value = '1';
        if(el.pcTypePercetakan) el.pcTypePercetakan.selectedIndex = 0;
        updateAutoHargaPercetakan();
        
        if(el.manualQty) el.manualQty.value = '1'; 
        if(el.manualCopy) el.manualCopy.value = '1'; 
        if(el.manualName) el.manualName.value = ''; 
        if(el.manualUnitPrice) el.manualUnitPrice.value = '';
        if(el.manualUnit) el.manualUnit.value = 'Pcs';
        
        // --- LOGIKA BONUS DEFAULT BARU (Semua Ceklis Dilihat, Hanya Grup S ON) ---
        if(el.chkBonus1) el.chkBonus1.checked = false;
        if(el.chkBonus2) el.chkBonus2.checked = false;
        if(el.chkBonus3) el.chkBonus3.checked = false;
        if(el.chkBonus4) el.chkBonus4.checked = false;
        if(el.chkBonusS) el.chkBonusS.checked = true; // DEFAULT: BONUS INPUT & barang grosir (1%)
        // ---------------------------------

        if(el.pcTuan) el.pcTuan.value = ''; 
        if(el.pcNoHP) el.pcNoHP.value = ''; 
        if(el.pcCatatan) el.pcCatatan.value = ''; 
        if(el.pcPanjar) el.pcPanjar.value = ''; 
        if(el.pcBody) el.pcBody.innerHTML = ''; 
        if(el.chkLunas) el.chkLunas.checked = false; 
        const stamp = $('#paidStamp'); if (stamp) stamp.style.display = 'none'; 
        refreshPcTotal(); 
        updateWitaTime(); 
        toast('Nota dibersihkan'); 
        updateButtonsState(); 
        
        updateMasterBonusLabel();
    }

    const FIXED_PRICE_ITEMS = {
        'Stempel Kayu': 35000,
        'Stempel Flash': 55000,
        'Stempel Flash Expres': 65000,
        'Papan Dada Peniti': 35000,
        'Papan Dada Magnet': 40000
    };

    function interpolatePrice(q, tiers) {
      if(!q||q<=0)return 0;
      if (tiers.length === 0) return 0;
      if (q === 1) return tiers[0][1];
      if (q <= tiers[0][0]) return tiers[0][1];
      if (q >= tiers[tiers.length - 1][0]) return tiers[tiers.length - 1][1];
      for(let i=0; i<tiers.length-1; i++){
        const [qty_A, price_A] = tiers[i];
        const [qty_B, price_B] = tiers[i+1];
        if(q >= qty_A && q <= qty_B){
          if (qty_B - qty_A === 0) return price_A;
          const ratio = (q - qty_A) / (qty_B - qty_A);
          const logA = Math.log(price_A);
          const logB = Math.log(price_B);
          const logPrice = logA + ratio * (logB - logA);
          return Math.exp(logPrice);
        }
      }
      return tiers[tiers.length - 1][1];
    }
    
    function a4_unit_price(q){ if(!q||q<=0)return 0; const a=[[1,320.74],[50,319.25],[100,295],[200,290],[300,285],[500,280],[1000,275],[2000,260],[5000,250],[10000,230]]; if(q>=a.at(-1)[0])return a.at(-1)[1]; if(q<=a[0][0])return a[0][1]; for(let i=0;i<a.length-1;i++){ const[b,c]=a[i],[d,e]=a[i+1]; if(q>=b&&q<=d){ const f=(q-b)/(d-b); return c+f*(e-c)}} return a.at(-1)[1]}
    const a4_total=q=>Math.round(q*a4_unit_price(q));

    const notaTiers = {
      "Nota 1 Rangkap, Full F4":         [[1, 25000], [10, 14000]], "Nota 1 Rangkap, Ukuran 1/2 F4":  [[1, 12500], [20, 7000]],  "Nota 1 Rangkap, Ukuran 1/3 F4":  [[1, 8333],  [30, 4667]],  "Nota 1 Rangkap, Ukuran 1/4 F4":  [[1, 6250],  [40, 3500]],  "Nota 1 Rangkap, Ukuran 1/6 F4":  [[1, 4167],  [60, 2333]],
      "Nota 2 Rangkap, Full F4":         [[1, 39000], [10, 28000]], "Nota 2 Rangkap, Ukuran 1/2 F4":  [[1, 19500], [20, 14000]], "Nota 2 Rangkap, Ukuran 1/3 F4":  [[1, 13000], [30, 9333]],  "Nota 2 Rangkap, Ukuran 1/4 F4":  [[1, 9750],  [40, 7000]],  "Nota 2 Rangkap, Ukuran 1/6 F4":  [[1, 6500],  [60, 4667]],
      "Nota 3 Rangkap, Full F4":         [[1, 53000], [10, 42000]], "Nota 3 Rangkap, Ukuran 1/2 F4":  [[1, 26500], [20, 21000]], "Nota 3 Rangkap, Ukuran 1/3 F4":  [[1, 17667], [30, 14000]], "Nota 3 Rangkap, Ukuran 1/4 F4":  [[1, 13250], [40, 10500]], "Nota 3 Rangkap, Ukuran 1/6 F4":  [[1, 8833],  [60, 7000]],
      "Nota 4 Rangkap, Full F4":         [[1, 67000], [10, 56000]], "Nota 4 Rangkap, Ukuran 1/2 F4":  [[1, 33500], [20, 28000]], "Nota 4 Rangkap, Ukuran 1/3 F4":  [[1, 22333], [30, 18667]], "Nota 4 Rangkap, Ukuran 1/4 F4":  [[1, 16750], [40, 14000]], "Nota 4 Rangkap, Ukuran 1/6 F4":  [[1, 11167], [60, 9333]],
      "Nota 5 Rangkap, Full F4":         [[1, 81000], [10, 70000]], "Nota 5 Rangkap, Ukuran 1/2 F4":  [[1, 40500], [20, 35000]], "Nota 5 Rangkap, Ukuran 1/3 F4":  [[1, 27000], [30, 23333]], "Nota 5 Rangkap, Ukuran 1/4 F4":  [[1, 20250], [40, 17500]],
      "Nota 5 Rangkap, Ukuran 1/6 F4":  [[1, 13500], [60, 11667]],
    };
    function nota_total(q, type) {
      const tiers = notaTiers[type];
      if (!tiers) return 0;
      const unitPrice = interpolatePrice(q, tiers);
      return Math.round(q * unitPrice);
    }
    const a4bb_total=q=>a4_total(Math.ceil(q/2)); const f4_total=q=>Math.round(a4_total(q)+15*Math.max(0,q)); const a4c=q=>650*q,f4c=q=>665*q,ppt=q=>175*q; function pas(q){ if(!q||q<=0)return 0; if(q===1)return 3000; if(q===2)return 4000; if(q===3)return 5000; const a=1666,b=850,c=4,d=50; if(q>=d)return Math.round(q*b); let e; e=a+((q-c)/(d-c))*(b-a); return Math.round(q*e)} function mapBening(q){ if(q<=0)return 0; if(q<=4)return q*2000; if(q<=12){ const a=8000+(q-4)/8*(20000-8000); return Math.round(a)} const a=20000/12; if(q<=50){ const b=a+(q-12)/(50-12)*(1500-a); return Math.round(q*b)} return Math.round(q*1500)} const jarakOngkirMaxim=q=>q<=0?0:1000*q; const printAmplop=q=>q<=0?0:800*q; function jilidLakban(q){ if(q<=0)return 0; const a=5000,b=3500,c=50; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} const ongLipatLeaflet=q=>q<=0?0:100*q; function jilidAnteroBiasa(q){return q<=0?0:8000*q} function anteroLaminating(q){return q<=0?0:12000*q} function atkCampur(q){return q<=0?0:1000*q} function penjepitKecil(q){ if(q<=0)return 0; const a=1000,b=700,c=30; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} function penjepitSedang(q){ if(q<=0)return 0; const a=2000,b=1000,c=50; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} function leaflet1Sisi(q){ if(q<=0)return 0; const a=333,b=285,c=1000; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)} function leaflet2Sisi(q){ if(q<=0)return 0; const a=666,b=570,c=500; if(q>=c)return Math.round(q*b); const d=a+((q-1)/(c-1))*(b-a); return Math.round(q*d)}

    function getTotalPrint(type, qty) {
      if (qty <= 0) return 0;
      if (subActive) { qty = qty * 0.95; } // Diskon 5%
      if(type==='A3 Standar')return a4_total(qty)*2;
      if(type==='A4 Standar')return a4_total(qty);
      if(type==='F4 Standar')return f4_total(qty);
      if(type==='A4 Full Color')return a4c(qty);
      if(type==='F4 Full Color')return f4c(qty);
      if(type==='A4 PPT 2 Slide')return ppt(qty);
      if(type==='A4 Bolak-Balik')return a4bb_total(qty);
      if(type==='Pas Foto')return pas(qty);
      if(type==='Map Bening')return mapBening(qty);
      if(type==='Jarak Ongkir Maxim')return jarakOngkirMaxim(qty);
      if(type==='Print Amplop')return printAmplop(qty);
      if(type==='Jilid Lakban')return jilidLakban(qty);
      if(type==='Ong. Lipat Leaflet')return ongLipatLeaflet(qty);
      if(type==='Jilid Antero Biasa')return jilidAnteroBiasa(qty);
      if(type==='Antero Laminating')return anteroLaminating(qty);
      if(type==='ATK Campur x Rp')return atkCampur(qty);
      if(type==='Penjepit Kecil')return penjepitKecil(qty);
      if(type==='Penjepit Sedang')return penjepitSedang(qty);
      if(type==='Leaflet 1 Sisi')return leaflet1Sisi(qty);
      if(type==='Leaflet 2 Sisi')return leaflet2Sisi(qty);
      console.warn("Unknown type for getTotalPrint:", type); return 0;
    }
function getTotalPercetakan(type, qty) {
        if (qty <= 0) return 0;
        if (FIXED_PRICE_ITEMS[type] !== undefined) { 
            return FIXED_PRICE_ITEMS[type] * qty;
        }
        if (type && type.startsWith('Nota ')) { 
            return nota_total(qty, type);
        }
        console.warn("Unknown type for getTotalPercetakan:", type); return 0;
    }

    function updateAutoHargaPrint() {
        const type = el.pcType?.value;
        const qty = Math.max(1, parseInt(el.pcQty?.value || '1', 10));
        const copy = Math.max(1, parseInt(el.pcCopy?.value || '1', 10));
        const totalQty = copy * qty;
        if (el.autoUnit) { el.autoUnit.value = UNIT_MAP_PRINT[type] || 'File'; }
        if (el.pcSub) el.pcSub.disabled = false;
        let unitPrice = 0;
        if (totalQty > 0) {
            let rowTotal = getTotalPrint(type, totalQty);
            unitPrice = (rowTotal > 0 && totalQty > 0) ? rowTotal / totalQty : 0;
        }
        if (el.autoHarga) el.autoHarga.value = subActive ? 'Diskon 5%' : (Math.round(unitPrice) ? IDR(unitPrice) : 'Auto');
    }

    function updateAutoHargaPercetakan() {
        const type = el.pcTypePercetakan?.value;
        const qty = Math.max(1, parseInt(el.pcQtyPercetakan?.value || '1', 10));
        const isNota = (type && type.startsWith('Nota '));
        const isStempel = FIXED_PRICE_ITEMS[type] !== undefined;
        if (el.pcQtyLabelPercetakan) el.pcQtyLabelPercetakan.textContent = isNota ? 'Qty (Buku)' : 'Qty (Pcs)';
        let unitPrice = 0;
        if (qty > 0) {
            let rowTotal = getTotalPercetakan(type, qty);
            unitPrice = (rowTotal > 0 && qty > 0) ? rowTotal / qty : 0;
        }
        if (el.autoHargaPercetakan) {
            el.autoHargaPercetakan.value = (Math.round(unitPrice) ? IDR(unitPrice) : 'Auto');
        }
    }
    
    // === (PERUBAHAN BESAR v2.8) makeRow sekarang menerima Grup Bonus ===
    function makeRow(copy, qty, label, rowTotal, totalQty, unitName = 'Pcs', bonusGrade = 'Grup0', bonusGradeText = 'Grup 0 (0%)') {
        const isNota = label.startsWith('Nota ');
        const isStempel = FIXED_PRICE_ITEMS[label] !== undefined;
        const isManual = label.endsWith('(Manual)');
        const isFromCepat = label.endsWith('(Cepat)'); // (BARU)

        // Tentukan apakah item ini seharusnya tanpa kolom rangkap
        const hasNoRangkap = isNota || isStempel || isFromCepat || unitName === 'Buku';

        // (PERUBAHAN v2.6) Logika bonus khusus
        // "Jarak Ongkir Maxim" SELALU 0%
        if (label === 'Jarak Ongkir Maxim') {
            bonusGrade = 'Grup0';
            bonusGradeText = 'Grup 0 (0%)';
        }
        
        const finalUnitName = unitName;
        let unitPrice = totalQty > 0 ? (rowTotal / totalQty) : 0;
        let unitPriceDisplay = IDR(unitPrice);
        
        if (!isNota && !isStempel && !isManual && !isFromCepat) {
            unitPriceDisplay = 'Auto'; // Print biasa
        }
        if (subActive && !isNota && !isStempel && !isManual && !isFromCepat) {
            unitPriceDisplay = 'Diskon 5%'; // Print biasa dengan diskon
        }

        const tr = document.createElement('tr');
        tr.dataset.raw = String(rowTotal);
        tr.dataset.copy = String(copy);
        tr.dataset.qty = String(qty);
        tr.dataset.totalqty = String(totalQty);
        tr.dataset.isncr = "false";
        tr.dataset.unit = finalUnitName;
        tr.dataset.bonus = bonusGrade; // (BARU) Simpan grup bonus (cth: "Grup4")
        tr.dataset.bonusText = bonusGradeText; // (BARU) Simpan teks bonus (cth: "Grup 4 (10%)")

        // (PERUBAHAN v2.8) Tampilan Bonus
        let bonusDisplay = '';
        let bonusColor = 'var(--danger)';
        
        if (bonusGrade === 'Grup0') { bonusDisplay = '–'; bonusColor = 'var(--danger)'; }
        else if (bonusGrade === 'Grup0_S') { bonusDisplay = 'S'; bonusColor = 'var(--warn)'; }
        else if (bonusGrade === 'Grup1') { bonusDisplay = '/–––'; bonusColor = 'var(--ok)'; }
        else if (bonusGrade === 'Grup2') { bonusDisplay = '//––'; bonusColor = 'var(--ok)'; }
        else if (bonusGrade === 'Grup3') { bonusDisplay = '///–'; bonusColor = 'var(--ok)'; }
        else if (bonusGrade === 'Grup4') { bonusDisplay = '////'; bonusColor = 'var(--ok)'; }
        
        // (PERUBAHAN v2.8) Logika untuk kolom Rangkap (garis datar)
        let rangkapHtml = `<td class="qtyCell"><div class="qtyBox"><div class="qtyNum">${copy}</div><div class="qtyUnit">Rangkap</div></div></td>`;
        let qtyHtml = `<td class="qtyCell"><div class="qtyBox"><div class="qtyNum">${qty}</div><div class="qtyUnit">${finalUnitName === 'File' ? 'Lembar' : finalUnitName}</div></div></td>`;
        
        if (hasNoRangkap) {
            rangkapHtml = `<td class="qtyCell" style="font-weight: 900; font-size: 18px; vertical-align: middle;">–</td>`;
        }

        // 7 kolom sesuai HTML
        tr.innerHTML = `
            ${rangkapHtml}
            ${qtyHtml}
            <td style="text-align:left;font-weight:700">${label} <small style="color:var(--ok); font-weight:normal; display:none;">[${bonusGradeText}]</small></td>
            <td style="text-align:center;font-size:12px;">${finalUnitName}</td>
            <td style="text-align:right">${unitPriceDisplay}</td>
            <td style="text-align:right">${IDR(rowTotal)}</td>
            <td style="text-align:center; font-family: monospace; font-weight: 900; font-size: 16px; letter-spacing: -1px; color: ${bonusColor};" title="${bonusGradeText}">
                ${bonusDisplay}
                <button class="btn delPc" title="Hapus" style="width:24px;height:24px;font-size:14px;border-radius:6px;background:#e53e3e; color:white; margin-left: 5px; padding: 0;">×</button>
            </td>
        `;

        return tr;
    }
    
    // === (PERUBAHAN BESAR v2.8) Fungsi untuk Panel Bonus Master (dengan Grup S eksklusif) ===
    function getMasterBonusConfig() {
        // Logika Grup S tetap eksklusif. Jika dicentang, Grup 1-4 diabaikan, dan hasilnya Grup S.
        
        const isGrupSActive = el.chkBonusS?.checked;
        const mainCheckboxes = [el.chkBonus1, el.chkBonus2, el.chkBonus3, el.chkBonus4].filter(e => e);
        
        if (isGrupSActive) {
            // Jika Bonus Grosir dicentang, hasilnya pasti Grup S (1%)
            return {
                count: 0,
                percent: parseFloat(el.chkBonusS.value),
                grade: 'Grup0_S', 
                text: 'BONUS INPUT & barang grosir (1%)' // PERUBAHAN NAMA FINAL
            };
        } else {
            // Cek apakah ada centang di Grup 1-4
            let count = 0;
            let totalPercent = 0;
            mainCheckboxes.forEach(cb => {
                if (cb.checked) {
                    count++; 
                    totalPercent += parseFloat(cb.value);
                }
            });
            
            // Tentukan grade berdasarkan hitungan centang Grup 1-4
            const grade = count > 0 ? `Grup${count}` : 'Grup0'; 
            const text = count > 0 ? `Grup ${count} (${totalPercent}%)` : 'Grup 0 (0%)';

            return {
                count: count,
                percent: totalPercent,
                grade: grade, 
                text: text 
            };
        }
    }

    function updateMasterBonusLabel() {
        if (!el.masterBonusLabel) return;
        const config = getMasterBonusConfig();
        el.masterBonusLabel.textContent = `PANEL BONUS: ${config.text}`;
    }
    
    // Listener untuk semua checkbox di panel bonus
    document.querySelectorAll('#masterBonusPanel input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const isS = checkbox.id === 'chkBonusS';
            
            if (isS && checkbox.checked) {
                // Jika Grup S dicentang, pastikan Grup 1-4 OFF
                ['chkBonus1', 'chkBonus2', 'chkBonus3', 'chkBonus4'].forEach(id => {
                    const cb = document.getElementById(id);
                    if (cb) cb.checked = false;
                });
            } else if (!isS && checkbox.checked) {
                // Jika Grup 1-4 dicentang, pastikan Grup S OFF
                if (el.chkBonusS) el.chkBonusS.checked = false;
            }
            updateMasterBonusLabel();
        });
    });

    // === (AKHIR PERUBAHAN BESAR) ===

    function updatePaymentStatus() { if (!el.pcPaymentStatus) return; const panjar = parseIDR(el.pcPanjar?.value); const isLunas = el.chkLunas?.checked; el.pcPaymentStatus.style.display = (panjar <= 0 && !isLunas) ? 'block' : 'none'; } 
    function refreshPcTotal(){
        let grandTotal = 0;
        if(el.pcBody) {
            el.pcBody.querySelectorAll('tr').forEach(row => {
                grandTotal += parseFloat(row.dataset.raw || '0');
            });
        }
        const roundedTotal = roundUp1000(grandTotal);
        if(el.pcTotal) el.pcTotal.value = IDR(roundedTotal);
        const panjar = parseIDR(el.pcPanjar?.value);
        const sisa = roundedTotal - panjar;
        if(el.pcSisa) el.pcSisa.value = (panjar > 0 && sisa >= 0) ? IDR(sisa) : '';
        updatePaymentStatus();
        updateButtonsState();
    }
    function collectTransactions(){ const rows=[...(el.txBody.children||[])];return rows.map(r=>({t:r.cells[0]?.textContent||"",k:r.cells[1]?.textContent||"",n:r.cells[2]?.textContent||"",a:r.cells[3]?.textContent||"",b:r.cells[4]?.textContent||"",h:r.cells[5]?.textContent||"",m:r.cells[6]?.textContent||""}))}
    
    // === (PERUBAHAN BESAR v2.8) buildReport & printReport DIPERBARUI ===
    function buildReport(){
        const openDate = localStorage.getItem(OPEN_KEY); 
        const st = readState(openDate); 
        if (!st) { el.fullReport.innerHTML = '<p>Data shift tidak ditemukan.</p>'; return; } 
        
        const { date, start_at, end_at, saldo_awal = 0, total_cash = 0, n_cash = 0, total_qris = 0, n_qris = 0, total_exp = 0, uang_real = 0, selisih = 0, transactions = [], expenses = [] } = st; 
        // (BARU) Ambil data 5 Grup
        const { omzet_grup0 = 0, omzet_grupS = 0, omzet_grup1 = 0, omzet_grup2 = 0, omzet_grup3 = 0, omzet_grup4 = 0, gaji_pokok_final = 0 } = st;

        const omzet = total_cash + total_qris; 
        const omzetN = n_cash + n_qris; 
        const laci = saldo_awal + total_cash - total_exp; 
        const selisihAbsV = Math.abs(selisih); 
        const selisihText = selisih === 0 ? `PAS ${IDR(selisihAbsV)}` : (selisih < 0 ? `Lebih ${IDR(selisihAbsV)}` : `Kurang ${IDR(selisihAbsV)}`); 
        const selisihCls = selisih === 0 ? 'zero' : (selisih < 0 ? 'pos' : 'neg'); 
        
        let durasi = '-'; 
        if(start_at && end_at){ try { const start = new Date(st.start_timestamp || `${date}T${start_at}`); const end = new Date(st.end_timestamp || `${date}T${end_at}`); const diffMs = end.getTime() - start.getTime(); if (!isNaN(diffMs) && diffMs > 0) { const diffMin = Math.round(diffMs / 60000); const hours = Math.floor(diffMin / 60); const minutes = Math.floor(diffMin % 60); durasi = (hours ? hours + 'j ' : '') + minutes + 'm'; } } catch(e) { console.error("Error calculating duration:", e); } } 
        
        // (BARU) Hitung total bonus final
        const bonusGrupS = omzet_grupS * BONUS_RATES.Grup0_S;
        const bonusGrup1 = omzet_grup1 * BONUS_RATES.Grup1;
        const bonusGrup2 = omzet_grup2 * BONUS_RATES.Grup2;
        const bonusGrup3 = omzet_grup3 * BONUS_RATES.Grup3;
        const bonusGrup4 = omzet_grup4 * BONUS_RATES.Grup4;
        const totalBonus = bonusGrupS + bonusGrup1 + bonusGrup2 + bonusGrup3 + bonusGrup4;
        const totalGaji = gaji_pokok_final + totalBonus;

        // Update "Ringkasan Bonus"
        if(el.kOmsetGrup0) el.kOmsetGrup0.textContent = IDR(omzet_grup0);
        if(el.kOmsetGrupS) el.kOmsetGrupS.textContent = IDR(omzet_grupS); 
        if(el.kBonusGrupS) el.kBonusGrupS.textContent = IDR(bonusGrupS); 
        if(el.kOmsetGrup1) el.kOmsetGrup1.textContent = IDR(omzet_grup1);
        if(el.kOmsetGrup2) el.kOmsetGrup2.textContent = IDR(omzet_grup2);
        if(el.kOmsetGrup3) el.kOmsetGrup3.textContent = IDR(omzet_grup3);
        if(el.kOmsetGrup4) el.kOmsetGrup4.textContent = IDR(omzet_grup4);
        
        if(el.kBonusGrup1) el.kBonusGrup1.textContent = IDR(bonusGrup1);
        if(el.kBonusGrup2) el.kBonusGrup2.textContent = IDR(bonusGrup2);
        if(el.kBonusGrup3) el.kBonusGrup3.textContent = IDR(bonusGrup3);
        if(el.kBonusGrup4) el.kBonusGrup4.textContent = IDR(bonusGrup4);
        
        if(el.kTotalBonus) el.kTotalBonus.textContent = IDR(totalBonus);
        if(el.kTotalGaji) el.kTotalGaji.textContent = IDR(totalGaji);
        
        if(el.debugGoals) el.debugGoals.textContent = IDR(totalGaji);
        
        // (BARU) HTML untuk Laporan
        el.fullReport.innerHTML=`<style>.rtitle{font-size:16pt;font-weight:bold;margin-bottom:5px;text-align:center}.header-info{font-size:10pt;text-align:center;margin-bottom:10px}.box{border:1px solid #ccc;padding:10px;margin-bottom:10px}.kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.kpi-item{margin-bottom:5px}.k .k{font-size:9pt;color:#333}.k .v{font-size:11pt;font-weight:bold}.v.pos{color:green}.v.neg{color:red}.subtle{font-size:9pt;opacity:.8}table{width:100%;border-collapse:collapse;margin-top:10px;font-size:9pt}th,td{border:1px solid #ccc;padding:4px;text-align:left}th{background:#eee}</style>
        <div class="rtitle">Laporan Harian — Percetakan 21</div>
        <div class="header-info">Tanggal: ${date} • Admin: ${CASHIER_NAME}</div>
        
        <div class="box" style="margin:8px 0">
            <div class="kpi-grid">
                <div class="kpi-item"><div class="k">Saldo Awal</div><div class="v">${IDR(saldo_awal)}</div></div>
                <div class="kpi-item"><div class="k">Cash</div><div class="v">${IDR(total_cash)} <span class="subtle">(${n_cash}x)</span></div></div>
                <div class="kpi-item"><div class="k">QRIS</div><div class="v">${IDR(total_qris)} <span class="subtle">(${n_qris}x)</span></div></div>
                <div class="kpi-item"><div class="k">Omzet (Cash+QRIS)</div><div class="v">${IDR(omzet)} <span class="subtle">(${omzetN}x)</span></div></div>
                <div class="kpi-item"><div class="k">Pengeluaran</div><div class="v">${IDR(total_exp)}</div></div>
                <div class="kpi-item"><div class="k">Uang Laci (Awal+Cash-Exp)</div><div class="v">${IDR(laci)}</div></div>
                <div class="kpi-item"><div class="k">Uang Real</div><div class="v">${IDR(uang_real)}</div></div>
                <div class="kpi-item"><div class="k">Selisih (Laci - Real)</div><div class="v ${selisihCls}">${selisihText}</div></div>
                <div class="kpi-item"><div class="k">Durasi Shift Aktual</div><div class="v">${durasi||"-"}</div></div>
            </div>
        </div>
        
        <h3>Ringkasan Gaji & Bonus</h3>
        <div class="box" style="margin:8px 0">
            <div class="kpi-grid" style="grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1.5fr;">
                <div class="kpi-item"><div class="k">Omzet Grup 0 (0%)</div><div class="v">${IDR(omzet_grup0)}</div></div>
                <div class="kpi-item"><div class="k">Omzet Grosir (1%)</div><div class="v">${IDR(omzet_grupS)}</div></div>
                <div class="kpi-item"><div class="k">Omzet Grup 1 (2.5%)</div><div class="v">${IDR(omzet_grup1)}</div></div>
                <div class="kpi-item"><div class="k">Omzet Grup 2 (5%)</div><div class="v">${IDR(omzet_grup2)}</div></div>
                <div class="kpi-item"><div class="k">Omzet Grup 3 (7.5%)</div><div class="v">${IDR(omzet_grup3)}</div></div>
                <div class="kpi-item"><div class="k">Omzet Grup 4 (10%)</div><div class="v">${IDR(omzet_grup4)}</div></div>
                
                <div class="kpi-item"><div class="k">Bonus Grosir</div><div class="v">${IDR(bonusGrupS)}</div></div>
                <div class="kpi-item"><div class="k">Bonus Grup 1</div><div class="v">${IDR(bonusGrup1)}</div></div>
                <div class="kpi-item"><div class="k">Bonus Grup 2</div><div class="v">${IDR(bonusGrup2)}</div></div>
                <div class="kpi-item"><div class="k">Bonus Grup 3</div><div class="v">${IDR(bonusGrup3)}</div></div>
                <div class="kpi-item"><div class="k">Bonus Grup 4</div><div class="v">${IDR(bonusGrup4)}</div></div>
                <div class="kpi-item"><div class="k">Total Bonus</div><div class="v" style="color:var(--ok)">${IDR(totalBonus)}</div></div>
            </div>
            <div class="kpi-grid" style="margin-top: 10px; border-top: 1px solid #ccc; padding-top: 10px; grid-template-columns: 1fr 1fr 1.5fr;">
                <div class="kpi-item"><div class="k">Gaji Pokok Final (Akurat)</div><div class="v">${IDR(gaji_pokok_final)}</div></div>
                <div class="kpi-item"><div class="k">Total Bonus</div><div class="v">${IDR(totalBonus)}</div></div>
                <div class="kpi-item"><div class="k">Total Gaji (Pokok + Bonus)</div><div class="v" style="color:var(--accent); font-size: 14pt;">${IDR(totalGaji)}</div></div>
            </div>
        </div>
        
        <h3>Detail Transaksi</h3>
        <table><thead><tr><th>Waktu</th><th>ID</th><th>Nama</th><th>Admin</th><th>Ket.</th><th>Harga</th><th>Metode</th></tr></thead><tbody>${transactions.length?transactions.map(r=>`<tr><td>${r.timestamp?.split(' ')[1]||"-"}</td><td>${r.tx_id||"-"}</td><td>${r.nama_tx||"-"}</td><td>${r.admin||"-"}</td><td>${r.ket||"-"}</td><td>${IDR(r.harga||0)}</td><td>${r.metode||"-"}</td></tr>`).join(''):'<tr><td colspan="7" style="text-align:center;opacity:.7">- Tidak ada transaksi -</td></tr>'}</tbody></table>
        <h3>Detail Pengeluaran</h3>
        <table><thead><tr><th>Waktu</th><th>Keterangan</th><th>Jumlah</th></tr></thead><tbody>${expenses.length?expenses.map(r=>`<tr><td>${r.timestamp?.split(' ')[1]||"-"}</td><td>${r.keterangan||"-"}</td><td>${IDR(r.jumlah||0)}</td></tr>`).join(''):'<tr><td colspan="3" style="text-align:center;opacity:.7">- Tidak ada pengeluaran -</td></tr>'}</tbody></table>`; 
    }
    function printReport(){ buildReport(); document.body.classList.add('print-report'); setTimeout(()=>window.print(),10); window.onafterprint=()=>{document.body.classList.remove('print-report')}}

    function addDotFormatting(element, onBlurCallback = null) { if (!element) return; element.addEventListener('focus', (e) => { const val = parseIDR(e.target.value); e.target.value = val > 0 ? val : ''; }); element.addEventListener('blur', (e) => { const val = parseIDR(e.target.value); e.target.value = val > 0 ? fmtDots(val) : ''; if (onBlurCallback) onBlurCallback(); }); }

    console.log('Core functions defined.'); console.log('Adding listeners...');

    // --- (PERUBAHAN BESAR) Event Listeners ---
    
    if(el.btnStart) el.btnStart.addEventListener('click', async () => { 
        console.log('btnStart clicked'); 
        const s = parseIDR(el.kSaldoAwal?.value); 
        if(s <= 0){ toast('Saldo Awal harus lebih dari 0'); el.kSaldoAwal?.focus(); return; } 
        if (el.jadwalModal) {
            el.jadwalModal.style.display = 'flex';
            if (el.jadwalModalInput) el.jadwalModalInput.focus();
        } else {
            alert("Modal jadwal tidak ditemukan!");
        }
    });

    if(el.jadwalModalSimpan) el.jadwalModalSimpan.addEventListener('click', async () => {
        const jadwalTutup = el.jadwalModalInput?.value.trim();
        if (!jadwalTutup || !/^\d{2}:\d{2}$/.test(jadwalTutup)) {
            toast('Format Jadwal Tutup Kas salah. Gunakan HH:MM (cth: 20:00)');
            return;
        }
        const s = parseIDR(el.kSaldoAwal?.value); 
        if(s <= 0){ toast('Saldo Awal Error'); return; } 
        if(!confirm(`Mulai shift dengan Saldo Awal ${fmtDots(s)} dan Jadwal Tutup Kas ${jadwalTutup}?`)) return; 
        if (el.jadwalModal) el.jadwalModal.style.display = 'none'; 

        const {tanggal:t,jam:j}=witaDateTime(); 
        const u={
            date:t, start_at:j, end_at:null, 
            start_timestamp:now().toISOString(), end_timestamp:null, 
            cashier:CASHIER_NAME, 
            saldo_awal:s, 
            total_cash:0, n_cash:0, total_qris:0, n_qris:0, total_exp:0, 
            uang_real:0, selisih:0, 
            transactions:[], expenses:[],
            jadwal_tutup_kas: jadwalTutup, 
            // (BARU) 5 Grup Omzet
            omzet_grup0: 0, omzet_grupS: 0, omzet_grup1: 0, omzet_grup2: 0, omzet_grup3: 0, omzet_grup4: 0, 
            gaji_pokok_final: 0 
        }; 
        
        localStorage.setItem(OPEN_KEY,t); 
        writeState(t,u); 
        applyStarted(u); 
        if(el.kSaldoAwal) el.kSaldoAwal.disabled=true; 
        refreshKPI(u); 
        
        const v=buildShiftPayloadCompat(u); 
        console.log('Queueing StartShift:',v); 
        addToQueue({ action: 'startShift', data: v });
        toast('Shift dimulai & masuk antrean kirim.');
    });

    // (PERUBAHAN BESAR) Tombol Tutup Kas (dengan Koreksi Gaji)
    if(el.btnClose) el.btnClose.addEventListener('click',async()=>{ 
        console.log('btnClose clicked'); 
        if(!isShiftActive()){toast('Shift belum dimulai.'); return;}
        const o=localStorage.getItem(OPEN_KEY); if(!o){ toast('Error: Tanggal shift tidak ditemukan!'); return; } 
        const p=readState(o); if(!p){toast('Error: State shift tidak ditemukan!'); return;}
        
        const q=parseIDR(el.kReal?.value); if(q<=0){toast('Isi Uang Real sebelum menutup kas.'); el.kReal?.focus(); return;}
        
        const r=p.saldo_awal||0; 
        const s=p.total_cash||0; 
        const t=p.total_exp||0; 
        const u=r+s-t; 
        const v=u-q; 
        
        // === (PERUBAHAN BESAR v2.8) Koreksi Gaji Final (5 Grup) ===
        const tutupTimestamp = now().toISOString();
        const gajiPokokFinal = getGajiPokokKoreksi(p, tutupTimestamp); 
        const bonusGrupS = (p.omzet_grupS || 0) * BONUS_RATES.Grup0_S;
        const bonusGrup1 = (p.omzet_grup1 || 0) * BONUS_RATES.Grup1;
        const bonusGrup2 = (p.omzet_grup2 || 0) * BONUS_RATES.Grup2;
        const bonusGrup3 = (p.omzet_grup3 || 0) * BONUS_RATES.Grup3;
        const bonusGrup4 = (p.omzet_grup4 || 0) * BONUS_RATES.Grup4;
        const totalBonusFinal = bonusGrupS + bonusGrup1 + bonusGrup2 + bonusGrup3 + bonusGrup4;
        const totalGajiFinal = gajiPokokFinal + totalBonusFinal;
        // === (AKHIR KOREKSI) ===

        if(!confirm(`TUTUP KAS?\n\n--- SALDO (Akurat) ---\nSaldo Awal: ${IDR(r)}
Total Cash: ${IDR(s)}
Pengeluaran: ${IDR(t)}
Uang Laci Seharusnya: ${IDR(u)}
Uang Real: ${IDR(q)}
Selisih: ${IDR(v)}

--- GAJI (Akurat) ---\nGaji Pokok Final: ${IDR(gajiPokokFinal)}
Total Bonus Final: ${IDR(totalBonusFinal)}
TOTAL GAJI FINAL: ${IDR(totalGajiFinal)}

Yakin tutup kas?`)) return; 
        
        const {tanggal:w,jam:x}=witaDateTime(); 
        p.end_at=x; 
        p.end_timestamp=tutupTimestamp; 
        p.uang_real=q; 
        p.selisih=v; 
        p.gaji_pokok_final = gajiPokokFinal;
        
        writeState(o,p); 
        clearOpen(); 
        applyClosed(p); 
        refreshKPI(p); 
        
        const y=buildShiftPayloadCompat(p);
        // (BARU) Kirim 3 data gaji ke sheet 'AD'
        y.gaji_pokok = gajiPokokFinal;
        y.total_bonus = totalBonusFinal;
        y.total_gaji = totalGajiFinal;
        
        console.log('Queueing CloseShift:',y); 
        addToQueue({ action: 'closeShift', data: y });
        toast('Shift ditutup & masuk antrean kirim.');
    });
    
    if(el.btnReset) el.btnReset.addEventListener('click',()=>{ if (confirm('YAKIN RESET SHIFT SAAT INI?\nSemua data transaksi dan ringkasan shift ini akan hilang.')) { const openDate = localStorage.getItem(OPEN_KEY); if(openDate) localStorage.removeItem(shiftKeyFor(openDate)); localStorage.removeItem(OPEN_KEY); localStorage.removeItem(KEY_TX_COUNTER); localStorage.removeItem(KEY_TX_DATE); toast('Shift direset. Muat ulang halaman.'); window.location.reload(); }});
    if(el.btnPrintReport) el.btnPrintReport.addEventListener('click', printReport);
    
    if(el.expSend) el.expSend.addEventListener('click',async()=>{ if(!isShiftActive()){toast('Shift belum dimulai!'); return;} const o=localStorage.getItem(OPEN_KEY); if(!o){ toast('Error: Tanggal shift tidak ditemukan!'); return; } const p=readState(o); if(!p){toast('Error: State shift tidak ditemukan!'); return;} const n=el.expNote?.value.trim(); const a=parseIDR(el.expAmount?.value); if(!n||a<=0){toast('Isi Keterangan & Jumlah pengeluaran.'); return;} const {tanggal:t,jam:j}=witaDateTime(); const q={timestamp:`${t} ${j}`,date:t,jam:j,cashier:CASHIER_NAME,keterangan:n,jumlah:a}; p.expenses=p.expenses||[]; p.expenses.push(q); p.total_exp=(p.total_exp||0)+a; writeState(o,p); refreshKPI(p); if(el.expNote) el.expNote.value=''; if(el.expAmount) el.expAmount.value=''; apiAddExpense(q); toast(`- Pengeluaran ${IDR(a)}`);});
    
    // Input Cepat (Otomatis 10% - Grup 4)
    if(el.pricePill) el.pricePill.addEventListener('wheel',e=>{ if(!el.txNama?.disabled) { e.preventDefault(); addPrice(e.deltaY<0?STEP:-STEP); }},{passive:false});
    if(el.pricePill) el.pricePill.addEventListener('dblclick',()=>{ if(!el.txNama?.disabled) setPrice(0);});
    if(el.txNama) el.txNama.addEventListener('input',updateButtonsState);
    // Hardcode Grup4 (10%) untuk Input Cepat
    if(el.addCash) el.addCash.addEventListener('click',()=>addTx('Cash',el.txNama?.value,el.txHarga?.value,el.txBarang?.value,true, 'Grup4', 'Grup 4 (10%)'));
    if(el.addQris) el.addQris.addEventListener('click',()=>addTx('QRIS',el.txNama?.value,el.txHarga?.value,el.txBarang?.value,true, 'Grup4', 'Grup 4 (10%)'));

    // Tombol Pindah Ke Nota (Otomatis 10% - Grup 4)
    if(el.btnPindahNota) el.btnPindahNota.addEventListener('click', () => {
        const nama = el.txNama?.value.trim();
        const ket = el.txBarang?.value.trim();
        const harga = parseIDR(el.txHarga?.value);
        if (!nama || harga <= 0) { toast("Isi Nama & Harga dulu."); return; }
        
        const label = ket ? `${nama} - ${ket} (Cepat)` : `${nama} (Cepat)`;
        const bonusGrade = 'Grup4'; 
        const bonusText = 'Grup 4 (10%)';
        
        el.pcBody.appendChild(makeRow(1, 1, label, harga, 1, 'Pcs', bonusGrade, bonusText));
        refreshPcTotal();
        
        if(el.txNama) el.txNama.value = ''; 
        if(el.txBarang) el.txBarang.value = ''; 
        setPrice(0); 
        if(el.txNama) el.txNama.focus();
        toast('Dipindah ke Nota (Bonus 10%)');
    });

    [el.kSaldoAwal, el.kReal].forEach(i=>{ if(i) { i.addEventListener('focus',e=>{const v=parseIDR(e.target.value); e.target.value=v>0?v:'';}); i.addEventListener('blur',e=>{const v=parseIDR(e.target.value); e.target.value=v>0?fmtDots(v):''; if(e.target.id==='kSaldoAwal'){ if(isShiftActive()){ const openDate = localStorage.getItem(OPEN_KEY); const currentState = openDate ? readState(openDate) : null; e.target.value=fmtDots(currentState?.saldo_awal||0); refreshKPI(); } } else { refreshKPI(); }}); } });
    if(el.kReal) el.kReal.addEventListener('keydown',e=>{ if(e.key==='Enter'){if(isShiftActive()){el.btnClose?.click();} else { printReport(); } }});
    if(el.expAmount) addDotFormatting(el.expAmount);

    // === Kalkulator Utama Inputs ===
    
    if(el.pcQty) el.pcQty.addEventListener('input',updateAutoHargaPrint);
    if(el.pcCopy) el.pcCopy.addEventListener('input',updateAutoHargaPrint);
    if(el.pcType) el.pcType.addEventListener('change',updateAutoHargaPrint);
    if(el.manualUnitPrice_print) addDotFormatting(el.manualUnitPrice_print);
    if(el.pcQtyPercetakan) el.pcQtyPercetakan.addEventListener('input', updateAutoHargaPercetakan);
    if(el.pcTypePercetakan) el.pcTypePercetakan.addEventListener('change', updateAutoHargaPercetakan);
    if(el.manualUnitPrice) addDotFormatting(el.manualUnitPrice);

    // (Logika Bonus Master)
    if(el.masterBonusPanel) el.masterBonusPanel.addEventListener('change', updateMasterBonusLabel);
    if(el.chkBonusS) el.chkBonusS.addEventListener('change', updateMasterBonusLabel);
    
    // Tombol Tambah Bagian 1: Print/ATK (+ P) -> OTOMATIS 10%
    if(el.pcAddRow) el.pcAddRow.addEventListener('click',()=>{
        const t=el.pcType?.value; 
        const q=parseInt(el.pcQty?.value||'0',10); 
        const c=parseInt(el.pcCopy?.value||'0',10); 
        const totalQty = c * q;
        if(totalQty<=0){toast('Jumlah Qty/Lembar harus lebih dari 0'); return;}
        let rowTotal = getTotalPrint(t, totalQty); 
        const unitName = el.autoUnit?.value || UNIT_MAP_PRINT[t] || 'File';
        
        // Hardcode Grup4 (10%) untuk Print Diskon
        const bonusGrade = 'Grup4';
        const bonusText = 'Grup 4 (10%)';

        el.pcBody.appendChild(makeRow(c, q, t, rowTotal, totalQty, unitName, bonusGrade, bonusText));
        refreshPcTotal();
    });

    // Tombol Tambah Bagian 1 Manual Print (+ MP) -> OTOMATIS 10%
    if(el.manualAdd_print) el.manualAdd_print.addEventListener('click', () => {
        const q=Math.max(1,parseInt(el.manualQty_print.value)||1),c=Math.max(1,parseInt(el.manualCopy_print.value)||1);
        const name=(el.manualName_print.value||'').trim();
        const unitPriceValue=parseIDR(el.manualUnitPrice_print.value);
        const unitName = el.manualUnit_print.value;
        if(!name||!unitPriceValue||unitPriceValue<=0){toast('Isi semua field manual print (Nama, Harga Satuan > 0)'); return;}
        const totalQty=q*c;
        let rowTotal=totalQty*unitPriceValue;
        
        // Hardcode Grup4 (10%) untuk Manual Print/ATK
        const bonusGrade = 'Grup4';
        const bonusText = 'Grup 4 (10%)';

        el.pcBody.appendChild(makeRow(c,q,`${name} (Manual)`,rowTotal,totalQty, unitName, bonusGrade, bonusText));

        el.manualQty_print.value=1;el.manualCopy_print.value=1;el.manualName_print.value='';el.manualUnitPrice_print.value='';
        refreshPcTotal();
    });

    // Tombol Tambah Bagian 2: Percetakan (+ O) -> Pakai Panel Master (Flexible)
    if(el.pcAddRowPercetakan) el.pcAddRowPercetakan.addEventListener('click',()=>{
        const t=el.pcTypePercetakan?.value; 
        const q=parseInt(el.pcQtyPercetakan?.value||'0',10); 
        const c=1;
        const totalQty = q;
        if(totalQty<=0){toast('Jumlah Qty harus lebih dari 0'); return;}
        let rowTotal = getTotalPercetakan(t, totalQty); 
        const unitName = UNIT_MAP_PERCETAKAN[t] || 'Pcs';
        
        const bonusConfig = getMasterBonusConfig(); 
        el.pcBody.appendChild(makeRow(c, q, t, rowTotal, totalQty, unitName, bonusConfig.grade, bonusConfig.text));
        refreshPcTotal();
    });
    
    // Tombol Tambah Bagian 3: Manual (+ M) -> Pakai Panel Master (Flexible)
    if(el.manualAdd) el.manualAdd.addEventListener('click',()=>{
        const q=Math.max(1,parseInt(el.manualQty.value)||1),c=Math.max(1,parseInt(el.manualCopy.value)||1);
        const name=(el.manualName.value||'').trim();
        const unitPriceValue=parseIDR(el.manualUnitPrice.value);
        const unitName = el.manualUnit.value;
        if(!name||!unitPriceValue||unitPriceValue<=0){toast('Isi semua field manual (Nama, Harga Satuan > 0)'); return;}
        const totalQty=q*c;
        let rowTotal=totalQty*unitPriceValue;
        
        const bonusConfig = getMasterBonusConfig(); 
        el.pcBody.appendChild(makeRow(c,q,`${name} (Manual)`,rowTotal,totalQty, unitName, bonusConfig.grade, bonusConfig.text));

        el.manualQty.value=1;el.manualCopy.value=1;el.manualName.value='';el.manualUnitPrice.value='';
        refreshPcTotal();
    });
    // === (AKHIR PERUBAHAN TOMBOL TAMBAH) ===

    if(el.pcBody) el.pcBody.addEventListener('click',e=>{ const btn=e.target.closest('.delPc')||e.target.closest('.btn-del-row'); if(!btn)return; btn.closest('tr').remove(); refreshPcTotal()});
    if(el.pcClear) el.pcClear.addEventListener('click', clearNota);
    
    if(el.pcSub) el.pcSub.addEventListener('click',()=>{
        subActive=!subActive;
        el.pcSub.setAttribute('aria-pressed',String(subActive));
        el.pcSub.style.background=subActive?'var(--accent)':'#dc2626';
        const pcSubText = $('#pcSubText');
        if (pcSubText) { pcSubText.style.display = subActive ? 'block' : 'none'; } // Tampilkan/sembunyikan teks diskon
        updateAutoHargaPrint();
        toast(subActive?'Mode Diskon 5% AKTIF':'Mode Diskon NONAKTIF');
    });
    
    if(el.pcPanjar) addDotFormatting(el.pcPanjar, refreshPcTotal);

    // Tombol Aksi Nota Utama (DIPERBARUI)
    if(el.pcSave){ el.pcSave.addEventListener('click', () => { 
        const t=parseIDR(el.pcTotal?.value); 
        const u=el.pcTuan?.value.trim()||'Pelanggan'; 
        if(t<=0){toast('Total Rp 0. Tidak bisa ke antrian.'); return;} 
        const s=generateOrderSummary(u); 
        
        // (BARU) Kumpulkan omzet bonus dari nota (5 Grup)
        const notaBonusOmzet = { Grup0_S: 0, Grup1: 0, Grup2: 0, Grup3: 0, Grup4: 0 };
        el.pcBody.querySelectorAll('tr').forEach(row => {
            const bonusGrade = row.dataset.bonus || 'Grup0';
            const jumlahAngka = parseFloat(row.dataset.raw || '0');
            
            if (bonusGrade === 'Grup0_S') {
                notaBonusOmzet.Grup0_S += jumlahAngka;
            } else if (bonusGrade !== 'Grup0') {
              notaBonusOmzet[bonusGrade] += jumlahAngka;
            }
        });
        
        if(el.queueBody) el.queueBody.insertAdjacentHTML('beforeend', `<tr data-nama="${u}" data-total="${t}" data-summary="${s.replace(/"/g, '&quot;')}" data-bonus-omzet='${JSON.stringify(notaBonusOmzet)}'><td>${s}</td><td>${IDR(t)}</td><td><button class="btn btn-green btn-q-cash">Cash</button><button class="btn btn-blue btn-q-qris">QRIS</button></td></tr>`); 
        updateQueueDebug(); 
        clearNota(); 
        toast('Nota masuk antrian kasir'); 
    }); } 
    
    if(el.pcQueueOrder){ el.pcQueueOrder.addEventListener('click', () => {
        const t=parseIDR(el.pcTotal?.value);
        if(t<=0){toast('Total Rp 0. Tidak bisa ditampung.'); return;}
        if (el.pendingOrderModal) {
            el.pendingOrderModal.dataset.saveMode = 'pending'; 
            el.pendingModalWaktu.value = '2';
            el.pendingModalTanggal.value = getTomorrowDMY();
            el.pendingOrderModal.style.display = 'flex';
            el.pendingModalTanggal.focus();
        }
    }); }

    if(el.pcSaveDirect) {
        el.pcSaveDirect.addEventListener('click', () => {
            const t=parseIDR(el.pcTotal?.value);
            if(t<=0){toast('Total Rp 0. Tidak bisa disimpan.'); return;}
            if (el.pendingOrderModal) {
                el.pendingOrderModal.dataset.saveMode = 'direct'; 
                el.pendingModalWaktu.value = '2';
                el.pendingModalTanggal.value = getTomorrowDMY();
                el.pendingOrderModal.style.display = 'flex';
                el.pendingModalTanggal.focus();
            }
        });
    }

    if(el.pendingModalBatal) { el.pendingModalBatal.addEventListener('click', () => { if (el.pendingOrderModal) { el.pendingOrderModal.style.display = 'none'; el.pendingOrderModal.dataset.saveMode = ''; } }); }

    // (PERUBAHAN BESAR) Listener Simpan Modal (DIPERBARUI untuk bonus)
    if(el.pendingModalSimpan) { 
        el.pendingModalSimpan.addEventListener('click', async () => { 
            const waktuKey = el.pendingModalWaktu?.value || '2';
            const tanggalInput = el.pendingModalTanggal?.value.trim();
            const waktuString = WAKTU_MAP[waktuKey] || 'Siang';
            if (!tanggalInput || !/^\d{2}-\d{2}-\d{2}$/.test(tanggalInput)) { toast("Format tanggal salah. Gunakan DD-MM-YY."); return; }
            let janjiSelesai = `${waktuString}, ${tanggalInput}`;
            let hariString = '';
            try {
                const parts = tanggalInput.split('-');
                if(parts.length === 3) {
                    const dP = parseInt(parts[0], 10); const mP = parseInt(parts[1], 10) - 1; const yP = 2000 + parseInt(parts[2], 10);
                    if(!isNaN(dP) && !isNaN(mP) && !isNaN(yP)) {
                        const dateObj = new Date(yP, mP, dP);
                        if (dateObj && dateObj.getDate() === dP && dateObj.getMonth() === mP && dateObj.getFullYear() === yP) {
                            hariString = HARI_NAMA[dateObj.getDay()];
                            janjiSelesai = `${hariString} ${waktuString}, ${tanggalInput}`;
                        } else { toast("Tanggal tidak valid."); return; }
                    } else { toast("Gagal proses tanggal."); return; }
                } else { toast("Format tanggal salah."); return; }
            } catch (e) { toast("Error proses tanggal."); return; }

            const saveMode = el.pendingOrderModal.dataset.saveMode || 'pending';
            if (el.pendingOrderModal) {
                el.pendingOrderModal.style.display = 'none';
                el.pendingOrderModal.dataset.saveMode = ''; 
            }

            // (BARU) Ambil data nota lengkap DARI KALKULATOR (termasuk bonus)
            const t=parseIDR(el.pcTotal?.value);
            const u=el.pcTuan?.value.trim()||'Pelanggan';
            const s=generateOrderSummary(u);
            const p=parseIDR(el.pcPanjar?.value);
            const i=parseIDR(el.pcSisa?.value);
            const l=el.chkLunas?.checked;
            const d_temp={ tuan:u, noHP:el.pcNoHP?.value || '-', catatan:el.pcCatatan?.value || '-', lunas:l, panjar:p, sisa:i, total:t, janjiSelesai: janjiSelesai, items:[] };
            if(el.pcBody) {
                el.pcBody.querySelectorAll('tr').forEach(r=>{
                    d_temp.items.push({
                        copy: r.dataset.copy || '1', 
                        qty: r.dataset.qty || '1', 
                        label: r.cells[2]?.textContent.split(' [Grup')[0] || 'N/A', // Hapus text bonus
                        unit: r.cells[3]?.textContent || 'Pcs', 
                        total: r.dataset.raw || '0', 
                        harga_satuan: parseIDR(r.cells[4]?.textContent || '0'), 
                        jumlah: parseIDR(r.cells[5]?.textContent || '0'),
                        bonus: r.dataset.bonusText || 'Grup 0 (0%)' // (BARU) Simpan teks grup bonus
                    });
                });
            }
            if (!d_temp.tuan || d_temp.total <= 0) {
                toast("Error: Data nota tidak valid saat menyimpan.");
                return;
            }

            if (saveMode === 'pending') {
                let st='BELUM BAYAR'; let sc='var(--danger)';
                if(d_temp.lunas){st='LUNAS'; sc='var(--ok)';}
                else if(d_temp.panjar>0){st=`Panjar ${fmtDots(d_temp.panjar)}`; sc='var(--warn)';}
                const li=document.createElement('li');
    li.innerHTML=`<div style="padding: 8px; border-bottom: 1px solid var(--line); display:flex; justify-content:space-between; align-items:center;"><div><b>${d_temp.tuan}</b> (${IDR(d_temp.total)}) - <span style="color:${sc};">${st}</span><br><small style="color:var(--accent); font-weight:bold;">Janji: ${d_temp.janjiSelesai}</small><br><small>${s}</small></div><div><button class="btn btn-green btn-pending-balik" style="padding:4px 8px;font-size:11px;">BALIK</button><button class="btn btn-danger btn-pending-cancel" style="padding:4px 8px;font-size:11px;">Batal</button><button class="btn btn-blue btn-pending-save" style="padding:4px 8px;font-size:11px;">Simpan</button></div></div>`;
                li.dataset.nota=JSON.stringify(d_temp);
                if(el.pendingOrderList) el.pendingOrderList.appendChild(li);
                updateQueueDebug();
                clearNota(); 
                toast('Orderan ditampung di antrian pending');

            } else if (saveMode === 'direct') {
                const result = await saveCalcToSheet(janjiSelesai);
                if (result.ok) {
                    clearNota(); 
                }
            }
        });
    }

    if(el.pendingOrderList) { el.pendingOrderList.addEventListener('click', async (e) => {
        const li = e.target.closest('li'); if (!li || !li.dataset.nota) return; const d = JSON.parse(li.dataset.nota);
        if (e.target.classList.contains('btn-pending-cancel')) { if (confirm(`Yakin batalkan orderan pending untuk ${d.tuan}?`)) { li.remove(); updateQueueDebug(); toast('Orderan pending dibatalkan'); }
        } else if (e.target.classList.contains('btn-pending-balik')) {
            if (!confirm(`Balikkan data order ${d.tuan} ke kalkulator?\nNota saat ini akan dibersihkan.`)) return;
            loadNotaDataToCalculator(d); 
            toast(`Data ${d.tuan} dimuat kembali.`);
        } else if (e.target.classList.contains('btn-pending-save')) {
            if (!confirm(`Simpan orderan ${d.tuan} (${IDR(d.total)}) ke Spreadsheet?\nJanji Selesai: ${d.janjiSelesai}`)) return;
            loadNotaDataToCalculator(d);
            const result=await saveCalcToSheet(d.janjiSelesai || null); 
            if(result.ok){
                toast(`Orderan ${d.tuan} berhasil disimpan.`);
                li.remove(); updateQueueDebug();
            } else {
                toast(`GAGAL menyimpan orderan ${d.tuan}! Cek log/koneksi.`);
            }
        }
    }); } 

    // (PERUBAHAN BESAR) Listener Antrian Kasir (DIPERBARUI untuk 5 Grup Bonus)
    if(el.queueBody) { el.queueBody.addEventListener('click', async (e) => { 
        const r=e.target.closest('tr'); if (!r) return; 
        const n=r.dataset.nama; 
        const t=r.dataset.total; 
        const s=r.dataset.summary; 
        const bonusOmzet = JSON.parse(r.dataset.bonusOmzet || '{}');
        let m=''; 
        if(e.target.classList.contains('btn-q-cash')){m='Cash';} 
        else if(e.target.classList.contains('btn-q-qris')){m='QRIS';} 
        
        if(m){ 
            // (BARU) Panggil addTx dari antrian
            await addTxFromQueue(m, n, t, s, bonusOmzet); 
            r.remove(); 
            updateQueueDebug();
        } 
    }); } 

    // (PERUBAHAN BESAR v2.8) Fungsi addTxFromQueue (BARU)
    const addTxFromQueue = async (method, nama_tx, harga_tx, barang_tx, bonusOmzet) => {
        if (!isShiftActive()) { toast('Shift belum dimulai!'); return; }
        const openDate = localStorage.getItem(OPEN_KEY); if (!openDate) { toast('Error: Shift date not found!'); return; }
        const st = readState(openDate); if (!st) { toast('Error: Shift state not found!'); return; }
        const { tanggal, jam } = witaDateTime(); const harga = parseIDR(harga_tx);
        
        const payload = { 
            timestamp: `${tanggal} ${jam}`, 
            tx_id: `${TX_ID_PREFIX}-${nextTxNumber()}`, 
            nama_tx: nama_tx, 
            admin: CASHIER_NAME, 
            ket: barang_tx || '-', 
            harga: harga, 
            metode: method,
            bonus_grade: 'Multi-Grup (dari Nota)' // Kirim teks ini
        };
        
        if (el.txBody) { el.txBody.insertAdjacentHTML('afterbegin', `<tr><td>${payload.timestamp}</td><td>${payload.tx_id}</td><td>${payload.nama_tx}</td><td>${payload.admin}</td><td>${payload.ket}</td><td data-val="${payload.harga}">${IDR(payload.harga)}</td><td>${payload.metode}</td></tr>`); } 
        
        st.transactions = st.transactions || []; 
        st.transactions.unshift(payload);
        
        if (method === 'Cash') { st.total_cash = (st.total_cash || 0) + harga; st.n_cash = (st.n_cash || 0) + 1; }
        else if (method === 'QRIS') { st.total_qris = (st.total_qris || 0) + harga; st.n_qris = (st.n_qris || 0) + 1; }
        
        // (PERUBAHAN) Panggil addBonusOmzet dengan 5 Grup
        addBonusOmzet(st, 
            bonusOmzet.Grup0_S || 0, // BARU
            bonusOmzet.Grup1 || 0,
            bonusOmzet.Grup2 || 0,
            bonusOmzet.Grup3 || 0,
            bonusOmzet.Grup4 || 0
        ); 
        
        apiAddTx(payload);
        toast(`+ ${method} ${IDR(harga)} (dari antrian)`);
    };

    const chkLunasElem=$('#chkLunas'),paidStampElem=$('#paidStamp'); if(chkLunasElem&&paidStampElem){chkLunasElem.addEventListener('change',()=>{paidStampElem.style.display=chkLunasElem.checked?'block':'none'; updatePaymentStatus();})}
    
    (function(){ const s=$('#splitter'); if (!s) return; const c=$('.container'); if (!c) return; let d=!1; s.addEventListener('mousedown',()=>{d=!0; document.body.style.cursor='col-resize'; document.body.style.userSelect='none';}); document.addEventListener('mouseup',()=>{d=!1; document.body.style.cursor='default'; document.body.style.userSelect='auto';}); document.addEventListener('mousemove',(e)=>{ if(!d) return; e.preventDefault(); const r=c.getBoundingClientRect(); const l=e.clientX-r.left; const w=r.right-e.clientX; if (l>280&&w>320){c.style.setProperty('--col-left',`${l}px`); c.style.setProperty('--col-right',`${w}px`);}}); })();
    
    const imageInput = $('#imageFileInput'); const imageDisplay = $('#uploadedImageDisplay'); const uploadPlaceholder = $('#uploadPlaceholder'); const clearImageButton = $('#clearImageButton'); const imageStorageKey = `p21_receipt_image_${CASHIER_KEY}`;
    function displayUploadedImage(base64Data) { if (base64Data && imageDisplay && uploadPlaceholder && clearImageButton) { imageDisplay.src = base64Data; imageDisplay.style.display = 'block'; if(uploadPlaceholder) uploadPlaceholder.style.display = 'none'; if(clearImageButton) clearImageButton.style.display = 'inline'; } else if (imageDisplay && uploadPlaceholder && clearImageButton) { imageDisplay.src = ''; imageDisplay.style.display = 'none'; if(uploadPlaceholder) uploadPlaceholder.style.display = 'inline'; if(clearImageButton) clearImageButton.style.display = 'none'; } }
    const savedImage = localStorage.getItem(imageStorageKey); displayUploadedImage(savedImage);
    if (imageInput) { imageInput.addEventListener('change', (event) => { const file = event.target.files?.[0]; if (file && file.type.startsWith('image/')) { const reader = new FileReader(); reader.onload = (e) => { const base64Data = e.target?.result; if(typeof base64Data === 'string'){ displayUploadedImage(base64Data); localStorage.setItem(imageStorageKey, base64Data); toast('Gambar nota disimpan di browser.'); } else { toast('Gagal membaca data gambar.'); } }; reader.onerror = () => { toast('Gagal membaca file gambar.'); displayUploadedImage(null); localStorage.removeItem(imageStorageKey); }; reader.readAsDataURL(file); } else if (file) { toast('Format file tidak didukung.'); } imageInput.value = ''; }); } 
    if (clearImageButton) { clearImageButton.addEventListener('click', () => { if (confirm('Hapus gambar nota?')) { localStorage.removeItem(imageStorageKey); displayUploadedImage(null); toast('Gambar nota dihapus.'); } }); }
    
    const headerLogoInput = el.headerLogoInput; const headerLogoDisplay = el.headerLogoDisplay; const headerLogoText = el.headerLogoText; const headerLogoStorageKey = `p21_header_logo_${CASHIER_KEY}`;
    function displayHeaderLogo(base64Data) { if(headerLogoDisplay && headerLogoText) { if(base64Data) { headerLogoDisplay.src = base64Data; headerLogoDisplay.style.display = 'block'; headerLogoText.style.display = 'none'; } else { headerLogoDisplay.src = ''; headerLogoDisplay.style.display = 'none'; headerLogoText.style.display = 'block'; } } }
    const savedHeaderLogo = localStorage.getItem(headerLogoStorageKey); displayHeaderLogo(savedHeaderLogo);
    if (headerLogoInput) { headerLogoInput.addEventListener('change', (event) => { const file = event.target.files?.[0]; if (file && file.type.startsWith('image/')) { const reader = new FileReader(); reader.onload = (e) => { const base64Data = e.target?.result; if(typeof base64Data === 'string'){ displayHeaderLogo(base64Data); localStorage.setItem(headerLogoStorageKey, base64Data); toast('Logo disimpan.'); } else { toast('Gagal baca logo.'); } }; reader.onerror = () => { toast('Gagal baca file logo.'); displayHeaderLogo(null); localStorage.removeItem(headerLogoStorageKey); }; reader.readAsDataURL(file); } else if (file) { toast('Format file logo tidak didukung.'); } headerLogoInput.value = ''; }); } 
    if(headerLogoDisplay?.parentElement) { headerLogoDisplay.parentElement.addEventListener('dblclick', () => { if(localStorage.getItem(headerLogoStorageKey) && confirm('Hapus logo tersimpan?')) { localStorage.removeItem(headerLogoStorageKey); displayHeaderLogo(null); toast('Logo dihapus.'); } }); }
    
    (function enableLeaveGuard(){ function shouldGuard(){try{if(document.body.classList.contains('print-report'))return false;var open=localStorage.getItem(OPEN_KEY);var active=false;if(open){var st=readState(open);active=!!(st&&st.start_at&&!st.end_at)}var hasCalcRows=!!(el.pcBody&&el.pcBody.children&&el.pcBody.children.length>0);var hasQueueItems = el.queueBody?.children.length > 0; var hasPendingItems = el.pendingOrderList?.querySelectorAll('li:not(#pendingOrderPlaceholder)').length > 0; return active||hasCalcRows||hasQueueItems||hasPendingItems}catch(e){return false}}window.addEventListener('beforeunload',function(e){if(!shouldGuard())return;var msg="Ada data yang belum disimpan atau shift aktif. Yakin ingin keluar?";e.preventDefault();e.returnValue=msg; return msg})})();

    console.log('Listeners added.'); console.log('Finalizing init...');

    [el.kSaldoAwal, el.kReal].forEach(i=>{ if(i) { i.addEventListener('focus',e=>{const v=parseIDR(e.target.value); e.target.value=v>0?v:'';}); i.addEventListener('blur',e=>{const v=parseIDR(e.target.value); e.target.value=v>0?fmtDots(v):''; if(e.target.id==='kSaldoAwal'){ if(isShiftActive()){ const openDate = localStorage.getItem(OPEN_KEY); const currentState = openDate ? readState(openDate) : null; e.target.value=fmtDots(currentState?.saldo_awal||0); refreshKPI(); } } else { refreshKPI(); }}); } });

    const openDateInit = localStorage.getItem(OPEN_KEY);
    if (openDateInit) {
        const currentState = readState(openDateInit);
        if (currentState && !currentState.end_at) {
            if(el.kSaldoAwal) {el.kSaldoAwal.value = fmtDots(currentState.saldo_awal || 0); el.kSaldoAwal.disabled = true;}
            if(el.kTotalExp) el.kTotalExp.textContent = IDR(currentState.total_exp || 0);
            refreshKPI(currentState);
        } else if (currentState && currentState.end_at) {
            if(el.kTotalExp) el.kTotalExp.textContent = IDR(currentState.total_exp || 0);
            if(el.kReal) el.kReal.value = fmtDots(currentState.uang_real || 0);
            refreshKPI(currentState);
            if(el.kSaldoAwal) el.kSaldoAwal.value = ''; 
        }
    } else {
        refreshKPI(null);
    }

    updateWitaTime();
    if (el.txHarga) setPrice(+el.txHarga.value || 0); else setPrice(0);
    updateAutoHargaPrint();
    updateAutoHargaPercetakan(); 
    updatePaymentStatus(); 
    refreshPcTotal();
    console.log('Calling initShift...'); initShift(); updateButtonsState();

    // (PERUBAHAN v2.7) Set default satuan ke "Pcs"
    if (el.manualUnit) {
        SATUAN_LIST.forEach(satuan => {
            const option = document.createElement('option');
            option.value = satuan;
            option.textContent = satuan;
            if (satuan === 'Pcs') { option.selected = true; }
            el.manualUnit.appendChild(option);
        });
    }

    if (el.manualUnit_print) {
        SATUAN_LIST.forEach(satuan => {
            const option = document.createElement('option');
            option.value = satuan;
            option.textContent = satuan;
            if (satuan === 'Pcs') { option.selected = true; }
            el.manualUnit_print.appendChild(option);
        });
    }

    // (LOGIKA DEFAULT FINAL) Set default centang panel bonus saat load: HANYA Grup S
    if(el.chkBonus1) el.chkBonus1.checked = false;
    if(el.chkBonus2) el.chkBonus2.checked = false;
    if(el.chkBonus3) el.chkBonus3.checked = false;
    if(el.chkBonus4) el.chkBonus4.checked = false;
    if(el.chkBonusS) el.chkBonusS.checked = true; // DEFAULT: BONUS INPUT & barang grosir (1%)
    updateMasterBonusLabel();
    
    console.log('Script init complete.');
    
  } catch (err) { 
    console.error("Fatal Error during script initialization:", err);
    document.body.innerHTML = `<div style="padding:20px;color:red;font-family:sans-serif;"><h1>Error Aplikasi</h1><p>Gagal memuat aplikasi. Cek console (F12) untuk detail.</p><p>Error: ${err.message}</p><pre>${err.stack}</pre></div>`;
    alert("Fatal Error: " + err.message + "\nCek console (F12) untuk detail.");
  }

try {
    console.log('Menyiapkan listener untuk Print Banyak...');
    function syncPrintBanyak() {
        const totalHargaStr = localStorage.getItem('PRINT_TOTAL_HARGA') || '0';
        const totalFileStr = localStorage.getItem('PRINT_TOTAL_FILE') || '0';
        const totalHarga = parseInt(totalHargaStr, 10);
        const totalFile = parseInt(totalFileStr, 10);

        if (totalHarga > 0 && totalFile > 0) {
            if (el.manualName_print && el.manualUnitPrice_print) {
                el.manualName_print.value = `Print Banyak (${totalFile} File)`;
                el.manualUnitPrice_print.value = totalHarga; 
                toast(`Data Print Banyak (Rp ${totalHarga}) siap di-input.`);
                if (typeof fmtDots === 'function') {
                     el.manualUnitPrice_print.value = fmtDots(totalHarga);
                }
                localStorage.removeItem('PRINT_TOTAL_HARGA');
                localStorage.removeItem('PRINT_TOTAL_FILE');
                localStorage.removeItem('PRINT_DATA_UPDATED_SIGNAL');

            } else if (el.manualName && el.manualUnitPrice) {
                el.manualName.value = `Print Banyak (${totalFile} File)`;
                el.manualUnitPrice.value = totalHarga; 
                toast(`Data Print Banyak (Rp ${totalHarga}) siap di-input.`);
                if (typeof fmtDots === 'function') {
                     el.manualUnitPrice.value = fmtDots(totalHarga);
                }
                localStorage.removeItem('PRINT_TOTAL_HARGA');
                localStorage.removeItem('PRINT_TOTAL_FILE');
                localStorage.removeItem('PRINT_DATA_UPDATED_SIGNAL');
            }
        }
    }
    window.addEventListener('storage', (event) => {
        if (event.key === 'PRINT_DATA_UPDATED_SIGNAL') {
            console.log('Sinyal Print Banyak diterima!');
            syncPrintBanyak();
        }
    });
    syncPrintBanyak(); 
    console.log('Listener Print Banyak AKTIF.');
} catch (e) {
    console.error('Gagal memasang listener Print Banyak:', e);
}

setInterval(updateWitaTime, 1000);

});
// --- JAVASCRIPT LENGKAP SELESAI ---