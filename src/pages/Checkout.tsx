import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getDraftOrderById } from '@/services/orderApi';
import { DraftOrder } from '@/types';
import { loadStripe } from '@stripe/stripe-js';
import OrderSummary from '@/components/checkout/OrderSummary';
import CustomizationForm from '@/components/checkout/CustomizationForm';
import AddressForm from '@/components/checkout/AddressForm';
import PaymentForm from '@/components/checkout/PaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);





const Checkout = () => {
  const [activeStep, setActiveStep] = useState('step1');
  const [isProcessing, setIsProcessing] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const pedidoId = new URLSearchParams(location.search).get('pedidoId');

  const [customizationData, setCustomizationData] = useState({ name: '', theme: '', observations: '' });
  const [referenceFile, setReferenceFile] = useState<File | null>(null);

  const isLovableOrder = !!pedidoId;

    const { data: draftOrder, isLoading: isLoadingDraftOrder } = useQuery<DraftOrder | null>({
    queryKey: ['draftOrder', pedidoId],
    queryFn: () => getDraftOrderById(pedidoId!),
    enabled: isLovableOrder,
  });

  const handleCheckout = async () => {
    setIsProcessing(true);

    let itemsToCheckout = [];
    if (isLovableOrder && draftOrder?.products?.[0]) {
      const product = draftOrder.products[0];
      itemsToCheckout.push({ 
        id: draftOrder.produto_id, 
        name: product.name, 
        price: product.price, 
        quantity: 1, 
        image: product.image 
      });
    } else {
      itemsToCheckout = cartItems;
    }

    if (itemsToCheckout.length === 0) {
      toast({ title: "Carrinho vazio", description: "Adicione itens antes de finalizar.", variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: { 
          cartItems: itemsToCheckout, 
          userId: user?.id, 
          draftOrderId: isLovableOrder ? pedidoId : null 
        },
      });

      if (error) throw new Error(error.message);

      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe.js não foi carregado.');

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (stripeError) throw new Error(stripeError.message);

    } catch (error: any) {
      toast({ title: "Erro ao finalizar a compra", description: error.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isLovableOrder) {
      console.log("Carregando dados para o pedido rascunho:", pedidoId);
      // TODO: Buscar dados do pedido no Supabase e popular o resumo.
    } else if (cartItems.length === 0) {
      // Se não for pedido Lovable e o carrinho estiver vazio, redireciona.
      // (Lógica de redirect pode ser adicionada aqui)
    }
  }, [pedidoId, cartItems, isLovableOrder]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Helmet>
        <title>Finalizar Compra | Vem Colando</title>
      </Helmet>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          {/* Coluna Principal */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Finalizar Compra</h1>
            <Accordion type="single" collapsible value={activeStep} onValueChange={setActiveStep} className="w-full">
              <AccordionItem value="step1">
                <AccordionTrigger className="text-xl font-semibold">1. Detalhes da Compra</AccordionTrigger>
                <AccordionContent>
                  {/* Exibe o formulário de personalização apenas se não for um pedido vindo do Lovable */}
                  {!isLovableOrder && <CustomizationForm data={customizationData} setData={setCustomizationData} setFile={setReferenceFile} />}
                  <div className="pt-6 mt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Endereço de Entrega</h3>
                    <AddressForm onFormSubmit={() => setActiveStep('step2')} />
                  </div>
                  <Button type="submit" form="address-form" className="mt-6">Continuar para Pagamento</Button>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="step2">
                <AccordionTrigger className="text-xl font-semibold">2. Pagamento</AccordionTrigger>
                <AccordionContent>
                  <PaymentForm />
                  <Button onClick={handleCheckout} disabled={isProcessing} className="mt-6 w-full">
                    {isProcessing ? 'Processando...' : 'Finalizar Compra'}
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Barra Lateral */}
          <aside className="sticky top-28 space-y-6">
            <OrderSummary draftOrder={draftOrder} isLoading={isLoadingDraftOrder} />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
