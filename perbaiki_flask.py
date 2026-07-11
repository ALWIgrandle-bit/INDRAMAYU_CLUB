import base64
import time
import subprocess
from flask import Flask, jsonify, request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Penyimpanan frame di memory
FRAME_STORE  = {}
FRAME_TS     = {}

# ── Fungsi Otomatisasi Rclone (Sedot Data dari Google Drive) ──
def unduh_database_dari_drive():
    try:
        # Menjalankan perintah rclone untuk menyalin database terbaru ke lokal Termux
        print("[SISTEM] Sinkronisasi database dari Google Drive sedang berjalan...")
        subprocess.run(
            ["rclone", "copy", "drive1:Database Indramayu Club.xlsx", "./"], 
            check=True
        )
        print("[SISTEM] Sinkronisasi sukses!")
        return True
    except Exception as e:
        print(f"[ERROR] Gagal mengambil data dari Drive: {e}")
        return False

# ── Rute Baru untuk Memicu Sinkronisasi Google Drive via API ──
@app.route('/sync-db', methods=['GET'])
def sync_database():
    if unduh_database_dari_drive():
        return jsonify({
            "status": "ok", 
            "pesan": "Database Indramayu Club berhasil diperbarui ke lokal Termux"
        }), 200
    return jsonify({
        "status": "error", 
        "pesan": "Gagal melakukan sinkronisasi dengan Google Drive"
    }), 500

# ── Terima frame dari HP member ──
@app.route('/upload-frame', methods=['POST'])
def upload_frame():
    data      = request.get_json(silent=True) or {}
    member_id = data.get('id','').strip().upper()
    frame_b64 = data.get('frame','')
    if not member_id or not frame_b64:
        return jsonify({"status":"error","pesan":"Data tidak lengkap"}), 400
    try:
        FRAME_STORE[member_id] = base64.b64decode(frame_b64)
        FRAME_TS[member_id]    = time.time()
        return jsonify({"status":"ok","id":member_id})
    except Exception as e:
        return jsonify({"status":"error","pesan":str(e)}), 500

# ── Sajikan frame ke browser lain ──
@app.route('/frame/<member_id>')
def get_frame(member_id):
    mid = member_id.strip().upper()
    if mid in FRAME_STORE:
        return Response(FRAME_STORE[mid], mimetype='image/jpeg')
    return jsonify({"status":"error","pesan":"Frame kosong"}), 404

if __name__ == '__main__':
    # Opsional: Jalankan sinkronisasi sekali saat server pertama kali dihidupkan
    unduh_database_dari_drive()
    
    app.run(host='0.0.0.0', port=8891, debug=True)

