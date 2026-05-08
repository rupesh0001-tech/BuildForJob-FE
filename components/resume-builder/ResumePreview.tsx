"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import ImpactTemplate from "./templates/ImpactTemplate";
import Resume, { ResumeData } from "@/components/resume-templates/resume-component";
import { AccentColor } from "@/lib/resume-matcher/template-settings";

const ResumePreview = () => {
  const {
    personalInfoData,
    professionalSummaryData,
    experienceData,
    educationData,
    projectData,
    skillData,
    template,
    accentColor,
    sectionVisibility,
  } = useSelector((state: RootState) => state.resume);

  const data = {
    personal_info: personalInfoData,
    professional_summary: professionalSummaryData,
    experience: experienceData,
    education: educationData,
    project: projectData,
    skills: skillData,
    sectionVisibility: sectionVisibility,
  };

  const mapAccentColor = (hex: string): AccentColor => {
    const mapping: Record<string, AccentColor> = {
      "#3b82f6": "blue",
      "#22c55e": "green",
      "#ef4444": "red",
      "#f59e0b": "orange",
      "#f97316": "orange",
    };
    return mapping[hex.toLowerCase()] || "blue";
  };

  // Map existing Redux state to the new ResumeData structure for premium templates
  const premiumResumeData: ResumeData = {
    personalInfo: {
      name: personalInfoData.full_name,
      title: personalInfoData.profession,
      email: personalInfoData.email,
      phone: personalInfoData.phone,
      location: personalInfoData.location,
      website: personalInfoData.website,
      linkedin: personalInfoData.linkedin,
    },
    summary: professionalSummaryData,
    workExperience: experienceData.map((exp, index) => ({
      id: index,
      title: exp.position,
      company: exp.company,
      years: `${exp.startDate} - ${exp.is_current ? 'Present' : exp.endDate}`,
      description: exp.description ? exp.description.split('\n').filter(line => line.trim() !== '') : [],
    })),
    education: educationData.map((edu, index) => ({
      id: index,
      institution: edu.institution,
      degree: edu.degree,
      years: edu.graduation_date,
      description: edu.field,
    })),
    personalProjects: projectData.map((p, index) => ({
      id: index,
      name: p.name,
      role: p.techStack,
      description: p.description ? p.description.split('\n').filter(line => line.trim() !== '') : [],
    })),
    additional: {
      technicalSkills: skillData,
    },
    // Generate section metadata based on visibility
    sectionMeta: [
      { id: 'summary', key: 'summary', displayName: 'Summary', sectionType: 'text', isDefault: true, isVisible: sectionVisibility.summary, order: 0 },
      { id: 'experience', key: 'workExperience', displayName: 'Experience', sectionType: 'itemList', isDefault: true, isVisible: sectionVisibility.experience, order: 1 },
      { id: 'education', key: 'education', displayName: 'Education', sectionType: 'itemList', isDefault: true, isVisible: sectionVisibility.education, order: 2 },
      { id: 'projects', key: 'personalProjects', displayName: 'Projects', sectionType: 'itemList', isDefault: true, isVisible: sectionVisibility.projects, order: 3 },
      { id: 'skills', key: 'additional', displayName: 'Skills', sectionType: 'itemList', isDefault: true, isVisible: sectionVisibility.skills, order: 4 },
    ]
  };

  const renderTemplate = () => {
    switch (template) {
      case "swiss-single":
        return <Resume resumeData={premiumResumeData} template="swiss-single" />;
      case "swiss-two-column":
        return <Resume resumeData={premiumResumeData} template="swiss-two-column" />;
      case "modern-premium":
        return <Resume resumeData={premiumResumeData} template="modern" settings={{ accentColor: mapAccentColor(accentColor) }} />;
      case "modern-two-column-premium":
        return <Resume resumeData={premiumResumeData} template="modern-two-column" settings={{ accentColor: mapAccentColor(accentColor) }} />;
      case "modern":
        return <ModernTemplate data={data as any} accentColor={accentColor} />;
      case "minimal":
        return <MinimalTemplate data={data as any} accentColor={accentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={data as any} accentColor={accentColor} />;
      case "professional":
        return <ProfessionalTemplate data={data as any} accentColor={accentColor} />;
      case "impact":
        return <ImpactTemplate data={data as any} accentColor={accentColor} />;
      default:
        return <ClassicTemplate data={data as any} accentColor={accentColor} />;
    }
  };

  return (
    <div className="resume-preview-container bg-white border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="mobile-scale-wrapper">
        <div id="resume-preview" className="print:shadow-none print:border-none w-full min-h-[1123px]">
          {renderTemplate()}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* --- A4 PAGE SETTINGS --- */
        @page {
          size: A4;
          margin: 0;
        }

        /* A4 dimensions for preview (desktop) */
        .resume-preview-container {
          width: 210mm;
          min-height: 297mm;
          padding: 0;
          margin: 0 auto;
          background: white;
        }

        #resume-preview {
          width: 210mm;
          min-height: 297mm;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        @media screen and (max-width: 1200px) {
          .resume-preview-container {
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
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
          #resume-preview,
          #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            top: 0;
            left: 0;
            width: 210mm !important;
            height: 297mm !important;
          }
        }
      `}} />
    </div>
  );
};

export default ResumePreview;
