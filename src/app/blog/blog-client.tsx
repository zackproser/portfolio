"use client"

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { ArticleWithSlug } from "@/types";

interface BlogClientProps {
  articles: ArticleWithSlug[];
  years: string[];
  allTags: string[];
}

export default function BlogClient({ articles, years, allTags }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<ArticleWithSlug[]>(articles);
  const [view, setView] = useState("grid");

  useEffect(() => {
    let filtered = articles;

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

    if (selectedTag && selectedTag !== "All Tags") {
      filtered = filtered.filter((article) => Array.isArray(article.tags) && article.tags.includes(selectedTag));
    }

    setFilteredArticles(filtered);
  }, [searchTerm, selectedYear, selectedTag, articles]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedYear("");
    setSelectedTag("");
  };

  return (
    <div className="w-full">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Blog</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            My thoughts on engineering, AI, and modern development.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectItem value="All Tags">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
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
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">All Articles</h2>

            <div className="flex items-center justify-end gap-2 mb-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">View:</span>
              <Tabs value={view} onValueChange={setView} className="w-full">
                <div className="flex justify-end">
                  <TabsList className="grid w-[160px] grid-cols-2">
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="grid" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article) => (
                      <Card key={article.slug} className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col bg-white dark:bg-slate-800">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                              {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold hover:text-primary transition-colors">
                            <a href={article.slug} className="flex items-center gap-1">
                              {article.title}
                            </a>
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-2 mt-1">
                            {article.description}
                          </CardDescription>
                        </CardHeader>
                        {article.tags && article.tags.length > 0 && (
                          <CardContent className="pb-2 flex-grow">
                            <div className="flex flex-wrap gap-1 mt-2">
                              {article.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="mt-4">
                  <div className="space-y-3">
                    {filteredArticles.map((article) => (
                      <div key={article.slug} className="flex flex-col gap-2 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow">
                        <h3 className="text-lg font-semibold mb-1">
                          <a href={article.slug} className="hover:text-primary transition-colors">
                            {article.title}
                          </a>
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {article.tags && article.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

