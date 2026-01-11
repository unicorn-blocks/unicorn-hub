// Pure Proxy: Forward to Netlify Function "stripe-retrieve-session"
// This endpoint is effectively an internal proxy to avoid exposing Stripe keys on the client
// but allows fetching session details (like amount) using the session_id on the Success Page.

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    // Safety Check: Netlify Function URL
    const base = process.env.PAYMENT_API_BASE || "https://unicornblocks.ai";
    const baseUrl = base.replace(/\/$/, "");
    const targetUrl = `${baseUrl}/.netlify/functions/stripe-retrieve-session`;

    try {
        const r = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(req.body ?? {}),
        });

        const data = await r.json();
        res.status(r.status).json(data);
    } catch (error) {
        console.error('Stripe Retrieve Proxy Error:', error);
        return res.status(502).json({ error: "Proxy connection failed" });
    }
}
