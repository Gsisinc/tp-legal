import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { canAccessRoute } from "@/lib/auth-utils";
import { resolveUserWithProfile } from "@/lib/user-profile";

export default function RoleGuard({ allowedRoles, redirectTo = "/login" }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked } = useAuth();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!authChecked || isLoadingAuth) return;
    if (!isAuthenticated || !user) {
      setAllowed(false);
      setChecking(false);
      return;
    }

    resolveUserWithProfile(user).then(({ profile }) => {
      setAllowed(canAccessRoute(profile, user, allowedRoles));
      setChecking(false);
    });
  }, [user, isAuthenticated, isLoadingAuth, authChecked, allowedRoles]);

  if (isLoadingAuth || !authChecked || checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#1a2744] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
