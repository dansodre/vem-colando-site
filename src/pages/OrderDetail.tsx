import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '@/services/orderApi';
import { Order } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery<Order>({ 
    queryKey: ['order', id], 
    queryFn: () => getOrderById(Number(id)),
    enabled: !!id // A query só roda se o ID existir na URL
  });

  const getTrackingUrl = (code: string) => {
    // Link genérico dos Correios
    return `https://rastreamento.correios.com.br/app/index.php?objetos=${code}`;
  }

  if (isLoading) return <div>Carregando detalhes do pedido...</div>;
  if (!order) return <div>Pedido não encontrado.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Detalhes do Pedido #{order.id}</h1>
          <p className="text-muted-foreground">Pedido realizado em {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Itens do Pedido</h2>
              <div className="space-y-4">
                {order.order_items.map(item => (
                  <div key={item.id} className="flex items-start gap-4">
                    <img src={item.products.image} alt={item.products.name} className="w-20 h-20 object-cover rounded-md border" />
                    <div className="flex-grow">
                      <p className="font-semibold">{item.products.name}</p>
                      <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Resumo</h2>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Frete</span><span>Grátis</span></div>
                <div className="flex justify-between font-bold text-lg"><span >Total</span><span>{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
              </div>
            </div>
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Status e Rastreamento</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold">Status:</span>
                <Badge>{order.status}</Badge>
              </div>
              {order.tracking_code && (
                <div>
                  <p className="font-semibold mb-2">Código de Rastreamento:</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-mono bg-muted p-2 rounded-md">{order.tracking_code}</p>
                    <a href={getTrackingUrl(order.tracking_code)} target="_blank" rel="noopener noreferrer">
                      <Button>Rastrear</Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
