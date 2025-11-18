import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const couponSchema = z.object({
  code: z.string().min(3, 'O código deve ter pelo menos 3 caracteres'),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  value: z.coerce.number().optional(),
  expires_at: z.string().optional(),
  is_active: z.boolean().default(true),
}).refine(data => data.type === 'FREE_SHIPPING' || (data.value !== undefined && data.value > 0), {
  message: 'O valor é obrigatório para este tipo de cupom',
  path: ['value'],
});

const AdminCupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(couponSchema),
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Erro ao buscar cupons', description: error.message, variant: 'destructive' });
    } else {
      setCoupons(data);
    }
  };

  const onSubmit = async (formData: any) => {
    const { data, error } = editingCoupon
      ? await supabase.from('coupons').update(formData).eq('id', editingCoupon.id)
      : await supabase.from('coupons').insert([formData]);

    if (error) {
      toast({ title: 'Erro ao salvar cupom', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: `Cupom ${editingCoupon ? 'atualizado' : 'criado'} com sucesso!` });
      fetchCoupons();
      setIsDialogOpen(false);
    }
  };

  const openDialog = (coupon: any | null = null) => {
    setEditingCoupon(coupon);
    if (coupon) {
      reset({
        ...coupon,
        expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().substring(0, 16) : '',
      });
    } else {
      reset({ code: '', type: 'PERCENTAGE', value: 0, expires_at: '', is_active: true });
    }
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Cupons</h1>
        <Button onClick={() => openDialog()}> <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Cupom</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Expira em</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-medium">{coupon.code}</TableCell>
              <TableCell>{coupon.type}</TableCell>
              <TableCell>{coupon.type !== 'FREE_SHIPPING' ? coupon.value : 'N/A'}</TableCell>
              <TableCell>{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('pt-BR') : 'Não expira'}</TableCell>
              <TableCell>{coupon.is_active ? 'Ativo' : 'Inativo'}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => openDialog(coupon)}><Edit className="h-4 w-4" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Editar Cupom' : 'Criar Novo Cupom'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="code">Código do Cupom</Label>
              <Input id="code" {...register('code')} />
              {errors.code && <p className="text-red-500 text-sm">{errors.code.message as string}</p>}
            </div>
            <div>
              <Label>Tipo de Desconto</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERCENTAGE">Porcentagem (%)</SelectItem>
                      <SelectItem value="FIXED_AMOUNT">Valor Fixo (R$)</SelectItem>
                      <SelectItem value="FREE_SHIPPING">Frete Grátis</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="value">Valor</Label>
              <Input id="value" type="number" step="0.01" {...register('value')} />
              {errors.value && <p className="text-red-500 text-sm">{errors.value.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="expires_at">Data de Expiração</Label>
              <Input id="expires_at" type="datetime-local" {...register('expires_at')} />
            </div>
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCupons;
