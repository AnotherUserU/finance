"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { usePathname } from "next/navigation";

/**
 * MainLayout provides the global shell for authenticated pages.
 * It intelligently hides navigation components on the login page.
 */
export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen flex flex-col p-4 md:p-10">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
