import { supabase } from '@/lib/supabase';
import { Product, Theme, Post } from '@/types';

export interface Category {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.message);
  }
  return data;
};

export interface GetProductsParams {
  searchTerm?: string;
  category?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest';
  priceRange?: [number, number];
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export const getProducts = async (params: GetProductsParams = {}): Promise<Product[]> => {
  let query = supabase.from('products').select(`
    *,
    categories ( name )
  `);

  if (params.searchTerm) {
    query = query.textSearch('name', params.searchTerm, { type: 'websearch' });
  }

  if (params.category) {
    // Esta parte assume que o nome da categoria está na tabela 'categories'
    // e que a relação está corretamente configurada.
    // Uma abordagem mais robusta pode exigir um join ou um RPC.
  }

  if (params.priceRange) {
    query = query.gte('price', params.priceRange[0]);
    query = query.lte('price', params.priceRange[1]);
  }

  if (params.sortBy) {
    const [field, order] = params.sortBy.split('_');
    const ascending = order === 'asc';
    if (field === 'price') {
      query = query.order('price', { ascending });
    } else {
      query = query.order('created_at', { ascending: false }); // newest
    }
  } else {
    query = query.order('id', { ascending: true });
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message);
  }

  // Filtro de categoria no lado do cliente como fallback
  if (params.category) {
    return (data as Product[]).filter(p => p.categories.name === params.category);
  }

  return data as Product[];
};

export const createProduct = async (productData: Omit<Product, 'id' | 'categories'>) => {
  const { data, error } = await supabase.from('products').insert([productData]).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const updateProduct = async (id: number, productData: Partial<Product>) => {
  const { data, error } = await supabase.from('products').update(productData).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const deleteProduct = async (id: number) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const searchProducts = async (searchTerm: string): Promise<Product[]> => {
  if (!searchTerm) return [];

  const { data, error } = await supabase.rpc('search_products', { search_term: searchTerm });

  if (error) {
    console.error('Error searching products:', error);
    throw new Error(error.message);
  }

  // A busca RPC precisa ser combinada com os nomes das categorias
  const productIds = (data as any[]).map(p => p.id);
  const { data: productsWithCategories, error: categoryError } = await supabase
    .from('products')
    .select(`*,
    categories ( name )`)
    .in('id', productIds);

  if (categoryError) {
    console.error('Error fetching categories for search results:', categoryError);
    throw new Error(categoryError.message);
  }

  return productsWithCategories || [];
};

export const uploadPostImage = async (file: File): Promise<string> => {
  const fileName = `post-covers/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) {
    throw new Error(`Erro no upload da imagem do post: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const uploadThemeImage = async (file: File): Promise<string> => {
  const fileName = `theme-icons/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) {
    throw new Error(`Erro no upload da imagem do tema: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const uploadProductImage = async (file: File): Promise<string> => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('product-images') // Nome do seu bucket no Supabase Storage
    .upload(fileName, file);

  if (error) {
    throw new Error(`Erro no upload da imagem: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const getProductById = async (id: number): Promise<Product> => {
  console.log(`Buscando produto com ID: ${id}`);
  const { data, error, status } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name)
    `)
    .eq('id', id)
    .single();

  console.log('Dados recebidos do Supabase:', data);
  console.log('Erro recebido do Supabase:', error);
  console.log('Status da requisição:', status);

  if (error && status !== 406) { // 406 é um status normal quando single() não encontra nada
    console.error('Erro crítico ao buscar produto:', error);
    throw new Error('Erro na comunicação com o banco de dados.');
  }

  if (!data) {
    console.warn(`Produto com ID ${id} não encontrado no banco de dados.`);
    throw new Error('Produto não encontrado');
  }

  return data as Product;
};

export const getThemes = async (): Promise<Theme[]> => {
  const { data, error } = await supabase.from('themes').select('*');
  if (error) throw new Error(error.message);
  return data;
};

export const createTheme = async (themeData: Omit<Theme, 'id'>) => {
  const { data, error } = await supabase.from('themes').insert([themeData]).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const updateTheme = async (id: number, themeData: Partial<Theme>) => {
  const { data, error } = await supabase.from('themes').update(themeData).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const deleteTheme = async (id: number) => {
  const { error } = await supabase.from('themes').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

// Funções CRUD para Posts do Blog
export const getPosts = async ({ featuredOnly = false }: { featuredOnly?: boolean } = {}): Promise<Post[]> => {
  let query = supabase.from('posts').select('*');

  if (featuredOnly) {
    query = query.eq('is_featured', true);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

export const createPost = async (postData: Omit<Post, 'id' | 'created_at'>) => {
  const { data, error } = await supabase.from('posts').insert([postData]).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const updatePost = async (id: number, postData: Partial<Post>) => {
  const { data, error } = await supabase.from('posts').update(postData).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data[0];
};

export const getFeaturedOrLatestPosts = async (): Promise<Post[]> => {
  // 1. Tenta buscar posts em destaque
  const { data: featuredPosts, error: featuredError } = await supabase
    .from('posts')
    .select('*')
    .eq('is_featured', true)
    .order('published_at', { ascending: false });

  if (featuredError) throw new Error(featuredError.message);

  // 2. Se encontrou, retorna eles
  if (featuredPosts && featuredPosts.length > 0) {
    return featuredPosts;
  }

  // 3. Se não, busca os 3 mais recentes
  const { data: latestPosts, error: latestError } = await supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(3);

  if (latestError) throw new Error(latestError.message);

  return latestPosts;
};

export const getPostBySlug = async (slug: string): Promise<Post> => {
  const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
  if (error) throw new Error('Post não encontrado');
  return data;
};

export const deletePost = async (id: number) => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const getThemesByProductId = async (productId: number) => {
  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('product_id', productId);

  if (error) {
    console.error('Error fetching themes:', error);
    throw new Error('Temas não encontrados');
  }
  return data;
};
