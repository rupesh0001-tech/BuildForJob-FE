import Link from "next/link";
import { Briefcase } from "lucide-react";
import React from "react";

export function SidebarBrand() {
  return (
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
  );
}
