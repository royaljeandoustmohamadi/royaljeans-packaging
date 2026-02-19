import { useState, useEffect } from 'react';
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  SimpleGrid,
  Textarea,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowRight } from 'lucide-react';
import ordersService from '../../services/orders.service';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    date: '',
    status: 'pending',
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
    
    // Stock sizes
    size30_stock: 0, size31_stock: 0, size32_stock: 0, size33_stock: 0,
    size34_stock: 0, size36_stock: 0, size38_stock: 0, size40_stock: 0,
    
    // Stock fields
    stockFabric: 0, stockWash: 0, stockProduction: 0, stockPackaging: 0,
    saleableCount: 0, differentWash: 0, waste: 0, stockMinus: 0, stockPlus: 0,
    stockPackagingMinus: 0,
    
    // Accessories
    accessories_button: 0, accessories_rivet: 0, accessories_pocketCard: 0,
    accessories_sizeCard: 0, accessories_hanger: 0, accessories_band: 0,
    accessories_leather: 0,
    
    // Personnel
    description: '', finisher: '', initialControl: '', controller: '',
    bu: '', bv: '',
  });

  useEffect(() => {
    fetchOrderData();
  }, [id]);

  const fetchOrderData = async () => {
    try {
      setFetchLoading(true);
      const response = await ordersService.getById(id);
      const order = response.order;
      
      setFormData({
        code: order.code || '',
        name: order.name || '',
        date: order.date ? new Date(order.date).toISOString().split('T')[0] : '',
        status: order.status || 'pending',
        totalCount: order.totalCount || '',
        packingCount: order.packingCount || '',
        packingName: order.packingName || '',
        fabricSupplier: order.fabricSupplier || '',
        productionSupplier: order.productionSupplier || '',
        fabric: order.fabric || '',
        stoneWash: order.stoneWash || '',
        style: order.style || '',
        
        // Healthy sizes
        size30_healthy: order.size30_healthy || 0, size31_healthy: order.size31_healthy || 0,
        size32_healthy: order.size32_healthy || 0, size33_healthy: order.size33_healthy || 0,
        size34_healthy: order.size34_healthy || 0, size36_healthy: order.size36_healthy || 0,
        size38_healthy: order.size38_healthy || 0, size40_healthy: order.size40_healthy || 0,
        
        // Economy sizes
        size30_economy: order.size30_economy || 0, size31_economy: order.size31_economy || 0,
        size32_economy: order.size32_economy || 0, size33_economy: order.size33_economy || 0,
        size34_economy: order.size34_economy || 0, size36_economy: order.size36_economy || 0,
        size38_economy: order.size38_economy || 0, size40_economy: order.size40_economy || 0,
        
        // Economy 2 sizes
        size30_economy2: order.size30_economy2 || 0, size31_economy2: order.size31_economy2 || 0,
        size32_economy2: order.size32_economy2 || 0, size33_economy2: order.size33_economy2 || 0,
        size34_economy2: order.size34_economy2 || 0, size36_economy2: order.size36_economy2 || 0,
        size38_economy2: order.size38_economy2 || 0, size40_economy2: order.size40_economy2 || 0,
        
        // Economy 3 sizes
        size30_economy3: order.size30_economy3 || 0, size31_economy3: order.size31_economy3 || 0,
        size32_economy3: order.size32_economy3 || 0, size33_economy3: order.size33_economy3 || 0,
        size34_economy3: order.size34_economy3 || 0, size36_economy3: order.size36_economy3 || 0,
        size38_economy3: order.size38_economy3 || 0, size40_economy3: order.size40_economy3 || 0,
        
        // Sample sizes
        size30_sample: order.size30_sample || 0, size31_sample: order.size31_sample || 0,
        size32_sample: order.size32_sample || 0, size33_sample: order.size33_sample || 0,
        size34_sample: order.size34_sample || 0, size36_sample: order.size36_sample || 0,
        size38_sample: order.size38_sample || 0, size40_sample: order.size40_sample || 0,
        
        // Stock sizes
        size30_stock: order.size30_stock || 0, size31_stock: order.size31_stock || 0,
        size32_stock: order.size32_stock || 0, size33_stock: order.size33_stock || 0,
        size34_stock: order.size34_stock || 0, size36_stock: order.size36_stock || 0,
        size38_stock: order.size38_stock || 0, size40_stock: order.size40_stock || 0,
        
        // Stock fields
        stockFabric: order.stockFabric || 0, stockWash: order.stockWash || 0,
        stockProduction: order.stockProduction || 0, stockPackaging: order.stockPackaging || 0,
        saleableCount: order.saleableCount || 0, differentWash: order.differentWash || 0,
        waste: order.waste || 0, stockMinus: order.stockMinus || 0,
        stockPlus: order.stockPlus || 0, stockPackagingMinus: order.stockPackagingMinus || 0,
        
        // Accessories
        accessories_button: order.accessories_button || 0, accessories_rivet: order.accessories_rivet || 0,
        accessories_pocketCard: order.accessories_pocketCard || 0, accessories_sizeCard: order.accessories_sizeCard || 0,
        accessories_hanger: order.accessories_hanger || 0, accessories_band: order.accessories_band || 0,
        accessories_leather: order.accessories_leather || 0,
        
        // Personnel
        description: order.description || '', finisher: order.finisher || '',
        initialControl: order.initialControl || '', controller: order.controller || '',
        bu: order.bu || '', bv: order.bv || '',
      });
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در دریافت اطلاعات سفارش',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/orders');
    } finally {
      setFetchLoading(false);
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
      
      // Prepare data for submission
      const orderData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        totalCount: formData.totalCount ? parseInt(formData.totalCount) : null,
        packingCount: formData.packingCount ? parseInt(formData.packingCount) : null,
      };

      await ordersService.update(id, orderData);
      
      toast({
        title: 'موفقیت',
        description: 'سفارش با موفقیت به‌روزرسانی شد',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate(`/orders/${id}`);
    } catch (error) {
      toast({
        title: 'خطا',
        description: error.response?.data?.message || 'خطا در به‌روزرسانی سفارش',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const NumberField = ({ label, field, w = 'auto' }) => (
    <FormControl w={w}>
      <FormLabel fontSize="sm">{label}</FormLabel>
      <NumberInput
        value={formData[field] || 0}
        onChange={(valueString) => handleChange(field, parseInt(valueString) || 0)}
        min={0}
      >
        <NumberInputField />
      </NumberInput>
    </FormControl>
  );

  const InputField = ({ label, field, placeholder = '', w = 'auto' }) => (
    <FormControl w={w}>
      <FormLabel fontSize="sm">{label}</FormLabel>
      <Input
        value={formData[field] || ''}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        size="sm"
      />
    </FormControl>
  );

  if (fetchLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <HStack>
          <Button
            leftIcon={<ArrowRight />}
            onClick={() => navigate(`/orders/${id}`)}
            variant="ghost"
          >
            بازگشت
          </Button>
          <Heading size="lg">ویرایش سفارش</Heading>
        </HStack>
        
        <Button
          leftIcon={<Save />}
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="در حال ذخیره..."
        >
          ذخیره تغییرات
        </Button>
      </HStack>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>اطلاعات پایه</Tab>
          <Tab>مشخصات محصول</Tab>
          <Tab>سایزهای سالم</Tab>
          <Tab>سایزهای اقتصادی</Tab>
          <Tab>سایزهای نمونه</Tab>
          <Tab>موجودی</Tab>
          <Tab>ملزومات</Tab>
          <Tab>پرسنل</Tab>
        </TabList>

        <TabPanels>
          {/* Basic Information */}
          <TabPanel>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    <InputField label="کد سفارش *" field="code" />
                    <InputField label="نام سفارش *" field="name" />
                    <FormControl>
                      <FormLabel fontSize="sm">تاریخ</FormLabel>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">وضعیت</FormLabel>
                      <Select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        size="sm"
                      >
                        <option value="pending">در انتظار</option>
                        <option value="processing">در حال پردازش</option>
                        <option value="completed">تکمیل شده</option>
                        <option value="cancelled">لغو شده</option>
                      </Select>
                    </FormControl>
                    <InputField label="کل تعداد" field="totalCount" />
                    <InputField label="تعداد بسته‌بندی" field="packingCount" />
                    <InputField label="نام بسته‌بندی" field="packingName" />
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Product Details */}
          <TabPanel>
            <Card>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  <InputField label="نوع پارچه" field="fabric" />
                  <InputField label="شستشو" field="stoneWash" />
                  <InputField label="استایل" field="style" />
                  <InputField label="تأمین‌کننده پارچه" field="fabricSupplier" />
                  <InputField label="تأمین‌کننده تولید" field="productionSupplier" />
                  <InputField label="نوع سفارش (BU)" field="bu" />
                  <InputField label="سطح سفارش (BV)" field="bv" />
                </SimpleGrid>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Healthy Sizes */}
          <TabPanel>
            <Card>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
                  <NumberField label="سایز 30" field="size30_healthy" />
                  <NumberField label="سایز 31" field="size31_healthy" />
                  <NumberField label="سایز 32" field="size32_healthy" />
                  <NumberField label="سایز 33" field="size33_healthy" />
                  <NumberField label="سایز 34" field="size34_healthy" />
                  <NumberField label="سایز 36" field="size36_healthy" />
                  <NumberField label="سایز 38" field="size38_healthy" />
                  <NumberField label="سایز 40" field="size40_healthy" />
                </SimpleGrid>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Economy Sizes */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Card>
                <CardBody>
                  <Heading size="sm" mb={4}>اقتصادی 1</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
                    <NumberField label="سایز 30" field="size30_economy" />
                    <NumberField label="سایز 31" field="size31_economy" />
                    <NumberField label="سایز 32" field="size32_economy" />
                    <NumberField label="سایز 33" field="size33_economy" />
                    <NumberField label="سایز 34" field="size34_economy" />
                    <NumberField label="سایز 36" field="size36_economy" />
                    <NumberField label="سایز 38" field="size38_economy" />
                    <NumberField label="سایز 40" field="size40_economy" />
                  </SimpleGrid>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Heading size="sm" mb={4}>اقتصادی 2</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
                    <NumberField label="سایز 30" field="size30_economy2" />
                    <NumberField label="سایز 31" field="size31_economy2" />
                    <NumberField label="سایز 32" field="size32_economy2" />
                    <NumberField label="سایز 33" field="size33_economy2" />
                    <NumberField label="سایز 34" field="size34_economy2" />
                    <NumberField label="سایز 36" field="size36_economy2" />
                    <NumberField label="سایز 38" field="size38_economy2" />
                    <NumberField label="سایز 40" field="size40_economy2" />
                  </SimpleGrid>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Heading size="sm" mb={4}>اقتصادی 3</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
                    <NumberField label="سایز 30" field="size30_economy3" />
                    <NumberField label="سایز 31" field="size31_economy3" />
                    <NumberField label="سایز 32" field="size32_economy3" />
                    <NumberField label="سایز 33" field="size33_economy3" />
                    <NumberField label="سایز 34" field="size34_economy3" />
                    <NumberField label="سایز 36" field="size36_economy3" />
                    <NumberField label="سایز 38" field="size38_economy3" />
                    <NumberField label="سایز 40" field="size40_economy3" />
                  </SimpleGrid>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* Sample Sizes */}
          <TabPanel>
            <Card>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
                  <NumberField label="سایز 30" field="size30_sample" />
                  <NumberField label="سایز 31" field="size31_sample" />
                  <NumberField label="سایز 32" field="size32_sample" />
                  <NumberField label="سایز 33" field="size33_sample" />
                  <NumberField label="سایز 34" field="size34_sample" />
                  <NumberField label="سایز 36" field="size36_sample" />
                  <NumberField label="سایز 38" field="size38_sample" />
                  <NumberField label="سایز 40" field="size40_sample" />
                </SimpleGrid>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Stock */}
          <TabPanel>
            <Card>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                    <NumberField label="موجودی پارچه" field="stockFabric" />
                    <NumberField label="موجودی شستشو" field="stockWash" />
                    <NumberField label="موجودی تولید" field="stockProduction" />
                    <NumberField label="موجودی بسته‌بندی" field="stockPackaging" />
                    <NumberField label="قابل فروش" field="saleableCount" />
                    <NumberField label="شستشوی متفاوت" field="differentWash" />
                    <NumberField label="ضایعات" field="waste" />
                    <NumberField label="موجودی منفی" field="stockMinus" />
                    <NumberField label="موجودی مثبت" field="stockPlus" />
                    <NumberField label="بسته‌بندی منفی" field="stockPackagingMinus" />
                  </SimpleGrid>

                  <Heading size="sm" mt={6}>سایزهای موجودی</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
                    <NumberField label="سایز 30" field="size30_stock" />
                    <NumberField label="سایز 31" field="size31_stock" />
                    <NumberField label="سایز 32" field="size32_stock" />
                    <NumberField label="سایز 33" field="size33_stock" />
                    <NumberField label="سایز 34" field="size34_stock" />
                    <NumberField label="سایز 36" field="size36_stock" />
                    <NumberField label="سایز 38" field="size38_stock" />
                    <NumberField label="سایز 40" field="size40_stock" />
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Accessories */}
          <TabPanel>
            <Card>
              <CardBody>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                  <NumberField label="دکمه" field="accessories_button" />
                  <NumberField label="ن rivet" field="accessories_rivet" />
                  <NumberField label="کارت جیب" field="accessories_pocketCard" />
                  <NumberField label="کارت سایز" field="accessories_sizeCard" />
                  <NumberField label="آویز" field="accessories_hanger" />
                  <NumberField label="نوار" field="accessories_band" />
                  <NumberField label="چرم" field="accessories_leather" />
                </SimpleGrid>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Personnel */}
          <TabPanel>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    <InputField label="تکمیل‌کننده" field="finisher" />
                    <InputField label="کنترل‌کننده اولیه" field="initialControl" />
                    <InputField label="کنترل‌کننده" field="controller" />
                  </SimpleGrid>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">توضیحات</FormLabel>
                    <Textarea
                      value={formData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      size="sm"
                      placeholder="توضیحات اضافی..."
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default OrderEdit;