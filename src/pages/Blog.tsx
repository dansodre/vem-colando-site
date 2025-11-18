import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPosts } from '@/services/productApi';
import { Post } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Blog = () => {
  const { data: posts, isLoading } = useQuery<Post[]>({ queryKey: ['posts'], queryFn: () => getPosts() });

  if (isLoading) return <div>Carregando posts...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Blog | Vem Colando</title>
        <meta name="description" content="Dicas de organização, novidades sobre produtos e inspirações criativas do mundo das etiquetas e adesivos personalizados." />
      </Helmet>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">Nosso Blog</h1>
          <p className="text-lg text-muted-foreground mt-2">Dicas, novidades e inspirações do mundo das etiquetas.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post: Post, index: number) => (
            <AnimatedSection key={post.id}>
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <CardHeader className="p-0 relative">
                    <div className="overflow-hidden">
                      <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <Badge className="absolute top-3 left-3">Dicas</Badge>
                  </CardHeader>
                  <CardContent className="flex-grow p-6 space-y-3">
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.content.substring(0, 120)}...
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    <span className="font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">Ler Mais &rarr;</span>
                  </CardFooter>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
