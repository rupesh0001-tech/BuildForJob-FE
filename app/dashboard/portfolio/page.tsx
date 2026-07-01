"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Globe, 
  ArrowLeft, 
  Save, 
  Download, 
  Eye, 
  RefreshCw, 
  Plus, 
  Trash2, 
  ExternalLink,
  Github, 
  Linkedin, 
  Twitter, 
  Briefcase, 
  Code, 
  User, 
  Settings, 
  Share2,
  CheckCircle,
  AlertCircle,
  Layout,
  X,
  Laptop,
  Loader2,
  Sliders,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile, updateProfile } from "@/store/slices/authSlice";
import { generatePortfolioHtml, PortfolioData, PortfolioSection, DEFAULT_SECTIONS, getPortfolioSection } from "./template-generator";
import { toast } from "sonner";

// Dummy data for template fullscreen preview modal
const DUMMY_PREVIEW_DATA: Record<'modern' | 'minimalist' | 'glassmorphism', PortfolioData> = {
  modern: {
    firstName: "Rupesh",
    lastName: "Jagtap",
    jobTitle: "Full-Stack Software Engineer",
    email: "rupesh@example.com",
    location: "Mumbai, India",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    bio: "Passionate software developer focused on building highly interactive, scalable web apps. Specializing in Node.js, Next.js, and Cloud architectures.",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://x.com",
    instagramUrl: "https://instagram.com",
    skills: [{ name: "React" }, { name: "Next.js" }, { name: "Node.js" }, { name: "TypeScript" }, { name: "Prisma" }, { name: "Tailwind CSS" }],
    projects: [
      { name: "ATS Resume Builder", techStack: "Next.js, Tailwind CSS, OpenAI", description: "An AI-powered ATS optimizer helping candidates bypass resume screeners." },
      { name: "Crypto Portfolio Tracker", techStack: "React, Node, Express, MongoDB", description: "Realtime tracker for digital assets with live API prices and alerts." }
    ],
    brandColor: "#ffb400",
    themeMode: "dark",
    resumeUrl: "#",
    templateId: "modern",
    sections: DEFAULT_SECTIONS
  },
  minimalist: {
    firstName: "Sarah",
    lastName: "Connor",
    jobTitle: "Systems Architect",
    email: "sarah@example.com",
    location: "Los Angeles, CA",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300",
    bio: "Designing robust cyber-physical systems and scalable backend microservices. Focused on efficiency, clean code, and zero downtime.",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://x.com",
    instagramUrl: "https://instagram.com",
    skills: [{ name: "C++" }, { name: "Go" }, { name: "Kubernetes" }, { name: "Docker" }, { name: "PostgreSQL" }],
    projects: [
      { name: "Distributed Lock Manager", techStack: "Go, gRPC, Raft Consensus", description: "A high-performance cluster coordinator implementing raft algorithm for lock leases." },
      { name: "Sensor Telemetry Pipeline", techStack: "C++, Kafka, InfluxDB", description: "Low latency broker ingestion consuming 100k events/sec from smart grids." }
    ],
    brandColor: "#111111",
    themeMode: "light",
    resumeUrl: "#",
    templateId: "minimalist",
    sections: DEFAULT_SECTIONS
  },
  glassmorphism: {
    firstName: "Alex",
    lastName: "Rivera",
    jobTitle: "UI/UX Developer",
    email: "alex@example.com",
    location: "New York, NY",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    bio: "Blending futuristic design aesthetics with functional engineering. Crafting immersive glassmorphic web portals and frontend experiences.",
    githubUrl: "https://github.com",
    linkedinUrl: "https://linkedin.com",
    twitterUrl: "https://x.com",
    instagramUrl: "https://instagram.com",
    skills: [{ name: "Figma" }, { name: "React" }, { name: "Framer Motion" }, { name: "Three.js" }, { name: "Tailwind CSS" }],
    projects: [
      { name: "3D Solar System Portal", techStack: "Three.js, React Three Fiber", description: "An interactive educational simulation of celestial orbits and planetary physics." },
      { name: "Glassmorphic OS Dashboard", techStack: "React, Framer Motion, CSS Backdrop", description: "A beautiful web mock operating system with draggable blur windows." }
    ],
    brandColor: "#8b5cf6",
    themeMode: "dark",
    resumeUrl: "#",
    templateId: "glassmorphism",
    sections: DEFAULT_SECTIONS
  }
};

