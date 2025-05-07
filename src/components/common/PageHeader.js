import { Box, Typography, Button } from '@mui/material';

/**
 * PageHeader - Common header for pages with title and optional action button
 *
 * @param {string} title - Page title
 * @param {string} subtitle - Optional subtitle
 * @param {node} actionButton - Optional action button component
 * @param {object} sx - Additional styling
 */
export default function PageHeader({ title, subtitle, actionButton, sx = {} }) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        ...sx 
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom={!!subtitle}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {actionButton && (
        <Box sx={{ mt: { xs: 2, sm: 0 } }}>
          {actionButton}
        </Box>
      )}
    </Box>
  );
} 