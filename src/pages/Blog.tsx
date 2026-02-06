import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  thumbnail_url: string;
  read_time: string;
}

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, author_name, created_at, category, image_url")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []).map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        author: post.author_name,
        date: post.created_at,
        category: post.category,
        thumbnail_url: post.image_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        read_time: '5 min read'
      })) as BlogPost[];
    },
  });

  const categories = ["All", ...Array.from(new Set(blogPosts.map(post => post.category)))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6">
            Our <span className="text-bca-red">Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 px-2">
            Stay updated with the latest insights, stories, and innovations from the BCA community.
          </p>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`${selectedCategory === category
                    ? "bg-bca-red text-white hover:bg-bca-red-hover"
                    : "border-white/20 text-white hover:bg-bca-red/20 hover:border-bca-red"
                    }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card/50 rounded-xl border border-border overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-20 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <article className="bg-card/50 backdrop-blur-sm rounded-xl border border-border overflow-hidden hover:border-bca-red/30 transition-all duration-300 group">
                    <div className="aspect-video bg-gradient-to-br from-bca-red/20 to-muted relative overflow-hidden">
                      <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-bca-red text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-2 gap-1">
                        <User className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-[80px]">{post.author || "Team BCA"}</span>
                        <span className="mx-1">•</span>
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>
                          {post.date ? new Date(post.date).toLocaleDateString() : "Recently"}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-bca-red transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{post.read_time}</span>
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-bca-red hover:text-foreground group px-0">
                          Read More <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
