import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Home page that redirects to the signup page for new users 
 * or dashboard for authenticated users
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkSession = async () => {
      const session = await getSession();
      // If authenticated, redirect to dashboard, otherwise to signup
      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/auth/signup');
      }
    };
    
    checkSession();
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
        Redirecting to GoalTrackr...
      </Typography>
    </Box>
  );
}

// Server-side check to determine redirect
export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (session) {
    // User is authenticated, redirect to dashboard
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  } else {
    // User is not authenticated, redirect to signup
    return {
      redirect: {
        destination: '/auth/signup',
        permanent: false,
      },
    };
  }
} 