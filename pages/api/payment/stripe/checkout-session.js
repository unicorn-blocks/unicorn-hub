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

  // On Local Dev: Execute the function logic directly (bypass HTTP proxy) because 'npm run dev' doesn't host Netlify functions
  if (process.env.NODE_ENV === 'development') {
    try {
      // Use absolute path to ensure we can find the file regardless of where this script is running from
      const path = require('path');
      const functionPath = path.resolve(process.cwd(), 'netlify/functions/stripe-checkout-session.js');

      // Clear cache in dev to enable hot reload for this module
      if (require.cache[functionPath]) {
        delete require.cache[functionPath];
      }

      // Use eval('require') to prevent Webpack from bundling this in production (Cloudflare)
      const { handler: netlifyHandler } = eval('require')(functionPath);

      // Mock the Netlify event and context
      const event = {
        httpMethod: req.method,
        body: JSON.stringify(req.body),
        headers: req.headers,
      };

      const context = {};

      const result = await netlifyHandler(event, context);

      // Map Netlify response back to Next.js response
      res.status(result.statusCode);
      if (result.headers) {
        Object.entries(result.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }
      return res.send(result.body);

    } catch (e) {
      console.error('[checkout-session] LOCAL EXECUTION ERROR:', e);
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // On Production: Proxy to the deployed Netlify Function
  const base = process.env.PAYMENT_API_BASE || "https://unicornblocks.ai";
  const baseUrl = base.replace(/\/$/, "");
  // Netlify functions are hosted at /.netlify/functions/...
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

    const ct = r.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);

    return res.send(text);
  } catch (e) {
    console.error('[checkout-session] PROXY ERROR:', e.message);
    return res.status(502).json({ success: false, error: 'Proxy connection failed' });
  }
}
