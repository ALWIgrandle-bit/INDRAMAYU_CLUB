// ═══════════════════════════════════════════════════════════════════
// AGEN ALWI - PERBAIKAN SINTAKS, ERROR HANDLER & INTERNATIONAL LAW
// ═══════════════════════════════════════════════════════════════════

const AGEN_ALWI_CONFIG = {
  nama: 'Agen Alwi',
  emoji: '⛑️',
  warnaUtama: '#06140b',
  warnaBorder: '#c9a84c',
  suara_enabled: true,
  personality: 'ramah-profesional'
};

const MENU_LAYANAN = {
  'nur1': {
    label: '🏠 Nur 1 - INDRAMAYU_CLUB',
    desc: 'Main Portal & Makrifat Homepage',
    pages: [{ key: 'media', label: 'Media Utama', url: 'nur1_media.html' }]
  },
  'nur2': {
    label: '💬 Nur 2 - DASHBOARD SULTAN',
    desc: 'Login, King Server & Video Admin',
    pages: [
      { key: 'login', label: 'Login Sultan', url: 'nur2_login.html' },
      { key: 'raja', label: 'Raja Server', url: 'nur2_raja_server.html' },
      { key: 'admin', label: 'Admin Vidio', url: 'nur2.adminVIDIO.html' }
    ]
  },
  'nur3': {
    label: '📊 Nur 3 - ADMINISTRASI',
    desc: 'Morning Finance Dashboard (Kas 5% & Voucher)',
    pages: [{ key: 'keuangan', label: 'Keuangan Pagi', url: 'nur3_keuangan_pagi.html' }]
  },
  'nur4': {
    label: '🎨 Nur 4 - KREATOR_DIGITAL',
    desc: 'Digital Asset Management',
    pages: [{ key: 'aset', label: 'Aset Digital', url: 'nur4_aset_digital.html' }]
  },
  'nur5': {
    label: '🎯 Nur 5 - GAME_ARISAN',
    desc: 'Main Menu Arisan Module',
    pages: [{ key: 'menu', label: 'Menu Utama', url: 'nur5_menu_utama.html' }]
  },
  'nur6': {
    label: '💰 Nur 6 - BANK_GAME',
    desc: 'Vault Kas & Finance Admin',
    pages: [{ key: 'adm', label: 'Folder Admin Keuangan', url: '03_ADM_KEUANGAN/' }]
  },
  'nur7': {
    label: '🔊 Nur 7 - STREAMING & LIVE',
    desc: 'Live Member, Streaming & Stage Status',
    pages: [
      { key: 'live', label: 'Live Member', url: 'nur7_live_member.html' },
      { key: 'straming', label: 'Streaming', url: 'nur7.straming.html' },
      { key: 'panggung', label: 'Status Panggung', url: 'nur7_panggung_status.html' }
    ]
  },
  'nur8': {
    label: '🌙 Nur 8 - SISTEM & EMULATOR',
    desc: 'Emulator & Maintenance Center',
    pages: [{ key: 'emulator', label: 'Emulator', url: 'nur8_emulator.html' }]
  },
  'nur9': {
    label: '🎮 Nur 9 - GAME_INDRAMAYU',
    desc: 'Not available on server yet',
    pages: []
  },
  'nur10': {
    label: '👑 Nur 10 - PEWARIS_CAHAYA',
    desc: 'Alwi Dictionary / Sultan VVIP Stage',
    pages: [{ key: 'kamus', label: 'Kamus Alwi', url: 'nur10_kamus_alwi.html' }]
  }
};

const JADWAL_AZAN = {
  subuh: { waktu: '04:30', nama: 'Subuh' },
  dzuhur: { waktu: '12:05', nama: 'Dzuhur' },
  ashar: { waktu: '15:35', nama: 'Ashar' },
  maghrib: { waktu: '18:15', nama: 'Maghrib' },
  isya: { waktu: '19:45', nama: 'Isya' }
};

let audioContext = null;
function getAudioContext() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function playAzanSound() {
  if (!AGEN_ALWI_CONFIG.suara_enabled) return;
  try {
    const ctx = getAudioContext();
    const melodi = [{ freq: 220, durasi: 0.5 }, { freq: 247, durasi: 0.5 }, { freq: 294, durasi: 0.5 }, { freq: 330, durasi: 0.5 }, { freq: 392, durasi: 0.8 }];
    let currentTime = ctx.currentTime;
    melodi.forEach(nada => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(nada.freq, currentTime);
      gain.gain.setValueAtTime(0.3, currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, currentTime + nada.durasi);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(currentTime); osc.stop(currentTime + nada.durasi);
      currentTime += nada.durasi + 0.1;
    });
  } catch (e) { console.log('Prayer time sound blocked by browser'); }
}

const GTTS_CONFIG = { lang: 'id', enabled: (localStorage.getItem('ic_alwi_suara') !== 'off'), chunkSize: 180 };
let antrianSuaraGTTS = [];
let sedangBicaraGTTS = false;

