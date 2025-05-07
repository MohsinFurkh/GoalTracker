import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  Avatar, 
  useTheme 
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

/**
 * StatsCard - A component for displaying metrics and statistics
 * 
 * @param {object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value to display
 * @param {string} props.subtitle - Optional subtitle text
 * @param {number} props.trend - Trend value (positive, negative, or zero)
 * @param {string} props.trendLabel - Label for the trend value
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.color - Color scheme for the card
 * @param {boolean} props.loading - Whether the card is in loading state
 * @param {object} props.sx - Additional styles
 */
export default function StatsCard({
  title,
  value,
  subtitle,
  trend = 0,
  trendLabel,
  icon,
  color = 'primary',
  loading = false,
  sx = {},
}) {
  const theme = useTheme();

  // Determine color based on trend
  const getTrendColor = () => {
    if (trend > 0) return theme.palette.success.main;
    if (trend < 0) return theme.palette.error.main;
    return theme.palette.text.secondary;
  };

  // Get trend icon based on value
  const getTrendIcon = () => {
    if (trend > 0) return <TrendingUpIcon fontSize="small" />;
    if (trend < 0) return <TrendingDownIcon fontSize="small" />;
    return <TrendingFlatIcon fontSize="small" />;
  };

  // Format trend value to always show + sign for positive values
  const formatTrend = () => {
    if (trend > 0) return `+${trend}`;
    return trend;
  };

  return (
    <Card
      elevation={1}
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        ...sx,
      }}
    >
      <CardContent sx={{ height: '100%', p: 3 }}>
        {/* Title and icon */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="flex-start"
          mb={2}
        >
          <Typography 
            color="text.secondary" 
            variant="subtitle2" 
            fontWeight="medium"
          >
            {title}
          </Typography>
          
          {icon && (
            <Avatar
              sx={{
                bgcolor: `${color}.lighter`,
                color: `${color}.main`,
                width: 40,
                height: 40,
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>

        {/* Main value */}
        <Typography
          variant="h4"
          component="div"
          fontWeight="bold"
          sx={{
            mb: 0.5,
            opacity: loading ? 0.3 : 1,
          }}
        >
          {loading ? '—' : value}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              opacity: loading ? 0.3 : 1,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Trend indicator */}
        {(trend !== undefined || trendLabel) && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <Box 
              display="flex" 
              alignItems="center" 
              mt={1}
              sx={{ opacity: loading ? 0.3 : 1 }}
            >
              {trend !== undefined && (
                <Box 
                  component="span" 
                  display="flex" 
                  alignItems="center"
                  mr={1}
                  color={getTrendColor()}
                >
                  {getTrendIcon()}
                  <Typography
                    variant="caption"
                    component="span"
                    fontWeight="bold"
                    sx={{ ml: 0.5 }}
                  >
                    {formatTrend()}
                  </Typography>
                </Box>
              )}
              
              {trendLabel && (
                <Typography variant="caption" color="text.secondary">
                  {trendLabel}
                </Typography>
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
} 