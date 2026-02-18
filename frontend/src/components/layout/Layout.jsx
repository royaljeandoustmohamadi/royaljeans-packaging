import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  IconButton,
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
  Icon,
  VStack,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import {
  Menu as MenuIcon,
  ChevronLeft,
  LogOut,
  User,
  Home,
  Package,
  Users,
  FileText,
  Settings,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const SidebarItem = ({ icon, label, to, isActive }) => {
  const navigate = useNavigate();
  
  return (
    <Tooltip label={label} placement="left">
      <Flex
        align="center"
        p={3}
        mx={2}
        borderRadius="md"
        cursor="pointer"
        bg={isActive ? 'brand.500' : 'transparent'}
        color={isActive ? 'white' : 'gray.600'}
        _hover={{
          bg: isActive ? 'brand.600' : 'gray.100',
        }}
        onClick={() => navigate(to)}
        transition="all 0.2s"
      >
        <Icon as={icon} boxSize={5} />
        <Text ml={3} fontSize="sm" fontWeight="medium">
          {label}
        </Text>
      </Flex>
    </Tooltip>
  );
};

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        w="250px"
        bg={bgColor}
        borderLeft="1px"
        borderColor="gray.200"
        display={{ base: 'none', md: 'block' }}
      >
        <VStack h="full" spacing={0}>
          {/* Logo */}
          <Flex h="16" align="center" justify="center" w="full" borderBottom="1px" borderColor="gray.200">
            <Text fontSize="xl" fontWeight="bold" color="brand.600">
              رویال جینز
            </Text>
          </Flex>

          {/* Navigation */}
          <VStack flex={1} w="full" spacing={1} pt={4}>
            <SidebarItem
              icon={Home}
              label="داشبورد"
              to="/"
              isActive={isActive('/')}
            />
            <SidebarItem
              icon={Package}
              label="سفارشات"
              to="/orders"
              isActive={location.pathname.startsWith('/orders')}
            />
            <SidebarItem
              icon={Users}
              label="پیمانکاران"
              to="/contractors"
              isActive={location.pathname.startsWith('/contractors')}
            />
            <SidebarItem
              icon={FileText}
              label="گزارشات"
              to="/reports"
              isActive={location.pathname.startsWith('/reports')}
            />
            {user?.role === 'ADMIN' && (
              <SidebarItem
                icon={Settings}
                label="مدیریت"
                to="/admin"
                isActive={location.pathname.startsWith('/admin')}
              />
            )}
          </VStack>

          <Divider />

          {/* User Info */}
          <Box p={4} w="full">
            <Flex align="center">
              <Avatar size="sm" name={user?.fullName} bg="brand.500" />
              <Box ml={3}>
                <Text fontSize="sm" fontWeight="medium">
                  {user?.fullName}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {user?.role === 'ADMIN' ? 'مدیر' : user?.role === 'MANAGER' ? 'مدیر محصول' : 'کاربر'}
                </Text>
              </Box>
            </Flex>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Flex flex={1} direction="column" overflow="hidden">
        {/* Header */}
        <Flex
          h="16"
          align="center"
          justify="space-between"
          px={6}
          bg={bgColor}
          borderBottom="1px"
          borderColor="gray.200"
        >
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            icon={<MenuIcon />}
            variant="ghost"
            aria-label="منو"
          />
          
          <Text fontSize="lg" fontWeight="medium" color="gray.700">
            سیستم مدیریت سفارشات
          </Text>

          <Menu>
            <MenuButton>
              <HStack spacing={3}>
                <Avatar size="sm" name={user?.fullName} bg="brand.500" />
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<User size={16} />}>
                پروفایل
              </MenuItem>
              <MenuItem icon={<LogOut size={16} />} onClick={handleLogout} color="red.500">
                خروج
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {/* Page Content */}
        <Box flex={1} p={6} overflow="auto">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
