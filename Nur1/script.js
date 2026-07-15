// ==========================================
// DATA REGISTRASI APLIKASI UTAMA (NUR CONFIG)
// ==========================================
const SEKTOR_APPS = [
  {
    category: "📱 Sosial Media & Streaming",
    items: [
      { name: "Facebook", url: "https://m.facebook.com/IndramayuClubOfficial", icon: "📘", class: "ic-fb", badge: 3 },
      { name: "WhatsApp", url: "https://web.whatsapp.com/", icon: "💬", class: "ic-wa", badge: 12 },
      { name: "Nur7 Stream", url: "https://imahazzah51-max.github.io/hugoNUR3/nur7a_streaming.html", icon: "LIVE", class: "ic-live" },
      { name: "Gallery", url: "https://drive.google.com/drive/folders/1S4zZBfhYD7f0i4amQDu56I5T7DsHMcEy", icon: "🗂️", class: "ic-gdrive" }
    ]
  },
  {
    category: "🎮 Games",
    items: [
      { name: "Chess.com", url: "https://www.chess.com/id/play", icon: "♟", class: "ic-chess" },
      { name: "Permainan", url: "https://www.permainan.co.id/", icon: "🎯", class: "ic-game" },
      { name: "CoC Online", url: "https://web.cloudmoonapp.com/id/game/com.supercell.clashofclans/", icon: "⚔️", class: "ic-coc" },
      { name: "Folder Games", isFolder: true, icons: ["♟", "🎯", "⚔️"], classes: ["ic-chess", "ic-game", "ic-coc"] }
    ]
  },
  {
    category: "🛠️ Developer & Tools",
    items: [
      { name: "Android Studio", url: "https://developer.android.com/studio", icon: "🤖", class: "ic-android" },
      { name: "Claude AI", url: "https://claude.ai/", icon: "✦", class: "ic-claude" },
      { name: "Indramayu Club", url: "https://indramayuclubmakrifat-tech.github.io/Main_System_IndramayuClub/", icon: "ꦆ", class: "ic-indclub" },
      { name: "Dev Tools", isFolder: true, icons: ["", "✦", "ꦆ"], classes: ["ic-android", "ic-claude", "ic-indclub"] }
    ]
  }
];

const DOCK_APPS = [
  { name: "Dialer", isDialer: true, icon: "📞", class: "ic-wa", style: "background:linear-gradient(145deg,#34C759,#248A3D);" },
  { name: "WhatsApp", url: "https://web.whatsapp.com/", icon: "💬", class: "ic-wa" },
  { name: "Indramayu Club", url: "https://indramayuclubmakrifat-tech.github.io/Main_System_IndramayuClub/", icon: "ꦆ", class: "ic-indclub" },
  { name: "Claude AI", url: "https://claude.ai/", icon: "✦", class: "ic-claude" }
];

const SUGGESTIONS = [
  "Indramayu Club Makrifat",
  "Nur AI Indramayu",
  "Bank Makrifat Indramayu",
  "Kamus Bahasa Indramayu"
];

const DIALER_KEYS = [
  { num: "1", sub: "" }, { num: "2", sub: "ABC" }, { num: "3", sub: "DEF" },
  { num: "4", sub: "GHI" }, { num: "5", sub: "JKL" }, { num: "6", sub: "MNO" },
  { num: "7", sub: "PQRS" }, { num: "8", sub: "TUV" }, { num: "9", sub: "WXYZ" },
  { num: "*", sub: "" }, { num: "0", sub: "+" }, { num: "#", sub: "" }
];

// ==========================================
// INITIALIZER SYSTEM
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderRuntimeClock();
  setInterval(renderRuntimeClock, 60000);
  buildDynamicAppGrid();
  buildDynamicDock();
  buildDialerKeypad();
  registerCoreEvents();
});

// ==========================================
// RENDER ENGINE ENGINE
// ==========================================
function renderRuntimeClock() {
  const now = new Date();
  const jam = String(now.getHours()).padStart(2, '0');
  const menit = String(now.getMinutes()).padStart(2, '0');
  
  document.getElementById("sb-time").innerText = `${jam}:${menit}`;
  document.getElementById("clock-time").innerText = `${jam}:${menit}`;
  
  const opsiDate = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  document.getElementById("clock-date").innerText = now.toLocaleDateString('id-ID', opsiDate);
}

function buildDynamicAppGrid() {
  const container = document.getElementById("mainScrollArea");
  container.innerHTML = "";
  
  SEKTOR_APPS.forEach(sec => {
    const lbl = document.createElement("div");
    lbl.className = "section-label";
    lbl.innerText = sec.category;
    container.appendChild(lbl);
    
    const grid = document.createElement("div");
    grid.className = "app-grid";
    
    sec.items.forEach(item => {
      const appItem = document.createElement("div");
      appItem.className = "app-item";
      
      if (item.isFolder) {
        appItem.innerHTML = `
          <div class="folder-box">
            ${item.icons.map((ic, i) => `<div class="folder-mini ${item.classes[i] || 'ic-grey'}">${ic}</div>`).join('')}
          </div>
          <span class="app-name">${item.name}</span>
        `;
      } else {
        appItem.onclick = () => openGatewayApp(item.name, item.url, item.icon);
        appItem.innerHTML = `
          <div class="app-icon ${item.class}">
            <span>${item.icon}</span>
            ${item.badge ? `<div class="badge">${item.badge}</div>` : ''}
          </div>
          <span class="app-name">${item.name}</span>
        `;
      }
      grid.appendChild(appItem);
    });
    
    container.appendChild(grid);
  });
  
  const dots = document.createElement("div");
  dots.className = "page-dots";
  dots.innerHTML = '<div class="dot"></div><div class="dot active"></div><div class="dot"></div>';
  container.appendChild(dots);
}

