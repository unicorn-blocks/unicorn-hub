const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const params = JSON.parse(event.body);
        const { amount, currency, customer, shipping, metadata } = params;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(parseFloat(amount) * 100),
            currency: currency || "usd",
            receipt_email: customer?.email,
            shipping: shipping
                ? {
                    name: shipping.name || "",
                    address: {
                        line1: shipping.address?.line1 || "",
                        line2: shipping.address?.line2 || "",
                        city: shipping.address?.city || "",
                        state: shipping.address?.state || "",
                        postal_code: shipping.address?.postal_code || "",
                        country: shipping.address?.country || "US",
                    },
                }
                : undefined,
            metadata: metadata || {},
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            })
        };
    } catch (error) {
        console.error('Stripe Intent Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: error.message })
        };
    }
};
