import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Video, Phone, FileText, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";

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
  { name: "Personal Injury", subtitle: "Accidents / Premises / Products Liability" },
  { name: "Tax Law", subtitle: "Disputes / Planning / Compliance" },
  { name: "Health Care Law", subtitle: "Compliance / Licensing / Malpractice" },
  { name: "Environmental Law", subtitle: "Regulatory / Compliance / Litigation" },
  { name: "Education Law", subtitle: "Students / Schools / Disabilities" },
  { name: "Social Security & Disability Law", subtitle: "SSDI / SSI / Appeals" }
];

const PLAYBOOK_QUESTIONS = {
  "Constitutional Law": ["Nature of constitutional right alleged to be violated", "Government actor or private party?", "Federal or state court jurisdiction", "Prior administrative proceedings or complaints filed?", "Describe documented evidence of harm"],
  "Immigration Law": ["Current immigration status and visa category", "Country of origin and entry history", "Prior immigration violations, removals, or deportations?", "Criminal record (any jurisdiction)?", "Family ties to U.S. citizens or lawful permanent residents?"],
  "Criminal Law": ["Charges filed (specific statutes if known)", "Jurisdiction (federal, state, municipal)", "Arrest circumstances and whether Miranda rights were given", "Prior criminal history?", "Current bail/bond status and next court date"],
  "Civil Litigation": ["Nature of dispute and parties involved", "Jurisdiction and venue", "Estimated statute of limitations deadline", "Prior demand letters or settlement attempts?", "Damages sought (economic, non-economic, punitive)"],
  "Family Law": ["Married or domestic partnership? Length of marriage?", "Minor children involved? Current custody arrangement?", "Joint assets, real property, retirement accounts?", "Domestic violence history?", "State of filing and residency requirements met?"],
  "Employment Law": ["Nature of claim (discrimination, harassment, wrongful termination, wage theft)", "Protected class involved?", "Whether EEOC charge or state agency complaint has been filed", "Employment status: at-will or contract?", "Describe the adverse employment action"],
  "Real Estate Law": ["Transaction or dispute?", "Property type (residential, commercial, mixed-use)", "Buyer, seller, landlord, or tenant?", "Contract or lease already executed?", "Title issues, liens, or encumbrances identified?"],
  "Estate Planning & Probate": ["Client age and overall health", "Marital status and number of dependents", "Estimated gross estate value", "Prior estate planning documents in place?", "Special needs beneficiaries or complex asset structures?"],
  "Business & Corporate Law": ["Entity type sought (LLC, corporation, partnership, sole proprietor)", "Number of owners/members/shareholders", "Industry and state of operation", "Existing agreements (operating agreement, shareholder agreement)?", "Revenue stage: pre-revenue, early, or established?"],
  "Intellectual Property": ["Type of IP (invention, brand name/logo, creative work, confidential information)", "Has the IP been publicly disclosed?", "Has any prior art search been conducted?", "Is the IP currently in commercial use?", "Any suspected infringement already occurring?"],
  "Bankruptcy Law": ["Type: consumer or business bankruptcy?", "Total secured and unsecured debt amounts", "Monthly income vs. monthly expenses", "Prior bankruptcy filings within 8 years?", "Recent large transfers or asset dispositions?"],
  "Traffic & Motor Vehicle Law": ["Nature of violation (speeding, reckless, DUI, hit and run)", "State and municipality of citation", "CDL holder?", "Prior traffic violations or license suspensions?", "Whether field sobriety or chemical test was administered (DUI)?"],
  "Personal Injury": ["Date, location, and nature of incident", "Type of injury and current treatment status", "Insurance coverage of all parties", "Whether incident was reported (police, employer, property owner)", "Statute of limitations deadline (if known)"],
  "Tax Law": ["Federal or state tax issue?", "Year(s) at issue", "Whether IRS notice, audit, or collection action has been received", "Business or individual (or both)?", "Total amount of alleged tax liability"],
  "Health Care Law": ["Provider type (physician, hospital, clinic, facility)", "Nature of matter (licensing, compliance, malpractice, billing fraud)", "State licensing board jurisdiction", "Whether CMS, OIG, or HHS is involved", "HIPAA compliance status"],
  "Environmental Law": ["Federal or state regulatory matter?", "Agency involved (EPA, state DEQ, Army Corps)", "Whether violation notice, consent order, or litigation has been initiated", "Nature of contamination or environmental impact", "Property ownership status (potentially responsible party?)"],
  "Education Law": ["Student, parent, or educational institution?", "Public or private school/university?", "Nature of matter (discipline, IEP/504, discrimination, Title IX)", "Whether administrative process has been initiated", "Student's age and grade level"],
  "Social Security & Disability Law": ["Applying for SSDI or SSI?", "Nature of disabling condition(s)", "Last date worked and SGA earnings history", "Prior application filings and current stage", "Whether ALJ hearing has been scheduled"]
};

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"
];

