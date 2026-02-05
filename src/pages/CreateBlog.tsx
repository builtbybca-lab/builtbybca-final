import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Loader2, ArrowLeft, Save, Eye, EyeOff } from "lucide-react";

const CreateBlog = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const isEditing = !!slug;

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "",
        image_url: "",
    });

    const [showPreview, setShowPreview] = useState(false);

    // Redirect effect for unauthenticated users
    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }
    }, [loading, user, navigate]);

    // Fetch existing blog post if editing
    const { data: existingPost, isLoading: isLoadingPost } = useQuery({
        queryKey: ["blog_post_edit", slug],
        queryFn: async () => {
            if (!slug) return null;
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: isEditing,
    });

    // Populate form with existing data
    useEffect(() => {
        if (existingPost) {
            // check if user is author
            if (user && existingPost.author_id !== user.id) {
                toast({
                    title: "Unauthorized",
                    description: "You can only edit your own posts.",
                    variant: "destructive",
                });
                navigate("/dashboard");
                return;
            }

            setFormData({
                title: existingPost.title,
                slug: existingPost.slug,
                excerpt: existingPost.excerpt,
                content: existingPost.content,
                category: existingPost.category,
                image_url: existingPost.image_url || "",
            });
        }
    }, [existingPost, user, navigate, toast]);

    // Create/Update blog mutation
    const blogMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            if (isEditing && existingPost) {
                const { error } = await supabase
                    .from("blog_posts")
                    .update({
                        title: data.title,
                        slug: data.slug,
                        excerpt: data.excerpt,
                        content: data.content,
                        category: data.category,
                        image_url: data.image_url,
                        // Don't update author or published status automatically
                    })
                    .eq("id", existingPost.id);

                if (error) throw error;
            } else {
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
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my_blogs"] });
            queryClient.invalidateQueries({ queryKey: ["blog_post", slug] }); // invalidates specific post query
            toast({
                title: isEditing ? "Blog post updated!" : "Blog post created!",
                description: isEditing
                    ? "Your changes have been saved."
                    : "Your post has been submitted for review.",
            });
            navigate(isEditing ? `/blog/${formData.slug}` : "/dashboard");
        },
        onError: (error: any) => {
            toast({
                title: `Error ${isEditing ? "updating" : "creating"} blog post`,
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
        // Only auto-generate slug if creating new post or if slug hasn't been manually edited (simple heuristic)
        // or just let them edit it manually. For edit mode, we might want to be careful changing slugs as it breaks links.
        // Let's only auto-update slug on creation.
        if (!isEditing) {
            setFormData({
                ...formData,
                title,
                slug: generateSlug(title),
            });
        } else {
            setFormData({
                ...formData,
                title,
            });
        }
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

        blogMutation.mutate(formData);
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
    if (loading || isLoadingPost) {
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

            <section className="pt-32 pb-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <Link to="/dashboard">
                        <Button variant="ghost" className="text-muted-foreground hover:text-foreground mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {isEditing ? "Edit" : "Create"} <span className="text-bca-red">Blog Post</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {isEditing ? "Update your blog post content" : "Share your knowledge and experiences with the BCA community"}
                        </p>
                    </div>

                    {/* Preview Toggle Button */}
                    <div className="flex justify-end mb-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowPreview(!showPreview)}
                            className="border-bca-red/50 hover:bg-bca-red/10"
                        >
                            {showPreview ? (
                                <>
                                    <EyeOff className="w-4 h-4 mr-2" />
                                    Edit Mode
                                </>
                            ) : (
                                <>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Preview
                                </>
                            )}
                        </Button>
                    </div>

                    {showPreview ? (
                        /* Preview Section */
                        <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border p-8">
                            <div className="prose prose-invert max-w-none">
                                {formData.image_url && (
                                    <img
                                        src={formData.image_url}
                                        alt={formData.title}
                                        className="w-full h-64 object-cover rounded-lg mb-6"
                                    />
                                )}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="bg-bca-red/20 text-bca-red px-3 py-1 rounded-full text-sm">
                                        {formData.category || "Category"}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                    {formData.title || "Your Blog Title"}
                                </h1>
                                <p className="text-muted-foreground text-lg italic mb-6 border-l-4 border-bca-red pl-4">
                                    {formData.excerpt || "Your excerpt will appear here..."}
                                </p>
                                <div
                                    className="text-foreground leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: formData.content || "<p class='text-muted-foreground'>Your content will appear here...</p>"
                                    }}
                                />
                            </div>
                            <div className="mt-8 pt-6 border-t border-border text-center text-muted-foreground text-sm">
                                Preview Mode - Click "Edit Mode" to continue editing
                            </div>
                        </div>
                    ) : (
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
                                        URL-friendly version of the title {isEditing ? "(Changing this breaks existing links!)" : "(auto-generated)"}
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

                                {!isEditing && (
                                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                                        <p className="text-amber-200 text-sm">
                                            <strong>Note:</strong> Your blog post will be submitted for review. An admin will review and approve it before it appears publicly on the blog page.
                                        </p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-bca-red hover:bg-bca-red-hover text-white"
                                    disabled={blogMutation.isPending}
                                >
                                    {blogMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {isEditing ? "Updating..." : "Submitting..."}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            {isEditing ? "Update Post" : "Submit for Review"}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default CreateBlog;
