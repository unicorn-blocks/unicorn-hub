/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 确保静态文件被正确处理
  images: {
    unoptimized: true,
  },

  // 确保 Next.js 构建包含 stripe（通过 tracing）
  // 确保 Next.js 构建包含 stripe（通过 tracing）
  output: 'standalone',

  experimental: {
    // 将 stripe 从 webpack 打包中排除以避免 client side 引用问题（虽然服务端有 eval 用于隐藏）
    // 这里主要是为了让 Webpack 知道我们自己在处理这些包
    serverComponentsExternalPackages: ['stripe'],
    // 显式包含 stripe 及其所有 sub-dependencies 到 standalone 输出中
    outputFileTracingIncludes: {
      '/api/**/*': [
        './node_modules/stripe/**/*',
        './node_modules/qs/**/*',
        './node_modules/side-channel*/**/*',
        './node_modules/es-*/**/*',
        './node_modules/object-*/**/*',
        './node_modules/function-*/**/*',
        './node_modules/has-*/**/*',
        './node_modules/call-bind/**/*',
        './node_modules/get-intrinsic/**/*',
        './node_modules/define-*/**/*',
        './node_modules/gopd/**/*'
      ],
    },
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