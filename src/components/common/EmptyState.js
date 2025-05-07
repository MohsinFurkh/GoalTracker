import { Box, Typography, Button, Paper } from '@mui/material';

/**
 * EmptyState - Displayed when a section has no data
 * 
 * @param {string} title - The main heading
 * @param {string} message - The description message
 * @param {node} icon - The icon to display
 * @param {node} action - Optional action button or component
 * @param {object} sx - Additional styling
 */
export default function EmptyState({ 
  title, 
  message, 
  icon, 
  action,
  sx = {}
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        textAlign: 'center',
        py: 6,
        px: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'divider',
        ...sx
      }}
    >
      {icon && (
        <Box 
          sx={{ 
            mb: 2, 
            color: 'text.secondary', 
            display: 'flex', 
            justifyContent: 'center' 
          }}
        >
          {icon}
        </Box>
      )}
      
      <Typography variant="h6" fontWeight="medium" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: action ? 3 : 0 }}>
        {message}
      </Typography>
      
      {action && (
        <Box sx={{ mt: 2 }}>
          {action}
        </Box>
      )}
    </Paper>
  );
} 