import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  role: string | null;
  // Adicione outros campos da tabela 'profiles' que você queira buscar, como 'full_name' ou 'avatar_url'
}

export const getUsers = async (): Promise<UserProfile[]> => {
  // Busca da tabela 'profiles' pública, que é seguro de se fazer no frontend.
  const { data, error } = await supabase.from('profiles').select('id, role');

  if (error) {
    console.error('Error fetching user profiles:', error);
    throw new Error(error.message);
  }

  return data || [];
};
