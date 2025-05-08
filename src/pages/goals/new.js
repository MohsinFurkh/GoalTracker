import { useState } from 'react';
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
  Chip,
  Autocomplete,
  Stack,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import { DatePicker } from '../../components/common/DateTimePicker';
import LoadingState from '../../components/common/LoadingState';
import { useNotification } from '../../components/common/NotificationSystem';
import { formatDateForInput } from '../../utils/dateUtils';

// For demonstration purposes
const AVAILABLE_CATEGORIES = [
  'Personal',
  'Work',
  'Health',
  'Fitness',
  'Finance',
  'Education',
  'Learning',
  'Career',
  'Habits',
  'Relationships',
  'Travel',
  'Programming',
  'Language',
];

export default function NewGoal() {
  const router = useRouter();
  const notification = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    categories: [],
    deadline: null,
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleCategoriesChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, categories: newValue }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, deadline: date }));
    
    // Clear error when field is edited
    if (formErrors.deadline) {
      setFormErrors(prev => ({ ...prev, deadline: null }));
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
    
    if (!formData.deadline) {
      errors.deadline = 'Deadline is required';
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
      const goalData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        categories: formData.categories,
        deadline: formData.deadline ? formData.deadline.toISOString() : null,
      };
      
      console.log('Submitting goal data:', goalData);
      
      // Call the API to create the goal
      console.log('Sending request to create new goal to API');
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.log('Server returned non-json response');
          // If response is not JSON
          const errorMessage = `Failed to create goal: Server returned non-JSON response - Status: ${response.status} - ${response.statusText}`;
          console.error('Non-JSON Error:', errorMessage, jsonError);
          throw new Error(errorMessage);
        }
        
        // If we received JSON, but it has an 'error' property
        if (errorData && errorData.error) {
          throw new Error(`Failed to create goal: ${errorData.error}`);
        } else {
          throw new Error(`Failed to create goal: Status: ${response.status} - ${response.statusText}`);
        }
      }
      
      const createdGoal = await response.json();

      
      console.log('Created goal:', createdGoal);
      
      notification.showSuccess('Goal created successfully');
      router.push('/goals');
    } catch (error) { //This catch block handles errors in fetch method and also in the try block
      console.error('Error creating goal:', error);
      notification.showError(`Failed to create goal: ${error.message}`);      
    }
      
    setIsSubmitting(false);
  };
  
  return (
    <MainLayout>
      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <Button 
          component={Link} 
          href="/goals" 
          startIcon={<ArrowBackIcon />}
          color="inherit"
        >
          Back to Goals
        </Button>
      </Box>
      
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Create New Goal
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Set clear, specific goals to track your progress and achievements.
      </Typography>
      
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Goal Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title || 'Give your goal a clear, specific title'}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description || 'Describe your goal in detail, including why it matters'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth required>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="Not Started">Not Started</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                    <MenuItem value="Abandoned">Abandoned</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
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
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <DatePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={handleDateChange}
                  error={formErrors.deadline}
                  helperText="When do you want to achieve this goal?"
                  required
                  minDate={new Date()}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="categories"
                  options={AVAILABLE_CATEGORIES}
                  value={formData.categories}
                  onChange={handleCategoriesChange}
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip 
                        variant="outlined" 
                        label={option} 
                        {...getTagProps({ index })} 
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categories"
                      helperText="Add categories to organize your goals (optional)"
                    />
                  )}
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
                    Create Goal
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    href="/goals"
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
      
      {isSubmitting && <LoadingState message="Creating goal..." fullPage />}
    </MainLayout>
  );
}