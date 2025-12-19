import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Campaign, ItemNeed, VolunteerNeed } from '../types';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type Tab = 'CAMPAIGNS' | 'NEEDS' | 'REPORTS' | 'USERS';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('CAMPAIGNS');

  const TabButton = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
        activeTab === tab
          ? 'border-brand-600 text-brand-700'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Painel de Administração</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
        <div className="flex border-b border-slate-200 px-4 overflow-x-auto">
          <TabButton tab="CAMPAIGNS" label="Gerenciar Campanhas" />
          <TabButton tab="NEEDS" label="Itens e Voluntários" />
          <TabButton tab="REPORTS" label="Relatórios e Acompanhamento" />
          <TabButton tab="USERS" label="Usuários Admin" />
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'CAMPAIGNS' && <CampaignsTab />}
          {activeTab === 'NEEDS' && <NeedsTab />}
          {activeTab === 'REPORTS' && <ReportsTab />}
          {activeTab === 'USERS' && <UsersTab />}
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for Tabs ---

const CampaignsTab: React.FC = () => {
  const { campaigns, addCampaign, updateCampaign } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<Campaign>>({
    active: true, isrecurring: false, haspreparation: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<Campaign, 'id'> = {
        title: form.title || '',
        description: form.description || '',
        eventdate: form.eventdate || '',
        isrecurring: form.isrecurring || false,
        haspreparation: form.haspreparation || false,
        active: form.active === undefined ? true : form.active,
        preparationdate: form.preparationdate,
    };
    
    if (!payload.title || !payload.eventdate) {
        alert("Título e Data do Evento são campos obrigatórios.");
        return;
    }
    
    if (payload.haspreparation) {
        if (!payload.preparationdate) {
            alert("A data de preparo é obrigatória quando a opção está marcada.");
            return;
        }
    } else {
        payload.preparationdate = undefined;
    }

    if (form.id) {
      await updateCampaign({ id: form.id, ...payload });
    } else {
      await addCampaign(payload);
    }

    setIsEditing(false);
    setForm({ active: true, isrecurring: false, haspreparation: false });
  };

  const handleEdit = (c: Campaign) => {
    setForm(c);
    setIsEditing(true);
  };

  const handleToggleStatus = (c: Campaign) => {
    updateCampaign({ ...c, active: !c.active });
  };

  return (
    <div className="space-y-6">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center">
             <h3 className="text-xl font-semibold text-slate-700">Lista de Campanhas</h3>
             <Button onClick={() => setIsEditing(true)}>Nova Campanha</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {campaigns.map(c => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 text-sm text-slate-900">{c.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.eventdate}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                        {c.active ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleEdit(c)} className="text-brand-600 hover:text-brand-900">Editar</button>
                      <button onClick={() => handleToggleStatus(c)} className="text-slate-600 hover:text-slate-900">
                        {c.active ? 'Encerrar' : 'Reativar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl bg-slate-50 p-6 rounded-md space-y-4">
          <h3 className="text-lg font-medium text-slate-900">{form.id ? 'Editar' : 'Nova'} Campanha</h3>
          <Input 
            label="Título" 
            required 
            value={form.title || ''} 
            onChange={e => setForm({...form, title: e.target.value})} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Data do Evento" 
              type="date" 
              required 
              value={form.eventdate || ''} 
              onChange={e => setForm({...form, eventdate: e.target.value})} 
            />
             <div className="flex items-center pt-6 gap-2">
                <input 
                  type="checkbox" 
                  id="recurring"
                  checked={form.isrecurring || false} 
                  onChange={e => setForm({...form, isrecurring: e.target.checked})} 
                />
                <label htmlFor="recurring" className="text-sm text-slate-700">Evento Recorrente</label>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 p-4 border border-slate-200 rounded bg-white">
            <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="prep"
                  checked={form.haspreparation || false} 
                  onChange={e => setForm({...form, haspreparation: e.target.checked})} 
                />
                <label htmlFor="prep" className="text-sm font-medium text-slate-700">Possui Preparo Antecipado</label>
            </div>
            {form.haspreparation && (
              <Input 
                label="Data do Preparo" 
                type="date" 
                value={form.preparationdate || ''} 
                onChange={e => setForm({...form, preparationdate: e.target.value})} 
              />
            )}
          </div>

          <div>
             <label className="text-sm font-medium text-slate-700">Descrição</label>
             <textarea 
               className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
               rows={3}
               value={form.description || ''}
               onChange={e => setForm({...form, description: e.target.value})}
             />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      )}
    </div>
  );
};

const NeedsTab: React.FC = () => {
  const { campaigns, addItemNeed, addVolunteerNeed } = useApp();
  const [needType, setNeedType] = useState<'ITEM' | 'VOLUNTEER'>('ITEM');
  
  // States for forms
  const [selectedCampaign, setSelectedCampaign] = useState('');
  
  // Item Form
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('');

  // Volunteer Form
  const [role, setRole] = useState('');
  const [volDate, setVolDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [volQty, setVolQty] = useState('');

  const activeCampaigns = campaigns; // Can add inactive items too

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedCampaign) return alert('Selecione uma campanha');
    await addItemNeed({
      campaignid: selectedCampaign,
      name: itemName,
      totalrequired: Number(itemQty),
    });
    setItemName(''); setItemQty(''); alert('Item adicionado!');
  };

  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedCampaign) return alert('Selecione uma campanha');
    await addVolunteerNeed({
      campaignid: selectedCampaign,
      role,
      date: volDate,
      starttime: startTime,
      endtime: endTime,
      totalrequired: Number(volQty),
    });
    setRole(''); setVolDate(''); setStartTime(''); setEndTime(''); setVolQty(''); alert('Necessidade adicionada!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Select Type */}
      <div className="space-y-6">
         <h3 className="text-xl font-semibold text-slate-700">Cadastrar Necessidades</h3>
         <div className="flex gap-4">
           <Button 
             variant={needType === 'ITEM' ? 'primary' : 'outline'} 
             onClick={() => setNeedType('ITEM')}
             className="flex-1"
           >
             Itens de Doação
           </Button>
           <Button 
             variant={needType === 'VOLUNTEER' ? 'primary' : 'outline'} 
             onClick={() => setNeedType('VOLUNTEER')}
             className="flex-1"
           >
             Voluntários
           </Button>
         </div>

         <div className="bg-slate-50 p-6 rounded-md border border-slate-200">
           <Select 
             label="Campanha Alvo" 
             value={selectedCampaign} 
             onChange={e => setSelectedCampaign(e.target.value)}
             options={[
               { value: '', label: 'Selecione a campanha...' },
               ...activeCampaigns.map(c => ({ value: c.id, label: c.title }))
             ]}
             className="mb-4"
           />
           
           {needType === 'ITEM' ? (
             <form onSubmit={handleAddItem} className="space-y-4">
               <Input label="Nome do Item (ex: Arroz, Cobertor)" value={itemName} onChange={e => setItemName(e.target.value)} required />
               <Input label="Quantidade Necessária" type="number" min="1" value={itemQty} onChange={e => setItemQty(e.target.value)} required />
               <Button type="submit" className="w-full">Cadastrar Item</Button>
             </form>
           ) : (
             <form onSubmit={handleAddVolunteer} className="space-y-4">
               <Input label="Tipo de Trabalho (Função)" value={role} onChange={e => setRole(e.target.value)} placeholder="Ex: Cozinha, Recepção" required />
               <Input label="Data" type="date" value={volDate} onChange={e => setVolDate(e.target.value)} required />
               <div className="flex gap-2">
                 <Input label="Início" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full" required />
                 <Input label="Fim" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full" required />
               </div>
               <Input label="Qtd. Voluntários" type="number" min="1" value={volQty} onChange={e => setVolQty(e.target.value)} required />
               <Button type="submit" className="w-full">Cadastrar Vaga</Button>
             </form>
           )}
         </div>
      </div>
      
      {/* Right: Helper Info or Recent Adds */}
      <div className="bg-blue-50 p-6 rounded-md border border-blue-100 h-fit">
        <h4 className="font-semibold text-blue-900 mb-2">Dica Rápida</h4>
        <p className="text-sm text-blue-800 mb-4">
          Certifique-se de que a campanha está ativa antes de cadastrar itens. 
          Use nomes claros para os itens e funções para facilitar o entendimento dos doadores.
        </p>
        <p className="text-sm text-blue-800">
          Você pode acompanhar o preenchimento dessas vagas na aba "Relatórios".
        </p>
      </div>
    </div>
  );
};

