/**
 * POST /api/payment/stripe/checkout-session
 * Cloudflare: proxy to main site
 * Netlify(Node): Create Stripe Checkout Session
 */

function isCloudflareRuntime() {
  return !!process.env.PAYMENT_API_BASE || process.env.FORCE_STRIPE_PROXY === '1';
}

function stripePkg() {
  return 'stri' + 'pe';
}

async function getStripe() {
  // Obfuscated import to avoid esbuild resolving "stripe" on Cloudflare
  const mod = await import(stripePkg());
  const Stripe = mod.default ?? mod;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export default async function handler(req, res) {
  // 1. CORS Headers
  const origin = req.headers.origin;
  const allow = new Set([
    "https://vip.unicornblocks.ai",
    "https://unicornblocks.ai",
    "http://vip.unicornblocks.local:3000",
    "http://localhost:3000",
  ]);

  if (allow.has(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Cloudflare Proxy Logic
  if (isCloudflareRuntime()) {
    const base = process.env.PAYMENT_API_BASE || "https://unicornblocks.ai";
    const upstream = `${base.replace(/\/$/, "")}/api/payment/stripe/checkout-session`;

    try {
      const r = await fetch(upstream, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Host': req.headers.host || '',
        },
        body: JSON.stringify(req.body || {}),
      });

      const text = await r.text();
      res.status(r.status);
      try {
        return res.json(JSON.parse(text));
      } catch {
        return res.send(text);
      }
    } catch (e) {
      console.error('CF Proxy Error:', e);
      return res.status(502).json({ success: false, error: 'Proxy failed' });
    }
  }

  // 3. Netlify/Node Logic (Real Stripe Transaction)
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
    console.error('Stripe Checkout Session Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to create payment session',
    });
  }
}
