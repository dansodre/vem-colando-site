import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getFeaturedOrLatestPosts } from '@/services/productApi';
import { Post } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';

const FeaturedPosts = () => {
  // Buscamos todos os posts e pegamos os 3 mais recentes
  const { data: posts, isLoading } = useQuery({
    queryKey: ['featured-posts'],
    queryFn: getFeaturedOrLatestPosts,
  });

  console.log('Posts em destaque recebidos:', posts);

  if (isLoading) return null; // Não mostra nada enquanto carrega
  if (!posts || posts.length === 0) return null; // Não mostra a seção se não houver posts

  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Fique por Dentro</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Dicas, novidades e inspirações do nosso blog.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post: Post) => (
            <Link to={`/blog/${post.slug}`} key={post.id}>
              <Card className="h-full max-w-sm mx-auto flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img src={post.image_url} alt={post.title} className="w-full h-40 md:h-44 object-cover" />
                </CardHeader>
                <CardContent className="flex-grow p-5">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Por {post.author}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/blog">
            <Button size="lg" variant="outline">Ver Todos os Posts</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
