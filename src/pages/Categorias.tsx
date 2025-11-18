import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { getProducts } from "@/services/productApi";

const Categorias = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
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

  const filteredProductsByCategory = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const grouped = filtered.reduce((acc, p) => {
      const categoryName = p.categories.name;
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(p);
      return acc;
    }, {} as { [key: string]: Product[] });

    for (const category in grouped) {
      grouped[category].sort((a, b) => {
        if (sortOrder === "price-asc") return a.price - b.price;
        if (sortOrder === "price-desc") return b.price - a.price;
        return 0;
      });
    }

    return grouped;
  }, [products, searchTerm, sortOrder]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Categorias de Produtos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Navegue por nossas coleções de produtos organizados para você.
          </p>
        </div>

        <aside className="mb-8 p-6 bg-card border rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="search">Buscar por nome</Label>
              <Input
                id="search"
                placeholder="Ex: Kit Escolar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort">Ordenar por</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Relevância</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        <div className="space-y-16">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <section key={i} className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-52" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-8 w-1/2" />
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : error ? (
            <p className="text-center text-destructive">Erro ao carregar categorias: {error}</p>
          ) : Object.entries(filteredProductsByCategory).length > 0 ? (
            Object.entries(filteredProductsByCategory).map(([category, categoryProducts]) => (
              <section key={category}>
                <h2 className="text-3xl font-bold mb-6 border-b pb-2">{category}</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-background overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-3 right-3 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-foreground line-clamp-2">
                          {product.name}
                        </h3>
                        <div>
                          <span className="text-2xl font-bold text-foreground">
                            {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Adicionar ao Carrinho
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          ))
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">Nenhum produto encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categorias;
