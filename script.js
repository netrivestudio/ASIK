 // LOAD DATA
let data = JSON.parse(localStorage.getItem("asikData")) || [];

function simpanData() {
  localStorage.setItem("asikData", JSON.stringify(data));
}

// TAMBAH DATA
function tambahData() {
  const tanggal = document.getElementById("tanggal").value;
  const nama = document.getElementById("namaDonatur").value;
  const jenis = document.getElementById("jenis").value;
  const ket = document.getElementById("keterangan").value;
  const jumlah = parseInt(document.getElementById("jumlah").value) || 0;
  const status = document.getElementById("status").value;

  if (!tanggal || !nama || jumlah <= 0) {
    alert("Lengkapi data!");
    return;
  }

  data.push({ tanggal, nama, jenis, ket, jumlah, status });
  simpanData();
  renderTable();
  updateInfo();
}

// TAMPILKAN TABEL
function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach((item, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${item.tanggal}</td>
        <td>${item.nama}</td>
        <td>${item.jenis}</td>
        <td>${item.ket}</td>
        <td>${item.jumlah}</td>
        <td>${item.status}</td>
        <td><button onclick="hapusBaris(${i})">Hapus</button></td>
      </tr>
    `;
  });
}

function hapusBaris(i) {
  data.splice(i, 1);
  simpanData();
  renderTable();
  updateInfo();
}

function hapusSemua() {
  if (confirm("Hapus semua data?")) {
    data = [];
    simpanData();
    renderTable();
    updateInfo();
  }
}

// HITUNG TOTAL
function updateInfo() {
  let income = 0, expense = 0;

  data.forEach(d => {
    if (d.jenis === "Income") income += d.jumlah;
    else expense += d.jumlah;
  });

  document.getElementById("totalIncome").textContent = income;
  document.getElementById("totalExpense").textContent = expense;
  document.getElementById("saldoAkhir").textContent = income - expense;
}

// EXPORT EXCEL
function exportExcel() {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ASIK");
  XLSX.writeFile(wb, "Laporan_ASIK.xlsx");
}

// EXPORT PDF
function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("ASIK - Amal Sosial Kemasyarakatan", 14, 15);
  doc.text("Bersama Kita Berbagi, Bersama Kita Peduli", 14, 22);

  let income = 0, expense = 0;
  data.forEach(d => d.jenis === "Income" ? income += d.jumlah : expense += d.jumlah);

  doc.text(`Total Income : ${income}`, 14, 35);
  doc.text(`Total Expense : ${expense}`, 14, 42);
  doc.text(`Saldo Akhir : ${income - expense}`, 14, 49);

  doc.save("Laporan_ASIK.pdf");
}

// LOAD AWAL
renderTable();
updateInfo();

