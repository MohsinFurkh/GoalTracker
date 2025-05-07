import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import MainLayout from '../../../components/layouts/MainLayout';
import { DatePicker } from '../../../components/common/DateTimePicker';
import LoadingState from '../../../components/common/LoadingState';
import ErrorState from '../../../components/common/ErrorState';
import { useNotification } from '../../../components/common/NotificationSystem';

export default function EditTask() {
  const router = useRouter();
  const { id } = router.query;
  const notification = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [goals, setGoals] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: null,
    goalId: '',
    completed: false,
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({});
  const [originGoalId, setOriginGoalId] = useState(null);
  
  useEffect(() => {
    if (!id) return;

    // Fetch task data and goals - for demo, we'll use dummy data
    const fetchTaskAndGoals = async () => {
      try {
        // Fetch goals
        const mockGoals = [
          {
            _id: 'g1',
            title: 'Learn React and NextJS',
          },
          {
            _id: 'g2',
            title: 'Exercise Regularly',
          },
          {
            _id: 'g3',
            title: 'Read 20 Books',
          },
        ];
        setGoals(mockGoals);
        
        // Fetch task
        setTimeout(() => {
          // Mock data for demonstration
          const mockTask = {
            _id: id,
            title: 'Complete dashboard implementation',
            description: 'Finish the dashboard UI and functionality',
            priority: 'High',
            dueDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
            completed: false,
            goalId: 'g1',
            goalTitle: 'Learn React and NextJS',
          };
          
          setFormData({
            title: mockTask.title,
            description: mockTask.description || '',
            priority: mockTask.priority,
            dueDate: mockTask.dueDate,
            goalId: mockTask.goalId,
            completed: mockTask.completed,
          });
          
          setOriginGoalId(mockTask.goalId);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load task data');
        setLoading(false);
      }
    };

    fetchTaskAndGoals();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dueDate: date }));
    
    // Clear error when field is edited
    if (formErrors.dueDate) {
      setFormErrors(prev => ({ ...prev, dueDate: null }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }
    
    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    
    if (!formData.goalId) {
      errors.goalId = 'Please select a goal for this task';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notification.showError('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In production, call API to update task
      // await updateTask(id, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.showSuccess('Task updated successfully');
      
      // Redirect to goal detail if the task's goal changed, otherwise back to tasks
      if (formData.goalId !== originGoalId) {
        router.push(`/goals/${formData.goalId}`);
      } else {
        router.push('/tasks');
      }
    } catch (error) {
      notification.showError('Failed to update task');
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading task data..." />
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <ErrorState 
          title="Error Loading Task" 
          message={error} 
          onRetry={() => router.reload()}
        />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          href="/tasks" 
          startIcon={<ArrowBackIcon />}
          color="inherit"
        >
          Back to Tasks
        </Button>
      </Box>
      
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Edit Task
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Update task details or mark it as completed.
      </Typography>
      
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Task Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title || 'What needs to be done?'}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description || 'Add details about this task (optional)'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!formErrors.goalId}>
                  <InputLabel id="goal-label">Related Goal</InputLabel>
                  <Select
                    labelId="goal-label"
                    name="goalId"
                    value={formData.goalId}
                    label="Related Goal"
                    onChange={handleChange}
                  >
                    <MenuItem value="">
                      <em>Select a goal</em>
                    </MenuItem>
                    {goals.map(goal => (
                      <MenuItem key={goal._id} value={goal._id}>
                        {goal.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formErrors.goalId || 'Which goal does this task contribute to?'}
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    name="priority"
                    value={formData.priority}
                    label="Priority"
                    onChange={handleChange}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                  <FormHelperText>
                    How important is this task?
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={handleDateChange}
                  error={formErrors.dueDate}
                  helperText="When should this task be completed?"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="completed"
                      checked={formData.completed}
                      onChange={handleChange}
                    />
                  }
                  label="Mark as completed"
                  sx={{ mt: 2 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    href="/tasks"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      
      {isSubmitting && <LoadingState message="Updating task..." fullPage />}
    </MainLayout>
  );
} 