import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Linkedin, Github, Instagram, Twitter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  full_bio: string;
  category: string;
  image_url: string;
  linkedin_url?: string;
  github_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  display_order: number;
}

const Team = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const categories = ["All", "Core Team", "Developers", "Designers", "Volunteers"];

  const filteredMembers = members.filter(
    (member) => selectedCategory === "All" || member.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-bca-dark">
      <Navigation />

      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Meet Our <span className="text-bca-red">Team</span>
          </h1>
          <p className="text-xl text-bca-gray-light max-w-3xl mx-auto mb-8">
            Get to know the passionate individuals driving innovation and fostering a vibrant tech community.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
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
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-bca-dark-card/50 rounded-xl border border-white/10 p-6 animate-pulse"
                >
                  <div className="w-32 h-32 bg-bca-dark-lighter rounded-full mx-auto mb-4" />
                  <div className="h-6 bg-bca-dark-lighter rounded mb-2" />
                  <div className="h-4 bg-bca-dark-lighter rounded" />
                </div>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-bca-gray-light text-lg">No team members found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMembers.map((member) => (
                <article
                  key={member.id}
                  className="bg-bca-dark-card/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:border-bca-red/30 transition-all duration-300 group cursor-pointer hover:scale-105"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="relative mb-4">
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/10 group-hover:border-bca-red/50 transition-all duration-300"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-white text-center mb-2 group-hover:text-bca-red transition-colors">
                    {member.name}
                  </h3>

                  <p className="text-bca-red text-center text-sm font-medium mb-3">{member.role}</p>

                  <p className="text-bca-gray-light text-center text-sm mb-4 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.bio}
                  </p>

                  <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-bca-gray-light hover:text-bca-red transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.github_url && (
                      <a
                        href={member.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-bca-gray-light hover:text-bca-red transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {member.instagram_url && (
                      <a
                        href={member.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-bca-gray-light hover:text-bca-red transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {member.twitter_url && (
                      <a
                        href={member.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-bca-gray-light hover:text-bca-red transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl bg-bca-dark-card border-white/20">
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-start gap-6">
                <img
                  src={selectedMember.image_url}
                  alt={selectedMember.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-bca-red/50"
                />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedMember.name}</h2>
                  <p className="text-bca-red text-lg font-medium mb-4">{selectedMember.role}</p>
                  <div className="flex gap-3">
                    {selectedMember.linkedin_url && (
                      <a
                        href={selectedMember.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bca-gray-light hover:text-bca-red transition-colors"
                      >
                        <Linkedin className="w-6 h-6" />
                      </a>
                    )}
                    {selectedMember.github_url && (
                      <a
                        href={selectedMember.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bca-gray-light hover:text-bca-red transition-colors"
                      >
                        <Github className="w-6 h-6" />
                      </a>
                    )}
                    {selectedMember.instagram_url && (
                      <a
                        href={selectedMember.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bca-gray-light hover:text-bca-red transition-colors"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                    {selectedMember.twitter_url && (
                      <a
                        href={selectedMember.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bca-gray-light hover:text-bca-red transition-colors"
                      >
                        <Twitter className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-bca-red"
                  onClick={() => setSelectedMember(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">About</h3>
                <p className="text-bca-gray-light leading-relaxed">
                  {selectedMember.full_bio || selectedMember.bio}
                </p>
              </div>

              <div className="bg-bca-dark/50 p-4 rounded-lg border border-white/10">
                <p className="text-bca-gray-light text-sm">
                  <span className="text-white font-semibold">Category: </span>
                  {selectedMember.category}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Team;
