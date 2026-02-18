# Royal Jeans - RTL & Jalali Date Guide
## راهنمای کامل RTL و تاریخ شمسی (جلالی)

---

## 📋 فهرست مطالب

1. [RTL Setup](#rtl-setup)
2. [تاریخ شمسی (جلالی)](#تاریخ-شمسی-جلالی)
3. [کامپوننت DatePicker فارسی](#کامپوننت-datepicker-فارسی)
4. [تبدیل تاریخ](#تبدیل-تاریخ)
5. [نمایش تاریخ](#نمایش-تاریخ)
6. [Integration با Backend](#integration-با-backend)

---

## 1. RTL Setup

### 1.1 Chakra UI RTL Configuration

Chakra UI پشتیبانی عالی از RTL دارد و فقط کافی است در Theme مشخص کنید:

**فایل: `src/theme/index.js`**

```javascript
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// مهم: direction را rtl قرار دهید
const direction = 'rtl';

const theme = extendTheme({
  config,
  direction, // RTL برای فارسی
  colors: {
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
  },
  fonts: {
    heading: `'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body: `'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
  },
});

export default theme;
```

### 1.2 HTML Setup

**فایل: `index.html`**

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>سیستم مدیریت رویال جینز</title>
  
  <!-- فونت وزیر (بهترین فونت فارسی) -->
  <link 
    href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css" 
    rel="stylesheet" 
  />
  
  <style>
    * {
      font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 1.3 CSS Global Styles (اختیاری)

اگر نیاز به استایل‌های سفارشی دارید:

**فایل: `src/index.css`**

```css
/* RTL Support */
* {
  direction: rtl;
  text-align: right;
}

/* فونت فارسی */
body {
  font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* اصلاح scroll bar برای RTL */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Input number - حذف فلش‌ها */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
```

---

## 2. تاریخ شمسی (جلالی)

### 2.1 نصب کتابخانه‌های تاریخ

```bash
npm install date-fns-jalali
npm install react-modern-calendar-datepicker
npm install jalaali-js
```

**توضیح کتابخانه‌ها:**
- **date-fns-jalali**: تبدیل و فرمت تاریخ شمسی
- **react-modern-calendar-datepicker**: DatePicker فارسی زیبا
- **jalaali-js**: تبدیل میلادی ↔ شمسی

### 2.2 Utility Functions

**فایل: `src/utils/jalali.js`**

```javascript
import jalaali from 'jalaali-js';

/**
 * تبدیل تاریخ میلادی به شمسی
 * @param {Date|string} date - تاریخ میلادی
 * @returns {string} - تاریخ شمسی به فرمت YYYY/MM/DD
 */
export function toJalali(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const jDate = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  
  return `${jDate.jy}/${String(jDate.jm).padStart(2, '0')}/${String(jDate.jd).padStart(2, '0')}`;
}

/**
 * تبدیل تاریخ شمسی به میلادی
 * @param {string} jalaliDate - تاریخ شمسی (YYYY/MM/DD)
 * @returns {Date} - تاریخ میلادی
 */
export function toGregorian(jalaliDate) {
  if (!jalaliDate) return null;
  
  const parts = jalaliDate.split('/');
  if (parts.length !== 3) return null;
  
  const jy = parseInt(parts[0]);
  const jm = parseInt(parts[1]);
  const jd = parseInt(parts[2]);
  
  const gDate = jalaali.toGregorian(jy, jm, jd);
  return new Date(gDate.gy, gDate.gm - 1, gDate.gd);
}

/**
 * دریافت تاریخ امروز به شمسی
 * @returns {string} - تاریخ امروز به شمسی
 */
export function getTodayJalali() {
  return toJalali(new Date());
}

/**
 * فرمت کردن تاریخ شمسی با نام ماه
 * @param {string} jalaliDate - تاریخ شمسی
 * @returns {string} - مثلاً: "15 فروردین 1403"
 */
export function formatJalaliLong(jalaliDate) {
  if (!jalaliDate) return '';
  
  const monthNames = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];
  
  const parts = jalaliDate.split('/');
  if (parts.length !== 3) return jalaliDate;
  
  const year = parts[0];
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  
  return `${day} ${monthNames[month - 1]} ${year}`;
}

/**
 * تبدیل اعداد انگلیسی به فارسی
 * @param {string} str - رشته با اعداد انگلیسی
 * @returns {string} - رشته با اعداد فارسی
 */
export function toPersianNumbers(str) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/\d/g, (digit) => persianDigits[digit]);
}

/**
 * اعتبارسنجی تاریخ شمسی
 * @param {string} jalaliDate - تاریخ شمسی (YYYY/MM/DD)
 * @returns {boolean} - معتبر یا نه
 */
export function isValidJalaliDate(jalaliDate) {
  if (!jalaliDate) return false;
  
  const parts = jalaliDate.split('/');
  if (parts.length !== 3) return false;
  
  const jy = parseInt(parts[0]);
  const jm = parseInt(parts[1]);
  const jd = parseInt(parts[2]);
  
  if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return false;
  if (jm < 1 || jm > 12) return false;
  if (jd < 1 || jd > 31) return false;
  
  try {
    jalaali.toGregorian(jy, jm, jd);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * محاسبه اختلاف دو تاریخ شمسی (به روز)
 * @param {string} date1 - تاریخ اول
 * @param {string} date2 - تاریخ دوم
 * @returns {number} - تعداد روزهای بین دو تاریخ
 */
export function daysBetweenJalali(date1, date2) {
  const gDate1 = toGregorian(date1);
  const gDate2 = toGregorian(date2);
  
  if (!gDate1 || !gDate2) return 0;
  
  const diffTime = Math.abs(gDate2 - gDate1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
```

---

## 3. کامپوننت DatePicker فارسی

### 3.1 DatePicker با react-modern-calendar-datepicker

**فایل: `src/components/common/JalaliDatePicker.jsx`**

```jsx
import { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  HStack,
} from '@chakra-ui/react';
import { Calendar } from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { toJalali, toGregorian, formatJalaliLong } from '../../utils/jalali';
import jalaali from 'jalaali-js';

export default function JalaliDatePicker({
  value,
  onChange,
  label,
  placeholder = 'تاریخ را انتخاب کنید',
  isRequired = false,
  isDisabled = false,
  minDate = null,
  maxDate = null,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDay, setSelectedDay] = useState(null);
  const [displayValue, setDisplayValue] = useState('');

  // تبدیل value به فرمت calendar
  useEffect(() => {
    if (value) {
      const jalaliDate = toJalali(value);
      const parts = jalaliDate.split('/');
      
      setSelectedDay({
        year: parseInt(parts[0]),
        month: parseInt(parts[1]),
        day: parseInt(parts[2]),
      });
      
      setDisplayValue(formatJalaliLong(jalaliDate));
    } else {
      setSelectedDay(null);
      setDisplayValue('');
    }
  }, [value]);

  const handleDaySelect = (day) => {
    if (!day) {
      setSelectedDay(null);
      setDisplayValue('');
      onChange?.(null);
      return;
    }

    setSelectedDay(day);
    
    const jalaliDate = `${day.year}/${String(day.month).padStart(2, '0')}/${String(day.day).padStart(2, '0')}`;
    const gregorianDate = toGregorian(jalaliDate);
    
    setDisplayValue(formatJalaliLong(jalaliDate));
    onChange?.(gregorianDate);
    onClose();
  };

  const handleClear = () => {
    setSelectedDay(null);
    setDisplayValue('');
    onChange?.(null);
  };

  // تبدیل minDate و maxDate به فرمت calendar
  const getCalendarMinDate = () => {
    if (!minDate) return null;
    const jalaliDate = toJalali(minDate);
    const parts = jalaliDate.split('/');
    return {
      year: parseInt(parts[0]),
      month: parseInt(parts[1]),
      day: parseInt(parts[2]),
    };
  };

  const getCalendarMaxDate = () => {
    if (!maxDate) return null;
    const jalaliDate = toJalali(maxDate);
    const parts = jalaliDate.split('/');
    return {
      year: parseInt(parts[0]),
      month: parseInt(parts[1]),
      day: parseInt(parts[2]),
    };
  };

  return (
    <FormControl isRequired={isRequired} isDisabled={isDisabled}>
      {label && <FormLabel>{label}</FormLabel>}
      
      <HStack>
        <Input
          value={displayValue}
          placeholder={placeholder}
          onClick={onOpen}
          readOnly
          cursor="pointer"
          _hover={{ borderColor: 'brand.500' }}
        />
        {displayValue && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={handleClear}
          >
            پاک کردن
          </Button>
        )}
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>انتخاب تاریخ</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box dir="rtl">
              <Calendar
                value={selectedDay}
                onChange={handleDaySelect}
                locale="fa"
                shouldHighlightWeekends
                minimumDate={getCalendarMinDate()}
                maximumDate={getCalendarMaxDate()}
                colorPrimary="#2196f3"
                calendarClassName="custom-calendar"
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormControl>
  );
}
```

### 3.2 استایل سفارشی برای Calendar

**فایل: `src/components/common/JalaliDatePicker.css`**

```css
/* استایل‌های سفارشی برای تقویم فارسی */
.custom-calendar {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  font-family: 'Vazirmatn', sans-serif;
  direction: rtl;
}

.custom-calendar .Calendar__day {
  font-size: 14px;
}

.custom-calendar .Calendar__day.-weekend {
  color: #e53935;
}

.custom-calendar .Calendar__day.-selected,
.custom-calendar .Calendar__day.-selectedStart,
.custom-calendar .Calendar__day.-selectedEnd {
  background-color: #2196f3;
  color: white;
}

.custom-calendar .Calendar__day:hover {
  background-color: #e3f2fd;
}

.custom-calendar .Calendar__monthYear {
  font-size: 16px;
  font-weight: bold;
}

.custom-calendar .Calendar__weekDays {
  font-size: 12px;
  font-weight: 600;
}
```

### 3.3 استفاده از JalaliDatePicker

```jsx
import JalaliDatePicker from '../components/common/JalaliDatePicker';

function OrderForm() {
  const [orderDate, setOrderDate] = useState(new Date());

  return (
    <JalaliDatePicker
      label="تاریخ سفارش"
      value={orderDate}
      onChange={setOrderDate}
      isRequired
    />
  );
}
```

---

## 4. تبدیل تاریخ

### 4.1 Input ساده با تبدیل خودکار

**فایل: `src/components/common/JalaliInput.jsx`**

```jsx
import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react';
import { toJalali, toGregorian, isValidJalaliDate } from '../../utils/jalali';

export default function JalaliInput({
  value,
  onChange,
  label,
  placeholder = 'YYYY/MM/DD',
  isRequired = false,
}) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    // بررسی فرمت
    if (!val) {
      setError('');
      onChange?.(null);
      return;
    }

    // اعتبارسنجی
    if (!isValidJalaliDate(val)) {
      setError('فرمت تاریخ صحیح نیست. مثال: 1403/01/15');
      return;
    }

    setError('');
    const gregorianDate = toGregorian(val);
    onChange?.(gregorianDate);
  };

  return (
    <FormControl isRequired={isRequired} isInvalid={!!error}>
      {label && <FormLabel>{label}</FormLabel>}
      <Input
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        dir="ltr"
        textAlign="right"
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
```

---

## 5. نمایش تاریخ

### 5.1 کامپوننت نمایش تاریخ

**فایل: `src/components/common/JalaliDateDisplay.jsx`**

```jsx
import { Text } from '@chakra-ui/react';
import { toJalali, formatJalaliLong, toPersianNumbers } from '../../utils/jalali';

export default function JalaliDateDisplay({
  date,
  format = 'long', // 'long' or 'short'
  showPersianDigits = true,
  ...props
}) {
  if (!date) return <Text {...props}>-</Text>;

  let displayDate;
  
  if (format === 'long') {
    displayDate = formatJalaliLong(toJalali(date));
  } else {
    displayDate = toJalali(date);
  }

  if (showPersianDigits) {
    displayDate = toPersianNumbers(displayDate);
  }

  return <Text {...props}>{displayDate}</Text>;
}
```

### 5.2 استفاده

```jsx
import JalaliDateDisplay from '../components/common/JalaliDateDisplay';

function OrderCard({ order }) {
  return (
    <Card>
      <CardBody>
        <Heading size="md">{order.name}</Heading>
        
        {/* نمایش کوتاه */}
        <JalaliDateDisplay 
          date={order.date} 
          format="short"
          fontSize="sm"
          color="gray.600"
        />
        
        {/* نمایش کامل */}
        <JalaliDateDisplay 
          date={order.date} 
          format="long"
          fontWeight="bold"
        />
      </CardBody>
    </Card>
  );
}
```

---

## 6. Integration با Backend

### 6.1 ارسال تاریخ به Backend

Backend معمولاً تاریخ میلادی (ISO format) می‌خواهد:

```javascript
// Frontend
import { toGregorian } from '../utils/jalali';

async function createOrder(formData) {
  // تبدیل تاریخ شمسی به میلادی
  const orderDate = toGregorian(formData.jalaliDate);
  
  const payload = {
    ...formData,
    date: orderDate.toISOString(), // ارسال به فرمت ISO
  };
  
  await axios.post('/api/orders', payload);
}
```

### 6.2 دریافت تاریخ از Backend

```javascript
// Frontend
import { toJalali } from '../utils/jalali';

async function fetchOrders() {
  const response = await axios.get('/api/orders');
  
  // تبدیل تاریخ‌های میلادی به شمسی برای نمایش
  const orders = response.data.orders.map(order => ({
    ...order,
    jalaliDate: toJalali(order.date),
  }));
  
  return orders;
}
```

### 6.3 Backend (Node.js) - ذخیره و بازیابی

```javascript
// Backend - controllers/orders.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createOrder = async (req, res) => {
  try {
    const { date, ...otherData } = req.body;
    
    // تاریخ به فرمت ISO از frontend می‌آید
    const order = await prisma.order.create({
      data: {
        ...otherData,
        date: new Date(date), // تبدیل string به Date
        createdBy: req.user.id,
      }
    });
    
    res.json({ ok: true, order });
  } catch (error) {
    res.status(500).json({ error: 'خطا در ثبت سفارش' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { date: 'desc' }
    });
    
    // تاریخ‌ها به فرمت ISO برمی‌گردند
    // Frontend آن‌ها را به شمسی تبدیل می‌کند
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت سفارشات' });
  }
};
```

---

## 7. مثال کامل: فرم با DatePicker

**فایل: `src/pages/orders/OrderCreate.jsx`**

```jsx
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
  VStack,
  useToast,
} from '@chakra-ui/react';
import JalaliDatePicker from '../../components/common/JalaliDatePicker';
import { toJalali } from '../../utils/jalali';
import axios from 'axios';

export default function OrderCreate() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    date: new Date(),
    status: 'آماده',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ارسال تاریخ به فرمت ISO
      await axios.post('/api/orders', {
        ...formData,
        date: formData.date.toISOString(),
      });

      toast({
        title: 'سفارش با موفقیت ثبت شد',
        status: 'success',
        duration: 3000,
      });

      // Reset form
      setFormData({
        code: '',
        name: '',
        date: new Date(),
        status: 'آماده',
      });
    } catch (error) {
      toast({
        title: 'خطا در ثبت سفارش',
        description: error.response?.data?.error || 'لطفاً دوباره تلاش کنید',
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

      <Card>
        <CardHeader>
          <Heading size="md">اطلاعات پایه</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>کد کالا</FormLabel>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="کد کالا"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>نام کالا</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="نام کالا"
                  />
                </FormControl>
              </GridItem>

              <GridItem>
                {/* DatePicker شمسی */}
                <JalaliDatePicker
                  label="تاریخ"
                  value={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                  isRequired
                />
              </GridItem>
            </Grid>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              isLoading={loading}
            >
              ذخیره سفارش
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
}
```

---

## 8. فیلتر تاریخ در لیست‌ها

**فایل: `src/pages/orders/OrdersList.jsx`**

```jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from '@chakra-ui/react';
import JalaliDatePicker from '../../components/common/JalaliDatePicker';
import JalaliDateDisplay from '../../components/common/JalaliDateDisplay';
import axios from 'axios';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    dateFrom: null,
    dateTo: null,
  });

  const fetchOrders = async () => {
    try {
      const params = {};
      
      // اضافه کردن فیلترهای تاریخ
      if (filters.dateFrom) {
        params.dateFrom = filters.dateFrom.toISOString();
      }
      if (filters.dateTo) {
        params.dateTo = filters.dateTo.toISOString();
      }

      const response = await axios.get('/api/orders', { params });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  return (
    <Box>
      <Heading mb={6}>لیست سفارشات</Heading>

      {/* فیلترها */}
      <HStack spacing={4} mb={6}>
        <JalaliDatePicker
          label="از تاریخ"
          value={filters.dateFrom}
          onChange={(date) => setFilters({ ...filters, dateFrom: date })}
        />
        <JalaliDatePicker
          label="تا تاریخ"
          value={filters.dateTo}
          onChange={(date) => setFilters({ ...filters, dateTo: date })}
        />
        <Button onClick={() => setFilters({ dateFrom: null, dateTo: null })}>
          پاک کردن فیلترها
        </Button>
      </HStack>

      {/* جدول */}
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>کد کالا</Th>
            <Th>نام کالا</Th>
            <Th>تاریخ</Th>
            <Th>وضعیت</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Td>{order.code}</Td>
              <Td>{order.name}</Td>
              <Td>
                <JalaliDateDisplay date={order.date} format="long" />
              </Td>
              <Td>{order.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
```

---

## 9. تست و Validation

### 9.1 تست توابع تبدیل

**فایل: `src/utils/jalali.test.js`**

```javascript
import { toJalali, toGregorian, isValidJalaliDate } from './jalali';

describe('Jalali Utils', () => {
  test('toJalali converts correctly', () => {
    const date = new Date('2024-03-20');
    expect(toJalali(date)).toBe('1403/01/01'); // نوروز 1403
  });

  test('toGregorian converts correctly', () => {
    const date = toGregorian('1403/01/01');
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(2); // March (0-indexed)
    expect(date.getDate()).toBe(20);
  });

  test('isValidJalaliDate validates correctly', () => {
    expect(isValidJalaliDate('1403/01/15')).toBe(true);
    expect(isValidJalaliDate('1403/13/01')).toBe(false);
    expect(isValidJalaliDate('invalid')).toBe(false);
  });
});
```

---

## 10. چک‌لیست پیاده‌سازی

### ✅ RTL
- [x] تنظیم `direction: rtl` در Chakra theme
- [x] تنظیم `dir="rtl"` در HTML
- [x] تنظیم `lang="fa"` در HTML
- [x] اضافه کردن فونت فارسی (Vazirmatn)
- [x] تست تمام صفحات

### ✅ تاریخ شمسی
- [x] نصب کتابخانه‌های تاریخ
- [x] ایجاد utility functions
- [x] ساخت JalaliDatePicker component
- [x] ساخت JalaliDateDisplay component
- [x] Integration با Backend
- [x] تست تبدیل تاریخ‌ها

### ✅ کامپوننت‌ها
- [x] JalaliDatePicker برای انتخاب تاریخ
- [x] JalaliInput برای ورود دستی
- [x] JalaliDateDisplay برای نمایش
- [x] فیلترهای تاریخ در لیست‌ها

---

## 11. مشکلات متداول و راه‌حل

### مشکل 1: Calendar به چپ نمایش داده می‌شود
**راه‌حل:**
```jsx
<Box dir="rtl">
  <Calendar locale="fa" {...props} />
</Box>
```

### مشکل 2: اعداد انگلیسی نمایش داده می‌شوند
**راه‌حل:**
```javascript
import { toPersianNumbers } from '../utils/jalali';

const display = toPersianNumbers('1403/01/15');
// نتیجه: ۱۴۰۳/۰۱/۱۵
```

### مشکل 3: تاریخ در Backend اشتباه ذخیره می‌شود
**راه‌حل:**
```javascript
// همیشه به فرمت ISO ارسال کنید
date: formData.date.toISOString()

// Backend
date: new Date(req.body.date)
```

---

## 12. منابع

- **jalaali-js**: https://github.com/jalaali/jalaali-js
- **react-modern-calendar-datepicker**: https://github.com/Kiarash-Z/react-modern-calendar-datepicker
- **Chakra UI RTL**: https://chakra-ui.com/docs/styled-system/rtl-support
- **فونت وزیر**: https://github.com/rastikerdar/vazirmatn

---

**✅ با این راهنما، سیستم شما کاملاً RTL و با تاریخ شمسی کار می‌کند!**

برای شروع:
1. نصب کتابخانه‌ها
2. کپی کردن utility functions
3. استفاده از JalaliDatePicker
4. تست و لذت ببرید! 🎉
