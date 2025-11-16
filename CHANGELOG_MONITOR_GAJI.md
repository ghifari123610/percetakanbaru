# Perubahan pada Monitor Page - Tabel Gaji Kasir Angel

## File yang Diubah:

### 1. monitor.html
**Penambahan:**
- Section baru untuk tabel gaji kasir Angel setelah tabel transaksi
- ID tabel: `salaryTable` 
- Filter controls: `salary-filter` dengan opsi periode (Hari Ini, Pekan Ini, Bulan Ini, Semua)

**Struktur Tabel:**
```html
<table id="salaryTable">
    <thead>
        <tr>
            <th>Tanggal</th>
            <th>Jam Mulai</th>
            <th>Jam Tutup</th>
            <th>Durasi</th>
            <th>Gaji Pokok</th>
            <th>Total Bonus</th>
            <th>Total Gaji</th>
        </tr>
    </thead>
    <tbody><!-- Data akan diisi oleh JavaScript --></tbody>
</table>
```

### 2. javascript/monitor.js
**Penambahan:**

#### a. Element References (baris ~12)
```javascript
const salaryTableBody = document.querySelector('#salaryTable tbody');
const salaryFilter = document.getElementById('salary-filter');
```

#### b. Fungsi renderSalary (baris ~154-209)
- Menampilkan data shift dengan perhitungan durasi kerja
- Format durasi: "Xj Ym" (contoh: "8j 30m")
- Menghitung total Gaji Pokok, Total Bonus, dan Total Gaji
- Menambahkan baris TOTAL di akhir tabel dengan styling khusus

#### c. Update fetchData (baris ~69-94)
- Menambahkan logika untuk menggunakan parameter 'cashier' untuk endpoint 'shifts'
- Parameter 'admin' untuk endpoint lainnya

#### d. Update loadAllData (baris ~404-414)
```javascript
await Promise.all([
    // ... existing calls
    fetchData('shifts', salaryTableBody, renderSalary, 'Angel', salaryPeriod),
    // ... existing calls
]);
```

#### e. Setup Filter Controls (baris ~419)
```javascript
setupFilterControls(salaryFilter, (period) => 
    fetchData('shifts', salaryTableBody, renderSalary, 'Angel', period)
);
```

### 3. css/monitor.css
**Penambahan:**
```css
#salaryTable tbody tr:last-child {
    border-top: 2px solid var(--accent);
}

#salaryTable tbody tr:last-child td {
    font-weight: 700;
    color: var(--accent);
}
```
Styling khusus untuk baris TOTAL pada tabel gaji.

## Fitur yang Ditambahkan:

1. **Tabel Gaji Dinamis**
   - Menampilkan semua shift dari kasir Angel
   - Auto-refresh sesuai filter periode

2. **Perhitungan Otomatis**
   - Durasi kerja (jam & menit)
   - Total Gaji Pokok per periode
   - Total Bonus per periode
   - Grand Total Gaji per periode

3. **Filter Periode**
   - Hari Ini
   - Pekan Ini
   - Bulan Ini
   - Semua Data

4. **Integrasi dengan Backend**
   - Menggunakan endpoint: `GET /api/shifts?cashier=Angel&startDate=...&endDate=...`
   - Mengambil data dari MongoDB collection 'shifts'

## Testing:
- Buka `test-monitor.html` untuk memverifikasi semua perubahan berhasil
- Atau langsung buka `monitor.html` untuk melihat tabel gaji baru

## Catatan:
- Data gaji akan muncul setelah kasir melakukan "Tutup Shift" dari halaman index.html
- Tabel hanya menampilkan shift yang sudah complete (memiliki jam_tutup)
- Format mata uang menggunakan IDR dengan pemisah ribuan
