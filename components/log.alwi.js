/**
 * ╔══════════════════════════════════════════╗
 * ║   SERVER_ALWI.JS — Komentar Member       ║
 * ║   Indramayu Club Makrifat                ║
 * ║   Port: 8882 · Data: log_member.json     ║
 * ╚══════════════════════════════════════════╝
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT     = 8882;
const LOG_FILE = path.join(__dirname, 'log_member.json');
const MAX      = 300;

// ── Init file log kalau belum ada ──
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, JSON.stringify([]));
  console.log('✅ log_member.json dibuat');
}

// ── Baca log ──
function readLog() {
  try { return JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')); }
  catch(e) { return []; }
}

// ── Simpan log ──
function writeLog(data) {
  fs.writeFileSync(LOG_FILE, JSON.stringify(data, null, 2));
}

// ── Format nomor M001 ──
function formatNum(n) {
  return 'M' + String(n).padStart(3, '0');
}

// ── CORS headers ──
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Parse body POST ──
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch(e) { resolve({}); }
    });
  });
}

// ── HTTP SERVER ──
const server = http.createServer(async (req, res) => {
  setCORS(res);
  res.setHeader('Content-Type', 'application/json');

  const url = req.url.split('?')[0];

  // OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200); return res.end();
  }

  // ── GET /log — ambil semua komentar ──
  if (url === '/log' && req.method === 'GET') {
    const logs = readLog();
    res.writeHead(200);
    return res.end(JSON.stringify({
      ok     : true,
      total  : logs.length,
      max    : MAX,
      sisa   : MAX - logs.length,
      data   : logs.slice().reverse() // terbaru di atas
    }));
  }

  // ── GET /status — cek server ──
  if (url === '/status' && req.method === 'GET') {
    const logs = readLog();
    res.writeHead(200);
    return res.end(JSON.stringify({
      ok     : true,
      server : 'Server Alwi — Indramayu Club',
      port   : PORT,
      total  : logs.length,
      max    : MAX,
      sisa   : MAX - logs.length,
      waktu  : new Date().toLocaleString('id-ID')
    }));
  }

  // ── POST /komen — tambah komentar baru ──
  if (url === '/komen' && req.method === 'POST') {
    const body = await parseBody(req);
    const nama  = (body.nama  || '').trim().substring(0, 30);
    const komen = (body.komen || '').trim().substring(0, 300);

    if (!nama || !komen) {
      res.writeHead(400);
      return res.end(JSON.stringify({ ok: false, pesan: 'Nama dan komentar wajib diisi!' }));
    }

    const logs = readLog();

    if (logs.length >= MAX) {
      res.writeHead(400);
      return res.end(JSON.stringify({
        ok   : false,
        pesan: 'Log sudah penuh 300 member! Hubungi Admin Pak Jamhari.'
      }));
    }

    const entry = {
      num  : logs.length + 1,
      id   : formatNum(logs.length + 1),
      nama : nama,
      komen: komen,
      ts   : Date.now(),
      waktu: new Date().toLocaleString('id-ID')
    };

    logs.push(entry);
    writeLog(logs);

    console.log(`✅ Komentar baru: [${entry.id}] ${nama}`);

    res.writeHead(200);
    return res.end(JSON.stringify({
      ok   : true,
      pesan: `Terima kasih ${nama}! Komentar tersimpan sebagai ${entry.id}`,
      data : entry
    }));
  }

  // ── DELETE /reset — reset semua log (admin only) ──
  if (url === '/reset' && req.method === 'DELETE') {
    const body = await parseBody(req);
    
    // Password admin sederhana
    if (body.password !== 'aliflammim') {
      res.writeHead(403);
      return res.end(JSON.stringify({ ok: false, pesan: 'Password salah!' }));
    }

    // Backup dulu sebelum reset
    const logs = readLog();
    const backupFile = path.join(__dirname, `log_backup_${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(logs, null, 2));
    
    writeLog([]);
    console.log(`🗑️ Log direset. Backup: ${backupFile}`);

    res.writeHead(200);
    return res.end(JSON.stringify({
      ok     : true,
      pesan  : 'Log berhasil direset!',
      backup : backupFile,
      total_backup: logs.length
    }));
  }

  // ── GET /export — export log sebagai teks ──
  if (url === '/export' && req.method === 'GET') {
    const logs = readLog();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="log_member_IC.txt"');
    
    let txt = '═══ LOG KOMENTAR MEMBER ═══\n';
    txt += 'Indramayu Club Makrifat\n';
    txt += 'Export: ' + new Date().toLocaleString('id-ID') + '\n';
    txt += '═'.repeat(30) + '\n\n';
    
    logs.forEach(item => {
      txt += `[${item.id}] ${item.nama}\n`;
      txt += `${item.komen}\n`;
      txt += `${item.waktu}\n`;
      txt += '─'.repeat(28) + '\n';
    });

    res.writeHead(200);
    return res.end(txt);
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ ok: false, pesan: 'Endpoint tidak ditemukan' }));
});

server.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════╗');
  console.log('║   ⛑️  SERVER ALWI — ONLINE           ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║   Port   : http://localhost:${PORT}      ║`);
  console.log(`║   Log    : log_member.json           ║`);
  console.log(`║   Max    : ${MAX} member                ║`);
  console.log('╚══════════════════════════════════════╝');
  console.log('');
  console.log('Endpoint tersedia:');
  console.log(`  GET    /status  → cek server`);
  console.log(`  GET    /log     → ambil semua komentar`);
  console.log(`  POST   /komen   → kirim komentar baru`);
  console.log(`  DELETE /reset   → reset log (butuh password)`);
  console.log(`  GET    /export  → download log .txt`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} sudah dipakai!`);
  } else {
    console.log('❌ Error:', err.message);
  }
});

	
