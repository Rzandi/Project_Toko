# InvoiceEase - Quick Start Guide

## ⚡ Get Running in 5 Minutes

### 1️⃣ Prerequisites
- ✅ Node.js 18+ installed
- ✅ MongoDB 7.0+ running (`mongod` or Windows service)
- ✅ Both `frontend/` and `backend/` packages already installed with `npm install`

### 2️⃣ Start Backend (Terminal 1)
```powershell
cd backend
npm run dev
```
✅ Expected: `MongoDB connected (real)` + `Server listening on port 4000`

### 3️⃣ Start Frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```
✅ Expected: `VITE v5.x ready in xxxx ms` + `Local: http://localhost:5173/`

### 4️⃣ Open Application
Browser → **http://localhost:5173/**

### 5️⃣ Test Account (Optional)
```
Email: test@invoiceease.local
Password: TestPass123!
```
Or register a new account

---

## 🎯 Quick Actions

| Action | Command | Port |
|--------|---------|------|
| Start Backend | `cd backend && npm run dev` | 4000 |
| Start Frontend | `cd frontend && npm run dev` | 5173 |
| Build Frontend | `cd frontend && npm run build` | - |
| Production Build Preview | `cd frontend && npm run preview` | 4173 |
| MongoDB Check | `Test-NetConnection -ComputerName 127.0.0.1 -Port 27017` | 27017 |

---

## 📋 Default Configuration

| Component | URL | Config |
|-----------|-----|--------|
| Frontend Dev | `http://localhost:5173/` | Vite dev server, HMR enabled |
| Backend API | `http://localhost:4000/api/v1` | Express server |
| MongoDB | `mongodb://localhost:27017/invoice-ease` | Local instance or MongoDB Atlas |
| Health Check | `http://localhost:4000/health` | Returns `{"ok": true}` |

---

## 🚀 Production Deployment

### Frontend to Vercel/Netlify
```bash
cd frontend
npm run build
# Upload dist/ folder to Vercel/Netlify
# Set VITE_API_URL to your backend URL
```

### Backend to Heroku/Railway
```bash
# From backend directory
git push heroku main
# Or use Railway CLI: `railway deploy`
```

---

## ❌ Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| MongoDB not connecting | `Start-Service MongoDB` or run `mongod` manually |
| Port 4000 in use | Find and kill process: `Get-Process | grep :4000` |
| CORS errors | Verify backend CORS is enabled (it is by default) |
| Can't login | Register first, or use test credentials above |
| Build fails | Delete `node_modules/`, run `npm install` again |

---

## 📁 Important Files

```
frontend/
├── vite.config.ts          # Code splitting config
├── src/App.tsx             # Main routes
├── src/contexts/           # Auth state
└── src/services/api.ts     # API client

backend/
├── src/server.ts           # MongoDB connection
├── src/app.ts              # Express setup
└── src/routes/             # API endpoints
```

---

## 🧪 Test the APIs (PowerShell)

```powershell
# Register user
$body = @{
  email = 'test@local.com'
  password = 'Pass123!'
  business = @{ name = 'Test' }
} | ConvertTo-Json

$reg = Invoke-RestMethod -Uri 'http://localhost:4000/api/v1/auth/register' -Method Post -ContentType 'application/json' -Body $body
$token = $reg.token

# Get transactions (with auth)
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri 'http://localhost:4000/api/v1/transactions' -Method Get -Headers $headers
```

---

## 📊 Feature Checklist

- ✅ User registration & login
- ✅ Dashboard with charts
- ✅ Transaction CRUD
- ✅ Invoice creation (multi-step)
- ✅ Client management
- ✅ Settings
- ✅ JWT authentication
- ✅ MongoDB persistence
- ✅ Production build
- ✅ Error handling

---

## 📞 Need Help?

1. Check `FINAL_PROJECT_DOCUMENTATION.md` for detailed docs
2. Review browser console (F12) for client errors
3. Check backend terminal for API errors
4. Verify MongoDB is running: `Test-NetConnection -ComputerName 127.0.0.1 -Port 27017`

---

**Happy coding! 🚀**

---

## ℹ️ If Either Port is Not Running

### Start Backend
```powershell
cd "C:\Tugas kuliah\semester 5\Pemrpgraman web\Werb_Desain\backend"
npm run dev
# Should show: "Server listening on port 4000"
```

### Start Frontend
```powershell
cd "C:\Tugas kuliah\semester 5\Pemrpgraman web\Werb_Desain\frontend"
npm run dev
# Should show: "Local:   http://localhost:5173/"
```

---

## 3️⃣ Test Auth Flow

### Option A: Browser (Easiest)
1. Open http://localhost:5173
2. Click "Daftar" (Register)
3. Fill form and submit
4. Should redirect to Dashboard
5. Click "Logout"
6. Login again with same credentials
7. ✓ All working!

