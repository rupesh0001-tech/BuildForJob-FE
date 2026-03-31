"use client";

import React from "react";
import CoverLetterForm from "@/components/cover-letter/CoverLetterForm";
import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";
import CoverLetterThemeSelector from "@/components/cover-letter/CoverLetterThemeSelector";
import { Download, ChevronLeft } from "lucide-react";
import Link from "next/link";

const CoverLetterPage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-8xl mx-auto space-y-6 pb-20 p-4 md:p-6">
      {/* Top Header */}
      <div className="flex justify-between items-center gap-4">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:scale-[1.05] transition-transform shadow-xl"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center h-full w-full">
        {/* Form Section */}
        <div className="w-full lg:w-[420px] shrink-0 h-full overflow-y-auto custom-scrollbar">
          <CoverLetterForm />
        </div>

        {/* Preview Section */}
        <div className="w-fit bg-gray-50/50 dark:bg-black/20 rounded-3xl border border-gray-200 dark:border-white/10 h-full p-0 overflow-hidden flex flex-col">
          <div className="h-full overflow-y-auto custom-scrollbar p-2 md:p-4 shadow-2xl">
            <CoverLetterPreview />
          </div>
        </div>
      </div>

    </div>
  );
};

export default CoverLetterPage;
