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
    Upload
} from "lucide-react";

const StudentDashboard = () => {
    const { user, loading, isAdmin } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [uploadImages, setUploadImages] = useState<string[]>([]);

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
            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("author_id", user?.id)
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
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("user_id", user?.id)
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
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Student <span className="text-bca-red">Dashboard</span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Manage your blogs, projects, and contribute to event galleries
                        </p>
                    </div>

                    <Tabs defaultValue="blogs" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-8">
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
