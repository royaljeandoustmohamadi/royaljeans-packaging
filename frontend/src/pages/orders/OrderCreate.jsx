import { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { Save, ArrowRight } from 'lucide-react';
import ordersService from '../../services/orders.service';

const OrderCreate = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    date: new Date().toISOString().split('T')[0],
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
  
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

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

  const SizeInput = ({ label, field }) => (
    <FormControl>
      <FormLabel fontSize="sm">{label}</FormLabel>
      <NumberInput
        min={0}
        value={formData[field] || 0}
        onChange={(value) => handleChange(field, parseInt(value) || 0)}
        size="sm"
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="brand.500" />
      </Box>
    );
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg" color="gray.700">
          ثبت سفارش جدید
        </Heading>
        <Button
          leftIcon={<ArrowRight size={18} />}
          variant="ghost"
          onClick={() => navigate('/orders')}
        >
          بازگشت
        </Button>
      </HStack>

      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab>اطلاعات اصلی</Tab>
          <Tab>سایزبندی سالم</Tab>
          <Tab>سایزبندی اقتصادی</Tab>
          <Tab>نمونه و استوک</Tab>
          <Tab>موجودی و ملزومات</Tab>
          <Tab>توضیحات</Tab>
        </TabList>

        <TabPanels>
          {/* Basic Info Tab */}
          <TabPanel>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>کد سفارش</FormLabel>
                      <Input
                        value={formData.code}
                        onChange={(e) => handleChange('code', e.target.value)}
                        placeholder="مثال: ORD-001"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>نام کالا</FormLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="نام کالا"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
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
                      >
                        <option value="pending">در انتظار</option>
                        <option value="in_progress">در حال انجام</option>
                        <option value="completed">تکمیل شده</option>
                        <option value="cancelled">لغو شده</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl>
                      <FormLabel>تعداد کل</FormLabel>
                      <NumberInput
                        min={0}
                        value={formData.totalCount || 0}
                        onChange={(value) => handleChange('totalCount', parseInt(value) || 0)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel>تعداد بسته‌بندی</FormLabel>
                      <NumberInput
                        min={0}
                        value={formData.packingCount || 0}
                        onChange={(value) => handleChange('packingCount', parseInt(value) || 0)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel>نام بسته‌بندی</FormLabel>
                      <Input
                        value={formData.packingName}
                        onChange={(e) => handleChange('packingName', e.target.value)}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <FormControl>
                      <FormLabel>تأمین‌کننده پارچه</FormLabel>
                      <Input
                        value={formData.fabricSupplier}
                        onChange={(e) => handleChange('fabricSupplier', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>تأمین‌کننده تولید</FormLabel>
                      <Input
                        value={formData.productionSupplier}
                        onChange={(e) => handleChange('productionSupplier', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>استایل</FormLabel>
                      <Input
                        value={formData.style}
                        onChange={(e) => handleChange('style', e.target.value)}
                      />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Healthy Sizes Tab */}
          <TabPanel>
            <Card>
              <CardBody>
                <Heading size="sm" mb={4}>سایزبندی سالم</Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <SizeInput label="سایز 30" field="size30_healthy" />
                  <SizeInput label="سایز 31" field="size31_healthy" />
                  <SizeInput label="سایز 32" field="size32_healthy" />
                  <SizeInput label="سایز 33" field="size33_healthy" />
                  <SizeInput label="سایز 34" field="size34_healthy" />
                  <SizeInput label="سایز 36" field="size36_healthy" />
                  <SizeInput label="سایز 38" field="size38_healthy" />
                  <SizeInput label="سایز 40" field="size40_healthy" />
                </SimpleGrid>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Economy Sizes Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Card>
                <CardBody>
                  <Heading size="sm" mb={4">اقتصادی 1</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <SizeInput label="سایز 30" field="size30_economy" />
                    <SizeInput label="سایز 31" field="size31_economy" />
                    <SizeInput label="سایز 32" field="size32_economy" />
                    <SizeInput label="سایز 33" field="size33_economy" />
                    <SizeInput label="سایز 34" field="size34_economy" />
                    <SizeInput label="سایز 36" field="size36_economy" />
                    <SizeInput label="سایز 38" field="size38_economy" />
                    <SizeInput label="سایز 40" field="size40_economy" />
                  </SimpleGrid>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Heading size="sm" mb={4">اقتصادی 2</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <SizeInput label="سایز 30" field="size30_economy2" />
                    <SizeInput label="سایز 31" field="size31_economy2" />
                    <SizeInput label="سایز 32" field="size32_economy2" />
                    <SizeInput label="سایز 33" field="size33_economy2" />
                    <SizeInput label="سایز 34" field="size34_economy2" />
                    <SizeInput label="سایز 36" field="size36_economy2" />
                    <SizeInput label="سایز 38" field="size38_economy2" />
                    <SizeInput label="سایز 40" field="size40_economy2" />
                  </SimpleGrid>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Heading size="sm" mb={4">اقتصادی 3</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <SizeInput label="سایز 30" field="size30_economy3" />
                    <SizeInput label="سایز 31" field="size31_economy3" />
                    <SizeInput label="سایز 32" field="size32_economy3" />
                    <SizeInput label="سایز 33" field="size33_economy3" />
                    <SizeInput label="سایز 34" field="size34_economy3" />
                    <SizeInput label="سایز 36" field="size36_economy3" />
                    <SizeInput label="سایز 38" field="size38_economy3" />
                    <SizeInput label="سایز 40" field="size40_economy3" />
                  </SimpleGrid>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* Sample and Stock Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Card>
                <CardBody>
                  <Heading size="sm" mb={4">سایزبندی نمونه</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <SizeInput label="سایز 30" field="size30_sample" />
                    <SizeInput label="سایز 31" field="size31_sample" />
                    <SizeInput label="سایز 32" field="size32_sample" />
                    <SizeInput label="سایز 33" field="size33_sample" />
                    <SizeInput label="سایز 34" field="size34_sample" />
                    <SizeInput label="سایز 36" field="size36_sample" />
                    <SizeInput label="سایز 38" field="size38_sample" />
                    <SizeInput label="سایز 40" field="size40_sample" />
                  </SimpleGrid>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Heading size="sm" mb={4">سایزبندی استوک</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <SizeInput label="سایز 30" field="size30_stock" />
                    <SizeInput label="سایز 31" field="size31_stock" />
                    <SizeInput label="سایز 32" field="size32_stock" />
                    <SizeInput label="سایز 33" field="size33_stock" />
                    <SizeInput label="سایز 34" field="size34_stock" />
                    <SizeInput label="سایز 36" field="size36_stock" />
                    <SizeInput label="سایز 38" field="size38_stock" />
                    <SizeInput label="سایز 40" field="size40_stock" />
                  </SimpleGrid>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* Stock and Accessories Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Card>
                <CardBody>
                  <Heading size="sm" mb={4">موجودی</Heading>
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                    <SizeInput label="موجودی پارچه" field="stockFabric" />
                    <SizeInput label="موجودی شستشو" field="stockWash" />
                    <SizeInput label="موجودی تولید" field="stockProduction" />
                    <SizeInput label="موجودی بسته‌بندی" field="stockPackaging" />
                    <SizeInput label="قابل فروش" field="saleableCount" />
                    <SizeInput label="شستشوی متفاوت" field="differentWash" />
                    <SizeInput label="ضایعات" field="waste" />
                    <SizeInput label="کسری موجودی" field="stockMinus" />
                    <SizeInput label="اضافه موجودی" field="stockPlus" />
                    <SizeInput label="کسری بسته‌بندی" field="stockPackagingMinus" />
                  </SimpleGrid>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Heading size="sm" mb={4">ملزومات</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <SizeInput label="دکمه" field="accessories_button" />
                    <SizeInput label="میخ" field="accessories_rivet" />
                    <SizeInput label="کارت جیب" field="accessories_pocketCard" />
                    <SizeInput label="کارت سایز" field="accessories_sizeCard" />
                    <SizeInput label="چوب‌لباسی" field="accessories_hanger" />
                    <SizeInput label="کش" field="accessories_band" />
                    <SizeInput label="چرم" field="accessories_leather" />
                  </SimpleGrid>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* Description Tab */}
          <TabPanel>
            <Card>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>اتمام‌دهنده</FormLabel>
                      <Input
                        value={formData.finisher}
                        onChange={(e) => handleChange('finisher', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>کنترل اولیه</FormLabel>
                      <Input
                        value={formData.initialControl}
                        onChange={(e) => handleChange('initialControl', e.target.value)}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>کنترل‌کننده</FormLabel>
                      <Input
                        value={formData.controller}
                        onChange={(e) => handleChange('controller', e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>نوع سفارش (BU)</FormLabel>
                      <Input
                        value={formData.bu}
                        onChange={(e) => handleChange('bu', e.target.value)}
                      />
                    </FormControl>
                  </SimpleGrid>

                  <FormControl>
                    <FormLabel>سطح سفارش (BV)</FormLabel>
                    <Input
                      value={formData.bv}
                      onChange={(e) => handleChange('bv', e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>توضیحات</FormLabel>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      rows={4}
                      placeholder="توضیحات اضافی..."
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box mt={6}>
        <Button
          leftIcon={<Save size={18} />}
          colorScheme="brand"
          size="lg"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="در حال ذخیره..."
        >
          ذخیره سفارش
        </Button>
      </Box>
    </Box>
  );
};

export default OrderCreate;
