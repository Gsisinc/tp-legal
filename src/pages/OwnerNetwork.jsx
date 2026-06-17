import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, DollarSign, Mail, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function OwnerNetwork() {
  const [attorneys, setAttorneys] = useState([]);
  const [billings, setBillings] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    Promise.all([
      base44.entities.NetworkBilling.list("-created_date", 200)
    ]).then(([b]) => {
      setBillings(b);
      // Aggregate unique attorneys from billings
      const attyMap = {};
      b.forEach(billing => {
        if (!attyMap[billing.network_attorney_id]) {
          attyMap[billing.network_attorney_id] = {
            id: billing.network_attorney_id,
            name: billing.network_attorney_name,
            totalBilled: 0,
            totalFees: 0,
            matterCount: new Set()
          };
        }
        attyMap[billing.network_attorney_id].totalBilled += billing.billed_amount || 0;
        attyMap[billing.network_attorney_id].totalFees += billing.platform_fee || 0;
        attyMap[billing.network_attorney_id].matterCount.add(billing.matter_id);
      });
      setAttorneys(Object.values(attyMap).map(a => ({ ...a, matterCount: a.matterCount.size })));
    });
  }, []);

  const invite = async () => {
    if (!email) return;
    setInviting(true);
    await base44.users.inviteUser(email, "user");
    setInviting(false);
    setInvited(true);
    setEmail("");
    setTimeout(() => setInvited(false), 3000);
  };

  const totalNetworkFees = billings.reduce((s, b) => s + (b.platform_fee || 0), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Affiliated Counsel Network</h1>
          <p className="text-gray-500 text-sm mt-1">Invite network attorneys, track billings, and manage the 10% platform fee</p>
        </div>
        <Button onClick={() => setShowInvite(true)} className="bg-[#1a2744] hover:bg-[#243560] text-white gap-2">
          <Plus className="w-4 h-4" /> Invite Attorney
        </Button>
      </div>

      {/* Platform Fee Summary */}
      <div className="bg-gradient-to-r from-[#1a2744] to-[#243560] text-white rounded-xl p-6 mb-8">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Total Network Revenue</p>
            <p className="text-2xl font-bold">${billings.reduce((s, b) => s + (b.billed_amount || 0), 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Platform Fees Earned (10%)</p>
            <p className="text-2xl font-bold text-[#c9a84c]">${totalNetworkFees.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Network Attorneys</p>
            <p className="text-2xl font-bold">{attorneys.length}</p>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-heading text-lg font-bold text-[#1a2744] mb-2">Invite a Network Attorney</h2>
          <p className="text-sm text-gray-500 mb-5">The invited attorney will receive a login and their own dashboard scoped to cases you assign. A 10% platform fee applies to all billings they log through the platform.</p>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="mb-1 block">Attorney Email Address</Label>
              <Input type="email" placeholder="attorney@lawfirm.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={invite} disabled={!email || inviting} className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#1a2744] font-semibold gap-2">
                <Mail className="w-4 h-4" /> {inviting ? "Sending..." : invited ? "Sent!" : "Send Invite"}
              </Button>
              <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Platform fee explainer */}
      <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-xl p-5 mb-6">
        <p className="font-semibold text-[#1a2744] text-sm mb-1">About the 10% Platform Fee</p>
        <p className="text-gray-600 text-sm">Every dollar billed by network attorneys through this platform automatically generates a 10% fee logged to your account. This fee covers referral compensation AND full platform access (AI workflow, booking, document automation, client portal, secure messaging) — making it genuinely valuable to affiliated counsel.</p>
      </div>

      {/* Attorney List */}
      {attorneys.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-4">No network attorneys yet. Invite your first affiliated attorney above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {attorneys.map(atty => (
            <div key={atty.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1a2744]/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-[#1a2744]">{atty.name?.charAt(0) || "A"}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a2744]">{atty.name}</p>
                  <p className="text-xs text-gray-400">{atty.matterCount} matter{atty.matterCount !== 1 ? "s" : ""} assigned</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Billed</p>
                  <p className="font-semibold text-[#1a2744]">${atty.totalBilled.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Platform Fee</p>
                  <p className="font-semibold text-[#c9a84c]">${atty.totalFees.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Billings */}
      {billings.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-lg font-bold text-[#1a2744] mb-4">Recent Billing Log</h2>
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {billings.slice(0, 10).map(b => (
              <div key={b.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium text-[#1a2744]">{b.network_attorney_name} → {b.client_name}</p>
                  <p className="text-xs text-gray-400">{b.description || "Billing entry"} · {b.billing_date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">${b.billed_amount?.toLocaleString()}</span>
                  <span className="text-[#c9a84c] font-semibold">+${b.platform_fee?.toLocaleString()} fee</span>
                  <Badge className="text-xs bg-gray-100 text-gray-600">{b.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}