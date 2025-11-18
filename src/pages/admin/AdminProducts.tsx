import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from "@/services/productApi";
import { Product } from "@/types";
import ProductForm, { ProductFormSubmitValues } from "@/components/admin/ProductForm";

const AdminProducts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: getProducts,
  });


    const mutation = useMutation({
    mutationFn: async (data: ProductFormSubmitValues) => {
      let imageUrl = selectedProduct?.image;
      if (data.image && data.image[0]) {
        imageUrl = await uploadProductImage(data.image[0]);
      }

      let additionalImages = data.existingAdditionalImages || selectedProduct?.additional_images || [];
      if (data.additional_images && data.additional_images.length > 0) {
        const uploaded = await Promise.all(
          Array.from(data.additional_images as FileList).map((file) => uploadProductImage(file))
        );
        additionalImages = [...additionalImages, ...uploaded];
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        original_price: data.original_price,
        category_id: data.category_id,
        image: imageUrl,
        additional_images: additionalImages,
      };

      if (selectedProduct) {
        return updateProduct(selectedProduct.id, productData);
      } else {
        return createProduct(productData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Sucesso", description: `Produto ${selectedProduct ? 'atualizado' : 'criado'}.` });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const handleFormSubmit = (data: ProductFormSubmitValues) => {
    mutation.mutate(data);
  };

    const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Sucesso", description: "Produto deletado." });
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar este produto?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedProduct(undefined)}>Adicionar Produto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProduct ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
            </DialogHeader>
            <ProductForm 
              product={selectedProduct}
              onSubmit={handleFormSubmit} 
              onClose={() => setIsDialogOpen(false)} 
              isSubmitting={mutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Carregando...</TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-destructive">{error.message}</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.categories?.name || 'N/A'}</TableCell>
                  <TableCell>{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedProduct(product); setIsDialogOpen(true); }}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>Deletar</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProducts;


