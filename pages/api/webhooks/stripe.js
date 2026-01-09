// Pure Proxy: Forward webhook to Netlify Function "stripe-webhook"

// Note: Body parsing must be disabled to stream raw body to Netlify (Or we read it here and send it, but proxying raw stream is safer)
// But wait, Next.js proxying needs buffering?
// Actually simpler: read raw body here, send to upstream.
// Netlify Function expects raw string body for signature verification.
// Standard fetch with string body works.

export const config = {
  api: { bodyParser: false },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = [];
    req.on('data', (chunk) => data.push(chunk));
    req.on('end', () => resolve(Buffer.concat(data)));
    req.on('error', reject);
  });
}

function getHost(req) {
  const h = req?.headers?.host;
  if (typeof h === "string") return h;
  if (Array.isArray(h)) return h[0];
  return "";
}

function shouldBlockWebhook(req) {
  // VIP hosts should not handle webhooks directly (they are proxied)
  // Actually, proxying logic below handles forwarding.
  // But if we want to BLOCK Cloudflare from processing, we do so here.
  // Wait, if it's pure proxy, Cloudflare *is* processing it by forwarding.
  // Does User want Cloudflare to 404? 
  // "Cloudflare(VIP) 只保留...纯 proxy" - applies to checkout-session.
  // Webhooks: "Stripe webhook: 只允许 Netlify(Node) 处理... VIP ... 直接 404 禁用"
  // User Prompt: "Stripe 相关 API 路由从 Cloudflare 的 Worker bundle 中隔离"
  // And "Cloudflare ... 永远 proxy 到 ... .netlify/functions"
  // So Webhook should ALSO proxy to Netlify Functions?
  // Stipe sends webhooks to `unicornblocks.ai/api/webhooks/stripe` usually.
  // If `unicornblocks.ai` is Netlify, this API route runs on Netlify. It will Proxy to local Netlify Function.
  // If `vip.unicornblocks.ai` receives webhook, it proxies to Netlify Function.
  // This seems correct and consistent.
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base = process.env.PAYMENT_API_BASE || "https://unicornblocks.ai";
  const baseUrl = base.replace(/\/$/, "");
  const targetUrl = `${baseUrl}/.netlify/functions/stripe-webhook`;

  try {
    const rawBody = await getRawBody(req);

    // Forward to Netlify Function
    const r = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Stripe-Signature': req.headers['stripe-signature'] || '',
        'X-Forwarded-Host': req.headers.host || '',
      },
      body: rawBody,
    });

    const text = await r.text();
    res.status(r.status);
    return res.send(text);
  } catch (error) {
    console.error('Webhook Proxy Error:', error);
    return res.status(500).json({ error: 'Proxy failed' });
  }
}
