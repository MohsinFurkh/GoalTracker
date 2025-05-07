import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  CalendarMonth as CalendarMonthIcon,
  CheckCircle as CheckCircleIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalFireDepartment as LocalFireDepartmentIcon,
  Share as ShareIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  WorkspacePremium as WorkspacePremiumIcon,
} from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingState from '../../components/common/LoadingState';
import { DateRangePicker } from '../../components/common/DateTimePicker';
import { useNotification } from '../../components/common/NotificationSystem';

// Mock data
const MOCK_GOALS = [
  {
    id: 'goal-1',
    title: 'Complete Project Proposal',
    status: 'completed',
    priority: 'high',
    deadline: new Date(2023, 5, 15),
    startDate: new Date(2023, 4, 1),
    completedDate: new Date(2023, 5, 12),
    progress: 100,
    categories: ['Work', 'Writing'],
    completedTasks: 4,
    totalTasks: 4,
  },
  {
    id: 'goal-2',
    title: 'Learn React Hooks',
    status: 'in-progress',
    priority: 'medium',
    deadline: new Date(2023, 7, 30),
    startDate: new Date(2023, 6, 1),
    progress: 65,
    categories: ['Learning', 'Programming'],
    completedTasks: 13,
    totalTasks: 20,
  },
  {
    id: 'goal-3',
    title: 'Run 5K Marathon',
    status: 'in-progress',
    priority: 'high',
    deadline: new Date(2023, 8, 10),
    startDate: new Date(2023, 6, 15),
    progress: 80,
    categories: ['Health', 'Fitness'],
    completedTasks: 8,
    totalTasks: 10,
  },
];

// Mock streaks
const MOCK_STREAKS = {
  currentStreak: 12,
  longestStreak: 24,
  thisWeek: 5,
  thisMonth: 15,
  taskCompletionRate: 78, // percentage
};

// Mock achievements
const MOCK_ACHIEVEMENTS = [
  {
    id: 'achievement-1',
    title: 'Getting Started',
    description: 'Created your first goal',
    date: new Date(2023, 3, 15),
    icon: <StarIcon color="primary" />,
    unlocked: true,
  },
  {
    id: 'achievement-2',
    title: 'Goal Crusher',
    description: 'Completed 5 goals',
    date: new Date(2023, 5, 20),
    icon: <EmojiEventsIcon color="primary" />,
    unlocked: true,
  },
  {
    id: 'achievement-3',
    title: 'On Fire',
    description: 'Maintained a 7-day streak',
    date: new Date(2023, 6, 5),
    icon: <LocalFireDepartmentIcon color="primary" />,
    unlocked: true,
  },
  {
    id: 'achievement-4',
    title: 'Task Master',
    description: 'Completed 50 tasks',
    date: null,
    icon: <CheckCircleIcon />,
    unlocked: false,
    progress: 82, // percentage towards unlocking
  },
  {
    id: 'achievement-5',
    title: 'Consistent Achiever',
    description: 'Maintained a 30-day streak',
    date: null,
    icon: <LocalFireDepartmentIcon />,
    unlocked: false,
    progress: 40, // percentage towards unlocking
  },
];

// Mock milestones
const MOCK_MILESTONES = [
  {
    id: 'milestone-1',
    title: 'First Month Completed',
    description: 'Successfully used GoalTrackr for one month',
    date: new Date(2023, 5, 1),
    completed: true,
  },
  {
    id: 'milestone-2',
    title: 'Halfway to Running 5K',
    description: 'Achieved 50% progress on your running goal',
    goalId: 'goal-3',
    date: new Date(2023, 7, 15),
    completed: true,
  },
  {
    id: 'milestone-3',
    title: 'React Hooks Mastery',
    description: 'Complete all tutorials for React Hooks',
    goalId: 'goal-2',
    date: null,
    expectedDate: new Date(2023, 7, 20),
    completed: false,
  },
];

