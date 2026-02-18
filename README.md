# 🏭 Royal Jeans - Order Management System
## سیستم مدیریت سفارشات رویال جینز

یک سیستم مدیریت سفارشات کامل برای صنعت پوشاک با قابلیت مدیریت کالا، پیمانکاران و گزارشات پیشرفته.

---

## 📚 مستندات

- **[QUICK_START.md](./QUICK_START.md)** - شروع سریع در 15 دقیقه
- **[STANDALONE_APP_PLAN.md](./STANDALONE_APP_PLAN.md)** - پلن کامل پروژه
- **[CHAKRA_UI_SETUP.md](./CHAKRA_UI_SETUP.md)** - راهنمای کامل Chakra UI
- **[RTL_JALALI_GUIDE.md](./RTL_JALALI_GUIDE.md)** - راهنمای RTL و تاریخ شمسی ⭐
- **[RTL_COMPONENTS_EXAMPLES.md](./RTL_COMPONENTS_EXAMPLES.md)** - مثال‌های کامل کامپوننت‌ها

---

## 🚀 ویژگی‌ها

### ✅ فعلی (Google Sheets)
- ✅ فرم ثبت کالا با 84 فیلد
- ✅ سایزبندی 6 دسته (سالم، اقتصادی 1-3، نمونه، استوک)
- ✅ جستجوی سریع با کد کالا
- ✅ ذخیره‌سازی در Google Sheets

### 🚧 در حال توسعه (Standalone App)
- 🔐 **Authentication**: Login/Logout با JWT
- 👥 **User Management**: مدیریت کاربران و نقش‌ها
- 📦 **Order Management**: CRUD کامل سفارشات
- 🏢 **Contractor Evaluation**: ارزیابی عملکرد پیمانکاران
- 📊 **Reports & Analytics**: گزارش‌های پیشرفته
- 📤 **Excel Export**: خروجی Excel برای بک‌آپ
- 🔍 **Audit Logs**: ردگیری کامل تغییرات
- 🌙 **Dark Mode**: پشتیبانی از حالت تاریک

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **UI Library**: Chakra UI (RTL Support)
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Routing**: React Router v6
- **تاریخ شمسی**: jalaali-js + react-modern-calendar-datepicker
- **فونت**: Vazirmatn (بهترین فونت فارسی)

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Excel**: ExcelJS

### DevOps
- **Process Manager**: PM2
- **Server**: Windows Server / Windows 10/11

---

## 📁 ساختار پروژه

```
royaljeans-app/
├── frontend/                 # React + Chakra UI
│   ├── src/
│   │   ├── components/      # کامپوننت‌های قابل استفاده مجدد
│   │   ├── pages/           # صفحات اصلی
│   │   ├── services/        # API calls
│   │   ├── store/           # State management
│   │   ├── theme/           # Chakra UI theme
│   │   └── utils/           # توابع کمکی
│   └── package.json
│
├── backend/                  # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/     # منطق business
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, validation, etc
│   │   ├── services/        # سرویس‌های کمکی
│   │   └── utils/           # توابع کمکی
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
├── docs/                     # مستندات
│   ├── QUICK_START.md       # شروع سریع
│   ├── STANDALONE_APP_PLAN.md
│   ├── CHAKRA_UI_SETUP.md
│   └── API.md               # API documentation
│
├── .gitignore
└── README.md                 # این فایل
```

---

## 🚀 شروع سریع

### پیش‌نیازها