function buildDynamicDock() {
  const container = document.getElementById("dockContainer");
  container.innerHTML = "";
  
  DOCK_APPS.forEach(item => {
    const dockItem = document.createElement("div");
    dockItem.className = "dock-item";
    
    if (item.isDialer) {
      dockItem.onclick = () => toggleSystemOverlay("dialer", true);
    } else {
      dockItem.onclick = () => openGatewayApp(item.name, item.url, item.icon);
    }
    
    dockItem.innerHTML = `
      <div class="dock-icon ${item.class}" style="${item.style || ''}">
        <span>${item.icon}</span>
      </div>
    `;
    container.appendChild(dockItem);
  });
}

function buildDialerKeypad() {
  const grid = document.getElementById("dialerGrid");
  grid.innerHTML = "";
  
  DIALER_KEYS.forEach(k => {
    const btn = document.createElement("button");
    btn.className = "dial-key";
    btn.onclick = () => updateDialDisplay(k.num);
    btn.innerHTML = `<span class="dial-num">${k.num}</span><span class="dial-sub">${k.sub}</span>`;
    grid.appendChild(btn);
  });
}

// ==========================================
// GATEWAY CONTROLLER & BROWSER OVERLAY
// ==========================================
function openGatewayApp(name, url, icon) {
  document.getElementById("p-title").innerText = name;
  document.getElementById("p-url").innerText = url;
  document.getElementById("p-icon").innerText = icon ? icon : "🌐";
  document.getElementById("p-frame").src = url;
  toggleSystemOverlay("popup", true);
}

function toggleSystemOverlay(id, show) {
  const target = document.getElementById(id);
  if (show) target.classList.add("show");
  else {
    target.classList.remove("show");
    if (id === 'popup') document.getElementById("p-frame").src = "about:blank";
  }
}

// ==========================================
// SEARCH ENGINE & DIALER ENGINE LOGIC
// ==========================================
let currentDialValue = "";

function updateDialDisplay(val) {
  currentDialValue += val;
  document.getElementById("dialDisplay").innerText = currentDialValue;
}

function processDialAction() {
  if (!currentDialValue) return;
  alert("Menghubungi Server: " + currentDialValue);
  currentDialValue = "";
  document.getElementById("dialDisplay").innerText = "·  ·  ·";
  toggleSystemOverlay("dialer", false);
}

function deleteDialChar() {
  currentDialValue = currentDialValue.slice(0, -1);
  document.getElementById("dialDisplay").innerText = currentDialValue || "·  ·  ·";
}

function executeGoogleSearch() {
  const query = document.getElementById("searchInput").value;
  if (!query) return;
  openGatewayApp("Google Search", `https://www.google.com/search?q=${encodeURIComponent(query)}`, "🔍");
  closeSearchSuggestions();
}

function handleSearchTyping(val) {
  const wrapper = document.getElementById("suggestions");
  if (!val) {
    wrapper.classList.remove("show");
    return;
  }
  wrapper.innerHTML = "";
  const filtered = SUGGESTIONS.filter(s => s.toLowerCase().includes(val.toLowerCase()));
  
  if (filtered.length > 0) {
    filtered.forEach(s => {
      const div = document.createElement("div");
      div.className = "suggest-item";
      div.innerText = `🔍 ${s}`;
      div.onclick = () => {
        document.getElementById("searchInput").value = s;
        executeGoogleSearch();
      };
      wrapper.appendChild(div);
    });
    wrapper.classList.add("show");
  } else {
    wrapper.classList.remove("show");
  }
}

function closeSearchSuggestions() {
  document.getElementById("suggestions").classList.remove("show");
}

// ==========================================
// DOM EVENTS REGISTRATION
// ==========================================
function registerCoreEvents() {
  // Event Popups Close
  document.getElementById("closePopupBtn").onclick = () => toggleSystemOverlay("popup", false);
  document.getElementById("cancelPopupBtn").onclick = () => toggleSystemOverlay("popup", false);
  document.getElementById("closeDialerBtn").onclick = () => toggleSystemOverlay("dialer", false);
  
  // External Browser Redirect
  document.getElementById("openExternalBtn").onclick = () => {
    const targetUrl = document.getElementById("p-url").innerText;
    window.open(targetUrl, "_blank");
  };

  // Search Action Triggers
  document.getElementById("searchBtn").onclick = executeGoogleSearch;
  document.getElementById("searchInput").oninput = (e) => handleSearchTyping(e.target.value);
  document.getElementById("searchInput").onkeydown = (e) => { if (e.key === "Enter") executeGoogleSearch(); };
  
  document.getElementById("mainScrollArea").onclick = closeSearchSuggestions;

  // Keypad Call Actions
  document.getElementById("dialDelBtn").onclick = deleteDialChar;
  document.getElementById("dialCallBtn").onclick = processDialAction;
  
  document.getElementById("micBtn").onclick = () => {
    alert("Voice Command: Fitur Mic Terkoneksi ke NUR_ENGINE_GATEWAY");
  };
}

