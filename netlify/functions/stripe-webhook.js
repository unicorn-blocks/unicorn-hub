const Stripe = require("stripe");
const { updateOrderStatus } = require("../../lib/orders");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ✅ 你的 Apps Script Web App URL
const PAID_COUPON_GAS_URL =
    process.env.PAID_COUPON_GAS_URL ||
    "https://script.google.com/macros/s/AKfycbw7_TdcPP3nGQjdZb0VOw1eWH7D3gx2twhsTyh0y58HmkXw4Aa1zySxIneErfrw11D8Cw/exec";

/**
 * 把 PaidCoupon 写入 Google Sheet（用 GET querystring，绕开 Apps Script 的 POST/302 陷阱）
 */
async function pushPaidCouponToSheet(payload) {
    const qs = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        qs.set(k, String(v));
    });

    const url = `${PAID_COUPON_GAS_URL}?${qs.toString()}`;

    // Node 18+ / Netlify Functions 通常有 global fetch
    const res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        headers: { "Accept": "application/json,text/plain,*/*" },
    });

    const text = await res.text();

    // Apps Script 可能返回 JSON（你现在是 {ok:true,...}）
    // 也可能返回纯文本 OK。这里都算成功，只要 res.ok
    if (!res.ok) {
        throw new Error(`GAS write failed: HTTP ${res.status} - ${text.slice(0, 300)}`);
    }

    // 尽量解析 JSON 方便日志
    try {
        return JSON.parse(text);
    } catch {
        return { ok: true, raw: text };
    }
}

exports.handler = async (event) => {
    // Stripe webhook 不需要 CORS；保留也不影响
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: "",
        };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const sig = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
    let stripeEvent;

    try {
        if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET missing");

        let bodyPayload = event.body;
        if (event.isBase64Encoded) {
            bodyPayload = Buffer.from(event.body, "base64").toString("utf-8");
        }

        stripeEvent = stripe.webhooks.constructEvent(bodyPayload, sig, webhookSecret);
        console.log("✅ Webhook Verified:", stripeEvent.type);
    } catch (err) {
        console.error("❌ Webhook Verify Error:", err.message);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    try {
        switch (stripeEvent.type) {
            case "checkout.session.completed": {
                const session = stripeEvent.data.object;

                const sessionId = session.id;
                const amount = (session.amount_total || 0) / 100;
                const currency = (session.currency || "usd").toUpperCase();

                // 你 metadata 里如果有 orderId，就照旧更新订单
                const { orderId } = session.metadata || {};
                if (orderId) {
                    await updateOrderStatus(orderId, "paid", {
                        stripeCheckoutSessionId: sessionId,
                        amount,
                        currency,
                        paidAt: new Date().toISOString(),
                    });
                    console.log("✅ Order status updated:", orderId, "paid");
                } else {
                    console.log("ℹ️ session.metadata.orderId missing, skip updateOrderStatus");
                }

                // ✅ 关键：写入 PaidCoupon Sheet
                // email：优先 session.customer_details.email，其次 session.customer_email
                const email =
                    (session.customer_details && session.customer_details.email) ||
                    session.customer_email ||
                    "";

                // zipcode/state：如果你 Stripe checkout 收集了地址，可从 customer_details.address 拿
                const addr = (session.customer_details && session.customer_details.address) || {};
                const zipcode = addr.postal_code || "";
                const state = addr.state || "";

                const payload = {
                    email,
                    units: 1, // 你现在的业务：$5=1个VIP spot；如果未来可变就从 metadata 读
                    amount_paid: amount,
                    state,
                    stripe_session_id: sessionId,
                    source: "stripe",
                    zipcode,
                };

                if (!email) {
                    console.log("⚠️ No email found in session; still writing with empty email?", payload);
                }

                const gasRes = await pushPaidCouponToSheet(payload);
                console.log("✅ PaidCoupon sheet write ok:", gasRes);

                break;
            }

            case "charge.refunded": {
                const charge = stripeEvent.data.object;
                const { orderId } = charge.metadata || {};

                if (orderId) {
                    const amount = (charge.amount || 0) / 100;
                    const currency = (charge.currency || "usd").toUpperCase();

                    await updateOrderStatus(orderId, "refunded", {
                        chargeId: charge.id,
                        refundAmount: amount,
                        refundCurrency: currency,
                        refundedAt: new Date().toISOString(),
                    });
                    console.log("✅ Order status updated:", orderId, "refunded");
                } else {
                    console.log("ℹ️ charge.metadata.orderId missing, skip updateOrderStatus");
                }

                break;
            }

            default:
                console.log("Unhandled event type", stripeEvent.type);
        }

        return { statusCode: 200, body: JSON.stringify({ received: true }) };
    } catch (error) {
        console.error("❌ Webhook Handler Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Handler failed", message: error.message }) };
    }
};
