import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbwfgynnighsvkqnfyvn.supabase.co';

// =================================================================================
// ❗️ AÇÃO NECESSÁRIA: COLE SUA CHAVE 'ANON' DO SUPABASE AQUI
// =================================================================================
// O erro "Invalid API key" indica que a chave configurada aqui não corresponde
// à chave do seu projeto Supabase. Você precisa substituí-la.
//
// 1. Vá para o seu painel do Supabase: https://supabase.com/dashboard/
// 2. Selecione seu projeto ('mbwfgynnighsvkqnfyvn').
// 3. No menu lateral, clique no ícone de engrenagem (Configurações do Projeto).
// 4. Clique em 'API'.
// 5. Na seção 'Chaves de API do Projeto', copie a chave pública 'anon'.
// 6. Cole a chave copiada abaixo, substituindo a string vazia.
//
// Exemplo de como a chave deve se parecer: eyJhbGciOiJIUzI1NiIsIn...
// =================================================================================
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1id2ZneW5uaWdoc3ZrcW5meXZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNTExODksImV4cCI6MjA4MTcyNzE4OX0.Dma2SLhLYiHBcVMSQ88TdvuGaKbh4wbG8jjPvQE8r6M'; // <-- COLE SUA CHAVE AQUI

// Exporta uma flag para verificar o status da configuração de qualquer lugar na aplicação.
// A chave 'anon' do Supabase é um JWT e deve começar com 'ey'.
export const isSupabaseConfigured = 
  supabaseAnonKey && 
  typeof supabaseAnonKey === 'string' && 
  supabaseAnonKey.startsWith('ey');
  
// Chave "dummy" para evitar que a aplicação quebre na inicialização se a chave real estiver ausente.
// A lógica em App.tsx irá capturar que a chave não está configurada e mostrar a tela de erro.
const DUMMY_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0I4zayCRiktOK2oiJGu4S7YgGAbnQ';

// Cria a instância do cliente. Usa a chave real se existir, senão, a dummy para evitar o crash.
export const supabase = createClient(supabaseUrl, supabaseAnonKey || DUMMY_KEY);