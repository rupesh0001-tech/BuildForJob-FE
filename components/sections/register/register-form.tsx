"use client";
import React from "react";
import { ArrowRight } from "lucide-react";

export function RegisterForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
        <input 
          type="text"
          placeholder="Jane Doe"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
        <input 
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input 
          type="password"
          placeholder="Create a strong password"
          className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#111116] border border-gray-200 dark:border-white/10 text-black dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-400"
        />
      </div>

      <button className="w-full py-3 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-4">
        Create Account <ArrowRight size={16} />
      </button>
    </form>
  );
}