- Node.js 20+ ([دانلود](https://nodejs.org/))
- PostgreSQL 15+ ([دانلود](https://www.postgresql.org/download/windows/))
- Git (اختیاری)

### نصب

```bash
# Clone repository
git clone <repository-url>
cd royaljeans-app

# Backend setup
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend setup (در terminal جدید)
cd frontend
npm install
npm run dev
```

**مستندات کامل**: [QUICK_START.md](./QUICK_START.md)

---

## 📊 Database Schema

### Models اصلی

#### User (کاربران)
```prisma
model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  password    String   // bcrypt hashed
  fullName    String
  role        Role     @default(USER)
  isActive    Boolean  @default(true)
}

enum Role {
  ADMIN      // دسترسی کامل
  MANAGER    // مدیریت + گزارشات
  USER       // ثبت و مشاهده
}
```

#### Order (سفارشات)
```prisma
model Order {
  id          Int      @id @default(autoincrement())
  code        String   @unique
  name        String
  date        DateTime
  status      String
  
  // 84 فیلد دیگر...
  // سایزبندی (6 دسته × 8 سایز = 48 فیلد)
  // موجودی و کسری (10 فیلد)
  // ملزومات (7 فیلد)
  // پرسنل (5 فیلد)
  // اطلاعات پایه (14 فیلد)
}
```

#### Contractor (پیمانکاران)
```prisma
model Contractor {
  id          Int              @id
  name        String           @unique
  type        ContractorType   // FABRIC, PRODUCTION, etc
  phone       String?
  evaluations ContractorEvaluation[]
}
```

**Schema کامل**: [STANDALONE_APP_PLAN.md](./STANDALONE_APP_PLAN.md#4-ساختار-دیتابیس)

---

## 🎨 UI Components (Chakra UI)

### چرا Chakra UI?

| ویژگی | Chakra UI | Ant Design | Material-UI |
|-------|-----------|------------|-------------|
| **Bundle Size** | ~50KB ⚡ | ~500KB | ~300KB |
| **RTL Support** | عالی ✅ | محدود ⚠️ | خوب 👍 |
| **Dark Mode** | Built-in 🌙 | نیاز به setup | Built-in |
| **Accessibility** | WCAG 2.1 ♿ | خوب | عالی |
| **Customization** | عالی 🎨 | متوسط | خوب |
| **Learning Curve** | آسان 📖 | متوسط | سخت |

### مثال کامپوننت

```jsx
import { Button, Card, CardBody, Heading } from '@chakra-ui/react';

function OrderCard({ order }) {
  return (
    <Card>
      <CardBody>
        <Heading size="md">{order.name}</Heading>
        <Button colorScheme="brand" mt={4}>
          مشاهده جزئیات
        </Button>
      </CardBody>
    </Card>
  );
}
```

**راهنمای کامل**: [CHAKRA_UI_SETUP.md](./CHAKRA_UI_SETUP.md)

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /api/auth/login
       │    { email, password }
       ▼
┌─────────────┐
│   Backend   │──▶ 2. Verify password (bcrypt)
└──────┬──────┘
       │ 3. Generate JWT token
       │
       ▼
┌─────────────┐
│   Browser   │──▶ 4. Store token (localStorage)
└──────┬──────┘
       │ 5. All requests: Authorization: Bearer <token>
       ▼
┌─────────────┐
│   Backend   │──▶ 6. Verify token (middleware)
└─────────────┘
```

---

## 📊 Features Roadmap

### Phase 1: Core System (4 هفته) ✅ در حال انجام
- [x] Setup project structure
- [x] Authentication system
- [ ] Order CRUD
- [ ] Search & filters
- [ ] Basic reports

### Phase 2: Advanced Features (2 هفته)
- [ ] Contractor evaluation
- [ ] Excel export
- [ ] Audit logs
- [ ] Admin panel

### Phase 3: Analytics (1 هفته)
- [ ] Dashboard with charts
- [ ] Advanced reports
- [ ] Performance metrics

### Phase 4: Mobile (2 هفته)
- [ ] Responsive design optimization
- [ ] PWA features
- [ ] Offline support

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

---

## 📦 Deployment

### Development

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Production

```bash
# Build frontend
cd frontend
npm run build

# Deploy with PM2
cd backend
pm2 start src/app.js --name "royaljeans-api"
pm2 start serve --name "royaljeans-web" -- -s ../frontend/dist -p 3000

# Save configuration
pm2 save
pm2 startup
```

**راهنمای کامل**: [STANDALONE_APP_PLAN.md](./STANDALONE_APP_PLAN.md#6-راهنمای-دیپلویمنت)

---

## 🤝 Contributing

این پروژه یک سیستم داخلی است، اما پیشنهادات و بهبودها همیشه استقبال می‌شود.

### قوانین Commit

```bash
feat: اضافه کردن ویژگی جدید
fix: رفع باگ
docs: تغییرات مستندات
style: تغییرات formatting
refactor: بازنویسی کد
test: اضافه کردن تست
chore: کارهای نگهداری
```

---

## 📝 License

این پروژه برای استفاده داخلی شرکت رویال جینز است.

---

## 👥 Team

- **Frontend**: React + Chakra UI
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL
- **DevOps**: PM2 + Windows Server

---

## 📞 Support

برای سوالات و پشتیبانی:

1. مستندات را بخوانید
2. Issues را بررسی کنید
3. تیم توسعه را مطلع کنید

---

## 🎯 Performance Metrics

### فعلی (Google Sheets)
- ⏱️ زمان بارگذاری: 5-10s
- 📊 حداکثر رکورد: ~1000
- 👥 کاربران همزمان: 2-3
- 💾 فضای ذخیره‌سازی: محدود

### هدف (Standalone App)
- ⚡ زمان بارگذاری: <1s
- 📊 حداکثر رکورد: 1M+
- 👥 کاربران همزمان: 50+
- 💾 فضای ذخیره‌سازی: نامحدود
- 🚀 سرعت: 10-100x سریع‌تر

---

## 🔄 Version History

### v2.0.0 (در حال توسعه)
- 🆕 Standalone application
- 🔐 Authentication system
- 📊 Advanced reporting
- 🏢 Contractor evaluation

### v1.1.0 (فعلی - Google Sheets)
- ✅ فرم 84 فیلدی
- ✅ 6 دسته سایزبندی (شامل استوک)
- ✅ جستجوی سریع
- ✅ Dark mode UI

### v1.0.0 (اولیه)
- ✅ فرم پایه ثبت کالا
- ✅ Google Sheets integration

---

## 🌟 Highlights

- 🎨 **Modern UI** با Chakra UI
- ⚡ **سرعت بالا** با React + Vite
- 🔒 **امن** با JWT authentication
- 📱 **Responsive** برای همه دستگاه‌ها
- 🌙 **Dark Mode** support
- ♿ **Accessible** WCAG compliant
- 🌍 **RTL** پشتیبانی کامل فارسی

---

**ساخته شده با ❤️ برای رویال جینز**

