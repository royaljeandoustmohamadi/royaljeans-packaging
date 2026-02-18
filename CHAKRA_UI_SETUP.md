# Royal Jeans - Chakra UI Setup Guide
## راهنمای پیاده‌سازی با Chakra UI

---

## 📋 فهرست مطالب

1. [چرا Chakra UI؟](#چرا-chakra-ui)
2. [نصب و راه‌اندازی](#نصب-و-راهاندازی)
3. [تنظیمات RTL و فارسی](#تنظیمات-rtl-و-فارسی)
4. [Theme سفارشی](#theme-سفارشی)
5. [کامپوننت‌های کلیدی](#کامپوننتهای-کلیدی)
6. [صفحات اصلی](#صفحات-اصلی)
7. [مثال‌های کد](#مثالهای-کد)

---

## 1. چرا Chakra UI؟

### مزایا نسبت به Ant Design

#### ✅ Chakra UI
- **RTL Support عالی**: Built-in و بدون مشکل
- **سبک‌تر**: Bundle size کوچکتر (~50KB)
- **Accessible**: ARIA compliance کامل
- **تم‌دهی آسان**: Design tokens system
- **TypeScript**: Type safety کامل
- **Modern**: React 18 compatible
- **Composition**: Component composition بهتر
- **Dark Mode**: Built-in و آسان

#### ⚠️ Ant Design
- RTL support محدود
- Bundle size بزرگ‌تر (~500KB)
- Less flexibility در styling
- Chinese-centric design

### مقایسه Bundle Size

```
Chakra UI:   ~50KB  (gzipped)
Ant Design:  ~500KB (gzipped)
Material-UI: ~300KB (gzipped)
```

**نتیجه**: Chakra UI 10x سبک‌تر!

---

## 2. نصب و راه‌اندازی

### 2.1 ایجاد پروژه React

```bash
# ایجاد پروژه با Vite
npm create vite@latest royaljeans-frontend -- --template react

cd royaljeans-frontend
```

### 2.2 نصب Chakra UI

```bash
# نصب Chakra UI و dependencies
npm install @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion

# نصب کتابخانه‌های اضافی
npm install axios zustand react-hook-form @hookform/resolvers zod
npm install react-router-dom
npm install date-fns date-fns-jalali
npm install react-icons
```

### 2.3 ساختار پروژه

```
royaljeans-frontend/
├── public/
├── src/
│   ├── assets/
│   │   └── fonts/         # فونت‌های فارسی
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Table.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   └── forms/
│   │       ├── OrderForm.jsx
│   │       ├── ContractorForm.jsx
│   │       └── UserForm.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── orders/
│   │   │   ├── OrdersList.jsx
│   │   │   ├── OrderCreate.jsx
│   │   │   ├── OrderEdit.jsx
│   │   │   └── OrderDetail.jsx
│   │   ├── contractors/
│   │   │   ├── ContractorsList.jsx
│   │   │   ├── ContractorForm.jsx
│   │   │   └── ContractorEvaluation.jsx
│   │   ├── admin/
│   │   │   ├── UserManagement.jsx
│   │   │   └── SystemSettings.jsx
│   │   └── reports/
│   │       ├── ReportsList.jsx
│   │       └── ExportData.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   └── orders.service.js
│   ├── store/
│   │   ├── authStore.js
│   │   └── ordersStore.js
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── jalali.js
│   ├── theme/
│   │   ├── index.js
│   │   ├── colors.js
│   │   ├── fonts.js
│   │   └── components.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 3. تنظیمات RTL و فارسی

### 3.1 فایل اصلی (main.jsx)

```jsx
// src/main.jsx
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

### 3.2 فونت فارسی (public/index.html)

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>سیستم مدیریت رویال جینز</title>
  
  <!-- فونت وزیر (توصیه می‌شود) -->
  <link href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" rel="stylesheet" />
  
  <!-- یا فونت ایران سنس -->
  <!-- <link href="https://cdn.jsdelivr.net/gh/rastikerdar/iranyekanwebfont@v3.1.1/fontiran.css" rel="stylesheet" /> -->
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

## 4. Theme سفارشی

### 4.1 Theme اصلی (src/theme/index.js)

```javascript
// src/theme/index.js
import { extendTheme } from '@chakra-ui/react';
import { colors } from './colors';
import { fonts } from './fonts';
import { components } from './components';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const direction = 'rtl';

const theme = extendTheme({
  config,
  direction,
  colors,
  fonts,
  components,
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  // سایه‌ها برای RTL
  shadows: {
    outline: '0 0 0 3px rgba(66, 153, 225, 0.6)',
  },
});

export default theme;
```

### 4.2 رنگ‌ها (src/theme/colors.js)

```javascript
// src/theme/colors.js
export const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',  // رنگ اصلی
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  success: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#4caf50',  // سبز
    600: '#43a047',
    700: '#388e3c',
    800: '#2e7d32',
    900: '#1b5e20',
  },
  warning: {
    50: '#fff8e1',
    100: '#ffecb3',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffca28',
    500: '#ffc107',  // زرد/نارنجی
    600: '#ffb300',
    700: '#ffa000',
    800: '#ff8f00',
    900: '#ff6f00',
  },
  danger: {
    50: '#ffebee',
    100: '#ffcdd2',
    200: '#ef9a9a',
    300: '#e57373',
    400: '#ef5350',
    500: '#f44336',  // قرمز
    600: '#e53935',
    700: '#d32f2f',
    800: '#c62828',
    900: '#b71c1c',
  },
};
```

### 4.3 فونت‌ها (src/theme/fonts.js)

```javascript
// src/theme/fonts.js
export const fonts = {
  heading: `'Vazirmatn', 'IRANYekan', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  body: `'Vazirmatn', 'IRANYekan', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  mono: `'Vazirmatn', 'Courier New', monospace`,
};
```

### 4.4 استایل کامپوننت‌ها (src/theme/components.js)

```javascript
// src/theme/components.js
export const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'lg',
    },
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        color: 'white',
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
        },
      }),
    },
    defaultProps: {
      colorScheme: 'brand',
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: 'brand.500',
    },
    variants: {
      outline: {
        field: {
          borderRadius: 'lg',
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'sm',
        overflow: 'hidden',
      },
    },
  },
  Table: {
    variants: {
      simple: {
        th: {
          textAlign: 'right',
          borderBottom: '2px',
          borderColor: 'gray.200',
          fontWeight: 'bold',
          fontSize: 'sm',
          textTransform: 'none',
        },
        td: {
          textAlign: 'right',
        },
      },
    },
  },
};
```

---

## 5. کامپوننت‌های کلیدی

### 5.1 Layout اصلی

```jsx
// src/components/layout/Layout.jsx
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Flex h="100vh" direction="column">
      <Header />
      
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        
        <Box
          flex="1"
          overflow="auto"
          bg={bgColor}
          p={6}
        >
          {children}
        </Box>
      </Flex>
      
      <Footer />
    </Flex>
  );
}
```

### 5.2 Header

```jsx
// src/components/layout/Header.jsx
import {
  Box,
  Flex,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  HStack,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMoon, FiSun, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={3}
    >
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold" color="brand.500">
          سیستم مدیریت رویال جینز
        </Text>

        <HStack spacing={4}>
          <IconButton
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="تغییر تم"
          />

          <Menu>
            <MenuButton>
              <Avatar size="sm" name={user?.fullName} />
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>
                {user?.fullName}
              </MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={logout}>
                خروج
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}
```

### 5.3 Sidebar

```jsx
// src/components/layout/Sidebar.jsx
import {
  Box,
  VStack,
  Button,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiFileText,
  FiSettings,
} from 'react-icons/fi';

const menuItems = [
  { path: '/', icon: FiHome, label: 'داشبورد' },
  { path: '/orders', icon: FiPackage, label: 'مدیریت کالا' },
  { path: '/contractors', icon: FiUsers, label: 'پیمانکاران' },
  { path: '/reports', icon: FiFileText, label: 'گزارشات' },
  { path: '/admin', icon: FiSettings, label: 'تنظیمات', adminOnly: true },
];

export default function Sidebar() {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      w="250px"
      bg={bgColor}
      borderLeft="1px"
      borderColor={borderColor}
      p={4}
    >
      <VStack spacing={2} align="stretch">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              as={NavLink}
              to={item.path}
              leftIcon={<Icon as={item.icon} />}
              justifyContent="flex-start"
              variant={isActive ? 'solid' : 'ghost'}
              colorScheme={isActive ? 'brand' : 'gray'}
            >
              {item.label}
            </Button>
          );
        })}
      </VStack>
    </Box>
  );
}
```

---

## 6. صفحات اصلی

### 6.1 صفحه Login

```jsx
// src/pages/auth/Login.jsx
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
  useToast,
  Card,
  CardBody,
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
        description: error.message || 'ایمیل یا رمز عبور اشتباه است',
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
                    aria-label="نمایش رمز عبور"
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

### 6.2 Dashboard

```jsx
// src/pages/dashboard/Dashboard.jsx
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Icon,
} from '@chakra-ui/react';
import { FiPackage, FiUsers, FiTrendingUp, FiDollarSign } from 'react-icons/fi';

const stats = [
  {
    label: 'کل سفارشات',
    value: '1,234',
    change: '+12%',
    icon: FiPackage,
    color: 'brand',
  },
  {
    label: 'پیمانکاران فعال',
    value: '45',
    change: '+3',
    icon: FiUsers,
    color: 'success',
  },
  {
    label: 'رشد فروش',
    value: '23%',
    change: '+5%',
    icon: FiTrendingUp,
    color: 'warning',
  },
  {
    label: 'درآمد ماه',
    value: '125M',
    change: '+18%',
    icon: FiDollarSign,
    color: 'purple',
  },
];

export default function Dashboard() {
  return (
    <Box>
      <Heading mb={6}>داشبورد</Heading>

      <Grid templateColumns="repeat(4, 1fr)" gap={6}>
        {stats.map((stat) => (
          <GridItem key={stat.label}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel display="flex" alignItems="center" gap={2}>
                    <Icon as={stat.icon} color={`${stat.color}.500`} />
                    {stat.label}
                  </StatLabel>
                  <StatNumber fontSize="3xl" mt={2}>
                    {stat.value}
                  </StatNumber>
                  <StatHelpText color="green.500">
                    {stat.change}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>

      {/* نمودارها و جداول اضافی در اینجا */}
    </Box>
  );
}
```

### 6.3 فرم ثبت کالا (مشابه dialog.html)

```jsx
// src/pages/orders/OrderCreate.jsx
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
  Heading,
  Select,
  Textarea,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { createOrder } from '../../services/orders.service';

export default function OrderCreate() {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await createOrder(data);
      toast({
        title: 'سفارش با موفقیت ثبت شد',
        status: 'success',
        duration: 3000,
      });
      reset();
    } catch (error) {
      toast({
        title: 'خطا در ثبت سفارش',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Heading mb={6}>ثبت سفارش جدید</Heading>

      <VStack spacing={6} as="form" onSubmit={handleSubmit(onSubmit)}>
        {/* بخش 1: اطلاعات پایه */}
        <Card w="full">
          <CardHeader>
            <Heading size="md">اطلاعات پایه</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>کد کالا</FormLabel>
                  <Input {...register('code')} placeholder="کد کالا" />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>نام کالا</FormLabel>
                  <Input {...register('name')} placeholder="نام کالا" />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>تاریخ</FormLabel>
                  <Input {...register('date')} type="date" />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>تعداد کل</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('totalCount')} />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>تعداد در پک</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('packingCount')} />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>وضعیت</FormLabel>
                  <Select {...register('status')} placeholder="انتخاب کنید">
                    <option value="آماده">آماده</option>
                    <option value="در حال انجام">در حال انجام</option>
                    <option value="تکمیل شده">تکمیل شده</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* بخش 2: نوع و سطح سفارش */}
        <Card w="full">
          <CardHeader>
            <Heading size="md">نوع و سطح سفارش</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>نوع سفارش (BU)</FormLabel>
                  <RadioGroup>
                    <Stack direction="row" spacing={4}>
                      <Radio {...register('bu')} value="رویال جین">
                        رویال جین
                      </Radio>
                      <Radio {...register('bu')} value="رافائل">
                        رافائل
                      </Radio>
                      <Radio {...register('bu')} value="تابوت">
                        تابوت
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>سطح سفارش (BV)</FormLabel>
                  <RadioGroup>
                    <Stack direction="row" spacing={4}>
                      <Radio {...register('bv')} value="نرمال">
                        نرمال
                      </Radio>
                      <Radio {...register('bv')} value="ویژه">
                        ویژه
                      </Radio>
                      <Radio {...register('bv')} value="فوری">
                        فوری
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* بخش 3: سایزبندی */}
        <Card w="full">
          <CardHeader>
            <Heading size="md">سایزبندی</Heading>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>نوع</Th>
                    <Th>30</Th>
                    <Th>31</Th>
                    <Th>32</Th>
                    <Th>33</Th>
                    <Th>34</Th>
                    <Th>36</Th>
                    <Th>38</Th>
                    <Th>40</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {['سالم', 'اقتصادی', 'اقتصادی ۲', 'اقتصادی ۳', 'نمونه', 'استوک'].map((type, idx) => {
                    const prefix = ['s', 'e', 'e2', 'e3', 'n', 'stock'][idx];
                    return (
                      <Tr key={type}>
                        <Td fontWeight="bold">{type}</Td>
                        {[30, 31, 32, 33, 34, 36, 38, 40].map((size) => (
                          <Td key={size}>
                            <NumberInput size="sm" min={0}>
                              <NumberInputField
                                {...register(`size${size}_${prefix}`)}
                                placeholder="0"
                              />
                            </NumberInput>
                          </Td>
                        ))}
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>

        {/* بخش 4: موجودی */}
        <Card w="full">
          <CardHeader>
            <Heading size="md">موجودی و کسری</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>استوک پارچه</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stock_fabric')} />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>استوک شست</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stock_wash')} />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>استوک تولید</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stock_production')} />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>استوک بسته بندی</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stock_packaging')} />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>کسری بسته بندی</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stock_packaging_minus')} />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>تعداد قابل فروش</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('saleable_count')} />
                  </NumberInput>
                </FormControl>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* بخش 5: ملزومات */}
        <Card w="full">
          <CardHeader>
            <Heading size="md">ملزومات</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              {['دکمه', 'پرچ', 'کارت جیب', 'کارت سایز', 'آویز', 'بند', 'چرم'].map((item) => {
                const key = {
                  'دکمه': 'btn',
                  'پرچ': 'perch',
                  'کارت جیب': 'pocketCard',
                  'کارت سایز': 'sizeCard',
                  'آویز': 'hanger',
                  'بند': 'band',
                  'چرم': 'leather',
                }[item];

                return (
                  <GridItem key={item}>
                    <FormControl>
                      <FormLabel>تعداد {item}</FormLabel>
                      <NumberInput min={0}>
                        <NumberInputField {...register(key)} placeholder="0" />
                      </NumberInput>
                    </FormControl>
                  </GridItem>
                );
              })}
            </Grid>
          </CardBody>
        </Card>

        {/* بخش 6: پرسنل */}
        <Card w="full">
          <CardHeader>
            <Heading size="md">پرسنل و توضیحات</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl>
                  <FormLabel>تکمیل کننده</FormLabel>
                  <Input {...register('finisher')} />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>کنترل اولیه</FormLabel>
                  <Input {...register('initialControl')} />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>کنترل کننده</FormLabel>
                  <Input {...register('controller')} />
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl>
                  <FormLabel>توضیحات</FormLabel>
                  <Textarea {...register('description')} rows={3} />
                </FormControl>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* دکمه‌های عملیات */}
        <HStack spacing={4}>
          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            isLoading={loading}
          >
            ذخیره سفارش
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => reset()}
          >
            پاک کردن فرم
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
```

---

## 7. State Management با Zustand

### 7.1 Auth Store

```javascript
// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const res = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password,
          });

          set({
            user: res.data.user,
            token: res.data.token,
            isAuthenticated: true,
          });

          // Set default auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        } catch (error) {
          throw error.response?.data || error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        delete axios.defaults.headers.common['Authorization'];
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### 7.2 Orders Store

```javascript
// src/store/ordersStore.js
import { create } from 'zustand';

export const useOrdersStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),

  updateOrder: (id, updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, ...updatedOrder } : order
      ),
    })),

  deleteOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    })),
}));
```

---

## 8. Routing

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import OrdersList from './pages/orders/OrdersList';
import OrderCreate from './pages/orders/OrderCreate';
import ContractorsList from './pages/contractors/ContractorsList';
import Reports from './pages/reports/ReportsList';
import AdminPanel from './pages/admin/UserManagement';

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
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Layout>
                <OrdersList />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/orders/create"
          element={
            <PrivateRoute>
              <Layout>
                <OrderCreate />
              </Layout>
            </PrivateRoute>
          }
        />
        
        {/* سایر روت‌ها */}
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 9. Vite Config

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

---

## 10. دستورات NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx"
  }
}
```

**شروع توسعه:**
```bash
npm run dev
```

**ساخت نسخه Production:**
```bash
npm run build
```

---

## 11. مزایای Chakra UI در این پروژه

✅ **RTL Support کامل**: بدون نیاز به کانفیگ اضافی
✅ **Accessibility**: WCAG 2.1 compliant
✅ **Dark Mode**: با یک کلیک
✅ **Responsive**: Mobile-first design
✅ **Type Safe**: TypeScript support
✅ **Performance**: Tree-shaking و code-splitting
✅ **Customization**: Theme system قدرتمند
✅ **DX**: Developer experience عالی

---

## 12. Next Steps

1. ✅ نصب Chakra UI
2. ✅ Setup Theme و RTL
3. ✅ ایجاد Layout Components
4. ✅ پیاده‌سازی Authentication
5. ✅ ساخت فرم‌های اصلی
6. ✅ Integration با Backend
7. ✅ Testing و Deployment

---

**موفق باشید! 🚀**

با Chakra UI یک UI زیبا، سریع و accessible خواهید داشت!
