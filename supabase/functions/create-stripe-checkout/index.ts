import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@10.17.0";

const stripe = Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
  // @ts-ignore: Stripe Deno polyfill requires this
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2022-11-15",
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Function received a request.");
    const { cartItems, userId, draftOrderId } = await req.json();
    console.log("Received cartItems:", JSON.stringify(cartItems, null, 2));

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("cartItems is missing, not an array, or empty.");
    }

    const line_items = (cartItems as CartItem[]).map((item) => {
      if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        throw new Error(`Invalid item in cart: ${JSON.stringify(item)}`);
      }
      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Preço em centavos
        },
        quantity: item.quantity,
      };
    });
    console.log("Constructed line_items for Stripe:", JSON.stringify(line_items, null, 2));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "pix"],
      mode: "payment",
      line_items,
      success_url: `${Deno.env.get("SITE_URL")}/pagamento/sucesso`,
      cancel_url: `${Deno.env.get("SITE_URL")}/pagamento/cancelado`,
      client_reference_id: userId,
      shipping_address_collection: {
        allowed_countries: ['BR'],
      },
      metadata: {
        draft_order_id: draftOrderId, // Passa o ID do rascunho aqui
      },
    });
    console.log("Stripe session created successfully:", session.id);

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
