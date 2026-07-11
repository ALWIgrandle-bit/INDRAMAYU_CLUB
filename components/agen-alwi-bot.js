/**
 * AGEN ALWI BOT - CHATBOT CERDAS INDRAMAYU CLUB
 * Fitur: Menu Dropdown, Layanan Publik, Suara Azan, Ramah-tamah
 */

// ═══════════════════════════════════════════════════════════════════
// 1. KONFIGURASI AGEN ALWI
// ═══════════════════════════════════════════════════════════════════

const AGEN_ALWI_CONFIG = {
  nama: 'Agen Alwi',
  emoji: '🤖',
  warnaUtama: '#06140b',      // Hijau tua
  warnaBorder: '#c9a84c',     // Kuning tua
  suara_enabled: true,
  personality: 'ramah-profesional'
};

// MENU LAYANAN PUBLIK
const MENU_LAYANAN = {
  'beranda': {
    label: '🏠 Beranda',
    url: 'index.html',
    emoji: '🏠',
    desc: 'Halaman utama Indramayu Club'
  },
  'dashboard': {
    label: '📊 Dashboard',
    url: 'DASHBOARD.html',
    emoji: '📊',
    desc: 'Panel kontrol member & statistik'
  },
  'kamus': {
    label: '📖 Kamus Indramayu',
    url: 'kamus.html',
    emoji: '📖',
    desc: 'Kamus bahasa & budget Nur poin'
  },
  'kalkulator': {
    label: '🧮 Kalkulator Berkah',
    url: 'KALKULATOR.html',
    emoji: '🧮',
    desc: 'Kalkulator wujud makrifat'
  },
  'live_member': {
    label: '👥 Live Member',
    url: 'live_member.html',
    emoji: '👥',
    desc: 'Streaming anggota club secara live'
  },
  'live_vvip': {
    label: '👑 Live VVIP',
    url: 'Live_vvip.html',
    emoji: '👑',
    desc: 'Panggung Sultan eksklusif'
  },
  'komentar': {
    label: '💬 Ruang Diskusi',
    url: 'komentar.html',
    emoji: '💬',
    desc: 'Forum member berbagi kesan'
  },
  'login': {
    label: '🔐 Login',
    url: 'login.html',
    emoji: '🔐',
    desc: 'Verifikasi member Telkomsel'
  }
};

// JADWAL AZAN (Indramayu, Jawa Barat)
const JADWAL_AZAN = {
  subuh: { waktu: '04:30', nama: 'Subuh', doa: 'Allahumma inni asaluka khoiro...' },
  dzuhur: { waktu: '12:05', nama: 'Dzuhur', doa: 'Allahumma inni asaluka khoiro...' },
  ashar: { waktu: '15:35', nama: 'Ashar', doa: 'Allahumma inni asaluka khoiro...' },
  maghrib: { waktu: '18:15', nama: 'Maghrib', doa: 'Allahumma inni asaluka khoiro...' },
  isya: { waktu: '19:45', nama: 'Isya', doa: 'Allahumma inni asaluka khoiro...' }
};

// ═══════════════════════════════════════════════════════════════════
// 2. SUARA AZAN GENERATOR (SINE WAVE - TANPA FILE EKSTERNAL)
// ═══════════════════════════════════════════════════════════════════

let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function playAzanSound() {
  if (!AGEN_ALWI_CONFIG.suara_enabled) return;
  
  try {
    const ctx = getAudioContext();
    
    // Melodi Azan (Adhan) - 5 nada untuk 5 waktu shalat
    const melodi = [
      { freq: 220, durasi: 0.5 },  // A3
      { freq: 247, durasi: 0.5 },  // B3
      { freq: 294, durasi: 0.5 },  // D4
      { freq: 330, durasi: 0.5 },  // E4
      { freq: 392, durasi: 0.8 }   // G4
    ];
    
    let currentTime = ctx.currentTime;
    
    melodi.forEach(nada => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(nada.freq, currentTime);
      
      gain.gain.setValueAtTime(0.3, currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, currentTime + nada.durasi);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(currentTime);
      osc.stop(currentTime + nada.durasi);
      
      currentTime += nada.durasi + 0.1;
    });
  } catch (e) {
    console.log('Suara azan diblokir browser (normal pada beberapa kondisi)');
  }
}

