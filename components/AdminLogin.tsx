import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ViewState } from '../types';

interface AdminLoginProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onCancel }) => {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      onSuccess();
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-slate-200">
      <h2 className="text-2xl font-bold text-brand-800 mb-6 text-center">Acesso Administrativo</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input 
          label="Usuário" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Ex: IRADMIN"
          autoFocus
        />
        <Input 
          label="Senha" 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Sua senha"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3 mt-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="flex-1">
            Entrar
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-xs text-slate-500">
        <p>Usuário padrão: IRADMIN / Senha: IRADMIN</p>
      </div>
    </div>
  );
};