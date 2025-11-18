import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

// Supondo que você tenha um tipo Pedido definido em algum lugar
// Se não, podemos criar um básico aqui.
interface Pedido {
  id: number;
  criado_em: string;
  status: string;
  // Adicione outros campos que você busca, como nome do cliente, etc.
  // Ex: cliente_nome: string;
  // Ex: produto_nome: string;
}

async function fetchPedidos() {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id, criado_em, status') // Adicione os campos que desejar
    .order('criado_em', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
}

const AdminPedidos = () => {
  const { data: pedidos, isLoading, isError, error } = useQuery<Pedido[]>({ 
    queryKey: ['admin-pedidos'], 
    queryFn: fetchPedidos 
  });

  if (isLoading) return <div>Carregando pedidos...</div>;
  if (isError) return <div>Erro ao carregar pedidos: {error.message}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gerenciamento de Pedidos</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID do Pedido</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos?.map(pedido => (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">#{pedido.id}</TableCell>
              <TableCell>{new Date(pedido.criado_em).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>
                <Badge>{pedido.status}</Badge>
              </TableCell>
              <TableCell>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/admin/pedidos/${pedido.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPedidos;
