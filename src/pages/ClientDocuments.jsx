import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Upload, FileText, Download, CheckCircle, Clock, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS = {
  uploaded: "bg-blue-100 text-blue-700",
  draft: "bg-yellow-100 text-yellow-700",
  pending_review: "bg-orange-100 text-orange-700",
  approved: "bg-green-100 text-green-700",
  signed: "bg-purple-100 text-purple-700"
};

export default function ClientDocuments() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [signing, setSigning] = useState(null);
  const [signatureName, setSignatureName] = useState("");
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const docs = await base44.entities.Document.filter({ client_id: u.id }, "-created_date");
      setDocuments(docs);
    });
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const doc = await base44.entities.Document.create({
      client_id: user.id,
      name: file.name,
      type: "client_upload",
      file_url,
      status: "uploaded"
    });
    setDocuments(d => [doc, ...d]);
    setUploading(false);
  };

  const handleSign = async (doc) => {
    if (!signatureName || !signatureConfirmed) return;
    const updated = await base44.entities.Document.update(doc.id, {
      status: "signed",
      signed_at: new Date().toISOString()
    });
    setDocuments(d => d.map(x => x.id === doc.id ? updated : x));
    setSigning(null);
    setSignatureName("");
    setSignatureConfirmed(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Documents</h1>
          <p className="text-gray-500 text-sm mt-1">Upload documents and review materials from your attorney</p>
        </div>
        <label className="cursor-pointer">
          <Button className="bg-[#1a2744] hover:bg-[#243560] text-white gap-2" disabled={uploading}>
            <Upload className="w-4 h-4" /> {uploading ? "Uploading..." : "Upload Document"}
          </Button>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No documents yet. Upload your first document above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#1a2744]">{doc.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{doc.type?.replace("_", " ")} · {new Date(doc.created_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${STATUS_COLORS[doc.status] || 'bg-gray-100'}`}>{doc.status}</Badge>
                  {doc.requires_signature && doc.status !== "signed" && (
                    <Button size="sm" variant="outline" className="text-xs gap-1" onClick={() => setSigning(doc)}>
                      <PenLine className="w-3 h-3" /> Sign
                    </Button>
                  )}
                  {doc.file_url && (
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="ghost" className="text-xs gap-1">
                        <Download className="w-3 h-3" /> Download
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* E-signature modal inline */}
              {signing?.id === doc.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-sm text-[#1a2744] mb-3">Sign: {doc.name}</p>
                  <p className="text-xs text-gray-500 mb-3">By signing below, you acknowledge that this constitutes your legal electronic signature.</p>
                  <input type="text" placeholder="Type your full legal name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 font-heading italic text-[#1a2744] text-lg"
                    value={signatureName} onChange={e => setSignatureName(e.target.value)} />
                  <label className="flex items-center gap-2 text-xs text-gray-600 mb-4 cursor-pointer">
                    <input type="checkbox" checked={signatureConfirmed} onChange={e => setSignatureConfirmed(e.target.checked)} />
                    I understand this electronic signature is legally binding and confirms my agreement to the document above.
                  </label>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSign(doc)} disabled={!signatureName || !signatureConfirmed}
                      className="bg-[#1a2744] text-white text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" /> Confirm Signature
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setSigning(null)} className="text-xs">Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}