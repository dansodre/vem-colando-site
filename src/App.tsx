import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Produtos from "./pages/Produtos";
import Categorias from "./pages/Categorias";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Busca from "./pages/Busca";
import ProdutoDetalhe from "./pages/ProdutoDetalhe";
import Login from "./pages/Login";
import Carrinho from "./pages/Carrinho";
import MeusPedidos from "./pages/MeusPedidos";
import Checkout from "./pages/Checkout";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import OrderDetail from "./pages/OrderDetail";
import ConfirmacaoDesign from "./pages/ConfirmacaoDesign";
import PagamentoSucesso from "./pages/PagamentoSucesso";
import PagamentoCancelado from "./pages/PagamentoCancelado";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminPedidos from "./pages/admin/Pedidos";
import AdminPedidoDetalhe from "./pages/admin/PedidoDetalhe";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminThemes from "./pages/admin/AdminThemes";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminCupons from "./pages/admin/AdminCupons";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Substitua pela sua chave publicável do Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router>
            <Elements stripe={stripePromise}>
              <AuthProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/produtos" element={<Produtos />} />
                      <Route path="/categorias" element={<Categorias />} />
                      <Route path="/sobre" element={<Sobre />} />
                      <Route path="/contato" element={<Contato />} />
                      <Route path="/busca" element={<Busca />} />
                      <Route path="/produto/:id" element={<ProdutoDetalhe />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/carrinho" element={<Carrinho />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/confirmacao-design" element={<ConfirmacaoDesign />} />
                    <Route path="/pagamento/sucesso" element={<PagamentoSucesso />} />
                    <Route path="/pagamento/cancelado" element={<PagamentoCancelado />} />

                      <Route element={<ProtectedRoute />}>
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/meus-pedidos" element={<MeusPedidos />} />
                        <Route path="/meus-pedidos/:id" element={<OrderDetail />} />
                      </Route>

                      <Route element={<AdminProtectedRoute />}>
                        <Route path="/admin" element={<AdminLayout />}>
                          <Route index element={<AdminDashboard />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="pedidos" element={<AdminPedidos />} />
                          <Route path="pedidos/:id" element={<AdminPedidoDetalhe />} />
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="categories" element={<AdminCategories />} />
                          <Route path="themes" element={<AdminThemes />} />
                          <Route path="posts" element={<AdminPosts />} />
                          <Route path="banners" element={<AdminBanners />} />
                          <Route path="cupons" element={<AdminCupons />} />
                        </Route>
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                    <Sonner />
                  </WishlistProvider>
                </CartProvider>
              </AuthProvider>
            </Elements>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
