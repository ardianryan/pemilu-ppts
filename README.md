<p align="center">
  <img src="public/images/logo2.png" width="130" alt="Logo SMA Tamansiswa Mojokerto">
</p>

<h1 align="center">🗳️ Pemilu PPTS Tamansiswa</h1>

<p align="center">
  <strong>Sistem E-Voting & Manajemen DPT Pemilihan Ketua & Wakil Ketua PPTS (Persatuan Pelajar Tamansiswa) Modern</strong><br>
  Designed for <em>SMA Tamansiswa Mojokerto</em>
</p>

<p align="center">
  <a href="https://laravel.com"><img src="https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"></a>
  <a href="https://inertiajs.com"><img src="https://img.shields.io/badge/Inertia.js-v2-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <img src="https://img.shields.io/badge/Tests-100%25_Passed-204E2B?style=for-the-badge&logo=php&logoColor=white" alt="PHPUnit Passed">
</p>

---

## 🌟 Fitur Unggulan

- 🎫 **Identitas Pemilih Universal**: Mendukung Pemilih Siswa (Kelas X, XI, XII), Guru Pamong, & Tenaga Kependidikan (Tendik).
- 🎲 **Token Acak Unik 6 Digit**: Token dibuat acak alfanumerik (`X7K9P2`) otomatis saat import/tambah data pemilih.
- 🖨️ **Cetak Kartu Pemilih Presisi (8 Kartu / Lembar A4)**: Siap cetak hemat kertas 8 kartu per halaman A4 lengkap dengan **Barcode SVG Code 39** Token Akses.
- 📊 **Public Live Count**: Tampilan hasil perolehan suara real-time interaktif di `/livecount` dengan grafik persentase animasi smooth.
- 🧙‍♂️ **Wizard Alur Pemilihan 3-Langkah**:
  1. **Verifikasi Identitas**: Memastikan nama & kelas pemilih sudah benar.
  2. **Pilih Pasangan Calon**: Surat suara digital bersih & jelas.
  3. **Resi Kriptografi SHA-256**: Cetak bukti suara sah otomatis dan auto-logout demi asas kerahasiaan.
- 🖼️ **Interactive Crop Foto Paslon (Rasio 4:3)**: Pemotong foto kandidat presisi terintegrasi pada dashboard admin.
- ⚡ **Animasi GSAP Smooth Modal & Sheet**: Kemunculan modal & sheet bertransisi halus.
- 🔒 **Keamanan & Performa Tinggi**: Database pessimistic locking (`lockForUpdate()`), proteksi double-voting, dan paginasi DPT ringan.

---

## 🛠️ Tech Stack

- **Backend Framework**: Laravel 12 (PHP 8.2+)
- **Frontend Engine**: React 19 + Inertia.js v2
- **UI & Styling**: Tailwind CSS v4 + Lucide React + GSAP Animation
- **Image Cropper**: `react-easy-crop`
- **Excel Spreadsheet**: `phpoffice/phpspreadsheet` (`.xlsx` Import/Export)
- **Database**: MariaDB / MySQL

---

## 🚀 Panduan Instalasi Quick-Start

### 1. Clone Repository & Install Dependency
```bash
git clone git@github.com:ardianryan/pemilu-ppts.git
cd pemilu-ppts

# Install paket PHP via Composer
composer install

# Install paket JavaScript via NPM
npm install
```

### 2. Konfigurasi Environment & Database
```bash
# Salin file environment contoh
cp .env.example .env

# Generate Application Key
php artisan key:generate
```
> Pastikan pengaturan `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` pada file `.env` sudah disesuaikan dengan database lokal Anda (misal `pilketos_db`).

### 3. Migrasi Database & Seeding Data
```bash
php artisan migrate:fresh --seed
```

### 4. Build Frontend & Jalankan Server Local
```bash
# Kompilasi aset frontend
npm run build

# Jalankan Laravel Development Server
php artisan serve
```
Akses aplikasi di browser pada alamat: `http://localhost:8000`

---

## 🔑 Akses Default Demo (Credentials)

| Peran | Halaman Login | Username / NISN | Password / Token |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `/admin/login` | `admin` | `admin123` |
| **Panitia Bilik** | `/admin/login` | `panitia` | `panitia123` |
| **Pemilih Siswa** | `/login` | `0061234501` | *Lihat Token di Dashboard Admin* |

---

## 🧪 Testing & Audit Keamanan

```bash
# Menjalankan seluruh pengujian PHPUnit (13 Passed, 62 Assertions)
php artisan test

# Pindaian audit dependensi
composer audit
npm audit
```
Aplikasi telah dilengkapi konfigurasi **GitHub Dependabot** (`.github/dependabot.yml`) untuk memantau pembaruan keamanan paket secara berkala.

---

<p align="center">
  <sub>Dibuat dengan ❤️ untuk SMA Tamansiswa Mojokerto</sub>
</p>
