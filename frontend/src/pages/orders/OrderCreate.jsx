import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardBody,
  SimpleGrid,
  Textarea,
  useToast,
  Spinner,
  Text,
  Flex,
  IconButton,
  Badge,
  InputGroup,
  InputLeftElement,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Stack,
  useColorModeValue,
  Divider,
  Progress,
} from '@chakra-ui/react';
import { 
  Save, 
  ArrowRight, 
  Search,
  Package,
  Layers,
  Grid3X3,
  Warehouse,
  ClipboardList,
  User,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ordersService from '../../services/orders.service';
import settingsService from '../../services/settings.service';

// Section navigation component
const SectionNav = ({ sections, activeSection, onSectionClick }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box
      position="sticky"
      top="80px"
      w="280px"
      bg={cardBg}
      borderRadius="2xl"
      shadow="lg"
      p={4}
      display={{ base: 'none', lg: 'block' }}
      maxH="calc(100vh - 120px)"
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '4px' },
      }}
    >
      <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={4}>
        بخش‌های فرم
      </Text>
      <VStack spacing={2} align="stretch">
        {sections.map((section, index) => (
          <Flex
            key={section.id}
            align="center"
            gap={3}
            p={3}
            borderRadius="xl"
            cursor="pointer"
            bg={activeSection === section.id ? 'brand.50' : 'transparent'}
            color={activeSection === section.id ? 'brand.600' : 'gray.600'}
            borderRight={activeSection === section.id ? '3px solid' : '3px solid transparent'}
            borderColor={activeSection === section.id ? 'brand.500' : 'transparent'}
            transition="all 0.2s"
            _hover={{
              bg: activeSection === section.id ? 'brand.50' : 'gray.50',
              transform: 'translateX(4px)',
            }}
            onClick={() => onSectionClick(section.id)}
          >
            <Flex
              w={8}
              h={8}
              align="center"
              justify="center"
              borderRadius="lg"
              bg={activeSection === section.id ? 'brand.500' : 'gray.100'}
              color={activeSection === section.id ? 'white' : 'gray.500'}
            >
              <section.icon size={16} />
            </Flex>
            <Box flex={1}>
              <Text fontSize="sm" fontWeight="medium">
                {section.title}
              </Text>
              <Text fontSize="xs" color="gray.400">
                {section.description}
              </Text>
            </Box>
            {section.isCompleted && (
              <CheckCircle size={16} color="#48BB78" />
            )}
          </Flex>
        ))}
      </VStack>
      
      <Divider my={4} />
      
      <Button
        w="full"
        colorScheme="brand"
        size="lg"
        shadow="lg"
        _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
        transition="all 0.2s"
      >
        <Save size={18} style={{ marginLeft: '8px' }} />
        ذخیره سفارش
      </Button>
    </Box>
  );
};

