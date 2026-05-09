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
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getVersions, createVersion, deleteVersion } from "@/apis/versions.api";

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
  const [showModal, setShowModal] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    versionName: "",
    companyName: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [clFile, setClFile] = useState<File | null>(null);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      setLoading(true);
      const data = await getVersions();
      setVersions(data);
    } catch (error) {
      console.error("Failed to fetch versions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile || !formData.versionName || !formData.companyName) return;

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("versionName", formData.versionName);
      data.append("companyName", formData.companyName);
      data.append("resume", resumeFile);
      if (clFile) data.append("coverLetter", clFile);

      await createVersion(data);
      setShowModal(false);
      resetForm();
      fetchVersions();
    } catch (error) {
      console.error("Failed to create version:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this version?")) return;
    try {
      await deleteVersion(id);
      fetchVersions();
    } catch (error) {
      console.error("Failed to delete version:", error);
    }
  };

  const resetForm = () => {
    setFormData({ versionName: "", companyName: "" });
    setResumeFile(null);
    setClFile(null);
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
      {/* <div className="flex items-center justify-between gap-4 bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-300 dark:border-white/10 shadow-sm">
        <div className="relative flex-1 max-w-md"> */}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search versions or companies..."
            className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        {/* </div>
      </div> */}

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
                        <a
                          href={v.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold flex items-center gap-2 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 transition-colors"
                        >
                          <Download size={14} />
                          Resume
                        </a>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider px-1">Resume Upload</label>
                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        required
                        className="hidden"
                        id="resume-upload"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      />
                      <label
                        htmlFor="resume-upload"
                        className={`flex flex-col items-center justify-center gap-2 w-full p-6 bg-gray-50 dark:bg-white/5 border-2 border-dashed ${resumeFile ? 'border-green-600 bg-green-50/10' : 'border-gray-300 dark:border-white/10'} hover:border-primary rounded-xl transition-all group-hover:bg-primary/5 cursor-pointer`}
                      >
                        <Upload size={24} className={resumeFile ? "text-green-600" : "text-primary"} />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
                          {resumeFile ? resumeFile.name : "Choose Resume PDF"}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider px-1">Cover Letter Upload</label>
                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        id="cl-upload"
                        onChange={(e) => setClFile(e.target.files?.[0] || null)}
                      />
                      <label
                        htmlFor="cl-upload"
                        className={`flex flex-col items-center justify-center gap-2 w-full p-6 bg-gray-50 dark:bg-white/5 border-2 border-dashed ${clFile ? 'border-green-600 bg-green-50/10' : 'border-gray-300 dark:border-white/10'} hover:border-purple-500 rounded-xl transition-all group-hover:bg-purple-500/5 cursor-pointer`}
                      >
                        <Upload size={24} className={clFile ? "text-green-600" : "text-purple-500"} />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-purple-600 transition-colors">
                          {clFile ? clFile.name : "Choose Cover Letter PDF"}
                        </span>
                      </label>
                    </div>
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
    </div>
  );
}
