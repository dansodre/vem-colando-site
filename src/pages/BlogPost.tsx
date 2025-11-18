import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getPostBySlug } from '@/services/productApi';
import { Post } from '@/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading } = useQuery<Post>({ 
    queryKey: ['post', slug], 
    queryFn: () => getPostBySlug(slug!),
    enabled: !!slug
  });

  if (isLoading) return <div>Carregando post...</div>;
  if (!post) return <div>Post não encontrado.</div>;

  const metaDescription = post.content.replace(/<[^>]*>?/gm, '').substring(0, 160);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{`${post.title} | Blog Vem Colando`}</title>
        <meta name="description" content={`${metaDescription}...`} />
      </Helmet>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-primary font-semibold">Dicas & Inspirações</p> {/* Categoria */} 
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-2">{post.title}</h1>
                <p className="text-muted-foreground mt-4">Por {post.author} em {new Date(post.published_at).toLocaleDateString()}</p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <img src={post.image_url} alt={post.title} className="w-full h-auto max-h-[600px] object-cover rounded-xl shadow-lg mb-12" />
          </AnimatedSection>

          <AnimatedSection>
            <article className="prose lg:prose-xl max-w-3xl mx-auto">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-12 mb-4" {...props} />,
                  p: ({node, ...props}) => <p className="leading-relaxed mb-6" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-6" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-6" {...props} />,
                  a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground" {...props} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>
          </AnimatedSection>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
