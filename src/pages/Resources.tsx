import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
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
    Loader2
} from "lucide-react";

type ResourceCategory = "all" | "learning" | "tools" | "career" | "downloads";

const Resources = () => {
    const [activeCategory, setActiveCategory] = useState<ResourceCategory>("all");

    const categories = [
        { id: "all" as ResourceCategory, label: "All Resources", icon: <Lightbulb className="w-4 h-4" /> },
        { id: "learning" as ResourceCategory, label: "Learning", icon: <BookOpen className="w-4 h-4" /> },
        { id: "tools" as ResourceCategory, label: "Tools & Platforms", icon: <Code className="w-4 h-4" /> },
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

    const filteredResources = activeCategory === "all"
        ? resources
        : resources.filter((r: any) => r.category === activeCategory);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "download": return <Download className="w-4 h-4" />;
            case "video": return <Video className="w-4 h-4" />;
            case "course": return <GraduationCap className="w-4 h-4" />;
            default: return <Link2 className="w-4 h-4" />;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "learning": return <BookOpen className="w-6 h-6" />;
            case "tools": return <Code className="w-6 h-6" />;
            case "career": return <Briefcase className="w-6 h-6" />;
            case "downloads": return <Download className="w-6 h-6" />;
            default: return <Globe className="w-6 h-6" />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6">
                        Resources Hub
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Curated learning materials, tools, and career resources to accelerate your tech journey.
                    </p>
                </div>
            </section>

            {/* Category Filters */}
            <section className="px-4 pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                        {categories.map(category => (
                            <Button
                                key={category.id}
                                variant={activeCategory === category.id ? "default" : "outline"}
                                className={`flex items-center gap-2 transition-all ${activeCategory === category.id
                                    ? ""
                                    : "hover:bg-secondary"
                                    }`}
                                onClick={() => setActiveCategory(category.id)}
                            >
                                {category.icon}
                                <span className="hidden sm:inline">{category.label}</span>
                                <span className="sm:hidden">{category.label.split(" ")[0]}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Resources Grid */}
            <section className="flex-1 px-4 pb-24">
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResources.map((resource: any, index: number) => (
                                <a
                                    key={resource.id}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group card-glass p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 animate-fade-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-secondary/50 rounded-xl text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                            {resource.image_url ? (
                                                <img
                                                    src={resource.image_url}
                                                    alt={resource.title}
                                                    className="w-6 h-6 object-contain"
                                                />
                                            ) : (
                                                getCategoryIcon(resource.category)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-lg font-bold text-foreground transition-colors truncate">
                                                    {resource.title}
                                                </h3>
                                                <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                                {resource.description}
                                            </p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                                                    {getTypeIcon(resource.type)}
                                                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                                </span>
                                                {resource.tags?.slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {!isLoading && filteredResources.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No resources found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Resources;
