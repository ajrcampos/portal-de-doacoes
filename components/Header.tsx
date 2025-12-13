import React from 'react';
import { ViewState } from '../types';
import { Button } from './ui/Button';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  const { isAdminAuthenticated, logout } = useApp();

  return (
    <header className="bg-brand-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => onNavigate(ViewState.HOME)}
        >
           {/* Simple Icon */}
           <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-800 font-bold text-xl">
             IR
           </div>
           <div>
             <h1 className="text-xl font-bold leading-tight">Portal de Doações e Voluntariado</h1>
             <p className="text-xs text-brand-200 uppercase tracking-wide">Fraternidade Irmão Rafael</p>
           </div>
        </div>

        <div className="flex gap-2">
          {currentView !== ViewState.HOME && (
             <Button variant="secondary" onClick={() => onNavigate(ViewState.HOME)}>
               Início
             </Button>
          )}

          {isAdminAuthenticated ? (
            <div className="flex gap-2">
              <Button 
                variant="primary" 
                onClick={() => onNavigate(ViewState.ADMIN_DASHBOARD)}
                className="bg-brand-600 border border-brand-400"
              >
                Painel Admin
              </Button>
              <Button variant="danger" onClick={() => { logout(); onNavigate(ViewState.HOME); }}>
                Sair
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="text-white border-white hover:bg-brand-700" onClick={() => onNavigate(ViewState.ADMIN_LOGIN)}>
              Área Admin
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};