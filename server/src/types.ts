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

export interface UserProfile {
  name: string;
  age: number;
  state: string;
  interests: string[];
}

export interface SummaryResponse {
  billId: number;
  summary: string;
}
