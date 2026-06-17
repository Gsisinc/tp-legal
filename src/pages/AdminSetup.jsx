import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2, Mail } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import { generateSecurePassword, isExistingUserError } from "@/lib/auth-utils";
import { APP_ROLES, isSuperAdminEmail } from "@/lib/constants";
import {
  createUserProfile,
  getOrCreatePlatformFirm,
  getUserProfileByEmail,
} from "@/lib/user-profile";

export default function AdminSetup() {
  const [step, setStep] = useState("account");
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const email = form.email.trim().toLowerCase();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!isSuperAdminEmail(email)) {
      setError("This email is not authorized for platform admin setup. Contact the platform owner.");
      return;
    }

    const existing = await getUserProfileByEmail(email);
    if (existing?.app_role === APP_ROLES.SUPER_ADMIN) {
      setError("Super admin already exists for this email. Please log in instead.");
      return;
    }

    setLoading(true);
    const password = form.password || generateSecurePassword();
    try {
      await base44.auth.register({ email, password });
      setForm((f) => ({ ...f, password }));
      setStep("otp");
    } catch (err) {
      if (isExistingUserError(err)) {
        setStep("otp");
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const completeSetup = async () => {
    setError("");
    setLoading(true);
    try {
      if (step === "otp") {
        const result = await base44.auth.verifyOtp({ email, otpCode });
        if (result?.access_token) base44.auth.setToken(result.access_token);
        else if (form.password) {
          await base44.auth.loginViaEmailPassword(email, form.password);
        }
      }

      const user = await base44.auth.me();
      const platformFirm = await getOrCreatePlatformFirm(user.id);

      await createUserProfile({
        user_id: user.id,
        email: user.email,
        full_name: form.fullName || user.full_name || "Platform Admin",
        firm_id: platformFirm.id,
        app_role: APP_ROLES.SUPER_ADMIN,
        agreement_type: "platform",
        subscription_plan: "professional",
        subscription_status: "active",
        onboarding_complete: true,
        terms_accepted_at: new Date().toISOString(),
      });

      window.location.href = "/super-admin";
    } catch (err) {
      setError(err.message || "Setup failed. Try logging in if you already have an account.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <AuthLayout icon={Mail} title="Verify your email" subtitle={`Code sent to ${email}`}>
        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
        <div className="flex justify-center mb-6">
          <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="w-full h-12" onClick={completeSetup} disabled={loading || otpCode.length < 6}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Admin Setup"}
        </Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Shield}
      title="Platform Admin Setup"
      subtitle="Create your super admin account to manage TP Legal"
      footer={
        <>
          Already set up?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </>
      }
    >
      <div className="mb-6 p-4 bg-[#1a2744]/5 rounded-lg text-sm text-gray-600">
        <p className="font-semibold text-[#1a2744] mb-1">One-time setup</p>
        <p>Use the email authorized as super admin. After setup you can create firm admins (like Tom) from the super admin dashboard.</p>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <Label>Full Name</Label>
          <Input
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <Label>Password (optional — auto-generated if blank)</Label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full h-12" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Super Admin Account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
