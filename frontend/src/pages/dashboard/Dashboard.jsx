import { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Text,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { 
  Package, 
  Users, 
  TrendingUp, 
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import ordersService from '../../services/orders.service';
import contractorsService from '../../services/contractors.service';

const StatCard = ({ title, value, helpText, icon, color }) => (
  <Card>
    <CardBody>
      <Stat>
        <StatLabel fontSize="sm" color="gray.500">
          <Icon as={icon} mr={2} color={color} />
          {title}
        </StatLabel>
        <StatNumber fontSize="3xl" mt={2}>
          {value}
        </StatNumber>
        {helpText && (
          <StatHelpText fontSize="xs" color="gray.400">
            {helpText}
          </StatHelpText>
        )}
      </Stat>
    </CardBody>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    totalContractors: 0,
    activeContractors: 0,
    totalQuantity: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch orders and contractors data
      const [ordersResponse, contractorsResponse] = await Promise.all([
        ordersService.getAll({ limit: 1000 }),
        contractorsService.getAll(),
      ]);
      
      const orders = ordersResponse.orders || [];
      const contractors = contractorsResponse.contractors || [];
      
      // Calculate order statistics
      const pending = orders.filter(o => o.status === 'pending').length;
      const processing = orders.filter(o => o.status === 'processing').length;
      const completed = orders.filter(o => o.status === 'completed').length;
      const totalQuantity = orders.reduce((sum, order) => sum + (order.totalCount || 0), 0);
      const completionRate = orders.length > 0 ? Math.round((completed / orders.length) * 100) : 0;
      
      // Calculate contractor statistics
      const activeContractors = contractors.filter(c => c.isActive).length;
      
      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        processingOrders: processing,
        completedOrders: completed,
        totalContractors: contractors.length,
        activeContractors: activeContractors,
        totalQuantity: totalQuantity,
        completionRate: completionRate,
      });
    } catch (err) {
      setError('خطا در دریافت آمار');
    } finally {
      setLoading(false);
    }
  };

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
      <Heading mb={6} size="lg" color="gray.700">
        داشبورد
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          title="کل سفارشات"
          value={stats.totalOrders}
          helpText={`کل تولید: ${stats.totalQuantity.toLocaleString()} عدد`}
          icon={Package}
          color="blue.500"
        />
        <StatCard
          title="در انتظار"
          value={stats.pendingOrders}
          helpText="سفارشات در انتظار پردازش"
          icon={Clock}
          color="orange.500"
        />
        <StatCard
          title="در حال پردازش"
          value={stats.processingOrders}
          helpText="سفارشات در حال انجام"
          icon={AlertCircle}
          color="yellow.500"
        />
        <StatCard
          title="تکمیل شده"
          value={stats.completedOrders}
          helpText={`نرخ موفقیت: ${stats.completionRate}%`}
          icon={CheckCircle}
          color="green.500"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          title="کل پیمانکاران"
          value={stats.totalContractors}
          helpText="تعداد کل پیمانکاران"
          icon={Users}
          color="purple.500"
        />
        <StatCard
          title="پیمانکاران فعال"
          value={stats.activeContractors}
          helpText="پیمانکاران در حال همکاری"
          icon={TrendingUp}
          color="green.600"
        />
        <StatCard
          title="نرخ تکمیل"
          value={`${stats.completionRate}%`}
          helpText="درصد سفارشات تکمیل شده"
          icon={CheckCircle}
          color="blue.500"
        />
        <StatCard
          title="میانگین تولید"
          value={stats.totalOrders > 0 ? Math.round(stats.totalQuantity / stats.totalOrders) : 0}
          helpText="میانگین تعداد هر سفارش"
          icon={Package}
          color="cyan.500"
        />
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>
            خوش آمدید
          </Heading>
          <Text color="gray.600">
            به سیستم مدیریت سفارشات رویال جینز خوش آمدید. 
            از منوی سمت راست می‌توانید به بخش‌های مختلف سیستم دسترسی داشته باشید.
          </Text>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Dashboard;
