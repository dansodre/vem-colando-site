import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Função para gerar token
async function getMelhorEnvioToken() {
  const clientId = Deno.env.get("MELHORENVIO_CLIENT_ID");
  const clientSecret = Deno.env.get("MELHORENVIO_CLIENT_SECRET");
  const env = Deno.env.get("MELHORENVIO_ENV") || "sandbox";

  const baseUrl = env === "production"
    ? "https://www.melhorenvio.com.br"
    : "https://sandbox.melhorenvio.com.br";

  const res = await fetch(`${baseUrl}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Erro ao gerar token no Melhor Envio');
  }
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to_postal_code, products } = await req.json();

    if (!to_postal_code || !products) {
      return new Response(JSON.stringify({ error: "CEP destino e produtos são obrigatórios" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = await getMelhorEnvioToken();
    const env = Deno.env.get("MELHORENVIO_ENV") || "sandbox";

    const baseUrl = env === "production"
      ? "https://www.melhorenvio.com.br"
      : "https://sandbox.melhorenvio.com.br";

    const response = await fetch(`${baseUrl}/api/v2/me/shipment/calculate`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "User-Agent": "Vem Colando (eng.danilosodre@gmail.com)",
      },
      body: JSON.stringify({
        from: { postal_code: "49095806" }, // seu CEP de origem
        to: { postal_code: to_postal_code },
        products,
      }),
    });

    const frete = await response.json();
    if (!response.ok) {
      throw new Error(frete.message || 'Erro ao calcular frete no Melhor Envio');
    }

    return new Response(JSON.stringify(frete), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
