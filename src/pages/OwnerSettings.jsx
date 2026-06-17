import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Save, Upload, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function OwnerSettings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.BrandingSettings.list().then(s => {
      setSettings(s[0] || {
        firm_name: "TP Legal",
        attorney_name: "Tom Phinney, Esq.",
        tagline: "Your Practice Platform. Built for You.",
        primary_color: "#1a2744",
        accent_color: "#c9a84c",
        consultation_fee_min: 150,
        consultation_fee_max: 350
      });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    if (settings.id) {
      await base44.entities.BrandingSettings.update(settings.id, settings);
    } else {
      const created = await base44.entities.BrandingSettings.create(settings);
      setSettings(created);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Platform Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure branding, pricing, and contact information</p>
      </div>

      <div className="space-y-6">
        {/* Branding */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-bold text-[#1a2744] mb-5 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#c9a84c]" /> Branding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="mb-1 block">Firm Name</Label>
              <Input value={settings.firm_name || ""} onChange={e => setSettings(s => ({ ...s, firm_name: e.target.value }))} />
            </div>
            <div>
              <Label className="mb-1 block">Attorney Name</Label>
              <Input value={settings.attorney_name || ""} onChange={e => setSettings(s => ({ ...s, attorney_name: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-1 block">Tagline</Label>
              <Input value={settings.tagline || ""} onChange={e => setSettings(s => ({ ...s, tagline: e.target.value }))} />
            </div>
            <div>
              <Label className="mb-1 block">Primary Color (Navy)</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.primary_color || "#1a2744"} onChange={e => setSettings(s => ({ ...s, primary_color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer border border-gray-200" />
                <Input value={settings.primary_color || ""} onChange={e => setSettings(s => ({ ...s, primary_color: e.target.value }))} className="flex-1" />
              </div>
            </div>
            <div>
              <Label className="mb-1 block">Accent Color (Gold)</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.accent_color || "#c9a84c"} onChange={e => setSettings(s => ({ ...s, accent_color: e.target.value }))} className="w-10 h-10 rounded cursor-pointer border border-gray-200" />
                <Input value={settings.accent_color || ""} onChange={e => setSettings(s => ({ ...s, accent_color: e.target.value }))} className="flex-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-bold text-[#1a2744] mb-5">Contact & Domain</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label className="mb-1 block">Phone</Label>
              <Input value={settings.phone || ""} onChange={e => setSettings(s => ({ ...s, phone: e.target.value }))} placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <Label className="mb-1 block">Email</Label>
              <Input type="email" value={settings.email || ""} onChange={e => setSettings(s => ({ ...s, email: e.target.value }))} placeholder="tom@example.com" />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-1 block">Office Address</Label>
              <Input value={settings.address || ""} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} placeholder="123 Main St, City, State 00000" />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-1 block">Custom Domain</Label>
              <Input value={settings.custom_domain || ""} onChange={e => setSettings(s => ({ ...s, custom_domain: e.target.value }))} placeholder="www.tomphinneylegal.com" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-heading text-base font-bold text-[#1a2744] mb-5">Consultation Pricing</h2>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label className="mb-1 block">Minimum Fee ($)</Label>
              <Input type="number" value={settings.consultation_fee_min || 150} onChange={e => setSettings(s => ({ ...s, consultation_fee_min: Number(e.target.value) }))} />
            </div>
            <div>
              <Label className="mb-1 block">Maximum Fee ($)</Label>
              <Input type="number" value={settings.consultation_fee_max || 350} onChange={e => setSettings(s => ({ ...s, consultation_fee_max: Number(e.target.value) }))} />
            </div>
          </div>
        </div>

        <Button onClick={save} disabled={saving} className="bg-[#1a2744] hover:bg-[#243560] text-white gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}