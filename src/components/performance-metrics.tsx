import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VectorBadge } from "@/components/ui/vector-badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface PerformanceMetricsProps {
  databases: Database[]
}

// Define a type for data points with dynamic string keys
interface DataPoint {
  vectorSize: number;
  [key: string]: number;
}

export default function PerformanceMetrics({ databases }: PerformanceMetricsProps) {
  if (!databases?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>Please select some databases to compare.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Default values for performance metrics
  const DEFAULT_QUERY_LATENCY = 25;
  const DEFAULT_INDEXING_SPEED = 50000;
  const DEFAULT_MEMORY_USAGE = 250;
  const DEFAULT_SCALABILITY = 70;
  const DEFAULT_ACCURACY = 85;

  // Simulate query latency data
  const queryLatencyData: DataPoint[] = [];

  for (let i = 1; i <= 10; i++) {
    const dataPoint: DataPoint = { vectorSize: i * 100 }
    databases.forEach((db) => {
      // Simulate latency data based on vector size
      // In a real app, this would come from actual benchmarks
      const baseLatency = db?.performance?.queryLatencyMs ?? DEFAULT_QUERY_LATENCY;
      const randomFactor = 0.8 + Math.random() * 0.4 // Random factor between 0.8 and 1.2
      dataPoint[db.id] = Math.round(baseLatency * (1 + i * 0.1) * randomFactor)
    })
    queryLatencyData.push(dataPoint)
  }

  // Prepare data for radar chart
  const radarData = databases.map((db) => {
    const perf = db?.performance || {};
    return {
      name: db.name,
      querySpeed: normalizeValue(perf.queryLatencyMs ?? DEFAULT_QUERY_LATENCY, 50, 1, true),
      indexingSpeed: normalizeValue(perf.indexingSpeedVectorsPerSec ?? DEFAULT_INDEXING_SPEED, 10000, 100000),
      memoryEfficiency: normalizeValue(perf.memoryUsageMb ?? DEFAULT_MEMORY_USAGE, 500, 50, true),
      scalability: perf.scalabilityScore ?? DEFAULT_SCALABILITY,
      accuracy: perf.accuracyScore ?? DEFAULT_ACCURACY,
    }
  })

  // Helper function to normalize values to a 0-100 scale
  function normalizeValue(value: number, min: number, max: number, inverse = false) {
    const normalized = ((value - min) / (max - min)) * 100
    return inverse ? 100 - normalized : normalized
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Query Latency Comparison</CardTitle>
          <CardDescription>Query latency (ms) as vector size increases</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart key="query-latency-chart" data={queryLatencyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid key="grid" strokeDasharray="3 3" />
              <XAxis
                key="x-axis"
                dataKey="vectorSize"
                label={{ value: "Vector Size", position: "insideBottomRight", offset: -10 }}
              />
              <YAxis key="y-axis" label={{ value: "Latency (ms)", angle: -90, position: "insideLeft" }} />
              <Tooltip key="tooltip" />
              <Legend key="legend" />
              {databases.map((db, index) => (
                <Line
                  key={`line-${db.id}`}
                  type="monotone"
                  dataKey={db.id}
                  name={db.name}
                  stroke={getColorByIndex(index)}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50">
          <CardTitle>Performance Features</CardTitle>
          <CardDescription>Comparing performance features across vector databases</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-white dark:bg-slate-900">
                  <TableHead className="w-[200px]">Feature</TableHead>
                  {databases.map((db) => (
                    <TableHead key={`header-${db.id}`}>{db.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell className="font-medium">Scalability</TableCell>
                  {databases.map((db) => (
                    <TableCell key={`scalability-${db.id}`} className="text-center">
                      <VectorBadge 
                        value={db.performance?.scalability} 
                        type="scalability" 
                      />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell className="font-medium">Latency</TableCell>
                  {databases.map((db) => (
                    <TableCell key={`latency-${db.id}`} className="text-center">
                      <VectorBadge 
                        value={db.performance?.latency} 
                        type="latency" 
                      />
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell className="font-medium">Throughput</TableCell>
                  {databases.map((db) => (
                    <TableCell key={`throughput-${db.id}`} className="text-center">
                      <VectorBadge 
                        value={db.performance?.throughput} 
                        type="throughput" 
                      />
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Radar</CardTitle>
          <CardDescription>Comparing key performance metrics (higher is better)</CardDescription>
        </CardHeader>
        <CardContent className="h-96">
          <Tabs defaultValue="radar">
            <TabsList className="mb-4">
              <TabsTrigger value="radar">Radar Chart</TabsTrigger>
              <TabsTrigger value="individual">Individual Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="radar">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart outerRadius={150} data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  {["querySpeed", "indexingSpeed", "memoryEfficiency", "scalability", "accuracy"].map((key, index) => (
                    <Radar
                      key={key}
                      name={formatMetricName(key)}
                      dataKey={key}
                      stroke={getColorByIndex(index)}
                      fill={getColorByIndex(index)}
                      fillOpacity={0.6}
                    />
                  ))}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="individual">
              <div key="individual-charts-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {databases.map((db, index) => (
                  <div key={`radar-chart-${db.id}`} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">{db.name}</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart key={`individual-radar-${db.id}`} outerRadius={80} data={[radarData[index]]}>
                        <PolarGrid key={`grid-${db.id}`} />
                        <PolarAngleAxis key={`angle-${db.id}`} dataKey="name" />
                        <PolarRadiusAxis key={`radius-${db.id}`} angle={30} domain={[0, 100]} />
                        {["querySpeed", "indexingSpeed", "memoryEfficiency", "scalability", "accuracy"].map((key) => (
                          <Radar
                            key={`${db.id}-${key}`}
                            name={formatMetricName(key)}
                            dataKey={key}
                            stroke={getColorByIndex(index)}
                            fill={getColorByIndex(index)}
                            fillOpacity={0.6}
                          />
                        ))}
                        <Tooltip key={`tooltip-${db.id}`} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function formatMetricName(key: string) {
  const formatted = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
  return formatted
}

function getColorByIndex(index: number) {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00c49f",
    "#ffbb28",
    "#ff8042",
    "#a4de6c",
    "#d0ed57",
  ]
  return colors[index % colors.length]
} 