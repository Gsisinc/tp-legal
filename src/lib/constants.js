export const TERMS_VERSION = "2026-06-01";

export const APP_ROLES = {
  SUPER_ADMIN: "super_admin",
  FIRM_ADMIN: "firm_admin",
  NETWORK_ATTORNEY: "network_attorney",
  FIRM_OWNER: "firm_owner",
  CLIENT: "client",
};

export const SUBSCRIPTION_PLANS = {
  essential: {
    id: "essential",
    name: "Essential",
    price: 49,
    description: "Solo practice CRM, documents, and client portal",
    features: ["Matter management", "Document storage", "Client messaging", "Basic analytics"],
  },
  professional: {
    id: "professional",
    name: "Professional",
    price: 99,
    description: "Full platform toolkit for growing practices",
    features: [
      "Everything in Essential",
      "Playbooks & intake automation",
      "Network billing & 10% fee tracking",
      "Map & location tools",
      "Priority support",
    ],
    highlight: true,
  },
  premier: {
    id: "premier",
    name: "Premier",
    price: 199,
    description: "Multi-attorney firms with advanced features",
    features: [
      "Everything in Professional",
      "Multi-user firm access",
      "Advanced analytics",
      "White-label branding",
      "Dedicated onboarding",
    ],
  },
};

export const NETWORK_TERMS = `NETWORK ATTORNEY AGREEMENT (v${TERMS_VERSION})

By joining the TP Legal Affiliated Counsel Network, you agree to:

1. PLATFORM FEE: A 10% platform fee applies to all billings you log for cases referred to you through this platform. This fee covers referral compensation, platform access, secure client communications, document automation, and map/location tool usage.

2. CASE ASSIGNMENT: You will receive cases assigned by the referring attorney (Tom Phinney, Esq.) that fall outside their capacity or practice focus. You agree to maintain professional standards and timely communication.

3. SUBSCRIPTION: Active platform subscription is required for network attorney access. Professional tier is $99/month.

4. BILLING: All client billings for referred matters must be logged through the platform for accurate fee calculation.

5. CONFIDENTIALITY: All client data is attorney-client privileged and must be handled per applicable ethics rules.`;

export const FIRM_TENANT_TERMS = `FIRM TENANT AGREEMENT (v${TERMS_VERSION})

By creating your firm on this platform, you agree to:

1. SUBSCRIPTION: Your selected monthly plan is billed automatically. Professional tier is $99/month.

2. DATA ISOLATION: Your firm's client data is isolated from other firms on the platform.

3. PLATFORM TOOLS: You receive access to matter management, playbooks, documents, messaging, and analytics tools.

4. OPTIONAL NETWORK: You may opt into the referral network separately with additional terms.

5. COMPLIANCE: You are responsible for compliance with all applicable bar rules and regulations.`;

export function getSuperAdminEmails() {
  const raw = import.meta.env.VITE_SUPER_ADMIN_EMAILS || "gopeaklevel@gmail.com";
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isSuperAdminEmail(email) {
  return getSuperAdminEmails().includes((email || "").trim().toLowerCase());
}

export const PLATFORM_FIRM_NAME = "TP Legal Platform";
export const DEFAULT_OWNER_FIRM_NAME = "TP Legal";
