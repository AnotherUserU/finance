"use client";

import { useAuth } from "@/hooks/useAuth";
import { LogIn } from "lucide-react";
import React from "react";

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-background flex flex-col items-center justify-center p-6">
      {/* Premium Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md glass-card p-8 md:p-12 flex flex-col items-center text-center space-y-8">
        <div className="space-y-2">
          <div className="mx-auto h-16 w-16 grad-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-grad">
            Finance For Me
          </h1>
          <p className="text-muted-foreground text-sm">
            Silakan masuk untuk mulai mengelola keuangan Anda dengan cerdas.
          </p>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-foreground text-background font-semibold h-12 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
          ) : (
            <>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Masuk dengan Google
            </>
          )}
        </button>

        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          Aman • Cepat • Personal
        </p>
      </div>

      <footer className="absolute bottom-8 text-muted-foreground/40 text-xs">
        &copy; 2026 Finance For Me. Monitoring Keuangan Masa Depan.
      </footer>
    </div>
  );
}
