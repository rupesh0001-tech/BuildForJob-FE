import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  profession: string;
  image: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  is_current: boolean;
  _id?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduation_date: string;
  gpa: string;
  _id?: string;
}

export interface Project {
  name: string;
  type: string;
  description: string;
  _id?: string;
}

export interface ResumeState {
  personalInfoData: PersonalInfo;
  professionalSummaryData: string;
  experienceData: Experience[];
  educationData: Education[];
  projectData: Project[];
  skillData: string[];
  template: string;
  accentColor: string;
}

const initialState: ResumeState = {
  personalInfoData: {
    full_name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    profession: "",
    image: "",
  },
  professionalSummaryData: "",
  experienceData: [],
  educationData: [],
  projectData: [],
  skillData: [],
  template: "classic",
  accentColor: "#4E61D3",
};

export const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setPersonalInfo: (state, action: PayloadAction<PersonalInfo>) => {
      state.personalInfoData = action.payload;
    },
    setProfessionalSummary: (state, action: PayloadAction<string>) => {
      state.professionalSummaryData = action.payload;
    },
    setExperience: (state, action: PayloadAction<Experience[]>) => {
      state.experienceData = action.payload;
    },
    setEducation: (state, action: PayloadAction<Education[]>) => {
      state.educationData = action.payload;
    },
    setProject: (state, action: PayloadAction<Project[]>) => {
      state.projectData = action.payload;
    },
    setSkill: (state, action: PayloadAction<string[]>) => {
      state.skillData = action.payload;
    },
    setTemplate: (state, action: PayloadAction<string>) => {
      state.template = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
    updateResume: (state, action: PayloadAction<Partial<ResumeState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setPersonalInfo,
  setProfessionalSummary,
  setExperience,
  setEducation,
  setProject,
  setSkill,
  setTemplate,
  setAccentColor,
  updateResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
