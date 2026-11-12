import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BookOpen,
    Download,
    ExternalLink,
    Code,
    Database,
    Globe,
    Briefcase,
    Video,
    Link2,
    GraduationCap,
    Search,
    Pin,
    Lock,
    ShieldCheck,
    ArrowRight,
    Sparkles
} from "lucide-react";
import { QuestionBankSection } from "@/components/QuestionBankSection";

type ResourceCategory = "all" | "learning" | "tools" | "career" | "downloads";

const Resources = () => {
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState<ResourceCategory>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = [
        { id: "all" as ResourceCategory, label: "All Resources", icon: null },
        { id: "learning" as ResourceCategory, label: "Learning", icon: <BookOpen className="w-4 h-4" /> },
        { id: "tools" as ResourceCategory, label: "Tools", icon: <Code className="w-4 h-4" /> },
        { id: "career" as ResourceCategory, label: "Career", icon: <Briefcase className="w-4 h-4" /> },
        { id: "downloads" as ResourceCategory, label: "Downloads", icon: <Download className="w-4 h-4" /> },
    ];

    const { data: resources = [], isLoading } = useQuery({
        queryKey: ["resources"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("resources")
                .select("*")
                .order("is_pinned", { ascending: false })
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
    });

    const filteredResources = resources.filter((r: any) => {
        const matchesCategory = activeCategory === "all" || r.category === activeCategory;
        const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "download": return <Download className="w-3 h-3" />;
            case "video": return <Video className="w-3 h-3" />;
            case "course": return <GraduationCap className="w-3 h-3" />;
            default: return <Link2 className="w-3 h-3" />;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "learning": return <BookOpen className="w-8 h-8 opacity-50" />;
            case "tools": return <Code className="w-8 h-8 opacity-50" />;
            case "career": return <Briefcase className="w-8 h-8 opacity-50" />;
            case "downloads": return <Download className="w-8 h-8 opacity-50" />;
            default: return <Globe className="w-8 h-8 opacity-50" />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-8 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] -z-10" />
                <div className="max-w-7xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Updated Weekly
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-fade-up">
                        Resources
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
                        Hand-picked tools, courses, and materials to help you build better software and accelerate your career.
                    </p>

                    {/* Integrated Search & Filter Bar */}
                    <div className="max-w-2xl mx-auto relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 p-1 bg-background/50 backdrop-blur border border-border/50 rounded-2xl shadow-lg shadow-primary/5">
                            <div className="relative z-20 w-full sm:w-[200px]">
                                <Select value={activeCategory} onValueChange={(v: ResourceCategory) => setActiveCategory(v)}>
                                    <SelectTrigger className="w-full h-12 rounded-xl sm:rounded-r-none border-0 bg-transparent focus:ring-0 hover:bg-secondary/50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">
                                                {categories.find(c => c.id === activeCategory)?.icon || <Globe className="w-4 h-4" />}
                                            </span>
                                            <SelectValue placeholder="Category" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id}>
                                                <div className="flex items-center gap-2">
                                                    {category.icon}
                                                    <span>{category.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="hidden sm:block w-px my-2 bg-border"></div>

                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search resources..."
                                    className="h-12 pl-10 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl sm:rounded-l-none text-base"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="flex-1 px-4 pb-16 pt-8">
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="h-48 rounded-xl bg-secondary/30 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredResources.map((resource: any, index: number) => (
                                <a
                                    key={resource.id}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden hover:border-foreground/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-2 animate-fade-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {/* Cover Image Area */}
                                    <div className="aspect-video relative overflow-hidden bg-secondary/30 flex items-center justify-center">
                                        {resource.image_url ? (
                                            <img
                                                src={resource.image_url}
                                                alt={resource.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="text-muted-foreground/30 transition-colors group-hover:text-primary/50 scale-75">
                                                {getCategoryIcon(resource.category)}
                                            </div>
                                        )}

                                        {/* Tag overlay */}
                                        <div className="absolute top-2 left-2">
                                            <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-background/90 backdrop-blur text-foreground uppercase tracking-wider shadow-sm">
                                                {getTypeIcon(resource.type)}
                                                {resource.type}
                                            </span>
                                        </div>

                                        {resource.is_pinned && (
                                            <div className="absolute top-2 right-2">
                                                <div className="p-1 rounded-full bg-primary text-primary-foreground shadow-sm">
                                                    <Pin className="w-3 h-3 fill-current" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="mb-2">
                                            <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                                {resource.title}
                                            </h3>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
                                                {resource.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
                                            <div className="flex gap-1.5 text-[10px] text-muted-foreground">
                                                {resource.tags?.slice(0, 2).map((tag: string) => (
                                                    <span key={tag}>#{tag}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                                                Visit <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredResources.length === 0 && (
                        <div className="text-center py-20 animate-fade-in">
                            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-secondary/50 mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search query or changing filters.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-6"
                                onClick={() => {
                                    setSearchQuery("");
                                    setActiveCategory("all");
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Question Bank Section (Gated for logged-in students) */}
            <section id="question-bank" className="px-4 pb-24 pt-10 border-t border-border/40 scroll-mt-20">
                <div className="max-w-7xl mx-auto">
                    {user ? (
                        <QuestionBankSection />
                    ) : (
                        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card/90 via-card/50 to-background p-8 md:p-14 text-center shadow-xl">
                            {/* Decorative background glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bca-red/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-bca-red/10 text-bca-red border border-bca-red/20 shadow-sm">
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>Exclusive Student Resource</span>
                                </div>

                                <div className="space-y-3">
                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                                        BCA Semester Question Bank
                                    </h2>
                                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                                        Access verified previous years question papers, model papers, and scheme-wise examination materials. This section is reserved for verified BCA students.
                                    </p>
                                </div>

                                {/* Feature checklist pills */}
                                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/60 border border-border/60 text-xs font-medium text-foreground">
                                        <ShieldCheck className="w-3.5 h-3.5 text-bca-red" />
                                        Semesters 1 to 6
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/60 border border-border/60 text-xs font-medium text-foreground">
                                        <ShieldCheck className="w-3.5 h-3.5 text-bca-red" />
                                        NEP & Autonomous Schemes
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/60 border border-border/60 text-xs font-medium text-foreground">
                                        <ShieldCheck className="w-3.5 h-3.5 text-bca-red" />
                                        Direct PDF Downloads
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Button
                                        asChild
                                        className="w-full sm:w-auto bg-[#7a0000] hover:bg-[#6a0000] text-primary-foreground font-medium px-6 h-11 shadow-lg group"
                                    >
                                        <Link to="/auth?redirect=/resources#question-bank">
                                            Sign In to Unlock Question Bank
                                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Resources;
