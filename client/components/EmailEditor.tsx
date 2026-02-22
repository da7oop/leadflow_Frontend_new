import { useState } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmailEditorProps {
  draftContent: {
    to?: string;
    subject?: string;
    body?: string;
  };
  onClose: () => void;
  onSend: (email: { to: string; subject: string; body: string }) => void;
}

export default function EmailEditor({
  draftContent,
  onClose,
  onSend,
}: EmailEditorProps) {
  const [to, setTo] = useState(draftContent.to || "");
  const [subject, setSubject] = useState(draftContent.subject || "");
  const [body, setBody] = useState(draftContent.body || "");

  const handleSend = () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      alert("Please fill in all fields");
      return;
    }
    onSend({ to, subject, body });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-foreground">Email Editor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors text-foreground/70 hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {/* To Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              To
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-foreground/40"
            />
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-foreground/40"
            />
          </div>

          {/* Body Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Email message"
              rows={10}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-foreground/40 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25 rounded-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Email
          </Button>
        </div>
      </div>
    </div>
  );
}
