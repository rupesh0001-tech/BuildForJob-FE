"use client";

import React, { useState, useEffect } from "react";
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
  Plus,
  ChevronDown
} from "lucide-react";
import { TEMPLATES } from "@/lib/portfolio-defaults";
import { Button1 } from "@/components/general/buttons/button1";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
  const [selectedTemplateId, setSelectedTemplateId] = useState("architect-prismatic");
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [responsesCount, setResponsesCount] = useState(98);
  const [responses, setResponses] = useState(MOCK_RESPONSES);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate dynamic hosted URL details based on name
  const username = "rupesh";
  const portfolioId = "10";
  const hostedUrl = `/${username}/${portfolioId}`;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const fullUrl = window.location.origin + hostedUrl;
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleMakeLive = (templateId: string) => {
    setLiveTemplateId(templateId);
    toast.success("Live portfolio template updated!");
  };

  const selectedTemplate = TEMPLATES.find((tpl) => tpl.id === selectedTemplateId) || TEMPLATES[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-black/40 rounded-2xl p-6 border border-gray-300 dark:border-white/10 shadow-sm flex flex-col justify-between backdrop-blur-xl"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary">
               <FilePlus size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">Manual Builder</h3>
              <p className="text-sm text-gray-500 mt-1">Start with a blank canvas and build your portfolio from scratch.</p>
            </div>
          </div>
          <Link href="/dashboard/portfolio" className="mt-8">
            <Button1 className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold">
               Open Portfolio Editor <Plus size={16} />
            </Button1>
          </Link>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-black/40 rounded-2xl p-6 border border-gray-300 dark:border-white/10 shadow-sm flex flex-col justify-between backdrop-blur-xl"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
               <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">Profile-to-Portfolio</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Instantly create a professional portfolio based on your profile data.</p>
            </div>
          </div>
          <Link href="/dashboard/portfolio?autofill=true" className="mt-8">
            <Button1 className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold">
               Generate via Profile <Plus size={16} />
            </Button1>
          </Link>
        </motion.div>
      </div>

      {/* 1. Host Info Card */}
      <div className="bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <Globe size={20} />
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Live Hosting Status</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Hosted Live</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Hosted URL</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono font-normal text-gray-700 dark:text-gray-300 select-all break-all bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-lg">
                  {mounted ? window.location.origin + hostedUrl : hostedUrl}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold transition-all"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <Link 
              href={hostedUrl}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-primary/25"
            >
              View Live Site
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Active Design Templates Switcher */}
      <div className="bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm backdrop-blur-xl space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white">Active Design Templates</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Only one template can be live at a time. Select a template and click "Make Live" to instantly update your live hosted page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Select Template
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-medium text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-left"
              >
                <span>
                  {selectedTemplate.name} {selectedTemplate.id === liveTemplateId ? " (Active)" : ""}
                </span>
                <ChevronDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-full bg-white dark:bg-[#12121a] border border-gray-300 dark:border-white/10 rounded-xl shadow-2xl z-40 py-1.5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {TEMPLATES.map((tpl) => {
                      const isActive = tpl.id === liveTemplateId;
                      const isSelected = tpl.id === selectedTemplateId;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            setSelectedTemplateId(tpl.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
                            isSelected ? "text-primary bg-primary/5 font-semibold" : "text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <span>{tpl.name}</span>
                          {isActive && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-stretch sm:items-end">
            {selectedTemplateId === liveTemplateId ? (
              <div className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-semibold select-none h-10 w-full sm:w-auto">
                <Check size={16} /> Active Live Template
              </div>
            ) : (
              <button
                onClick={() => handleMakeLive(selectedTemplateId)}
                className="px-6 py-2.5 bg-primary hover:brightness-110 active:scale-[0.98] text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-primary/25 h-10 w-full sm:w-auto"
              >
                Make Live
              </button>
            )}
          </div>
        </div>

        {selectedTemplate && (
          <div className="pt-4 border-t border-gray-100 dark:border-white/5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
              Template Description
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {selectedTemplate.description}
            </p>
          </div>
        )}
      </div>

      {/* 3. Form Responses Block */}
      <div className="bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-2xl p-6 md:p-8 shadow-sm backdrop-blur-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-black dark:text-white">Contact Form Responses</h3>
            <div 
              className="relative inline-block"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                <Info size={16} />
              </button>
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 dark:bg-gray-800 text-white text-[11px] leading-relaxed rounded-lg shadow-xl z-50">
                  Free tier is limited to 100 form responses. Oldest responses are automatically deleted when new ones arrive (e.g. response 101 replaces response 1). Upgrade to Pro for unlimited response storage.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-2">
            <AlertCircle size={14} className="text-amber-500" />
            <div className="text-xs font-semibold">
              <span className="text-amber-600 dark:text-amber-400">{responsesCount} / 100</span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">responses used</span>
            </div>
          </div>
        </div>

        {/* Alert / Warning Bar */}
        {responsesCount > 80 && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed max-w-2xl">
              ⚠️ <strong>Warning:</strong> You are close to your limit of 100 free form submissions. When response 101 arrives, your oldest response will be deleted automatically. Upgrade to a Pro account for unlimited response storage.
            </p>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 transition-all hover:bg-amber-500 active:scale-95 flex items-center gap-1.5 shadow-md">
              <Sparkles size={12} />
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Form Submissions List Table */}
        <div className="overflow-x-auto border border-gray-300 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-black/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-300 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">Sender</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/2">Message Content</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4 text-right">Sent Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-sm text-gray-800 dark:text-gray-200">
              {responses.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50/50 dark:hover:bg-white/10 transition-all">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-black dark:text-white flex items-center gap-1.5">
                        <User size={14} className="text-gray-400" />
                        {res.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" />
                        {res.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 max-w-xl">
                      <MessageSquare size={14} className="text-gray-400 mt-0.5 shrink-0" />
                      <p className="leading-relaxed text-gray-800 dark:text-gray-200 break-words">{res.message}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500 dark:text-gray-400 font-mono text-xs">
                    <span className="flex items-center gap-1 justify-end">
                      <Calendar size={12} />
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
  );
}
