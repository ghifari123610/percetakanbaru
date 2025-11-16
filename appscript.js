// --- KODE APPS SCRIPT DENGAN PERBAIKAN SHEET 'AD', 'TR', 'OR' ---

// Nama tab disesuaikan dengan screenshot Anda
const NAMA_SHEET_TRANSAKSI = "TR";
const NAMA_SHEET_ORDER = "OR";
const NAMA_SHEET_PENGELUARAN = "PE";
const NAMA_SHEET_SHIFT = "AD";
const WARNA_BACKGROUND_BARU = "#eeeeee"; // Warna abu-abu muda
const WARNA_FONT_BARU = "#000000";       // Warna hitam

// --- FUNGSI UTAMA (DIPERBARUI) ---
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (!action) {
      throw new Error("No action specified");
    }

    // Arahkan data berdasarkan 'action'
    switch (action) {
      case 'addTransaction':
        handleTransaction(data.data);
        break;
      case 'addOrder':
        handleOrder(data.data);
        break;
      case 'addExpense':
        handleExpense(data.data);
        break;
      // PERBAIKAN: 'action' sekarang dikirim ke handleShift
      case 'startShift':
      case 'closeShift':
        handleShift(data.data, action); // <-- 'action' ditambahkan di sini
        break;
      default:
        throw new Error("Unknown action: " + action);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success", action: action })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log(error);
    try {
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LOG_ERROR").appendRow([new Date(), error.message, error.stack, e.postData.contents]);
    } catch (e2) {}
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

// --- FUNGSI HELPER (Format Baris) ---
function formatNewRow(sheet, startRow, numRows, numCols) {
  const range = sheet.getRange(startRow, 1, numRows, numCols);
  range.setFontSize(12);
  range.setFontColor(WARNA_FONT_BARU);
  range.setBackground(WARNA_BACKGROUND_BARU);
  range.setBorder(true, true, true, true, true, true, "#000000", null);
}

// --- FUNGSI PENANGAN DATA ---

// Menangani sheet 'TR' (TRANSAKSI) - *** DIPERBARUI ***
function handleTransaction(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(NAMA_SHEET_TRANSAKSI);
  const numCols = 8; // Diubah dari 7 menjadi 8
  
  if (sheet.getLastRow() === 0) {
    // Pastikan header di G1 adalah "Grup Bonus"
    sheet.appendRow(["Timestamp", "Admin", "Kode Transaksi", "Nama Transaksi", "Keterangan", "Harga", "Metode", "Grup Bonus"]); 
  }
  
  const rowData = [
    data.timestamp, 
    data.admin, 
    data.tx_id, 
    data.nama_tx, 
    data.ket, 
    data.harga, 
    data.metode,
    data.bonus_grade // <-- DATA BARU DARI HTML
  ];
  
  sheet.insertRows(2, 1);
  sheet.getRange(2, 1, 1, numCols).setValues([rowData]);
  formatNewRow(sheet, 2, 1, numCols);
}

// Menangani sheet 'OR' (ORDERAN) - *** DIPERBARUI ***
function handleOrder(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(NAMA_SHEET_ORDER);
  const numCols = 16; // Diubah dari 15 menjadi 16
  
  if (sheet.getLastRow() === 0) {
    // Pastikan header di J1 adalah "Grup Bonus"
    sheet.appendRow([
      "TUAN", "NOMOR HP", "TGL MASUK", "JANJI SELESAI", "RANGKAP", "QTY", 
      "JENIS PESANAN", "HARGA SATUAN", "JUMLAH", "GRUP BONUS", // <-- HEADER BARU DI SINI
      "TOTAL", "PANJAR", "SISA", "Status Pembayaran", "SELESAI", "CATATAN"
    ]);
  }
  
  const items = data.items || [];
  const numItems = items.length;
  
  if (numItems === 0) {
    // Jika tidak ada item (jarang terjadi, tapi untuk jaga-jaga)
    const rowData = new Array(numCols).fill("");
    rowData[0] = data.nama_tx; rowData[1] = data.no_hp; rowData[2] = data.timestamp; rowData[3] = data.janji_selesai;
    
    // Geser kolom
    rowData[10] = data.harga; rowData[11] = data.panjar; rowData[12] = data.sisa; rowData[13] = data.metode; rowData[14] = ""; rowData[15] = data.ket;
    
    sheet.insertRows(2, 1);
    sheet.getRange(2, 1, 1, numCols).setValues([rowData]);
    formatNewRow(sheet, 2, 1, numCols);
    
  } else {
    // Jika ada item
    const allRowData = []; 
    for (let i = 0; i < numItems; i++) {
      const item = items[i];
      const rowData = new Array(numCols).fill(""); 
      
      rowData[4] = item.rangkap; 
      rowData[5] = item.qty; 
      rowData[6] = item.jenis || 'N/A'; 
      rowData[7] = item.harga_satuan; 
      rowData[8] = item.jumlah;
      rowData[9] = item.bonus_grade; // <-- DATA BARU DARI HTML
      
      if (i === 0) {
        rowData[0] = data.nama_tx; rowData[1] = data.no_hp; rowData[2] = data.timestamp; rowData[3] = data.janji_selesai;
      }
      
      if (i === numItems - 1) {
        // Geser kolom
        rowData[10] = data.harga; rowData[11] = data.panjar; rowData[12] = data.sisa; rowData[13] = data.metode; rowData[14] = ""; rowData[15] = data.ket;
      }
      allRowData.push(rowData);
    }
    sheet.insertRows(2, numItems);
    sheet.getRange(2, 1, numItems, numCols).setValues(allRowData);
    formatNewRow(sheet, 2, numItems, numCols);
  }
}

// Menangani sheet 'PE' (PENGELUARAN) - TIDAK BERUBAH
function handleExpense(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(NAMA_SHEET_PENGELUARAN);
  const numCols = 6; 
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Date", "Jam", "Cashier", "Keterangan", "Jumlah"]);
  }
  const rowData = [
    data.timestamp, data.date, data.jam, data.cashier, data.keterangan, data.jumlah
  ];
  sheet.insertRows(2, 1);
  sheet.getRange(2, 1, 1, numCols).setValues([rowData]);
  formatNewRow(sheet, 2, 1, numCols);
}

