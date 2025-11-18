import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/types";
import { getCategories, Category } from "@/services/categoryApi";

const productSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: "Preço de venda deve ser positivo." }),
  original_price: z.coerce.number().optional(),
  image: z.any(),
  additional_images: z.any().optional(),
  category_id: z.coerce.number({ required_error: "Categoria é obrigatória." }),
});

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductFormSubmitValues = ProductFormValues & { existingAdditionalImages: string[] };

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormSubmitValues) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const ProductForm = ({ product, onSubmit, onClose, isSubmitting }: ProductFormProps) => {
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>(product?.additional_images ?? []);
  const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? { ...product, image: undefined, additional_images: undefined }
      : {},
  });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setExistingAdditionalImages(product?.additional_images ?? []);
    reset(product
      ? { ...product, image: undefined, additional_images: undefined }
      : {});
  }, [product, reset]);

  const selectedCategoryId = watch("category_id");

  const handleRemoveAdditionalImage = (imageUrl: string) => {
    setExistingAdditionalImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleFormSubmit = (data: ProductFormValues) => {
    onSubmit({ ...data, existingAdditionalImages });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" {...register("description")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="original_price">Preço Original (De)</Label>
          <Input id="original_price" type="number" step="0.01" {...register("original_price")} />
          {errors.original_price && <p className="text-sm text-destructive">{errors.original_price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Preço de Venda (Por)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="category_id">Categoria</Label>
          <Select onValueChange={(value) => setValue('category_id', Number(value))} value={String(selectedCategoryId)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Imagem do Produto</Label>
        <Input id="image" type="file" {...register("image")} />
        {errors.image && <p className="text-sm text-destructive">{(errors.image as any).message}</p>}
        {product?.image && <img src={product.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />}
      </div>
      <div className="space-y-2">
        <Label htmlFor="additional_images">Imagens Adicionais</Label>
        {existingAdditionalImages.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {existingAdditionalImages.map((imageUrl) => (
              <div key={imageUrl} className="relative">
                <img src={imageUrl} alt="Imagem adicional" className="h-20 w-20 object-cover rounded-md" />
                <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => handleRemoveAdditionalImage(imageUrl)}>
                  Remover
                </Button>
              </div>
            ))}
          </div>
        )}
        <Input id="additional_images" type="file" multiple {...register("additional_images")} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </form>
  );
};

export default ProductForm;

