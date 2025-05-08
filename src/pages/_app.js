import { ThemeProvider, CssBaseline } from '@mui/material';
import { NotificationProvider } from '../components/common/NotificationSystem';
import theme from '../styles/theme';
import Head from 'next/head';

/**
 * Custom App component that wraps the entire application
 * Provides global contexts and theme
 */
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>GoalTrackr - Track Your Goals</title>
        <meta name="description" content="Track and achieve your goals with GoalTrackr" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Image.jpeg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1976d2" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />
      </Head>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </ThemeProvider>
    </>
  );
}

export default MyApp; 