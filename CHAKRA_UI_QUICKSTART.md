# Chakra UI Quick Start Guide
## راهنمای سریع شروع کار با Chakra UI

---

## 🚀 چرا Chakra UI؟

### مزایای Chakra UI برای پروژه Royal Jeans

1. **RTL Support عالی** - پشتیبانی کامل از راست‌چین برای فارسی
2. **Dark Mode Built-in** - حالت تاریک بدون کانفیگ اضافی
3. **Accessibility First** - دسترسی‌پذیری از ابتدا در نظر گرفته شده
4. **Component Composition** - ترکیب‌پذیری بالا و انعطاف‌پذیر
5. **Responsive by Default** - همه چیز از ابتدا واکنش‌گرا است
6. **TypeScript Support** - پشتیبانی کامل از TypeScript
7. **مستندات عالی** - مستندات بسیار کامل و مثال‌های فراوان
8. **Bundle Size کوچک** - سبک‌تر از بسیاری از رقبا
9. **Theming System قدرتمند** - سفارشی‌سازی آسان
10. **Community فعال** - جامعه بزرگ و پشتیبانی خوب

---

## 📦 نصب سریع (5 دقیقه)

### مرحله 1: ایجاد پروژه

```bash
# ایجاد پروژه React با Vite
npm create vite@latest royaljeans-frontend -- --template react
cd royaljeans-frontend
```

### مرحله 2: نصب Chakra UI

```bash
# نصب پکیج‌های اصلی
npm install @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion

# نصب پکیج‌های RTL
npm install @emotion/cache stylis stylis-plugin-rtl

# نصب Router و HTTP Client
npm install react-router-dom axios zustand react-hook-form
```

### مرحله 3: تنظیم Theme و RTL

**فایل: `src/theme.js`**
```javascript
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  direction: 'rtl',
  fonts: {
    body: `'Vazirmatn', sans-serif`,
    heading: `'Vazirmatn', sans-serif`,
  },
  colors: {
    brand: {
      500: '#2196f3',
      600: '#1976d2',
    },
  },
});

export default theme;
```

**فایل: `src/main.jsx`**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtl from 'stylis-plugin-rtl';
import App from './App';
import theme from './theme';

