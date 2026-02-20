// UI Components
export { default as StatCard } from './StatCard';
export { default as DataTable } from './DataTable';
export { 
  Notification, 
  NotificationContainer, 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo 
} from './Notification';

// Re-export specific notification functions for convenience
export const showNotification = (manager, options) => {
  const { showSuccess, showError, showWarning, showInfo } = require('./Notification');
  return showNotification ? showNotification(manager, options) : null;
};