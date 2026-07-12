// ═══════════════════════════════════════════════════════════════════
// RADAR BACKEND - Cek status port 8890 & ambil link trycloudflare
// terbaru langsung dari tunnel.log, otomatis (tanpa perlu buka terminal)
// ═══════════════════════════════════════════════════════════════════
const express = require('express');
const fs = require('fs');
const net = require('net');
const path = require('path');

const app = express();
const PORT = 8899; // port khusus radar, sengaja dipisah dari server utama

// --- KONFIGURASI: sesuaikan kalau lokasi log Bapak beda ---
const TARGET_PORT = 8890; // port server lokal yang di-tunnel cloudflared
const LOG_PATHS = [
  path.join(process.env.HOME || '', '👑raja', 'tunnel.log'),
  path.join(process.env.HOME || '', '.cloudflared', 'tunnel.log'),
  path.join(process.env.HOME || '', 'hugoNUR3', 'tunnel.log')
];

function cekPortAktif(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host: '127.0.0.1', timeout: 1500 });
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
  });
}

function ambilLinkTerbaru() {
  for (const logPath of LOG_PATHS) {
    try {
      if (!fs.existsSync(logPath)) continue;
      const isi = fs.readFileSync(logPath, 'utf8');
      const cocok = [...isi.matchAll(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/gi)];
      if (cocok.length > 0) {
        return { url: cocok[cocok.length - 1][0], sumber: logPath };
      }
    } catch (e) {
      continue;
    }
  }
  return null;
}

// Izinkan diakses dari halaman HTML manapun di device yang sama
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/status', async (req, res) => {
  const online = await cekPortAktif(TARGET_PORT);
  const hasilLink = ambilLinkTerbaru();
  res.json({
    online,
    port: TARGET_PORT,
    link: hasilLink ? hasilLink.url : null,
    sumberLog: hasilLink ? hasilLink.sumber : null,
    dicekPada: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🛰️  Radar backend aktif di port ${PORT}, memantau server lokal port ${TARGET_PORT}`);
  console.log(`   Buka radar_cloudflared.html di browser HP (akses ke 127.0.0.1) untuk lihat dashboard.`);
});

