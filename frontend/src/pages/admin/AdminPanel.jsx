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
  Card,
  CardBody,
  SimpleGrid,
  useToast,
  Spinner,
  Text,
  IconButton,
  Flex,
  Badge,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Collapse,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Tooltip,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
} from '@chakra-ui/react';
import { 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Settings,
  Factory,
  Scissors,
  Package,
  Palette,
  Layers,
  Tag,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check,
  X,
  Users,
  UserCog,
} from 'lucide-react';
import settingsService from '../../services/settings.service';
import UserManagement from './UserManagement';
import { useNavigate, useLocation } from 'react-router-dom';

const SettingCard = ({ title, icon: Icon, items, onAdd, onEdit, onDelete, colorScheme = 'blue' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const filteredItems = items?.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.value?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem('');
      setIsAdding(false);
    }
  };

  const colorMap = {
    blue: { bg: 'blue.50', color: 'blue.600', border: 'blue.200' },
    green: { bg: 'green.50', color: 'green.600', border: 'green.200' },
    purple: { bg: 'purple.50', color: 'purple.600', border: 'purple.200' },
    orange: { bg: 'orange.50', color: 'orange.600', border: 'orange.200' },
    teal: { bg: 'teal.50', color: 'teal.600', border: 'teal.200' },
    pink: { bg: 'pink.50', color: 'pink.600', border: 'pink.200' },
  };

  const colors = colorMap[colorScheme] || colorMap.blue;

  return (
    <Card 
      bg={cardBg} 
      border="1px" 
      borderColor={borderColor}
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
    >
      <CardBody p={0}>
        {/* Header */}
        <Flex
          p={4}
          align="center"
          justify="space-between"
          cursor="pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          bg={colors.bg}
          borderBottom={isExpanded ? '1px' : 'none'}
          borderColor={colors.border}
          transition="all 0.2s"
          _hover={{ opacity: 0.9 }}
        >
          <HStack spacing={3}>
            <Flex
              w={10}
              h={10}
              align="center"
              justify="center"
              bg={colors.color}
              borderRadius="xl"
              color="white"
              shadow="md"
            >
              <Icon size={20} />
            </Flex>
            <Box>
              <Heading size="sm" color="gray.800">{title}</Heading>
              <Text fontSize="xs" color="gray.500">
                {items?.length || 0} مورد تعریف شده
              </Text>
            </Box>
          </HStack>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </Flex>

        <Collapse in={isExpanded}>
          <Box p={4}>
            {/* Search and Add */}
            <HStack mb={4} spacing={2}>
              <InputGroup size="sm">
                <InputLeftElement>
                  <Search size={14} />
                </InputLeftElement>
                <Input
                  placeholder="جستجو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Button
                size="sm"
                colorScheme={colorScheme}
                leftIcon={<Plus size={14} />}
                onClick={() => setIsAdding(!isAdding)}
              >
                افزودن
              </Button>
            </HStack>

            {/* Add New Input */}
            <Collapse in={isAdding}>
              <HStack mb={4} p={3} bg="gray.50" borderRadius="lg">
                <Input
                  size="sm"
                  placeholder="مقدار جدید را وارد کنید"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={handleAdd}
                  isDisabled={!newItem.trim()}
                >
                  <Check size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setIsAdding(false); setNewItem(''); }}
                >
                  <X size={14} />
                </Button>
              </HStack>
            </Collapse>

            {/* Items List */}
            {filteredItems.length === 0 ? (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <Text fontSize="sm">موردی یافت نشد</Text>
              </Alert>
            ) : (
              <Box
                maxH="300px"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': { width: '4px' },
                  '&::-webkit-scrollbar-thumb': { background: '#CBD5E0', borderRadius: '4px' },
                }}
              >
                <VStack spacing={2} align="stretch">
                  {filteredItems.map((item) => (
                    <Flex
                      key={item.id || item.name}
                      p={3}
                      bg="gray.50"
                      borderRadius="lg"
                      align="center"
                      justify="space-between"
                      transition="all 0.2s"
                      _hover={{ bg: 'gray.100', transform: 'translateX(4px)' }}
                    >
                      <HStack spacing={3}>
                        <Badge colorScheme={colorScheme} fontSize="sm" px={2} py={1}>
                          {item.name || item.value}
                        </Badge>
                        {item.description && (
                          <Text fontSize="xs" color="gray.500">{item.description}</Text>
                        )}
                      </HStack>
                      <HStack spacing={1}>
                        <Tooltip label="ویرایش">
                          <IconButton
                            size="xs"
                            variant="ghost"
                            icon={<Edit size={12} />}
                            onClick={() => onEdit(item)}
                          />
                        </Tooltip>
                        <Tooltip label="حذف">
                          <IconButton
                            size="xs"
                            variant="ghost"
                            colorScheme="red"
                            icon={<Trash2 size={12} />}
                            onClick={() => onDelete(item.id || item.name)}
                          />
                        </Tooltip>
                      </HStack>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardBody>
    </Card>
  );
};

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the users page
  const isUsersPage = location.pathname === '/admin/users';

  // Redirect to users page if navigating directly
  useEffect(() => {
    if (isUsersPage) {
      // User management is handled by a separate route
    }
  }, [isUsersPage]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getAll();
      setSettings(data);
    } catch (err) {
      toast({
        title: 'خطا',
        description: 'دریافت تنظیمات با مشکل مواجه شد',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleAdd = async (type, value) => {
    try {
      setSaving(true);
      const serviceMap = {
        productionSuppliers: settingsService.createProductionSupplier,
        fabricSuppliers: settingsService.createFabricSupplier,
        fabrics: settingsService.createFabric,
        stoneWashes: settingsService.createStoneWash,
        packingNames: settingsService.createPackingName,
        styles: settingsService.createStyle,
        orderTypes: settingsService.createOrderType,
        orderLevels: settingsService.createOrderLevel,
      };

      await serviceMap[type]({ name: value, value });
      await fetchSettings();
      toast({
        title: 'موفق',
        description: 'مورد جدید با موفقیت اضافه شد',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'خطا',
        description: 'افزودن مورد با مشکل مواجه شد',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (type, item) => {
    const newValue = prompt('مقدار جدید را وارد کنید:', item.name || item.value);
    if (!newValue || newValue === (item.name || item.value)) return;

    try {
      setSaving(true);
      const serviceMap = {
        productionSuppliers: settingsService.updateProductionSupplier,
        fabricSuppliers: settingsService.updateFabricSupplier,
        fabrics: settingsService.updateFabric,
        stoneWashes: settingsService.updateStoneWash,
        packingNames: settingsService.updatePackingName,
        styles: settingsService.updateStyle,
        orderTypes: settingsService.updateOrderType,
        orderLevels: settingsService.updateOrderLevel,
      };

      await serviceMap[type](item.id || item.name, { name: newValue, value: newValue });
      await fetchSettings();
      toast({
        title: 'موفق',
        description: 'مورد با موفقیت ویرایش شد',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'خطا',
        description: 'ویرایش مورد با مشکل مواجه شد',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('آیا از حذف این مورد اطمینان دارید؟')) return;

    try {
      setSaving(true);
      const serviceMap = {
        productionSuppliers: settingsService.deleteProductionSupplier,
        fabricSuppliers: settingsService.deleteFabricSupplier,
        fabrics: settingsService.deleteFabric,
        stoneWashes: settingsService.deleteStoneWash,
        packingNames: settingsService.deletePackingName,
        styles: settingsService.deleteStyle,
        orderTypes: settingsService.deleteOrderType,
        orderLevels: settingsService.deleteOrderLevel,
      };

      await serviceMap[type](id);
      await fetchSettings();
      toast({
        title: 'موفق',
        description: 'مورد با موفقیت حذف شد',
        status: 'success',
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: 'خطا',
        description: 'حذف مورد با مشکل مواجه شد',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
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
      {/* Tab Navigation */}
      <Tabs variant="unstyled" mb={6}>
        <TabList
          bg="white"
          borderRadius="lg"
          p={1}
          boxShadow="sm"
          border="1px"
          borderColor="gray.200"
        >
          <Tab
            borderRadius="md"
            px={6}
            py={3}
            fontWeight="medium"
            color="gray.600"
            _selected={{
              bg: 'brand.500',
              color: 'white',
              shadow: 'md',
            }}
            onClick={() => navigate('/admin')}
          >
            <HStack spacing={2}>
              <Settings size={18} />
              <Text>تنظیمات سیستم</Text>
            </HStack>
          </Tab>
          <Tab
            borderRadius="md"
            px={6}
            py={3}
            fontWeight="medium"
            color="gray.600"
            _selected={{
              bg: 'brand.500',
              color: 'white',
              shadow: 'md',
            }}
            onClick={() => navigate('/admin/users')}
          >
            <HStack spacing={2}>
              <Users size={18} />
              <Text>مدیریت کاربران</Text>
            </HStack>
          </Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="brand.500" borderRadius="full" />
      </Tabs>

      {location.pathname === '/admin/users' ? (
        <UserManagement />
      ) : (
        <>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" color="gray.700">
            پنل مدیریت سیستم
          </Heading>
          <Text color="gray.500" mt={1}>
            مدیریت لیست‌های انتخابی و تنظیمات سیستم
          </Text>
        </Box>
        <Button
          leftIcon={<RefreshCw size={18} />}
          variant="outline"
          onClick={fetchSettings}
          isLoading={saving}
        >
          بروزرسانی
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <SettingCard
          title="نام‌های تولیدی"
          icon={Factory}
          items={settings.productionSuppliers}
          colorScheme="green"
          onAdd={(value) => handleAdd('productionSuppliers', value)}
          onEdit={(item) => handleEdit('productionSuppliers', item)}
          onDelete={(id) => handleDelete('productionSuppliers', id)}
        />

        <SettingCard
          title="نام‌های بسته‌بندی"
          icon={Package}
          items={settings.packingNames}
          colorScheme="purple"
          onAdd={(value) => handleAdd('packingNames', value)}
          onEdit={(item) => handleEdit('packingNames', item)}
          onDelete={(id) => handleDelete('packingNames', id)}
        />

        <SettingCard
          title="نام‌های شستشو"
          icon={Scissors}
          items={settings.stoneWashes}
          colorScheme="orange"
          onAdd={(value) => handleAdd('stoneWashes', value)}
          onEdit={(item) => handleEdit('stoneWashes', item)}
          onDelete={(id) => handleDelete('stoneWashes', id)}
        />

        <SettingCard
          title="نام‌های پارچه"
          icon={Palette}
          items={settings.fabrics}
          colorScheme="blue"
          onAdd={(value) => handleAdd('fabrics', value)}
          onEdit={(item) => handleEdit('fabrics', item)}
          onDelete={(id) => handleDelete('fabrics', id)}
        />

        <SettingCard
          title="استایل‌ها"
          icon={Layers}
          items={settings.styles}
          colorScheme="teal"
          onAdd={(value) => handleAdd('styles', value)}
          onEdit={(item) => handleEdit('styles', item)}
          onDelete={(id) => handleDelete('styles', id)}
        />

        <SettingCard
          title="نوع سفارش (BU)"
          icon={Tag}
          items={settings.orderTypes}
          colorScheme="pink"
          onAdd={(value) => handleAdd('orderTypes', value)}
          onEdit={(item) => handleEdit('orderTypes', item)}
          onDelete={(id) => handleDelete('orderTypes', id)}
        />

        <SettingCard
          title="سطح سفارش (BV)"
          icon={Settings}
          items={settings.orderLevels}
          colorScheme="blue"
          onAdd={(value) => handleAdd('orderLevels', value)}
          onEdit={(item) => handleEdit('orderLevels', item)}
          onDelete={(id) => handleDelete('orderLevels', id)}
        />

        <SettingCard
          title="تأمین‌کنندگان پارچه"
          icon={Factory}
          items={settings.fabricSuppliers}
          colorScheme="green"
          onAdd={(value) => handleAdd('fabricSuppliers', value)}
          onEdit={(item) => handleEdit('fabricSuppliers', item)}
          onDelete={(id) => handleDelete('fabricSuppliers', id)}
        />
      </SimpleGrid>
        </>
      )}
    </Box>
  );
};

export default AdminPanel;
