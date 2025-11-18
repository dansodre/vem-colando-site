import { Helmet } from 'react-helmet-async';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Sobre = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Sobre a Vem Colando | Nossa História, Missão e Valores</title>
        <meta name="description" content="Conheça a história da Vem Colando. Nascemos da paixão por design e organização para facilitar a rotina de famílias com etiquetas e adesivos de alta qualidade." />
      </Helmet>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="prose prose-lg max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-center mb-12">Nossa História: Feita com Amor e Criatividade</h1>

          <p className="lead text-xl text-center mb-12">
            Na Vem Colando, acreditamos que cada detalhe importa. Nascemos de um sonho simples: transformar o dia a dia de famílias com produtos que unem praticidade, qualidade e, acima de tudo, muito carinho. O que começou como um pequeno projeto em casa, com a paixão por design e organização, floresceu para se tornar uma marca que hoje faz parte da vida de milhares de pessoas.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
              <p>Facilitar a rotina, inspirar a criatividade e fortalecer laços. Queremos que nossas etiquetas e adesivos não apenas organizem, mas também contem histórias, celebrem momentos e tragam um sorriso ao rosto de quem os usa. Cada produto é pensado para ser uma solução inteligente e um toque de alegria no cotidiano.</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Qualidade Incomparável:</strong> Usamos apenas os melhores materiais, garantindo durabilidade e um acabamento perfeito.</li>
                <li><strong>Criatividade sem Limites:</strong> Nossa equipe de design está sempre em busca de novas tendências para oferecer produtos únicos e encantadores.</li>
                <li><strong>Foco no Cliente:</strong> Sua satisfação é nossa prioridade. Oferecemos um atendimento próximo e dedicado a resolver suas necessidades.</li>
                <li><strong>Paixão em Cada Detalhe:</strong> Do design à embalagem, tudo é feito com o máximo de cuidado e atenção.</li>
              </ul>
            </div>
          </div>

          <div className="text-center bg-muted p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Junte-se à Nossa Família</h2>
            <p className="text-lg">A Vem Colando é mais do que uma loja, é uma comunidade de pessoas que valorizam a organização, a beleza e os pequenos gestos de amor. Agradecemos por nos deixar fazer parte da sua história e por confiar em nosso trabalho para colorir e organizar o seu mundo.</p>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;
