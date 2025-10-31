"use client"

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentCard } from "@/components/ContentCard";
import { track } from "@vercel/analytics";
import debounce from "lodash.debounce";
import type { ArticleWithSlug } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BlogClientProps {
  articles: ArticleWithSlug[];
  years: string[];
}

const TYPE_FILTERS: { value: "all" | ArticleWithSlug["type"]; label: string; description: string }[] = [
  { value: "all", label: "All formats", description: "Every piece I've published" },
  { value: "blog", label: "Articles", description: "Deep dives & long-form writing" },
  { value: "video", label: "Videos", description: "Screencasts and walkthroughs" },
  { value: "demo", label: "Demos", description: "Experiments & interactive builds" },
];

const SORT_LABELS: Record<"asc" | "desc", string> = {
  desc: "Newest first",
  asc: "Oldest first",
};

const TYPE_LABELS: Record<ArticleWithSlug["type"], string> = {
  blog: "Articles",
  video: "Videos",
  demo: "Demos",
};

export default function BlogClient({ articles, years }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedType, setSelectedType] = useState<"all" | ArticleWithSlug["type"]>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filteredArticles, setFilteredArticles] = useState<ArticleWithSlug[]>(articles);

  // Debounced tracking function for search analytics
  const debouncedTrack = useMemo(
    () =>
      debounce((query: string) => {
        if (query.trim()) {
          track("blog-search", { term: query });
        }
      }, 900),
    []
  );

  useEffect(() => {
    return () => {
      debouncedTrack.cancel();
    };
  }, [debouncedTrack]);

  const typeCounts = useMemo(
    () =>
      articles.reduce(
        (acc, article) => {
          acc[article.type] = (acc[article.type] ?? 0) + 1;
          return acc;
        },
        { blog: 0, video: 0, demo: 0 } as Record<ArticleWithSlug["type"], number>
      ),
    [articles]
  );

  useEffect(() => {
    let filtered = [...articles];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(term) ||
          article.description.toLowerCase().includes(term)
      );
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (article) => new Date(article.date).getFullYear().toString() === selectedYear
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((article) => article.type === selectedType);
    }

    filtered.sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortOrder === "desc" ? -diff : diff;
    });

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedYear, selectedType, sortOrder]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedTrack(value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedYear("all");
    setSelectedType("all");
    setSortOrder("desc");
    debouncedTrack.cancel();
  };

  const hasActiveFilters =
    Boolean(searchTerm.trim()) || selectedYear !== "all" || selectedType !== "all" || sortOrder !== "desc";

  return (
    <div className="w-full">
      <section className="relative overflow-hidden border-b border-slate-200/60 bg-slate-950 text-white dark:border-slate-800/60 dark:bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%)]" />
          <div className="absolute -left-32 top-16 h-64 w-64 rounded-full bg-gradient-to-br from-sky-400/40 via-purple-400/30 to-transparent blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-400/30 via-teal-400/20 to-transparent blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
              Modern Coding Research Journal
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              I write to learn, and publish to share
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Search across deep dives, hands-on builds, and candid postmortems from a staff AI engineer in the field.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
                <Input
                  placeholder="Find a topic, tool, or problem..."
                  className="h-14 rounded-2xl border-0 bg-white/90 pl-12 text-base font-medium text-slate-900 shadow-lg placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-900/30 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-14 rounded-2xl border border-white/15 bg-white/10 text-left text-sm font-semibold text-white/90 shadow-inner transition hover:border-white/30 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="border border-white/10 bg-slate-950 text-white">
                    <SelectItem value="all">All years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                  <SelectTrigger className="h-14 rounded-2xl border border-white/15 bg-white/10 text-left text-sm font-semibold text-white/90 shadow-inner transition hover:border-white/30 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent className="border border-white/10 bg-slate-950 text-white">
                    <SelectItem value="desc">Newest first</SelectItem>
                    <SelectItem value="asc">Oldest first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {TYPE_FILTERS.map((filter) => {
                const isActive = selectedType === filter.value;

                return (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setSelectedType(filter.value)}
                    className={cn(
                      "group rounded-2xl border p-4 text-left transition-all",
                      isActive
                        ? "border-white bg-white text-slate-900 shadow-lg"
                        : "border-white/10 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10"
                    )}
                  >
                    <span className={cn("text-sm font-semibold tracking-tight", isActive ? "text-slate-900" : "text-white")}>{filter.label}</span>
                    <span className={cn("mt-1 text-xs text-white/70 transition group-hover:text-white/90", isActive ? "text-slate-600" : undefined)}>
                      {filter.description}
                    </span>
                    {filter.value !== "all" ? (
                      <span className={cn(
                        "mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-white/10 text-white/75"
                      )}>
                        {typeCounts[filter.value] ?? 0} in library
                      </span>
                    ) : (
                      <span className="mt-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                        {articles.length} total entries
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-white/60">
              {hasActiveFilters ? <span>Active filters</span> : <span>Everything is on the table</span>}
              {searchTerm && (
                <Badge variant="outline" className="border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Search | {searchTerm}
                </Badge>
              )}
              {selectedYear !== "all" && (
                <Badge variant="outline" className="border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Year | {selectedYear}
                </Badge>
              )}
              {selectedType !== "all" && (
                <Badge variant="outline" className="border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Format | {TYPE_LABELS[selectedType]}
                </Badge>
              )}
              {sortOrder !== "desc" && (
                <Badge variant="outline" className="border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                  Sort | {SORT_LABELS[sortOrder]}
                </Badge>
              )}
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-auto text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:text-white"
                >
                  Clear all
                </button>
              ) : (
                <Badge variant="outline" className="ml-auto border-white/20 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                  {articles.length} entries catalogued
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="space-y-8">
          <section>
            <div className="mb-10 flex flex-col items-center gap-2 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Field notes, ideas, and build logs
              </h2>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                {filteredArticles.length} {filteredArticles.length === 1 ? "entry" : "entries"} match your filters
              </p>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="mx-auto max-w-3xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Nothing matched your filters yet
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Try widening your search, resetting the year, or browsing another format.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="mt-6 border border-slate-300 bg-white px-5 py-2 text-slate-700 hover:border-slate-400 hover:bg-white/70 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                >
                  Reset filters
                </Button>
              </div>
            ) : (
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <ContentCard key={article.slug} article={article} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

