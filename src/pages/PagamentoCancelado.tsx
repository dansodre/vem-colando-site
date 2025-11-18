import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const PagamentoCancelado = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-lg p-8 border rounded-lg shadow-lg bg-background">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Pagamento Cancelado</h1>
          <p className="text-muted-foreground mb-6">
            Parece que a transação foi cancelada. Seu carrinho ainda está salvo se quiser tentar novamente.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/carrinho">
              <Button variant="outline">Ver Meu Carrinho</Button>
            </Link>
            <Link to="/">
              <Button>Página Inicial</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PagamentoCancelado;
