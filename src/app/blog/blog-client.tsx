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

interface BlogClientProps {
  articles: ArticleWithSlug[];
  years: string[];
}

export default function BlogClient({ articles, years }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState<ArticleWithSlug[]>(articles);

  const debouncedTrack = useMemo(
    () =>
      debounce((query: string) => {
        if (query.trim()) {
          track("blog-search", { term: query });
        }
      }, 600),
    []
  );

  useEffect(() => {
    return () => {
      debouncedTrack.cancel();
    };
  }, [debouncedTrack]);

  useEffect(() => {
    let filtered = [...articles];

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
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

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedYear]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedTrack(value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedYear("all");
    debouncedTrack.cancel();
  };

  const hasActiveFilters = searchTerm.trim().length > 0 || selectedYear !== "all";

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <header className="space-y-3 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Blog</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
              Modern Coding research & notes
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Filter the archive in seconds - no fluff, just the posts.
            </p>
          </header>

          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search titles or descriptions"
                className="h-10 w-full rounded-xl pl-9 text-sm"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="h-10 w-32 rounded-xl border-slate-200 bg-white text-left text-sm font-medium dark:border-slate-700 dark:bg-slate-900">
                  <SelectValue placeholder="All years" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900">
                  <SelectItem value="all">All years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-10 rounded-xl px-3 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            <span>Archive</span>
            <span>
              {filteredArticles.length} {filteredArticles.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Nothing here yet. Try another search or show all years.
              </p>
            </div>
          ) : (
            <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-10 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <ContentCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

