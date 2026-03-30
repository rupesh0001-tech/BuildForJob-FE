"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, FileText, FileCheck, FilePlus, Wand2, 
  Files, History, Mail, Edit, MonitorUp, Globe, 
  TrendingUp, Link as LinkIcon, User, Briefcase
} from "lucide-react";

const navigation = [
  {
    title: "Dashboard",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    title: "Resumes",
    items: [
      { name: "ATS Checker", href: "/dashboard/resumes/ats", icon: FileCheck },
      { name: "Resume Builder", href: "/dashboard/resumes/builder", icon: FilePlus },
      { name: "Resume Enhancer", href: "/dashboard/resumes/enhancer", icon: Wand2 },
      { name: "My Resumes", href: "/dashboard/resumes", icon: Files },
      { name: "Resume Versions", href: "/dashboard/resumes/versions", icon: History },
    ]
  },
  {
    title: "Cover Letters",
    items: [
      { name: "Cover Letter Builder", href: "/dashboard/cover-letters/builder", icon: Edit },
      { name: "My Cover Letters", href: "/dashboard/cover-letters", icon: Mail },
    ]
  },
  {
    title: "Portfolio",
    items: [
      { name: "My Portfolios", href: "/dashboard/portfolio", icon: Globe },
      { name: "Create Portfolio", href: "/dashboard/portfolio/create", icon: MonitorUp },
    ]
  },
  {
    title: "LinkedIn Tools",
    items: [
      { name: "Profile Enhancer", href: "/dashboard/linkedin/enhancer", icon: TrendingUp },
    ]
  },
  {
    title: "Connect Profiles",
    items: [
      { name: "Connect GitHub", href: "/dashboard/connect/github", icon: LinkIcon },
      { name: "Connect LinkedIn", href: "/dashboard/connect/linkedin", icon: Briefcase },
    ]
  },
  {
    title: "Settings",
    items: [
      { name: "Profile", href: "/dashboard/settings/profile", icon: User },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col overflow-y-auto bg-gray-50/50 dark:bg-[#0c0c0e] border-r border-black/5 dark:border-white/5 pb-4">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-black/5 dark:border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-linear-to-tr from-purple-600 to-blue-500 p-1.5 rounded-lg group-hover:scale-105 transition-transform">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-black dark:text-white">
            BuildForJob
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-8 px-4 py-6">
        {navigation.map((group) => (
          <div key={group.title}>
            <h3 className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-lg transition-all group",
                      isActive
                        ? "bg-purple-500/10 text-purple-700 dark:text-purple-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"
                    )}
                  >
                    <item.icon
                      size={18}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      )}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Mini Tab */}
      <div className="px-4 mt-auto">
        <Link href="/dashboard/settings/profile" className="flex items-center gap-3 p-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
           <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs group-hover:scale-105 transition-transform">
             JD
           </div>
           <div className="flex flex-col flex-1 min-w-0">
             <span className="text-sm font-medium text-black dark:text-white truncate">Jane Doe</span>
             <span className="text-xs text-gray-500 truncate">Pro Plan</span>
           </div>
        </Link>
      </div>
    </div>
  );
}
