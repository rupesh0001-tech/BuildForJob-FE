"use client";
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button1 } from "@/components/general/buttons/button1";

export function LoginForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
        <input 
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <a href="#" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors">Forgot Password?</a>
        </div>
        <input 
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
        />
      </div>

      <Button1 type="submit" className="w-full py-3 h-12 flex items-center justify-center gap-2 mt-2">
        Sign In <ArrowRight size={16} />
      </Button1>
    </form>
  );
}
