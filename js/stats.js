document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = '/api';

  const statGrid = document.getElementById('stat-grid-container');
  const historyHeader = document.getElementById('history-table-header');
  const historyBody = document.getElementById('history-table-body');

  const IDR = (n) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(n || 0));

  async function fetchData() {
    console.log('Starting data fetch for stats page...');
    try {
      const [transactionsRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/transactions`),
        fetch(`${API_BASE_URL}/orders`)
      ]);

      console.log('Fetch response received.', { transactionsRes, ordersRes });

      if (!transactionsRes.ok || !ordersRes.ok) {
        throw new Error(`Failed to fetch data from server. Status: ${transactionsRes.status}, ${ordersRes.status}`);
      }

      const transactions = await transactionsRes.json();
      const orders = await ordersRes.json();

      console.log('Raw Transactions Data:', transactions);
      console.log('Raw Orders Data:', orders);

      renderStatistics(transactions);
      renderOrderHistory(orders);

    } catch (error) {
      console.error('ERROR IN fetchData:', error);
      statGrid.innerHTML = '<p>Gagal memuat data statistik. Pastikan server berjalan dan cek console (F12).</p>';
      historyBody.innerHTML = '<tr><td colspan="5">Gagal memuat riwayat orderan. Cek console (F12).</td></tr>';
    }
  }

  function renderStatistics(transactions) {
    const calculateStats = (txs) => {
      const totalRevenue = txs.reduce((sum, tx) => sum + (tx.harga || 0), 0);
      const totalTransactions = txs.length;
      const cashTransactions = txs.filter(tx => tx.metode === 'Cash').length;
      const qrisTransactions = txs.filter(tx => tx.metode === 'QRIS').length;
      const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
      return {
        'Total Omzet': totalRevenue,
        'Total Transaksi': totalTransactions,
        'Transaksi Tunai': cashTransactions,
        'Transaksi QRIS': qrisTransactions,
        'Rata-rata Nilai Transaksi': avgTransactionValue
      };
    };

    const createChart = (canvasId, label, data) => {
      const ctx = document.getElementById(canvasId).getContext('2d');
      const chartLabels = Object.keys(data);
      const chartData = Object.values(data);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartLabels,
          datasets: [{
            label: label,
            data: chartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                     if (context.label.includes('Omzet') || context.label.includes('Rata-rata')) {
                       label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(context.parsed.y);
                     } else {
                       label += context.parsed.y;
                     }
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    };

    const angelTransactions = transactions.filter(tx => tx.admin === 'Angel');
    const ownerTransactions = transactions.filter(tx => tx.admin === 'Ch_01');

    const totalStats = calculateStats(transactions);
    const angelStats = calculateStats(angelTransactions);
    const ownerStats = calculateStats(ownerTransactions);

    createChart('salesChart', 'Statistik Penjualan', totalStats);
    createChart('angelChart', 'Statistik Angel', angelStats);
    createChart('ownerChart', 'Statistik Owner', ownerStats);
  }

  function renderOrderHistory(orders) {
    if (!historyHeader || !historyBody) return;

    historyHeader.innerHTML = `
      <th>Tanggal</th>
      <th>ID Order</th>
      <th>Nama Pelanggan</th>
      <th>Detail Item</th>
      <th>Status</th>
      <th>Total</th>
    `;

    let bodyHtml = '';
    if (orders.length === 0) {
      bodyHtml = '<tr><td colspan="6" style="text-align: center;">Belum ada riwayat orderan.</td></tr>';
    } else {
      orders.forEach(order => {
        const itemDetails = order.items.map(item => `${item.jenis} (${item.qty})`).join(', ');
        bodyHtml += `
          <tr>
            <td>${new Date(order.timestamp).toLocaleString('id-ID')}</td>
            <td>${order.tx_id}</td>
            <td>${order.nama_tx}</td>
            <td>${itemDetails}</td>
            <td>${order.metode}</td>
            <td style="text-align: right; font-weight: 700;">${IDR(order.harga)}</td>
          </tr>
        `;
      });
    }
    historyBody.innerHTML = bodyHtml;
  }

  fetchData();

  });