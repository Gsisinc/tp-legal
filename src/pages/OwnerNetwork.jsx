import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Users, DollarSign, Mail, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listNetworkAttorneys } from "@/lib/user-profile";

export default function OwnerNetwork() {
  const [attorneys, setAttorneys] = useState([]);
  const [billings, setBillings] = useState([]);
  const [matters, setMatters] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);
  const [assignMatterId, setAssignMatterId] = useState("");
  const [assignAttorneyId, setAssignAttorneyId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const load = async () => {
    const [b, m, attys] = await Promise.all([
      base44.entities.NetworkBilling.list("-created_date", 200),
      base44.entities.Matter.list("-created_date", 200),
      listNetworkAttorneys(),
    ]);
    setBillings(b);
    setMatters(m);
    setAttorneys(attys.map((a) => ({
      id: a.user_id,
      name: a.full_name || a.email,
      email: a.email,
      matterCount: m.filter((mat) => mat.attorney_id === a.user_id).length,
      totalBilled: b.filter((x) => x.network_attorney_id === a.user_id).reduce((s, x) => s + (x.billed_amount || 0), 0),
      totalFees: b.filter((x) => x.network_attorney_id === a.user_id).reduce((s, x) => s + (x.platform_fee || 0), 0),
      subscription: a.subscription_status,
    })));
  };

  useEffect(() => {
    load().catch(() => {});
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

  const assignMatter = async () => {
    if (!assignMatterId || !assignAttorneyId) return;
    setAssigning(true);
    const atty = attorneys.find((a) => a.id === assignAttorneyId);
    await base44.entities.Matter.update(assignMatterId, {
      attorney_id: assignAttorneyId,
      attorney_name: atty?.name,
      is_network_matter: true,
    });
    setAssignMatterId("");
    setAssignAttorneyId("");
    setAssigning(false);
    await load();
  };

  const totalNetworkFees = billings.reduce((s, b) => s + (b.platform_fee || 0), 0);
  const unassignedMatters = matters.filter((m) => !m.attorney_id && m.status !== "Closed");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Affiliated Counsel Network</h1>
          <p className="text-gray-500 text-sm mt-1">Self-signup attorneys, case assignment, and 10% platform fee tracking</p>
        </div>
        <div className="flex gap-2">
          <Link to="/attorney/join">
            <Button variant="outline" className="gap-2"><UserPlus className="w-4 h-4" /> Attorney Signup Link</Button>
          </Link>
          <Button onClick={() => setShowInvite(true)} className="bg-[#1a2744] hover:bg-[#243560] text-white gap-2">
            <Plus className="w-4 h-4" /> Invite
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#1a2744] to-[#243560] text-white rounded-xl p-6 mb-8">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Total Network Revenue</p>
            <p className="text-2xl font-bold">${billings.reduce((s, b) => s + (b.billed_amount || 0), 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Platform Fees (10%)</p>
            <p className="text-2xl font-bold text-[#c9a84c]">${totalNetworkFees.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wide mb-1">Network Attorneys</p>
            <p className="text-2xl font-bold">{attorneys.length}</p>
          </div>
        </div>
      </div>

      {/* Assign cases */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-heading text-lg font-bold text-[#1a2744] mb-4">Assign Case to Network Attorney</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <Label className="mb-1 block">Matter</Label>
            <Select value={assignMatterId} onValueChange={setAssignMatterId}>
              <SelectTrigger><SelectValue placeholder="Select matter..." /></SelectTrigger>
              <SelectContent>
                {unassignedMatters.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.client_name} — {m.practice_area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Attorney</Label>
            <Select value={assignAttorneyId} onValueChange={setAssignAttorneyId}>
              <SelectTrigger><SelectValue placeholder="Select attorney..." /></SelectTrigger>
              <SelectContent>
                {attorneys.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={assignMatter} disabled={assigning || !assignMatterId || !assignAttorneyId} className="w-full bg-[#c9a84c] text-[#1a2744] font-semibold">
              {assigning ? "Assigning..." : "Assign Case"}
            </Button>
          </div>
        </div>
      </div>

      {showInvite && (
        <div className="bg-white rounded-xl border p-6 mb-6">
          <h2 className="font-heading text-lg font-bold text-[#1a2744] mb-2">Invite a Network Attorney</h2>
          <p className="text-sm text-gray-500 mb-5">Or send them to <Link to="/attorney/join" className="underline">/attorney/join</Link> to self-register with 10% agreement and subscription.</p>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="mb-1 block">Attorney Email</Label>
              <Input type="email" placeholder="attorney@lawfirm.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={invite} disabled={!email || inviting} className="bg-[#c9a84c] text-[#1a2744] font-semibold gap-2">
                <Mail className="w-4 h-4" /> {inviting ? "Sending..." : invited ? "Sent!" : "Send Invite"}
              </Button>
              <Button variant="outline" onClick={() => setShowInvite(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-xl p-5 mb-6 text-sm text-gray-600">
        <p className="font-semibold text-[#1a2744] mb-1">10% Platform Fee</p>
        <p>Covers referral compensation, platform tools, secure messaging, document automation, and map usage. Attorneys agree at signup via /attorney/join.</p>
      </div>

      {attorneys.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed p-12 text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-4">No network attorneys yet.</p>
          <Link to="/attorney/join"><Button className="bg-[#1a2744] text-white">Share Attorney Signup</Button></Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border divide-y mb-6">
          {attorneys.map((atty) => (
            <div key={atty.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1a2744]/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-[#1a2744]">{atty.name?.charAt(0) || "A"}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a2744]">{atty.name}</p>
                  <p className="text-xs text-gray-400">{atty.matterCount} case(s) · {atty.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Badge className={atty.subscription === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                  {atty.subscription || "pending"}
                </Badge>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Billed</p>
                  <p className="font-semibold">${atty.totalBilled.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Fee (10%)</p>
                  <p className="font-semibold text-[#c9a84c]">${atty.totalFees.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {billings.length > 0 && (
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1a2744] mb-4">Recent Billing Log</h2>
          <div className="bg-white rounded-xl border divide-y">
            {billings.slice(0, 10).map((b) => (
              <div key={b.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div>
                  <p className="font-medium text-[#1a2744]">{b.network_attorney_name} → {b.client_name}</p>
                  <p className="text-xs text-gray-400">{b.description || "Billing entry"} · {b.billing_date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span>${b.billed_amount?.toLocaleString()}</span>
                  <span className="text-[#c9a84c] font-semibold">+${b.platform_fee?.toLocaleString()}</span>
                  <Badge className="text-xs bg-gray-100">{b.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
