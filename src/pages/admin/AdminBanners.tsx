import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBanners, createBanner, updateBanner, deleteBanner, uploadBannerImage } from '@/services/siteApi';
import { Banner } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageCropper from '@/components/ImageCropper';
import { useAdminForm } from '@/hooks/useAdminForm';
import { useToast } from '@/components/ui/use-toast';

const AdminBanners = () => {
  const { data: banners, isLoading } = useQuery<Banner[]>({ queryKey: ['banners'], queryFn: getBanners });
  const { toast } = useToast();
  const [imageToCrop, setImageToCrop] = useState<{ src: string; type: 'desktop' | 'mobile' } | null>(null);

  const { 
    isDialogOpen, 
    setIsDialogOpen, 
    formData, 
    setFormData, 
    handleNew, 
    handleEdit, 
    handleSubmit,
    deleteMutation, 
    isSaving 
  } = useAdminForm<Banner>({
    queryKey: ['banners'],
    createFn: createBanner,
    updateFn: updateBanner,
    deleteFn: deleteBanner,
    getInitialFormData: () => ({ title: '', subtitle: '', button_text: '', button_link: '', is_active: true, sort_order: 0 }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImageToCrop({ src: reader.result as string, type }));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!imageToCrop) return;
    try {
      const croppedImageUrl = await uploadBannerImage(new File([croppedImageBlob], 'cropped.png', { type: 'image/png' }));
      if (imageToCrop.type === 'desktop') {
        setFormData(prev => ({ ...prev, image_url_desktop: croppedImageUrl }));
      } else {
        setFormData(prev => ({ ...prev, image_url_mobile: croppedImageUrl }));
      }
      setImageToCrop(null);
      toast({ title: 'Sucesso', description: 'Imagem enquadrada.' });
    } catch (error) {
      toast({ title: 'Erro de Upload', description: (error as Error).message, variant: 'destructive' });
    }
  };

  if (isLoading) return <div>Carregando banners...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Banners da Home</h1>
        <Button onClick={handleNew}>Adicionar Novo Banner</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>{formData.id ? 'Editar Banner' : 'Adicionar Novo Banner'}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Título" />
            <Input name="subtitle" value={formData.subtitle || ''} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} placeholder="Subtítulo" />
            <div>
              <Label>Imagem Desktop</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'desktop')} />
              {formData.image_url_desktop && <img src={formData.image_url_desktop} className="w-32 h-auto mt-2 rounded"/>}
              <p className="text-sm text-muted-foreground mt-1">Recomendado: 1920x600px</p>
            </div>
            <div>
              <Label>Imagem Mobile</Label>
              <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'mobile')} />
              {formData.image_url_mobile && <img src={formData.image_url_mobile} className="w-32 h-auto mt-2 rounded"/>}
              <p className="text-sm text-muted-foreground mt-1">Recomendado: 600x800px</p>
            </div>
            <Input name="button_text" value={formData.button_text || ''} onChange={(e) => setFormData({...formData, button_text: e.target.value})} placeholder="Texto do Botão" />
            <Input name="button_link" value={formData.button_link || ''} onChange={(e) => setFormData({...formData, button_link: e.target.value})} placeholder="Link do Botão (ex: /produtos/123)" />
            <Input name="sort_order" type="number" value={formData.sort_order || 0} onChange={(e) => setFormData({...formData, sort_order: Number(e.target.value)})} placeholder="Ordem de Exibição" />
            <div className="flex items-center space-x-2">
              <Checkbox id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData({...formData, is_active: !!checked})} />
              <label htmlFor="is_active">Ativo?</label>
            </div>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : (formData.id ? 'Salvar Alterações' : 'Criar Banner')}</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para o Cropper */}
      <Dialog open={!!imageToCrop} onOpenChange={() => setImageToCrop(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Enquadrar Imagem</DialogTitle></DialogHeader>
          {imageToCrop && (
            <ImageCropper 
              imageSrc={imageToCrop.src}
              onCropComplete={handleCropComplete}
              aspect={imageToCrop.type === 'desktop' ? 1920 / 600 : 600 / 800}
            />
          )}
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader><TableRow><TableHead>Ordem</TableHead><TableHead>Título</TableHead><TableHead>Ativo</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
        <TableBody>
          {banners?.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>{banner.sort_order}</TableCell>
              <TableCell>{banner.title}</TableCell>
              <TableCell>{banner.is_active ? 'Sim' : 'Não'}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(banner.id)} className="ml-2">Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminBanners;
