import { Helmet } from 'react-helmet-async';
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import AnimatedSection from "@/components/AnimatedSection";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Testimonials from "@/components/Testimonials";
import Benefits from "@/components/Benefits";
import Newsletter from "@/components/Newsletter";
import FeaturedPosts from "@/components/FeaturedPosts";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Vem Colando - Etiquetas e Adesivos Personalizados para Todas as Ocasiões</title>
        <meta name="description" content="Crie etiquetas escolares, adesivos para potes e temperos, e soluções corporativas. Qualidade e personalização para organizar e identificar com estilo." />
      </Helmet>
      <Header />
      <main className="flex-grow">
        <HeroCarousel />
        <AnimatedSection>
          <Categories />
        </AnimatedSection>
        <AnimatedSection>
          <FeaturedProducts />
        </AnimatedSection>
        <AnimatedSection>
          <Testimonials />
        </AnimatedSection>
        <AnimatedSection>
          <Benefits />
        </AnimatedSection>
        <AnimatedSection>
          <Newsletter />
        </AnimatedSection>
        <AnimatedSection>
          <FeaturedPosts />
        </AnimatedSection>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
