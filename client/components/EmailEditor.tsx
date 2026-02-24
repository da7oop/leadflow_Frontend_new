import { useState } from "react";
import { X, Send, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface EmailEditorProps {
  draftContent: {
    to?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    body?: string;
  };
  conversationHistory?: Message[];
  onClose: () => void;
  onSend: (email: {
    to: string;
    cc: string;
    bcc: string;
    subject: string;
    body: string;
  }) => void;
}

export default function EmailEditor({
  draftContent,
  conversationHistory = [],
  onClose,
  onSend,
}: EmailEditorProps) {
  const [to, setTo] = useState(draftContent.to || "");
  const [cc, setCc] = useState(draftContent.cc || "");
  const [bcc, setBcc] = useState(draftContent.bcc || "");
  const [subject, setSubject] = useState(draftContent.subject || "");
  const [body, setBody] = useState(draftContent.body || "");
  const [showRevision, setShowRevision] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSend = () => {
    if (!to.trim() || !subject.trim() || !body.trim()) {
      alert("Please fill in To, Subject, and Message fields");
      return;
    }
    onSend({ to, cc, bcc, subject, body });
  };

  const analyzeConversation = () => {
    if (conversationHistory.length === 0) return;
    
    setIsAnalyzing(true);

    // Simulate AI analysis of conversation
    setTimeout(() => {
      // Extract key points from conversation
      const clientMessages = conversationHistory.filter(
        (m) => m.type === "user"
      );
      const assistantMessages = conversationHistory.filter(
        (m) => m.type === "assistant"
      );

      // Generate subject based on conversation context
      if (!subject && clientMessages.length > 0) {
        const firstMessage = clientMessages[0].content;
        const keywords = firstMessage
          .split(" ")
          .filter((word) => word.length > 4)
          .slice(0, 3)
          .join(" ");
        setSubject(`Re: ${keywords || "Your inquiry"}`);
      }

      // Draft email body from conversation context
      if (!body) {
        const draftBody = `Dear [Client Name],

Thank you for reaching out. Based on our conversation, here are the key points:

${clientMessages
  .map((msg) => `• ${msg.content.substring(0, 80)}...`)
  .join("\n")}

I believe this addresses your needs and aligns with your requirements. Please let me know if you have any additional questions or if you'd like to discuss further.

Best regards,
[Your Name]`;

        setBody(draftBody);
      }

      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4">
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

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Email Composer */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 border-b lg:border-b-0 lg:border-r border-border">
            {/* To Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                To *
              </label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-foreground/40"
              />
            </div>

            {/* CC Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                CC
              </label>
              <input
                type="email"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="cc@example.com (optional, comma-separated for multiple)"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-foreground/40"
              />
            </div>

            {/* BCC Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                BCC
              </label>
              <input
                type="email"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="bcc@example.com (optional, comma-separated for multiple)"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-foreground/40"
              />
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Subject *
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
                Message *
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Email message"
                rows={12}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-foreground/40 resize-none"
              />
            </div>
          </div>

          {/* Conversation Review Panel */}
          {conversationHistory.length > 0 && (
            <div className="w-full lg:w-80 flex flex-col border-t lg:border-t-0 border-border bg-background/50">
              {/* Panel Header */}
              <div className="px-4 py-4 border-b border-border flex items-center justify-between">
                <button
                  onClick={() => setShowRevision(!showRevision)}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors w-full"
                >
                  <Lightbulb className="w-4 h-4" />
                  Conversation Review
                  {showRevision ? (
                    <ChevronUp className="w-4 h-4 ml-auto" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  )}
                </button>
              </div>

              {/* Panel Content */}
              {showRevision && (
                <div className="flex-1 overflow-y-auto flex flex-col">
                  {/* Conversation Messages */}
                  <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
                    {conversationHistory.map((message) => (
                      <div
                        key={message.id}
                        className={`text-xs rounded-lg p-2 ${
                          message.type === "user"
                            ? "bg-primary/10 text-foreground border border-primary/20"
                            : "bg-card border border-border text-foreground"
                        }`}
                      >
                        <div className="font-semibold mb-1 text-xs uppercase tracking-wide text-foreground/70">
                          {message.type === "user" ? "You" : "Assistant"}
                        </div>
                        <p className="leading-relaxed text-xs line-clamp-4">
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Auto-Draft Button */}
                  <div className="px-4 py-3 border-t border-border">
                    <Button
                      onClick={analyzeConversation}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-primary/80 to-primary hover:shadow-lg hover:shadow-primary/25 rounded-lg text-sm flex items-center justify-center gap-2"
                    >
                      {isAnalyzing ? (
                        <>
                          <span className="inline-block animate-spin">⚙️</span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-4 h-4" />
                          Auto-Draft from Conversation
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3 bg-card">
          <Button onClick={onClose} variant="outline" className="rounded-lg">
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
