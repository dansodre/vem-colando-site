import { Link } from "react-router-dom";
import { ShoppingCart, Search, User, Menu, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const WHATSAPP_NUMBER = "5571992056669";
const WHATSAPP_MESSAGE = "Olá! Gostaria de saber mais sobre os produtos Vem Colando.";

const Header = () => {
  const { cartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-b-purple-500/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 lg:px-10 max-w-[1400px]">
        <div className="flex h-[5.5rem] items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center -my-1">
              <img src={logo} alt="Vem Colando" className="h-[92px] w-auto" />
            </a>
            <nav className="hidden md:flex items-center gap-8 text-xl font-semibold tracking-tight">
              <Link to="/" className="inline-flex items-center text-foreground/80 transition-colors duration-[1200ms] ease-out hover:text-secondary hover:scale-[1.03]">
                Home
              </Link>
              <Link to="/produtos" className="inline-flex items-center text-foreground/80 transition-colors duration-[1200ms] ease-out hover:text-secondary hover:scale-[1.03]">
                Nossa Loja
              </Link>
              <Link to="/categorias" className="inline-flex items-center text-foreground/80 transition-colors duration-[1200ms] ease-out hover:text-secondary hover:scale-[1.03]">
                Categorias
              </Link>
              <Link to="/sobre" className="inline-flex items-center text-foreground/80 transition-colors duration-[1200ms] ease-out hover:text-secondary hover:scale-[1.03]">
                Sobre Nós
              </Link>
              <Link to="/blog" className="inline-flex items-center text-foreground/80 transition-colors duration-[1200ms] ease-out hover:text-secondary hover:scale-[1.03]">Blog</Link>
              <Link to="/contato" className="inline-flex items-center text-foreground/80 transition-colors duration-[1200ms] ease-out hover:text-secondary hover:scale-[1.03]">
                Contato
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex"
            >
              <Button variant="default" className="bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden xl:inline">WhatsApp</span>
              </Button>
            </a>
            <Link to="/busca">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-50" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.user_metadata.full_name || user?.user_metadata.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/meus-pedidos">
                    <DropdownMenuItem>Meus Pedidos</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={logout}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link to="/carrinho" aria-label="Abrir carrinho">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary text-xs font-bold text-secondary-foreground flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-3/4">
                <nav className="grid gap-6 text-base font-semibold mt-8 text-foreground/80">
                  <Link to="/" className="flex items-center gap-2 text-lg  mb-4">
                    <img src={logo} alt="Vem Colando" className="h-12 w-auto" />
                    <span className="font-bold">Vem Colando</span>
                  </Link>
                  <Link to="/produtos" className="hover:text-foreground">Nossa Loja</Link>
                  <Link to="/categorias" className="text-muted-foreground hover:text-foreground">Categorias</Link>
                  <Link to="/sobre" className="text-muted-foreground hover:text-foreground">Sobre Nós</Link>
                  <Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link>
                  <Link to="/contato" className="text-muted-foreground hover:text-foreground">Contato</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
