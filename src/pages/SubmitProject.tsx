import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { MultiImageUpload } from "@/components/ui/MultiImageUpload";

const SubmitProject = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    full_description: "",
    built_by: "",
    thumbnail_url: "",
    github_url: "",
    live_demo_url: "",
    tags: "",
    category: "",
    tech_stack: "",
    screenshots: [] as string[],
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/submit-project");
    }
  }, [loading, user, navigate]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (
        !formData.name ||
        !formData.description ||
        !formData.full_description ||
        !formData.built_by ||
        !formData.thumbnail_url ||
        !formData.category
      ) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from("projects").insert({
        name: formData.name,
        description: formData.description,
        full_description: formData.full_description,
        built_by: formData.built_by,
        thumbnail_url: formData.thumbnail_url,
        github_url: formData.github_url || null,
        live_demo_url: formData.live_demo_url || null,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        tech_stack: formData.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
        screenshots: formData.screenshots,
        category: formData.category,
        user_id: user.id,
        approved: false,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your project has been submitted for review. Admins will review it shortly.",
      });

      navigate("/projects");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit project",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-24 sm:pt-32 pb-16 px-3.5 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-2 sm:mb-3 tracking-tight">
              Submit Your <span className="text-bca-red">Project</span>
            </h1>
            <p className="text-muted-foreground text-xs sm:text-base max-w-xl mx-auto">
              Share your work with the BCA community. Projects are reviewed by council leads before going live.
            </p>
          </div>

          <div className="bg-card/60 backdrop-blur-md rounded-2xl border border-border/80 p-5 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-foreground text-xs sm:text-sm font-medium">
                  Project Name <span className="text-bca-red">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 bg-background border-border text-foreground h-11 text-xs sm:text-sm"
                  placeholder="My Awesome Project"
                  required
                />
              </div>

              <div>
                <Label htmlFor="built_by" className="text-foreground text-xs sm:text-sm font-medium">
                  Built By <span className="text-bca-red">*</span>
                </Label>
                <Input
                  id="built_by"
                  value={formData.built_by}
                  onChange={(e) => setFormData({ ...formData, built_by: e.target.value })}
                  className="mt-1.5 bg-background border-border text-foreground h-11 text-xs sm:text-sm"
                  placeholder="Your Name or Team Name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-foreground text-xs sm:text-sm font-medium">
                  Category <span className="text-bca-red">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1.5 bg-background border-border text-foreground h-11 text-xs sm:text-sm">
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
                <Label htmlFor="description" className="text-foreground text-xs sm:text-sm font-medium">
                  Short Description <span className="text-bca-red">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1.5 bg-background border-border text-foreground text-xs sm:text-sm resize-none"
                  placeholder="A brief description (1-2 sentences)"
                  rows={2}
                  required
                />
              </div>

              <div>
                <Label htmlFor="full_description" className="text-foreground text-xs sm:text-sm font-medium">
                  Full Description <span className="text-bca-red">*</span>
                </Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="mt-1.5 bg-background border-border text-foreground text-xs sm:text-sm resize-y"
                  placeholder="Detailed description of your project, features, and implementation"
                  rows={5}
                  required
                />
              </div>

              <div>
                <Label className="text-foreground text-xs sm:text-sm font-medium">
                  Project Thumbnail <span className="text-bca-red">*</span>
                </Label>
                <div className="mt-1.5">
                  <ImageUpload
                    value={formData.thumbnail_url}
                    onChange={(url) => setFormData({ ...formData, thumbnail_url: url })}
                    bucket="project-images"
                  />
                </div>
              </div>

              <div>
                <Label className="text-foreground text-xs sm:text-sm font-medium">
                  Project Screenshots (Optional)
                </Label>
                <div className="mt-1.5">
                  <MultiImageUpload
                    value={formData.screenshots}
                    onChange={(urls) => setFormData({ ...formData, screenshots: urls })}
                    bucket="project-images"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="github_url" className="text-foreground text-xs sm:text-sm font-medium">
                    GitHub URL (Optional)
                  </Label>
                  <Input
                    id="github_url"
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="mt-1.5 bg-background border-border text-foreground h-11 text-xs sm:text-sm"
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div>
                  <Label htmlFor="live_demo_url" className="text-foreground text-xs sm:text-sm font-medium">
                    Live Demo URL (Optional)
                  </Label>
                  <Input
                    id="live_demo_url"
                    type="url"
                    value={formData.live_demo_url}
                    onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                    className="mt-1.5 bg-background border-border text-foreground h-11 text-xs sm:text-sm"
                    placeholder="https://myproject.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tech_stack" className="text-foreground text-xs sm:text-sm font-medium">
                    Tech Stack (comma-separated)
                  </Label>
                  <Input
                    id="tech_stack"
                    value={formData.tech_stack}
                    onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                    className="mt-1.5 bg-background border-border text-foreground h-11 text-xs sm:text-sm"
                    placeholder="React, Node.js, Tailwind, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-foreground text-xs sm:text-sm font-medium">
                    Tags (comma-separated)
                  </Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="mt-1.5 bg-background border-border text-foreground h-11 text-xs sm:text-sm"
                    placeholder="Web, Mobile, AI, etc."
                  />
                </div>
              </div>

              <div className="bg-secondary/40 border border-border/60 rounded-xl p-3.5 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Review Notice:</span> Projects are reviewed by council leads before appearing publicly on the Projects Showcase.
              </div>

              <Button
                type="submit"
                className="w-full bg-[#7a0000] hover:bg-[#6a0000] text-primary-foreground h-11 text-xs sm:text-sm font-medium shadow-md"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting Project...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Project for Review
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

export default SubmitProject;
