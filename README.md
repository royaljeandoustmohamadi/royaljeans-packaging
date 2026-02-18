# 🏭 Royal Jeans - Order Management System
## سیستم مدیریت سفارشات رویال جینز

یک سیستم مدیریت سفارشات کامل برای صنعت پوشاک با قابلیت مدیریت کالا، پیمانکاران و گزارشات پیشرفته.

---

## 🚀 ویژگی‌ها

- **احراز هویت کامل**: سیستم Login/Logout با JWT
- **مدیریت سفارشات**: CRUD کامل با 84 فیلد
- **سایزبندی**: 6 دسته (سالم، اقتصادی 1-3، نمونه، استوک)
- **مدیریت پیمانکاران**: با سیستم ارزیابی
- **RTL کامل**: پشتیبانی کامل از زبان فارسی
- **UI مدرن**: Chakra UI با پشتیبانی از Dark Mode

---

## 🛠 تکنولوژی‌ها

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: SQLite (Prisma ORM)
- **Auth**: JWT + bcrypt

### Frontend
- **Framework**: React 18 + Vite
- **UI Library**: Chakra UI
- **State Management**: Zustand
- **Routing**: React Router v6
- **Icons**: Lucide React

---

## 📁 ساختار پروژه

```
royaljeans-packaging/
├── backend/                 # Node.js + Express + Prisma
│   ├── src/
│   │   ├── index.js        # Entry point
│   │   ├── routes/         # API Routes
│   │   ├── middleware/     # Auth middleware
│   │   └── utils/          # Utilities
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── frontend/                # React + Chakra UI
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management
│   │   ├── theme/          # Chakra UI theme
│   │   └── utils/          # Utilities
│   └── package.json
│
└── README.md
```

---

## 🚀 شروع سریع

### پیش‌نیازها
- Node.js 20+
- npm یا yarn

### نصب Backend

```bash
cd backend

# نصب وابستگی‌ها
npm install

# کپی فایل environment
cp .env.example .env

# اجرای migration
npx prisma migrate dev

# اجرای سرور
npm run dev
```

سرور روی `http://localhost:5000` اجرا می‌شود.

### نصب Frontend

```bash
cd frontend

# نصب وابستگی‌ها
npm install

# کپی فایل environment
cp .env.example .env

# اجرای development server
npm run dev
```

Frontend روی `http://localhost:5173` اجرا می‌شود.

---

## 📊 Database Schema

### جداول اصلی

- **User**: کاربران سیستم با نقش‌های ADMIN, MANAGER, USER
- **Order**: سفارشات با 84 فیلد شامل سایزبندی، موجودی، ملزومات
- **Contractor**: پیمانکاران (پارچه، تولید، بسته‌بندی، سنگ‌شویی)
- **ContractorEvaluation**: ارزیابی پیمانکاران
- **AuditLog**: لاگ تغییرات

---

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - ثبت‌نام
- `POST /api/auth/login` - ورود
- `GET /api/auth/profile` - پروفایل کاربر

### Orders
- `GET /api/orders` - لیست سفارشات
- `POST /api/orders` - ایجاد سفارش
- `GET /api/orders/:id` - جزئیات سفارش
- `PUT /api/orders/:id` - ویرایش سفارش
- `DELETE /api/orders/:id` - حذف سفارش

### Contractors
- `GET /api/contractors` - لیست پیمانکاران
- `POST /api/contractors` - ایجاد پیمانکار
- `GET /api/contractors/:id` - جزئیات پیمانکار
- `PUT /api/contractors/:id` - ویرایش پیمانکار
- `DELETE /api/contractors/:id` - حذف پیمانکار
- `POST /api/contractors/:id/evaluations` - ثبت ارزیابی

---

## 🎨 UI Components

### صفحات ایجاد شده
- **Login**: صفحه ورود با فرم ایمیل و رمز عبور
- **Dashboard**: داشبورد با آمار کلی
- **Orders List**: لیست سفارشات با جستجو و فیلتر
- **Order Create**: فرم ثبت سفارش با 84 فیلد در تب‌های جداگانه
- **Contractors List**: لیست پیمانکاران با فیلتر نوع

### ویژگی‌های UI
- پشتیبانی کامل RTL
- فونت فارسی Vazirmatn
- ریسپانسیو برای موبایل و دسکتاپ
- Toast notifications
- Form validation

---

## 🔧 تنظیمات

### Backend `.env`
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 تست

```bash
# Backend
cd backend
npm run dev

# Frontend (ترمینال جدید)
cd frontend
npm run dev
```

---

## 📦 Build برای Production

### Frontend Build
```bash
cd frontend
npm run build
```

فایل‌های build در پوشه `dist/` قرار می‌گیرند.

---

## 📝 نکات مهم

1. **امنیت**: حتماً JWT_SECRET را در production تغییر دهید
2. **دیتابیس**: در حالت فعلی از SQLite استفاده می‌شود
3. **CORS**: در development هر دو سرور روی localhost اجرا می‌شوند

---

## 👥 نقش‌های کاربری

- **ADMIN**: دسترسی کامل (حذف کاربران، همه عملیات)
- **MANAGER**: مدیریت + گزارشات
- **USER**: ثبت و مشاهده

---

**ساخته شده برای رویال جینز** 🏭
