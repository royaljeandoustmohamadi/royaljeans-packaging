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
  Select,
} from '@chakra-ui/react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import contractorsService from '../../services/contractors.service';

const getTypeColor = (type) => {
  switch (type) {
    case 'FABRIC':
      return 'blue';
    case 'PRODUCTION':
      return 'green';
    case 'PACKAGING':
      return 'purple';
    case 'STONE_WASH':
      return 'orange';
    default:
      return 'gray';
  }
};

const getTypeText = (type) => {
  switch (type) {
    case 'FABRIC':
      return 'پارچه';
    case 'PRODUCTION':
      return 'تولید';
    case 'PACKAGING':
      return 'بسته‌بندی';
    case 'STONE_WASH':
      return 'سنگ‌شویی';
    default:
      return type;
  }
};

const ContractorsList = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchContractors();
  }, [typeFilter]);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (typeFilter) params.type = typeFilter;
      const data = await contractorsService.getAll(params);
      setContractors(data.contractors || []);
    } catch (err) {
      setError('خطا در دریافت پیمانکاران');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این پیمانکار اطمینان دارید؟')) {
      try {
        await contractorsService.delete(id);
        setContractors(contractors.filter(c => c.id !== id));
      } catch (err) {
        alert('خطا در حذف پیمانکار');
      }
    }
  };

  const filteredContractors = contractors.filter(contractor => 
    contractor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.phone?.includes(searchTerm)
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
          لیست پیمانکاران
        </Heading>
        <Button
          leftIcon={<Plus size={18} />}
          colorScheme="brand"
          onClick={() => navigate('/contractors/new')}
        >
          پیمانکار جدید
        </Button>
      </Flex>

      <Card mb={6}>
        <CardBody>
          <HStack spacing={4}>
            <InputGroup flex={1}>
              <InputLeftElement pointerEvents="none">
                <Search size={18} color="gray" />
              </InputLeftElement>
              <Input
                placeholder="جستجو بر اساس نام یا شماره تماس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                focusBorderColor="brand.500"
              />
            </InputGroup>
            <Select
              w="200px"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              placeholder="همه انواع"
            >
              <option value="FABRIC">پارچه</option>
              <option value="PRODUCTION">تولید</option>
              <option value="PACKAGING">بسته‌بندی</option>
              <option value="STONE_WASH">سنگ‌شویی</option>
            </Select>
          </HStack>
        </CardBody>
      </Card>

      <Card overflow="hidden">
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>نام</Th>
                <Th>نوع</Th>
                <Th>شماره تماس</Th>
                <Th>ارزیابی‌ها</Th>
                <Th>وضعیت</Th>
                <Th>عملیات</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredContractors.length === 0 ? (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={8}>
                    <Text color="gray.500">
                      هیچ پیمانکاری یافت نشد
                    </Text>
                  </Td>
                </Tr>
              ) : (
                filteredContractors.map((contractor) => (
                  <Tr key={contractor.id} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="medium">{contractor.name}</Td>
                    <Td>
                      <Badge colorScheme={getTypeColor(contractor.type)}>
                        {getTypeText(contractor.type)}
                      </Badge>
                    </Td>
                    <Td dir="ltr">{contractor.phone || '-'}</Td>
                    <Td>
                      <HStack spacing={1}>
                        <Star size={14} color="#ffc107" />
                        <Text fontSize="sm">
                          {contractor._count?.evaluations || 0} ارزیابی
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={contractor.isActive ? 'green' : 'red'}>
                        {contractor.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          size="sm"
                          icon={<Eye size={16} />}
                          aria-label="مشاهده"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => navigate(`/contractors/${contractor.id}`)}
                        />
                        <IconButton
                          size="sm"
                          icon={<Edit size={16} />}
                          aria-label="ویرایش"
                          variant="ghost"
                          colorScheme="green"
                          onClick={() => navigate(`/contractors/${contractor.id}/edit`)}
                        />
                        <IconButton
                          size="sm"
                          icon={<Trash2 size={16} />}
                          aria-label="حذف"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(contractor.id)}
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

export default ContractorsList;
