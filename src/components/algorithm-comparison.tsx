import type { Database } from "@/types/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AlgorithmComparisonProps {
  databases: Database[]
}

export default function AlgorithmComparison({ databases }: AlgorithmComparisonProps) {
  if (!databases || databases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>Please select some databases to compare.</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Prepare data for algorithm comparison chart
  const algorithmPerformanceData = [
    {
      name: "Supported Algorithms",
      ...databases.reduce((acc, db) => ({ 
        ...acc, 
        [db.name]: db.algorithms ? Object.keys(db.algorithms).length : 0 
      }), {}),
    },
  ]

  const algorithmList = [
    { key: "hnsw", label: "HNSW (Hierarchical Navigable Small World)" },
    { key: "ivf", label: "IVF (Inverted File Index)" },
    { key: "lsh", label: "LSH (Locality-Sensitive Hashing)" },
    { key: "quantization", label: "Quantization" },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Supported Algorithms</CardTitle>
          <CardDescription>Vector indexing and search algorithms supported by each database</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow key="algorithm-comparison-header">
                <TableHead className="w-[250px]">Algorithm</TableHead>
                {databases.map((db, index) => (
                  <TableHead key={db.id || `db-${index}`}>{db.name}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {algorithmList.map((algo) => (
                <TableRow key={algo.key}>
                  <TableCell className="font-medium">
                    <div>
                      <span>{algo.label}</span>
                      {algo.key === "hnsw" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Graph-based algorithm with high recall and fast search
                        </p>
                      )}
                      {algo.key === "ivf" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Partitioning technique for faster search
                        </p>
                      )}
                      {algo.key === "lsh" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Hashing-based algorithm for approximate nearest neighbor search
                        </p>
                      )}
                      {algo.key === "quantization" && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Compression technique that reduces memory usage
                        </p>
                      )}
                    </div>
                  </TableCell>
                  {databases.map((db, index) => (
                    <TableCell key={`${db.id || `db-${index}`}-${algo.key}`}>
                      {db.algorithms && db.algorithms[algo.key] ? (
                        <Badge variant="default">Supported</Badge>
                      ) : (
                        <Badge variant="secondary">Not Supported</Badge>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Algorithm Support Overview</CardTitle>
          <CardDescription>Number of supported algorithms by database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={algorithmPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {databases.map((db, index) => (
                  <Bar key={db.id || index} dataKey={db.name} fill={getColorByIndex(index)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getColorByIndex(index: number): string {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]
  return colors[index % colors.length]
} 