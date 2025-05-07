import { ThemeProvider, CssBaseline } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { NotificationProvider } from '../components/common/NotificationSystem';
import theme from '../styles/theme';

/**
 * Custom App component that wraps the entire application
 * Provides global contexts and theme
 */
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <Component {...pageProps} />
        </NotificationProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp; 