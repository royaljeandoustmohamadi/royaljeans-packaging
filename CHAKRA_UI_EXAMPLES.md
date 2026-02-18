# Chakra UI Implementation Guide
## راهنمای پیاده‌سازی با Chakra UI

---

## 📦 نصب و راه‌اندازی

### 1. نصب Packages

```bash
cd frontend
npm install @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion
npm install react-router-dom
npm install axios
npm install zustand
npm install react-hook-form
```

---

## 🎨 تنظیمات اولیه

### 1. Theme Configuration با RTL Support

**File: frontend/src/theme.js**
```javascript
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  direction: 'rtl',
  fonts: {
    heading: `'Vazirmatn', 'Segoe UI', Tahoma, sans-serif`,
    body: `'Vazirmatn', 'Segoe UI', Tahoma, sans-serif`,
  },
  colors: {
    brand: {
      50: '#e3f2fd',
      100: '#bbdefb',
      200: '#90caf9',
      300: '#64b5f6',
      400: '#42a5f5',
      500: '#2196f3',  // Primary
      600: '#1e88e5',
      700: '#1976d2',
      800: '#1565c0',
      900: '#0d47a1',
    },
    royal: {
      50: '#f3e5f5',
      100: '#e1bee7',
      200: '#ce93d8',
      300: '#ba68c8',
      400: '#ab47bc',
      500: '#9c27b0',  // Secondary
      600: '#8e24aa',
      700: '#7b1fa2',
      800: '#6a1b9a',
      900: '#4a148c',
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          transition: 'all 0.2s',
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
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'sm',
          _hover: {
            boxShadow: 'md',
          },
          transition: 'all 0.2s',
        },
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
```

### 2. Main App Setup

**File: frontend/src/main.jsx**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './theme';

// RTL Plugin
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtl from 'stylis-plugin-rtl';

