"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Code, CheckCircle, Lock } from "lucide-react";
import ScrollRevealParagraph from "@/components/scroll-reveal-paragraph";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function HeroSection() {
  return (
    <section className="relative w-full pt-16 pb-24 md:pt-24 text-center">
      {/* Grid Background */}
      <div className="absolute inset-0 -z-10 h-[800px] w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="max-w-4xl mx-auto"
      >
        <motion.div variants={fadeIn} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-sm font-medium">
            <Sparkles size={14} />
            <span>AI-Powered Resume & Portfolio Builder v2.0 is live</span>
          </div>
        </motion.div>

        <motion.h1 
          variants={fadeIn}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-black dark:text-white"
        >
          Land your dream job <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-500 via-blue-500 to-emerald-500 dark:from-purple-400 dark:via-blue-400 dark:to-emerald-400">
             faster with AI.
          </span>
        </motion.h1>

        <ScrollRevealParagraph 
          className="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
          paragraph="Stop getting rejected by ATS. Build unbeatable resumes, perfect cover letters, and stunning portfolios automatically from your GitHub profile."
        />

        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-base hover:scale-105 transition-transform group flex items-center justify-center gap-2">
            Build Your Resume
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-6 py-3 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white font-medium text-base transition-colors flex items-center justify-center gap-2">
            <Code size={18} />
            Import from GitHub
          </button>
        </motion.div>
        
        <motion.p variants={fadeIn} className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
          <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-500" /> No credit card required. Free templates included.
        </motion.p>
      </motion.div>

      {/* Abstract Dashboard Mockup */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-20 relative mx-auto max-w-5xl perspective-1000"
      >
        <div className="absolute inset-0 bg-linear-to-t from-gray-50 dark:from-black via-transparent to-transparent z-10" />
        <div className="relative rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0c0e] shadow-2xl overflow-hidden flex transform-gpu rotate-x-12 scale-95 hover:rotate-x-0 hover:scale-100 transition-all duration-700 ease-out group">
          
          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 h-12 border-b border-black/5 dark:border-white/5 flex items-center px-4 gap-2 bg-gray-50 dark:bg-white/5">
             <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80" />
             <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/80" />
             <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/80" />
             <div className="ml-4 px-3 py-1 bg-gray-200 dark:bg-black/40 rounded-md text-xs text-gray-500 font-mono flex items-center gap-2">
               <Lock size={10} /> buildforjob.com/app/resume-builder
             </div>
          </div>

          <div className="pt-10 flex w-full h-[400px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-black/5 dark:border-white/5 p-4 flex flex-col gap-2 bg-gray-50 dark:bg-[#08080a]">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
              ))}
            </div>
            {/* Main Area */}
            <div className="flex-1 p-8 grid grid-cols-2 gap-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-90">
              <div className="flex flex-col gap-4">
                 <div className="h-32 rounded-xl bg-linear-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 border border-black/5 dark:border-white/10" />
                 <div className="h-64 rounded-xl bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/10" />
              </div>
              <div className="flex flex-col gap-4">
                 <div className="h-full rounded-xl bg-white dark:bg-white/10 border border-black/10 dark:border-white/20 shadow-[0_0_40px_rgba(139,92,246,0.05)] dark:shadow-[0_0_40px_rgba(139,92,246,0.15)] relative overflow-hidden group-hover:shadow-[0_0_80px_rgba(139,92,246,0.15)] dark:group-hover:shadow-[0_0_80px_rgba(139,92,246,0.3)] transition-all duration-500">
                    <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-purple-500 to-blue-500" />
                    <div className="p-6 h-full flex flex-col gap-4 opacity-50">
                       <div className="h-6 w-1/3 bg-gray-300 dark:bg-white/20 rounded" />
                       <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded" />
                       <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/10 rounded" />
                       <div className="h-4 w-4/6 bg-gray-200 dark:bg-white/10 rounded" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  );
}
