"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileText,
  RotateCcw,
  Info,
  X,
} from "lucide-react";
import { checkATSScore, getATSSuggestions } from "@/apis/ats.api";
import type { ATSResult, ATSSuggestions } from "@/apis/ats.api";

// ─── Score colour helpers ──────────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 75) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}

function getScoreBg(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function getScoreLabel(score: number) {
  if (score >= 80) return { label: "Excellent Match", emoji: "🎯" };
  if (score >= 65) return { label: "Good Match", emoji: "✅" };
  if (score >= 45) return { label: "Average Match", emoji: "⚠️" };
  return { label: "Poor Match", emoji: "❌" };
}

function getScoreGradient(score: number) {
  if (score >= 75) return "from-emerald-500/20 to-emerald-500/5";
  if (score >= 50) return "from-amber-500/20 to-amber-500/5";
  return "from-red-500/20 to-red-500/5";
}

// ─── Score Gauge ──────────────────────────────────────────────────

function ScoreGauge({ score }: { score: number }) {
  const radius = 80;
  const circumference = Math.PI * radius; 
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const gradientId = "gauge-gradient";

  return (
    <div className="relative flex items-center justify-center w-80 h-48">
      <svg className="w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          className="text-gray-100 dark:text-white/5"
        />
        {/* Progress */}
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "circOut" }}
        />
      </svg>
      
      {/* Center Score */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-baseline"
        >
          <span className="text-6xl font-semibold text-black dark:text-white tracking-tighter">
            {score}
          </span>
          <span className="text-xl font-semibold text-gray-400 dark:text-gray-500 ml-1">%</span>
        </motion.div>
      </div>

     
    </div>
  );
}

// ─── Drop-zone component ───────────────────────────────────────────────────

