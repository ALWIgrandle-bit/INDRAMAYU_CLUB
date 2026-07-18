#!/bin/bash
echo "👑 INDRAMAYU CLUB CORE - Memulai Sinkronisasi GitHub... 🔥"

# 1. Konfigurasi Remote URL dengan Token Otomatis
git remote remove origin 2>/dev/null
git remote set-url origin https://<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>@github.com/ALWIgrandle-bit/INDRAMAYU_CLUB.git


# 2. Kemas dan amankan perubahan lokal TERLEBIH DAHULU
echo "📤 Mengemas seluruh file core..."
git add .
git commit -m "Auto sync core: $(date '+%Y-%m-%d %H:%M:%S')"

# 3. Ambil perubahan terbaru dari GitHub setelah lokal aman
echo "📥 Menyelaraskan riwayat dari GitHub..."
git pull origin main --rebase

# 4. Dorong data ke GitHub jika tidak ada konflik
echo "🚀 Mendorong data ke GitHub..."
git push origin main

echo "✅ Semua beres! Seluruh aset di hugoNUR3 aman di awan."

