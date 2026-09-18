import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Wallet, LineChart, User, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/analytics", label: "Analytics", icon: LineChart },
  { to: "/personal", label: "Personal", icon: User },
  { to: "/messages", label: "Message", icon: MessageSquare },
  { to: "/settings", label: "Setting", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          L
        </div>
        <span className="text-lg font-semibold">Loopr</span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors relative",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-primary font-medium"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -left-4 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-primary" />
                )}
                <Icon className="h-4 w-4" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}