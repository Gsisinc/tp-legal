import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { FileText, DollarSign, MessageSquare, ChevronRight, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS = {
  "Consultation Booked": "bg-blue-100 text-blue-700",
  "Intake Complete": "bg-yellow-100 text-yellow-700",
  "Quote Sent": "bg-purple-100 text-purple-700",
  "Engaged": "bg-orange-100 text-orange-700",
  "Active": "bg-green-100 text-green-700",
  "Closed": "bg-gray-100 text-gray-600"
};

export default function NetworkAttorneyDashboard() {
  const [user, setUser] = useState(null);
  const [matters, setMatters] = useState([]);
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [m, b] = await Promise.all([
        base44.entities.Matter.filter({ attorney_id: u.id }, "-created_date"),
        base44.entities.NetworkBilling.filter({ network_attorney_id: u.id }, "-created_date")
      ]);
      setMatters(m);
      setBillings(b);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalBilled = billings.reduce((s, b) => s + (b.billed_amount || 0), 0);
  const totalFees = billings.reduce((s, b) => s + (b.platform_fee || 0), 0);
  const totalNet = totalBilled - totalFees;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Attorney Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your assigned cases, earnings, and client communications</p>
      </div>

      {/* Earnings */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Billed", value: `$${totalBilled.toLocaleString()}`, icon: DollarSign },
          { label: "Platform Fee (10%)", value: `$${totalFees.toLocaleString()}`, icon: TrendingUp },
          { label: "Your Earnings (Net)", value: `$${totalNet.toLocaleString()}`, icon: TrendingUp }
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{label}</p>
            <p className="text-2xl font-bold text-[#1a2744]">{value}</p>
          </div>
        ))}
      </div>

      {/* Platform Fee Info */}
      <div className="bg-[#1a2744]/5 border border-[#1a2744]/10 rounded-xl p-5 mb-8 text-sm">
        <p className="font-semibold text-[#1a2744] mb-1">About the 10% Platform Fee</p>
        <p className="text-gray-500">The platform fee covers your referral compensation, full platform access (AI workflow, booking, document automation), and secure client communications — making it a genuine operational benefit, not just a charge.</p>
      </div>

      {/* Assigned Matters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-heading text-lg font-bold text-[#1a2744] mb-5">Assigned Cases</h2>
        {matters.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No cases assigned yet. Cases will appear here once the Owner assigns them to you.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matters.map(matter => (
              <Link key={matter.id} to={`/attorney/matters/${matter.id}`}>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-[#c9a84c] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#1a2744]/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#1a2744]">{matter.client_name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#1a2744]">{matter.client_name}</p>
                      <p className="text-xs text-gray-400">{matter.practice_area}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-xs ${STATUS_COLORS[matter.status] || 'bg-gray-100'}`}>{matter.status}</Badge>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}