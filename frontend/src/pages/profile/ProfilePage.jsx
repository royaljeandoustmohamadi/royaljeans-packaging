import { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Avatar,
  AvatarBadge,
  IconButton,
  useToast,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormHelperText,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Switch,
  Select,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  Camera,
  Mail,
  Phone,
  Calendar,
  Shield,
  Save,
  Lock,
  User,
  Edit3,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import userService from '../../services/user.service';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    nickname: user?.nickname || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result;
        setProfileData((prev) => ({ ...prev, avatar: avatarUrl }));
        handleProfileUpdate({ avatar: avatarUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (data) => {
    setIsLoading(true);
    try {
      const response = await userService.updateProfile(user.id, data);
      updateUser(response.user);
      toast({
        title: 'موفق',
        description: 'پروفایل با موفقیت به‌روزرسانی شد',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
    } catch (error) {
      toast({
        title: 'خطا',
        description: error.response?.data?.message || 'خطا در به‌روزرسانی پروفایل',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    handleProfileUpdate(profileData);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'خطا',
        description: 'رمزهای عبور جدید مطابقت ندارند',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'خطا',
        description: 'رمز عبور جدید باید حداقل 6 کاراکتر باشد',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword(
        user.id,
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast({
        title: 'موفق',
        description: 'رمز عبور با موفقیت تغییر کرد',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast({
        title: 'خطا',
        description:
          error.response?.data?.message || 'خطا در تغییر رمز عبور',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-left',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

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
        return 'مدیر سیستم';
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

  return (
    <Box maxW="6xl" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>
            پروفایل کاربری
          </Heading>
          <Text color="gray.500">
            اطلاعات شخصی خود را مدیریت کنید
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={6}>
          {/* Right Sidebar - User Info */}
          <GridItem>
            <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4}>
                  {/* Avatar */}
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      name={user?.displayName}
                      src={profileData.avatar}
                      bg="brand.500"
                    >
                      <AvatarBadge
                        as={IconButton}
                        size="sm"
                        rounded="full"
                        top="-2"
                        colorScheme="brand"
                        aria-label="تغییر عکس"
                        icon={<Camera size={16} />}
                        onClick={handleAvatarClick}
                      />
                    </Avatar>
                  </Box>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  {/* User Info */}
                  <VStack spacing={1}>
                    <Heading size="md">{user?.displayName}</Heading>
                    <Text color="gray.500" fontSize="sm">
                      @{user?.nickname}
                    </Text>
                    <Badge colorScheme={getRoleBadgeColor(user?.role)}>
                      {getRoleLabel(user?.role)}
                    </Badge>
                  </VStack>

                  <Divider />

                  {/* Info Items */}
                  <VStack spacing={3} w="full" align="stretch">
                    <HStack spacing={3}>
                      <Icon as={Mail} color="gray.400" />
                      <Text fontSize="sm" color="gray.600" isTruncated>
                        {user?.email}
                      </Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={Calendar} color="gray.400" />
                      <Text fontSize="sm" color="gray.600">
                        عضو از {formatDate(user?.createdAt)}
                      </Text>
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Left Content - Forms */}
          <GridItem>
            <Tabs isFitted variant="enclosed">
              <TabList mb={4}>
                <Tab
                  _selected={{ color: 'brand.500', borderColor: 'brand.500' }}
                >
                  <HStack>
                    <Edit3 size={18} />
                    <Text>اطلاعات شخصی</Text>
                  </HStack>
                </Tab>
                <Tab
                  _selected={{ color: 'brand.500', borderColor: 'brand.500' }}
                >
                  <HStack>
                    <Lock size={18} />
                    <Text>تغییر رمز عبور</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Profile Info Tab */}
                <TabPanel p={0}>
                  <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <form onSubmit={handleProfileSubmit}>
                        <VStack spacing={6} align="stretch">
                          {/* Names Section */}
                          <Box>
                            <Heading size="sm" mb={4}>
                              نام‌ها
                            </Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              <FormControl isReadOnly>
                                <FormLabel>نام اصلی</FormLabel>
                                <InputGroup>
                                  <InputLeftElement>
                                    <User color="#A0AEC0" />
                                  </InputLeftElement>
                                  <Input
                                    value={user?.displayName || ''}
                                    isReadOnly
                                    bg="gray.100"
                                  />
                                </InputGroup>
                                <FormHelperText>
                                  فقط مدیر سیستم می‌تواند این فیلد را تغییر دهد
                                </FormHelperText>
                              </FormControl>

                              <FormControl>
                                <FormLabel>نام مستعار</FormLabel>
                                <InputGroup>
                                  <InputLeftElement>
                                    <Edit3 color="#A0AEC0" />
                                  </InputLeftElement>
                                  <Input
                                    name="nickname"
                                    value={profileData.nickname}
                                    onChange={handleProfileChange}
                                    placeholder="نام مستعار خود را وارد کنید"
                                  />
                                </InputGroup>
                                <FormHelperText>
                                  این نام در سیستم نمایش داده می‌شود
                                </FormHelperText>
                              </FormControl>
                            </SimpleGrid>
                          </Box>

                          <Divider />

                          {/* Contact Info Section */}
                          <Box>
                            <Heading size="sm" mb={4}>
                              اطلاعات تماس
                            </Heading>
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              <FormControl>
                                <FormLabel>شماره تماس</FormLabel>
                                <InputGroup>
                                  <InputLeftElement>
                                    <Phone color="#A0AEC0" />
                                  </InputLeftElement>
                                  <Input
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileChange}
                                    placeholder="شماره تماس خود را وارد کنید"
                                  />
                                </InputGroup>
                              </FormControl>

                              <FormControl isReadOnly>
                                <FormLabel>ایمیل</FormLabel>
                                <InputGroup>
                                  <InputLeftElement>
                                    <Mail color="#A0AEC0" />
                                  </InputLeftElement>
                                  <Input
                                    value={user?.email || ''}
                                    isReadOnly
                                    bg="gray.100"
                                  />
                                </InputGroup>
                                <FormHelperText>
                                  ایمیل قابل تغییر نیست
                                </FormHelperText>
                              </FormControl>
                            </SimpleGrid>
                          </Box>

                          <Divider />

                          {/* Bio Section */}
                          <Box>
                            <Heading size="sm" mb={4}>
                              درباره من
                            </Heading>
                            <FormControl>
                              <FormLabel>توضیحات</FormLabel>
                              <Textarea
                                name="bio"
                                value={profileData.bio}
                                onChange={handleProfileChange}
                                placeholder="توضیحاتی درباره خودتان بنویسید..."
                                rows={4}
                              />
                            </FormControl>
                          </Box>

                          <Button
                            type="submit"
                            colorScheme="brand"
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={<Save size={20} />}
                          >
                            ذخیره تغییرات
                          </Button>
                        </VStack>
                      </form>
                    </CardBody>
                  </Card>
                </TabPanel>

                {/* Password Change Tab */}
                <TabPanel p={0}>
                  <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <form onSubmit={handlePasswordChange}>
                        <VStack spacing={6} align="stretch">
                          <Box>
                            <Heading size="sm" mb={4}>
                              تغییر رمز عبور
                            </Heading>
                            <Text color="gray.500" fontSize="sm" mb={4}>
                              برای تغییر رمز عبور، رمز عبور فعلی و جدید خود را وارد
                              کنید
                            </Text>
                          </Box>

                          <FormControl isRequired>
                            <FormLabel>رمز عبور فعلی</FormLabel>
                            <InputGroup>
                              <InputLeftElement>
                                <Lock color="#A0AEC0" />
                              </InputLeftElement>
                              <Input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                  setPasswordData((prev) => ({
                                    ...prev,
                                    currentPassword: e.target.value,
                                  }))
                                }
                                placeholder="رمز عبور فعلی را وارد کنید"
                              />
                            </InputGroup>
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel>رمز عبور جدید</FormLabel>
                            <InputGroup>
                              <InputLeftElement>
                                <Lock color="#A0AEC0" />
                              </InputLeftElement>
                              <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                  setPasswordData((prev) => ({
                                    ...prev,
                                    newPassword: e.target.value,
                                  }))
                                }
                                placeholder="رمز عبور جدید را وارد کنید"
                              />
                            </InputGroup>
                            <FormHelperText>
                              رمز عبور باید حداقل 6 کاراکتر باشد
                            </FormHelperText>
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel>تکرار رمز عبور جدید</FormLabel>
                            <InputGroup>
                              <InputLeftElement>
                                <Lock color="#A0AEC0" />
                              </InputLeftElement>
                              <Input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                  setPasswordData((prev) => ({
                                    ...prev,
                                    confirmPassword: e.target.value,
                                  }))
                                }
                                placeholder="رمز عبور جدید را再次 وارد کنید"
                              />
                            </InputGroup>
                          </FormControl>

                          <Button
                            type="submit"
                            colorScheme="brand"
                            size="lg"
                            isLoading={isChangingPassword}
                            rightIcon={<Lock size={20} />}
                          >
                            تغییر رمز عبور
                          </Button>
                        </VStack>
                      </form>
                    </CardBody>
                  </Card>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default ProfilePage;
