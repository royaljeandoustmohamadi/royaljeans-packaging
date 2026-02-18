import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  IconButton,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Flex,
  Text,
} from '@chakra-ui/react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ordersService from '../../services/orders.service';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'in_progress':
      return 'blue';
    case 'completed':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending':
      return 'در انتظار';
    case 'in_progress':
      return 'در حال انجام';
    case 'completed':
      return 'تکمیل شده';
    case 'cancelled':
      return 'لغو شده';
    default:
      return status;
  }
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersService.getAll();
      setOrders(data.orders || []);
    } catch (err) {
      setError('خطا در دریافت سفارشات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
      try {
        await ordersService.delete(id);
        setOrders(orders.filter(o => o.id !== id));
      } catch (err) {
        alert('خطا در حذف سفارش');
      }
    }
  };

  const filteredOrders = orders.filter(order => 
    order.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" color="brand.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" color="gray.700">
          لیست سفارشات
        </Heading>
        <Button
          leftIcon={<Plus size={18} />}
          colorScheme="brand"
          onClick={() => navigate('/orders/new')}
        >
          سفارش جدید
        </Button>
      </Flex>

      <Card mb={6}>
        <CardBody>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search size={18} color="gray" />
            </InputLeftElement>
            <Input
              placeholder="جستجو بر اساس کد یا نام سفارش..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              focusBorderColor="brand.500"
            />
          </InputGroup>
        </CardBody>
      </Card>

      <Card overflow="hidden">
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>کد سفارش</Th>
                <Th>نام کالا</Th>
                <Th>تاریخ</Th>
                <Th>وضعیت</Th>
                <Th>تعداد کل</Th>
                <Th>ثبت کننده</Th>
                <Th>عملیات</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredOrders.length === 0 ? (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8}>
                    <Text color="gray.500">
                      هیچ سفارشی یافت نشد
                    </Text>
                  </Td>
                </Tr>
              ) : (
                filteredOrders.map((order) => (
                  <Tr key={order.id} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="medium">{order.code}</Td>
                    <Td>{order.name}</Td>
                    <Td>{new Date(order.date).toLocaleDateString('fa-IR')}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </Td>
                    <Td>{order.totalCount || '-'}</Td>
                    <Td>{order.creator?.fullName || '-'}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          size="sm"
                          icon={<Eye size={16} />}
                          aria-label="مشاهده"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        />
                        <IconButton
                          size="sm"
                          icon={<Edit size={16} />}
                          aria-label="ویرایش"
                          variant="ghost"
                          colorScheme="green"
                          onClick={() => navigate(`/orders/${order.id}/edit`)}
                        />
                        <IconButton
                          size="sm"
                          icon={<Trash2 size={16} />}
                          aria-label="حذف"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(order.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
};

export default OrdersList;
