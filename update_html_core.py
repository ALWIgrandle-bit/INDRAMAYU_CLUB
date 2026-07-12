import os

html_templates = {
    "index.html": ("Nur 1 - Ruang Kendali Pusat", "<h1>Pusat Kendali Indramayu Club</h1><p>Status Sistem: Aktif. Mengalihkan ke gerbang utama...</p>"),
    "login.html": ("Nur 2 - Admin Kendali Sinyal", "<h1>Gerbang Masuk Member</h1><form><input type='text' placeholder='ID Member'><input type='password' placeholder='Sandi'><button>Masuk</button></form>"),
    "raja.html": ("Nur 2 - Raja Server", "<h1>Panel Akses Raja VVIP</h1><p>Monitoring jaringan dan kestabilan sinyal Telkomsel.</p>"),
    "komentar.html": ("Nur 3 - Keuangan Pagi", "<h1>Forum Diskusi & Feedback</h1><div id='comments'>Memuat masukan member...</div>"),
    "properti.html": ("Nur 4 - Aset Digital VVIP", "<h1>Manajemen Properti & GIF</h1><p>Daftar aset digital Indramayu Club Makrifat.</p>"),
    "kamus.html": ("Nur 5 - Menu Utama Kamus", "<h1>Kamus Arsitektur & Budget Poin</h1><p>Pusat distribusi Voucher dan poin member.</p>"),
    "KALKULATOR.html": ("Nur 6 - Bank Pusat", "<h1>Kalkulator Konversi & Kas</h1><p>Sistem Pemotongan Otomatis Kas 5% Aktif.</p>"),
    "live_member.html": ("Nur 7 - Hub Internasional Live", "<h1>Live Monitoring Member</h1><p>Menyapa Pejuang Devisa dengan puitis...</p>"),
    "Live_vvip.html": ("Nur 7 - Hub Internasional VVIP", "<h1>Panggung Eksklusif VVIP</h1><p>Area komunikasi khusus luar negeri.</p>"),
    "panggung_status.html": ("Nur 7 - Panggung Status", "<h1>Panggung Status TV</h1><p>Menampilkan hasil_panggung_tv.mp4</p>"),
    "nur7.html": ("Nur 8 - Security & Arena Game", "<h1>Pusat Pertahanan & Reset Harian</h1><p>Sinkronisasi otomatis harian pukul 18:00 - 19:00.</p>"),
    "DASHBOARD.html": ("Kamus Alwi - Panel Kontrol Utama", "<h1>Dashboard Utama Ahmad Alwi</h1><p>Panel kendali ahli waris Indramayu Club.</p>")
}

base_layout = """<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        body {{ font-family: sans-serif; background: #121212; color: #fff; padding: 20px; text-align: center; }}
        .container {{ max-width: 800px; margin: auto; background: #1e1e1e; padding: 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }}
        h1 {{ color: #00ffcc; }}
        .footer {{ margin-top: 30px; font-size: 0.8em; color: #888; border-top: 1px solid #333; padding-top: 10px; }}
    </style>
</head>
<body>
    <div class="container">
        {content}
        <div class="footer">
            Indramayu Club © 2026 | Folder: 03_ADM_KEUANGAN | Di bawah Lindungan Nur Makrifat
        </div>
    </div>
</body>
</html>"""

for filename, (title, content) in html_templates.items():
    if os.path.exists(filename):
        with open(filename, "w", encoding="utf-8") as f:
            f.write(base_layout.format(title=title, content=content))
        print(f"[ Sukses ] {filename} berhasil dirombak.")
    else:
        print(f"[ Lewat ] {filename} tidak ditemukan di folder saat ini.")
