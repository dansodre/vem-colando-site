import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const ConfirmacaoDesign = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pedidoId, setPedidoId] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pId = params.get('pedidoId');
    const designStatus = params.get('design');

    if (pId && designStatus === 'ok') {
      setPedidoId(pId);
      // Opcional: Verificar se o pedido realmente existe e pertence ao usuário
      // Por simplicidade, vamos apenas confiar nos parâmetros por enquanto.
      setIsValid(true);
    } else {
      // Redireciona se os parâmetros estiverem incorretos
      navigate('/');
    }
    setIsLoading(false);
  }, [location, navigate]);

  if (isLoading) {
    return <div>Verificando personalização...</div>;
  }

  if (!isValid) {
    // Este estado não deve ser alcançado devido ao redirect, mas é uma salvaguarda.
    return <div>Link de confirmação inválido.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-lg p-8 border rounded-lg shadow-lg">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Design Salvo com Sucesso!</h1>
          <p className="text-muted-foreground mb-6">
            Sua personalização para o pedido <span className="font-semibold">#{pedidoId?.substring(0, 8)}...</span> foi recebida. Agora, você pode finalizar a compra.
          </p>
          <Link to={`/checkout?pedidoId=${pedidoId}`}>
            <Button size="lg" className="w-full">Finalizar Compra e Pagar</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConfirmacaoDesign;
