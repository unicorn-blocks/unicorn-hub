import Stripe from 'stripe'

/**
 * Stripe 实例
 * 仅在服务器端使用（API 路由）
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})
