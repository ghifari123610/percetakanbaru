// PDF Generator untuk Data Expiring dengan Item Grouping
// Digunakan di index.html, owner.html, monitor.html

// Function untuk group items dalam keterangan transaksi (SIMPLE VERSION)
function groupItemsInKeteranganPDF(ket) {
    if (typeof ket !== 'string') {
        return ket;
    }
    
    // Ganti semua "x" diikuti angka dengan format yang lebih besar
    // Contoh: "x5" -> akan dirender dengan font besar
    return ket;
}

// Function untuk group items dalam orderan
function groupOrderItems(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
        return [];
    }

    const groupedItems = {};
    items.forEach(item => {
        const key = item.jenis || 'Unknown';
        if (!groupedItems[key]) {
            groupedItems[key] = {
                jenis: key,
                totalQty: 0,
                satuan: item.satuan || 'pcs',
                items: []
            };
        }
        groupedItems[key].totalQty += parseInt(item.qty) || 1;
        groupedItems[key].items.push(item);
    });

    return Object.values(groupedItems).map(group => ({
        jenis: group.jenis,
        totalQty: group.totalQty,
        satuan: group.satuan,
        hasMultiple: group.totalQty > 1
    }));
}

// Main function untuk generate PDF
async function downloadExpiringDataPDF() {
    try {
        // Show loading
        const btnDownload = document.getElementById('btnDownloadExpiring');
        const originalText = btnDownload.textContent;
        btnDownload.disabled = true;
        btnDownload.textContent = '⏳ Membuat PDF...';
        
        // Fetch data
        const response = await fetch('/api/download/expiring-data-pdf');
        const data = await response.json();
        
        // Generate PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        let yPos = 20;
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 14;
        const maxY = pageHeight - 20;
        
        // Helper function untuk add new page
        const checkNewPage = (needed = 10) => {
            if (yPos + needed > maxY) {
                doc.addPage();
                yPos = 20;
                return true;
            }
            return false;
        };
        
        // Helper untuk format rupiah
        const formatRupiah = (amount) => {
            return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(amount || 0));
        };
        
        // ===== COVER PAGE =====
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('BACKUP DATA', pageWidth/2, yPos, { align: 'center' });
        yPos += 10;
        
        doc.setFontSize(18);
        doc.text('Toko Percetakan 21', pageWidth/2, yPos, { align: 'center' });
        yPos += 15;
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(231, 76, 60); // Red
        doc.text('⚠️ DATA AKAN TERHAPUS', pageWidth/2, yPos, { align: 'center' });
        yPos += 10;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Tanggal Export: ${data.export_info.export_date}`, pageWidth/2, yPos, { align: 'center' });
        yPos += 6;
        doc.text(`Data dari: ${data.export_info.data_range_start}`, pageWidth/2, yPos, { align: 'center' });
        yPos += 6;
        doc.text(`Akan dihapus pada: ${data.export_info.will_be_deleted_at}`, pageWidth/2, yPos, { align: 'center' });
        yPos += 15;
        
        // Summary Box
        doc.setDrawColor(52, 152, 219);
        doc.setFillColor(236, 240, 241);
        doc.roundedRect(margin, yPos, pageWidth - 2*margin, 30, 3, 3, 'FD');
        
        yPos += 8;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text(`📊 Total Transaksi: ${data.export_info.total_transactions}`, margin + 5, yPos);
        yPos += 7;
        doc.text(`📦 Total Orderan: ${data.export_info.total_orders}`, margin + 5, yPos);
        yPos += 7;
        doc.text(`👤 Total Shift: ${data.export_info.total_shifts}`, margin + 5, yPos);
        yPos += 15;
        
        // ===== TRANSAKSI SECTION =====
        doc.addPage();
        yPos = 20;
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('📋 TRANSAKSI', margin, yPos);
        yPos += 10;
        
        if (data.transactions.length > 0) {
            // Table header
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.setFillColor(52, 152, 219);
            doc.setTextColor(255, 255, 255);
            doc.rect(margin, yPos, pageWidth - 2*margin, 7, 'F');
            
            doc.text('Timestamp', margin + 2, yPos + 5);
            doc.text('ID Transaksi', margin + 40, yPos + 5);
            doc.text('Nama', margin + 75, yPos + 5);
            doc.text('Keterangan', margin + 105, yPos + 5);
            doc.text('Harga', margin + 155, yPos + 5);
            doc.text('Metode', margin + 175, yPos + 5);
            yPos += 7;
            
            // Table rows dengan grouping
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            
            data.transactions.forEach((tx, index) => {
                const rowHeight = 10; // Lebih tinggi untuk akomodasi grouped items
                checkNewPage(rowHeight);
                
                // Alternate row colors
                if (index % 2 === 0) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(margin, yPos, pageWidth - 2*margin, rowHeight, 'F');
                }
                
                doc.setFontSize(8);
                doc.setTextColor(0, 0, 0);
                
                // Timestamp
                doc.text(tx.timestamp.substring(0, 16), margin + 2, yPos + 4);
                
                // ID
                doc.text(tx.tx_id.substring(0, 10), margin + 40, yPos + 4);
                
                // Nama
                doc.text(tx.nama_tx.substring(0, 18), margin + 75, yPos + 4);
                
                // Keterangan - strip HTML dan render dengan pattern matching
                let ketText = tx.ket || '-';
                
                // STRIP SEMUA HTML TAGS
                ketText = ketText.replace(/<[^>]*>/g, '');
                
                let currentX = margin + 106;
                const maxWidth = 50; // max lebar kolom keterangan
                
                // Split text dan cari pattern "x" diikuti angka
                const parts = ketText.split(/(\sx\d+)/g); // Split tapi simpan delimiter
                
                doc.setFontSize(7);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                
                parts.forEach(part => {
                    if (/^\sx\d+$/.test(part)) {
                        // Ini adalah multiplier (contoh: " x5")
                        doc.setFont(undefined, 'bold');
                        doc.setTextColor(243, 156, 18); // Orange
                        doc.setFontSize(11); // BESAR
                        doc.text(part, currentX, yPos + 4);
                        currentX += doc.getTextWidth(part);
                        
                        // Reset ke normal
                        doc.setFont(undefined, 'normal');
                        doc.setTextColor(0, 0, 0);
                        doc.setFontSize(7);
                    } else if (part.length > 0) {
                        // Text biasa
                        const truncated = part.substring(0, 30);
                        doc.text(truncated, currentX, yPos + 4);
                        currentX += doc.getTextWidth(truncated);
                    }
                });
                
                // Reset font
                doc.setFont(undefined, 'normal');
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(8);
                
                // Harga
                doc.text(formatRupiah(tx.harga), margin + 155, yPos + 4);
                
                // Metode
                doc.text(tx.metode, margin + 175, yPos + 4);
                
                yPos += rowHeight;
            });
            
            // Total Transaksi
            yPos += 5;
            checkNewPage(10);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            const totalTx = data.transactions.reduce((sum, t) => sum + t.harga, 0);
            doc.setFillColor(52, 152, 219);
            doc.setTextColor(255, 255, 255);
            doc.roundedRect(pageWidth - margin - 60, yPos - 3, 60, 8, 2, 2, 'F');
            doc.text(`Total: ${formatRupiah(totalTx)}`, pageWidth - margin - 57, yPos + 2);
        } else {
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('Tidak ada transaksi.', margin, yPos);
        }
        
        // ===== ORDERAN SECTION =====
        doc.addPage();
        yPos = 20;
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('📦 ORDERAN', margin, yPos);
        yPos += 10;
        
        if (data.orders.length > 0) {
            data.orders.forEach((order, index) => {
                const groupedItems = groupOrderItems(order.items);
                const cardHeight = 25 + (groupedItems.length * 4);
                
                checkNewPage(cardHeight);
                
                // Order card
                doc.setDrawColor(149, 165, 166);
                doc.setFillColor(250, 250, 250);
                doc.roundedRect(margin, yPos, pageWidth - 2*margin, cardHeight, 2, 2, 'FD');
                
                yPos += 5;
                doc.setFontSize(9);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(`Order #${order.tx_id}`, margin + 3, yPos);
                doc.setFont(undefined, 'normal');
                doc.setFontSize(8);
                doc.text(order.timestamp, pageWidth - margin - 40, yPos);
                
                yPos += 5;
                doc.setFontSize(8);
                doc.text(`Customer: ${order.nama_tx}`, margin + 3, yPos);
                
                yPos += 5;
                doc.text(`Total: ${formatRupiah(order.harga)}`, margin + 3, yPos);
                doc.text(`Status: ${order.metode}`, margin + 60, yPos);
                
                yPos += 5;
                doc.text(`Panjar: ${formatRupiah(order.panjar)}`, margin + 3, yPos);
                doc.text(`Sisa: ${formatRupiah(order.sisa)}`, margin + 60, yPos);
                
                yPos += 5;
                
                // Items - render dengan pattern matching untuk x angka
                if (groupedItems.length > 0) {
                    doc.setFont(undefined, 'bold');
                    doc.setFontSize(7);
                    doc.text('Items:', margin + 3, yPos);
                    yPos += 4;
                    
                    groupedItems.forEach(item => {
                        let itemText = `• ${item.jenis} x${item.totalQty} ${item.satuan}`;
                        
                        // Split berdasarkan pattern " x angka"
                        const parts = itemText.split(/(\sx\d+)/g);
                        let currentX = margin + 6;
                        
                        doc.setFont(undefined, 'normal');
                        doc.setTextColor(0, 0, 0);
                        doc.setFontSize(7);
                        
                        parts.forEach(part => {
                            if (/^\sx\d+$/.test(part)) {
                                // Multiplier - BESAR dan ORANGE
                                doc.setFont(undefined, 'bold');
                                doc.setTextColor(243, 156, 18);
                                doc.setFontSize(11);
                                doc.text(part, currentX, yPos);
                                currentX += doc.getTextWidth(part);
                                
                                // Reset
                                doc.setFont(undefined, 'normal');
                                doc.setTextColor(0, 0, 0);
                                doc.setFontSize(7);
                            } else if (part.length > 0) {
                                doc.text(part, currentX, yPos);
                                currentX += doc.getTextWidth(part);
                            }
                        });
                        
                        yPos += 4;
                    });
                }
                
                yPos += 2;
            });
            
            // Total Orderan
            yPos += 5;
            checkNewPage(10);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(255, 255, 255);
            const totalOrder = data.orders.reduce((sum, o) => sum + o.harga, 0);
            doc.setFillColor(52, 152, 219);
            doc.roundedRect(pageWidth - margin - 60, yPos - 3, 60, 8, 2, 2, 'F');
            doc.text(`Total: ${formatRupiah(totalOrder)}`, pageWidth - margin - 57, yPos + 2);
        } else {
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('Tidak ada orderan.', margin, yPos);
        }
        
        // ===== SHIFT/GAJI SECTION =====
        doc.addPage();
        yPos = 20;
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(41, 128, 185);
        doc.text('👤 DATA SHIFT & GAJI', margin, yPos);
        yPos += 10;
        
        if (data.shifts.length > 0) {
            // Table header
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.setFillColor(52, 152, 219);
            doc.setTextColor(255, 255, 255);
            doc.rect(margin, yPos, pageWidth - 2*margin, 7, 'F');
            
            doc.text('Tanggal', margin + 2, yPos + 5);
            doc.text('Mulai', margin + 32, yPos + 5);
            doc.text('Tutup', margin + 52, yPos + 5);
            doc.text('Durasi', margin + 72, yPos + 5);
            doc.text('Gaji Pokok', margin + 95, yPos + 5);
            doc.text('Bonus', margin + 125, yPos + 5);
            doc.text('Total Gaji', margin + 155, yPos + 5);
            yPos += 7;
            
            // Table rows
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            
            data.shifts.forEach((shift, index) => {
                checkNewPage(7);
                
                if (index % 2 === 0) {
                    doc.setFillColor(245, 245, 245);
                    doc.rect(margin, yPos, pageWidth - 2*margin, 7, 'F');
                }
                
                doc.setFontSize(8);
                doc.text(shift.date, margin + 2, yPos + 4.5);
                doc.text(shift.jam_mulai || '-', margin + 32, yPos + 4.5);
                doc.text(shift.jam_tutup || '-', margin + 52, yPos + 4.5);
                
                // Calculate duration
                if (shift.jam_mulai && shift.jam_tutup) {
                    const [startH, startM] = shift.jam_mulai.split(':').map(Number);
                    const [endH, endM] = shift.jam_tutup.split(':').map(Number);
                    const minutes = (endH * 60 + endM) - (startH * 60 + startM);
                    const hours = Math.floor(minutes / 60);
                    const mins = minutes % 60;
                    doc.text(`${hours}j ${mins}m`, margin + 72, yPos + 4.5);
                } else {
                    doc.text('-', margin + 72, yPos + 4.5);
                }
                
                doc.text(formatRupiah(shift.gaji_pokok || 0), margin + 95, yPos + 4.5);
                doc.text(formatRupiah(shift.total_bonus || 0), margin + 125, yPos + 4.5);
                doc.text(formatRupiah(shift.total_gaji || 0), margin + 155, yPos + 4.5);
                
                yPos += 7;
            });
            
            // Total Gaji
            yPos += 5;
            checkNewPage(10);
            doc.setFont(undefined, 'bold');
            doc.setFontSize(11);
            doc.setTextColor(255, 255, 255);
            const totalGajiPokok = data.shifts.reduce((sum, s) => sum + (s.gaji_pokok || 0), 0);
            const totalBonus = data.shifts.reduce((sum, s) => sum + (s.total_bonus || 0), 0);
            const totalGaji = data.shifts.reduce((sum, s) => sum + (s.total_gaji || 0), 0);
            
            doc.setFillColor(52, 152, 219);
            doc.roundedRect(pageWidth - margin - 100, yPos - 3, 100, 20, 2, 2, 'F');
            doc.setFontSize(9);
            doc.text(`Gaji Pokok: ${formatRupiah(totalGajiPokok)}`, pageWidth - margin - 97, yPos + 2);
            doc.text(`Bonus: ${formatRupiah(totalBonus)}`, pageWidth - margin - 97, yPos + 8);
            doc.setFontSize(10);
            doc.text(`Total: ${formatRupiah(totalGaji)}`, pageWidth - margin - 97, yPos + 14);
        } else {
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('Tidak ada data shift.', margin, yPos);
        }
        
        // ===== FOOTER SETIAP PAGE =====
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Halaman ${i} dari ${totalPages} | Generated: ${new Date().toLocaleString('id-ID')}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }
        
        // Save PDF
        const filename = `Backup_Data_${data.export_info.data_range_start.split(' ')[0]}_to_${data.export_info.will_be_deleted_at.split(' ')[0]}.pdf`;
        doc.save(filename);
        
        // Reset button
        btnDownload.disabled = false;
        btnDownload.textContent = originalText;
        
        // Success notification
        alert(`✅ Data berhasil didownload!\n\n📄 File: ${filename}\n\n💾 Silakan simpan file PDF ini sebagai backup permanen.\n\n✨ Item yang sama sudah dikelompokkan dengan highlight orange!`);
        
        return true;
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('❌ Gagal membuat PDF! Silakan coba lagi.');
        
        // Reset button
        const btnDownload = document.getElementById('btnDownloadExpiring');
        if (btnDownload) {
            btnDownload.disabled = false;
            btnDownload.textContent = '📥 Download Data Sekarang';
        }
        return false;
    }
}
