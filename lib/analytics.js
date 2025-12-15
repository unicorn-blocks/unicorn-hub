/**
 * Google Analytics 事件追踪工具函数
 */

/**
 * 追踪自定义事件
 * @param {string} eventName - 事件名称
 * @param {object} params - 事件参数
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * 追踪页面浏览
 * @param {string} url - 页面 URL
 * @param {string} title - 页面标题
 */
export const trackPageView = (url, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-Y8SZH3MM6L', {
      page_path: url,
      page_title: title,
    });
  }
};

/**
 * 追踪按钮点击
 * @param {string} buttonName - 按钮名称
 * @param {string} location - 所在位置/页面
 */
export const trackButtonClick = (buttonName, location = '') => {
  trackEvent('button_click', {
    event_category: 'engagement',
    event_label: buttonName,
    page_location: location,
  });
};

/**
 * 追踪购买相关事件
 * @param {string} action - 动作类型 (view_item, add_to_cart, begin_checkout, purchase)
 * @param {object} item - 商品信息
 */
export const trackPurchase = (action, item = {}) => {
  trackEvent(action, {
    currency: item.currency || 'USD',
    value: item.value || 0,
    items: item.items || [],
  });
};

/**
 * 追踪表单提交
 * @param {string} formName - 表单名称
 * @param {boolean} success - 是否成功
 */
export const trackFormSubmit = (formName, success = true) => {
  trackEvent('form_submit', {
    event_category: 'form',
    event_label: formName,
    success: success,
  });
};
