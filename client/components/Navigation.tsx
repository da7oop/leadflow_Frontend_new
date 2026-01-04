import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

interface NavigationProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function Navigation({
  isAuthenticated = false,
  onLogout,
}: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-lg text-foreground">ChatHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`transition-colors duration-200 ${
                    isActive("/")
                      ? "text-primary font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className={`transition-colors duration-200 ${
                    isActive("/login")
                      ? "text-primary font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/chat"
                  className={`transition-colors duration-200 ${
                    isActive("/chat")
                      ? "text-primary font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  Chat
                </Link>
                <Link
                  to="/admin"
                  className={`transition-colors duration-200 ${
                    isActive("/admin")
                      ? "text-primary font-semibold"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  Admin
                </Link>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors duration-200 font-medium"
                >
                  Logout
                </button>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-slide-down">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="block px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors text-foreground/70 hover:text-foreground"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors text-foreground/70 hover:text-foreground"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/chat"
                  className="block px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors text-foreground/70 hover:text-foreground"
                >
                  Chat
                </Link>
                <Link
                  to="/admin"
                  className="block px-4 py-2 rounded-lg hover:bg-accent/10 transition-colors text-foreground/70 hover:text-foreground"
                >
                  Admin
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium text-left"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
