import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

// Interface para garantir que os itens tenham um ID
interface ItemWithId {
  id: number;
}

// Parâmetros que o hook receberá
interface UseAdminFormParams<T extends ItemWithId> {
  queryKey: string[];
  createFn: (data: Omit<T, 'id'>) => Promise<T>;
  updateFn: (id: number, data: Partial<T>) => Promise<T>;
  deleteFn: (id: number) => Promise<void>;
  getInitialFormData: () => Partial<T>;
  formatDataForEdit?: (item: T) => Partial<T>;
  prepareDataForSave?: (data: Partial<T>) => Promise<Partial<T>>;
}

export const useAdminForm = <T extends ItemWithId>({
  queryKey,
  createFn,
  updateFn,
  deleteFn,
  getInitialFormData,
  formatDataForEdit,
  prepareDataForSave,
}: UseAdminFormParams<T>) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<T>>(getInitialFormData());

  const mutation = useMutation({
    mutationFn: (itemData: Partial<T>) => {
      if (itemData.id) {
        const { id, ...data } = itemData;
        return updateFn(id, data as Partial<T>);
      } else {
        return createFn(itemData as Omit<T, 'id'>);
      }
    },
    onSuccess: () => {
      toast({ title: 'Sucesso!', description: 'Item salvo com sucesso.' });
      queryClient.invalidateQueries({ queryKey });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao Salvar', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      toast({ title: 'Sucesso!', description: 'Item excluído com sucesso.' });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao Excluir', description: error.message, variant: 'destructive' });
    },
  });

  const handleNew = useCallback(() => {
    setFormData(getInitialFormData());
    setIsDialogOpen(true);
  }, [getInitialFormData]);

  const handleEdit = useCallback((item: T) => {
    const formattedData = formatDataForEdit ? formatDataForEdit(item) : item;
    setFormData(formattedData);
    setIsDialogOpen(true);
  }, [formatDataForEdit]);

  const handleSubmit = (e: React.FormEvent, overrideData?: Partial<T>) => {
    e.preventDefault();
    const dataToSave = overrideData || formData;
    mutation.mutate(dataToSave);
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    formData,
    setFormData,
    handleNew,
    handleEdit,
    handleSubmit,
    deleteMutation,
    isSaving: mutation.isPending,
  };
};
