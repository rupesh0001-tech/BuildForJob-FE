"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";
import { 
  Loader2, Download, Copy, Eye, Palette, Sun, Moon,
  Laptop, Code, Settings, Plus, Trash2, Globe, Linkedin
} from "lucide-react";
import { toast } from "sonner";
import { generatePortfolioHtml, PortfolioData } from "./template-generator";

interface SkillItem {
  name: string;
}

interface ProjectItem {
  name: string;
  techStack?: string;
  description?: string;
  githubUrl?: string;
  liveUrl?: string;
}

const sidebarTabs = [
  { id: "style", label: "Style & Theme", icon: Palette },
  { id: "hero", label: "Personal Bio", icon: Laptop },
  { id: "skills", label: "Skills Inventory", icon: Code },
  { id: "projects", label: "Featured Projects", icon: Globe },
  { id: "contact", label: "Socials & Contacts", icon: Settings },
] as const;

export default function PortfolioBuilderPage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  
  const [activeTab, setActiveTab] = useState<"settings" | "code">("settings");
  const [activeFormTab, setActiveFormTab] = useState<"style" | "hero" | "skills" | "projects" | "contact">("style");

  // Style Settings
  const [brandColor, setBrandColor] = useState("#ffb400"); // Primary accent color
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [resumeUrl, setResumeUrl] = useState("public/images/rupesh-resume.pdf");

  // Personal Info State (Hero Section)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Professional Summary (Hero Section)
  const [bio, setBio] = useState("");

  // Social Links
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("https://www.instagram.com/");

  // Dynamic Lists State
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // Input states for adding new items
  const [newSkillText, setNewSkillText] = useState("");

  // Pre-defined color palettes
  const colorPalettes = [
    { name: "Brand Yellow", hex: "#ffb400" },
    { name: "Royal Blue", hex: "#3b82f6" },
    { name: "Emerald Green", hex: "#10b981" },
    { name: "Vibrant Violet", hex: "#8b5cf6" },
    { name: "Crimson Red", hex: "#ef4444" },
    { name: "Hot Pink", hex: "#ec4899" },
  ];

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  // Load state from localStorage draft or redux user profile fallback
  useEffect(() => {
    const savedDraft = localStorage.getItem("portfolio_builder_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.brandColor) setBrandColor(parsed.brandColor);
        if (parsed.themeMode) setThemeMode(parsed.themeMode);
        if (parsed.resumeUrl) setResumeUrl(parsed.resumeUrl);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
        if (parsed.bio) setBio(parsed.bio);
        if (parsed.githubUrl) setGithubUrl(parsed.githubUrl);
        if (parsed.linkedinUrl) setLinkedinUrl(parsed.linkedinUrl);
        if (parsed.twitterUrl) setTwitterUrl(parsed.twitterUrl);
        if (parsed.instagramUrl) setInstagramUrl(parsed.instagramUrl);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.projects) setProjects(parsed.projects);
        setIsLoaded(true);
        return;
      } catch (err) {
        console.error("Failed to parse portfolio draft", err);
      }
    }

    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setJobTitle(user.jobTitle || "");
      setEmail(user.email || "");
      setLocation(user.location || "");
      setAvatarUrl(user.avatarUrl || "");
      setBio(user.bio || "");
      
      setSkills(user.skills ? user.skills.map(s => ({ name: s.name })) : []);
      
      setProjects(user.projects ? user.projects.map(p => ({
        name: p.name,
        techStack: p.techStack || "",
        description: p.description || "",
        githubUrl: user.socialLinks?.github ? `${user.socialLinks.github}/${p.name.toLowerCase().replace(/\s+/g, "-")}` : "#",
        liveUrl: "#"
      })) : []);

      setGithubUrl(user.socialLinks?.github || "");
      setLinkedinUrl(user.socialLinks?.linkedin || "");
      setTwitterUrl(user.socialLinks?.twitter || "");
      
      if (user.socialLinks?.website) {
        setResumeUrl(user.socialLinks.website);
      }
      setIsLoaded(true);
    }
  }, [user]);

  // Auto-save draft changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    const draftData: PortfolioData = {
      firstName,
      lastName,
      jobTitle,
      email,
      location,
      avatarUrl,
      bio,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      instagramUrl,
      skills,
      projects,
      brandColor,
      themeMode,
      resumeUrl
    };

    localStorage.setItem("portfolio_builder_draft", JSON.stringify(draftData));
  }, [
    isLoaded,
    firstName,
    lastName,
    jobTitle,
    email,
    location,
    avatarUrl,
    bio,
    githubUrl,
    linkedinUrl,
    twitterUrl,
    instagramUrl,
    skills,
    projects,
    brandColor,
    themeMode,
    resumeUrl
  ]);

  if (isLoading || !isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Loader2 className="animate-spin text-[#001BB7] mb-4" size={40} />
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest animate-pulse">
          Loading Portfolio Builder...
        </p>
      </div>
    );
  }

  // Skill Handlers
  const handleAddSkill = () => {
    if (newSkillText.trim()) {
      setSkills([...skills, { name: newSkillText.trim() }]);
      setNewSkillText("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Project Handlers
  const handleAddProject = () => {
    setProjects([...projects, { name: "", techStack: "", description: "", githubUrl: "#", liveUrl: "#" }]);
  };

  const handleEditProject = (index: number, field: keyof ProjectItem, value: string) => {
    setProjects(projects.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Build data object for template generator
  const portfolioData: PortfolioData = {
    firstName,
    lastName,
    jobTitle,
    email,
    location,
    avatarUrl,
    bio,
    githubUrl,
    linkedinUrl,
    twitterUrl,
    instagramUrl,
    skills,
    projects,
    brandColor,
    themeMode,
    resumeUrl
  };

  const generatedHtml = generatePortfolioHtml(portfolioData);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHtml);
    toast.success("Portfolio HTML code copied to clipboard!");
  };

  const downloadHtmlFile = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedHtml], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${firstName.toLowerCase()}-portfolio.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("index.html downloaded successfully!");
  };

  const handleOpenInNewTab = () => {
    localStorage.setItem("portfolio_builder_draft", JSON.stringify(portfolioData));
    const newWindow = window.open("/portfolio-preview", "_blank");
    if (newWindow) {
      toast.success("Opening portfolio in new tab...");
    } else {
      toast.error("Popup blocker detected! Please allow popups to preview in a new tab.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      
      {/* Top Banner - Header Card Layout matching Resume Builder */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-black/40 p-4 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-4 w-full lg:w-auto px-2">
          <div className="flex-1">
            <h1 className="font-semibold text-lg font-sans dark:text-white leading-tight">
              Portfolio Builder
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold font-sans uppercase tracking-widest mt-0.5">
              Original Template V1
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          <button 
            onClick={handleOpenInNewTab}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold font-sans text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 cursor-pointer shrink-0"
          >
            <Eye size={18} /> Show Preview
          </button>
        </div>
      </div>

      {/* Settings vs Code tab selector */}
      <div className="flex bg-gray-50 dark:bg-zinc-900/60 p-1 rounded-xl max-w-md border border-gray-200 dark:border-white/10">
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "settings" 
              ? "bg-white dark:bg-white/10 text-primary dark:text-white shadow-sm" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Settings size={14} /> Custom Parameters
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "code" 
              ? "bg-white dark:bg-white/10 text-primary dark:text-white shadow-sm" 
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Code size={14} /> Export HTML Code
        </button>
      </div>

      {activeTab === "settings" ? (
        <div className="bg-white dark:bg-black/40 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] shadow-xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-4 min-h-[500px] overflow-hidden">
          {/* Vertical Sidebar Step Menu - 1 Column (Borderless) */}
          <div className="md:col-span-1 bg-gray-55/50 dark:bg-black/10 p-5 flex flex-col gap-1.5">
            <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-3">Sections</span>
            <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 scrollbar-none">
              {sidebarTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFormTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-sans transition-all whitespace-nowrap md:w-full text-left cursor-pointer ${
                      activeFormTab === tab.id
                        ? "bg-primary text-white shadow-md shadow-primary/10"
                        : "text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <IconComponent size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Form Editor Fields Container - 3 Columns */}
          <div className="md:col-span-3 p-6 space-y-6 h-[60vh] md:h-[65vh] overflow-y-auto custom-scrollbar">
            {/* Form Fields Based on Selected Tab */}
            {activeFormTab === "style" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col border-b border-gray-200 dark:border-white/5 pb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">Style & Theme</h3>
                  <p className="text-xs text-gray-500 mt-1">Customize background palette and primary brand colors</p>
                </div>
                {/* Accent selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Background Theme</label>
                  <div className="flex gap-4 max-w-sm">
                    <button
                      onClick={() => setThemeMode("light")}
                      className={`flex-1 py-2.5 border rounded-xl flex items-center justify-center gap-2 font-semibold text-xs transition-all cursor-pointer ${
                        themeMode === "light" 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <Sun size={14} /> Light Mode
                    </button>
                    <button
                      onClick={() => setThemeMode("dark")}
                      className={`flex-1 py-2.5 border rounded-xl flex items-center justify-center gap-2 font-semibold text-xs transition-all cursor-pointer ${
                        themeMode === "dark" 
                          ? "border-primary bg-primary/5 text-primary" 
                          : "border-gray-300 dark:border-white/10 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <Moon size={14} /> Dark Mode
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Primary Accent Color</label>
                  <div className="grid grid-cols-6 gap-3.5 max-w-sm">
                    {colorPalettes.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setBrandColor(c.hex)}
                        className="aspect-square w-full rounded-full relative border border-gray-300 dark:border-white/10 cursor-pointer"
                        style={{ backgroundColor: c.hex }}
                      >
                        {brandColor === c.hex && (
                          <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFormTab === "hero" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col border-b border-gray-200 dark:border-white/5 pb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">Personal Info & Bio</h3>
                  <p className="text-xs text-gray-500 mt-1">Configure your main hero sections and headshot</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-sans text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-sans text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-sans text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start pt-2">
                  <div className="h-20 w-20 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0 flex items-center justify-center">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <Laptop className="text-gray-400" size={24} />
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Avatar/Headshot Image URL</label>
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-sans text-gray-900 dark:text-white"
                      placeholder="https://images.unsplash.com/photo-1534528741775-53994a69daeb..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Bio / Summary</label>
                  <textarea
                    rows={5}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full mt-1 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none resize-none transition-all font-sans text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {activeFormTab === "skills" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col border-b border-gray-200 dark:border-white/5 pb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">Skills Inventory</h3>
                  <p className="text-xs text-gray-500 mt-1">Manage languages, tools, and technical competencies</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillText}
                    onChange={(e) => setNewSkillText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    placeholder="Enter competency (e.g. Next.js)"
                    className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none transition-all font-sans text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-semibold font-sans hover:brightness-110 cursor-pointer active:scale-95 transition-all shadow-sm shadow-primary/10"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-semibold text-gray-850 dark:text-gray-300 flex items-center gap-2 shadow-sm"
                    >
                      {skill.name}
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No skills registered yet. Try typing one above!</p>
                  )}
                </div>
              </div>
            )}

            {activeFormTab === "projects" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col border-b border-gray-200 dark:border-white/5 pb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">Featured Projects</h3>
                  <p className="text-xs text-gray-550 mt-1">Showcase your technical builds, codebases, and sites</p>
                </div>
                <button
                  onClick={handleAddProject}
                  className="w-full py-3 bg-gray-50/50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-dashed border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-gray-600 dark:text-white transition-all cursor-pointer font-sans"
                >
                  <Plus size={14} /> Add Project Item
                </button>

                <div className="space-y-5">
                  {projects.map((proj, index) => (
                    <div key={index} className="p-5 bg-gray-55/40 dark:bg-white/5 rounded-2xl space-y-4 relative shadow-sm">
                      <button
                        onClick={() => handleRemoveProject(index)}
                        className="absolute top-4 right-4 p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl cursor-pointer transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Project Title</span>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => handleEditProject(index, "name", e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-905 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Tech Stack (e.g. React, Node)</span>
                          <input
                            type="text"
                            value={proj.techStack}
                            onChange={(e) => handleEditProject(index, "techStack", e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-905 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">GitHub Repository Link</span>
                          <input
                            type="text"
                            value={proj.githubUrl}
                            onChange={(e) => handleEditProject(index, "githubUrl", e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-905 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Live Host / Demo Link</span>
                          <input
                            type="text"
                            value={proj.liveUrl}
                            onChange={(e) => handleEditProject(index, "liveUrl", e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-905 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Project Details</span>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => handleEditProject(index, "description", e.target.value)}
                          className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none resize-none font-sans text-gray-905 dark:text-white"
                        />
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-sm text-gray-400 italic py-2 text-center">No projects listed. Show off your work!</p>
                  )}
                </div>
              </div>
            )}

            {activeFormTab === "contact" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col border-b border-gray-200 dark:border-white/5 pb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight">Socials & Contacts</h3>
                  <p className="text-xs text-gray-550 mt-1">Configure ways for visitors and employers to connect</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-gray-55 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Location / City</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-gray-55 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-white/5 pt-4 space-y-4">
                  <span className="text-xs font-semibold text-primary dark:text-white uppercase tracking-wider block font-sans">Online Footprint</span>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">GitHub Link</label>
                      <input
                        type="text"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-gray-55 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">LinkedIn Link</label>
                      <input
                        type="text"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-gray-55 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Twitter Link</label>
                      <input
                        type="text"
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-gray-55 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Instagram Link</label>
                      <input
                        type="text"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-gray-55 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1.5 font-sans">Hosted Resume PDF URL</label>
                    <input
                      type="text"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-gray-55 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-primary outline-none font-sans text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Full screen Code output card */
        <div className="bg-white dark:bg-black/40 rounded-2xl border border-black/[0.04] dark:border-white/[0.06] overflow-hidden flex flex-col h-[65vh] shadow-xl backdrop-blur-xl animate-in fade-in duration-200">
          <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="font-mono text-gray-500">index.html (Self-Contained Single-File Code)</span>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-white dark:bg-white/10 hover:bg-gray-105 rounded-xl border border-gray-200 dark:border-white/5 text-gray-700 dark:text-white font-semibold font-sans cursor-pointer transition-all active:scale-95 text-xs"
              >
                Copy Code
              </button>
              <button
                onClick={downloadHtmlFile}
                className="px-4 py-2 bg-emerald-600 hover:brightness-110 text-white rounded-xl font-semibold font-sans cursor-pointer transition-all active:scale-95 text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/10"
              >
                <Download size={14} /> Download HTML
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={generatedHtml}
            className="flex-1 p-5 bg-gray-950 text-gray-200 font-mono text-xs focus:outline-none resize-none overflow-y-auto"
          />
        </div>
      )}

    </div>
  );
}