### Option B: PowerShell API Test
```powershell
# Terminal 3: Test API directly
$base = "http://localhost:4000/api/v1"

# 1. Register
$body = @{email="test@test.com";password="test123";businessName="Test"} | ConvertTo-Json
$reg = Invoke-RestMethod -Uri "$base/auth/register" -Method POST -ContentType "application/json" -Body $body
Write-Host "✓ Register: $($reg.data.email)"
$token = $reg.data.accessToken

# 2. Login
$body = @{email="test@test.com";password="test123"} | ConvertTo-Json
$login = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -ContentType "application/json" -Body $body
Write-Host "✓ Login: $($login.data.email)"

# 3. Protected endpoint
$me = Invoke-RestMethod -Uri "$base/auth/me" -Method GET -Headers @{"Authorization"="Bearer $token"}
Write-Host "✓ Protected route: $($me.data.email)"

Write-Host ""
Write-Host "All tests passed! ✓"
```

---

## 4️⃣ What Was Implemented

### Frontend (`/frontend/src`)
- ✅ `services/api.ts` - Axios with JWT interceptors
- ✅ `contexts/AuthContext.tsx` - React Context + useAuth hook
- ✅ `pages/auth/Login.tsx` - Login form
- ✅ `pages/auth/Register.tsx` - Register form
- ✅ `components/ProtectedRoute.tsx` - Route protection
- ✅ `components/layout/Topbar.tsx` - User display + logout

### Backend (`/backend/src`)
- ✅ `controllers/authController.ts` - Register/Login/Me endpoints
- ✅ `models/User.ts` - User schema with password hashing
- ✅ `middlewares/auth.ts` - JWT verification middleware
- ✅ `routes/auth.ts` - Auth endpoint routing

### Features
- ✅ User registration with password validation
- ✅ Email uniqueness check
- ✅ Password hashing (bcryptjs)
- ✅ JWT token generation (~15 min expiry)
- ✅ Session persistence (localStorage)
- ✅ Protected routes (ProtectedRoute wrapper)
- ✅ Auto-logout on 401 (API interceptor)
- ✅ Error handling + form validation

---

## 5️⃣ File Locations

```
C:\Tugas kuliah\semester 5\Pemrpgraman web\Werb_Desain\
├── frontend/
│   ├── src/
│   │   ├── App.tsx                          (Auth routing)
│   │   ├── services/api.ts                  (JWT interceptors)
│   │   ├── contexts/AuthContext.tsx         (Auth state)
│   │   ├── pages/
│   │   │   └── auth/
│   │   │       ├── Login.tsx                (Login page)
│   │   │       └── Register.tsx             (Register page)
│   │   └── components/
│   │       ├── ProtectedRoute.tsx           (Route guard)
│   │       └── layout/Topbar.tsx            (User menu)
│   └── .env                                 (VITE_API_URL=http://localhost:4000/api/v1)
│
├── backend/
│   ├── src/
│   │   ├── app.ts                           (Express setup)
│   │   ├── controllers/authController.ts    (Auth handlers)
│   │   ├── models/User.ts                   (User schema)
│   │   ├── middlewares/auth.ts              (JWT verification)
│   │   └── routes/auth.ts                   (Auth routes)
│   └── .env                                 (DB_URI=mongodb://localhost:27017/invoice-ease)
│
└── (Test files)
    ├── TEST_AUTH_FLOW.md                    (Manual test guide)
    ├── AUTH_IMPLEMENTATION.md               (Implementation summary)
    ├── AUTH_TEST_RESULTS.md                 (Test checklist)
    └── QUICK_START.md                       (This file)
```

---

## 6️⃣ Environment Variables

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:4000/api/v1
```

### Backend (`.env`)
```
PORT=4000
DB_URI=mongodb://localhost:27017/invoice-ease
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

---

## 7️⃣ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Backend not found (4000) | Run `npm run dev` in backend folder |
| Frontend not loading (5173) | Run `npm run dev` in frontend folder |
| CORS Error | Ensure frontend on localhost:5173, backend on localhost:4000 |
| Login always fails | Check backend logs, verify password is correct |
| Token not saving | Check browser localStorage is enabled |
| Keep getting redirected to login | Verify backend `/auth/me` endpoint is working |

---

## 8️⃣ Next Steps

Once auth tests all pass ✓:

1. **Build Transactions CRUD UI**
   - Create `/frontend/src/pages/TransactionsList.tsx`
   - Create `/frontend/src/components/TransactionForm.tsx`
   - Wire to `/api/v1/transactions` endpoints
   - Add filtering, pagination, create/edit/delete modals

2. **Build Analytics Dashboard**
   - Wire `/frontend/src/pages/DashboardHome.tsx` to `/api/v1/analytics/overview`
   - Add charts (Recharts library available)
   - Display KPIs and cash flow

3. **Build Invoice Builder**
   - Create `/frontend/src/pages/InvoiceBuilder.tsx`
   - Line items UI with calculations
   - PDF export (jsPDF or server-side)
   - Invoice numbering via backend counter

---

**Status: ✅ Auth System Complete & Ready to Test**

👉 **Next Action:** Open http://localhost:5173 and test registration!
