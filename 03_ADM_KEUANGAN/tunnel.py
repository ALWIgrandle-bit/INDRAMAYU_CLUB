# python_cek_tunnel.py
import subprocess, json
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        log = subprocess.check_output("cat ~/.cloudflared/*.log | grep trycloudflare | tail -1", shell=True).decode()
        link = log.split('https://')[1].split(' ')[0] if 'https://' in log else 'Belum ada'
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"link": "https://" + link}).encode())

HTTPServer(('localhost', 8889), Handler).serve_forever()
