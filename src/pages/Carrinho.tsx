import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { Trash2, Plus, Minus, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from 'axios';
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/lib/supabase";

const Carrinho = () => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, applyCoupon, removeCoupon, appliedCoupon, discount } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [couponCode, setCouponCode] = useState('');
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any | null>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    const result = await applyCoupon(couponCode);
    if (result.success) {
      toast({ title: 'Sucesso', description: result.message });
    } else {
      toast({ title: 'Erro', description: result.message, variant: 'destructive' });
    }
  };

  const handleCalculateShipping = async () => {
    if (!cep) {
      toast({ title: "Erro", description: "Por favor, informe um CEP.", variant: "destructive" });
      return;
    }

    setLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);

    // Dimensões e peso fictícios - idealmente, viriam dos dados do produto
    const productsPayload = cartItems.map(item => ({
      id: item.id,
      width: 15,
      height: 15,
      length: 15,
      weight: 0.003,
      insurance_value: item.price,
      quantity: item.quantity,
    }));

    try {
      const { data, error } = await supabase.functions.invoke('frete', {
        body: JSON.stringify({
          to_postal_code: cep.replace(/\D/g, ''),
          products: productsPayload
        })
      });

      if (error) throw error;

      // A nova função pode retornar um objeto de erro, então verificamos isso
      if (data.error) throw new Error(data.error);
      
      // Filtra opções que não têm um preço numérico válido
      const validOptions = data.filter((option: any) => option.price && !isNaN(parseFloat(option.price)));
      // Ordena as opções pelo preço (menor para o maior)
      validOptions.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price));
      setShippingOptions(validOptions);

    } catch (error: any) {
      toast({ title: "Erro ao calcular o frete", description: error.message || "Não foi possível calcular o frete. Verifique o CEP e tente novamente.", variant: "destructive" });
    } finally {
      setLoadingShipping(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Seu Carrinho</h1>
        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg">
            <p className="text-xl text-muted-foreground mb-4">Seu carrinho de compras está vazio.</p>
            <Link to="/produtos">
              <Button>Continuar Comprando</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex items-start gap-4 bg-card p-4 rounded-lg shadow-sm">
                  <img src={item.customization?.designUrl || item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md border" />
                  <div className="flex-grow">
                    <h2 className="font-semibold">{item.name}</h2>
                    {item.customization && (
                      <div className="text-xs text-muted-foreground mt-1 space-y-1">
                        <p>Tema: <strong>{item.customization.themeName}</strong></p>
                        <p>Texto: <strong>{item.customization.text}</strong></p>
                      </div>
                    )}
                    <p className="text-sm font-medium mt-2">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} disabled={item.customization !== undefined}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input type="number" value={item.quantity} readOnly className="w-16 text-center" />
                    <Button variant="outline" size="icon" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} disabled={item.customization !== undefined}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.cartItemId)}>
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm space-y-4 h-fit">
              <h2 className="text-xl font-semibold border-b pb-2">Resumo do Pedido</h2>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coupon">Cupom de Desconto</Label>
                <div className="flex gap-2">
                  <Input id="coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Seu cupom" disabled={!!appliedCoupon} />
                  <Button onClick={handleApplyCoupon} disabled={!!appliedCoupon}>Aplicar</Button>
                </div>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>Cupom "{appliedCoupon.code}" aplicado!</span>
                  <div className="flex items-center gap-2">
                    <span>- {discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    <Button variant="ghost" size="icon" onClick={removeCoupon}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="cep">Calcular Frete</Label>
                <div className="flex gap-2">
                  <Input id="cep" value={cep} onChange={(e) => setCep(e.target.value)} placeholder="Seu CEP" />
                  <Button onClick={handleCalculateShipping} disabled={loadingShipping}>
                    {loadingShipping ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Calcular'}
                  </Button>
                </div>
              </div>
              {shippingOptions.length > 0 && (
                <div className="space-y-2">
                  <Label>Opções de Entrega</Label>
                  <RadioGroup onValueChange={(value) => setSelectedShipping(JSON.parse(value))}>
                    {shippingOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={JSON.stringify(option)} id={`shipping-${option.id}`} />
                        <Label htmlFor={`shipping-${option.id}`} className="flex justify-between w-full">
                          <span>{option.name} ({option.delivery_time} dias)</span>
                          <span className="font-semibold">{parseFloat(option.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              <div className="flex justify-between">
                <span>Frete</span>
                <span>{selectedShipping ? selectedShipping.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'A calcular'}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>{(subtotal - discount + (parseFloat(selectedShipping?.price) || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <Link to="/checkout">
                <Button className="w-full" size="lg">Finalizar Compra</Button>
              </Link>
              <Link to="/produtos" className="block text-center">
                <Button variant="outline" className="w-full">Continuar Comprando</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Carrinho;
