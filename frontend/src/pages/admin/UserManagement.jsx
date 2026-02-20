import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Card,
  CardBody,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  CardHeader,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Switch,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Grid,
  GridItem,
  Image,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Shield,
  Users,
  Filter,
  Mail,
  Phone,
  Calendar,
  X,
  Save,
  ImagePlus,
} from 'lucide-react';
import userService from '../../services/user.service';

const UserManagement = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Form state for editing user
  const [editFormData, setEditFormData] = useState({
    displayName: '',
    nickname: '',
    phone: '',
    bio: '',
    avatar: '',
    role: 'USER',
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getAll();
      setUsers(data.users);
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'خطا در دریافت کاربران',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'red';
      case 'MANAGER':
        return 'purple';
      default:
        return 'blue';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'مدیر';
      case 'MANAGER':
        return 'مدیر محصول';
      default:
        return 'کاربر';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      displayName: user.displayName || '',
      nickname: user.nickname || '',
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      role: user.role || 'USER',
      isActive: user.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      await userService.updateUser(selectedUser.id, editFormData);
      toast({
        title: 'موفق',
        description: 'کاربر با موفقیت به‌روزرسانی شد',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      fetchUsers();
      setIsEditModalOpen(false);
    } catch (error) {
      toast({
        title: 'خطا',
        description: error.response?.data?.message || 'خطا در به‌روزرسانی کاربر',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      toast({
        title: 'موفق',
        description: 'کاربر با موفقیت حذف شد',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: 'خطا',
        description: error.response?.data?.message || 'خطا در حذف کاربر',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  return (
    <Box maxW="7xl" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" mb={2}>
              مدیریت کاربران
            </Heading>
            <Text color="gray.500">
              مدیریت کاربران و دسترسی‌های سیستم
            </Text>
          </Box>
          <HStack spacing={3}>
            <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
              {filteredUsers.length} کاربر
            </Badge>
          </HStack>
        </Flex>

        {/* Filters */}
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Flex gap={4} wrap="wrap">
              <InputGroup maxW="400px">
                <InputLeftElement>
                  <Search color="#A0AEC0" />
                </InputLeftElement>
                <Input
                  placeholder="جستجو در نام، ایمیل، نام مستعار..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </InputGroup>

              <Select
                maxW="200px"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                placeholder="همه نقش‌ها"
              >
                <option value="ADMIN">مدیر</option>
                <option value="MANAGER">مدیر محصول</option>
                <option value="USER">کاربر</option>
              </Select>

              <Select
                maxW="200px"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                placeholder="همه وضعیت‌ها"
              >
                <option value="active">فعال</option>
                <option value="inactive">غیرفعال</option>
              </Select>

              {(searchQuery || roleFilter || statusFilter) && (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('');
                    setStatusFilter('');
                  }}
                  rightIcon={<X size={18} />}
                >
                  پاک کردن
                </Button>
              )}
            </Flex>
          </CardBody>
        </Card>

        {/* Users Table */}
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} overflow="hidden">
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>کاربر</Th>
                  <Th>نام مستعار</Th>
                  <Th>ایمیل</Th>
                  <Th>نقش</Th>
                  <Th>وضعیت</Th>
                  <Th>تاریخ عضویت</Th>
                  <Th textAlign="left">عملیات</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id} _hover={{ bg: 'gray.50' }}>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar
                          size="sm"
                          name={user.displayName}
                          src={user.avatar}
                          bg="brand.500"
                        />
                        <Box>
                          <Text fontWeight="medium">{user.displayName}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {user.phone || '-'}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontFamily="mono">@{user.nickname}</Text>
                    </Td>
                    <Td>
                      <Text color="gray.600">{user.email}</Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={user.isActive ? 'green' : 'red'}
                      >
                        {user.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.500">
                        {formatDate(user.createdAt)}
                      </Text>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVertical size={18} />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem
                            icon={<Eye size={16} />}
                            onClick={() => handleViewUser(user)}
                          >
                            مشاهده
                          </MenuItem>
                          <MenuItem
                            icon={<Edit size={16} />}
                            onClick={() => handleEditUser(user)}
                          >
                            ویرایش
                          </MenuItem>
                          <MenuItem
                            icon={<Trash2 size={16} />}
                            color="red.500"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            حذف
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {filteredUsers.length === 0 && (
            <Box p={8} textAlign="center">
              <Text color="gray.500">کاربری یافت نشد</Text>
            </Box>
          )}
        </Card>

        {/* View User Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              اطلاعات کاربر
            </DrawerHeader>

            <DrawerBody>
              {selectedUser && (
                <VStack spacing={6} align="stretch" py={4}>
                  {/* Avatar */}
                  <Flex justify="center">
                    <Avatar
                      size="2xl"
                      name={selectedUser.displayName}
                      src={selectedUser.avatar}
                      bg="brand.500"
                    />
                  </Flex>

                  {/* Basic Info */}
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="bold" fontSize="lg">
                        {selectedUser.displayName}
                      </Text>
                      <Badge
                        colorScheme={getRoleBadgeColor(selectedUser.role)}
                        fontSize="sm"
                      >
                        {getRoleLabel(selectedUser.role)}
                      </Badge>
                    </HStack>

                    <Divider />

                    <VStack spacing={3} align="stretch">
                      <HStack>
                        <Mail size={18} color="#A0AEC0" />
                        <Box>
                          <Text fontSize="xs" color="gray.500">
                            ایمیل
                          </Text>
                          <Text>{selectedUser.email}</Text>
                        </Box>
                      </HStack>

                      <HStack>
                        <Users size={18} color="#A0AEC0" />
                        <Box>
                          <Text fontSize="xs" color="gray.500">
                            نام مستعار
                          </Text>
                          <Text fontFamily="mono">
                            @{selectedUser.nickname}
                          </Text>
                        </Box>
                      </HStack>

                      <HStack>
                        <Phone size={18} color="#A0AEC0" />
                        <Box>
                          <Text fontSize="xs" color="gray.500">
                            شماره تماس
                          </Text>
                          <Text>{selectedUser.phone || '-'}</Text>
                        </Box>
                      </HStack>

                      <HStack>
                        <Calendar size={18} color="#A0AEC0" />
                        <Box>
                          <Text fontSize="xs" color="gray.500">
                            تاریخ عضویت
                          </Text>
                          <Text>{formatDate(selectedUser.createdAt)}</Text>
                        </Box>
                      </HStack>
                    </VStack>

                    <Divider />

                    {/* Bio */}
                    <Box>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        درباره
                      </Text>
                      <Text>{selectedUser.bio || '-'}</Text>
                    </Box>

                    {/* Status */}
                    <HStack justify="space-between">
                      <Text>وضعیت حساب</Text>
                      <Badge
                        colorScheme={selectedUser.isActive ? 'green' : 'red'}
                      >
                        {selectedUser.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </HStack>
                </VStack>
              )}
            </DrawerBody>

            <DrawerFooter>
              <Button variant="ghost" ml={3} onClick={onClose}>
                بستن
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Edit User Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ویرایش کاربر</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs isFitted>
                <TabList mb={4}>
                  <Tab>اطلاعات اصلی</Tab>
                  <Tab>دسترسی‌ها</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel px={0}>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>نام اصلی</FormLabel>
                        <Input
                          value={editFormData.displayName}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              displayName: e.target.value,
                            }))
                          }
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>نام مستعار</FormLabel>
                        <Input
                          value={editFormData.nickname}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              nickname: e.target.value,
                            }))
                          }
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>شماره تماس</FormLabel>
                        <Input
                          value={editFormData.phone}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>درباره</FormLabel>
                        <Textarea
                          value={editFormData.bio}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          rows={3}
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>

                  <TabPanel px={0}>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>نقش کاربر</FormLabel>
                        <Select
                          value={editFormData.role}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              role: e.target.value,
                            }))
                          }
                        >
                          <option value="USER">کاربر</option>
                          <option value="MANAGER">مدیر محصول</option>
                          <option value="ADMIN">مدیر سیستم</option>
                        </Select>
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel mb={0}>وضعیت فعال</FormLabel>
                        <Switch
                          isChecked={editFormData.isActive}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              isActive: e.target.checked,
                            }))
                          }
                          colorScheme="green"
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" ml={3} onClick={() => setIsEditModalOpen(false)}>
                لغو
              </Button>
              <Button
                colorScheme="brand"
                onClick={handleSaveUser}
                rightIcon={<Save size={18} />}
              >
                ذخیره
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default UserManagement;
