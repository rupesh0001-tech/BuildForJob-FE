"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { TEMPLATES } from "@/lib/portfolio-defaults";
import TemplateRenderer from "@/components/portfolio/TemplateRenderer";
import { Sparkles, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HostedPortfolioPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [showBanner, setShowBanner] = useState(true);

  // 1. Find which template to render. 
  // Supports a query parameter e.g., ?template=sleek-dark, or defaults to the Architect template
  const requestedTemplateId = searchParams.get("template") || "architect-prismatic";
  const template = TEMPLATES.find(t => t.id === requestedTemplateId) || TEMPLATES.find(t => t.id === "architect-prismatic") || TEMPLATES[0];

  const username = params.username as string;
  const id = params.id as string;

  // Customize dynamic data using path parameters if relevant
  const finalData = { ...template.defaultData };
  if (username) {
    // Make first letter uppercase for nice display
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
    finalData.personalInfo.fullName = formattedName;
  }

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Template Renderer */}
      <TemplateRenderer 
        templateId={template.id} 
        data={finalData} 
        settings={template.defaultSettings} 
      />

      {/* Sticky Premium Sticker Banner at the bottom */}
      {showBanner && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg bg-slate-900/90 dark:bg-black/90 text-white backdrop-blur-md border border-white/10 px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0 animate-pulse text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-100 leading-tight">
                Made with Build For Job
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
                Create your engineering portfolio in 1 minute.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/"
              className="px-4 py-2 bg-primary hover:brightness-105 transition-all text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1 text-white shrink-0"
            >
              Build Yours <ArrowRight size={10} />
            </Link>
            <button 
              onClick={() => setShowBanner(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
