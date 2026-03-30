import React from "react";
import { Sidebar } from "@/components/general/sidebar/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#08080a] overflow-hidden selection:bg-purple-500/30 transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
