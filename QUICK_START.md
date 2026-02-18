# Royal Jeans - Quick Start Guide
## راهنمای شروع سریع پروژه با Chakra UI

---

## 🚀 شروع در 5 دقیقه!

این راهنما برای شروع سریع پروژه با Chakra UI است.

---

## پیش‌نیازها

### نصب Node.js
1. دانلود از: https://nodejs.org/ (نسخه LTS)
2. نصب و تایید:
```bash
node --version  # باید v20.x نشان دهد
npm --version   # باید v10.x نشان دهد
```

### نصب PostgreSQL (برای بعداً)
1. دانلود از: https://www.postgresql.org/download/windows/
2. نصب با تنظیمات پیش‌فرض
3. یادداشت: password که انتخاب می‌کنید

---

## مرحله 1: ساخت Frontend (5-10 دقیقه)

### 1.1 ایجاد پروژه React

```bash
# ایجاد دایرکتوری اصلی
mkdir royaljeans-app
cd royaljeans-app

# ایجاد Frontend با Vite
npm create vite@latest frontend -- --template react
cd frontend
```

### 1.2 نصب Chakra UI و Dependencies

```bash
# Chakra UI
npm install @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion

# State management
npm install zustand

# Forms
npm install react-hook-form @hookform/resolvers zod

# HTTP client
npm install axios

# Routing
npm install react-router-dom

# Icons
npm install react-icons

# Date utilities (Persian)
npm install date-fns date-fns-jalali

# جمع کل زمان: ~2-3 دقیقه
```

### 1.3 ساختار پوشه‌ها

```bash
# ایجاد پوشه‌های اصلی
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/components/forms
mkdir -p src/pages/auth
mkdir -p src/pages/dashboard
mkdir -p src/pages/orders
mkdir -p src/pages/contractors
mkdir -p src/pages/reports
mkdir -p src/pages/admin
mkdir -p src/services
mkdir -p src/store
mkdir -p src/utils
mkdir -p src/theme
```

### 1.4 Setup Theme

**ایجاد: `src/theme/index.js`**

```javascript
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
};

const fonts = {
  heading: `'Vazirmatn', sans-serif`,
  body: `'Vazirmatn', sans-serif`,
};

const theme = extendTheme({
  config,
  direction: 'rtl',
  colors,
  fonts,
});

export default theme;
```

### 1.5 آپدیت main.jsx

**ویرایش: `src/main.jsx`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
);
```

### 1.6 آپدیت index.html

**ویرایش: `index.html`**

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>سیستم مدیریت رویال جینز</title>
  
  <!-- فونت وزیر -->
  <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 1.7 تست اولیه

**ویرایش: `src/App.jsx`**

```jsx
import { Box, Heading, Button, VStack } from '@chakra-ui/react';

export default function App() {
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <VStack spacing={6}>
        <Heading color="brand.500">
          سیستم مدیریت رویال جینز
        </Heading>
        <Button colorScheme="brand" size="lg">
          شروع کنید
        </Button>
      </VStack>
    </Box>
  );
}
```

### 1.8 اجرای پروژه

```bash
npm run dev
```

باز کنید: http://localhost:5173

**✅ اگر صفحه با فونت فارسی و دکمه آبی دیدید، موفق بودید!**

---

## مرحله 2: ایجاد صفحه Login (10 دقیقه)

### 2.1 Auth Store

**ایجاد: `src/store/authStore.js`**

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password,
        });
        
        set({
          user: res.data.user,
          token: res.data.token,
          isAuthenticated: true,
        });
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete axios.defaults.headers.common['Authorization'];
      },
    }),
    { name: 'auth-storage' }
  )
);
```

### 2.2 صفحه Login

**ایجاد: `src/pages/auth/Login.jsx`**

```jsx
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'ورود موفقیت‌آمیز',
        status: 'success',
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'خطا در ورود',
        description: 'ایمیل یا رمز عبور اشتباه است',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Card maxW="md" w="full" mx={4}>
        <CardBody>
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Heading size="lg" color="brand.500">
              سیستم مدیریت رویال جینز
            </Heading>
            
            <Text color="gray.600">
              لطفاً وارد حساب کاربری خود شوید
            </Text>

            <FormControl isRequired>
              <FormLabel>ایمیل</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@domain.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>رمز عبور</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              width="full"
              isLoading={loading}
            >
              ورود
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
```

### 2.3 Routing

**ویرایش: `src/App.jsx`**

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import { useAuthStore } from './store/authStore';

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2.4 صفحه Dashboard ساده

**ایجاد: `src/pages/dashboard/Dashboard.jsx`**

```jsx
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
} from '@chakra-ui/react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box minH="100vh" p={8} bg="gray.50">
      <VStack spacing={6} align="stretch" maxW="6xl" mx="auto">
        <Box>
          <Heading>خوش آمدید، {user?.fullName || 'کاربر'}!</Heading>
          <Text color="gray.600" mt={2}>
            سیستم مدیریت رویال جینز
          </Text>
        </Box>

        <Button colorScheme="red" onClick={handleLogout} alignSelf="flex-start">
          خروج
        </Button>
      </VStack>
    </Box>
  );
}
```

### 2.5 تست

```bash
npm run dev
```

1. باز کنید: http://localhost:5173
2. باید به صفحه Login برود
3. فرم login را ببینید (هنوز backend نداریم، پس کار نمی‌کند)

**✅ Frontend آماده است!**

---

## مرحله 3: ساخت Backend (15-20 دقیقه)

### 3.1 Setup Backend

