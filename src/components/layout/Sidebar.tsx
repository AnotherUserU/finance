"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Receipt, 
  Camera, 
  BarChart3, 
  LogOut, 
  Wallet 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transaksi", href: "/transactions", icon: Receipt },
  { name: "Scan Struk", href: "/scan", icon: Camera },
  { name: "Analitik", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-card border-r p-4 fixed left-0 top-0">
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <div className="h-10 w-10 grad-primary rounded-xl flex items-center justify-center">
          <Wallet className="h-6 w-6 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">FinanceMe</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "group-hover:text-foreground"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 space-y-4 border-t border-muted">
        <div className="flex items-center gap-3 px-2 py-2">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User" className="h-8 w-8 rounded-full" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">
              {user?.email?.[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.displayName || "Pengguna"}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all group"
        >
          <LogOut className="h-5 w-5 group-hover:text-destructive" />
          <span className="text-sm font-medium">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
