import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Linkedin, Github, Instagram, Twitter } from "lucide-react";
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
  image_url: string;
  linkedin_url?: string;
  github_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  display_order: number;
  year?: string;
  batch?: string;
  division?: string;
}

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        bio: m.bio || "",
        full_bio: m.bio || "",
        image_url: m.image_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        linkedin_url: m.linkedin_url,
        github_url: m.github_url,
        display_order: m.display_order,
        year: m.year,
        batch: m.batch,
        division: m.division,
      })) as TeamMember[];
    },
  });

  // Filter current members (not Alumni)
  const currentMembers = members.filter((member) => member.year !== "Alumni");

  // Group current members by Division priority
  const divisionPriority = [
    "Faculty",
    "Core Team",
    "Technical Team",
    "Design Team",
    "Media Team",
    "Events Team",
    "Other",
  ];

  const groupedCurrentMembers = divisionPriority.reduce((acc, division) => {
    const membersInDivision = currentMembers.filter(
      (m) => (m.division || "Other") === division
    );
    if (membersInDivision.length > 0) {
      acc[division] = membersInDivision;
    }
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Handle members with defined divisions not in priority list
  const otherDivisions = [
    ...new Set(
      currentMembers
        .map((m) => m.division)
        .filter((d) => d && !divisionPriority.includes(d))
    ),
  ];
  otherDivisions.forEach((division) => {
    if (division) {
      groupedCurrentMembers[division] = currentMembers.filter(
        (m) => m.division === division
      );
    }
  });

  // Filter Alumni
  const alumniMembers = members.filter((member) => member.year === "Alumni");

  // Group Alumni by Batch
  const groupedAlumni = alumniMembers.reduce((acc, member) => {
    const batch = member.batch || "Unknown Batch";
    if (!acc[batch]) {
      acc[batch] = [];
    }
    acc[batch].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Sort batches (assuming format YYYY-YYYY, sort descending)
  const sortedBatches = Object.keys(groupedAlumni).sort().reverse();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Meet Our <span className="text-bca-red">Team</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Get to know the passionate individuals driving innovation and fostering a vibrant tech community.
          </p>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card/50 rounded-xl border border-border p-6 animate-pulse flex flex-col items-center"
                >
                  <div className="w-32 h-32 bg-muted rounded-full mb-4" />
                  <div className="h-6 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-1/2 bg-muted rounded mb-4" />
                  <div className="w-full space-y-2 mb-4">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-5/6 bg-muted rounded mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-20">
              {/* Current Team Sections */}
              {Object.entries(groupedCurrentMembers).map(([division, divisionMembers]) => (
                <div key={division} className="animate-fade-up">
                  <h2 className="text-3xl font-bold text-center mb-8 text-foreground relative inline-block left-1/2 transform -translate-x-1/2">
                    <span className="border-b-4 border-bca-red pb-2">{division}</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-center">
                    {divisionMembers.map((member) => (
                      <div
                        key={member.id}
                        className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                        onClick={() => setSelectedMember(member)}
                      >
                        <div className="relative w-32 h-32 mx-auto mb-6">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-bca-red to-purple-600 opacity-20 blur-lg group-hover:opacity-40 transition-opacity" />
                          <img
                            src={member.image_url || "/placeholder.svg"}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full border-2 border-border group-hover:border-bca-red transition-colors relative z-10"
                          />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-bca-red transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-muted-foreground font-medium mb-2">{member.role}</p>
                        {member.year && member.year !== "Alumni" && member.year !== "Faculty" && (
                          <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full mb-3">
                            {member.year}
                          </span>
                        )}

                        <div className="flex gap-4 justify-center mt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          {member.linkedin_url && (
                            <a
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-[#0077b5] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Linkedin className="w-5 h-5" />
                            </a>
                          )}
                          {member.github_url && (
                            <a
                              href={member.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Alumni Section */}
              {sortedBatches.length > 0 && (
                <div className="pt-12 border-t border-border">
                  <h2 className="text-4xl font-bold text-center mb-12 text-gradient font-display">
                    Our Alumni
                  </h2>
                  <div className="space-y-16">
                    {sortedBatches.map((batch) => (
                      <div key={batch} className="animate-fade-up">
                        <h3 className="text-2xl font-semibold text-center mb-8 text-muted-foreground">
                          Batch of {batch}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                          {groupedAlumni[batch].map((member) => (
                            <div
                              key={member.id}
                              className="bg-card/30 rounded-xl border border-border p-6 text-center opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                              onClick={() => setSelectedMember(member)}
                            >
                              <div className="w-24 h-24 mx-auto mb-4 grayscale hover:grayscale-0 transition-all duration-300">
                                <img
                                  src={member.image_url || "/placeholder.svg"}
                                  alt={member.name}
                                  className="w-full h-full object-cover rounded-full border border-border"
                                />
                              </div>
                              <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border mx-2 sm:mx-auto">
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <img
                  src={selectedMember.image_url}
                  alt={selectedMember.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-bca-red/50"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{selectedMember.name}</h2>
                  <p className="text-bca-red text-lg font-medium mb-1">{selectedMember.role}</p>
                  {selectedMember.year && (
                    <p className="text-muted-foreground text-sm mb-4">{selectedMember.year}</p>
                  )}
                  <div className="flex gap-3 justify-center sm:justify-start">
                    {selectedMember.linkedin_url && (
                      <a
                        href={selectedMember.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-bca-red transition-colors"
                      >
                        <Linkedin className="w-6 h-6" />
                      </a>
                    )}
                    {selectedMember.github_url && (
                      <a
                        href={selectedMember.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-bca-red transition-colors"
                      >
                        <Github className="w-6 h-6" />
                      </a>
                    )}
                    {selectedMember.instagram_url && (
                      <a
                        href={selectedMember.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-bca-red transition-colors"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                    {selectedMember.twitter_url && (
                      <a
                        href={selectedMember.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-bca-red transition-colors"
                      >
                        <Twitter className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">About</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedMember.full_bio || selectedMember.bio}
                </p>
              </div>

              {(selectedMember.batch || selectedMember.division) && (
                <div className="flex flex-wrap gap-2">
                  {selectedMember.division && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {selectedMember.division}
                    </span>
                  )}
                  {selectedMember.batch && (
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Batch of {selectedMember.batch}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Team;
