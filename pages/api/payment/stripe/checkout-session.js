/**
 * POST /api/payment/stripe/checkout-session
 * VIP subdomain (Cloudflare): proxy to main site (Netlify)
 * Main site (Netlify/Node): Create Stripe Checkout Session directly
 */

// Reliably get host from request headers (works in both Node and Edge runtimes)
function getHost(req) {
  const h =
    req?.headers?.host ||
    (typeof req?.headers?.get === 'function' ? req.headers.get('host') : '') ||
    '';
  return h.split(':')[0].toLowerCase();
}

// Determine if we should proxy based on HOST (not runtime detection)
// This is more reliable than detecting Cloudflare environment variables
function shouldProxy(req) {
  // Prevent infinite proxy loops - if we're receiving a forwarded request, don't proxy again
  const forwardedFrom = req?.headers?.['x-forwarded-from'];
  if (forwardedFrom === 'vip-cf') {
    return false;
  }

  const host = getHost(req);
  const isVip = host.startsWith('vip.');
  const forced = process.env.FORCE_STRIPE_PROXY === '1';
  const hasBase = !!process.env.PAYMENT_API_BASE;

  return isVip || forced || hasBase;
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

  // 2. VIP Host Proxy Logic - if request is from vip.*, proxy to Netlify
  if (shouldProxy(req)) {
    const base = process.env.PAYMENT_API_BASE || "https://unicornblocks.ai";
    const upstream = `${base.replace(/\/$/, "")}/api/payment/stripe/checkout-session`;


    try {
      const r = await fetch(upstream, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-Host': req.headers.host || '',
          'X-Forwarded-From': 'vip-cf',  // Prevent infinite proxy loops
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
      console.error('[checkout-session] PROXY ERROR:', e.message);
      return res.status(502).json({ success: false, error: 'Proxy failed' });
    }
  }

  // 3. Netlify/Node Logic (Real Stripe Transaction)
  try {
    // Dynamic import of stripe-server module - now safe for esbuild because the module uses eval('require')
    const stripeServer = await import('../../../../lib/stripe-server.js');
    const result = await stripeServer.createCheckoutSession(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    console.error('Stripe Checkout Session Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to create payment session',
    });
  }
}
