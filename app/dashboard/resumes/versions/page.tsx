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
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getVersions, createVersion, deleteVersion } from "@/apis/versions.api";
import { ConfirmModal } from "@/components/general/ConfirmModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllResumes } from "@/lib/store/features/resume-slice";
import { toast } from "sonner";

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
  const [showModal, setShowModal] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    versionName: "",
    companyName: "",
    resumeId: "",
    resumeUrl: "",
    coverLetterUrl: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [clFile, setClFile] = useState<File | null>(null);
  const [useLibraryResume, setUseLibraryResume] = useState(true);
  const [useLibraryCL, setUseLibraryCL] = useState(true);
  const [dropdownOpenResume, setDropdownOpenResume] = useState(false);
  const [dropdownOpenCL, setDropdownOpenCL] = useState(false);

  useEffect(() => {
    fetchVersions();
    dispatch(fetchAllResumes());
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
      coverLetterUrl: ""
    });
    setResumeFile(null);
    setClFile(null);
    setUseLibraryResume(false);
    setUseLibraryCL(false);
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const filteredVersions = versions.filter(v =>
    v.versionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold text-md cursor-pointer transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Create New Version
        </motion.button>
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
                      <Loader2 size={20} className="animate-spin text-indigo-500" />
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
                        <span className="font-semibold">{v.companyName}</span>
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
                            href={v.coverLetterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-semibold flex items-center gap-2 border border-purple-200 dark:border-purple-500/20 hover:bg-purple-100 transition-colors"
                          >
                            <Download size={14} />
                            Cover Letter
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
          <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#08080a] rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-gray-300 dark:border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

              <form onSubmit={handleCreate} className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-black dark:text-white tracking-tight">Create New Version</h3>
                    <p className="text-sm text-gray-800 dark:text-gray-400 mt-1">Tailor your application for a specific target.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider px-1">Version Name</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.versionName}
                        onChange={(e) => setFormData({ ...formData, versionName: e.target.value })}
                        placeholder="e.g. Frontend v2"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-primary outline-none rounded-xl text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider px-1">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        required
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Google"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 focus:border-primary outline-none rounded-xl text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {/* Resume Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-sans">Resume Source</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setUseLibraryResume(!useLibraryResume);
                          setResumeFile(null);
                          setFormData({...formData, resumeId: "", resumeUrl: ""});
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline transition-all font-sans"
                      >
                        {useLibraryResume ? "Upload Instead" : "Select from Library"}
                      </button>
                    </div>

                    {!useLibraryResume ? (
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
                          className={`flex flex-col items-center justify-center gap-3 w-full p-8 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-primary/50 rounded-xl transition-all cursor-pointer shadow-sm`}
                        >
                          <Upload size={20} className={resumeFile ? "text-green-500" : "text-primary"} />
                          <div className="text-center">
                            <span className="text-sm font-semibold text-black dark:text-white block font-sans">
                              {resumeFile ? resumeFile.name : "Upload Resume PDF"}
                            </span>
                            <span className="text-[11px] text-gray-500 mt-1 font-sans">PDF files only (Max 5MB)</span>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setDropdownOpenResume(!dropdownOpenResume)}
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left flex items-center justify-between font-sans text-black dark:text-white"
                          >
                            <span className="truncate">
                              {formData.resumeId ? resumesList.find(r => r.id === formData.resumeId)?.title : 
                               formData.resumeUrl ? formData.resumeUrl.split('/').pop()?.split('_').slice(2).join('_') : 
                               "Select a Resume..."}
                            </span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpenResume ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {dropdownOpenResume && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-[#0c0c0e] border border-gray-300 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                              >
                                <div className="max-h-60 overflow-y-auto py-2">
                                  {resumesList.length > 0 && (
                                    <>
                                      <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Resume Projects</div>
                                      {resumesList.map(r => (
                                        <button
                                          key={r.id}
                                          type="button"
                                          onClick={() => {
                                            setFormData({...formData, resumeId: r.id, resumeUrl: ""});
                                            setDropdownOpenResume(false);
                                          }}
                                          className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-colors font-sans text-black dark:text-gray-300"
                                        >
                                          {r.title}
                                        </button>
                                      ))}
                                    </>
                                  )}
                                  
                                  {Array.from(new Set(versions.map(v => v.resumeUrl).filter(Boolean))).length > 0 && (
                                    <>
                                      <div className="px-4 py-2 mt-2 border-t border-gray-100 dark:border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Previous Uploads</div>
                                      {Array.from(new Set(versions.map(v => v.resumeUrl).filter(Boolean))).map((url: any) => (
                                        <button
                                          key={url}
                                          type="button"
                                          onClick={() => {
                                            setFormData({...formData, resumeUrl: url, resumeId: ""});
                                            setDropdownOpenResume(false);
                                          }}
                                          className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-colors font-sans text-black dark:text-gray-300"
                                        >
                                          {url.split('/').pop()?.split('_').slice(2).join('_') || "Previous Resume"}
                                        </button>
                                      ))}
                                    </>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <p className="text-[11px] text-gray-500 px-1 font-sans">
                          Linking to a project will keep this version synced with builder content.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-sans">Cover Letter Source</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setUseLibraryCL(!useLibraryCL);
                          setClFile(null);
                          setFormData({...formData, coverLetterUrl: ""});
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline transition-all font-sans"
                      >
                        {useLibraryCL ? "Upload Instead" : "Select from Library"}
                      </button>
                    </div>

                    {!useLibraryCL ? (
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
                          className={`flex flex-col items-center justify-center gap-3 w-full p-8 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-primary/50 rounded-xl transition-all cursor-pointer shadow-sm`}
                        >
                          <Upload size={20} className={clFile ? "text-green-500" : "text-primary"} />
                          <div className="text-center">
                            <span className="text-sm font-semibold text-black dark:text-white block font-sans">
                              {clFile ? clFile.name : "Upload Cover Letter PDF"}
                            </span>
                            <span className="text-[11px] text-gray-500 mt-1 font-sans">PDF files only (Optional)</span>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setDropdownOpenCL(!dropdownOpenCL)}
                            className="w-full pl-4 pr-10 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left flex items-center justify-between font-sans text-black dark:text-white"
                          >
                            <span className="truncate">
                              {formData.coverLetterUrl ? formData.coverLetterUrl.split('/').pop()?.split('_').slice(2).join('_') : "Select a Cover Letter..."}
                            </span>
                            <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpenCL ? 'rotate-180' : ''}`} />
                          </button>

                          <AnimatePresence>
                            {dropdownOpenCL && (
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-[#0c0c0e] border border-gray-300 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                              >
                                <div className="max-h-60 overflow-y-auto py-2">
                                  {Array.from(new Set(versions.map(v => v.coverLetterUrl).filter(Boolean))).length > 0 ? (
                                    <>
                                      <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Previous Uploads</div>
                                      {Array.from(new Set(versions.map(v => v.coverLetterUrl).filter(Boolean))).map((url: any) => (
                                        <button
                                          key={url}
                                          type="button"
                                          onClick={() => {
                                            setFormData({...formData, coverLetterUrl: url});
                                            setDropdownOpenCL(false);
                                          }}
                                          className="w-full px-4 py-2.5 text-left text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-colors font-sans text-black dark:text-gray-300"
                                        >
                                          {url.split('/').pop()?.split('_').slice(2).join('_') || "Previous Cover Letter"}
                                        </button>
                                      ))}
                                    </>
                                  ) : (
                                    <div className="px-4 py-4 text-center text-xs text-gray-500 font-sans">No previous cover letters found</div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <p className="text-[11px] text-gray-500 px-1 font-sans">
                          Choose from cover letters you've previously uploaded.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 bg-gray-100 dark:bg-white/5 rounded-xl font-semibold text-sm transition-colors text-gray-800 dark:text-gray-400 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 bg-primary text-white rounded-xl font-semibold text-sm shadow-xl shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

      <ConfirmModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          try {
            await deleteVersion(deleteId);
            fetchVersions();
          } catch (error) {
            console.error("Failed to delete version:", error);
          }
          setDeleteId(null);
        }}
        title="Delete Version"
        description="Are you sure you want to delete this version? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
