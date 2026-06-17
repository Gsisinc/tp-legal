import { Link } from "react-router-dom";
import { Shield, Clock, Users, ChevronRight, CheckCircle, Star, Phone, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PRACTICE_AREAS = [
  { name: "Constitutional Law", subtitle: "Federal / Civil Rights" },
  { name: "Immigration Law", subtitle: "Visas / Asylum / Removal" },
  { name: "Criminal Law", subtitle: "Felony / Misdemeanor / Defense" },
  { name: "Civil Litigation", subtitle: "Disputes / Torts / Contract" },
  { name: "Family Law", subtitle: "Divorce / Custody / Support" },
  { name: "Employment Law", subtitle: "Workplace Rights / Discrimination" },
  { name: "Real Estate Law", subtitle: "Transactions / Disputes / Landlord-Tenant" },
  { name: "Estate Planning & Probate", subtitle: "Wills / Trusts / Administration" },
  { name: "Business & Corporate Law", subtitle: "Formation / Contracts / Compliance" },
  { name: "Intellectual Property", subtitle: "Patents / Trademarks / Copyrights" },
  { name: "Bankruptcy Law", subtitle: "Consumer / Business / Reorganization" },
  { name: "Traffic & Motor Vehicle Law", subtitle: "Tickets / DUI / License" },
  { name: "Personal Injury", subtitle: "Accidents / Premises / Products" },
  { name: "Tax Law", subtitle: "Disputes / Planning / Compliance" },
  { name: "Health Care Law", subtitle: "Compliance / Licensing / Malpractice" },
  { name: "Environmental Law", subtitle: "Regulatory / Compliance / Litigation" },
  { name: "Education Law", subtitle: "Students / Schools / Disabilities" },
  { name: "Social Security & Disability Law", subtitle: "SSDI / SSI / Appeals" }
];

const PLANS = [
  {
    name: "Essential",
    price: "$49",
    period: "/mo",
    features: ["1 Consultation per month", "Document review", "Client portal access", "Secure messaging"],
    highlight: false
  },
  {
    name: "Professional",
    price: "$99",
    period: "/mo",
    features: ["3 Consultations per month", "Priority response", "2 template documents", "Document review", "Client portal access"],
    highlight: true
  },
  {
    name: "Premier",
    price: "$199",
    period: "/mo",
    features: ["Unlimited questions", "1 full consultation", "4-hour response guarantee", "All template documents", "Priority access"],
    highlight: false
  }
];

const HOW_IT_WORKS = [
  { step: "01", title: "Select Your Legal Need", desc: "Choose from 18 practice areas and answer a brief intake questionnaire tailored to your situation." },
  { step: "02", title: "Book Your Consultation", desc: "Pick video, phone, or written async. Select a time slot that works for you and confirm your booking." },
  { step: "03", title: "Get Legal Guidance", desc: "Meet with Tom, review drafted documents, track your matter status, and message directly through your secure portal." }
];

const CONSULT_TYPES = [
  { icon: Video, label: "Video Consultation", sub: "Face-to-face sessions" },
  { icon: Phone, label: "Phone Consultation", sub: "Speak directly with Tom" },
  { icon: FileText, label: "Document Review", sub: "Expert legal analysis" },
  { icon: Users, label: "Full Representation", sub: "Complete case handling" }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1a2744] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c9a84c] rounded" />
            <div>
              <h1 className="font-heading text-xl font-bold tracking-tight">TP Legal</h1>
              <p className="text-[10px] text-[#c9a84c] tracking-widest uppercase">Tom Phinney, Esq.</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#practice-areas" className="text-white/80 hover:text-white transition-colors">Practice Areas</a>
            <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</a>
            <a href="#plans" className="text-white/80 hover:text-white transition-colors">Plans</a>
            <Link to="/login" className="text-white/80 hover:text-white transition-colors">Client Login</Link>
          </nav>
          <Link to="/book">
            <Button className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#1a2744] font-semibold text-sm px-5">
              Book Consultation
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#1a2744] text-white pb-20 pt-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/30 mb-4">
              Private Legal Practice · Direct Access to Your Attorney
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-6">
              Expert Legal Counsel,<br />
              <span className="text-[#c9a84c]">On Your Terms.</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-8">
              Get direct access to Tom Phinney, Esq. — a licensed attorney with a decade of experience across 18 practice areas. Book a consultation, subscribe for ongoing access, or get a custom quote for full representation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/book">
                <Button size="lg" className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#1a2744] font-bold w-full sm:w-auto">
                  Book a Consultation <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <a href="#plans">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
                  View Subscription Plans
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-white/60">
              <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#c9a84c]" /> Attorney-Client Privileged</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#c9a84c]" /> Fast Response</div>
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4">
            {CONSULT_TYPES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors">
                <Icon className="w-6 h-6 text-[#c9a84c] mb-3" />
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-white/50 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-[#1a2744] mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Three simple steps to get the legal help you need — no firm overhead, no billing surprises.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <div className="text-4xl font-heading font-bold text-[#c9a84c] mb-4">{step}</div>
                <h3 className="font-heading text-lg font-semibold text-[#1a2744] mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section id="practice-areas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-[#1a2744] mb-3">Practice Areas</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Comprehensive legal coverage across 18 practice areas — one attorney, your advocate.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PRACTICE_AREAS.map(area => (
              <Link key={area.name} to="/book">
                <div className="group border border-gray-200 rounded-lg p-4 hover:border-[#c9a84c] hover:bg-[#1a2744] transition-all duration-200 hover:shadow-md">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-white transition-colors">{area.name}</p>
                  <p className="text-xs text-gray-400 group-hover:text-white/50 transition-colors mt-0.5">{area.subtitle}</p>
                  <ChevronRight className="w-3 h-3 mt-2 text-gray-300 group-hover:text-[#c9a84c] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="plans" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-[#1a2744] mb-3">Subscription Plans</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Ongoing legal access for individuals and small businesses — at a fraction of traditional firm rates.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PLANS.map(plan => (
              <div key={plan.name} className={`rounded-xl border-2 p-8 relative ${plan.highlight ? 'border-[#c9a84c] bg-[#1a2744] text-white shadow-xl' : 'border-gray-200 bg-white'}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#c9a84c] text-[#1a2744] font-bold text-xs px-3">Most Popular</Badge>
                  </div>
                )}
                <h3 className={`font-heading text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-[#1a2744]'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-[#c9a84c]' : 'text-[#1a2744]'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-white/60' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-[#c9a84c]' : 'text-[#1a2744]'}`} />
                      <span className={plan.highlight ? 'text-white/80' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/book">
                  <Button className={`w-full font-semibold ${plan.highlight ? 'bg-[#c9a84c] hover:bg-[#b8973b] text-[#1a2744]' : 'bg-[#1a2744] hover:bg-[#243560] text-white'}`}>
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1a2744] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Star className="w-8 h-8 text-[#c9a84c] mx-auto mb-4" />
          <h2 className="font-heading text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 text-lg mb-8">Book a consultation today. No firm overhead. No referral games. Direct access to your attorney.</p>
          <Link to="/book">
            <Button size="lg" className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#1a2744] font-bold px-10">
              Book a Consultation
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/60 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#c9a84c] rounded-sm" />
            <span className="text-white font-semibold">TP Legal</span>
            <span>· Tom Phinney, Esq.</span>
          </div>
          <p>Attorney-client privileged platform. Not legal advice until engagement letter is signed.</p>
          <Link to="/login" className="text-[#c9a84c] hover:text-[#d4b565]">Client Login →</Link>
        </div>
      </footer>
    </div>
  );
}