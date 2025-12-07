# Mikrotik Learning - Portal Belajar Mikrotik Dasar

Portal pembelajaran Mikrotik RouterOS yang mudah dipahami untuk pemula.

## 📁 Struktur Folder

```
MikrotikDasar/
├── index.html              # Halaman utama dengan sidebar navigasi
├── dashboard.html          # Halaman dashboard
├── quiz.html              # Halaman quiz dan sertifikat
├── styles.css             # File CSS (Pure CSS + Bootstrap)
├── app.js                 # File JavaScript untuk interaktivitas
└── materi/                # Folder berisi semua file materi
    ├── pengenalan-mikrotik.html
    ├── jenis-produk.html
    ├── instalasi.html
    ├── interface-konfigurasi.html
    ├── ip-address.html
    ├── dhcp-server.html
    ├── nat.html
    ├── firewall.html
    ├── wireless-basic.html
    └── wireless-security.html
```

## 🎨 Teknologi yang Digunakan

- **HTML5** - Struktur halaman
- **Bootstrap 5** - Framework CSS untuk styling dan komponen
- **Pure CSS** - Custom styling tambahan
- **Vanilla JavaScript** - Interaktivitas tanpa framework

## 📝 Cara Mengisi Materi

### 1. Buka File Materi

Semua file materi ada di folder `materi/`. Pilih file yang ingin Anda isi, misalnya `pengenalan-mikrotik.html`.

### 2. Edit Bagian Konten

Cari bagian dengan komentar:
```html
<!-- ISI MATERI ANDA DI SINI -->
```

### 3. Gunakan Elemen HTML Berikut:

#### Judul Bagian
```html
<h2>Judul Bagian Utama</h2>
<h3>Sub Judul</h3>
```

#### Paragraf
```html
<p>Isi paragraf Anda di sini...</p>
```

#### List/Daftar
```html
<ul>
    <li>Poin pertama</li>
    <li>Poin kedua</li>
    <li>Poin ketiga</li>
</ul>
```

#### Alert Box (Catatan Penting)
```html
<div class="alert-info-custom">
    <strong><i class="bi bi-info-circle"></i> Catatan:</strong>
    <p class="mb-0">Informasi penting untuk diperhatikan...</p>
</div>
```

#### Alert Warning (Peringatan)
```html
<div class="alert-warning-custom">
    <strong><i class="bi bi-exclamation-triangle"></i> Peringatan:</strong>
    <p class="mb-0">Hal yang perlu diperhatikan...</p>
</div>
```

#### Alert Success (Sukses/Tips)
```html
<div class="alert-success-custom">
    <strong><i class="bi bi-check-circle"></i> Tips:</strong>
    <p class="mb-0">Tips berguna...</p>
</div>
```

#### Code Block (Blok Kode)
```html
<div class="code-block">
    <button class="copy-btn" onclick="copyCode(this)">Copy</button>
    <pre><code>/ip address add interface=ether1 address=192.168.1.1/24</code></pre>
</div>
```

#### Tabel
```html
<table class="table table-bordered">
    <thead>
        <tr>
            <th>Kolom 1</th>
            <th>Kolom 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data 1</td>
            <td>Data 2</td>
        </tr>
    </tbody>
</table>
```

## 🎯 Fitur

### 1. Progress Tracking
- Sistem otomatis melacak materi yang sudah diselesaikan
- Progress disimpan di localStorage browser
- Tombol "Tandai Selesai" di setiap materi

### 2. Copy Code
- Tombol copy otomatis di setiap code block
- Klik tombol "Copy" untuk menyalin kode

### 3. Responsive Design
- Tampilan optimal di desktop, tablet, dan mobile
- Sidebar yang dapat ditutup/dibuka di mobile

### 4. Navigasi Mudah
- Navigasi antar materi dengan tombol Previous/Next
- Sidebar dengan menu dropdown untuk akses cepat

## 🚀 Cara Menjalankan

### Opsi 1: Langsung Buka File
1. Buka file `index.html` dengan browser
2. Mulai belajar!

### Opsi 2: Menggunakan Local Server (Recommended)
```bash
# Jika punya Python
python -m http.server 8000

# Atau menggunakan Live Server di VS Code
```

Kemudian buka browser dan akses: `http://localhost:8000`

## 📚 Urutan Belajar yang Disarankan

1. **Pengenalan Mikrotik**
   - Apa itu Mikrotik?
   - Jenis-jenis Produk
   - Instalasi Mikrotik

2. **Konfigurasi Dasar**
   - Konfigurasi Interface
   - IP Addressing
   - DHCP Server
   - NAT
   - Firewall Dasar

3. **Wireless**
   - Wireless Basic
   - Wireless Security

4. **Quiz & Sertifikat**
   - Uji pemahaman Anda
   - Dapatkan sertifikat

## 🎨 Kustomisasi Warna

Jika ingin mengubah warna tema, edit file `styles.css`:

```css
/* Warna utama (orange) */
background: linear-gradient(180deg, #ea580c 0%, #dc2626 100%);

/* Ubah sesuai keinginan, misalnya biru: */
background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
```

## 💡 Tips untuk Programmer Pemula

1. **Pahami Struktur HTML**
   - Setiap file materi adalah file HTML standalone
   - Gunakan tag HTML yang semantik (h1, h2, p, ul, dll)

2. **Bootstrap Classes**
   - `container` - Wrapper untuk konten
   - `row` - Baris grid
   - `col-*` - Kolom grid
   - `btn btn-primary` - Tombol
   - `card` - Kartu konten
   - `table table-bordered` - Tabel

3. **Custom CSS Classes**
   - `.materi-header` - Header materi
   - `.materi-content` - Konten materi
   - `.code-block` - Blok kode
   - `.alert-*-custom` - Alert boxes

4. **JavaScript Functions**
   - `markAsCompleted('id-materi')` - Tandai materi selesai
   - `copyCode(button)` - Copy kode

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Periksa kembali struktur HTML
2. Pastikan semua file di folder yang benar
3. Cek console browser untuk error (F12)

## 📄 License

Free to use untuk pembelajaran.

---

**Selamat Belajar Mikrotik! 🚀**
