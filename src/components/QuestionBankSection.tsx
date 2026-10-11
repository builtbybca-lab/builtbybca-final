import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react";

export interface QuestionPaperItem {
  id: string;
  title: string;
  subject_name: string;
  subject_code: string;
  semester: number;
  year: number;
  exam_type: string;
  scheme?: string;
  file_url: string;
  file_size?: string;
  created_at?: string;
  updated_at?: string;
}

export const QuestionBankSection: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedExamType, setSelectedExamType] = useState<string>("all");

  // Fetch real papers from Supabase (no dummy data)
  const { data: papers = [], isLoading } = useQuery<QuestionPaperItem[]>({
    queryKey: ["question_papers"],
    queryFn: async () => {
      try {
        // @ts-expect-error - question_papers table in Database types
        const { data, error } = await supabase
          .from("question_papers")
          .select("*")
          .order("semester", { ascending: true })
          .order("year", { ascending: false });

        if (error || !data) {
          return [];
        }
        return data as QuestionPaperItem[];
      } catch {
        return [];
      }
    },
  });

  // Extract unique years for filter dropdown
  const availableYears = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.year))).sort((a, b) => b - a);
  }, [papers]);

  // Filter papers
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      if (selectedSemester !== "all" && paper.semester !== selectedSemester) {
        return false;
      }
      if (selectedYear !== "all" && paper.year.toString() !== selectedYear) {
        return false;
      }
      if (selectedExamType !== "all" && paper.exam_type !== selectedExamType) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = paper.title.toLowerCase().includes(query);
        const matchesSubject = paper.subject_name.toLowerCase().includes(query);
        const matchesCode = paper.subject_code?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubject && !matchesCode) {
          return false;
        }
      }
      return true;
    });
  }, [papers, selectedSemester, selectedYear, selectedExamType, searchQuery]);

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Question Bank
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Previous semester examination papers for BCA students
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {filteredPapers.length} {filteredPapers.length === 1 ? "paper" : "papers"}
        </span>
      </div>

      {/* Semester Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-5 border-b border-border/40">
        <button
          onClick={() => setSelectedSemester("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            selectedSemester === "all"
              ? "bg-foreground text-background font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          All Semesters
        </button>

        {[1, 2, 3, 4, 5, 6].map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedSemester === sem
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            Sem {sem}
          </button>
        ))}
      </div>

      {/* Search & Secondary Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject name, code (e.g. 21BCA31)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-background text-sm"
          />
        </div>

        <div className="w-full sm:w-44">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-10 text-sm bg-background">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {availableYears.map((yr) => (
                <SelectItem key={yr} value={yr.toString()}>
                  {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-52">
          <Select value={selectedExamType} onValueChange={setSelectedExamType}>
            <SelectTrigger className="h-10 text-sm bg-background">
              <SelectValue placeholder="All Exam Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exam Types</SelectItem>
              <SelectItem value="Semester End Examination">Semester End Exam (SEE)</SelectItem>
              <SelectItem value="Internal Assessment 1">Internal Assessment 1</SelectItem>
              <SelectItem value="Internal Assessment 2">Internal Assessment 2</SelectItem>
              <SelectItem value="Model Question Paper">Model Question Paper</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Question Papers List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border/60 rounded-xl text-muted-foreground text-sm">
          {papers.length === 0
            ? "No question papers uploaded yet."
            : "No question papers found for the selected criteria."}
        </div>
      ) : (
        <div className="border border-border/50 rounded-xl divide-y divide-border/40 overflow-hidden bg-card">
          {filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/20 transition-colors"
            >
              {/* Paper Details */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-secondary/60 text-muted-foreground shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {paper.subject_name}
                    </span>
                    {paper.subject_code && (
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                        {paper.subject_code}
                      </span>
                    )}
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground font-medium">
                      Sem {paper.semester}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {paper.title}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground/80 mt-1.5">
                    <span>{paper.exam_type}</span>
                    <span>•</span>
                    <span>{paper.year}</span>
                    {paper.scheme && (
                      <>
                        <span>•</span>
                        <span>{paper.scheme}</span>
                      </>
                    )}
                    {paper.file_size && (
                      <>
                        <span>•</span>
                        <span>{paper.file_size}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <a
                  href={paper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View
                  </Button>
                </a>
                <a
                  href={paper.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`${paper.subject_code || 'Paper'}_${paper.year}.pdf`}
                  className="inline-flex"
                >
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
