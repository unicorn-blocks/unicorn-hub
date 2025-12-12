const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1192631419547458';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-Y8SZH3MM6L';

export const init = (pixelId = PIXEL_ID) => {
  if (typeof window === 'undefined') return;
  if (window.fbq) {
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }
};

export const pageview = (url) => {
  if (typeof window === 'undefined') return;
  if (window.fbq) window.fbq('track', 'PageView');
  if (window.gtag && GA_ID) window.gtag('config', GA_ID, { page_path: url });
};

export const trackEvent = (name, params = {}) => {
  if (typeof window === 'undefined') return;
  if (window.fbq) window.fbq('track', name, params);
  if (window.gtag) window.gtag('event', name, params);
};

export const fbq = (...args) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq(...args);
};

export default {
  init,
  pageview,
  trackEvent,
  fbq,
};
