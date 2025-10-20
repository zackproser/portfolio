import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/lib/decision-engine/types";
import { ComparePicker } from "@/components/ComparePicker";

interface FeaturedComparison {
  id: string;
  title: string;
  description: string;
  tools: string[];
  href: string;
}

export function DecisionIndex({ tools, featuredComparisons }: { tools: Tool[]; featuredComparisons: FeaturedComparison[] }) {
  return (
    <div className="space-y-10">
      {/* Quick compare picker */}
      <ComparePicker tools={tools} />
      {/* Featured comparisons */}
      {featuredComparisons?.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Featured comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredComparisons.map((fc) => (
              <Link key={fc.id} href={fc.href as any} className="block">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{fc.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{fc.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {fc.tools.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All tools */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Browse tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Card key={tool.id} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  {tool.kind === "llm_api" && (
                    <>
                      <div>
                        <span className="text-gray-500">Models:</span>{" "}
                        <span className="font-medium">{tool.models.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Context window:</span>{" "}
                        <span className="font-medium">{(tool.models[0]?.context_window_tokens || 0).toLocaleString()} tokens</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <Link
                    href={tools.length > 1 ? `/comparisons/${tools[0].id}/vs/${tool.id}` as any : "#"}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Compare →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}


