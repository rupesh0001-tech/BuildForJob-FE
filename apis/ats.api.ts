import api from './axiosInstance';

export interface ATSResult {
  score: number;
  details: string;
  resumeWordCount: number;
  jdWordCount: number;
}

/**
 * Uploads a PDF resume and job description to get an ATS score.
 */
export const checkATSScore = async (
  resumeFile: File,
  jobDescription: string
): Promise<ATSResult> => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  formData.append('jobDescription', jobDescription);

  const response = await api.post('/ats/check', formData);

  return response.data.data as ATSResult;
};

/**
 * Extracts raw text from a PDF resume (for preview/debug).
 */
export const extractPDFText = async (
  resumeFile: File
): Promise<{ text: string; wordCount: number; charCount: number }> => {
  const formData = new FormData();
  formData.append('resume', resumeFile);

  const response = await api.post('/ats/extract', formData);

  return response.data.data;
};
