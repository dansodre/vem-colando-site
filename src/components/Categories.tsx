import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Etiquetas Escolares",
    description: "Para material escolar, uniformes e objetos pessoais",
    imageUrl: "/categories/imagem_kit_6.png",
    name: "etiquetas-escolares",
    color: "teal",
  },
  {
    title: "Kits Educativos",
    description: "Conjuntos completos para organização",
    imageUrl: "/categories/imagem_kit_4.png",
    name: "kits-educativos",
    color: "accent",
  },
  {
    title: "Casa & Organização",
    description: "Para potes, gavetas e compartimentos",
    imageUrl: "/categories/imagem_empreendedor.png",
    name: "casa-organizacao",
    color: "secondary",
  },
  {
    title: "Corporativo",
    description: "Soluções personalizadas para empresas",
    imageUrl: "/categories/imagem_embalagem_empreendedor.png",
    name: "corporativo",
    color: "primary",
  },
];

const Categories = () => {
  return (
    <section id="categorias" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nossas Categorias
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre a solução perfeita para suas necessidades de identificação e organização
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {categories.map((category) => {
            const colorClasses = {
              teal: "border-teal-500 bg-teal-500 hover:bg-teal-600",
              accent: "border-green-500 bg-green-500 hover:bg-green-600",
              secondary: "border-orange-500 bg-orange-500 hover:bg-orange-600",
              primary: "border-purple-500 bg-purple-500 hover:bg-purple-600",
            };
            const borderClass = colorClasses[category.color as keyof typeof colorClasses].split(' ')[0];
            const buttonClass = colorClasses[category.color as keyof typeof colorClasses].split(' ').slice(1).join(' ');

            return (
              <div key={category.title} className="flex flex-col items-center text-center gap-4 group">
                <Card className={`relative w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 ${borderClass} transition-transform duration-300 group-hover:scale-105`}>
                  <img src={category.imageUrl} alt={category.title} className="w-full h-full object-cover" />
                </Card>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-foreground">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground px-4 max-w-xs">
                    {category.description}
                  </p>
                </div>
                <Link to={`/produtos?category=${category.name}`}>
                  <Button className={`${buttonClass} text-white rounded-full px-6`}>Explore</Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
