"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FileText,
  Download,
  Trash2,
  Upload,
  X,
  Building2,
  Calendar,
  Loader2,
  ChevronDown,
  ArrowUpDown,
  Filter,
  Check,
  Eye,
  Mail
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getVersions, createVersion, deleteVersion } from "@/apis/versions.api";
import { ConfirmModal } from "@/components/general/ConfirmModal";
import { CompanyPickerModal } from "@/components/general/CompanyPickerModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllResumes } from "@/lib/store/features/resume-slice";
import { fetchAllCoverLetters } from "@/lib/store/features/cover-letter-slice";
import { toast } from "sonner";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";

// Helper function for date formatting
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function VersionsPage() {
  const dispatch = useAppDispatch();
  const { resumesList } = useAppSelector((state) => state.resume);
  const { coverLettersList } = useAppSelector((state) => state.coverLetter);

  const [showModal, setShowModal] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Company Picker States
  const [companyPickerOpen, setCompanyPickerOpen] = useState(false);

  // Checkboxes for Upload Toggle
  const [uploadResume, setUploadResume] = useState(false);
  const [uploadCL, setUploadCL] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    versionName: "",
    companyName: "",
    resumeId: "",
    resumeUrl: "",
    coverLetterUrl: "",
    coverLetterId: "", // Helper state
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [clFile, setClFile] = useState<File | null>(null);

  // Document Picker Modal States
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerType, setPickerType] = useState<"resume" | "coverLetter">("resume");
  const [pickerSearchQuery, setPickerSearchQuery] = useState("");
  const [pickerSortBy, setPickerSortBy] = useState<"updated" | "title">("updated");
  const [pickerFilterTemplate, setPickerFilterTemplate] = useState("all");
  const [pickerSelectedItem, setPickerSelectedItem] = useState<any>(null);

  useEffect(() => {
    fetchVersions();
    dispatch(fetchAllResumes());
    dispatch(fetchAllCoverLetters());
  }, [dispatch]);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const data = await getVersions();
      setVersions(data);
    } catch (error) {
      console.error("Failed to fetch versions:", error);
      toast.error("Failed to fetch versions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasResume = resumeFile || formData.resumeId || formData.resumeUrl;
    if (!hasResume || !formData.versionName || !formData.companyName) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("versionName", formData.versionName);
      data.append("companyName", formData.companyName);
      
      if (resumeFile) {
        data.append("resume", resumeFile);
      } else if (formData.resumeId) {
        data.append("resumeId", formData.resumeId);
      } else if (formData.resumeUrl) {
        data.append("resumeUrl", formData.resumeUrl);
      }

      if (clFile) {
        data.append("coverLetter", clFile);
      } else if (formData.coverLetterUrl) {
        data.append("coverLetterUrl", formData.coverLetterUrl);
      }

      await createVersion(data);
      toast.success("Version created successfully");
      setShowModal(false);
      resetForm();
      fetchVersions();
    } catch (error) {
      console.error("Failed to create version:", error);
      toast.error("Failed to create version");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      versionName: "", 
      companyName: "",
      resumeId: "",
      resumeUrl: "",
      coverLetterUrl: "",
      coverLetterId: ""
    });
    setResumeFile(null);
    setClFile(null);
    setUploadResume(false);
    setUploadCL(false);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const filteredVersions = versions.filter(v =>
    v.versionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Document Picker Methods
  const openPicker = (type: "resume" | "coverLetter") => {
    setPickerType(type);
    setPickerSearchQuery("");
    setPickerSortBy("updated");
    setPickerFilterTemplate("all");
    
    const initialList = type === "resume" ? resumesList : coverLettersList;
    setPickerSelectedItem(initialList.length > 0 ? initialList[0] : null);
    setPickerOpen(true);
  };

  const handleSelectFromPicker = () => {
    if (!pickerSelectedItem) return;

    if (pickerType === "resume") {
      setFormData({
        ...formData,
        resumeId: pickerSelectedItem.id,
        resumeUrl: "" // Clear any previous custom url
      });
    } else {
      // Find the URL if it was uploaded, or build cover letter preview url,
      // For cover letter projects, we can pass their target URL or link them.
      // In this setup, versions handle coverLetterUrl. If our selected cover letter
      // does not have a public url yet, we set coverLetterUrl to indicate selection.
      // (The backend receives coverLetterUrl if they are files or links).
      setFormData({
        ...formData,
        coverLetterId: pickerSelectedItem.id,
        coverLetterUrl: pickerSelectedItem.content?.website || `Cover Letter: ${pickerSelectedItem.title}`
      });
    }
    setPickerOpen(false);
  };

  // Pre-filter Picker Items
  const getPickerItems = () => {
    const list = pickerType === "resume" ? resumesList : coverLettersList;
    
    // Search filter
    let result = list.filter(item => 
      item.title.toLowerCase().includes(pickerSearchQuery.toLowerCase())
    );

    // Template filter
    if (pickerFilterTemplate !== "all") {
      result = result.filter(item => item.template === pickerFilterTemplate);
    }

    // Sorting
    result.sort((a, b) => {
      if (pickerSortBy === "title") {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return result;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white font-sans tracking-tight">Application Versions</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track custom resume and cover letter versions tailored for each job application.</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-sm cursor-pointer hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
        >
          <Plus size={18} /> Create New Version
        </button>
      </div>

      {/* Filters & Search */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search versions or companies..."
          className="w-full pl-11 pr-4 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans text-black dark:text-white shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#08080a] rounded-2xl border border-gray-300 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-300 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Version Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resume</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cover Letter</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Loader2 size={20} className="animate-spin text-primary" />
                      Loading versions...
                    </div>
                  </td>
                </tr>
              ) : filteredVersions.length > 0 ? (
                filteredVersions.map((v, idx) => (
                  <motion.tr
                    key={v.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b border-gray-100 dark:border-white/5 last:border-0"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/5 dark:bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <FileText size={20} />
                        </div>
                        <span className="font-semibold text-black dark:text-white">{v.versionName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-800 dark:text-gray-400">
                        <Building2 size={16} className="text-gray-500" />
                        <span className="font-semibold text-black dark:text-white">{v.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {v.resumeId && v.resume ? (
                          <Link
                            href={`/dashboard/resume-builder?id=${v.resumeId}`}
                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold flex items-center gap-2 border border-primary/20 hover:bg-primary/20 transition-colors"
                          >
                            <FileText size={14} />
                            Resume
                          </Link>
                        ) : v.resumeUrl ? (
                          <a
                            href={v.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold flex items-center gap-2 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 transition-colors"
                          >
                            <Download size={14} />
                            Resume
                          </a>
                        ) : (
                          <span className="text-gray-500 text-xs italic">No resume linked</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {v.coverLetterUrl ? (
                          <a
                            href={v.coverLetterUrl.startsWith('http') ? v.coverLetterUrl : '#'}
                            target={v.coverLetterUrl.startsWith('http') ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-semibold flex items-center gap-2 border border-purple-200 dark:border-purple-500/20 hover:bg-purple-100 transition-colors"
                          >
                            {v.coverLetterUrl.startsWith('http') ? <Download size={14} /> : <FileText size={14} />}
                            {v.coverLetterUrl.startsWith('http') ? "Cover Letter" : v.coverLetterUrl}
                          </a>
                        ) : (
                          <span className="text-gray-500 text-xs italic">Not provided</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-500 text-sm">
                        <Calendar size={14} />
                        {formatDate(v.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No versions found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 15 }}
              className="bg-white dark:bg-[#08080a] rounded-3xl p-8 max-w-4xl w-full shadow-2xl border border-gray-300 dark:border-white/10 relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

              <form onSubmit={handleCreate} className="relative flex flex-col h-full overflow-y-auto pr-1">
                <div className="flex items-center justify-between mb-8 shrink-0">
                  <div>
                    <h3 className="text-2xl font-semibold text-black dark:text-white tracking-tight">Create New Version</h3>
                    <p className="text-sm text-gray-500 mt-1">Configure details and tailor documents for this specific application.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={22} className="text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                  {/* Left Column: Basic Information */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Version Name *</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          required
                          type="text"
                          value={formData.versionName}
                          onChange={(e) => setFormData({ ...formData, versionName: e.target.value })}
                          placeholder="e.g. Google Backend v1"
                          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-primary outline-none rounded-xl text-sm font-semibold transition-all text-black dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Target Company *</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <button
                          type="button"
                          onClick={() => setCompanyPickerOpen(true)}
                          className="w-full pl-11 pr-10 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left flex items-center justify-between font-sans text-black dark:text-white cursor-pointer"
                        >
                          <span className="truncate">{formData.companyName || "Select Target Company..."}</span>
                          <ChevronDown size={16} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Files & Documents Selection */}
                  <div className="space-y-6">
                    {/* Resume Source selection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="uploadResume"
                            checked={uploadResume}
                            onChange={(e) => {
                              setUploadResume(e.target.checked);
                              setResumeFile(null);
                              setFormData({ ...formData, resumeId: "", resumeUrl: "" });
                            }}
                            className="rounded border-gray-300 dark:border-white/10 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="uploadResume" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                            Upload New Resume
                          </label>
                        </div>
                      </div>

                      {uploadResume ? (
                        <div className="relative group">
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            id="resume-upload"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                          />
                          <label
                            htmlFor="resume-upload"
                            className="flex flex-col items-center justify-center gap-2 w-full p-6 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 hover:border-primary/50 rounded-xl transition-all cursor-pointer text-center"
                          >
                            <Upload size={18} className={resumeFile ? "text-green-500" : "text-primary"} />
                            <div>
                              <span className="text-xs font-semibold text-black dark:text-white block">
                                {resumeFile ? resumeFile.name : "Select Resume PDF File"}
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">PDF files only (Max 5MB)</span>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openPicker("resume")}
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left flex items-center justify-between text-black dark:text-white cursor-pointer"
                        >
                          <span className="truncate">
                            {formData.resumeId ? resumesList.find(r => r.id === formData.resumeId)?.title : "Select Resume from Library..."}
                          </span>
                          <Search size={16} className="text-gray-400" />
                        </button>
                      )}
                    </div>

                    {/* Cover Letter selection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="uploadCL"
                            checked={uploadCL}
                            onChange={(e) => {
                              setUploadCL(e.target.checked);
                              setClFile(null);
                              setFormData({ ...formData, coverLetterUrl: "", coverLetterId: "" });
                            }}
                            className="rounded border-gray-300 dark:border-white/10 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          />
                          <label htmlFor="uploadCL" className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer">
                            Upload New Cover Letter
                          </label>
                        </div>
                      </div>

                      {uploadCL ? (
                        <div className="relative group">
                          <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            id="cl-upload"
                            onChange={(e) => setClFile(e.target.files?.[0] || null)}
                          />
                          <label
                            htmlFor="cl-upload"
                            className="flex flex-col items-center justify-center gap-2 w-full p-6 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 hover:border-primary/50 rounded-xl transition-all cursor-pointer text-center"
                          >
                            <Upload size={18} className={clFile ? "text-green-500" : "text-primary"} />
                            <div>
                              <span className="text-xs font-semibold text-black dark:text-white block">
                                {clFile ? clFile.name : "Select Cover Letter PDF File"}
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">PDF files only (Optional)</span>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openPicker("coverLetter")}
                          className="w-full px-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left flex items-center justify-between text-black dark:text-white cursor-pointer"
                        >
                          <span className="truncate">
                            {formData.coverLetterId ? coverLettersList.find(cl => cl.id === formData.coverLetterId)?.title : "Select Cover Letter from Library..."}
                          </span>
                          <Search size={16} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-white/5 shrink-0">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3.5 bg-gray-100 dark:bg-white/5 rounded-xl font-semibold text-sm transition-colors text-gray-800 dark:text-gray-400 disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-xl shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : "Save Version"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Document Picker Modal */}
      <AnimatePresence>
        {pickerOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white dark:bg-[#08080a] rounded-3xl w-full max-w-6xl h-[85vh] shadow-2xl border border-gray-200 dark:border-white/10 flex overflow-hidden relative"
            >
              {/* Left Column: Filter and Document Selection list */}
              <div className="w-[380px] shrink-0 border-r border-gray-200 dark:border-white/10 flex flex-col h-full bg-white dark:bg-[#08080a]">
                {/* Header */}
                <div className="p-5 border-b border-gray-200 dark:border-white/10 shrink-0">
                  <h3 className="text-lg font-bold text-black dark:text-white capitalize flex items-center gap-2">
                    {pickerType === "resume" ? <FileText size={18} /> : <Mail size={18} />}
                    Select {pickerType === "resume" ? "Resume" : "Cover Letter"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Filter, sort, and preview documents in your library.</p>
                </div>

                {/* Filter and search bar */}
                <div className="p-4 border-b border-gray-200 dark:border-white/10 space-y-3 bg-gray-50/50 dark:bg-white/5 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search title..."
                      value={pickerSearchQuery}
                      onChange={(e) => setPickerSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-lg text-xs font-semibold outline-none focus:border-primary text-black dark:text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    {/* Sort Selector */}
                    <div className="flex-1 relative">
                      <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                      <select
                        value={pickerSortBy}
                        onChange={(e: any) => setPickerSortBy(e.target.value)}
                        className="w-full pl-8 pr-2 py-3 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-lg text-xs font-semibold outline-none focus:border-primary text-black dark:text-white cursor-pointer appearance-none font-sans"
                      >
                        <option value="updated">Recent Updated</option>
                        <option value="title">Title A-Z</option>
                      </select>
                    </div>

                    {/* Filter template */}
                    <div className="flex-1 relative">
                      <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                      <select
                        value={pickerFilterTemplate}
                        onChange={(e: any) => setPickerFilterTemplate(e.target.value)}
                        className="w-full pl-8 pr-2 py-3 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-lg text-xs font-semibold outline-none focus:border-primary text-black dark:text-white cursor-pointer appearance-none font-sans"
                      >
                        <option value="all">All Templates</option>
                        {pickerType === "resume" ? (
                          <>
                            <option value="modern">Modern</option>
                            <option value="minimal">Minimal</option>
                            <option value="classic">Classic</option>
                            <option value="professional">Professional</option>
                          </>
                        ) : (
                          <>
                            <option value="Modern">Modern</option>
                            <option value="Classic">Classic</option>
                            <option value="Minimal">Minimal</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>

                {/* List container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
                  {getPickerItems().length > 0 ? (
                    getPickerItems().map(item => (
                      <div
                        key={item.id}
                        onClick={() => setPickerSelectedItem(item)}
                        className={`p-4 border rounded-xl cursor-pointer transition-all flex flex-col justify-between h-28 relative overflow-hidden ${
                          pickerSelectedItem?.id === item.id
                            ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
                            : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                      >
                        <div className="space-y-1 pr-6">
                          <h4 className="font-semibold text-sm text-black dark:text-white line-clamp-1">{item.title}</h4>
                          <p className="text-[10px] text-gray-500 capitalize">{item.template || "Standard"} Template</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <Calendar size={10} />
                          <span>Updated {formatDate(item.updatedAt)}</span>
                        </div>
                        {pickerSelectedItem?.id === item.id && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-10">
                      <FileText size={28} className="text-gray-300 mb-2" />
                      <p className="text-xs font-semibold">No items match filters</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Live Document Preview & Actions */}
              <div className="flex-1 flex flex-col h-full bg-gray-50/50 dark:bg-black/40 overflow-hidden">
                {/* Preview Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#08080a] shrink-0">
                  <div className="truncate pr-4">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Previewing document</span>
                    <h3 className="font-bold text-black dark:text-white truncate mt-0.5">{pickerSelectedItem ? pickerSelectedItem.title : "No Selection"}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPickerOpen(false)}
                      className="px-4 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!pickerSelectedItem}
                      onClick={handleSelectFromPicker}
                      className="px-5 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 cursor-pointer font-sans"
                    >
                      Select Document
                    </button>
                  </div>
                </div>

                {/* Preview frame container */}
                <div className="flex-1 overflow-y-auto p-8 flex justify-center items-start">
                  {pickerSelectedItem ? (
                    <div className="w-full max-w-[210mm] shadow-2xl rounded-2xl overflow-hidden scale-[0.6] md:scale-[0.7] xl:scale-[0.8] origin-top bg-white border border-gray-200 dark:border-white/10 shrink-0">
                      {pickerType === "resume" ? (
                        <ResumePreview stateOverride={pickerSelectedItem.content} />
                      ) : (
                        <CoverLetterPreview stateOverride={{ ...pickerSelectedItem.content, template: pickerSelectedItem.template }} />
                      )}
                    </div>
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-center text-gray-500">
                      <Eye size={40} className="text-gray-300 mb-2" />
                      <p className="text-sm font-semibold">Select a document from the list to display its preview.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteVersion(deleteId);
            fetchVersions();
            toast.success("Version deleted successfully");
          } catch (error) {
            console.error("Failed to delete version:", error);
            toast.error("Failed to delete version");
          }
          setDeleteId(null);
        }}
        title="Delete Version"
        description="Are you sure you want to delete this version? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <CompanyPickerModal
        isOpen={companyPickerOpen}
        onClose={() => setCompanyPickerOpen(false)}
        onSelect={(companyName) => setFormData({ ...formData, companyName })}
        selectedValue={formData.companyName}
      />
    </div>
  );
}
