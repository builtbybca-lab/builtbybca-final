import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon, Database } from "lucide-react";

export const ResourcesManager = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "learning",
        type: "link",
        url: "",
        image_url: "",
        tags: "",
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();

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

    const createMutation = useMutation({
        mutationFn: async (newResource: any) => {
            const { error } = await supabase.from("resources").insert([newResource]);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resources"] });
            toast({ title: "Success", description: "Resource added successfully" });
            setIsOpen(false);
            resetForm();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (resource: any) => {
            const { error } = await supabase
                .from("resources")
                .update(resource)
                .eq("id", editingResource.id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resources"] });
            toast({ title: "Success", description: "Resource updated successfully" });
            setIsOpen(false);
            resetForm();
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("resources").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resources"] });
            toast({ title: "Success", description: "Resource deleted successfully" });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const seedMutation = useMutation({
        mutationFn: async () => {
            const seedData = [
                {
                    title: "freeCodeCamp",
                    description: "Learn to code for free with interactive tutorials and projects. Covers web development, data science, and more.",
                    category: "learning",
                    type: "course",
                    url: "https://www.freecodecamp.org",
                    tags: ["Free", "Web Dev", "Certification"]
                },
                {
                    title: "CS50 by Harvard",
                    description: "Introduction to Computer Science from Harvard University. One of the most popular CS courses worldwide.",
                    category: "learning",
                    type: "course",
                    url: "https://cs50.harvard.edu",
                    tags: ["Free", "Computer Science", "Harvard"]
                },
                {
                    title: "The Odin Project",
                    description: "Full stack curriculum with hands-on projects. Learn Ruby, JavaScript, and web development.",
                    category: "learning",
                    type: "course",
                    url: "https://www.theodinproject.com",
                    tags: ["Free", "Full Stack", "Projects"]
                },
                {
                    title: "GeeksforGeeks",
                    description: "Computer science portal with tutorials, practice problems, and interview preparation resources.",
                    category: "learning",
                    type: "link",
                    url: "https://www.geeksforgeeks.org",
                    tags: ["DSA", "Interview Prep", "Tutorials"]
                },
                {
                    title: "GitHub Student Pack",
                    description: "Free access to developer tools, cloud credits, and learning resources for students.",
                    category: "tools",
                    type: "link",
                    url: "https://education.github.com/pack",
                    tags: ["Free", "Student", "Tools"]
                },
                {
                    title: "Visual Studio Code",
                    description: "Free, powerful code editor with extensions for every programming language.",
                    category: "tools",
                    type: "download",
                    url: "https://code.visualstudio.com",
                    tags: ["Editor", "Free", "Cross-platform"]
                },
                {
                    title: "Figma",
                    description: "Collaborative design tool for UI/UX design. Free for students and educators.",
                    category: "tools",
                    type: "link",
                    url: "https://www.figma.com",
                    tags: ["Design", "UI/UX", "Collaboration"]
                },
                {
                    title: "MongoDB Atlas",
                    description: "Cloud database service with free tier. Perfect for learning database management.",
                    category: "tools",
                    type: "link",
                    url: "https://www.mongodb.com/atlas",
                    tags: ["Database", "Cloud", "Free Tier"]
                },
                {
                    title: "LinkedIn Learning",
                    description: "Professional development courses on business, technology, and creative skills.",
                    category: "career",
                    type: "link",
                    url: "https://www.linkedin.com/learning",
                    tags: ["Professional", "Skills", "Certifications"]
                },
                {
                    title: "LeetCode",
                    description: "Practice coding problems and prepare for technical interviews at top companies.",
                    category: "career",
                    type: "link",
                    url: "https://leetcode.com",
                    tags: ["Interview Prep", "DSA", "Practice"]
                },
                {
                    title: "Internshala",
                    description: "Find internships and fresher jobs across India. Perfect for BCA students.",
                    category: "career",
                    type: "link",
                    url: "https://internshala.com",
                    tags: ["Internships", "Jobs", "India"]
                },
                {
                    title: "BCA Syllabus PDF",
                    description: "Complete BCA curriculum and syllabus document for reference.",
                    category: "downloads",
                    type: "download",
                    url: "#",
                    tags: ["PDF", "Syllabus", "Reference"]
                },
                {
                    title: "Programming Cheat Sheets",
                    description: "Quick reference guides for popular programming languages and frameworks.",
                    category: "downloads",
                    type: "download",
                    url: "#",
                    tags: ["PDF", "Quick Reference", "Multiple Languages"]
                },
                {
                    title: "Resume Templates",
                    description: "Professional resume templates designed for tech freshers and students.",
                    category: "downloads",
                    type: "download",
                    url: "#",
                    tags: ["Template", "Resume", "Career"]
                }
            ];

            const { error } = await supabase.from("resources").insert(seedData);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resources"] });
            toast({ title: "Success", description: "Added 14 sample resources!" });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);

        const resourceData = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            type: formData.type,
            url: formData.url,
            image_url: formData.image_url || null,
            tags: tagsArray,
        };

        if (editingResource) {
            updateMutation.mutate(resourceData);
        } else {
            createMutation.mutate(resourceData);
        }
    };

    const handleEdit = (resource: any) => {
        setEditingResource(resource);
        setFormData({
            title: resource.title,
            description: resource.description,
            category: resource.category,
            type: resource.type,
            url: resource.url,
            image_url: resource.image_url || "",
            tags: resource.tags?.join(", ") || "",
        });
        setIsOpen(true);
    };

    const resetForm = () => {
        setEditingResource(null);
        setFormData({
            title: "",
            description: "",
            category: "learning",
            type: "link",
            url: "",
            image_url: "",
            tags: "",
        });
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Resources</h2>
                    <p className="text-muted-foreground">Manage learning resources and tools</p>
                </div>
                <Dialog open={isOpen} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add Resource
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingResource ? "Edit Resource" : "Add Resource"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. FreeCodeCamp"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="learning">Learning</SelectItem>
                                            <SelectItem value="tools">Tools</SelectItem>
                                            <SelectItem value="career">Career</SelectItem>
                                            <SelectItem value="downloads">Downloads</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="link">Link</SelectItem>
                                            <SelectItem value="course">Course</SelectItem>
                                            <SelectItem value="video">Video</SelectItem>
                                            <SelectItem value="download">Download</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the resource..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>URL</Label>
                                <div className="relative">
                                    <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        required
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Image/Logo URL (Optional)</Label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://.../logo.png"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <Input
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="e.g. Web Dev, Free, Java (comma separated)"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                                {createMutation.isPending || updateMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : null}
                                {editingResource ? "Update Resource" : "Create Resource"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
                {resources.length === 0 && (
                    <Button
                        variant="outline"
                        onClick={() => seedMutation.mutate()}
                        disabled={seedMutation.isPending}
                        className="ml-2"
                    >
                        {seedMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Database className="w-4 h-4 mr-2" />}
                        Seed Data
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource: any) => (
                    <div key={resource.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                {resource.image_url ? (
                                    <img src={resource.image_url} alt="" className="w-10 h-10 object-contain rounded bg-muted/50 p-1" />
                                ) : (
                                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {resource.title.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold line-clamp-1">{resource.title}</h3>
                                    <div className="flex gap-2 text-xs text-muted-foreground">
                                        <span className="capitalize">{resource.category}</span>
                                        <span>•</span>
                                        <span className="capitalize">{resource.type}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(resource)}>
                                    <Pencil className="w-4 h-4 text-muted-foreground" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        if (confirm("Are you sure you want to delete this resource?")) {
                                            deleteMutation.mutate(resource.id);
                                        }
                                    }}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>

                        <div className="flex flex-wrap gap-1">
                            {resource.tags?.map((tag: string) => (
                                <span key={tag} className="text-xs bg-secondary px-2 py-0.5 rounded text-secondary-foreground">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
                        >
                            <ExternalLink className="w-3 h-3" /> {resource.url}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};
