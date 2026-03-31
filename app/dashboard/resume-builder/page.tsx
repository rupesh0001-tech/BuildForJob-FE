"use client";

import React from "react";
import ResumeForm from "@/components/resume-builder/ResumeForm";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export default function ResumeBuilderPage() {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex justify-between items-center gap-4">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Dashboard
        </Link>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:scale-[1.05] transition-transform shadow-xl"
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Form Section */}
        <div className="w-full xl:w-[450px] shrink-0 sticky top-0">
          <ResumeForm />
        </div>

        {/* Preview Section */}
        <div className="flex-1 w-full bg-gray-100/50 dark:bg-white/5 rounded-3xl p-8 border border-gray-200 dark:border-white/10 overflow-x-auto min-h-[1200px]">
          <div className="mx-auto flex justify-center">
             <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
