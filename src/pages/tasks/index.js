import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import TaskItem from '../../components/tasks/TaskItem';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useNotification } from '../../components/common/NotificationSystem';
import { formatDate } from '../../utils/dateUtils';

export default function TasksPage() {
  const router = useRouter();
  const theme = useTheme();
  const notification = useNotification();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    goal: 'all',
    priority: 'all',
    completed: 'all',
  });
  const [sortBy, setSortBy] = useState('dueDate');
  const [goals, setGoals] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTasksAndGoals();
    }
  }, [status]);

  const fetchTasksAndGoals = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch goals
      const goalsResponse = await fetch('/api/goals');
      if (!goalsResponse.ok) {
        throw new Error('Failed to fetch goals');
      }
      const goalsData = await goalsResponse.json();
      setGoals(goalsData);
      
      // Fetch tasks
      const tasksResponse = await fetch('/api/tasks');
      if (!tasksResponse.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasksData = await tasksResponse.json();
      
      // Add goalTitle to tasks for easier display
      const enhancedTasks = tasksData.map(task => {
        const relatedGoal = goalsData.find(g => g._id === task.goalId);
        return {
          ...task,
          goalTitle: relatedGoal ? relatedGoal.title : 'No Goal'
        };
      });
      
      setTasks(enhancedTasks);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching tasks and goals:', err);
      setError('Failed to load tasks. Please try again.');
      setLoading(false);
    }
  };

  // Apply filters and sort whenever tasks, filters, or search term changes
  useEffect(() => {
    if (!tasks.length) return;

    let result = [...tasks];

    // Apply goal filter
    if (filters.goal !== 'all') {
      result = result.filter(task => task.goalId === filters.goal);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }

    // Apply completed filter
    if (filters.completed !== 'all') {
      const isCompleted = filters.completed === 'completed';
      result = result.filter(task => task.completed === isCompleted);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredTasks(result);
  }, [tasks, filters, searchTerm, sortBy]);

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const clearFilters = () => {
    setFilters({
      goal: 'all',
      priority: 'all',
      completed: 'all',
    });
    setSearchTerm('');
  };

  const handleCompleteTask = async (taskId, completed) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed,
          completedAt: completed ? new Date() : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      
      // Update the task in the state
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...updatedTask, goalTitle: task.goalTitle } : task
      ));
      
      notification.showSuccess(`Task marked as ${completed ? 'completed' : 'incomplete'}`);
    } catch (error) {
      console.error('Error updating task:', error);
      notification.showError('Failed to update task');
    }
  };

  const handleEditTask = (task) => {
    router.push(`/tasks/edit/${task._id}`);
  };

  const handleDeleteTask = (task) => {
    setConfirmDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/tasks/${confirmDelete._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      // Update local state
      setTasks(tasks.filter(t => t._id !== confirmDelete._id));
      notification.showSuccess(`Task "${confirmDelete.title}" deleted successfully`);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      notification.showError('Failed to delete task');
    }
  };

  // Helper to render active filters as chips
  const renderFilterChips = () => {
    const activeFilters = [];
    
    if (filters.goal !== 'all') {
      const goalName = goals.find(g => g._id === filters.goal)?.title || filters.goal;
      activeFilters.push({
        key: 'goal',
        label: `Goal: ${goalName}`,
        onDelete: () => handleFilterChange('goal', 'all'),
      });
    }
    
    if (filters.priority !== 'all') {
      activeFilters.push({
        key: 'priority',
        label: `Priority: ${filters.priority}`,
        onDelete: () => handleFilterChange('priority', 'all'),
      });
    }
    
    if (filters.completed !== 'all') {
      activeFilters.push({
        key: 'completed',
        label: `Status: ${filters.completed === 'completed' ? 'Completed' : 'Pending'}`,
        onDelete: () => handleFilterChange('completed', 'all'),
      });
    }
    
    if (searchTerm) {
      activeFilters.push({
        key: 'search',
        label: `Search: ${searchTerm}`,
        onDelete: () => setSearchTerm(''),
      });
    }
    
    if (!activeFilters.length) return null;
    
    return (
      <Box sx={{ my: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          Active Filters:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {activeFilters.map(filter => (
            <Chip
              key={filter.key}
              label={filter.label}
              onDelete={filter.onDelete}
              size="small"
              sx={{ my: 0.5 }}
            />
          ))}
          <Chip
            label="Clear All"
            onClick={clearFilters}
            size="small"
            sx={{ my: 0.5 }}
          />
        </Stack>
      </Box>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading tasks..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Tasks"
        subtitle="Manage your tasks across all goals"
        actionButton={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/tasks/new')}
          >
            New Task
          </Button>
        }
      />

      {/* Filters Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Goal</InputLabel>
                <Select
                  value={filters.goal}
                  label="Goal"
                  onChange={(e) => handleFilterChange('goal', e.target.value)}
                >
                  <MenuItem value="all">All Goals</MenuItem>
                  {goals.map(goal => (
                    <MenuItem key={goal._id} value={goal._id}>
                      {goal.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.completed}
                  label="Status"
                  onChange={(e) => handleFilterChange('completed', e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="dueDate">Due Date (Soon First)</MenuItem>
                  <MenuItem value="priority">Priority (High First)</MenuItem>
                  <MenuItem value="title">Title (A-Z)</MenuItem>
                  <MenuItem value="created">Created (Newest)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {renderFilterChips()}
        </CardContent>
      </Card>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          message={
            tasks.length === 0
              ? "You haven't created any tasks yet."
              : "No tasks match your current filters."
          }
          action={
            tasks.length === 0 ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/tasks/new')}
              >
                Create Task
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )
          }
        />
      ) : (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Showing {filteredTasks.length} of {tasks.length} tasks
          </Typography>
          
          <Card>
            <Box sx={{ pt: 1 }}>
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  showGoalInfo={true}
                />
              ))}
            </Box>
          </Card>
        </Box>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message={
          confirmDelete
            ? `Are you sure you want to delete "${confirmDelete.title}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        confirmColor="error"
      />
    </MainLayout>
  );
} 