# 🍜 MaMiMa – Setup Guide Lengkap (Full Stack)

## Struktur Monorepo
```
mamima/
├── frontend/     ← React + Vite (deploy ke Vercel)
└── backend/      ← Laravel 11 (deploy ke Railway)
```

---

## ⚙️ SOFTWARE YANG HARUS DIINSTALL

| Software | Link | Keterangan |
|---|---|---|
| Node.js 20 LTS | https://nodejs.org | Untuk React frontend |
| PHP 8.2+ | Via Laragon | Untuk Laravel backend |
| Composer | https://getcomposer.org | Package manager PHP |
| MySQL + Workbench | Via Laragon | Database |
| Git | https://git-scm.com | Version control |
| VS Code | https://code.visualstudio.com | Editor |

**Cara termudah install PHP + MySQL sekaligus:**
1. Download **Laragon** → https://laragon.org/download
2. Install (include PHP 8.2, MySQL, dan MySQL Workbench)
3. Start Laragon → klik "Start All"

---

## 🗄️ SETUP MYSQL WORKBENCH

1. Buka MySQL Workbench
2. Koneksi ke `localhost:3306` (user: `root`, password: kosong)
3. Buat database baru:
   ```sql
   CREATE DATABASE mamima_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
4. Database siap digunakan

---

## 🖥️ SETUP BACKEND (Laravel)

### Step 1 – Buat project Laravel baru
```bash
composer create-project laravel/laravel backend
cd backend
```

### Step 2 – Install Sanctum
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### Step 3 – Copy file dari folder `backend/` project ini
Salin file-file berikut ke dalam project Laravel kamu (replace jika sudah ada):

```
COPY FILE INI:                              → KE FOLDER INI:
──────────────────────────────────────────────────────────
app/Models/User.php                         → app/Models/
app/Models/Place.php                        → app/Models/
app/Models/Category.php                     → app/Models/
app/Models/Menu.php                         → app/Models/
app/Models/Comment.php                      → app/Models/
app/Models/Like.php                         → app/Models/
app/Models/Bookmark.php                     → app/Models/

app/Http/Controllers/AuthController.php    → app/Http/Controllers/
app/Http/Controllers/PlaceController.php   → app/Http/Controllers/
app/Http/Controllers/MenuController.php    → app/Http/Controllers/
app/Http/Controllers/CommentController.php → app/Http/Controllers/
app/Http/Controllers/LikeController.php    → app/Http/Controllers/
app/Http/Controllers/BookmarkController.php→ app/Http/Controllers/
app/Http/Controllers/UserController.php    → app/Http/Controllers/
(UserController.php juga berisi CategoryController)

