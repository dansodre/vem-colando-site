import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Mail className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Receba Ofertas Exclusivas
          </h2>
          
          <p className="text-lg text-white/90">
            Cadastre-se e ganhe 10% de desconto na primeira compra!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Seu melhor e-mail"
              className="bg-white/90 border-0 h-12"
            />
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold whitespace-nowrap h-12">
              Inscrever-se
            </Button>
          </div>
          
          <p className="text-sm text-white/80">
            Suas informações estão seguras conosco
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
