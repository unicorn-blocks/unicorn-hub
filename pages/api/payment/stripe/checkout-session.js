// Direct Handler (No Proxy) to ensure local changes work immediately
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const origin = req.headers.origin;
  const allow = new Set([
    "https://vip.unicornblocks.ai",
    "https://unicornblocks.ai",
    "http://vip.unicornblocks.local:3000",
    "http://localhost:3000",
  ]);

  if (allow.has(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      email,
      firstName,
      lastName,
      zip,
      leadId = '',
      amount = 5,
      currency = 'usd',
      cancelUrl, // From client side
    } = req.body;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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
      success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      // Use the provided cancelUrl or fall back to default
      cancel_url: cancelUrl || `${appUrl}/payment/cancel`,
      billing_address_collection: 'auto',
      client_reference_id: leadId || email || 'anonymous',
      metadata: {
        leadId: leadId || '',
        firstName: firstName || '',
        lastName: lastName || '',
        zip: zip || '',
        email: email || '',
      },
    };

    if (email) sessionConfig.customer_email = email;

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
