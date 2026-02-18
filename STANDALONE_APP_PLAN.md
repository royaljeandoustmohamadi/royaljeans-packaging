# Royal Jeans - Standalone Application Project Plan
## پلن کامل تبدیل به اپلیکیشن مستقل

---

## 📋 فهرست مطالب

1. [معرفی پروژه](#معرفی-پروژه)
2. [معماری پیشنهادی](#معماری-پیشنهادی)
3. [تکنولوژی‌های مورد استفاده](#تکنولوژیهای-مورد-استفاده)
4. [ساختار دیتابیس](#ساختار-دیتابیس)
5. [مراحل پیاده‌سازی](#مراحل-پیادهسازی)
6. [راهنمای دیپلویمنت](#راهنمای-دیپلویمنت)
7. [هزینه و زمان](#هزینه-و-زمان)

---

## 1. معرفی پروژه

### هدف
تبدیل سیستم فعلی Google Sheets به یک وب اپلیکیشن مستقل که روی سرور ویندوزی شما اجرا شود و بدون نیاز به اینترنت در شبکه محلی قابل استفاده باشد.

### ویژگی‌های کلیدی

#### ✅ فعلی در Google Sheets
- فرم ثبت کالا
- جستجوی کالا با کد
- ذخیره در Google Sheets
- گزارشات ساده

#### 🚀 جدید در اپلیکیشن مستقل
- **سیستم احراز هویت کامل** (Login/Logout)
- **پنل ادمین** برای مدیریت کاربران
- **ارزیابی عملکرد پیمانکاران** (Contractor Evaluation)
- **گزارش‌گیری پیشرفته** با فیلترهای متعدد
- **Export به Excel** برای بک‌آپ و آنالیز
- **Audit Log** برای ردگیری تغییرات
- **Multi-User** با دسترسی همزمان
- **سرعت بالا** (10-100x سریع‌تر از Sheets)
- **امنیت بالا** با Role-Based Access Control

---

## 2. معماری پیشنهادی

### معماری سه لایه (Three-Tier Architecture)

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                  │
│                   (Frontend - React)                 │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Login   │  │Dashboard │  │  Forms   │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Admin   │  │Contractor│  │ Reports  │          │
│  │  Panel   │  │  Eval.   │  │  Export  │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS/REST API
┌───────────────────────▼─────────────────────────────┐
│               BUSINESS LOGIC LAYER                   │
│              (Backend - Node.js/Express)             │
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │         Authentication & Authorization        │   │
│  │              (JWT + bcrypt)                   │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │   Users  │  │  Orders  │  │Contractor│          │
│  │ Services │  │ Services │  │ Services │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  Excel   │  │  Backup  │  │  Audit   │          │
│  │ Services │  │ Services │  │   Log    │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└───────────────────────┬─────────────────────────────┘
                        │ SQL Queries (ORM)
┌───────────────────────▼─────────────────────────────┐
│                  DATA ACCESS LAYER                   │
│              (Database - PostgreSQL)                 │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  users   │  │  orders  │  │contractors│         │
│  └──────────┘  └──────────┘  └──────────┘          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │evaluations│ │audit_logs│  │ sessions │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│                                                       │
│  [Auto Backup to Excel files every day]              │
└─────────────────────────────────────────────────────┘
```

---

## 3. تکنولوژی‌های مورد استفاده

### Backend Stack

#### Node.js Runtime
- **نسخه**: Node.js 20 LTS
- **دلیل انتخاب**: سریع، cross-platform، جامعه بزرگ
- **جایگزین**: .NET Core (اگر با C# راحت‌تری)

#### Express.js Framework
```bash
npm install express cors helmet compression
```
- **عملکرد**: ساخت REST API
- **Middleware**: CORS, Security, Compression

#### Prisma ORM
```bash
npm install prisma @prisma/client
```
- **عملکرد**: مدیریت دیتابیس، Type-safe queries
- **مزایا**: Migration system، Auto-completion

#### PostgreSQL Database
- **نسخه**: PostgreSQL 15+
- **جایگزین**: SQLite (ساده‌تر، فایل-محور)
- **دلیل انتخاب**: Reliable، Scalable، Transaction support

#### Authentication
```bash
npm install jsonwebtoken bcryptjs
```
- **JWT**: برای Token-based authentication
- **bcrypt**: برای Hash کردن رمز عبور

#### Excel Export
```bash
npm install exceljs
```
- **عملکرد**: Export داده به Excel
- **مزایا**: Styling support، Multiple sheets

### Frontend Stack

#### React 18
```bash
npm create vite@latest frontend -- --template react
```
- **Build Tool**: Vite (سریع‌تر از CRA)
- **Language**: JavaScript (یا TypeScript)

#### UI Library
```bash
npm install @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion
```
- **Chakra UI**: کامپوننت‌های زیبا با RTL support عالی
- **مزایا**: سبک (50KB)، Accessible، Dark mode built-in
- **جایگزین**: Ant Design (~500KB), Material-UI

#### State Management
```bash
npm install zustand
```
- **Zustand**: ساده‌تر از Redux
- **عملکرد**: مدیریت State گلوبال

#### Form Management
```bash
npm install react-hook-form zod @hookform/resolvers
```
- **React Hook Form**: Performance بالا
- **Zod**: Validation قدرتمند

#### HTTP Client
```bash
npm install axios
```
- **عملکرد**: ارتباط با Backend API

#### Persian Date
```bash
npm install react-modern-calendar-datepicker
```
- **عملکرد**: تاریخ شمسی

### DevOps & Deployment

#### PM2 Process Manager
```bash
npm install -g pm2
```
- **عملکرد**: نگه‌داری backend در حالت اجرا
- **مزایا**: Auto-restart، Load balancing، Logs

#### Nginx (Optional)
- **عملکرد**: Reverse proxy، Static file serving
- **مزایا**: HTTPS support، Caching

---

## 4. ساختار دیتابیس

### ERD (Entity Relationship Diagram)

```
┌─────────────┐         ┌─────────────┐
│   Users     │         │   Orders    │
├─────────────┤         ├─────────────┤
│ id (PK)     │────┐    │ id (PK)     │
│ email       │    │    │ code (UQ)   │
│ password    │    │    │ name        │
│ fullName    │    │    │ date        │
│ role        │    └────│ createdBy   │
│ isActive    │         │ ...sizes... │
│ createdAt   │         │ ...stocks...│
│ updatedAt   │         │ createdAt   │
└─────────────┘         └─────────────┘
      │                       │
      │ creates               │ has
      │                       │
      ▼                       ▼
┌──────────────┐      ┌──────────────┐
│  AuditLogs   │      │ Contractors  │
├──────────────┤      ├──────────────┤
│ id (PK)      │      │ id (PK)      │
│ userId (FK)  │      │ name (UQ)    │
│ orderId (FK) │      │ type         │
│ action       │      │ phone        │
│ changes      │      │ isActive     │
│ createdAt    │      │ createdAt    │
└──────────────┘      └──────────────┘
                             │
                             │ evaluated in
                             ▼
                  ┌─────────────────────┐
                  │ContractorEvaluations│
                  ├─────────────────────┤
                  │ id (PK)             │
                  │ contractorId (FK)   │
                  │ evaluatedBy (FK)    │
                  │ rating (1-5)        │
                  │ quality             │
                  │ timing              │
                  │ price               │
                  │ cooperation         │
                  │ comments            │
                  │ createdAt           │
                  └─────────────────────┘
```

### Prisma Schema کامل

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USERS ────────────────────────────────────────────────────

model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  password    String   // bcrypt hashed
  fullName    String
  role        Role     @default(USER)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  orders      Order[]
  evaluations ContractorEvaluation[]
  auditLogs   AuditLog[]
  
  @@index([email])
}

enum Role {
  ADMIN      // مدیر کل - دسترسی کامل
  MANAGER    // مدیر - دسترسی به گزارشات و ارزیابی
  USER       // کاربر عادی - فقط ثبت و مشاهده
}

// ─── ORDERS ───────────────────────────────────────────────────

model Order {
  id                    Int      @id @default(autoincrement())
  code                  String   @unique
  name                  String
  date                  DateTime
  status                String
  
  // اطلاعات پایه
  totalCount            Int?
  packingCount          Int?
  packingName           String?
  fabricSupplier        String?
  productionSupplier    String?
  fabric                String?
  stoneWash             String?
  style                 String?
  
  // سایزبندی سالم (Healthy)
  size30_healthy        Int?
  size31_healthy        Int?
  size32_healthy        Int?
  size33_healthy        Int?
  size34_healthy        Int?
  size36_healthy        Int?
  size38_healthy        Int?
  size40_healthy        Int?
  
  // سایزبندی اقتصادی (Economy)
  size30_economy        Int?
  size31_economy        Int?
  size32_economy        Int?
  size33_economy        Int?
  size34_economy        Int?
  size36_economy        Int?
  size38_economy        Int?
  size40_economy        Int?
  
  // سایزبندی اقتصادی 2
  size30_economy2       Int?
  size31_economy2       Int?
  size32_economy2       Int?
  size33_economy2       Int?
  size34_economy2       Int?
  size36_economy2       Int?
  size38_economy2       Int?
  size40_economy2       Int?
  
  // سایزبندی اقتصادی 3
  size30_economy3       Int?
  size31_economy3       Int?
  size32_economy3       Int?
  size33_economy3       Int?
  size34_economy3       Int?
  size36_economy3       Int?
  size38_economy3       Int?
  size40_economy3       Int?
  
  // سایزبندی نمونه (Sample)
  size30_sample         Int?
  size31_sample         Int?
  size32_sample         Int?
  size33_sample         Int?
  size34_sample         Int?
  size36_sample         Int?
  size38_sample         Int?
  size40_sample         Int?
  
  // سایزبندی استوک (Stock) - NEW!
  size30_stock          Int?
  size31_stock          Int?
  size32_stock          Int?
  size33_stock          Int?
  size34_stock          Int?
  size36_stock          Int?
  size38_stock          Int?
  size40_stock          Int?
  
  // موجودی
  stockFabric           Int?
  stockWash             Int?
  stockProduction       Int?
  stockPackaging        Int?
  saleableCount         Int?
  differentWash         Int?
  waste                 Int?
  stockMinus            Int?
  stockPlus             Int?
  stockPackagingMinus   Int?
  
  // ملزومات (Accessories)
  accessories_button    Int?
  accessories_rivet     Int?
  accessories_pocketCard Int?
  accessories_sizeCard  Int?
  accessories_hanger    Int?
  accessories_band      Int?
  accessories_leather   Int?
  
  // پرسنل و توضیحات
  description           String?
  finisher              String?
  initialControl        String?
  controller            String?
  bu                    String?  // نوع سفارش
  bv                    String?  // سطح سفارش
  
  // Relations
  createdBy             Int
  creator               User       @relation(fields: [createdBy], references: [id])
  createdAt             DateTime   @default(now())
  updatedAt             DateTime   @updatedAt
  
  auditLogs             AuditLog[]
  
  @@index([code])
  @@index([date])
  @@index([status])
  @@index([createdBy])
}

// ─── CONTRACTORS ──────────────────────────────────────────────

model Contractor {
  id          Int            @id @default(autoincrement())
  name        String         @unique
  type        ContractorType
  phone       String?
  address     String?
  isActive    Boolean        @default(true)
  notes       String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  // Relations
  evaluations ContractorEvaluation[]
  
  @@index([type])
  @@index([isActive])
}

enum ContractorType {
  FABRIC       // پارچه
  PRODUCTION   // تولیدی
  PACKAGING    // بسته بندی
  STONE_WASH   // سنگشویی
}

// ─── CONTRACTOR EVALUATIONS ───────────────────────────────────

model ContractorEvaluation {
  id           Int        @id @default(autoincrement())
  
  // Relations
  contractorId Int
  contractor   Contractor @relation(fields: [contractorId], references: [id], onDelete: Cascade)
  
  evaluatedBy  Int
  evaluator    User       @relation(fields: [evaluatedBy], references: [id])
  
  // Ratings (1-5 scale)
  rating       Int        // امتیاز کلی
  quality      Int?       // کیفیت
  timing       Int?       // زمانبندی
  price        Int?       // قیمت
  cooperation  Int?       // همکاری
  
  comments     String?
  createdAt    DateTime   @default(now())
  
  @@index([contractorId])
  @@index([evaluatedBy])
  @@index([createdAt])
}

// ─── AUDIT LOGS ───────────────────────────────────────────────

model AuditLog {
  id        Int      @id @default(autoincrement())
  
  // Relations
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  
  orderId   Int?
  order     Order?   @relation(fields: [orderId], references: [id], onDelete: SetNull)
  
  // Action details
  action    String   // CREATE, UPDATE, DELETE, LOGIN, EXPORT, etc.
  entity    String   // Order, User, Contractor, etc.
  changes   Json?    // تغییرات به صورت JSON
  
  // Request info
  ipAddress String?
  userAgent String?
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([action])
  @@index([entity])
  @@index([createdAt])
}
```

---

## 5. مراحل پیاده‌سازی

### Phase 1: Setup Project (3-4 روز)

#### 1.1 Backend Setup
```bash
# ایجاد پروژه
mkdir royaljeans-app
cd royaljeans-app
mkdir backend frontend docs

# Backend setup
cd backend
npm init -y
npm install express cors helmet compression dotenv
npm install prisma @prisma/client
npm install jsonwebtoken bcryptjs
npm install exceljs
npm install -D nodemon

# Initialize Prisma
npx prisma init
```

#### 1.2 Frontend Setup
```bash
cd ../frontend
npm create vite@latest . -- --template react
npm install antd @ant-design/icons
npm install zustand
npm install react-hook-form zod @hookform/resolvers
npm install axios
npm install react-modern-calendar-datepicker
npm install react-router-dom
```

#### 1.3 Database Setup
```sql
-- PostgreSQL installation on Windows
-- Download from: https://www.postgresql.org/download/windows/
-- Create database
CREATE DATABASE royaljeans;
CREATE USER royaljeans_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE royaljeans TO royaljeans_user;
```

#### 1.4 Environment Variables
```env
# backend/.env
DATABASE_URL="postgresql://royaljeans_user:your_secure_password@localhost:5432/royaljeans"
JWT_SECRET="your_very_secure_random_string_min_32_chars"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

---

### Phase 2: Backend Development (1 هفته)

#### 2.1 Authentication System (2 روز)

**File: backend/src/middleware/auth.js**
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'توکن یافت نشد' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'توکن نامعتبر است' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'دسترسی رد شد' });
  }
  next();
};

module.exports = { authMiddleware, requireAdmin };
```

**File: backend/src/controllers/auth.controller.js**
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'این ایمیل قبلاً ثبت شده است' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: 'USER'
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'خطا در ثبت نام' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'حساب کاربری غیرفعال است' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
    }
    
    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entity: 'User',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'خطا در ورود' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات کاربر' });
  }
};
```

#### 2.2 Orders CRUD (2 روز)

**File: backend/src/controllers/orders.controller.js**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Check for duplicate code
    const existing = await prisma.order.findUnique({
      where: { code: orderData.code }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'کد کالا تکراری است' });
    }
    
    // Create order
    const order = await prisma.order.create({
      data: {
        ...orderData,
        createdBy: req.user.id
      }
    });
    
    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        orderId: order.id,
        action: 'CREATE',
        entity: 'Order',
        changes: JSON.stringify({ created: order })
      }
    });
    
    res.json({ ok: true, order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'خطا در ثبت سفارش' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = req.body;
    
    // Get old data
    const oldOrder = await prisma.order.findUnique({ where: { id: parseInt(id) } });
    if (!oldOrder) {
      return res.status(404).json({ error: 'سفارش یافت نشد' });
    }
    
    // Update order
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: orderData
    });
    
    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        orderId: order.id,
        action: 'UPDATE',
        entity: 'Order',
        changes: JSON.stringify({ before: oldOrder, after: order })
      }
    });
    
    res.json({ ok: true, order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'خطا در ویرایش سفارش' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, status, dateFrom, dateTo } = req.query;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (status) {
      where.status = status;
    }
    
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          creator: {
            select: { id: true, fullName: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: parseInt(limit)
      }),
      prisma.order.count({ where })
    ]);
    
    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'خطا در دریافت سفارشات' });
  }
};

exports.searchByCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { code },
      include: {
        creator: {
          select: { id: true, fullName: true, email: true }
        }
      }
    });
    
    if (!order) {
      return res.status(404).json({ error: 'کد کالا پیدا نشد' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Search by code error:', error);
    res.status(500).json({ error: 'خطا در جستجو' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admins can delete
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'فقط ادمین می‌تواند حذف کند' });
    }
    
    const order = await prisma.order.delete({
      where: { id: parseInt(id) }
    });
    
    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'DELETE',
        entity: 'Order',
        changes: JSON.stringify({ deleted: order })
      }
    });
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'خطا در حذف سفارش' });
  }
};
```

#### 2.3 Excel Export Service (1 روز)

**File: backend/src/services/excel.service.js**
```javascript
const ExcelJS = require('exceljs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.exportToExcel = async (filters = {}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Orders');
  
  // Define columns
  worksheet.columns = [
    { header: 'کد کالا', key: 'code', width: 15 },
    { header: 'نام کالا', key: 'name', width: 30 },
    { header: 'تاریخ', key: 'date', width: 12 },
    { header: 'وضعیت', key: 'status', width: 15 },
    // ... Add all other columns
  ];
  
  // Style header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' } };
  
  // Fetch data
  const orders = await prisma.order.findMany({
    where: filters,
    orderBy: { date: 'desc' }
  });
  
  // Add rows
  orders.forEach(order => {
    worksheet.addRow({
      code: order.code,
      name: order.name,
      date: order.date,
      status: order.status,
      // ... Add all other fields
    });
  });
  
  // Auto-filter
  worksheet.autoFilter = {
    from: 'A1',
    to: `Z1` // Adjust based on column count
  };
  
  // Return buffer
  return await workbook.xlsx.writeBuffer();
};
```

#### 2.4 Contractor Evaluation (1 روز)

**File: backend/src/controllers/contractors.controller.js**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.evaluateContractor = async (req, res) => {
  try {
    const { contractorId, rating, quality, timing, price, cooperation, comments } = req.body;
    
    const evaluation = await prisma.contractorEvaluation.create({
      data: {
        contractorId,
        evaluatedBy: req.user.id,
        rating,
        quality,
        timing,
        price,
        cooperation,
        comments
      }
    });
    
    res.json({ ok: true, evaluation });
  } catch (error) {
    console.error('Evaluate contractor error:', error);
    res.status(500).json({ error: 'خطا در ثبت ارزیابی' });
  }
};

exports.getContractorStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const evaluations = await prisma.contractorEvaluation.findMany({
      where: { contractorId: parseInt(id) }
    });
    
    if (evaluations.length === 0) {
      return res.json({ averages: null, count: 0 });
    }
    
    const averages = {
      rating: evaluations.reduce((sum, e) => sum + e.rating, 0) / evaluations.length,
      quality: evaluations.reduce((sum, e) => sum + (e.quality || 0), 0) / evaluations.length,
      timing: evaluations.reduce((sum, e) => sum + (e.timing || 0), 0) / evaluations.length,
      price: evaluations.reduce((sum, e) => sum + (e.price || 0), 0) / evaluations.length,
      cooperation: evaluations.reduce((sum, e) => sum + (e.cooperation || 0), 0) / evaluations.length
    };
    
    res.json({ averages, count: evaluations.length });
  } catch (error) {
    console.error('Get contractor stats error:', error);
    res.status(500).json({ error: 'خطا در دریافت آمار' });
  }
};
```

---

### Phase 3: Frontend Development (1.5 هفته)

#### 3.1 Authentication Pages (2 روز)

**File: frontend/src/pages/Login.jsx**
```jsx
import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', values);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      message.success('ورود موفقیت‌آمیز');
      navigate('/dashboard');
    } catch (error) {
      message.error(error.response?.data?.error || 'خطا در ورود');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card title="ورود به سیستم رویال جینز" style={{ width: 400 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'لطفا ایمیل را وارد کنید' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="ایمیل" />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'لطفا رمز عبور را وارد کنید' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="رمز عبور" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              ورود
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
```

#### 3.2 Order Form (3 روز)

**File: frontend/src/pages/Orders/OrderForm.jsx**
```jsx
// مشابه dialog.html فعلی اما با React و Ant Design
import { Form, Input, Select, InputNumber, DatePicker, Button, Card, Row, Col, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

export default function OrderForm() {
  const { control, handleSubmit, reset } = useForm();
  
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/orders', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('سفارش با موفقیت ثبت شد');
      reset();
    } catch (error) {
      message.error(error.response?.data?.error || 'خطا در ثبت سفارش');
    }
  };
  
  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Card title="اطلاعات پایه">
        <Row gutter={16}>
          <Col span={8}>
            <Controller
              name="code"
              control={control}
              rules={{ required: 'کد کالا الزامی است' }}
              render={({ field }) => (
                <Form.Item label="کد کالا *">
                  <Input {...field} />
                </Form.Item>
              )}
            />
          </Col>
          {/* ... سایر فیلدها */}
        </Row>
      </Card>
      
      {/* ... باقی بخش‌ها */}
      
      <Button type="primary" htmlType="submit">
        ذخیره سفارش
      </Button>
    </Form>
  );
}
```

---

### Phase 4: Deployment (2 روز)

#### 4.1 Build Production

```bash
# Backend
cd backend
npm run build  # if using TypeScript

# Frontend
cd frontend
npm run build
# Output: frontend/dist/
```

#### 4.2 Windows Server Setup

```powershell
# نصب Node.js
# Download from: https://nodejs.org/

# نصب PostgreSQL
# Download from: https://www.postgresql.org/download/windows/

# نصب PM2
npm install -g pm2
npm install -g pm2-windows-service

# راه‌اندازی PM2 Service
pm2-service-install

# Deploy Backend
cd C:\royaljeans-app\backend
pm2 start npm --name "royaljeans-api" -- start
pm2 save
pm2 startup

# Deploy Frontend
# Copy frontend/dist/ to C:\inetpub\wwwroot\royaljeans
# یا استفاده از serve:
npm install -g serve
pm2 start serve --name "royaljeans-frontend" -- -s C:\royaljeans-app\frontend\dist -p 3000
```

---

## 6. راهنمای دیپلویمنت

### نیازمندی‌های سرور

- **OS**: Windows Server 2016+ or Windows 10/11
- **RAM**: 4GB (حداقل) / 8GB (توصیه می‌شود)
- **CPU**: 2 Core (حداقل) / 4 Core (توصیه می‌شود)
- **Storage**: 50GB
- **Network**: Ethernet 100Mbps+

### نصب نرم‌افزارها

1. **Node.js**: https://nodejs.org/ (LTS version)
2. **PostgreSQL**: https://www.postgresql.org/download/windows/
3. **Git**: https://git-scm.com/download/win (اختیاری)

### مراحل نصب

```powershell
# 1. Clone project
git clone [repository-url]
cd royaljeans-app

# 2. Backend setup
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm start

# 3. Frontend setup (در Terminal جدید)
cd frontend
npm install
npm run build

# 4. Deploy با PM2
pm2 start backend/src/app.js --name api
pm2 start serve --name frontend -- -s frontend/dist -p 3000

# 5. ذخیره تنظیمات
pm2 save
pm2 startup
```

---

## 7. هزینه و زمان

### زمان‌بندی کامل

| فاز | توضیحات | زمان |
|-----|---------|------|
| Phase 1 | Setup Project | 3-4 روز |
| Phase 2 | Backend Development | 7 روز |
| Phase 3 | Frontend Development | 10 روز |
| Phase 4 | Integration & Testing | 3 روز |
| Phase 5 | Deployment | 2 روز |
| Phase 6 | Training & Documentation | 2 روز |
| **Total** | | **27-28 روز** (≈ 4-5 هفته) |

### منابع انسانی

- **گزینه 1**: 1 Full-stack Developer (4-5 هفته)
- **گزینه 2**: 1 Backend + 1 Frontend (2.5-3 هفته)

### هزینه نرم‌افزاری

| آیتم | هزینه |
|------|-------|
| Node.js | رایگان |
| PostgreSQL | رایگان |
| React & Libraries | رایگان (Open Source) |
| Windows Server License | دارید |
| **Total** | **0 تومان** |

### مزایای ROI

1. **صرفه‌جویی**: بدون هزینه ماهانه Google Workspace
2. **سرعت**: 10-100x سریع‌تر
3. **امنیت**: داده‌ها روی سرور خودتان
4. **سفارشی‌سازی**: قابلیت توسعه بی‌نهایت
5. **Offline**: کار بدون اینترنت

---

## 8. Roadmap آینده

### Version 1.0 (فعلی)
- ✅ Login/Logout
- ✅ Order Management
- ✅ Contractor Evaluation
- ✅ Reports & Export
- ✅ Audit Logs

### Version 2.0 (آینده)
- 📱 **Mobile App** (React Native)
- 📊 **Advanced Analytics** (Charts & Dashboards)
- 🔔 **Real-time Notifications**
- 📧 **Email Alerts**
- 🤖 **AI-powered Insights**

---

## 9. Support & Maintenance

### Backup Strategy
- **Daily**: Automatic database backup
- **Weekly**: Full system backup
- **Monthly**: Export to Excel for archive

### Monitoring
- **PM2 Dashboard**: Process monitoring
- **Logs**: Application logs in `/logs` directory
- **Database**: PostgreSQL auto-vacuum

### Updates
- **Security Patches**: ماهانه
- **Feature Updates**: فصلی
- **Major Versions**: سالانه

---

## 10. تماس و پشتیبانی

برای شروع پروژه یا سوالات بیشتر:

1. **مرور مستندات**: این فایل + API.md
2. **آماده‌سازی سرور**: نصب Node.js & PostgreSQL
3. **شروع توسعه**: Phase 1 Setup

---

**یادآوری**: این یک پروژه بلندمدت و حرفه‌ای است. با برنامه‌ریزی دقیق و اجرای مرحله‌به‌مرحله، به یک سیستم قدرتمند و مقیاس‌پذیر خواهید رسید.

**موفق باشید! 🚀**
