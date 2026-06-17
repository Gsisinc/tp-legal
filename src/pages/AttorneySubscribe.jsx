import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, Loader2 } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { getUserProfile } from "@/lib/user-profile";
import { getPlanDetails, isStripeConfigured, startSubscriptionCheckout } from "@/lib/stripe-checkout";
import { getDashboardPathForProfile } from "@/lib/auth-utils";

export default function AttorneySubscribe() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const planId = searchParams.get("plan") || profile?.subscription_plan || "professional";
  const plan = getPlanDetails(planId);
  const isFirmOwner = searchParams.get("firm") === "1";

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      const p = await getUserProfile(u.id);
      setProfile(p);
      if (p?.subscription_status === "active") {
        window.location.href = getDashboardPathForProfile(p, u);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubscribe = async () => {
    if (!user || !profile) return;
    setPaying(true);
    setError("");
    try {
      const successUrl = isFirmOwner
        ? `${window.location.origin}/owner?subscribed=1`
        : `${window.location.origin}/attorney?subscribed=1`;

      const result = await startSubscriptionCheckout({
        planId,
        userId: user.id,
        firmId: profile.firm_id,
        email: user.email,
        successUrl,
        cancelUrl: `${window.location.origin}/attorney/subscribe?cancelled=1`,
      });

      if (result.mode === "manual") {
        window.location.href = successUrl;
      }
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <CreditCard className="w-10 h-10 text-[#c9a84c] mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold text-[#1a2744] text-center mb-2">Activate Subscription</h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          {isFirmOwner ? "Complete payment to access your firm portal." : "Network attorneys need an active subscription plus the 10% referral fee on assigned cases."}
        </p>

        <div className="bg-[#1a2744]/5 rounded-xl p-5 mb-6">
          <p className="font-bold text-[#1a2744] text-lg">{plan.name} — ${plan.price}/month</p>
          <ul className="mt-3 space-y-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-[#c9a84c]" /> {f}
              </li>
            ))}
          </ul>
        </div>

        {!isStripeConfigured() && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            Stripe is not configured yet. Click below to activate your subscription for development. Add VITE_STRIPE_PUBLISHABLE_KEY and VITE_STRIPE_PRICE_PROFESSIONAL for live payments.
          </p>
        )}

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        <Button onClick={handleSubscribe} disabled={paying} className="w-full h-12 bg-[#c9a84c] text-[#1a2744] font-bold">
          {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : `Subscribe — $${plan.price}/mo`}
        </Button>
        <p className="text-center text-xs text-gray-400 mt-4">
          <Link to="/login" className="hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
