"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/general/sidebar/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/providers/protected-route";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBuilderPage = pathname === "/dashboard/resume-builder" || pathname === "/dashboard/cover-letter";
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isBuilderPage);
  const [hasActiveModal, setHasActiveModal] = useState(false);

  // Close sidebar when navigating to builder pages
  React.useEffect(() => {
    if (isBuilderPage) {
      setIsSidebarOpen(false);
    } else {
       setIsSidebarOpen(true);
    }
  }, [isBuilderPage]);

  // Monitor DOM for active modals to auto-collapse the sidebar
  React.useEffect(() => {
    const checkModal = () => {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      const hasDialog = dialogs.length > 0;
      
      // Also look for elements with high z-indices or backdrop filters
      const hasModalBackdrop = Array.from(document.querySelectorAll('div')).some(el => {
        const className = el.className || "";
        return className.includes('fixed') && className.includes('inset-0') && (
          className.includes('z-50') ||
          className.includes('z-[100]') ||
          className.includes('z-[110]') ||
          className.includes('bg-black/') ||
          className.includes('backdrop-blur')
        );
      });

      setHasActiveModal(hasDialog || hasModalBackdrop);
    };

    // Initial check
    checkModal();

    const observer = new MutationObserver(() => {
      checkModal();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const shouldSidebarBeOpen = hasActiveModal ? false : isSidebarOpen;

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white dark:bg-[#08080a] overflow-hidden selection:bg-primary/30 transition-colors duration-300">
        {/* Background Decor */}
        <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#001BB7 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
        
        <Sidebar 
          isOpen={shouldSidebarBeOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          isOverlay={isBuilderPage}
        />
        
        {/* Overlay for Builders */}
        {isBuilderPage && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-md z-45" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <div className={cn(
          "flex flex-col flex-1 min-w-0 overflow-hidden relative z-10 transition-all duration-300",
        )}>
          <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          
          <main className={cn(
            "flex-1 overflow-y-auto p-6 md:p-8 relative transition-all duration-500 ease-in-out",
            isBuilderPage && isSidebarOpen && "blur-md pointer-events-none"
          )}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
