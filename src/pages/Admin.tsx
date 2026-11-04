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
import { QuestionBankManager } from '@/components/QuestionBankManager';
import { NotificationsManager } from '@/components/NotificationsManager';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

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
            <TabsList className="inline-flex w-auto min-w-full sm:grid sm:w-full sm:grid-cols-8 mb-6 sm:mb-8 h-auto">
              <TabsTrigger value="blog" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Blog Posts</TabsTrigger>
              <TabsTrigger value="events" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Events</TabsTrigger>
              <TabsTrigger value="team" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Team</TabsTrigger>
              <TabsTrigger value="projects" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Projects</TabsTrigger>
              <TabsTrigger value="resources" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Resources</TabsTrigger>
              <TabsTrigger value="question_bank" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Question Bank</TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Notifications</TabsTrigger>
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

          <TabsContent value="question_bank">
            <QuestionBankManager />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsManager />
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
                      onClick={() => togglePublishMutation.mutate({ id: post.id, published: !!post.published })}
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
          <Select
            value={formData.event_type}
            onValueChange={(value) => setFormData({ ...formData, event_type: value })}
          >
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hackathon">Hackathon</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Meetup">Meetup</SelectItem>
              <SelectItem value="Seminar">Seminar</SelectItem>
            </SelectContent>
          </Select>
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
  const [filterStatus, setFilterStatus] = useState<string>('all');

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
      queryClient.invalidateQueries({ queryKey: ['team_members'] });
      toast({ title: 'Success', description: 'Team member deleted successfully' });
    },
  });

  const filteredMembers = (members || []).filter((m) => {
    if (filterStatus === 'current') return m.is_current !== false && m.year !== 'Alumni';
    if (filterStatus === 'archived') return m.is_current === false || m.year === 'Alumni';
    if (filterStatus === 'founding') return Boolean(m.is_founding);
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-border/40">
        <div>
          <h2 className="text-2xl font-bold font-serif">Council & Team Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage active council leaders, annual tenures, and hall of fame cohorts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingMember(null)} className="bg-bca-red hover:bg-bca-red/90 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
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
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs font-mono text-muted-foreground mr-1 uppercase">Filter:</span>
        <Button
          size="sm"
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          className="text-xs h-7"
        >
          All ({members?.length || 0})
        </Button>
        <Button
          size="sm"
          variant={filterStatus === 'current' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('current')}
          className="text-xs h-7"
        >
          Active Council
        </Button>
        <Button
          size="sm"
          variant={filterStatus === 'archived' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('archived')}
          className="text-xs h-7"
        >
          Hall of Fame / Past
        </Button>
        <Button
          size="sm"
          variant={filterStatus === 'founding' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('founding')}
          className="text-xs h-7"
        >
          Founding Cohort
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="card-glass border-border/60 hover:border-border transition-colors">
              <CardHeader className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="h-14 w-14 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground font-mono">
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-base font-bold font-serif">{member.name}</CardTitle>
                        {member.is_current !== false && member.year !== 'Alumni' ? (
                          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-mono tracking-wider">
                            Active Council
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-border bg-secondary/50 text-muted-foreground text-[10px] uppercase font-mono tracking-wider">
                            Hall of Fame
                          </Badge>
                        )}
                        {member.is_founding && (
                          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] uppercase font-mono tracking-wider">
                            Founding Member
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs font-mono text-muted-foreground">
                        {member.role} &bull; {member.division || 'General'}
                      </CardDescription>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/80">
                        <span>Tenure: {member.tenure || '2025–2026'}</span>
                        {member.year && <span>&bull; {member.year}</span>}
                        {member.batch && <span>&bull; Batch {member.batch}</span>}
                        <span>&bull; Order: {member.display_order ?? 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingMember(member);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${member.name}?`)) {
                          deleteMutation.mutate(member.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border rounded-xl text-muted-foreground font-mono text-sm">
              No team members found for this filter.
            </div>
          )}
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
    instagram_url: member?.instagram_url || '',
    twitter_url: member?.twitter_url || '',
    display_order: member?.display_order ?? 0,
    year: member?.year || '2nd Year',
    batch: member?.batch || '2023-2026',
    division: member?.division || 'Core Team',
    tenure: member?.tenure || '2025–2026',
    is_current: member?.is_current !== undefined && member?.is_current !== null ? member.is_current : true,
    is_founding: Boolean(member?.is_founding),
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
      instagram_url: member?.instagram_url || '',
      twitter_url: member?.twitter_url || '',
      display_order: member?.display_order ?? 0,
      year: member?.year || '2nd Year',
      batch: member?.batch || '2023-2026',
      division: member?.division || 'Core Team',
      tenure: member?.tenure || '2025–2026',
      is_current: member?.is_current !== undefined && member?.is_current !== null ? member.is_current : true,
      is_founding: Boolean(member?.is_founding),
    });
  }, [member]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!data.name?.trim()) throw new Error('Name is required');
      if (!data.role?.trim()) throw new Error('Role is required');

      const payload = {
        name: data.name.trim(),
        role: data.role.trim(),
        bio: data.bio || '',
        image_url: data.image_url || '',
        linkedin_url: data.linkedin_url || null,
        github_url: data.github_url || null,
        instagram_url: data.instagram_url || null,
        twitter_url: data.twitter_url || null,
        display_order: Number(data.display_order) || 0,
        year: data.year || null,
        batch: data.batch || null,
        division: data.division || 'Core Team',
        tenure: data.tenure || '2025–2026',
        is_current: Boolean(data.is_current),
        is_founding: Boolean(data.is_founding),
      };

      if (member) {
        const { error } = await supabase.from('team_members').update(payload).eq('id', member.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('team_members').insert([payload]);
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
        variant: 'destructive',
      });
    },
  });

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
      <DialogHeader>
        <DialogTitle className="text-foreground font-serif text-xl">
          {member ? 'Edit Member Profile' : 'Add New Council Member'}
        </DialogTitle>
        <DialogDescription className="text-muted-foreground text-xs font-mono">
          Configure profile, role division, tenure cycle, and council hierarchy.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 overflow-y-auto flex-1 pr-2 py-2">
        {/* Core Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-foreground text-xs font-mono">FULL NAME *</Label>
            <Input
              id="name"
              placeholder="e.g. Vikas U U"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-background border-border text-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-foreground text-xs font-mono">ROLE / POSITION *</Label>
            <Input
              id="role"
              placeholder="e.g. President, Technical Lead"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="bg-background border-border text-foreground"
            />
          </div>
        </div>

        {/* Hierarchy & Lifecycle Settings (Tenure & Council Placement) */}
        <div className="p-4 rounded-xl border border-border/80 bg-secondary/30 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Council Placement & Tenure
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tenure" className="text-foreground text-xs font-mono">
                TENURE TERM (e.g. 2025–2026, 2026–2027)
              </Label>
              <Input
                id="tenure"
                placeholder="2025–2026"
                value={formData.tenure}
                onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                className="bg-background border-border text-foreground font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="division" className="text-foreground text-xs font-mono">DIVISION</Label>
              <Select
                value={formData.division}
                onValueChange={(value) => setFormData({ ...formData, division: value })}
              >
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select Division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Core Team">Core Team</SelectItem>
                  <SelectItem value="Technical Team">Technical Team</SelectItem>
                  <SelectItem value="Design Team">Design Team</SelectItem>
                  <SelectItem value="Media Team">Media Team</SelectItem>
                  <SelectItem value="Events Team">Events Team</SelectItem>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div className="space-y-0.5 pr-2">
                <Label className="text-xs font-mono font-medium text-foreground">ACTIVE COUNCIL</Label>
                <p className="text-[11px] text-muted-foreground">
                  {formData.is_current ? 'Featured in active council on top' : 'Archived in Hall of Fame below'}
                </p>
              </div>
              <Switch
                checked={formData.is_current}
                onCheckedChange={(checked) => setFormData({ ...formData, is_current: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
              <div className="space-y-0.5 pr-2">
                <Label className="text-xs font-mono font-medium text-foreground">FOUNDING MEMBER</Label>
                <p className="text-[11px] text-muted-foreground">
                  {formData.is_founding ? 'Marked as Founding Council member' : 'Standard term council member'}
                </p>
              </div>
              <Switch
                checked={formData.is_founding}
                onCheckedChange={(checked) => setFormData({ ...formData, is_founding: checked })}
              />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="year" className="text-foreground text-xs font-mono">STUDENT YEAR</Label>
            <select
              id="year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-sm"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="Alumni">Alumni</option>
              <option value="Faculty">Faculty</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="batch" className="text-foreground text-xs font-mono">STUDENT BATCH</Label>
            <Input
              id="batch"
              placeholder="e.g. 2023-2026"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              className="bg-background border-border text-foreground text-sm font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="display_order" className="text-foreground text-xs font-mono">DISPLAY ORDER</Label>
            <Input
              id="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="bg-background border-border text-foreground text-sm font-mono"
            />
          </div>
        </div>

        {/* Profile Image */}
        <div className="space-y-1.5">
          <Label htmlFor="image_url" className="text-foreground text-xs font-mono">PORTRAIT PHOTO</Label>
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            bucket="team-images"
          />
        </div>

        {/* Biography */}
        <div className="space-y-1.5">
          <Label htmlFor="bio" className="text-foreground text-xs font-mono">BIOGRAPHY</Label>
          <Textarea
            id="bio"
            placeholder="Brief bio or council contributions..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            className="bg-background border-border text-foreground text-sm"
          />
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="linkedin_url" className="text-foreground text-xs font-mono">LINKEDIN URL</Label>
            <Input
              id="linkedin_url"
              placeholder="https://linkedin.com/in/username"
              value={formData.linkedin_url}
              onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
              className="bg-background border-border text-foreground text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="github_url" className="text-foreground text-xs font-mono">GITHUB URL</Label>
            <Input
              id="github_url"
              placeholder="https://github.com/username"
              value={formData.github_url}
              onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
              className="bg-background border-border text-foreground text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="instagram_url" className="text-foreground text-xs font-mono">INSTAGRAM URL</Label>
            <Input
              id="instagram_url"
              placeholder="https://instagram.com/username"
              value={formData.instagram_url}
              onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
              className="bg-background border-border text-foreground text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="twitter_url" className="text-foreground text-xs font-mono">TWITTER / X URL</Label>
            <Input
              id="twitter_url"
              placeholder="https://x.com/username"
              value={formData.twitter_url}
              onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
              className="bg-background border-border text-foreground text-sm"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="mt-4 pt-3 border-t border-border flex justify-between sm:justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => saveMutation.mutate(formData)}
          className="bg-bca-red hover:bg-bca-red/90 text-white"
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Save Member
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

// Projects Manager Component
const ProjectsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProject(null)} className="hidden">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <ProjectDialog
            project={editingProject}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingProject(null);
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
                      <span>{project.category || 'Uncategorized'}</span>
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
                      onClick={() => toggleApproveMutation.mutate({ id: project.id, approved: !!project.approved })}
                    >
                      {project.approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingProject(project);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
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

// Project Dialog Component
const ProjectDialog = ({ project, onClose }: { project: any; onClose: () => void }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    full_description: project?.full_description || '',
    category: project?.category || '',
    built_by: project?.built_by || '',
    thumbnail_url: project?.thumbnail_url || '',
    github_url: project?.github_url || '',
    live_demo_url: project?.live_demo_url || '',
    tech_stack: project?.tech_stack ? project.tech_stack.join(', ') : '',
  });

  useEffect(() => {
    setFormData({
      name: project?.name || '',
      description: project?.description || '',
      full_description: project?.full_description || '',
      category: project?.category || '',
      built_by: project?.built_by || '',
      thumbnail_url: project?.thumbnail_url || '',
      github_url: project?.github_url || '',
      live_demo_url: project?.live_demo_url || '',
      tech_stack: project?.tech_stack ? project.tech_stack.join(', ') : '',
    });
  }, [project]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const projectData = {
        ...data,
        tech_stack: data.tech_stack.split(',').map((t: string) => t.trim()).filter(Boolean),
      };

      if (project) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Success', description: 'Project updated successfully' });
      onClose();
    },
    onError: (error: any) => {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save project',
        variant: 'destructive'
      });
    },
  });

  return (
    <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle className="text-foreground">Edit Project</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 overflow-y-auto flex-1 pr-2">
        <div>
          <Label htmlFor="name" className="text-foreground">Project Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-foreground">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web App">Web App</SelectItem>
              <SelectItem value="Mobile App">Mobile App</SelectItem>
              <SelectItem value="Desktop App">Desktop App</SelectItem>
              <SelectItem value="Design / UI/UX">Design / UI/UX</SelectItem>
              <SelectItem value="AI / ML">AI / ML</SelectItem>
              <SelectItem value="Hardware / IoT">Hardware / IoT</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="built_by" className="text-foreground">Built By</Label>
          <Input
            id="built_by"
            value={formData.built_by}
            onChange={(e) => setFormData({ ...formData, built_by: e.target.value })}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="description" className="text-foreground">Short Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
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