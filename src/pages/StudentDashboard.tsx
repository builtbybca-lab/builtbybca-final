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
        return <div className="text-muted-foreground text-sm">No new announcements at this time.</div>;
    }

    return (
        <div className="space-y-4">
            {notifications.map((n: any) => (
                <div key={n.id} className="flex gap-4 items-start p-3 rounded-lg bg-secondary/30 relative group">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            dismiss(n.id);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        title="Dismiss"
                    >
                        <X className="w-3 h-3" />
                    </button>
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 
                        ${n.type === 'urgent' ? 'bg-red-500' :
                            n.type === 'warning' ? 'bg-yellow-500' :
                                n.type === 'event' ? 'bg-purple-500' : 'bg-blue-500'}`}
                    />
                    <div>
                        <h4 className="font-semibold text-sm">{n.title}</h4>
                        <p className="text-muted-foreground text-sm mt-0.5">{n.message}</p>
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
            // Get existing images first
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
                .from('profiles')
                .select('avatar_url, full_name')
                .eq('id', user.id)
                .single();

            const { error } = await supabase.from("testimonials").insert({
                name: profile?.full_name || user.user_metadata.full_name || "Anonymous",
                role: data.role,
                content: data.content,
                rating: data.rating,
                avatar_url: profile?.avatar_url || user.user_metadata.avatar_url
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
        }
    });

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

            <section className="pt-32 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Student <span className="text-bca-red">Dashboard</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Manage your blogs, projects, and contribute to event galleries
                        </p>
                    </div>


                    {/* Announcements Card */}
                    <Card className="mb-8 border-l-4 border-l-bca-red bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bell className="w-5 h-5 text-bca-red" />
                                Latest Announcements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <NotificationsList />
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="blogs" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
                            <TabsTrigger value="blogs" className="flex items-center gap-2">
                                <PenSquare className="w-4 h-4" />
                                My Blogs
                            </TabsTrigger>
                            <TabsTrigger value="events" className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Add Event Photos
                            </TabsTrigger>
                            <TabsTrigger value="projects" className="flex items-center gap-2">
                                <FolderOpen className="w-4 h-4" />
                                My Projects
                            </TabsTrigger>
                            <TabsTrigger value="testimonial" className="flex items-center gap-2">
                                <Quote className="w-4 h-4" />
                                Testimonial
                            </TabsTrigger>
                        </TabsList>

                        {/* My Blogs Tab */}
                        <TabsContent value="blogs">
                            <Card className="bg-card/50 backdrop-blur-sm border-border">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-foreground">My Blog Posts</CardTitle>
                                        <CardDescription>Create and manage your blog posts</CardDescription>
                                    </div>
                                    <Link to="/create-blog">
                                        <Button className="bg-bca-red hover:bg-bca-red-hover">
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Blog
                                        </Button>
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    {blogsLoading ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-bca-red" />
                                        </div>
                                    ) : myBlogs.length === 0 ? (
                                        <div className="text-center py-8">
                                            <PenSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                                            <p className="text-muted-foreground mb-4">You haven't written any blog posts yet.</p>
                                            <Link to="/create-blog">
                                                <Button variant="outline" className="border-border">
                                                    Write Your First Blog
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {myBlogs.map((blog: any) => (
                                                <div
                                                    key={blog.id}
                                                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                                                >
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-foreground">{blog.title}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant={blog.published ? "default" : "secondary"}>
                                                                {blog.published ? (
                                                                    <><Eye className="w-3 h-3 mr-1" /> Published</>
                                                                ) : (
                                                                    <><EyeOff className="w-3 h-3 mr-1" /> Pending Approval</>
                                                                )}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">
                                                                {new Date(blog.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => navigate(`/blog/${blog.slug}`)}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteBlogMutation.mutate(blog.id)}
                                                            className="text-destructive hover:text-destructive"
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
                            <Card className="bg-card/50 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground">Upload Event Photos</CardTitle>
                                    <CardDescription>
                                        Contribute photos to event galleries. Select an event and upload your photos.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                            Select Event
                                        </label>
                                        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                                            <SelectTrigger className="bg-secondary border-border">
                                                <SelectValue placeholder="Choose an event..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {events.map((event: any) => (
                                                    <SelectItem key={event.id} value={event.id}>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                                            {event.title} - {new Date(event.date).toLocaleDateString()}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedEventId && (
                                        <>
                                            <div>
                                                <label className="text-sm font-medium text-foreground mb-2 block">
                                                    Upload Photos
                                                </label>
                                                <MultiImageUpload
                                                    value={uploadImages}
                                                    onChange={setUploadImages}
                                                    bucket="event-images"
                                                />
                                            </div>

                                            <Button
                                                className="w-full bg-bca-red hover:bg-bca-red-hover"
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
                            <Card className="bg-card/50 backdrop-blur-sm border-border">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-foreground">My Projects</CardTitle>
                                        <CardDescription>View and manage your submitted projects</CardDescription>
                                    </div>
                                    <Link to="/submit-project">
                                        <Button className="bg-bca-red hover:bg-bca-red-hover">
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Project
                                        </Button>
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    {projectsLoading ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin text-bca-red" />
                                        </div>
                                    ) : myProjects.length === 0 ? (
                                        <div className="text-center py-8">
                                            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                                            <p className="text-muted-foreground mb-4">You haven't submitted any projects yet.</p>
                                            <Link to="/submit-project">
                                                <Button variant="outline" className="border-border">
                                                    Submit Your First Project
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {myProjects.map((project: any) => (
                                                <div
                                                    key={project.id}
                                                    className="p-4 bg-muted/50 rounded-lg border border-border"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        {project.thumbnail_url && (
                                                            <img
                                                                src={project.thumbnail_url}
                                                                alt={project.name}
                                                                className="w-20 h-20 object-cover rounded-lg"
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-foreground">{project.name}</h3>
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {project.description}
                                                            </p>
                                                            <div className="mt-2">
                                                                <Badge variant={project.approved ? "default" : "secondary"}>
                                                                    {project.approved ? "Approved" : "Pending Approval"}
                                                                </Badge>
                                                            </div>
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
                            <Card className="bg-card/50 backdrop-blur-sm border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground">Share Your Experience</CardTitle>
                                    <CardDescription>
                                        Let others know what you think about the community.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setTestimonialForm(prev => ({ ...prev, rating: star }))}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 ${star <= testimonialForm.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Role / Title</label>
                                        <input
                                            type="text"
                                            value={testimonialForm.role}
                                            onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                                            placeholder="e.g. 2nd Year Student, Alumni, Developer"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block">Your Message</label>
                                        <textarea
                                            value={testimonialForm.content}
                                            onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                                            placeholder="Share your thoughts..."
                                            rows={4}
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>

                                    <Button
                                        className="w-full bg-bca-red hover:bg-bca-red-hover"
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
                                <Button variant="outline" className="border-bca-red text-bca-red hover:bg-bca-red hover:text-white">
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
