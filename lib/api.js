// API utility functions
export function sanitizeApiUrl(url) {
  // Remove any localhost references
  if (url.includes('localhost:3001')) {
    console.warn('Detected localhost:3001 in API URL, fixing to relative path');
    return url.replace(/https?:\/\/localhost:3001/g, '');
  }
  return url;
}

// Use this function for all API calls
export async function safeApiCall(url, options = {}) {
  const sanitizedUrl = sanitizeApiUrl(url);
  
  console.log('Making API request to:', sanitizedUrl);
  
  try {
    const response = await fetch(sanitizedUrl, options);
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export function getApiUrl(path) {
  // 去除开头的斜杠
  const cleanPath = path.replace(/^\/+/, '');
  
  // 使用 Next.js API 路由
  return `/api/${cleanPath}`;
  
  // 或使用 Netlify 函数路径（取决于您的设置）
  // return `/.netlify/functions/api/${cleanPath}`;
} 