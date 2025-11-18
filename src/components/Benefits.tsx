import { Truck, Shield, Sparkles, HeadphonesIcon } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Nas compras acima de R$ 99",
  },
  {
    icon: Shield,
    title: "Compra Segura",
    description: "Pagamento 100% protegido",
  },
  {
    icon: Sparkles,
    title: "Personalização",
    description: "Crie etiquetas únicas",
  },
  {
    icon: HeadphonesIcon,
    title: "Suporte Dedicado",
    description: "Estamos aqui para ajudar",
  },
];

const Benefits = () => {
  return (
    <section className="py-16 bg-primary/5 border-y border-primary/10">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="flex flex-col items-center text-center space-y-3">
                <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-bold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
