function exportPDF() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // =====================
  // HITUNG TOTAL
  // =====================
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
  const tanggalCetak = new Date().toLocaleDateString("id-ID");

  // =====================
  // HEADER LAPORAN
  // =====================
  doc.setFontSize(16);
  doc.text("ASIK", 105, 15, { align: "center" });

  doc.setFontSize(11);
  doc.text("Amal Sosial Kemasyarakatan", 105, 22, { align: "center" });
  doc.text("Bersama Kita Berbagi, Bersama Kita Peduli", 105, 28, { align: "center" });

  doc.text(`Tanggal Cetak : ${tanggalCetak}`, 14, 40);

  // =====================
  // TABEL DETAIL (HEADER BIRU)
  // =====================
  const head = [[
    "Tanggal",
    "Nama Donatur",
    "Jenis",
    "Keterangan",
    "Jumlah",
    "Status"
  ]];

  const body = data.map(item => ([
    item.tanggal,
    item.nama,
    item.jenis,
    item.ket,
    `Rp ${item.jumlah.toLocaleString("id-ID")}`,
    item.status
  ]));

  doc.autoTable({
    head: head,
    body: body,
    startY: 45,
    styles: {
      fontSize: 9
    },
    headStyles: {
      fillColor: [21, 101, 192], // BIRU MINUMO
      textColor: [255, 255, 255], // putih
      halign: "center"
    },
    bodyStyles: {
      halign: "center"
    }
  });

  // =====================
  // RINGKASAN
  // =====================
  let y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(11);
  doc.text(`Total Income   : Rp ${totalIncome.toLocaleString("id-ID")}`, 14, y);
  doc.text(`Total Expense  : Rp ${totalExpense.toLocaleString("id-ID")}`, 14, y + 8);
  doc.text(`Saldo Akhir    : Rp ${saldoAkhir.toLocaleString("id-ID")}`, 14, y + 16);

  // =====================
  // SIMPAN PDF
  // =====================
  doc.save("Laporan_ASIK_Detail.pdf");
}
