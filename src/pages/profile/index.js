import { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Lock as LockIcon,
  CloudDownload as CloudDownloadIcon,
  Storage as StorageIcon,
  Camera as CameraIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

import MainLayout from '../../components/layouts/MainLayout';
import PageHeader from '../../components/common/PageHeader';
import { useNotification } from '../../components/common/NotificationSystem';
import LoadingState from '../../components/common/LoadingState';

// Mock user data
const MOCK_USER = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
  joinDate: '2023-01-15',
  timezone: 'America/New_York',
  language: 'English',
};

// TabPanel component for the tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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

export default function ProfilePage() {
  const theme = useTheme();
  const notification = useNotification();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Loading state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile information states
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    timezone: '',
    language: '',
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    goalReminders: true,
    taskReminders: true,
    weeklyDigest: true,
    journalReminders: false,
  });
  
  // Display settings
  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    highContrast: false,
    reducedMotion: false,
    largeText: false,
    compactView: false,
    showCompletedItems: true,
  });
  
  // Data & Privacy settings
  const [dataSettings, setDataSettings] = useState({
    dataBackup: true,
    analyticsConsent: true,
    dataSharing: false,
    storeHistory: true,
  });
  
  // Load user data
  useEffect(() => {
    // Simulate API call to fetch user data
    const fetchUserData = async () => {
      try {
        // Simulating network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUser(MOCK_USER);
        setProfileForm({
          name: MOCK_USER.name,
          email: MOCK_USER.email,
          timezone: MOCK_USER.timezone,
          language: MOCK_USER.language,
        });
        
        setLoading(false);
      } catch (error) {
        notification.showError('Failed to load user profile');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [notification]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle profile edit mode toggle
  const handleEditModeToggle = () => {
    if (editMode) {
      // Reset form if canceling edit
      setProfileForm({
        name: user.name,
        email: user.email,
        timezone: user.timezone,
        language: user.language,
      });
    }
    setEditMode(!editMode);
  };
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle profile save
  const handleProfileSave = async () => {
    setSaving(true);
    
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local user data
      setUser(prev => ({
        ...prev,
        name: profileForm.name,
        email: profileForm.email,
        timezone: profileForm.timezone,
        language: profileForm.language,
      }));
      
      setEditMode(false);
      notification.showSuccess('Profile updated successfully');
    } catch (error) {
      notification.showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Toggle password visibility
  const handleTogglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
  
  // Handle password update
  const handlePasswordUpdate = async () => {
    // Basic validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      notification.showError('All password fields are required');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notification.showError('New passwords do not match');
      return;
    }
    
    setSaving(true);
    
    try {
      // Simulate API call to update password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      notification.showSuccess('Password updated successfully');
    } catch (error) {
      notification.showError('Failed to update password');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle notification setting change
  const handleNotificationSettingChange = (event) => {
    const { name, checked } = event.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  // Handle display setting change
  const handleDisplaySettingChange = (event) => {
    const { name, checked } = event.target;
    setDisplaySettings(prev => ({
      ...prev,
      [name]: checked,
    }));
    
    // Simulate applying theme changes
    if (name === 'darkMode') {
      notification.showInfo(checked ? 'Dark mode enabled' : 'Light mode enabled');
    }
  };
  
  // Handle data setting change
  const handleDataSettingChange = (event) => {
    const { name, checked } = event.target;
    setDataSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  // Handle data export
  const handleExportData = () => {
    notification.showInfo('Preparing your data export. You will receive an email when it\'s ready.');
  };
  
  // Handle account deletion request
  const handleDeleteAccount = () => {
    notification.showWarning(
      'Account deletion is permanent. Please contact support to proceed with account deletion.'
    );
  };
  
  if (loading) {
    return <LoadingState message="Loading profile..." fullPage />;
  }
  
  return (
    <MainLayout>
      <PageHeader 
        title="Profile & Settings" 
        subtitle="Manage your account and preferences" 
      />
      
      <Grid container spacing={3}>
        {/* Sidebar with user info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={user.avatarUrl}
                  alt={user.name}
                  sx={{ width: 120, height: 120, mx: 'auto' }}
                />
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    right: 0, 
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': { backgroundColor: theme.palette.background.default }
                  }}
                >
                  <CameraIcon />
                </IconButton>
              </Box>
              
              <Typography variant="h5" gutterBottom>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Member since {new Date(user.joinDate).toLocaleDateString()}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <List dense>
                <ListItem>
                  <ListItemIcon><AccessTimeIcon /></ListItemIcon>
                  <ListItemText primary="Timezone" secondary={user.timezone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><LanguageIcon /></ListItemIcon>
                  <ListItemText primary="Language" secondary={user.language} />
                </ListItem>
              </List>
              
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<DeleteIcon />}
                sx={{ mt: 2 }}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Settings tabs */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<AccountCircleIcon />} iconPosition="start" label="Account" />
              <Tab icon={<LockIcon />} iconPosition="start" label="Security" />
              <Tab icon={<NotificationsIcon />} iconPosition="start" label="Notifications" />
              <Tab icon={<PaletteIcon />} iconPosition="start" label="Display" />
              <Tab icon={<StorageIcon />} iconPosition="start" label="Data & Privacy" />
            </Tabs>
            
            {/* Account Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                  onClick={handleEditModeToggle}
                  color={editMode ? 'error' : 'primary'}
                  variant="outlined"
                  disabled={saving}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    disabled={!editMode || saving}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    disabled={!editMode || saving}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Timezone"
                    name="timezone"
                    value={profileForm.timezone}
                    onChange={handleProfileChange}
                    disabled={!editMode || saving}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Language"
                    name="language"
                    value={profileForm.language}
                    onChange={handleProfileChange}
                    disabled={!editMode || saving}
                  />
                </Grid>
              </Grid>
              
              {editMode && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleProfileSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </TabPanel>
            
            {/* Security Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type={showPasswords.currentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility('currentPassword')}
                          edge="end"
                        >
                          {showPasswords.currentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility('newPassword')}
                          edge="end"
                        >
                          {showPasswords.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility('confirmPassword')}
                          edge="end"
                        >
                          {showPasswords.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handlePasswordUpdate}
                  disabled={saving}
                >
                  {saving ? 'Updating...' : 'Update Password'}
                </Button>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>
                Login Sessions
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                You are currently logged in from 1 location.
              </Typography>
              
              <Box sx={{ bgcolor: theme.palette.background.default, p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2">Current Session</Typography>
                <Typography variant="body2" color="text.secondary">
                  Chrome on Windows • New York, USA • Started 2 hours ago
                </Typography>
              </Box>
            </TabPanel>
            
            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive notifications via email" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationSettingChange}
                        name="emailNotifications"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Push Notifications" 
                    secondary="Receive push notifications in browser" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onChange={handleNotificationSettingChange}
                        name="pushNotifications"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider sx={{ my: 2 }} />
                <ListItem>
                  <ListItemText 
                    primary="Goal Reminders" 
                    secondary="Get notified about upcoming goals and deadlines" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.goalReminders}
                        onChange={handleNotificationSettingChange}
                        name="goalReminders"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Task Reminders" 
                    secondary="Get notified about pending tasks" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.taskReminders}
                        onChange={handleNotificationSettingChange}
                        name="taskReminders"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Journal Reminders" 
                    secondary="Get reminded to write journal entries" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.journalReminders}
                        onChange={handleNotificationSettingChange}
                        name="journalReminders"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider sx={{ my: 2 }} />
                <ListItem>
                  <ListItemText 
                    primary="Weekly Digest" 
                    secondary="Receive a weekly summary of your progress" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.weeklyDigest}
                        onChange={handleNotificationSettingChange}
                        name="weeklyDigest"
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => notification.showSuccess('Notification settings saved')}
                >
                  Save Preferences
                </Button>
              </Box>
            </TabPanel>
            
            {/* Display Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Display Settings
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Dark Mode" 
                    secondary="Use dark theme throughout the application" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={displaySettings.darkMode}
                        onChange={handleDisplaySettingChange}
                        name="darkMode"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="High Contrast" 
                    secondary="Increase contrast for better readability" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={displaySettings.highContrast}
                        onChange={handleDisplaySettingChange}
                        name="highContrast"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Reduced Motion" 
                    secondary="Minimize animations throughout the app" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={displaySettings.reducedMotion}
                        onChange={handleDisplaySettingChange}
                        name="reducedMotion"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Large Text" 
                    secondary="Increase text size throughout the app" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={displaySettings.largeText}
                        onChange={handleDisplaySettingChange}
                        name="largeText"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <Divider sx={{ my: 2 }} />
                <ListItem>
                  <ListItemText 
                    primary="Compact View" 
                    secondary="Show more items in lists with reduced spacing" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={displaySettings.compactView}
                        onChange={handleDisplaySettingChange}
                        name="compactView"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Show Completed Items" 
                    secondary="Display completed goals and tasks in lists" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={displaySettings.showCompletedItems}
                        onChange={handleDisplaySettingChange}
                        name="showCompletedItems"
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => notification.showSuccess('Display settings saved')}
                >
                  Save Settings
                </Button>
              </Box>
            </TabPanel>
            
            {/* Data & Privacy Tab */}
            <TabPanel value={tabValue} index={4}>
              <Typography variant="h6" gutterBottom>
                Data & Privacy Settings
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Automated Data Backup" 
                    secondary="Keep your data backed up automatically" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={dataSettings.dataBackup}
                        onChange={handleDataSettingChange}
                        name="dataBackup"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Usage Analytics" 
                    secondary="Help improve the app by sharing anonymous usage data" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={dataSettings.analyticsConsent}
                        onChange={handleDataSettingChange}
                        name="analyticsConsent"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Data Sharing" 
                    secondary="Share non-personal data for research purposes" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={dataSettings.dataSharing}
                        onChange={handleDataSettingChange}
                        name="dataSharing"
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Store History" 
                    secondary="Keep history of completed goals and tasks" 
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={dataSettings.storeHistory}
                        onChange={handleDataSettingChange}
                        name="storeHistory"
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={() => notification.showSuccess('Data settings saved')}
                >
                  Save Settings
                </Button>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>
                Data Management
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<CloudDownloadIcon />}
                  onClick={handleExportData}
                >
                  Export Your Data
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Download a copy of all your data in JSON format. This includes goals, tasks, journal entries, and settings.
                </Typography>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </MainLayout>
  );
} 