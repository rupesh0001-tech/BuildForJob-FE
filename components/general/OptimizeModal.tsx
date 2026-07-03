"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Building2, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { CompanyPickerModal } from "./CompanyPickerModal";

interface OptimizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptimize: (companyName: string, roles: string[]) => Promise<void>;
  isOptimizing: boolean;
  title?: string;
  description?: string;
}

const POPULAR_ROLES = [
  "Software Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Engineer",
  "Mobile Engineer",
  "DevOps Engineer",
  "Machine Learning Engineer"
];

export function OptimizeModal({
  isOpen,
  onClose,
  onOptimize,
  isOptimizing,
  title = "Optimize for Company",
  description = "Tailor and optimize your content for a specific target company and role."
}: OptimizeModalProps) {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyPickerOpen, setCompanyPickerOpen] = useState(false);

  // Role Selection (Max 3)
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [customRoleInput, setCustomRoleInput] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedCompany("");
      setSelectedRoles([]);
      setCustomRoleInput("");
      setCompanyPickerOpen(false);
    }
  }, [isOpen]);

  const handleRoleCheckboxChange = (role: string, checked: boolean) => {
    if (checked) {
      if (selectedRoles.length >= 3) {
        toast.warning("You can select up to 3 roles maximum.");
        return;
      }
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    }
  };

  const handleAddCustomRole = () => {
    const trimmed = customRoleInput.trim();
    if (!trimmed) return;
    if (selectedRoles.includes(trimmed)) {
      toast.warning("This role is already selected.");
      return;
    }
    if (selectedRoles.length >= 3) {
      toast.warning("You can select up to 3 roles maximum.");
      return;
    }
    setSelectedRoles([...selectedRoles, trimmed]);
    setCustomRoleInput("");
  };

  const handleRemoveRole = (role: string) => {
    setSelectedRoles(selectedRoles.filter(r => r !== role));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) {
      toast.error("Please select a target company");
      return;
    }
    if (selectedRoles.length === 0) {
      toast.error("Please select or add at least one role");
      return;
    }
    onOptimize(selectedCompany, selectedRoles);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 15 }}
            className="bg-white dark:bg-[#08080a] rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-gray-300 dark:border-white/10 relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Background blur decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />

            <div className="flex items-center justify-between mb-6 shrink-0 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black dark:text-white tracking-tight">{title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col h-full overflow-y-auto pr-1 space-y-6">
              
              {/* Company Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider px-1">Target Company *</label>
                
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <button
                    type="button"
                    onClick={() => setCompanyPickerOpen(true)}
                    className="w-full pl-11 pr-10 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left flex items-center justify-between text-black dark:text-white cursor-pointer"
                  >
                    <span className="truncate">{selectedCompany || "Select Target Company..."}</span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider px-1">
                  Target Roles * (Select up to 3)
                </label>

                {/* Popular Roles Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-1">
                  {POPULAR_ROLES.map(role => {
                    const isSelected = selectedRoles.includes(role);
                    return (
                      <label
                        key={role}
                        className={`flex items-center gap-2 p-2 border rounded-xl text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRoleCheckboxChange(role, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                        />
                        <span className="truncate">{role}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Custom Role Input */}
                <div className="flex gap-2 items-center px-1">
                  <input
                    type="text"
                    placeholder="Enter custom role (e.g. Solution Architect)"
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-xs font-semibold outline-none focus:border-primary text-black dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomRole}
                    className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Roles Badges */}
                {selectedRoles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-1 pt-1">
                    {selectedRoles.map(role => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(role)}
                          className="p-0.5 hover:bg-purple-500/20 rounded-full transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Form buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-white/5 shrink-0">
                <button
                  type="button"
                  disabled={isOptimizing}
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-gray-100 dark:bg-white/5 rounded-xl font-semibold text-sm transition-colors text-gray-800 dark:text-gray-400 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOptimizing}
                  className="flex-1 py-3.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-xl shadow-primary/20 hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isOptimizing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Run Optimization
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <CompanyPickerModal
        isOpen={companyPickerOpen}
        onClose={() => setCompanyPickerOpen(false)}
        onSelect={(companyName) => setSelectedCompany(companyName)}
        selectedValue={selectedCompany}
      />
    </AnimatePresence>
  );
}
