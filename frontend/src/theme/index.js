import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#fff8e7',
    100: '#feefc3',
    200: '#fdd88a',
    300: '#fbbf24',
    400: '#f59e0b',
    500: '#d97706',
    600: '#b45309',
    700: '#92400e',
    800: '#78350f',
    900: '#451a03',
  },
  dark: {
    50: '#f1f5f9',
    100: '#e2e8f0',
    200: '#94a3b8',
    300: '#64748b',
    400: '#475569',
    500: '#334155',
    600: '#1e293b',
    700: '#111827',
    800: '#0f172a',
    900: '#0b0f1a',
  },
};

const fonts = {
  heading: `'Vazirmatn', 'Tahoma', sans-serif`,
  body: `'Vazirmatn', 'Tahoma', sans-serif`,
};

const styles = {
  global: {
    body: {
      bg: '#0b0f1a',
      color: '#f1f5f9',
      direction: 'rtl',
    },
    '*': {
      boxSizing: 'border-box',
    },
  },
};

const components = {
  Button: {
    defaultProps: {
      colorScheme: 'brand',
    },
  },
};

const theme = extendTheme({
  config,
  direction: 'rtl',
  colors,
  fonts,
  styles,
  components,
});

export default theme;
