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

        // Dynamic Product Name based on Source Page and Amount
        let productName = 'Lock $149 VIP Price — Fully Refundable';
        let productDescription = 'Unicorn Blocks VIP Bundle · $5 to secure your $149 VIP price · Cancel anytime';

        if (sourcePage === 'order') {
            // Order page: unified product name
            productName = 'Unicorn Blocks - VIP Price';
            if (amount >= 199) {
                productDescription = 'Unicorn Blocks Bundle · Regular Price $199 · 50+ extra blocks (limited time)';
            } else if (amount >= 149) {
                productDescription = 'Unicorn Blocks Bundle · Special Price $149 (Regular Price $199) · 50+ extra blocks (limited time)';
            }
        } else if (sourcePage === 'preorder') {
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

        // Dynamic submit message based on source page
        const submitMessage = sourcePage === 'order'
            ? '🌟 400+ families loved · 🚚 FREE Shipping · 🎁 50+ extra blocks'
            : '🌟 Loved by 400+ families building creativity through play';

        const sessionConfig = {
            submit_type: 'pay',
            custom_text: {
                submit: {
                    message: submitMessage
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
                            description: productDescription,
                            ...(productImageUrl && { images: [productImageUrl] }),
                        },
                        unit_amount: Math.round(Number(amount) * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            // Address & Tax: Only for Full Order (sourcePage === 'order')
            ...(sourcePage === 'order' ? {
                billing_address_collection: 'required',
                shipping_address_collection: {
                    allowed_countries: ['US'],
                },
                shipping_options: [
                    {
                        shipping_rate_data: {
                            type: 'fixed_amount',
                            fixed_amount: {
                                amount: 0,
                                currency: 'usd',
                            },
                            display_name: 'Free Shipping',
                            delivery_estimate: {
                                minimum: {
                                    unit: 'business_day',
                                    value: 5,
                                },
                                maximum: {
                                    unit: 'business_day',
                                    value: 10,
                                },
                            },
                        },
                    },
                ],
                automatic_tax: {
                    enabled: true,
                },
            } : {
                // Preorder / Reserve ($5 deposit) -> Simple checkout without address/tax
                billing_address_collection: 'auto',
                automatic_tax: { enabled: false },
            }),
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
