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

        console.log("DEBUG create-session raw body:", event.body);
        console.log("DEBUG create-session params.zip:", params.zip, "params.zipCode:", params.zipCode, "params.zipcode:", params.zipcode);
        console.log("DEBUG create-session params:", params);
        const {
            email,
            firstName,
            lastName,
            zip,
            leadId = '',
            amount = 5,
            currency = 'usd',
            returnUrl,
            sourcePage = '',
        } = params;

        const origin = returnUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        // Stripe requires a public URL for images. Localhost won't work.
        // Fallback to production URL if current app URL is localhost or missing.
        // Always use the absolute URL for the production image to ensure it works in Stripe
        const productImageUrl = 'https://vip.unicornblocks.ai/assets/checkout/sparky.webp';

        console.log('DEBUG IMAGE:', { productImageUrl });

        // Dynamic Product Name based on Source Page
        let productName = 'Lock $149 VIP Price — Fully Refundable';
        if (sourcePage === 'preorder' || sourcePage === 'order') {
            productName = 'Pre-order Unicorn Blocks - Fully Refundable';
        }

        // Dynamic Cancel URL based on Source Page
        let cancelUrl = `${origin}/payment/cancel`;
        if (sourcePage === 'preorder') {
            cancelUrl = `${origin}/preorder`;
        } else if (sourcePage === 'reserve') {
            cancelUrl = `${origin}/reserve-vip-spot`;
        } else if (sourcePage === 'order') {
            cancelUrl = `${origin}/order`;
        }

        const sessionConfig = {
            submit_type: 'pay',
            custom_text: {
                submit: {
                    message: '🌟 Trusted by 400+ families building creativity through play'
                }
            },
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency,
                        product_data: {
                            name: productName,
                            description: 'Unicorn Blocks VIP Bundle · $5 to secure your $149 VIP price · Cancel anytime',
                            ...(productImageUrl && { images: [productImageUrl] }),
                        },
                        unit_amount: Math.round(Number(amount) * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
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

        console.log("DEBUG sessionConfig.metadata:", sessionConfig.metadata);

        if (email) sessionConfig.customer_email = email;

        const session = await stripe.checkout.sessions.create(sessionConfig);
        console.log("DEBUG created session id:", session.id);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                url: session.url,
                sessionId: session.id,
            })
        };
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: error.message })
        };
    }
};
