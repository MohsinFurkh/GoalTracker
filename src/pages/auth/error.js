import { useRouter } from 'next/router';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import Link from 'next/link';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'You do not have permission to sign in.';
      case 'Verification':
        return 'The verification link may have expired or has already been used.';
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailCreateAccount':
      case 'Callback':
        return 'There was a problem with the authentication process.';
      case 'OAuthAccountNotLinked':
        return 'To confirm your identity, sign in with the same account you used originally.';
      case 'EmailSignin':
        return 'The email could not be sent.';
      case 'CredentialsSignin':
        return 'Sign in failed. Check the details you provided are correct.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'An error occurred during authentication.';
    }
  };

  return (
    <Container maxWidth="sm">
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
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom color="error">
            Authentication Error
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3 }}>
            {error ? getErrorMessage(error) : 'An unexpected error occurred.'}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/auth/signin"
              sx={{ mr: 2 }}
            >
              Back to Sign In
            </Button>
            <Button
              variant="outlined"
              component={Link}
              href="/"
            >
              Go to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 