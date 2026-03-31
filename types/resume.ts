import { ResumeState } from "@/lib/store/features/resume-slice";

export interface TemplateProps {
  data: {
    personal_info: ResumeState["personalInfoData"];
    professional_summary: string;
    experience: ResumeState["experienceData"];
    education: ResumeState["educationData"];
    project: ResumeState["projectData"];
    skills: string[];
  };
  accentColor: string;
}
