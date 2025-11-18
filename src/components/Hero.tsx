import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MessageCircle } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const WHATSAPP_NUMBER = "5571992056669";
const WHATSAPP_MESSAGE = "Olá! Gostaria de criar etiquetas personalizadas.";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 mx-auto md:mx-0">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Etiquetas Personalizadas</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Cole suas ideias, organize sua vida!
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              Etiquetas escolares, adesivos criativos e kits organizacionais que transformam o dia a dia de pais, professores e crianças.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href="/produtos">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground group">
                  Nossa Loja
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="/produto/1">  {/* Link para um produto personalizável padrão */}
                <Button size="lg" variant="outline" className="w-full">
                  Criar Etiqueta Personalizada
                </Button>
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 via-accent/20 to-teal/20 rounded-3xl blur-3xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-background">
              <img 
                src={heroBackground} 
                alt="Etiquetas e adesivos coloridos personalizados"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
