import React from 'react';

export const ConfigurationError: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg border border-red-200 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 shrink-0">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Erro de Configuração</h1>
        </div>
        
        <p className="text-slate-600 mb-4">
          A aplicação não conseguiu se conectar ao banco de dados porque a chave de API do Supabase não foi configurada corretamente.
        </p>

        <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-sm">
          <h2 className="font-semibold text-slate-700 mb-2">Ação Necessária:</h2>
          <p className="mb-3">Por favor, edite o arquivo <code className="bg-slate-200 text-red-700 px-1 py-0.5 rounded font-mono">lib/supabaseClient.ts</code> e adicione sua chave pública ("anon key").</p>
          
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li>Abra o seu painel do Supabase.</li>
            <li>Selecione o projeto <code className="bg-slate-200 px-1 py-0.5 rounded">mbwfgynnighsvkqnfyvn</code>.</li>
            <li>No menu lateral, vá para <strong>Configurações do Projeto</strong> (ícone de engrenagem) &gt; <strong>API</strong>.</li>
            <li>Na seção "Chaves de API", copie a chave <strong className="text-slate-800">pública anon</strong>.</li>
            <li>Cole essa chave na variável <code className="bg-slate-200 px-1 py-0.5 rounded">supabaseAnonKey</code> dentro do arquivo <code className="bg-slate-200 text-red-700 px-1 py-0.5 rounded font-mono">lib/supabaseClient.ts</code>.</li>
          </ol>
        </div>
        
        <p className="text-xs text-slate-400 mt-6 text-center">
          Após salvar o arquivo, a aplicação irá recarregar automaticamente.
        </p>
      </div>
    </div>
  );
};
