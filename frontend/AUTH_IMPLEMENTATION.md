# Frontend Auth Implementation

Frontend auth sekarang siap dengan:

## File yang ditambahkan/diupdate:

### 1. **API Service dengan interceptors** (`src/services/api.ts`)
- Auto-attach Bearer token ke setiap request
- Handle 401 → clear token & redirect ke /auth/login

### 2. **Auth Context & Hook** (`src/contexts/AuthContext.tsx`)
- AuthProvider context untuk manage auth state global
- User state persisted di localStorage
- Methods: register(), login(), logout()
- useAuth() hook untuk consume context di komponen

### 3. **Protected Route Wrapper** (`src/components/ProtectedRoute.tsx`)
- Wrap protected pages (dashboard, transactions, dll)
- Redirect ke login jika belum authenticated
- Show loading state saat checking auth

### 4. **Login Page** (`src/pages/auth/Login.tsx`)
- Form email + password
- Panggil useAuth().login()
- Error handling & loading state
- Link ke register page

### 5. **Register Page** (`src/pages/auth/Register.tsx`)
- Form email + password + confirm password + business name
- Validasi: password match, min 6 chars
- Panggil useAuth().register()
- Link ke login page

### 6. **Updated App.tsx**
- Wrap semua routes dengan AuthProvider
- Auth routes (login/register) tanpa PageShell
- Protected routes dengan ProtectedRoute wrapper
- Dashboard & transactions routes protected

### 7. **Updated Topbar** (`src/components/layout/Topbar.tsx`)
- Show user email
- Add Logout button yang clear session & redirect ke login

## Flow yang sudah berjalan

```
User → Register page
  ↓
  POST /api/v1/auth/register
  ↓
  Response: user + accessToken
  ↓
  localStorage: save accessToken + user
  ↓
  setUser() in context
  ↓
  Redirect ke /dashboard
```

```
User → Login page
  ↓
  POST /api/v1/auth/login
  ↓
  Response: user + accessToken
  ↓
  localStorage + context update
  ↓
  Redirect ke /dashboard
```

```
Protected route check:
  useAuth() → isAuthenticated?
  ✓ Yes → render page
  ✗ No → redirect ke /auth/login
```

## Cara test di frontend lokal

1. Pastikan backend running:
```powershell
cd "C:\Tugas kuliah\semester 5\Pemrpgraman web\Werb_Desain\backend"
npm run dev
# Server listening on port 4000
```

2. Start frontend dev:
```powershell
cd "C:\Tugas kuliah\semester 5\Pemrpgraman web\Werb_Desain\frontend"
npm run dev
# Local: http://localhost:5173/
```

3. Klik "Daftar di sini" atau langsung ke `/auth/register`
4. Isi form → Daftar
5. Redirect otomatis ke `/dashboard` (protected)
6. Topbar menampilkan user email
7. Klik Logout → redirect ke login

## Environment

Frontend otomatis pakai:
- `VITE_API_URL` = http://localhost:4000/api/v1 (default)

Set env jika backend di URL lain:
```powershell
$env:VITE_API_URL = "https://api.example.com/api/v1"
npm run dev
```

atau buat `.env`:
```
VITE_API_URL=https://api.example.com/api/v1
```

## Known issues / next

- Refresh token rotation belum diimplementasi (token expires ~15m). Untuk production: add refresh endpoint & auto-refresh logic.
- Password reset belum ada.
- Email verification belum ada.

Semua sudah siap untuk ditest!
