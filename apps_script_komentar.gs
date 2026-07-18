apps_script_komentar.gs
// Google Apps Script - INDRAMAYU CLUB Komentar System
const SPREADSHEET_ID = "1dC72cKZDZBVzxdzXVGLk-8f3-CdAZtdk1lIv7Sm7bb8";
const SHEET_NAME = "INDRAMAYU_KOMENTAR";
const BACKUP_FOLDER_NAME = "INDRAMAYU_CLUB_BACKUPS";
const LOG_FOLDER_ID = "1rKDjAayJkMqa4vNCqUsZ6fRxY2VxtaXh";

function doGet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  const data = sheet.getDataRange().getValues();

  let komentarList = [];

  // Jika spreadsheet masih kosong (hanya header atau kosong sama sekali)
  if (data.length <= 1) {
    // Agen Alwi otomatis turun tangan memberikan sambutan
    komentarList.push({
      nama: "👑 Agent Alwi",
      email: "agent.alwi@indramayu.club",
      nomor_telepon: "+62-811-AUTOMATION",
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: "Siappp Termantau",
      ip: "127.0.0.1 (Local Core)",
      timestamp: new Date().toISOString(),
      pesan: "Selamat datang di ekosistem Indramayu Club! Sistem radar otomatisasi berhasil dikonfigurasi. Silakan tinggalkan kesan dan pesan Anda di sini, Bos!  🌿🔥"
    });
  } else {
    // Jika sudah ada isinya, baca baris data dari spreadsheet (Lewati baris 1 jika itu Header)
    for (let i = 1; i < data.length; i++) {
      komentarList.push({
        nama: data[i][0] || "Anonim",
        email: data[i][1] || "-",
        nomor_telepon: data[i][2] || "-",
        waktu: data[i][3] || "-",
        status: data[i][4] || "Aktif",
        ip: data[i][5] || "0.0.0.0",
        timestamp: data[i][6] || "-",
        pesan: data[i][7] || ""
      });
    }
  }

  // Bungkus ke dalam format JSON Response
  const output = {
    success: true,
    komentar: komentarList
  };

  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// Fungsi penampung data masuk (POST / google.script.run)
function prosesDiskusi(payload) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    // Susun baris sesuai urutan: Nama, Email, Nomor Telepon, Waktu, Status, IP, Timestamp, Pesan
    sheet.appendRow([
      payload.nama,
      payload.email,
      payload.nomor_telepon,
      payload.waktu,
      payload.status,
      payload.ip,
      payload.timestamp,
      payload.pesan
    ]);

    return "Data berhasil disimpan ke ekosistem awan Indramayu Club ✓";
  } catch (error) {
    throw new Error("Gagal menulis ke Sheets: " + error.toString());
  }
}

