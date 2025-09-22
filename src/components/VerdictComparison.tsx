'use client';

import { useState } from 'react';
import { Tool, Persona, ComparisonResult } from '@/lib/decision-engine/types';
import { verdictGenerator } from '@/lib/decision-engine/verdict';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info, TrendingUp, TrendingDown, Minus, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface VerdictComparisonProps {
  tool1: Tool;
  tool2: Tool;
  initialPersona?: Persona;
}

export function VerdictComparison({ tool1, tool2, initialPersona = 'startup' }: VerdictComparisonProps) {
  const [persona, setPersona] = useState<Persona>(initialPersona);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // Generate comparison result
  const result = comparisonResult || verdictGenerator.generateVerdict(tool1, tool2, persona);

  const handlePersonaChange = (newPersona: Persona) => {
    setPersona(newPersona);
    const newResult = verdictGenerator.generateVerdict(tool1, tool2, newPersona);
    setComparisonResult(newResult);
  };

  return (
    <div className="space-y-8">
      {/* Verdict Banner */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {result.verdict.winner} edges out {result.verdict.winner === tool1.name ? tool2.name : tool1.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge 
                  variant={result.verdict.confidence === 'strong' ? 'default' : result.verdict.confidence === 'moderate' ? 'secondary' : 'outline'}
                  className="text-sm"
                >
                  {result.verdict.confidence} confidence
                </Badge>
                <span className="text-sm text-gray-600">
                  {result.verdict.whatThisMeans}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {result.verdict.winner === tool1.name ? result.tool1.weightedScore : result.tool2.weightedScore}
              </div>
              <div className="text-sm text-gray-500">Weighted Score</div>
            </div>
          </div>

          {/* Reasons */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">Why {result.verdict.winner} wins:</h3>
            <ul className="space-y-1">
              {result.verdict.reasons.map((reason, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* What would change the verdict */}
          <details className="mt-4">
            <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
              What would change the verdict?
            </summary>
            <div className="mt-2 space-y-1">
              {result.verdict.whatWouldChange.map((scenario, index) => (
                <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  {scenario}
                </div>
              ))}
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Persona Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['startup', 'enterprise', 'learning'] as Persona[]).map((p) => {
          const isActive = p === persona;
          const tempResult = verdictGenerator.generateVerdict(tool1, tool2, p);
          const isWinner = tempResult.verdict.winner === result.verdict.winner;
          
          return (
            <Card 
              key={p}
              className={`cursor-pointer transition-all ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'}`}
              onClick={() => handlePersonaChange(p)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold capitalize">{p}</h3>
                  <Badge variant={isWinner ? 'default' : 'outline'} className="text-xs">
                    {tempResult.verdict.winner}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {tempResult.verdict.confidence} confidence
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {tempResult.verdict.reasons[0]}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Score Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Score Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">{tool1.name}</h3>
              <div className="space-y-3">
                {Object.entries(result.tool1.scores).map(([axis, score]) => (
                  <div key={axis} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{axis}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(score.value / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{score.value}</span>
                      <Popover>
                        <PopoverTrigger>
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <div className="font-medium">Confidence: {score.confidence}</div>
                            {score.reasoning && (
                              <div className="text-sm text-gray-600">{score.reasoning}</div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{tool2.name}</h3>
              <div className="space-y-3">
                {Object.entries(result.tool2.scores).map(([axis, score]) => (
                  <div key={axis} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{axis}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${(score.value / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{score.value}</span>
                      <Popover>
                        <PopoverTrigger>
                          <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <div className="font-medium">Confidence: {score.confidence}</div>
                            {score.reasoning && (
                              <div className="text-sm text-gray-600">{score.reasoning}</div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spec Table with Evidence */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pricing" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
              <TabsTrigger value="reliability">Reliability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pricing" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-center">{tool1.name}</TableHead>
                    <TableHead className="text-center">{tool2.name}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Starting Price</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        $0.003/1K tokens
                        <Popover>
                          <PopoverTrigger>
                            <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="space-y-2">
                              <div className="font-medium">Source: Anthropic Docs</div>
                              <div className="text-sm text-gray-600">Observed 2 days ago</div>
                              <Link href="#" className="text-blue-600 text-sm flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                View source
                              </Link>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        $0.002/1K tokens
                        <Popover>
                          <PopoverTrigger>
                            <Info className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="space-y-2">
                              <div className="font-medium">Source: OpenAI Docs</div>
                              <div className="text-sm text-gray-600">Observed 1 day ago</div>
                              <Link href="#" className="text-blue-600 text-sm flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                View source
                              </Link>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Free Tier</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Yes
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Yes
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="technical" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-center">{tool1.name}</TableHead>
                    <TableHead className="text-center">{tool2.name}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Context Window</TableCell>
                    <TableCell className="text-center">200K tokens</TableCell>
                    <TableCell className="text-center">128K tokens</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SDKs</TableCell>
                    <TableCell className="text-center">Python, JavaScript</TableCell>
                    <TableCell className="text-center">Python, JavaScript, Go</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="community" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-center">{tool1.name}</TableHead>
                    <TableHead className="text-center">{tool2.name}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">GitHub Stars</TableCell>
                    <TableCell className="text-center">N/A</TableCell>
                    <TableCell className="text-center">45K</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Community Size</TableCell>
                    <TableCell className="text-center">Growing</TableCell>
                    <TableCell className="text-center">Large</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="docs" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-center">{tool1.name}</TableHead>
                    <TableHead className="text-center">{tool2.name}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Quickstart Examples</TableCell>
                    <TableCell className="text-center">12</TableCell>
                    <TableCell className="text-center">45</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">API Coverage</TableCell>
                    <TableCell className="text-center">85%</TableCell>
                    <TableCell className="text-center">92%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="reliability" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feature</TableHead>
                    <TableHead className="text-center">{tool1.name}</TableHead>
                    <TableHead className="text-center">{tool2.name}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Uptime</TableCell>
                    <TableCell className="text-center">99.9%</TableCell>
                    <TableCell className="text-center">99.95%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Incidents (30d)</TableCell>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell className="text-center">0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Change Log Ribbon */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              Updated 4 days ago
            </span>
            <span className="text-sm text-amber-700">
              — Pricing changed for {tool1.name}
            </span>
            <Button variant="ghost" size="sm" className="ml-auto text-amber-700 hover:text-amber-800">
              View changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

