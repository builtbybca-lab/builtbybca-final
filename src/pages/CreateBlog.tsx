import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Save } from "lucide-react";

const CreateBlog = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        image_url: "",
    });

    // Redirect effect for unauthenticated users
    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }
    }, [loading, user, navigate]);

    // Create blog mutation
    const createBlogMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const { error } = await supabase.from("blog_posts").insert({
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                category: data.category,
                image_url: data.image_url,
                author_id: user!.id,
                author_name: user!.user_metadata?.full_name || user!.email?.split("@")[0] || "Anonymous",
                published: false, // Requires admin approval
            });

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my_blogs"] });
            toast({
                title: "Blog post created!",
                description: "Your post has been submitted for review. An admin will approve it shortly.",
            });
            navigate("/dashboard");
        },
        onError: (error: any) => {
            toast({
                title: "Error creating blog post",
                description: error.message || "Something went wrong",
                variant: "destructive",
            });
        },
    });

    // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        createBlogMutation.mutate(formData);
    };

    const categories = [
        "Technology",
        "Tutorial",
        "Project Showcase",
        "Event Recap",
        "Student Life",
        "Career",
        "Other",
    ];

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-bca-red" />
            </div>
        );
    }

    // Show nothing while redirecting
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <section className="pt-24 pb-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <Link to="/dashboard">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Create <span className="text-bca-red">Blog Post</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Share your knowledge and experiences with the BCA community
                        </p>
                    </div>

                    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="title" className="text-foreground">
                                    Title <span className="text-bca-red">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    className="mt-1 bg-secondary border-border text-foreground"
                                    placeholder="Enter your blog title"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="slug" className="text-foreground">
                                    Slug
                                </Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="mt-1 bg-secondary border-border text-foreground"
                                    placeholder="auto-generated-from-title"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    URL-friendly version of the title (auto-generated)
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="category" className="text-foreground">
                                    Category <span className="text-bca-red">*</span>
                                </Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                                >
                                    <SelectTrigger className="mt-1 bg-secondary border-border">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="excerpt" className="text-foreground">
                                    Excerpt <span className="text-bca-red">*</span>
                                </Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="mt-1 bg-secondary border-border text-foreground"
                                    placeholder="A brief summary of your blog post (shown in previews)"
                                    rows={2}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="content" className="text-foreground">
                                    Content <span className="text-bca-red">*</span>
                                </Label>
                                <Textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="mt-1 bg-secondary border-border text-foreground"
                                    placeholder="Write your blog content here... (HTML supported)"
                                    rows={12}
                                    required
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    You can use HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;)
                                </p>
                            </div>

                            <div>
                                <Label className="text-foreground">Cover Image</Label>
                                <ImageUpload
                                    value={formData.image_url}
                                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                                    bucket="blog-images"
                                />
                            </div>

                            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                                <p className="text-amber-200 text-sm">
                                    <strong>Note:</strong> Your blog post will be submitted for review. An admin will review and approve it before it appears publicly on the blog page.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-bca-red hover:bg-bca-red-hover text-white"
                                disabled={createBlogMutation.isPending}
                            >
                                {createBlogMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Submit for Review
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CreateBlog;
