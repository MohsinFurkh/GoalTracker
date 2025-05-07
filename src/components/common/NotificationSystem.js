import React, { createContext, useContext, useState } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';

// Create a context for managing notifications
const NotificationContext = createContext();

/**
 * Notification types
 * @typedef {'success' | 'error' | 'warning' | 'info'} NotificationType
 */

/**
 * Provider component that wraps the application to provide notification functionality
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  /**
   * Show a notification
   * @param {string} message - The notification message
   * @param {NotificationType} type - The notification type
   * @param {number} duration - The notification duration in milliseconds
   */
  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    
    setNotifications((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        duration,
      },
    ]);

    // Automatically remove notification after duration
    setTimeout(() => {
      closeNotification(id);
    }, duration);
    
    return id;
  };

  /**
   * Close a specific notification
   * @param {number} id - The notification ID to close
   */
  const closeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Convenience methods for different notification types
  const showSuccess = (message, duration) => showNotification(message, 'success', duration);
  const showError = (message, duration) => showNotification(message, 'error', duration);
  const showWarning = (message, duration) => showNotification(message, 'warning', duration);
  const showInfo = (message, duration) => showNotification(message, 'info', duration);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeNotification,
      }}
    >
      {children}
      
      {/* Notification Stack */}
      <Stack spacing={1} sx={{ position: 'fixed', bottom: 24, right: 24, maxWidth: '100%', width: 'auto', zIndex: 2000 }}>
        {notifications.map((notification) => (
          <Snackbar
            key={notification.id}
            open={true}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ position: 'static', mb: 1 }}
          >
            <Alert 
              onClose={() => closeNotification(notification.id)} 
              severity={notification.type} 
              variant="filled"
              sx={{ width: '100%', maxWidth: 400 }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </NotificationContext.Provider>
  );
}

/**
 * Hook to use the notification system
 * @returns {Object} Notification methods
 */
export function useNotification() {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
} 