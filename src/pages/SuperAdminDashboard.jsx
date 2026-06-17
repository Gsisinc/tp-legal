import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Shield, Users, Building2, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_ROLES } from "@/lib/constants";
import {
  createUserProfile,
  getOrCreateOwnerFirm,
  getUserProfile,
  getUserProfileByEmail,
  updateUserProfile,
} from "@/lib/user-profile";

export default function SuperAdminDashboard() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoteRole, setPromoteRole] = useState(APP_ROLES.FIRM_ADMIN);
  const [promoting, setPromoting] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const u = await base44.auth.me();
    setUser(u);
    const [p, f] = await Promise.all([
      base44.entities.UserProfile.list("-created_date", 200),
      base44.entities.Firm.list("-created_date", 50),
    ]);
    setProfiles(p);
    setFirms(f);
    setLoading(false);
  };

  useEffect(() => {
    load().catch(() => setLoading(false));
  }, []);

  const promoteUser = async () => {
    if (!promoteEmail) return;
    setPromoting(true);
    setMessage("");
    try {
      const email = promoteEmail.trim().toLowerCase();
      let profile = await getUserProfileByEmail(email);
      const ownerFirm = await getOrCreateOwnerFirm(user.id);

      if (profile) {
        await updateUserProfile(profile.id, {
          app_role: promoteRole,
          firm_id: promoteRole === APP_ROLES.FIRM_OWNER ? profile.firm_id : ownerFirm.id,
          subscription_status: promoteRole === APP_ROLES.FIRM_ADMIN ? "active" : profile.subscription_status,
          onboarding_complete: true,
        });
      } else {
        await createUserProfile({
          user_id: `pending-${email}`,
          email,
          full_name: email.split("@")[0],
          firm_id: ownerFirm.id,
          app_role: promoteRole,
          agreement_type: promoteRole === APP_ROLES.FIRM_OWNER ? "firm_tenant" : "platform",
          subscription_plan: "professional",
          subscription_status: promoteRole === APP_ROLES.FIRM_ADMIN ? "active" : "none",
          onboarding_complete: promoteRole === APP_ROLES.FIRM_ADMIN,
          terms_accepted_at: new Date().toISOString(),
        });
        setMessage(`Profile pre-created for ${email}. They must sign up at /login or /owner/join with this email.`);
      }

      if (profile) setMessage(`Updated ${email} to ${promoteRole}`);
      setPromoteEmail("");
      await load();
    } catch (err) {
      setMessage(err.message || "Failed to update user");
    } finally {
      setPromoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    );
  }

  const roleLabel = (r) =>
    ({
      [APP_ROLES.SUPER_ADMIN]: "Super Admin",
      [APP_ROLES.FIRM_ADMIN]: "Firm Admin",
      [APP_ROLES.FIRM_OWNER]: "Firm Owner",
      [APP_ROLES.NETWORK_ATTORNEY]: "Network Attorney",
      [APP_ROLES.CLIENT]: "Client",
    })[r] || r;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-[#c9a84c]" />
          <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Platform Super Admin</h1>
        </div>
        <p className="text-gray-500 text-sm">Manage firms, admins, and platform access. Welcome, {user?.full_name || user?.email}.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Users", value: profiles.length, icon: Users },
          { label: "Firms", value: firms.length, icon: Building2 },
          { label: "Admins", value: profiles.filter((p) => [APP_ROLES.SUPER_ADMIN, APP_ROLES.FIRM_ADMIN].includes(p.app_role)).length, icon: Crown },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border p-5">
            <Icon className="w-5 h-5 text-[#c9a84c] mb-2" />
            <p className="text-xs text-gray-500 uppercase">{label}</p>
            <p className="text-2xl font-bold text-[#1a2744]">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6 mb-8">
        <h2 className="font-heading text-lg font-bold text-[#1a2744] mb-4">Promote or Pre-Create Admin</h2>
        <p className="text-sm text-gray-500 mb-4">
          Assign Tom (or anyone) as <strong>firm admin</strong> so they get the owner dashboard at /owner.
          They can sign up at <Link to="/owner/join" className="text-[#1a2744] underline">/owner/join</Link> or you pre-create their profile here.
        </p>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <Label>Email</Label>
            <Input value={promoteEmail} onChange={(e) => setPromoteEmail(e.target.value)} placeholder="tom@tplegal.com" />
          </div>
          <div className="w-48">
            <Label>Role</Label>
            <Select value={promoteRole} onValueChange={setPromoteRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={APP_ROLES.FIRM_ADMIN}>Firm Admin (Tom)</SelectItem>
                <SelectItem value={APP_ROLES.SUPER_ADMIN}>Super Admin</SelectItem>
                <SelectItem value={APP_ROLES.FIRM_OWNER}>Firm Owner (Tenant)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={promoteUser} disabled={promoting || !promoteEmail} className="bg-[#1a2744] text-white">
              {promoting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Assign Role"}
            </Button>
          </div>
        </div>
        {message && <p className="mt-3 text-sm text-green-700">{message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border">
          <h2 className="font-heading text-lg font-bold text-[#1a2744] p-5 border-b">All Users</h2>
          <div className="divide-y max-h-96 overflow-y-auto">
            {profiles.map((p) => (
              <div key={p.id} className="px-5 py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-[#1a2744]">{p.full_name || p.email}</p>
                  <p className="text-xs text-gray-400">{p.email}</p>
                </div>
                <Badge variant="outline">{roleLabel(p.app_role)}</Badge>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border">
          <h2 className="font-heading text-lg font-bold text-[#1a2744] p-5 border-b">Firms</h2>
          <div className="divide-y max-h-96 overflow-y-auto">
            {firms.map((f) => (
              <div key={f.id} className="px-5 py-3 text-sm">
                <p className="font-medium text-[#1a2744]">{f.name}</p>
                <p className="text-xs text-gray-400 capitalize">{f.tenant_type} · {f.slug}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link to="/owner"><Button variant="outline">Firm Dashboard</Button></Link>
        <Link to="/owner/network"><Button variant="outline">Network Management</Button></Link>
      </div>
    </div>
  );
}
