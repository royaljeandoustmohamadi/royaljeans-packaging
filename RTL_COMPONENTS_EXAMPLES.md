# Royal Jeans - RTL Components Examples
## مثال‌های کامل کامپوننت‌های RTL و تاریخ شمسی

---

## 📦 فایل‌های آماده برای استفاده

### 1. Utility Functions

**فایل: `src/utils/jalali.js`**

```javascript
import jalaali from 'jalaali-js';

/**
 * تبدیل تاریخ میلادی به شمسی
 */
export function toJalali(date) {
  if (!date) return '';
  const d = new Date(date);
  const jDate = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${jDate.jy}/${String(jDate.jm).padStart(2, '0')}/${String(jDate.jd).padStart(2, '0')}`;
}

/**
 * تبدیل تاریخ شمسی به میلادی
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
 * دریافت تاریخ امروز
 */
export function getTodayJalali() {
  return toJalali(new Date());
}

/**
 * فرمت کردن با نام ماه
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
 * تبدیل اعداد به فارسی
 */
export function toPersianNumbers(str) {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/\d/g, (digit) => persianDigits[digit]);
}

/**
 * اعتبارسنجی تاریخ
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
```

---

### 2. JalaliDatePicker Component

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

export default function JalaliDatePicker({
  value,
  onChange,
  label,
  placeholder = 'تاریخ را انتخاب کنید',
  isRequired = false,
  isDisabled = false,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDay, setSelectedDay] = useState(null);
  const [displayValue, setDisplayValue] = useState('');

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
        />
        {displayValue && (
          <Button size="sm" variant="ghost" colorScheme="red" onClick={handleClear}>
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
                colorPrimary="#2196f3"
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </FormControl>
  );
}
```

---

### 3. JalaliDateDisplay Component

**فایل: `src/components/common/JalaliDateDisplay.jsx`**

```jsx
import { Text } from '@chakra-ui/react';
import { toJalali, formatJalaliLong, toPersianNumbers } from '../../utils/jalali';

export default function JalaliDateDisplay({
  date,
  format = 'long',
  showPersianDigits = false,
  ...props
}) {
  if (!date) return <Text {...props}>-</Text>;

  let displayDate = format === 'long' 
    ? formatJalaliLong(toJalali(date))
    : toJalali(date);

  if (showPersianDigits) {
    displayDate = toPersianNumbers(displayDate);
  }

  return <Text {...props}>{displayDate}</Text>;
}
```

---

### 4. فرم کامل با DatePicker

**فایل: `src/pages/orders/OrderForm.jsx`**

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
  Select,
  Grid,
  GridItem,
  Heading,
  VStack,
  HStack,
  NumberInput,
  NumberInputField,
  useToast,
} from '@chakra-ui/react';
import JalaliDatePicker from '../../components/common/JalaliDatePicker';
import { getTodayJalali } from '../../utils/jalali';
import axios from 'axios';

export default function OrderForm() {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    date: new Date(),
    status: 'آماده',
    totalCount: '',
    packingCount: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          ...formData,
          date: formData.date.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
        totalCount: '',
        packingCount: '',
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

      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Card w="full">
          <CardHeader>
            <Heading size="md">اطلاعات پایه</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
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
                  label="تاریخ *"
                  value={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                  isRequired
                />
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>تعداد کل</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      value={formData.totalCount}
                      onChange={(e) =>
                        setFormData({ ...formData, totalCount: e.target.value })
                      }
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl>
                  <FormLabel>تعداد در پک</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      value={formData.packingCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          packingCount: e.target.value,
                        })
                      }
                    />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem>
                <FormControl isRequired>
                  <FormLabel>وضعیت</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="آماده">آماده</option>
                    <option value="در حال انجام">در حال انجام</option>
                    <option value="تکمیل شده">تکمیل شده</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        <HStack spacing={4}>
          <Button type="submit" colorScheme="brand" size="lg" isLoading={loading}>
            ذخیره سفارش
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() =>
              setFormData({
                code: '',
                name: '',
                date: new Date(),
                status: 'آماده',
                totalCount: '',
                packingCount: '',
              })
            }
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

### 5. لیست با فیلتر تاریخ

**فایل: `src/pages/orders/OrdersList.jsx`**

```jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Card,
  CardBody,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import JalaliDatePicker from '../../components/common/JalaliDatePicker';
import JalaliDateDisplay from '../../components/common/JalaliDateDisplay';
import axios from 'axios';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: null,
    dateTo: null,
    status: '',
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = {};

      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom.toISOString();
      if (filters.dateTo) params.dateTo = filters.dateTo.toISOString();

      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateFrom: null,
      dateTo: null,
      status: '',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'آماده': 'gray',
      'در حال انجام': 'blue',
      'تکمیل شده': 'green',
    };
    return colors[status] || 'gray';
  };

  return (
    <Box>
      <Heading mb={6}>لیست سفارشات</Heading>

      {/* فیلترها */}
      <Card mb={6}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <Box flex={1}>
                <InputGroup>
                  <Input
                    placeholder="جستجو بر اساس کد یا نام..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                  <InputRightElement>
                    <IconButton
                      icon={<FiSearch />}
                      variant="ghost"
                      aria-label="جستجو"
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>

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

              <Button
                leftIcon={<FiFilter />}
                variant="outline"
                onClick={handleClearFilters}
              >
                پاک کردن فیلترها
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* جدول */}
      <Card>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>کد کالا</Th>
                <Th>نام کالا</Th>
                <Th>تاریخ</Th>
                <Th>تعداد</Th>
                <Th>وضعیت</Th>
                <Th>عملیات</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    در حال بارگذاری...
                  </Td>
                </Tr>
              ) : orders.length === 0 ? (
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    سفارشی یافت نشد
                  </Td>
                </Tr>
              ) : (
                orders.map((order) => (
                  <Tr key={order.id}>
                    <Td fontWeight="bold">{order.code}</Td>
                    <Td>{order.name}</Td>
                    <Td>
                      <JalaliDateDisplay
                        date={order.date}
                        format="long"
                        fontSize="sm"
                      />
                    </Td>
                    <Td>{order.totalCount || '-'}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size="sm" colorScheme="blue">
                          مشاهده
                        </Button>
                        <Button size="sm" variant="outline">
                          ویرایش
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
}
```

---

### 6. استایل CSS برای Calendar

**فایل: `src/index.css`** (اضافه کنید)

```css
/* تقویم فارسی */
.Calendar {
  font-family: 'Vazirmatn', sans-serif;
  direction: rtl;
}

.Calendar__day.-weekend {
  color: #e53935 !important;
}

.Calendar__day.-selected,
.Calendar__day.-selectedStart,
.Calendar__day.-selectedEnd {
  background-color: #2196f3 !important;
  color: white !important;
}

.Calendar__day:hover {
  background-color: #e3f2fd !important;
}

/* RTL برای input ها */
input[type='text'],
input[type='email'],
input[type='password'],
textarea {
  direction: rtl;
  text-align: right;
}

/* اعداد همیشه LTR */
input[type='number'] {
  direction: ltr;
  text-align: left;
}
```

---

## ✅ چک‌لیست نصب

```bash
# 1. نصب dependencies
cd frontend
npm install jalaali-js react-modern-calendar-datepicker

# 2. ایجاد فایل‌ها
mkdir -p src/utils
mkdir -p src/components/common

# 3. کپی کردن کدها
# - src/utils/jalali.js
# - src/components/common/JalaliDatePicker.jsx
# - src/components/common/JalaliDateDisplay.jsx

# 4. آپدیت theme
# - src/theme/index.js (direction: 'rtl')

# 5. آپدیت HTML
# - index.html (lang="fa" dir="rtl")

# 6. اضافه کردن CSS
# - src/index.css

# 7. تست
npm run dev
```

---

## 🎯 نتیجه

با این کامپوننت‌ها:
- ✅ DatePicker فارسی زیبا
- ✅ تبدیل خودکار تاریخ
- ✅ RTL کامل
- ✅ نمایش تاریخ شمسی
- ✅ فیلتر تاریخ
- ✅ Integration با Backend

**همه چیز آماده است! 🎉**
