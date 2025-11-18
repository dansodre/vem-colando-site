import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// As variáveis de ambiente serão configuradas no painel do Supabase
const MELHOR_ENVIO_TOKEN = Deno.env.get('MELHOR_ENVIO_TOKEN');
const ORIGIN_POSTAL_CODE = Deno.env.get('ORIGIN_POSTAL_CODE');

// Função para lidar com as requisições CORS (necessário para o navegador)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Responde imediatamente a requisições OPTIONS (pre-flight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to_postal_code, products } = await req.json();

    if (!to_postal_code || !products) {
      throw new Error('CEP de destino e produtos são obrigatórios.');
    }

    const response = await fetch('https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`,
        'User-Agent': 'Vem Colando (danilosodre@gmail.com)', // Substitua pelo seu e-mail
      },
      body: JSON.stringify({
        from: { postal_code: ORIGIN_POSTAL_CODE },
        to: { postal_code: to_postal_code },
        products: products,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Tenta extrair uma mensagem de erro mais detalhada da resposta da API
      const errorMessage = data?.errors?.from || data.message || 'Erro na API do Melhor Envio.';
      throw new Error(errorMessage);
    }

    // Filtra opções que possam ter retornado com erro
    const validOptions = data.filter((option: any) => !option.error);

    return new Response(
      JSON.stringify(validOptions),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
