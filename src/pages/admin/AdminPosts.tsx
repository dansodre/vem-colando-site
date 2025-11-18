import { useQuery } from '@tanstack/react-query';
import { getPosts, createPost, updatePost, deletePost, uploadPostImage } from '@/services/productApi';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useAdminForm } from '@/hooks/useAdminForm';
import { useState } from 'react';

// Função para criar um slug a partir de um título
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove caracteres não alfanuméricos
    .replace(/\s+/g, '-') // substitui espaços por hífens
    .replace(/-+/g, '-'); // remove hífens duplicados
};

const AdminPosts = () => {
  const { data: posts, isLoading } = useQuery<Post[]>({ queryKey: ['posts'], queryFn: () => getPosts() });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    formData, 
    setFormData, 
    handleNew, 
    handleEdit, 
    handleSubmit: originalHandleSubmit, // Renomeia o handleSubmit do hook
    deleteMutation, 
    isSaving 
  } = useAdminForm<Post>({
    queryKey: ['posts'],
    createFn: createPost,
    updateFn: updatePost,
    deleteFn: deletePost,
    getInitialFormData: () => ({ 
      title: '', content: '', author: '', image_url: '', 
      published_at: new Date().toISOString().slice(0, 16), is_featured: false 
    }),
    formatDataForEdit: (post) => ({
      ...post,
      published_at: post.published_at ? post.published_at.slice(0, 16) : '',
    }),
  });

  // Limpa o arquivo de imagem ao fechar o diálogo
  if (!isDialogOpen && imageFile) {
    setImageFile(null);
  }

  // Cria um novo handleSubmit que envolve o do hook
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = formData.image_url;
      if (imageFile) {
        finalImageUrl = await uploadPostImage(imageFile);
      }
      const slug = createSlug(formData.title || '');
      const finalData = { ...formData, slug, image_url: finalImageUrl };
      originalHandleSubmit(e, finalData);
    } catch (error) {
      console.error("Erro ao preparar dados para salvar:", error);
    }
  };

  if (isLoading) return <div>Carregando posts...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Posts do Blog</h1>
        <Button onClick={handleNew}>Adicionar Novo Post</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90vh]">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>{formData.id ? 'Editar Post' : 'Adicionar Novo Post'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Título do Post" required />
            <SimpleMDE value={formData.content || ''} onChange={(value) => setFormData({...formData, content: value})} />
            <Input name="author" value={formData.author || ''} onChange={(e) => setFormData({...formData, author: e.target.value})} placeholder="Autor" required />
            <div>
              <Label htmlFor="image">Imagem de Capa</Label>
              <Input id="image" type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
              <p className="text-sm text-muted-foreground mt-1">Recomendado: 1200x630px.</p>
              {formData.image_url && !imageFile && <img src={formData.image_url} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded-md" />}
              {imageFile && <p className="text-sm text-green-600 mt-1">Nova imagem selecionada: {imageFile.name}</p>}
            </div>
            <div>
              <Label htmlFor="published_at">Data de Publicação</Label>
              <Input id="published_at" type="datetime-local" value={formData.published_at || ''} onChange={(e) => setFormData({...formData, published_at: e.target.value})} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="is_featured" checked={formData.is_featured} onCheckedChange={(checked) => setFormData({...formData, is_featured: !!checked})} />
              <label htmlFor="is_featured" className="text-sm font-medium leading-none">Destacar na Página Inicial?</label>
            </div>
            <div className="p-6 pt-0">
                <Button type="submit" disabled={isSaving} className="w-full">{isSaving ? 'Salvando...' : (formData.id ? 'Salvar Alterações' : 'Criar Post')}</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Publicado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.author}</TableCell>
              <TableCell>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Rascunho'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(post.id)} className="ml-2">Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPosts;
