"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Loader2 } from "lucide-react";
import React from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, token } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated && !token) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, token, router, mounted]);

  // Don't render anything that depends on client-only state during SSR
  if (!mounted) {
    return null;
  }

  if (isLoading || (!isAuthenticated && token)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#08080a]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return null;
  }

  return <>{children}</>;
}
