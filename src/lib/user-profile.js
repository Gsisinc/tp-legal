import { base44 } from "@/api/base44Client";
import {
  APP_ROLES,
  DEFAULT_OWNER_FIRM_NAME,
  isSuperAdminEmail,
  PLATFORM_FIRM_NAME,
  SUBSCRIPTION_PLANS,
  TERMS_VERSION,
} from "@/lib/constants";

export async function getUserProfile(userId) {
  const profiles = await base44.entities.UserProfile.filter({ user_id: userId });
  return profiles[0] || null;
}

export async function getUserProfileByEmail(email) {
  const profiles = await base44.entities.UserProfile.filter({
    email: email.trim().toLowerCase(),
  });
  return profiles[0] || null;
}

export async function getPlatformFirm() {
  const firms = await base44.entities.Firm.filter({ tenant_type: "platform" });
  return firms[0] || null;
}

export async function getOwnerFirm() {
  const firms = await base44.entities.Firm.filter({ tenant_type: "owner" });
  return firms[0] || null;
}

export async function getOrCreatePlatformFirm(ownerUserId) {
  let firm = await getPlatformFirm();
  if (!firm) {
    firm = await base44.entities.Firm.create({
      name: PLATFORM_FIRM_NAME,
      owner_user_id: ownerUserId,
      tenant_type: "platform",
      slug: "tp-legal-platform",
    });
  }
  return firm;
}

export async function getOrCreateOwnerFirm(ownerUserId, firmName = DEFAULT_OWNER_FIRM_NAME) {
  let firm = await getOwnerFirm();
  if (!firm) {
    firm = await base44.entities.Firm.create({
      name: firmName,
      owner_user_id: ownerUserId,
      tenant_type: "owner",
      slug: "tp-legal",
    });
  }
  return firm;
}

export async function createUserProfile(data) {
  return base44.entities.UserProfile.create({
    terms_version: TERMS_VERSION,
    subscription_status: "none",
    onboarding_complete: false,
    platform_fee_rate: 0.1,
    ...data,
    email: data.email?.trim().toLowerCase(),
  });
}

export async function updateUserProfile(id, data) {
  return base44.entities.UserProfile.update(id, data);
}

export async function ensureSuperAdminProfile(user) {
  let profile = await getUserProfile(user.id);
  if (profile) return profile;

  if (!isSuperAdminEmail(user.email)) return null;

  const platformFirm = await getOrCreatePlatformFirm(user.id);
  profile = await createUserProfile({
    user_id: user.id,
    email: user.email,
    full_name: user.full_name || "Platform Admin",
    firm_id: platformFirm.id,
    app_role: APP_ROLES.SUPER_ADMIN,
    agreement_type: "platform",
    subscription_plan: "professional",
    subscription_status: "active",
    onboarding_complete: true,
    terms_accepted_at: new Date().toISOString(),
  });
  return profile;
}

export async function resolveUserWithProfile(user) {
  if (!user) return { user: null, profile: null };

  let profile = await getUserProfile(user.id);
  if (!profile && isSuperAdminEmail(user.email)) {
    profile = await ensureSuperAdminProfile(user);
  }

  return {
    user,
    profile,
    appRole: profile?.app_role || (user.role === "admin" ? APP_ROLES.FIRM_ADMIN : APP_ROLES.CLIENT),
  };
}

export async function activateSubscription(userId, firmId, planId) {
  const plan = SUBSCRIPTION_PLANS[planId];
  const now = new Date();
  const end = new Date(now);
  end.setMonth(end.getMonth() + 1);

  const subs = await base44.entities.FirmSubscription.filter({ user_id: userId });
  if (subs[0]) {
    await base44.entities.FirmSubscription.update(subs[0].id, {
      plan: planId,
      price: plan.price,
      status: "active",
      firm_id: firmId,
      billing_cycle_start: now.toISOString().split("T")[0],
      billing_cycle_end: end.toISOString().split("T")[0],
    });
  } else {
    await base44.entities.FirmSubscription.create({
      user_id: userId,
      firm_id: firmId,
      plan: planId,
      price: plan.price,
      status: "active",
      billing_cycle_start: now.toISOString().split("T")[0],
      billing_cycle_end: end.toISOString().split("T")[0],
    });
  }

  const profile = await getUserProfile(userId);
  if (profile) {
    await updateUserProfile(profile.id, {
      subscription_plan: planId,
      subscription_status: "active",
      onboarding_complete: true,
    });
  }
}

export async function listNetworkAttorneys(firmId) {
  const profiles = await base44.entities.UserProfile.filter({
    app_role: APP_ROLES.NETWORK_ATTORNEY,
  });
  if (!firmId) return profiles;
  return profiles.filter((p) => p.firm_id === firmId);
}

export function calcPlatformFee(amount, rate = 0.1) {
  const fee = Math.round(amount * rate * 100) / 100;
  return { platformFee: fee, attorneyNet: Math.round((amount - fee) * 100) / 100 };
}
