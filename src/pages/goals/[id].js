import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import TaskItem from '../../components/tasks/TaskItem';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorState from '../../components/common/ErrorState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useNotification } from '../../components/common/NotificationSystem';
import { formatDate } from '../../utils/dateUtils';

export default function GoalDetails() {
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const notification = useNotification();

  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch goal and tasks - for demo, we'll use dummy data
    const fetchGoalDetails = async () => {
      try {
        setTimeout(() => {
          // Mock data for demonstration
          setGoal({
            _id: id,
            title: 'Learn React and NextJS',
            description: 'Master React and Next.js framework for web development. Focus on functional components, hooks, and server-side rendering. Complete at least one medium-sized project using these technologies.',
            status: 'In Progress',
            priority: 'High',
            progress: 65,
            deadline: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
            createdAt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            categories: ['Learning', 'Programming'],
          });

          setTasks([
            {
              _id: 't1',
              title: 'Complete dashboard implementation',
              description: 'Finish the dashboard UI and functionality',
              priority: 'High',
              dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
              completed: false,
              createdAt: new Date(),
              goalId: id,
              goalTitle: 'Learn React and NextJS',
            },
            {
              _id: 't2',
              title: 'Build reusable component library',
              description: 'Create a set of reusable UI components with proper documentation',
              priority: 'Medium',
              dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
              completed: false,
              createdAt: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000),
              goalId: id,
              goalTitle: 'Learn React and NextJS',
            },
            {
              _id: 't3',
              title: 'Learn NextAuth integration',
              description: 'Implement authentication using NextAuth.js',
              priority: 'Medium',
              dueDate: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
              completed: true,
              completedAt: new Date(),
              createdAt: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000),
              goalId: id,
              goalTitle: 'Learn React and NextJS',
            },
          ]);

          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load goal details');
        setLoading(false);
      }
    };

    fetchGoalDetails();
  }, [id]);

  // Calculate days remaining until deadline
  const getDaysRemaining = () => {
    if (!goal?.deadline) return null;
    
    const currentDate = new Date();
    const deadlineDate = new Date(goal.deadline);
    const timeRemaining = deadlineDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    
    return daysRemaining;
  };

  const daysRemaining = goal ? getDaysRemaining() : null;

  const handleEditGoal = () => {
    router.push(`/goals/edit/${id}`);
  };

  const handleDeleteGoal = () => {
    setConfirmDelete(true);
  };

  const confirmDeleteGoal = async () => {
    try {
      // In production, call API to delete goal
      // await deleteGoal(id);
      
      notification.showSuccess('Goal deleted successfully');
      router.push('/goals');
    } catch (error) {
      notification.showError('Failed to delete goal');
    } finally {
      setConfirmDelete(false);
    }
  };

  const handleAddTask = () => {
    router.push(`/tasks/new?goalId=${id}`);
  };

  const handleCompleteTask = (taskId, completed) => {
    // In production, you would update this via API
    setTasks(tasks.map(task => 
      task._id === taskId ? { ...task, completed, completedAt: completed ? new Date() : null } : task
    ));

    // Update goal progress based on completed tasks
    if (goal) {
      const completedTasks = tasks.map(t => 
        t._id === taskId ? { ...t, completed } : t
      ).filter(t => t.completed).length;
      
      const totalTasks = tasks.length;
      const newProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      setGoal({ ...goal, progress: newProgress });
    }
  };

  const handleEditTask = (task) => {
    router.push(`/tasks/edit/${task._id}`);
  };

  const handleDeleteTask = (task) => {
    // In production, call API to delete task
    notification.showSuccess(`Task "${task.title}" deleted`);
    setTasks(tasks.filter(t => t._id !== task._id));
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

  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading goal details..." />
      </MainLayout>
    );
  }

  if (error || !goal) {
    return (
      <MainLayout>
        <ErrorState 
          title="Could not load goal" 
          message={error || "The requested goal could not be found"} 
          onRetry={() => router.reload()}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Back button and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button 
          component={Link} 
          href="/goals" 
          startIcon={<ArrowBackIcon />}
          color="inherit"
        >
          Back to Goals
        </Button>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEditGoal}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteGoal}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Goal Details Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  {goal.title}
                </Typography>
                <Chip 
                  label={goal.status} 
                  color={statusColors[goal.status]} 
                  size="medium"
                  variant={goal.status === 'Not Started' ? 'outlined' : 'filled'}
                  sx={{ ml: 2 }}
                />
              </Box>
              
              <Typography variant="body1" sx={{ mb: 4 }} whiteSpace="pre-line">
                {goal.description}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Priority
                  </Typography>
                  <Chip 
                    label={goal.priority} 
                    color={priorityColors[goal.priority]} 
                    size="small"
                    icon={<FlagIcon />}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Due Date
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography 
                      variant="body2" 
                      color={daysRemaining <= 0 ? "error.main" : "text.primary"}
                    >
                      {formatDate(goal.deadline, 'medium')}
                      {daysRemaining !== null && (
                        <>
                          {' • '}
                          {daysRemaining > 0 
                            ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining` 
                            : 'Overdue'}
                        </>
                      )}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Categories
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Created
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(goal.createdAt, 'medium')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center',
                  p: 3,
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Overall Progress
                </Typography>
                
                <Box sx={{ width: '100%', mb: 2 }}>
                  <ProgressIndicator 
                    value={goal.progress} 
                    type="circular" 
                    size="large" 
                    color="primary"
                    showPercentage={true}
                  />
                </Box>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
                  </Typography>
                  
                  <Button
                    variant="contained"
                    startIcon={<AssessmentIcon />}
                    sx={{ mt: 2 }}
                    // In production, link to detailed analytics
                    onClick={() => notification.showInfo('Analytics feature coming soon')}
                  >
                    View Analytics
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          Tasks
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Box>
      
      {tasks.length === 0 ? (
        <EmptyState 
          title="No tasks yet"
          message="Break your goal down into actionable tasks to make progress."
          action={
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleAddTask}
            >
              Add First Task
            </Button>
          }
        />
      ) : (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
          </Typography>
          <List sx={{ pt: 0 }}>
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onComplete={handleCompleteTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </List>
        </Box>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={confirmDeleteGoal}
        title="Delete Goal"
        message={`Are you sure you want to delete "${goal.title}"? This will also delete all associated tasks. This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
      />
    </MainLayout>
  );
} 