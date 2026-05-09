"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile, updateProfile } from "@/store/slices/authSlice";
import { 
  Mail, User as UserIcon, Phone, MapPin, Briefcase, FileText, 
  Camera, Save, Loader2, Plus, Trash2, GraduationCap, 
  Code, Globe, Linkedin, Github, Twitter, RefreshCw, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button1 } from "@/components/general/buttons/button1";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { fetchGitHubData, extractUsername } from "@/lib/github/github-api";
import { GithubSyncModal } from "@/components/profile/GithubSyncModal";

type TabType = "personal" | "experience" | "education" | "projects" | "skills";

export default function ProfileSettingsPage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabType) || "personal";

  const setActiveTab = (tab: TabType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`);
  };

  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubSyncData, setGithubSyncData] = useState<any>(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    bio: "",
    skills: [] as { name: string, isGithubSynced?: boolean }[],
    experience: [] as any[],
    education: [] as any[],
    projects: [] as any[],
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      website: ""
    },
  });

  const isAlreadySynced = hasSynced || (formData.projects?.some((p: any) => p.isGithubSynced) || formData.skills?.some((s: any) => s.isGithubSynced));

  const handleGithubSync = async () => {
    const githubUrl = formData.socialLinks.github;
    const username = extractUsername(githubUrl);

    if (!username) {
      toast.error("Please provide a valid GitHub profile URL first");
      return;
    }

    setIsFetchingGithub(true);
    try {
      const data = await fetchGitHubData(username);
      setGithubSyncData(data);
      setShowSyncModal(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch GitHub data");
    } finally {
      setIsFetchingGithub(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure? This will disconnect GitHub and REMOVE all projects and skills synced from it.")) return;
    
    try {
      setIsSaving(true);
      const updatedData = {
        ...formData,
        socialLinks: { ...formData.socialLinks, github: "" },
        skills: (formData.skills || []).filter((s: any) => !s.isGithubSynced),
        projects: (formData.projects || []).filter((p: any) => !p.isGithubSynced)
      };
      
      await dispatch(updateProfile(updatedData)).unwrap();
      setFormData(updatedData as any);
      setHasSynced(false);
      toast.success("GitHub disconnected and synced data removed.");
    } catch (error: any) {
      toast.error(error || "Failed to disconnect");
    } finally {
      setIsSaving(false);
    }
  };

  const onGithubDataMerged = async (mergedData: any) => {
    try {
      setIsSaving(true);
      await dispatch(updateProfile(mergedData)).unwrap();
      setFormData(mergedData);
      setHasSynced(true);
      toast.success("GitHub data merged into profile!");
    } catch (error: any) {
      toast.error(error || "Failed to save synced data");
    } finally {
      setIsSaving(false);
    }
  };

  // Local states for "Add New" forms
  const [newExperience, setNewExperience] = useState({ company: "", position: "", startDate: "", endDate: "", description: "", isCurrent: false });
  const [newEducation, setNewEducation] = useState({ institution: "", degree: "", field: "", graduationDate: "", gpa: "" });
  const [newProject, setNewProject] = useState({ name: "", techStack: "", description: "" });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (user && !isSaving) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        jobTitle: user.jobTitle || "",
        bio: user.bio || "",
        skills: user.skills || [],
        experience: user.experience || [],
        education: user.education || [],
        projects: user.projects || [],
        socialLinks: user.socialLinks || { github: "", linkedin: "", twitter: "", website: "" },
      });
    }
  }, [user, isSaving]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...((prev as any)[parent]), [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateCompletion = () => {
    if (!user) return 0;
    let score = 0;
    const basicFields = ['firstName', 'lastName', 'phone', 'location', 'jobTitle', 'bio'];
    const filledBasicCount = basicFields.filter(f => !!(formData as any)[f]).length;
    score += (filledBasicCount / basicFields.length) * 30;
    if (formData.experience.length > 0) score += 20;
    if (formData.education.length > 0) score += 20;
    if (formData.projects.length > 0) score += 15;
    const skillCount = formData.skills.length;
    if (skillCount >= 3) score += 15;
    else if (skillCount > 0) score += 5;
    return Math.min(100, Math.round(score));
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsSaving(true);
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = (section: keyof typeof formData, defaultItem: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...(prev[section] as any[]), defaultItem]
    }));
  };

  const removeItem = (section: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: (prev[section] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateListItem = (section: keyof typeof formData, index: number, field: string, value: any) => {
    setFormData(prev => {
      const newList = [...(prev[section] as any[])];
      newList[index] = { ...newList[index], [field]: value };
      return { ...prev, [section]: newList };
    });
  };

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  const completionPercent = calculateCompletion();

  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
        activeTab === id 
          ? "bg-[#001BB7] text-white shadow-lg shadow-[#001BB7]/20" 
          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white tracking-tight">Edit your Profile </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400"> Edit your professional profile to generate high-impact resumes instantly. </p>
        </div>
        <div className="flex items-center gap-4 bg-white dark:bg-black/40 backdrop-blur-md border border-gray-300 dark:border-white/10 px-5 py-2.5 rounded-2xl shadow-sm">
          <div className="relative w-10 h-10 flex items-center justify-center">
             <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-100 dark:text-white/5" />
                <motion.circle 
                  cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="text-[#001BB7]/20 blur-[2px]"
                  initial={{ strokeDasharray: "0 113.1" }} animate={{ strokeDasharray: `${(completionPercent / 100) * 113.1} 113.1` }} transition={{ duration: 1.2, ease: "circOut" }}
                />
                <motion.circle 
                  cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="text-[#001BB7]"
                  initial={{ strokeDasharray: "0 113.1" }} animate={{ strokeDasharray: `${(completionPercent / 100) * 113.1} 113.1` }} transition={{ duration: 1, ease: "circOut" }}
                />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{completionPercent}%</span>
             </div>
          </div>
          
        </div>
      </header>

      <div className="flex flex-wrap gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-gray-200 dark:border-white/10">
        <TabButton id="personal" label="Personal Info" icon={UserIcon} />
        <TabButton id="experience" label="Work Experience" icon={Briefcase} />
        <TabButton id="education" label="Education" icon={GraduationCap} />
        <TabButton id="projects" label="Projects" icon={Code} />
        <TabButton id="skills" label="Technical Skills" icon={Plus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-2xl p-8 text-center shadow-sm relative overflow-hidden group backdrop-blur-xl">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#001BB7] to-[#001BB7]/80 flex items-center justify-center text-white text-4xl font-semibold shadow-2xl transition-transform duration-500 group-hover:scale-105">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <span className="tracking-tighter">{user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}</span>
                )}
              </div>
              
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight leading-none">{formData.firstName} {formData.lastName}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-2 tracking-wide uppercase">{formData.jobTitle || "Career Goal Unset"}</p>
          </div>

          <div className="bg-white dark:bg-black/40 rounded-2xl border border-gray-300 dark:border-white/10 p-6 shadow-sm space-y-5 backdrop-blur-xl">
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1">Presence & Links</h3>
            <div className="space-y-3">
              {[
                { name: 'socialLinks.linkedin', icon: Linkedin, label: 'LinkedIn', placeholder: 'linkedin.com/in/...' },
                { name: 'socialLinks.github', icon: Github, label: 'GitHub', placeholder: 'github.com/...' },
                { name: 'socialLinks.twitter', icon: Twitter, label: 'Twitter', placeholder: 'twitter.com/...' },
                { name: 'socialLinks.website', icon: Globe, label: 'Portfolio', placeholder: 'yourwebsite.com' },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-200/50 dark:border-white/5 focus-within:border-[#001BB7]/40 transition-all group">
                  <s.icon size={18} className="text-gray-400 group-hover:text-[#001BB7] transition-colors" />
                  <input 
                    type="text" 
                    name={s.name} 
                    value={(formData as any).socialLinks[s.name.split('.')[1]]} 
                    onChange={handleChange}
                    placeholder={s.placeholder}
                    className="bg-transparent border-none outline-none text-xs w-full text-gray-900 dark:text-white font-medium placeholder:text-gray-400"
                  />
                </div>
              ))}
              <div className="pt-4 px-1">
                <div className="flex flex-col gap-3">
                  {!isAlreadySynced ? (
                    <button 
                      type="button"
                      onClick={handleGithubSync}
                      disabled={isFetchingGithub || !formData.socialLinks.github}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-900 dark:bg-white/10 hover:bg-black dark:hover:bg-white/20 text-white text-xs font-semibold transition-all disabled:opacity-50 group shadow-lg shadow-black/5 border border-white/10"
                    >
                      {isFetchingGithub ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Github size={16} className="transition-transform group-hover:scale-110" />
                      )}
                      {isFetchingGithub ? "Importing Data..." : "Connect with GitHub"}
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs font-semibold">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                         GitHub Connected
                      </div>
                      <button
                        type="button"
                        onClick={handleDisconnect}
                        disabled={isSaving}
                        className="w-full py-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 text-[10px] font-semibold hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-500/10 uppercase tracking-wider"
                      >
                        Disconnect Integration
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 text-center mt-3 font-medium">
                  {isAlreadySynced ? "Your technical data is synchronized." : "Pull your projects and skills automatically."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-2xl shadow-xl backdrop-blur-xl p-8 space-y-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "personal" && (
                <motion.div 
                  key="personal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1">
                        <UserIcon size={14} className="text-[#001BB7]" /> First Name
                      </label>
                      <input 
                        type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all font-medium text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1">
                        <UserIcon size={14} className="text-[#001BB7]" /> Last Name
                      </label>
                      <input 
                        type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1">
                      <Mail size={14} className="text-[#001BB7]" /> Email Address
                    </label>
                    <input type="email" value={formData.email} disabled className="w-full px-5 py-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 cursor-not-allowed text-sm font-medium" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1">
                        <Phone size={14} className="text-[#001BB7]" /> Phone Number
                      </label>
                      <input 
                        type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000"
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all font-medium text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1">
                        <MapPin size={14} className="text-[#001BB7]" /> Location
                      </label>
                      <input 
                        type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Country"
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1">
                      <Briefcase size={14} className="text-[#001BB7]" /> Professional Job Title
                    </label>
                    <input 
                      type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. Senior Software Engineer"
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all font-medium text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 px-1">
                      <FileText size={14} className="text-[#001BB7]" /> Professional Summary
                    </label>
                    <textarea 
                      name="bio" value={formData.bio} onChange={handleChange} rows={5} placeholder="Briefly describe your career journey and key achievements..."
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] transition-all font-medium text-sm resize-none min-h-[140px]"
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === "experience" && (
                <motion.div key="experience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  {/* Add New Experience Form */}
                  <div className="p-8 rounded-2xl bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-[#001BB7]/10 rounded-lg text-[#001BB7]">
                        <Briefcase size={18} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Experience</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Company</label>
                        <input type="text" placeholder="e.g. Google" value={newExperience.company} onChange={e => setNewExperience({...newExperience, company: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#001BB7]/20 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Position</label>
                        <input type="text" placeholder="e.g. Software Engineer" value={newExperience.position} onChange={e => setNewExperience({...newExperience, position: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#001BB7]/20 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Start Date</label>
                        <input type="date" value={newExperience.startDate} onChange={e => setNewExperience({...newExperience, startDate: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">End Date</label>
                        <input type="date" value={newExperience.endDate} disabled={newExperience.isCurrent} onChange={e => setNewExperience({...newExperience, endDate: e.target.value})} className={`w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium outline-none ${newExperience.isCurrent ? 'opacity-30' : ''}`} />
                      </div>
                      <label className="col-span-1 md:col-span-2 flex items-center gap-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 px-1 cursor-pointer">
                        <input type="checkbox" checked={newExperience.isCurrent} onChange={e => setNewExperience({...newExperience, isCurrent: e.target.checked})} className="w-4 h-4 rounded border-gray-300 dark:border-white/10 text-[#001BB7] focus:ring-[#001BB7]" />
                        I currently work here
                      </label>
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Responsibilities</label>
                        <textarea placeholder="Bullet points of your achievements..." value={newExperience.description} onChange={e => setNewExperience({...newExperience, description: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl min-h-[100px] text-sm font-medium outline-none resize-none" />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!newExperience.company || !newExperience.position) return toast.error("Company and Position are required");
                        addItem("experience", newExperience);
                        setNewExperience({ company: "", position: "", startDate: "", endDate: "", description: "", isCurrent: false });
                      }}
                      className="w-full py-4 bg-[#001BB7] text-white rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#001BB7]/10"
                    >
                      <Plus size={18} /> Add to Experience List
                    </button>
                  </div>

                  {/* Experience List */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 px-1">Experience List</h3>
                    {formData.experience.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No experience added yet.</p>
                      </div>
                    ) : (
                      formData.experience.map((exp, index) => (
                        <div key={index} className="p-6 rounded-2xl bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 flex justify-between items-center group hover:border-[#001BB7]/30 transition-all backdrop-blur-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#001BB7]/5 flex items-center justify-center text-[#001BB7]">
                              <Briefcase size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{exp.position}</p>
                              <p className="text-sm text-[#001BB7] font-medium">{exp.company}</p>
                              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-tight">
                                {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate || "N/A"}
                              </p>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeItem("experience", index)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "education" && (
                <motion.div key="education" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  {/* Add New Education Form */}
                  <div className="p-8 rounded-2xl bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-[#001BB7]/10 rounded-lg text-[#001BB7]">
                        <GraduationCap size={18} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Education</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Institution</label>
                        <input type="text" placeholder="e.g. Stanford University" value={newEducation.institution} onChange={e => setNewEducation({...newEducation, institution: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#001BB7]/20 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Degree</label>
                        <input type="text" placeholder="e.g. Bachelor of Science" value={newEducation.degree} onChange={e => setNewEducation({...newEducation, degree: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Field of Study</label>
                        <input type="text" placeholder="e.g. Computer Science" value={newEducation.field} onChange={e => setNewEducation({...newEducation, field: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Graduation Year</label>
                        <input type="date" value={newEducation.graduationDate} onChange={e => setNewEducation({...newEducation, graduationDate: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">GPA / Result</label>
                        <input type="text" placeholder="e.g. 3.9/4.0" value={newEducation.gpa} onChange={e => setNewEducation({...newEducation, gpa: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium outline-none" />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!newEducation.institution || !newEducation.degree) return toast.error("Institution and Degree are required");
                        addItem("education", newEducation);
                        setNewEducation({ institution: "", degree: "", field: "", graduationDate: "", gpa: "" });
                      }}
                      className="w-full py-4 bg-[#001BB7] text-white rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#001BB7]/10"
                    >
                      <Plus size={18} /> Add to Education List
                    </button>
                  </div>

                  {/* Education List */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 px-1">Education List</h3>
                    {formData.education.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No education added yet.</p>
                      </div>
                    ) : (
                      formData.education.map((edu, index) => (
                        <div key={index} className="p-6 rounded-2xl bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 flex justify-between items-center group hover:border-[#001BB7]/30 transition-all backdrop-blur-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#001BB7]/5 flex items-center justify-center text-[#001BB7]">
                              <GraduationCap size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{edu.degree} in {edu.field}</p>
                              <p className="text-sm text-[#001BB7] font-medium">{edu.institution}</p>
                              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-tight">
                                Graduated: {edu.graduationDate || "N/A"} • GPA: {edu.gpa || "N/A"}
                              </p>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeItem("education", index)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "projects" && (
                <motion.div key="projects" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  {/* Add New Project Form */}
                  <div className="p-8 rounded-2xl bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-[#001BB7]/10 rounded-lg text-[#001BB7]">
                        <Code size={18} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Project</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Project Name</label>
                        <input type="text" placeholder="e.g. AI Content Generator" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#001BB7]/20 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Technologies</label>
                        <input type="text" placeholder="e.g. Next.js, OpenAI, Prisma" value={newProject.techStack} onChange={e => setNewProject({...newProject, techStack: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Description</label>
                        <textarea placeholder="Highlight key features and technical challenges..." value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="w-full px-5 py-3.5 bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 rounded-xl min-h-[120px] text-sm font-medium outline-none resize-none" />
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (!newProject.name) return toast.error("Project name is required");
                        addItem("projects", newProject);
                        setNewProject({ name: "", techStack: "", description: "" });
                      }}
                      className="w-full py-4 bg-[#001BB7] text-white rounded-xl font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#001BB7]/10"
                    >
                      <Plus size={18} /> Add to Projects List
                    </button>
                  </div>

                  {/* Projects List */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 px-1">Projects List</h3>
                    {formData.projects.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No projects added yet.</p>
                      </div>
                    ) : (
                      formData.projects.map((proj, index) => (
                        <div key={index} className="p-6 rounded-2xl bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 flex justify-between items-center group hover:border-[#001BB7]/30 transition-all backdrop-blur-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#001BB7]/5 flex items-center justify-center text-[#001BB7]">
                              <Code size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{proj.name}</p>
                              <p className="text-xs text-[#001BB7] font-semibold mt-0.5">{proj.techStack}</p>
                              <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 max-w-sm">
                                {proj.description || "No description provided."}
                              </p>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeItem("projects", index)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === "skills" && (
                <motion.div key="skills" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  {/* Add New Skill Form */}
                  <div className="p-8 rounded-2xl bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-[#001BB7]/10 rounded-lg text-[#001BB7]">
                        <Plus size={18} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Skills</h3>
                    </div>
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Enter a technical skill (e.g. React.js)" 
                        value={newSkill}
                        onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && newSkill.trim()) {
                            e.preventDefault();
                            addItem("skills", { name: newSkill.trim() });
                            setNewSkill("");
                          }
                        }}
                        className="flex-1 px-5 py-4 rounded-xl bg-white dark:bg-[#1a1a22] border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-[#001BB7]/20 focus:border-[#001BB7] outline-none text-sm font-medium transition-all" 
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (newSkill.trim()) {
                            addItem("skills", { name: newSkill.trim() });
                            setNewSkill("");
                          }
                        }} 
                        className="px-8 rounded-xl bg-[#001BB7] text-white font-semibold hover:bg-[#001BB7]/90 active:scale-95 transition-all shadow-lg shadow-[#001BB7]/20"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-semibold">Tip: Press Enter to quickly add multiple skills</p>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 px-1">Skills Inventory</h3>
                    {formData.skills.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills added yet.</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {formData.skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-black/40 text-[#001BB7] rounded-xl border border-gray-300 dark:border-white/10 group hover:border-[#001BB7]/30 transition-all shadow-sm backdrop-blur-sm">
                            <span className="text-xs font-semibold">{skill.name}</span>
                            <button type="button" onClick={() => removeItem("skills", index)} className="hover:text-red-500 transition-colors opacity-60 group-hover:opacity-100">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-10 border-t border-gray-100 dark:border-white/5 flex justify-between items-center gap-6">
              <div className="text-gray-400 text-xs font-medium italic">
                {activeTab !== 'personal' && "Ensure you save before switching tabs."}
              </div>
              <Button1 type="button" onClick={handleSubmit} className="px-12 py-4 flex items-center gap-3 shadow-xl shadow-[#001BB7]/20 rounded-xl font-semibold bg-[#001BB7] hover:bg-[#001BB7]/90 transition-all text-white" disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {isSaving ? "Updating Profile..." : "Save Changes"}
              </Button1>
            </div>
          </div>
        </div>
      </div>

      {githubSyncData && (
        <GithubSyncModal 
          key={githubSyncData.profile.html_url}
          isOpen={showSyncModal}
          onClose={() => setShowSyncModal(false)}
          githubData={githubSyncData}
          currentData={formData}
          onSync={onGithubDataMerged}
        />
      )}
    </div>
  );
}
