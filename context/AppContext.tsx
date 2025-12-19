import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Campaign, ItemNeed, VolunteerNeed, DonationRecord, VolunteerRecord } from '../types';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Define the return type for auth functions
interface AuthResponse {
  success: boolean;
  error?: string | null;
}

interface AppContextType {
  campaigns: Campaign[];
  items: ItemNeed[];
  volunteerNeeds: VolunteerNeed[];
  donations: DonationRecord[];
  volunteerings: VolunteerRecord[];
  isAdminAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  addCampaign: (c: Omit<Campaign, 'id'>) => Promise<void>;
  updateCampaign: (c: Campaign) => Promise<void>;
  addItemNeed: (i: Omit<ItemNeed, 'id' | 'totaldonated'>) => Promise<void>;
  addVolunteerNeed: (v: Omit<VolunteerNeed, 'id' | 'totalfilled'>) => Promise<void>;
  registerDonation: (d: Omit<DonationRecord, 'id'>) => Promise<void>;
  registerVolunteering: (v: Omit<VolunteerRecord, 'id'>) => Promise<void>;
  login: (email: string, p: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [items, setItems] = useState<ItemNeed[]>([]);
  const [volunteerNeeds, setVolunteerNeeds] = useState<VolunteerNeed[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [volunteerings, setVolunteerings] = useState<VolunteerRecord[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const getTableNameFromContext = (context: string): string => {
    if (context.includes('campanha')) return 'campaigns';
    if (context.includes('item')) return 'items';
    if (context.includes('vaga de voluntário')) return 'volunteer_needs';
    if (context.includes('doação')) return 'donations';
    if (context.includes('voluntariado')) return 'volunteerings';
    return '[tabela correspondente]';
  };

  // Centralized, robust error handler
  const handleSupabaseError = (error: any, context: string) => {
    // Log the raw error object for developers who need deep inspection
    console.debug(`Raw error object for context [${context}]:`, error);
    if (!error) return;

    let errorMessage = 'Ocorreu um erro desconhecido.';
    let isRLSError = false;

    // --- Message Extraction Logic ---
    if (error && typeof error.message === 'string') {
        errorMessage = error.message;
        if (typeof error.details === 'string' && error.details) errorMessage += `\nDetalhes: ${error.details}`;
        if (typeof error.hint === 'string' && error.hint) errorMessage += `\nSugestão: ${error.hint}`;
    } 
    else if (error instanceof Error) { errorMessage = error.message; }
    else if (typeof error === 'string') { errorMessage = error; }
    else {
        try {
            const errorString = JSON.stringify(error);
            if (errorString !== '{}') errorMessage = errorString;
        } catch { /* use default message */ }
    }
    
    // Replace the old console.error with a more readable one
    console.error(`Error context: [${context}] | Message: ${errorMessage.replace(/\n/g, ' ')}`);

    // --- RLS Check and User-Friendly Alert ---
    if ((error && error.code === '42501') || errorMessage.includes('violates row-level security policy')) {
        isRLSError = true;
    }

    if (isRLSError) {
        const tableName = getTableNameFromContext(context);
        alert(
`🛑 AÇÃO NECESSÁRIA: ERRO DE PERMISSÃO 🛑

A operação "${context}" foi bloqueada pelo banco de dados.

Isto quase sempre significa que a regra de segurança (Policy) para a tabela "${tableName}" está faltando.

✅ COMO CORRIGIR:
1. Vá para o seu painel do Supabase.
2. Vá para: Database > Policies.
3. Encontre a tabela "${tableName}" e clique em "New Policy".
4. Use o template "Enable INSERT for authenticated users".
5. Salve e tente novamente.

A aplicação não pode salvar dados sem esta permissão.`
        );
    } else {
        alert(`Erro ao ${context}:\n\n${errorMessage}`);
    }
  };

  useEffect(() => {
    // Check for an active session on initial load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAdminAuthenticated(!!session);
      fetchData(); // Fetch data after checking session
    };
    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminAuthenticated(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        campaignsRes,
        itemsRes,
        volunteerNeedsRes,
        donationsRes,
        volunteeringsRes
      ] = await Promise.all([
        supabase.from('campaigns').select('*'),
        supabase.from('items').select('*'),
        supabase.from('volunteer_needs').select('*'),
        supabase.from('donations').select('*'),
        supabase.from('volunteerings').select('*')
      ]);

      if (campaignsRes.data) setCampaigns(campaignsRes.data);
      if (itemsRes.data) setItems(itemsRes.data);
      if (volunteerNeedsRes.data) setVolunteerNeeds(volunteerNeedsRes.data);
      if (donationsRes.data) setDonations(donationsRes.data);
      if (volunteeringsRes.data) setVolunteerings(volunteeringsRes.data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCampaign = async (c: Omit<Campaign, 'id'>) => {
    const { data, error } = await supabase.from('campaigns').insert(c).select().single();
    if (error) {
      handleSupabaseError(error, "adicionar campanha");
      return;
    }
    if (data) setCampaigns(prev => [...prev, data]);
  };
  
  const updateCampaign = async (updated: Campaign) => {
    const { data, error } = await supabase.from('campaigns').update(updated).eq('id', updated.id).select().single();
     if (error) {
      handleSupabaseError(error, "atualizar campanha");
      return;
    }
    if (data) setCampaigns(campaigns.map(c => (c.id === data.id ? data : c)));
  };

  const addItemNeed = async (i: Omit<ItemNeed, 'id' | 'totaldonated'>) => {
    const { data, error } = await supabase.from('items').insert({ ...i, totaldonated: 0 }).select().single();
    if (error) {
      handleSupabaseError(error, "adicionar item necessário");
      return;
    }
    if (data) setItems(prev => [...prev, data]);
  };
  
  const addVolunteerNeed = async (v: Omit<VolunteerNeed, 'id' | 'totalfilled'>) => {
    const { data, error } = await supabase.from('volunteer_needs').insert({ ...v, totalfilled: 0 }).select().single();
    if (error) {
      handleSupabaseError(error, "adicionar vaga de voluntário");
      return;
    }
    if (data) setVolunteerNeeds(prev => [...prev, data]);
  };

  const registerDonation = async (d: Omit<DonationRecord, 'id'>) => {
    // This should ideally be a transaction or an RPC call in Supabase for atomicity
    const { data, error } = await supabase.from('donations').insert(d).select().single();
    if (error || !data) {
      handleSupabaseError(error, "registrar doação");
      return;
    }
    
    // Update local state immediately for better UX
    setDonations(prev => [...prev, data]);
    const originalItem = items.find(i => i.id === d.itemid);
    if (originalItem) {
        const newTotalDonated = originalItem.totaldonated + d.quantity;
        setItems(items.map(i => i.id === d.itemid ? { ...i, totaldonated: newTotalDonated } : i));
        
        // Update the item count in the database
        const { error: updateError } = await supabase
          .from('items')
          .update({ totaldonated: newTotalDonated })
          .eq('id', d.itemid);
        if (updateError) {
          handleSupabaseError(updateError, "atualizar total de doações");
          // Optionally revert local state on failure
          setItems(items);
          setDonations(donations);
        }
    }
  };

  const registerVolunteering = async (v: Omit<VolunteerRecord, 'id'>) => {
    const { data, error } = await supabase.from('volunteerings').insert(v).select().single();
     if (error || !data) {
      handleSupabaseError(error, "registrar voluntariado");
      return;
    }

    setVolunteerings(prev => [...prev, data]);
    const originalNeed = volunteerNeeds.find(n => n.id === v.needid);
    if(originalNeed) {
      const newTotalFilled = originalNeed.totalfilled + 1;
      setVolunteerNeeds(needs => needs.map(n => n.id === v.needid ? { ...n, totalfilled: newTotalFilled } : n));
    
      const { error: updateError } = await supabase
        .from('volunteer_needs')
        .update({ totalfilled: newTotalFilled })
        .eq('id', v.needid);
      if (updateError) handleSupabaseError(updateError, "atualizar total de voluntários");
    }
  };

  const login = async (email: string, p: string): Promise<AuthResponse> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: p });
    if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AppContext.Provider value={{
      campaigns, items, volunteerNeeds, donations, volunteerings, isAdminAuthenticated, loading,
      addCampaign, updateCampaign, addItemNeed, addVolunteerNeed, registerDonation, registerVolunteering,
      login, logout
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