import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";
import { searchProducts } from "@/services/productApi";
import { useDebounce } from "@/hooks/use-debounce";

const Busca = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { addToCart } = useCart();
  const { toast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (debouncedSearchTerm) {
      setLoading(true);
      searchProducts(debouncedSearchTerm)
        .then(setResults)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-center text-3xl font-bold mb-2">Buscar Produtos</h1>
          <p className="text-center text-muted-foreground mb-6">Encontre o que você precisa em nosso catálogo.</p>
          <Input
            type="search"
            placeholder="Digite o nome do produto..."
            className="w-full text-lg p-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="text-center">Buscando...</p>
          ) : debouncedSearchTerm && results.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <div key={product.id} className="group">
                  <Link to={`/produto/${product.id}`}>
                    <Card className="overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-background overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <Badge className="absolute top-3 left-3">{product.categories.name}</Badge>
                      <Button variant="ghost" size="icon" className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}>
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-foreground line-clamp-2">{product.name}</h3>
                      <div>
                        {product.original_price && product.original_price > product.price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-muted-foreground line-through">{product.original_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            <span className="text-2xl font-bold text-foreground">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-foreground">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Adicionar ao Carrinho
                    </Button>
                  </CardFooter>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            debouncedSearchTerm && <p className="text-center">Nenhum produto encontrado para "{debouncedSearchTerm}".</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Busca;

