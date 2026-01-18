const PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1192631419547458';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-Y8SZH3MM6L';

/* ========= 基础判断 ========= */

const isBrowser = () => typeof window !== 'undefined';

// 只允许真实线上域名上报（白名单）
const ALLOWED_HOSTS = new Set([
  'unicornblocks.ai',
  'www.unicornblocks.ai',
  'vip.unicornblocks.ai',
]);

export const shouldTrack = () => {
  if (!isBrowser()) return false;
  const host = window.location.hostname.toLowerCase();
  return ALLOWED_HOSTS.has(host);
};

/* ========= 初始化 ========= */

export const init = (pixelId = PIXEL_ID) => {
  if (!shouldTrack()) return;
  if (!window.fbq) return;

  window.fbq('init', pixelId);
};

/* ========= PageView ========= */

export const pageview = (url) => {
  if (!shouldTrack()) return;

  if (window.fbq) {
    window.fbq('track', 'PageView');
  }

  if (window.gtag && GA_ID) {
    window.gtag('config', GA_ID, { page_path: url });
  }
};

/* ========= 通用事件 ========= */

export const trackEvent = (name, params = {}) => {
  if (!shouldTrack()) return;

  if (window.fbq) {
    window.fbq('track', name, params);
  }

  if (window.gtag) {
    window.gtag('event', name, params);
  }
};

/* ========= 业务事件（新增） ========= */

export const trackLead = (params = {}) => {
  trackEvent('Lead', params);
};

trackEvent('Purchase', { value, currency, ...params });
};

export const trackInitiateCheckout = (params = {}) => {
  trackEvent('InitiateCheckout', params);
};

export const proceedToCheckout = () => {
  trackInitiateCheckout();
  if (typeof window !== 'undefined') {
    window.location.href = '/payment/stripe-checkout';
  }
};

/* ========= 低层 fbq 直通（保留） ========= */

export const fbq = (...args) => {
  if (!shouldTrack()) return;
  if (!window.fbq) return;

  window.fbq(...args);
};

export default {
  init,
  pageview,
  trackEvent,
  trackLead,
  trackPurchase,
  fbq,
  shouldTrack,
};
