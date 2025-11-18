import { BookOpen, GraduationCap, Home, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    icon: BookOpen,
    title: "Etiquetas Escolares",
    description: "Para material escolar, uniformes e objetos pessoais",
    color: "secondary",
    name: "etiquetas-escolares",
  },
  {
    icon: GraduationCap,
    title: "Kits Educativos",
    description: "Conjuntos completos para organização",
    color: "accent",
    name: "kits-educativos",
  },
  {
    icon: Home,
    title: "Casa & Organização",
    description: "Para potes, gavetas e compartimentos",
    color: "teal",
    name: "casa-organizacao",
  },
  {
    icon: Briefcase,
    title: "Corporativo",
    description: "Soluções personalizadas para empresas",
    color: "primary",
    name: "corporativo",
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
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {categories.map((category) => {
            const Icon = category.icon;
            const colorClasses = {
              secondary: "bg-secondary/10 hover:bg-secondary/20 border-secondary/20 text-secondary",
              accent: "bg-accent/10 hover:bg-accent/20 border-accent/20 text-accent",
              teal: "bg-teal/10 hover:bg-teal/20 border-teal/20 text-teal",
              primary: "bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary",
            };
            
            return (
              <div key={category.title}>
                <Card 
                  className={`${colorClasses[category.color as keyof typeof colorClasses]} border-2 transition-all cursor-pointer hover:scale-105 hover:shadow-lg w-64 h-64 rounded-full flex flex-col items-center justify-center text-center`}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-background/50 flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
