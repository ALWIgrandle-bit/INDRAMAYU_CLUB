import time, json, requests

LOG_FILE = "components/log_member.json"
SPREADSHEET_URL = "URL_GOOGLE_APPS_SCRIPT_BAPAK_DISINI"

def sync():
    last_count = 0
    while True:
        try:
            with open(LOG_FILE, 'r') as f:
                data = json.load(f)
                current_count = len(data)
                
                if current_count > last_count:
                    new_entries = data[last_count:]
                    for entry in new_entries:
                        requests.post(SPREADSHEET_URL, json=entry)
                    last_count = current_count
        except:
            pass
        time.sleep(30) # Cek setiap 30 detik

if __name__ == "__main__":
    sync()

