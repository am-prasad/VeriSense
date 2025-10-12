import { Shield, LayoutDashboard, Search, Radio, Network, GitBranch, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Search, label: "Verify Claim", path: "/verify" },
    { icon: Radio, label: "Live Feed", path: "/feed" },
    { icon: GitBranch, label: "Chain of Trust", path: "/chain" },
    { icon: Network, label: "Cross-Domain", path: "/cross-domain" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 border-r bg-sidebar flex flex-col">
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            VeriSense
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="bg-accent/50 rounded-lg p-4">
          <p className="text-sm font-semibold mb-1">Need Help?</p>
          <p className="text-xs text-muted-foreground mb-3">
            Check our documentation or contact support
          </p>
          <button className="text-xs text-primary hover:underline">
            View Docs →
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
