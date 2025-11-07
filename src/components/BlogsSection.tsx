import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const BlogsSection = () => {
  const { data: blogPosts = [] } = useQuery({
    queryKey: ["featured-blogs"],
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
    <section className="py-20 relative" id="blogs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Blogs, insights and more
          </h2>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-bca-gray-light">No blog posts available yet.</p>
            </div>
          ) : (
            blogPosts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="card-glass overflow-hidden group hover:scale-105 transition-all duration-300 animate-fade-up block"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Blog Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-bca-gray-light mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.category}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-bca-red transition-colors">
                    {post.title}
                  </h3>

                  <div className="flex items-center text-bca-red hover:text-bca-red-light group">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/blog">
            <Button className="bg-[#7a0000] hover:bg-[#6a0000] text-white px-8 py-3 rounded-lg transition-all duration-300">
              View All Blogs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;