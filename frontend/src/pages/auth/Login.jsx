import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  Card,
  CardBody,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'خطا',
        description: 'لطفاً ایمیل و رمز عبور را وارد کنید',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await login(email, password);
      toast({
        title: 'ورود موفقیت‌آمیز',
        description: 'به سیستم مدیریت رویال جینز خوش آمدید',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'خطا در ورود',
        description: error || 'ایمیل یا رمز عبور اشتباه است',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Card boxShadow="lg">
        <CardBody p={8}>
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Heading size="lg" color="brand.600">
              سیستم مدیریت رویال جینز
            </Heading>
            <Text color="gray.500" fontSize="sm">
              لطفاً برای ادامه وارد شوید
            </Text>

            <FormControl isRequired>
              <FormLabel>ایمیل</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                focusBorderColor="brand.500"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>رمز عبور</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  focusBorderColor="brand.500"
                />
                <InputRightElement>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              width="full"
              size="lg"
              isLoading={isLoading}
              loadingText="در حال ورود..."
            >
              ورود
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login;
