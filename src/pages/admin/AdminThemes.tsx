import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getThemes, createTheme, updateTheme, deleteTheme, uploadThemeImage, getCategories, getProducts } from '@/services/productApi';
import { Category } from '@/services/productApi';
import { Product } from '@/types';
import { Theme } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminForm } from '@/hooks/useAdminForm';

const AdminThemes = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: themes, isLoading: isLoadingThemes } = useQuery({ queryKey: ['themes'], queryFn: getThemes });
  const { data: categories, isLoading: isLoadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: products, isLoading: isLoadingProducts } = useQuery({ queryKey: ['products'], queryFn: () => getProducts() });

  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    formData, 
    setFormData, 
    handleNew, 
    handleEdit, 
    handleSubmit: originalHandleSubmit, 
    deleteMutation, 
    isSaving 
  } = useAdminForm<Theme>({
    queryKey: ['themes'],
    createFn: createTheme,
    updateFn: updateTheme,
    deleteFn: deleteTheme,
    getInitialFormData: () => ({ name: '', category: '', product_id: 0, image_url: '' }),
  });

  if (!isDialogOpen && imageFile) {
    setImageFile(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = formData.image_url;
    if (imageFile) {
      finalImageUrl = await uploadThemeImage(imageFile);
    }
    const finalData = { ...formData, image_url: finalImageUrl, product_id: Number(formData.product_id) };
    originalHandleSubmit(e, finalData);
  };

  const isLoading = isLoadingThemes || isLoadingCategories || isLoadingProducts;
  if (isLoading) return <div>Carregando dados...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Temas</h1>
        <Button onClick={handleNew}>Adicionar Novo Tema</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Editar Tema' : 'Adicionar Novo Tema'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nome do Tema" required />
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger><SelectValue placeholder="Selecione uma Categoria" /></SelectTrigger>
              <SelectContent>
                {categories?.map((cat: Category) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(formData.product_id)} onValueChange={(value) => setFormData({...formData, product_id: Number(value)})}>
              <SelectTrigger><SelectValue placeholder="Selecione um Produto" /></SelectTrigger>
              <SelectContent>
                {products?.map((prod: Product) => (
                  <SelectItem key={prod.id} value={String(prod.id)}>{prod.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <Label htmlFor="image">Imagem do Tema</Label>
              <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
              <p className="text-sm text-muted-foreground mt-1">Recomendado: 200x200px, formato PNG com fundo transparente.</p>
              {formData.image_url && !imageFile && <img src={formData.image_url} alt="Preview" className="mt-2 h-20 w-20 object-cover" />}
            </div>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : (formData.id ? 'Salvar Alterações' : 'Criar Tema')}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>ID do Produto</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {themes?.map((theme) => (
            <TableRow key={theme.id}>
              <TableCell>{theme.id}</TableCell>
              <TableCell>{theme.name}</TableCell>
              <TableCell>{theme.category}</TableCell>
              <TableCell>{theme.product_id}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(theme)}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(theme.id)} className="ml-2">Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminThemes;
