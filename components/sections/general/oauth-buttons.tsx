"use client";
import React from "react";
import { Mail, Code } from '@/lib/icons';
import { AuthButton } from "@/components/general/buttons/auth-button";

export function OAuthButtons() {
  const handleOAuth = (provider: "google" | "github") => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <AuthButton 
        onClick={() => handleOAuth("github")}
        icon={<Code size={18} />} 
        text="GitHub" 
      />
      <AuthButton 
        onClick={() => handleOAuth("google")}
        icon={<Mail size={18} className="text-red-500" />} 
        text="Google" 
      />
    </div>
  );
}