// Menangani sheet 'AD' (ADMIN/SHIFT) - *** DIPERBAIKI & DIPERBARUI ***
function handleShift(data, action) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(NAMA_SHEET_SHIFT);
  const numCols = 9; // Diubah menjadi 9

  if (sheet.getLastRow() === 0) {
    // Pastikan header G, H, I sudah benar
    sheet.appendRow([
      "Date", "Cashier", "Level", "Jam_Mulai", "Jam_Tutup", 
      "Durasi_Jualan", "Gaji Pokok", "Total Bonus", "Total Gaji"
    ]);
  }

  if (action === 'startShift') {
    // 1. Jika 'startShift', selalu buat baris baru
    const rowData = [
      data.date, 
      data.cashier, 
      data.levelAdmin, 
      data.jam_mulai, 
      "", "", "", "", "" // Sisakan 9 kolom kosong
    ];
    sheet.insertRows(2, 1);
    sheet.getRange(2, 1, 1, numCols).setValues([rowData]);
    formatNewRow(sheet, 2, 1, numCols);

  } else if (action === 'closeShift') {
    // 2. Jika 'closeShift', cari baris yang cocok untuk di-update
    
    // Ambil semua data (kecuali header)
    const dataRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5); // Kolom A-E
    const values = dataRange.getValues();
    let foundRow = -1;

    // Cari dari baris TERATAS (baris terbaru)
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      
      // Cek Tanggal (Kolom A)
      let sheetDateStr = "";
      if (row[0] instanceof Date) {
        sheetDateStr = Utilities.formatDate(row[0], Session.getScriptTimeZone(), "yyyy-MM-dd");
      } else {
        sheetDateStr = String(row[0]).split(" ")[0]; // Ambil bagian tanggal saja
      }

      const sheetCashier = row[1]; // Kolom B (Cashier)
      const sheetJamTutup = row[4]; // Kolom E (Jam_Tutup)

      // Kriteria: Tanggal cocok, Cashier cocok, DAN Jam_Tutup masih kosong
      if (sheetDateStr === data.date && sheetCashier === data.cashier && sheetJamTutup === "") {
        foundRow = i + 2; // (i adalah index array (mulai dari 0), +2 karena data mulai dari baris 2)
        break; // Hentikan pencarian jika sudah ketemu
      }
    }

    if (foundRow !== -1) {
      // 3. Ketemu! Update kolom E, G, H, dan I
      sheet.getRange(foundRow, 5).setValue(data.jam_tutup);  // Kolom E
      sheet.getRange(foundRow, 7).setValue(data.gaji_pokok); // Kolom G (Gaji Pokok)
      sheet.getRange(foundRow, 8).setValue(data.total_bonus); // Kolom H (Total Bonus)
      sheet.getRange(foundRow, 9).setValue(data.total_gaji);  // Kolom I (Total Gaji)
      
      formatNewRow(sheet, foundRow, 1, numCols);
      
    } else {
      // 4. Tidak ketemu baris 'startShift' (Error/kasus aneh).
      // Untuk mencegah data hilang, buat saja baris baru (seperti perilaku lama)
      const rowData = [
        data.date, data.cashier, data.levelAdmin, data.jam_mulai,
        data.jam_tutup, 
        "", // Durasi
        data.gaji_pokok,  // G
        data.total_bonus, // H
        data.total_gaji   // I
      ];
      sheet.insertRows(2, 1);
      sheet.getRange(2, 1, 1, numCols).setValues([rowData]);
      formatNewRow(sheet, 2, 1, numCols);
    }
  }
}