import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper para encontrar a pasta raiz do projeto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o .env da pasta raiz
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const generateSitemap = async () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Erro: VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não encontradas no arquivo .env');
    process.exit(1); // Encerra o script com erro
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const baseUrl = 'https://www.vemcolando.com.br';

  try {
    console.log('Buscando dados para o sitemap...');
    const staticPages = ['/', '/produtos', '/categorias', '/sobre', '/contato', '/blog'];

    const { data: products, error: productsError } = await supabase.from('products').select('id');
    if (productsError) throw productsError;

    const { data: categories, error: categoriesError } = await supabase.from('categories').select('id');
    if (categoriesError) throw categoriesError;

    const { data: posts, error: postsError } = await supabase.from('posts').select('slug');
    if (postsError) throw postsError;

    const productUrls = products?.map(p => `/produto/${p.id}`) || [];
    const categoryUrls = categories?.map(c => `/categoria/${c.id}`) || [];
    const postUrls = posts?.map(p => `/blog/${p.slug}`) || [];

    const allUrls = [...staticPages, ...productUrls, ...categoryUrls, ...postUrls];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(url => `
    <url>
      <loc>${baseUrl}${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`)
    .join('')}
</urlset>`;

    // Escreve o sitemap na pasta public, que está um nível acima da pasta scripts
    fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemapContent.trim());
    console.log('✅ Sitemap gerado com sucesso em public/sitemap.xml!');

  } catch (error) {
    console.error('Falha ao gerar o sitemap:', error.message);
    process.exit(1);
  }
};

generateSitemap();

