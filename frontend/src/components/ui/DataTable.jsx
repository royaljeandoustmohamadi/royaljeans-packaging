import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Text,
  Flex,
} from '@chakra-ui/react';
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  pagination = null,
  actions = true,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const allSelected = data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
    >
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              {selectable && (
                <Th w="40px" px={4}>
                  <Checkbox
                    isChecked={allSelected}
                    isIndeterminate={someSelected}
                    onChange={(e) => onSelectAll?.(e.target.checked)}
                    colorScheme="brand"
                  />
                </Th>
              )}
              {columns.map((column) => (
                <Th
                  key={column.key}
                  textAlign={column.align || 'right'}
                  color="gray.600"
                  fontWeight="semibold"
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  py={4}
                >
                  {column.header}
                </Th>
              ))}
              {actions && <Th w="60px"></Th>}
            </Tr>
          </Thead>
          <Tbody>
            {data.length === 0 ? (
              <Tr>
                <Td
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  textAlign="center"
                  py={10}
                >
                  <Text color="gray.500">داده‌ای یافت نشد</Text>
                </Td>
              </Tr>
            ) : (
              data.map((row, rowIndex) => (
                <Tr
                  key={row.id || rowIndex}
                  _hover={{ bg: hoverBg }}
                  cursor={onRowClick ? 'pointer' : 'default'}
                  onClick={() => onRowClick?.(row)}
                  bg={selectedRows.includes(row.id) ? 'blue.50' : 'transparent'}
                  transition="background 0.2s"
                >
                  {selectable && (
                    <Td w="40px" px={4} onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        isChecked={selectedRows.includes(row.id)}
                        onChange={(e) => onSelectRow?.(row.id, e.target.checked)}
                        colorScheme="brand"
                      />
                    </Td>
                  )}
                  {columns.map((column) => (
                    <Td
                      key={column.key}
                      textAlign={column.align || 'right'}
                      py={4}
                      fontSize="sm"
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </Td>
                  ))}
                  {actions && (
                    <Td w="60px" onClick={(e) => e.stopPropagation()}>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVertical size={18} />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem>مشاهده</MenuItem>
                          <MenuItem>ویرایش</MenuItem>
                          <MenuItem color="red.500">حذف</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  )}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      {pagination && (
        <Flex
          p={4}
          justify="space-between"
          align="center"
          borderTopWidth="1px"
          borderColor={borderColor}
        >
          <Text fontSize="sm" color="gray.500">
            نمایش {(pagination.page - 1) * pagination.pageSize + 1} تا{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} از{' '}
            {pagination.total} رکورد
          </Text>
          <HStack spacing={2}>
            <IconButton
              icon={<ChevronRight size={18} />}
              variant="outline"
              size="sm"
              isDisabled={pagination.page === 1}
              onClick={() => pagination.onPageChange?.(pagination.page - 1)}
              aria-label="صفحه قبل"
            />
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <IconButton
                key={page}
                icon={<Text>{page}</Text>}
                variant={pagination.page === page ? 'solid' : 'outline'}
                colorScheme={pagination.page === page ? 'brand' : 'gray'}
                size="sm"
                onClick={() => pagination.onPageChange?.(page)}
                aria-label={`صفحه ${page}`}
              />
            ))}
            <IconButton
              icon={<ChevronLeft size={18} />}
              variant="outline"
              size="sm"
              isDisabled={pagination.page === pagination.totalPages}
              onClick={() => pagination.onPageChange?.(pagination.page + 1)}
              aria-label="صفحه بعد"
            />
          </HStack>
        </Flex>
      )}
    </Box>
  );
};

export default DataTable;