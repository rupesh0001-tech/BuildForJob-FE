"use client";

import React from "react";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";
import { 
  LayoutDashboard, FileCheck, FilePlus, Wand2, 
  Files, History, Mail, Edit, MonitorUp, Globe, 
  TrendingUp, Link as LinkIcon, Briefcase, User 
} from "lucide-react";

export const navigation = [
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
  return (
    <div className="flex h-full w-64 flex-col bg-transparent pb-4 shrink-0 transition-all duration-300">
      <SidebarBrand />
      <SidebarNav navigation={navigation} />
      <SidebarUser />
    </div>
  );
}
