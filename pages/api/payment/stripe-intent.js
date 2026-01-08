// pages/api/payment/stripe-intent.js

function getHost(req) {
  // Next API 在不同 runtime header 结构略有差异，这样写最稳
  const h = req?.headers?.host;
  if (typeof h === "string") return h;
  // 有的环境会变成数组/对象，这里兜底
  if (Array.isArray(h)) return h[0];
  return "";
}

function isCloudflareRuntime() {
  // Cloudflare Workers 有这些特征；Netlify Node 一般没有
  return (
    typeof WebSocketPair !== "undefined" ||
    typeof caches !== "undefined" ||
    typeof navigator !== "undefined"
  );
}

async function proxyToMain(req, res) {
  const base = process.env.PAYMENT_API_BASE || "https://unicornblocks.ai";
  const target = `${base}/api/payment/stripe-intent`;

  const r = await fetch(target, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-from": "vip-cf",
    },
    body: JSON.stringify(req.body ?? {}),
  });

  const text = await r.text();
  res.status(r.status);
  res.setHeader("content-type", r.headers.get("content-type") || "application/json");
  return res.send(text);
}

async function createIntentOnNode(req, res) {
  try {
    const stripeServer = await import('../../../lib/stripe-server.js');
    const result = await stripeServer.createPaymentIntent(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    console.error('Stripe Intent Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const host = getHost(req);

    // Prevent infinite proxy loops - if we're receiving a forwarded request, don't proxy again
    const forwardedFrom = req?.headers?.['x-forwarded-from'];
    if (forwardedFrom === 'vip-cf') {
      return await createIntentOnNode(req, res);
    }

    // 判定策略：vip.* 或者 Cloudflare runtime 或者有 PAYMENT_API_BASE 就走代理
    const shouldProxy =
      host.startsWith("vip.") ||
      isCloudflareRuntime() ||
      !!process.env.PAYMENT_API_BASE ||
      process.env.FORCE_STRIPE_PROXY === "1";

    if (shouldProxy) {
      return await proxyToMain(req, res);
    }

    return await createIntentOnNode(req, res);
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Unknown error" });
  }
}






