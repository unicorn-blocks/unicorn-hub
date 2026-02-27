import '../styles/globals.css';
import GlobalEmailNotifyBox from '../components/GlobalEmailNotifyBox';
import FloatingJoinButton from '../components/FloatingJoinButton';
import Head from 'next/head';
import { LanguageProvider } from '../context/LanguageContext';
import { CartProvider } from '../context/CartContext';
import CartSidebar from '../components/CartSidebar';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as fbqLib from '../lib/fbq';
const ADSET_NAME_STORAGE_KEY = 'ub_meta_adset_name';

function cacheAdsetNameFromUrl(url) {
  if (typeof window === 'undefined') return;
  try {
    const parsed = new URL(url, window.location.origin);
    const adsetName = (parsed.searchParams.get('adset_name') || '').trim();
    if (!adsetName) return;
    sessionStorage.setItem(ADSET_NAME_STORAGE_KEY, adsetName);
    localStorage.setItem(ADSET_NAME_STORAGE_KEY, adsetName);
  } catch {
    // ignore parse/storage errors
  }
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    fbqLib.init();

    const handleRouteChange = (url) => {
      cacheAdsetNameFromUrl(url);
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
  const shouldShowGlobalEmailBox = router.pathname !== '/checkout' && router.pathname !== '/reserve-vip-spot' && router.pathname !== '/preorder' && router.pathname !== '/order' && router.pathname !== '/reservenow' && router.pathname !== '/payment/cancel' && router.pathname !== '/payment/success' && router.pathname !== '/payment/stripe-checkout';
  const shouldShowFloatingButton = shouldShowGlobalEmailBox && !['/', '/features', '/faq'].includes(router.pathname);

  return (
    <LanguageProvider>
      <CartProvider>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
        <CartSidebar />
        {shouldShowGlobalEmailBox && <GlobalEmailNotifyBox />}
        {shouldShowFloatingButton && <FloatingJoinButton />}
      </CartProvider>
    </LanguageProvider>
  );
}

export default MyApp;
