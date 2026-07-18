#!/bin/bash
echo "👑 INDRAMAYU CLUB CORE - Memulai Sinkronisasi GitHub... 🔥"

# 1. Konfigurasi Remote URL dengan Token Otomatis
git remote remove origin 2>/dev/null
git remote add origin https://ALWIgrandle-bit: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@github.com/ALWIgrandle-bit/INDRAMAYU_CLUB.git

# 2. Ambil perubahan terbaru dari GitHub untuk mencegah bentrok
echo "📥 Menyelaraskan riwayat dari GitHub..."
git pull origin main --rebase

# 3. Masukkan semua aset utama dan upload
echo "📤 Mengemas seluruh file core..."
git add .
git commit -m "Auto sync core: $(date '+%Y-%m-%d %H:%M:%S')"

echo "🚀 Mendorong data ke GitHub..."
git push origin main

echo "✅ Semua beres! Seluruh aset di hugoNUR3 aman di awan."

