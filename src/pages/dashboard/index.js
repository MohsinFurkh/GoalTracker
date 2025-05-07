import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUpIcon,
  EditNote as EditNoteIcon,
} from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import GoalCard from '../../components/goals/GoalCard';
import TaskItem from '../../components/tasks/TaskItem';
import JournalCard from '../../components/journal/JournalCard';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import { formatDate, getCurrentWeekAndYear } from '../../utils/dateUtils';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    completionRate: 0,
    weeklyTasks: 0,
    completedTasks: 0,
    taskCompletionRate: 0,
  });
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [journals, setJournals] = useState([]);

  const { week, year } = getCurrentWeekAndYear();

  // Fetch dashboard data from APIs
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status]);

  const fetchDashboardData = async () => {
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
      setTasks(tasksData);

      // Fetch journals
      const journalsResponse = await fetch('/api/journals');
      if (!journalsResponse.ok) {
        throw new Error('Failed to fetch journals');
      }
      const journalsData = await journalsResponse.json();
      setJournals(journalsData);

      // Calculate stats
      const completedGoals = goalsData.filter(goal => goal.status === 'Completed').length;
      const totalGoals = goalsData.length;
      const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

      // Get weekly tasks (tasks due in current week)
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const weeklyTasksList = tasksData.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= startOfWeek && dueDate <= endOfWeek;
      });

      const completedWeeklyTasks = weeklyTasksList.filter(task => task.completed).length;
      const weeklyTasks = weeklyTasksList.length;
      const taskCompletionRate = weeklyTasks > 0 ? (completedWeeklyTasks / weeklyTasks) * 100 : 0;

      setStats({
        totalGoals,
        completedGoals,
        completionRate: Math.round(completionRate),
        weeklyTasks,
        completedTasks: completedWeeklyTasks,
        taskCompletionRate: Math.round(taskCompletionRate),
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
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
        task._id === taskId ? updatedTask : task
      ));
      
      // Refresh stats
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Rest of the handlers can be updated to use API endpoints
  const handleViewGoalTasks = (goal) => {
    console.log('View tasks for goal:', goal._id);
    // router.push(`/goals/${goal._id}`);
  };

  const handleEditGoal = (goal) => {
    console.log('Edit goal:', goal._id);
    // router.push(`/goals/edit/${goal._id}`);
  };

  const handleDeleteGoal = async (goal) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const response = await fetch(`/api/goals/${goal._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete goal');
        }

        // Remove the goal from the state
        setGoals(goals.filter(g => g._id !== goal._id));
        // Refresh stats
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleEditTask = (task) => {
    console.log('Edit task:', task._id);
    // router.push(`/tasks/edit/${task._id}`);
  };

  const handleDeleteTask = async (task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${task._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete task');
        }

        // Remove the task from the state
        setTasks(tasks.filter(t => t._id !== task._id));
        // Refresh stats
        fetchDashboardData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEditJournal = (journal) => {
    console.log('Edit journal:', journal._id);
    // router.push(`/journal/edit/${journal._id}`);
  };

  const handleDeleteJournal = async (journal) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      try {
        const response = await fetch(`/api/journals/${journal._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete journal entry');
        }

        // Remove the journal from the state
        setJournals(journals.filter(j => j._id !== journal._id));
      } catch (error) {
        console.error('Error deleting journal entry:', error);
      }
    }
  };

  if (status === 'loading' || loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading dashboard..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Welcome back, {session?.user?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your goals and upcoming tasks.
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 4 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Goals"
            value={stats.totalGoals}
            subtitle={`${stats.completedGoals} completed`}
            trend={stats.completionRate}
            trendLabel="completion rate"
            icon={<FlagIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Weekly Tasks"
            value={stats.weeklyTasks}
            subtitle={`${stats.completedTasks} completed`}
            trend={stats.taskCompletionRate}
            trendLabel="completion rate"
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Weekly Progress"
            value={`${stats.taskCompletionRate}%`}
            subtitle="Overall task completion"
            icon={<TrendingUpIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Week"
            value={`${week} / ${year}`}
            subtitle={`${formatDate(new Date(), 'medium')}`}
            icon={<AccessTimeIcon />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Goals Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Active Goals
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            // Uncomment to enable navigation
            // onClick={() => router.push('/goals/new')}
          >
            New Goal
          </Button>
        </Box>
        {goals.length === 0 ? (
          <EmptyState 
            message="You don't have any active goals yet" 
            // Uncomment to enable navigation
            // actionText="Create your first goal"
            // actionHandler={() => router.push('/goals/new')}
          />
        ) : (
          <Grid container spacing={3}>
            {goals.slice(0, 2).map((goal) => (
              <Grid item xs={12} md={6} key={goal._id}>
                <GoalCard
                  goal={goal}
                  onViewTasks={() => handleViewGoalTasks(goal)}
                  onEdit={() => handleEditGoal(goal)}
                  onDelete={() => handleDeleteGoal(goal)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Tasks Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Upcoming Tasks
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            // Uncomment to enable navigation
            // onClick={() => router.push('/tasks/new')}
          >
            New Task
          </Button>
        </Box>
        {tasks.length === 0 ? (
          <EmptyState 
            message="You don't have any upcoming tasks" 
            // Uncomment to enable navigation
            // actionText="Create your first task"
            // actionHandler={() => router.push('/tasks/new')}
          />
        ) : (
          <Card>
            <List sx={{ padding: 0 }}>
              {tasks
                .filter(task => !task.completed)
                .slice(0, 3)
                .map((task, index, array) => (
                  <Box key={task._id}>
                    <TaskItem
                      task={task}
                      onComplete={(completed) => handleCompleteTask(task._id, completed)}
                      onEdit={() => handleEditTask(task)}
                      onDelete={() => handleDeleteTask(task)}
                    />
                    {index < array.length - 1 && <Divider />}
                  </Box>
                ))}
            </List>
          </Card>
        )}
      </Box>

      {/* Journal Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            Recent Journal Entries
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<EditNoteIcon />}
            // Uncomment to enable navigation
            // onClick={() => router.push('/journal/new')}
          >
            New Entry
          </Button>
        </Box>
        {journals.length === 0 ? (
          <EmptyState 
            message="You don't have any journal entries yet" 
            // Uncomment to enable navigation
            // actionText="Create your first entry"
            // actionHandler={() => router.push('/journal/new')}
          />
        ) : (
          <Grid container spacing={3}>
            {journals.slice(0, 1).map((journal) => (
              <Grid item xs={12} key={journal._id}>
                <JournalCard
                  journal={journal}
                  onEdit={() => handleEditJournal(journal)}
                  onDelete={() => handleDeleteJournal(journal)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </MainLayout>
  );
} 