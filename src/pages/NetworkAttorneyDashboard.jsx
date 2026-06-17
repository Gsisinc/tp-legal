import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { FileText, DollarSign, ChevronRight, TrendingUp, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calcPlatformFee, getUserProfile } from "@/lib/user-profile";

const STATUS_COLORS = {
  "Consultation Booked": "bg-blue-100 text-blue-700",
  "Intake Complete": "bg-yellow-100 text-yellow-700",
  "Quote Sent": "bg-purple-100 text-purple-700",
  "Engaged": "bg-orange-100 text-orange-700",
  "Active": "bg-green-100 text-green-700",
  "Closed": "bg-gray-100 text-gray-600",
};

export default function NetworkAttorneyDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [matters, setMatters] = useState([]);
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingForm, setBillingForm] = useState({ matterId: "", amount: "", description: "" });
  const [logging, setLogging] = useState(false);

  const load = async (u) => {
    const [m, b, p] = await Promise.all([
      base44.entities.Matter.filter({ attorney_id: u.id }, "-created_date"),
      base44.entities.NetworkBilling.filter({ network_attorney_id: u.id }, "-created_date"),
      getUserProfile(u.id),
    ]);
    setMatters(m);
    setBillings(b);
    setProfile(p);
    if (p?.subscription_status !== "active") {
      navigate("/attorney/subscribe", { replace: true });
    }
    setLoading(false);
  };

  useEffect(() => {
    base44.auth.me().then(load).catch(() => setLoading(false));
  }, [navigate]);

  const logBilling = async () => {
    if (!billingForm.matterId || !billingForm.amount) return;
    setLogging(true);
    const matter = matters.find((m) => m.id === billingForm.matterId);
    const amount = parseFloat(billingForm.amount);
    const rate = profile?.platform_fee_rate || 0.1;
    const { platformFee, attorneyNet } = calcPlatformFee(amount, rate);

    await base44.entities.NetworkBilling.create({
      matter_id: billingForm.matterId,
      network_attorney_id: user.id,
      network_attorney_name: profile?.full_name || user.full_name,
      client_id: matter?.client_id,
      client_name: matter?.client_name,
      billed_amount: amount,
      platform_fee: platformFee,
      attorney_net: attorneyNet,
      description: billingForm.description,
      billing_date: new Date().toISOString().split("T")[0],
      status: "logged",
    });

    setBillingForm({ matterId: "", amount: "", description: "" });
    setLogging(false);
    await load(user);
  };

  const totalBilled = billings.reduce((s, b) => s + (b.billed_amount || 0), 0);
  const totalFees = billings.reduce((s, b) => s + (b.platform_fee || 0), 0);
  const totalNet = totalBilled - totalFees;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Attorney Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Assigned cases from Tom · 10% platform fee on billings</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Billed", value: `$${totalBilled.toLocaleString()}` },
          { label: "Platform Fee (10%)", value: `$${totalFees.toLocaleString()}` },
          { label: "Your Earnings (Net)", value: `$${totalNet.toLocaleString()}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border p-5">
            <p className="text-xs text-gray-500 uppercase mb-2">{label}</p>
            <p className="text-2xl font-bold text-[#1a2744]">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6 mb-8">
        <h2 className="font-heading text-lg font-bold text-[#1a2744] mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Log Billing
        </h2>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Label>Case</Label>
            <Select value={billingForm.matterId} onValueChange={(v) => setBillingForm((f) => ({ ...f, matterId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select case" /></SelectTrigger>
              <SelectContent>
                {matters.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.client_name} — {m.practice_area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Amount ($)</Label>
            <Input type="number" value={billingForm.amount} onChange={(e) => setBillingForm((f) => ({ ...f, amount: e.target.value }))} placeholder="2500" />
          </div>
          <div className="flex items-end">
            <Button onClick={logBilling} disabled={logging || !billingForm.matterId || !billingForm.amount} className="w-full bg-[#1a2744] text-white">
              {logging ? "Logging..." : "Log & Apply 10%"}
            </Button>
          </div>
        </div>
        {billingForm.amount && (
          <p className="text-xs text-gray-500 mt-2">
            Platform fee: ${calcPlatformFee(parseFloat(billingForm.amount) || 0).platformFee} · Your net: ${calcPlatformFee(parseFloat(billingForm.amount) || 0).attorneyNet}
          </p>
        )}
      </div>

      <div className="bg-[#1a2744]/5 border rounded-xl p-5 mb-8 text-sm">
        <p className="font-semibold text-[#1a2744] mb-1">Your agreement</p>
        <p className="text-gray-500">
          10% platform fee (accepted {profile?.terms_accepted_at ? new Date(profile.terms_accepted_at).toLocaleDateString() : "at signup"})
          · ${profile?.subscription_plan || "professional"} plan · includes map & platform tools
        </p>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-heading text-lg font-bold text-[#1a2744] mb-5">Assigned Cases</h2>
        {matters.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No cases assigned yet. Tom will assign overflow cases to you from the Network page.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matters.map((matter) => (
              <div key={matter.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#1a2744]/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-[#1a2744]">{matter.client_name?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1a2744]">{matter.client_name}</p>
                    <p className="text-xs text-gray-400">{matter.practice_area}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${STATUS_COLORS[matter.status] || "bg-gray-100"}`}>{matter.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
