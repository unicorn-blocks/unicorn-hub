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
            amount = 0.5,
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
