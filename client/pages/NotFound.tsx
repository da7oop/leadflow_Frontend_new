import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-8 max-w-md animate-slide-up">
          {/* 404 Number */}
          <div className="space-y-2">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              404
            </h1>
            <p className="text-2xl font-semibold text-foreground">
              Page Not Found
            </p>
            <p className="text-lg text-foreground/60">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Illustration */}
          <div className="py-8 px-4 bg-card rounded-2xl border border-border">
            <div className="text-6xl">🔍</div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg border border-secondary/30 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
