import api from './axiosInstance';

export interface Resume {
  id: string;
  title: string;
  template: string;
  content: any;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    versions: number;
  };
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  company: string;
  role: string;
  content: any;
  status: string;
  createdAt: string;
}

export const resumeApi = {
  create: async (data: { title?: string; template?: string; content?: any; isDraft?: boolean }) => {
    const response = await api.post('/resumes', data);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  update: async (id: string, data: { title?: string; template?: string; content?: any; isDraft?: boolean }) => {
    const response = await api.patch(`/resumes/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  createVersion: async (resumeId: string, data: { company: string; role: string; content: any }) => {
    const response = await api.post(`/resumes/${resumeId}/versions`, data);
    return response.data;
  },

  getVersions: async (resumeId: string) => {
    const response = await api.get(`/resumes/${resumeId}/versions`);
    return response.data;
  }
};
