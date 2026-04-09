"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Receipt, 
  Camera, 
  BarChart3 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Transaksi", href: "/transactions", icon: Receipt },
  { name: "Scan", href: "/scan", icon: Camera },
  { name: "Analitik", href: "/analytics", icon: BarChart3 },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t px-4 h-16 flex items-center justify-around pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-200 py-1 flex-1",
              isActive ? "text-primary scale-110" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
