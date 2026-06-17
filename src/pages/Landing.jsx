import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield, Clock, ChevronRight, CheckCircle, Star, Phone, Video, FileText,
  Users, Scale, Menu, X, Award, Lock, ArrowRight, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=85&auto=format&fit=crop",
  attorney: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=85&auto=format&fit=crop",
  office: "https://images.unsplash.com/photo-1505664194779-8beacee937eb?w=1200&q=85&auto=format&fit=crop",
  consult: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85&auto=format&fit=crop",
  cta: "https://images.unsplash.com/photo-1589397221041-fcb831d6f313?w=1920&q=85&auto=format&fit=crop",
};

const PRACTICE_AREAS = [
  { name: "Constitutional Law", subtitle: "Federal / Civil Rights" },
  { name: "Immigration Law", subtitle: "Visas / Asylum / Removal" },
  { name: "Criminal Law", subtitle: "Felony / Misdemeanor / Defense" },
  { name: "Civil Litigation", subtitle: "Disputes / Torts / Contract" },
  { name: "Family Law", subtitle: "Divorce / Custody / Support" },
  { name: "Employment Law", subtitle: "Workplace Rights / Discrimination" },
  { name: "Real Estate Law", subtitle: "Transactions / Disputes" },
  { name: "Estate Planning & Probate", subtitle: "Wills / Trusts" },
  { name: "Business & Corporate Law", subtitle: "Formation / Compliance" },
  { name: "Intellectual Property", subtitle: "Patents / Trademarks" },
  { name: "Bankruptcy Law", subtitle: "Consumer / Business" },
  { name: "Traffic & Motor Vehicle Law", subtitle: "DUI / License" },
  { name: "Personal Injury", subtitle: "Accidents / Liability" },
  { name: "Tax Law", subtitle: "Disputes / Planning" },
  { name: "Health Care Law", subtitle: "Compliance / Licensing" },
  { name: "Environmental Law", subtitle: "Regulatory / Litigation" },
  { name: "Education Law", subtitle: "Students / Schools" },
  { name: "Social Security & Disability", subtitle: "SSDI / SSI / Appeals" },
];

const PLANS = [
  {
    name: "Essential",
    price: "$49",
    period: "/mo",
    features: ["1 Consultation per month", "Document review", "Client portal access", "Secure messaging"],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "/mo",
    features: ["3 Consultations per month", "Priority response", "2 template documents", "Document review", "Client portal access"],
    highlight: true,
  },
  {
    name: "Premier",
    price: "$199",
    period: "/mo",
    features: ["Unlimited questions", "1 full consultation", "4-hour response guarantee", "All template documents", "Priority access"],
    highlight: false,
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Select Your Legal Need", desc: "Choose from 18 practice areas and complete a tailored intake questionnaire.", icon: Scale },
  { step: "02", title: "Book Your Consultation", desc: "Pick video, phone, or async. Select a time that works and confirm instantly.", icon: Video },
  { step: "03", title: "Get Expert Guidance", desc: "Meet with Tom, track your matter, review documents, and message through your secure portal.", icon: Shield },
];

const STATS = [
  { value: "18+", label: "Practice Areas" },
  { value: "10+", label: "Years Experience" },
  { value: "100%", label: "Privileged Communications" },
  { value: "24hr", label: "Typical Response" },
];

const TESTIMONIALS = [
  { quote: "Direct access to my attorney without the big-firm runaround. The portal made everything transparent.", author: "Sarah M.", role: "Small Business Owner" },
  { quote: "Booked a consultation in minutes. Tom was prepared because the intake questions captured exactly what I needed.", author: "James R.", role: "Immigration Client" },
  { quote: "Finally, legal help that feels modern — secure messaging, document uploads, and clear pricing.", author: "Michelle T.", role: "Family Law Client" },
];

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#practice-areas", label: "Practice Areas" },
  { href: "#plans", label: "Plans" },
];

