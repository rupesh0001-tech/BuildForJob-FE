"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

const CoverLetterPreview = () => {
  const { personalInfo, date, employerInfo, salutation, body, signOff, mode, manualContent } = 
    useSelector((state: RootState) => state.coverLetter);

  return (
    <div className="cover-letter-preview-container bg-white border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl tracking-tight">
      <div className="mobile-scale-wrapper">
        <div id="cover-letter-preview" className="print:shadow-none print:border-none w-full min-h-[1123px] p-[20mm] bg-white text-gray-900 font-serif leading-relaxed">
          
          {/* Header / Personal Info */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold uppercase tracking-widest mb-2">
              {personalInfo.fullName}
            </h1>
            <div className="text-[13px] text-gray-600 flex flex-wrap justify-center gap-x-2">
              <span>{personalInfo.address}</span>
              <span>•</span>
              <span>{personalInfo.phone}</span>
              <span>•</span>
              <span>{personalInfo.email}</span>
              {personalInfo.linkedin && (
                <>
                  <span>•</span>
                  <span>{personalInfo.linkedin}</span>
                </>
              )}
              {personalInfo.github && (
                <>
                  <span>•</span>
                  <span>{personalInfo.github}</span>
                </>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="mb-8 text-[15px]">
            {date}
          </div>

          {/* Employer Info */}
          <div className="mb-8 text-[15px] space-y-1">
            <p className="font-bold">{employerInfo.managerName}</p>
            <p>{employerInfo.teamName}</p>
            <p>{employerInfo.companyName}</p>
          </div>

          {/* Salutation */}
          <div className="mb-6 text-[15px]">
            {salutation}
          </div>

          {/* Body */}
          <div className="text-[15px] text-justify">
            {mode === "structured" ? (
              <div className="space-y-4">
                <p>{body.intro}</p>
                <p>{body.body1}</p>
                {body.body2 && <p>{body.body2}</p>}
                {body.body3 && <p>{body.body3}</p>}
                <p>{body.conclusion}</p>
              </div>
            ) : (
              <div className="whitespace-pre-line leading-relaxed">
                {manualContent}
              </div>
            )}
          </div>

          {/* Closing */}
          <div className="mt-8 text-[15px]">
            <p className="mb-8">{signOff}</p>
            <p className="font-bold">{personalInfo.fullName}</p>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @page {
          size: A4;
          margin: 0;
        }

        .cover-letter-preview-container {
          width: 210mm;
          min-height: 297mm;
          padding: 0;
          margin: 0 auto;
          background: white;
        }

        #cover-letter-preview {
          width: 210mm;
          min-height: 297mm;
          overflow: hidden;
          margin: 0;
        }

        @media screen and (max-width: 1200px) {
          .cover-letter-preview-container {
            width: 100% !important;
            min-height: auto !important;
          }
          .mobile-scale-wrapper {
            transform: scale(0.65);
            transform-origin: top center;
            width: 210mm;
            margin: 0 auto;
          }
        }

        @media screen and (max-width: 768px) {
          .mobile-scale-wrapper {
            transform: scale(0.45);
          }
        }

        @media print {
          html, body {
            margin: 0;
            padding: 0;
            width: 210mm;
            height: 297mm;
          }
          body * {
            visibility: hidden;
          }
          #cover-letter-preview,
          #cover-letter-preview * {
            visibility: visible;
          }
          #cover-letter-preview {
            position: absolute;
            top: 0;
            left: 0;
            width: 210mm !important;
            height: 297mm !important;
            padding: 20mm !important;
          }
        }
      `}} />
    </div>
  );
};

export default CoverLetterPreview;
