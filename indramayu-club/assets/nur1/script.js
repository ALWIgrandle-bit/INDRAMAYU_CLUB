// ═══════════════════════════════════════════════════════════════════
// INDRAMAYU HOME ECOSYSTEM ENGINE - PRODUCTION CORE JS
// ═══════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  initClock();
  initSearch();
  initApps();
  initDialer();
  initAlwiBot();
});

// ── 1. CLOCK ENGINE ──
function initClock() {
  const updateClock = () => {
    const now = new Date();
    const t = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    
    const clockTime = document.getElementById('clock-time');
    const sbTime = document.getElementById('sb-time');
    const clockDate = document.getElementById('clock-date');
    
    if(clockTime) clockTime.textContent = t;
    if(sbTime) sbTime.textContent = t;
    
    const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    if(clockDate) {
      clockDate.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }
  };
  updateClock();
  setInterval(updateClock, 10000);
}

// ── 2. GOOGLE SEARCH ENGINE ──
function initSearch() {
  const input = document.getElementById('searchInput');
  const suggestions = document.getElementById('suggestions');
  const searchBtn = document.getElementById('searchBtn');
  const micBtn = document.getElementById('micBtn');
  const scrollArea = document.getElementById('scrollArea');

  const doSearch = () => {
    const q = input.value.trim();
    if (!q) return;
    window.open('https://www.google.com/search?q=' + encodeURIComponent(q), '_blank');
    if(suggestions) suggestions.classList.remove('show');
  };

  if(input) {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.length > 0 && suggestions) {
        suggestions.classList.add('show');
        const items = suggestions.querySelectorAll('.suggest-item');
        const queries = [val + ' Indramayu Club', val + ' Indramayu', val, val + ' Indonesia'];
        items.forEach((el, i) => {
          el.textContent = '🔍 ' + queries[i];
          el.onclick = () => {
            input.value = queries[i];
            suggestions.classList.remove('show');
            doSearch();
          };
        });
      } else if(suggestions) {
        suggestions.classList.remove('show');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  }

  if(searchBtn) searchBtn.addEventListener('click', doSearch);
  if(scrollArea) scrollArea.addEventListener('click', () => { if(suggestions) suggestions.classList.remove('show'); });

  if(micBtn) {
    micBtn.addEventListener('click', () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Maaf, browser Anda belum mendukung pencarian suara.');
        return;
      }
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SR();
      rec.lang = 'id-ID';
      rec.start();
      rec.onresult = (e) => {
        input.value = e.results[0][0].transcript;
        doSearch();
      };
    });
  }
}

// ── 3. INTERFACE POPUP ENGINE (WEBVIEW FRAME) ──
let currentUrl = '';
function openApp(name, url, icon) {
  currentUrl = url;
  document.getElementById('p-icon').textContent = icon;
  document.getElementById('p-title').textContent = name;
  document.getElementById('p-url').textContent = url.replace('https://','').replace('http://','').split('/')[0];
  document.getElementById('p-frame').src = url;

  const alwi = document.getElementById('agenAlwiContainer');
  if (alwi) { alwi.style.visibility = 'hidden'; alwi.style.pointerEvents = 'none'; }

  const popup = document.getElementById('popup');
  popup.style.cssText = 'display:flex!important;position:fixed!important;inset:0!important;z-index:2147483647!important;background:rgba(0,0,0,0.85)!important;align-items:center!important;justify-content:center!important;backdrop-filter:blur(4px)!important;';
}

function closePopup() {
  const popup = document.getElementById('popup');
  popup.style.cssText = 'display:none!important;';
  document.getElementById('p-frame').src = 'about:blank';

  const alwi = document.getElementById('agenAlwiContainer');
  if (alwi) { alwi.style.visibility = 'visible'; alwi.style.pointerEvents = 'auto'; }
}

function initApps() {
  document.querySelectorAll('.app-item, .dock-item').forEach(el => {
    const url = el.getAttribute('data-url');
    if(url) {
      el.addEventListener('click', () => {
        const name = el.getAttribute('data-name');
        const icon = el.getAttribute('data-icon');
        openApp(name, url, icon);
      });
    }

    el.addEventListener('click', function() {
      const targetIcon = this.querySelector('.app-icon, .folder-box, .dock-icon');
      if(targetIcon){ 
        targetIcon.style.transform = 'scale(0.82)'; 
        setTimeout(() => targetIcon.style.transform = '', 150); 
      }
    });
  });

  document.getElementById('closePopupBtn').addEventListener('click', closePopup);
  document.getElementById('cancelPopupBtn').addEventListener('click', closePopup);
  document.getElementById('openExternalBtn').addEventListener('click', () => {
    window.open(currentUrl, '_blank');
    closePopup();
  });
}