const DATES = Array.from({ length: 10 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  if (d.getDay() === 0 || d.getDay() === 6) return null;
  return d;
}).filter(Boolean);

export default function BookConsultation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [form, setForm] = useState({
    practice_area: "",
    consultation_type: "",
    selected_date: "",
    selected_time: "",
    intake_responses: {},
    client_name: "",
    client_email: "",
    client_phone: "",
    description: ""
  });

  const questions = PLAYBOOK_QUESTIONS[form.practice_area] || [];

  const handleSubmit = async () => {
    setLoading(true);
    const scheduledDate = form.selected_date && form.selected_time
      ? new Date(`${form.selected_date} ${form.selected_time}`).toISOString()
      : new Date(Date.now() + 86400000).toISOString();

    await base44.entities.Consultation.create({
      client_name: form.client_name,
      client_email: form.client_email,
      client_phone: form.client_phone,
      practice_area: form.practice_area,
      consultation_type: form.consultation_type,
      scheduled_date: scheduledDate,
      intake_responses: form.intake_responses,
      fee: 250,
      status: "booked",
      payment_status: "pending"
    });

    await base44.entities.Matter.create({
      client_name: form.client_name,
      client_email: form.client_email,
      practice_area: form.practice_area,
      consultation_type: form.consultation_type,
      consultation_date: scheduledDate,
      intake_responses: form.intake_responses,
      status: "Consultation Booked",
      description: form.description
    });

    setLoading(false);
    setBooked(true);
  };

  if (booked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#1a2744] mb-3">Consultation Booked!</h2>
          <p className="text-gray-500 mb-2">Thank you, <strong>{form.client_name}</strong>.</p>
          <p className="text-gray-500 text-sm mb-6">A confirmation has been sent to <strong>{form.client_email}</strong>. You'll receive your login credentials to access your client portal.</p>
          <div className="bg-[#1a2744]/5 rounded-lg p-4 text-left mb-6 text-sm">
            <p className="font-semibold text-[#1a2744] mb-1">{form.practice_area}</p>
            <p className="text-gray-500 capitalize">{form.consultation_type} consultation · {form.selected_date} at {form.selected_time}</p>
          </div>
          <Link to="/login">
            <Button className="w-full bg-[#1a2744] hover:bg-[#243560] text-white">Access Client Portal →</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a2744] text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#c9a84c] rounded-sm" />
            <span className="font-heading font-bold">TP Legal</span>
          </Link>
          <div className="flex items-center gap-2">
            {[1,2,3,4].map(s => (
              <div key={s} className={`w-8 h-1.5 rounded-full transition-colors ${step >= s ? 'bg-[#c9a84c]' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Step 1: Practice Area */}
        {step === 1 && (
          <div>
            <h2 className="font-heading text-2xl font-bold text-[#1a2744] mb-2">What legal matter can we help you with?</h2>
            <p className="text-gray-500 mb-8">Select the practice area that best describes your situation.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRACTICE_AREAS.map(area => (
                <button key={area.name} onClick={() => { setForm(f => ({ ...f, practice_area: area.name })); setStep(2); }}
                  className={`text-left p-4 rounded-xl border-2 transition-all hover:border-[#c9a84c] hover:shadow-md ${form.practice_area === area.name ? 'border-[#c9a84c] bg-[#1a2744] text-white' : 'border-gray-200 bg-white'}`}>
                  <p className={`font-semibold text-sm ${form.practice_area === area.name ? 'text-white' : 'text-[#1a2744]'}`}>{area.name}</p>
                  <p className={`text-xs mt-0.5 ${form.practice_area === area.name ? 'text-white/60' : 'text-gray-400'}`}>{area.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Consultation Type + Intake */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1 text-gray-500 text-sm mb-6 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-heading text-2xl font-bold text-[#1a2744] mb-2">Tell us about your situation</h2>
            <p className="text-gray-500 mb-8">{form.practice_area} — Please answer a few questions so Tom can prepare for your consultation.</p>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-[#1a2744] mb-4">Consultation Type</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: "video", icon: Video, label: "Video Call" },
                  { type: "phone", icon: Phone, label: "Phone Call" },
                  { type: "async", icon: FileText, label: "Written / Async" }
                ].map(({ type, icon: Icon, label }) => (
                  <button key={type} onClick={() => setForm(f => ({ ...f, consultation_type: type }))}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${form.consultation_type === type ? 'border-[#c9a84c] bg-[#1a2744] text-white' : 'border-gray-200 hover:border-[#c9a84c]'}`}>
                    <Icon className={`w-5 h-5 mx-auto mb-2 ${form.consultation_type === type ? 'text-[#c9a84c]' : 'text-gray-400'}`} />
                    <p className="text-sm font-medium">{label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <h3 className="font-semibold text-[#1a2744]">Intake Questions</h3>
              {questions.map((q, i) => (
                <div key={i}>
                  <Label className="text-sm text-gray-700 mb-1 block">{q}</Label>
                  <Textarea placeholder="Your answer..." className="text-sm"
                    value={form.intake_responses[q] || ""}
                    onChange={e => setForm(f => ({ ...f, intake_responses: { ...f.intake_responses, [q]: e.target.value } }))} />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStep(3)} disabled={!form.consultation_type}
                className="bg-[#1a2744] hover:bg-[#243560] text-white px-8">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} className="flex items-center gap-1 text-gray-500 text-sm mb-6 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-heading text-2xl font-bold text-[#1a2744] mb-2">Select a Time</h2>
            <p className="text-gray-500 mb-8">Choose a date and time for your {form.consultation_type} consultation.</p>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-[#1a2744] mb-4 flex items-center gap-2"><Calendar className="w-4 h-4" /> Available Dates</h3>
              <div className="flex gap-2 flex-wrap mb-6">
                {DATES.map(d => {
                  const str = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const full = d.toISOString().split('T')[0];
                  return (
                    <button key={full} onClick={() => setForm(f => ({ ...f, selected_date: str }))}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${form.selected_date === str ? 'bg-[#1a2744] text-white border-[#1a2744]' : 'border-gray-200 hover:border-[#c9a84c]'}`}>
                      {str}
                    </button>
                  );
                })}
              </div>
              {form.selected_date && (
                <>
                  <h3 className="font-semibold text-[#1a2744] mb-4">Available Times</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map(t => (
                      <button key={t} onClick={() => setForm(f => ({ ...f, selected_time: t }))}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${form.selected_time === t ? 'bg-[#1a2744] text-white border-[#1a2744]' : 'border-gray-200 hover:border-[#c9a84c]'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setStep(4)} disabled={!form.selected_date || !form.selected_time}
                className="bg-[#1a2744] hover:bg-[#243560] text-white px-8">
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Contact Info */}
        {step === 4 && (
          <div>
            <button onClick={() => setStep(3)} className="flex items-center gap-1 text-gray-500 text-sm mb-6 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="font-heading text-2xl font-bold text-[#1a2744] mb-2">Your Contact Information</h2>
            <p className="text-gray-500 mb-8">We'll create your secure client portal and send your login details.</p>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label className="mb-1 block">Full Name *</Label>
                  <Input placeholder="Jane Smith" value={form.client_name} onChange={e => setForm(f => ({ ...f, client_name: e.target.value }))} />
                </div>
                <div>
                  <Label className="mb-1 block">Email Address *</Label>
                  <Input type="email" placeholder="jane@example.com" value={form.client_email} onChange={e => setForm(f => ({ ...f, client_email: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Phone Number</Label>
                <Input placeholder="+1 (555) 000-0000" value={form.client_phone} onChange={e => setForm(f => ({ ...f, client_phone: e.target.value }))} />
              </div>
              <div>
                <Label className="mb-1 block">Additional Notes</Label>
                <Textarea placeholder="Anything else Tom should know before your consultation..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              {/* Summary */}
              <div className="bg-[#1a2744]/5 rounded-lg p-4 text-sm">
                <p className="font-semibold text-[#1a2744] mb-2">Booking Summary</p>
                <div className="space-y-1 text-gray-600">
                  <p><span className="font-medium">Practice Area:</span> {form.practice_area}</p>
                  <p><span className="font-medium">Type:</span> {form.consultation_type} consultation</p>
                  <p><span className="font-medium">Date:</span> {form.selected_date} at {form.selected_time}</p>
                  <p><span className="font-medium">Fee:</span> $250 (due at time of consultation)</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={handleSubmit} disabled={!form.client_name || !form.client_email || loading}
                className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#1a2744] font-bold px-10">
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}