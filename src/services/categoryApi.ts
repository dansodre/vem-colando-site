import { supabase } from '@/lib/supabase';

export interface Category {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw new Error(error.message);
  return data;
};

export const createCategory = async (name: string) => {
  const { data, error } = await supabase.from('categories').insert([{ name }]).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const updateCategory = async (id: number, name: string) => {
  const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const deleteCategory = async (id: number) => {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
};
