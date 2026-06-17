import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Users, DollarSign, FileText } from "lucide-react";

const COLORS = ["#1a2744", "#c9a84c", "#3b5998", "#6b7280"];

export default function OwnerAnalytics() {
  const [matters, setMatters] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [networkBillings, setNetworkBillings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.Matter.list("-created_date", 200),
      base44.entities.Subscription.list("-created_date", 200),
      base44.entities.NetworkBilling.list("-created_date", 200)
    ]).then(([m, s, n]) => {
      setMatters(m);
      setSubscriptions(s);
      setNetworkBillings(n);
      setLoading(false);
    });
  }, []);

  // Revenue by stream
  const revenueData = [
    { name: "Consultations", value: matters.filter(m => m.revenue_type === "consultation").reduce((s, m) => s + (m.revenue_amount || 0), 0) },
    { name: "Subscriptions", value: subscriptions.filter(s => s.status === "active").reduce((s, sub) => s + (sub.price || 0), 0) },
    { name: "Case Fees", value: matters.filter(m => m.revenue_type === "case_fee").reduce((s, m) => s + (m.revenue_amount || 0), 0) },
    { name: "Network Fees", value: networkBillings.reduce((s, n) => s + (n.platform_fee || 0), 0) }
  ];

  // Practice area breakdown
  const practiceData = matters.reduce((acc, m) => {
    const pa = m.practice_area || "Unknown";
    acc[pa] = (acc[pa] || 0) + 1;
    return acc;
  }, {});
  const practiceChartData = Object.entries(practiceData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name: name.replace(" Law", "").replace(" & ", " & "), count }));

  // Status distribution
  const statusData = matters.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});
  const statusChartData = Object.entries(statusData).map(([name, value]) => ({ name, value }));

  const totalRevenue = revenueData.reduce((s, r) => s + r.value, 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Revenue by stream, practice area performance, client pipeline</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
          { label: "Active Matters", value: matters.filter(m => m.status === "Active").length, icon: FileText },
          { label: "Active Subscriptions", value: subscriptions.filter(s => s.status === "active").length, icon: TrendingUp },
          { label: "Total Clients", value: new Set(matters.map(m => m.client_email)).size, icon: Users }
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
              <Icon className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <p className="text-2xl font-bold text-[#1a2744]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Stream */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-bold text-[#1a2744] mb-5">Revenue by Stream</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={revenueData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => value > 0 ? `${name}: $${value}` : ""}>
                {revenueData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Practice Areas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-bold text-[#1a2744] mb-5">Top Practice Areas</h2>
          {practiceChartData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={practiceChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" fill="#1a2744" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Matter Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-heading text-base font-bold text-[#1a2744] mb-5">Pipeline Status Distribution</h2>
        {statusChartData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No matters yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#c9a84c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}