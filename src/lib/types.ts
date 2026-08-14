export interface SubsystemDetail {
  title: string;
  badge: string;
  specs: string[];
}

export interface BriefConfig {
  domain: string;
  timeline: string;
  hardware: string;
}

export interface AchievementItem {
  number: string;
  unit?: string;
  label: string;
  title: string;
  description: string;
  accentColor: string;
}
