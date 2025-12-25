/**
 * 测试 webhook 端点是否可以访问
 * 访问：http://localhost:3000/api/test-webhook
 */
export default function handler(req, res) {
  console.log('\n========== 测试端点被调用 ==========')
  console.log('时间:', new Date().toISOString())
  console.log('方法:', req.method)
  console.log('URL:', req.url)
  
  return res.status(200).json({
    success: true,
    message: '测试端点正常工作',
    timestamp: new Date().toISOString(),
    environment: {
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  })
}
