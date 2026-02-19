# ✅ چک‌لیست راه‌اندازی سریع
# Quick Setup Checklist

---

## 🎯 فقط این 5 مرحله را انجام دهید! (Just do these 5 steps!)

### ✅ مرحله 1: Backend (انجام شده!) / Step 1: Backend (Done!)
- [x] Backend نصب و اجرا شده است / Backend is installed and running
- سرور روی: http://localhost:5000 / Server on: http://localhost:5000

---

### ⏳ مرحله 2: نصب Frontend / Step 2: Install Frontend

**ترمینال جدید باز کنید / Open NEW terminal:**

```powershell
cd frontend

# اگر قبلاً نصب نکرده‌اید / If not installed before:
npm install
```

---

### ⏳ مرحله 3: ایجاد فایل .env / Step 3: Create .env

```powershell
cp .env.example .env
```

بعد مطمئن شوید محتویات این است / Make sure content is:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### ⏳ مرحله 4: اجرای Frontend / Step 4: Start Frontend

```powershell
npm run dev
```

Frontend روی این آدرس اجرا می‌شود / Frontend will run on:
**http://localhost:5173**

---

### ⏳ مرحله 5: ورود به سیستم / Step 5: Login to System

1. مرورگر را باز کنید / Open browser
2. به این آدرس بروید / Go to: **http://localhost:5173**
3. روی "ثبت‌نام" کلیک کنید / Click "Register"
4. اطلاعات را وارد کنید / Enter:
   - ایمیل / Email: `admin@royaljeans.com`
   - رمز عبور / Password: `123456`
   - نام کامل / Full Name: `مدیر سیستم` or `System Admin`
   - نقش / Role: `ADMIN`
5. با همان اطلاعات وارد شوید / Login with same info

---

## 🎉 تمام! سیستم آماده است! / Done! System Ready!

---

## 📋 وضعیت فعلی شما / Your Current Status

| مرحله / Step | وضعیت / Status |
|-------------|----------------|
| Backend Setup | ✅ انجام شده / Done |
| Frontend Install | ⏳ در انتظار / Pending |
| Frontend Start | ⏳ در انتظار / Pending |
| Register User | ⏳ در انتظار / Pending |
| Login | ⏳ در انتظار / Pending |

---

## 🆘 اگر مشکلی داشتید / If you have problems

### مشکل: Frontend بالا نمی‌آید / Problem: Frontend won't start
```powershell
# در ترمینال Frontend / In Frontend terminal:
cd frontend
npm install
npm run dev
```

### مشکل: Backend قطع شده / Problem: Backend disconnected
```powershell
# ترمینال Backend را باز کنید / Open Backend terminal:
cd backend
npm run dev
```

### مشکل: Cannot connect to Backend / Problem: Cannot connect
- مطمئن شوید هر دو سرور در حال اجرا هستند / Make sure both servers running
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

## 📱 تست سریع / Quick Test

```bash
# در ترمینال جدید / In new terminal:
curl http://localhost:5000/health
```

باید این را ببینید / Should see:
```json
{"status":"OK","timestamp":"...","version":"1.0.0"}
```

---

## 📚 راهنماهای بیشتر / More Guides

- **راهنمای کامل فارسی**: `راهنمای_کامل.md` (Complete Persian Guide)
- **راهنمای کامل انگلیسی**: `QUICK_GUIDE_EN.md` (Complete English Guide)
- **راهنمای سریع**: `QUICK_START.md` (Quick Start)
- **README اصلی**: `README.md` (Main README)

---

**موفق باشید! / Good luck!** 🎉
