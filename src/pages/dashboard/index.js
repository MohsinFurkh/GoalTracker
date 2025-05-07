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

  useEffect(() => {
    // For demo purposes, we'll use dummy data
    // In production, you would fetch this data from the API
    const loadDashboardData = () => {
      setTimeout(() => {
        // Mock data for demonstration
        setStats({
          totalGoals: 5,
          completedGoals: 2,
          completionRate: 40,
          weeklyTasks: 8,
          completedTasks: 3,
          taskCompletionRate: 37.5,
        });

        setGoals([
          {
            _id: 'g1',
            title: 'Learn React and NextJS',
            description: 'Master React and Next.js framework for web development',
            status: 'In Progress',
            priority: 'High',
            progress: 65,
            deadline: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
            createdAt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
            categories: ['Learning', 'Programming'],
          },
          {
            _id: 'g2',
            title: 'Exercise Regularly',
            description: 'Maintain a consistent workout schedule',
            status: 'In Progress',
            priority: 'Medium',
            progress: 30,
            deadline: new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000),
            createdAt: new Date(new Date().getTime() - 45 * 24 * 60 * 60 * 1000),
            categories: ['Health', 'Wellness'],
          },
        ]);

        setTasks([
          {
            _id: 't1',
            title: 'Complete dashboard implementation',
            description: 'Finish the dashboard UI and functionality',
            priority: 'High',
            dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
            completed: false,
            createdAt: new Date(),
            goalId: 'g1',
            goalTitle: 'Learn React and NextJS',
          },
          {
            _id: 't2',
            title: 'Morning run',
            description: '30 minute run at the park',
            priority: 'Medium',
            dueDate: new Date(),
            completed: true,
            completedAt: new Date(),
            createdAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
            goalId: 'g2',
            goalTitle: 'Exercise Regularly',
          },
          {
            _id: 't3',
            title: 'Create form components',
            description: 'Build reusable form components for the application',
            priority: 'Medium',
            dueDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
            completed: false,
            createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
            goalId: 'g1',
            goalTitle: 'Learn React and NextJS',
          },
        ]);

        setJournals([
          {
            _id: 'j1',
            title: 'Weekly Reflection',
            content: 'Made good progress on the React learning path. Completed several important tasks and gained confidence with state management.',
            mood: 'Good',
            date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
            tags: ['Learning', 'Progress'],
          },
        ]);

        setLoading(false);
      }, 1000); // Simulate loading delay
    };

    if (status === 'authenticated') {
      loadDashboardData();
    }
  }, [status]);

  const handleCompleteTask = (taskId, completed) => {
    // In production, you would update this via API
    setTasks(tasks.map(task => 
      task._id === taskId ? { ...task, completed, completedAt: completed ? new Date() : null } : task
    ));
  };

  const handleViewGoalTasks = (goal) => {
    // Navigate to goal detail or tasks filtered by goal
    console.log('View tasks for goal:', goal._id);
    // router.push(`/goals/${goal._id}`);
  };

  const handleEditGoal = (goal) => {
    console.log('Edit goal:', goal._id);
    // router.push(`/goals/edit/${goal._id}`);
  };

  const handleDeleteGoal = (goal) => {
    console.log('Delete goal:', goal._id);
    // Show confirmation dialog and delete if confirmed
  };

  const handleEditTask = (task) => {
    console.log('Edit task:', task._id);
    // router.push(`/tasks/edit/${task._id}`);
  };

  const handleDeleteTask = (task) => {
    console.log('Delete task:', task._id);
    // Show confirmation dialog and delete if confirmed
  };

  const handleEditJournal = (journal) => {
    console.log('Edit journal:', journal._id);
    // router.push(`/journal/edit/${journal._id}`);
  };

  const handleDeleteJournal = (journal) => {
    console.log('Delete journal:', journal._id);
    // Show confirmation dialog and delete if confirmed
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

      {/* Main Content Section */}
      <Grid container spacing={3}>
        {/* Active Goals Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ pb: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="medium">
                  Active Goals
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<AddIcon />}
                  href="/goals/new"
                >
                  New Goal
                </Button>
              </Box>
              
              {goals.length === 0 ? (
                <EmptyState 
                  title="No active goals"
                  message="Create your first goal to start tracking your progress."
                  action={
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      href="/goals/new"
                    >
                      Create Goal
                    </Button>
                  }
                />
              ) : (
                <Box>
                  {goals.map((goal) => (
                    <GoalCard
                      key={goal._id}
                      goal={goal}
                      compact={true}
                      onEdit={handleEditGoal}
                      onDelete={handleDeleteGoal}
                      onViewTasks={handleViewGoalTasks}
                    />
                  ))}
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button href="/goals" variant="text">
                      View All Goals
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Tasks Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ pb: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="medium">
                  Upcoming Tasks
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<AddIcon />}
                  href="/tasks/new"
                >
                  New Task
                </Button>
              </Box>
              
              {tasks.length === 0 ? (
                <EmptyState 
                  title="No upcoming tasks"
                  message="Add tasks to make progress on your goals."
                  action={
                    <Button 
                      variant="contained" 
                      startIcon={<AddIcon />}
                      href="/tasks/new"
                    >
                      Add Task
                    </Button>
                  }
                />
              ) : (
                <Box>
                  <List sx={{ pt: 0 }}>
                    {tasks.map((task) => (
                      <TaskItem
                        key={task._id}
                        task={task}
                        onComplete={handleCompleteTask}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        showGoalInfo={true}
                      />
                    ))}
                  </List>
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button href="/tasks" variant="text">
                      View All Tasks
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Journal Entries */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pb: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="medium">
                  Recent Journal Entries
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<EditNoteIcon />}
                  href="/journal/new"
                >
                  New Entry
                </Button>
              </Box>
              
              {journals.length === 0 ? (
                <EmptyState 
                  title="No journal entries"
                  message="Start journaling to track your thoughts and reflections."
                  action={
                    <Button 
                      variant="contained" 
                      startIcon={<EditNoteIcon />}
                      href="/journal/new"
                    >
                      Write Entry
                    </Button>
                  }
                />
              ) : (
                <Box>
                  {journals.map((journal) => (
                    <JournalCard
                      key={journal._id}
                      journal={journal}
                      onEdit={handleEditJournal}
                      onDelete={handleDeleteJournal}
                      condensed={true}
                    />
                  ))}
                  <Box display="flex" justifyContent="center" mt={2}>
                    <Button href="/journal" variant="text">
                      View All Entries
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
} 