import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  Chip,
  Stack,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  EditNote as EditNoteIcon,
} from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import JournalCard from '../../components/journal/JournalCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useNotification } from '../../components/common/NotificationSystem';
import { formatDate } from '../../utils/dateUtils';

export default function JournalPage() {
  const router = useRouter();
  const theme = useTheme();
  const notification = useNotification();
  
  const [loading, setLoading] = useState(true);
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    mood: 'all',
    tag: 'all',
    period: 'all',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    // Fetch journal entries - for demo, we'll use dummy data
    const fetchJournals = async () => {
      setTimeout(() => {
        // Mock data for demonstration
        const mockJournals = [
          {
            _id: 'j1',
            title: 'Weekly Reflection',
            content: 'Made good progress on the React learning path. Completed several important tasks and gained confidence with state management. The new approach to organizing components seems to be working well. I should continue with this method.',
            mood: 'Good',
            date: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
            tags: ['Learning', 'Progress'],
          },
          {
            _id: 'j2',
            title: 'Morning Thoughts',
            content: 'Feeling motivated today after a good night\'s sleep. Starting the day with a clear mind and a plan to tackle the most important tasks first. Made a schedule for the day and set realistic goals.',
            mood: 'Great',
            date: new Date(),
            tags: ['Motivation', 'Planning'],
          },
          {
            _id: 'j3',
            title: 'Project Challenges',
            content: 'Facing some difficulties with the current project. The scope keeps changing, and it\'s hard to maintain focus. Need to discuss with the team about setting clearer boundaries and expectations. Feeling a bit frustrated but determined to find solutions.',
            mood: 'Okay',
            date: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
            tags: ['Work', 'Challenges'],
          },
          {
            _id: 'j4',
            title: 'Workout Achievement',
            content: 'Hit a new personal record in my workout today! The consistent training is finally paying off. Feeling proud of my progress and motivated to continue pushing my limits. The new routine seems to be effective.',
            mood: 'Great',
            date: new Date(new Date().getTime() - 4 * 24 * 60 * 60 * 1000),
            tags: ['Fitness', 'Achievement'],
          },
          {
            _id: 'j5',
            title: 'Reading Reflections',
            content: 'Finished an insightful book on productivity. Many of the concepts align with what I\'ve been trying to implement. Made notes of key takeaways to review later. Will try to apply some of these principles to my daily routine.',
            mood: 'Good',
            date: new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
            tags: ['Reading', 'Learning'],
          },
        ];
        
        setJournals(mockJournals);
        setLoading(false);
      }, 1000);
    };

    fetchJournals();
  }, []);

  // Apply filters and sort whenever journals, filters, or search term changes
  useEffect(() => {
    if (!journals.length) return;

    let result = [...journals];

    // Apply mood filter
    if (filters.mood !== 'all') {
      result = result.filter(journal => journal.mood === filters.mood);
    }

    // Apply tag filter
    if (filters.tag !== 'all') {
      result = result.filter(journal => 
        journal.tags && journal.tags.includes(filters.tag)
      );
    }

    // Apply time period filter
    if (filters.period !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (filters.period) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        result = result.filter(journal => new Date(journal.date) >= startDate);
      }
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(journal => 
        (journal.title && journal.title.toLowerCase().includes(term)) || 
        (journal.content && journal.content.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredJournals(result);
  }, [journals, filters, searchTerm, sortBy]);

  // Get unique tags from all journals
  const allTags = () => {
    const tags = new Set();
    journals.forEach(journal => {
      if (journal.tags && journal.tags.length) {
        journal.tags.forEach(tag => tags.add(tag));
      }
    });
    return ['all', ...Array.from(tags)];
  };

  // Get unique moods from all journals
  const allMoods = () => {
    const moods = new Set();
    journals.forEach(journal => {
      if (journal.mood) {
        moods.add(journal.mood);
      }
    });
    return ['all', ...Array.from(moods)];
  };

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const clearFilters = () => {
    setFilters({
      mood: 'all',
      tag: 'all',
      period: 'all',
    });
    setSearchTerm('');
  };

  const handleEditJournal = (journal) => {
    router.push(`/journal/edit/${journal._id}`);
  };

  const handleDeleteJournal = (journal) => {
    setConfirmDelete(journal);
  };

  const confirmDeleteJournal = async () => {
    if (!confirmDelete) return;

    try {
      // In production, call API to delete journal
      // await deleteJournal(confirmDelete._id);
      
      // Update local state for demo
      setJournals(journals.filter(j => j._id !== confirmDelete._id));
      notification.showSuccess(`Journal entry "${confirmDelete.title}" deleted successfully`);
      setConfirmDelete(null);
    } catch (error) {
      notification.showError('Failed to delete journal entry');
    }
  };

  // Helper to render active filters as chips
  const renderFilterChips = () => {
    const activeFilters = [];
    
    if (filters.mood !== 'all') {
      activeFilters.push({
        key: 'mood',
        label: `Mood: ${filters.mood}`,
        onDelete: () => handleFilterChange('mood', 'all'),
      });
    }
    
    if (filters.tag !== 'all') {
      activeFilters.push({
        key: 'tag',
        label: `Tag: ${filters.tag}`,
        onDelete: () => handleFilterChange('tag', 'all'),
      });
    }
    
    if (filters.period !== 'all') {
      const periodLabels = {
        'today': 'Today',
        'week': 'Past Week',
        'month': 'Past Month',
      };
      
      activeFilters.push({
        key: 'period',
        label: `Period: ${periodLabels[filters.period]}`,
        onDelete: () => handleFilterChange('period', 'all'),
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
        <LoadingState message="Loading journal entries..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Journal"
        subtitle="Record and reflect on your journey"
        actionButton={
          <Button
            variant="contained"
            startIcon={<EditNoteIcon />}
            onClick={() => router.push('/journal/new')}
          >
            New Entry
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
                placeholder="Search journal entries..."
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
                <InputLabel>Mood</InputLabel>
                <Select
                  value={filters.mood}
                  label="Mood"
                  onChange={(e) => handleFilterChange('mood', e.target.value)}
                >
                  <MenuItem value="all">All Moods</MenuItem>
                  {allMoods().filter(mood => mood !== 'all').map(mood => (
                    <MenuItem key={mood} value={mood}>{mood}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Tag</InputLabel>
                <Select
                  value={filters.tag}
                  label="Tag"
                  onChange={(e) => handleFilterChange('tag', e.target.value)}
                >
                  <MenuItem value="all">All Tags</MenuItem>
                  {allTags().filter(tag => tag !== 'all').map(tag => (
                    <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={filters.period}
                  label="Time Period"
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">Past Week</MenuItem>
                  <MenuItem value="month">Past Month</MenuItem>
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
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="title">Title (A-Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {renderFilterChips()}
        </CardContent>
      </Card>

      {/* Journal Entries List */}
      {filteredJournals.length === 0 ? (
        <EmptyState
          title="No journal entries found"
          message={
            journals.length === 0
              ? "You haven't created any journal entries yet."
              : "No entries match your current filters."
          }
          action={
            journals.length === 0 ? (
              <Button
                variant="contained"
                startIcon={<EditNoteIcon />}
                onClick={() => router.push('/journal/new')}
              >
                Write First Entry
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
            Showing {filteredJournals.length} of {journals.length} entries
          </Typography>
          
          <Grid container spacing={3}>
            {filteredJournals.map((journal) => (
              <Grid item xs={12} key={journal._id}>
                <JournalCard
                  journal={journal}
                  onEdit={handleEditJournal}
                  onDelete={handleDeleteJournal}
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
        onConfirm={confirmDeleteJournal}
        title="Delete Journal Entry"
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