// ── 4. DIALER ENGINE FOR PHONE REAL INTERACTION ──
let dialNum = '';
function initDialer() {
  const dialer = document.getElementById('dialer');
  const display = document.getElementById('dialDisplay');

  document.getElementById('dockDialer').addEventListener('click', () => {
    dialNum = '';
    display.textContent = 'Masukkan nomor...';
    dialer.classList.add('show');
  });

  document.getElementById('closeDialerBtn').addEventListener('click', () => dialer.classList.remove('show'));

  document.querySelectorAll('.dial-key').forEach(btn => {
    btn.addEventListener('click', () => {
      dialNum += btn.getAttribute('data-key');
      display.textContent = dialNum;
    });
  });

  document.getElementById('dialDeleteBtn').addEventListener('click', () => {
    dialNum = dialNum.slice(0, -1);
    display.textContent = dialNum || 'Masukkan nomor...';
  });

  document.getElementById('dialCallBtn').addEventListener('click', () => {
    if (!dialNum) { alert('Masukkan nomor telepon member terlebih dahulu, Bos!'); return; }
    window.location.href = 'tel:' + dialNum;
  });
}

// ── 5. INTEGRASI AGEN ALWI MATRIX SYSTEM ──
const AGEN_ALWI_CONFIG = { nama: 'ALWI grendle', emoji: '⛑️', warnaUtama: '#06140b', warnaBorder: '#c9a84c', suara_enabled: true };
const MENU_LAYANAN = {
  'nur1': { label: '🏠 Nur 1 - INDRAMAYU_CLUB', desc: 'Beranda Makrifat', pages: [{ key: 'live', icon: '📺', label: 'Media Utama', url: 'nur1_media.html' }] },
  'nur2': { label: '💬 Nur 2 - DASHBOARD SULTAN', desc: 'Login, Server Raja', pages: [{ key: 'login', icon: '🔐', label: 'Login Sultan', url: 'nur2_login.html' }, { key: 'raja', icon: '👑', label: 'Raja Server', url: 'nur2_raja_server.html' }] },
  'nur3': { label: '📊 Nur 3 - ADMINISTRASI', desc: 'Kas 5% & Voucher', pages: [{ key: 'keuangan', icon: '💰', label: 'Keuangan Pagi', url: 'nur3_keuangan_pagi.html' }] },
  'nur7': { label: '🔊 Nur 7 - STREAMING & LIVE', desc: 'Live & Panggung', pages: [{ key: 'live', icon: '👥', label: 'Live Member', url: 'nur7b_live_member.html' }, { key: 'streaming', icon: '📹', label: 'Streaming', url: 'nur7a_streaming.html' }] },
  'nur9': { label: '🎮 Nur 9 - BACKUP_INDRAMAYU', desc: 'Sinkronisasi', pages: [{ key: 'index', icon: '🔁', label: 'Backup', url: 'nur9/index.html' }] }
};
const JADWAL_AZAN = { subuh: '04:30', dzuhur: '12:05', ashar: '15:35', maghrib: '18:15', isya: '19:45' };

let audioContext = null;
let ttsEnabled = (localStorage.getItem('ic_alwi_suara') !== 'off');

function playAzanSound() {
  if (!AGEN_ALWI_CONFIG.suara_enabled) return;
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let time = audioContext.currentTime;
    [220, 294, 392].forEach(f => {
      let osc = audioContext.createOscillator();
      let gain = audioContext.createGain();
      osc.frequency.setValueAtTime(f, time);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(time); osc.stop(time + 0.4);
      time += 0.5;
    });
  } catch(e) {}
}

