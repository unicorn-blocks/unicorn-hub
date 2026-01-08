// lib/stripe-server.js
// This file is only loaded on Node.js environments (Netlify)
// On Cloudflare, this file is never imported because shouldProxy() returns first

// Using eval('require') to completely hide 'stripe' from esbuild static analysis
// This allows the file to be bundled by esbuild without error, even though it won't work on Edge
// On Node.js (Netlify), eval('require') works and finds the module
let Stripe;
try {
    const dynamicRequire = eval('require');
    Stripe = dynamicRequire('stripe');
} catch (e) {
    // Expected on Cloudflare or if module is missing
    console.warn("Stripe module load failed:", e.message);
    Stripe = null;
}

/**
 * Create a Stripe checkout session
 */
async function createCheckoutSession(params) {
    if (!Stripe) throw new Error('Stripe module not available - this should only be called on Node.js');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const {
        email,
        firstName,
        lastName,
        zip,
        leadId = '',
        amount = 5,
        currency = 'usd',
    } = params;

    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const productImageUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/assets/checkout/sparky.jpg`
        : null;

    const sessionConfig = {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: 'VIP Spot Reservation',
                        description: 'Sparky First Adventure',
                        ...(productImageUrl && { images: [productImageUrl] }),
                    },
                    unit_amount: Math.round(Number(amount) * 100),
                },
                quantity: 1,
                adjustable_quantity: { enabled: true, minimum: 1, maximum: 10 },
            },
        ],
        success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/payment/cancel`,
        billing_address_collection: 'auto',
        client_reference_id: leadId || email || 'anonymous',
        metadata: {
            leadId: leadId || '',
            firstName: firstName || '',
            lastName: lastName || '',
            zip: zip || '',
            email: email || '',
        },
        payment_intent_data: {
            metadata: {
                leadId: leadId || '',
                firstName: firstName || '',
                lastName: lastName || '',
                zip: zip || '',
                email: email || '',
            },
        },
    };

    if (email) sessionConfig.customer_email = email;

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
        success: true,
        url: session.url,
        sessionId: session.id,
    };
}

/**
 * Create a payment intent
 */
async function createPaymentIntent(params) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
    };
}

/**
 * Construct and verify webhook event
 */
function constructWebhookEvent(payload, signature, webhookSecret) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Get Stripe instance for custom operations
 */
function getStripeInstance() {
    return new Stripe(process.env.STRIPE_SECRET_KEY);
}

module.exports = {
    createCheckoutSession,
    createPaymentIntent,
    constructWebhookEvent,
    getStripeInstance,
};
