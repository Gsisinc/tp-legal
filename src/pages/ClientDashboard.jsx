import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { FileText, MessageSquare, Upload, CheckCircle, Clock, AlertCircle, ChevronRight, CreditCard } from "lucide-react";
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

const STATUS_STEPS = ["Consultation Booked", "Intake Complete", "Quote Sent", "Engaged", "Active", "Closed"];

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [matters, setMatters] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [m, msgs, subs] = await Promise.all([
        base44.entities.Matter.filter({ client_id: u.id }, "-created_date"),
        base44.entities.Message.filter({ recipient_id: u.id, is_read: false }),
        base44.entities.Subscription.filter({ client_id: u.id })
      ]);
      setMatters(m);
      setMessages(msgs);
      setSubscription(subs[0] || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" />
    </div>
  );

  const activeMatter = matters.find(m => m.status !== "Closed") || matters[0];
  const currentStep = activeMatter ? STATUS_STEPS.indexOf(activeMatter.status) : -1;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Welcome back{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}</h1>
        <p className="text-gray-500 text-sm mt-1">Your legal matters, documents, and messages — all in one place.</p>
      </div>

      {/* Alerts */}
      {messages.length > 0 && (
        <div className="bg-[#1a2744] text-white rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-[#c9a84c]" />
            <span className="text-sm font-medium">You have {messages.length} unread message{messages.length > 1 ? "s" : ""} from your attorney</span>
          </div>
          <Link to="/client/messages">
            <Button size="sm" className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#1a2744] font-semibold text-xs">View Messages</Button>
          </Link>
        </div>
      )}

      {/* Subscription Credit Card */}
      {subscription && (
        <div className="bg-gradient-to-r from-[#1a2744] to-[#243560] text-white rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wide">Active Plan</p>
              <p className="font-heading text-lg font-bold capitalize">{subscription.plan} Plan</p>
            </div>
            <CreditCard className="w-6 h-6 text-[#c9a84c]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/60 mb-1">Consultations</p>
              <p className="font-bold text-lg">{(subscription.consultations_total || 0) - (subscription.consultations_used || 0)} <span className="text-white/50 text-sm font-normal">remaining</span></p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/60 mb-1">Document Reviews</p>
              <p className="font-bold text-lg">{(subscription.documents_total || 0) - (subscription.documents_used || 0)} <span className="text-white/50 text-sm font-normal">remaining</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Active Matter */}
      {activeMatter ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg font-bold text-[#1a2744]">Your Matter</h2>
            <Badge className={`text-xs ${STATUS_COLORS[activeMatter.status] || 'bg-gray-100'}`}>{activeMatter.status}</Badge>
          </div>
          <p className="font-medium text-[#1a2744] mb-1">{activeMatter.practice_area}</p>
          <p className="text-sm text-gray-400 mb-6">{activeMatter.matter_type || "General matter"}</p>

          {/* Progress */}
          <div className="relative mb-6">
            <div className="flex justify-between mb-2">
              {STATUS_STEPS.slice(0, 5).map((s, i) => (
                <div key={s} className="flex flex-col items-center flex-1">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-1 ${i <= currentStep ? 'bg-[#1a2744] border-[#1a2744]' : 'bg-white border-gray-300'}`}>
                    {i < currentStep && <CheckCircle className="w-3 h-3 text-white" />}
                    {i === currentStep && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <p className="text-[9px] text-center text-gray-400 leading-tight hidden md:block">{s.split(" ").slice(0, 2).join(" ")}</p>
                </div>
              ))}
            </div>
            <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 -z-10">
              <div className="h-full bg-[#1a2744] transition-all" style={{ width: `${(currentStep / 4) * 100}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link to="/client/messages">
              <button className="w-full p-3 rounded-lg border border-gray-200 hover:border-[#c9a84c] text-center transition-all">
                <MessageSquare className="w-5 h-5 mx-auto mb-1 text-[#1a2744]" />
                <p className="text-xs text-gray-600">Message</p>
              </button>
            </Link>
            <Link to="/client/documents">
              <button className="w-full p-3 rounded-lg border border-gray-200 hover:border-[#c9a84c] text-center transition-all">
                <Upload className="w-5 h-5 mx-auto mb-1 text-[#1a2744]" />
                <p className="text-xs text-gray-600">Upload Docs</p>
              </button>
            </Link>
            <Link to={`/client/matters/${activeMatter.id}`}>
              <button className="w-full p-3 rounded-lg border border-gray-200 hover:border-[#c9a84c] text-center transition-all">
                <FileText className="w-5 h-5 mx-auto mb-1 text-[#1a2744]" />
                <p className="text-xs text-gray-600">View Details</p>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-10 mb-6 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-500 mb-4">No active matters yet</p>
          <Link to="/book">
            <Button className="bg-[#1a2744] hover:bg-[#243560] text-white">Book a Consultation</Button>
          </Link>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Subscription Plans", sub: subscription ? `${subscription.plan} plan active` : "No active plan", icon: CreditCard, to: "/client/subscription" },
          { label: "Documents", sub: "View & upload files", icon: FileText, to: "/client/documents" },
          { label: "Messages", sub: `${messages.length} unread`, icon: MessageSquare, to: "/client/messages" }
        ].map(({ label, sub, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#c9a84c] hover:shadow-sm transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#1a2744]/8 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[#1a2744]" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#1a2744]">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}