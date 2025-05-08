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
  Divider,
  Chip,
  Stack,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Menu,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Sort as SortIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import GoalCard from '../../components/goals/GoalCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useNotification } from '../../components/common/NotificationSystem';

export default function GoalsPage() {
  const router = useRouter();
  const theme = useTheme();
  const notification = useNotification();
  const { data: session, status } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    category: 'all',
  });
  const [sortBy, setSortBy] = useState('deadline');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      const userId = session.user.id;
      if (!userId) {
        console.log('Unauthorized: No valid session found');
        return res.status(401).json({ error: 'Unauthorized' });
      }
      fetchGoals();
    }
  }, [status]);

  const fetchGoals = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/goals');
      
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      
      const data = await response.json();
      setGoals(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('Failed to load goals. Please try again.');
      setLoading(false);
    }
  };

  // Apply filters and sort whenever goals, filters, or search term changes
  useEffect(() => {
    if (!goals.length) return;

    let result = [...goals];

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(goal => goal.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter(goal => goal.priority === filters.priority);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(goal => 
        goal.categories && goal.categories.includes(filters.category)
      );
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(goal => 
        goal.title.toLowerCase().includes(term) || 
        (goal.description && goal.description.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'progress':
          return b.progress - a.progress;
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

    setFilteredGoals(result);
  }, [goals, filters, searchTerm, sortBy]);

  // Get unique categories from all goals
  const allCategories = () => {
    const categories = new Set();
    goals.forEach(goal => {
      if (goal.categories && goal.categories.length) {
        goal.categories.forEach(cat => categories.add(cat));
      }
    });
    return ['all', ...Array.from(categories)];
  };

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      category: 'all',
    });
    setSearchTerm('');
  };

  const handleViewGoalTasks = (goal) => {
    router.push(`/goals/${goal._id}`);
  };

  const handleEditGoal = (goal) => {
    router.push(`/goals/edit/${goal._id}`);
  };

  const handleDeleteGoal = (goal) => {
    setConfirmDelete(goal);
  };

  const confirmDeleteGoal = async () => {
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/goals/${confirmDelete._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
      
      // Update local state
      setGoals(goals.filter(g => g._id !== confirmDelete._id));
      notification.showSuccess(`Goal "${confirmDelete.title}" deleted successfully`);
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting goal:', error);
      notification.showError('Failed to delete goal');
    }
  };

  // Helper to render active filters as chips
  const renderFilterChips = () => {
    const activeFilters = [];
    
    if (filters.status !== 'all') {
      activeFilters.push({
        key: 'status',
        label: `Status: ${filters.status}`,
        onDelete: () => handleFilterChange('status', 'all'),
      });
    }
    
    if (filters.priority !== 'all') {
      activeFilters.push({
        key: 'priority',
        label: `Priority: ${filters.priority}`,
        onDelete: () => handleFilterChange('priority', 'all'),
      });
    }
    
    if (filters.category !== 'all') {
      activeFilters.push({
        key: 'category',
        label: `Category: ${filters.category}`,
        onDelete: () => handleFilterChange('category', 'all'),
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
        <LoadingState message="Loading goals..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Goals"
        subtitle="Manage and track your goals"
        actionButton={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/goals/new')}
          >
            New Goal
          </Button>
        }
      />

      {/* Filters Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search goals..."
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
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Abandoned">Abandoned</MenuItem>
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
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  {allCategories().map(category => (
                    <MenuItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </MenuItem>
                  ))}
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
                  <MenuItem value="deadline">Deadline (Soon First)</MenuItem>
                  <MenuItem value="progress">Progress (High First)</MenuItem>
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

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          title="No goals found"
          message={
            goals.length === 0
              ? "You haven't created any goals yet."
              : "No goals match your current filters."
          }
          action={
            goals.length === 0 ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/goals/new')}
              >
                Create Goal
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
            Showing {filteredGoals.length} of {goals.length} goals
          </Typography>
          
          <Grid container spacing={2}>
            {filteredGoals.map((goal) => (
              <Grid item xs={12} md={6} key={goal._id}>
                <GoalCard
                  goal={goal}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onViewTasks={handleViewGoalTasks}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteGoal}
        title="Delete Goal"
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

// New goal creation logic
const createNewGoal = async (userId, title, description, deadline, priority, categories, status) => {
  const newGoal = {
    userId: new ObjectId(session.user.id),
    title,
    description: description || '',
    targetDate: deadline ? new Date(deadline) : null,
    priority: priority || 'Medium',
    categories: categories || [],
    status: status || 'Not Started',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await goalsCollection.insertOne(newGoal);
  console.log('Insert result:', result);
  return result;
};