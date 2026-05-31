"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile, updateProfile } from "@/store/slices/authSlice";
import { resumeApi } from "@/apis/resume.api";
import { createCoverLetter, getAllCoverLetters, updateCoverLetter } from "@/apis/cover-letter.api";
import { 
  Sparkles, 
  Loader2, 
  Check, 
  FileText, 
  Mail, 
  Database,
  ArrowRight,
  ChevronLeft,
  PartyPopper
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const steps = [
  { label: "Syncing profile data...", icon: <Loader2 className="animate-spin" size={16} /> },
  { label: "Putting it in resume...", icon: <FileText size={16} /> },
  { label: "Drafting cover letter...", icon: <Mail size={16} /> },
  { label: "Saving documents in database...", icon: <Database size={16} /> },
  { label: "Updating sync status...", icon: <Sparkles size={16} /> }
];

export default function MagicBuildPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [resumeId, setResumeId] = useState<string>("");
  const [coverLetterId, setCoverLetterId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let active = true;

    async function runBuild() {
      try {
        // Step 0: Using profile data
        setActiveStep(0);
        if (!user) {
          throw new Error("Unable to load user profile data. Please complete your profile first.");
        }
        const freshUser = user;
        await new Promise(r => setTimeout(r, 1000));

        // Step 1: Format Resume data from profile
        if (!active) return;
        setActiveStep(1);
        const resumeData = {
          personalInfoData: {
            full_name: `${freshUser.firstName} ${freshUser.lastName}`,
            email: freshUser.email,
            phone: freshUser.phone || "",
            location: freshUser.location || "",
            linkedin: freshUser.socialLinks?.linkedin || "",
            website: freshUser.socialLinks?.website || "",
            profession: freshUser.jobTitle || "",
            image: freshUser.avatarUrl || "",
          },
          professionalSummaryData: freshUser.bio || `Ambitious ${freshUser.jobTitle || "professional"} with a background in ${freshUser.skills?.[0]?.name || "technology"}. Proven track record of delivering high-quality results.`,
          experienceData: (freshUser.experience || []).map((exp: any) => ({
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate || "",
            description: exp.description || "",
            is_current: exp.isCurrent,
          })),
          educationData: (freshUser.education || []).map((edu: any) => ({
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            graduation_date: edu.graduationDate,
            gpa: edu.gpa || "",
            graduationType: (edu.graduationType as any) || "cgpa",
          })),
          projectData: (freshUser.projects || []).map((p: any) => ({
            name: p.name,
            techStack: p.techStack || "",
            description: p.description || "",
          })),
          skillData: (freshUser.skills || []).map((s: any) => s.name),
          template: "Modern",
          accentColor: "#4E61D3",
          sectionVisibility: {
            summary: true,
            experience: true,
            education: true,
            projects: true,
            skills: true,
          }
        };
        await new Promise(r => setTimeout(r, 1000));

        // Step 2: Format Cover Letter data from profile
        if (!active) return;
        setActiveStep(2);
        
        const intro = `I am writing to express my enthusiastic interest in joining your team. As a ${freshUser.jobTitle || "professional"} with a strong background in ${freshUser.skills?.[0]?.name || "relevant skills"}, I am confident that my experience aligns well with the goals of your organization.`;
        const body1 = freshUser.experience?.[0] 
          ? `In my most recent role as a ${freshUser.experience[0].position} at ${freshUser.experience[0].company}, I was responsible for ${freshUser.experience[0].description?.substring(0, 150)}... This experience allowed me to hone my skills and deliver impactful solutions.`
          : `Throughout my career and academic journey, I have developed a deep understanding of ${freshUser.skills?.slice(0, 3).map((s: any) => s.name).join(", ") || "core industry principles"}. I take pride in my ability to solve complex problems and contribute to team success.`;
        const body2 = freshUser.projects?.[0]
          ? `Through key projects like ${freshUser.projects[0].name}, where I used ${freshUser.projects[0].techStack}, I have demonstrated my technical proficiency and ability to manage end-to-end deliverables effectively.`
          : `I am highly motivated to bring my expertise and dedication to your company. I value continuous learning and strive to stay updated with the latest industry trends and best practices.`;
        const body3 = "I am particularly drawn to your organization's reputation for innovation and excellence. I am eager to contribute to your ongoing success and am excited about the possibility of bringing my unique perspective to your team.";
        const conclusion = "Thank you for considering my application. I look forward to the possibility of discussing how my background and skills can benefit your team in more detail during an interview.";

        const coverLetterContent = {
          personalInfo: {
            fullName: `${freshUser.firstName} ${freshUser.lastName}`,
            email: freshUser.email,
            phone: freshUser.phone || "",
            address: freshUser.location || "",
            linkedin: freshUser.socialLinks?.linkedin || "",
            github: freshUser.socialLinks?.github || "",
          },
          employerInfo: {
            companyName: freshUser.experience?.[0]?.company || "Target Company",
            recipientName: "Hiring Manager",
            jobTitle: freshUser.jobTitle || "Open Role",
            address: ""
          },
          date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
          salutation: "Dear Hiring Manager,",
          mode: "structured" as const,
          body: { intro, body1, body2, body3, conclusion },
          manualContent: "",
          signOff: "Sincerely,"
        };
        await new Promise(r => setTimeout(r, 1000));

        // Step 3: Check and save documents in database
        if (!active) return;
        setActiveStep(3);

        // A. Handle Resume sync
        const resumesRes = await resumeApi.getAll();
        const existingResume = resumesRes.data?.find((r: any) => r.isMagic === true);
        
        let savedResume;
        if (existingResume) {
          // Update
          const updateRes = await resumeApi.update(existingResume.id, {
            title: "Magic Resume (Synced)",
            content: resumeData,
            isDraft: false,
            isMagic: true
          });
          savedResume = updateRes.data;
        } else {
          // Create
          const createRes = await resumeApi.create({
            title: "Magic Resume",
            content: resumeData,
            isDraft: false,
            isMagic: true
          });
          savedResume = createRes.data;
        }
        
        if (savedResume && savedResume.id) {
          setResumeId(savedResume.id);
        }

        // B. Handle Cover Letter sync
        const coverLetters = await getAllCoverLetters();
        const existingCoverLetter = coverLetters.find((c: any) => c.isMagic === true);
        
        let savedCoverLetter;
        if (existingCoverLetter) {
          // Update
          savedCoverLetter = await updateCoverLetter(existingCoverLetter.id, {
            title: "Magic Cover Letter (Synced)",
            company: freshUser.experience?.[0]?.company || "Target Company",
            template: "Modern",
            content: coverLetterContent,
            isDraft: false,
            isMagic: true
          });
        } else {
          // Create
          savedCoverLetter = await createCoverLetter({
            title: "Magic Cover Letter",
            company: freshUser.experience?.[0]?.company || "Target Company",
            template: "Modern",
            content: coverLetterContent,
            isDraft: false,
            isMagic: true
          });
        }

        if (savedCoverLetter && savedCoverLetter.id) {
          setCoverLetterId(savedCoverLetter.id);
        }
        await new Promise(r => setTimeout(r, 1000));

        // Step 4: Update sync status
        if (!active) return;
        setActiveStep(4);
        await dispatch(updateProfile({ profileSynced: true })).unwrap();
        await new Promise(r => setTimeout(r, 800));

        // Complete
        if (!active) return;
        setIsDone(true);
        setActiveStep(5);
        toast.success("Resume & Cover Letter synced successfully!");

      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || "An error occurred during generation");
      }
    };

    runBuild();

    return () => {
      active = false;
    };
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[70vh] py-12 px-6">
      <AnimatePresence mode="wait">
        {errorMessage ? (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl bg-white dark:bg-black/40 border border-red-500/20 rounded-2xl p-6 text-center space-y-6 shadow-sm"
          >
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-semibold text-black dark:text-white">Sync Failed</h2>
            <p className="text-sm text-gray-800 dark:text-gray-400">
              {errorMessage}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link 
                href="/dashboard"
                className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-white font-semibold rounded-xl text-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                Go to Dashboard
              </Link>
            </div>
          </motion.div>
        ) : !isDone ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-2xl p-6 shadow-sm text-center space-y-6 backdrop-blur-xl relative overflow-hidden"
          >
            {/* Background decor */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-16 h-16 mb-2 relative mx-auto flex items-center justify-center bg-primary/10 text-primary rounded-xl">
              <Loader2 className="animate-spin" size={24} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-black dark:text-white uppercase tracking-tight">Syncing and building...</h3>
              <p className="text-sm text-gray-600 dark:text-gray-500">Please wait while we generate and save your synced documents.</p>
            </div>
            
            <div className="w-full text-left space-y-2 pt-4">
              {steps.map((s, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    i === activeStep 
                    ? "bg-primary/5 border-primary/20 text-primary scale-[1.01]" 
                    : i < activeStep 
                    ? "opacity-50 border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-400" 
                    : "opacity-25 border-gray-200 dark:border-white/5 text-gray-500"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i <= activeStep ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-white/5 text-gray-400"}`}>
                    {i < activeStep ? <Check size={16} className="text-green-600 dark:text-green-400" /> : s.icon}
                  </div>
                  <span className="font-semibold text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl bg-white dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-2xl p-6 text-center space-y-6 shadow-sm relative overflow-hidden"
          >
            {/* Background decor */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto shadow-sm">
              <PartyPopper size={32} />
            </div>
            
            <div className="space-y-2">
               <h2 className="text-2xl font-semibold text-black dark:text-white tracking-tight">Resume & Cover Letter Ready!</h2>
               <p className="text-sm text-gray-800 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
                 Your professional resume and cover letter have been synced with your profile. They are saved in your library and ready to use!
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Link
                href={resumeId ? `/dashboard/resume-builder?id=${resumeId}` : "/dashboard/resumes"}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-primary/50 group transition-all"
              >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:scale-105 transition-transform"><FileText size={18} /></div>
                   <div className="text-left font-semibold text-black dark:text-white text-sm">Edit Resume</div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={coverLetterId ? `/dashboard/cover-letter?id=${coverLetterId}` : "/dashboard/cover-letter/all"}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-primary/50 group transition-all"
              >
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:scale-105 transition-transform"><Mail size={18} /></div>
                   <div className="text-left font-semibold text-black dark:text-white text-sm">Edit Cover Letter</div>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <button 
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:brightness-110 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <ChevronLeft size={16} />
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
