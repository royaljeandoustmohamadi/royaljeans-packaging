import React from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  HStack,
  Icon,
  Progress,
  Text,
  VStack,
  Badge,
  Button,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

const Notification = ({
  type = 'info', // 'success', 'error', 'warning', 'info'
  title,
  message,
  isClosable = true,
  onClose,
  autoClose = true,
  autoCloseDuration = 5000,
  showProgress = true,
  action,
  persistent = false,
}) => {
  const { isOpen, onOpen, onClose: onCollapseClose } = useDisclosure();

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'green.50',
          borderColor: 'green.200',
          icon: CheckCircle,
          iconColor: 'green.500',
          textColor: 'green.800',
        };
      case 'error':
        return {
          bgColor: 'red.50',
          borderColor: 'red.200',
          icon: XCircle,
          iconColor: 'red.500',
          textColor: 'red.800',
        };
      case 'warning':
        return {
          bgColor: 'yellow.50',
          borderColor: 'yellow.200',
          icon: AlertTriangle,
          iconColor: 'yellow.500',
          textColor: 'yellow.800',
        };
      default:
        return {
          bgColor: 'blue.50',
          borderColor: 'blue.200',
          icon: Info,
          iconColor: 'blue.500',
          textColor: 'blue.800',
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = styles.icon;

  // Auto close functionality
  React.useEffect(() => {
    if (autoClose && !persistent && isOpen) {
      const timer = setTimeout(() => {
        onCollapseClose();
        onClose?.();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDuration, persistent, isOpen, onClose, onCollapseClose]);

  // Start progress on mount
  React.useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Collapse in={isOpen} animateOpacity>
      <Box
        bg={styles.bgColor}
        borderWidth="1px"
        borderColor={styles.borderColor}
        borderRadius="lg"
        p={4}
        position="relative"
        overflow="hidden"
      >
        {/* Progress Bar */}
        {showProgress && autoClose && !persistent && (
          <Progress
            size="xs"
            colorScheme={type === 'error' ? 'red' : type === 'warning' ? 'yellow' : type === 'success' ? 'green' : 'blue'}
            value={0}
            position="absolute"
            top={0}
            left={0}
            right={0}
            zIndex={1}
            sx={{
              '&::before': {
                content: '""',
                display: 'block',
                height: '100%',
                width: '100%',
                background: 'linear-gradient(to right, transparent, currentColor)',
                animation: `progress ${autoCloseDuration}ms linear`,
              },
            }}
          />
        )}

        <HStack align="flex-start" spacing={3} position="relative" zIndex={2}>
          <Icon
            as={IconComponent}
            color={styles.iconColor}
            boxSize={5}
            flexShrink={0}
            mt={0.5}
          />
          <VStack align="flex-start" spacing={1} flex={1}>
            {title && (
              <Text fontWeight="semibold" fontSize="sm" color={styles.textColor}>
                {title}
              </Text>
            )}
            {message && (
              <Text fontSize="sm" color={`${styles.textColor.replace('.800', '.700')}`}>
                {message}
              </Text>
            )}
            {action && action}
          </VStack>
          {isClosable && (
            <IconButton
              icon={<X size={16} />}
              variant="ghost"
              size="sm"
              color={styles.iconColor}
              onClick={() => {
                onCollapseClose();
                onClose?.();
              }}
              aria-label="بستن اعلان"
              flexShrink={0}
            />
          )}
        </HStack>
      </Box>

      <style>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </Collapse>
  );
};

// Notification Container Component
export const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <VStack spacing={2} position="fixed" top={4} left={4} zIndex={9999} maxW="400px">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </VStack>
  );
};

// Quick notification functions
export const showNotification = (notificationManager, {
  type = 'info',
  title,
  message,
  autoClose = true,
  duration = 5000,
}) => {
  const id = Date.now();
  const notification = {
    id,
    type,
    title,
    message,
    autoClose,
    autoCloseDuration: duration,
    showProgress: true,
  };

  notificationManager.add?.(notification);
  return id;
};

// Pre-defined notification types
export const showSuccess = (notificationManager, message, title = 'موفق') => {
  return showNotification(notificationManager, {
    type: 'success',
    title,
    message,
  });
};

export const showError = (notificationManager, message, title = 'خطا') => {
  return showNotification(notificationManager, {
    type: 'error',
    title,
    message,
    autoClose: false, // Error notifications are persistent by default
  });
};

export const showWarning = (notificationManager, message, title = 'هشدار') => {
  return showNotification(notificationManager, {
    type: 'warning',
    title,
    message,
  });
};

export const showInfo = (notificationManager, message, title = 'اطلاعات') => {
  return showNotification(notificationManager, {
    type: 'info',
    title,
    message,
  });
};

export default Notification;