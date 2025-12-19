import React from 'react';
import { useApp } from '../context/AppContext';
import { Campaign } from '../types';
import { Button } from './ui/Button';

interface Props {
  onSelectCampaign: (c: Campaign) => void;
}

export const PublicCampaignList: React.FC<Props> = ({ onSelectCampaign }) => {
  const { campaigns } = useApp();
  const activeCampaigns = campaigns.filter(c => c.active);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-brand-900 mb-4">Campanhas Ativas</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Contribua com a Fraternidade Irmão Rafael. Selecione uma campanha abaixo para doar itens ou oferecer seu trabalho voluntário. Sua ajuda faz a diferença!
        </p>
      </div>

      {activeCampaigns.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow border border-slate-200">
          <p className="text-xl text-slate-500">Nenhuma campanha ativa no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-slate-100 overflow-hidden flex flex-col">
              <div className="h-3 bg-brand-500 w-full"></div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                   <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded uppercase tracking-wider">
                     {new Date(campaign.eventdate).toLocaleDateString('pt-BR')}
                   </span>
                   {campaign.isrecurring && <span className="text-xs text-slate-400" title="Recorrente">🔄</span>}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{campaign.title}</h3>
                <p className="text-slate-600 mb-6 text-sm flex-1">{campaign.description}</p>
                
                <div className="mt-auto">
                  <Button onClick={() => onSelectCampaign(campaign)} className="w-full">
                    Quero Participar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};