import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { MultiImageUpload } from '@/components/ui/MultiImageUpload';
import { ResourcesManager } from '@/components/ResourcesManager';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isAdmin, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-3 sm:px-4 pt-28 sm:pt-32 pb-8 sm:pb-12">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-2xl sm:text-4xl font-bold text-gradient mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your website content</p>
        </div>

        <Tabs defaultValue="blog" className="w-full">
          <div className="overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-6 mb-6 sm:mb-8">
              <TabsTrigger value="blog" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Blog Posts</TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Events</TabsTrigger>
              <TabsTrigger value="team" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Team</TabsTrigger>
              <TabsTrigger value="projects" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Projects</TabsTrigger>
              <TabsTrigger value="resources" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Resources</TabsTrigger>
              <TabsTrigger value="testimonials" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Testimonials</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="blog">
            <BlogPostsManager />
          </TabsContent>

          <TabsContent value="events">
            <EventsManager />
          </TabsContent>

          <TabsContent value="team">
            <TeamManager />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsManager />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesManager />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

// Blog Posts Manager Component
const BlogPostsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Success', description: 'Blog post deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete blog post', variant: 'destructive' });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !published })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Success', description: 'Post status updated' });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Blog Posts</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPost(null)}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <BlogPostDialog
            post={editingPost}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingPost(null);
            }}
          />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {posts?.map((post) => (
            <Card key={post.id} className="card-glass">
              <CardHeader>
                <div className="flex justify-between items-start flex-col sm:flex-row gap-3 sm:gap-0">
                  <div className="flex-1">
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                    <div className="flex gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">
                        By {post.author_name}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{post.category}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className={`text-sm ${post.published ? 'text-green-500' : 'text-yellow-500'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap sm:flex-nowrap mt-2 sm:mt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublishMutation.mutate({ id: post.id, published: post.published })}
                    >
                      {post.published ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPost(post);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Blog Post Dialog Component
const BlogPostDialog = ({ post, onClose }: { post: any; onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    author_name: post?.author_name || '',
    category: post?.category || '',
    image_url: post?.image_url || '',
    published: post?.published || false,
  });

  // Sync formData when post prop changes (for edit mode)
  useEffect(() => {
    setFormData({
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      author_name: post?.author_name || '',
      category: post?.category || '',
      image_url: post?.image_url || '',
      published: post?.published || false,
    });
  }, [post]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Validation
      if (!data.title?.trim()) throw new Error('Title is required');
      if (!data.content?.trim()) throw new Error('Content is required');
      if (!data.author_name?.trim()) throw new Error('Author name is required');
      if (!data.category?.trim()) throw new Error('Category is required');

      // Auto-generate slug from title if empty
      const slug = data.slug?.trim() || data.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const postData = { ...data, slug };

      if (post) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert([postData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog_posts'] });
      toast({ title: 'Success', description: `Blog post ${post ? 'updated' : 'created'} successfully` });
      onClose();
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save blog post',
        variant: 'destructive'
      });
    },
  });

  return (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-foreground">{post ? 'Edit' : 'Create'} Blog Post</DialogTitle>
        <DialogDescription>
          {post ? 'Update' : 'Add'} blog post details below
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 overflow-y-auto flex-1 pr-2">
        <div>
          <Label htmlFor="title" className="text-foreground">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="slug" className="text-foreground">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="excerpt" className="text-foreground">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="content" className="text-foreground">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="author_name" className="text-foreground">Author Name</Label>
          <Input
            id="author_name"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-foreground">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="image_url" className="text-foreground">Blog Image</Label>
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            bucket="blog-images"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
          />
          <Label htmlFor="published" className="text-foreground">Published</Label>
        </div>
      </div>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => saveMutation.mutate(formData)}>
          {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// Events Manager Component
const EventsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Success', description: 'Event deleted successfully' });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingEvent(null)}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </DialogTrigger>
          <EventDialog
            event={editingEvent}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingEvent(null);
            }}
          />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {events?.map((event) => (
            <Card key={event.id} className="card-glass">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                    <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{event.location}</span>
                      <span>•</span>
                      <span>{event.event_type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingEvent(event);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Event Dialog Component
const EventDialog = ({ event, onClose }: { event: any; onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    location: event?.location || '',
    event_type: event?.event_type || '',
    image_url: event?.image_url || '',
    gallery_images: event?.gallery_images || [],
    registration_link: event?.registration_link || '',
  });

  // Sync formData when event prop changes (for edit mode)
  useEffect(() => {
    setFormData({
      title: event?.title || '',
      description: event?.description || '',
      date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      location: event?.location || '',
      event_type: event?.event_type || '',
      image_url: event?.image_url || '',
      gallery_images: event?.gallery_images || [],
      registration_link: event?.registration_link || '',
    });
  }, [event]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Validation
      if (!data.title?.trim()) throw new Error('Title is required');
      if (!data.description?.trim()) throw new Error('Description is required');
      if (!data.date) throw new Error('Date is required');
      if (!data.event_type?.trim()) throw new Error('Event type is required');

      const eventData = { ...data, date: new Date(data.date).toISOString() };
      if (event) {
        const { error } = await supabase.from('events').update(eventData).eq('id', event.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert([eventData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({ title: 'Success', description: `Event ${event ? 'updated' : 'created'} successfully` });
      onClose();
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save event',
        variant: 'destructive'
      });
    },
  });

  return (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-foreground">{event ? 'Edit' : 'Create'} Event</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 overflow-y-auto flex-1 pr-2">
        <div>
          <Label htmlFor="title" className="text-foreground">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-foreground">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="date" className="text-foreground">Date & Time</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-background border-border text-foreground [color-scheme:dark]"
          />
        </div>
        <div>
          <Label htmlFor="location" className="text-foreground">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="event_type" className="text-foreground">Event Type</Label>
          <Input
            id="event_type"
            value={formData.event_type}
            onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="image_url" className="text-foreground">Event Image</Label>
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            bucket="event-images"
          />
        </div>
        <div>
          <Label htmlFor="gallery_images" className="text-foreground">Event Gallery Images</Label>
          <MultiImageUpload
            value={formData.gallery_images}
            onChange={(urls) => setFormData({ ...formData, gallery_images: urls })}
            bucket="event-images"
            maxImages={20}
          />
        </div>
        <div>
          <Label htmlFor="registration_link" className="text-foreground">Registration Link</Label>
          <Input
            id="registration_link"
            value={formData.registration_link}
            onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
      </div>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => saveMutation.mutate(formData)}>
          {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// Team Manager Component
const TeamManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const { data: members, isLoading } = useQuery({
    queryKey: ['admin-team'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team'] });
      toast({ title: 'Success', description: 'Team member deleted successfully' });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingMember(null)}>
              <Plus className="h-4 w-4 mr-2" />
              New Member
            </Button>
          </DialogTrigger>
          <TeamDialog
            member={editingMember}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingMember(null);
            }}
          />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {members?.map((member) => (
            <Card key={member.id} className="card-glass">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    {member.image_url && (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle>{member.name}</CardTitle>
                      <CardDescription>{member.role}</CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingMember(member);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Team Dialog Component
const TeamDialog = ({ member, onClose }: { member: any; onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: member?.name || '',
    role: member?.role || '',
    bio: member?.bio || '',
    image_url: member?.image_url || '',
    linkedin_url: member?.linkedin_url || '',
    github_url: member?.github_url || '',
    display_order: member?.display_order || 0,
    year: member?.year || '',
  });

  // Sync formData when member prop changes (for edit mode)
  useEffect(() => {
    setFormData({
      name: member?.name || '',
      role: member?.role || '',
      bio: member?.bio || '',
      image_url: member?.image_url || '',
      linkedin_url: member?.linkedin_url || '',
      github_url: member?.github_url || '',
      display_order: member?.display_order || 0,
      year: member?.year || '',
    });
  }, [member]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Validation
      if (!data.name?.trim()) throw new Error('Name is required');
      if (!data.role?.trim()) throw new Error('Role is required');

      if (member) {
        const { error } = await supabase.from('team_members').update(data).eq('id', member.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('team_members').insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team'] });
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      toast({ title: 'Success', description: `Team member ${member ? 'updated' : 'added'} successfully` });
      onClose();
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save team member',
        variant: 'destructive'
      });
    },
  });

  return (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-foreground">{member ? 'Edit' : 'Add'} Team Member</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 overflow-y-auto flex-1 pr-2">
        <div>
          <Label htmlFor="name" className="text-foreground">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="role" className="text-foreground">Role</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="year" className="text-foreground">Year</Label>
          <select
            id="year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="Alumni">Alumni</option>
            <option value="Faculty">Faculty</option>
          </select>
        </div>
        <div>
          <Label htmlFor="bio" className="text-foreground">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="image_url" className="text-foreground">Profile Picture</Label>
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            bucket="team-images"
          />
        </div>
        <div>
          <Label htmlFor="linkedin_url" className="text-foreground">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            value={formData.linkedin_url}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="github_url" className="text-foreground">GitHub URL</Label>
          <Input
            id="github_url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="display_order" className="text-foreground">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            className="bg-background border-border text-foreground"
          />
        </div>
      </div>
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => saveMutation.mutate(formData)}>
          {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// Projects Manager Component
const ProjectsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleApproveMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      const { error } = await supabase
        .from('projects')
        .update({ approved: !approved })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Success', description: 'Project status updated' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Success', description: 'Project deleted successfully' });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {projects?.map((project) => (
            <Card key={project.id} className="card-glass">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                    <div className="flex gap-2 mt-2 text-sm text-muted-foreground">
                      <span>By {project.built_by}</span>
                      <span>•</span>
                      <span className={project.approved ? 'text-green-500' : 'text-yellow-500'}>
                        {project.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleApproveMutation.mutate({ id: project.id, approved: project.approved })}
                    >
                      {project.approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Testimonials Manager Component
const TestimonialsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({ title: 'Success', description: 'Testimonial deleted successfully' });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTestimonial(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <TestimonialDialog
            testimonial={editingTestimonial}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingTestimonial(null);
            }}
          />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    {testimonial.avatar_url && (
                      <img
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle>{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-500">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingTestimonial(testimonial);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(testimonial.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const TestimonialDialog = ({ testimonial, onClose }: { testimonial: any; onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    content: testimonial?.content || '',
    rating: testimonial?.rating || 5,
    avatar_url: testimonial?.avatar_url || '',
    display_order: testimonial?.display_order || 0,
  });

  // Sync formData when testimonial prop changes (for edit mode)
  useEffect(() => {
    setFormData({
      name: testimonial?.name || '',
      role: testimonial?.role || '',
      content: testimonial?.content || '',
      rating: testimonial?.rating || 5,
      avatar_url: testimonial?.avatar_url || '',
      display_order: testimonial?.display_order || 0,
    });
  }, [testimonial]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (testimonial?.id) {
        const { error } = await supabase
          .from('testimonials')
          .update(data)
          .eq('id', testimonial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast({ title: 'Success', description: 'Testimonial saved successfully' });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-foreground">{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-2">
        <div>
          <Label htmlFor="name" className="text-foreground">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="role" className="text-foreground">Role</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="content" className="text-foreground">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            required
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="rating" className="text-foreground">Rating (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            required
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label className="text-foreground">Avatar Image (Optional)</Label>
          <ImageUpload
            value={formData.avatar_url}
            onChange={(url) => setFormData({ ...formData, avatar_url: url })}
            bucket="team-images"
          />
        </div>
        <div>
          <Label htmlFor="display_order" className="text-foreground">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default Admin;