// Create RTL cache
const rtlCache = createCache({
  key: 'css-rtl',
  stylisPlugins: [rtl],
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CacheProvider value={rtlCache}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </CacheProvider>
  </React.StrictMode>,
);
```

**نکته مهم**: برای RTL کامل باید این package را نصب کنید:
```bash
npm install @emotion/cache stylis stylis-plugin-rtl
```

---

## 🔐 صفحات Authentication

### 1. صفحه Login با Chakra UI

**File: frontend/src/pages/Login.jsx**
```jsx
import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Card,
  CardBody,
  Image,
  VStack,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast({
        title: 'ورود موفقیت‌آمیز',
        description: `خوش آمدید ${res.data.user.fullName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'خطا در ورود',
        description: error.response?.data?.error || 'لطفا دوباره تلاش کنید',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="md">
        <VStack spacing={8}>
          {/* Logo Section */}
          <VStack spacing={2}>
            <Image
              src="/logo.png"
              alt="Royal Jeans"
              boxSize="80px"
              fallback={
                <Box
                  boxSize="80px"
                  bg="brand.500"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="2xl"
                  fontWeight="bold"
                >
                  RJ
                </Box>
              }
            />
            <Heading size="lg" color="brand.600">
              رویال جینز
            </Heading>
            <Text color="gray.600" fontSize="sm">
              سیستم مدیریت سفارشات
            </Text>
          </VStack>

          {/* Login Card */}
          <Card w="full" bg={cardBg} shadow="xl">
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                  <Heading size="md" textAlign="center" mb={2}>
                    ورود به سیستم
                  </Heading>
                  
                  <Divider />

                  {/* Email Field */}
                  <FormControl isInvalid={errors.email}>
                    <FormLabel>ایمیل</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={EmailIcon} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="example@royaljeans.com"
                        {...register('email', {
                          required: 'ایمیل الزامی است',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'فرمت ایمیل صحیح نیست',
                          },
                        })}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.email && errors.email.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Password Field */}
                  <FormControl isInvalid={errors.password}>
                    <FormLabel>رمز عبور</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={LockIcon} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="password"
                        placeholder="رمز عبور خود را وارد کنید"
                        {...register('password', {
                          required: 'رمز عبور الزامی است',
                          minLength: {
                            value: 6,
                            message: 'رمز عبور باید حداقل ۶ کاراکتر باشد',
                          },
                        })}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {errors.password && errors.password.message}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    isLoading={isLoading}
                    loadingText="در حال ورود..."
                    mt={4}
                  >
                    ورود
                  </Button>
                </Stack>
              </form>
            </CardBody>
          </Card>

          {/* Footer */}
          <Text fontSize="sm" color="gray.500">
            نسخه 1.0.0 - Royal Jeans OMS
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
```

---

## 🏠 Dashboard Layout

### 1. Main Layout با Sidebar

**File: frontend/src/components/Layout/MainLayout.jsx**
```jsx
import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Desktop Sidebar */}
      <Box display={{ base: 'none', lg: 'block' }}>
        <Sidebar />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Flex direction="column" flex={1} overflow="hidden">
        {/* Header */}
        <Header>
          <IconButton
            display={{ base: 'flex', lg: 'none' }}
            onClick={onOpen}
            variant="ghost"
            icon={<HamburgerIcon />}
            aria-label="Open Menu"
          />
        </Header>

        {/* Content Area */}
        <Box
          flex={1}
          overflow="auto"
          bg={bgColor}
          p={6}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
```

### 2. Sidebar Component

**File: frontend/src/components/Layout/Sidebar.jsx**
```jsx
import {
  Box,
  VStack,
  Heading,
  Icon,
  Flex,
  Text,
  useColorModeValue,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdAssessment,
  MdSettings,
  MdExitToApp,
} from 'react-icons/md';

const menuItems = [
  { name: 'داشبورد', icon: MdDashboard, path: '/dashboard' },
  { name: 'سفارشات', icon: MdShoppingCart, path: '/orders' },
  { name: 'پیمانکاران', icon: MdPeople, path: '/contractors' },
  { name: 'گزارشات', icon: MdAssessment, path: '/reports' },
  { name: 'تنظیمات', icon: MdSettings, path: '/settings' },
];

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('brand.50', 'gray.700');
  const activeBg = useColorModeValue('brand.100', 'brand.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Box
      w="260px"
      h="100vh"
      bg={bgColor}
      borderLeft="1px"
      borderColor={borderColor}
      p={5}
      display="flex"
      flexDirection="column"
    >
      {/* Logo */}
      <Flex align="center" mb={6}>
        <Box
          w="40px"
          h="40px"
          bg="brand.500"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontWeight="bold"
          ml={2}
        >
          RJ
        </Box>
        <Heading size="md" color="brand.600">
          رویال جینز
        </Heading>
      </Flex>

      <Divider mb={4} />

      {/* User Info */}
      <Flex align="center" mb={6} p={3} borderRadius="lg" bg={hoverBg}>
        <Avatar size="sm" name={user.fullName} ml={3} />
        <Box>
          <Text fontWeight="bold" fontSize="sm">
            {user.fullName}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {user.role === 'ADMIN' ? 'مدیر' : user.role === 'MANAGER' ? 'مدیر میانی' : 'کاربر'}
          </Text>
        </Box>
      </Flex>

      {/* Menu Items */}
      <VStack spacing={2} align="stretch" flex={1}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Flex
              key={item.path}
              as={RouterLink}
              to={item.path}
              align="center"
              p={3}
              borderRadius="lg"
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? 'brand.700' : 'gray.600'}
              fontWeight={isActive ? 'bold' : 'normal'}
              _hover={{
                bg: isActive ? activeBg : hoverBg,
                transform: 'translateX(-4px)',
              }}
              transition="all 0.2s"
              cursor="pointer"
              onClick={onClose}
            >
              <Icon as={item.icon} boxSize={5} ml={3} />
              <Text>{item.name}</Text>
            </Flex>
          );
        })}
      </VStack>

      <Divider my={4} />

      {/* Logout */}
      <Flex
        align="center"
        p={3}
        borderRadius="lg"
        color="red.500"
        _hover={{ bg: 'red.50' }}
        transition="all 0.2s"
        cursor="pointer"
        onClick={handleLogout}
      >
        <Icon as={MdExitToApp} boxSize={5} ml={3} />
        <Text>خروج</Text>
      </Flex>
    </Box>
  );
}
```

### 3. Header Component

**File: frontend/src/components/Layout/Header.jsx**
```jsx
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useColorMode,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/dashboard': 'داشبورد',
  '/orders': 'مدیریت سفارشات',
  '/orders/new': 'ثبت سفارش جدید',
  '/contractors': 'مدیریت پیمانکاران',
  '/reports': 'گزارشات',
  '/settings': 'تنظیمات',
};

export default function Header({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const pageTitle = pageTitles[location.pathname] || 'رویال جینز';

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
      shadow="sm"
    >
      <Flex justify="space-between" align="center">
        <Flex align="center" gap={4}>
          {children}
          <Heading size="md">{pageTitle}</Heading>
        </Flex>

        <Flex align="center" gap={3}>
          {/* Dark Mode Toggle */}
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle dark mode"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
```

---

## 📝 فرم ثبت سفارش با Chakra UI

**File: frontend/src/pages/Orders/OrderForm.jsx**
```jsx
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Stack,
  Radio,
  RadioGroup,
  Textarea,
  useToast,
  Divider,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

export default function OrderForm() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bu: 'رویال جین',
      bv: 'نرمال',
      status: 'آماده',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/orders', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast({
        title: 'سفارش با موفقیت ثبت شد',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      
      reset();
    } catch (error) {
      toast({
        title: 'خطا در ثبت سفارش',
        description: error.response?.data?.error || 'لطفا دوباره تلاش کنید',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sizes = [30, 31, 32, 33, 34, 36, 38, 40];
  const sizeCategories = [
    { name: 'سالم', key: 's', color: 'green' },
    { name: 'اقتصادی', key: 'e', color: 'blue' },
    { name: 'اقتصادی ۲', key: 'e2', color: 'cyan' },
    { name: 'اقتصادی ۳', key: 'e3', color: 'purple' },
    { name: 'نمونه', key: 'n', color: 'orange' },
    { name: 'استوک', key: 'stock', color: 'gray' },
  ];

  return (
    <Box maxW="1400px" mx="auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={6}>
          {/* بخش ۱: اطلاعات پایه */}
          <Card>
            <CardHeader>
              <Heading size="md">اطلاعات پایه</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <FormControl isInvalid={errors.code} isRequired>
                  <FormLabel>کد کالا</FormLabel>
                  <Input
                    {...register('code', { required: 'کد کالا الزامی است' })}
                    placeholder="مثال: RJ-1234"
                  />
                </FormControl>

                <FormControl isInvalid={errors.name} isRequired>
                  <FormLabel>نام کالا</FormLabel>
                  <Input
                    {...register('name', { required: 'نام کالا الزامی است' })}
                    placeholder="نام محصول"
                  />
                </FormControl>

                <FormControl isInvalid={errors.date} isRequired>
                  <FormLabel>تاریخ</FormLabel>
                  <Input
                    type="date"
                    {...register('date', { required: 'تاریخ الزامی است' })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>تعداد کل</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('totalCount')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>تعداد در پک</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('packingCount')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>وضعیت</FormLabel>
                  <Select {...register('status', { required: true })}>
                    <option value="آماده">آماده</option>
                    <option value="در حال تولید">در حال تولید</option>
                    <option value="تکمیل شده">تکمیل شده</option>
                    <option value="لغو شده">لغو شده</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>تامین کننده پارچه</FormLabel>
                  <Input {...register('fabricSupplier')} placeholder="نام تامین کننده" />
                </FormControl>

                <FormControl>
                  <FormLabel>نام تولیدی</FormLabel>
                  <Input {...register('productionSupplier')} placeholder="نام تولیدی" />
                </FormControl>

                <FormControl>
                  <FormLabel>نام بسته بندی</FormLabel>
                  <Input {...register('packingName')} placeholder="نام بسته بندی" />
                </FormControl>

                <FormControl>
                  <FormLabel>پارچه</FormLabel>
                  <Input {...register('fabric')} placeholder="نوع پارچه" />
                </FormControl>

                <FormControl>
                  <FormLabel>سنگشویی</FormLabel>
                  <Input {...register('stoneWash')} placeholder="نوع سنگشویی" />
                </FormControl>

                <FormControl>
                  <FormLabel>استایل</FormLabel>
                  <Input {...register('style')} placeholder="استایل" />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* بخش ۲: نوع و سطح سفارش */}
          <Card>
            <CardHeader>
              <Heading size="md">نوع و سطح سفارش</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel>نوع سفارش (BU)</FormLabel>
                  <Controller
                    name="bu"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <Stack>
                          <Radio value="رویال جین">رویال جین</Radio>
                          <Radio value="علی بابا">علی بابا</Radio>
                          <Radio value="سون لین">سون لین</Radio>
                        </Stack>
                      </RadioGroup>
                    )}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>سطح سفارش (BV)</FormLabel>
                  <Controller
                    name="bv"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <RadioGroup {...field}>
                        <Stack>
                          <Radio value="نرمال">نرمال</Radio>
                          <Radio value="پریمیوم">پریمیوم</Radio>
                          <Radio value="ویژه">ویژه</Radio>
                        </Stack>
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* بخش ۳: سایزبندی */}
          <Card>
            <CardHeader>
              <Heading size="md">سایزبندی</Heading>
            </CardHeader>
            <CardBody overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr bg="gray.50">
                    <Th textAlign="right" w="120px">نوع</Th>
                    {sizes.map((size) => (
                      <Th key={size} textAlign="center" w="80px">{size}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {sizeCategories.map((category) => (
                    <Tr key={category.key}>
                      <Td>
                        <Badge colorScheme={category.color}>{category.name}</Badge>
                      </Td>
                      {sizes.map((size) => (
                        <Td key={size} p={1}>
                          <NumberInput size="sm" min={0}>
                            <NumberInputField
                              {...register(`size${size}_${category.key}`)}
                              placeholder="0"
                              textAlign="center"
                            />
                          </NumberInput>
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>

          {/* بخش ۴: موجودی */}
          <Card>
            <CardHeader>
              <Heading size="md">موجودی و اختلاف</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
                <FormControl>
                  <FormLabel>استوک پارچه</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stockFabric')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>استوک شست</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stockWash')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>استوک تولید</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stockProduction')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>استوک بسته بندی</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stockPackaging')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>تعداد قابل فروش</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('saleableCount')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>شست متفاوت</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('differentWash')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>ضایعات</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('waste')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>کسری سنگشویی</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stockMinus')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>اضافه سنگشویی</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stockPlus')} placeholder="0" />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>کسری بسته بندی</FormLabel>
                  <NumberInput>
                    <NumberInputField {...register('stockPackagingMinus')} placeholder="0" />
                  </NumberInput>
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* بخش ۵: ملزومات */}
          <Card>
            <CardHeader>
              <Heading size="md">ملزومات</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                {[
                  { name: 'تعداد دکمه', key: 'btn' },
                  { name: 'تعداد پرچ', key: 'perch' },
                  { name: 'تعداد کارت جیب', key: 'pocketCard' },
                  { name: 'تعداد کارت سایز', key: 'sizeCard' },
                  { name: 'تعداد آویز', key: 'hanger' },
                  { name: 'تعداد بند', key: 'band' },
                  { name: 'تعداد چرم', key: 'leather' },
                ].map((item) => (
                  <FormControl key={item.key}>
                    <FormLabel>{item.name}</FormLabel>
                    <NumberInput>
                      <NumberInputField {...register(item.key)} placeholder="0" />
                    </NumberInput>
                  </FormControl>
                ))}
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* بخش ۶: پرسنل و توضیحات */}
          <Card>
            <CardHeader>
              <Heading size="md">پرسنل و توضیحات</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>تکمیل کننده</FormLabel>
                  <Input {...register('finisher')} placeholder="نام تکمیل کننده" />
                </FormControl>

                <FormControl>
                  <FormLabel>کنترل اولیه</FormLabel>
                  <Input {...register('initialControl')} placeholder="نام کنترل کننده اولیه" />
                </FormControl>

                <FormControl>
                  <FormLabel>کنترل کننده</FormLabel>
                  <Input {...register('controller')} placeholder="نام کنترل کننده نهایی" />
                </FormControl>

                <FormControl gridColumn={{ md: 'span 2' }}>
                  <FormLabel>توضیحات</FormLabel>
                  <Textarea
                    {...register('description')}
                    placeholder="توضیحات اضافی..."
                    rows={4}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* دکمه‌های عملیات */}
          <HStack justify="flex-end" spacing={4}>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              isDisabled={isLoading}
            >
              پاک کردن فرم
            </Button>
            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              isLoading={isLoading}
              loadingText="در حال ذخیره..."
            >
              ذخیره سفارش
            </Button>
          </HStack>
        </Stack>
      </form>
    </Box>
  );
}
```

---

## 📊 لیست سفارشات با Table

**File: frontend/src/pages/Orders/OrdersList.jsx**
```jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Spinner,
  Text,
  Flex,
} from '@chakra-ui/react';
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  DownloadIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm },
      });
      setOrders(res.data.orders);
    } catch (error) {
      toast({
        title: 'خطا در دریافت اطلاعات',
        description: error.response?.data?.error || 'لطفا دوباره تلاش کنید',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این سفارش اطمینان دارید؟')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast({
        title: 'سفارش حذف شد',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      fetchOrders();
    } catch (error) {
      toast({
        title: 'خطا در حذف',
        description: error.response?.data?.error || 'لطفا دوباره تلاش کنید',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'آماده': 'gray',
      'در حال تولید': 'blue',
      'تکمیل شده': 'green',
      'لغو شده': 'red',
    };
    return colors[status] || 'gray';
  };

  if (loading) {
    return (
      <Flex h="50vh" align="center" justify="center">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box>
      <Card>
        <CardHeader>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Heading size="md">لیست سفارشات</Heading>
            <HStack spacing={3}>
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="جستجو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchOrders()}
                />
              </InputGroup>
              
              <Button
                leftIcon={<AddIcon />}
                colorScheme="brand"
                onClick={() => navigate('/orders/new')}
              >
                سفارش جدید
              </Button>
            </HStack>
          </Flex>
        </CardHeader>
        
        <CardBody overflowX="auto">
          {orders.length === 0 ? (
            <Text textAlign="center" py={10} color="gray.500">
              سفارشی یافت نشد
            </Text>
          ) : (
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>کد کالا</Th>
                  <Th>نام کالا</Th>
                  <Th>تاریخ</Th>
                  <Th>وضعیت</Th>
                  <Th>تعداد کل</Th>
                  <Th>ثبت کننده</Th>
                  <Th textAlign="left">عملیات</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order.id} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="bold" color="brand.600">
                      {order.code}
                    </Td>
                    <Td>{order.name}</Td>
                    <Td>{new Date(order.date).toLocaleDateString('fa-IR')}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </Td>
                    <Td>{order.totalCount || '-'}</Td>
                    <Td>{order.creator?.fullName || '-'}</Td>
                    <Td textAlign="left">
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<ChevronDownIcon />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<EditIcon />}
                            onClick={() => navigate(`/orders/edit/${order.id}`)}
                          >
                            ویرایش
                          </MenuItem>
                          <MenuItem
                            icon={<DownloadIcon />}
                            onClick={() => alert('Export feature')}
                          >
                            دانلود
                          </MenuItem>
                          <MenuItem
                            icon={<DeleteIcon />}
                            color="red.500"
                            onClick={() => handleDelete(order.id)}
                          >
                            حذف
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}
```

---

## 🎯 نکات مهم

### 1. فونت فارسی
برای استفاده از فونت Vazirmatn، در `index.html` اضافه کنید:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### 2. Icons
برای آیکون‌های بیشتر، می‌توانید از React Icons استفاده کنید:

```bash
npm install react-icons
```

### 3. Toast برای Notifications
Chakra UI toast system بسیار قدرتمند است و نیازی به کتابخانه جداگانه ندارید.

### 4. Responsive Design
همه کامپوننت‌های Chakra UI به صورت پیش‌فرض responsive هستند. از syntax زیر استفاده کنید:

```jsx
<Box
  w={{ base: '100%', md: '50%', lg: '33%' }}
  p={{ base: 4, md: 6, lg: 8 }}
>
```

---

## 📚 منابع بیشتر

- [Chakra UI Documentation](https://chakra-ui.com/docs/getting-started)
- [Chakra UI Component Examples](https://chakra-ui.com/docs/components)
- [RTL Support Guide](https://chakra-ui.com/docs/styled-system/rtl-support)
- [Dark Mode](https://chakra-ui.com/docs/styled-system/color-mode)

---

**موفق باشید! 🚀**