export default function PortfolioBuilderPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // Step State: 'select-template' vs 'builder'
  const [step, setStep] = useState<"select-template" | "builder">("select-template");

  // Mode state for builder step: 'edit' vs 'preview' (Mutual exclusivity)
  const [builderMode, setBuilderMode] = useState<"edit" | "preview">("edit");
  
  // Active Tab inside Edit mode
  const [activeTab, setActiveTab] = useState<"profile" | "skills-projects" | "sections" | "style-social">("profile");

  // State to hold the template selected for previewing in fullscreen modal
  const [previewTemplateId, setPreviewTemplateId] = useState<"modern" | "minimalist" | "glassmorphism" | null>(null);

  // Form State
  const [formData, setFormData] = useState<PortfolioData>({
    firstName: "",
    lastName: "",
    jobTitle: "",
    email: "",
    location: "",
    avatarUrl: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    skills: [],
    projects: [],
    brandColor: "#ffb400",
    themeMode: "light",
    resumeUrl: "",
    templateId: "modern",
    sections: DEFAULT_SECTIONS
  });

  const [localTitle, setLocalTitle] = useState("My Portfolio Site");

  // State to hold new skill input
  const [newSkill, setNewSkill] = useState("");

  // Track which project card is expanded for editing
  const [expandedProjectIndex, setExpandedProjectIndex] = useState<number | null>(null);

  // Track which customize section card is expanded for editing
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  // Status / feedback states
  const [isSaving, setIsSaving] = useState(false);

  // Initialize from LocalStorage or Redux User
  useEffect(() => {
    const savedDraft = localStorage.getItem("portfolio_builder_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft) as PortfolioData;
        // Backwards compatibility for older drafts without sections
        if (!parsed.sections || parsed.sections.length === 0) {
          parsed.sections = DEFAULT_SECTIONS;
        }
        setFormData(parsed);
        // Load custom title if saved
        const savedTitle = localStorage.getItem("portfolio_builder_title");
        if (savedTitle) setLocalTitle(savedTitle);
        setStep("builder");
        return;
      } catch (err) {
        console.error("Failed to parse portfolio draft from localStorage", err);
      }
    }

    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  // Sync profile data when Redux user state is loaded and no local draft exists
  useEffect(() => {
    const savedDraft = localStorage.getItem("portfolio_builder_draft");
    if (user && !savedDraft) {
      populateFromUser(formData.templateId || "modern");
    }
  }, [user]);

  const populateFromUser = (templateId: "modern" | "minimalist" | "glassmorphism") => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      jobTitle: user.jobTitle || "",
      email: user.email || "",
      location: user.location || "",
      avatarUrl: user.avatarUrl || "",
      bio: user.bio || "",
      githubUrl: user.socialLinks?.github || "",
      linkedinUrl: user.socialLinks?.linkedin || "",
      twitterUrl: user.socialLinks?.twitter || "",
      instagramUrl: user.socialLinks?.portfolio || "https://www.instagram.com/",
      skills: user.skills ? user.skills.map((s) => ({ name: s.name })) : [],
      projects: user.projects ? user.projects.map((p) => ({
        name: p.name,
        techStack: p.techStack || "",
        description: p.description || "",
        githubUrl: user.socialLinks?.github ? `${user.socialLinks.github}/${p.name.toLowerCase().replace(/\s+/g, "-")}` : "#",
        liveUrl: "#"
      })) : [],
      brandColor: templateId === "minimalist" ? "#111111" : templateId === "glassmorphism" ? "#8b5cf6" : "#ffb400",
      themeMode: templateId === "minimalist" ? "light" : "dark",
      resumeUrl: user.socialLinks?.website || "",
      templateId: templateId,
      // If sections exist, preserve them, otherwise fall back to DEFAULT_SECTIONS
      sections: prev.sections && prev.sections.length > 0 ? prev.sections : DEFAULT_SECTIONS
    }));
  };

  // Sync form inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Theme change
  const handleThemeChange = (mode: "light" | "dark") => {
    setFormData((prev) => ({
      ...prev,
      themeMode: mode
    }));
  };

  // Brand Color change
  const handleColorChange = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      brandColor: color
    }));
  };

  // Add a skill
  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const skillCleaned = newSkill.trim();
    if (!skillCleaned) return;
    
    if (formData.skills.some((s) => s.name.toLowerCase() === skillCleaned.toLowerCase())) {
      setNewSkill("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: skillCleaned }]
    }));
    setNewSkill("");
  };

  // Remove a skill
  const handleRemoveSkill = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Add new project
  const handleAddProject = () => {
    const newProj = {
      name: "New Project",
      techStack: "",
      description: "",
      githubUrl: "#",
      liveUrl: "#"
    };
    setFormData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj]
    }));
    setExpandedProjectIndex(formData.projects.length);
  };

  // Edit nested project inputs
  const handleProjectChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value
      };
      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  // Remove a project
  const handleRemoveProject = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== indexToRemove)
    }));
    if (expandedProjectIndex === indexToRemove) {
      setExpandedProjectIndex(null);
    } else if (expandedProjectIndex !== null && expandedProjectIndex > indexToRemove) {
      setExpandedProjectIndex(expandedProjectIndex - 1);
    }
  };

  // --- Dynamic Sections Customization Handlers ---
  const handleSectionVisibilityToggle = (sectionId: string) => {
    setFormData((prev) => {
      const updated = (prev.sections || DEFAULT_SECTIONS).map((s) => {
        if (s.id === sectionId) {
          return { ...s, isVisible: !s.isVisible };
        }
        return s;
      });
      return { ...prev, sections: updated };
    });
  };

  const handleSectionHeaderChange = (sectionId: string, field: "title" | "subtitle" | "aboutDescription", value: string) => {
    setFormData((prev) => {
      const updated = (prev.sections || DEFAULT_SECTIONS).map((s) => {
        if (s.id === sectionId) {
          return { ...s, [field]: value };
        }
        return s;
      });
      return { ...prev, sections: updated };
    });
  };

  // Section item additions
  const handleAddSectionItem = (sectionId: string, itemTemplate: any) => {
    setFormData((prev) => {
      const updated = (prev.sections || DEFAULT_SECTIONS).map((s) => {
        if (s.id === sectionId) {
          return { ...s, items: [...s.items, itemTemplate] };
        }
        return s;
      });
      return { ...prev, sections: updated };
    });
  };

  // Edit section item fields
  const handleSectionItemFieldChange = (sectionId: string, itemIndex: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = (prev.sections || DEFAULT_SECTIONS).map((s) => {
        if (s.id === sectionId) {
          const updatedItems = [...s.items];
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            [field]: value
          };
          return { ...s, items: updatedItems };
        }
        return s;
      });
      return { ...prev, sections: updated };
    });
  };

  // Remove item inside section
  const handleRemoveSectionItem = (sectionId: string, itemIndex: number) => {
    setFormData((prev) => {
      const updated = (prev.sections || DEFAULT_SECTIONS).map((s) => {
        if (s.id === sectionId) {
          return { ...s, items: s.items.filter((_, idx) => idx !== itemIndex) };
        }
        return s;
      });
      return { ...prev, sections: updated };
    });
  };

  // Edit About Stats fields
  const handleAboutStatChange = (statIndex: number, field: "value" | "label", value: string) => {
    setFormData((prev) => {
      const updated = (prev.sections || DEFAULT_SECTIONS).map((s) => {
        if (s.id === "about") {
          const stats = [...(s.stats || [])];
          stats[statIndex] = {
            ...stats[statIndex],
            [field]: value
          };
          return { ...s, stats };
        }
        return s;
      });
      return { ...prev, sections: updated };
    });
  };

  const handleAddAboutStat = () => {
    setFormData((prev) => {
      const updated = (prev.sections || DEFAULT_SECTIONS).map((s) => {
        if (s.id === "about") {
          const stats = [...(s.stats || []), { value: "0", label: "New Stat" }];
          return { ...s, stats };
        }
        return s;
      });
      return { ...prev, sections: updated };
    });
  };

  const handleRemoveAboutStat = (statIndex: number) => {
    setFormData((prev) => {
      const updated = (prev.sections || DEFAULT_SECTIONS).map((s) => {
        if (s.id === "about") {
          const stats = (s.stats || []).filter((_, idx) => idx !== statIndex);
          return { ...s, stats };
        }
        return s;
      });
      return { ...prev, sections: updated };
    });
  };

  // Create custom grid layout section
  const handleAddCustomSection = () => {
    const customId = `custom_${Date.now()}`;
    const newCustomSec: PortfolioSection = {
      id: customId,
      title: "My Custom Details",
      subtitle: "Subheading details",
      isVisible: true,
      type: "custom",
      items: [
        { title: "Grid Element Title", description: "Grid details card information text." }
      ]
    };

    setFormData((prev) => ({
      ...prev,
      sections: [...(prev.sections || DEFAULT_SECTIONS), newCustomSec]
    }));
    setExpandedSectionId(customId);
    toast.success("New Custom Grid Section added!");
  };

  // Delete entire custom section
  const handleRemoveCustomSection = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: (prev.sections || DEFAULT_SECTIONS).filter((s) => s.id !== sectionId)
    }));
    if (expandedSectionId === sectionId) setExpandedSectionId(null);
    toast.info("Custom Section removed.");
  };

  // Save current state to local storage & push to backend database
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem("portfolio_builder_draft", JSON.stringify(formData));
      localStorage.setItem("portfolio_builder_title", localTitle);

      const profilePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        jobTitle: formData.jobTitle,
        bio: formData.bio,
        location: formData.location,
        avatarUrl: formData.avatarUrl,
        skills: formData.skills,
        projects: formData.projects.map((p) => ({
          name: p.name,
          techStack: p.techStack,
          description: p.description
        })),
        socialLinks: {
          github: formData.githubUrl,
          linkedin: formData.linkedinUrl,
          twitter: formData.twitterUrl,
          website: formData.resumeUrl,
          portfolio: formData.instagramUrl
        }
      };

      await dispatch(updateProfile(profilePayload)).unwrap();
      toast.success("Portfolio changes saved successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save profile changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate final HTML and trigger file download
  const handleDownloadHtml = () => {
    try {
      const htmlContent = generatePortfolioHtml(formData);
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${formData.firstName.toLowerCase() || "my"}_portfolio.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Portfolio HTML downloaded successfully!");
    } catch (e) {
      console.error("HTML Generation/Download failed:", e);
      toast.error("Failed to generate download bundle.");
    }
  };

  // Select template button
  const handleSelectTemplate = (templateId: "modern" | "minimalist" | "glassmorphism") => {
    populateFromUser(templateId);
    setFormData((prev) => ({
      ...prev,
      templateId
    }));
    setStep("builder");
  };

  // Generate preview HTML for builder iframe
  const previewHtml = generatePortfolioHtml(formData);

  const PRESET_COLORS = [
    { value: "#ffb400", label: "Amber" },
    { value: "#3b82f6", label: "Blue" },
    { value: "#8b5cf6", label: "Violet" },
    { value: "#10b981", label: "Emerald" },
    { value: "#ef4444", label: "Red" },
    { value: "#f43f5e", label: "Rose" },
  ];

  return (
    <div className="max-w-8xl mx-auto space-y-6 pb-20 font-sans text-gray-900 dark:text-gray-150">
      
      {/* -------------------- STEP 1: SELECT TEMPLATE VIEW -------------------- */}
      {step === "select-template" && (
        <div className="flex-1 max-w-6xl mx-auto px-6 py-12 flex flex-col justify-center items-center">
          <div className="text-center max-w-xl mb-12 space-y-4">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-2xl mx-auto">
              <Layout size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Choose Your Portfolio Template
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a design layout to showcase your projects and tech stack. You can customize the content and switch themes at any stage.
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Template Card: Modern */}
            <div className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-primary/20 transition-all group shadow-sm">
              <div className="p-5 bg-gradient-to-br from-indigo-50/20 to-white dark:from-[#0D1117]/10 dark:to-black/20 border-b border-gray-200 dark:border-white/10 aspect-video flex items-center justify-center relative overflow-hidden">
                <Laptop size={48} className="text-primary/80 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Featured
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">Modern Developer</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Sleek layout with top navigation, rounded elements, tech marquee, and custom brand highlight features.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewTemplateId("modern")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 border border-gray-300 dark:border-white/10 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-700 dark:text-white"
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => handleSelectTemplate("modern")}
                    className="flex-1 py-2 bg-primary hover:brightness-110 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-primary/20"
                  >
                    Choose Template
                  </button>
                </div>
              </div>
            </div>

            {/* Template Card: Minimalist */}
            <div className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-primary/20 transition-all group shadow-sm">
              <div className="p-5 bg-gradient-to-br from-gray-50 to-white dark:from-[#0D1117]/10 dark:to-black/20 border-b border-gray-200 dark:border-white/10 aspect-video flex items-center justify-center relative overflow-hidden">
                <Code size={48} className="text-gray-400 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 bg-gray-500/10 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Clean
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">Minimalist Creative</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Clean layout featuring custom grid boxes, Courier mono-fonts, high-contrast typography, and a structured layout.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewTemplateId("minimalist")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 border border-gray-300 dark:border-white/10 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-700 dark:text-white"
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => handleSelectTemplate("minimalist")}
                    className="flex-1 py-2 bg-primary hover:brightness-110 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-primary/20"
                  >
                    Choose Template
                  </button>
                </div>
              </div>
            </div>

            {/* Template Card: Glassmorphism */}
            <div className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-primary/20 transition-all group shadow-sm">
              <div className="p-5 bg-gradient-to-br from-violet-50/20 to-white dark:from-[#0D1117]/10 dark:to-black/20 border-b border-gray-200 dark:border-white/10 aspect-video flex items-center justify-center relative overflow-hidden">
                <Sparkles size={48} className="text-violet-400/80 group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 bg-violet-500/10 text-violet-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Neon Ambient
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">Neon Glassmorphism</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Futuristic layout with linear-radial background gradients, blurred glass panels, and neon-highlight accents.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewTemplateId("glassmorphism")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 border border-gray-300 dark:border-white/10 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-gray-700 dark:text-white"
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => handleSelectTemplate("glassmorphism")}
                    className="flex-1 py-2 bg-primary hover:brightness-110 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-primary/20"
                  >
                    Choose Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- STEP 2: BUILDER (FORM OR 16:9 PREVIEW) -------------------- */}
      {step === "builder" && (
        <div className="space-y-6">
          
          {/* Top Header Section (Matches Resume Builder header: BORDERLESS layout) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-black/40 p-4 rounded-2xl backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => setStep("select-template")}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-white"
                title="Change Template"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col">
                <input 
                  type="text" 
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="bg-transparent border-none outline-none font-semibold text-lg font-sans dark:text-white w-full focus:ring-0 p-0"
                  placeholder="Portfolio Title"
                />
                
                {/* Segmented Toggle Control placed here on the left under the title block */}
                <div className="bg-gray-100 dark:bg-[#161B22] p-0.5 rounded-lg flex gap-1 border border-gray-200 dark:border-white/10 mt-1 w-fit">
                  <button
                    onClick={() => setBuilderMode("edit")}
                    className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1 ${
                      builderMode === "edit"
                        ? "bg-white dark:bg-[#0D1117] text-primary dark:text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={() => setBuilderMode("preview")}
                    className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1 ${
                      builderMode === "preview"
                        ? "bg-white dark:bg-[#0D1117] text-primary dark:text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    Live Preview (16:9)
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons on the right */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => populateFromUser(formData.templateId || "modern")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl font-semibold font-sans text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm text-gray-700 dark:text-white"
                title="Sync and overwrite details with main profile"
              >
                <RefreshCw size={15} />
                Sync
              </button>

              <button
                onClick={handleDownloadHtml}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl font-semibold font-sans text-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm text-gray-700 dark:text-white"
              >
                <Download size={15} />
                Download HTML
              </button>

              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold font-sans text-sm hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-primary/25"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Draft
              </button>
            </div>
          </div>

          {/* Builder Step Main Body Area */}
          <div className="w-full">
            
            {/* VIEW MODE: EDIT FORM (FULL WIDTH) */}
            {builderMode === "edit" && (
              <div className="max-w-4xl mx-auto w-full space-y-6">
                
                {/* Form Tabs Navigation */}
                <div className="flex border border-gray-200 dark:border-white/10 px-1 bg-white dark:bg-black/20 rounded-2xl p-2 shadow-sm">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex-1 pb-2 pt-2 text-xs font-semibold rounded-xl transition-all ${
                      activeTab === "profile"
                        ? "bg-gray-100 dark:bg-white/5 text-primary dark:text-white shadow-sm"
                        : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <User size={14} /> Profile Details
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("skills-projects")}
                    className={`flex-1 pb-2 pt-2 text-xs font-semibold rounded-xl transition-all ${
                      activeTab === "skills-projects"
                        ? "bg-gray-100 dark:bg-white/5 text-primary dark:text-white shadow-sm"
                        : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Code size={14} /> Skills & Projects
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("sections")}
                    className={`flex-1 pb-2 pt-2 text-xs font-semibold rounded-xl transition-all ${
                      activeTab === "sections"
                        ? "bg-gray-100 dark:bg-white/5 text-primary dark:text-white shadow-sm"
                        : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sliders size={14} /> Customize Sections
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("style-social")}
                    className={`flex-1 pb-2 pt-2 text-xs font-semibold rounded-xl transition-all ${
                      activeTab === "style-social"
                        ? "bg-gray-100 dark:bg-white/5 text-primary dark:text-white shadow-sm"
                        : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Settings size={14} /> Style & Socials
                    </span>
                  </button>
                </div>

                {/* Form Sections */}
                <div className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm">
                  
                  {/* TAB: PROFILE DETAILS */}
                  {activeTab === "profile" && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        General Contact Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="e.g. Rupesh"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="e.g. Jagtap"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Job Title</label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          placeholder="e.g. Lead Developer"
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="e.g. candidate@domain.com"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g. Pune, India"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Profile Image URL</label>
                        <div className="flex gap-4 items-center">
                          <input
                            type="text"
                            name="avatarUrl"
                            value={formData.avatarUrl}
                            onChange={handleInputChange}
                            placeholder="e.g. https://avatars.githubusercontent.com/u/12345"
                            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                          />
                          {formData.avatarUrl && (
                            <img 
                              src={formData.avatarUrl} 
                              alt="Profile Thumbnail" 
                              className="w-10 h-10 object-cover rounded-full border border-gray-200 dark:border-white/10 bg-gray-100"
                              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Bio Summary</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell your professional story..."
                          rows={6}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white resize-none text-sm font-sans"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB: SKILLS & PROJECTS */}
                  {activeTab === "skills-projects" && (
                    <div className="space-y-8 animate-in fade-in duration-200">
                      
                      {/* Skills Form */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          Languages, Libraries & Tools
                        </h3>

                        <form onSubmit={handleAddSkill} className="flex gap-2">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add skill tag (React, Docker, Postgres)"
                            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                          />
                          <button
                            type="submit"
                            className="p-2.5 bg-primary text-white rounded-xl hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        </form>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {formData.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                            >
                              {skill.name}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(idx)}
                                className="hover:text-red-500 transition-all text-xs font-bold"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          {formData.skills.length === 0 && (
                            <p className="text-xs text-gray-400 italic">No skills registered yet.</p>
                          )}
                        </div>
                      </div>

                      {/* Projects Form */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Development Projects
                          </h3>
                          <button
                            type="button"
                            onClick={handleAddProject}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:brightness-95 transition-all animate-pulse"
                          >
                            <Plus size={14} /> Add Project
                          </button>
                        </div>

                        <div className="space-y-3">
                          {formData.projects.map((proj, idx) => {
                            const isExpanded = expandedProjectIndex === idx;
                            return (
                              <div 
                                key={idx}
                                className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all bg-gray-50/50 dark:bg-white/5"
                              >
                                <div 
                                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all"
                                  onClick={() => setExpandedProjectIndex(isExpanded ? null : idx)}
                                >
                                  <div className="flex items-center gap-3">
                                    <Briefcase size={16} className="text-primary" />
                                    <span className="font-semibold text-sm">
                                      {proj.name || "Untitled Project"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveProject(idx);
                                      }}
                                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>

                                {isExpanded && (
                                  <div className="p-5 border-t border-gray-100 dark:border-white/5 space-y-4 bg-white dark:bg-black/20">
                                    <div className="space-y-1">
                                      <label className="text-xs font-semibold text-gray-400">Project Name</label>
                                      <input
                                        type="text"
                                        value={proj.name}
                                        onChange={(e) => handleProjectChange(idx, "name", e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-xs"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-xs font-semibold text-gray-400">Tech Stack (comma separated)</label>
                                      <input
                                        type="text"
                                        value={proj.techStack || ""}
                                        onChange={(e) => handleProjectChange(idx, "techStack", e.target.value)}
                                        placeholder="e.g. Next.js, Node, TypeScript"
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-xs"
                                      />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400">GitHub Link</label>
                                        <input
                                          type="text"
                                          value={proj.githubUrl || ""}
                                          onChange={(e) => handleProjectChange(idx, "githubUrl", e.target.value)}
                                          placeholder="e.g. https://github.com/..."
                                          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-xs"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-400">Live URL</label>
                                        <input
                                          type="text"
                                          value={proj.liveUrl || ""}
                                          onChange={(e) => handleProjectChange(idx, "liveUrl", e.target.value)}
                                          placeholder="e.g. https://liveapp.com"
                                          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-xs"
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-xs font-semibold text-gray-400">Banner Image Link (optional - photo only gallery card)</label>
                                      <input
                                        type="text"
                                        value={proj.bannerImage || ""}
                                        onChange={(e) => handleProjectChange(idx, "bannerImage", e.target.value)}
                                        placeholder="e.g. https://images.unsplash.com/photo-..."
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-xs"
                                      />
                                    </div>

                                    <div className="space-y-1">
                                      <label className="text-xs font-semibold text-gray-400">Project Description (Unused on Photo-only card, but saved)</label>
                                      <textarea
                                        value={proj.description || ""}
                                        onChange={(e) => handleProjectChange(idx, "description", e.target.value)}
                                        placeholder="Brief details..."
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-xs resize-none"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {formData.projects.length === 0 && (
                            <div className="text-center py-8 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                              <p className="text-xs text-gray-400 italic">No projects registered yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB: CUSTOMIZE SECTIONS */}
                  {activeTab === "sections" && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-white/10">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 dark:text-white">Page Sections</h3>
                          <p className="text-xs text-gray-400">Toggle visibility, customize titles, or edit section list items.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddCustomSection}
                          className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/25 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={14} /> Custom Section
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(formData.sections || DEFAULT_SECTIONS).map((sec) => {
                          const isExpanded = expandedSectionId === sec.id;
                          return (
                            <div 
                              key={sec.id}
                              className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-white/5 transition-all"
                            >
                              {/* Accordion header with switch toggle */}
                              <div 
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-colors"
                                onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                              >
                                <div className="flex items-center gap-4">
                                  <div 
                                    className={`w-2.5 h-2.5 rounded-full ${sec.isVisible ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} 
                                    title={sec.isVisible ? "Visible on site" : "Hidden"}
                                  />
                                  <div>
                                    <h4 className="font-bold text-sm tracking-tight capitalize">{sec.title || sec.id}</h4>
                                    <p className="text-[10px] text-gray-400 capitalize">Type: {sec.type}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                  {/* Toggle switch for Visibility */}
                                  <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                      type="checkbox" 
                                      checked={sec.isVisible} 
                                      onChange={() => handleSectionVisibilityToggle(sec.id)} 
                                      className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                  </label>

                                  {sec.type === "custom" && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCustomSection(sec.id)}
                                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 rounded-lg"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}

                                  {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                </div>
                              </div>

                              {/* Accordion form body */}
                              {isExpanded && (
                                <div className="p-5 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 space-y-4">
                                  
                                  {/* Title & Subtitle inputs */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <label className="text-xs font-semibold text-gray-500">Section Title</label>
                                      <input
                                        type="text"
                                        value={sec.title}
                                        onChange={(e) => handleSectionHeaderChange(sec.id, "title", e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-xs"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-xs font-semibold text-gray-500">Section Subtitle</label>
                                      <input
                                        type="text"
                                        value={sec.subtitle || ""}
                                        onChange={(e) => handleSectionHeaderChange(sec.id, "subtitle", e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-xs"
                                      />
                                    </div>
                                  </div>

                                  {/* ABOUT SECTION TEXT & STATS */}
                                  {sec.type === "about" && (
                                    <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-white/5">
                                      <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500">About Story Description</label>
                                        <textarea
                                          value={sec.aboutDescription || ""}
                                          onChange={(e) => handleSectionHeaderChange(sec.id, "aboutDescription", e.target.value)}
                                          rows={4}
                                          className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-xs resize-none font-sans"
                                        />
                                      </div>

                                      {/* Stats editor */}
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Agency Statistics</label>
                                          <button
                                            type="button"
                                            onClick={handleAddAboutStat}
                                            className="px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                          >
                                            <Plus size={10} /> Add Stat
                                          </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          {(sec.stats || []).map((st, sidx) => (
                                            <div key={sidx} className="flex gap-2 items-center bg-gray-50/50 dark:bg-white/5 p-2 rounded-xl border border-gray-200 dark:border-white/5">
                                              <input
                                                type="text"
                                                value={st.value}
                                                onChange={(e) => handleAboutStatChange(sidx, "value", e.target.value)}
                                                placeholder="99%"
                                                className="w-16 px-2 py-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold"
                                              />
                                              <input
                                                type="text"
                                                value={st.label}
                                                onChange={(e) => handleAboutStatChange(sidx, "label", e.target.value)}
                                                placeholder="Success Rate"
                                                className="flex-1 px-2 py-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                              />
                                              <button
                                                type="button"
                                                onClick={() => handleRemoveAboutStat(sidx)}
                                                className="p-1 hover:text-red-500"
                                              >
                                                <Trash2 size={12} />
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* LIST SERVICES ITEMS */}
                                  {sec.type === "services" && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/5">
                                      <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service Cards</label>
                                        <button
                                          type="button"
                                          onClick={() => handleAddSectionItem(sec.id, { title: "New Service", description: "Service details", icon: "fa-solid fa-cube" })}
                                          className="px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <Plus size={10} /> Add Card
                                        </button>
                                      </div>

                                      <div className="space-y-2">
                                        {sec.items.map((it, idx) => (
                                          <div key={idx} className="bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 space-y-2 relative">
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveSectionItem(sec.id, idx)}
                                              className="absolute top-3 right-3 p-1 hover:text-red-505 text-gray-450"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                            <div className="grid grid-cols-2 gap-2">
                                              <input
                                                type="text"
                                                value={it.title || ""}
                                                onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "title", e.target.value)}
                                                placeholder="Service Title"
                                                className="px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold"
                                              />
                                              <input
                                                type="text"
                                                value={it.icon || ""}
                                                onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "icon", e.target.value)}
                                                placeholder="fa-solid fa-cube"
                                                className="px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                              />
                                            </div>
                                            <textarea
                                              value={it.description || ""}
                                              onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "description", e.target.value)}
                                              placeholder="Description details..."
                                              rows={2}
                                              className="w-full px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs resize-none font-sans"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* LIST BENEFITS ITEMS */}
                                  {sec.type === "benefits" && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/5">
                                      <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Benefits Cards</label>
                                        <button
                                          type="button"
                                          onClick={() => handleAddSectionItem(sec.id, { title: "New Benefit", description: "Benefit details", icon: "fa-solid fa-circle-check" })}
                                          className="px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <Plus size={10} /> Add Benefit
                                        </button>
                                      </div>

                                      <div className="space-y-2">
                                        {sec.items.map((it, idx) => (
                                          <div key={idx} className="bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 space-y-2 relative">
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveSectionItem(sec.id, idx)}
                                              className="absolute top-3 right-3 p-1 hover:text-red-500 text-gray-400"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                            <div className="grid grid-cols-2 gap-2">
                                              <input
                                                type="text"
                                                value={it.title || ""}
                                                onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "title", e.target.value)}
                                                placeholder="Benefit Title"
                                                className="px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold"
                                              />
                                              <input
                                                type="text"
                                                value={it.icon || ""}
                                                onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "icon", e.target.value)}
                                                placeholder="fa-solid fa-circle-check"
                                                className="px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                              />
                                            </div>
                                            <textarea
                                              value={it.description || ""}
                                              onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "description", e.target.value)}
                                              placeholder="Why choose this benefit..."
                                              rows={2}
                                              className="w-full px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs resize-none font-sans"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* TESTIMONIALS ITEMS */}
                                  {sec.type === "testimonials" && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/5">
                                      <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Testimonials</label>
                                        <button
                                          type="button"
                                          onClick={() => handleAddSectionItem(sec.id, { name: "Client Name", role: "Manager", company: "Company", quote: "Awesome work!" })}
                                          className="px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <Plus size={10} /> Add Testimonial
                                        </button>
                                      </div>

                                      <div className="space-y-3">
                                        {sec.items.map((it, idx) => (
                                          <div key={idx} className="bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 space-y-2 relative">
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveSectionItem(sec.id, idx)}
                                              className="absolute top-3 right-3 p-1 hover:text-red-500 text-gray-400"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                            
                                            <div className="grid grid-cols-3 gap-2">
                                              <input
                                                type="text"
                                                value={it.name || ""}
                                                onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "name", e.target.value)}
                                                placeholder="Client Name"
                                                className="px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold"
                                              />
                                              <input
                                                type="text"
                                                value={it.role || ""}
                                                onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "role", e.target.value)}
                                                placeholder="Client Role"
                                                className="px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                              />
                                              <input
                                                type="text"
                                                value={it.company || ""}
                                                onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "company", e.target.value)}
                                                placeholder="Company Name"
                                                className="px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs"
                                              />
                                            </div>
                                            <textarea
                                              value={it.quote || ""}
                                              onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "quote", e.target.value)}
                                              placeholder="What did they say about your work?"
                                              rows={2}
                                              className="w-full px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs resize-none font-sans"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* FAQs ITEMS */}
                                  {sec.type === "faqs" && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/5">
                                      <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frequently Asked Questions</label>
                                        <button
                                          type="button"
                                          onClick={() => handleAddSectionItem(sec.id, { question: "New Question?", answer: "Detail answer." })}
                                          className="px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <Plus size={10} /> Add FAQ
                                        </button>
                                      </div>

                                      <div className="space-y-3">
                                        {sec.items.map((it, idx) => (
                                          <div key={idx} className="bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 space-y-2 relative">
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveSectionItem(sec.id, idx)}
                                              className="absolute top-3 right-3 p-1 hover:text-red-500 text-gray-400"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                            
                                            <input
                                              type="text"
                                              value={it.question || ""}
                                              onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "question", e.target.value)}
                                              placeholder="Question text?"
                                              className="w-full px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold"
                                            />
                                            <textarea
                                              value={it.answer || ""}
                                              onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "answer", e.target.value)}
                                              placeholder="Answer body text..."
                                              rows={2}
                                              className="w-full px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs resize-none font-sans"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* CUSTOM SECTION TYPE ITEMS */}
                                  {sec.type === "custom" && (
                                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-white/5">
                                      <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Custom Grid Items</label>
                                        <button
                                          type="button"
                                          onClick={() => handleAddSectionItem(sec.id, { title: "Card Title", description: "Card details content" })}
                                          className="px-2.5 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <Plus size={10} /> Add Item
                                        </button>
                                      </div>

                                      <div className="space-y-2">
                                        {sec.items.map((it, idx) => (
                                          <div key={idx} className="bg-gray-50/50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 space-y-2 relative">
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveSectionItem(sec.id, idx)}
                                              className="absolute top-3 right-3 p-1 hover:text-red-505 text-gray-450"
                                            >
                                              <Trash2 size={13} />
                                            </button>
                                            
                                            <input
                                              type="text"
                                              value={it.title || ""}
                                              onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "title", e.target.value)}
                                              placeholder="Item Title"
                                              className="w-full px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold"
                                            />
                                            <textarea
                                              value={it.description || ""}
                                              onChange={(e) => handleSectionItemFieldChange(sec.id, idx, "description", e.target.value)}
                                              placeholder="Description content..."
                                              rows={2}
                                              className="w-full px-3 py-1.5 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs resize-none font-sans"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                  {/* TAB: STYLE & SOCIALS */}
                  {activeTab === "style-social" && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      
                      {/* Stylings */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          Branding Settings
                        </h3>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Theme Mode</label>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleThemeChange("light")}
                              className={`flex-1 py-3 px-4 border rounded-xl font-medium text-sm transition-all ${
                                formData.themeMode === "light"
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                              }`}
                            >
                              Light Theme
                            </button>
                            <button
                              type="button"
                              onClick={() => handleThemeChange("dark")}
                              className={`flex-1 py-3 px-4 border rounded-xl font-medium text-sm transition-all ${
                                formData.themeMode === "dark"
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                              }`}
                            >
                              Dark Theme
                            </button>
                          </div>
                        </div>

                        {/* Brand Color selection */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Theme Highlight Accent Color</label>
                          <div className="flex flex-wrap gap-2.5 items-center">
                            {PRESET_COLORS.map((col) => (
                              <button
                                key={col.value}
                                type="button"
                                onClick={() => handleColorChange(col.value)}
                                className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
                                style={{ 
                                  backgroundColor: col.value,
                                  borderColor: formData.brandColor === col.value ? '#ffffff' : 'transparent',
                                  boxShadow: formData.brandColor === col.value ? '0 0 0 2px #001BB7' : 'none'
                                }}
                                title={col.label}
                              />
                            ))}
                            
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300 dark:border-white/10 cursor-pointer">
                              <input
                                type="color"
                                value={formData.brandColor}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                              />
                            </div>
                            
                            <span className="text-xs font-mono font-bold ml-2 text-gray-500">
                              {formData.brandColor.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Resume Access Link</label>
                          <input
                            type="text"
                            name="resumeUrl"
                            value={formData.resumeUrl}
                            onChange={handleInputChange}
                            placeholder="e.g. https://drive.google.com/..."
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                          />
                        </div>
                      </div>

                      {/* Social Integrations */}
                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-white/10">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          Web Links & Socials
                        </h3>

                        <div className="space-y-3">
                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              <Github size={16} />
                            </div>
                            <input
                              type="text"
                              name="githubUrl"
                              value={formData.githubUrl}
                              onChange={handleInputChange}
                              placeholder="GitHub Profile Link (https://...)"
                              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                            />
                          </div>

                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              <Linkedin size={16} />
                            </div>
                            <input
                              type="text"
                              name="linkedinUrl"
                              value={formData.linkedinUrl}
                              onChange={handleInputChange}
                              placeholder="LinkedIn Profile Link (https://...)"
                              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                            />
                          </div>

                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              <Twitter size={16} />
                            </div>
                            <input
                              type="text"
                              name="twitterUrl"
                              value={formData.twitterUrl}
                              onChange={handleInputChange}
                              placeholder="Twitter/X Profile Link (https://...)"
                              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                            />
                          </div>

                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              <Share2 size={16} />
                            </div>
                            <input
                              type="text"
                              name="instagramUrl"
                              value={formData.instagramUrl}
                              onChange={handleInputChange}
                              placeholder="Instagram Link (https://...)"
                              className="flex-1 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-gray-900 dark:text-white font-sans text-sm"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            )}

            {/* VIEW MODE: LIVE PREVIEW (16:9 PREVIEW OVERLAY CANVAS) */}
            {builderMode === "preview" && (
              <div className="w-full bg-gray-50/50 dark:bg-black/20 rounded-3xl border border-gray-200 dark:border-white/10 p-4 shadow-xl flex items-center justify-center min-h-[55vh]">
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200 dark:border-white/10">
                  <iframe
                    title="16:9 Portfolio Live Preview"
                    srcDoc={previewHtml}
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-scripts allow-downloads"
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* -------------------- FULL SCREEN MOCK PREVIEW MODAL -------------------- */}
      {previewTemplateId && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#0D1117] flex flex-col animate-in fade-in duration-300">
          
          {/* Header Bar */}
          <div className="bg-white dark:bg-black/40 px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wide">
                Preview Mode
              </span>
              <h2 className="font-bold text-sm sm:text-base capitalize text-gray-800 dark:text-white">
                Template Preview: {previewTemplateId} Layout
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSelectTemplate(previewTemplateId)}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold font-sans text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-primary/20"
              >
                Use this Template
              </button>
              <button
                onClick={() => setPreviewTemplateId(null)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-gray-800 dark:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Large Sandbox Preview rendering Dummy Data */}
          <div className="flex-1 bg-white">
            <iframe
              title="Fullscreen Template Preview"
              srcDoc={generatePortfolioHtml(DUMMY_PREVIEW_DATA[previewTemplateId])}
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-downloads"
            />
          </div>
        </div>
      )}

    </div>
  );
}
