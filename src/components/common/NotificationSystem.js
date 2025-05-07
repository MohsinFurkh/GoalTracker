import React, { createContext, useContext, useState } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';

// Create a notification context
const NotificationContext = createContext();

/**
 * Notification types
 * @typedef {'success' | 'error' | 'warning' | 'info'} NotificationType
 */

/**
 * Custom hook to use notifications
 * @returns {Object} Notification methods
 */
export function useNotification() {
  return useContext(NotificationContext);
}

/**
 * Notification provider component
 * @param {React.ReactNode} children - The children components to wrap
 * @returns {React.ReactNode} - The wrapped components
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // 'error', 'warning', 'info', 'success'
  
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
  const showSuccess = (msg) => {
    setMessage(msg);
    setSeverity('success');
    setOpen(true);
  };
  
  const showError = (msg) => {
    setMessage(msg);
    setSeverity('error');
    setOpen(true);
  };
  
  const showInfo = (msg) => {
    setMessage(msg);
    setSeverity('info');
    setOpen(true);
  };
  
  const showWarning = (msg) => {
    setMessage(msg);
    setSeverity('warning');
    setOpen(true);
  };

  // Close notification handler
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // Value to provide to consumers
  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    closeNotification,
  };
  
  return (
    <NotificationContext.Provider value={value}>
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
      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={severity} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
} 