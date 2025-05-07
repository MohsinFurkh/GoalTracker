import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Collapse,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CalendarMonth as CalendarIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

/**
 * JournalCard - A component for displaying journal entries
 * 
 * @param {object} props
 * @param {object} props.journal - Journal entry data
 * @param {function} props.onEdit - Function to call when edit is clicked
 * @param {function} props.onDelete - Function to call when delete is clicked
 * @param {boolean} props.condensed - Whether to show a condensed version
 */
export default function JournalCard({
  journal,
  onEdit,
  onDelete,
  condensed = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(!condensed);
  const open = Boolean(anchorEl);

  // Menu handlers
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(journal);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(journal);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Truncate content for preview
  const getPreviewContent = (content, maxLength = 200) => {
    if (!content) return '';
    
    if (content.length <= maxLength) return content;
    
    return content.substring(0, maxLength) + '...';
  };

  // Mood colors mapping
  const moodColors = {
    'Great': 'success',
    'Good': 'info',
    'Neutral': 'default',
    'Bad': 'warning',
    'Terrible': 'error',
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        borderLeft: 3,
        borderColor: journal.mood && moodColors[journal.mood] ? `${moodColors[journal.mood]}.main` : 'divider',
        '&:hover': {
          boxShadow: 1,
        },
      }}
    >
      <CardContent sx={{ pt: 2, pb: condensed ? 1 : 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant={condensed ? "h6" : "h5"} component="div" gutterBottom={!condensed}>
              {journal.title || formatDate(journal.date, 'medium')}
            </Typography>
            
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <CalendarIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(journal.date, 'medium')}
                </Typography>
              </Box>
              
              {journal.mood && (
                <Chip 
                  size="small" 
                  label={`Mood: ${journal.mood}`} 
                  color={moodColors[journal.mood]} 
                  variant={journal.mood === 'Neutral' ? 'outlined' : 'filled'}
                />
              )}
            </Box>
          </Box>

          <Box>
            <IconButton
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              size="small"
              sx={{ mr: 0.5 }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            
            <IconButton
              aria-label="more"
              id={`journal-menu-${journal._id}`}
              aria-controls={open ? `journal-menu-${journal._id}` : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleMenuClick}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id={`journal-menu-${journal._id}`}
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': `journal-menu-${journal._id}`,
              }}
            >
              <MenuItem onClick={handleEdit}>
                <EditIcon fontSize="small" sx={{ mr: 1 }} />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {condensed && !expanded && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 1, 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {getPreviewContent(journal.content, 150)}
          </Typography>
        )}

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {journal.achievements && journal.achievements.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.primary">
                Achievements
              </Typography>
              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
                {journal.achievements}
              </Typography>
            </Box>
          )}

          {journal.challenges && journal.challenges.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.primary">
                Challenges
              </Typography>
              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
                {journal.challenges}
              </Typography>
            </Box>
          )}

          {journal.content && journal.content.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.primary">
                Reflections
              </Typography>
              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
                {journal.content}
              </Typography>
            </Box>
          )}

          {journal.goalProgress && journal.goalProgress.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.primary">
                Goal Progress
              </Typography>
              <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
                {journal.goalProgress}
              </Typography>
            </Box>
          )}
          
          {journal.tags && journal.tags.length > 0 && (
            <Box mt={2} display="flex" alignItems="center" flexWrap="wrap" gap={0.5}>
              <TagIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              {journal.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
} 