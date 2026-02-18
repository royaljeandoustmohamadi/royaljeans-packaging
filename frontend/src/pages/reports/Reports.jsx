import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Text,
  Select,
  Input,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useToast,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import {
  Download,
  FileSpreadsheet,
  Package,
  Users,
  TrendingUp,
  Calendar,
  Filter,
} from 'lucide-react';
import ordersService from '../../services/orders.service';
import contractorsService from '../../services/contractors.service';
import api from '../../services/api';

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    contractorType: '',
  });
  const [contractors, setContractors] = useState([]);
  const toast = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadInitialData = async () => {
    try {
      const contractorsResponse = await contractorsService.getAll();
      setContractors(contractorsResponse.contractors || []);
    } catch (error) {
      console.error('Error loading contractors:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      setStatsLoading(true);
      const ordersResponse = await ordersService.getAll({ limit: 1000 });
      const orders = ordersResponse.orders || [];

      // Calculate statistics
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const processingOrders = orders.filter(o => o.status === 'processing').length;
      const completedOrders = orders.filter(o => o.status === 'completed').length;
      const totalQuantity = orders.reduce((sum, order) => sum + (order.totalCount || 0), 0);
      const averageQuantity = totalOrders > 0 ? Math.round(totalQuantity / totalOrders) : 0;

      setReportData({
        orders,
        statistics: {
          totalOrders,
          pendingOrders,
          processingOrders,
          completedOrders,
          totalQuantity,
          averageQuantity,
          completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
        },
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
      toast({
        title: 'خطا',
        description: 'خطا در بارگذاری آمار',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    loadStatistics();
  };

  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
      contractorType: '',
    });
  };

  const exportToExcel = async (type) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      
      const response = await api.get(`/reports/excel/${type}?${params.toString()}`, {
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: 'موفقیت',
        description: 'گزارش با موفقیت دانلود شد',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'خطا',
        description: 'خطا در دانلود گزارش',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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

  const getStatusBadge = (status) => {
    return (
      <Badge colorScheme={getStatusColor(status)} size="sm">
        {getStatusText(status)}
      </Badge>
    );
  };

  if (statsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  const { statistics, orders } = reportData || { statistics: {}, orders: [] };

  // Filter orders based on current filters
  const filteredOrders = orders.filter(order => {
    if (filters.startDate && new Date(order.date) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(order.date) > new Date(filters.endDate)) return false;
    if (filters.status && order.status !== filters.status) return false;
    return true;
  });

  return (
    <Box p={6}>
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">گزارشات و آمار</Heading>
        <HStack>
          <Button
            leftIcon={<FileSpreadsheet />}
            colorScheme="green"
            variant="outline"
            onClick={() => exportToExcel('orders')}
            isLoading={loading}
            loadingText="در حال دانلود..."
          >
            خروجی Excel
          </Button>
        </HStack>
      </HStack>

      <VStack spacing={6} align="stretch">
        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>کل سفارشات</StatLabel>
                <StatNumber color="blue.500">{statistics.totalOrders || 0}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  تا امروز
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>سفارشات تکمیل شده</StatLabel>
                <StatNumber color="green.500">{statistics.completedOrders || 0}</StatNumber>
                <StatHelpText>
                  {statistics.completionRate || 0}% کل سفارشات
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>کل تعداد تولید</StatLabel>
                <StatNumber color="purple.500">{statistics.totalQuantity || 0}</StatNumber>
                <StatHelpText>
                  میانگین: {statistics.averageQuantity || 0} عدد
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>سفارشات در انتظار</StatLabel>
                <StatNumber color="orange.500">{statistics.pendingOrders || 0}</StatNumber>
                <StatHelpText>
                  {statistics.processingOrders || 0} در حال پردازش
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <HStack>
                <Filter size={20} />
                <Heading size="md">فیلترها</Heading>
              </HStack>
              <HStack>
                <Button size="sm" onClick={resetFilters}>
                  پاک کردن فیلترها
                </Button>
                <Button size="sm" colorScheme="blue" onClick={applyFilters}>
                  اعمال فیلتر
                </Button>
              </HStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">تاریخ شروع</FormLabel>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  size="sm"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">تاریخ پایان</FormLabel>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  size="sm"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">وضعیت</FormLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  size="sm"
                >
                  <option value="">همه وضعیت‌ها</option>
                  <option value="pending">در انتظار</option>
                  <option value="processing">در حال پردازش</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="cancelled">لغو شده</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">تأمین‌کننده</FormLabel>
                <Select
                  value={filters.contractorType}
                  onChange={(e) => handleFilterChange('contractorType', e.target.value)}
                  size="sm"
                >
                  <option value="">همه تأمین‌کنندگان</option>
                  {contractors.map(contractor => (
                    <option key={contractor.id} value={contractor.type}>
                      {contractor.name} ({contractor.type})
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Recent Orders Table */}
        <Card>
          <CardHeader>
            <Heading size="md">آخرین سفارشات</Heading>
            <Text fontSize="sm" color="gray.600" mt={1}>
              تعداد نتایج: {filteredOrders.length} سفارش
            </Text>
          </CardHeader>
          <CardBody>
            {filteredOrders.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Package size={48} color="gray" />
                <Text color="gray.500" mt={2}>هیچ سفارشی یافت نشد</Text>
              </Box>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>کد سفارش</Th>
                      <Th>نام</Th>
                      <Th>تاریخ</Th>
                      <Th>تعداد</Th>
                      <Th>وضعیت</Th>
                      <Th>تأمین‌کننده</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredOrders.slice(0, 10).map((order) => (
                      <Tr key={order.id}>
                        <Td fontWeight="bold">{order.code}</Td>
                        <Td>{order.name}</Td>
                        <Td>{new Date(order.date).toLocaleDateString('fa-IR')}</Td>
                        <Td>{order.totalCount || 0}</Td>
                        <Td>{getStatusBadge(order.status)}</Td>
                        <Td>
                          <Text fontSize="sm">
                            {order.fabricSupplier || order.productionSupplier || '-'}
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Additional Reports Options */}
        <Card>
          <CardHeader>
            <Heading size="md">گزارشات تکمیلی</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              <Button
                leftIcon={<Download />}
                colorScheme="blue"
                variant="outline"
                onClick={() => exportToExcel('inventory')}
                isLoading={loading}
                loadingText="در حال دانلود..."
              >
                گزارش موجودی
              </Button>

              <Button
                leftIcon={<Download />}
                colorScheme="green"
                variant="outline"
                onClick={() => exportToExcel('contractors')}
                isLoading={loading}
                loadingText="در حال دانلود..."
              >
                گزارش پیمانکاران
              </Button>

              <Button
                leftIcon={<Download />}
                colorScheme="purple"
                variant="outline"
                onClick={() => exportToExcel('summary')}
                isLoading={loading}
                loadingText="در حال دانلود..."
              >
                خلاصه عملکرد
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Reports;