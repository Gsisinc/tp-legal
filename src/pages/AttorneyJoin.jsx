import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import TermsAgreement from "@/components/TermsAgreement";
import { generateSecurePassword, isExistingUserError } from "@/lib/auth-utils";
import { APP_ROLES, NETWORK_TERMS, TERMS_VERSION } from "@/lib/constants";
import { createUserProfile, getOrCreateOwnerFirm } from "@/lib/user-profile";

export default function AttorneyJoin() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    barNumber: "",
    barState: "",
    agreed: false,
  });

  const email = form.email.trim().toLowerCase();

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

  const completeJoin = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) base44.auth.setToken(result.access_token);
      else await base44.auth.loginViaEmailPassword(email, tempPassword);

      const user = await base44.auth.me();
      const ownerFirm = await getOrCreateOwnerFirm(user.id);

      await createUserProfile({
        user_id: user.id,
        email,
        full_name: form.fullName,
        firm_id: ownerFirm.id,
        app_role: APP_ROLES.NETWORK_ATTORNEY,
        bar_number: form.barNumber,
        bar_state: form.barState,
        platform_fee_rate: 0.1,
        agreement_type: "network_referral",
        subscription_plan: "professional",
        subscription_status: "pending",
        terms_accepted_at: new Date().toISOString(),
        terms_version: TERMS_VERSION,
      });

      window.location.href = "/attorney/subscribe";
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#1a2744] text-white py-4 px-4">
        <div className="max-w-2xl mx-auto flex justify-between">
          <Link to="/" className="font-heading font-bold">TP Legal</Link>
          <Link to="/login" className="text-sm text-white/70">Log in</Link>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-8 h-8 text-[#c9a84c]" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Join the Network</h1>
            <p className="text-gray-500 text-sm">Receive referred cases from Tom Phinney, Esq.</p>
          </div>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        {step === 1 && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <div><Label>Full Name</Label><Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
            <Button onClick={() => setStep(2)} disabled={!form.fullName || !form.email} className="w-full bg-[#1a2744] text-white">Continue <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <button onClick={() => setStep(1)} className="text-sm text-gray-500 mb-2 flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Bar Number</Label><Input value={form.barNumber} onChange={(e) => setForm((f) => ({ ...f, barNumber: e.target.value }))} /></div>
              <div><Label>Bar State</Label><Input value={form.barState} onChange={(e) => setForm((f) => ({ ...f, barState: e.target.value }))} placeholder="e.g. TX" /></div>
            </div>
            <Button onClick={() => setStep(3)} disabled={!form.barNumber || !form.barState} className="w-full bg-[#1a2744] text-white">Continue</Button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl border p-6">
            <button onClick={() => setStep(2)} className="text-sm text-gray-500 mb-4 flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> Back</button>
            <TermsAgreement terms={NETWORK_TERMS} agreed={form.agreed} onAgreedChange={(v) => setForm((f) => ({ ...f, agreed: v }))} />
            <Button onClick={handleRegister} disabled={!form.agreed || loading} className="w-full mt-6 bg-[#c9a84c] text-[#1a2744] font-bold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Agree & Create Account"}
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
            <Button onClick={completeJoin} disabled={loading || otpCode.length < 6} className="w-full bg-[#1a2744] text-white">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Continue to Payment"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
