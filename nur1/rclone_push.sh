#!/bin/bash

# Jalur folder utama administrasi keuangan Anda
LOKAL_DIR="$HOME/nama_env_anda/local_c4/03_ADM_KEUANGAN"

# Menggunakan remote drive3 yang sudah terdaftar resmi di rclone Anda
REMOTE_TARGET="drive3:03_ADM_KEUANGAN"

# Jalur file log langsung ditaruh di dalam folder nur1 saat ini
LOG_FILE="$LOKAL_DIR/nur1/rclone_system.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Memulai Sinkronisasi Backend Keuangan..." >> "$LOG_FILE"

# Eksekusi sinkronisasi rclone menggunakan remote drive3
rclone sync "$LOKAL_DIR" "$REMOTE_TARGET" \
    --exclude "node_modules/**" \
    --exclude ".git/**" \
    --log-file="$LOG_FILE" \
    --log-level INFO

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sinkronisasi Selesai Mandali!" >> "$LOG_FILE"
