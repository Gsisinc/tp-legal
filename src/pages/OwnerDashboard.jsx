import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Users, DollarSign, FileText, TrendingUp, Clock, AlertCircle, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS = {
  "Consultation Booked": "bg-blue-100 text-blue-700",
  "Intake Complete": "bg-yellow-100 text-yellow-700",
  "Quote Sent": "bg-purple-100 text-purple-700",
  "Engaged": "bg-orange-100 text-orange-700",
  "Active": "bg-green-100 text-green-700",
  "Closed": "bg-gray-100 text-gray-600"
};

export default function OwnerDashboard() {
  const [matters, setMatters] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [networkBillings, setNetworkBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    Promise.all([
      base44.entities.Matter.list("-created_date", 100),
      base44.entities.Consultation.list("-created_date", 20),
      base44.entities.Subscription.list("-created_date", 100),
      base44.entities.NetworkBilling.list("-created_date", 100)
    ]).then(([m, c, s, n]) => {
      setMatters(m);
      setConsultations(c);
      setSubscriptions(s);
      setNetworkBillings(n);
      setLoading(false);
    });
  }, []);

  const totalRevenue = matters.reduce((sum, m) => sum + (m.revenue_amount || 0), 0);
  const consultationRevenue = consultations.reduce((sum, c) => sum + (c.fee || 0), 0);
  const subscriptionRevenue = subscriptions.filter(s => s.status === "active").reduce((sum, s) => sum + (s.price || 0), 0);
  const networkFees = networkBillings.reduce((sum, n) => sum + (n.platform_fee || 0), 0);

  const filteredMatters = filter === "all" ? matters : matters.filter(m => m.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Owner Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Full practice overview — all clients, all matters, all revenue</p>
        </div>
        <Link to="/owner/matters/new">
          <Button className="bg-[#1a2744] hover:bg-[#243560] text-white gap-2">
            <Plus className="w-4 h-4" /> New Matter
          </Button>
        </Link>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Consultation Fees", value: `$${consultationRevenue.toLocaleString()}`, sub: `${consultations.length} sessions`, icon: Clock, color: "text-blue-600" },
          { label: "Subscription Revenue", value: `$${subscriptionRevenue.toLocaleString()}/mo`, sub: `${subscriptions.filter(s => s.status === "active").length} active plans`, icon: TrendingUp, color: "text-green-600" },
          { label: "Case & Project Fees", value: `$${totalRevenue.toLocaleString()}`, sub: `${matters.filter(m => m.revenue_type === "case_fee").length} matters`, icon: DollarSign, color: "text-purple-600" },
          { label: "Network Platform Fee", value: `$${networkFees.toLocaleString()}`, sub: `10% of network billings`, icon: Users, color: "text-[#c9a84c]" }
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-[#1a2744]">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-lg font-bold text-[#1a2744]">Client Pipeline</h2>
          <div className="flex gap-2 flex-wrap">
            {["all", "Consultation Booked", "Intake Complete", "Quote Sent", "Engaged", "Active", "Closed"].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === s ? 'bg-[#1a2744] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {filteredMatters.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No matters found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMatters.map(matter => (
              <Link key={matter.id} to={`/owner/matters/${matter.id}`}>
                <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-[#c9a84c] hover:bg-[#1a2744]/2 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-[#1a2744]/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#1a2744]">{matter.client_name?.charAt(0) || "?"}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#1a2744]">{matter.client_name}</p>
                      <p className="text-xs text-gray-400">{matter.practice_area} · {matter.consultation_type || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {matter.revenue_amount > 0 && (
                      <span className="text-sm font-semibold text-green-600">${matter.revenue_amount?.toLocaleString()}</span>
                    )}
                    <Badge className={`text-xs ${STATUS_COLORS[matter.status] || 'bg-gray-100 text-gray-600'}`}>
                      {matter.status}
                    </Badge>
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