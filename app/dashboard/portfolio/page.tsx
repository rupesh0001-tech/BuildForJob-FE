"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";
import api from "@/apis/axiosInstance";
import { 
  TEMPLATES, 
  PortfolioData, 
  PortfolioSettings, 
  TemplateDefinition,
  Project,
  ExperienceItem,
  EducationItem,
  SkillGroup,
  CodingProfile,
  CustomSection
} from "@/lib/portfolio-defaults";
import TemplateRenderer from "@/components/portfolio/TemplateRenderer";
import { 
  Globe, 
  Sparkles, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Edit3, 
  Settings, 
  Plus, 
  Trash2, 
  Upload, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Layers, 
  FileText, 
  Info,
  ChevronRight,
  Code,
  Github,
  Linkedin,
  Twitter,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  Save,
  Play,
  Loader2,
  X,
  FileUp,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function PortfolioPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // States
  const [viewState, setViewState] = useState<"landing" | "builder">("landing");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<"personal" | "sections" | "design">("personal");
  const [previewMode, setPreviewMode] = useState<"editor" | "preview">("editor");
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Custom section state
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionLayout, setNewSectionLayout] = useState<"text" | "grid" | "timeline">("grid");

  // Auto-fill Modal State
  const [showAutofillModal, setShowAutofillModal] = useState(false);

  // Upload progress states
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingProjectImages, setUploadingProjectImages] = useState<{ [key: string]: boolean }>({});

  // Dynamic portfolio data and settings
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [portfolioSettings, setPortfolioSettings] = useState<PortfolioSettings | null>(null);

  // Video refs for play on hover
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    // Fetch profile details to facilitate autofill matching
    dispatch(fetchProfile());
  }, [dispatch]);

  // Validation check: Personal Info needs Name, Title, and Email to unlock Preview
  const isPersonalInfoFilled = (data: PortfolioData | null) => {
    if (!data) return false;
    return (
      data.personalInfo.fullName.trim() !== "" &&
      data.personalInfo.jobTitle.trim() !== "" &&
      data.personalInfo.email.trim() !== ""
    );
  };

  const hasUnlockedPreview = isPersonalInfoFilled(portfolioData);

  // ImageKit file uploader utility
  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post<{ success: boolean; url: string }>("/user/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    
    if (response.data.success && response.data.url) {
      return response.data.url;
    }
    throw new Error("Upload failed");
  };

  // Upload Resume handler
  const onResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !portfolioData) return;
    
    try {
      setUploadingResume(true);
      const url = await handleFileUpload(file);
      
      const copy = { ...portfolioData };
      copy.personalInfo.resumeUrl = url;
      setPortfolioData(copy);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload resume. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  };

  // Upload Avatar handler
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !portfolioData) return;
    
    try {
      setUploadingAvatar(true);
      const url = await handleFileUpload(file);
      
      const copy = { ...portfolioData };
      copy.personalInfo.avatarUrl = url;
      setPortfolioData(copy);
      toast.success("Avatar uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar image.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Upload Project Image handler
  const onProjectImageChange = async (e: React.ChangeEvent<HTMLInputElement>, projectId: string, idx: number) => {
    const file = e.target.files?.[0];
    if (!file || !portfolioData) return;
    
    try {
      setUploadingProjectImages(prev => ({ ...prev, [projectId]: true }));
      const url = await handleFileUpload(file);
      
      const copy = { ...portfolioData };
      copy.projects[idx].imageUrl = url;
      setPortfolioData(copy);
      toast.success("Project image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload project image.");
    } finally {
      setUploadingProjectImages(prev => ({ ...prev, [projectId]: false }));
    }
  };

  // Handle template selection
  const handleSelectTemplate = (template: TemplateDefinition) => {
    setSelectedTemplate(template);
    setPortfolioData(JSON.parse(JSON.stringify(template.defaultData)));
    setPortfolioSettings(JSON.parse(JSON.stringify(template.defaultSettings)));
    setViewState("builder");
    setPreviewMode("editor");
  };

  // Auto fill confirmation handler
  const confirmAutofill = () => {
    if (!user) {
      toast.error("Please login and sync your profile first!");
      return;
    }

    if (!portfolioData) return;

    // Create a copy of current data
    const updatedData = JSON.parse(JSON.stringify(portfolioData));

    // Map profile values
    updatedData.personalInfo.fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || updatedData.personalInfo.fullName;
    updatedData.personalInfo.jobTitle = user.jobTitle || updatedData.personalInfo.jobTitle;
    updatedData.personalInfo.bio = user.bio || updatedData.personalInfo.bio;
    updatedData.personalInfo.tagline = user.bio ? user.bio.split(".")[0] + "." : updatedData.personalInfo.tagline;
    updatedData.personalInfo.email = user.email || updatedData.personalInfo.email;
    updatedData.personalInfo.phone = user.phone || updatedData.personalInfo.phone;
    updatedData.personalInfo.location = user.location || updatedData.personalInfo.location;
    updatedData.personalInfo.avatarUrl = user.avatarUrl || updatedData.personalInfo.avatarUrl;
    
    if (user.socialLinks) {
      updatedData.personalInfo.socialLinks = {
        github: user.socialLinks.github || updatedData.personalInfo.socialLinks.github,
        linkedin: user.socialLinks.linkedin || updatedData.personalInfo.socialLinks.linkedin,
        twitter: user.socialLinks.twitter || updatedData.personalInfo.socialLinks.twitter,
        portfolioUrl: user.socialLinks.portfolio || user.socialLinks.website || updatedData.personalInfo.socialLinks.portfolioUrl
      };
    }

    // Map skills
    if (user.skills && user.skills.length > 0) {
      const skillsList = user.skills.map((s: any) => s.name);
      const existingGeneral = updatedData.techStack.find((cat: any) => cat.category === "General" || cat.category === "Frontend");
      if (existingGeneral) {
        existingGeneral.items = Array.from(new Set([...existingGeneral.items, ...skillsList]));
      } else {
        updatedData.techStack.push({ category: "General Skills", items: skillsList });
      }
    }

    // Map projects
    if (user.projects && user.projects.length > 0) {
      updatedData.projects = user.projects.map((p: any, idx: number) => ({
        id: p.id || `sync-p-${idx}`,
        name: p.name || "Untitled Project",
        description: p.description || "No description provided.",
        techStack: p.techStack ? p.techStack.split(",").map((s: string) => s.trim()) : ["React", "TypeScript"],
        features: ["Fully integrated", "Cloud deployed", "Optimized metrics"],
        liveUrl: "#",
        githubUrl: "#",
        imageUrl: idx % 2 === 0 
          ? "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&auto=format&fit=crop&q=60"
          : "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop&q=60"
      }));
    }

    // Map experience
    if (user.experience && user.experience.length > 0) {
      updatedData.experience = user.experience.map((exp: any, idx: number) => ({
        id: exp.id || `sync-exp-${idx}`,
        company: exp.company || "Company",
        role: exp.position || "Developer",
        duration: `${exp.startDate || "2024"} – ${exp.isCurrent ? "Present" : exp.endDate || "2025"}`,
        responsibilities: exp.description ? exp.description.split("\n").filter((s: string) => s.trim() !== "") : ["Contributed to software engineering cycles"],
        technologies: exp.technologies || ["JavaScript", "React"]
      }));
    }

    // Map education
    if (user.education && user.education.length > 0) {
      updatedData.education = user.education.map((edu: any, idx: number) => ({
        id: edu.id || `sync-edu-${idx}`,
        degree: edu.degree || "Degree",
        field: edu.field || "Field of Study",
        institution: edu.institution || "University",
        duration: edu.graduationDate || "2026",
        gpa: edu.gpa ? `${edu.gpa} ${edu.graduationType || "GPA"}` : undefined
      }));
    }

    setPortfolioData(updatedData);
    setShowAutofillModal(false);
    toast.success("Synchronized data from your profile!");
  };

  // Accent Presets
  const accentPresets = [
    { name: "Brand Blue", value: "#001BB7" },
    { name: "Sage Green", value: "#10B981" },
    { name: "Neon Purple", value: "#A855F7" },
    { name: "Crimson Rose", value: "#F43F5E" },
    { name: "Amber Orange", value: "#F59E0B" },
    { name: "Cyan Teal", value: "#06B6D4" }
  ];

  const fontPresets = ["Inter", "Space Grotesk", "Outfit", "Fira Code"];

  const handleVideoHover = (id: string, isEnter: boolean) => {
    const video = videoRefs.current[id];
    if (!video) return;
    if (isEnter) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08080a] text-slate-800 dark:text-[#E2E8F0] p-6">
      
      {/* 1. LANDING VIEW */}
      {viewState === "landing" && (
        <div className="max-w-6xl mx-auto space-y-12 py-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-[#001BB7] dark:text-white">
              Create a Portfolio
            </h1>
            <p className="text-slate-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
              Recruiters spend less than a minute evaluating portfolios. Select a modern template to showcase your developer skills visually and beautifully.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map((template) => (
              <div 
                key={template.id}
                className="group relative bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#001BB7]/20 transition-all flex flex-col h-full cursor-pointer"
                onMouseEnter={() => handleVideoHover(template.id, true)}
                onMouseLeave={() => handleVideoHover(template.id, false)}
                onClick={() => handleSelectTemplate(template)}
              >
                {/* Visual Preview on Hover */}
                <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-black/5 dark:border-white/5">
                  <img 
                    src={template.thumbnailUrl} 
                    alt={template.name}
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0 absolute inset-0 z-10"
                  />
                  <video 
                    ref={(el) => {
                      videoRefs.current[template.id] = el;
                    }}
                    src={template.videoUrl}
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                    <span className="px-4 py-2 bg-[#001BB7] text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow-lg">
                      <Play size={12} className="fill-white" /> Select Template
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-white group-hover:text-[#001BB7] transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 line-clamp-3">
                      {template.description}
                    </p>
                  </div>
                  
                  <button className="w-full h-11 bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl text-xs font-bold text-slate-700 dark:text-gray-300 group-hover:bg-[#001BB7] group-hover:text-white group-hover:border-[#001BB7] transition-all uppercase tracking-wider">
                    Select Template
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-6 rounded-2xl max-w-2xl mx-auto flex items-center gap-6 shadow-sm">
            <div className="p-4 bg-[#001BB7]/10 rounded-2xl text-[#001BB7] shrink-0">
              <Sparkles size={32} />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg">Already sync'd with GitHub?</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                You can auto-fill details from your synced Leet# profile to compile your portfolio instantly. Select any design template above to begin.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. BUILDER WORKSPACE VIEW */}
      {viewState === "builder" && portfolioData && portfolioSettings && selectedTemplate && (
        <div className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewState("landing")}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-500 dark:text-gray-400 transition-all border border-black/5 dark:border-white/5"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="font-extrabold text-lg text-slate-800 dark:text-white">
                  Portfolio Builder
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500 dark:text-gray-400">
                    Template: <span className="font-bold text-[#001BB7] dark:text-[#001BB7]">{selectedTemplate.name}</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  
                  {/* Template switcher dropdown toggle */}
                  <select 
                    className="bg-transparent border-0 text-xs font-bold text-slate-600 dark:text-gray-300 focus:outline-none cursor-pointer hover:text-[#001BB7]"
                    value={selectedTemplate.id}
                    onChange={(e) => {
                      const found = TEMPLATES.find(t => t.id === e.target.value);
                      if (found) {
                        setSelectedTemplate(found);
                        setPortfolioSettings(JSON.parse(JSON.stringify(found.defaultSettings)));
                        toast.success(`Switched active design to: ${found.name}`);
                      }
                    }}
                  >
                    {TEMPLATES.map(t => (
                      <option key={t.id} value={t.id} className="dark:bg-[#12121A]">{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* View selectors */}
            <div className="flex items-center gap-4 flex-wrap w-full md:w-auto justify-end">
              {/* Autofill Button */}
              {user && (
                <button 
                  onClick={() => setShowAutofillModal(true)}
                  className="h-11 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/10 hover:brightness-105 active:scale-[0.99] transition-all"
                >
                  <Sparkles size={14} /> Auto Fill
                </button>
              )}

              {/* View toggle (Editor vs Preview - Split removed) */}
              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5 h-11 items-center">
                <button 
                  onClick={() => setPreviewMode("editor")}
                  className={`h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${previewMode === "editor" ? "bg-white dark:bg-white/10 text-[#001BB7] dark:text-white shadow" : "text-slate-500 dark:text-gray-400"}`}
                >
                  <Edit3 size={12} /> Editor
                </button>
                <button 
                  onClick={() => {
                    if (hasUnlockedPreview) setPreviewMode("preview");
                  }}
                  disabled={!hasUnlockedPreview}
                  className={`h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1 group relative ${previewMode === "preview" ? "bg-white dark:bg-white/10 text-[#001BB7] dark:text-white shadow" : "text-slate-500 dark:text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed"}`}
                  title={!hasUnlockedPreview ? "Please complete Personal Info to unlock" : ""}
                >
                  <Eye size={12} /> Preview
                  {!hasUnlockedPreview && (
                    <span className="absolute bottom-[-36px] left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1.5 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap shadow-lg">
                      Required Info Missing
                    </span>
                  )}
                </button>
              </div>

              {/* Viewport size switcher */}
              {previewMode === "preview" && (
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5 h-11 items-center">
                  <button 
                    onClick={() => setViewportSize("desktop")}
                    className={`p-2 rounded-lg transition-all ${viewportSize === "desktop" ? "bg-white dark:bg-white/10 text-[#001BB7] dark:text-white shadow" : "text-slate-400"}`}
                  >
                    <Laptop size={14} />
                  </button>
                  <button 
                    onClick={() => setViewportSize("tablet")}
                    className={`p-2 rounded-lg transition-all ${viewportSize === "tablet" ? "bg-white dark:bg-white/10 text-[#001BB7] dark:text-white shadow" : "text-slate-400"}`}
                  >
                    <Tablet size={14} />
                  </button>
                  <button 
                    onClick={() => setViewportSize("mobile")}
                    className={`p-2 rounded-lg transition-all ${viewportSize === "mobile" ? "bg-white dark:bg-white/10 text-[#001BB7] dark:text-white shadow" : "text-slate-400"}`}
                  >
                    <Smartphone size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main workspace layout */}
          <div className="w-full">
            
            {/* ── EDITOR VIEW ── */}
            {previewMode === "editor" && (
              <div className="bg-white dark:bg-[#08080a] border border-black/5 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden max-w-4xl mx-auto">
                {/* Editor Tab Headers */}
                <div className="flex border-b border-black/5 dark:border-white/5 text-sm font-bold bg-slate-50 dark:bg-[#12121A] h-12">
                  <button 
                    onClick={() => setActiveTab("personal")}
                    className={`flex-1 py-3.5 px-4 text-center border-b-2 transition-all text-xs uppercase tracking-wider ${activeTab === "personal" ? "border-[#001BB7] text-[#001BB7] dark:text-white" : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800"}`}
                  >
                    1. Personal Info
                  </button>
                  <button 
                    onClick={() => setActiveTab("sections")}
                    className={`flex-1 py-3.5 px-4 text-center border-b-2 transition-all text-xs uppercase tracking-wider ${activeTab === "sections" ? "border-[#001BB7] text-[#001BB7] dark:text-white" : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800"}`}
                  >
                    2. Content & Sections
                  </button>
                  <button 
                    onClick={() => setActiveTab("design")}
                    className={`flex-1 py-3.5 px-4 text-center border-b-2 transition-all text-xs uppercase tracking-wider ${activeTab === "design" ? "border-[#001BB7] text-[#001BB7] dark:text-white" : "border-transparent text-slate-500 dark:text-gray-400 hover:text-slate-800"}`}
                  >
                    3. Theme Design
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  
                  {/* TAB 1: PERSONAL INFO */}
                  {activeTab === "personal" && (
                    <div className="space-y-6">
                      
                      {/* Name and Job Title */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Full Name *</label>
                          <input 
                            type="text" 
                            className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-[#001BB7]/10"
                            value={portfolioData.personalInfo.fullName}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.fullName = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="Rupesh Jagtap"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Job Title *</label>
                          <input 
                            type="text" 
                            className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-[#001BB7]/10"
                            value={portfolioData.personalInfo.jobTitle}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.jobTitle = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="Full-Stack Developer"
                          />
                        </div>
                      </div>

                      {/* Tagline */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Tagline / One-Liner</label>
                        <input 
                          type="text" 
                          className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-[#001BB7]/10"
                          value={portfolioData.personalInfo.tagline}
                          onChange={(e) => {
                            const copy = { ...portfolioData };
                            copy.personalInfo.tagline = e.target.value;
                            setPortfolioData(copy);
                          }}
                          placeholder="Building scalable web applications..."
                        />
                      </div>

                      {/* Profile avatar uploader (replacing raw url text uploader) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Profile Avatar Image</label>
                        <div className="flex items-center gap-6 p-4 border border-dashed border-black/10 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-black/10">
                          {portfolioData.personalInfo.avatarUrl ? (
                            <img 
                              src={portfolioData.personalInfo.avatarUrl} 
                              alt="Avatar" 
                              className="w-16 h-16 rounded-full object-cover bg-slate-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border flex items-center justify-center">
                              <Code size={24} className="text-slate-400" />
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <label className="h-11 px-4 py-2.5 bg-[#001BB7] text-white hover:bg-[#001693] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm">
                                {uploadingAvatar ? (
                                  <>
                                    <Loader2 className="animate-spin" size={14} /> Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload size={14} /> Upload Image
                                  </>
                                )}
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="hidden" 
                                  disabled={uploadingAvatar}
                                  onChange={onAvatarChange}
                                />
                              </label>
                              
                              {portfolioData.personalInfo.avatarUrl && (
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.personalInfo.avatarUrl = "";
                                    setPortfolioData(copy);
                                  }}
                                  className="h-11 px-4 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-all"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400">PNG, JPG or SVG formats up to 5MB.</p>
                          </div>
                        </div>
                      </div>

                      {/* Resume PDF uploader (making buttons work) */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Upload Resume (PDF)</label>
                        <div className="flex items-center gap-4 p-4 border border-dashed border-black/10 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-black/10">
                          <div className="p-3 bg-white dark:bg-black/35 border rounded-xl text-[#001BB7] shrink-0 shadow-sm">
                            <FileText size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {portfolioData.personalInfo.resumeUrl && portfolioData.personalInfo.resumeUrl !== "#" ? (
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                  {portfolioData.personalInfo.resumeUrl}
                                </p>
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={portfolioData.personalInfo.resumeUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[10px] font-bold text-[#001BB7] hover:underline flex items-center gap-0.5"
                                  >
                                    View Live <ExternalLink size={10} />
                                  </a>
                                  <span className="text-slate-300">·</span>
                                  <label className="text-[10px] font-bold text-slate-500 hover:underline cursor-pointer">
                                    Replace File
                                    <input 
                                      type="file" 
                                      accept="application/pdf"
                                      className="hidden" 
                                      disabled={uploadingResume}
                                      onChange={onResumeChange}
                                    />
                                  </label>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-xs text-slate-500 dark:text-gray-400">No resume document uploaded yet.</p>
                                <label className="inline-flex h-9 px-3 items-center bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-lg text-xs font-bold transition-all cursor-pointer gap-1">
                                  {uploadingResume ? (
                                    <>
                                      <Loader2 className="animate-spin" size={12} /> Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <FileUp size={12} /> Upload Resume PDF
                                    </>
                                  )}
                                  <input 
                                    type="file" 
                                    accept="application/pdf"
                                    className="hidden" 
                                    disabled={uploadingResume}
                                    onChange={onResumeChange}
                                  />
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-black/5 dark:border-white/5 pt-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Email *</label>
                          <input 
                            type="email" 
                            className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white"
                            value={portfolioData.personalInfo.email}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.email = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="rupesh@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Phone</label>
                          <input 
                            type="text" 
                            className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white"
                            value={portfolioData.personalInfo.phone || ""}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.phone = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Location</label>
                          <input 
                            type="text" 
                            className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white"
                            value={portfolioData.personalInfo.location}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.location = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="Pune, India"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Bio Paragraphs</label>
                          <textarea 
                            rows={3}
                            className="w-full bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white resize-none"
                            value={portfolioData.personalInfo.bio}
                            onChange={(e) => {
                              const copy = { ...portfolioData };
                              copy.personalInfo.bio = e.target.value;
                              setPortfolioData(copy);
                            }}
                            placeholder="About details..."
                          />
                        </div>
                      </div>

                      {/* Social handles */}
                      <div className="border-t border-black/5 dark:border-white/5 pt-6 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Social Handles</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">GitHub Link</label>
                            <input 
                              type="text" 
                              className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white"
                              value={portfolioData.personalInfo.socialLinks.github || ""}
                              onChange={(e) => {
                                const copy = { ...portfolioData };
                                copy.personalInfo.socialLinks.github = e.target.value;
                                setPortfolioData(copy);
                              }}
                              placeholder="https://github.com/..."
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">LinkedIn Link</label>
                            <input 
                              type="text" 
                              className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white"
                              value={portfolioData.personalInfo.socialLinks.linkedin || ""}
                              onChange={(e) => {
                                const copy = { ...portfolioData };
                                copy.personalInfo.socialLinks.linkedin = e.target.value;
                                setPortfolioData(copy);
                              }}
                              placeholder="https://linkedin.com/in/..."
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Twitter/X Link</label>
                            <input 
                              type="text" 
                              className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#001BB7] text-slate-800 dark:text-white"
                              value={portfolioData.personalInfo.socialLinks.twitter || ""}
                              onChange={(e) => {
                                const copy = { ...portfolioData };
                                copy.personalInfo.socialLinks.twitter = e.target.value;
                                setPortfolioData(copy);
                              }}
                              placeholder="https://twitter.com/..."
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 2: SECTIONS */}
                  {activeTab === "sections" && (
                    <div className="space-y-6">
                      
                      {/* Projects Section */}
                      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-slate-50/50 dark:bg-black/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm">Projects list</h3>
                            <p className="text-[10px] text-slate-400">Featured items shown in projects grid.</p>
                          </div>
                          <button 
                            onClick={() => {
                              const copy = { ...portfolioData };
                              const newProj: Project = {
                                id: `proj-${Date.now()}`,
                                name: "Untitled Project",
                                description: "Enter project details...",
                                techStack: ["React", "TypeScript"],
                                features: ["Key feature checklist item"],
                                liveUrl: "#",
                                githubUrl: "#"
                              };
                              copy.projects.push(newProj);
                              setPortfolioData(copy);
                              toast.success("Added new project slot!");
                            }}
                            className="h-11 px-4 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus size={14} /> Add Project
                          </button>
                        </div>

                        <div className="space-y-4">
                          {portfolioData.projects.map((proj, idx) => (
                            <div key={proj.id} className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-4 rounded-xl space-y-4 relative group">
                              <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-white/5">
                                <div className="flex-1">
                                  <input 
                                    type="text" 
                                    className="bg-transparent border-b border-transparent focus:border-[#001BB7] focus:outline-none font-bold text-sm w-full text-slate-800 dark:text-white"
                                    value={proj.name}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.projects[idx].name = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                  />
                                </div>
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.projects = copy.projects.filter(p => p.id !== proj.id);
                                    setPortfolioData(copy);
                                    toast.success("Removed project.");
                                  }}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-xl transition-all"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              {/* Project description */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                                <textarea 
                                  rows={2}
                                  className="w-full bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl text-xs p-3 focus:outline-none focus:border-[#001BB7]"
                                  value={proj.description}
                                  onChange={(e) => {
                                    const copy = { ...portfolioData };
                                    copy.projects[idx].description = e.target.value;
                                    setPortfolioData(copy);
                                  }}
                                />
                              </div>

                              {/* Project Image Uploader (Replacing raw text URL inputs) */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Project Screenshot Image</label>
                                <div className="flex items-center gap-4 p-3 border border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 rounded-xl">
                                  {proj.imageUrl ? (
                                    <img 
                                      src={proj.imageUrl} 
                                      alt={proj.name}
                                      className="w-14 h-14 rounded-lg object-cover bg-slate-200"
                                    />
                                  ) : (
                                    <div className="w-14 h-14 bg-slate-100 dark:bg-white/5 border rounded-lg flex items-center justify-center">
                                      <ImageIcon size={18} className="text-slate-400" />
                                    </div>
                                  )}
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <label className="h-9 px-3 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5">
                                        {uploadingProjectImages[proj.id] ? (
                                          <>
                                            <Loader2 className="animate-spin" size={12} /> Uploading...
                                          </>
                                        ) : (
                                          <>
                                            <Upload size={12} /> Select Screen
                                          </>
                                        )}
                                        <input 
                                          type="file" 
                                          accept="image/*"
                                          className="hidden" 
                                          disabled={uploadingProjectImages[proj.id]}
                                          onChange={(e) => onProjectImageChange(e, proj.id, idx)}
                                        />
                                      </label>
                                      {proj.imageUrl && (
                                        <button 
                                          onClick={() => {
                                            const copy = { ...portfolioData };
                                            copy.projects[idx].imageUrl = "";
                                            setPortfolioData(copy);
                                          }}
                                          className="text-xs text-red-500 hover:underline"
                                        >
                                          Clear
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Tech Stack list inputs */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Tech Stack (comma separated)</label>
                                  <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                    value={proj.techStack.join(", ")}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.projects[idx].techStack = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
                                      setPortfolioData(copy);
                                    }}
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase">Live URL</label>
                                  <input 
                                    type="text" 
                                    className="w-full bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none"
                                    value={proj.liveUrl || ""}
                                    onChange={(e) => {
                                      const copy = { ...portfolioData };
                                      copy.projects[idx].liveUrl = e.target.value;
                                      setPortfolioData(copy);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack Category manager */}
                      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-slate-50/50 dark:bg-black/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm">Tech stacks & categorizations</h3>
                            <p className="text-[10px] text-slate-400">Add tool lists by group.</p>
                          </div>
                          <button 
                            onClick={() => {
                              const copy = { ...portfolioData };
                              copy.techStack.push({ category: "Database tools", items: ["PostgreSQL"] });
                              setPortfolioData(copy);
                              toast.success("Added category slot!");
                            }}
                            className="h-11 px-4 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus size={14} /> Add Category
                          </button>
                        </div>

                        <div className="space-y-4">
                          {portfolioData.techStack.map((cat, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-4 rounded-xl space-y-3">
                              <div className="flex justify-between items-center">
                                <input 
                                  type="text" 
                                  className="bg-transparent border-b border-transparent focus:border-[#001BB7] focus:outline-none font-bold text-xs text-slate-800 dark:text-white"
                                  value={cat.category}
                                  onChange={(e) => {
                                    const copy = { ...portfolioData };
                                    copy.techStack[idx].category = e.target.value;
                                    setPortfolioData(copy);
                                  }}
                                />
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.techStack = copy.techStack.filter((_, i) => i !== idx);
                                    setPortfolioData(copy);
                                    toast.success("Removed category.");
                                  }}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <input 
                                type="text"
                                className="w-full bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl text-xs p-2.5 focus:outline-none"
                                value={cat.items.join(", ")}
                                onChange={(e) => {
                                  const copy = { ...portfolioData };
                                  copy.techStack[idx].items = e.target.value.split(",").map(s => s.trim()).filter(s => s !== "");
                                  setPortfolioData(copy);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom Section insert block */}
                      <div className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-slate-50/50 dark:bg-black/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-extrabold text-sm">Dynamic Custom Sections</h3>
                            <p className="text-[10px] text-slate-400">Introduce custom timeline lists, grid lists or plain text blocks.</p>
                          </div>
                          <button 
                            onClick={() => setIsAddingSection(true)}
                            className="h-11 px-4 bg-[#001BB7]/10 text-[#001BB7] hover:bg-[#001BB7]/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus size={14} /> New Custom Section
                          </button>
                        </div>

                        {isAddingSection && (
                          <div className="bg-white dark:bg-[#12121A] border border-[#001BB7]/30 p-5 rounded-xl space-y-3 shadow-sm">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#001BB7]">Configure Section</h4>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500">Section Title</label>
                              <input 
                                type="text" 
                                className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs focus:outline-none"
                                value={newSectionTitle}
                                onChange={(e) => setNewSectionTitle(e.target.value)}
                                placeholder="E.g. Services, Publications"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-500">Layout Format</label>
                              <select 
                                className="w-full h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs focus:outline-none"
                                value={newSectionLayout}
                                onChange={(e) => setNewSectionLayout(e.target.value as any)}
                              >
                                <option value="grid">Grid (Cards)</option>
                                <option value="timeline">Timeline</option>
                                <option value="text">Text block list</option>
                              </select>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => {
                                  setIsAddingSection(false);
                                  setNewSectionTitle("");
                                }}
                                className="h-11 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 text-slate-500"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => {
                                  if (newSectionTitle.trim() === "") {
                                    toast.error("Please enter section name.");
                                    return;
                                  }
                                  const copy = { ...portfolioData };
                                  copy.customSections.push({
                                    id: `custom-${Date.now()}`,
                                    title: newSectionTitle,
                                    layout: newSectionLayout,
                                    items: [{ id: `c-item-${Date.now()}`, title: "Untitled Item", description: "Insert details..." }]
                                  });
                                  setPortfolioData(copy);
                                  setIsAddingSection(false);
                                  setNewSectionTitle("");
                                  toast.success(`Created custom section "${newSectionTitle}"!`);
                                }}
                                className="h-11 px-4 rounded-xl text-xs font-bold bg-[#001BB7] text-white"
                              >
                                Create Section
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          {portfolioData.customSections?.map((section, idx) => (
                            <div key={section.id} className="bg-white dark:bg-[#12121A] border border-black/5 dark:border-white/5 p-4 rounded-xl space-y-4">
                              <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-white/5">
                                <span className="text-xs font-bold text-[#001BB7] uppercase tracking-wider">{section.title} ({section.layout})</span>
                                <button 
                                  onClick={() => {
                                    const copy = { ...portfolioData };
                                    copy.customSections = copy.customSections.filter(s => s.id !== section.id);
                                    setPortfolioData(copy);
                                    toast.success("Removed section.");
                                  }}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 rounded-lg transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                {section.items.map((item, itemIdx) => (
                                  <div key={item.id} className="p-3 bg-slate-50 dark:bg-black/20 rounded-lg space-y-2 border border-black/5">
                                    <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        className="w-full bg-white dark:bg-[#12121A] border border-black/10 dark:border-white/5 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                                        value={item.title}
                                        onChange={(e) => {
                                          const copy = { ...portfolioData };
                                          copy.customSections[idx].items[itemIdx].title = e.target.value;
                                          setPortfolioData(copy);
                                        }}
                                        placeholder="Title"
                                      />
                                      <button 
                                        onClick={() => {
                                          const copy = { ...portfolioData };
                                          copy.customSections[idx].items = copy.customSections[idx].items.filter(it => it.id !== item.id);
                                          setPortfolioData(copy);
                                        }}
                                        className="text-red-500 font-bold px-2 hover:bg-red-100 dark:hover:bg-red-950/20 rounded-md"
                                      >
                                        ×
                                      </button>
                                    </div>
                                    <textarea 
                                      rows={2}
                                      className="w-full bg-white dark:bg-[#12121A] border border-black/10 dark:border-white/5 rounded-lg p-2 text-[11px] resize-none"
                                      value={item.description || ""}
                                      onChange={(e) => {
                                        const copy = { ...portfolioData };
                                        copy.customSections[idx].items[itemIdx].description = e.target.value;
                                        setPortfolioData(copy);
                                      }}
                                      placeholder="Description..."
                                    />
                                  </div>
                                ))}
                              </div>

                              <button 
                                onClick={() => {
                                  const copy = { ...portfolioData };
                                  copy.customSections[idx].items.push({
                                    id: `c-item-${Date.now()}`,
                                    title: "Untitled Item",
                                    description: "Insert details..."
                                  });
                                  setPortfolioData(copy);
                                }}
                                className="w-full text-center py-2 bg-slate-50 dark:bg-black/20 border border-black/5 hover:bg-slate-100 rounded-lg text-xs text-[#001BB7] font-bold"
                              >
                                + Add List Item
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 3: DESIGN */}
                  {activeTab === "design" && (
                    <div className="space-y-6">
                      
                      {/* Theme selection */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Palette Accent Color</label>
                        <div className="grid grid-cols-3 gap-3">
                          {accentPresets.map((preset) => (
                            <button 
                              key={preset.value}
                              onClick={() => {
                                const copy = { ...portfolioSettings };
                                copy.accentColor = preset.value;
                                setPortfolioSettings(copy);
                              }}
                              className={`h-11 px-4 border rounded-xl flex items-center justify-between text-xs transition-all ${portfolioSettings.accentColor === preset.value ? "border-[#001BB7] bg-[#001BB7]/5 font-semibold text-slate-800 dark:text-white" : "border-black/10 dark:border-white/5 bg-transparent"}`}
                            >
                              <span className="w-3.5 h-3.5 rounded-full inline-block" style={{ backgroundColor: preset.value }} />
                              {preset.name.split(" ")[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom color picker */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Custom Accent Color</label>
                        <div className="flex gap-3">
                          <input 
                            type="color" 
                            className="w-11 h-11 border-0 rounded-xl cursor-pointer"
                            value={portfolioSettings.accentColor}
                            onChange={(e) => {
                              const copy = { ...portfolioSettings };
                              copy.accentColor = e.target.value;
                              setPortfolioSettings(copy);
                            }}
                          />
                          <input 
                            type="text" 
                            className="h-11 bg-slate-50 dark:bg-black/20 border border-black/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-center font-mono w-28 focus:outline-none"
                            value={portfolioSettings.accentColor}
                            onChange={(e) => {
                              const copy = { ...portfolioSettings };
                              copy.accentColor = e.target.value;
                              setPortfolioSettings(copy);
                            }}
                          />
                        </div>
                      </div>

                      {/* Font selector */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Typography / Font</label>
                        <div className="grid grid-cols-2 gap-3">
                          {fontPresets.map((font) => (
                            <button 
                              key={font}
                              onClick={() => {
                                const copy = { ...portfolioSettings };
                                copy.fontFamily = font;
                                setPortfolioSettings(copy);
                              }}
                              className={`h-11 px-3 border rounded-xl text-xs transition-all ${portfolioSettings.fontFamily === font ? "border-[#001BB7] bg-[#001BB7]/5 font-semibold text-slate-800 dark:text-white" : "border-black/10 dark:border-white/5 bg-transparent"}`}
                              style={{ fontFamily: font }}
                            >
                              {font}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dark/Light theme */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Base Render Theme</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => {
                              const copy = { ...portfolioSettings };
                              copy.theme = "light";
                              setPortfolioSettings(copy);
                            }}
                            className={`h-11 px-3 border rounded-xl text-xs transition-all ${portfolioSettings.theme === "light" ? "border-[#001BB7] bg-[#001BB7]/5 font-bold" : "border-black/10 dark:border-white/5 bg-transparent"}`}
                          >
                            Light Theme
                          </button>
                          <button 
                            onClick={() => {
                              const copy = { ...portfolioSettings };
                              copy.theme = "dark";
                              setPortfolioSettings(copy);
                            }}
                            className={`h-11 px-3 border rounded-xl text-xs transition-all ${portfolioSettings.theme === "dark" ? "border-[#001BB7] bg-[#001BB7]/5 font-bold" : "border-black/10 dark:border-white/5 bg-transparent"}`}
                          >
                            Dark Theme
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            )}

            {/* ── LIVE PREVIEW VIEW (FULL-SCREEN PREVIEW Toggled) ── */}
            {previewMode === "preview" && (
              <div className="bg-white dark:bg-[#08080a] border border-black/5 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[78vh] max-w-5xl mx-auto w-full">
                
                {/* Simulated browser bar */}
                <div className="bg-slate-50 dark:bg-[#12121A] border-b border-black/5 dark:border-white/5 p-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />
                  
                  <div className="bg-slate-200/50 dark:bg-black/30 rounded-lg px-4 py-1 flex items-center justify-between text-[10px] text-slate-500 dark:text-gray-400 w-full max-w-sm mx-auto font-mono">
                    <span>https://{portfolioData.personalInfo.fullName.toLowerCase().replace(/\s+/g, "")}.dev</span>
                    <ExternalLink size={10} className="opacity-60" />
                  </div>
                </div>

                {/* Viewport container */}
                <div className="flex-1 overflow-auto bg-slate-900 relative">
                  
                  {!hasUnlockedPreview ? (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md text-center p-6 text-white space-y-4">
                      <div className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400">
                        <EyeOff size={32} />
                      </div>
                      <div className="space-y-1.5 max-w-md">
                        <h3 className="text-lg font-bold">Preview Locked</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          To unlock the live portfolio preview, please fill out the required values in the **Personal Info** form tab:
                        </p>
                      </div>
                      <div className="space-y-1.5 text-left text-xs bg-white/5 p-4 rounded-xl border border-white/5 w-full max-w-xs font-medium">
                        <div className="flex items-center gap-2">
                          <span className={portfolioData.personalInfo.fullName.trim() !== "" ? "text-emerald-500" : "text-amber-500"}>
                            {portfolioData.personalInfo.fullName.trim() !== "" ? "✔" : "○"}
                          </span>
                          <span>Name: {portfolioData.personalInfo.fullName.trim() !== "" ? "Complete" : "Required"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={portfolioData.personalInfo.jobTitle.trim() !== "" ? "text-emerald-500" : "text-amber-500"}>
                            {portfolioData.personalInfo.jobTitle.trim() !== "" ? "✔" : "○"}
                          </span>
                          <span>Job Title: {portfolioData.personalInfo.jobTitle.trim() !== "" ? "Complete" : "Required"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={portfolioData.personalInfo.email.trim() !== "" ? "text-emerald-500" : "text-amber-500"}>
                            {portfolioData.personalInfo.email.trim() !== "" ? "✔" : "○"}
                          </span>
                          <span>Email: {portfolioData.personalInfo.email.trim() !== "" ? "Complete" : "Required"}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 bg-slate-950/20">
                      <div 
                        className={`h-full w-full bg-white dark:bg-black overflow-y-auto rounded-xl transition-all duration-300 shadow-2xl ${
                          viewportSize === "mobile" ? "max-w-[375px]" : 
                          viewportSize === "tablet" ? "max-w-[768px]" : "w-full"
                        }`}
                      >
                        <TemplateRenderer 
                          templateId={selectedTemplate.id} 
                          data={portfolioData} 
                          settings={portfolioSettings} 
                        />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ── AUTOFILL CONFIRMATION MODAL ( Sleek popup uploader/modal ) ── */}
      <AnimatePresence>
        {showAutofillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAutofillModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#12121A] border border-black/10 dark:border-white/5 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white">Auto Fill Portfolio?</h3>
                </div>
                <button 
                  onClick={() => setShowAutofillModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed space-y-2">
                <p>
                  This action imports and synchronizes your developer details (name, job bio, email, social links, experience logs, projects, and education history) from your synced profile.
                </p>
                <p className="text-xs text-amber-500 font-medium">
                  ⚠️ Warning: Any edits you have manually entered in the current workspace forms might be overwritten.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowAutofillModal(false)}
                  className="flex-1 h-11 border border-black/5 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300 font-bold rounded-xl text-xs uppercase transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAutofill}
                  className="flex-1 h-11 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl text-xs uppercase shadow-md shadow-orange-500/10 hover:brightness-105 active:scale-[0.99] transition-all"
                >
                  Yes, Auto Fill
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
