import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ChevronRight, ChevronLeft, Loader2, CheckCircle } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import TermsAgreement from "@/components/TermsAgreement";
import { SUBSCRIPTION_PLANS, APP_ROLES, FIRM_TENANT_TERMS, TERMS_VERSION } from "@/lib/constants";
import { generateSecurePassword, isExistingUserError } from "@/lib/auth-utils";
import { createUserProfile } from "@/lib/user-profile";

export default function FirmCreate() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [form, setForm] = useState({
    firmName: "",
    fullName: "",
    email: "",
    plan: "professional",
    agreed: false,
  });

  const email = form.email.trim().toLowerCase();
  const plan = SUBSCRIPTION_PLANS[form.plan];

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    const password = generateSecurePassword();
    setTempPassword(password);
    try {
      await base44.auth.register({ email, password });
      setStep(4);
    } catch (err) {
      if (isExistingUserError(err)) setStep(4);
      else setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const completeSetup = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) base44.auth.setToken(result.access_token);
      else await base44.auth.loginViaEmailPassword(email, tempPassword);

      const user = await base44.auth.me();
      const firm = await base44.entities.Firm.create({
        name: form.firmName,
        owner_user_id: user.id,
        tenant_type: "standalone",
        slug: form.firmName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40),
      });

      await createUserProfile({
        user_id: user.id,
        email,
        full_name: form.fullName,
        firm_id: firm.id,
        app_role: APP_ROLES.FIRM_OWNER,
        agreement_type: "firm_tenant",
        subscription_plan: form.plan,
        subscription_status: "pending",
        terms_accepted_at: new Date().toISOString(),
        terms_version: TERMS_VERSION,
      });

      window.location.href = `/attorney/subscribe?plan=${form.plan}&firm=1`;
    } catch (err) {
      setError(err.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1a2744] text-white py-4 px-4">
        <div className="max-w-3xl mx-auto flex justify-between">
          <Link to="/" className="font-heading font-bold">TP Legal</Link>
          <Link to="/login" className="text-sm text-white/70">Log in</Link>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="w-8 h-8 text-[#c9a84c]" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Create Your Firm</h1>
            <p className="text-gray-500 text-sm">Multi-tenant workspace with isolated client data</p>
          </div>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        {step === 1 && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div><Label>Firm Name</Label><Input value={form.firmName} onChange={(e) => setForm((f) => ({ ...f, firmName: e.target.value }))} placeholder="Smith & Associates" /></div>
            <div><Label>Your Name</Label><Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
            <Button onClick={() => setStep(2)} disabled={!form.firmName || !form.fullName || !form.email} className="w-full bg-[#1a2744] text-white">Choose Plan <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 mb-4 flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {Object.values(SUBSCRIPTION_PLANS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setForm((f) => ({ ...f, plan: p.id }))}
                  className={`text-left p-5 rounded-xl border-2 transition-all ${form.plan === p.id ? "border-[#c9a84c] bg-[#1a2744] text-white" : "border-gray-200 bg-white"}`}
                >
                  <p className="font-bold">{p.name}</p>
                  <p className={`text-2xl font-bold my-2 ${form.plan === p.id ? "text-[#c9a84c]" : "text-[#1a2744]"}`}>${p.price}<span className="text-sm font-normal">/mo</span></p>
                  <ul className="text-xs space-y-1">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{f}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            <Button onClick={() => setStep(3)} className="w-full bg-[#1a2744] text-white">Continue with {plan.name}</Button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl border p-6">
            <button onClick={() => setStep(2)} className="text-sm text-gray-500 mb-4 flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
            <TermsAgreement terms={FIRM_TENANT_TERMS} agreed={form.agreed} onAgreedChange={(v) => setForm((f) => ({ ...f, agreed: v }))} />
            <Button onClick={handleRegister} disabled={!form.agreed || loading} className="w-full mt-6 bg-[#c9a84c] text-[#1a2744] font-bold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : `Create Firm — $${plan.price}/mo`}
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-xl border p-6 text-center">
            <p className="text-gray-500 mb-6">Verify <strong>{email}</strong></p>
            <div className="flex justify-center mb-6">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                <InputOTPGroup>{[0,1,2,3,4,5].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
              </InputOTP>
            </div>
            <Button onClick={completeSetup} disabled={loading || otpCode.length < 6} className="w-full bg-[#1a2744] text-white">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Subscribe"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
