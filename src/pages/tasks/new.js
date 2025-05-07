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
  Stack,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import { DatePicker } from '../../components/common/DateTimePicker';
import LoadingState from '../../components/common/LoadingState';
import { useNotification } from '../../components/common/NotificationSystem';

export default function NewTask() {
  const router = useRouter();
  const { goalId } = router.query; // If coming from a specific goal
  const notification = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
  
  // Load goals for the dropdown
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        // Fetch goals from API
        const response = await fetch('/api/goals');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch goals: ${response.statusText}`);
        }
        
        const goalsData = await response.json();
        console.log('Fetched goals:', goalsData.length);
        setGoals(goalsData);
        
        // If goalId is provided in query params, set it
        if (goalId) {
          setFormData(prev => ({ ...prev, goalId }));
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        notification.showError(`Failed to load goals: ${error.message}`);
        // Set empty goals array to prevent errors
        setGoals([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoals();
  }, [goalId, notification]);
  
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
      // Format the data for the API
      const taskData = {
        title: formData.title,
        description: formData.description,
        goalId: formData.goalId,
        priority: formData.priority,
        dueDate: formData.dueDate,
        completed: formData.completed
      };
      
      console.log('Submitting task data:', taskData);
      
      // Call API to create task
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to create task: ${errorData.error || response.statusText}`);
      }
      
      const createdTask = await response.json();
      console.log('Created task:', createdTask);
      
      notification.showSuccess('Task created successfully');
      
      // Redirect to goal detail if came from a goal, otherwise to tasks list
      if (goalId) {
        router.push(`/goals/${goalId}`);
      } else {
        router.push('/tasks');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      notification.showError(`Failed to create task: ${error.message}`);
      setIsSubmitting(false);
    }
  };
  
  const getBackUrl = () => {
    if (goalId) {
      return `/goals/${goalId}`;
    }
    return '/tasks';
  };
  
  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading..." />
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          href={getBackUrl()} 
          startIcon={<ArrowBackIcon />}
          color="inherit"
        >
          {goalId ? 'Back to Goal' : 'Back to Tasks'}
        </Button>
      </Box>
      
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Create New Task
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Add a new task to track your progress towards your goals.
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
                    Create Task
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    href={getBackUrl()}
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
      
      {isSubmitting && <LoadingState message="Creating task..." fullPage />}
    </MainLayout>
  );
} 