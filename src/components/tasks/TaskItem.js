import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  Typography,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Collapse,
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { formatDate } from '../../utils/dateUtils';

/**
 * TaskItem - A component for displaying a task in a list
 * 
 * @param {object} props
 * @param {object} props.task - Task data
 * @param {function} props.onComplete - Function to call when task completion status changes
 * @param {function} props.onEdit - Function to call when edit is clicked
 * @param {function} props.onDelete - Function to call when delete is clicked
 * @param {boolean} props.showGoalInfo - Whether to show related goal information
 */
export default function TaskItem({
  task,
  onComplete,
  onEdit,
  onDelete,
  showGoalInfo = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const open = Boolean(anchorEl);

  // Priority colors mapping
  const priorityColors = {
    'Low': 'info',
    'Medium': 'warning',
    'High': 'error',
  };

  // Calculate days remaining until deadline
  const currentDate = new Date();
  const deadlineDate = new Date(task.dueDate);
  const timeRemaining = deadlineDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  const isOverdue = daysRemaining < 0 && !task.completed;

  // Menu handlers
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(task);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(task);
  };

  const handleToggleComplete = (event) => {
    event.stopPropagation();
    onComplete(task._id, !task.completed);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 1,
        borderColor: isOverdue ? 'error.main' : 'divider',
        bgcolor: task.completed ? 'action.hover' : 'background.paper',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: 1,
        },
      }}
    >
      <ListItem 
        alignItems="flex-start"
        button
        onClick={handleToggleExpand}
        sx={{ 
          borderLeft: 3, 
          borderColor: `${priorityColors[task.priority]}.main`,
          opacity: task.completed ? 0.8 : 1,
        }}
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={task.completed}
            onChange={handleToggleComplete}
            onClick={(e) => e.stopPropagation()}
            sx={{
              '&.Mui-checked': {
                color: 'success.main',
              },
            }}
          />
        </ListItemIcon>

        <ListItemText
          primary={
            <Typography
              variant="body1"
              component="div"
              sx={{
                fontWeight: task.completed ? 'normal' : 'medium',
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
          }
          secondary={
            <Box sx={{ mt: 0.5 }}>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                {task.dueDate && (
                  <Box 
                    component="span" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: isOverdue ? 'error.main' : 'text.secondary',
                    }}
                  >
                    <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption">
                      {formatDate(task.dueDate, 'short')}
                      {isOverdue ? ' (Overdue)' : ''}
                    </Typography>
                  </Box>
                )}

                <Chip
                  size="small"
                  icon={<FlagIcon />}
                  label={task.priority}
                  color={priorityColors[task.priority]}
                  variant="outlined"
                  sx={{ height: 24 }}
                />

                {showGoalInfo && task.goalId && (
                  <Chip
                    size="small"
                    label={task.goalTitle || 'Goal'}
                    variant="outlined"
                    sx={{ height: 24 }}
                  />
                )}
              </Box>
            </Box>
          }
        />

        <ListItemSecondaryAction>
          <Box display="flex" alignItems="center">
            <IconButton
              edge="end"
              onClick={handleToggleExpand}
              size="small"
              sx={{ mr: 1 }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            
            <IconButton
              edge="end"
              aria-label="more"
              id={`task-menu-${task._id}`}
              aria-controls={open ? `task-menu-${task._id}` : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleMenuClick}
              size="small"
            >
              <MoreVertIcon />
            </IconButton>

            <Menu
              id={`task-menu-${task._id}`}
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
              MenuListProps={{
                'aria-labelledby': `task-menu-${task._id}`,
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
        </ListItemSecondaryAction>
      </ListItem>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 3, pb: 2, pt: 0 }}>
          {task.description ? (
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
              {task.description}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.disabled" fontStyle="italic">
              No description
            </Typography>
          )}
          
          {task.notes && (
            <Box mt={1}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                Notes:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                {task.notes}
              </Typography>
            </Box>
          )}
          
          {showGoalInfo && task.goalId && (
            <Box mt={2}>
              <Typography variant="caption" color="text.secondary">
                This task is part of goal:
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {task.goalTitle || 'Unknown Goal'}
              </Typography>
            </Box>
          )}
          
          <Box mt={1} display="flex" justifyContent="space-between">
            <Typography variant="caption" color="text.disabled">
              Created: {formatDate(task.createdAt, 'short')}
            </Typography>
            {task.completed && (
              <Typography variant="caption" color="success.main">
                Completed: {formatDate(task.completedAt, 'short')}
              </Typography>
            )}
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
} 