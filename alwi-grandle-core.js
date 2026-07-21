/*
 * alwi-grandle-core.js
 * ---------------------------------------------------------
 * Lapisan penyambung ekosistem Indramayu Club.
 * Tempel <script src="alwi-grandle-core.js"></script> di SETIAP
 * halaman (Sultan Portal, Kamus, Game, AI Builder, dst) supaya:
 *   1. Profil member (nama, poin NUR, tier) tersambung di semua halaman
 *   2. Riwayat kunjungan antar-tool otomatis tercatat
 *   3. Widget chat mengambang "Alwi Grandle" (pakai Gemini API) muncul di mana saja
 * ---------------------------------------------------------
 */
(function (global) {
  const KEY_STORAGE   = 'indramayu_gemini_api_key';
  const PROFILE_KEY    = 'alwigrandle_profile';
  const HISTORY_KEY    = 'alwigrandle_history';
  const CHAT_KEY       = 'alwigrandle_chat_history';
  const MODEL          = 'gemini-2.5-flash';
  const API_BASE       = 'https://generativelanguage.googleapis.com/v1beta/models/' + MODEL + ':generateContent';

  const PERSONA = `Identitas: Anda adalah Alwi Grandle, asisten pasar digital dan pemandu ekosistem Indramayu Club.
Anda BUKAN Nur (server utama/backend spiritual) — Anda adalah wajah yang menyapa dan mengantar member berpindah antar layanan: Sultan Portal (Pak Dulkohar), Kamus Basa Indramayu, Game Indramayu, AI HTML Builder, AI Image Generator, dan Foto Bergerak AI.
Mata uang komunitas: Rp NUR, GIF NUR, Voucher NUR.
Gaya bicara: ramah, hangat, sedikit santai khas Indramayu, tapi tetap sigap dan membantu layaknya asisten pasar yang cekatan. Boleh sesekali pakai sapaan Basa Dermayu ringan.
Tugas Anda: membantu member menemukan tool yang tepat, memberi semangat progres mereka, dan menjawab pertanyaan seputar ekosistem. Jawaban singkat dan padat (2-4 kalimat), kecuali diminta detail.`;

  // ---------- PROFIL MEMBER (localStorage, dipakai bersama semua halaman) ----------
  function getProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { nama: '', poinNur: 0, tier: 'Member Baru' };
  }

  function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  // ---------- RIWAYAT KUNJUNGAN LINTAS TOOL ----------
  function getHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  function catatKunjungan(namaTool) {
    const history = getHistory();
    history.push({ tool: namaTool, waktu: new Date().toISOString() });
    // Simpan maksimal 20 riwayat terakhir biar ringan
    while (history.length > 20) history.shift();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  // ---------- API KEY GEMINI (dipakai bersama semua tool Nur lainnya) ----------
  function getApiKey() {
    return localStorage.getItem(KEY_STORAGE) || '';
  }
  function saveApiKey(key) {
    localStorage.setItem(KEY_STORAGE, key);
  }

  // ---------- PANGGIL GEMINI ----------
  async function callGemini(contents, extraSystemText) {
    const key = getApiKey();
    if (!key) throw new Error('Gemini API Key belum diisi.');
    const systemInstruction = { parts: [{ text: PERSONA + (extraSystemText ? ('\n\n' + extraSystemText) : '') }] };
    const res = await fetch(API_BASE + '?key=' + encodeURIComponent(key), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction,
        generationConfig: { temperature: 0.75, maxOutputTokens: 500 }
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || 'Gagal menghubungi Gemini API.');
    return data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  }

  async function tanyaSekali(pesan) {
    return callGemini([{ role: 'user', parts: [{ text: pesan }] }]);
  }

  // ---------- WIDGET CHAT MENGAMBANG ----------
  function injectStyles() {
    if (document.getElementById('alwi-grandle-style')) return;
    const style = document.createElement('style');
    style.id = 'alwi-grandle-style';
    style.textContent = `
      #alwi-fab {
        position: fixed; bottom: 18px; right: 18px; z-index: 999999;
        width: 56px; height: 56px; border-radius: 50%;
        background: linear-gradient(135deg,#C9A84C,#FFD700);
        color: #040A06; border: none; font-size: 26px; cursor: pointer;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      }
      #alwi-panel {
        position: fixed; bottom: 84px; right: 18px; z-index: 999999;
        width: min(320px, calc(100vw - 32px)); height: min(420px, calc(100vh - 140px));
        background: #0a1a0e; border: 1px solid rgba(201,168,76,0.4); border-radius: 16px;
        display: none; flex-direction: column; overflow: hidden;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
      }
      #alwi-panel.open { display: flex; }
      #alwi-head {
        background: #040A06; padding: 10px 12px; border-bottom: 1px solid rgba(201,168,76,0.3);
        display: flex; justify-content: space-between; align-items: center;
      }
      #alwi-head span { color: #FFD700; font-weight: bold; font-size: 13px; }
      #alwi-head button { background: transparent; border: none; color: #EDE0C4; font-size: 16px; cursor: pointer; }
      #alwi-log { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }
      #alwi-log .m { display: flex; }
      #alwi-log .m.user { justify-content: flex-end; }
      #alwi-log .b { max-width: 82%; padding: 7px 9px; border-radius: 9px; font-size: 12px; line-height: 1.4; }
      #alwi-log .m.user .b { background: #C9A84C; color: #040A06; }
      #alwi-log .m.bot .b { background: #0f2214; color: #EDE0C4; border: 1px solid rgba(201,168,76,0.2); }
      #alwi-inputrow { display: flex; gap: 6px; padding: 8px; border-top: 1px solid rgba(201,168,76,0.2); }
      #alwi-inputrow input {
        flex: 1; background: #0f2214; border: 1px solid rgba(201,168,76,0.25); border-radius: 8px;
        padding: 8px; color: #FFD700; font-size: 12px;
      }
      #alwi-inputrow button {
        background: #C9A84C; color: #040A06; border: none; border-radius: 8px; padding: 8px 12px; cursor: pointer; font-weight: bold;
      }
      #alwi-keybar { padding: 6px 8px; font-size: 10px; color: #8a8a8a; border-top: 1px solid rgba(201,168,76,0.15); display: none; gap: 6px; }
      #alwi-keybar.show { display: flex; }
      #alwi-keybar input { flex: 1; background: #0f2214; border: 1px solid rgba(201,168,76,0.25); border-radius: 6px; padding: 5px; color: #EDE0C4; font-size: 10px; }
      #alwi-keybar button { background: #333; color: #EDE0C4; border: none; border-radius: 6px; padding: 5px 8px; font-size: 10px; cursor: pointer; }
    `;
    document.head.appendChild(style);
  }

  function loadChatLog() {
    try {
      const raw = sessionStorage.getItem(CHAT_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }
  function saveChatLog(log) {
    sessionStorage.setItem(CHAT_KEY, JSON.stringify(log));
  }

  function injectWidget() {
    if (document.getElementById('alwi-fab')) return;
    injectStyles();

    const fab = document.createElement('button');
    fab.id = 'alwi-fab';
    fab.textContent = '🧕';
    fab.title = 'Tanya Alwi Grandle';
    document.body.appendChild(fab);

    const panel = document.createElement('div');
    panel.id = 'alwi-panel';
    panel.innerHTML = `
      <div id="alwi-head">
        <span>🧕 Alwi Grandle</span>
        <button id="alwi-close">✕</button>
      </div>
      <div id="alwi-log"></div>
      <div id="alwi-keybar">
        <input id="alwi-keyinput" type="text" placeholder="Gemini API Key...">
        <button id="alwi-keysave">Simpan</button>
      </div>
      <div id="alwi-inputrow">
        <input id="alwi-msg" type="text" placeholder="Tanya Alwi...">
        <button id="alwi-send">➤</button>
      </div>
    `;
    document.body.appendChild(panel);

    const logEl = document.getElementById('alwi-log');
    const keybar = document.getElementById('alwi-keybar');
    const keyinput = document.getElementById('alwi-keyinput');
    const msgInput = document.getElementById('alwi-msg');
    let chatLog = loadChatLog();

    function render() {
      logEl.innerHTML = '';
      if (!chatLog.length) {
        const hint = document.createElement('div');
        hint.style.cssText = 'color:#8a8a8a;font-size:11px;text-align:center;margin-top:14px;';
        hint.textContent = 'Sampurasun! Ada yang bisa Alwi bantu di ekosistem Indramayu Club?';
        logEl.appendChild(hint);
        return;
      }
      chatLog.forEach(m => {
        const row = document.createElement('div');
        row.className = 'm ' + (m.role === 'user' ? 'user' : 'bot');
        const b = document.createElement('div');
        b.className = 'b';
        b.textContent = m.text;
        row.appendChild(b);
        logEl.appendChild(row);
      });
      logEl.scrollTop = logEl.scrollHeight;
    }
    render();

    if (!getApiKey()) keybar.classList.add('show');

    fab.addEventListener('click', () => {
      panel.classList.toggle('open');
    });
    document.getElementById('alwi-close').addEventListener('click', () => panel.classList.remove('open'));

    document.getElementById('alwi-keysave').addEventListener('click', () => {
      const v = keyinput.value.trim();
      if (v) { saveApiKey(v); keyinput.value = ''; keybar.classList.remove('show'); }
    });

    async function send() {
      const msg = msgInput.value.trim();
      if (!msg) return;
      msgInput.value = '';
      chatLog.push({ role: 'user', text: msg });
      render();
      try {
        const profile = getProfile();
        const history = getHistory();
        const context = `Profil member: nama="${profile.nama || '(belum diisi)'}", poin NUR=${profile.poinNur}, tier=${profile.tier}. Riwayat kunjungan tool terakhir: ${history.slice(-5).map(h => h.tool).join(', ') || '(belum ada)'}.`;
        const contents = chatLog.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }));
        const jawaban = await callGemini(contents, context);
        chatLog.push({ role: 'bot', text: jawaban || '...' });
      } catch (err) {
        chatLog.push({ role: 'bot', text: '⚠️ ' + err.message });
        if (!getApiKey()) keybar.classList.add('show');
      }
      saveChatLog(chatLog);
      render();
    }
    document.getElementById('alwi-send').addEventListener('click', send);
    msgInput.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  }

  // ---------- AUTO-JALAN SAAT SCRIPT DIMUAT ----------
  function init() {
    const namaTool = document.title || location.pathname;
    catatKunjungan(namaTool);
    injectWidget();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ---------- EXPOSE API PUBLIK ----------
  global.AlwiGrandle = {
    getProfile, saveProfile, getHistory, catatKunjungan,
    getApiKey, saveApiKey, callGemini, tanyaSekali
  };
})(window);
