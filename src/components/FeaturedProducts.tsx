import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";
import { getProducts } from "@/services/productApi";
import { useEffect, useState } from "react";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({ limit: 4 });
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <section id="produtos" className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Itens em Destaque</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Uma seleção especial dos nossos itens mais amados</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-muted rounded-lg aspect-square animate-pulse" />)}
          {error && <p className="col-span-full text-center text-destructive">Erro ao carregar produtos.</p>}
          {!loading && !error && products.map((product) => (
            <div key={product.id} className="group">
              <Link to={`/produto/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-xl transition-all h-full flex flex-col">
                  <CardContent className="p-0 flex-grow">
                    <div className="relative aspect-square bg-background overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {product.categories && <Badge className="absolute top-3 left-3">{product.categories.name}</Badge>}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                      >
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
                  <CardFooter className="p-4 pt-0 mt-auto">
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
        
        <div className="text-center mt-12">
          <Link to="/produtos">
            <Button size="lg" variant="outline">Ver a Loja Completa</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