database/migrations/*                       → database/migrations/
(hapus migration bawaan Laravel dulu, lalu copy semua dari sini)

database/seeders/DatabaseSeeder.php        → database/seeders/

routes/api.php                              → routes/

config/cors.php                             → config/

bootstrap/app.php                           → bootstrap/
```

### Step 4 – Setup .env
```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env`:
```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mamima_db
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public
```

### Step 5 – Jalankan Migration + Seeder
```bash
# Hapus semua migration bawaan Laravel dulu (2014_*, 2019_*, 2022_*)
# lalu:
php artisan migrate
php artisan db:seed
php artisan storage:link
```

Output seeder yang benar:
```
✅ Seeder selesai! Categories, users, dan places berhasil dibuat.
```

### Step 6 – Jalankan server backend
```bash
php artisan serve
# Jalan di: http://localhost:8000
```

**Test:** Buka http://localhost:8000/api/places → harus muncul data JSON

---

## ⚛️ SETUP FRONTEND (React)

### Step 1 – Masuk ke folder frontend
```bash
cd frontend
```

### Step 2 – Buat file .env
```bash
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env
```

Isi `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

### Step 3 – Install & jalankan
```bash
npm install
npm run dev
```

Buka: **http://localhost:5173** ✅

---

## 👤 AKUN DEMO (dari seeder)

| Email | Password | Username |
|---|---|---|
| `foodie@example.com` | `password123` | foodie_malang |
| `kuliner@example.com` | `password123` | kuliner_joss |

---

## 🚀 DEPLOY PRODUCTION

### Deploy Backend ke Railway

1. Push backend ke GitHub:
```bash
cd backend
git init
git add .
git commit -m "feat: mamima backend"
git remote add origin https://github.com/USERNAME/mamima-backend.git
git push -u origin main
```

2. Buka https://railway.app → Login GitHub
3. **New Project** → Deploy from GitHub → pilih repo `mamima-backend`
4. Tambahkan **Environment Variables** di Railway:
```
APP_KEY=base64:xxx (copy dari .env lokal)
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=${{MYSQLHOST}}   ← otomatis dari Railway MySQL plugin
DB_PORT=${{MYSQLPORT}}
DB_DATABASE=${{MYSQLDATABASE}}
DB_USERNAME=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
FRONTEND_URL=https://mamima-kamu.vercel.app
FILESYSTEM_DISK=public
```
5. Tambahkan **MySQL Plugin** di Railway dashboard
6. Di Railway Console (shell), jalankan:
```bash
php artisan migrate --seed
php artisan storage:link
```
7. Copy URL Railway kamu (contoh: `https://mamima-api.up.railway.app`)

---

### Update CORS untuk production

Buka `config/cors.php`, tambahkan URL Vercel:
```php
'allowed_origins' => [
    'http://localhost:5173',
    'https://mamima-kamu.vercel.app',  // ← URL Vercel kamu
    env('FRONTEND_URL'),
],
```

---

### Deploy Frontend ke Vercel

1. Push frontend ke GitHub:
```bash
cd frontend
git init
git add .
git commit -m "feat: mamima frontend"
git remote add origin https://github.com/USERNAME/mamima-frontend.git
git push -u origin main
```

2. Buka https://vercel.com → Import repo
3. **Environment Variables**:
```
VITE_API_URL = https://mamima-api.up.railway.app/api
```
4. Build Settings: Framework = **Vite**, Build Command = `npm run build`, Output = `dist`
5. Deploy! 🚀

---

## 📡 DAFTAR API ENDPOINT LENGKAP

### Auth (Public)
| Method | Endpoint | Body |
|---|---|---|
| POST | /api/auth/register | name, username, email, password |
| POST | /api/auth/login | email, password |
| POST | /api/auth/logout | — (Bearer token) |
| GET  | /api/auth/me | — (Bearer token) |

### Places (Public GET, Auth POST/PUT/DELETE)
| Method | Endpoint | Keterangan |
|---|---|---|
| GET    | /api/places | ?search=&type[]=makan&type[]=minum&lokasi=&category= |
| GET    | /api/places/{id} | Detail tempat |
| POST   | /api/places | Tambah tempat (FormData + Bearer) |
| POST   | /api/places/{id} | Update (_method=PUT) |
| DELETE | /api/places/{id} | Hapus (owner only) |

### Menus
| Method | Endpoint | Keterangan |
|---|---|---|
| GET    | /api/places/{id}/menus | List menu |
| POST   | /api/places/{id}/menus | Tambah menu (FormData) |
| POST   | /api/menus/{id} | Update menu (_method=PUT) |
| DELETE | /api/menus/{id} | Hapus menu |

### Interaksi (semua butuh Bearer token)
| Method | Endpoint | Response |
|---|---|---|
| POST | /api/places/{id}/like | { liked: bool, likesCount: int } |
| POST | /api/places/{id}/bookmark | { bookmarked: bool, savesCount: int } |
| GET  | /api/bookmarks | List tempat tersimpan user |
| GET  | /api/places/{id}/comments | List komentar |
| POST | /api/places/{id}/comments | { content } |
| DELETE | /api/comments/{id} | Hapus komentar (owner) |

### Users & Categories
| Method | Endpoint | Keterangan |
|---|---|---|
| GET  | /api/categories | Semua kategori |
| GET  | /api/users/{username} | Profil user |
| GET  | /api/users/{username}/places | Places milik user |
| POST | /api/users/{username} | Update profil (_method=PUT) |

---

## 🔧 TROUBLESHOOTING

**CORS Error di browser:**
→ Pastikan URL frontend ada di `config/cors.php`
→ Jalankan `php artisan config:clear`

**500 Error:**
→ Cek `storage/logs/laravel.log`

**Storage gambar tidak muncul:**
→ Pastikan sudah `php artisan storage:link`
→ Cek `APP_URL` di `.env` sudah benar

**Migration error "table already exists":**
→ `php artisan migrate:fresh --seed` (HAPUS semua data!)

**Token expired / 401:**
→ Logout dan login ulang

**Railway: APP_KEY error:**
→ Jalankan `php artisan key:generate` lokal, copy hasilnya ke Railway env vars
