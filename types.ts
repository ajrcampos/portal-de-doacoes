export interface Campaign {
  id: string;
  title: string;
  description: string;
  eventdate: string;
  isrecurring: boolean;
  haspreparation: boolean;
  preparationdate?: string;
  active: boolean;
}

export interface ItemNeed {
  id: string;
  campaignid: string;
  name: string;
  totalrequired: number;
  totaldonated: number;
}

export interface VolunteerNeed {
  id: string;
  campaignid: string;
  role: string;
  date: string;
  starttime: string;
  endtime: string;
  totalrequired: number;
  totalfilled: number;
}

export interface AdminUser {
  username: string; // Case insensitive
  password: string; // Case sensitive
}

export interface DonationRecord {
  id: string;
  campaignid: string;
  itemid: string;
  itemname: string;
  donorname: string;
  quantity: number;
  date: string;
}

export interface VolunteerRecord {
  id: string;
  campaignid: string;
  needid: string;
  role: string;
  volunteername: string;
  date: string;
}

export enum ViewState {
  HOME = 'HOME',
  CAMPAIGN_DETAIL = 'CAMPAIGN_DETAIL',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
}