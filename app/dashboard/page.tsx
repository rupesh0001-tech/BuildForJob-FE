import React from 'react';
import { FilePlus, Edit, MonitorUp, TrendingUp, Sparkles, Activity } from 'lucide-react';

export default function DashboardOverviewPage() {
  return (
    <div className="max-w-6xl mx-auto animation-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
          Welcome back, Jane <span className="text-xl">👋</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here is what is happening with your job search today.</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Card 1 */}
           <button className="text-left flex flex-col items-start p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all group shadow-xs cursor-pointer">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <FilePlus size={20} />
              </div>
              <h3 className="font-semibold text-black dark:text-white mb-1">Create Resume</h3>
              <p className="text-sm text-gray-500 text-left">Build a new targeted ATS-friendly resume from scratch.</p>
           </button>
           
           {/* Card 2 */}
           <button className="text-left flex flex-col items-start p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group shadow-xs cursor-pointer">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Edit size={20} />
              </div>
              <h3 className="font-semibold text-black dark:text-white mb-1">Write Cover Letter</h3>
              <p className="text-sm text-gray-500 text-left">Generate a custom AI cover letter for your next job.</p>
           </button>

           {/* Card 3 */}
           <button className="text-left flex flex-col items-start p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all group shadow-xs cursor-pointer">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <MonitorUp size={20} />
              </div>
              <h3 className="font-semibold text-black dark:text-white mb-1">GitHub Portfolio</h3>
              <p className="text-sm text-gray-500 text-left">Sync repositories into a stunning web portfolio.</p>
           </button>
        </div>
      </div>

      {/* Stats / Overview Row */}
      <h2 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">Recent Activity & Stats</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Activity Feeds */}
         <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-xs flex flex-col justify-center min-h-[250px] relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.05),transparent_50%)] pointer-events-none" />
             <div className="text-center z-10 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border border-black/5 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex items-center justify-center mb-4 text-purple-500">
                  <Activity size={24} />
                </div>
                <h3 className="text-lg font-medium text-black dark:text-white mb-2">No recent generation activity.</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Start building a resume or generating a cover letter to see your statistics dashboard populate here.</p>
             </div>
         </div>

         {/* Usage Row */}
         <div className="lg:col-span-1 rounded-2xl border border-gray-200 dark:border-white/10 bg-linear-to-b from-purple-50/50 to-white dark:from-purple-900/10 dark:to-transparent p-6 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium mb-6">
                <Sparkles size={18} /> Pro Limits Tracker
              </div>
              
              <div className="space-y-6">
                 <div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-600 dark:text-gray-300">AI Rewrites</span>
                     <span className="font-medium text-black dark:text-white">12 / 50</span>
                   </div>
                   <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                     <div className="h-full bg-purple-500 rounded-full w-[24%]" />
                   </div>
                 </div>
                 
                 <div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-600 dark:text-gray-300">ATS Scans</span>
                     <span className="font-medium text-black dark:text-white">4 / 10</span>
                   </div>
                   <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full w-[40%]" />
                   </div>
                 </div>

                 <div>
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-600 dark:text-gray-300">Portfolios Rendered</span>
                     <span className="font-medium text-black dark:text-white">1 / 3</span>
                   </div>
                   <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full w-[33.3%]" />
                   </div>
                 </div>
              </div>
            </div>
            
            <button className="w-full mt-8 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-black/10 dark:shadow-white/5 cursor-pointer">
              Upgrade Plan
            </button>
         </div>
      </div>
    </div>
  );
}
