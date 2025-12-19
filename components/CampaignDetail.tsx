import React, { useState } from 'react';
import { Campaign, ItemNeed, VolunteerNeed, DonationRecord, VolunteerRecord } from '../types';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface Props {
  campaign: Campaign;
  onBack: () => void;
}

export const CampaignDetail: React.FC<Props> = ({ campaign, onBack }) => {
  const { items, volunteerNeeds, registerDonation, registerVolunteering } = useApp();
  const [name, setName] = useState('');
  const [activeTab, setActiveTab] = useState<'DONATE' | 'VOLUNTEER'>('DONATE');

  const campaignItems = items.filter(i => i.campaignid === campaign.id);
  const campaignNeeds = volunteerNeeds.filter(v => v.campaignid === campaign.id);

  // Determine global progress
  const totalItemReq = campaignItems.reduce((acc, i) => acc + i.totalrequired, 0);
  const totalItemDon = campaignItems.reduce((acc, i) => acc + i.totaldonated, 0);
  const itemProgress = totalItemReq > 0 ? Math.min(100, (totalItemDon / totalItemReq) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button variant="secondary" onClick={onBack} className="mb-6">← Voltar para Campanhas</Button>
      
      <div className="bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden mb-8">
        <div className="bg-brand-900 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">{campaign.title}</h2>
          <p className="text-brand-100">{campaign.description}</p>
          <div className="mt-4 flex gap-4 text-sm font-medium opacity-90">
            <span>📅 Data: {new Date(campaign.eventdate).toLocaleDateString('pt-BR')}</span>
            {campaign.haspreparation && <span>🔨 Preparo: {new Date(campaign.preparationdate!).toLocaleDateString('pt-BR')}</span>}
          </div>
        </div>
        
        <div className="p-6 bg-brand-50 border-b border-brand-100">
          <div className="flex items-center gap-4 mb-2">
             <span className="text-sm font-bold text-brand-800">Progresso Geral de Doações</span>
             <span className="text-xs text-brand-600 font-mono">{itemProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-brand-200 rounded-full h-2.5">
            <div className="bg-brand-600 h-2.5 rounded-full" style={{ width: `${itemProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-slate-100 p-6">
        <div className="mb-6">
           <label className="block text-sm font-medium text-slate-700 mb-2">Identifique-se para começar:</label>
           <Input 
             label="" 
             placeholder="Seu nome completo" 
             value={name} 
             onChange={e => setName(e.target.value)} 
             className="max-w-md border-brand-200 focus:border-brand-500"
           />
           {!name && <p className="text-xs text-amber-600 mt-1">⚠ Necessário informar o nome para doar ou se inscrever.</p>}
        </div>

        <div className="flex border-b border-slate-200 mb-6">
          <button 
            className={`px-6 py-3 font-medium ${activeTab === 'DONATE' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('DONATE')}
          >
            Doar Itens
          </button>
          <button 
             className={`px-6 py-3 font-medium ${activeTab === 'VOLUNTEER' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
             onClick={() => setActiveTab('VOLUNTEER')}
          >
            Ser Voluntário
          </button>
        </div>

        {activeTab === 'DONATE' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {campaignItems.map(item => (
               <ItemCard key={item.id} item={item} userName={name} onDonate={registerDonation} />
             ))}
             {campaignItems.length === 0 && <p className="text-slate-500">Nenhum item solicitado para esta campanha ainda.</p>}
          </div>
        )}

        {activeTab === 'VOLUNTEER' && (
          <div className="space-y-4">
            {campaignNeeds.map(need => (
              <VolunteerCard key={need.id} need={need} userName={name} onVolunteer={registerVolunteering} />
            ))}
             {campaignNeeds.length === 0 && <p className="text-slate-500">Nenhuma vaga de voluntariado aberta no momento.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components for cards

interface ItemCardProps {
  item: ItemNeed;
  userName: string;
  onDonate: (donation: Omit<DonationRecord, 'id'>) => Promise<void>;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, userName, onDonate }) => {
  const remaining = item.totalrequired - item.totaldonated;
  const [qty, setQty] = useState<number>(0);

  const handleDonate = async () => {
    if (!userName) return alert('Por favor, identifique-se no topo da página.');
    if (qty <= 0 || qty > remaining) return alert('Quantidade inválida.');
    
    await onDonate({
      campaignid: item.campaignid,
      itemid: item.id,
      itemname: item.name,
      donorname: userName,
      quantity: qty,
      date: new Date().toISOString().split('T')[0]
    });
    setQty(0);
    alert('Doação registrada com sucesso! Muito obrigado.');
  };

  return (
    <div className={`p-4 border rounded-lg flex flex-col ${remaining === 0 ? 'bg-slate-50 opacity-70' : 'bg-white border-brand-100'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-800">{item.name}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${remaining === 0 ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'}`}>
          {remaining === 0 ? 'Concluído' : 'Aberto'}
        </span>
      </div>
      <div className="text-sm text-slate-600 mb-4 space-y-1">
        <p>Meta: <span className="font-semibold">{item.totalrequired}</span></p>
        <p>Já doado: <span className="font-semibold text-green-600">{item.totaldonated}</span></p>
        <p>Restante: <span className="font-semibold text-brand-600">{remaining}</span></p>
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-100">
         {remaining > 0 ? (
           <div className="flex gap-2">
             <input 
               type="number" 
               min="1" 
               max={remaining} 
               value={qty || ''} 
               onChange={e => setQty(Number(e.target.value))}
               className="w-20 border rounded px-2 py-1 text-sm"
               placeholder="Qtd"
             />
             <Button size="sm" onClick={handleDonate} className="text-sm py-1 flex-1">Doar</Button>
           </div>
         ) : (
           <div className="text-center text-sm font-medium text-green-600">Meta atingida! 🎉</div>
         )}
      </div>
    </div>
  );
};

interface VolunteerCardProps {
  need: VolunteerNeed;
  userName: string;
  onVolunteer: (volunteering: Omit<VolunteerRecord, 'id'>) => Promise<void>;
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({ need, userName, onVolunteer }) => {
  const remaining = need.totalrequired - need.totalfilled;
  
  const handleVolunteer = async () => {
    if (!userName) return alert('Por favor, identifique-se no topo da página.');
    
    await onVolunteer({
      campaignid: need.campaignid,
      needid: need.id,
      role: need.role,
      volunteername: userName,
      date: new Date().toISOString().split('T')[0]
    });
    alert('Inscrição confirmada! Aguardamos você.');
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex-1 mb-4 md:mb-0">
        <h4 className="font-bold text-slate-800 text-lg">{need.role}</h4>
        <div className="text-sm text-slate-600 flex flex-wrap gap-4 mt-1">
          <span>📅 {new Date(need.date).toLocaleDateString('pt-BR')}</span>
          <span>⏰ {need.starttime} - {need.endtime}</span>
          <span className={`${remaining > 0 ? 'text-brand-600' : 'text-green-600'} font-medium`}>
            {remaining > 0 ? `${remaining} vagas restantes` : 'Vagas esgotadas'}
          </span>
        </div>
      </div>
      <div>
        <Button 
          disabled={remaining === 0} 
          onClick={handleVolunteer}
          variant={remaining === 0 ? 'secondary' : 'primary'}
        >
          {remaining === 0 ? 'Preenchido' : 'Inscrever-se'}
        </Button>
      </div>
    </div>
  );
};