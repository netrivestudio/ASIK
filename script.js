function exportPDF() {
  if (data.length === 0) {
    alert("Data masih kosong!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  // ===============================
  // HITUNG TOTAL
  // ===============================
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

  // ===============================
  // HEADER (MINUMO STYLE)
  // ===============================
  doc.setFontSize(14);
  doc.text("ASIK - Amal Sosial Kemasyarakatan", 14, 15);

  doc.setFontSize(10);
  doc.text(`Export: ${exportTime}`, 14, 22);

  // ===============================
  // DATA TABEL
  // ===============================
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
      fillColor: [33, 150, 243],   // BIRU MINUMO
      textColor: 255,
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]   // ZEBRA abu-abu
    }
  });

  // ===============================
  // RINGKASAN (BAWAH TABEL)
  // ===============================
  let y = doc.lastAutoTable.finalY + 8;

  doc.setFontSize(10);
  doc.text(`Total Income      : Rp ${totalIncome.toLocaleString("id-ID")}`, 14, y);
  doc.text(`Total Expense     : Rp ${totalExpense.toLocaleString("id-ID")}`, 14, y + 6);
  doc.text(`Saldo Akhir       : Rp ${saldoAkhir.toLocaleString("id-ID")}`, 14, y + 12);

  // ===============================
  // SIMPAN
  // ===============================
  doc.save("Laporan_ASIK.pdf");
}
