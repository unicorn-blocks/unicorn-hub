import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { amount, currency, customer, shipping, billing_address, metadata } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // Stripe 以最小货币单位
      currency: currency || 'usd',
      receipt_email: customer?.email,
      shipping: shipping
        ? {
            name: shipping.firstName + ' ' + shipping.lastName,
            address: {
              line1: shipping.address,
              line2: shipping.address2,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.zipCode,
              country: shipping.country,
            },
            phone: shipping.phone,
          }
        : undefined,
      metadata,
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


