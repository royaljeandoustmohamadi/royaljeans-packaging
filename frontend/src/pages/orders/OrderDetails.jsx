import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Text,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  useToast,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Edit, 
  Trash2, 
  Download, 
  Calendar,
  User,
  Package
} from 'lucide-react';
import ordersService from '../../services/orders.service';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ordersService.getById(id);
      setOrder(response.order);
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در دریافت جزئیات سفارش',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
      try {
        await ordersService.delete(id);
        toast({
          title: 'موفقیت',
          description: 'سفارش با موفقیت حذف شد',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/orders');
      } catch (error) {
        toast({
          title: 'خطا',
          description: 'خطا در حذف سفارش',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'yellow',
      processing: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'در انتظار',
      processing: 'در حال پردازش',
      completed: 'تکمیل شده',
      cancelled: 'لغو شده',
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box textAlign="center" py={10}>
        <Text>سفارش یافت نشد</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <HStack>
          <IconButton
            icon={<ArrowRight />}
            onClick={() => navigate('/orders')}
            variant="ghost"
            size="sm"
          />
          <Heading size="lg">جزئیات سفارش</Heading>
        </HStack>
        
        <HStack>
          <Button
            leftIcon={<Edit />}
            colorScheme="blue"
            onClick={() => navigate(`/orders/${id}/edit`)}
          >
            ویرایش
          </Button>
          <Button
            leftIcon={<Download />}
            variant="outline"
            onClick={() => {
              // TODO: Implement PDF export
              toast({
                title: 'در حال توسعه',
                description: 'خروجی PDF در نسخه بعدی اضافه خواهد شد',
                status: 'info',
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            خروجی PDF
          </Button>
          <Button
            leftIcon={<Trash2 />}
            colorScheme="red"
            variant="outline"
            onClick={handleDelete}
          >
            حذف
          </Button>
        </HStack>
      </HStack>

      <VStack spacing={6} align="stretch">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <Heading size="md">اطلاعات پایه</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={1}>کد سفارش:</Text>
                <Text color="gray.600">{order.code}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>نام سفارش:</Text>
                <Text color="gray.600">{order.name}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>تاریخ:</Text>
                <HStack>
                  <Calendar size={16} />
                  <Text color="gray.600">
                    {new Date(order.date).toLocaleDateString('fa-IR')}
                  </Text>
                </HStack>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>وضعیت:</Text>
                <Badge colorScheme={getStatusColor(order.status)} size="lg">
                  {getStatusText(order.status)}
                </Badge>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>کل تعداد:</Text>
                <Text color="gray.600">{order.totalCount || '-'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>تعداد بسته‌بندی:</Text>
                <Text color="gray.600">{order.packingCount || '-'}</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <Heading size="md">مشخصات محصول</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={1}>نوع پارچه:</Text>
                <Text color="gray.600">{order.fabric || '-'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>شستشو:</Text>
                <Text color="gray.600">{order.stoneWash || '-'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>استایل:</Text>
                <Text color="gray.600">{order.style || '-'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>تأمین‌کننده پارچه:</Text>
                <Text color="gray.600">{order.fabricSupplier || '-'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>تأمین‌کننده تولید:</Text>
                <Text color="gray.600">{order.productionSupplier || '-'}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>نام بسته‌بندی:</Text>
                <Text color="gray.600">{order.packingName || '-'}</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Size Distribution */}
        <Card>
          <CardHeader>
            <Heading size="md">توزیع سایزها</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Healthy Sizes */}
              <Box>
                <Heading size="sm" mb={3} color="green.600">سایزهای سالم</Heading>
                <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={3}>
                  {[
                    { label: '30', value: order.size30_healthy },
                    { label: '31', value: order.size31_healthy },
                    { label: '32', value: order.size32_healthy },
                    { label: '33', value: order.size33_healthy },
                    { label: '34', value: order.size34_healthy },
                    { label: '36', value: order.size36_healthy },
                    { label: '38', value: order.size38_healthy },
                    { label: '40', value: order.size40_healthy },
                  ].map((size) => (
                    <Box key={size.label} textAlign="center" p={2} bg="green.50" borderRadius="md">
                      <Text fontSize="sm" color="gray.600">سایز {size.label}</Text>
                      <Text fontWeight="bold">{size.value || 0}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Economy Sizes */}
              <Box>
                <Heading size="sm" mb={3} color="blue.600">سایزهای اقتصادی</Heading>
                <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={3}>
                  {[
                    { label: '30', value: order.size30_economy },
                    { label: '31', value: order.size31_economy },
                    { label: '32', value: order.size32_economy },
                    { label: '33', value: order.size33_economy },
                    { label: '34', value: order.size34_economy },
                    { label: '36', value: order.size36_economy },
                    { label: '38', value: order.size38_economy },
                    { label: '40', value: order.size40_economy },
                  ].map((size) => (
                    <Box key={size.label} textAlign="center" p={2} bg="blue.50" borderRadius="md">
                      <Text fontSize="sm" color="gray.600">سایز {size.label}</Text>
                      <Text fontWeight="bold">{size.value || 0}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Stock Information */}
        <Card>
          <CardHeader>
            <Heading size="md">اطلاعات موجودی</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={1}>موجودی پارچه:</Text>
                <Text color="gray.600">{order.stockFabric || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>موجودی شستشو:</Text>
                <Text color="gray.600">{order.stockWash || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>موجودی تولید:</Text>
                <Text color="gray.600">{order.stockProduction || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>موجودی بسته‌بندی:</Text>
                <Text color="gray.600">{order.stockPackaging || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>قابل فروش:</Text>
                <Text color="gray.600">{order.saleableCount || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>ضایعات:</Text>
                <Text color="gray.600">{order.waste || 0}</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Accessories */}
        <Card>
          <CardHeader>
            <Heading size="md">ملزومات</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={1}>دکمه:</Text>
                <Text color="gray.600">{order.accessories_button || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>ن rivet:</Text>
                <Text color="gray.600">{order.accessories_rivet || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>کارت جیب:</Text>
                <Text color="gray.600">{order.accessories_pocketCard || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>کارت سایز:</Text>
                <Text color="gray.600">{order.accessories_sizeCard || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>آویز:</Text>
                <Text color="gray.600">{order.accessories_hanger || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>نوار:</Text>
                <Text color="gray.600">{order.accessories_band || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>چرم:</Text>
                <Text color="gray.600">{order.accessories_leather || 0}</Text>
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Personnel & Notes */}
        <Card>
          <CardHeader>
            <Heading size="md">پرسنل و توضیحات</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold" mb={1}>نوع سفارش (BU):</Text>
                  <Text color="gray.600">{order.bu || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={1}>سطح سفارش (BV):</Text>
                  <Text color="gray.600">{order.bv || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={1}>تکمیل‌کننده:</Text>
                  <Text color="gray.600">{order.finisher || '-'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={1}>کنترل‌کننده:</Text>
                  <Text color="gray.600">{order.controller || '-'}</Text>
                </Box>
              </SimpleGrid>
              
              {order.description && (
                <Box>
                  <Text fontWeight="bold" mb={2}>توضیحات:</Text>
                  <Text color="gray.600" whiteSpace="pre-wrap">{order.description}</Text>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Metadata */}
        <Card>
          <CardBody>
            <HStack spacing={6} fontSize="sm" color="gray.500">
              <HStack>
                <User size={16} />
                <Text>ایجاد شده توسط: {order.creator?.fullName || 'نامشخص'}</Text>
              </HStack>
              <HStack>
                <Calendar size={16} />
                <Text>
                  تاریخ ایجاد: {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </Text>
              </HStack>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default OrderDetails;