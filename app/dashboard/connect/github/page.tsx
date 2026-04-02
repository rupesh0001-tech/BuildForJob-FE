"use client";

import React, { useState } from "react";
import { 
  Github, ArrowRight, Loader2, User, 
  MapPin, Users, BookOpen, Star, 
  ExternalLink, Code2, Terminal, Info 
} from "lucide-react";
import { extractUsername, fetchGitHubData } from "@/lib/github/github-api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function GitHubConnectPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubData, setGithubData] = useState<any>(null);

  const handleFetch = async () => {
    const username = extractUsername(url);
    if (!username) {
      toast.error("Please enter a valid GitHub profile URL.");
      return;
    }

    setLoading(true);
    setGithubData(null);
    try {
      const data = await fetchGitHubData(username);
      setGithubData(data);
      toast.success(`Successfully fetched @${username}'s data!`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-black dark:bg-white/10 text-white dark:text-white mb-2 shadow-xl shadow-black/10 dark:shadow-white/5">
          <Github size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Connect your GitHub Profile
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
          Import your profile, repositories, and experience automatically from your GitHub.
        </p>
      </div>

      {/* Input Section */}
      <div className="relative group p-1.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="text-zinc-400 group-focus-within:text-purple-500 transition-colors">
            <Github size={20} />
          </div>
          <input
            type="text"
            placeholder="https://github.com/username"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-medium py-2"
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-md group-hover:shadow-lg"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Fetch Profile
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <div className="relative">
              <Loader2 size={48} className="animate-spin text-purple-500 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Github size={20} className="animate-pulse text-purple-500" />
              </div>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium animate-pulse">
              Fetching GitHub data...
            </p>
          </motion.div>
        )}

        {githubData && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Profile Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm space-y-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-xl">
                    <img
                      src={githubData.profile.avatar}
                      alt={githubData.profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold dark:text-zinc-100">
                      {githubData.profile.name || githubData.profile.login}
                    </h2>
                    <p className="text-zinc-500 text-sm">@{githubData.profile.login}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-white/5">
                  {githubData.profile.location && (
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <MapPin size={16} className="text-zinc-400" />
                      {githubData.profile.location}
                    </div>
                  )}
                  {githubData.profile.company && (
                    <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                      <Users size={16} className="text-zinc-400" />
                      {githubData.profile.company}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <BookOpen size={16} className="text-zinc-400" />
                    {githubData.profile.public_repos} Public Repositories
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <Users size={16} className="text-zinc-400" />
                    {githubData.profile.followers} Followers · {githubData.profile.following} Following
                  </div>
                </div>
                
                <a 
                  href={githubData.profile.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 rounded-xl text-sm font-bold transition-all text-zinc-900 dark:text-white"
                >
                  <ExternalLink size={16} />
                  View GitHub Profile
                </a>
              </div>

              <div className="md:col-span-2 space-y-6">
                {/* Languages / Skills */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm h-full flex flex-col">
                   <div className="flex items-center gap-2 mb-6">
                     <Terminal size={20} className="text-purple-500" />
                      <h3 className="text-lg font-bold">Top Languages & Skills</h3>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {githubData.skills.length > 0 ? (
                       githubData.skills.map((skill: string) => (
                         <span 
                           key={skill} 
                           className="px-4 py-2 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-xl text-sm font-bold border border-purple-500/20"
                         >
                           {skill}
                         </span>
                       ))
                     ) : (
                       <p className="text-zinc-500 italic">No languages found.</p>
                     )}
                   </div>

                   <div className="mt-8 flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <Info size={18} className="text-zinc-400" />
                        <h4 className="text-sm font-bold opacity-60">Bio</h4>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                        {githubData.profile.bio || "No bio available."}
                      </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Repositories */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <Code2 size={20} className="text-emerald-500" />
                   <h3 className="font-bold">Project Repositories</h3>
                 </div>
                 <span className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-white/10 rounded-lg text-zinc-500 dark:text-zinc-400">
                   {githubData.projects.length} Repos
                 </span>
               </div>
               <div className="divide-y divide-zinc-100 dark:divide-white/5">
                 {githubData.projects.slice(0, 10).map((project: any) => (
                   <div key={project.name} className="p-6 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all">
                     <div className="flex items-start justify-between mb-2">
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lg font-bold hover:text-purple-500 transition-colors flex items-center gap-2 group"
                        >
                          {project.name}
                          <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-500" />
                        </a>
                        <div className="flex items-center gap-3">
                           {project.tech && (
                             <span className="text-xs font-bold px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                               {project.tech}
                             </span>
                           )}
                           <div className="flex items-center gap-1 text-sm text-zinc-400 font-medium">
                              <Star size={14} />
                              {project.stars}
                           </div>
                        </div>
                     </div>
                     <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                       {project.description || "No description provided."}
                     </p>
                   </div>
                 ))}
               </div>
            </div>

            {/* README Content (If available) */}
            {githubData.readme && (
               <div className="bg-zinc-50 dark:bg-[#0c0c0e] p-8 rounded-3xl border border-zinc-200 dark:border-white/5 shadow-inner">
                 <div className="flex items-center gap-2 mb-6 text-zinc-400">
                    <BookOpen size={20} />
                    <h3 className="font-bold text-sm uppercase tracking-widest">README.md Overview</h3>
                 </div>
                 <div className="prose prose-zinc dark:prose-invert max-w-none prose-sm opacity-80 line-clamp-15 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
                    <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-500">
                      {githubData.readme}
                    </pre>
                 </div>
               </div>
            )}
            
            <div className="pt-8 flex justify-center">
              <button 
                onClick={() => toast.info("Synchronization logic would go here!")}
                className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Sync with my Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
