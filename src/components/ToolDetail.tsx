'use client';

import { Tool } from '@/lib/decision-engine/types';
import { scoringEngine } from '@/lib/decision-engine/scoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Info, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  Code, 
  Users, 
  BookOpen, 
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Copy,
  Download
} from 'lucide-react';
import Link from 'next/link';

interface ToolDetailProps {
  tool: Tool;
}

export function ToolDetail({ tool }: ToolDetailProps) {
  const scores = scoringEngine.calculateScores(tool);

  return (
    <div className="space-y-8">
      {/* Quick-scan Hero */}
      <Card className="border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Starting Price</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {getStartingPrice(tool)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Context</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {getContextInfo(tool)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">SDKs</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {getSdkCount(tool)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Data Retention</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {getDataRetention(tool)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Tradeoffs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getStrengths(tool).map((strength, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Tradeoffs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTradeoffs(tool).map((tradeoff, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{tradeoff}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Tokens (per month)
              </label>
              <input
                type="number"
                defaultValue="1000000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Tokens (per month)
              </label>
              <input
                type="number"
                defaultValue="200000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Monthly Cost
              </label>
              <div className="text-2xl font-bold text-blue-600">
                ${calculateMonthlyCost(tool, 1000000, 200000).toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Surface */}
      <Card>
        <CardHeader>
          <CardTitle>Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sdks" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sdks">SDKs</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="collections">Collections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sdks" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Official SDKs</h4>
                  <div className="flex flex-wrap gap-2">
                    {getOfficialSdks(tool).map((sdk, index) => (
                      <Badge key={index} variant="default" className="flex items-center gap-1">
                        {sdk}
                        <ExternalLink className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                </div>
                {getCommunitySdks(tool).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Community SDKs</h4>
                    <div className="flex flex-wrap gap-2">
                      {getCommunitySdks(tool).map((sdk, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {sdk}
                          <ExternalLink className="h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="examples" className="mt-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Python Quickstart</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <pre className="text-sm text-gray-700 overflow-x-auto">
{getQuickstartExample(tool)}
                  </pre>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="collections" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium">Postman Collection</h4>
                    <p className="text-sm text-gray-600">Complete API collection with examples</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reliability Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Reliability Signals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Status History</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">99.9% uptime (30d)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">0 incidents (7d)</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Release Cadence</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Every 2 weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Stable API</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">API Deprecations</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">No recent deprecations</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">2 breaking changes (30d)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidence List */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Last Verified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getEvidenceSources(tool).map((source, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{source.domain}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{source.lastVerified}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={source.status === 'verified' ? 'default' : 'secondary'}>
                      {source.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function getStartingPrice(tool: Tool): string {
  switch (tool.kind) {
    case 'llm_api':
      const cheapestModel = tool.models.reduce((cheapest, model) => {
        const totalCost = model.input_price_per_1k + model.output_price_per_1k;
        const cheapestCost = cheapest.input_price_per_1k + cheapest.output_price_per_1k;
        return totalCost < cheapestCost ? model : cheapest;
      });
      return `$${cheapestModel.input_price_per_1k.toFixed(4)}/1K`;
    case 'framework':
      return 'Free (Open Source)';
    case 'vector_db':
      return tool.pricing.free_tier ? 'Free tier' : tool.pricing.starting_price || 'Contact';
    default:
      return 'Contact';
  }
}

function getContextInfo(tool: Tool): string {
  switch (tool.kind) {
    case 'llm_api':
      const maxContext = Math.max(...tool.models.map(m => m.context_window_tokens));
      return `${(maxContext / 1000).toFixed(0)}K tokens`;
    case 'framework':
      return 'N/A';
    case 'vector_db':
      return 'Vector storage';
    default:
      return 'N/A';
  }
}

function getSdkCount(tool: Tool): string {
  switch (tool.kind) {
    case 'llm_api':
      return `${tool.sdks.official.length} official`;
    case 'framework':
      return 'Multiple';
    case 'vector_db':
      return 'Multiple';
    default:
      return 'N/A';
  }
}

function getDataRetention(tool: Tool): string {
  switch (tool.kind) {
    case 'llm_api':
      return tool.data_retention.window_days === null ? 'None' : `${tool.data_retention.window_days} days`;
    case 'framework':
      return 'N/A';
    case 'vector_db':
      return 'Configurable';
    default:
      return 'N/A';
  }
}

function getStrengths(tool: Tool): string[] {
  const strengths: string[] = [];
  
  if (tool.kind === 'llm_api') {
    const maxContext = Math.max(...tool.models.map(m => m.context_window_tokens));
    if (maxContext >= 200000) {
      strengths.push('Large context window for complex tasks');
    }
    if (tool.sdks.official.length >= 2) {
      strengths.push('Excellent SDK coverage');
    }
    if (tool.data_retention.window_days === null) {
      strengths.push('No data retention for privacy');
    }
  }
  
  if (tool.kind === 'framework') {
    if (tool.licensing.toLowerCase().includes('mit')) {
      strengths.push('Permissive MIT license');
    }
    if (tool.community.github_stars >= 10000) {
      strengths.push('Large, active community');
    }
  }
  
  return strengths.length > 0 ? strengths : ['Well-established tool'];
}

function getTradeoffs(tool: Tool): string[] {
  const tradeoffs: string[] = [];
  
  if (tool.kind === 'llm_api') {
    const cheapestModel = tool.models.reduce((cheapest, model) => {
      const totalCost = model.input_price_per_1k + model.output_price_per_1k;
      const cheapestCost = cheapest.input_price_per_1k + cheapest.output_price_per_1k;
      return totalCost < cheapestCost ? model : cheapest;
    });
    
    if (cheapestModel.input_price_per_1k > 0.01) {
      tradeoffs.push('Higher cost per token than some alternatives');
    }
  }
  
  if (tool.kind === 'framework') {
    if (tool.reliability.breaking_changes_30d > 0) {
      tradeoffs.push('Recent breaking changes may require updates');
    }
  }
  
  return tradeoffs.length > 0 ? tradeoffs : ['No significant tradeoffs identified'];
}

function getOfficialSdks(tool: Tool): string[] {
  switch (tool.kind) {
    case 'llm_api':
      return tool.sdks.official;
    case 'framework':
      return ['Python', 'JavaScript', 'TypeScript'];
    case 'vector_db':
      return ['Python', 'JavaScript', 'Go'];
    default:
      return [];
  }
}

function getCommunitySdks(tool: Tool): string[] {
  switch (tool.kind) {
    case 'llm_api':
      return tool.sdks.community;
    case 'framework':
      return ['Rust', 'Java', 'C#'];
    case 'vector_db':
      return ['Rust', 'Java', 'PHP'];
    default:
      return [];
  }
}

function getQuickstartExample(tool: Tool): string {
  switch (tool.kind) {
    case 'llm_api':
      return `import anthropic

client = anthropic.Anthropic(
    api_key="your-api-key"
)

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.content[0].text)`;
    case 'framework':
      return `from langchain import LLMChain, PromptTemplate
from langchain.llms import OpenAI

llm = OpenAI(temperature=0.9)
prompt = PromptTemplate(
    input_variables=["product"],
    template="What is a good name for a company that makes {product}?",
)

chain = LLMChain(llm=llm, prompt=prompt)
print(chain.run("colorful socks"))`;
    case 'vector_db':
      return `import chromadb

client = chromadb.Client()
collection = client.create_collection("my_collection")

collection.add(
    documents=["This is a document", "This is another document"],
    metadatas=[{"source": "pdf1"}, {"source": "pdf2"}],
    ids=["id1", "id2"]
)

results = collection.query(
    query_texts=["This is a query document"],
    n_results=2
)`;
    default:
      return 'Example not available';
  }
}

function calculateMonthlyCost(tool: Tool, inputTokens: number, outputTokens: number): number {
  if (tool.kind === 'llm_api') {
    const cheapestModel = tool.models.reduce((cheapest, model) => {
      const totalCost = model.input_price_per_1k + model.output_price_per_1k;
      const cheapestCost = cheapest.input_price_per_1k + cheapest.output_price_per_1k;
      return totalCost < cheapestCost ? model : cheapest;
    });
    
    const inputCost = (inputTokens / 1000) * cheapestModel.input_price_per_1k;
    const outputCost = (outputTokens / 1000) * cheapestModel.output_price_per_1k;
    return inputCost + outputCost;
  }
  return 0;
}

function getEvidenceSources(tool: Tool): Array<{
  domain: string;
  lastVerified: string;
  status: 'verified' | 'stale' | 'unknown';
}> {
  const sources: Array<{
    domain: string;
    lastVerified: string;
    status: 'verified' | 'stale' | 'unknown';
  }> = [];
  
  if (tool.kind === 'llm_api') {
    tool.models.forEach(model => {
      model.sources.forEach(source => {
        const domain = new URL(source.url).hostname;
        const daysSinceUpdate = Math.floor((Date.now() - new Date(source.observed_at).getTime()) / (1000 * 60 * 60 * 24));
        sources.push({
          domain,
          lastVerified: `${daysSinceUpdate} days ago`,
          status: daysSinceUpdate > 30 ? 'stale' : 'verified'
        });
      });
    });
  }
  
  return sources;
}

