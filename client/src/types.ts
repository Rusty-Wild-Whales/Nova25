export interface Bill {
  id: number;
  title: string;
  state: string;
  category: string;
  dateIntroduced: string;
  text: string;
  source?: string;
  status?: string;
  tags?: string[];
  excerpt?: string;
}

export interface SummaryResponse {
  billId: number;
  summary: string;
}

export interface UserProfile {
  name: string;
  age: number;
  state: string;
  interests: string[];
  email?: string;
  policyFocus?: string;
  newsFrequency?: "daily" | "weekly" | "monthly";
  contactPreference?: "email" | "sms" | "none";
  sendAlerts?: boolean;
  notes?: string;
}
