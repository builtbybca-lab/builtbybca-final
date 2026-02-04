import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    BookOpen,
    Download,
    ExternalLink,
    Code,
    Database,
    Globe,
    Briefcase,
    Video,
    FileText,
    Link2,
    GraduationCap,
    Lightbulb,
    Loader2,
    Search,
    ArrowRight
} from "lucide-react";

type ResourceCategory = "all" | "learning" | "tools" | "career" | "downloads";

const Resources = () => {
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
            <section className="pt-32 pb-12 px-4 relative overflow-hidden">
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
                        Curated Resources <br className="hidden sm:block" />
                        <span className="text-muted-foreground">for Developers.</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
                        Hand-picked tools, courses, and materials to help you build better software and accelerate your career.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            placeholder="Search for tools, courses, tags..."
                            className="h-12 pl-12 rounded-full border-muted-foreground/20 bg-background/50 backdrop-blur focus:ring-2 focus:ring-primary/20 transition-all text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Sticky Navigation/Filters */}
            <section className="sticky top-20 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50 py-4 px-4 mb-8">
                <div className="max-w-7xl mx-auto overflow-x-auto no-scrollbar">
                    <div className="flex sm:justify-center min-w-max gap-2 px-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    ${activeCategory === category.id
                                        ? "bg-foreground text-background shadow-lg scale-105"
                                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }
                                `}
                            >
                                {category.icon}
                                {category.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="flex-1 px-4 pb-24">
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 rounded-xl bg-secondary/30 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                            <div className="text-muted-foreground/30 transition-colors group-hover:text-primary/50">
                                                {getCategoryIcon(resource.category)}
                                            </div>
                                        )}

                                        {/* Tag overlay */}
                                        <div className="absolute top-3 left-3">
                                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-background/90 backdrop-blur text-foreground uppercase tracking-wider shadow-sm">
                                                {getTypeIcon(resource.type)}
                                                {resource.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="mb-3">
                                            <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                                {resource.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
                                                {resource.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                                            <div className="flex gap-2 text-xs text-muted-foreground">
                                                {resource.tags?.slice(0, 2).map((tag: string) => (
                                                    <span key={tag}>#{tag}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                                                Visit <ExternalLink className="w-3 h-3 ml-1" />
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

            <Footer />
        </div>
    );
};

export default Resources;
