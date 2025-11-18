import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <Card className="group overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardContent className="p-0 relative">
        <Link to={`/produto/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
        </Link>
        {product.original_price && (
          <Badge variant="destructive" className="absolute top-3 left-3">PROMO</Badge>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full ${isInWishlist(product.id) ? 'text-red-500' : 'text-foreground'}`}
          onClick={() => toggleWishlist(product)}
        >
          <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </Button>
      </CardContent>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
          <Link to={`/produto/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-lg text-primary">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">{product.original_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          )}
        </div>
      </div>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
