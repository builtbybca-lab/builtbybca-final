import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Linkedin,
  Github,
  ArrowUpRight,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/components/motion/MotionWrapper";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  full_bio: string;
  image_url: string;
  linkedin_url?: string;
  github_url?: string;
  display_order: number;
  year?: string;
  batch?: string;
  division?: string;
  tenure: string;
  is_current: boolean;
  is_founding: boolean;
}

const DIVISION_TABS = [
  "All",
  "Core Team",
  "Technical Team",
  "Design Team",
  "Media Team",
  "Events Team",
  "Faculty",
];

const Team: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeDivisionTab, setActiveDivisionTab] = useState<string>("All");

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return (data || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        bio: m.bio || "",
        full_bio: m.bio || "",
        image_url: m.image_url || "/placeholder.svg",
        linkedin_url: m.linkedin_url,
        github_url: m.github_url,
        display_order: m.display_order ?? 0,
        year: m.year,
        batch: m.batch,
        division: m.division || "Core Team",
        tenure: m.tenure || "2025–2026",
        is_current: m.is_current !== undefined && m.is_current !== null ? m.is_current : true,
        is_founding: Boolean(m.is_founding),
      })) as TeamMember[];
    },
  });

  // Helper to sort members strictly by display_order (1 is 1st, 2 is 2nd, unset/0 at end)
  const sortMembersByOrder = (memberList: TeamMember[]) => {
    return [...memberList].sort((a, b) => {
      const orderA =
        a.display_order !== null && a.display_order !== undefined && Number(a.display_order) > 0
          ? Number(a.display_order)
          : 999999;
      const orderB =
        b.display_order !== null && b.display_order !== undefined && Number(b.display_order) > 0
          ? Number(b.display_order)
          : 999999;

      if (orderA !== orderB) return orderA - orderB;
      return (a.name || "").localeCompare(b.name || "");
    });
  };

  // Active Council Members (Current tenure) - sorted strictly by display_order
  const currentMembers = sortMembersByOrder(
    members.filter(
      (member) => member.is_current !== false && member.year !== "Alumni"
    )
  );

  // Filtered by selected division tab
  const filteredCurrentMembers =
    activeDivisionTab === "All"
      ? currentMembers
      : currentMembers.filter(
          (m) => (m.division || "Other") === activeDivisionTab
        );

  // Council Archive & Hall of Fame Members (Past batches)
  const archiveMembers = members.filter(
    (member) => member.is_current === false || member.year === "Alumni"
  );

  // Group Archive members by Tenure and sort each cohort strictly by display_order
  const groupedArchive = archiveMembers.reduce((acc, member) => {
    const tenureKey = member.tenure || "2025–2026";
    if (!acc[tenureKey]) {
      acc[tenureKey] = [];
    }
    acc[tenureKey].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  // Sort each cohort's members by display order
  Object.keys(groupedArchive).forEach((key) => {
    groupedArchive[key] = sortMembersByOrder(groupedArchive[key]);
  });

  // Sort tenures in descending order
  const sortedTenures = Object.keys(groupedArchive).sort().reverse();

  // Active Council primary tenure term
  const activeTenure =
    currentMembers.find((m) => m.tenure)?.tenure || "2026–2027";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Header */}
      <section className="pt-36 sm:pt-40 pb-12 px-4 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(229,9,20,0.06),transparent_65%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center space-x-2 bg-card/90 border border-border px-3.5 py-1 rounded-full shadow-sm mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
              <span className="text-bca-red font-mono text-xs tracking-widest uppercase font-semibold">
                COUNCIL DIRECTORY
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 font-serif tracking-tight">
              The BuiltBy.<span className="text-bca-red">Council</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 font-light leading-relaxed">
              The student leaders, architects, and division leads driving the BuiltBy.BCA
              community forward across academic tenures.
            </p>

            {/* Quick Stats / Navigation bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
              <a
                href="#active-council"
                className="px-3.5 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-bca-red/40 transition-colors inline-flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active Term ({activeTenure})
              </a>
              <a
                href="#hall-of-fame"
                className="px-3.5 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-card hover:border-bca-red/40 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Council Archive & Hall of Fame</span>
                <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-28 px-4" id="active-council">
        <div className="max-w-7xl mx-auto space-y-24">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card/50 rounded-2xl border border-border p-6 animate-pulse flex flex-col items-center"
                >
                  <div className="w-28 h-28 bg-muted rounded-full mb-4" />
                  <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                  <div className="h-4 w-1/2 bg-muted rounded mb-4" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* SECTION 1: ACTIVE COUNCIL */}
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/60">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                        ACTIVE COUNCIL
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        // TERM {activeTenure}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                      Current Executive Leadership
                    </h2>
                  </div>

                  {/* Division Filter Tabs */}
                  <div className="flex flex-wrap gap-1.5">
                    {DIVISION_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveDivisionTab(tab)}
                        className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                          activeDivisionTab === tab
                            ? "bg-bca-red text-white font-medium shadow-sm"
                            : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Council Cards Grid */}
                {currentMembers.length === 0 ? (
                  <div className="text-center py-16 px-6 border border-dashed border-border/80 bg-card/40 rounded-2xl max-w-xl mx-auto space-y-3">
                    <p className="text-xs font-mono uppercase tracking-widest text-bca-red font-semibold">
                      // {activeTenure} COUNCIL
                    </p>
                    <h3 className="text-xl font-bold font-serif text-foreground">
                      Upcoming Council Under Formation
                    </h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      Appointments for the new academic tenure will be announced here shortly. Browse our inaugural founding leaders in the Hall of Fame below.
                    </p>
                    <div className="pt-2">
                      <a
                        href="#hall-of-fame"
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-bca-red hover:underline"
                      >
                        <span>Explore Hall of Fame &darr;</span>
                      </a>
                    </div>
                  </div>
                ) : filteredCurrentMembers.length > 0 ? (
                  <motion.div
                    variants={staggerContainerVariants}
                    initial="hidden"
                    animate="visible"
                    key={activeDivisionTab}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filteredCurrentMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        variants={staggerItemVariants}
                        whileHover={{ y: -6, transition: { duration: 0.25 } }}
                        className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border hover:border-bca-red/50 overflow-hidden transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-bca-red/5 flex flex-col justify-between"
                        onClick={() => setSelectedMember(member)}
                      >
                        <div>
                          {/* Editorial Portrait Container */}
                          <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-secondary">
                            <img
                              src={member.image_url || "/placeholder.svg"}
                              alt={member.name}
                              loading="lazy"
                              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent pointer-events-none" />
                            
                            {/* Division badge floating top-left */}
                            <div className="absolute top-3 left-3 z-10">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-background/85 backdrop-blur-md border border-border text-foreground font-medium shadow-sm">
                                {member.division || "Core Team"}
                              </span>
                            </div>
                          </div>

                          {/* Member Info */}
                          <div className="p-5 text-left space-y-1">
                            <h3 className="text-lg font-bold text-foreground font-serif tracking-tight group-hover:text-bca-red transition-colors line-clamp-1">
                              {member.name}
                            </h3>
                            <p className="text-xs font-mono font-medium text-bca-red tracking-wide uppercase line-clamp-1">
                              {member.role}
                            </p>
                            {(member.year || member.batch) && (
                              <p className="text-[11px] font-mono text-muted-foreground pt-0.5">
                                {[member.year, member.batch ? `Batch ${member.batch}` : null].filter(Boolean).join(" • ")}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Bottom Bar */}
                        <div className="px-5 pb-4 pt-3 border-t border-border/40 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center gap-1">
                            Bio <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </span>

                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {member.linkedin_url && (
                              <a
                                href={member.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="p-1.5 rounded-lg bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-bca-red transition-colors"
                              >
                                <Linkedin className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {member.github_url && (
                              <a
                                href={member.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="p-1.5 rounded-lg bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Github className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-2xl text-muted-foreground font-mono text-xs">
                    No active council members found for {activeDivisionTab}.
                  </div>
                )}
              </div>

              {/* SECTION 2: COUNCIL ARCHIVE & HALL OF FAME */}
              <div className="pt-16 border-t border-border/70 space-y-14" id="hall-of-fame">
                <div className="text-center max-w-3xl mx-auto space-y-3">
                  <div className="inline-flex items-center space-x-2 bg-card border border-border px-3.5 py-1 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-bca-red" />
                    <span className="text-foreground font-mono text-xs tracking-widest uppercase font-semibold">
                      COUNCIL ARCHIVE & HALL OF FAME
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-serif">
                    Legacy & Past Councils
                  </h2>

                  <p className="text-muted-foreground text-sm font-light leading-relaxed">
                    Honoring the inaugural leaders and previous executive councils who laid
                    the foundation and established BuiltBy.BCA.
                  </p>
                </div>

                {/* Cohorts grouped by Tenure */}
                <div className="space-y-16">
                  {sortedTenures.map((tenureKey) => {
                    const cohortMembers = groupedArchive[tenureKey];
                    const isFoundingCohort =
                      tenureKey === "2025–2026" || cohortMembers.some((m) => m.is_founding);

                    return (
                      <div key={tenureKey} className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-border/60">
                          <div>
                            <h3 className="text-2xl sm:text-3xl font-bold font-serif text-foreground tracking-tight">
                              {isFoundingCohort ? "Founding Team (2025–2026)" : `Council of ${tenureKey}`}
                            </h3>
                            <p className="text-xs font-mono text-muted-foreground mt-1">
                              {isFoundingCohort
                                ? "Charter leaders & inaugural executive council of BuiltBy.BCA"
                                : `Term ${tenureKey} executive council members`}
                            </p>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground bg-secondary/60 border border-border/50 px-3 py-1 rounded-full w-fit">
                            {cohortMembers.length} Leaders
                          </span>
                        </div>

                        <motion.div
                          variants={staggerContainerVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: "-40px" }}
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                          {cohortMembers.map((member) => (
                            <motion.div
                              key={`${tenureKey}-${member.id}`}
                              variants={staggerItemVariants}
                              whileHover={{ y: -6, transition: { duration: 0.25 } }}
                              className="bg-card/90 backdrop-blur-sm rounded-2xl border border-border hover:border-bca-red/50 overflow-hidden transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-xl hover:shadow-bca-red/5 flex flex-col justify-between"
                              onClick={() => setSelectedMember(member)}
                            >
                              <div>
                                {/* Editorial Portrait Container */}
                                <div className="relative aspect-[4/3.8] w-full overflow-hidden bg-secondary">
                                  <img
                                    src={member.image_url || "/placeholder.svg"}
                                    alt={member.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent pointer-events-none" />
                                  
                                  {/* Division badge floating top-left */}
                                  <div className="absolute top-3 left-3 z-10">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-background/85 backdrop-blur-md border border-border text-foreground font-medium shadow-sm">
                                      {member.division || "Core Team"}
                                    </span>
                                  </div>
                                </div>

                                {/* Member Info */}
                                <div className="p-5 text-left space-y-1">
                                  <h4 className="text-lg font-bold text-foreground font-serif tracking-tight group-hover:text-bca-red transition-colors line-clamp-1">
                                    {member.name}
                                  </h4>
                                  <p className="text-xs font-mono font-medium text-bca-red tracking-wide uppercase line-clamp-1">
                                    {member.role}
                                  </p>
                                  {(member.year || member.batch) && (
                                    <p className="text-[11px] font-mono text-muted-foreground pt-0.5">
                                      {[member.year, member.batch ? `Batch ${member.batch}` : null].filter(Boolean).join(" • ")}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Card Bottom Bar */}
                              <div className="px-5 pb-4 pt-3 border-t border-border/40 flex items-center justify-between">
                                <span className="text-[11px] font-mono text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center gap-1">
                                  Bio <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </span>

                                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  {member.linkedin_url && (
                                    <a
                                      href={member.linkedin_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label="LinkedIn"
                                      className="p-1.5 rounded-lg bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-bca-red transition-colors"
                                    >
                                      <Linkedin className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                  {member.github_url && (
                                    <a
                                      href={member.github_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label="GitHub"
                                      className="p-1.5 rounded-lg bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      <Github className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Member Details Modal */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border mx-2 sm:mx-auto">
          {selectedMember && (
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img
                  src={selectedMember.image_url}
                  alt={selectedMember.name}
                  className="w-28 h-28 rounded-full object-cover border-2 border-bca-red shadow-lg"
                />
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start mb-1.5">
                    {selectedMember.is_founding && (
                      <Badge
                        variant="outline"
                        className="border-border bg-secondary/80 text-foreground text-[10px] font-mono uppercase tracking-wider"
                      >
                        Founding Council
                      </Badge>
                    )}
                    {selectedMember.is_current ? (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono uppercase tracking-wider"
                      >
                        Active Council
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-border bg-secondary/50 text-muted-foreground text-[10px] font-mono uppercase tracking-wider"
                      >
                        Council Archive
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="border-border bg-secondary/50 text-muted-foreground text-[10px] font-mono tracking-wider"
                    >
                      Term {selectedMember.tenure}
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-bold text-foreground font-serif">
                    {selectedMember.name}
                  </h2>
                  <p className="text-bca-red text-sm font-mono font-medium">
                    {selectedMember.role}
                  </p>

                  <div className="text-xs text-muted-foreground font-mono space-x-2 pt-0.5">
                    {selectedMember.division && <span>{selectedMember.division}</span>}
                    {selectedMember.year && <span>&bull; {selectedMember.year}</span>}
                    {selectedMember.batch && <span>&bull; Batch {selectedMember.batch}</span>}
                  </div>

                  <div className="flex gap-2 justify-center sm:justify-start pt-2">
                    {selectedMember.linkedin_url && (
                      <a
                        href={selectedMember.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-bca-red transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {selectedMember.github_url && (
                      <a
                        href={selectedMember.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  About & Contributions
                </h3>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">
                  {selectedMember.full_bio ||
                    selectedMember.bio ||
                    "Council member contributing to the BuiltBy.BCA cohort and community initiatives."}
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
