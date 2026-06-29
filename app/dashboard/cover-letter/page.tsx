"use client";
import React from "react";
import CoverLetterForm from "@/components/cover-letter/CoverLetterForm";
import CoverLetterPreview from "@/components/cover-letter/CoverLetterPreview";
import CoverLetterThemeSelector from "@/components/cover-letter/CoverLetterThemeSelector";
import { Download, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  updatePersonalInfo, 
  updateBody, 
  updateMode,
  updateSignOff,
  updateSalutation,
  fetchCoverLetterById,
  saveCoverLetter,
  updateTitle,
  resetCoverLetterEditor,
  updateEmployerInfo
} from "@/lib/store/features/cover-letter-slice";
import { toast } from "sonner";

const CoverLetterPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { 
    currentId, 
    title, 
    isLoading,
    personalInfo,
    employerInfo,
    date,
    salutation,
    mode,
    body,
    manualContent,
    signOff,
    template
  } = useAppSelector((state) => state.coverLetter);
  
  const magic = searchParams.get("magic");
  const editId = searchParams.get("id");

  useEffect(() => {
    if (editId) {
      dispatch(fetchCoverLetterById(editId));
    } else {
      dispatch(resetCoverLetterEditor());
      
      const newTitle = searchParams.get("title");
      const companyName = searchParams.get("company");
      
      if (newTitle) dispatch(updateTitle(newTitle));
      if (companyName) dispatch(updateEmployerInfo({ companyName }));
    }
  }, [editId, dispatch, searchParams]);

  useEffect(() => {
    if (magic === "true" && user && !editId) {
      dispatch(updateMode("structured"));
      dispatch(updatePersonalInfo({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "",
        address: user.location || "",
        linkedin: user.socialLinks?.linkedin || "",
        github: user.socialLinks?.github || "",
      }));
      
      const intro = `I am writing to express my enthusiastic interest in joining your team. As a ${user.jobTitle || "professional"} with a strong background in ${user.skills?.[0]?.name || "relevant skills"}, I am confident that my experience aligns well with the goals of your organization.`;
      
      const body1 = user.experience?.[0] 
        ? `In my most recent role as a ${user.experience[0].position} at ${user.experience[0].company}, I was responsible for ${user.experience[0].description?.substring(0, 150)}... This experience allowed me to hone my skills and deliver impactful solutions.`
        : `Throughout my career and academic journey, I have developed a deep understanding of ${user.skills?.slice(0, 3).map((s: any) => s.name).join(", ") || "core industry principles"}. I take pride in my ability to solve complex problems and contribute to team success.`;
  
      const body2 = user.projects?.[0]
        ? `Through key projects like ${user.projects[0].name}, where I used ${user.projects[0].techStack}, I have demonstrated my technical proficiency and ability to manage end-to-end deliverables effectively.`
        : `I am highly motivated to bring my expertise and dedication to your company. I value continuous learning and strive to stay updated with the latest industry trends and best practices.`;
  
      const body3 = "I am particularly drawn to your organization's reputation for innovation and excellence. I am eager to contribute to your ongoing success and am excited about the possibility of bringing my unique perspective to your team.";
  
      const conclusion = "Thank you for considering my application. I look forward to the possibility of discussing how my background and skills can benefit your team in more detail during an interview.";
  
      dispatch(updateBody({ intro, body1, body2, body3, conclusion }));
      dispatch(updateSignOff("Sincerely,"));
      dispatch(updateSalutation("Dear Hiring Manager,"));
      
      toast.success("Cover letter magically generated from your profile!");
    }
  }, [magic, user, dispatch, editId]);

  const handleSave = async () => {
    const toastId = toast.loading("Saving cover letter...");
    try {
      const data = {
        title,
        company: employerInfo.companyName,
        template,
        content: {
          personalInfo,
          employerInfo,
          date,
          salutation,
          mode,
          body,
          manualContent,
          signOff
        }
      };
      
      await dispatch(saveCoverLetter({ id: currentId || undefined, data })).unwrap();
      toast.success("Cover letter saved successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error || "Failed to save cover letter", { id: toastId });
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById("cover-letter-preview");
    if (!element) return;

    const toastId = toast.loading("Generating high-quality PDF...");

    try {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
      });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (pdf.internal.pageSize.getHeight());

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
      toast.success("Cover letter downloaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.", { id: toastId });
    }
  };

  if (isLoading && editId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#001BB7]" size={40} />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest animate-pulse">Loading Cover Letter Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto space-y-6 pb-20 p-4 md:p-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/cover-letter/all"
            className="p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 hover:text-primary transition-all hover:shadow-lg"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="space-y-1">
            <input
              type="text"
              value={title}
              onChange={(e) => dispatch(updateTitle(e.target.value))}
              className="bg-transparent border-none outline-none text-xl font-bold text-gray-900 dark:text-white focus:ring-0 p-0 w-full max-w-[300px]"
              placeholder="Enter title..."
            />
            <p className="text-xs text-gray-500 flex items-center gap-1.5 uppercase tracking-wider font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Builder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white rounded-xl font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/10 active:scale-[0.98] transition-all shadow-sm"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center h-full w-full">
        {/* Form Section */}
        <div className="w-full lg:w-[420px] shrink-0 h-full overflow-y-auto custom-scrollbar">
          <CoverLetterForm />
        </div>

        {/* Preview Section */}
        <div className="w-fit bg-white/50 dark:bg-black/20 rounded-3xl border border-gray-200 dark:border-white/10 h-full p-0 overflow-hidden flex flex-col backdrop-blur-sm">
          <div className="h-full overflow-y-auto custom-scrollbar p-2 md:p-4 shadow-2xl">
            <CoverLetterPreview />
          </div>
        </div>
      </div>

    </div>
  );
};

export default CoverLetterPage;
