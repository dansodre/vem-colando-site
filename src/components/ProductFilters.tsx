import { useQuery } from "@tanstack/react-query";
import { getCategories, GetProductsParams } from "@/services/productApi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";

interface ProductFiltersProps {
  filters: GetProductsParams;
  onFilterChange: (filters: GetProductsParams) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters = {}, onFilterChange }) => {
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  const handlePriceChange = (value: number[]) => {
    onFilterChange({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const handleCategoryChange = (category: string | null) => {
    onFilterChange({ ...filters, category });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const priceRange: [number, number] = [filters.minPrice || 0, filters.maxPrice || 500];

  return (
    <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
      <div className="sticky top-28 space-y-8">
        <div>
          <Label htmlFor="search">Buscar por nome</Label>
          <Input 
            id="search"
            placeholder="Ex: Adesivo escolar..."
            value={filters.searchTerm || ''}
            onChange={handleSearchChange}
          />
        </div>

        <div>
          <Label>Ordenar por</Label>
          <Select 
            value={filters.sortBy || 'newest'} 
            onValueChange={(value) => onFilterChange({ ...filters, sortBy: value as GetProductsParams['sortBy'] })}
          >
            <SelectTrigger><SelectValue placeholder="Padrão" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais Recentes</SelectItem>
              <SelectItem value="price_asc">Menor Preço</SelectItem>
              <SelectItem value="price_desc">Maior Preço</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Categorias</h3>
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <Button
              variant={!filters.category ? "secondary" : "ghost"}
              onClick={() => handleCategoryChange(null)}
              className="justify-start flex-shrink-0 md:flex-shrink-1"
            >
              Todas
            </Button>
            {categories?.map((category) => (
              <Button
                key={category.id}
                variant={filters.category === category.name ? "secondary" : "ghost"}
                onClick={() => handleCategoryChange(category.name)}
                className="justify-start flex-shrink-0 md:flex-shrink-1"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Faixa de Preço</Label>
          <Slider
            min={0}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mt-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default ProductFilters;