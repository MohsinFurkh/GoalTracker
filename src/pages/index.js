import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Home page that redirects to the dashboard
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.replace('/dashboard');
  }, [router]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        <span style={{ color: '#1976d2' }}>Goal</span>Trackr
      </Typography>
      <CircularProgress size={40} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Loading your dashboard...
      </Typography>
    </Box>
  );
} 