function pecahTeksUntukGTTS(teks, maxLen) {
  const bersih = teks.replace(/\n+/g, '. ').replace(/[⛑️🤖🌙✨💰 🕌👤🏠 📊📖🧮 👥👑💬🔐🎯✅🔊🙏😊🌿🎨]/g, '');
  const kalimat = bersih.split(/(?<=[.!?])\s+/).filter(k => k.trim().length > 0);
  const potongan = []; let buffer = '';
  kalimat.forEach(k => {
    if ((buffer + ' ' + k).trim().length > maxLen) {
      if (buffer) potongan.push(buffer.trim());
      buffer = k.length > maxLen ? k.slice(0, maxLen) : k;
    } else { buffer = (buffer + ' ' + k).trim(); }
  });
  if (buffer) potongan.push(buffer.trim());
  return potongan;
}

function fallbackSpeechSynthesis(teks, lang) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(teks);
    u.lang = lang === 'en' ? 'en-US' : 'id-ID';
    window.speechSynthesis.speak(u);
  }
}

function mainkanAntrianGTTS() {
  if (sedangBicaraGTTS || antrianSuaraGTTS.length === 0) return;
  sedangBicaraGTTS = true;
  const item = antrianSuaraGTTS.shift();
  const url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=' + encodeURIComponent(item.teks) + '&tl=' + item.lang + '&client=tw-ob';
  const audio = new Audio(url);
  const lanjut = () => { sedangBicaraGTTS = false; mainkanAntrianGTTS(); };
  audio.onended = lanjut;
  audio.onerror = () => { fallbackSpeechSynthesis(item.teks, item.lang); lanjut(); };
  audio.play().catch(() => { fallbackSpeechSynthesis(item.teks, item.lang); lanjut(); });
}

function bicaraGoogleTTS(teks, lang) {
  if (!GTTS_CONFIG.enabled) return;
  lang = lang || GTTS_CONFIG.lang;
  const potongan = pecahTeksUntukGTTS(teks, GTTS_CONFIG.chunkSize);
  antrianSuaraGTTS = antrianSuaraGTTS.concat(potongan.map(p => ({ teks: p, lang })));
  mainkanAntrianGTTS();
}

function toggleSuaraAlwi() {
  GTTS_CONFIG.enabled = !GTTS_CONFIG.enabled;
  localStorage.setItem('ic_alwi_suara', GTTS_CONFIG.enabled ? 'on' : 'off');
  const btn = document.getElementById('agenAlwiSuaraToggle');
  if (btn) btn.textContent = GTTS_CONFIG.enabled ? '🔊' : '🔇';
  if (!GTTS_CONFIG.enabled) {
    antrianSuaraGTTS = [];
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  } else { bicaraGoogleTTS('Voice engine activated.', 'en'); }
}

function renderAgenAlwiBot() {
  if (document.getElementById('agenAlwiContainer')) return;
  const isEn = (document.documentElement.lang === 'en');
  const welcomeMsg = isEn ? "Assalamu'alaikum! I am Agent Alwi. 10 Nur Navigation is ready." : "Assalamu'alaikum! Saya Agen Alwi. Navigasi 10 Nur siap melayani.";
  const placeholderText = isEn ? "Type a message..." : "Ketik pesan...";
  const titleSub = isEn ? "10 Nur Navigation" : "Navigasi 10 Nur";

  const containerHTML = `
    <div id="agenAlwiContainer" style="position: fixed; bottom: 20px; right: 20px; z-index: 9998; font-family: 'Inter', sans-serif;">
      <button id="agenAlwiToggle" onclick="toggleAgenAlwi()" style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #06140b, #0a2e1c); border: 3px solid #c9a84c; color: #ffd700; font-size: 28px; cursor: pointer; box-shadow: 0 4px 20px rgba(201, 168, 76, 0.4); display: flex; align-items: center; justify-content: center;">⛑️</button>
      <div id="agenAlwiWindow" style="display: none; position: absolute; bottom: 90px; right: 0; width: 380px; height: 500px; background: linear-gradient(180deg, #06140b 0%, #0a2e1c 100%); border: 2px solid #c9a84c; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.7); flex-direction: column; z-index: 9999; animation: slideUp 0.4s ease;">
        <div style="background: linear-gradient(135deg, #06140b, #0a2e1c); border-bottom: 2px solid #c9a84c; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 14px 14px 0 0;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 24px;">⛑️</span>
            <div>
              <div style="font-size: 14px; font-weight: 900; color: #ffd700;">AGEN ALWI</div>
              <div style="font-size: 10px; color: #c9a84c;">${titleSub}</div>
            </div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button id="agenAlwiSuaraToggle" onclick="toggleSuaraAlwi()" style="background: transparent; border: 1px solid #c9a84c; color: #ffd700; width: 28px; height: 28px; border-radius: 6px; cursor: pointer;">${GTTS_CONFIG.enabled ? '🔊' : '🔇'}</button>
            <button onclick="toggleAgenAlwi()" style="background: transparent; border: 1px solid #c9a84c; color: #ffd700; width: 28px; height: 28px; border-radius: 6px; cursor: pointer;">✕</button>
          </div>
        </div>
        <div id="agenAlwiChat" style="flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px;" class="alwi-chat-scroll"></div>
        <div style="border-top: 1px solid #c9a84c; padding: 12px; display: flex; gap: 8px;">
          <input type="text" id="agenAlwiInput" placeholder="${placeholderText}" onkeypress="if(event.key==='Enter') kirimPesanKeAlwi()" style="flex: 1; background: #06140b; border: 1px solid #c9a84c; border-radius: 8px; padding: 10px 12px; color: #ffd700; font-size: 12px; outline: none;" />
          <button onclick="kirimPesanKeAlwi()" style="background: linear-gradient(135deg, #c9a84c, #ffd700); border: none; border-radius: 8px; width: 40px; height: 40px; color: #06140b; cursor: pointer; font-weight: 900;">➔</button>
        </div>
      </div>
    </div>
    <style>
      @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      #agenAlwiWindow.aktif { display: flex !important; }
      .alwi-chat-scroll::-webkit-scrollbar { width: 4px; }
      .alwi-chat-scroll::-webkit-scrollbar-thumb { background: #c9a84c; border-radius: 2px; }
      .alwi-message { display: flex; gap: 8px; margin-bottom: 8px; }
      .msg-user { justify-content: flex-end; }
      .msg-bubble { max-width: 75%; padding: 10px 12px; border-radius: 10px; font-size: 12px; line-height: 1.4; word-wrap: break-word; white-space: pre-line; }
      .msg-alwi .msg-bubble { background: #0a2e1c; border: 1px solid #c9a84c; color: #ffd700; }
      .msg-user .msg-bubble { background: #c9a84c; color: #06140b; font-weight: 600; }
    </style>
  `;
  document.body.insertAdjacentHTML('beforeend', containerHTML);
  setTimeout(() => {
    tambahPesanAlwi(welcomeMsg);
  }, 500);
}

