import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function TermsAgreement({ terms, agreed, onAgreedChange, id = "terms" }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-h-64 overflow-y-auto text-sm text-gray-600 whitespace-pre-line">
        {terms}
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={agreed}
          onCheckedChange={(v) => onAgreedChange(Boolean(v))}
        />
        <Label htmlFor={id} className="text-sm text-gray-700 leading-relaxed cursor-pointer">
          I have read and agree to the terms above. I understand this agreement is binding.
        </Label>
      </div>
    </div>
  );
}
