#!/bin/bash
# NAMA: ALWI.sh - Sang Pengendali Cache
# FUNGSI: Automasi Kerajaan Indramayu Club 10 Akun

echo "👑 ALWI GRADLEW SIAPP BOSSS 🔥"
echo "Status: Ekosistem Online..."

# 1. Pastikan folder log ada, jika belum buat otomatis
mkdir -p dokumen_log_chve_alwi

# 2. Cek Cache / Log Hari Ini
TANGGAL=$(date +%Y-%m-%d)
LOGFILE="dokumen_log_chve_alwi/log_$TANGGAL.md"

if [ ! -f "$LOGFILE" ]; then
  echo "# CHVE ALWI - $TANGGAL" > "$LOGFILE"
  echo "Status: Bot Bangun | Mood: Siappp" >> "$LOGFILE"
  echo "✅ File log anyar wis digawe: $LOGFILE"
else
  echo "✅ Log dina iki wis ana. Ora usah gawe maning."
fi

# 3. Masuk ke folder Aktor dan Cek File Inti
if [ -d "AKTORalwi" ]; then
  cd AKTORalwi
  ls -1 Alwi.html cetak_biru_alwi.md kamus_src.md 2>/dev/null
  echo "📂 File Inti: Aman | Folder CHVE: Aman"
  cd ..
fi

# 4. Buka Peta resmi
echo "🗺️  Buka PETA RESMI V2..."
xdg-open index_lab.html 2>/dev/null || echo "Buka manual: index_lab.html"

echo "Selesai. ALWI Standby neng Gerbang..."

