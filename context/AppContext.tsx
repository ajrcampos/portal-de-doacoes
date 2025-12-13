import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaign, ItemNeed, VolunteerNeed, AdminUser, DonationRecord, VolunteerRecord } from '../types';

interface AppContextType {
  campaigns: Campaign[];
  items: ItemNeed[];
  volunteerNeeds: VolunteerNeed[];
  donations: DonationRecord[];
  volunteerings: VolunteerRecord[];
  admins: AdminUser[];
  isAdminAuthenticated: boolean;
  
  // Actions
  addCampaign: (c: Campaign) => void;
  updateCampaign: (c: Campaign) => void;
  addItemNeed: (i: ItemNeed) => void;
  addVolunteerNeed: (v: VolunteerNeed) => void;
  registerDonation: (d: DonationRecord) => void;
  registerVolunteering: (v: VolunteerRecord) => void;
  login: (u: string, p: string) => boolean;
  logout: () => void;
  createAdmin: (u: string, p: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Data
const INITIAL_ADMINS: AdminUser[] = [
  { username: 'iradmin', password: 'IRADMIN' }
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Campanha do Quilo - Setembro',
    description: 'Arrecadação de alimentos não perecíveis para famílias assistidas.',
    eventDate: '2023-09-20',
    isRecurring: true,
    hasPreparation: false,
    active: true,
  },
  {
    id: '2',
    title: 'Sopa Fraterna',
    description: 'Distribuição de sopa para moradores em situação de rua.',
    eventDate: '2023-09-22',
    isRecurring: true,
    hasPreparation: true,
    preparationDate: '2023-09-22',
    active: true,
  }
];

const INITIAL_ITEMS: ItemNeed[] = [
  { id: '101', campaignId: '1', name: 'Arroz (kg)', totalRequired: 50, totalDonated: 12 },
  { id: '102', campaignId: '1', name: 'Feijão (kg)', totalRequired: 30, totalDonated: 5 },
  { id: '201', campaignId: '2', name: 'Legumes Variados (kg)', totalRequired: 20, totalDonated: 20 },
  { id: '202', campaignId: '2', name: 'Pão (un)', totalRequired: 100, totalDonated: 0 },
];

const INITIAL_VOLUNTEERS: VolunteerNeed[] = [
  { id: 'v1', campaignId: '1', role: 'Coleta e Triagem', date: '2023-09-20', startTime: '08:00', endTime: '12:00', totalRequired: 10, totalFilled: 3 },
  { id: 'v2', campaignId: '2', role: 'Cozinha', date: '2023-09-22', startTime: '14:00', endTime: '18:00', totalRequired: 5, totalFilled: 5 },
  { id: 'v3', campaignId: '2', role: 'Distribuição', date: '2023-09-22', startTime: '19:00', endTime: '21:00', totalRequired: 8, totalFilled: 1 },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [items, setItems] = useState<ItemNeed[]>(INITIAL_ITEMS);
  const [volunteerNeeds, setVolunteerNeeds] = useState<VolunteerNeed[]>(INITIAL_VOLUNTEERS);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [volunteerings, setVolunteerings] = useState<VolunteerRecord[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>(INITIAL_ADMINS);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const addCampaign = (c: Campaign) => setCampaigns([...campaigns, c]);
  
  const updateCampaign = (updated: Campaign) => {
    setCampaigns(campaigns.map(c => c.id === updated.id ? updated : c));
  };

  const addItemNeed = (i: ItemNeed) => setItems([...items, i]);
  
  const addVolunteerNeed = (v: VolunteerNeed) => setVolunteerNeeds([...volunteerNeeds, v]);

  const registerDonation = (d: DonationRecord) => {
    setDonations([...donations, d]);
    setItems(items.map(i => {
      if (i.id === d.itemId) {
        return { ...i, totalDonated: i.totalDonated + d.quantity };
      }
      return i;
    }));
  };

  const registerVolunteering = (v: VolunteerRecord) => {
    setVolunteerings([...volunteerings, v]);
    setVolunteerNeeds(needs => needs.map(n => {
      if (n.id === v.needId) {
        return { ...n, totalFilled: n.totalFilled + 1 };
      }
      return n;
    }));
  };

  const login = (u: string, p: string) => {
    const admin = admins.find(a => a.username.toLowerCase() === u.toLowerCase() && a.password === p);
    if (admin) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdminAuthenticated(false);

  const createAdmin = (u: string, p: string) => {
    setAdmins([...admins, { username: u, password: p }]);
  };

  return (
    <AppContext.Provider value={{
      campaigns, items, volunteerNeeds, donations, volunteerings, admins, isAdminAuthenticated,
      addCampaign, updateCampaign, addItemNeed, addVolunteerNeed, registerDonation, registerVolunteering,
      login, logout, createAdmin
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};