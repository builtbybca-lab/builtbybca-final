import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface BlogPostFull {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  author_avatar: string;
  author_bio: string;
  date: string;
  category: string;
  hero_image_url: string;
  tags: string[];
  read_time: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail_url: string;
  category: string;
  read_time: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Post not found");
      return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        author: data.author_name,
        author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        author_bio: 'Tech enthusiast and writer',
        date: data.created_at,
        category: data.category,
        hero_image_url: data.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        tags: [],
        read_time: '5 min read'
      } as BlogPostFull;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ["related_posts", post?.category],
    queryFn: async () => {
      if (!post) return [];

      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, image_url, category")
        .eq("category", post.category)
        .neq("id", post.id)
        .eq("published", true)
        .limit(3);

      if (error) throw error;
      return (data || []).map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        thumbnail_url: p.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        category: p.category,
        read_time: '5 min read'
      })) as RelatedPost[];
    },
    enabled: !!post,
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bca-dark">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-bca-dark-card rounded-xl" />
            <div className="h-12 bg-bca-dark-card rounded w-3/4" />
            <div className="h-6 bg-bca-dark-card rounded w-1/2" />
            <div className="space-y-3">
              <div className="h-4 bg-bca-dark-card rounded" />
              <div className="h-4 bg-bca-dark-card rounded" />
              <div className="h-4 bg-bca-dark-card rounded w-5/6" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-bca-dark">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-bca-gray-light mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button className="bg-bca-red hover:bg-bca-red-hover">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bca-dark">
      <Navigation />

      <article className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog">
            <Button variant="ghost" className="text-bca-gray-light hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <div className="mb-8">
            <span className="bg-bca-red text-white px-4 py-2 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-bca-gray-light mb-8">
            <div className="flex items-center">
              <img
                src={post.author_avatar}
                alt={post.author}
                className="w-10 h-10 rounded-full mr-3 border-2 border-white/20"
              />
              <div>
                <p className="text-white font-medium">{post.author}</p>
              </div>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{post.read_time}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="ml-auto text-bca-gray-light hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="relative mb-12 rounded-xl overflow-hidden">
            <img
              src={post.hero_image_url}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
          </div>

          <div
            className="prose prose-invert prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-bca-dark-card border border-white/10 text-bca-gray-light px-4 py-2 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {post.author_bio && (
            <div className="bg-bca-dark-card/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-12">
              <div className="flex items-start gap-4">
                <img
                  src={post.author_avatar}
                  alt={post.author}
                  className="w-16 h-16 rounded-full border-2 border-bca-red/50"
                />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">About {post.author}</h3>
                  <p className="text-bca-gray-light">{post.author_bio}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="pb-24 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Related <span className="text-bca-red">Articles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`}>
                  <article className="bg-bca-dark-card/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-bca-red/30 transition-all duration-300 group">
                    <div className="aspect-video bg-gradient-to-br from-bca-red/20 to-bca-dark-lighter relative overflow-hidden">
                      <img
                        src={relatedPost.thumbnail_url}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-bca-red text-white px-3 py-1 rounded-full text-sm font-medium">
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-bca-red transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-bca-gray-light text-sm line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <span className="text-xs text-bca-gray-light">{relatedPost.read_time}</span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
