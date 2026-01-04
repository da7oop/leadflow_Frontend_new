import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Activity,
  BarChart3,
  Settings,
  Trash2,
  Edit2,
} from "lucide-react";
import Layout from "@/components/Layout";

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  joinDate: string;
}

export default function Admin() {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/");
  };

  // Sample data
  const users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "active",
      joinDate: "2024-01-20",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "inactive",
      joinDate: "2024-01-10",
    },
  ];

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: "1,234",
      change: "+12%",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Activity,
      label: "Active Sessions",
      value: "456",
      change: "+8%",
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: MessageSquare,
      label: "Total Messages",
      value: "12.5K",
      change: "+24%",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: BarChart3,
      label: "Engagement Rate",
      value: "68%",
      change: "+5%",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <Layout isAuthenticated={true} onLogout={handleLogout}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 space-y-2 animate-slide-up">
            <h1 className="text-4xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-foreground/60">
              Manage users, content, and monitor platform analytics
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 group"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`p-3 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-foreground/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* User Management Section */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden animate-slide-down">
            {/* Section Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card/50">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                User Management
              </h2>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Add User
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-card/50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-accent/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-foreground font-medium">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-foreground/60">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.status === "active"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground/60">
                        {user.joinDate}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors text-foreground/70 hover:text-foreground">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-foreground/70 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Settings Section */}
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-6 h-6 text-secondary" />
              <h2 className="text-xl font-semibold text-foreground">
                Site Settings
              </h2>
            </div>
            <p className="text-foreground/60 mb-6">
              Configure platform settings and preferences
            </p>
            <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium">
              Edit Settings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
