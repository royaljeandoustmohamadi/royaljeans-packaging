import {
  Box,
  Flex,
  Text,
  Icon,
  HStack,
  VStack,
  Badge,
  Avatar,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: IconComponent,
  colorScheme = 'brand',
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'green.500';
      case 'decrease':
        return 'red.500';
      default:
        return 'gray.500';
    }
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'lg',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <Flex justify="space-between" align="flex-start" mb={4}>
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="sm" color="gray.500" fontWeight="medium">
            {title}
          </Text>
          <Text fontSize="3xl" fontWeight="bold" color={`${colorScheme}.600`}>
            {value}
          </Text>
        </VStack>
        <Box
          p={3}
          bg={`${colorScheme}.100`}
          borderRadius="lg"
          color={`${colorScheme}.600`}
        >
          <Icon as={IconComponent} boxSize={6} />
        </Box>
      </Flex>
      
      {change && (
        <HStack spacing={2}>
          <Badge
            colorScheme={changeType === 'increase' ? 'green' : changeType === 'decrease' ? 'red' : 'gray'}
            variant="subtle"
            borderRadius="full"
            px={2}
            py={1}
          >
            <Text fontSize="xs" fontWeight="bold">
              {changeType === 'increase' ? '↑' : changeType === 'decrease' ? '↓' : '→'} {change}
            </Text>
          </Badge>
        </HStack>
      )}
    </Box>
  );
};

export default StatCard;