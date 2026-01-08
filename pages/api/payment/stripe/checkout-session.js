/**
 * POST /api/payment/stripe/checkout-session
 * Cloudflare: proxy 到主站 Netlify
 * Netlify(Node): 真正调用 Stripe SDK 创建 Checkout Session
 */

function isCloudflareRuntime() {
  // 你约定的 Cloudflare 环境变量
  return !!process.env.PAYMENT_API_BASE || process.env.FORCE_STRIPE_PROXY === '1';
}

async function getStripe() {
  const mod = await import('stripe');
  const Stripe = mod.default ?? mod;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  // ✅ Cloudflare：直接 proxy 到主站 API（不要走任何 stripe 逻辑）
  if (isCloudflareRuntime()) {
    const base = process.env.PAYMENT_API_BASE;
    if (!base) return res.status(500).json({ success: false, error: 'PAYMENT_API_BASE 未配置' });

    const upstream = `${base}/api/payment/stripe/checkout-session`;

    try {
      const r = await fetch(upstream, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 可选：透传用户UA/来源，便于日志排查
          'X-Forwarded-Host': req.headers.host || '',
          'X-Proxy-By': 'cf-pages',
        },
        body: JSON.stringify(req.body || {}),
      });

      const text = await r.text();
      res.status(r.status);
      // 兼容 text/json
      try {
        return res.json(JSON.parse(text));
      } catch {
        return res.send(text);
      }
    } catch (e) {
      console.error('CF proxy Stripe checkout-session 失败:', e);
      return res.status(502).json({ success: false, error: e?.message || 'Proxy failed' });
    }
  }

  // ✅ Netlify/Node：真正创建 Stripe Checkout Session
  try {
    const {
      email,
      firstName,
      lastName,
      zip,
      leadId = '',
      amount = 5,
      currency = 'usd',
    } = req.body || {};

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const productImageUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/assets/checkout/sparky.jpg`
      : null;

    const sessionConfig = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'VIP Spot Reservation',
              description: 'Sparky First Adventure',
              ...(productImageUrl && { images: [productImageUrl] }),
            },
            unit_amount: Math.round(Number(amount) * 100),
          },
          quantity: 1,
          adjustable_quantity: { enabled: true, minimum: 1, maximum: 10 },
        },
      ],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      billing_address_collection: 'auto',
      client_reference_id: leadId || email || 'anonymous',
      metadata: {
        leadId: leadId || '',
        firstName: firstName || '',
        lastName: lastName || '',
        zip: zip || '',
        email: email || '',
      },
      payment_intent_data: {
        metadata: {
          leadId: leadId || '',
          firstName: firstName || '',
          lastName: lastName || '',
          zip: zip || '',
          email: email || '',
        },
      },
    };

    if (email) sessionConfig.customer_email = email;

    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Stripe Checkout Session 错误:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || '创建支付会话失败',
    });
  }
}
