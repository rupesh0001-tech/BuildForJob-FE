"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";
import { Loader2 } from "lucide-react";
import { generatePortfolioHtml, PortfolioData } from "../dashboard/portfolio/template-generator";

export default function PortfolioPreviewPage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try to read from localStorage first
    const savedDraft = localStorage.getItem("portfolio_builder_draft");
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft) as PortfolioData;
        setPortfolioData(parsed);
        setLoading(false);
        return;
      } catch (err) {
        console.error("Failed to parse portfolio draft from localStorage", err);
      }
    }

    // 2. If no draft, fetch from profile
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // If we have the user profile and no draft was loaded yet
    if (user && !portfolioData && loading) {
      const data: PortfolioData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        jobTitle: user.jobTitle || "",
        email: user.email || "",
        location: user.location || "",
        avatarUrl: user.avatarUrl || "",
        bio: user.bio || "",
        githubUrl: user.socialLinks?.github || "",
        linkedinUrl: user.socialLinks?.linkedin || "",
        twitterUrl: user.socialLinks?.twitter || "",
        instagramUrl: "https://www.instagram.com/",
        skills: user.skills ? user.skills.map((s) => ({ name: s.name })) : [],
        projects: user.projects ? user.projects.map((p) => ({
          name: p.name,
          techStack: p.techStack || "",
          description: p.description || "",
          githubUrl: user.socialLinks?.github ? `${user.socialLinks.github}/${p.name.toLowerCase().replace(/\s+/g, "-")}` : "#",
          liveUrl: "#"
        })) : [],
        brandColor: "#ffb400",
        themeMode: "light",
        resumeUrl: user.socialLinks?.website || "public/images/rupesh-resume.pdf"
      };
      setPortfolioData(data);
      setLoading(false);
    }
  }, [user, portfolioData, loading]);

  // If still loading and we have no data
  if (loading && (isLoading || !portfolioData)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 text-gray-800">
        <Loader2 className="animate-spin text-[#001BB7] mb-4" size={40} />
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest animate-pulse">
          Generating Portfolio Preview...
        </p>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 text-gray-800 p-6">
        <h1 className="text-2xl font-bold text-red-500 mb-2">No Portfolio Data Found</h1>
        <p className="text-gray-500 max-w-md">
          Please open the Portfolio Builder in the dashboard first to initialize your draft profile.
        </p>
      </div>
    );
  }

  const generatedHtml = generatePortfolioHtml(portfolioData);

  return (
    <div className="w-screen h-screen overflow-hidden bg-white">
      <iframe
        title="Portfolio Full Screen Preview"
        srcDoc={generatedHtml}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-downloads"
      />
    </div>
  );
}
