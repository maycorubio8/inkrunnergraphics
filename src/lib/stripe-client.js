import { loadStripe } from '@stripe/stripe-js';

// Client-side Stripe promise - SOLO usar en componentes cliente
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};