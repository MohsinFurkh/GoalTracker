import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChecklistIcon from '@mui/icons-material/Checklist';
import BarChartIcon from '@mui/icons-material/BarChart';
import BookIcon from '@mui/icons-material/Book';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { signOut, useSession } from 'next-auth/react';

const drawerWidth = 240;

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { name: 'Goals', href: '/goals', icon: <BarChartIcon /> },
  { name: 'Tasks', href: '/tasks', icon: <ChecklistIcon /> },
  { name: 'Journal', href: '/journal', icon: <BookIcon /> },
  { name: 'Settings', href: '/settings', icon: <SettingsIcon /> },
];

export default function MainLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleProfileMenuClose();
    await signOut({ redirect: false });
    router.push('/auth/signin');
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    router.push('/profile');
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          <span style={{ color: '#1976d2' }}>Goal</span>Trackr
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {navigation.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={router.pathname === item.href}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {navigation.find((item) => item.href === router.pathname)?.name || 'GoalTrackr'}
          </Typography>
          {session ? (
            <>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                {session.user.image ? (
                  <Avatar alt={session.user.name} src={session.user.image} />
                ) : (
                  <Avatar alt={session.user.name}>
                    {session.user.name?.[0] || 'U'}
                  </Avatar>
                )}
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => router.push('/auth/signin')}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
} 