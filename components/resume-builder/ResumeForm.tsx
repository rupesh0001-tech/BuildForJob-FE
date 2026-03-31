"use client";

import React, { useState } from "react";
import PersonalInfo from "./forms/PersonalInfo";
import ProfessionalSummary from "./forms/ProfessionalSummary";
import Experience from "./forms/Experience";
import Education from "./forms/Education";
import Project from "./forms/Project";
import Skills from "./forms/Skills";
import BackFrontBtns from "./forms/BackFrontBtns";
import ThemeSelector from "./forms/ThemeSelector";
import AccentColorSelector from "./forms/AccentColorSelector";

const ResumeForm = () => {
  const [formTab, setFormTab] = useState(1);

  const tabs = [
    {
      id: 1,
      title: "Personal Info",
      component: <PersonalInfo setFormTab={setFormTab} />,
    },
    {
      id: 2,
      title: "Professional Summary",
      component: <ProfessionalSummary setFormTab={setFormTab} />,
    },
    {
      id: 3,
      title: "Experience",
      component: <Experience setFormTab={setFormTab} />,
    },
    {
      id: 4,
      title: "Education",
      component: <Education setFormTab={setFormTab} />,
    },
    {
      id: 5,
      title: "Project",
      component: <Project setFormTab={setFormTab} />,
    },
    {
      id: 6,
      title: "Skills",
      component: <Skills />,
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto lg:mx-0 p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-xl">
      <div className="flex justify-between items-center w-full mb-6 gap-4 flex-wrap">
        <BackFrontBtns setFormTab={setFormTab} formTab={formTab} />
        <div className="flex gap-3">
          <ThemeSelector />
          <AccentColorSelector />
        </div>
      </div>

      <div className="relative pt-6 border-t border-gray-100 dark:border-white/5">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${formTab === tab.id ? "block animate-in fade-in slide-in-from-bottom-2 duration-400" : "hidden"}`}
          >
            <div className="flex flex-col mb-6">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                 {tab.title.charAt(0).toLowerCase() + tab.title.slice(1)}
               </h2>
               <p className="text-sm text-gray-500 mt-1">Enter your details for this section</p>
            </div>
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeForm;
