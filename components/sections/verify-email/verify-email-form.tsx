"use client";
import React, { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button1 } from "@/components/general/buttons/button1";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyOtp, resendOtp, updateProfile } from "@/store/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { fetchGitHubData, extractUsername } from "@/lib/github/github-api";
import { GithubSyncModal } from "@/components/profile/GithubSyncModal";

export function VerifyEmailForm() {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [isVerified, setIsVerified] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [fetchingGithub, setFetchingGithub] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const { isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!email) {
      toast.error("Invalid verification session");
      router.push("/register");
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0 || isVerified) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, isVerified]);

  const handleResend = async () => {
    if (!email) return;

    try {
      const resultAction = await dispatch(resendOtp({ email, type: 'REGISTRATION' }));
      if (resendOtp.fulfilled.match(resultAction)) {
        toast.success("A new code has been sent to your email!");
        setCountdown(30);
      } else {
        toast.error(resultAction.payload as string || "Failed to resend code");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !email) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const resultAction = await dispatch(verifyOtp({ 
        email, 
        otp, 
        type: 'REGISTRATION' 
      }));
      
      if (verifyOtp.fulfilled.match(resultAction)) {
        toast.success("Email verified successfully!");
        setIsVerified(true);
      } else {
        toast.error(resultAction.payload as string || "Verification failed");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleModalClose = () => {
    setShowSyncModal(false);
    router.push("/dashboard");
  };

  const handleGithubFetch = async () => {
    const username = extractUsername(githubUrl);
    if (!username) {
      toast.error("Please enter a valid GitHub profile URL.");
      return;
    }

    setFetchingGithub(true);
    setGithubData(null);
    try {
      const data = await fetchGitHubData(username);
      setGithubData(data);
      setShowSyncModal(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch GitHub profile. Make sure the username is correct.");
    } finally {
      setFetchingGithub(false);
    }
  };

  const onGithubDataMerged = async (mergedData: any) => {
    try {
      await dispatch(updateProfile(mergedData)).unwrap();
      toast.success("GitHub data synced successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error || "Failed to sync GitHub data");
      throw error;
    }
  };

  if (isVerified) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-2 text-center font-sans">Connect GitHub</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6 leading-relaxed font-sans">
          Let&apos;s customize your profile. Connect your GitHub profile to instantly import your projects, technologies, and repositories.
        </p>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-1 font-sans">
              GitHub Profile URL
            </label>
            <input 
              type="url"
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all text-sm font-semibold"
            />
          </div>

          <Button1 
            onClick={handleGithubFetch}
            className="w-full py-3 h-12 flex items-center justify-center gap-2"
            disabled={fetchingGithub || !githubUrl}
          >
            {fetchingGithub ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>Connect & Sync <ArrowRight size={16} /></>
            )}
          </Button1>

          <button 
            type="button"
            onClick={handleSkip}
            className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white hover:underline transition-all cursor-pointer text-center block"
          >
            Skip this process
          </button>
        </div>

        {githubData && user && (
          <GithubSyncModal 
            isOpen={showSyncModal}
            onClose={handleModalClose}
            githubData={githubData}
            currentData={user}
            onSync={onGithubDataMerged}
            key={githubData.profile.html_url}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-2 text-center font-sans">Verify your email</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6 font-sans">We&apos;ve sent a code to your inbox.</p>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center block font-sans">
            Enter the 6-digit code sent to <span className="font-semibold text-black dark:text-white">{email}</span>
          </label>
          <input 
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
          />
        </div>

        <Button1 
          type="submit" 
          className="w-full py-3 h-12 flex items-center justify-center gap-2 mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>Verify Email <ArrowRight size={16} /></>
          )}
        </Button1>
        
        <p className="text-center text-xs text-gray-500 mt-4 font-sans">
          Didn&apos;t receive the code?{" "}
          {countdown > 0 ? (
            <span className="text-gray-400 dark:text-gray-500 font-medium">
              Resend Code in {countdown}s
            </span>
          ) : (
            <button 
              type="button" 
              onClick={handleResend}
              disabled={isLoading}
              className="text-purple-600 dark:text-purple-400 font-medium hover:underline disabled:opacity-50 cursor-pointer"
            >
              Resend Code
            </button>
          )}
        </p>
      </form>
    </div>
  );
}
