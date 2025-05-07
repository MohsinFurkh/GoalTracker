import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * LoadingState - Displayed when content is loading
 * 
 * @param {string} message - Optional message to display
 * @param {boolean} fullPage - Whether to display as full page or inline
 * @param {object} sx - Additional styling
 */
export default function LoadingState({ 
  message = 'Loading...', 
  fullPage = false,
  sx = {}
}) {
  const content = (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        ...sx
      }}
    >
      <CircularProgress size={40} thickness={4} />
      {message && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box 
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
} 