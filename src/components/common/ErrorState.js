import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 * ErrorState - Displayed when an error occurs
 * 
 * @param {string} title - The error title
 * @param {string} message - The error message
 * @param {function} onRetry - Optional retry handler
 * @param {boolean} fullPage - Whether to display as full page or inline
 * @param {object} sx - Additional styling
 */
export default function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred while processing your request.',
  onRetry,
  fullPage = false,
  sx = {}
}) {
  const content = (
    <Paper
      elevation={fullPage ? 0 : 1}
      sx={{
        p: 4,
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: fullPage ? 'transparent' : 'background.paper',
        ...sx
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
      
      <Typography variant="h6" gutterBottom fontWeight="medium">
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: onRetry ? 3 : 0 }}>
        {message}
      </Typography>
      
      {onRetry && (
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      )}
    </Paper>
  );

  if (fullPage) {
    return (
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          p: 2,
        }}
      >
        <Box sx={{ maxWidth: 500 }}>
          {content}
        </Box>
      </Box>
    );
  }

  return content;
} 