// RTL Cache
const rtlCache = createCache({
  key: 'css-rtl',
  stylisPlugins: [rtl],
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CacheProvider value={rtlCache}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </CacheProvider>
  </React.StrictMode>
);
```

### مرحله 4: اضافه کردن فونت فارسی

**فایل: `index.html`**
```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Royal Jeans - OMS</title>
    
    <!-- Vazirmatn Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## 🎨 مقایسه Syntax

### Button

**Ant Design:**
```jsx
<Button type="primary" loading={loading} onClick={handleClick}>
  کلیک کنید
</Button>
```

**Chakra UI:**
```jsx
<Button colorScheme="brand" isLoading={loading} onClick={handleClick}>
  کلیک کنید
</Button>
```

### Form Input

**Ant Design:**
```jsx
<Form.Item label="نام" name="name" rules={[{ required: true }]}>
  <Input placeholder="نام خود را وارد کنید" />
</Form.Item>
```

**Chakra UI:**
```jsx
<FormControl isRequired>
  <FormLabel>نام</FormLabel>
  <Input placeholder="نام خود را وارد کنید" {...register('name')} />
</FormControl>
```

### Card

**Ant Design:**
```jsx
<Card title="عنوان">
  <p>محتوا</p>
</Card>
```

**Chakra UI:**
```jsx
<Card>
  <CardHeader>
    <Heading size="md">عنوان</Heading>
  </CardHeader>
  <CardBody>
    <Text>محتوا</Text>
  </CardBody>
</Card>
```

### Notification/Toast

**Ant Design:**
```jsx
message.success('عملیات موفق');
message.error('خطا رخ داد');
```

**Chakra UI:**
```jsx
const toast = useToast();

toast({
  title: 'عملیات موفق',
  status: 'success',
  duration: 3000,
  isClosable: true,
});

toast({
  title: 'خطا رخ داد',
  status: 'error',
  duration: 5000,
  isClosable: true,
});
```

---

## 🏗️ ساختار پروژه پیشنهادی

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.jsx      # Layout اصلی با Sidebar
│   │   │   ├── Sidebar.jsx         # منوی کناری
│   │   │   └── Header.jsx          # هدر صفحه
│   │   ├── Common/
│   │   │   ├── Loading.jsx         # کامپوننت لودینگ
│   │   │   └── EmptyState.jsx      # حالت خالی
│   │   └── Forms/
│   │       ├── OrderForm.jsx       # فرم سفارش
│   │       └── ContractorForm.jsx  # فرم پیمانکار
│   ├── pages/
│   │   ├── Login.jsx               # صفحه ورود
│   │   ├── Dashboard.jsx           # داشبورد
│   │   ├── Orders/
│   │   │   ├── OrdersList.jsx      # لیست سفارشات
│   │   │   ├── OrderForm.jsx       # فرم جدید/ویرایش
│   │   │   └── OrderDetail.jsx     # جزئیات سفارش
│   │   ├── Contractors/
│   │   │   ├── ContractorsList.jsx
│   │   │   └── ContractorEval.jsx  # ارزیابی پیمانکار
│   │   └── Reports/
│   │       └── ReportsList.jsx     # گزارشات
│   ├── services/
│   │   ├── api.js                  # Axios config
│   │   ├── auth.service.js         # سرویس احراز هویت
│   │   └── orders.service.js       # سرویس سفارشات
│   ├── store/
│   │   ├── authStore.js            # Zustand store برای Auth
│   │   └── ordersStore.js          # Zustand store برای Orders
│   ├── utils/
│   │   ├── constants.js            # ثابت‌ها
│   │   └── helpers.js              # توابع کمکی
│   ├── theme.js                    # تنظیمات Theme
│   ├── App.jsx                     # کامپوننت اصلی
│   └── main.jsx                    # Entry point
├── public/
│   └── logo.png
├── package.json
└── vite.config.js
```

---

## 🎯 Component های پرکاربرد

### 1. Layout Components

```jsx
import { Box, Flex, Container, Stack, HStack, VStack } from '@chakra-ui/react';

// Box - مثل div اما با قابلیت‌های styling
<Box bg="gray.50" p={4} borderRadius="lg">
  محتوا
</Box>

// Flex - برای Flexbox
<Flex justify="space-between" align="center">
  <Box>چپ</Box>
  <Box>راست</Box>
</Flex>

// Stack - برای چیدن عمودی یا افقی
<Stack spacing={4} direction="row">
  <Box>1</Box>
  <Box>2</Box>
  <Box>3</Box>
</Stack>

// Container - برای محدود کردن عرض
<Container maxW="container.xl">
  محتوای اصلی
</Container>
```

### 2. Typography

```jsx
import { Heading, Text } from '@chakra-ui/react';

<Heading size="lg">عنوان بزرگ</Heading>
<Heading size="md">عنوان متوسط</Heading>
<Heading size="sm">عنوان کوچک</Heading>

<Text fontSize="lg" fontWeight="bold" color="brand.600">
  متن با استایل
</Text>
```

### 3. Form Elements

```jsx
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Textarea,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
} from '@chakra-ui/react';

// Input ساده
<FormControl isRequired isInvalid={error}>
  <FormLabel>نام</FormLabel>
  <Input placeholder="نام خود را وارد کنید" />
  <FormErrorMessage>نام الزامی است</FormErrorMessage>
</FormControl>

// Select
<Select placeholder="انتخاب کنید">
  <option value="1">گزینه ۱</option>
  <option value="2">گزینه ۲</option>
</Select>

// Number Input
<NumberInput min={0} max={100} defaultValue={0}>
  <NumberInputField />
</NumberInput>

// Textarea
<Textarea placeholder="توضیحات..." rows={4} />

// Checkbox
<Checkbox defaultChecked>موافقم</Checkbox>

// Radio Group
<RadioGroup defaultValue="1">
  <Stack>
    <Radio value="1">گزینه ۱</Radio>
    <Radio value="2">گزینه ۲</Radio>
  </Stack>
</RadioGroup>

// Switch
<Switch colorScheme="brand">فعال/غیرفعال</Switch>
```

### 4. Buttons

```jsx
import { Button, IconButton, ButtonGroup } from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

// Button عادی
<Button colorScheme="brand">کلیک کنید</Button>

// با آیکون
<Button leftIcon={<AddIcon />} colorScheme="brand">
  افزودن
</Button>