// ═══════════════════════════════════════════════════════════════════
// 3. RENDER BOT ALWI - FLOATING CHATBOT
// ═══════════════════════════════════════════════════════════════════

function renderAgenAlwiBot() {
  // Cek apakah sudah ada
  if (document.getElementById('agenAlwiContainer')) return;
  
  const containerHTML = `
    <!-- FLOATING BOT AGEN ALWI -->
    <div id="agenAlwiContainer" style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9998;
      font-family: 'Inter', sans-serif;
    ">
      <!-- TOMBOL UTAMA BOT -->
      <button id="agenAlwiToggle" onclick="toggleAgenAlwi()" style="
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background: linear-gradient(135deg, #06140b, #0a2e1c);
        border: 3px solid #c9a84c;
        color: #ffd700;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(201, 168, 76, 0.4);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      " title="Klik untuk buka Agen Alwi">
        🤖
      </button>
      
      <!-- WINDOW CHAT ALWI (TERSEMBUNYI DEFAULT) -->
      <div id="agenAlwiWindow" style="
        display: none;
        position: absolute;
        bottom: 90px;
        right: 0;
        width: 380px;
        height: 500px;
        background: linear-gradient(180deg, #06140b 0%, #0a2e1c 100%);
        border: 2px solid #c9a84c;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 30px rgba(201,168,76,0.3);
        display: flex;
        flex-direction: column;
        z-index: 9999;
        animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        @media (max-width: 480px) {
          width: calc(100vw - 30px);
          height: 60vh;
          bottom: 90px;
          right: 15px;
        }
      ">
        
        <!-- HEADER -->
        <div style="
          background: linear-gradient(135deg, #06140b, #0a2e1c);
          border-bottom: 2px solid #c9a84c;
          padding: 14px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 14px 14px 0 0;
        ">
          <div style="
            display: flex;
            align-items: center;
            gap: 10px;
          ">
            <span style="font-size: 24px; filter: drop-shadow(0 0 8px #ffd700);">🤖</span>
            <div>
              <div style="
                font-size: 14px;
                font-weight: 900;
                color: #ffd700;
                letter-spacing: 0.05em;
              ">AGEN ALWI</div>
              <div style="
                font-size: 10px;
                color: #c9a84c;
                opacity: 0.8;
              ">Siap Melayani</div>
            </div>
          </div>
          <button onclick="toggleAgenAlwi()" style="
            background: transparent;
            border: 1px solid #c9a84c;
            color: #ffd700;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
          ">✕</button>
        </div>
        
        <!-- CHAT DISPLAY -->
        <div id="agenAlwiChat" style="
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        " class="alwi-chat-scroll">
          <!-- Pesan akan dimulai dari sini -->
        </div>
        
        <!-- INPUT AREA -->
        <div style="
          border-top: 1px solid #c9a84c;
          padding: 12px;
          display: flex;
          gap: 8px;
        ">
          <input 
            type="text" 
            id="agenAlwiInput" 
            placeholder="Ketik pesan..." 
            onkeypress="if(event.key==='Enter') kirimPesanKeAlwi()" 
            style="
              flex: 1;
              background: #06140b;
              border: 1px solid #c9a84c;
              border-radius: 8px;
              padding: 10px 12px;
              color: #ffd700;
              font-size: 12px;
              outline: none;
            " 
          />
          <button onclick="kirimPesanKeAlwi()" style="
            background: linear-gradient(135deg, #c9a84c, #ffd700);
            border: none;
            border-radius: 8px;
            width: 40px;
            height: 40px;
            color: #06140b;
            cursor: pointer;
            font-weight: 900;
            display: flex;
            align-items: center;
            justify-content: center;
          ">→</button>
        </div>
      </div>
    </div>
    
    <!-- STYLE ANIMASI -->
    <style>
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .alwi-chat-scroll::-webkit-scrollbar {
        width: 6px;
      }
      
      .alwi-chat-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .alwi-chat-scroll::-webkit-scrollbar-thumb {
        background: #c9a84c;
        border-radius: 3px;
      }
      
      .alwi-message {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
        animation: fadeInUp 0.3s ease;
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .msg-user {
        justify-content: flex-end;
      }
      
      .msg-bubble {
        max-width: 70%;
        padding: 10px 12px;
        border-radius: 10px;
        font-size: 12px;
        line-height: 1.4;
        word-wrap: break-word;
      }
      
      .msg-alwi .msg-bubble {
        background: linear-gradient(135deg, #0a2e1c, #0f1f15);
        border: 1px solid #c9a84c;
        color: #ffd700;
      }
      
      .msg-user .msg-bubble {
        background: #c9a84c;
        color: #06140b;
        font-weight: 600;
      }
      
      .msg-avatar {
        font-size: 20px;
        flex-shrink: 0;
      }
    </style>
  `;
  
  // Inject ke body
  document.body.insertAdjacentHTML('beforeend', containerHTML);
  
  // Greeting awal
  setTimeout(() => {
    tambahPesanAlwi('Assalamu\'alaikum wa rahmatullahi wa barakatuh! 🌙\n\nSaya Agen Alwi, siap membantu Anda menggali layanan Indramayu Club.\n\n🎯 Ketik "menu" untuk melihat semua layanan kami!');
  }, 500);
}

