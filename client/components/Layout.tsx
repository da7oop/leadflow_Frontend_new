import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function Layout({
  children,
  isAuthenticated = false,
  onLogout,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation isAuthenticated={isAuthenticated} onLogout={onLogout} />
      {children}
    </div>
  );
}
