import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronDown, ChevronRight, Plus, Trash2, Save, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function OwnerPlaybooks() {
  const [playbooks, setPlaybooks] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Playbook.list().then(p => {
      setPlaybooks(p);
      setLoading(false);
    });
  }, []);

  const savePlaybook = async (pb) => {
    if (pb.id) {
      await base44.entities.Playbook.update(pb.id, pb);
    }
    setEditing(null);
  };

  const addItem = (pb, field) => {
    const updated = { ...pb, [field]: [...(pb[field] || []), ""] };
    setEditing(updated);
  };

  const updateItem = (pb, field, idx, val) => {
    const arr = [...(pb[field] || [])];
    arr[idx] = val;
    setEditing({ ...pb, [field]: arr });
  };

  const removeItem = (pb, field, idx) => {
    const arr = [...(pb[field] || [])];
    arr.splice(idx, 1);
    setEditing({ ...pb, [field]: arr });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-[#1a2744] border-t-[#c9a84c] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Practice Area Playbooks</h1>
        <p className="text-gray-500 text-sm mt-1">Configure intake questions, required documents, AI tasks, and common matter types for each practice area.</p>
      </div>

      <div className="space-y-3">
        {playbooks.map(pb => {
          const isOpen = expanded === pb.id;
          const isEditing = editing?.id === pb.id;
          const current = isEditing ? editing : pb;

          return (
            <div key={pb.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : pb.id)}>
                <div>
                  <p className="font-semibold text-[#1a2744]">{pb.practice_area}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pb.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="text-xs bg-gray-100 text-gray-600">{pb.intake_questions?.length || 0} intake</Badge>
                  {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 p-5">
                  {[
                    { field: "intake_questions", label: "Intake Questions" },
                    { field: "required_documents", label: "Required Documents" },
                    { field: "ai_tasks", label: "AI Task Checklist" },
                    { field: "common_matters", label: "Common Matter Types" }
                  ].map(({ field, label }) => (
                    <div key={field} className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm text-[#1a2744]">{label}</h3>
                        {isEditing && (
                          <button onClick={() => addItem(current, field)}
                            className="text-xs text-[#c9a84c] hover:text-[#b8973b] flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {(current[field] || []).map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full flex-shrink-0" />
                            {isEditing ? (
                              <>
                                <Input className="text-sm flex-1 h-8" value={item}
                                  onChange={e => updateItem(current, field, i, e.target.value)} />
                                <button onClick={() => removeItem(current, field, i)}>
                                  <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                                </button>
                              </>
                            ) : (
                              <span className="text-sm text-gray-600">{item}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-3 pt-3 border-t border-gray-100">
                    {isEditing ? (
                      <>
                        <Button onClick={() => savePlaybook(current)} className="bg-[#1a2744] hover:bg-[#243560] text-white gap-2 text-sm">
                          <Save className="w-3.5 h-3.5" /> Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditing(null)} className="text-sm">Cancel</Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setEditing({ ...pb })} className="gap-2 text-sm">
                        <Edit2 className="w-3.5 h-3.5" /> Edit Playbook
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}