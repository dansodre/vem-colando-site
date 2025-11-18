import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Tipo expandido para incluir detalhes do produto
interface Personalizacao {
  id: string;
  preview_url: string;
}

interface Produto {
  id: number;
  name: string;
  image: string;
}

// Tipos ajustados para corresponder à resposta da API do Supabase
interface PedidoFromAPI {
  id: number;
  criado_em: string;
  status: string;
  personalizacoes: Personalizacao[]; // Supabase retorna como array
  products: Produto[]; // Supabase retorna como array
}

// Tipo que usamos no componente após o tratamento
interface PedidoDetalhe {
  id: number;
  criado_em: string;
  status: string;
  personalizacoes: Personalizacao | null;
  products: Produto | null;
}

const fetchPedidoDetalhe = async (id: string): Promise<PedidoDetalhe> => {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      id,
      criado_em,
      status,
      personalizacoes (id, preview_url),
      products (id, name, image)
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('Pedido não encontrado.');

  // Força a tipagem correta e transforma a resposta da API
  const apiResponse = data as unknown as PedidoFromAPI;

  const pedidoTratado: PedidoDetalhe = {
    ...apiResponse,
    personalizacoes: apiResponse.personalizacoes?.[0] || null,
    products: apiResponse.products?.[0] || null,
  };

  return pedidoTratado;
};

const updateStatusPedido = async ({ id, status }: { id: number; status: string }) => {
  const { error } = await supabase
    .from('pedidos')
    .update({ status })
    .eq('id', id);

  if (error) throw new Error(error.message);
};

const AdminPedidoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: pedido, isLoading, isError, error } = useQuery({
    queryKey: ['pedido-detalhe', id],
    queryFn: () => fetchPedidoDetalhe(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateStatusPedido,
    onSuccess: () => {
      toast.success('Status do pedido atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['pedido-detalhe', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-pedidos'] });
    },
    onError: (err) => {
      toast.error(`Erro ao atualizar status: ${err.message}`);
    },
  });

  const handleStatusChange = (newStatus: string) => {
    if (pedido) {
      mutation.mutate({ id: pedido.id, status: newStatus });
    }
  };

  if (isLoading) return <div>Carregando detalhes do pedido...</div>;
  if (isError) return <div>Erro: {error.message}</div>;
  if (!pedido) return <div>Pedido não encontrado.</div>;

  const personalizationUrl = pedido.personalizacoes ? `https://personalize.vemcolando.com.br/?pedidoId=${pedido.personalizacoes.id}` : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Detalhes do Pedido #{pedido.id}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            {pedido.products ? (
              <div className="flex items-center gap-4">
                <img src={pedido.products.image} alt={pedido.products.name} className="w-24 h-24 object-cover rounded-md" />
                <div>
                  <p className="font-semibold text-lg">{pedido.products.name}</p>
                  <Button asChild variant="link" className="p-0 h-auto">
                    <Link to={`/produto/${pedido.products.id}`} target="_blank">Ver página do produto</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <p>Produto não associado a este pedido.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Data: {new Date(pedido.criado_em).toLocaleString('pt-BR')}</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alterar Status</label>
              <Select onValueChange={handleStatusChange} defaultValue={pedido.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="pagamento_pendente">Pagamento Pendente</SelectItem>
                  <SelectItem value="em_producao">Em Produção</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personalização do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          {personalizationUrl ? (
            <>
              <p className="mb-4">Use o link abaixo para visualizar o design criado pelo cliente no sistema de personalização.</p>
              <Button asChild>
                <a href={personalizationUrl} target="_blank" rel="noopener noreferrer">
                  Ver Personalização
                </a>
              </Button>
            </>
          ) : (
            <p>Este pedido não possui personalização.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPedidoDetalhe;
