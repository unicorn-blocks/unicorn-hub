// Pure Proxy: Forward requests to Netlify Function "stripe-payment-intent"
// This avoids bundling Stripe in Next.js (Cloudflare compatible)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const base = process.env.PAYMENT_API_BASE || "https://unicornblocks.ai";
  const baseUrl = base.replace(/\/$/, "");
  const targetUrl = `${baseUrl}/.netlify/functions/stripe-payment-intent`;

  try {
    const r = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(req.body ?? {}),
    });

    const text = await r.text();
    res.status(r.status);

    const ct = r.headers.get("content-type");
    if (ct) res.setHeader("content-type", ct);

    return res.send(text);
  } catch (error) {
    console.error('Stripe Intent Proxy Error:', error);
    return res.status(502).json({ error: "Proxy connection failed" });
  }
}






