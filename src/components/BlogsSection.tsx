import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogsSection = () => {
  const blogPosts = [
    {
      title: "The Role of Visual Hierarchy in UX Design",
      author: "Admin",
      category: "Tech Writing",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    },
    {
      title: "Creating User-Centered UX with Personas Development",
      author: "Admin", 
      category: "Tech Writing",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    },
    {
      title: "Designing for Accessibility in UX: Essential Guidelines",
      author: "Admin",
      category: "Tech Writing", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    },
  ];

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
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="card-glass overflow-hidden group hover:scale-105 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Blog Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-bca-gray-light mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.category}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-bca-red transition-colors">
                  {post.title}
                </h3>

                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-bca-red hover:text-bca-red-light group"
                >
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button className="btn-secondary">
            View All Blogs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogsSection;