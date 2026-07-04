"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Globe, 
  Copy, 
  ExternalLink, 
  Check, 
  FilePlus, 
  Info, 
  Mail, 
  User, 
  MessageSquare, 
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { TEMPLATES } from "@/lib/portfolio-defaults";

// Mock initial form responses (98 responses to simulate the 100-limit warning)
const MOCK_RESPONSES = [
  { id: 1, name: "Sarah Connor", email: "sarah@cyberdyne.net", message: "Incredible system reliability metrics on the ledger optimization case study. Are you open to freelance consulting?", date: "2026-07-04 22:40" },
  { id: 2, name: "Tony Stark", email: "tony@starkindustries.com", message: "Need a distributed logs architecture expert for the clean energy grid automation. Let's talk rates.", date: "2026-07-04 19:15" },
  { id: 3, name: "Bruce Wayne", email: "bruce@waynecorp.com", message: "Interested in high-availability communications failovers. Security clearance required. Get back to me.", date: "2026-07-04 15:30" },
  { id: 4, name: "Linus Torvalds", email: "torvalds@linuxfoundation.org", message: "Code looks surprisingly clean. Keep it up.", date: "2026-07-03 11:22" },
  { id: 5, name: "Ada Lovelace", email: "ada@computing.org", message: "Wonderful aesthetic layout choice. Prismatic gradient feels very forward-looking.", date: "2026-07-02 09:05" }
];

export default function MyPortfolioPage() {
  const [liveTemplateId, setLiveTemplateId] = useState("architect-prismatic");
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [responsesCount, setResponsesCount] = useState(98);
  const [responses, setResponses] = useState(MOCK_RESPONSES);

  // Generate dynamic hosted URL details based on name
  const username = "rupesh";
  const portfolioId = "10";
  const hostedUrl = `/${username}/${portfolioId}`;

  const handleCopyLink = () => {
    const fullUrl = window.location.origin + hostedUrl;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMakeLive = (templateId: string) => {
    setLiveTemplateId(templateId);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#08080a] py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-black/5 dark:border-white/5 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
              My Portfolio Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Configure your live hosted template and monitor form submissions.
            </p>
          </div>
          <Link
            href="/dashboard/portfolio"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white hover:brightness-105 transition-all text-xs font-semibold rounded-xl shadow-md"
          >
            <FilePlus size={14} />
            Open Portfolio Editor
          </Link>
        </div>

        {/* 1. Host Info Card */}
        <div className="bg-white dark:bg-[#111115] border border-black/5 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Globe size={20} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">LIVE HOSTING STATUS</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Hosted Live</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Hosted URL</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200 select-all">
                    {window.location.origin + hostedUrl}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-5 py-3 border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <Link 
                href={hostedUrl}
                target="_blank"
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-850 dark:bg-white dark:text-black text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                View Live Site
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Template Switcher Grid */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Design Templates</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Only one template can be live at a time. Click "Make Live" to instantly update your live hosted page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES.map((tpl) => {
              const isActive = tpl.id === liveTemplateId;
              return (
                <div 
                  key={tpl.id}
                  className={`bg-white dark:bg-[#111115] border rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between transition-all duration-300 ${
                    isActive ? "ring-2 ring-primary border-primary/20" : "border-black/5 dark:border-white/5"
                  }`}
                >
                  <div className="relative h-44 bg-slate-100 dark:bg-black/20 overflow-hidden">
                    <img 
                      src={tpl.thumbnailUrl} 
                      alt={tpl.name} 
                      className="w-full h-full object-cover"
                    />
                    {isActive && (
                      <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                        <Check size={10} /> Active / Live
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{tpl.name}</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    {isActive ? (
                      <div className="w-full py-2.5 text-center bg-primary/10 text-primary rounded-xl text-xs font-bold select-none">
                        Active Live Template
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleMakeLive(tpl.id)}
                        className="w-full py-2.5 text-center bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all"
                      >
                        Make Live
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Form Responses Block */}
        <div className="bg-white dark:bg-[#111115] border border-black/5 dark:border-white/5 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Form Responses</h2>
              <div 
                className="relative inline-block"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <button className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                  <Info size={16} />
                </button>
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 dark:bg-zinc-800 text-white text-[11px] leading-relaxed rounded-lg shadow-xl z-50">
                    Free tier is limited to 100 form responses. Oldest responses are automatically deleted when new ones arrive (e.g. response 101 replaces response 1). Upgrade to Pro for unlimited response storage.
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl px-4 py-2">
              <AlertCircle size={14} className="text-amber-500" />
              <div className="text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400">{responsesCount} / 100</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">responses used</span>
              </div>
            </div>
          </div>

          {/* Alert / Warning Bar */}
          {responsesCount >= 95 && (
            <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/30 dark:border-amber-900/20 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed max-w-2xl">
                ⚠️ **Warning:** You are close to your limit of 100 free form submissions. When response 101 arrives, your oldest response will be deleted automatically. Upgrade to a Pro account for unlimited response storage.
              </p>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all hover:bg-amber-500 active:scale-95 flex items-center gap-1.5">
                <Sparkles size={12} />
                Upgrade to Pro
              </button>
            </div>
          )}

          {/* Form Submissions List Table */}
          <div className="overflow-x-auto border border-black/5 dark:border-white/5 rounded-xl bg-slate-50/20 dark:bg-black/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#15151b]/40 border-b border-black/5 dark:border-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">Sender</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/2">Message Content</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4 text-right">Sent Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 text-xs text-slate-700 dark:text-slate-300">
                {responses.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/30 dark:hover:bg-white/5 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <User size={12} className="text-slate-400" />
                          {res.name}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                          <Mail size={10} className="text-slate-400" />
                          {res.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 max-w-xl">
                        <MessageSquare size={12} className="text-slate-400 mt-0.5 shrink-0" />
                        <p className="leading-relaxed text-slate-600 dark:text-slate-300 break-words">{res.message}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-slate-400 font-mono text-[10px]">
                      <span className="flex items-center gap-1 justify-end">
                        <Calendar size={10} />
                        {res.date}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