// Loading state
<Button isLoading loadingText="در حال بارگذاری...">
  ارسال
</Button>

// Icon Button
<IconButton icon={<EditIcon />} aria-label="ویرایش" />

// Button Group
<ButtonGroup spacing={2}>
  <Button colorScheme="brand">ذخیره</Button>
  <Button variant="outline">لغو</Button>
</ButtonGroup>
```

### 5. Table

```jsx
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

<TableContainer>
  <Table variant="simple">
    <Thead bg="gray.50">
      <Tr>
        <Th>کد</Th>
        <Th>نام</Th>
        <Th>عملیات</Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr>
        <Td>001</Td>
        <Td>محصول ۱</Td>
        <Td>
          <IconButton icon={<EditIcon />} size="sm" />
        </Td>
      </Tr>
    </Tbody>
  </Table>
</TableContainer>
```

### 6. Modal/Dialog

```jsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

function Example() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <>
      <Button onClick={onOpen}>باز کردن</Button>
      
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>عنوان</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            محتوای مودال
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>بستن</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

### 7. Toast (Notification)

```jsx
import { useToast } from '@chakra-ui/react';

function Example() {
  const toast = useToast();
  
  const showSuccess = () => {
    toast({
      title: 'موفقیت',
      description: 'عملیات با موفقیت انجام شد',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };
  
  const showError = () => {
    toast({
      title: 'خطا',
      description: 'مشکلی پیش آمده',
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top',
    });
  };
  
  return (
    <Stack>
      <Button onClick={showSuccess}>Success</Button>
      <Button onClick={showError}>Error</Button>
    </Stack>
  );
}
```

---

## 🌓 Dark Mode

### تنظیم Dark Mode

```jsx
import { useColorMode, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

function DarkModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  
  return (
    <IconButton
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={toggleColorMode}
      aria-label="Toggle dark mode"
    />
  );
}
```

### استفاده از رنگ‌های Dynamic

```jsx
import { useColorModeValue, Box } from '@chakra-ui/react';

function Example() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Box bg={bgColor} color={textColor} p={4}>
      این رنگ بسته به حالت تم تغییر می‌کند
    </Box>
  );
}
```

---

## 📱 Responsive Design

### Breakpoints

```javascript
// Chakra UI breakpoints
{
  base: '0px',    // Mobile
  sm: '480px',    // Small mobile
  md: '768px',    // Tablet
  lg: '992px',    // Laptop
  xl: '1280px',   // Desktop
  '2xl': '1536px' // Large desktop
}
```

### استفاده از Responsive Values

```jsx
<Box
  w={{ base: '100%', md: '50%', lg: '33%' }}
  p={{ base: 4, md: 6, lg: 8 }}
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
>
  محتوا
</Box>

// Grid responsive
<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
  <Box>1</Box>
  <Box>2</Box>
  <Box>3</Box>
</SimpleGrid>
```

---

## 🔗 منابع مفید

### مستندات رسمی
- **اصلی**: https://chakra-ui.com/
- **Components**: https://chakra-ui.com/docs/components
- **Styling**: https://chakra-ui.com/docs/styled-system
- **RTL Support**: https://chakra-ui.com/docs/styled-system/rtl-support

### آموزش‌ها
- **YouTube**: جستجوی "Chakra UI Tutorial"
- **GitHub**: https://github.com/chakra-ui/chakra-ui
- **Discord**: جامعه فعال برای سوالات

### مثال‌های آماده
- **Templates**: https://chakra-templates.dev/
- **Pro Components**: https://pro.chakra-ui.com/

---

## ✅ Checklist شروع پروژه

- [ ] نصب Chakra UI و dependencies
- [ ] تنظیم RTL Support
- [ ] اضافه کردن فونت فارسی
- [ ] ایجاد Theme سفارشی
- [ ] ساخت Layout اصلی (Header + Sidebar)
- [ ] پیاده‌سازی صفحه Login
- [ ] پیاده‌سازی Dashboard
- [ ] ساخت فرم‌های اصلی
- [ ] تست Dark Mode
- [ ] تست Responsive Design

---

## 🎉 آماده هستید!

با این راهنما می‌توانید سریع با Chakra UI شروع کنید. برای مثال‌های کامل‌تر، فایل `CHAKRA_UI_EXAMPLES.md` را مطالعه کنید.

**موفق باشید! 🚀**
