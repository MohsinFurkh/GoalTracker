import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import Link from 'next/link';

/**
 * Sign in page for authentication
 */
export default function SignIn() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: credentials.email,
        password: credentials.password,
      });

      if (result.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        // Redirect to callbackUrl or dashboard
        router.push(router.query.callbackUrl || '/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Demo login details
  const handleDemoLogin = async () => {
    setCredentials({
      email: 'user@example.com',
      password: 'password123',
    });
    
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: 'user@example.com',
        password: 'password123',
      });

      if (result.error) {
        setError('Demo login failed. Please try again.');
        setLoading(false);
      } else {
        router.push(router.query.callbackUrl || '/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              <span style={{ color: '#1976d2' }}>Goal</span>Trackr
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Sign in to your account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={credentials.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleInputChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link href="/auth/signup">
                  Sign up
                </Link>
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #eee', textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                For demonstration purposes:
              </Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                onClick={handleDemoLogin}
                disabled={loading}
              >
                Use Demo Account
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

// Server-side check to redirect authenticated users
export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
  
  return {
    props: {},
  };
} 