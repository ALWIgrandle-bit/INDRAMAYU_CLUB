from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
import subprocess
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASET_DIR = os.path.join(BASE_DIR, '03_ADM_KEUANGAN')

app = Flask(__name__, template_folder='.')
CORS(app)

@app.route('/generate')
def generate():
    try:
        script_path = os.path.join(BASE_DIR, '03_ADM_KEUANGAN', 'Video_generator.py')
        if not os.path.isfile(script_path):
            return jsonify({"status": "error", "message": f"File tidak ditemukan: {script_path}"})

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
        print("[SISTEM] Memulai Flask Server di Port 8890...")
        app.run(host='0.0.0.0', port=8890, debug=False)
    except OSError as e:
        print(f"[ERROR] Gagal bind ke port 8890: {e}")
