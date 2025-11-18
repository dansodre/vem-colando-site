import { Helmet } from 'react-helmet-async';

interface ProductSchema {
  name: string;
  description: string;
  image: string;
  url: string;
  price: number;
  currency: string;
  availability: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock';
}

interface SEOProps {
  title: string;
  description: string;
  imageUrl?: string;
  canonicalUrl?: string;
  productSchema?: ProductSchema;
}

const SEO: React.FC<SEOProps> = ({ title, description, imageUrl, canonicalUrl, productSchema }) => {
  const siteName = 'Vem Colando';
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Tags Padrão */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Tags (para redes sociais como Facebook) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}

      {/* Dados Estruturados (JSON-LD) para Produtos */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: productSchema.name,
            description: productSchema.description,
            image: productSchema.image,
            offers: {
              '@type': 'Offer',
              price: productSchema.price,
              priceCurrency: productSchema.currency,
              availability: productSchema.availability,
              url: productSchema.url,
            },
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
