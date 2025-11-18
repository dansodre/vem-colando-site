import { supabase } from '@/lib/supabase';
import { Product } from '@/types';

export const getWishlist = async (userId: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      products:product_id (*, categories(name))
    `)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data.map((item: any) => item.products) as Product[];
};

export const addToWishlist = async (userId: string, productId: number) => {
  const { data, error } = await supabase.from('wishlist').insert([{ user_id: userId, product_id: productId }]);
  if (error) throw new Error(error.message);
  return data;
};

export const removeFromWishlist = async (userId: string, productId: number) => {
  const { error } = await supabase.from('wishlist').delete().match({ user_id: userId, product_id: productId });
  if (error) throw new Error(error.message);
};