function Logo({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-md bg-gradient-to-br from-[#c9a84c] to-[#a8873a] flex items-center justify-center shadow-lg">
        <Scale className={`w-5 h-5 ${light ? "text-[#1a2744]" : "text-[#1a2744]"}`} />
      </div>
      <div>
        <p className={`font-heading text-lg font-bold tracking-tight leading-none ${light ? "text-white" : "text-[#1a2744]"}`}>TP Legal</p>
        <p className="text-[10px] text-[#c9a84c] tracking-[0.2em] uppercase mt-0.5">Tom Phinney, Esq.</p>
      </div>
    </div>
  );
}

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white antialiased">
      {/* Header */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/"><Logo light={!scrolled} /></Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={`font-medium transition-colors ${scrolled ? "text-gray-600 hover:text-[#1a2744]" : "text-white/85 hover:text-white"}`}
              >
                {label}
              </a>
            ))}
            <Link to="/login" className={`font-medium ${scrolled ? "text-gray-600 hover:text-[#1a2744]" : "text-white/85 hover:text-white"}`}>
              Login
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/book">
              <Button className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#1a2744] font-semibold shadow-md shadow-[#c9a84c]/20">
                Book Consultation
              </Button>
            </Link>
          </div>

          <button
            className={`lg:hidden p-2 rounded-lg ${scrolled ? "text-[#1a2744]" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-white border-t shadow-xl px-4 py-6 space-y-4">
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-2">{label}</a>
            ))}
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-gray-700 font-medium py-2">Login</Link>
            <Link to="/book" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-[#c9a84c] text-[#1a2744] font-semibold">Book Consultation</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="" className="w-full h-full object-cover object-center scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2744]/95 via-[#1a2744]/85 to-[#1a2744]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744] via-transparent to-transparent opacity-60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="max-w-xl">
              <Badge className="bg-[#c9a84c]/15 text-[#e8d5a3] border-[#c9a84c]/30 mb-6 px-4 py-1.5 text-xs tracking-wide">
                Private Practice · Direct Attorney Access
              </Badge>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                Sophisticated Legal Counsel,{" "}
                <span className="text-[#c9a84c] italic">Without the Firm Overhead.</span>
              </h1>
              <p className="text-lg text-white/75 leading-relaxed mb-8 max-w-lg">
                Work directly with Tom Phinney, Esq. — experienced counsel across 18 practice areas.
                Book consultations, subscribe for ongoing access, or engage for full representation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/book">
                  <Button size="lg" className="bg-[#c9a84c] hover:bg-[#d4b565] text-[#1a2744] font-bold h-13 px-8 text-base shadow-xl shadow-black/20 w-full sm:w-auto">
                    Book a Consultation <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#plans">
                  <Button size="lg" variant="outline" className="border-white/40 bg-white/5 text-white hover:bg-white/15 h-13 px-8 backdrop-blur-sm w-full sm:w-auto">
                    View Plans
                  </Button>
                </a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-[#c9a84c]" /> Attorney-Client Privileged</span>
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-[#c9a84c]" /> Secure Client Portal</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#c9a84c]" /> Fast Response</span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                <img src={IMAGES.attorney} alt="Tom Phinney, Esq." className="w-full aspect-[4/5] object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2744] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-heading text-2xl font-bold text-white">Tom Phinney, Esq.</p>
                  <p className="text-[#c9a84c] text-sm mt-1">Founding Attorney · TP Legal</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-5 border border-gray-100 max-w-[220px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#1a2744]/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-[#c9a84c]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1a2744]">18+</p>
                    <p className="text-xs text-gray-500">Practice Areas</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">Comprehensive coverage from one trusted advocate.</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#c9a84c] text-[#1a2744] rounded-xl shadow-lg px-4 py-3 font-semibold text-sm">
                ★ Trusted Counsel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative z-10 -mt-1 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-heading font-bold text-[#1a2744]">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img src={IMAGES.office} alt="Law library" className="rounded-2xl object-cover w-full h-56 shadow-lg" />
                <img src={IMAGES.consult} alt="Client consultation" className="rounded-2xl object-cover w-full h-56 shadow-lg mt-8" />
              </div>
              <div className="absolute -bottom-6 right-4 lg:right-8 bg-[#1a2744] text-white rounded-xl p-6 shadow-xl max-w-xs">
                <Quote className="w-8 h-8 text-[#c9a84c] mb-3 opacity-80" />
                <p className="text-sm leading-relaxed text-white/90 italic">
                  "Every client deserves direct access to their attorney — not a call center."
                </p>
                <p className="text-[#c9a84c] text-xs mt-3 font-medium">— Tom Phinney, Esq.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#c9a84c] font-semibold text-sm tracking-widest uppercase mb-3">About TP Legal</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a2744] mb-6 leading-tight">
                A Modern Law Practice Built Around You
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                TP Legal is a private practice designed for clarity, speed, and personal attention.
                No referral games, no hidden layers — just experienced legal counsel when you need it,
                delivered through a secure digital platform.
              </p>
              <ul className="space-y-4 mb-8">
                {["Video, phone, and written consultations", "Secure document exchange & e-signatures", "Real-time matter tracking in your portal", "Transparent subscription and consultation pricing"].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#c9a84c] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/book">
                <Button className="bg-[#1a2744] hover:bg-[#243560] text-white h-12 px-8">
                  Schedule Your Consultation <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#c9a84c] font-semibold text-sm tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a2744] mb-4">How It Works</h2>
            <p className="text-gray-500 text-lg">Three steps from legal question to expert guidance — streamlined and secure.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
              <div key={step} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#c9a84c]/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-[#1a2744] flex items-center justify-center mb-6 shadow-lg">
                  <Icon className="w-6 h-6 text-[#c9a84c]" />
                </div>
                <span className="text-xs font-bold text-[#c9a84c] tracking-widest">{step}</span>
                <h3 className="font-heading text-xl font-bold text-[#1a2744] mt-2 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation types */}
      <section className="py-24 bg-[#1a2744] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#c9a84c] font-semibold text-sm tracking-widest uppercase mb-3">Flexible Access</p>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-6">Consult Your Way</h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Choose the format that fits your schedule and comfort level — every option is secure and attorney-client privileged.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Video, label: "Video Consultation", sub: "Face-to-face, anywhere" },
                  { icon: Phone, label: "Phone Consultation", sub: "Speak directly with Tom" },
                  { icon: FileText, label: "Document Review", sub: "Expert written analysis" },
                  { icon: Users, label: "Full Representation", sub: "End-to-end case handling" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#c9a84c]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-white/50 text-xs mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img src={IMAGES.consult} alt="Legal consultation" className="rounded-2xl shadow-2xl border border-white/10 w-full aspect-[4/3] object-cover" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Practice Areas */}
      <section id="practice-areas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[#c9a84c] font-semibold text-sm tracking-widest uppercase mb-3">Expertise</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a2744] mb-4">Practice Areas</h2>
            <p className="text-gray-500 text-lg">Comprehensive legal coverage — one attorney, your dedicated advocate.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {PRACTICE_AREAS.map((area) => (
              <Link key={area.name} to="/book">
                <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 h-full hover:border-[#c9a84c] hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#c9a84c]/5 rounded-bl-full group-hover:bg-[#c9a84c]/10 transition-colors" />
                  <p className="font-semibold text-[#1a2744] text-sm group-hover:text-[#1a2744] pr-4">{area.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{area.subtitle}</p>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#c9a84c] group-hover:translate-x-1 transition-all mt-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] font-semibold text-sm tracking-widest uppercase mb-3">Client Experience</p>
            <h2 className="font-heading text-3xl font-bold text-[#1a2744]">What Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, author, role }) => (
              <div key={author} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#c9a84c] text-[#c9a84c]" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">"{quote}"</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-semibold text-[#1a2744] text-sm">{author}</p>
                  <p className="text-xs text-gray-400">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[#c9a84c] font-semibold text-sm tracking-widest uppercase mb-3">Pricing</p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a2744] mb-4">Subscription Plans</h2>
            <p className="text-gray-500 text-lg">Ongoing legal access at a fraction of traditional firm rates.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 relative flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
                  plan.highlight
                    ? "bg-[#1a2744] text-white shadow-2xl shadow-[#1a2744]/30 scale-105 z-10 border-2 border-[#c9a84c]"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-[#c9a84c] text-[#1a2744] font-bold px-4 shadow-md">Most Popular</Badge>
                  </div>
                )}
                <h3 className={`font-heading text-xl font-bold ${plan.highlight ? "text-white" : "text-[#1a2744]"}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 my-6">
                  <span className={`text-5xl font-bold ${plan.highlight ? "text-[#c9a84c]" : "text-[#1a2744]"}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "text-white/50" : "text-gray-400"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? "text-[#c9a84c]" : "text-[#1a2744]"}`} />
                      <span className={plan.highlight ? "text-white/85" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/book">
                  <Button className={`w-full h-12 font-semibold ${plan.highlight ? "bg-[#c9a84c] hover:bg-[#d4b565] text-[#1a2744]" : "bg-[#1a2744] hover:bg-[#243560] text-white"}`}>
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <img src={IMAGES.cta} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1a2744]/90" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-5">
            Ready to Move Forward?
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Book a consultation today. Direct access to your attorney — no runaround, no surprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" className="bg-[#c9a84c] hover:bg-[#d4b565] text-[#1a2744] font-bold h-13 px-10 shadow-xl">
                Book a Consultation
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 h-13 px-10 backdrop-blur-sm">
                Client Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1629] text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <Logo />
              <p className="mt-4 text-sm leading-relaxed max-w-sm text-white/50">
                A modern private law practice offering direct attorney access, secure client communications, and transparent pricing across 18 practice areas.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">For Clients</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/book" className="hover:text-[#c9a84c] transition-colors">Book Consultation</Link></li>
                <li><Link to="/login" className="hover:text-[#c9a84c] transition-colors">Client Login</Link></li>
                <li><a href="#plans" className="hover:text-[#c9a84c] transition-colors">Subscription Plans</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">For Professionals</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/attorney/join" className="hover:text-[#c9a84c] transition-colors">Join Network</Link></li>
                <li><Link to="/owner/join" className="hover:text-[#c9a84c] transition-colors">Firm Admin</Link></li>
                <li><Link to="/firm/create" className="hover:text-[#c9a84c] transition-colors">Create Firm</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© {new Date().getFullYear()} TP Legal · Tom Phinney, Esq. All rights reserved.</p>
            <p className="text-center">Attorney-client privileged. Not legal advice until engagement letter is signed.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
