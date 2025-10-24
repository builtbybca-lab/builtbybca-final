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
        .select("id, title, slug, excerpt, author, date, category, thumbnail_url, read_time")
        .eq("is_published", true)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
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
    <div className="min-h-screen bg-bca-dark">
      <Navigation />

      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-bca-red">Blog</span>
          </h1>
          <p className="text-xl text-bca-gray-light max-w-3xl mx-auto mb-8">
            Stay updated with the latest insights, stories, and innovations from the BCA community.
          </p>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-bca-gray-light w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-bca-dark-card border-white/20 text-white placeholder:text-bca-gray-light"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
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
                  className="bg-bca-dark-card/50 rounded-xl border border-white/10 overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-bca-dark-lighter" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-bca-dark-lighter rounded w-3/4" />
                    <div className="h-6 bg-bca-dark-lighter rounded" />
                    <div className="h-20 bg-bca-dark-lighter rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-bca-gray-light text-lg">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`}>
                  <article className="bg-bca-dark-card/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-bca-red/30 transition-all duration-300 group">
                    <div className="aspect-video bg-gradient-to-br from-bca-red/20 to-bca-dark-lighter relative overflow-hidden">
                      <img
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-bca-red text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-sm text-bca-gray-light mb-3">
                        <User className="w-4 h-4 mr-2" />
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-bca-red transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-bca-gray-light mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-bca-gray-light">{post.read_time}</span>
                        <Button variant="ghost" className="text-bca-red hover:text-white group">
                          Read More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
