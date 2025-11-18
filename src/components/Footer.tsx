import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png";

const WHATSAPP_NUMBER = "5571992056669";
const WHATSAPP_DISPLAY = "(71) 99205-6669";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img src={logo} alt="Vem Colando" className="h-24 w-auto brightness-0 invert" />
            <p className="text-sm text-primary-foreground/80">
              Etiquetas personalizadas que organizam e transformam o seu dia a dia.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-10 w-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Institucional</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Como Funciona</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Trabalhe Conosco</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Ajuda</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Políticas de Troca</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Rastreamento</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Contato</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:contato@vemcolando.com.br" className="hover:text-primary-foreground transition-colors">
                  contato@vemcolando.com.br
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-[#25D366]" />
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{WHATSAPP_DISPLAY}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Bahia, Brasil</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} Vem Colando. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
