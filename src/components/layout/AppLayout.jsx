import { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  LayoutDashboard, Users, FileText, MessageSquare, Settings,
  DollarSign, BookOpen, LogOut, Menu, X, BarChart2, Building2, Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";

const OWNER_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/owner" },
  { label: "Matters / CRM", icon: FileText, to: "/owner/matters" },
  { label: "Playbooks", icon: BookOpen, to: "/owner/playbooks" },
  { label: "Network Attorneys", icon: Users, to: "/owner/network" },
  { label: "Documents", icon: FileText, to: "/owner/documents" },
  { label: "Analytics", icon: BarChart2, to: "/owner/analytics" },
  { label: "Templates", icon: FileText, to: "/owner/templates" },
  { label: "Settings", icon: Settings, to: "/owner/settings" }
];

const CLIENT_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/client" },
  { label: "My Matters", icon: Scale, to: "/client/matters" },
  { label: "Documents", icon: FileText, to: "/client/documents" },
  { label: "Messages", icon: MessageSquare, to: "/client/messages" },
  { label: "Subscription", icon: DollarSign, to: "/client/subscription" }
];

const ATTORNEY_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/attorney" },
  { label: "My Cases", icon: FileText, to: "/attorney/matters" },
  { label: "Documents", icon: FileText, to: "/attorney/documents" },
  { label: "Messages", icon: MessageSquare, to: "/attorney/messages" },
  { label: "Earnings", icon: DollarSign, to: "/attorney/earnings" }
];

export default function AppLayout() {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const role = user?.role;
  const navItems = role === "admin" ? OWNER_NAV : role === "network_attorney" ? ATTORNEY_NAV : CLIENT_NAV;

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a2744] text-white flex flex-col transform transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        
        {/* Logo */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#c9a84c] rounded" />
            <div>
              <p className="font-heading font-bold text-sm">TP Legal</p>
              <p className="text-[10px] text-white/50">Tom Phinney, Esq.</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User */}
        {user && (
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#c9a84c]/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-[#c9a84c]">{user.full_name?.charAt(0) || "?"}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate">{user.full_name}</p>
                <p className="text-[10px] text-white/40 capitalize">{role === "admin" ? "Owner" : role === "network_attorney" ? "Network Attorney" : "Client"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, to }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${isActive(to) ? 'bg-[#c9a84c]/15 text-[#c9a84c] font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </div>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button onClick={() => base44.auth.logout("/")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 w-full transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1a2744] rounded" />
            <span className="font-heading font-bold text-[#1a2744] text-sm">TP Legal</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}