function DropZone({
  file,
  onFile,
  onClear,
}: {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f?.type === "application/pdf") onFile(f);
    },
    [onFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer min-h-[160px] flex flex-col items-center justify-center gap-4 p-6
        ${
          file
            ? "border-purple-500/50 bg-purple-50/50 dark:bg-purple-500/5 cursor-default"
            : isDragging
            ? "border-purple-500 bg-purple-50 dark:bg-purple-500/10 scale-[1.01]"
            : "border-gray-300 dark:border-white/15 hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-500/5"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="hidden"
        id="ats-pdf-input"
      />

      {file ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 w-full"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={22} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-black dark:text-white text-sm truncate">{file.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {(file.size / 1024).toFixed(0)} KB · PDF
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      ) : (
        <>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors
            ${isDragging ? "bg-purple-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-400 dark:text-gray-500"}`}
          >
            <Upload size={24} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-md text-black dark:text-white">
              Drop your resume PDF here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or{" "}
              <span className="text-purple-500 font-semibold">browse files</span>
              {" "}· Max 5 MB
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────

export default function ATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [suggestions, setSuggestions] = useState<ATSSuggestions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleCheck = async () => {
    if (!file || jd.trim().length < 20) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSuggestions(null);
    setIsUnlocked(false);

    try {
      const data = await checkATSScore(file, jd);
      setResult(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockAndAnalyze = async () => {
    setIsUnlocked(true);
    setSuggestionsLoading(true);
    try {
      const text = await getATSSuggestions(file, jd);
      setSuggestions(text);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to get AI suggestions.";
      setError(msg);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJd("");
    setResult(null);
    setSuggestions(null);
    setError(null);
    setIsUnlocked(false);
  };

  const scoreInfo = result ? getScoreLabel(result.score) : null;
  const improvementCount = result ? Math.max(3, Math.floor((105 - result.score) / 6)) : 0;

  const dummySuggestions = [
    "Your professional summary is missing key industry keywords...",
    "The experience section lacks quantifiable achievements and metrics...",
    "Formatting issues detected in the education section header...",
    "Skill alignment with the job description is currently below average...",
    "Project descriptions should focus more on technology impact..."
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">


      {/* ── Form or Results ── */}
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* PDF Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                 Resume PDF
              </label>
              <DropZone
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <label
                htmlFor="ats-jd-input"
                className="text-sm font-semibold text-gray-800 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                 Job Description
              </label>
              <textarea
                id="ats-jd-input"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here — requirements, responsibilities, skills…"
                rows={10}
                className="w-full px-6 py-5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 outline-none rounded-2xl text-base font-semibold text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all resize-none
                [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none"
              />
              <p className="text-xs text-gray-400 text-right">
                {jd.trim().split(/\s+/).filter(Boolean).length} words
              </p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl"
                >
                  <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              id="ats-check-btn"
              onClick={handleCheck}
              disabled={!file || jd.trim().length < 20 || loading}
              className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg
                ${
                  !file || jd.trim().length < 20 || loading
                    ? "bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-primary text-white hover:brightness-110 active:scale-[0.99] shadow-primary/25"
                }`}
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Analysing with AI…
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Analyse Match Score
                </>
              )}
            </button>

            {/* Tip */}
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 justify-center">
              <Info size={12} />
              Uses the{" "}
              <span className="font-medium">sentence-transformers/all-MiniLM-L6-v2</span>{" "}
              model via HuggingFace.
            </p>
          </motion.div>
        ) : (
          /* ── Results Panel ── */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6"
          >
            {/* Score card */}
            <div className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              {/* Card Header */}
              <div className="px-8 py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white leading-none mb-1">ATS Match Analysis</h3>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Analysis Score</p>
                </div>
                <div className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
                  <Info size={18} />
                </div>
              </div>

              {/* Card Body - Gauge */}
              <div className="px-10 pt-10 pb-8 relative">
                <div className="flex flex-col items-center mb-8">
                  <ScoreGauge score={result.score} />
                </div>
                
                {/* Qualitative Footer (Reference: Left-aligned bold title + description) */}
                <div className="space-y-2 border-t border-gray-100 dark:border-white/10 pt-8">
                  <h4 className="text-xl font-semibold text-black dark:text-white">
                    {result.score >= 80 ? "Excellent profile match" : result.score >= 60 ? "Strong candidate match" : "Profile requires tailoring"}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Your resume has achieved a {result.score}% match with the job requirements. 
                    {result.score < 90 ? " To stand out to recruiters, we recommend addressing the critical improvements listed below." : " Your profile is highly competitive and ready for submission."}
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              {result.score < 90 && (
                <div className="mx-10 mb-10 py-4 px-6 bg-purple-50/50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/20 rounded-2xl flex items-center gap-4">
                   <div className="w-10 h-10 bg-white dark:bg-black/20 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <AlertCircle size={20} className="text-purple-600 dark:text-purple-400" />
                   </div>
                   <p className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                     {improvementCount} critical improvements needed to reach 90+ score.
                   </p>
                </div>
              )}
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm relative min-h-[400px] flex flex-col">
              <div className="px-8 py-6 flex items-center gap-3 shrink-0">
                 <div className="w-8 h-8 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
                 </div>
                 <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">AI Analysis & Suggestions</h3>
              </div>

              <div className="flex-1 relative px-8 py-12 overflow-hidden bg-gray-50/30 dark:bg-black/20">
                {/* Suggestions Container */}
                <div className="relative z-10">
                  {suggestionsLoading && isUnlocked ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-6">
                      <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
                      <div className="text-center space-y-2">
                        <p className="text-xl font-semibold text-black dark:text-white">AI Analysis in progress...</p>
                        <p className="text-sm text-gray-500 font-semibold tracking-wide">Evaluating impact and identifying key gaps</p>
                      </div>
                    </div>
                  ) : !isUnlocked ? (
                    /* Locked State - Placeholder UI */
                    <div className="space-y-12 blur-[6px] opacity-60 select-none pointer-events-none">
                      {Array(6).fill(null).map((_, i) => (
                        <div key={i} className="flex gap-6 max-w-3xl mx-auto w-full">
                          <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/10 shrink-0" />
                          <div className="flex-1 space-y-3 pt-2">
                            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full w-1/3" />
                            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : suggestions && (
                    /* Unlocked State - Structured UI */
                    <div className="max-w-4xl mx-auto space-y-12">
                      {/* Critical Improvements with Progress Bars */}
                      <section className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                           <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Impactful Improvements</h4>
                        </div>
                        <div className="grid gap-4">
                          {suggestions.improvements?.map((item, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center gap-4 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                                  <CheckCircle2 size={18} className="text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-lg font-semibold text-black dark:text-white truncate">{item.title}</h5>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 pl-14 leading-relaxed font-medium">
                                {item.description}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </section>

                      {/* Keyword & Skill Gaps */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Missing Keywords */}
                        <section className="space-y-6">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Missing Keywords</h4>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {suggestions.missingKeywords?.map((tag, i) => (
                                <motion.span 
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + i * 0.05 }}
                                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-xl text-sm font-semibold border border-indigo-100 dark:border-indigo-500/20"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                           </div>
                        </section>

                        {/* Missing Skills */}
                        <section className="space-y-6">
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-6 bg-pink-500 rounded-full" />
                              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Missing Skills</h4>
                           </div>
                           <div className="flex flex-wrap gap-2">
                              {suggestions.missingSkills?.map((tag, i) => (
                                <motion.span 
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + i * 0.05 }}
                                  className="px-4 py-2 bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300 rounded-xl text-sm font-semibold border border-pink-100 dark:border-pink-500/20"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                           </div>
                        </section>
                      </div>
                    </div>
                  )}
                </div>

                {/* Paywall Overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-8 bg-white/20 dark:bg-black/40">
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white dark:bg-[#161618] p-12 rounded-2xl border border-gray-200 dark:border-white/10 shadow-[0_64px_128px_-16px_rgba(0,0,0,0.4)] text-center max-w-md w-full relative overflow-hidden"
                     >
                        {/* Decorative background element */}
                        
                        
                        <h4 className="text-2xl font-semibold text-black dark:text-white mb-4">Unlock Pro Analysis</h4>
                        <p className="text-base text-gray-600 dark:text-gray-400 mb-10 leading-relaxed px-4">
                           Get exact keywords, content gaps, and achievement-based improvements to beat the ATS.
                        </p>
                        
                        <button 
                          onClick={handleUnlockAndAnalyze}
                          className="w-full py-5 bg-primary hover:brightness-110 text-white rounded-[24px] font-semibold shadow-xl shadow-primary/30 transition-all active:scale-[0.97] cursor-pointer flex items-center justify-center gap-3 group text-lg"
                        >
                           Purchase Pro · ₹9 ($0.11)
                           <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        </button>
                        
                        <div className="mt-6 flex items-center justify-center gap-6">
                           <div className="flex flex-col items-center">
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Payment</p>
                              <p className="text-xs text-gray-500 font-semibold">One-time</p>
                           </div>
                           <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
                           <div className="flex flex-col items-center">
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Access</p>
                              <p className="text-xs text-gray-500 font-semibold">1 Month</p>
                           </div>
                        </div>
                     </motion.div>
                  </div>
                )}
              </div>
            </div>

            {/* Reset */}
            <button
              id="ats-reset-btn"
              onClick={handleReset}
              className="w-full py-3 rounded-2xl font-semibold text-sm border border-gray-300 dark:border-white/15 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> Check Another Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
