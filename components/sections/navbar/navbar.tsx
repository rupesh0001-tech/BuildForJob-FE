"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Sun, Moon, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Button1 } from "@/components/general/buttons/button1";

export function Navbar({ isScrolled, mobileMenuOpen, setMobileMenuOpen, theme, setTheme }: any) {
  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-white/80 dark:bg-black/60 backdrop-blur-xl border-black/5 dark:border-white/10 py-2.5 shadow-2xl shadow-purple-900/5" 
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-black to-gray-600 dark:from-white dark:to-gray-400">
            {theme === "light" ? <img src="./logo-black.png" width={140} height={140} alt="logo" /> : <img src="./logo-light.png" width={140} height={140} alt="logo" />}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-600 dark:text-gray-300">
          <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-black dark:hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">Pricing</a>
          <div className="flex gap-4 items-center ml-4 border-l border-black/10 dark:border-white/10 pl-8">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/register">
              <Button1 className="py-2.5 h-auto">
                Start Building Free
              </Button1>
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            className="text-gray-600 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-black/5 cursor-pointer dark:border-white/10 p-6 flex flex-col gap-4 shadow-2xl md:hidden"
          >
            <a href="#features" className="text-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Features</a>
            <a href="#demo" className="text-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">About us </a>
            <a href="#pricing" className="text-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Pricing</a>
            <div className="h-px bg-black/10 dark:bg-white/10 my-2 cursor-pointer " />
            <Link href="/login" className="cursor-pointer text-left text-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">Log in</Link>
            <Link href="/register" className="cursor-pointer bg-black text-white dark:bg-white dark:text-black px-5 py-3 rounded-xl mt-2 font-medium">
              Start Building Free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
