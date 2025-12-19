import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PublicCampaignList } from './components/PublicCampaignList';
import { CampaignDetail } from './components/CampaignDetail';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ViewState, Campaign } from './types';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { ConfigurationError } from './components/ConfigurationError';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const { isAdminAuthenticated, loading } = useApp();

  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCurrentView(ViewState.CAMPAIGN_DETAIL);
  };

  // Protected route logic
  const navigateTo = (view: ViewState) => {
    if (view === ViewState.ADMIN_DASHBOARD && !isAdminAuthenticated) {
      setCurrentView(ViewState.ADMIN_LOGIN);
    } else {
      setCurrentView(view);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-slate-500">Carregando dados...</p>
        </div>
      );
    }

    switch (currentView) {
      case ViewState.HOME:
        return <PublicCampaignList onSelectCampaign={handleCampaignSelect} />;
      case ViewState.CAMPAIGN_DETAIL:
        return selectedCampaign ? (
          <CampaignDetail 
            campaign={selectedCampaign} 
            onBack={() => navigateTo(ViewState.HOME)} 
          />
        ) : null;
      case ViewState.ADMIN_LOGIN:
        return (
          <AdminLogin 
            onSuccess={() => setCurrentView(ViewState.ADMIN_DASHBOARD)} 
            onCancel={() => setCurrentView(ViewState.HOME)} 
          />
        );
      case ViewState.ADMIN_DASHBOARD:
        return isAdminAuthenticated ? <AdminDashboard /> : <AdminLogin onSuccess={() => {}} onCancel={() => navigateTo(ViewState.HOME)} />;
      default:
        return <PublicCampaignList onSelectCampaign={handleCampaignSelect} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header onNavigate={navigateTo} currentView={currentView} />
      
      <main className="flex-grow flex flex-col">
        {renderContent()}
      </main>

      <footer className="bg-slate-200 py-6 text-center text-slate-500 text-sm">
        <p>© 2023 Fraternidade Irmão Rafael - Amor e Caridade</p>
      </footer>
    </div>
  );
};

function App() {
  // Se a chave do Supabase não estiver configurada, mostra uma tela de erro útil.
  if (!isSupabaseConfigured) {
    return <ConfigurationError />;
  }

  // Se estiver tudo certo, renderiza a aplicação.
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;