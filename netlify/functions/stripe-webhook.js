const Stripe = require('stripe');
// Import local libs relative to netlify/functions/stripe-webhook.js -> ../../lib/orders
const { updateOrderStatus } = require('../../lib/orders');
const { submitPaidCouponEmailToGoogleSheets } = require('../../lib/googleSheets');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
    let stripeEvent;

    try {
        if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET missing");

        let bodyPayload = event.body;
        if (event.isBase64Encoded) {
            bodyPayload = Buffer.from(event.body, "base64").toString("utf-8");
        }

        // ✅ 支持多个 webhook secret（逗号分隔：live,test）
        const secrets = String(webhookSecret)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        let verified = false;
        let lastError;

        for (const secret of secrets) {
            try {
                stripeEvent = stripe.webhooks.constructEvent(bodyPayload, sig, secret);
                verified = true;
                break;
            } catch (err) {
                lastError = err;
            }
        }

        if (!verified) {
            console.error("❌ Webhook verification failed with all secrets");
            throw lastError || new Error("Webhook verification failed");
        }

        console.log("✅ Webhook Verified:", stripeEvent.type);
    } catch (err) {
        console.error("❌ Webhook Verify Error:", err.message);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }


    try {
        switch (stripeEvent.type) {
            case 'checkout.session.completed': {
                const session = stripeEvent.data.object;
                console.log('=== Stripe Webhook: 支付完成 ===', session.id);

                const { orderId } = session.metadata || {};
                const amount = (session.amount_total || 0) / 100;
                const currency = (session.currency || 'usd').toUpperCase();

                // ✅ 1) 先更新订单
                await updateOrderStatus(orderId, 'paid', {
                    stripeCheckoutSessionId: session.id,
                    amount,
                    currency,
                    paidAt: new Date().toISOString(),
                });
                console.log('Order status updated: paid');

                // ✅ 2) 再写 PaidCoupon（关键）
                const email =
                    session.customer_details?.email ||
                    session.customer_email ||
                    '';

                if (!email) {
                    // 你也可以选择不抛错（避免 Stripe 重试），但建议抛错以免漏单
                    throw new Error(`Missing email in checkout.session.completed (session: ${session.id})`);
                }

                await submitPaidCouponEmailToGoogleSheets({
                    email,
                    amount_paid: amount,
                    stripe_session_id: session.id,
                    source: 'stripe',
                });

                console.log('PaidCoupon sheet updated:', email);
                break;
            }

            case 'charge.refunded': {
                const charge = stripeEvent.data.object;
                console.log('=== Stripe Webhook: 退款处理 ===');
                const { orderId } = charge.metadata || {};
                const amount = charge.amount / 100;
                const currency = charge.currency.toUpperCase();

                await updateOrderStatus(orderId, 'refunded', {
                    chargeId: charge.id,
                    refundAmount: amount,
                    refundCurrency: currency,
                    refundedAt: new Date().toISOString(),
                });
                break;
            }
            default:
                console.log(`Unhandled event type ${stripeEvent.type}`);
        }

        return { statusCode: 200, body: JSON.stringify({ received: true }) };
    } catch (error) {
        console.error('Webhook Handler Error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Handler failed' }) };
    }
};
