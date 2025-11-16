document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.jspdf === 'undefined') {
        console.error('jsPDF not loaded!');
        alert('Gagal memuat komponen PDF. Silakan refresh halaman.');
        return;
    }
    const { jsPDF } = window.jspdf;

    // --- ELEMENT REFS ---
    const refreshBtn = document.getElementById('refreshBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const transactionsTableBody = document.querySelector('#transactionsTable tbody');
    const salaryTableBody = document.querySelector('#salaryTable tbody');
    const ownerTransactionsTableBody = document.querySelector('#ownerTransactionsTable tbody');
    const ordersTableBody = document.querySelector('#ordersTable tbody');
    const transactionsFilter = document.getElementById('transactions-filter');
    const salaryFilter = document.getElementById('salary-filter');
    const ownerTransactionsFilter = document.getElementById('owner-transactions-filter');
    const ordersFilter = document.getElementById('orders-filter');

    // --- CONSTANTS & HELPERS ---
    const API_BASE_URL = '';
    const IDR = n => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.max(0, Math.round(n || 0)));
    const pad = (num) => num.toString().padStart(2, '0');
    const formatDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;



    // --- DATE LOGIC ---
    function getDateRange(period) {
        const now = new Date();
        let startDate = new Date(now), endDate = new Date(now);

        if (typeof period === 'string' && period.startsWith('custom_')) {
            const dates = JSON.parse(period.substring(7));
            return { startDate: dates.startDate, endDate: dates.endDate };
        }

        switch (period) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'week':
                const dayOfWeek = now.getDay();
                const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                startDate = new Date(now.setDate(diff));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                break;
            default:
                return { startDate: null, endDate: null };
        }
        return { startDate: formatDate(startDate), endDate: formatDate(endDate) };
    }

    function getPreviousMonthDateRange() {
        const now = new Date();
        const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const startDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1, 0, 0, 0, 0);
        const endDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0, 23, 59, 59, 999);
        return { startDate: formatDate(startDate), endDate: formatDate(endDate), monthName: prevMonth.toLocaleString('id-ID', { month: 'long' }), year: prevMonth.getFullYear() };
    }

    // --- DATA FETCHING & DELETION ---
    async function fetchData(endpoint, tableBody, renderFunction, adminFilter, period) {
        if (tableBody) tableBody.innerHTML = `<tr><td colspan="10">Memuat data...</td></tr>`;
        const { startDate, endDate } = getDateRange(period);

        const params = new URLSearchParams();
        if (startDate && endDate) {
            params.append('startDate', startDate);
            params.append('endDate', endDate);
        }
        if (adminFilter) {
            // Use 'cashier' parameter for shifts endpoint, 'admin' for others
            const paramName = endpoint === 'shifts' ? 'cashier' : 'admin';
            params.append(paramName, adminFilter);
        }

        const url = `${API_BASE_URL}/api/${endpoint}?${params.toString()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (renderFunction) renderFunction(data, tableBody);
            return data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            if (tableBody) tableBody.innerHTML = `<tr><td colspan="10">Gagal memuat data: ${error.message}</td></tr>`;
            return [];
        }
    }

    // --- UI RENDERING ---
    function groupTransactionItems(ket) {
        if (typeof ket !== 'string' || !ket.includes('|')) {
            return ket;
        }

        const parts = ket.split('|');
        const itemPart = parts[0];
        const rest = parts.slice(1).join('|');

        const itemMatch = itemPart.match(/\[.*?\]\s*(.*)/);
        if (!itemMatch || !itemMatch[1]) {
            return ket;
        }

        const itemsStr = itemMatch[1].trim();
        if (!itemsStr) {
            return ket;
        }

        const items = itemsStr.split(',').map(item => item.trim());
        const counts = {};
        items.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });

        const groupedItems = Object.entries(counts).map(([item, count]) => {
            if (count > 1) {
                return `${item} <span style="color: #f39c12; font-weight: 900; font-size: 1.1em; background: rgba(243, 156, 18, 0.15); padding: 2px 6px; border-radius: 4px;">x${count}</span>`;
            }
            return item;
        }).join(', ');

        const customerPart = itemPart.substring(0, itemMatch.index + itemMatch[0].length - itemsStr.length);
        return `${customerPart}${groupedItems} |${rest}`;
    }

    function renderTransactions(transactions, tableBody) {
        tableBody.innerHTML = '';
        if (!transactions || transactions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">Tidak ada transaksi ditemukan.</td></tr>';
            return;
        }
        transactions.forEach(tx => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = tx.timestamp;
            row.insertCell().textContent = tx.tx_id;
            row.insertCell().textContent = tx.nama_tx;
            row.insertCell().textContent = tx.admin;
            
            // Apply grouping with HTML styling
            const ketCell = row.insertCell();
            ketCell.innerHTML = groupTransactionItems(tx.ket);
            
            row.insertCell().textContent = IDR(tx.harga);
            row.insertCell().textContent = tx.metode;
        });
    }

    function renderSalary(shifts, tableBody) {
        tableBody.innerHTML = '';
        if (!shifts || shifts.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">Tidak ada data gaji ditemukan.</td></tr>';
            return;
        }
        
        let totalGajiPokok = 0;
        let totalBonus = 0;
        let totalGaji = 0;
        
        shifts.forEach(shift => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = shift.date || '-';
            row.insertCell().textContent = shift.jam_mulai || '-';
            row.insertCell().textContent = shift.jam_tutup || '-';
            
            // Calculate duration if both times exist
            let duration = '-';
            if (shift.jam_mulai && shift.jam_tutup) {
                const [startH, startM, startS] = shift.jam_mulai.split(':').map(Number);
                const [endH, endM, endS] = shift.jam_tutup.split(':').map(Number);
                const startMinutes = startH * 60 + startM;
                const endMinutes = endH * 60 + endM;
                const diffMinutes = endMinutes - startMinutes;
                const hours = Math.floor(diffMinutes / 60);
                const minutes = diffMinutes % 60;
                duration = `${hours}j ${minutes}m`;
            }
            row.insertCell().textContent = duration;
            
            const gajiPokok = parseFloat(shift.gaji_pokok) || 0;
            const bonus = parseFloat(shift.total_bonus) || 0;
            const gaji = parseFloat(shift.total_gaji) || 0;
            
            row.insertCell().textContent = IDR(gajiPokok);
            row.insertCell().textContent = IDR(bonus);
            row.insertCell().textContent = IDR(gaji);
            
            totalGajiPokok += gajiPokok;
            totalBonus += bonus;
            totalGaji += gaji;
        });
        
        // Add total row
        const totalRow = tableBody.insertRow();
        totalRow.style.fontWeight = 'bold';
        totalRow.style.backgroundColor = '#1e2438';
        const totalCell = totalRow.insertCell();
        totalCell.colSpan = 4;
        totalCell.textContent = 'TOTAL';
        totalCell.style.textAlign = 'right';
        totalRow.insertCell().textContent = IDR(totalGajiPokok);
        totalRow.insertCell().textContent = IDR(totalBonus);
        totalRow.insertCell().textContent = IDR(totalGaji);
    }

    function renderOrders(orders, tableBody) {
        tableBody.innerHTML = '';
        if (!orders || orders.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="10">Tidak ada orderan ditemukan.</td></tr>';
            return;
        }
        orders.forEach(order => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = order.timestamp;
            row.insertCell().textContent = order.tx_id;
            row.insertCell().textContent = order.nama_tx;
            row.insertCell().textContent = order.admin;
            row.insertCell().textContent = IDR(order.harga);
            
            // Metode Bayar - Editable Dropdown
            const metodeCell = row.insertCell();
            const selectMetode = document.createElement('select');
            selectMetode.style.cssText = 'padding: 4px 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--line); color: var(--ink); font-size: 0.9em; cursor: pointer;';
            
            const metodeOptions = ['Pending', 'Cash', 'QRIS', 'Lunas'];
            metodeOptions.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                if (opt === order.metode) option.selected = true;
                selectMetode.appendChild(option);
            });
            
            // Style based on status
            const updateMetodeStyle = (value) => {
                if (value === 'Lunas') {
                    selectMetode.style.background = '#27ae60';
                    selectMetode.style.color = '#fff';
                    selectMetode.style.fontWeight = '700';
                } else if (value === 'Pending') {
                    selectMetode.style.background = '#e74c3c';
                    selectMetode.style.color = '#fff';
                    selectMetode.style.fontWeight = '700';
                } else {
                    selectMetode.style.background = '#3498db';
                    selectMetode.style.color = '#fff';
                    selectMetode.style.fontWeight = '700';
                }
            };
            
            updateMetodeStyle(order.metode);
            
            // Change event handler
            selectMetode.addEventListener('change', async (e) => {
                const newMetode = e.target.value;
                const orderId = order._id;
                
                if (!orderId) {
                    alert('ID Order tidak ditemukan!');
                    return;
                }
                
                try {
                    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            metode: newMetode,
                            panjar: order.panjar,
                            sisa: order.sisa
                        })
                    });
                    
                    if (response.ok) {
                        updateMetodeStyle(newMetode);
                        console.log(`Status orderan ${orderId} berhasil diubah ke ${newMetode}`);
                    } else {
                        alert('Gagal mengubah status pembayaran!');
                        e.target.value = order.metode; // Revert
                    }
                } catch (error) {
                    console.error('Error updating metode:', error);
                    alert('Terjadi kesalahan saat mengubah status!');
                    e.target.value = order.metode; // Revert
                }
            });
            
            metodeCell.appendChild(selectMetode);
            
            row.insertCell().textContent = IDR(order.panjar);
            row.insertCell().textContent = IDR(order.sisa);
            row.insertCell().textContent = order.janji_selesai || '-';
            
            // Group items yang sama dan kalikan jumlahnya dengan styling mencolok
            const itemsCell = row.insertCell();
            if (order.items && order.items.length > 0) {
                const groupedItems = {};
                order.items.forEach(item => {
                    const key = item.jenis || 'Unknown';
                    if (!groupedItems[key]) {
                        groupedItems[key] = 0;
                    }
                    groupedItems[key] += parseInt(item.qty) || 1;
                });
                
                // Create HTML with styled multiplier
                const itemsHTML = Object.entries(groupedItems)
                    .map(([jenis, totalQty]) => {
                        if (totalQty > 1) {
                            return `${jenis} <span style="color: #f39c12; font-weight: 900; font-size: 1.1em; background: rgba(243, 156, 18, 0.15); padding: 2px 6px; border-radius: 4px;">x${totalQty}</span>`;
                        }
                        return jenis;
                    })
                    .join(', ');
                    
                itemsCell.innerHTML = itemsHTML;
            } else {
                itemsCell.textContent = '-';
            }
        });
    }

    // --- DOWNLOAD/DELETE HANDLERS ---
    function downloadPdfReport(data, reportTitle, filenameSuffix) {
        const doc = new jsPDF();
        let y = 15;

        // 1. Main Title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Laporan Toko Percetakan 21', 14, y); y += 8;
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(reportTitle, 14, y); y += 15;

        // 2. Summary Section
        const txAngel = data.transactions.filter(t => t.admin === 'Angel');
        const txOwner = data.transactions.filter(t => t.admin === 'Ch_01');
        const totalAngel = txAngel.reduce((sum, t) => sum + (t.harga || 0), 0);
        const totalOwner = txOwner.reduce((sum, t) => sum + (t.harga || 0), 0);
        const totalOrders = data.orders.reduce((sum, o) => sum + (o.harga || 0), 0);
        const grandTotal = totalAngel + totalOwner + totalOrders;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Ringkasan Pendapatan', 14, y); y += 7;
        doc.setFont(undefined, 'normal');
        doc.text(`- Transaksi Kasir (Angel): ${IDR(totalAngel)}`, 14, y); y += 7;
        doc.text(`- Transaksi Owner (Ch_01): ${IDR(totalOwner)}`, 14, y); y += 7;
        doc.text(`- Total Orderan: ${IDR(totalOrders)}`, 14, y); y += 7;
        doc.setFont(undefined, 'bold');
        doc.text(`- Grand Total: ${IDR(grandTotal)}`, 14, y); y += 10;

        // 3. Auto-generate tables
        const txHead = [['Timestamp', 'ID', 'Nama', 'Keterangan', 'Harga', 'Metode']];
        const txBodyAngel = txAngel.map(t => [
            t.timestamp || '', 
            t.tx_id || '', 
            t.nama_tx || '', 
            groupTransactionItems(t.ket || ''), 
            IDR(t.harga || 0), 
            t.metode || ''
        ]);
        const txBodyOwner = txOwner.map(t => [
            t.timestamp || '', 
            t.tx_id || '', 
            t.nama_tx || '', 
            groupTransactionItems(t.ket || ''), 
            IDR(t.harga || 0), 
            t.metode || ''
        ]);

        const orderHead = [['Timestamp', 'Pelanggan', 'Total', 'Panjar', 'Sisa', 'Items']];
        const orderBody = data.orders.map(o => {
            const itemsStr = (o.items || []).map(item => `${item.jenis || ''} (${item.copy || 1}x${item.qty || 1})`).join(', ');
            return [
                o.timestamp || '', 
                o.nama_tx || '', 
                IDR(o.harga || 0), 
                IDR(o.panjar || 0), 
                IDR(o.sisa || 0), 
                itemsStr
            ];
        });

        // Angel Transactions Table
        if (txBodyAngel.length > 0) {
            doc.autoTable({
                startY: y,
                head: [['Laporan Transaksi Kasir (Angel)']],
                theme: 'plain',
                styles: { fontStyle: 'bold', fontSize: 14, textColor: [41, 128, 185] },
                margin: { left: 14 }
            });
            doc.autoTable({
                startY: doc.lastAutoTable.finalY,
                head: txHead,
                body: txBodyAngel,
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 8, cellPadding: 2 },
                margin: { left: 14, right: 14 }
            });
            y = doc.lastAutoTable.finalY + 10;
        }

        // Owner Transactions Table
        if (txBodyOwner.length > 0) {
            doc.autoTable({
                startY: y,
                head: [['Laporan Transaksi Owner (Ch_01)']],
                theme: 'plain',
                styles: { fontStyle: 'bold', fontSize: 14, textColor: [41, 128, 185] },
                margin: { left: 14 }
            });
            doc.autoTable({
                startY: doc.lastAutoTable.finalY,
                head: txHead,
                body: txBodyOwner,
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 8, cellPadding: 2 },
                margin: { left: 14, right: 14 }
            });
            y = doc.lastAutoTable.finalY + 10;
        }

        // Orders Table
        if (orderBody.length > 0) {
            doc.autoTable({
                startY: y,
                head: [['Laporan Orderan Masuk']],
                theme: 'plain',
                styles: { fontStyle: 'bold', fontSize: 14, textColor: [41, 128, 185] },
                margin: { left: 14 }
            });
            doc.autoTable({
                startY: doc.lastAutoTable.finalY,
                head: orderHead,
                body: orderBody,
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                styles: { fontSize: 8, cellPadding: 2 },
                columnStyles: { 5: { cellWidth: 'auto' } },
                margin: { left: 14, right: 14 }
            });
        }

        doc.save(`laporan_tokopercetakan21_${filenameSuffix}.pdf`);
    }

    async function handleDownload() {
        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Memproses...';

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = now;

        const formatDateForAPI = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

        const startDateStr = formatDateForAPI(startDate);
        const endDateStr = formatDateForAPI(endDate);

        const period = `custom_${JSON.stringify({ startDate: startDateStr, endDate: endDateStr })}`;
        const reportTitle = `Periode: ${startDateStr} s/d ${endDateStr}`;
        const filenameSuffix = `${startDateStr}_sd_${endDateStr}`;

        alert(`Mempersiapkan laporan untuk ${reportTitle}.`);

        const [transactions, orders] = await Promise.all([
            fetchData('transactions', null, null, null, period),
            fetchData('orders', null, null, null, period)
        ]);

        if (transactions.length === 0 && orders.length === 0) {
            alert('Tidak ada data untuk diunduh pada periode ini.');
        } else {
            const allData = { transactions, orders };
            downloadPdfReport(allData, reportTitle, filenameSuffix);
            alert('Download selesai.');
        }

        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Download Data';
    }

    // --- INITIALIZATION & EVENT LISTENERS ---
    function setupFilterControls(filterContainer, callback) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                filterContainer.querySelector('.filter-btn.active').classList.remove('active');
                e.target.classList.add('active');
                callback(e.target.dataset.period);
            }
        });
    }

    async function loadAllData() {
        const angelTxPeriod = transactionsFilter.querySelector('.active').dataset.period;
        const salaryPeriod = salaryFilter.querySelector('.active').dataset.period;
        const ownerTxPeriod = ownerTransactionsFilter.querySelector('.active').dataset.period;
        const ordersPeriod = ordersFilter.querySelector('.active').dataset.period;

        await Promise.all([
            fetchData('transactions', transactionsTableBody, renderTransactions, 'Angel', angelTxPeriod),
            fetchData('shifts', salaryTableBody, renderSalary, 'Angel', salaryPeriod),
            fetchData('transactions', ownerTransactionsTableBody, renderTransactions, 'Ch_01', ownerTxPeriod),
            fetchData('orders', ordersTableBody, renderOrders, null, ordersPeriod)
        ]);
    }

    refreshBtn.addEventListener('click', loadAllData);
    downloadBtn.addEventListener('click', handleDownload);

    setupFilterControls(transactionsFilter, (period) => fetchData('transactions', transactionsTableBody, renderTransactions, 'Angel', period));
    setupFilterControls(salaryFilter, (period) => fetchData('shifts', salaryTableBody, renderSalary, 'Angel', period));
    setupFilterControls(ownerTransactionsFilter, (period) => fetchData('transactions', ownerTransactionsTableBody, renderTransactions, 'Ch_01', period));
    setupFilterControls(ordersFilter, (period) => fetchData('orders', ordersTableBody, renderOrders, null, period));

    loadAllData();

    // --- SPLITTER LOGIC ---
    (function() {
        const splitter = document.querySelector('.splitter');
        if (!splitter) return;

        const leftCard = document.getElementById('angel-card');
        const rightCard = document.getElementById('owner-card');
        const resizableContainer = document.querySelector('.resizable-container');

        let isDragging = false;

        splitter.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const containerRect = resizableContainer.getBoundingClientRect();
            
            // Calculate the position of the splitter relative to the container
            let splitterPos = e.clientX - containerRect.left;

            // Constrain the splitter position
            const minWidth = 200; // Minimum width for cards
            if (splitterPos < minWidth) {
                splitterPos = minWidth;
            }
            if (splitterPos > containerRect.width - minWidth - splitter.offsetWidth) {
                splitterPos = containerRect.width - minWidth - splitter.offsetWidth;
            }

            const leftWidth = splitterPos;
            const rightWidth = containerRect.width - leftWidth - splitter.offsetWidth - 20; // 20px for gap

            resizableContainer.style.setProperty('--left-col-width', `${leftWidth}px`);
            resizableContainer.style.setProperty('--right-col-width', `${rightWidth}px`);
        });
    })();
});
