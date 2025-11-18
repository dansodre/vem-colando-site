import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import StatusWrapper from "@/components/StatusWrapper";
import { Skeleton } from "@/components/ui/skeleton";

// Tipo expandido para incluir dados do produto
interface OrderWithProduct {
  id: number;
  criado_em: string;
  status: string;
  total: number;
  products: {
    name: string;
    image: string;
  } | null;
}

// Nova função de busca de dados
async function fetchMyOrders(userId: string): Promise<OrderWithProduct[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id,
      criado_em,
      status,
      total,
      products (name, image)
    `)
    .eq('user_id', userId)
    .order('criado_em', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  
  // O Supabase retorna um array para a relação, então pegamos o primeiro item
  return data.map(order => ({ ...order, products: Array.isArray(order.products) ? order.products[0] : order.products }));
}

const MeusPedidos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading, isError, error } = useQuery<OrderWithProduct[]>({ 
    queryKey: ['my-orders', user?.id], 
    queryFn: () => fetchMyOrders(user!.id),
    enabled: !!user,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
        <StatusWrapper
          isLoading={isLoading}
          isError={isError}
          error={error}
          skeleton={
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>ID do Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-16 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          }
        >
          {orders && orders.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>ID do Pedido</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} onClick={() => navigate(`/meus-pedidos/${order.id}`)} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-4">
                          {order.products?.image ? (
                            <img src={order.products.image} alt={order.products.name} className="w-16 h-16 object-cover rounded-md" />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">?</div>
                          )}
                          <span>{order.products?.name || 'Produto não disponível'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{new Date(order.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell><Badge>{order.status}</Badge></TableCell>
                      <TableCell className="text-right">{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Você ainda não fez nenhum pedido.</p>
            </div>
          )}
        </StatusWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default MeusPedidos;
