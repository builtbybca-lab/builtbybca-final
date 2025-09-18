import { useState } from "react";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const blogPosts = [
    {
      id: 1,
      title: "Building the Future of Technology at BCA",
      excerpt: "Discover how our students are creating innovative solutions that shape tomorrow's tech landscape.",
      author: "BCA Team",
      date: "March 15, 2024",
      category: "Technology",
      image: "/placeholder.svg",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Student Success Stories: From Classroom to Career",
      excerpt: "Meet our alumni who are making waves in the tech industry with their groundbreaking projects.",
      author: "Alumni Network",
      date: "March 10, 2024",
      category: "Success Stories",
      image: "/placeholder.svg",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Innovation Lab: Where Ideas Come to Life",
      excerpt: "Take a look inside our state-of-the-art facilities where students bring their creative visions to reality.",
      author: "Faculty",
      date: "March 5, 2024",
      category: "Innovation",
      image: "/placeholder.svg",
      readTime: "4 min read"
    },
    {
      id: 4,
      title: "Community Impact: Tech for Good",
      excerpt: "How BCA students are using technology to solve real-world problems and make a positive impact.",
      author: "Community Team",
      date: "February 28, 2024",
      category: "Community",
      image: "/placeholder.svg",
      readTime: "6 min read"
    },
    {
      id: 5,
      title: "Industry Partnerships: Bridging Education and Business",
      excerpt: "Explore our collaborations with leading tech companies and how they benefit our students.",
      author: "Partnership Team",
      date: "February 22, 2024",
      category: "Partnerships",
      image: "/placeholder.svg",
      readTime: "5 min read"
    },
    {
      id: 6,
      title: "Future Skills: Preparing for Tomorrow's Jobs",
      excerpt: "Learn about the cutting-edge skills and technologies we're teaching to prepare students for the future.",
      author: "Curriculum Team",
      date: "February 15, 2024",
      category: "Education",
      image: "/placeholder.svg",
      readTime: "8 min read"
    }
  ];

  const categories = ["All", "Technology", "Success Stories", "Innovation", "Community", "Partnerships", "Education"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-bca-dark">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-bca-red">Blog</span>
          </h1>
          <p className="text-xl text-bca-gray-light max-w-3xl mx-auto mb-8">
            Stay updated with the latest insights, stories, and innovations from the BCA community.
          </p>
          
          {/* Search and Filter */}
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
            
            {/* Category Filter */}
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

      {/* Blog Posts Grid */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-bca-dark-card/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-bca-red/30 transition-all duration-300 group"
              >
                <div className="aspect-video bg-gradient-to-br from-bca-red/20 to-bca-dark-lighter relative overflow-hidden">
                  <img
                    src={post.image}
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
                    <span>{post.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-bca-red transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-bca-gray-light mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-bca-gray-light">{post.readTime}</span>
                    <Button variant="ghost" className="text-bca-red hover:text-white group">
                      Read More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-bca-gray-light text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;