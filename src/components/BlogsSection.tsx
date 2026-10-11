import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "./motion/MotionWrapper";

const BlogsSection: React.FC = () => {
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <section className="py-24 sm:py-32 relative bg-background overflow-hidden" id="blogs">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.03),transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-card/80 border border-border/80 px-3.5 py-1 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
            <span className="text-bca-red font-mono text-xs tracking-wider uppercase font-semibold">
              ARTICLES & STORIES
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground font-serif">
            Blogs, Insights <span className="text-bca-red">& More</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Technical breakdowns, student retrospectives, and deep dives written by the BuiltBy.BCA cohort.
          </p>
        </motion.div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-bca-red" />
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-base sm:text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <>
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            >
              {blogPosts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={staggerItemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
                  className="h-full"
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex flex-col h-full bg-card/90 backdrop-blur-sm border border-border hover:border-bca-red/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-bca-red/5 transition-all duration-300 group"
                  >
                    {/* Blog Image */}
                    <div className="aspect-video overflow-hidden bg-secondary relative">
                      <img
                        src={
                          post.image_url ||
                          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
                        }
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
                      <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                    </div>

                    {/* Blog Content */}
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground mb-3">
                          <div className="flex items-center space-x-1.5">
                            <User className="w-3.5 h-3.5 text-bca-red" />
                            <span>{post.author_name}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{post.category}</span>
                          </div>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 font-serif group-hover:text-bca-red transition-colors line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-sm text-muted-foreground font-light mb-6 line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center text-sm font-mono text-bca-red font-medium pt-3 border-t border-border/50 group-hover:translate-x-0.5 transition-transform">
                        <span>Read Full Story</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* View All Button */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <Link to="/blog">
                <Button className="font-mono bg-transparent border-2 border-bca-red text-foreground hover:bg-bca-red hover:text-white px-8 py-5 text-sm tracking-wider transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-bca-red/10">
                  View All Blogs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogsSection;