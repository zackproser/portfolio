"use client"

import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
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

const ALL_YEARS_OPTION = "All Years";

export default function BlogClient({ articles, years }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS_OPTION);
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

    if (selectedYear !== ALL_YEARS_OPTION) {
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
    setSelectedYear(ALL_YEARS_OPTION);
    debouncedTrack.cancel();
  };

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-burnt-400 dark:text-amber-400 mb-4">
            I write to learn, and publish to share
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            All of my technical tutorials, musings and developer rants
          </p>
        </div>

        {/* Featured: AI Tools for Small Business */}
        <Link
          href="/best-ai-tools"
          className="block mb-8 max-w-4xl mx-auto group"
        >
          <div className="bg-gradient-to-r from-amber-500/10 via-burnt-400/15 to-amber-500/10 dark:from-amber-900/30 dark:via-amber-800/30 dark:to-amber-900/30 rounded-xl p-4 border border-amber-500/30 dark:border-amber-600/40 hover:border-amber-500/50 dark:hover:border-amber-500/60 transition-all hover:shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-500/20 dark:bg-amber-500/30 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-charcoal-50 dark:text-white">
                  Playing catch-up on AI?
                </p>
                <p className="text-sm text-parchment-600 dark:text-slate-400">
                  Skip the research—here are the 4 AI tools I actually use to run my business
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

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
                <SelectValue placeholder="Year">
                  {selectedYear}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectItem value={ALL_YEARS_OPTION}>{ALL_YEARS_OPTION}</SelectItem>
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
              {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"} found
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

