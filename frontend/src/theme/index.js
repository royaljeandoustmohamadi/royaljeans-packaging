import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  jeans: {
    50: '#f5f5f5',
    100: '#e0e0e0',
    200: '#bdbdbd',
    300: '#9e9e9e',
    400: '#757575',
    500: '#616161',
    600: '#424242',
    700: '#37474f',
    800: '#263238',
    900: '#102027',
  },
  status: {
    pending: '#ff9800',
    inProgress: '#2196f3',
    completed: '#4caf50',
    cancelled: '#f44336',
  }
};

const fonts = {
  heading: `'Vazirmatn', 'Tahoma', sans-serif`,
  body: `'Vazirmatn', 'Tahoma', sans-serif`,
};

const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.800',
    },
  },
};

const theme = extendTheme({
  config,
  direction: 'rtl',
  colors,
  fonts,
  styles,
});

export default theme;
