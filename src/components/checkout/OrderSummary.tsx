import { useCart } from '@/contexts/CartContext';
import { DraftOrder } from '@/types';

interface OrderSummaryProps {
  draftOrder: DraftOrder | null | undefined;
  isLoading: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ draftOrder, isLoading }) => {
  const { cartItems, totalPrice: cartTotalPrice } = useCart();

  const isLovableOrder = !!draftOrder;
  const product = draftOrder?.products?.[0];
  const displayPrice = product?.price ?? cartTotalPrice;

  return (
    <div className="bg-muted/50 p-6 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
      <div className="space-y-2 min-h-[60px]">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando...</p>
        ) : isLovableOrder && product ? (
          <div className="flex justify-between items-center text-sm">
            <span>{product.name} (x1)</span>
            <span className="font-medium">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>
        ) : cartItems.length > 0 ? (
          cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span>{item.name} (x{item.quantity})</span>
              <span className="font-medium">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Seu carrinho está vazio.</p>
        )}
      </div>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
        <div className="flex justify-between text-sm"><span>Frete</span><span>Grátis</span></div>
        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{displayPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
      </div>
    </div>
  );
};

export default OrderSummary;
