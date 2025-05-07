import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  TaskAlt as TaskAltIcon,
} from '@mui/icons-material';
import ProgressIndicator from '../common/ProgressIndicator';
import { formatDate } from '../../utils/dateUtils';

/**
 * GoalCard - A component for displaying goal information
 * 
 * @param {object} props
 * @param {object} props.goal - Goal data
 * @param {function} props.onEdit - Function to call when edit is clicked
 * @param {function} props.onDelete - Function to call when delete is clicked
 * @param {function} props.onViewTasks - Function to call when view tasks is clicked
 * @param {boolean} props.compact - Whether to show a compact version of the card
 */
export default function GoalCard({ 
  goal, 
  onEdit, 
  onDelete, 
  onViewTasks,
  compact = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Calculate days remaining until deadline
  const currentDate = new Date();
  const deadlineDate = new Date(goal.deadline);
  const timeRemaining = deadlineDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  
  // Menu handlers
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleEdit = () => {
    handleMenuClose();
    onEdit(goal);
  };
  
  const handleDelete = () => {
    handleMenuClose();
    onDelete(goal);
  };
  
  const handleViewTasks = () => {
    onViewTasks(goal);
  };
  
  // Status colors mapping
  const statusColors = {
    'Not Started': 'default',
    'In Progress': 'primary',
    'Completed': 'success',
    'On Hold': 'warning',
    'Abandoned': 'error',
  };
  
  // Priority colors mapping
  const priorityColors = {
    'Low': 'info',
    'Medium': 'warning',
    'High': 'error',
  };

  if (compact) {
    return (
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 2, 
          position: 'relative',
          borderColor: statusColors[goal.status] !== 'default' 
            ? `${statusColors[goal.status]}.main` 
            : 'divider',
          '&:hover': {
            boxShadow: 1,
          },
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="h6" component="div" noWrap title={goal.title}>
              {goal.title}
            </Typography>
            <Chip 
              size="small" 
              label={goal.status} 
              color={statusColors[goal.status]} 
              variant={goal.status === 'Not Started' ? 'outlined' : 'filled'}
            />
          </Box>
          
          <Box mt={1}>
            <ProgressIndicator 
              value={goal.progress} 
              type="linear" 
              size="small" 
              color="primary"
            />
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Tooltip title={`Priority: ${goal.priority}`} arrow>
              <Chip 
                size="small" 
                label={goal.priority} 
                color={priorityColors[goal.priority]} 
                variant="outlined"
              />
            </Tooltip>
            <Tooltip title={`Due: ${formatDate(goal.deadline, 'medium')}`} arrow>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {daysRemaining > 0 
                    ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`
                    : 'Overdue'}
                </Typography>
              </Box>
            </Tooltip>
          </Box>
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Box>
            <Tooltip title="View Tasks" arrow>
              <IconButton size="small" onClick={handleViewTasks}>
                <TaskAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Goal" arrow>
              <IconButton size="small" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>
    );
  }

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2, 
        position: 'relative',
        borderLeft: 4,
        borderColor: `${statusColors[goal.status]}.main`,
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h5" component="div" gutterBottom>
            {goal.title}
          </Typography>
          <Box>
            <Chip 
              label={goal.status} 
              color={statusColors[goal.status]} 
              size="medium"
              variant={goal.status === 'Not Started' ? 'outlined' : 'filled'}
              sx={{ mr: 1 }}
            />
            <IconButton
              aria-label="more"
              id={`goal-menu-${goal._id}`}
              aria-controls={open ? `goal-menu-${goal._id}` : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleMenuClick}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id={`goal-menu-${goal._id}`}
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': `goal-menu-${goal._id}`,
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
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {goal.description}
        </Typography>
        
        <Box mt={2} mb={1}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progress
          </Typography>
          <ProgressIndicator 
            value={goal.progress} 
            type="linear" 
            size="medium" 
            color="primary"
          />
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              Priority
            </Typography>
            <Chip 
              label={goal.priority} 
              color={priorityColors[goal.priority]} 
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary" align="right">
              Due Date
            </Typography>
            <Box display="flex" alignItems="center" mt={0.5}>
              <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography 
                variant="body2" 
                color={daysRemaining <= 0 ? "error.main" : "text.primary"}
              >
                {formatDate(goal.deadline, 'medium')}
                {daysRemaining <= 0 && ' (Overdue)'}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
              {goal.categories && goal.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  variant="outlined"
                />
              ))}
              {(!goal.categories || goal.categories.length === 0) && (
                <Typography variant="caption" color="text.disabled">
                  No categories
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary" align="right">
              Created
            </Typography>
            <Typography variant="body2">
              {formatDate(goal.createdAt, 'short')}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Tooltip title="View Tasks" arrow>
          <IconButton onClick={handleViewTasks} color="primary">
            <TaskAltIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
} 