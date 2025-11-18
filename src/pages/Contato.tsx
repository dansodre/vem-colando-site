import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const contactSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  subject: z.string().min(5, { message: 'O assunto deve ter pelo menos 5 caracteres.' }),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres.' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contato = () => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simula o envio para um backend
    console.log('Dados do formulário de contato:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: 'Mensagem Enviada!', description: 'Obrigado por entrar em contato. Responderemos em breve.' });
    reset();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Contato | Vem Colando</title>
        <meta name="description" content="Entre em contato com a Vem Colando. Estamos prontos para ajudar com suas dúvidas sobre etiquetas e adesivos personalizados." />
      </Helmet>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Fale Conosco</h1>
          <p className="text-lg text-muted-foreground mt-2">Tem alguma dúvida ou sugestão? Preencha o formulário abaixo.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Coluna de Informações */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Nosso Endereço</h3>
                <p className="text-muted-foreground">Rua da Imaginação, 123, Bairro Criativo<br />São Paulo, SP, 01234-567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">E-mail</h3>
                <p className="text-muted-foreground">contato@vemcolando.com.br</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Telefone</h3>
                <p className="text-muted-foreground">(11) 98765-4321</p>
              </div>
            </div>
            {/* Mapa Fictício */}
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">[Simulação de Mapa]</p>
            </div>
          </div>

          {/* Coluna do Formulário */}
          <div className="bg-card p-8 rounded-lg border">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" {...register('subject')} />
                {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
              </div>
              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea id="message" rows={5} {...register('message')} />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
