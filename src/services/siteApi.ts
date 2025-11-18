import { supabase } from '@/lib/supabase';
import { Banner } from '@/types';

// Funções CRUD para Banners
export const getBanners = async (): Promise<Banner[]> => {
  const { data, error } = await supabase.from('banners').select('*').order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const createBanner = async (bannerData: Omit<Banner, 'id'>) => {
  const { data, error } = await supabase.from('banners').insert([bannerData]).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const updateBanner = async (id: number, bannerData: Partial<Banner>) => {
  const { data, error } = await supabase.from('banners').update(bannerData).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const deleteBanner = async (id: number) => {
  const { error } = await supabase.from('banners').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const uploadBannerImage = async (file: File): Promise<string> => {
    const fileName = `banners/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);
  
    if (error) {
      throw new Error(`Erro no upload da imagem do banner: ${error.message}`);
    }
  
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);
  
    return publicUrl;
  };
  
