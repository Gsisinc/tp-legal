import { base44 } from "@/api/base44Client";
import { APP_ROLES } from "@/lib/constants";
import { ensureSuperAdminProfile, getUserProfile } from "@/lib/user-profile";

export function generateSecurePassword(length = 12) {
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

export function getDashboardPathForProfile(profile, user) {
  if (!profile) {
    if (user?.role === "admin") return "/owner";
    return "/client";
  }

  const role = profile.app_role;

  switch (role) {
    case APP_ROLES.SUPER_ADMIN:
      return "/super-admin";
    case APP_ROLES.FIRM_ADMIN:
    case APP_ROLES.FIRM_OWNER:
      return "/owner";
    case APP_ROLES.NETWORK_ATTORNEY:
      if (profile?.subscription_status !== "active") return "/attorney/subscribe";
      return "/attorney";
    default:
      return "/client";
  }
}

export async function getDashboardPathForUser(user) {
  let profile = await getUserProfile(user.id);
  if (!profile) {
    profile = await ensureSuperAdminProfile(user);
  }
  return getDashboardPathForProfile(profile, user);
}

export function canAccessRoute(profile, user, allowedRoles) {
  let role = profile?.app_role;
  if (!role && user?.role === "admin") role = APP_ROLES.FIRM_ADMIN;
  if (!role) role = APP_ROLES.CLIENT;
  return allowedRoles.includes(role);
}

export async function sendBookingCredentialsEmail({
  email,
  name,
  password,
  practiceArea,
  date,
  time,
  consultationType,
}) {
  const loginUrl = `${window.location.origin}/login`;
  const body = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a2744;">
      <h2 style="color: #1a2744;">Consultation Confirmed</h2>
      <p>Hello ${name},</p>
      <p>Your consultation with Tom Phinney, Esq. has been booked. Your secure client portal account is ready.</p>
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0 0 8px;"><strong>Practice Area:</strong> ${practiceArea}</p>
        <p style="margin: 0 0 8px;"><strong>Type:</strong> ${consultationType} consultation</p>
        <p style="margin: 0;"><strong>Scheduled:</strong> ${date} at ${time}</p>
      </div>
      <h3 style="color: #1a2744;">Your Login Credentials</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Temporary Password:</strong> ${password}</p>
      <p style="color: #666; font-size: 14px;">Please change your password after your first login.</p>
      <p style="margin-top: 24px;">
        <a href="${loginUrl}" style="background: #c9a84c; color: #1a2744; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Access Client Portal
        </a>
      </p>
      <p style="margin-top: 32px; font-size: 12px; color: #999;">TP Legal · Tom Phinney, Esq.</p>
    </div>
  `;

  await base44.integrations.Core.SendEmail({
    to: email,
    subject: "Your TP Legal Consultation Confirmation & Login Details",
    body,
    from_name: "TP Legal",
  });
}

export function isExistingUserError(error) {
  const msg = (error?.message || "").toLowerCase();
  return (
    msg.includes("already") ||
    msg.includes("exist") ||
    msg.includes("registered") ||
    error?.status === 409
  );
}
