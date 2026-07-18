// Otomatis membuat elemen navigasi melayang di bagian atas halaman
document.addEventListener("DOMContentLoaded", function() {
    // 1. Buat kontainer Bar Navigasi
    const navBar = document.createElement('div');
    navBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 35px;
        background: rgba(3, 9, 20, 0.95);
        border-bottom: 1px solid rgba(0, 240, 255, 0.4);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        z-index: 99999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    `;

    // 2. Buat Tombol Kembali (<--)
    const btnBack = document.createElement('button');
    btnBack.innerText = "<--";
    btnBack.style.cssText = `
        background: transparent;
        border: none;
        color: #00f0ff;
        font-family: 'Orbitron', sans-serif;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        padding: 5px 10px;
    `;
    btnBack.onclick = () => window.history.back();

    // 3. Buat Tombol Maju (-->)
    const btnForward = document.createElement('button');
    btnForward.innerText = "-->";
    btnForward.style.cssText = `
        background: transparent;
        border: none;
        color: #00f0ff;
        font-family: 'Orbitron', sans-serif;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        padding: 5px 10px;
    `;
    btnForward.onclick = () => window.history.forward();

    // 4. Masukkan tombol ke dalam bar, lalu masukkan bar ke tubuh halaman (body)
    navBar.appendChild(btnBack);
    navBar.appendChild(btnForward);
    document.body.appendChild(navBar);

    // 5. Otomatis dorong isi halaman ke bawah 40px agar tidak tertutup bar navigasi
    document.body.style.paddingTop = "40px";
});

