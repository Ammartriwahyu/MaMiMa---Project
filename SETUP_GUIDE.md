# 🍜 MaMiMa – Setup Guide Lengkap

## Daftar Isi
1. [Persiapan Tools](#1-persiapan-tools)
2. [Setup Project](#2-setup-project)
3. [Struktur Folder](#3-struktur-folder)
4. [Jalankan Dev Server](#4-jalankan-dev-server)
5. [Akun Demo](#5-akun-demo)
6. [Deploy ke Vercel](#6-deploy-ke-vercel)
7. [Menambahkan Gambar](#7-menambahkan-gambar)
8. [Integrasi Laravel API (Nanti)](#8-integrasi-laravel-api-nanti)

---

## 1. Persiapan Tools

### Install Node.js
1. Buka https://nodejs.org
2. Download versi **LTS** (contoh: 20.x)
3. Install seperti biasa (next-next-finish)
4. Verifikasi:
   ```bash
   node --version   # harus muncul v20.x.x
   npm --version    # harus muncul 10.x.x
   ```

### Install VS Code
1. Buka https://code.visualstudio.com
2. Download & install
3. Install ekstensi yang disarankan:
   - **ES7+ React/Redux/React-Native snippets**
   - **Tailwind CSS IntelliSense**
   - **Prettier - Code formatter**
   - **Auto Import - ES6**

### Install Git
1. Buka https://git-scm.com
2. Download & install (default settings)
3. Verifikasi: `git --version`

---

## 2. Setup Project

### Langkah-langkah:

**Step 1** – Buka folder project di VS Code
```bash
# Buka terminal di VS Code (Ctrl+` atau View > Terminal)
# Atau buka folder mamima yang sudah ada
```

**Step 2** – Install semua dependencies
```bash
npm install
```
> ⏳ Tunggu beberapa menit, ini akan install framer-motion, react-router-dom, tailwind, dll.

**Step 3** – Verifikasi semua sudah terinstall
```bash
ls node_modules   # Harus ada banyak folder
```

---

## 3. Struktur Folder

```
mamima/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/                   # Font, icons, images statis
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx        # ⭐ Floating navbar
│   │   │   ├── Footer.jsx        # Footer
│   │   │   └── Layout.jsx        # Wrapper utama
│   │   └── shared/
│   │       ├── PlaceCard.jsx     # ⭐ Card tempat (reusable)
│   │       ├── CategoryBadge.jsx # Filter chips
│   │       └── AnimatedSection.jsx # Animation wrappers
│   ├── context/
│   │   └── AuthContext.jsx       # ⭐ State management auth
│   ├── design-system/
│   │   └── tokens.js             # ⭐ Design tokens (colors, fonts, animations)
│   ├── features/
│   │   ├── landing/
│   │   │   └── pages/LandingPage.jsx     # Halaman utama (public)
│   │   ├── auth/
│   │   │   └── pages/
│   │   │       ├── LoginPage.jsx         # Halaman login
│   │   │       └── RegisterPage.jsx      # Halaman daftar
│   │   ├── home/
│   │   │   ├── data/dummyPlaces.js       # ⭐ Data dummy tempat makan
│   │   │   ├── hooks/usePlaces.js        # Hook CRUD places
│   │   │   └── pages/HomePage.jsx        # Dashboard setelah login
│   │   ├── explore/
│   │   │   └── pages/ExplorePage.jsx     # Halaman search & explore
│   │   ├── place/
│   │   │   ├── components/PlaceForm.jsx  # Form create/edit (reusable)
│   │   │   └── pages/
│   │   │       ├── PlaceDetailPage.jsx   # Detail tempat
│   │   │       ├── CreatePlacePage.jsx   # Upload tempat baru
│   │   │       └── EditPlacePage.jsx     # Edit tempat
│   │   └── profile/
│   │       ├── components/EditProfileModal.jsx
│   │       └── pages/ProfilePage.jsx     # Profil user (Instagram-style)
│   ├── lib/
│   │   └── utils.js              # Helper functions
│   ├── App.jsx                   # ⭐ Routing utama
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles + Tailwind
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── vercel.json                   # Config untuk Vercel deploy
```

### Prinsip Feature-Based Folder:
- Setiap fitur punya foldernya sendiri
- Di dalam setiap fitur ada: `pages/`, `components/`, `hooks/`, `data/`
- Shared components ada di `src/components/shared/`
- Design system terpusat di `src/design-system/tokens.js`

---

## 4. Jalankan Dev Server

```bash
npm run dev
```

Buka browser: **http://localhost:5173**

### Halaman yang tersedia:
| Route | Halaman | Akses |
|-------|---------|-------|
| `/` | Landing Page | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/explore` | Jelajahi tempat + search | Public |
| `/home` | Dashboard (setelah login) | Login required |
| `/place/:id` | Detail tempat | Public |
| `/create` | Tambah tempat baru | Login required |
| `/place/:id/edit` | Edit tempat | Login required (owner) |
| `/profile/:username` | Profil user | Login required |

---

## 5. Akun Demo

Sudah ada 2 akun demo bawaan:

| Email | Password | Username |
|-------|----------|----------|
| `foodie@example.com` | `password123` | foodie_malang |
| `kuliner@example.com` | `password123` | kuliner_joss |

> 💡 Data disimpan di **localStorage** browser, jadi aman untuk testing.

---

## 6. Deploy ke Vercel

### Cara 1: Via GitHub (Recommended)

**Step 1** – Push ke GitHub
```bash
cd mamima
git init
git add .
git commit -m "feat: initial MaMiMa project"
git branch -M main
git remote add origin https://github.com/USERNAME/mamima.git
git push -u origin main
```

**Step 2** – Deploy di Vercel
1. Buka https://vercel.com → Login dengan GitHub
2. Klik **"Add New Project"**
3. Import repo `mamima`
4. Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **Deploy** 🚀

**Step 3** – Selesai!
URL kamu akan seperti: `https://mamima.vercel.app`

### Cara 2: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 7. Menambahkan Gambar

Di kode, sudah ditandai komentar `// //` di tempat-tempat yang butuh gambar.

### Cara mengganti placeholder gambar:

**Untuk gambar statis** (taruh di folder `public/`):
```jsx
// Sebelum:
{/* // foto tempat makan */}

// Sesudah:
<img src="/images/soto-pak-dhe.jpg" alt="Warung Soto Lamongan" />
```

**Untuk gambar di dummy data** (`src/features/home/data/dummyPlaces.js`):
```js
// Sebelum:
image: null, // // foto tempat makan

// Sesudah:
image: '/images/soto-pak-dhe.jpg',
```

### Daftar gambar yang perlu ditambahkan:
- Foto setiap tempat (8 tempat dummy) → `place.image`
- Foto profil user → `user.avatar`
- Foto cover user → `user.coverImage`
- Foto tambahan per tempat → `place.images[]`

---

## 8. Integrasi Laravel API (Nanti)

Saat siap connect ke backend Laravel, ganti dummy data di `usePlaces.js` dan `AuthContext.jsx`:

### AuthContext – ganti ke API:
```js
// src/context/AuthContext.jsx
const login = async (email, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Login gagal')
  const { user, token } = await res.json()
  localStorage.setItem('token', token)
  setUser(user)
  return user
}
```

### usePlaces – ganti ke API:
```js
// src/features/home/hooks/usePlaces.js
const fetchPlaces = async () => {
  const res = await fetch('/api/places', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  })
  const data = await res.json()
  setPlaces(data)
}
```

### Struktur API Laravel yang dibutuhkan:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

GET    /api/places          # Get semua places (dengan filter)
POST   /api/places          # Create place baru
GET    /api/places/{id}     # Get 1 place
PUT    /api/places/{id}     # Update place
DELETE /api/places/{id}     # Delete place

GET    /api/users/{username}         # Get profile user
PUT    /api/users/{username}         # Update profile
GET    /api/users/{username}/places  # Get places milik user
```

---

## 9. Design System

Semua token desain ada di `src/design-system/tokens.js`:

### Warna:
- **Primary**: `#FF6B35` (orange hangat)
- **Accent**: `#FFD93D` (kuning)
- **Dark**: `#1A1A1A`
- **Surface**: `#FFF8F5`

### Font:
- **Display** (heading): Playfair Display (serif)
- **Body** (teks): DM Sans (sans-serif)

### Class utility utama:
```
.btn-primary    → tombol utama orange
.btn-outline    → tombol outline
.btn-ghost      → tombol transparan
.card           → card putih dengan shadow
.input-field    → input field standar
.section-title  → heading section besar
.page-container → wrapper max-width + padding
.gradient-text  → teks gradient orange
.glass-card     → card efek glass/blur
```

---

## 10. FAQ & Troubleshooting

**Q: `npm install` error?**
- Pastikan Node.js v18+ terinstall
- Coba: `npm cache clean --force` lalu `npm install` lagi

**Q: Port 5173 sudah dipakai?**
- Vite otomatis pilih port lain (5174, dll)

**Q: Perubahan kode tidak muncul?**
- Vite sudah ada hot-reload, coba hard refresh: `Ctrl+Shift+R`

**Q: Data hilang setelah close browser?**
- Data dummy tersimpan di localStorage, tidak hilang kalau tab ditutup
- Tapi jika browser history/data dibersihkan, reset ke data awal

**Q: Bagaimana cara reset data ke awal?**
```js
// Di console browser (F12):
localStorage.clear()
// Lalu refresh halaman
```
