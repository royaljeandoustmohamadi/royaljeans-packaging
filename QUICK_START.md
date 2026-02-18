# Royal Jeans - Quick Start
## راهنمای سریع راه‌اندازی

---

## 🚀 راه‌اندازی در 5 دقیقه

### 1️⃣ Backend Setup

```bash
cd backend

# نصب وابستگی‌ها
npm install

# کپی فایل تنظیمات
cp .env.example .env

# اجرای migrations
npx prisma migrate dev

# اجرای سرور
npm run dev
```

✅ سرور روی `http://localhost:5000` اجرا می‌شود

---

### 2️⃣ Frontend Setup

```bash
cd frontend

# نصب وابستگی‌ها
npm install

# کپی فایل تنظیمات
cp .env.example .env

# اجرای development server
npm run dev
```

✅ Frontend روی `http://localhost:5173` اجرا می‌شود

---

## 📊 ساختار دیتابیس

پروژه از SQLite استفاده می‌کند. فایل دیتابیس در `backend/prisma/dev.db` ذخیره می‌شود.

### جداول اصلی:
- **User**: کاربران
- **Order**: سفارشات (84 فیلد)
- **Contractor**: پیمانکاران
- **ContractorEvaluation**: ارزیابی پیمانکاران
- **AuditLog**: لاگ تغییرات

---

## 🔑 کاربر پیش‌فرض

پس از اجرای migrations، می‌توانید یک کاربر ثبت کنید:

```bash
# POST /api/auth/register
{
  "email": "admin@royaljeans.com",
  "password": "123456",
  "fullName": "مدیر سیستم",
  "role": "ADMIN"
}
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Orders
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id`
- `DELETE /api/orders/:id`

### Contractors
- `GET /api/contractors`
- `POST /api/contractors`
- `GET /api/contractors/:id`
- `PUT /api/contractors/:id`
- `DELETE /api/contractors/:id`

---

## 📁 ساختار پروژه

```
royaljeans-packaging/
├── backend/           # Node.js + Express + Prisma
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── middleware/
│   │   └── index.js
│   └── prisma/
│       └── schema.prisma
│
└── frontend/          # React + Chakra UI
    ├── src/
    │   ├── components/
    │   ├── pages/     # صفحات اصلی
    │   ├── services/  # API calls
    │   ├── store/     # State management
    │   └── theme/     # Chakra UI theme
    └── index.html
```

---

## 🧪 تست

1. **Backend Health Check**:
   ```
   GET http://localhost:5000/health
   ```

2. **Login Test**:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@royaljeans.com","password":"123456"}'
   ```

---

## 🐛 عیب‌یابی

### مشکل CORS
اگر خطای CORS دریافت کردید، مطمئن شوید که:
1. Backend روی پورت 5000 اجرا شده
2. Frontend روی پورت 5173 اجرا شده
3. در فایل `.env` backend، `NODE_ENV=development` تنظیم شده

### مشکل دیتابیس
اگر دیتابیس کار نمی‌کند:
```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev
```

---

## 📚 مستندات تکمیلی

- [CHAKRA_UI_SETUP.md](./CHAKRA_UI_SETUP.md) - راهنمای Chakra UI
- [STANDALONE_APP_PLAN.md](./STANDALONE_APP_PLAN.md) - پلن کامل پروژه
- [README.md](./README.md) - توضیحات کلی

---

**موفق باشید!** 🎉
