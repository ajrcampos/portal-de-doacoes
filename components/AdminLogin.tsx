import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailLoginDisabledError, setIsEmailLoginDisabledError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsEmailLoginDisabledError(false);

    const response = await login(email, password);

    if (response.success) {
      onSuccess();
    } else {
      const errorMessage = response.error || 'Ocorreu um erro desconhecido.';
      if (errorMessage.toLowerCase().includes('email logins are disabled')) {
          setIsEmailLoginDisabledError(true);
      } else if (errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('token')) {
          setError('Erro de configuração: A chave de API do Supabase é inválida. Verifique o arquivo lib/supabaseClient.ts e siga as instruções.');
      } else if (errorMessage.toLowerCase().includes('invalid login credentials')) {
          setError('E-mail ou senha inválidos. Verifique os dados e tente novamente.');
      } else {
          setError(errorMessage);
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold text-brand-800 mb-6 text-center">
        Acesso Administrativo
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input 
          label="Email"
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="seu@email.com"
          autoFocus
          required
        />
        <Input 
          label="Senha" 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Sua senha"
          required
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        
        {isEmailLoginDisabledError && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-sm text-amber-800 rounded-r-md">
            <p className="font-bold">Ação Necessária: Habilitar Login por Email</p>
            <p className="mt-1">
              Para corrigir, acesse seu painel Supabase e habilite o provedor de autenticação "Email".
            </p>
            <a 
              href="https://supabase.com/dashboard/project/mbwfgynnighsvkqnfyvn/auth/providers" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-amber-900 hover:underline mt-2 inline-block"
            >
              Abrir configurações do Supabase →
            </a>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Aguarde...' : 'Entrar'}
          </Button>
        </div>
      </form>
    </div>
  );
};