// Floating navigation for mobile
const FloatingNav = ({ sections, activeSection, onSectionClick, scrollProgress }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  
  return (
    <Box
      position="fixed"
      bottom={4}
      left={4}
      right={4}
      bg={cardBg}
      borderRadius="2xl"
      shadow="2xl"
      p={3}
      display={{ base: 'block', lg: 'none' }}
      zIndex={100}
    >
      <Progress 
        value={scrollProgress} 
        size="xs" 
        colorScheme="brand" 
        borderRadius="full"
        mb={3}
      />
      <Flex gap={2} overflowX="auto" pb={2} css={{ scrollbarWidth: 'none' }}>
        {sections.map((section) => (
          <Button
            key={section.id}
            size="sm"
            variant={activeSection === section.id ? 'solid' : 'outline'}
            colorScheme={activeSection === section.id ? 'brand' : 'gray'}
            onClick={() => onSectionClick(section.id)}
            flexShrink={0}
            borderRadius="full"
            px={4}
          >
            <section.icon size={14} style={{ marginLeft: '4px' }} />
            {section.title}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

const OrderCreate = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    date: new Date().toISOString().split('T')[0],
    status: '',
    totalCount: '',
    packingCount: '',
    packingName: '',
    fabricSupplier: '',
    productionSupplier: '',
    fabric: '',
    stoneWash: '',
    style: '',
    
    // Healthy sizes
    size30_healthy: 0, size31_healthy: 0, size32_healthy: 0, size33_healthy: 0,
    size34_healthy: 0, size36_healthy: 0, size38_healthy: 0, size40_healthy: 0,
    
    // Economy sizes
    size30_economy: 0, size31_economy: 0, size32_economy: 0, size33_economy: 0,
    size34_economy: 0, size36_economy: 0, size38_economy: 0, size40_economy: 0,
    
    // Economy 2 sizes
    size30_economy2: 0, size31_economy2: 0, size32_economy2: 0, size33_economy2: 0,
    size34_economy2: 0, size36_economy2: 0, size38_economy2: 0, size40_economy2: 0,
    
    // Economy 3 sizes
    size30_economy3: 0, size31_economy3: 0, size32_economy3: 0, size33_economy3: 0,
    size34_economy3: 0, size36_economy3: 0, size38_economy3: 0, size40_economy3: 0,
    
    // Sample sizes
    size30_sample: 0, size31_sample: 0, size32_sample: 0, size33_sample: 0,
    size34_sample: 0, size36_sample: 0, size38_sample: 0, size40_sample: 0,
    
    // Stock fields
    stockFabric: 0, stockWash: 0, stockProduction: 0, stockPackaging: 0,
    saleableCount: 0, differentWash: 0, waste: 0, stockMinus: 0, stockPlus: 0,
    
    // Accessories
    accessories_button: true,
    accessories_rivet: true,
    accessories_pocketCard: false,
    accessories_sizeCard: false,
    accessories_hanger: true,
    accessories_band: false,
    accessories_leather: true,
    
    // Personnel
    description: '', finisher: '', controller: '',
    bu: 'رویال جینز',
    bv: 'نرمال',
  });

  const [settings, setSettings] = useState({
    productionSuppliers: [],
    fabricSuppliers: [],
    fabrics: [],
    stoneWashes: [],
    packingNames: [],
    styles: [],
    orderTypes: [],
    orderLevels: [],
  });

  const [loading, setLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState('basic');
  const [scrollProgress, setScrollProgress] = useState(0);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Sections configuration
  const sections = [
    { 
      id: 'basic', 
      title: 'اطلاعات پایه', 
      icon: Package,
      description: 'کد، نام، تاریخ و وضعیت',
    },
    { 
      id: 'suppliers', 
      title: 'اطلاعات تأمین‌کنندگان', 
      icon: Layers,
      description: 'تولیدی، پارچه، شستشو',
    },
    { 
      id: 'sizes', 
      title: 'سایزبندی', 
      icon: Grid3X3,
      description: 'سالم، اقتصادی، نمونه',
    },
    { 
      id: 'stock', 
      title: 'موجودی و مغایرت', 
      icon: Warehouse,
      description: 'موجودی و ضایعات',
    },
    { 
      id: 'requirements', 
      title: 'ملزومات', 
      icon: ClipboardList,
      description: 'دکمه، پرچ، کارت',
    },
    { 
      id: 'personnel', 
      title: 'پرسنل و توضیحات', 
      icon: User,
      description: 'تکمیل‌کننده، کنترلر',
    },
  ];

  useEffect(() => {
    fetchSettings();
    
    // Scroll spy
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Find active section
      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsService.getAll();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.name) {
      toast({
        title: 'خطا',
        description: 'کد و نام سفارش اجباری است',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await ordersService.create(formData);
      toast({
        title: 'موفقیت',
        description: 'سفارش با موفقیت ثبت شد',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/orders');
    } catch (err) {
      toast({
        title: 'خطا',
        description: err.response?.data?.message || 'خطا در ثبت سفارش',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const SizeInput = ({ label, field, size = 'sm' }) => (
    <FormControl>
      <FormLabel fontSize={size === 'sm' ? 'xs' : 'sm'} fontWeight="medium">{label}</FormLabel>
      <NumberInput
        min={0}
        value={formData[field] || 0}
        onChange={(value) => handleChange(field, parseInt(value) || 0)}
        size={size}
      >
        <NumberInputField 
          textAlign="center" 
          fontWeight="bold"
          _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)' }}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );

  const SizeRow = ({ label, suffix }) => (
    <Box>
      <Text fontSize="sm" fontWeight="bold" mb={2} color="gray.700">{label}</Text>
      <SimpleGrid columns={8} spacing={1}>
        <SizeInput label="30" field={`size30_${suffix}`} />
        <SizeInput label="31" field={`size31_${suffix}`} />
        <SizeInput label="32" field={`size32_${suffix}`} />
        <SizeInput label="33" field={`size33_${suffix}`} />
        <SizeInput label="34" field={`size34_${suffix}`} />
        <SizeInput label="36" field={`size36_${suffix}`} />
        <SizeInput label="38" field={`size38_${suffix}`} />
        <SizeInput label="40" field={`size40_${suffix}`} />
      </SimpleGrid>
    </Box>
  );

  const checkSectionComplete = (sectionId) => {
    switch (sectionId) {
      case 'basic':
        return formData.code && formData.name && formData.status;
      case 'suppliers':
        return formData.productionSupplier || formData.fabric || formData.stoneWash;
      case 'sizes':
        return Object.keys(formData).some(key => key.includes('size') && formData[key] > 0);
      case 'stock':
        return formData.stockFabric > 0 || formData.stockWash > 0;
      case 'requirements':
        return true;
      case 'personnel':
        return true;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="brand.500" />
      </Box>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" color="gray.700">
            ثبت سفارش جدید
          </Heading>
          <Text color="gray.500" mt={1}>
            فرم جامع ثبت اطلاعات سفارش
          </Text>
        </Box>
        <Button
          leftIcon={<ArrowRight size={18} />}
          variant="ghost"
          onClick={() => navigate('/orders')}
        >
          بازگشت به لیست
        </Button>
      </Flex>

      <Flex gap={6}>
        {/* Main Form */}
        <Box flex={1} pb={{ base: '120px', lg: 0 }}>
          {/* Basic Info Section */}
          <Box 
            ref={(el) => sectionRefs.current.basic = el} 
            mb={6}
            id="basic"
            scrollMarginTop="100px"
          >
            <Card 
              bg={cardBg} 
              border="1px" 
              borderColor={borderColor}
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{ shadow: 'lg' }}
            >
              <Flex
                align="center"
                gap={3}
                p={4}
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
              >
                <Package size={24} />
                <Box>
                  <Heading size="md">اطلاعات پایه سفارش</Heading>
                  <Text fontSize="sm" opacity={0.9}>کد، نام کالا، تاریخ و وضعیت سفارش</Text>
                </Box>
              </Flex>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>کد سفارش</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Search size={16} color="gray" />
                      </InputLeftElement>
                      <Input
                        value={formData.code}
                        onChange={(e) => handleChange('code', e.target.value)}
                        placeholder="مثال: RJ-1402-001"
                        fontWeight="bold"
                      />
                    </InputGroup>
                  </FormControl>
                  
                  <FormControl isRequired gridColumn={{ lg: 'span 2' }}>
                    <FormLabel>نام کالا</FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="نام محصول"
                      fontWeight="bold"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>تاریخ</FormLabel>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>وضعیت</FormLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      placeholder="انتخاب وضعیت"
                    >
                      <option value="pending">در انتظار</option>
                      <option value="in_progress">در حال انجام</option>
                      <option value="completed">تکمیل شده</option>
                      <option value="sent">ارسال شده به انبار</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>تعداد کل</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.totalCount || ''}
                      onChange={(value) => handleChange('totalCount', parseInt(value) || '')}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>تعداد در پک</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.packingCount || ''}
                      onChange={(value) => handleChange('packingCount', parseInt(value) || '')}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>نوع بسته‌بندی</FormLabel>
                    <Select
                      value={formData.packingName}
                      onChange={(e) => handleChange('packingName', e.target.value)}
                      placeholder="انتخاب بسته‌بندی"
                      isDisabled={settingsLoading}
                    >
                      {settings.packingNames?.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>استایل / مدل</FormLabel>
                    <Select
                      value={formData.style}
                      onChange={(e) => handleChange('style', e.target.value)}
                      placeholder="انتخاب استایل"
                      isDisabled={settingsLoading}
                    >
                      {settings.styles?.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>
          </Box>

          {/* Suppliers Section */}
          <Box 
            ref={(el) => sectionRefs.current.suppliers = el} 
            mb={6}
            id="suppliers"
            scrollMarginTop="100px"
          >
            <Card 
              bg={cardBg} 
              border="1px" 
              borderColor={borderColor}
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{ shadow: 'lg' }}
            >
              <Flex
                align="center"
                gap={3}
                p={4}
                bg="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                color="white"
              >
                <Layers size={24} />
                <Box>
                  <Heading size="md">اطلاعات تأمین‌کنندگان</Heading>
                  <Text fontSize="sm" opacity={0.9}>نام تولیدی، پارچه و شستشو</Text>
                </Box>
              </Flex>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>نام تولیدی</FormLabel>
                    <Select
                      value={formData.productionSupplier}
                      onChange={(e) => handleChange('productionSupplier', e.target.value)}
                      placeholder="انتخاب تولیدی"
                      isDisabled={settingsLoading}
                    >
                      {settings.productionSuppliers?.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>تأمین‌کننده پارچه</FormLabel>
                    <Select
                      value={formData.fabricSupplier}
                      onChange={(e) => handleChange('fabricSupplier', e.target.value)}
                      placeholder="انتخاب تأمین‌کننده"
                      isDisabled={settingsLoading}
                    >
                      {settings.fabricSuppliers?.map(f => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>جنس پارچه</FormLabel>
                    <Select
                      value={formData.fabric}
                      onChange={(e) => handleChange('fabric', e.target.value)}
                      placeholder="انتخاب پارچه"
                      isDisabled={settingsLoading}
                    >
                      {settings.fabrics?.map(f => (
                        <option key={f.id} value={f.name}>{f.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>سنگ شور (Stonewash)</FormLabel>
                    <Select
                      value={formData.stoneWash}
                      onChange={(e) => handleChange('stoneWash', e.target.value)}
                      placeholder="انتخاب شستشو"
                      isDisabled={settingsLoading}
                    >
                      {settings.stoneWashes?.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>
          </Box>

          {/* Sizes Section */}
          <Box 
            ref={(el) => sectionRefs.current.sizes = el} 
            mb={6}
            id="sizes"
            scrollMarginTop="100px"
          >
            <Card 
              bg={cardBg} 
              border="1px" 
              borderColor={borderColor}
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{ shadow: 'lg' }}
            >
              <Flex
                align="center"
                gap={3}
                p={4}
                bg="linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)"
                color="white"
              >
                <Grid3X3 size={24} />
                <Box>
                  <Heading size="md">جدول سایزبندی</Heading>
                  <Text fontSize="sm" opacity={0.9}>سالم، اقتصادی 1، 2، 3 و نمونه</Text>
                </Box>
              </Flex>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Badge colorScheme="green" mb={2} px={2} py={1} borderRadius="md">سالم</Badge>
                    <SizeRow label="سالم" suffix="healthy" />
                  </Box>
                  
                  <Divider />
                  
                  <Box>
                    <Badge colorScheme="orange" mb={2} px={2} py={1} borderRadius="md">اقتصادی ۱</Badge>
                    <SizeRow label="اقتصادی ۱" suffix="economy" />
                  </Box>
                  
                  <Box>
                    <Badge colorScheme="orange" mb={2} px={2} py={1} borderRadius="md">اقتصادی ۲</Badge>
                    <SizeRow label="اقتصادی ۲" suffix="economy2" />
                  </Box>
                  
                  <Box>
                    <Badge colorScheme="orange" mb={2} px={2} py={1} borderRadius="md">اقتصادی ۳</Badge>
                    <SizeRow label="اقتصادی ۳" suffix="economy3" />
                  </Box>
                  
                  <Box>
                    <Badge colorScheme="purple" mb={2} px={2} py={1} borderRadius="md">نمونه</Badge>
                    <SizeRow label="نمونه" suffix="sample" />
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </Box>

          {/* Stock Section */}
          <Box 
            ref={(el) => sectionRefs.current.stock = el} 
            mb={6}
            id="stock"
            scrollMarginTop="100px"
          >
            <Card 
              bg={cardBg} 
              border="1px" 
              borderColor={borderColor}
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{ shadow: 'lg' }}
            >
              <Flex
                align="center"
                gap={3}
                p={4}
                bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                color="white"
              >
                <Warehouse size={24} />
                <Box>
                  <Heading size="md">موجودی و مغایرت</Heading>
                  <Text fontSize="sm" opacity={0.9}>موجودی پارچه، شستشو، تولید و ضایعات</Text>
                </Box>
              </Flex>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <FormControl>
                    <FormLabel>استوک پارچه</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.stockFabric || ''}
                      onChange={(value) => handleChange('stockFabric', parseInt(value) || '')}
                    >
                      <NumberInputField bg="blue.50" borderColor="blue.200" />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>استوک شست</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.stockWash || ''}
                      onChange={(value) => handleChange('stockWash', parseInt(value) || '')}
                    >
                      <NumberInputField bg="cyan.50" borderColor="cyan.200" />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>استوک تولید</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.stockProduction || ''}
                      onChange={(value) => handleChange('stockProduction', parseInt(value) || '')}
                    >
                      <NumberInputField bg="green.50" borderColor="green.200" />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>استوک بسته‌بندی</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.stockPackaging || ''}
                      onChange={(value) => handleChange('stockPackaging', parseInt(value) || '')}
                    >
                      <NumberInputField bg="purple.50" borderColor="purple.200" />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>تعداد قابل فروش</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.saleableCount || ''}
                      onChange={(value) => handleChange('saleableCount', parseInt(value) || '')}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>شست متفاوت</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.differentWash || ''}
                      onChange={(value) => handleChange('differentWash', parseInt(value) || '')}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="red.500">ضایعات</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.waste || ''}
                      onChange={(value) => handleChange('waste', parseInt(value) || '')}
                    >
                      <NumberInputField bg="red.50" borderColor="red.200" />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="red.500">کسری سنگشویی</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.stockMinus || ''}
                      onChange={(value) => handleChange('stockMinus', parseInt(value) || '')}
                    >
                      <NumberInputField bg="red.50" borderColor="red.200" />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel color="green.500">اضافه سنگشویی</FormLabel>
                    <NumberInput
                      min={0}
                      value={formData.stockPlus || ''}
                      onChange={(value) => handleChange('stockPlus', parseInt(value) || '')}
                    >
                      <NumberInputField bg="green.50" borderColor="green.200" />
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>
          </Box>

          {/* Requirements Section */}
          <Box 
            ref={(el) => sectionRefs.current.requirements = el} 
            mb={6}
            id="requirements"
            scrollMarginTop="100px"
          >
            <Card 
              bg={cardBg} 
              border="1px" 
              borderColor={borderColor}
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{ shadow: 'lg' }}
            >
              <Flex
                align="center"
                gap={3}
                p={4}
                bg="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                color="gray.800"
              >
                <ClipboardList size={24} />
                <Box>
                  <Heading size="md">ملزومات (Requirements)</Heading>
                  <Text fontSize="sm" opacity={0.8}>انتخاب موارد مورد نیاز برای سفارش</Text>
                </Box>
              </Flex>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Checkbox
                    isChecked={formData.accessories_button}
                    onChange={(e) => handleChange('accessories_button', e.target.checked)}
                    colorScheme="blue"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">دکمه (Button)</Text>
                      <Text fontSize="xs" color="gray.500">Button</Text>
                    </VStack>
                  </Checkbox>
                  
                  <Checkbox
                    isChecked={formData.accessories_rivet}
                    onChange={(e) => handleChange('accessories_rivet', e.target.checked)}
                    colorScheme="blue"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">پرچ (Rivet)</Text>
                      <Text fontSize="xs" color="gray.500">Rivet</Text>
                    </VStack>
                  </Checkbox>
                  
                  <Checkbox
                    isChecked={formData.accessories_pocketCard}
                    onChange={(e) => handleChange('accessories_pocketCard', e.target.checked)}
                    colorScheme="blue"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">کارت جیب</Text>
                      <Text fontSize="xs" color="gray.500">Pocket Card</Text>
                    </VStack>
                  </Checkbox>
                  
                  <Checkbox
                    isChecked={formData.accessories_sizeCard}
                    onChange={(e) => handleChange('accessories_sizeCard', e.target.checked)}
                    colorScheme="blue"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">کارت سایز</Text>
                      <Text fontSize="xs" color="gray.500">Size Card</Text>
                    </VStack>
                  </Checkbox>
                  
                  <Checkbox
                    isChecked={formData.accessories_hanger}
                    onChange={(e) => handleChange('accessories_hanger', e.target.checked)}
                    colorScheme="blue"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">آویز (Hanger)</Text>
                      <Text fontSize="xs" color="gray.500">Hanger</Text>
                    </VStack>
                  </Checkbox>
                  
                  <Checkbox
                    isChecked={formData.accessories_band}
                    onChange={(e) => handleChange('accessories_band', e.target.checked)}
                    colorScheme="blue"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">بند (Cord)</Text>
                      <Text fontSize="xs" color="gray.500">Cord</Text>
                    </VStack>
                  </Checkbox>
                  
                  <Checkbox
                    isChecked={formData.accessories_leather}
                    onChange={(e) => handleChange('accessories_leather', e.target.checked)}
                    colorScheme="blue"
                  >
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="medium">مارک چرمی</Text>
                      <Text fontSize="xs" color="gray.500">Leather Label</Text>
                    </VStack>
                  </Checkbox>
                </SimpleGrid>
              </CardBody>
            </Card>
          </Box>

          {/* Personnel Section */}
          <Box 
            ref={(el) => sectionRefs.current.personnel = el} 
            mb={6}
            id="personnel"
            scrollMarginTop="100px"
          >
            <Card 
              bg={cardBg} 
              border="1px" 
              borderColor={borderColor}
              overflow="hidden"
              transition="all 0.3s ease"
              _hover={{ shadow: 'lg' }}
            >
              <Flex
                align="center"
                gap={3}
                p={4}
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                color="white"
              >
                <User size={24} />
                <Box>
                  <Heading size="md">پرسنل و توضیحات</Heading>
                  <Text fontSize="sm" opacity={0.9}>تکمیل‌کننده، کنترلر و توضیحات تکمیلی</Text>
                </Box>
              </Flex>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>نوع سفارش (BU)</FormLabel>
                      <Select
                        value={formData.bu}
                        onChange={(e) => handleChange('bu', e.target.value)}
                        isDisabled={settingsLoading}
                      >
                        {settings.orderTypes?.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                        <option value="رویال جینز">رویال جینز</option>
                        <option value="بار مشتری">بار مشتری</option>
                        <option value="نیوکالکشن">نیوکالکشن</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>سطح سفارش (BV)</FormLabel>
                      <Select
                        value={formData.bv}
                        onChange={(e) => handleChange('bv', e.target.value)}
                        isDisabled={settingsLoading}
                      >
                        {settings.orderLevels?.map(l => (
                          <option key={l.id} value={l.name}>{l.name}</option>
                        ))}
                        <option value="لارج">لارج</option>
                        <option value="نرمال">نرمال</option>
                        <option value="ECO">ECO</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>تکمیل‌کننده (Finisher)</FormLabel>
                      <Input
                        value={formData.finisher}
                        onChange={(e) => handleChange('finisher', e.target.value)}
                        placeholder="نام تکمیل‌کننده"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>کنترل‌کننده (Controller)</FormLabel>
                      <Input
                        value={formData.controller}
                        onChange={(e) => handleChange('controller', e.target.value)}
                        placeholder="نام کنترل‌کننده"
                      />
                    </FormControl>
                  </SimpleGrid>
                  
                  <FormControl>
                    <FormLabel>توضیحات تکمیلی</FormLabel>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      placeholder="توضیحات اضافی در مورد این سفارش..."
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </Box>

          {/* Submit Button */}
          <Button
            w="full"
            size="lg"
            colorScheme="brand"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="در حال ذخیره..."
            shadow="xl"
            _hover={{ transform: 'translateY(-2px)', shadow: '2xl' }}
            transition="all 0.2s"
          >
            <Save size={20} style={{ marginLeft: '8px' }} />
            ذخیره سفارش
          </Button>
        </Box>

        {/* Sidebar Navigation */}
        <SectionNav 
          sections={sections.map(s => ({
            ...s,
            isCompleted: checkSectionComplete(s.id)
          }))}
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />
      </Flex>

      {/* Floating Mobile Navigation */}
      <FloatingNav 
        sections={sections.map(s => ({
          ...s,
          isCompleted: checkSectionComplete(s.id)
        }))}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
        scrollProgress={scrollProgress}
      />
    </Box>
  );
};

export default OrderCreate;
