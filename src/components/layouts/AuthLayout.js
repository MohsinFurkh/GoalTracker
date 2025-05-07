import Link from 'next/link';
import { Box, Container, Paper, Typography } from '@mui/material';

export default function AuthLayout({ children, title }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.grey[100],
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            <span style={{ color: '#1976d2' }}>Goal</span>Trackr
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your goals and build momentum
          </Typography>
        </Box>

        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 2,
            backgroundColor: 'white',
          }}
        >
          {title && (
            <Typography
              variant="h5"
              component="h2"
              fontWeight="600"
              textAlign="center"
              sx={{ mb: 3 }}
            >
              {title}
            </Typography>
          )}
          {children}
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} GoalTrackr. All rights reserved.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" component="span" sx={{ mx: 1 }}>
              <Link href="/privacy-policy" style={{ color: 'text.secondary' }}>
                Privacy Policy
              </Link>
            </Typography>
            <Typography variant="body2" component="span" sx={{ mx: 1 }}>
              <Link href="/terms-of-service" style={{ color: 'text.secondary' }}>
                Terms of Service
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 