import React from 'react';
import { Box, CircularProgress, LinearProgress, Typography, Tooltip } from '@mui/material';

/**
 * ProgressIndicator - A component for displaying progress visually
 * 
 * @param {object} props
 * @param {number} props.value - The progress value (0-100)
 * @param {string} props.type - The type of progress indicator ('linear' or 'circular')
 * @param {string} props.size - Size of the indicator ('small', 'medium', 'large')
 * @param {string} props.label - Optional label to display with the progress
 * @param {boolean} props.showPercentage - Whether to show the percentage value
 * @param {string} props.color - Color of the progress indicator
 * @param {object} props.sx - Additional styles to apply
 */
export default function ProgressIndicator({
  value = 0,
  type = 'linear',
  size = 'medium',
  label,
  showPercentage = true,
  color = 'primary',
  sx = {},
}) {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(Math.max(0, value), 100);
  
  // Size mappings for circular progress
  const circularSizes = {
    small: 40,
    medium: 60,
    large: 80,
  };
  
  // Size mappings for linear progress
  const linearHeights = {
    small: 4,
    medium: 8,
    large: 12,
  };
  
  // Font size mappings for the percentage text
  const fontSizes = {
    small: 12,
    medium: 16,
    large: 20,
  };

  // Determine progress color based on value
  const getProgressColor = (value) => {
    if (color !== 'auto') return color;
    
    if (value < 25) return 'error';
    if (value < 50) return 'warning';
    if (value < 75) return 'info';
    return 'success';
  };

  const progressColor = getProgressColor(normalizedValue);
  
  // Format the percentage value
  const percentageText = `${Math.round(normalizedValue)}%`;
  
  // Progress with tooltip
  const progressElement = type === 'circular' ? (
    <Box sx={{ position: 'relative', display: 'inline-flex', ...sx }}>
      <CircularProgress
        variant="determinate"
        value={normalizedValue}
        size={circularSizes[size]}
        color={progressColor}
        thickness={4}
      />
      {showPercentage && (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            fontSize={fontSizes[size]}
            fontWeight="bold"
          >
            {percentageText}
          </Typography>
        </Box>
      )}
    </Box>
  ) : (
    <Box sx={{ width: '100%', ...sx }}>
      <LinearProgress
        variant="determinate"
        value={normalizedValue}
        color={progressColor}
        sx={{ height: linearHeights[size], borderRadius: linearHeights[size] / 2 }}
      />
      {showPercentage && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 0.5,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            fontSize={fontSizes[size]}
          >
            {percentageText}
          </Typography>
        </Box>
      )}
    </Box>
  );
  
  // If label is provided, render with label
  if (label) {
    return (
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {type === 'linear' && showPercentage && (
            <Typography variant="body2" color="text.secondary">
              {percentageText}
            </Typography>
          )}
        </Box>
        {type === 'linear' ? (
          <LinearProgress
            variant="determinate"
            value={normalizedValue}
            color={progressColor}
            sx={{ height: linearHeights[size], borderRadius: linearHeights[size] / 2, ...sx }}
          />
        ) : (
          progressElement
        )}
      </Box>
    );
  }
  
  // Add tooltip with percentage
  return (
    <Tooltip title={`Progress: ${percentageText}`} arrow>
      {progressElement}
    </Tooltip>
  );
} 