const ReportsTab: React.FC = () => {
  const { campaigns, items, volunteerNeeds, donations, volunteerings } = useApp();
  const [reportCampaignId, setReportCampaignId] = useState(campaigns[0]?.id || '');

  const selectedCampaign = campaigns.find(c => c.id === reportCampaignId);
  const campaignItems = items.filter(i => i.campaignid === reportCampaignId);
  const campaignVols = volunteerNeeds.filter(v => v.campaignid === reportCampaignId);
  const campaignDonations = donations.filter(d => d.campaignid === reportCampaignId);
  const campaignVolunteerings = volunteerings.filter(v => v.campaignid === reportCampaignId);

  // Data for Chart
  const itemChartData = campaignItems.map(i => ({
    name: i.name,
    Arrecadado: i.totaldonated,
    Meta: i.totalrequired
  }));

  const volChartData = campaignVols.map(v => ({
    name: v.role,
    Inscritos: v.totalfilled,
    Vagas: v.totalrequired
  }));

  const exportData = () => {
    if (!selectedCampaign) return;
    
    // Simple CSV construction
    const headers = ['Tipo', 'Item/Funcao', 'Doador/Voluntario', 'Quantidade', 'Data'];
    const donationRows = donations
      .filter(d => d.campaignid === reportCampaignId)
      .map(d => `Doação,${d.itemname},${d.donorname},${d.quantity},${d.date}`);
    
    const volunteerRows = volunteerings
      .filter(v => v.campaignid === reportCampaignId)
      .map(v => `Voluntariado,${v.role},${v.volunteername},1,${v.date}`);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...donationRows, ...volunteerRows].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_${selectedCampaign.title.replace(/\s/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b pb-4">
        <div className="w-full md:w-1/2">
          <Select 
            label="Selecione a Campanha para Análise"
            value={reportCampaignId}
            onChange={e => setReportCampaignId(e.target.value)}
            options={campaigns.map(c => ({ value: c.id, label: c.title }))}
          />
        </div>
        <Button onClick={exportData} variant="secondary" disabled={!reportCampaignId}>
          Exportar Dados (CSV)
        </Button>
      </div>

      {reportCampaignId && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-4 rounded shadow-sm border">
              <h4 className="text-lg font-semibold mb-4 text-center text-slate-700">Progresso de Doações</h4>
              <div className="h-64">
                {itemChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={itemChartData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} style={{fontSize: '12px'}} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Arrecadado" fill="#3b82f6" />
                      <Bar dataKey="Meta" fill="#e2e8f0" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-center text-slate-400 mt-10">Sem itens cadastrados.</p>}
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm border">
              <h4 className="text-lg font-semibold mb-4 text-center text-slate-700">Ocupação de Voluntários</h4>
              <div className="h-64">
                {volChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={volChartData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="name" type="category" width={100} style={{fontSize: '12px'}} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Inscritos" fill="#10b981" />
                      <Bar dataKey="Vagas" fill="#e2e8f0" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-center text-slate-400 mt-10">Sem vagas cadastradas.</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
            <div className="bg-white p-4 rounded shadow-sm border">
                <h4 className="text-lg font-semibold mb-4 text-slate-700">Lista de Doações</h4>
                <div className="overflow-y-auto max-h-96 border rounded-md">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                            <tr>
                                <th className="px-3 py-2 border-b">Item</th>
                                <th className="px-3 py-2 border-b">Doador</th>
                                <th className="px-3 py-2 border-b">Qtd</th>
                                <th className="px-3 py-2 border-b">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaignDonations.length > 0 ? (
                                campaignDonations.map(d => (
                                    <tr key={d.id}>
                                        <td className="px-3 py-2">{d.itemname}</td>
                                        <td className="px-3 py-2">{d.donorname}</td>
                                        <td className="px-3 py-2">{d.quantity}</td>
                                        <td className="px-3 py-2">{new Date(d.date).toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="px-3 py-4 text-center text-slate-400">Nenhuma doação registrada.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm border">
                <h4 className="text-lg font-semibold mb-4 text-slate-700">Lista de Voluntários</h4>
                <div className="overflow-y-auto max-h-96 border rounded-md">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                            <tr>
                                <th className="px-3 py-2 border-b">Função</th>
                                <th className="px-3 py-2 border-b">Voluntário</th>
                                <th className="px-3 py-2 border-b">Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {campaignVolunteerings.length > 0 ? (
                                campaignVolunteerings.map(v => (
                                    <tr key={v.id}>
                                        <td className="px-3 py-2">{v.role}</td>
                                        <td className="px-3 py-2">{v.volunteername}</td>
                                        <td className="px-3 py-2">{new Date(v.date).toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={3} className="px-3 py-4 text-center text-slate-400">Nenhum voluntário inscrito.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const UsersTab: React.FC = () => {
  return (
    <div className="max-w-2xl">
      <h3 className="text-xl font-semibold text-slate-700 mb-6">Gerenciar Administradores</h3>
      
       <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
         <h4 className="font-bold text-amber-900 mb-2">Gerenciamento no Supabase</h4>
         <p className="text-sm text-amber-800">
           A adição, remoção e gerenciamento de senhas de administradores são feitos diretamente no seu painel Supabase para maior segurança.
         </p>
         <ul className="text-sm text-amber-800 list-disc list-inside mt-2 space-y-1">
            <li><b>Para adicionar:</b> Vá para a seção "Authentication" no seu projeto e clique em "Add user".</li>
            <li><b>Para remover:</b> Encontre o usuário na lista e selecione a opção de exclusão.</li>
         </ul>
       </div>
    </div>
  );
};