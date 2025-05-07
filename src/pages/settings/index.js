import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  Paper,
  Tab,
  Tabs,
  TextField,
  Button,
  Divider,
  Grid,
  Avatar,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import MainLayout from '../../components/layouts/MainLayout';
import { useNotification } from '../../components/common/NotificationSystem';

// Tab Panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const notification = useNotification();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // User profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    goalUpdates: true,
  });

  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    compactView: false,
    showCompletedTasks: true,
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Load user data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserSettings();
    } else if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status, router]);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/user/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user settings');
      }
      
      const userData = await response.json();
      
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
      });
      
      // Set notification and display settings if available from the server
      if (userData.notificationSettings) {
        setNotificationSettings(userData.notificationSettings);
      }
      
      if (userData.displaySettings) {
        setDisplaySettings(userData.displaySettings);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user settings:', error);
      setError('Failed to load settings. Please try again.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation errors when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation errors when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleDisplayChange = (e) => {
    const { name, checked } = e.target;
    setDisplaySettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const validateProfile = () => {
    const errors = {};
    
    if (!profile.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profile.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      errors.email = 'Invalid email format';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordChange = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters long';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveProfile = async () => {
    if (!validateProfile()) {
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      notification.showSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!validatePasswordChange()) {
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }
      
      notification.showSuccess('Password changed successfully');
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationSettings,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update notification settings');
      }
      
      notification.showSuccess('Notification settings updated');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setError(error.message || 'Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const saveDisplaySettings = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displaySettings,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update display settings');
      }
      
      notification.showSuccess('Display settings updated');
    } catch (error) {
      console.error('Error updating display settings:', error);
      setError(error.message || 'Failed to update display settings');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="settings tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Profile" />
          <Tab label="Security" />
          <Tab label="Notifications" />
          <Tab label="Display" />
        </Tabs>

        {/* Profile Tab */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Typography variant="h6">Profile Information</Typography>
            <Button
              variant="outlined"
              startIcon={editMode ? <SaveIcon /> : <EditIcon />}
              onClick={editMode ? saveProfile : toggleEditMode}
              disabled={saving}
            >
              {editMode ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}
                alt={profile.name}
              >
                {profile.name?.charAt(0) || 'U'}
              </Avatar>
              {editMode && (
                <Button variant="text" disabled>
                  Change Photo
                </Button>
              )}
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                disabled={!editMode}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                disabled={!editMode}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Member since: {new Date(session?.user?.createdAt || Date.now()).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" sx={{ mb: 3 }}>Change Password</Typography>
          
          <TextField
            fullWidth
            margin="normal"
            label="Current Password"
            name="currentPassword"
            type={showPassword ? 'text' : 'password'}
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            error={!!formErrors.currentPassword}
            helperText={formErrors.currentPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={!!formErrors.newPassword}
            helperText={formErrors.newPassword}
          />
          
          <TextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={changePassword}
              disabled={saving}
              startIcon={<SaveIcon />}
            >
              {saving ? 'Changing Password...' : 'Change Password'}
            </Button>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h6" sx={{ mb: 2 }}>Sessions</Typography>
          <Typography variant="body2" color="text.secondary">
            You're currently signed in on this device. Sessions automatically expire after 30 days of inactivity.
          </Typography>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" sx={{ mb: 3 }}>Notification Preferences</Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                name="emailNotifications"
                color="primary"
              />
            }
            label="Email Notifications"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
            Receive notifications via email for important updates
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.pushNotifications}
                onChange={handleNotificationChange}
                name="pushNotifications"
                color="primary"
              />
            }
            label="Push Notifications"
            disabled
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
            Receive push notifications in your browser (Coming soon)
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 2, mt: 3 }}>Notification Types</Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.taskReminders}
                onChange={handleNotificationChange}
                name="taskReminders"
                color="primary"
              />
            }
            label="Task Reminders"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
            Get reminded about upcoming and overdue tasks
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={notificationSettings.goalUpdates}
                onChange={handleNotificationChange}
                name="goalUpdates"
                color="primary"
              />
            }
            label="Goal Progress Updates"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
            Receive updates on your goal progress
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={saveNotificationSettings}
              disabled={saving}
              startIcon={<SaveIcon />}
            >
              {saving ? 'Saving...' : 'Save Notification Settings'}
            </Button>
          </Box>
        </TabPanel>

        {/* Display Tab */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" sx={{ mb: 3 }}>Display Settings</Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={displaySettings.darkMode}
                onChange={handleDisplayChange}
                name="darkMode"
                color="primary"
              />
            }
            label="Dark Mode"
            disabled
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
            Use dark color theme (Coming soon)
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={displaySettings.compactView}
                onChange={handleDisplayChange}
                name="compactView"
                color="primary"
              />
            }
            label="Compact View"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
            Display more items at once with a compact layout
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={displaySettings.showCompletedTasks}
                onChange={handleDisplayChange}
                name="showCompletedTasks"
                color="primary"
              />
            }
            label="Show Completed Tasks"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 3 }}>
            Display completed tasks in task lists
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={saveDisplaySettings}
              disabled={saving}
              startIcon={<SaveIcon />}
            >
              {saving ? 'Saving...' : 'Save Display Settings'}
            </Button>
          </Box>
        </TabPanel>
      </Paper>
    </MainLayout>
  );
} 