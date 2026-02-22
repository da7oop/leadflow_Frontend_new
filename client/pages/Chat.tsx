import { useState, useEffect, useRef } from "react";
import { Send, Plus } from "lucide-react";
import Layout from "@/components/Layout";
import EmailEditor from "@/components/EmailEditor";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface EmailDraft {
  to?: string;
  subject?: string;
  body?: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailEditor, setShowEmailEditor] = useState(false);
  const [emailDraft, setEmailDraft] = useState<EmailDraft>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Detect email intent from user input
  const detectEmailIntent = (text: string): { isEmail: boolean; draft: EmailDraft } => {
    const emailKeywords = [
      /send\s+(?:an?\s+)?email/i,
      /email\s+(?:to|about)/i,
      /compose\s+(?:an?\s+)?email/i,
      /write\s+(?:an?\s+)?email/i,
      /draft\s+(?:an?\s+)?email/i,
      /create\s+(?:an?\s+)?email/i,
    ];

    const isEmail = emailKeywords.some((regex) => regex.test(text));

    if (isEmail) {
      // Try to extract email details from the text
      const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
      const emails = text.match(emailRegex);
      const to = emails?.[0] || "";

      // Extract subject (look for patterns like "subject:" or "about:")
      const subjectMatch = text.match(/(?:subject|about|title):\s*(.+?)(?:\n|$)/i);
      const subject = subjectMatch?.[1]?.trim() || "";

      // Extract body (remaining text after keywords and metadata)
      const body = text
        .replace(emailKeywords.map((r) => r.source).join("|"), "")
        .replace(/(?:subject|about|title):\s*.+/i, "")
        .replace(/@[\w.-]+\.\w+/g, "")
        .trim();

      return {
        isEmail: true,
        draft: {
          to,
          subject: subject || "New Message",
          body: body || text,
        },
      };
    }

    return { isEmail: false, draft: {} };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Check for email intent
    const { isEmail, draft } = detectEmailIntent(input);

    if (isEmail) {
      // Show email editor instead of sending message
      setEmailDraft(draft);
      setShowEmailEditor(true);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I understand. Could you provide more details?",
        "Interesting! I can help you with this topic.",
        "Based on what you said, here's what I think...",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleSendEmail = (email: { to: string; subject: string; body: string }) => {
    // Add user message showing the email was sent
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Sending email to ${email.to} with subject: "${email.subject}"`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate email sending and AI response
    setLoading(true);
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Email sent successfully to ${email.to}! The message has been delivered.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);

    // Close the editor
    setShowEmailEditor(false);
    setInput("");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <Layout isAuthenticated={true} onLogout={handleLogout}>
      {showEmailEditor && (
        <EmailEditor
          draftContent={emailDraft}
          onClose={() => setShowEmailEditor(false)}
          onSend={handleSendEmail}
        />
      )}
      <div className="h-[calc(100vh-4rem)] flex flex-col bg-background">
        {/* Chat Header */}
        <div className="border-b border-border px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Chat</h1>
          <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
            <Plus className="w-6 h-6 text-foreground/70" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              } animate-slide-up`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card border border-border text-foreground rounded-bl-none"
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border text-foreground px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card px-4 sm:px-6 lg:px-8 py-4">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-foreground placeholder:text-foreground/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
