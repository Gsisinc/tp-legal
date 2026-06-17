import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ClientMessages() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [matters, setMatters] = useState([]);
  const [selectedMatter, setSelectedMatter] = useState(null);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      const [m, msgs] = await Promise.all([
        base44.entities.Matter.filter({ client_id: u.id }),
        base44.entities.Message.filter({ client_id: u.id }, "created_date")
      ]);
      setMatters(m);
      setSelectedMatter(m[0]?.id || null);
      setMessages(msgs);
    });
  }, []);

  const send = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);
    const msg = await base44.entities.Message.create({
      matter_id: selectedMatter || "general",
      sender_id: user.id,
      sender_name: user.full_name,
      sender_role: "client",
      content: newMessage.trim()
    });
    setMessages(m => [...m, msg]);
    setNewMessage("");
    setSending(false);
  };

  const threadMessages = messages.filter(m => !selectedMatter || m.matter_id === selectedMatter);

  return (
    <div className="p-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-[#1a2744]">Messages</h1>
        <p className="text-gray-500 text-sm mt-1">Secure communications with your attorney</p>
      </div>

      {matters.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {matters.map(m => (
            <button key={m.id} onClick={() => setSelectedMatter(m.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedMatter === m.id ? 'bg-[#1a2744] text-white' : 'bg-gray-100 text-gray-600'}`}>
              {m.practice_area}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col min-h-96">
        <div className="flex-1 p-5 space-y-4 overflow-y-auto">
          {threadMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No messages yet. Send a message to your attorney below.</p>
              </div>
            </div>
          ) : threadMessages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 ${msg.sender_id === user?.id ? 'bg-[#1a2744] text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.sender_id !== user?.id && (
                  <p className="text-xs font-semibold text-[#c9a84c] mb-1">{msg.sender_name || "Tom Phinney, Esq."}</p>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-xs mt-1.5 ${msg.sender_id === user?.id ? 'text-white/40' : 'text-gray-400'}`}>
                  {new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 p-4 flex gap-3">
          <Textarea placeholder="Type a message to your attorney..."
            className="resize-none text-sm"
            rows={2}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
          <Button onClick={send} disabled={!newMessage.trim() || sending}
            className="bg-[#1a2744] hover:bg-[#243560] text-white self-end">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}