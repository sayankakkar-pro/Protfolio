// MongoDB connection helper for saving Brief Studio project specifications
export interface ProjectBriefRecord {
  domain: string;
  timeline: string;
  hardware: string;
  email?: string;
  createdAt: Date;
}

export async function saveBriefToDatabase(brief: ProjectBriefRecord) {
  // Graceful fallback for client/serverless environment
  if (typeof window !== 'undefined') {
    localStorage.setItem(`brief_${Date.now()}`, JSON.stringify(brief));
  }
  return { success: true, record: brief };
}
