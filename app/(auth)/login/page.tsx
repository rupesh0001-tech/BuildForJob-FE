"use client";
import React from "react";
import Link from "next/link";
import { Briefcase, Code, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-linear-to-tr from-purple-600 to-blue-500 p-2 rounded-xl group-hover:scale-105 transition-transform">
              <Briefcase size={24} className="text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-black dark:text-white">
              BuildForJob
            </span>
          </Link>
        </div>

        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2 text-center">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">Enter your details to access your dashboard.</p>

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

            <button className="w-full py-3 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mt-2">
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
              <Code size={18} /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">
              <Mail size={18} className="text-red-500" /> Google
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-black dark:text-white hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}