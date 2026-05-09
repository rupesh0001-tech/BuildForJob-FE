"use client";

import React from 'react';
import { History, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const versions = [
  {
    id: "v3",
    name: "Senior Frontend Dev - Google",
    date: "2 hours ago",
    status: "Optimized",
    score: 92
  },
  {
    id: "v2",
    name: "Fullstack Engineer - Meta",
    date: "Yesterday",
    status: "Draft",
    score: 85
  },
  {
    id: "v1",
    name: "Software Engineer - General",
    date: "3 days ago",
    status: "Legacy",
    score: 78
  }
];

export function VersionsPreview() {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">Recent Versions</h2>
        <Link 
          href="/dashboard/resumes/versions" 
          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {versions.map((version, index) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-500/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                <History size={18} />
              </div>
            </div>
            
            <h3 className="font-semibold text-black dark:text-white mb-1 truncate" title={version.name}>
              {version.name}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
              <Clock size={12} />
              {version.date}
            </div>
            
            <div className="flex items-center gap-2">
              <Link 
                href={`/dashboard/resumes/edit/${version.id}`}
                className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                Edit Version
              </Link>
              <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/10" />
              <Link 
                href={`/dashboard/resumes/preview/${version.id}`}
                className="text-[11px] font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Preview
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
