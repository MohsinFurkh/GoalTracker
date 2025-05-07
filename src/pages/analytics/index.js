import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  useTheme,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Insights as InsightsIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import LoadingState from '../../components/common/LoadingState';
import StatsCard from '../../components/dashboard/StatsCard';
import ProgressIndicator from '../../components/common/ProgressIndicator';
import { formatDate } from '../../utils/dateUtils';

// For the charts, we would use a library like Chart.js or Recharts in a real app
// Here we'll create placeholder components to simulate the charts

const BarChart = ({ data, title, labels }) => {
  const theme = useTheme();
  return (
    <Box sx={{ width: '100%', position: 'relative', height: 300, mt: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          height: 250, 
          justifyContent: 'space-around',
          padding: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        {data.map((value, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 40, 
                bgcolor: theme.palette.primary.main, 
                height: `${value * 2}px`,
                maxHeight: 200,
                borderRadius: '4px 4px 0 0',
                mb: 1,
                transition: 'height 0.5s ease-in-out',
              }} 
            />
            <Typography variant="caption" color="text.secondary">{labels[index]}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const LineChart = ({ data, title, labels }) => {
  const theme = useTheme();
  
  // Calculate points for the line
  const maxDataValue = Math.max(...data);
  const height = 200;
  const pointCount = data.length;
  const width = 100 * (pointCount - 1);
  
  const points = data.map((value, index) => {
    const x = (index / (pointCount - 1)) * width;
    const y = height - (value / maxDataValue) * height;
    return { x, y };
  });
  
  const pathD = points.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <Box sx={{ width: '100%', position: 'relative', height: 300, mt: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Box sx={{ 
        position: 'relative', 
        height: 250, 
        padding: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg width={width + 20} height={height + 20} viewBox={`0 0 ${width + 20} ${height + 20}`}>
          <g transform="translate(10, 10)">
            <path 
              d={pathD} 
              fill="none" 
              stroke={theme.palette.primary.main} 
              strokeWidth="3"
            />
            {points.map((point, i) => (
              <circle 
                key={i} 
                cx={point.x} 
                cy={point.y} 
                r="5" 
                fill={theme.palette.primary.main}
              />
            ))}
          </g>
        </svg>
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'space-around',
            px: 3,
            mt: 1
          }}
        >
          {labels.map((label, index) => (
            <Typography key={index} variant="caption" color="text.secondary">{label}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const PieChart = ({ data, title, labels, colors }) => {
  const theme = useTheme();
  const total = data.reduce((acc, curr) => acc + curr, 0);
  
  // Calculate the segments of the pie
  let cumulativePercentage = 0;
  const segments = data.map((value, index) => {
    const percentage = (value / total) * 100;
    const startAngle = cumulativePercentage;
    cumulativePercentage += percentage;
    const endAngle = cumulativePercentage;
    const startCoords = polarToCartesian(50, 50, 40, startAngle * 3.6); // 3.6 = 360 / 100
    const endCoords = polarToCartesian(50, 50, 40, endAngle * 3.6);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const pathData = [
      `M 50 50`,
      `L ${startCoords.x} ${startCoords.y}`,
      `A 40 40 0 ${largeArcFlag} 1 ${endCoords.x} ${endCoords.y}`,
      `Z`
    ].join(' ');
    
    return {
      path: pathData,
      percentage,
      color: colors ? colors[index] : theme.palette[`${index === 0 ? 'primary' : index === 1 ? 'secondary' : 'success'}`].main
    };
  });
  
  // Legend elements
  const legendItems = labels.map((label, index) => ({
    label,
    color: colors ? colors[index] : theme.palette[`${index === 0 ? 'primary' : index === 1 ? 'secondary' : 'success'}`].main,
    value: data[index]
  }));
  
  return (
    <Box sx={{ width: '100%', position: 'relative', height: 300, mt: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: 250
      }}>
        <Box sx={{ width: '60%', display: 'flex', justifyContent: 'center' }}>
          <svg width="200" height="200" viewBox="0 0 100 100">
            {segments.map((segment, i) => (
              <path 
                key={i} 
                d={segment.path} 
                fill={segment.color}
              />
            ))}
          </svg>
        </Box>
        <Box sx={{ width: '40%' }}>
          {legendItems.map((item, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  bgcolor: item.color, 
                  borderRadius: '2px',
                  mr: 1
                }} 
              />
              <Typography variant="body2">
                {item.label} - {((item.value / total) * 100).toFixed(1)}% ({item.value})
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// Helper function for pie chart
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [tabValue, setTabValue] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle time range change
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  useEffect(() => {
    // Fetch analytics data - for demo, we'll use dummy data
    const fetchAnalyticsData = async () => {
      setTimeout(() => {
        // Mock data for demonstration
        setAnalyticsData({
          summary: {
            totalGoals: 5,
            completedGoals: 2,
            totalTasks: 25,
            completedTasks: 15,
            completionRate: 60,
            tasksThisWeek: 12,
            tasksCompletedThisWeek: 8,
          },
          goalsData: {
            byStatus: {
              labels: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
              data: [1, 2, 2, 0],
              colors: [theme.palette.grey[500], theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main]
            },
            byPriority: {
              labels: ['High', 'Medium', 'Low'],
              data: [2, 2, 1],
              colors: [theme.palette.error.main, theme.palette.warning.main, theme.palette.info.main]
            },
            byCategory: {
              labels: ['Learning', 'Health', 'Work', 'Personal'],
              data: [2, 1, 1, 1]
            },
            timeline: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              completed: [0, 1, 0, 0, 1, 0],
              created: [1, 1, 0, 2, 1, 0]
            }
          },
          tasksData: {
            weeklyCompletion: {
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              data: [2, 3, 1, 4, 2, 1, 0]
            },
            byPriority: {
              labels: ['High', 'Medium', 'Low'],
              data: [8, 12, 5],
              colors: [theme.palette.error.main, theme.palette.warning.main, theme.palette.info.main]
            },
            completionTrend: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              data: [40, 45, 52, 48, 60, 65]
            }
          },
          journalData: {
            entriesByMonth: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              data: [4, 5, 3, 6, 4, 2]
            },
            moodDistribution: {
              labels: ['Great', 'Good', 'Okay', 'Meh', 'Bad', 'Awful'],
              data: [5, 8, 7, 3, 1, 0],
              colors: [
                theme.palette.success.main, 
                theme.palette.success.light, 
                theme.palette.info.main, 
                theme.palette.warning.light, 
                theme.palette.warning.main, 
                theme.palette.error.main
              ]
            },
            topTags: {
              labels: ['Learning', 'Progress', 'Work', 'Motivation', 'Challenge'],
              data: [7, 6, 5, 4, 3]
            }
          }
        });
        setLoading(false);
      }, 1500);
    };

    fetchAnalyticsData();
  }, [timeRange, theme.palette]);
  
  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading analytics..." />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <PageHeader
        title="Analytics & Reports"
        subtitle="Track your progress and gain insights"
        actionButton={null}
      />
      
      {/* Time range selector */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="week">Past Week</MenuItem>
            <MenuItem value="month">Past Month</MenuItem>
            <MenuItem value="quarter">Past 3 Months</MenuItem>
            <MenuItem value="year">Past Year</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Overview Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Goals"
            value={analyticsData.summary.totalGoals}
            subtitle={`${analyticsData.summary.completedGoals} completed`}
            trend={analyticsData.summary.completedGoals / analyticsData.summary.totalGoals * 100}
            trendLabel="completion rate"
            icon={<TrendingUpIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Tasks"
            value={analyticsData.summary.totalTasks}
            subtitle={`${analyticsData.summary.completedTasks} completed`}
            trend={analyticsData.summary.completionRate}
            trendLabel="completion rate"
            icon={<CheckCircleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="This Week"
            value={analyticsData.summary.tasksCompletedThisWeek}
            subtitle={`of ${analyticsData.summary.tasksThisWeek} tasks`}
            trend={(analyticsData.summary.tasksCompletedThisWeek / analyticsData.summary.tasksThisWeek) * 100}
            trendLabel="completion rate"
            icon={<DateRangeIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Insights"
            value={analyticsData.summary.completionRate + '%'}
            subtitle="Overall completion rate"
            icon={<InsightsIcon />}
            color="secondary"
          />
        </Grid>
      </Grid>
      
      {/* Tabs for different analytics views */}
      <Box sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Goals Analytics" />
          <Tab label="Tasks Analytics" />
          <Tab label="Journal Analytics" />
          <Tab label="Productivity Insights" />
        </Tabs>
      </Box>
      
      {/* Tab Panels */}
      <Box sx={{ mb: 3 }}>
        {/* Goals Analytics */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Goals by Status
                  </Typography>
                  <PieChart 
                    data={analyticsData.goalsData.byStatus.data}
                    labels={analyticsData.goalsData.byStatus.labels}
                    colors={analyticsData.goalsData.byStatus.colors}
                    title=""
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Goals by Priority
                  </Typography>
                  <PieChart 
                    data={analyticsData.goalsData.byPriority.data}
                    labels={analyticsData.goalsData.byPriority.labels}
                    colors={analyticsData.goalsData.byPriority.colors}
                    title=""
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Goal Timeline
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <LineChart 
                      data={analyticsData.goalsData.timeline.created}
                      labels={analyticsData.goalsData.timeline.labels}
                      title="Goals Created"
                    />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <BarChart 
                      data={analyticsData.goalsData.timeline.completed}
                      labels={analyticsData.goalsData.timeline.labels}
                      title="Goals Completed"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {/* Tasks Analytics */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Weekly Task Completion
                  </Typography>
                  <BarChart 
                    data={analyticsData.tasksData.weeklyCompletion.data}
                    labels={analyticsData.tasksData.weeklyCompletion.labels}
                    title=""
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Tasks by Priority
                  </Typography>
                  <PieChart 
                    data={analyticsData.tasksData.byPriority.data}
                    labels={analyticsData.tasksData.byPriority.labels}
                    colors={analyticsData.tasksData.byPriority.colors}
                    title=""
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Task Completion Trend
                  </Typography>
                  <LineChart 
                    data={analyticsData.tasksData.completionTrend.data}
                    labels={analyticsData.tasksData.completionTrend.labels}
                    title=""
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {/* Journal Analytics */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Journal Entries
                  </Typography>
                  <BarChart 
                    data={analyticsData.journalData.entriesByMonth.data}
                    labels={analyticsData.journalData.entriesByMonth.labels}
                    title=""
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Mood Distribution
                  </Typography>
                  <PieChart 
                    data={analyticsData.journalData.moodDistribution.data}
                    labels={analyticsData.journalData.moodDistribution.labels}
                    colors={analyticsData.journalData.moodDistribution.colors}
                    title=""
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Journal Tags
                  </Typography>
                  <BarChart 
                    data={analyticsData.journalData.topTags.data}
                    labels={analyticsData.journalData.topTags.labels}
                    title=""
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
        
        {/* Productivity Insights */}
        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Overall Progress
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ my: 2 }}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>Goal Completion</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <ProgressIndicator 
                            value={(analyticsData.summary.completedGoals / analyticsData.summary.totalGoals) * 100} 
                            type="circular" 
                            size="large" 
                            color="primary"
                            showPercentage
                          />
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>Task Completion</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <ProgressIndicator 
                            value={analyticsData.summary.completionRate} 
                            type="circular" 
                            size="large" 
                            color="success"
                            showPercentage
                          />
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom>Weekly Progress</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <ProgressIndicator 
                            value={(analyticsData.summary.tasksCompletedThisWeek / analyticsData.summary.tasksThisWeek) * 100} 
                            type="circular" 
                            size="large" 
                            color="info"
                            showPercentage
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Insights & Recommendations
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Productivity Patterns
                      </Typography>
                      <Typography variant="body2">
                        Your most productive day is <strong>Thursday</strong> with an average of 4 tasks completed.
                        Consider scheduling your most important tasks on this day.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Goal Achievement
                      </Typography>
                      <Typography variant="body2">
                        You've completed 40% of your goals. Goals in the "Learning" category have the highest completion rate (75%).
                        Consider breaking down larger goals into smaller milestones for better progress tracking.
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Mood Correlation
                      </Typography>
                      <Typography variant="body2">
                        Journal entries with "Great" mood correlate with higher task completion rates.
                        On days when you've completed multiple tasks, your mood is generally more positive.
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </MainLayout>
  );
} 