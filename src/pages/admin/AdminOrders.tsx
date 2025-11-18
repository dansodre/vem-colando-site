import { useQuery } from "@tanstack/react-query";
import { getAllOrders, updateOrder } from "@/services/orderApi";
import { Order } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminForm } from "@/hooks/useAdminForm";

const AdminOrders = () => {
  const { data: orders, isLoading } = useQuery<Order[]>({ queryKey: ['allOrders'], queryFn: getAllOrders });

  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    formData, 
    setFormData, 
    handleEdit, 
    handleSubmit, 
    isSaving 
  } = useAdminForm<Order>({
    queryKey: ['allOrders'],
    // @ts-ignore - create e delete não são necessários para pedidos
    createFn: async () => {}, 
    updateFn: updateOrder,
    // @ts-ignore
    deleteFn: async () => {},
    getInitialFormData: () => ({ status: 'Processando' }),
  });

  if (isLoading) {
    return <div>Carregando pedidos...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gerenciar Pedidos</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Pedido #{formData.id}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Status do Pedido</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processando">Processando</SelectItem>
                  <SelectItem value="Enviado">Enviado</SelectItem>
                  <SelectItem value="Entregue">Entregue</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Código de Rastreamento</Label>
              <Input value={formData.tracking_code || ''} onChange={(e) => setFormData({...formData, tracking_code: e.target.value})} />
            </div>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rastreamento</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
              <TableCell><Badge>{order.status}</Badge></TableCell>
              <TableCell>{order.tracking_code || 'N/A'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(order)}>Editar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminOrders;