// TabPanel component for the tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`progress-tabpanel-${index}`}
      aria-labelledby={`progress-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Progress circular component with label
function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} size={80} thickness={4} />
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
        <Typography variant="h6" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

// Streak indicator component
function StreakDisplay({ streaks }) {
  const theme = useTheme();
  
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <LocalFireDepartmentIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
        Streaks
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6} sm={4}>
          <Typography variant="subtitle2" color="text.secondary">Current Streak</Typography>
          <Typography variant="h3" sx={{ 
            color: theme.palette.warning.main, 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 'bold' 
          }}>
            {streaks.currentStreak}
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>days</Typography>
          </Typography>
        </Grid>
        
        <Grid item xs={6} sm={4}>
          <Typography variant="subtitle2" color="text.secondary">Longest Streak</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            {streaks.longestStreak}
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>days</Typography>
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2" color="text.secondary">Task Completion Rate</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
            {streaks.taskCompletionRate}%
          </Typography>
        </Grid>
        
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">This Week</Typography>
          <Typography variant="h5">
            {streaks.thisWeek}
            <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
              completions
            </Typography>
          </Typography>
        </Grid>
        
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary">This Month</Typography>
          <Typography variant="h5">
            {streaks.thisMonth}
            <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
              completions
            </Typography>
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

// Achievement card component
function AchievementCard({ achievement }) {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        opacity: achievement.unlocked ? 1 : 0.7,
        border: achievement.unlocked ? `1px solid ${theme.palette.primary.main}` : 'none',
        position: 'relative',
      }}
    >
      {achievement.unlocked && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircleIcon fontSize="small" />
        </Box>
      )}
      
      <CardContent sx={{ textAlign: 'center' }}>
        <Box sx={{ mb: 2, mt: 1 }}>
          <Box 
            sx={{ 
              display: 'inline-flex',
              p: 1,
              borderRadius: '50%',
              bgcolor: achievement.unlocked ? theme.palette.primary.light : theme.palette.action.disabledBackground,
              color: achievement.unlocked ? theme.palette.primary.contrastText : theme.palette.text.disabled,
              mb: 1,
            }}
          >
            {achievement.icon}
          </Box>
          <Typography variant="h6" component="div">
            {achievement.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {achievement.description}
          </Typography>
        </Box>
        
        {achievement.unlocked ? (
          <Typography variant="caption" color="text.secondary">
            Unlocked on {achievement.date.toLocaleDateString()}
          </Typography>
        ) : (
          <>
            <LinearProgress variant="determinate" value={achievement.progress} sx={{ mt: 2 }} />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {achievement.progress}% complete
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Goal progress card component
function GoalProgressCard({ goal }) {
  const theme = useTheme();
  const router = useRouter();
  
  // Calculate days remaining or days early
  const daysCalculation = () => {
    if (goal.status === 'completed') {
      const deadlineDate = new Date(goal.deadline);
      const completedDate = new Date(goal.completedDate);
      const diffTime = deadlineDate - completedDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        return `Completed ${diffDays} day${diffDays !== 1 ? 's' : ''} early`;
      } else if (diffDays < 0) {
        return `Completed ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} late`;
      } else {
        return 'Completed on deadline';
      }
    } else {
      const today = new Date();
      const deadlineDate = new Date(goal.deadline);
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
      } else if (diffDays < 0) {
        return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
      } else {
        return 'Due today';
      }
    }
  };
  
  const handleGoalClick = () => {
    router.push(`/goals/${goal.id}`);
  };
  
  // Calculate color based on status and progress
  const getStatusColor = () => {
    if (goal.status === 'completed') return theme.palette.success.main;
    if (goal.progress >= 75) return theme.palette.success.main;
    if (goal.progress >= 50) return theme.palette.warning.main;
    if (goal.progress >= 25) return theme.palette.info.main;
    return theme.palette.grey[400];
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 3,
        },
      }}
      onClick={handleGoalClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            {goal.title}
          </Typography>
          <Chip 
            label={goal.status === 'completed' ? 'Completed' : 'In Progress'} 
            color={goal.status === 'completed' ? 'success' : 'primary'}
            size="small"
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <CircularProgressWithLabel value={goal.progress} sx={{ color: getStatusColor() }} />
          
          <Box sx={{ ml: 2, flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
              Tasks: {goal.completedTasks}/{goal.totalTasks}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
              {daysCalculation()}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
              {goal.status === 'completed' 
                ? `Completed on ${new Date(goal.completedDate).toLocaleDateString()}`
                : `Deadline: ${new Date(goal.deadline).toLocaleDateString()}`
              }
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          {goal.categories.map(category => (
            <Chip 
              key={category} 
              label={category} 
              size="small" 
              sx={{ mr: 0.5, mb: 0.5 }} 
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// Milestone card component
function MilestoneCard({ milestone }) {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            {milestone.title}
          </Typography>
          {milestone.completed ? (
            <Chip 
              icon={<CheckCircleIcon />}
              label="Achieved" 
              color="success"
              size="small"
            />
          ) : (
            <Chip 
              icon={<AccessTimeIcon />}
              label="Upcoming" 
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {milestone.description}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
          <CalendarMonthIcon fontSize="small" sx={{ mr: 0.5 }} />
          {milestone.completed 
            ? `Achieved on ${new Date(milestone.date).toLocaleDateString()}`
            : `Expected by ${new Date(milestone.expectedDate).toLocaleDateString()}`
          }
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function ProgressPage() {
  const theme = useTheme();
  const notification = useNotification();
  
  // States
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [goals, setGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [inProgressGoals, setInProgressGoals] = useState([]);
  const [streaks, setStreaks] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [timeRange, setTimeRange] = useState('all-time');
  
  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set data from mocks
        setGoals(MOCK_GOALS);
        setCompletedGoals(MOCK_GOALS.filter(goal => goal.status === 'completed'));
        setInProgressGoals(MOCK_GOALS.filter(goal => goal.status === 'in-progress'));
        setStreaks(MOCK_STREAKS);
        setAchievements(MOCK_ACHIEVEMENTS);
        setMilestones(MOCK_MILESTONES);
        
        setLoading(false);
      } catch (error) {
        notification.showError('Failed to load progress data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [notification]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  // Share progress
  const handleShareProgress = () => {
    notification.showInfo('Sharing functionality will be implemented soon!');
  };
  
  if (loading) {
    return <LoadingState message="Loading progress data..." fullPage />;
  }
  
  return (
    <MainLayout>
      <PageHeader 
        title="Progress Tracking" 
        subtitle="Track your goals, streaks, and achievements" 
        actionButton={
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={handleShareProgress}
          >
            Share Progress
          </Button>
        }
      />
      
      {/* Streak Summary */}
      <Box sx={{ mb: 4 }}>
        <StreakDisplay streaks={streaks} />
      </Box>
      
      {/* Progress Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                  {completedGoals.length}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Completed Goals
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: theme.palette.info.main, fontWeight: 'bold' }}>
                  {inProgressGoals.length}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  In-Progress Goals
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                  {achievements.filter(a => a.unlocked).length}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Achievements Unlocked
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Tabs for different progress views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 0 }}
        >
          <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Goal Progress" />
          <Tab icon={<WorkspacePremiumIcon />} iconPosition="start" label="Achievements" />
          <Tab icon={<EmojiEventsIcon />} iconPosition="start" label="Milestones" />
        </Tabs>
      </Box>
      
      {/* Goal Progress Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="time-range-label">Time Range</InputLabel>
            <Select
              labelId="time-range-label"
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="all-time">All Time</MenuItem>
              <MenuItem value="this-month">This Month</MenuItem>
              <MenuItem value="this-quarter">This Quarter</MenuItem>
              <MenuItem value="this-year">This Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Typography variant="h6" sx={{ mb: 2 }}>Active Goals</Typography>
        <Grid container spacing={3}>
          {inProgressGoals.length > 0 ? (
            inProgressGoals.map(goal => (
              <Grid item xs={12} sm={6} md={4} key={goal.id}>
                <GoalProgressCard goal={goal} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No active goals found. Start creating new goals to track your progress!
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" sx={{ mb: 2 }}>Completed Goals</Typography>
        <Grid container spacing={3}>
          {completedGoals.length > 0 ? (
            completedGoals.map(goal => (
              <Grid item xs={12} sm={6} md={4} key={goal.id}>
                <GoalProgressCard goal={goal} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No completed goals yet. Keep working toward your goals!
              </Typography>
            </Grid>
          )}
        </Grid>
      </TabPanel>
      
      {/* Achievements Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" sx={{ mb: 2 }}>Unlocked Achievements</Typography>
        <Grid container spacing={3}>
          {achievements.filter(a => a.unlocked).length > 0 ? (
            achievements
              .filter(a => a.unlocked)
              .map(achievement => (
                <Grid item xs={12} sm={6} md={3} key={achievement.id}>
                  <AchievementCard achievement={achievement} />
                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No achievements unlocked yet. Keep using the app to earn achievements!
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" sx={{ mb: 2 }}>Locked Achievements</Typography>
        <Grid container spacing={3}>
          {achievements.filter(a => !a.unlocked).length > 0 ? (
            achievements
              .filter(a => !a.unlocked)
              .map(achievement => (
                <Grid item xs={12} sm={6} md={3} key={achievement.id}>
                  <AchievementCard achievement={achievement} />
                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                Congratulations! You've unlocked all achievements.
              </Typography>
            </Grid>
          )}
        </Grid>
      </TabPanel>
      
      {/* Milestones Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>Achieved Milestones</Typography>
        <Grid container spacing={3}>
          {milestones.filter(m => m.completed).length > 0 ? (
            milestones
              .filter(m => m.completed)
              .map(milestone => (
                <Grid item xs={12} sm={6} key={milestone.id}>
                  <MilestoneCard milestone={milestone} />
                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No milestones achieved yet. Keep working toward your goals!
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Milestones</Typography>
        <Grid container spacing={3}>
          {milestones.filter(m => !m.completed).length > 0 ? (
            milestones
              .filter(m => !m.completed)
              .map(milestone => (
                <Grid item xs={12} sm={6} key={milestone.id}>
                  <MilestoneCard milestone={milestone} />
                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No upcoming milestones. Set new goals to create more milestones!
              </Typography>
            </Grid>
          )}
        </Grid>
      </TabPanel>
    </MainLayout>
  );
} 