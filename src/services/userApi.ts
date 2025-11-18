import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email?: string;
  created_at: string;
  last_sign_in_at?: string | undefined;
  user_metadata: any;
}

export const getUsers = async (): Promise<UserProfile[]> => {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.message);
  }

  return users;
};
