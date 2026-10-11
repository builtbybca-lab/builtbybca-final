import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/motion/MotionWrapper";

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

const Blog: React.FC = () => {
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
      return (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        author: post.author_name,
        date: post.created_at,
        category: post.category,
        thumbnail_url:
          post.image_url ||
          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
        read_time: "5 min read",
      })) as BlogPost[];
    },
  });

  const categories = ["All", ...Array.from(new Set(blogPosts.map((post) => post.category)))];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-36 sm:pt-40 pb-16 px-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.04),transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3.5 py-1 rounded-full shadow-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
              <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
                PUBLICATIONS & INSIGHTS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 font-serif">
              Our <span className="text-bca-red">Blog</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Stay updated with the latest tutorials, architectures, hackathon recaps, and tech guides from BCA@AIBM.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-card/90 backdrop-blur-sm border-border text-foreground placeholder:text-muted-foreground/70 h-12 rounded-xl focus-visible:ring-bca-red"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-xs sm:text-sm rounded-full transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-bca-red text-white hover:bg-bca-red-hover shadow-md shadow-bca-red/10"
                      : "border-border text-foreground hover:bg-secondary hover:border-bca-red/30"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-28 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card/50 rounded-2xl border border-border overflow-hidden animate-pulse"
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
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={staggerItemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex flex-col h-full bg-card/90 backdrop-blur-sm rounded-2xl border border-border hover:border-bca-red/40 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-bca-red/5 transition-all duration-300 group"
                  >
                    <div className="aspect-video bg-secondary relative overflow-hidden">
                      <img
                        src={post.thumbnail_url}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.dataset.failed) {
                            target.dataset.failed = "true";
                            target.src =
                              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80";
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-bca-red text-white px-2.5 py-0.5 rounded-full text-xs font-mono font-medium shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center text-xs font-mono text-muted-foreground mb-3 space-x-3">
                          <div className="flex items-center">
                            <User className="w-3.5 h-3.5 mr-1 text-bca-red" />
                            <span className="truncate max-w-[100px]">{post.author || "Team BCA"}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            <span>
                              {post.date ? new Date(post.date).toLocaleDateString() : "Recently"}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-bca-red transition-colors font-serif line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-sm text-muted-foreground font-light mb-4 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs font-mono">
                        <span className="text-muted-foreground/70">{post.read_time}</span>
                        <span className="text-bca-red font-medium flex items-center group-hover:translate-x-1 transition-transform">
                          Read More <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
