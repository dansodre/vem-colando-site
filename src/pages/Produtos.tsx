import { useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductFilters from "@/components/ProductFilters";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import { Product } from "@/types";
import { getProducts, GetProductsParams } from "@/services/productApi";
import { useDebounce } from "@/hooks/useDebounce";
import StatusWrapper from "@/components/StatusWrapper";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import ProductCard from "@/components/ProductCard";

const Produtos = () => {
  const [filters, setFilters] = useState<GetProductsParams>({});

  const pageTitle = filters.category 
    ? `Etiquetas de ${filters.category} | Vem Colando` 
    : 'Nossa Loja | Vem Colando - Todos os Produtos';
  
  const pageDescription = filters.category
    ? `Encontre as melhores etiquetas e adesivos personalizados para ${filters.category}.`
    : 'Explore nossa coleção completa de etiquetas e adesivos.';

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);
  const queryFilters = { ...filters, searchTerm: debouncedSearchTerm };

  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({ 
    queryKey: ['products', queryFilters], 
    queryFn: () => getProducts(queryFilters)
  });

  const handleFilterChange = (newFilters: GetProductsParams) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Nossa Loja</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore nossa coleção completa de etiquetas e adesivos personalizados.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
          </aside>
          <section className="w-full md:w-3/4 lg:w-4/5">
            <StatusWrapper
              isLoading={isLoading}
              isError={isError}
              error={error}
              skeleton={<ProductGridSkeleton />}
            >
              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center text-center py-16 bg-muted/50 rounded-lg">
                  <SearchX className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold">Nenhum produto encontrado</h3>
                  <p className="text-muted-foreground mb-4">Tente ajustar seus filtros ou limpar a busca.</p>
                  <Button onClick={() => setFilters({})}>Limpar Todos os Filtros</Button>
                </div>
              )}
            </StatusWrapper>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Produtos;
