import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// 1. Definir o schema de validação com Zod
const addressSchema = z.object({
  customerName: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres.' }),
  customerEmail: z.string().email({ message: 'Por favor, insira um email válido.' }),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, { message: 'CEP inválido.' }),
  address: z.string().min(5, { message: 'Endereço deve ter pelo menos 5 caracteres.' }),
});

// Extrair o tipo do schema
type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onFormSubmit: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ onFormSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = (data: AddressFormData) => {
    console.log('Dados do endereço válidos:', data);
    // A lógica para salvar/usar esses dados será adicionada posteriormente
    onFormSubmit();
  };

  return (
    <form id="address-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Nome Completo</Label>
          <Input id="customerName" {...register('customerName')} />
          {errors.customerName && <p className="text-sm text-destructive">{errors.customerName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <Input id="customerEmail" type="email" {...register('customerEmail')} />
          {errors.customerEmail && <p className="text-sm text-destructive">{errors.customerEmail.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="zipCode">CEP</Label>
        <Input id="zipCode" {...register('zipCode')} />
        {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input id="address" {...register('address')} />
        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
      </div>
      {/* O botão de submit será o "Continuar para Pagamento" na página principal */}
    </form>
  );
};

export default AddressForm;
