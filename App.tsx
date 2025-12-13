import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PublicCampaignList } from './components/PublicCampaignList';
import { CampaignDetail } from './components/CampaignDetail';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ViewState, Campaign } from './types';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const { isAdminAuthenticated } = useApp();

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <Header onNavigate={navigateTo} currentView={currentView} />
      
      <main className="flex-grow">
        {currentView === ViewState.HOME && (
          <PublicCampaignList onSelectCampaign={handleCampaignSelect} />
        )}
        
        {currentView === ViewState.CAMPAIGN_DETAIL && selectedCampaign && (
          <CampaignDetail 
            campaign={selectedCampaign} 
            onBack={() => navigateTo(ViewState.HOME)} 
          />
        )}

        {currentView === ViewState.ADMIN_LOGIN && (
          <AdminLogin 
            onSuccess={() => setCurrentView(ViewState.ADMIN_DASHBOARD)} 
            onCancel={() => setCurrentView(ViewState.HOME)} 
          />
        )}

        {currentView === ViewState.ADMIN_DASHBOARD && (
          <AdminDashboard />
        )}
      </main>

      <footer className="bg-slate-200 py-6 text-center text-slate-500 text-sm">
        <p>© 2023 Fraternidade Irmão Rafael - Amor e Caridade</p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;