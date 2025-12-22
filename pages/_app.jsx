import '../styles/globals.css';
import GlobalEmailNotifyBox from '../components/GlobalEmailNotifyBox';
import Head from 'next/head';
import { LanguageProvider } from '../context/LanguageContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as fbqLib from '../lib/fbq';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    fbqLib.init();

    const handleRouteChange = (url) => {
      fbqLib.pageview(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // initial pageview
    handleRouteChange(window.location.pathname + window.location.search);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <LanguageProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      <GlobalEmailNotifyBox />
    </LanguageProvider>
  );
}

export default MyApp;