"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * A wrapper component that protects routes from unauthorized access.
 * Redirects to the login page if the user is not authenticated.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.replace("/login");
    }
    
    if (!loading && user && pathname === "/login") {
      router.replace("/");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Securing your session...</p>
        </div>
      </div>
    );
  }

  // To prevent flickering of protected content while redirecting
  if (!user && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
