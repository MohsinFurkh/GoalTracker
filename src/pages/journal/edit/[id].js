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
  Chip,
  Autocomplete,
  useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, EditNote as EditNoteIcon } from '@mui/icons-material';

import MainLayout from '../../../components/layouts/MainLayout';
import { DatePicker } from '../../../components/common/DateTimePicker';
import LoadingState from '../../../components/common/LoadingState';
import ErrorState from '../../../components/common/ErrorState';
import { useNotification } from '../../../components/common/NotificationSystem';

// For demonstration purposes
const AVAILABLE_TAGS = [
  'Learning',
  'Progress',
  'Work',
  'Personal',
  'Health',
  'Fitness',
  'Challenges',
  'Achievement',
  'Reading',
  'Motivation',
  'Planning',
  'Reflection',
];

const MOOD_OPTIONS = [
  'Great',
  'Good',
  'Okay',
  'Meh',
  'Bad',
  'Awful',
];

export default function EditJournalEntry() {
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const notification = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'Good',
    date: new Date(),
    tags: [],
  });
  
  // Form errors
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    if (!id) return;

    // Fetch journal entry - for demo, we'll use dummy data
    const fetchJournalEntry = async () => {
      try {
        setTimeout(() => {
          // Mock data for demonstration
          const mockEntry = {
            _id: id,
            title: 'Weekly Reflection',
            content: 'Made good progress on the React learning path. Completed several important tasks and gained confidence with state management. The new approach to organizing components seems to be working well. I should continue with this method.',
            mood: 'Good',
            date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
            tags: ['Learning', 'Progress'],
          };
          
          setFormData({
            title: mockEntry.title,
            content: mockEntry.content,
            mood: mockEntry.mood,
            date: mockEntry.date,
            tags: mockEntry.tags || [],
          });
          
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load journal entry');
        setLoading(false);
      }
    };

    fetchJournalEntry();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleTagsChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, tags: newValue }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
    
    // Clear error when field is edited
    if (formErrors.date) {
      setFormErrors(prev => ({ ...prev, date: null }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    if (!formData.date) {
      errors.date = 'Date is required';
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
      // In production, call API to update journal entry
      // await updateJournalEntry(id, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.showSuccess('Journal entry updated successfully');
      router.push('/journal');
    } catch (error) {
      notification.showError('Failed to update journal entry');
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <LoadingState message="Loading journal entry..." />
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <ErrorState 
          title="Error Loading Journal Entry" 
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
          href="/journal" 
          startIcon={<ArrowBackIcon />}
          color="inherit"
        >
          Back to Journal
        </Button>
      </Box>
      
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Edit Journal Entry
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Update your journal entry.
      </Typography>
      
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Entry Title"
                  fullWidth
                  required
                  value={formData.title}
                  onChange={handleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title || 'Give your entry a meaningful title'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="mood-label">Mood</InputLabel>
                  <Select
                    labelId="mood-label"
                    name="mood"
                    value={formData.mood}
                    label="Mood"
                    onChange={handleChange}
                  >
                    {MOOD_OPTIONS.map(mood => (
                      <MenuItem key={mood} value={mood}>
                        {mood}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={handleDateChange}
                  error={formErrors.date}
                  maxDate={new Date()}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="content"
                  label="Journal Content"
                  placeholder="Write your thoughts, reflections, or notes about your day..."
                  fullWidth
                  multiline
                  rows={10}
                  required
                  value={formData.content}
                  onChange={handleChange}
                  error={!!formErrors.content}
                  helperText={formErrors.content}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  id="tags"
                  options={AVAILABLE_TAGS}
                  value={formData.tags}
                  onChange={handleTagsChange}
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
                      label="Tags"
                      helperText="Add tags to categorize your journal entry (optional)"
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
                    startIcon={<EditNoteIcon />}
                  >
                    Update Entry
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    href="/journal"
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
      
      {isSubmitting && <LoadingState message="Updating journal entry..." fullPage />}
    </MainLayout>
  );
} 