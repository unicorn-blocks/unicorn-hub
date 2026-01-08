/**
 * Stripe webhook: 只允许 Netlify(Node) 处理
 * VIP subdomain (Cloudflare)：直接 404 禁用
 */

export const config = {
  api: { bodyParser: false },
};

// Reliably get host from request headers
function getHost(req) {
  const h =
    req?.headers?.host ||
    (typeof req?.headers?.get === 'function' ? req.headers.get('host') : '') ||
    '';
  return h.split(':')[0].toLowerCase();
}

// Determine if we should block webhook processing (VIP host should never handle webhooks)
function shouldBlockWebhook(req) {
  const host = getHost(req);
  const isVip = host.startsWith('vip.');
  const forced = process.env.FORCE_STRIPE_PROXY === '1';
  const hasBase = !!process.env.PAYMENT_API_BASE;
  return isVip || forced || hasBase;
}

async function loadStripeAndDeps() {
  // eval('require') bypasses Webpack's module resolution
  const realRequire = eval('require');
  const Stripe = realRequire('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // 这两个本地模块可以用动态 import
  const { updateOrderStatus } = await import('../../../lib/orders');
  const { submitEmailToGoogleSheets } = await import('../../../lib/googleSheets');

  return { stripe, updateOrderStatus, submitEmailToGoogleSheets };
}

export default async function handler(req, res) {
  // ✅ VIP subdomain：永远不处理 webhook（让 Netlify 主站处理）
  if (shouldBlockWebhook(req)) {
    return res.status(404).end();
  }

  console.log('\n========== WEBHOOK 处理器被调用 ==========');
  console.log('时间:', new Date().toISOString());
  console.log('方法:', req.method);
  console.log('URL:', req.url);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  const sig = req.headers['stripe-signature'];
  console.log('签名密钥存在:', !!sig);
  console.log('环境变量 STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? '✅ 有' : '❌ 无');

  const { stripe, updateOrderStatus, submitEmailToGoogleSheets } = await loadStripeAndDeps();

  let event;

  try {
    let body;
    if (typeof req.body === 'string') body = req.body;
    else if (Buffer.isBuffer(req.body)) body = req.body.toString('utf-8');
    else body = await getRawBody(req);

    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('✅ Webhook 签名验证成功，事件类型:', event.type);
  } catch (err) {
    console.error('❌ Webhook 签名验证失败:', err.message);
    return res.status(400).send(`Webhook 错误: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object, { updateOrderStatus, submitEmailToGoogleSheets });
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object, { updateOrderStatus, submitEmailToGoogleSheets });
        break;
      case 'charge.updated':
        console.log('收到 charge.updated 事件，暂不处理');
        break;
      default:
        console.log(`未处理的事件类型: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('处理 webhook 事件时出错:', error);
    return res.status(500).json({ error: '处理事件失败' });
  }
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk.toString('utf-8')));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function handleCheckoutSessionCompleted(session, deps) {
  const { updateOrderStatus, submitEmailToGoogleSheets } = deps;

  console.log('=== Stripe Webhook: 支付完成 ===');
  console.log('Session ID:', session.id);

  const { paymentType, orderId, language } = session.metadata || {};
  const customerEmail = session.customer_email;
  const amount = session.amount_total / 100;
  const currency = session.currency.toUpperCase();

  // 更新订单
  const updatedOrder = await updateOrderStatus(orderId, 'paid', {
    stripeCheckoutSessionId: session.id,
    amount,
    currency,
    paidAt: new Date().toISOString(),
  });
  console.log('订单状态已更新为已支付:', updatedOrder);

  // 你下面的邮件/paidcoupon逻辑，原样保留即可（我这里省略，建议你把原代码粘回去）
  // ...（把你原来的 3/4/5/6/7 步直接复制回来）
}

async function handleChargeRefunded(charge, deps) {
  const { updateOrderStatus, submitEmailToGoogleSheets } = deps;

  console.log('=== Stripe Webhook: 退款处理 ===');
  const { orderId, language } = charge.metadata || {};
  const amount = charge.amount / 100;
  const currency = charge.currency.toUpperCase();

  const updatedOrder = await updateOrderStatus(orderId, 'refunded', {
    chargeId: charge.id,
    refundAmount: amount,
    refundCurrency: currency,
    refundedAt: new Date().toISOString(),
  });
  console.log('订单状态已更新为已退款:', updatedOrder);

  // 你下面的邮件逻辑，原样保留即可（我这里省略）
}
