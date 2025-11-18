import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Ana Silva",
    role: "Mãe de 2",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    testimonial: "As etiquetas são incríveis! Super resistentes, não desbotam e meu filho adora os desenhos. Facilitou muito a minha vida na hora de organizar o material escolar.",
  },
  {
    name: "Juliana Costa",
    role: "Professora",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    testimonial: "Uso os kits educativos em sala de aula e eles são fantásticos. As crianças aprendem de forma lúdica e a qualidade do material é excelente. Recomendo!",
  },
  {
    name: "Marcos Pereira",
    role: "Pai",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    testimonial: "Comprei as etiquetas para organizar as coisas em casa e adorei. São fáceis de aplicar e muito duráveis. O resultado ficou ótimo, tudo bem identificado.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">O que nossos clientes dizem</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">A satisfação de quem confia em nosso trabalho é a nossa maior recompensa.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <Card key={item.name} className="bg-card shadow-lg">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-24 h-24 rounded-full mb-4 border-4 border-primary/20"
                />
                <p className="text-muted-foreground mb-4 font-light italic">\"{item.testimonial}\"</p>
                <h3 className="font-bold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
