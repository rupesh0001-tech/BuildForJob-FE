"use client";

import React, { useState } from "react";
import { 
  User, Briefcase, FileText, GraduationCap, 
  Code2, Lightbulb, Save, Trash2, Plus, 
  MapPin, Mail, Phone, Globe, Linkedin,
  ChevronRight, Sparkles, Image as ImageIcon,
  Github, Twitter, Info
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { 
  setPersonalInfo, setProfessionalSummary, setExperience, 
  setEducation, setProject, setSkill 
} from "@/lib/store/features/resume-slice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button1 } from "@/components/general/buttons/button1";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const resume = useSelector((state: RootState) => state.resume);
  const [activeTab, setActiveTab] = useState("personal");
  const [newSkill, setNewSkill] = useState("");

  const tabs = [
    { id: "personal", label: "Identity", icon: User },
    { id: "summary", label: "Bio", icon: FileText },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: Code2 },
    { id: "skills", label: "Expertise", icon: Lightbulb },
  ];

  const handleSave = () => {
    toast.success("Profile changes synchronized.");
  };

  const renderPersonalInfo = () => {
    const data = resume.personalInfoData;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPersonalInfo({ ...data, [e.target.name]: e.target.value }));
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="flex items-start gap-8 pb-8 border-b border-gray-100 dark:border-white/5">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              {data.image ? (
                <img src={data.image} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <ImageIcon size={24} className="text-gray-400" />
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-xs hover:scale-110 transition-transform">
               <Plus size={14} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <div className="space-y-1 py-1">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Identity</h3>
             <p className="text-sm text-gray-500 max-w-sm">
                This information will be used as the default for all your generated resumes and portfolios.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <SleekInput label="Full Name" name="full_name" value={data.full_name} onChange={handleChange} icon={<User size={16} />} placeholder="Jane Doe" />
          <SleekInput label="Work Title" name="profession" value={data.profession} onChange={handleChange} icon={<Briefcase size={16} />} placeholder="Senior Architect" />
          <SleekInput label="Email" name="email" value={data.email} onChange={handleChange} icon={<Mail size={16} />} placeholder="jane@example.com" />
          <SleekInput label="Phone" name="phone" value={data.phone} onChange={handleChange} icon={<Phone size={16} />} placeholder="+1 (555) 000-0000" />
          <SleekInput label="Base Location" name="location" value={data.location} onChange={handleChange} icon={<MapPin size={16} />} placeholder="London, UK" />
          <SleekInput label="Website / Portfolio" name="website" value={data.website} onChange={handleChange} icon={<Globe size={16} />} placeholder="https://janedoe.com" />
        </div>

        <div className="pt-4 space-y-4">
           <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles size={14} className="text-purple-500" /> Social Dimensions
           </h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SleekInput name="linkedin" label="LinkedIn" value={data.linkedin} onChange={handleChange} icon={<Linkedin size={14} />} placeholder="Profile Link" />
              <SleekInput label="GitHub" icon={<Github size={14} />} placeholder="Link" />
              <SleekInput label="Twitter / X" icon={<Twitter size={14} />} placeholder="Link" />
           </div>
        </div>
      </div>
    );
  };

  const renderSummary = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
         <div className="space-y-0.5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Professional Bio</h3>
            <p className="text-sm text-gray-500">A high-level summary of your career milestones.</p>
         </div>
         <button className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 rounded-xl font-bold text-xs hover:bg-purple-500/20 transition-all border border-purple-500/20">
            <Sparkles size={14} /> AI Rewriter
         </button>
      </div>
      <div className="flex-1 min-h-[400px] relative">
         <textarea
            value={resume.professionalSummaryData}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => dispatch(setProfessionalSummary(e.target.value))}
            placeholder="Write your story..."
            className="w-full h-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 text-gray-900 dark:text-white outline-none focus:border-purple-500/50 transition-all text-sm leading-relaxed resize-none"
         />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
       <div className="flex items-center justify-between">
          <div className="space-y-0.5">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Career History</h3>
             <p className="text-sm text-gray-500">Manage your past and current professional roles.</p>
          </div>
          <button 
            onClick={() => dispatch(setExperience([{ company: "", position: "", startDate: "", endDate: "", description: "", is_current: false }, ...resume.experienceData]))}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
          >
            <Plus size={16} /> New Entry
          </button>
       </div>

       <div className="space-y-6">
          {resume.experienceData.map((exp, idx) => (
             <div key={idx} className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-md transition-all">
                <button 
                  onClick={() => dispatch(setExperience(resume.experienceData.filter((_, i) => i !== idx)))}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <SleekInput label="Company" value={exp.company} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     const newData = [...resume.experienceData];
                     newData[idx] = { ...exp, company: e.target.value };
                     dispatch(setExperience(newData));
                   }} />
                   <SleekInput label="Position" value={exp.position} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     const newData = [...resume.experienceData];
                     newData[idx] = { ...exp, position: e.target.value };
                     dispatch(setExperience(newData));
                   }} />
                   <SleekInput label="From" type="month" value={exp.startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     const newData = [...resume.experienceData];
                     newData[idx] = { ...exp, startDate: e.target.value };
                     dispatch(setExperience(newData));
                   }} />
                   <div className="flex items-end gap-3">
                      <div className="flex-1">
                         <SleekInput label="To" type="month" value={exp.endDate} disabled={exp.is_current} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                           const newData = [...resume.experienceData];
                           newData[idx] = { ...exp, endDate: e.target.value };
                           dispatch(setExperience(newData));
                         }} />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl mb-0.5">
                         <input 
                           type="checkbox" 
                           id={`current-${idx}`}
                           checked={exp.is_current} 
                           onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const newData = [...resume.experienceData];
                              newData[idx] = { ...exp, is_current: e.target.checked };
                              dispatch(setExperience(newData));
                           }}
                           className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                         />
                         <label htmlFor={`current-${idx}`} className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Current</label>
                      </div>
                   </div>
                   <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Responsibilities</label>
                      <textarea 
                         value={exp.description}
                         onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                           const newData = [...resume.experienceData];
                           newData[idx] = { ...exp, description: e.target.value };
                           dispatch(setExperience(newData));
                         }}
                         placeholder="Describe your impact..."
                         className="w-full min-h-[100px] bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm outline-none focus:border-purple-500/50 transition-all resize-none"
                      />
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
       <div className="flex items-center justify-between">
          <div className="space-y-0.5">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Academic Journey</h3>
             <p className="text-sm text-gray-500">Your educational background and certifications.</p>
          </div>
          <button 
           onClick={() => dispatch(setEducation([{ institution: "", degree: "", field: "", graduation_date: "", gpa: "", graduationType: "cgpa" }, ...resume.educationData]))}
           className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
          >
            Add Institution
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {resume.educationData.map((edu, idx) => (
             <div key={idx} className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-xs transition-all">
                <button onClick={() => dispatch(setEducation(resume.educationData.filter((_, i) => i !== idx)))} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                <div className="space-y-4">
                   <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 dark:border-white/10">
                      <GraduationCap size={18} />
                   </div>
                   <div className="space-y-4">
                      <SleekInput label="Institute" value={edu.institution} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newData = [...resume.educationData];
                        newData[idx] = { ...edu, institution: e.target.value };
                        dispatch(setEducation(newData));
                      }} />
                      <SleekInput label="Field of Study" value={edu.field} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newData = [...resume.educationData];
                        newData[idx] = { ...edu, field: e.target.value };
                        dispatch(setEducation(newData));
                      }} />
                      <div className="grid grid-cols-2 gap-4">
                         <SleekInput label="Grad Date" type="month" value={edu.graduation_date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                           const newData = [...resume.educationData];
                           newData[idx] = { ...edu, graduation_date: e.target.value };
                           dispatch(setEducation(newData));
                         }} />
                         <SleekInput label="Grade / GPA" value={edu.gpa} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                           const newData = [...resume.educationData];
                           newData[idx] = { ...edu, gpa: e.target.value };
                           dispatch(setEducation(newData));
                         }} />
                      </div>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
       <div className="flex items-center justify-between">
          <div className="space-y-0.5">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Project Showcase</h3>
             <p className="text-sm text-gray-500">Feature your most impactful technical builds.</p>
          </div>
          <button 
           onClick={() => dispatch(setProject([{ name: "", techStack: "", description: "" }, ...resume.projectData]))}
           className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
          >
            Add Project
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resume.projectData.map((p, idx) => (
             <div key={idx} className="group relative bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-xs transition-all flex flex-col">
                <button onClick={() => dispatch(setProject(resume.projectData.filter((_, i) => i !== idx)))} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                <div className="space-y-4 flex-1">
                   <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 dark:border-white/10">
                      <Code2 size={18} />
                   </div>
                   <SleekInput label="Project Name" value={p.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     const newData = [...resume.projectData];
                     newData[idx] = { ...p, name: e.target.value };
                     dispatch(setProject(newData));
                   }} placeholder="e.g. Portfolio v2" />
                   <SleekInput label="Technologies" value={p.techStack} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                     const newData = [...resume.projectData];
                     newData[idx] = { ...p, techStack: e.target.value };
                     dispatch(setProject(newData));
                   }} />
                   <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Case Study Highlights</label>
                      <textarea 
                        className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none text-sm resize-none min-h-[100px]"
                        placeholder="Metrics, features, outcomes..."
                        value={p.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const newData = [...resume.projectData];
                          newData[idx] = { ...p, description: e.target.value };
                          dispatch(setProject(newData));
                        }}
                      />
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderSkills = () => {
    const addSkill = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (newSkill.trim() && !resume.skillData.includes(newSkill.trim())) {
        dispatch(setSkill([...resume.skillData, newSkill.trim()]));
        setNewSkill("");
      }
    };

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
         <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Expertise Catalog</h3>
            <p className="text-sm text-gray-500">Your core technical competencies and soft skills.</p>
         </div>

          <div className="max-w-xl">
            <div className="flex bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-1.5 focus-within:border-purple-500/50 transition-all">
               <input 
                 type="text" 
                 value={newSkill}
                 onChange={(e) => setNewSkill(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                 className="flex-1 px-4 py-2.5 bg-transparent outline-none font-medium text-sm text-gray-900 dark:text-white"
                 placeholder="Search or enter skills..."
               />
               <button onClick={() => addSkill()} className="px-5 bg-black dark:bg-white text-white dark:text-black rounded-lg font-bold text-xs shadow-xs active:scale-95 transition-all">
                  Add
               </button>
            </div>
          </div>

         <div className="flex flex-wrap gap-2 pt-2">
            {resume.skillData.map((skill, idx) => (
              <div 
                key={idx} 
                className="group flex items-center gap-2 pl-4 pr-2.5 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-purple-500/30 transition-all"
              >
                 {skill}
                 <button onClick={() => dispatch(setSkill(resume.skillData.filter((_, i) => i !== idx)))} className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
              </div>
            ))}
         </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "personal": return renderPersonalInfo();
      case "summary": return renderSummary();
      case "experience": return renderExperience();
      case "education": return renderEducation();
      case "projects": return renderProjects();
      case "skills": return renderSkills();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-120px)] lg:h-[calc(100vh-140px)] animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Navigation Sidebar: Sleek & Matching */}
        <div className="w-full lg:w-64 shrink-0 overflow-x-auto lg:overflow-visible flex lg:flex-col gap-1 pb-2 lg:pb-0 scroll-hide">
          <div className="hidden lg:block mb-4 px-2">
             <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Settings</h2>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap min-w-fit flex-1 lg:flex-none",
                activeTab === tab.id 
                  ? "bg-purple-500/10 text-purple-600 border border-purple-500/20" 
                  : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              )}
            >
              <tab.icon size={18} className={cn("transition-colors", activeTab === tab.id ? "text-purple-600" : "text-gray-400 group-hover:text-gray-700")} />
              <span className="flex-1 text-left">{tab.label}</span>
              <ChevronRight size={14} className={cn("hidden lg:block transition-opacity", activeTab === tab.id ? "opacity-100" : "opacity-0")} />
            </button>
          ))}
          
          <div className="hidden lg:block mt-auto p-2 bg-purple-50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/10 rounded-2xl">
             <div className="flex items-center gap-2 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">
                <Info size={12} /> Sync Info
             </div>
             <p className="text-[11px] text-purple-600/70 dark:text-purple-400/60 leading-relaxed">
                Changes here affect all resume templates and your digital portfolio.
             </p>
             <Button1 onClick={handleSave} className="w-full mt-4 py-2.5 text-xs">
                Save Profile
             </Button1>
          </div>
        </div>

        {/* Unified Display Panel */}
        <div className="flex-1 bg-white/80 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-6 lg:p-10 shadow-xs flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -5 }}
               transition={{ duration: 0.2 }}
               className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile Footer Sync */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
         <Button1 onClick={handleSave} className="w-full py-4 shadow-2xl">
            Save Changes
         </Button1>
      </div>
    </div>
  );
};

// Sleek Dashboard-style Input
const SleekInput = ({ label, icon, className, ...props }: any) => (
  <div className={cn("space-y-1.5 flex-1", className)}>
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.15em] ml-1">{label}</label>
    <div className="relative group/field">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/field:text-purple-500 transition-colors pointer-events-none">
        {icon || <Info size={14} />}
      </div>
      <input
        {...props}
        className={cn(
          "w-full bg-gray-50/50 dark:bg-black/10 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-gray-900 dark:text-white font-medium text-sm outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500/40 transition-all placeholder:text-gray-300",
          props.disabled && "opacity-50 cursor-not-allowed"
        )}
      />
    </div>
  </div>
);

// Compatibility bridge
const ProfileInput = ({ label, className, ...props }: any) => (
   <SleekInput label={label} className={className} {...props} />
);

const ArrowRight = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

export default ProfilePage;
