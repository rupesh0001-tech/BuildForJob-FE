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
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Info,
  X,
} from "lucide-react";
import { checkATSScore } from "@/apis/ats.api";
import type { ATSResult } from "@/apis/ats.api";

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

// ─── Radial progress ring ──────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const colorClass = getScoreBg(score);
  const strokeColor =
    score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      <svg className="w-48 h-48 -rotate-90" viewBox="0 0 180 180">
        {/* Track */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-gray-100 dark:text-white/10"
        />
        {/* Progress */}
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      {/* Center label */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className={`text-4xl font-black ${getScoreColor(score)}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {score}
        </motion.span>
        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          / 100
        </span>
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
            : "border-gray-200 dark:border-white/10 hover:border-purple-400 hover:bg-purple-50/30 dark:hover:bg-purple-500/5"
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
            <p className="font-semibold text-sm text-black dark:text-white">
              Drop your resume PDF here
            </p>
            <p className="text-xs text-gray-500 mt-1">
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
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleCheck = async () => {
    if (!file || jd.trim().length < 20) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setShowBreakdown(false);

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

  const handleReset = () => {
    setFile(null);
    setJd("");
    setResult(null);
    setError(null);
    setShowBreakdown(false);
  };

  const scoreInfo = result ? getScoreLabel(result.score) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <FileCheck size={20} className="text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white">ATS Checker</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
          Upload your resume and paste a job description to get an AI-powered match score.
        </p>
      </motion.div>

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
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={12} /> Resume PDF
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
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Sparkles size={12} /> Job Description
              </label>
              <textarea
                id="ats-jd-input"
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the full job description here — requirements, responsibilities, skills…"
                rows={10}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:border-purple-500 outline-none rounded-2xl text-sm font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-all resize-none"
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
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
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
                    : "bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.99] shadow-purple-500/25"
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
            <div
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getScoreGradient(
                result.score
              )} border border-white/10 p-8`}
            >
              {/* Blurred blob */}
              <div
                className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-30 ${getScoreBg(
                  result.score
                )}`}
              />

              <div className="relative flex flex-col md:flex-row items-center gap-8">
                {/* Ring */}
                <ScoreRing score={result.score} />

                {/* Text */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                      ATS Match Score
                    </p>
                    <h2 className="text-3xl font-black text-black dark:text-white">
                      {scoreInfo?.emoji} {scoreInfo?.label}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/40 dark:bg-white/5 rounded-xl">
                      <p className="text-xs text-gray-500 font-medium">Resume Words</p>
                      <p className="text-lg font-bold text-black dark:text-white">
                        {result.resumeWordCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-white/40 dark:bg-white/5 rounded-xl">
                      <p className="text-xs text-gray-500 font-medium">JD Words</p>
                      <p className="text-lg font-bold text-black dark:text-white">
                        {result.jdWordCount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {result.score >= 75 ? (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                      <CheckCircle2 size={16} />
                      Your resume aligns well with this role!
                    </div>
                  ) : result.score >= 50 ? (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium">
                      <AlertCircle size={16} />
                      Some improvements could boost your match score.
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
                      <AlertCircle size={16} />
                      Consider tailoring your resume to this job description.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Breakdown toggle */}
            {result.details && (
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
                <button
                  id="ats-breakdown-toggle"
                  onClick={() => setShowBreakdown((p) => !p)}
                  className="w-full flex items-center justify-between px-6 py-4 text-sm font-semibold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={15} className="text-purple-500" />
                    Per-requirement Breakdown
                  </span>
                  {showBreakdown ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </button>

                <AnimatePresence>
                  {showBreakdown && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 space-y-2 border-t border-gray-100 dark:border-white/10">
                        {result.details.split("\n").map((line, i) => {
                          const match = line.match(/→\s*(\d+)%/);
                          const pct = match ? parseInt(match[1]) : 0;
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-3 py-2"
                            >
                              <div className="flex-1 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                {line.replace(/→\s*\d+%/, "").replace("•", "").trim()}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`h-full rounded-full ${
                                      pct >= 75
                                        ? "bg-emerald-500"
                                        : pct >= 50
                                        ? "bg-amber-500"
                                        : "bg-red-400"
                                    }`}
                                  />
                                </div>
                                <span
                                  className={`text-xs font-bold w-10 text-right ${
                                    pct >= 75
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : pct >= 50
                                      ? "text-amber-600 dark:text-amber-400"
                                      : "text-red-500"
                                  }`}
                                >
                                  {pct}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Reset */}
            <button
              id="ats-reset-btn"
              onClick={handleReset}
              className="w-full py-3 rounded-2xl font-semibold text-sm border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> Check Another Resume
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
