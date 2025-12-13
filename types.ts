export interface Campaign {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  isRecurring: boolean;
  hasPreparation: boolean;
  preparationDate?: string;
  active: boolean;
}

export interface ItemNeed {
  id: string;
  campaignId: string;
  name: string;
  totalRequired: number;
  totalDonated: number;
}

export interface VolunteerNeed {
  id: string;
  campaignId: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
  totalRequired: number;
  totalFilled: number;
}

export interface AdminUser {
  username: string; // Case insensitive
  password: string; // Case sensitive
}

export interface DonationRecord {
  id: string;
  campaignId: string;
  itemId: string;
  itemName: string;
  donorName: string;
  quantity: number;
  date: string;
}

export interface VolunteerRecord {
  id: string;
  campaignId: string;
  needId: string;
  role: string;
  volunteerName: string;
  date: string;
}

export enum ViewState {
  HOME = 'HOME',
  CAMPAIGN_DETAIL = 'CAMPAIGN_DETAIL',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}