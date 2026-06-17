import { loadStripe } from "@stripe/stripe-js";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { activateSubscription } from "@/lib/user-profile";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const priceIds = {
  essential: import.meta.env.VITE_STRIPE_PRICE_ESSENTIAL,
  professional: import.meta.env.VITE_STRIPE_PRICE_PROFESSIONAL,
  premier: import.meta.env.VITE_STRIPE_PRICE_PREMIER,
};

export function isStripeConfigured() {
  return Boolean(stripeKey && priceIds.professional);
}

export async function startSubscriptionCheckout({ planId, userId, firmId, email, successUrl, cancelUrl }) {
  const priceId = priceIds[planId];
  if (!stripeKey || !priceId) {
    await activateSubscription(userId, firmId, planId);
    return { mode: "manual", success: true };
  }

  const stripe = await loadStripe(stripeKey);
  if (!stripe) {
    await activateSubscription(userId, firmId, planId);
    return { mode: "manual", success: true };
  }

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    successUrl: successUrl || `${window.location.origin}/attorney?subscribed=1`,
    cancelUrl: cancelUrl || `${window.location.origin}/attorney/subscribe?cancelled=1`,
    customerEmail: email,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { mode: "stripe", success: true };
}

export function getPlanDetails(planId) {
  return SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.professional;
}
