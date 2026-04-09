"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, User, LogOut, Settings, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DashboardHeader({ isSidebarOpen, setIsSidebarOpen }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!mounted) {
    return (
      <header className="h-16 flex shrink-0 items-center justify-between border-b border-black/5 dark:border-white/5 px-6 lg:px-8 bg-white/50 dark:bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-white/5 border border-black/5 dark:border-white/10 animate-pulse" />
          <div className="h-5 w-32 bg-gray-200 dark:bg-white/5 rounded-full animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-white/5 border border-black/5 dark:border-white/10 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 flex shrink-0 items-center justify-between border-b border-black/5 dark:border-white/5 px-6 lg:px-8 bg-white/90 dark:bg-black/40 backdrop-blur-md z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all text-gray-700 dark:text-gray-200 cursor-pointer active:scale-95 border border-transparent hover:border-black/5 dark:hover:border-white/10"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
           {isSidebarOpen ? "Dashboard Overview" : "BuildForJob App"}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all text-gray-600 dark:text-gray-300 cursor-pointer active:scale-95 border border-transparent hover:border-black/5 dark:hover:border-white/10"
          aria-label="Toggle Dark Mode"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="h-8 w-px bg-black/10 dark:bg-white/10 mx-1" />
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 border-2 border-white dark:border-black shadow-lg shadow-purple-500/20 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-white font-bold text-xs uppercase"
          >
            {user?.firstName?.[0]}{user?.lastName?.[0] || user?.email?.[0] || 'U'}
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-[#0c0c0e] border border-gray-200 dark:border-white/10 shadow-2xl p-2 z-60 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 mb-2">
                  <p className="text-sm font-bold text-black dark:text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Link 
                    href="/dashboard/settings/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <User size={18} className="text-purple-500" />
                    My Profile
                  </Link>
                  <Link 
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <Settings size={18} className="text-gray-400" />
                    Settings
                  </Link>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-white/5">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium text-red-600 dark:text-red-400 transition-colors"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
