import { Skeleton } from "@/components/ui/skeleton";

export const ProductDetailSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-12 items-start">
    {/* Coluna da Imagem */}
    <div className="relative">
      <Skeleton className="w-full aspect-square" />
    </div>

    {/* Coluna de Informações */}
    <div className="space-y-6">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-8 w-1/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  </div>
);
