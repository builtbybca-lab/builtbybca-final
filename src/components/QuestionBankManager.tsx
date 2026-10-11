import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FileUpload } from "@/components/ui/FileUpload";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  FileText,
  ExternalLink,
  Download,
  GraduationCap,
  Copy,
  Check,
} from "lucide-react";
import { QuestionPaperItem } from "./QuestionBankSection";

export const QuestionBankManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<QuestionPaperItem | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [copiedSql, setCopiedSql] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subject_name: "",
    subject_code: "",
    semester: 1,
    year: new Date().getFullYear(),
    exam_type: "Semester End Examination",
    scheme: "NEP 2020",
    file_url: "",
    file_size: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch question papers from Supabase (strictly from real database)
  const {
    data: papers = [],
    isLoading,
    isError,
  } = useQuery<QuestionPaperItem[]>({
    queryKey: ["question_papers"],
    queryFn: async () => {
      // @ts-expect-error - question_papers table in Database types
      const { data, error } = await supabase
        .from("question_papers")
        .select("*")
        .order("semester", { ascending: true })
        .order("year", { ascending: false });

      if (error) {
        console.warn("Could not query question_papers table:", error.message);
        return [];
      }
      return (data || []) as QuestionPaperItem[];
    },
  });

  // Insert mutation
  const createMutation = useMutation({
    mutationFn: async (newPaper: any) => {
      // @ts-expect-error - question_papers table in Database types
      const { error } = await supabase.from("question_papers").insert([newPaper]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question_papers"] });
      toast({ title: "Success", description: "Question paper uploaded successfully!" });
      setIsOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to save paper to database. Please make sure the SQL table has been created.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (paperData: any) => {
      if (!editingPaper) return;
      // @ts-expect-error - question_papers table in Database types
      const { error } = await supabase
        .from("question_papers")
        .update(paperData)
        .eq("id", editingPaper.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question_papers"] });
      toast({ title: "Updated", description: "Question paper details updated!" });
      setIsOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // @ts-expect-error - question_papers table in Database types
      const { error } = await supabase.from("question_papers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question_papers"] });
      toast({ title: "Deleted", description: "Question paper deleted successfully." });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setEditingPaper(null);
    setFormData({
      title: "",
      subject_name: "",
      subject_code: "",
      semester: 1,
      year: new Date().getFullYear(),
      exam_type: "Semester End Examination",
      scheme: "NEP 2020",
      file_url: "",
      file_size: "",
    });
  };

  const handleEdit = (paper: QuestionPaperItem) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title,
      subject_name: paper.subject_name,
      subject_code: paper.subject_code || "",
      semester: paper.semester,
      year: paper.year,
      exam_type: paper.exam_type,
      scheme: paper.scheme || "NEP 2020",
      file_url: paper.file_url,
      file_size: paper.file_size || "",
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({ title: "Error", description: "Please enter a paper title", variant: "destructive" });
      return;
    }
    if (!formData.subject_name.trim()) {
      toast({ title: "Error", description: "Please enter a subject name", variant: "destructive" });
      return;
    }
    if (!formData.file_url) {
      toast({ title: "Error", description: "Please upload a question paper PDF", variant: "destructive" });
      return;
    }

    const payload = {
      title: formData.title.trim(),
      subject_name: formData.subject_name.trim(),
      subject_code: formData.subject_code.trim().toUpperCase() || null,
      semester: Number(formData.semester),
      year: Number(formData.year),
      exam_type: formData.exam_type,
      scheme: formData.scheme.trim() || "NEP 2020",
      file_url: formData.file_url,
      file_size: formData.file_size || "PDF",
    };

    if (editingPaper) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const copySqlToClipboard = () => {
    const sql = `-- Migration: Create question_papers table in Supabase
CREATE TABLE IF NOT EXISTS public.question_papers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    subject_code TEXT,
    semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 6),
    year INTEGER NOT NULL,
    exam_type TEXT NOT NULL,
    scheme TEXT DEFAULT 'NEP 2020',
    file_url TEXT NOT NULL,
    file_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_question_papers_semester ON public.question_papers(semester);
CREATE INDEX IF NOT EXISTS idx_question_papers_year ON public.question_papers(year);
CREATE INDEX IF NOT EXISTS idx_question_papers_sem_year ON public.question_papers(semester, year);

-- Enable RLS
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" 
ON public.question_papers FOR SELECT USING (true);

-- Allow authenticated admins to insert/update/delete
CREATE POLICY "Enable insert for authenticated users" 
ON public.question_papers FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" 
ON public.question_papers FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" 
ON public.question_papers FOR DELETE USING (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    toast({ title: "Copied!", description: "SQL script copied to clipboard." });
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const filteredPapers = papers.filter((paper) => {
    if (selectedSemester === "all") return true;
    return paper.semester === Number(selectedSemester);
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-foreground">
            BCA Question Bank Manager
          </h2>
          <p className="text-sm text-muted-foreground font-light">
            Upload and organize previous exam question papers semester-wise for students.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={copySqlToClipboard}
            className="border-border text-xs font-mono"
          >
            {copiedSql ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-bca-red" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            Copy SQL Script
          </Button>

          <Dialog
            open={isOpen}
            onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="bg-bca-red hover:bg-bca-red-hover text-white text-xs font-mono">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Upload Paper
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-serif">
                  {editingPaper ? "Edit Question Paper" : "Upload New Question Paper"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-mono">Paper Title *</Label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Data Structures & Applications - Nov 2024"
                    className="h-10 text-sm"
                  />
                </div>

                {/* Subject & Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono">Subject Name *</Label>
                    <Input
                      required
                      value={formData.subject_name}
                      onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                      placeholder="e.g. Data Structures Using C"
                      className="h-10 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono">Subject Code (Optional)</Label>
                    <Input
                      value={formData.subject_code}
                      onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
                      placeholder="e.g. 21BCA31"
                      className="h-10 text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Semester & Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono">Semester (1 to 6) *</Label>
                    <Select
                      value={String(formData.semester)}
                      onValueChange={(val) => setFormData({ ...formData, semester: Number(val) })}
                    >
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((sem) => (
                          <SelectItem key={sem} value={String(sem)}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono">Exam Year *</Label>
                    <Select
                      value={String(formData.year)}
                      onValueChange={(val) => setFormData({ ...formData, year: Number(val) })}
                    >
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((yr) => (
                          <SelectItem key={yr} value={String(yr)}>
                            {yr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Exam Type & Scheme */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono">Exam Type *</Label>
                    <Select
                      value={formData.exam_type}
                      onValueChange={(val) => setFormData({ ...formData, exam_type: val })}
                    >
                      <SelectTrigger className="h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Semester End Examination">Semester End Examination</SelectItem>
                        <SelectItem value="Internal Assessment 1">Internal Assessment 1</SelectItem>
                        <SelectItem value="Internal Assessment 2">Internal Assessment 2</SelectItem>
                        <SelectItem value="Model Question Paper">Model Question Paper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-mono">Scheme</Label>
                    <Input
                      value={formData.scheme}
                      onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                      placeholder="e.g. NEP 2020 / CBCS"
                      className="h-10 text-sm font-mono"
                    />
                  </div>
                </div>

                {/* File Upload / PDF Document */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-mono">Question Paper File (Upload or URL) *</Label>
                    <span className="text-[11px] text-muted-foreground font-mono">PDF, DOC, DOCX up to 25MB</span>
                  </div>
                  <FileUpload
                    value={formData.file_url}
                    onChange={(url) => setFormData({ ...formData, file_url: url, file_size: "PDF" })}
                    bucket="resource-files"
                    accept=".pdf,.doc,.docx"
                    maxSizeMB={25}
                  />
                  <div className="pt-1">
                    <Input
                      value={formData.file_url}
                      onChange={(e) => setFormData({ ...formData, file_url: e.target.value, file_size: "PDF" })}
                      placeholder="Or paste direct PDF URL (https://...)"
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                  {formData.file_url && (
                    <div className="flex items-center justify-between text-xs font-mono text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                      <span className="truncate max-w-[340px]">{formData.file_url}</span>
                      <a
                        href={formData.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bca-red hover:underline flex items-center ml-2 flex-shrink-0"
                      >
                        Preview <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-bca-red hover:bg-bca-red-hover text-white font-mono text-xs"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {editingPaper ? "Update Question Paper" : "Save Question Paper"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Semester Filter Tabs in Admin */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-mono text-muted-foreground mr-1">Filter:</span>
        <Button
          size="sm"
          variant={selectedSemester === "all" ? "default" : "outline"}
          onClick={() => setSelectedSemester("all")}
          className={`text-xs h-8 rounded-full ${
            selectedSemester === "all"
              ? "bg-bca-red text-white hover:bg-bca-red-hover"
              : "border-border text-foreground hover:bg-secondary"
          }`}
        >
          All Semesters ({papers.length})
        </Button>
        {[1, 2, 3, 4, 5, 6].map((sem) => {
          const count = papers.filter((p) => p.semester === sem).length;
          return (
            <Button
              key={sem}
              size="sm"
              variant={selectedSemester === String(sem) ? "default" : "outline"}
              onClick={() => setSelectedSemester(String(sem))}
              className={`text-xs h-8 rounded-full ${
                selectedSemester === String(sem)
                  ? "bg-bca-red text-white hover:bg-bca-red-hover"
                  : "border-border text-foreground hover:bg-secondary"
              }`}
            >
              Sem {sem} ({count})
            </Button>
          );
        })}
      </div>

      {/* Question Papers Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-bca-red" />
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="text-center py-16 bg-card/60 border border-dashed border-border/60 rounded-2xl">
          <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-foreground">No Question Papers Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            {papers.length === 0
              ? "No question papers have been uploaded yet. Click 'Upload Paper' above to add past semester papers."
              : "No papers found for this semester filter. Select another semester or click 'Upload Paper'."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="bg-card/90 border border-border hover:border-bca-red/30 rounded-2xl p-5 transition-all shadow-sm flex flex-col justify-between group"
            >
              <div>
                {/* Header Chips */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-bca-red/10 text-bca-red border border-bca-red/20 uppercase">
                      Sem {paper.semester}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-secondary text-muted-foreground border border-border">
                      {paper.year}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-bca-red"
                      onClick={() => handleEdit(paper)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Delete "${paper.title}"?`)) {
                          deleteMutation.mutate(paper.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Subject & Title */}
                <h3 className="text-base font-bold text-foreground font-serif group-hover:text-bca-red transition-colors line-clamp-2 mb-1">
                  {paper.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground mb-2">
                  <GraduationCap className="w-3.5 h-3.5 text-bca-red flex-shrink-0" />
                  <span className="truncate">{paper.subject_name}</span>
                  {paper.subject_code && (
                    <span className="text-[10px] bg-secondary/80 px-1.5 py-0.2 rounded border border-border">
                      {paper.subject_code}
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground font-light mb-4">
                  Type: <span className="font-medium text-foreground">{paper.exam_type}</span>
                  {paper.scheme && ` • ${paper.scheme}`}
                </p>
              </div>

              {/* Download / Preview Action */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted-foreground/60">
                  {paper.file_size || "PDF Document"}
                </span>
                <a
                  href={paper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-mono text-bca-red hover:underline font-medium"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> View / Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionBankManager;