```bash
# در پوشه اصلی
cd ..
mkdir backend
cd backend
npm init -y
```

### 3.2 نصب Dependencies

```bash
npm install express cors helmet compression dotenv
npm install prisma @prisma/client
npm install jsonwebtoken bcryptjs
npm install exceljs
npm install -D nodemon
```

### 3.3 تنظیم Prisma

```bash
npx prisma init
```

این دو فایل ایجاد می‌شود:
- `prisma/schema.prisma`
- `.env`

### 3.4 آپدیت .env

**ویرایش: `.env`**

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/royaljeans"
JWT_SECRET="your_super_secure_random_secret_key_min_32_chars_long"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

**⚠️ مهم**: `YOUR_PASSWORD` را با password PostgreSQL خود جایگزین کنید

### 3.5 Schema Prisma

**ویرایش: `prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          Int      @id @default(autoincrement())
  email       String   @unique
  password    String
  fullName    String
  role        Role     @default(USER)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orders      Order[]
  auditLogs   AuditLog[]
}

enum Role {
  ADMIN
  MANAGER
  USER
}

model Order {
  id          Int      @id @default(autoincrement())
  code        String   @unique
  name        String
  date        DateTime
  status      String
  
  // سایرفیلدها بعداً اضافه می‌شوند
  
  createdBy   Int
  creator     User     @relation(fields: [createdBy], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AuditLog {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  action    String
  entity    String
  changes   Json?
  createdAt DateTime @default(now())
}
```

### 3.6 ایجاد Database

```bash
# باز کردن psql (Windows)
# از Start Menu: SQL Shell (psql)

# وارد شدن با:
# Server: localhost
# Database: postgres
# Port: 5432
# Username: postgres
# Password: YOUR_PASSWORD

# سپس:
CREATE DATABASE royaljeans;
\q
```

### 3.7 Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3.8 ساختار Backend

```bash
mkdir -p src/controllers
mkdir -p src/middleware
mkdir -p src/routes
mkdir -p src/services
mkdir -p src/utils
```

### 3.9 Auth Controller

**ایجاد: `src/controllers/auth.controller.js`**

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'این ایمیل قبلاً ثبت شده است' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, fullName, role: 'USER' }
    });
    
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
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ error: 'حساب کاربری غیرفعال است' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
    }
    
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
```

### 3.10 Routes

**ایجاد: `src/routes/auth.routes.js`**

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
```

### 3.11 Main Server

**ایجاد: `src/app.js`**

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'خطای سرور' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
```

### 3.12 package.json Scripts

**ویرایش: `backend/package.json`**

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  }
}
```

### 3.13 اجرای Backend

```bash
npm run dev
```

باید ببینید:
```
✅ Server is running on http://localhost:5000
```

---

## مرحله 4: ایجاد اولین کاربر (2 دقیقه)

### 4.1 با Postman یا cURL

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@royaljeans.com",
    "password": "admin123",
    "fullName": "مدیر سیستم"
  }'
```

### 4.2 یا با Prisma Studio

```bash
# در terminal backend
npx prisma studio
```

باز می‌شود: http://localhost:5555

1. رفتن به `User` model
2. `Add record`
3. وارد کردن:
   - email: admin@royaljeans.com
   - password: (باید hash شود - از register استفاده کنید)
   - fullName: مدیر سیستم
   - role: ADMIN
4. Save

---

## مرحله 5: تست کامل (2 دقیقه)

### 5.1 Backend در حال اجرا

```bash
cd backend
npm run dev
```

### 5.2 Frontend در حال اجرا

```bash
cd frontend
npm run dev
```

### 5.3 تست Login

1. باز کنید: http://localhost:5173
2. Login با:
   - Email: admin@royaljeans.com
   - Password: admin123
3. باید وارد Dashboard شوید

**✅ تبریک! سیستم شما کار می‌کند!**

---

## مراحل بعدی

### فاز 1: تکمیل فرم ثبت کالا (2-3 روز)
- [ ] ایجاد فرم کامل مشابه dialog.html
- [ ] اضافه کردن validation
- [ ] Integration با backend

### فاز 2: لیست و جستجو (1-2 روز)
- [ ] صفحه لیست کالاها
- [ ] جستجوی پیشرفته
- [ ] Pagination

### فاز 3: پیمانکاران (1-2 روز)
- [ ] CRUD پیمانکاران
- [ ] سیستم ارزیابی

### فاز 4: گزارشات (2 روز)
- [ ] گزارش‌های آماری
- [ ] Export به Excel

### فاز 5: پنل ادمین (1-2 روز)
- [ ] مدیریت کاربران
- [ ] Audit logs

---

## مشکلات متداول

### Frontend روی 5173 اجرا نمی‌شود
```bash
# Port را تغییر دهید
npm run dev -- --port 3000
```

### Backend به PostgreSQL وصل نمی‌شود
1. PostgreSQL در حال اجرا است؟
2. Password در `.env` درست است؟
3. Database `royaljeans` ساخته شده؟

### CORS Error
`.env` را بررسی کنید:
```env
CORS_ORIGIN=http://localhost:5173
```

---

## منابع

- **Chakra UI Docs**: https://chakra-ui.com/
- **Prisma Docs**: https://www.prisma.io/docs
- **React Router**: https://reactrouter.com/
- **Zustand**: https://github.com/pmndrs/zustand

---

**موفق باشید! 🚀**

در صورت هر مشکل، مستندات کامل را در `CHAKRA_UI_SETUP.md` و `STANDALONE_APP_PLAN.md` بخوانید.
