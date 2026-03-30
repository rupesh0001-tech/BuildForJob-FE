"use client";
import React from "react";
import { motion } from "framer-motion";
import { Target, Mail, Code, Users, Sparkles } from "lucide-react";
import ScrollRevealParagraph from "@/components/scroll-reveal-paragraph";

export function FeaturesBentoGrid() {
  const features = [
    {
      title: "ATS-Optimized Resumes",
      desc: "Scores your resume against job descriptions to highlight missing keywords and fix formatting before you apply.",
      icon: <Target className="text-blue-500 dark:text-blue-400" />,
      className: "md:col-span-2 md:row-span-2 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-500/20",
      large: true
    },
    {
      title: "AI Cover Letters",
      desc: "Generates tailored cover letters in seconds by blending your resume with specific job requirements.",
      icon: <Mail className="text-emerald-500 dark:text-emerald-400" />,
      className: "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
    },
    {
      title: "GitHub Portfolio Sync",
      desc: "One-click generation of stunning personal websites pulling live real projects from Github.",
      icon: <Code className="text-gray-700 dark:text-gray-200" />,
      className: "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
    },
    {
      title: "LinkedIn Enhancer",
      desc: "Optimizes your headline, about section, and bullet points to rank higher in recruiter searches.",
      icon: <Users className="text-blue-600 dark:text-blue-500" />,
      className: "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 md:col-span-2"
    },
    {
      title: "Bullet Point Rewriter",
      desc: "Turns weak responsibilities into strong, metric-driven achievements.",
      icon: <Sparkles className="text-purple-500 dark:text-purple-400" />,
      className: "bg-linear-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 border-purple-200 dark:border-purple-500/20"
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-black dark:text-white">The ultimate toolkit <br/> for your job hunt.</h2>
        <ScrollRevealParagraph 
          className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl"
          paragraph="We replaced multiple scattered tools with one powerful platform. Everything you need to land interviews, organized in one place."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
        {features.map((opt, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className={`rounded-3xl p-8 border hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group ${opt.className}`}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 text-black dark:text-white">
               {React.cloneElement(opt.icon as React.ReactElement<any>, { size: opt.large ? 100 : 64 })}
            </div>
            <div className="bg-white/80 dark:bg-black/50 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-md border border-gray-200 dark:border-white/10 mb-4 z-10 shadow-sm">
              {opt.icon}
            </div>
            <div className="z-10 mt-auto">
              <h3 className={`font-semibold mb-1 text-black dark:text-white ${opt.large ? "text-xl" : "text-lg"}`}>{opt.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed">{opt.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
