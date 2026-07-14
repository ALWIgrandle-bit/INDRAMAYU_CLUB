from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import subprocess
import os

# 1. Tentukan BASE_DIR dan ASET_DIR
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASET_DIR = os.path.join(BASE_DIR, '03_ADM_KEUANGAN')

# 2. INISIALISASI 'app'
app = Flask(__name__, template_folder='.')
CORS(app)

@app.route('/generate')
def generate():
    try:
        script_path = os.path.join(BASE_DIR, '03_ADM_KEUANGAN', 'Video_generator.py')
        if not os.path.isfile(script_path):
            return jsonify({"status": "error", "message": f"File tidak ditemukan: {script_path}"})

        # Menjalankan script menggunakan python3 standar VM
        hasil = subprocess.run(
            ['python3', script_path],
            check=True,
            capture_output=True,
            text=True
        )
        
        print(hasil.stdout)
        return jsonify({"status": "sukses", "message": "Video berhasil dibuat!"})
        
    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": e.stderr or str(e)}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    try:
        # Port 8890 untuk Cloudflare Tunnel
        app.run(host='0.0.0.0', port=8890)
    except OSError as e:
        print(f"[ERROR] Gagal bind ke port 8890: {e}")