function bicaraTTS(teks) {
  if (!ttsEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(teks.replace(/[^\w\s,.!?]/g, ''));
  u.lang = 'id-ID';
  window.speechSynthesis.speak(u);
}

window.toggleSuaraAlwi = function() {
  ttsEnabled = !ttsEnabled;
  localStorage.setItem('ic_alwi_suara', ttsEnabled ? 'on' : 'off');
  document.getElementById('agenAlwiSuaraToggle').textContent = ttsEnabled ? '🔊' : '🔇';
  if(ttsEnabled) bicaraTTS("Suara aktif");
};

window.toggleAgenAlwi = function() {
  document.getElementById('agenAlwiWindow').classList.toggle('aktif');
};

window.kirimPesanKeAlwi = function() {
  const input = document.getElementById('agenAlwiInput');
  const teks = input.value.trim().toLowerCase();
  if(!teks) return;

  tambahChat('user', input.value);
  input.value = '';

  setTimeout(() => {
    if (teks === 'menu' || teks === 'layanan') {
      let m = 'Daftar Ruangan Nur:\n' + Object.values(MENU_LAYANAN).map(i => i.label).join('\n');
      tambahChat('alwi', m);
    } else if (MENU_LAYANAN[teks]) {
      const menu = MENU_LAYANAN[teks];
      let html = `<div style="font-weight:bold;color:#ffd700;">${menu.label}</div><div style="font-size:11px;color:#c9a84c;">${menu.desc}</div><div class="alwi-grid-btn">`;
      menu.pages.forEach(p => {
        html += `<div class="alwi-icon-btn" onclick="window.location.href='${p.url}'">${p.icon}<span style="font-size:9px;">${p.key}</span></div>`;
      });
      html += '</div>';
      tambahChatHTML(html);
    } else {
      tambahChat('alwi', 'Perintah salah. Ketik "menu" atau kode seperti "nur7".');
    }
  }, 400);
};

function tambahChat(sender, teks) {
  const box = document.getElementById('agenAlwiChat');
  const item = document.createElement('div');
  item.className = `alwi-message msg-${sender}`;
  item.innerHTML = `<div class="msg-bubble" style="white-space:pre-line;"></div>`;
  item.querySelector('.msg-bubble').textContent = teks;
  box.appendChild(item);
  box.scrollTop = box.scrollHeight;
  if(sender === 'alwi') bicaraTTS(teks);
}

function tambahChatHTML(html) {
  const box = document.getElementById('agenAlwiChat');
  const item = document.createElement('div');
  item.className = 'alwi-message msg-alwi';
  item.innerHTML = `<div class="msg-bubble">${html}</div>`;
  box.appendChild(item);
  box.scrollTop = box.scrollHeight;
}

function initAlwiBot() {
  if(document.getElementById('agenAlwiContainer')) return;
  const h = `
    <div id="agenAlwiContainer" style="position: fixed; bottom: 20px; right: 20px; z-index: 9998; font-family: 'Inter', sans-serif;">
      <button id="agenAlwiToggle" onclick="toggleAgenAlwi()" style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #06140b, #0a2e1c); border: 3px solid #c9a84c; color: #ffd700; font-size: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center;">⛑️</button>
      <div id="agenAlwiWindow" style="display: none; position: absolute; bottom: 90px; right: 0; width: 360px; height: 480px; background: linear-gradient(180deg, #06140b 0%, #0a2e1c 100%); border: 2px solid #c9a84c; border-radius: 16px; flex-direction: column; z-index: 9999;">
        <div style="background: linear-gradient(135deg, #06140b, #0a2e1c); border-bottom: 2px solid #c9a84c; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 14px 14px 0 0;">
          <div style="display: flex; align-items: center; gap: 10px;"><span style="font-size: 24px;">⛑️</span>
            <div><div style="font-size: 14px; font-weight: 900; color: #ffd700;">AGEN ALWI</div><div style="font-size: 10px; color: #c9a84c;">Navigasi Visual Makrifat</div></div>
          </div>
          <div style="display:flex; gap:6px;"><button id="agenAlwiSuaraToggle" onclick="toggleSuaraAlwi()" style="background:transparent; border:1px solid #c9a84c; color:#ffd700; width:28px; height:28px; border-radius:6px; cursor:pointer;">${ttsEnabled?'🔊':'🔇'}</button><button onclick="toggleAgenAlwi()" style="background:transparent; border:1px solid #c9a84c; color:#ffd700; width:28px; height:28px; border-radius:6px; cursor:pointer;">✕</button></div>
        </div>
        <div id="agenAlwiChat" style="flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px;" class="alwi-chat-scroll"></div>
        <div style="border-top: 1px solid #c9a84c; padding: 10px; display: flex; gap: 8px;">
          <input type="text" id="agenAlwiInput" placeholder="Ketik (ex: nur7, menu)..." onkeypress="if(event.key==='Enter') kirimPesanKeAlwi()" style="flex: 1; background: #06140b; border: 1px solid #c9a84c; border-radius: 8px; padding: 10px 12px; color: #ffd700; font-size: 12px; outline: none;" />
          <button onclick="kirimPesanKeAlwi()" style="background: linear-gradient(135deg, #c9a84c, #ffd700); border: none; border-radius: 8px; width: 40px; height: 40px; color: #06140b; cursor: pointer; font-weight: 900;">➔</button>
        </div>
      </div>
    </div>
    <style>
      #agenAlwiWindow.aktif { display: flex !important; }
      .alwi-chat-scroll::-webkit-scrollbar { width: 4px; }
      .alwi-chat-scroll::-webkit-scrollbar-thumb { background: #c9a84c; }
      .alwi-message { display: flex; gap: 8px; }
      .msg-user { justify-content: flex-end; }
      .msg-bubble { max-width: 85%; padding: 10px 12px; border-radius: 10px; font-size: 13px; line-height: 1.4; }
      .msg-alwi .msg-bubble { background: #0a2e1c; border: 1px solid #c9a84c; color: #ffd700; }
      .msg-user .msg-bubble { background: #c9a84c; color: #06140b; font-weight: 600; }
      .alwi-grid-btn { display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; }
      .alwi-icon-btn { background: #06140b; border: 1px solid #c9a84c; border-radius: 8px; color: #ffd700; padding: 8px; cursor: pointer; display: flex; flex-direction: column; align-items: center; min-width: 50px; }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', h);
  setTimeout(() => tambahChat('alwi', "Assalamu'alaikum! Agen Alwi aktif. Ketik 'menu' untuk opsi navigasi."), 500);

  // Jadwal Azan Loop
  setInterval(() => {
    const timeNow = String(new Date().getHours()).padStart(2,'0') + ':' + String(new Date().getMinutes()).padStart(2,'0');
    Object.entries(JADWAL_AZAN).forEach(([name, time]) => {
      if (timeNow === time) {
        playAzanSound();
        tambahChat('alwi', `Waktu shalat ${name} untuk Indramayu telah tiba.`);
      }
    });
  }, 60000);
}

