import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabase';
import { FaGoogle } from 'react-icons/fa';
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(1, { message: "Senha é obrigatória." }),
});

const registerSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(8, { message: "Senha deve ter pelo menos 8 caracteres." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const Login = () => {
  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { register: registerRegister, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}` // Redireciona de volta para a página inicial após o login
      }
    });

    if (error) {
      toast.error(error.message);
    }
  };

  const onLogin = async (data: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast({ title: "Erro no login", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Login realizado com sucesso." });
      navigate("/");
    }
  };

  const onRegister = async (data: RegisterFormValues) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (error) {
      toast({ title: "Erro no registro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Registro realizado!", description: "Verifique seu email para confirmar a conta." });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo de volta!</CardTitle>
                <CardDescription>Acesse sua conta para continuar.</CardDescription>
              </CardHeader>
              <form onSubmit={handleLoginSubmit(onLogin)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="seu@email.com" {...registerLogin("email")} />
                    {loginErrors.email && <p className="text-sm text-destructive">{loginErrors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input id="login-password" type="password" {...registerLogin("password")} />
                    {loginErrors.password && <p className="text-sm text-destructive">{loginErrors.password.message}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex-col">
                  <Button type="submit" className="w-full">Entrar</Button>
                  <div className="relative my-4 w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Ou continue com
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                    <FaGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Crie sua conta</CardTitle>
                <CardDescription>É rápido e fácil. Comece agora mesmo.</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegisterSubmit(onRegister)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome</Label>
                    <Input id="register-name" placeholder="Seu nome completo" {...registerRegister("name")} />
                    {registerErrors.name && <p className="text-sm text-destructive">{registerErrors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" type="email" placeholder="seu@email.com" {...registerRegister("email")} />
                    {registerErrors.email && <p className="text-sm text-destructive">{registerErrors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <Input id="register-password" type="password" {...registerRegister("password")} />
                    {registerErrors.password && <p className="text-sm text-destructive">{registerErrors.password.message}</p>}
                  </div>
                </CardContent>
                <CardFooter className="flex-col">
                  <Button type="submit" className="w-full">Criar Conta</Button>
                   <div className="relative my-4 w-full">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        Ou crie com
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                    <FaGoogle className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
