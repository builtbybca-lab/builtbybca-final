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
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8 animate-fade-up">
          <h1 className="text-4xl font-bold text-gradient mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your website content</p>
        </div>

        <Tabs defaultValue="blog" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
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
                <div className="flex justify-between items-start">
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
                  <div className="flex gap-2">
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
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{post ? 'Edit' : 'Create'} Blog Post</DialogTitle>
        <DialogDescription>
          {post ? 'Update' : 'Add'} blog post details below
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={10}
          />
        </div>
        <div>
          <Label htmlFor="author_name">Author Name</Label>
          <Input
            id="author_name"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="image_url">Blog Image</Label>
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
          <Label htmlFor="published">Published</Label>
        </div>
      </div>
      <DialogFooter>
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
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{event ? 'Edit' : 'Create'} Event</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="date">Date & Time</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="event_type">Event Type</Label>
          <Input
            id="event_type"
            value={formData.event_type}
            onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="image_url">Event Image</Label>
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            bucket="event-images"
          />
        </div>
        <div>
          <Label htmlFor="gallery_images">Event Gallery Images</Label>
          <MultiImageUpload
            value={formData.gallery_images}
            onChange={(urls) => setFormData({ ...formData, gallery_images: urls })}
            bucket="event-images"
            maxImages={20}
          />
        </div>
        <div>
          <Label htmlFor="registration_link">Registration Link</Label>
          <Input
            id="registration_link"
            value={formData.registration_link}
            onChange={(e) => setFormData({ ...formData, registration_link: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
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
  });

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
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{member ? 'Edit' : 'Add'} Team Member</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="image_url">Profile Picture</Label>
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            bucket="team-images"
          />
        </div>
        <div>
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            value={formData.linkedin_url}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <DialogFooter>
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
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label>Avatar Image (Optional)</Label>
          <ImageUpload
            value={formData.avatar_url}
            onChange={(url) => setFormData({ ...formData, avatar_url: url })}
            bucket="team-images"
          />
        </div>
        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
          />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Testimonial
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default Admin;