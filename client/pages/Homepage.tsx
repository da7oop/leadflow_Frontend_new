import { Link } from "react-router-dom";
import {
  MessageCircle,
  Lock,
  BarChart3,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Layout from "@/components/Layout";

export default function Homepage() {
  const features = [
    {
      icon: MessageCircle,
      title: "Advanced Chat",
      description:
        "Communicate with our AI-powered chat system designed for seamless conversations",
    },
    {
      icon: Lock,
      title: "Secure Authentication",
      description:
        "Enterprise-grade security with multi-factor authentication and email verification",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track your usage and insights with comprehensive analytics and reporting",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Experience instant responses and smooth interactions across all devices",
    },
    {
      icon: Users,
      title: "User Management",
      description:
        "Complete admin control with user management and content moderation tools",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description:
        "Your data is protected with industry-leading encryption and privacy standards",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-up">
              <div className="space-y-4">
                <div className="flex items-center gap-2 w-fit">
                  <div className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                    <span className="text-sm font-semibold text-primary flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Welcome to ChatHub
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
                  Professional Chat Platform
                </h1>

                <p className="text-xl text-foreground/70 leading-relaxed">
                  Experience the future of communication with our advanced AI-powered
                  chat platform. Secure, fast, and designed for modern teams.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="px-8 py-4 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-xl font-semibold border border-secondary/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center gap-8 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span>Lightning Fast</span>
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative h-96 lg:h-full animate-slide-down" style={{ animationDelay: "0.1s" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <div className="relative h-full rounded-3xl border border-primary/20 bg-gradient-to-br from-card to-card/50 p-8 flex items-center justify-center">
                <div className="space-y-4 w-full">
                  {/* Chat Bubble Animation */}
                  <div className="flex justify-end">
                    <div className="px-4 py-3 bg-primary text-primary-foreground rounded-2xl rounded-tr-none max-w-xs animate-fade-in">
                      Hello! How can I help you today?
                    </div>
                  </div>
                  <div className="flex" style={{ animationDelay: "0.2s" }}>
                    <div className="px-4 py-3 bg-secondary/20 text-foreground rounded-2xl rounded-tl-none max-w-xs animate-fade-in">
                      I'd like to chat with your AI assistant
                    </div>
                  </div>
                  <div className="flex justify-end" style={{ animationDelay: "0.4s" }}>
                    <div className="px-4 py-3 bg-primary text-primary-foreground rounded-2xl rounded-tr-none max-w-xs animate-fade-in">
                      Perfect! Let's get started. 🚀
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 animate-fade-in">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Powerful Features
            </h2>
            <p className="text-lg text-foreground/60">
              Everything you need for professional communication and management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="mb-4 inline-block p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-t border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 animate-fade-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Ready to Transform Your Communication?
          </h2>
          <p className="text-xl text-foreground/70">
            Join thousands of users who trust ChatHub for their communication needs
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-12 mb-8">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="space-y-1 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="space-y-1 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-1 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-semibold text-foreground">ChatHub</span>
            </div>
            <p className="text-sm text-foreground/60">
              © 2024 ChatHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
