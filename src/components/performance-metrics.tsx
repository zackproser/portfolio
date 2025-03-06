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

interface PerformanceMetricsProps {
  databases: Database[]
}

export default function PerformanceMetrics({ databases }: PerformanceMetricsProps) {
  // Prepare data for query latency chart
  const queryLatencyData = []
  for (let i = 1; i <= 10; i++) {
    const dataPoint = { vectorSize: i * 100 }
    databases.forEach((db) => {
      // Simulate latency data based on vector size
      // In a real app, this would come from actual benchmarks
      const baseLatency = db.performance.queryLatencyMs
      const randomFactor = 0.8 + Math.random() * 0.4 // Random factor between 0.8 and 1.2
      dataPoint[db.id] = Math.round(baseLatency * (1 + i * 0.1) * randomFactor)
    })
    queryLatencyData.push(dataPoint)
  }

  // Prepare data for radar chart
  const radarData = databases.map((db) => {
    return {
      name: db.name,
      querySpeed: normalizeValue(db.performance.queryLatencyMs, 50, 1, true),
      indexingSpeed: normalizeValue(db.performance.indexingSpeedVectorsPerSec, 10000, 100000),
      memoryEfficiency: normalizeValue(db.performance.memoryUsageMb, 500, 50, true),
      scalability: db.performance.scalabilityScore,
      accuracy: db.performance.accuracyScore,
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
            <LineChart data={queryLatencyData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="vectorSize"
                label={{ value: "Vector Size", position: "insideBottomRight", offset: -10 }}
              />
              <YAxis label={{ value: "Latency (ms)", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              {databases.map((db, index) => (
                <Line
                  key={db.id}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {databases.map((db, index) => (
                  <div key={db.id} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">{db.name}</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <RadarChart outerRadius={80} data={[radarData[index]]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        {["querySpeed", "indexingSpeed", "memoryEfficiency", "scalability", "accuracy"].map((key) => (
                          <Radar
                            key={key}
                            name={formatMetricName(key)}
                            dataKey={key}
                            stroke={getColorByIndex(index)}
                            fill={getColorByIndex(index)}
                            fillOpacity={0.6}
                          />
                        ))}
                        <Tooltip />
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