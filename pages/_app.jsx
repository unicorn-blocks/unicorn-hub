import '../styles/globals.css';
import GlobalEmailNotifyBox from '../components/GlobalEmailNotifyBox';
import FloatingJoinButton from '../components/FloatingJoinButton';
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

  // 在checkout, reserve-vip-spot, 以及已有BlueTopBar的页面(index, features, faq)不显示FloatingJoinButton
  const shouldShowGlobalEmailBox = router.pathname !== '/checkout' && router.pathname !== '/reserve-vip-spot' && router.pathname !== '/payment/cancel' && router.pathname !== '/payment/success' && router.pathname !== '/payment/stripe-checkout';
  const shouldShowFloatingButton = shouldShowGlobalEmailBox && !['/', '/features', '/faq'].includes(router.pathname);

  return (
    <LanguageProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
      {shouldShowGlobalEmailBox && <GlobalEmailNotifyBox />}
      {shouldShowFloatingButton && <FloatingJoinButton />}
    </LanguageProvider>
  );
}

export default MyApp;