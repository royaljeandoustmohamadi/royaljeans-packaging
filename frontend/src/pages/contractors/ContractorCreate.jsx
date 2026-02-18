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
  Textarea,
  Card,
  CardBody,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowRight } from 'lucide-react';
import contractorsService from '../../services/contractors.service';

const ContractorCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'FABRIC',
    phone: '',
    address: '',
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) {
      toast({
        title: 'خطا',
        description: 'نام و نوع پیمانکار اجباری است',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      await contractorsService.create(formData);
      
      toast({
        title: 'موفقیت',
        description: 'پیمانکار جدید با موفقیت ایجاد شد',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      navigate('/contractors');
    } catch (error) {
      toast({
        title: 'خطا',
        description: error.response?.data?.message || 'خطا در ایجاد پیمانکار',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6}>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <HStack>
          <Button
            leftIcon={<ArrowRight />}
            onClick={() => navigate('/contractors')}
            variant="ghost"
          >
            بازگشت
          </Button>
          <Heading size="lg">ثبت پیمانکار جدید</Heading>
        </HStack>
        
        <Button
          leftIcon={<Save />}
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="در حال ذخیره..."
        >
          ذخیره پیمانکار
        </Button>
      </HStack>

      <Card maxW="800px">
        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Basic Information */}
            <Box>
              <Heading size="md" mb={4}>اطلاعات پایه</Heading>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>نام پیمانکار</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="نام کامل پیمانکار"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>نوع پیمانکار</FormLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                  >
                    <option value="FABRIC">تأمین پارچه</option>
                    <option value="PRODUCTION">تولید</option>
                    <option value="PACKAGING">بسته‌بندی</option>
                    <option value="STONE_WASH">شستشو</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>شماره تماس</FormLabel>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="مثال: 09121234567"
                    type="tel"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>آدرس</FormLabel>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="آدرس کامل"
                  />
                </FormControl>
              </VStack>
            </Box>

            {/* Additional Information */}
            <Box>
              <Heading size="md" mb={4}>اطلاعات تکمیلی</Heading>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>یادداشت‌ها</FormLabel>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="یادداشت‌ها، توضیحات اضافی، یا نکات مهم در مورد این پیمانکار..."
                    rows={6}
                  />
                </FormControl>
              </VStack>
            </Box>

            {/* Contractor Type Information */}
            <Box bg="blue.50" p={4} borderRadius="md">
              <Heading size="sm" mb={2} color="blue.700">
                راهنمای نوع پیمانکار
              </Heading>
              <VStack align="start" spacing={2} fontSize="sm" color="blue.600">
                <Box>
                  <strong>تأمین پارچه:</strong> شرکت‌هایی که پارچه و مواد اولیه را تأمین می‌کنند
                </Box>
                <Box>
                  <strong>تولید:</strong> کارگاه‌ها و کارخانه‌هایی که عملیات تولید را انجام می‌دهند
                </Box>
                <Box>
                  <strong>بسته‌بندی:</strong> شرکت‌هایی که خدمات بسته‌بندی و آماده‌سازی نهایی را ارائه می‌دهند
                </Box>
                <Box>
                  <strong>شستشو:</strong> مراکز شستشو و آب‌کشی که عملیات شستشوی نهایی را انجام می‌دهند
                </Box>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default ContractorCreate;