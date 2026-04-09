"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export function ProfileCompletionBanner() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const calculateCompletion = () => {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'location', 'jobTitle', 'bio'];
    const completed = fields.filter(field => !!user[field as keyof typeof user]);
    return Math.round((completed.length / fields.length) * 100);
  };

  const completionPercent = calculateCompletion();

  if (completionPercent >= 100) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8 relative overflow-hidden rounded-2xl bg-linear-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border border-purple-500/20 p-6 backdrop-blur-sm"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-black dark:text-white">Complete your profile</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">You've completed {completionPercent}% of your profile. A complete profile helps you build better resumes.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex-1 md:w-48">
              <div className="h-2 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercent}%` }}
                  className="h-full bg-linear-to-r from-purple-500 to-blue-500"
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider">PROGRESS</span>
                <span className="text-[10px] font-bold text-purple-500">{completionPercent}%</span>
              </div>
            </div>
            
            <Link 
              href="/dashboard/settings/profile"
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/10 hover:bg-purple-500 hover:text-white dark:hover:bg-purple-500 transition-all rounded-2xl text-sm font-bold shadow-sm whitespace-nowrap"
            >
              Finish Profile <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -transtion-y-1/2 translate-x-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 transtion-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
}
