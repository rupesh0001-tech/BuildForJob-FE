"use client";

import React from "react";
import CoverLetterForm from "@/components/cover-letter/CoverLetterForm";
import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";
import { Download, ChevronLeft } from "lucide-react";
import Link from "next/link";

const CoverLetterPage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard"
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-500"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Cover Letter Builder</h1>
            <p className="text-sm text-gray-500">Draft a professional application letter</p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all active:scale-95"
        >
          <Download size={18} />
          <span>Download PDF</span>
        </button>
      </header>

      {/* Split Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 h-[calc(100vh-73px)]">
        
        {/* Form Container */}
        <div className="h-full overflow-y-auto p-6 md:p-10 custom-scrollbar bg-white dark:bg-zinc-900/40">
          <div className="max-w-2xl mx-auto">
            <CoverLetterForm />
          </div>
        </div>

        {/* Preview Container */}
        <div className="h-full overflow-y-auto p-6 md:p-10 bg-gray-100 dark:bg-zinc-950 hidden xl:flex justify-center border-l border-gray-200 dark:border-white/10 custom-scrollbar">
          <div className="max-w-[210mm]">
            <CoverLetterPreview />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.4);
        }

        @media print {
          header, aside, .xl\:grid-cols-2 > div:first-child {
            display: none !important;
          }
          .xl\:grid-cols-2 {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .custom-scrollbar {
            overflow: visible !important;
          }
        }
      `}} />
    </div>
  );
};

export default CoverLetterPage;
