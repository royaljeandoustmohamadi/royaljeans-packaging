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
  ClipboardList 
} from 'lucide-react';
import ordersService from '../../services/orders.service';

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
    completedOrders: 0,
    totalContractors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const ordersData = await ordersService.getAll({ limit: 1000 });
      const orders = ordersData.orders || [];
      
      const pending = orders.filter(o => o.status === 'pending').length;
      const completed = orders.filter(o => o.status === 'completed').length;
      
      setStats({
        totalOrders: orders.length,
        pendingOrders: pending,
        completedOrders: completed,
        totalContractors: 0, // Will be fetched from contractors API
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
          helpText="تمام سفارشات ثبت شده"
          icon={Package}
          color="blue.500"
        />
        <StatCard
          title="سفارشات در انتظار"
          value={stats.pendingOrders}
          helpText="سفارشات در حال بررسی"
          icon={ClipboardList}
          color="orange.500"
        />
        <StatCard
          title="سفارشات تکمیل شده"
          value={stats.completedOrders}
          helpText="سفارشات به اتمام رسیده"
          icon={TrendingUp}
          color="green.500"
        />
        <StatCard
          title="پیمانکاران"
          value={stats.totalContractors}
          helpText="تعداد پیمانکاران فعال"
          icon={Users}
          color="purple.500"
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
