// ======================================
// LOAD DATA DARI LOCAL STORAGE
// ======================================
let data = JSON.parse(localStorage.getItem("asikData")) || [];

// ======================================
// SIMPAN DATA
// ======================================
function simpanData() {
  localStorage.setItem("asikData", JSON.stringify(data));
}

// ======================================
// TAMBAH DATA
// ======================================
function tambahData() {
  const tanggal = document.getElementById("tanggal").value;
  const nama = document.getElementById("namaDonatur").value.trim();
  const jenis = document.getElementById("jenis").value;
  const ket = document.getElementById("keterangan").value.trim();
const jumlahInput = document.getElementById("jumlah").value;
const jumlah = parseInt(jumlahInput.replace(/\./g, "")) || 0;

  const status = document.getElementById("status").value;

  if (!tanggal || !nama || jumlah <= 0) {
    alert("Lengkapi data dengan benar!");
    return;
  }

  data.push({ tanggal, nama, jenis, ket, jumlah, status });
  simpanData();
  renderTable();
  updateInfo();

  // reset input
  document.getElementById("namaDonatur").value = "";
  document.getElementById("keterangan").value = "";
  document.getElementById("jumlah").value = "";
}

// ======================================
// TAMPILKAN DATA KE TABEL
// ======================================
function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.tanggal}</td>
      <td>${item.nama}</td>
      <td>${item.jenis}</td>
      <td>${item.ket}</td>
      <td>Rp ${item.jumlah.toLocaleString("id-ID")}</td>
      <td>${item.status}</td>
      <td>
        <button class="btn-danger" onclick="hapusBaris(${index})">Hapus</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ======================================
// HAPUS SATU BARIS
// ======================================
function hapusBaris(index) {
  data.splice(index, 1);
  simpanData();
  renderTable();
  updateInfo();
}

// ======================================
// HAPUS SEMUA DATA
// ======================================
function hapusSemua() {
  if (confirm("Yakin ingin menghapus semua data?")) {
    data = [];
    simpanData();
    renderTable();
    updateInfo();
  }
}

// ======================================
// HITUNG TOTAL
// ======================================
function updateInfo() {
  let totalIncome = 0;
  let totalExpense = 0;

  data.forEach(item => {
    if (item.jenis === "Income") {
      totalIncome += item.jumlah;
    } else {
      totalExpense += item.jumlah;
    }
  });

  document.getElementById("totalIncome").textContent =
    totalIncome.toLocaleString("id-ID");

  document.getElementById("totalExpense").textContent =
    totalExpense.toLocaleString("id-ID");

  document.getElementById("saldoAkhir").textContent =
    (totalIncome - totalExpense).toLocaleString("id-ID");
}

// ======================================
// EXPORT EXCEL
// ======================================
function exportExcel() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const exportData = data.map((item, i) => ({
    No: i + 1,
    Tanggal: item.tanggal,
    "Nama Donatur": item.nama,
    Jenis: item.jenis,
    Keterangan: item.ket,
    Jumlah: item.jumlah,
    Status: item.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ASIK");

  XLSX.writeFile(workbook, "Laporan_ASIK.xlsx");
}

// ======================================
// EXPORT PDF (MINUMO STYLE)
// ======================================
function exportPDF() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  let totalIncome = 0;
  let totalExpense = 0;

  data.forEach(item => {
    if (item.jenis === "Income") {
      totalIncome += item.jumlah;
    } else {
      totalExpense += item.jumlah;
    }
  });

  const saldoAkhir = totalIncome - totalExpense;
  const exportTime = new Date().toLocaleString("id-ID");

  // HEADER
  doc.setFontSize(14);
  doc.text("ASIK - Amal Sosial Kemasyarakatan", 14, 15);

  doc.setFontSize(10);
  doc.text(`Export : ${exportTime}`, 14, 22);

  // TABLE
  const head = [[
    "No",
    "Tanggal",
    "Nama Donatur",
    "Jenis",
    "Keterangan",
    "Jumlah",
    "Status"
  ]];

  const body = data.map((item, i) => ([
    i + 1,
    item.tanggal,
    item.nama,
    item.jenis,
    item.ket,
    `Rp ${item.jumlah.toLocaleString("id-ID")}`,
    item.status
  ]));

  doc.autoTable({
    startY: 30,
    head: head,
    body: body,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [33, 150, 243],
      textColor: 255,
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });

  // SUMMARY
  let y = doc.lastAutoTable.finalY + 8;
  doc.setFontSize(10);
  doc.text(`Total Income   : Rp ${totalIncome.toLocaleString("id-ID")}`, 14, y);
  doc.text(`Total Expense  : Rp ${totalExpense.toLocaleString("id-ID")}`, 14, y + 6);
  doc.text(`Saldo Akhir    : Rp ${saldoAkhir.toLocaleString("id-ID")}`, 14, y + 12);

  doc.save("Laporan_ASIK.pdf");
}

// ======================================
// LOAD AWAL
// ======================================
renderTable();
updateInfo();

