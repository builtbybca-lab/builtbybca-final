import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Github, ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

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
}

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Project[];
    },
  });

  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  );
  const tags = ["All", ...allTags];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "All" || project.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-bca-dark">
      <Navigation />

      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-bca-red">Projects</span>
          </h1>
          <p className="text-xl text-bca-gray-light max-w-3xl mx-auto mb-8">
            Explore innovative projects built by our talented members showcasing creativity and technical excellence.
          </p>

          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-bca-gray-light w-5 h-5" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-bca-dark-card border-white/20 text-white placeholder:text-bca-gray-light"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  onClick={() => setSelectedTag(tag)}
                  className={`${
                    selectedTag === tag
                      ? "bg-bca-red text-white hover:bg-bca-red-hover"
                      : "border-white/20 text-white hover:bg-bca-red/20 hover:border-bca-red"
                  }`}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-bca-dark-card/50 rounded-xl border border-white/10 overflow-hidden animate-pulse"
                >
                  <div className="aspect-video bg-bca-dark-lighter" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-bca-dark-lighter rounded" />
                    <div className="h-4 bg-bca-dark-lighter rounded w-3/4" />
                    <div className="h-16 bg-bca-dark-lighter rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-bca-gray-light text-lg">No projects found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="bg-bca-dark-card/50 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-bca-red/30 transition-all duration-300 group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-bca-red/20 to-bca-dark-lighter">
                    <img
                      src={project.thumbnail_url}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-bca-red transition-colors">
                      {project.name}
                    </h3>

                    <p className="text-sm text-bca-gray-light mb-3">
                      Built by: <span className="text-bca-red font-medium">{project.built_by}</span>
                    </p>

                    <p className="text-bca-gray-light mb-4 line-clamp-2">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-bca-red/30 text-bca-red">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline" className="border-white/20 text-bca-gray-light">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {project.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/20 text-white hover:bg-bca-red/20 hover:border-bca-red"
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
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-bca-dark-card border-white/20">
          {selectedProject && (
            <div className="space-y-6">
              <div className="relative">
                <img
                  src={selectedProject.thumbnail_url}
                  alt={selectedProject.name}
                  className="w-full h-72 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedProject(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
                {selectedProject.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold">
                      Featured Project
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-3">{selectedProject.name}</h2>
                <p className="text-bca-red text-lg mb-4">Built by {selectedProject.built_by}</p>
                <p className="text-bca-gray-light leading-relaxed">{selectedProject.full_description}</p>
              </div>

              {selectedProject.tech_stack && selectedProject.tech_stack.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech_stack.map((tech, index) => (
                      <Badge key={index} className="bg-bca-red/20 text-bca-red border-bca-red/30">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-white/20 text-bca-gray-light">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Screenshots</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProject.screenshots.map((screenshot, index) => (
                      <img
                        key={index}
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg border border-white/10"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {selectedProject.github_url && (
                  <Button
                    className="flex-1 bg-bca-red hover:bg-bca-red-hover"
                    onClick={() => window.open(selectedProject.github_url, "_blank")}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                  </Button>
                )}
                {selectedProject.live_demo_url && (
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-bca-red/20"
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
