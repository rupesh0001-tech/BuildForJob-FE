"use client";

import React from "react";
import { Sparkles, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PortfolioBuilderPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12">
      {/* Decorative blurred blobs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Icon */}
        <div className="p-4 bg-primary/10 rounded-2xl text-primary mb-6 animate-pulse">
          <Globe size={36} />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5 tracking-wide uppercase">
          <Sparkles size={12} />
          Coming Soon
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
          Portfolio Builder
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-md mb-8">
          Build and export a stunning personal portfolio website with a single click. 
          Drag-and-drop sections, custom themes, and instant deployment — all coming soon.
        </p>

        {/* Progress indicator */}
        <div className="w-full max-w-xs mb-8">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Development Progress</span>
            <span className="font-semibold text-primary">75%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: "75%" }}
            />
          </div>
        </div>

        {/* Back button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-semibold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/15 transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
