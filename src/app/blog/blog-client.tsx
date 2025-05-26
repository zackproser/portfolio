"use client"

import { useState, useEffect } from "react";
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
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<ArticleWithSlug[]>(articles);

  // Debounced tracking function for search analytics
  const debouncedTrack = debounce((query: string) => {
    if (query.trim()) {
      track('blog-search', { term: query });
    }
  }, 1200);

  useEffect(() => {
    let filtered = [...articles];

    // Sort articles by date in chronological order (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(term) ||
          article.description.toLowerCase().includes(term)
      );
    }

    if (selectedYear && selectedYear !== "All Years") {
      filtered = filtered.filter((article) => article.date.startsWith(selectedYear));
    }

    setFilteredArticles(filtered);
  }, [searchTerm, selectedYear, articles]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedTrack(value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedYear("");
  };

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            I write to learn, and publish to share
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            All of my technical tutorials, musings and developer rants
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectItem value="All Years">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" size="sm" onClick={resetFilters} className="text-slate-600 dark:text-slate-400">
              Reset Filters
            </Button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {filteredArticles.length} articles found
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">All Articles</h2>
            
            <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {filteredArticles.map((article) => (
                  <ContentCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

