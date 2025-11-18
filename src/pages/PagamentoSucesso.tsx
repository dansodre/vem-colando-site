import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const PagamentoSucesso = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-lg p-8 border rounded-lg shadow-lg bg-background">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Pagamento Aprovado!</h1>
          <p className="text-muted-foreground mb-6">
            Obrigado por sua compra! Em breve você receberá um email com os detalhes do seu pedido.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/meus-pedidos">
              <Button variant="outline">Ver Meus Pedidos</Button>
            </Link>
            <Link to="/">
              <Button>Continuar Comprando</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PagamentoSucesso;
