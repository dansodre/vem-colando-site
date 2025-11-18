import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { getProductById } from '@/services/productApi';
import SEO from '@/components/SEO';
import ImageZoom from '@/components/ImageZoom';
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import StatusWrapper from '@/components/StatusWrapper';
import { ProductDetailSkeleton } from '@/components/skeletons/ProductDetailSkeleton';

const ProdutoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [customizationType, setCustomizationType] = useState('loja'); // 'loja' ou 'cliente'
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Campos para personalização feita pela loja
  const [storeCustomizationData, setStoreCustomizationData] = useState({ name: '', phone: '', theme: '', observations: '' });
  const [referenceImage, setReferenceImage] = useState<File | null>(null);

  const { data: product, isLoading } = useQuery<Product>({ 
    queryKey: ['product', id], 
    queryFn: () => getProductById(Number(id)),
    enabled: !!id
  });

  const handleProceed = async () => {
    if (!product) return;

    if (customizationType === 'cliente') {
      if (!user) {
        toast({ title: "Ação necessária", description: "Por favor, faça login para personalizar seu design.", variant: "destructive" });
        navigate('/login');
        return;
      }

      setIsCreatingOrder(true);
      try {
        const { data, error } = await supabase
          .from('pedidos')
          .insert({
            cliente_id: user.id,
            produto_id: product.id,
            status: 'rascunho',
            tipo_personalizacao: 'cliente',
          })
          .select()
          .single();

        if (error) throw error;

        // Redireciona para o sistema de personalização
        // Redireciona para o sistema de personalização
        const redirectUrl = import.meta.env.DEV 
          ? `http://localhost:8082/?pedidoId=${data.id}` 
          : `https://personalize.vemcolando.com.br/?pedidoId=${data.id}`;
        window.location.href = redirectUrl;

      } catch (error: any) {
        toast({ title: "Erro ao criar pedido", description: error.message, variant: "destructive" });
      } finally {
        setIsCreatingOrder(false);
      }
    } else {
      // Lógica para adicionar ao carrinho com os dados do formulário
      // (Será implementado no checkout, por enquanto apenas adiciona o produto)
      addToCart(product);
      toast({
        title: "Produto adicionado!",
        description: "Continue para o checkout para finalizar os detalhes da personalização.",
      });
      navigate('/carrinho');
    }
  };

  
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* O SEO é renderizado imediatamente, com placeholders se o produto ainda não carregou */}
      <SEO 
        title={product ? product.name : 'Carregando Produto...'}
        description={product ? (product.description.replace(/<[^>]*>?/gm, '').substring(0, 160) || `Compre ${product.name} na Vem Colando.`) : 'Detalhes do produto em breve.'}
        imageUrl={product?.image}
        canonicalUrl={product ? `https://www.vemcolando.com.br/produto/${product.id}` : undefined}
        productSchema={product ? {
          name: product.name,
          description: product.description.replace(/<[^>]*>?/gm, '').substring(0, 5000),
          image: product.image,
          url: `https://www.vemcolando.com.br/produto/${product.id}`,
          price: product.price,
          currency: 'BRL',
          availability: 'https://schema.org/InStock',
        } : undefined}
      />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <StatusWrapper
          isLoading={isLoading}
          isError={!product && !isLoading}
          error={{ name: 'Erro', message: 'Produto não encontrado.' }}
          skeleton={<ProductDetailSkeleton />}
        >
          {product && (
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="relative">
                <ImageZoom src={product.image} alt={product.name} />
              </div>
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <p className="text-2xl text-primary font-bold mt-2">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <div className="prose mt-4" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
                <div className="p-6 border rounded-lg space-y-4">
                  <h2 className="text-xl font-semibold">Como você quer personalizar?</h2>
                  <RadioGroup value={customizationType} onValueChange={setCustomizationType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="loja" id="r1" />
                      <Label htmlFor="r1">Quero que a Vem Colando crie o design para mim.</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cliente" id="r2" />
                      <Label htmlFor="r2">Quero personalizar o design eu mesmo(a) agora.</Label>
                    </div>
                  </RadioGroup>
                </div>
                {customizationType === 'loja' && (
                  <div className="p-6 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Você informará os detalhes da personalização (nome, tema, etc.) na etapa final do checkout.</p>
                  </div>
                )}
                <Button size="lg" onClick={handleProceed} disabled={isCreatingOrder} className="w-full">
                  {customizationType === 'cliente' 
                    ? (isCreatingOrder ? 'Criando rascunho...' : 'Personalizar Agora') 
                    : 'Comprar e Informar Detalhes no Checkout'}
                </Button>
              </div>
            </div>
          )}
        </StatusWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default ProdutoDetalhe;
