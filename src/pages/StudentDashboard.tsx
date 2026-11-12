import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";
import { useToast } from "@/hooks/use-toast";
import {
    Loader2,
    PenSquare,
    ImageIcon,
    FolderOpen,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    Upload,
    Bell,
    X,
    Star,
    Quote
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationsList = () => {
    const { notifications, dismiss } = useNotifications();

    if (notifications.length === 0) {
        return <div className="text-muted-foreground text-xs sm:text-sm">No new announcements at this time.</div>;
    }

    return (
        <div className="space-y-3">
            {notifications.map((n: any) => (
                <div key={n.id} className="flex gap-3 items-start p-3 rounded-xl bg-secondary/40 border border-border/40 relative group">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            dismiss(n.id);
                        }}
                        className="absolute top-2 right-2 opacity-70 hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        title="Dismiss"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 
                        ${n.type === 'urgent' ? 'bg-red-500' :
                            n.type === 'warning' ? 'bg-yellow-500' :
                                n.type === 'event' ? 'bg-purple-500' : 'bg-blue-500'}`}
                    />
                    <div className="pr-6">
                        <h4 className="font-semibold text-xs sm:text-sm text-foreground">{n.title}</h4>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-1 opacity-70">
                            {new Date(n.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const StudentDashboard = () => {
    const { user, loading, isAdmin } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [uploadImages, setUploadImages] = useState<string[]>([]);
    const [testimonialForm, setTestimonialForm] = useState({ rating: 5, role: "", content: "" });

    // Redirect effect for unauthenticated users
    useEffect(() => {
        if (!loading && !user) {
            navigate("/auth");
        }
    }, [loading, user, navigate]);

    // Fetch user's blog posts
    const { data: myBlogs = [], isLoading: blogsLoading } = useQuery({
        queryKey: ["my_blogs", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("author_id", user.id!)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data || [];
        },
        enabled: !!user,
    });

    // Fetch user's projects
    const { data: myProjects = [], isLoading: projectsLoading } = useQuery({
        queryKey: ["my_projects", user?.id],
        queryFn: async () => {
            if (!user) return [];
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("user_id", user.id!)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data || [];
        },
        enabled: !!user,
    });

    // Fetch all events for image upload
    const { data: events = [] } = useQuery({
        queryKey: ["events_for_upload"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("events")
                .select("id, title, date")
                .order("date", { ascending: false });
            if (error) throw error;
            return data || [];
        },
    });

    // Delete blog mutation
    const deleteBlogMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("blog_posts").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my_blogs"] });
            toast({ title: "Blog post deleted successfully" });
        },
        onError: () => {
            toast({ title: "Error deleting blog post", variant: "destructive" });
        },
    });

    // Upload event images mutation
    const uploadEventImagesMutation = useMutation({
        mutationFn: async ({ eventId, images }: { eventId: string; images: string[] }) => {
            const { data: event, error: fetchError } = await supabase
                .from("events")
                .select("gallery_images")
                .eq("id", eventId)
                .single();

            if (fetchError) throw fetchError;

            const existingImages = event?.gallery_images || [];
            const updatedImages = [...existingImages, ...images];

            const { error } = await supabase
                .from("events")
                .update({ gallery_images: updatedImages })
                .eq("id", eventId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            setUploadImages([]);
            setSelectedEventId("");
            toast({ title: "Event photos uploaded successfully!" });
        },
        onError: () => {
            toast({ title: "Error uploading photos", variant: "destructive" });
        },
    });

    const handleUploadEventImages = () => {
        if (!selectedEventId || uploadImages.length === 0) {
            toast({ title: "Please select an event and upload images", variant: "destructive" });
            return;
        }
        uploadEventImagesMutation.mutate({ eventId: selectedEventId, images: uploadImages });
    };

    const submitTestimonialMutation = useMutation({
        mutationFn: async (data: typeof testimonialForm) => {
            if (!user) throw new Error("User not authenticated");

            const { data: profile } = await supabase
                .from("profiles")
                .select("avatar_url, full_name")
                .eq("id", user.id)
                .single();

            const { error } = await supabase.from("testimonials").insert({
                name: profile?.full_name || user.user_metadata?.full_name || "Anonymous",
                role: data.role,
                content: data.content,
                rating: data.rating,
                avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url,
            });

            if (error) throw error;
        },
        onSuccess: () => {
            toast({ title: "Testimonial submitted successfully!" });
            setTestimonialForm({ rating: 5, role: "", content: "" });
        },
        onError: (error) => {
            console.error(error);
            toast({ title: "Failed to submit testimonial", variant: "destructive" });
        },
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-bca-red" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <section className="pt-24 sm:pt-32 pb-16 px-3.5 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 sm:mb-3 tracking-tight">
                            Student <span className="text-bca-red">Dashboard</span>
                        </h1>
                        <p className="text-muted-foreground text-xs sm:text-base max-w-xl mx-auto">
                            Manage your blogs, projects, and contribute to club events and galleries
                        </p>
                    </div>

                    {/* Announcements Card */}
                    <Card className="mb-6 sm:mb-8 border-l-4 border-l-bca-red bg-card/60 backdrop-blur-sm shadow-sm">
                        <CardHeader className="pb-2 p-4 sm:p-6">
                            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-bca-red shrink-0" />
                                Latest Announcements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                            <NotificationsList />
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="blogs" className="w-full">
                        {/* Mobile Scrollable Tabs */}
                        <div className="overflow-x-auto pb-2 -mx-1 px-1 mb-6 scrollbar-none">
                            <TabsList className="inline-flex w-full min-w-max md:grid md:grid-cols-4 p-1 bg-secondary/60 rounded-xl h-auto">
                                <TabsTrigger value="blogs" className="flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg">
                                    <PenSquare className="w-4 h-4 text-bca-red shrink-0" />
                                    <span>My Blogs</span>
                                </TabsTrigger>
                                <TabsTrigger value="events" className="flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg">
                                    <ImageIcon className="w-4 h-4 text-bca-red shrink-0" />
                                    <span>Event Photos</span>
                                </TabsTrigger>
                                <TabsTrigger value="projects" className="flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg">
                                    <FolderOpen className="w-4 h-4 text-bca-red shrink-0" />
                                    <span>My Projects</span>
                                </TabsTrigger>
                                <TabsTrigger value="testimonial" className="flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium rounded-lg">
                                    <Quote className="w-4 h-4 text-bca-red shrink-0" />
                                    <span>Testimonial</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* My Blogs Tab */}
                        <TabsContent value="blogs">
                            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-sm">
                                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6">
                                    <div>
                                        <CardTitle className="text-base sm:text-lg text-foreground">My Blog Posts</CardTitle>
                                        <CardDescription className="text-xs sm:text-sm">Create and manage your blog posts</CardDescription>
                                    </div>
                                    <Link to="/create-blog" className="w-full sm:w-auto">
                                        <Button className="w-full sm:w-auto bg-[#7a0000] hover:bg-[#6a0000] text-primary-foreground h-9 text-xs sm:text-sm font-medium">
                                            <Plus className="w-4 h-4 mr-1.5" />
                                            New Blog
                                        </Button>
                                    </Link>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0">
                                    {blogsLoading ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-bca-red" />
                                        </div>
                                    ) : myBlogs.length === 0 ? (
                                        <div className="text-center py-8 sm:py-12">
                                            <PenSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground/40 mb-3" />
                                            <p className="text-muted-foreground text-xs sm:text-sm mb-4">You haven't written any blog posts yet.</p>
                                            <Link to="/create-blog">
                                                <Button variant="outline" className="border-border text-xs sm:text-sm">
                                                    Write Your First Blog
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {myBlogs.map((blog: any) => (
                                                <div
                                                    key={blog.id}
                                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-muted/30 hover:bg-muted/50 rounded-xl border border-border transition-colors"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{blog.title}</h3>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                            <Badge variant={blog.published ? "default" : "secondary"} className="text-[10px] sm:text-[11px] py-0 px-2 font-normal">
                                                                {blog.published ? (
                                                                    <><Eye className="w-3 h-3 mr-1" /> Published</>
                                                                ) : (
                                                                    <><EyeOff className="w-3 h-3 mr-1" /> Pending Approval</>
                                                                )}
                                                            </Badge>
                                                            <span className="text-[11px] sm:text-xs text-muted-foreground">
                                                                {new Date(blog.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => navigate(`/blog/${blog.slug}`)}
                                                            className="h-8 px-2.5 text-xs"
                                                        >
                                                            <Eye className="w-3.5 h-3.5 mr-1" /> View
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => deleteBlogMutation.mutate(blog.id)}
                                                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            aria-label="Delete blog"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Add Event Photos Tab */}
                        <TabsContent value="events">
                            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-sm">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-base sm:text-lg text-foreground">Upload Event Photos</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">
                                        Contribute photos to event galleries. Select an event and upload your photos.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5 p-4 sm:p-6 pt-0">
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
                                            Select Event
                                        </label>
                                        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                                            <SelectTrigger className="bg-secondary border-border h-11 text-xs sm:text-sm">
                                                <SelectValue placeholder="Choose an event..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {events.map((event: any) => (
                                                    <SelectItem key={event.id} value={event.id} className="text-xs sm:text-sm">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                                            <span className="truncate">{event.title} - {new Date(event.date).toLocaleDateString()}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedEventId && (
                                        <>
                                            <div>
                                                <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
                                                    Upload Photos
                                                </label>
                                                <MultiImageUpload
                                                    value={uploadImages}
                                                    onChange={setUploadImages}
                                                    bucket="event-images"
                                                />
                                            </div>

                                            <Button
                                                className="w-full bg-[#7a0000] hover:bg-[#6a0000] text-primary-foreground h-11 text-xs sm:text-sm font-medium shadow-md"
                                                onClick={handleUploadEventImages}
                                                disabled={uploadImages.length === 0 || uploadEventImagesMutation.isPending}
                                            >
                                                {uploadEventImagesMutation.isPending ? (
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <Upload className="w-4 h-4 mr-2" />
                                                )}
                                                Upload {uploadImages.length} Photo{uploadImages.length !== 1 ? "s" : ""}
                                            </Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* My Projects Tab */}
                        <TabsContent value="projects">
                            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-sm">
                                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-6">
                                    <div>
                                        <CardTitle className="text-base sm:text-lg text-foreground">My Projects</CardTitle>
                                        <CardDescription className="text-xs sm:text-sm">View and manage your submitted projects</CardDescription>
                                    </div>
                                    <Link to="/submit-project" className="w-full sm:w-auto">
                                        <Button className="w-full sm:w-auto bg-[#7a0000] hover:bg-[#6a0000] text-primary-foreground h-9 text-xs sm:text-sm font-medium">
                                            <Plus className="w-4 h-4 mr-1.5" />
                                            New Project
                                        </Button>
                                    </Link>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0">
                                    {projectsLoading ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-bca-red" />
                                        </div>
                                    ) : myProjects.length === 0 ? (
                                        <div className="text-center py-8 sm:py-12">
                                            <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground/40 mb-3" />
                                            <p className="text-muted-foreground text-xs sm:text-sm mb-4">You haven't submitted any projects yet.</p>
                                            <Link to="/submit-project">
                                                <Button variant="outline" className="border-border text-xs sm:text-sm">
                                                    Submit Your First Project
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                            {myProjects.map((project: any) => (
                                                <div
                                                    key={project.id}
                                                    className="p-3.5 sm:p-4 bg-muted/30 hover:bg-muted/50 rounded-xl border border-border transition-colors flex flex-col sm:flex-row gap-3 sm:gap-4"
                                                >
                                                    {project.thumbnail_url && (
                                                        <img
                                                            src={project.thumbnail_url}
                                                            alt={project.name}
                                                            className="w-full sm:w-24 h-36 sm:h-24 object-cover rounded-lg shrink-0"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{project.name}</h3>
                                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                                                            {project.description}
                                                        </p>
                                                        <div className="mt-2.5">
                                                            <Badge variant={project.approved ? "default" : "secondary"} className="text-[10px] sm:text-[11px] py-0 px-2 font-normal">
                                                                {project.approved ? "Approved" : "Pending Approval"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Testimonial Tab */}
                        <TabsContent value="testimonial">
                            <Card className="bg-card/50 backdrop-blur-sm border-border shadow-sm">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-base sm:text-lg text-foreground">Share Your Experience</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">
                                        Let others know what you think about the BuiltByBCA community.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6 pt-0">
                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setTestimonialForm(prev => ({ ...prev, rating: star }))}
                                                    className="focus:outline-none transition-transform hover:scale-110 p-1"
                                                >
                                                    <Star
                                                        className={`w-6 h-6 sm:w-7 sm:h-7 ${star <= testimonialForm.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/40"}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">Role / Title</label>
                                        <input
                                            type="text"
                                            value={testimonialForm.role}
                                            onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                                            placeholder="e.g. 2nd Year Student, Developer"
                                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">Your Message</label>
                                        <textarea
                                            value={testimonialForm.content}
                                            onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                                            placeholder="Share your thoughts..."
                                            rows={4}
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                                        />
                                    </div>

                                    <Button
                                        className="w-full bg-[#7a0000] hover:bg-[#6a0000] text-primary-foreground h-11 text-xs sm:text-sm font-medium shadow-md mt-2"
                                        onClick={() => submitTestimonialMutation.mutate(testimonialForm)}
                                        disabled={!testimonialForm.content || !testimonialForm.role || submitTestimonialMutation.isPending}
                                    >
                                        {submitTestimonialMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Quote className="w-4 h-4 mr-2" />
                                        )}
                                        Submit Testimonial
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Admin Link */}
                    {isAdmin && (
                        <div className="mt-8 text-center">
                            <Link to="/admin">
                                <Button variant="outline" className="border-bca-red text-bca-red hover:bg-bca-red hover:text-white text-xs sm:text-sm">
                                    Go to Admin Dashboard
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default StudentDashboard;
