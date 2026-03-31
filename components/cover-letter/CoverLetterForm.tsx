"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { 
  updatePersonalInfo, 
  updateDate, 
  updateEmployerInfo, 
  updateSalutation, 
  updateBody, 
  updateSignOff,
  updateMode,
  updateManualContent,
} from "@/lib/store/features/cover-letter-slice";
import FormInput from "../resume-builder/FormInput";
import FormTextArea from "../resume-builder/FormTextArea";
import { User, MapPin, Phone, Mail, Link, Calendar, Briefcase, Building, PenTool, Layout, Github, Type, FileText } from "lucide-react";

const CoverLetterForm = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.coverLetter);

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updatePersonalInfo({ [e.target.name]: e.target.value }));
  };

  const handleEmployerInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateEmployerInfo({ [e.target.name]: e.target.value }));
  };

  const handleBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(updateBody({ [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Personal Info */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-purple-600">
          <User size={20} /> Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput name="fullName" label="Full Name" value={state.personalInfo.fullName} onChange={handlePersonalInfo} icon={<User size={16}/>} />
          <FormInput name="address" label="Address" value={state.personalInfo.address} onChange={handlePersonalInfo} icon={<MapPin size={16}/>} />
          <FormInput name="phone" label="Phone" value={state.personalInfo.phone} onChange={handlePersonalInfo} icon={<Phone size={16}/>} />
          <FormInput name="email" label="Email" value={state.personalInfo.email} onChange={handlePersonalInfo} icon={<Mail size={16}/>} />
          <FormInput name="linkedin" label="LinkedIn URL" value={state.personalInfo.linkedin} onChange={handlePersonalInfo} icon={<Link size={16}/>} />
          <FormInput name="github" label="GitHub URL" value={state.personalInfo.github} onChange={handlePersonalInfo} icon={<Github size={16}/>} />
          <FormInput 
            name="date" 
            label="Date" 
            value={state.date} 
            onChange={(e) => dispatch(updateDate(e.target.value))} 
            icon={<Calendar size={16}/>} 
          />
        </div>
      </section>

      {/* Employer Info */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-purple-600">
          <Briefcase size={20} /> Employer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput name="managerName" label="Hiring Manager Name" value={state.employerInfo.managerName} onChange={handleEmployerInfo} icon={<User size={16}/>} />
          <FormInput name="teamName" label="Team/Department Name" value={state.employerInfo.teamName} onChange={handleEmployerInfo} icon={<Briefcase size={16}/>} />
          <FormInput name="companyName" label="Company Name" value={state.employerInfo.companyName} onChange={handleEmployerInfo} icon={<Building size={16}/>} />
          <FormInput 
            name="salutation" 
            label="Salutation" 
            value={state.salutation} 
            onChange={(e) => dispatch(updateSalutation(e.target.value))} 
            icon={<PenTool size={16}/>} 
          />
        </div>
      </section>

      {/* Letter Body */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold flex items-center gap-2 text-purple-600">
            <Layout size={20} /> Letter Content
          </h3>
          
          <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl self-start">
            <button
              onClick={() => dispatch(updateMode("structured"))}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                state.mode === "structured" 
                  ? "bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Type size={14} /> Structured
            </button>
            <button
              onClick={() => dispatch(updateMode("manual"))}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                state.mode === "manual" 
                  ? "bg-white dark:bg-purple-600 text-purple-600 dark:text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <FileText size={14} /> Write Manually
            </button>
          </div>
        </div>

        {state.mode === "structured" ? (
          <div className="space-y-4">
            <FormTextArea 
              name="intro" 
              label="Paragraph 1: The Hook & Role Fit" 
              value={state.body.intro} 
              onChange={handleBody} 
              placeholder="Clearly state position and why you want it. Start with a strong accomplishment..."
            />
            <FormTextArea 
              name="body1" 
              label="Paragraph 2: Technical Impact (Proof)" 
              value={state.body.body1} 
              onChange={handleBody} 
              placeholder="Highlight 1-2 major, quantifiable achievements. Focus on impact (e.g. reduced latency)."
            />
            <FormTextArea 
              name="body2" 
              label="Paragraph 3: Tech Stack & Collaboration" 
              value={state.body.body2} 
              onChange={handleBody} 
              placeholder="Languages, frameworks directly aligned. Mention ability to work with others (Agile)."
            />
            <FormTextArea 
              name="body3" 
              label="Paragraph 4: Why This Company?" 
              value={state.body.body3} 
              onChange={handleBody} 
              placeholder="Research-based. Mention a specific product or technical initiative that excites you."
            />
            <FormTextArea 
              name="conclusion" 
              label="Paragraph 5: Closing & CTA" 
              value={state.body.conclusion} 
              onChange={handleBody} 
              placeholder="Reiterate enthusiasm and desire to discuss in an interview."
            />
          </div>
        ) : (
          <div className="space-y-4">
            <FormTextArea 
              name="manualContent" 
              label="Whole Letter Body" 
              value={state.manualContent} 
              onChange={(e) => dispatch(updateManualContent(e.target.value))} 
              placeholder="Write your entire cover letter body here. You have full freedom to format paragraphs as you wish..."
              rows={15}
            />
          </div>
        )}

        <FormInput 
          name="signOff" 
          label="Sign-Off" 
          value={state.signOff} 
          onChange={(e) => dispatch(updateSignOff(e.target.value))} 
          icon={<PenTool size={16}/>} 
        />
      </section>

    </div>
  );
};

export default CoverLetterForm;
