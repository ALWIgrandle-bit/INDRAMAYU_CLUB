// ═══════════════════════════════════════════════════════════════════
// AGEN ALWI BOT - NODE.JS TERMINAL VERSION (PATCH LOGIKA INPUT)
// ═══════════════════════════════════════════════════════════════════

const readline = require('readline');

const AGEN_ALWI_CONFIG = {
  nama: 'Agen Alwi',
  emoji: '🤖',
  personality: 'ramah-profesional'
};

const MENU_LAYANAN = {
  'beranda': { label: '🏠 Beranda', url: 'index.html', desc: 'Halaman utama Indramayu Club' },
  'dashboard': { label: '📊 Dashboard', url: 'DASHBOARD.html', desc: 'Panel kontrol member & statistik' },
  'kamus': { label: '📖 Kamus Indramayu', url: 'kamus.html', desc: 'Kamus bahasa & bonus poin + klaim kode voucher' },
  'kalkulator': { label: '🧮 Kalkulator Berkah', url: 'KALKULATOR.html', desc: 'Kalkulator wujud makrifat' },
  'live_member': { label: '👥 Live Member', url: 'live_member.html', desc: 'Streaming anggota club live' },
  'live_vvip': { label: '👑 Live VVIP', url: 'Live_vvip.html', desc: 'Panggung Sultan eksklusif' },
  'komentar': { label: '💬 Ruang Diskusi', url: 'komentar.html', desc: 'Forum member berbagi kesan' },
  'login': { label: '🔐 Login', url: 'login.html', desc: 'Verifikasi member Telkomsel' }
};

const JADWAL_AZAN = {
  subuh: { waktu: '04:30', nama: 'Subuh' },
  dzuhur: { waktu: '12:05', nama: 'Dzuhur' },
  ashar: { waktu: '15:35', nama: 'Ashar' },
  maghrib: { waktu: '18:15', nama: 'Maghrib' },
  isya: { waktu: '19:45', nama: 'Isya' }
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function sapaAlwi() {
  console.log(`\n==================================================`);
  console.log(`${AGEN_ALWI_CONFIG.emoji} [${AGEN_ALWI_CONFIG.nama}] Assalamu'alaikum wa rahmatullahi wa barakatuh!`);
  console.log(`Pusat Kendali Node.js Aktif Mandali 100%.`);
  console.log(`Ketik "menu" untuk melihat navigasi atau "keluar" untuk menyudahi.`);
  console.log(`==================================================\n`);
  tanyaUser();
}

function tanyaUser() {
  rl.question('Admin Dulkohar > ', (jawaban) => {
    const teks = jawaban.trim().toLowerCase();
    
    if (teks === 'keluar' || teks === 'exit') {
      console.log(`\n🤖 [Agen Alwi]: Siap, interaksi ditutup. Sistem kembali standby!`);
      rl.close();
      return;
    }

    const respons = prosesKatalkunciNode(teks);
    console.log(`\n🤖 [Agen Alwi]: ${respons}\n`);
    tanyaUser();
  });
}

function prosesKatalkunciNode(teks) {
  // 1. Cek Menu / Layanan
  if (teks === 'menu' || teks === 'layanan' || teks === 'list') {
    let daftarMenu = 'Daftar Layanan Publik Indramayu Club:\n';
    Object.values(MENU_LAYANAN).forEach(m => {
      daftarMenu += `  ${m.label} -> File: ${m.url} (${m.desc})\n`;
    });
    return daftarMenu;
  }

  // 2. Cek Jadwal Shalat (Mendukung kata "adzan" dan "azan")
  if (teks.includes('azan') || teks.includes('adzan') || teks.includes('jadwal') || teks.includes('shalat')) {
    let jadwal = 'Jadwal Shalat Wilayah Indramayu:\n';
    Object.values(JADWAL_AZAN).forEach(s => {
      jadwal += `  • ${s.nama}: ${s.waktu}\n`;
    });
    return jadwal;
  }

  // 3. Cek Sapaan (Mendukung hallo, halo, hai, assalam)
  if (teks.includes('halo') || teks.includes('hallo') || teks.includes('hai') || teks.includes('assalam')) {
    return "Wa'alaikum assalam, Pak Dulkohar! Ada instruksi logika baru untuk server?";
  }

  // 4. Cocokkan Halaman Secara Fleksibel
  for (const [key, menu] of Object.entries(MENU_LAYANAN)) {
    const namaBersih = menu.label.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim(); // Menghilangkan emoji
    if (teks.includes(key) || teks.includes(namaBersih) || (teks.length > 3 && namaBersih.includes(teks))) {
      return `Target Terdeteksi! Menemukan halaman ${menu.label}. Jalur file aman: components/../${menu.url}`;
    }
  }

  return 'Perintah belum terindeks di runtime Node.js. Ketik "menu", "adzan", atau nama halaman.';
}

setInterval(() => {
  const now = new Date();
  const jamSekarang = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  
  for (const [_, shalat] of Object.entries(JADWAL_AZAN)) {
    if (jamSekarang === shalat.waktu) {
      console.log(`\n\n📢 [PEMBERITAHUAN BANNER AZAN]: Waktu Shalat ${shalat.nama} Telah Tiba!`);
      break;
    }
  }
}, 60000);

sapaAlwi();
