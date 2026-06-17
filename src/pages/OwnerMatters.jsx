import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Search, Filter, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_COLORS = {
  "Consultation Booked": "bg-blue-100 text-blue-700",
  "Intake Complete": "bg-yellow-100 text-yellow-700",
  "Quote Sent": "bg-purple-100 text-purple-700",
  "Engaged": "bg-orange-100 text-orange-700",
  "Active": "bg-green-100 text-green-700",
  "Closed": "bg-gray-100 text-gray-600"
};

const PRACTICE_AREAS = [
  "Constitutional Law", "Immigration Law", "Criminal Law", "Civil Litigation",
  "Family Law", "Employment Law", "Real Estate Law", "Estate Planning & Probate",
  "Business & Corporate Law", "Intellectual Property", "Bankruptcy Law",
  "Traffic & Motor Vehicle Law", "Personal Injury", "Tax Law",
  "Health Care Law", "Environmental Law", "Education Law", "Social Security & Disability Law"
];

export default function OwnerMatters() {
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  useEffect(() => {
    base44.entities.Matter.list("-created_date", 200).then(m => {
      setMatters(m);
      setLoading(false);
    });
  }, []);

  const filtered = matters.filter(m => {
    const matchSearch = !search || m.client_name?.toLowerCase().includes(search.toLowerCase()) || m.practice_area?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    const matchArea = areaFilter === "all" || m.practice_area === areaFilter;
    return matchSearch && matchStatus && matchArea;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1a2744]">All Matters</h1>
          <p className="text-gray-500 text-sm mt-1">{matters.length} total matters across all clients</p>
        </div>
        <Link to="/owner/matters/new">
          <Button className="bg-[#1a2744] hover:bg-[#243560] text-white gap-2">
            <Plus className="w-4 h-4" /> New Matter
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search client or practice area..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {["Consultation Booked", "Intake Complete", "Quote Sent", "Engaged", "Active", "Closed"].map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All Practice Areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Practice Areas</SelectItem>
            {PRACTICE_AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No matters match your filters</div>
        ) : filtered.map(matter => (
          <Link key={matter.id} to={`/owner/matters/${matter.id}`}>
            <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-[#1a2744]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#1a2744]">{matter.client_name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1a2744]">{matter.client_name}</p>
                  <p className="text-xs text-gray-400">{matter.practice_area} · {matter.client_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {matter.revenue_amount > 0 && <span className="text-sm font-semibold text-green-600">${matter.revenue_amount.toLocaleString()}</span>}
                <Badge className={`text-xs ${STATUS_COLORS[matter.status] || 'bg-gray-100'}`}>{matter.status}</Badge>
                {matter.attorney_name && <span className="text-xs text-gray-400 hidden md:block">{matter.attorney_name}</span>}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}