// ═══════════════════════════════════════════════════════════════════
// 4. FUNGSI TOGGLE WINDOW CHAT
// ═══════════════════════════════════════════════════════════════════

function toggleAgenAlwi() {
  const window_chat = document.getElementById('agenAlwiWindow');
  const toggle_btn = document.getElementById('agenAlwiToggle');
  
  if (!window_chat) return;
  
  if (window_chat.style.display === 'none' || window_chat.style.display === '') {
    window_chat.style.display = 'flex';
    toggle_btn.style.transform = 'scale(0.8)';
    // Auto focus input
    setTimeout(() => {
      document.getElementById('agenAlwiInput').focus();
    }, 200);
  } else {
    window_chat.style.display = 'none';
    toggle_btn.style.transform = 'scale(1)';
  }
}

// ═══════════════════════════════════════════════════════════════════
// 5. TAMBAH PESAN CHAT
// ═══════════════════════════════════════════════════════════════════

function tambahPesanAlwi(teks, dariUser = false) {
  const chatDiv = document.getElementById('agenAlwiChat');
  if (!chatDiv) return;
  
  const msgDiv = document.createElement('div');
  msgDiv.className = `alwi-message ${dariUser ? 'msg-user' : 'msg-alwi'}`;
  
  const avatarDiv = document.createElement('div');
  avatarDiv.className = 'msg-avatar';
  avatarDiv.textContent = dariUser ? '👤' : '🤖';
  
  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'msg-bubble';
  bubbleDiv.textContent = teks;
  
  if (!dariUser) {
    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
  } else {
    msgDiv.appendChild(bubbleDiv);
    msgDiv.appendChild(avatarDiv);
  }
  
  chatDiv.appendChild(msgDiv);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// ═══════════════════════════════════════════════════════════════════
// 6. KIRIM PESAN & PROSES RESPONS
// ═══════════════════════════════════════════════════════════════════

function kirimPesanKeAlwi() {
  const input = document.getElementById('agenAlwiInput');
  const teks = input.value.trim();
  
  if (!teks) return;
  
  // Tampilkan pesan user
  tambahPesanAlwi(teks, true);
  input.value = '';
  
  // Simulasi delay respons Alwi
  setTimeout(() => {
    const respons = prosesKatalkunci(teks.toLowerCase());
    tambahPesanAlwi(respons);
  }, 800);
}

function prosesKatalkunci(teks) {
  // MENU UTAMA
  if (teks.includes('menu') || teks.includes('layanan') || teks.includes('apa saja')) {
    return 'Pilih salah satu layanan di bawah ini:\n\n' + 
           Object.values(MENU_LAYANAN)
             .map(m => `${m.emoji} ${m.label}`)
             .join('\n') +
           '\n\n(Ketik nama layanan untuk membuka)';
  }
  
  // CARI DI MENU
  for (const [key, menu] of Object.entries(MENU_LAYANAN)) {
    if (teks.includes(key.toLowerCase()) || 
        teks.includes(menu.label.toLowerCase().split(' ')[0])) {
      
      // BUKA HALAMAN
      setTimeout(() => {
        window.location.href = menu.url;
      }, 1000);
      
      return `✅ Membuka ${menu.label}...\n${menu.desc}`;
    }
  }
  
  // JADWAL SHALAT
  if (teks.includes('jadwal') || teks.includes('azan') || teks.includes('waktu shalat')) {
    let jadwal = '🕌 JADWAL SHALAT INDRAMAYU\n\n';
    for (const [_, shalat] of Object.entries(JADWAL_AZAN)) {
      jadwal += `${shalat.nama}: ${shalat.waktu}\n`;
    }
    return jadwal;
  }
  
  // PUTAR AZAN
  if (teks.includes('putar azan') || teks.includes('dengarkan azan')) {
    playAzanSound();
    return '🔊 Suara Azan sedang diputar...\n\n"ALLAHU AKBAR.. ALLAHU AKBAR.."';
  }
  
  // INFO CLUB
  if (teks.includes('tentang') || teks.includes('siapa') || teks.includes('apa itu')) {
    return `Indramayu Club adalah komunitas digital yang menghadirkan:\n\n` +
           `✨ Kamus Bahasa Indramayu\n` +
           `💰 Sistem Poin (Nur, GIF, Voucher)\n` +
           `🎭 Live Streaming Member\n` +
           `🕌 Jadwal Azan Otomatis\n` +
           `🤝 Forum Diskusi Ramah\n\n` +
           `Bergabunglah dengan kami! 🌿`;
  }
  
  // SALAM
  if (teks.includes('halo') || teks.includes('hai') || teks.includes('assalam')) {
    const sapaan = ['Wa\'alaikum assalam wa rahmatullahi wa barakatuh! 🌙',
                    'Halo juga! Ada yang bisa dibantu? 😊',
                    'Selamat datang di Indramayu Club! 🌿'];
    return sapaan[Math.floor(Math.random() * sapaan.length)];
  }
  
  // TERIMA KASIH
  if (teks.includes('terimakasih') || teks.includes('makasih') || teks.includes('trims')) {
    return 'Sama-sama! Senang melayani Anda. 🙏\n\nAda yang perlu dibantu lagi?';
  }
  
  // DEFAULT - TAMPILKAN MENU DROPDOWN
  return `Maaf, saya belum memahami. 🤔\n\nSilakan ketik "menu" untuk melihat layanan kami, atau tanyakan:\n\n• Jadwal Shalat\n• Tentang Indramayu Club\n• Atau nama layanan (kamus, dashboard, live member, dll)`;
}

// ═══════════════════════════════════════════════════════════════════
// 7. SISTEM AZAN OTOMATIS (CEK SETIAP MENIT)
// ═══════════════════════════════════════════════════════════════════

function setupSystemAzan() {
  setInterval(() => {
    const now = new Date();
    const jamSekarang = String(now.getHours()).padStart(2, '0') + ':' +
                        String(now.getMinutes()).padStart(2, '0');
    
    for (const [key, shalat] of Object.entries(JADWAL_AZAN)) {
      if (jamSekarang === shalat.waktu) {
        // PUTAR SUARA
        playAzanSound();
        
        // NOTIF KE BOT
        tambahPesanAlwi(`🕌 ADZAN ${shalat.nama.toUpperCase()}\n\n"ALLAHU AKBAR ALLAHU AKBAR..."\n\nSaatnya melaksanakan shalat ${shalat.nama}! ✨`, false);
        
        // TAMPILKAN TOAST
        showAzanToast(shalat.nama);
        
        break;
      }
    }
  }, 60000); // Cek setiap 1 menit
}

function showAzanToast(namaAzan) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #06140b, #0a2e1c);
    border: 2px solid #ffd700;
    color: #ffd700;
    padding: 16px 24px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    z-index: 99999;
    box-shadow: 0 6px 20px rgba(201,168,76,0.4);
    animation: slideDown 0.4s ease;
  `;
  
  toast.textContent = `🕌 Saatnya Azan ${namaAzan} — Allahu Akbar!`;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideUp 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ═══════════════════════════════════════════════════════════════════
// 8. INISIALISASI SAAT DOM READY
// ═══════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
  renderAgenAlwiBot();
  setupSystemAzan();
});

// Export API
window.AgenAlwi = {
  toggle: toggleAgenAlwi,
  kirimPesan: kirimPesanKeAlwi,
  tambahPesan: tambahPesanAlwi,
  playAzan: playAzanSound,
  showToast: showAzanToast
};
