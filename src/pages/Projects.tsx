import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/motion/MotionWrapper";

interface Project {
  id: string;
  name: string;
  description: string;
  full_description: string;
  thumbnail_url: string;
  built_by: string;
  tags: string[];
  github_url?: string;
  live_demo_url?: string;
  tech_stack: string[];
  screenshots: string[];
  featured: boolean;
  category: string;
}

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("approved", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Project[];
    },
  });

  const categories = [
    "All",
    "Web App",
    "Mobile App",
    "Desktop App",
    "Design / UI/UX",
    "AI / ML",
    "Hardware / IoT",
    "Other",
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory;
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
                SHOWCASE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 font-serif">
              Our <span className="text-bca-red">Projects</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Explore innovative applications, software libraries, and prototypes built by our members.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search projects by name, description..."
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card/50 rounded-2xl border border-border overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-16 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No projects found matching your criteria.</p>
            </div>
          ) : (
            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredProjects.map((project) => (
                <motion.article
                  key={project.id}
                  variants={staggerItemVariants}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border hover:border-bca-red/40 overflow-hidden transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-bca-red/5 flex flex-col justify-between"
                  onClick={() => setSelectedProject(project)}
                >
                  <div>
                    <div className="aspect-video relative overflow-hidden bg-secondary">
                      <img
                        src={project.thumbnail_url}
                        alt={project.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      {project.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-bca-red text-white px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold shadow-md">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-bca-red transition-colors font-serif">
                        {project.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3 text-xs font-mono">
                        <span className="bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                          {project.category || "Project"}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          By <span className="text-bca-red font-medium">{project.built_by}</span>
                        </span>
                      </div>

                      <p className="text-muted-foreground text-sm font-light mb-4 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(project.tags || []).slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-border text-xs font-mono text-muted-foreground group-hover:border-bca-red/30 transition-colors"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {(project.tags || []).length > 3 && (
                          <Badge variant="outline" className="border-border text-xs font-mono text-muted-foreground">
                            +{(project.tags || []).length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0">
                    {project.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-border text-foreground hover:bg-bca-red/10 hover:border-bca-red transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(project.github_url, "_blank");
                        }}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        View on GitHub
                      </Button>
                    )}
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border mx-2 sm:mx-auto">
          {selectedProject && (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={selectedProject.thumbnail_url}
                  alt={selectedProject.name}
                  className="w-full h-48 sm:h-72 object-cover rounded-xl"
                />
                {selectedProject.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-bca-red text-white px-3 py-1 rounded-full text-xs font-mono uppercase font-bold">
                      Featured Project
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 font-serif">
                  {selectedProject.name}
                </h2>
                <p className="text-bca-red text-sm font-mono mb-4">
                  Built by {selectedProject.built_by}
                </p>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {selectedProject.full_description}
                </p>
              </div>

              {Array.isArray(selectedProject.tech_stack) && selectedProject.tech_stack.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3 font-serif">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech_stack.map((tech, index) => (
                      <Badge key={index} className="bg-secondary text-foreground border-border">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(selectedProject.screenshots) && selectedProject.screenshots.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3 font-serif">Screenshots</h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {selectedProject.screenshots.map((screenshot, index) => (
                      <img
                        key={index}
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-40 object-cover rounded-xl border border-border"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                {selectedProject.github_url && (
                  <Button
                    className="w-full sm:flex-1 bg-bca-red hover:bg-bca-red-hover text-white font-mono"
                    onClick={() => window.open(selectedProject.github_url, "_blank")}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Button>
                )}
                {selectedProject.live_demo_url && (
                  <Button
                    variant="outline"
                    className="w-full sm:flex-1 border-border text-foreground hover:bg-bca-red/10 font-mono"
                    onClick={() => window.open(selectedProject.live_demo_url, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Projects;
