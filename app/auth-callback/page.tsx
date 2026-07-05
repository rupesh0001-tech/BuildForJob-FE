"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setToken, fetchProfile } from "@/store/slices/authSlice";
import { Loader2, CheckCircle2 } from '@/lib/icons';
import { toast } from "sonner";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Authentication failed. No token provided.");
      router.push("/login");
      return;
    }

    const authenticate = async () => {
      try {
        // 1. Save token to state
        dispatch(setToken(token));

        // 2. Fetch the profile details to populate user details in store and localStorage
        const profileResult = await dispatch(fetchProfile()).unwrap();
        
        // Redirect newly registered Google OAuth users who haven't set up their profile to onboarding/github
        if (!profileResult.jobTitle && (!profileResult.experience || profileResult.experience.length === 0)) {
          toast.success("Welcome! Let's get started by setting up your profile.");
          router.push("/onboarding/github");
        } else {
          toast.success(`Welcome back, ${profileResult.firstName || 'User'}!`);
          router.push("/dashboard");
        }
      } catch (err: any) {
        console.error("OAuth session restoration failed:", err);
        toast.error("Session sync failed. Please try logging in again.");
        router.push("/login");
      }
    };

    authenticate();
  }, [searchParams, dispatch, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#08080a] text-center p-6">
      {/* Premium Glassmorphic Card */}
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-10 max-w-sm w-full shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Loader2 className="animate-spin text-primary" size={56} />
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="text-primary/40" size={24} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-black dark:text-white tracking-tight">Syncing your Account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please wait while we secure your session and prepare your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#08080a]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}
