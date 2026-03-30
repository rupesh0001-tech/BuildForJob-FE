"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/general/sidebar/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-white dark:bg-[#08080a] overflow-hidden selection:bg-purple-500/30 transition-colors duration-300">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#8b5cf6 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
      
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className={cn(
          "flex-1 overflow-y-auto p-6 md:p-8 relative transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
          !isSidebarOpen && "md:px-20 lg:px-40"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
