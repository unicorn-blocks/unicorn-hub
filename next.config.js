/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 确保静态文件被正确处理
  images: {
    unoptimized: true,
  },
  // 禁用 distDir 设置，让 Next.js 使用默认的 .next 目录进行中间构建
  // 默认使用 .next 目录
  // distDir: 'out',
  
  // 添加环境变量配置
  env: {
    MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
    MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID,
    MAILCHIMP_DATA_CENTER: process.env.MAILCHIMP_DATA_CENTER,
  },
  
  // 添加重写规则
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/src/app/favicon.ico',
      },
      {
        source: '/apple-touch-icon.png',
        destination: '/src/app/apple-touch-icon.png',
      },
      {
        source: '/favicon-32x32.png',
        destination: '/src/app/favicon-32x32.png',
      },
      {
        source: '/favicon-16x16.png',
        destination: '/src/app/favicon-16x16.png',
      },
      {
        source: '/favicon-96x96.png',
        destination: '/src/app/favicon-96x96.png',
      },
      {
        source: '/favicon-192x192.png',
        destination: '/src/app/favicon-192x192.png',
      },
      {
        source: '/favicon-512x512.png',
        destination: '/src/app/favicon-512x512.png',
      },
      {
        source: '/favicon.svg',
        destination: '/src/app/favicon.svg',
      },
      {
        source: '/site.webmanifest',
        destination: '/src/app/site.webmanifest',
      }
    ];
  },
};

module.exports = nextConfig; 