// Pure Proxy: Forward all requests to Netlify Function "stripe-checkout-session"
// This avoids bundling Stripe in Next.js (Cloudflare compatible)

export default async function handler(req, res) {
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

  // Construct target URL for Netlify Function
  // On Local Dev: use localhost:8888/.netlify/functions or similar if running netlify dev
  // On Production: use https://unicornblocks.ai/.netlify/functions/...

  const base = process.env.PAYMENT_API_BASE || "https://unicornblocks.ai";
  // Trim trailing slash just in case
  const baseUrl = base.replace(/\/$/, "");
  const targetUrl = `${baseUrl}/.netlify/functions/stripe-checkout-session`;

  try {
    const r = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {}),
    });

    const text = await r.text();
    res.status(r.status);

    // Copy content-type if present
    const ct = r.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);

    return res.send(text);
  } catch (e) {
    console.error('[checkout-session] PROXY ERROR:', e.message);
    return res.status(502).json({ success: false, error: 'Proxy connection failed' });
  }
}