function toggleAgenAlwi() {
  const window_chat = document.getElementById('agenAlwiWindow');
  if (!window_chat) return;
  window_chat.classList.toggle('aktif');
  if (window_chat.classList.contains('aktif')) document.getElementById('agenAlwiInput').focus();
}

function tambahPesanAlwi(teks, dariUser = false) {
  const chatDiv = document.getElementById('agenAlwiChat');
  if (!chatDiv) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'alwi-message ' + (dariUser ? 'msg-user' : 'msg-alwi');
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'msg-bubble';
  bubbleDiv.textContent = teks;
  msgDiv.appendChild(bubbleDiv);
  chatDiv.appendChild(msgDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
  
  if (!dariUser) {
    const detectLang = /[a-zA-Z]/.test(teks) && !teks.includes("Keuangan") ? 'en' : 'id';
    bicaraGoogleTTS(teks, detectLang);
  }
}

function kirimPesanKeAlwi() {
  const input = document.getElementById('agenAlwiInput');
  const teks = input.value.trim();
  if (!teks) return;
  tambahPesanAlwi(teks, true);
  input.value = '';
  setTimeout(() => {
    const respons = prosesKatalkunci(teks.toLowerCase());
    tambahPesanAlwi(respons);
  }, 600);
}

function prosesKatalkunci(teks) {
  const isEn = (document.documentElement.lang === 'en' || teks.includes('menu') || teks.includes('list'));
  
  if (teks.includes('menu') || teks.includes('list')) {
    const title = isEn ? 'Nur System List:\n' : 'Daftar Nur:\n';
    return title + Object.values(MENU_LAYANAN).map(m => m.label).join('\n');
  }
  
  for (const [key, menu] of Object.entries(MENU_LAYANAN)) {
    if (teks.includes(key)) {
      if (menu.pages.length === 0) {
        return isEn ? menu.label + ' is not active yet.' : menu.label + ' belum aktif.';
      }
      const target = menu.pages[0].url;
      setTimeout(() => { window.location.href = target; }, 1200);
      return isEn ? 'Redirecting to ' + menu.label + '...' : 'Mengarahkan ke ' + menu.label + '...';
    }
  }
  return isEn ? 'Command not recognized.' : 'Perintah tidak dikenali.';
}

function setupSystemAzan() {
  setInterval(() => {
    const now = new Date();
    const jam = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    for (const [key, shalat] of Object.entries(JADWAL_AZAN)) {
      if (jam === shalat.waktu) {
        playAzanSound();
        const msg = (document.documentElement.lang === 'en') ? `Prayer time for ${shalat.nama} has arrived.` : `Waktu shalat ${shalat.nama} tiba.`;
        tambahPesanAlwi(msg);
      }
    }
  }, 60000);
}

inisialisasiAlwiBot = () => { renderAgenAlwiBot(); setupSystemAzan(); };
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', inisialisasiAlwiBot); } else { inisialisasiAlwiBot(); }

